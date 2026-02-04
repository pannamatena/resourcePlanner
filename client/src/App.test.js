import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock scrollIntoView because JSDOM doesn't support it
window.HTMLElement.prototype.scrollIntoView = function() {};

describe('App Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    // Restore mock timers
    jest.useRealTimers();
  });

  test('renders header and resource planner title', () => {
    render(<App />);
    const linkElement = screen.getByText(/Resource Planner/i);
    expect(linkElement).toBeTruthy();
  });

  test('opens Add Member modal when button is clicked', () => {
    render(<App />);
    const addBtn = screen.getByText('Add Member');
    fireEvent.click(addBtn);
    expect(screen.getByText('Add Team Member')).toBeTruthy();
  });

  test('can add a new team member via UI', () => {
    render(<App />);

    // 1. Open Modal
    const sidebarBtns = screen.getAllByText('Add Member');
    fireEvent.click(sidebarBtns[0]);

    // 2. Fill Form
    const inputs = screen.getAllByRole('textbox');
    const nameInput = inputs[0];
    const roleInput = inputs[1];

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(roleInput, { target: { value: 'Developer' } });

    // 3. Click Save
    const allAddBtns = screen.getAllByText('Add Member');
    const modalSaveBtn = allAddBtns[allAddBtns.length - 1];

    fireEvent.click(modalSaveBtn);

    // 4. Verify
    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getByText('Developer')).toBeTruthy();
  });

  test('can delete a team member', () => {
    window.confirm = jest.fn(() => true);
    render(<App />);

    expect(screen.getByText('Dan')).toBeTruthy();
    const deleteButtons = screen.getAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(screen.queryByText('Dan')).toBeNull();
  });

  test('toggles condensed view and adjusts UI accordingly', () => {
    // Set a fixed date to ensure the "Auth Service" task is visible
    jest.useFakeTimers().setSystemTime(new Date('2026-01-10'));

    render(<App />);

    const condensedBtn = screen.getByText('Condensed View');
    const taskTitle = screen.getByText('Auth Service');

    // Verify normal view
    expect(condensedBtn.textContent).toBe('Condensed View');
    expect(taskTitle).toBeVisible();
    // Check for day numbers (there will be multiple '9's in a quarter)
    expect(screen.queryAllByText('9').length).toBeGreaterThan(0);
    // Check for a sprint start date format
    expect(screen.getByText('Jan 8')).toBeInTheDocument();

    // Switch to condensed view
    fireEvent.click(condensedBtn);

    // Verify condensed view
    expect(condensedBtn.textContent).toBe('Normal View');
    expect(taskTitle).toBeVisible();
    // Day numbers should be hidden
    expect(screen.queryAllByText('9').length).toBe(0);
    // Sprint start date should still be visible, but now vertically
    const sprintDate = screen.getByText('Jan 8');
    expect(sprintDate).toBeVisible();
    expect(sprintDate).toHaveStyle('writing-mode: vertical-rl');
  });
});