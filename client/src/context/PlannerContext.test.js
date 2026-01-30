import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { PlannerProvider, usePlanner } from './PlannerContext';

// Helper Component to expose Context internals to the test runner
const TestComponent = () => {
  const { tasks, actions } = usePlanner();

  // Safe check for task existence
  const firstTask = tasks.find(t => t.id === 999);

  return (
    <div>
      <div data-testid="task-count">{tasks.length}</div>
      <div data-testid="task-title">{firstTask ? firstTask.title : 'No Task'}</div>
      <div data-testid="task-start">{firstTask ? firstTask.startIdx : 'No Start'}</div>

      {/* Button to add a known task for testing */}
      <button
        onClick={() => actions.addTask({ id: 999, title: 'Original Title', startIdx: 10, duration: 5 })}
      >
        Add Test Task
      </button>

      {/* Button to simulate a drag (only updates startIdx) */}
      <button
        onClick={() => actions.updateTask({ id: 999, startIdx: 99 })}
      >
        Move Test Task
      </button>
    </div>
  );
};

describe('PlannerContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('initializes correctly', () => {
    render(
      <PlannerProvider>
        <TestComponent />
      </PlannerProvider>
    );
    // Should render without crashing
    expect(screen.getByTestId('task-count')).toBeTruthy();
  });

  test('updateTask merges data instead of replacing it', () => {
    render(
      <PlannerProvider>
        <TestComponent />
      </PlannerProvider>
    );

    // 1. Add the Test Task
    act(() => {
      screen.getByText('Add Test Task').click();
    });

    // Verify it was added
    expect(screen.getByTestId('task-title')).toHaveTextContent('Original Title');
    expect(screen.getByTestId('task-start')).toHaveTextContent('10');

    // 2. Perform Partial Update (Simulate Drag)
    // We click the button which calls updateTask({ id: 999, startIdx: 99 })
    // It does NOT pass the title.
    act(() => {
      screen.getByText('Move Test Task').click();
    });

    // 3. Verify Updates
    // Start Index should change
    expect(screen.getByTestId('task-start')).toHaveTextContent('99');

    // Title should REMAIN (This confirms the merge logic works)
    expect(screen.getByTestId('task-title')).toHaveTextContent('Original Title');
  });
});