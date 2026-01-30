import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock scrollIntoView because JSDOM doesn't support it
window.HTMLElement.prototype.scrollIntoView = function() {};

describe('App Integration', () => {
  beforeEach(() => {
    localStorage.clear();
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
    // We use getAllByText to handle cases where multiple might exist,
    // but initially, the sidebar button is usually the first/only one.
    const sidebarBtns = screen.getAllByText('Add Member');
    fireEvent.click(sidebarBtns[0]);

    // 2. Fill Form
    const inputs = screen.getAllByRole('textbox');
    const nameInput = inputs[0]; // Name is first input
    const roleInput = inputs[1]; // Role is second input

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(roleInput, { target: { value: 'Developer' } });

    // 3. Click Save
    // Now that the modal is open, there are TWO "Add Member" buttons.
    // The Sidebar button is index 0. The Modal button is index 1 (rendered last).
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

    // Ensure Dan exists (from initial data)
    expect(screen.getByText('Dan')).toBeTruthy();

    // Find all delete buttons in the sidebar
    // We select the last button in the .actions div
    const deleteButtons = document.querySelectorAll('.actions button:last-child');

    // Click the first one (Dan's row)
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();

    // Verify Dan is gone (queryByText returns null if not found)
    expect(screen.queryByText('Dan')).toBeNull();
  });
});