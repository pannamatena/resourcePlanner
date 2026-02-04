import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskModal } from './TaskModal';
import { getDateStringFromStorageIndex } from '../../utils/dateUtils';

// Mock the context
const mockActions = {
  updateTask: jest.fn(),
  addTask: jest.fn(),
  deleteTask: jest.fn(),
};

// Mock PlannerContext
jest.mock('../../context/PlannerContext', () => ({
  usePlanner: () => ({
    actions: mockActions,
  }),
}));

describe('TaskModal Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Save calculates inclusive duration (Start=End implies 1 day)', () => {
    // We need real dates for the form inputs to work, so we calculate them dynamically
    // based on whatever your project's ANCHOR_DATE is.
    const startStr = getDateStringFromStorageIndex(0); // Index 0

    const task = { id: 1, title: 'Test', startIdx: 0, duration: 1 };
    render(<TaskModal task={task} onClose={() => {}} />);

    const startInput = screen.getByLabelText('Start Date');
    const endInput = screen.getByLabelText('End Date');

    // Set Start and End to the SAME day
    fireEvent.change(startInput, { target: { value: startStr } });
    fireEvent.change(endInput, { target: { value: startStr } });

    fireEvent.click(screen.getByText('Save Changes'));

    expect(mockActions.updateTask).toHaveBeenCalledWith(expect.objectContaining({
      duration: 1
    }));
  });

  test('Displays correct end date (Duration 5 ends on Day 5, not Day 6)', () => {
    // Logic Check:
    // If Start is Index 0 and Duration is 5, the task covers indices: 0, 1, 2, 3, 4.
    // The End Date should be Index 4.
    const expectedEndDate = getDateStringFromStorageIndex(4);

    const task = { id: 1, title: 'Test', startIdx: 0, duration: 5 };

    render(<TaskModal task={task} onClose={() => {}} />);

    const endInput = screen.getByLabelText('End Date');

    // Compare the input value to the calculated date string
    expect(endInput.value).toBe(expectedEndDate);
  });

  test('Checking OOO checkbox updates title field in real-time', () => {
    const task = { id: 1, title: 'Original Title', startIdx: 0, duration: 1 };
    render(<TaskModal task={task} onClose={() => {}} />);

    const titleInput = screen.getByLabelText('Task Title');
    const oooCheckbox = screen.getByLabelText(/Mark as Out of Office/i);

    // 1. Check the box
    fireEvent.click(oooCheckbox);
    expect(titleInput.value).toBe('OOO');

    // 2. Uncheck the box
    fireEvent.click(oooCheckbox);
    expect(titleInput.value).toBe('');
  });

  test('Selecting Out of Office saves the isOOO flag and auto-fills title', () => {
    const task = { id: 1, title: '', startIdx: 0, duration: 1 };

    render(<TaskModal task={task} onClose={() => {}} />);

    // Find and click the checkbox
    const oooCheckbox = screen.getByLabelText(/Mark as Out of Office/i);
    fireEvent.click(oooCheckbox);

    // Save
    fireEvent.click(screen.getByText('Save Changes'));

    // Verify 'isOOO' is true AND title became 'OOO'
    expect(mockActions.updateTask).toHaveBeenCalledWith(expect.objectContaining({
      isOOO: true,
      title: 'OOO'
    }));
  });

  test('Duplicate creates a copy starting immediately after the original', () => {
    // Setup: Task starts at Index 0 (Jan 1) with Duration 5.
    // It occupies Jan 1, 2, 3, 4, 5.
    // The duplicate should start on Jan 6 (Index 5).
    const task = { id: 1, title: 'Original', startIdx: 0, duration: 5, _isNew: false };

    render(<TaskModal task={task} onClose={() => {}} />);

    // Click Duplicate
    const duplicateBtn = screen.getByText('Duplicate');
    fireEvent.click(duplicateBtn);

    // Verify 'addTask' was called
    expect(mockActions.addTask).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Original (Copy)', // Optional: Check for label if you added it
      startIdx: 5,              // Crucial: 0 + 5 = 5
      duration: 5,              // Same duration
      id: expect.any(Number)    // New ID generated
    }));
  });

  test('Duplicate preserves OOO status and URL', () => {
    const task = {
      id: 1,
      title: 'OOO',
      startIdx: 10,
      duration: 1,
      isOOO: true,
      url: 'http://docs.com',
      _isNew: false
    };

    render(<TaskModal task={task} onClose={() => {}} />);

    fireEvent.click(screen.getByText('Duplicate'));

    expect(mockActions.addTask).toHaveBeenCalledWith(expect.objectContaining({
      isOOO: true,
      url: 'http://docs.com'
    }));
  });

  test('Duplicate button is hidden for new tasks', () => {
    // Setup: Creating a NEW task
    const task = { id: 1, title: '', startIdx: 0, duration: 1, _isNew: true };

    render(<TaskModal task={task} onClose={() => {}} />);

    // Query for the button - it should NOT exist
    const duplicateBtn = screen.queryByText('Duplicate');
    expect(duplicateBtn).toBeNull();
  });
});