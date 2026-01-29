import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { PlannerProvider, usePlanner } from './PlannerContext';
import { INITIAL_TEAM } from '../utils/constants';

// Test Consumer Component to access Context internals
const TestComponent = () => {
  const { team, tasks, actions } = usePlanner();
  return (
    <div>
      <div data-testid="team-count">{team.length}</div>
      <div data-testid="task-count">{tasks.length}</div>
      <button onClick={() => actions.addMember({ id: 999, name: 'Test User' })}>Add Member</button>
      <button onClick={() => actions.deleteMember(999)}>Delete Member</button>
      <button onClick={() => actions.addTask({ id: 100, title: 'New Task' })}>Add Task</button>
    </div>
  );
};

describe('PlannerContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('initializes with default data', () => {
    render(
      <PlannerProvider>
        <TestComponent />
      </PlannerProvider>
    );
    expect(screen.getByTestId('team-count')).toHaveTextContent(INITIAL_TEAM.length.toString());
  });

  test('can add a team member', () => {
    render(
      <PlannerProvider>
        <TestComponent />
      </PlannerProvider>
    );

    const btn = screen.getByText('Add Member');
    act(() => {
      btn.click();
    });

    // Initial length + 1
    expect(screen.getByTestId('team-count')).toHaveTextContent((INITIAL_TEAM.length + 1).toString());
  });

  test('can add a task', () => {
    render(
      <PlannerProvider>
        <TestComponent />
      </PlannerProvider>
    );

    const btn = screen.getByText('Add Task');
    act(() => {
      btn.click();
    });

    // Initial tasks (1) + 1 = 2
    expect(screen.getByTestId('task-count')).toHaveTextContent('2');
  });
});