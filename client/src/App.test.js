import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
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
    expect(linkElement).toBeInTheDocument();
  });

  test('opens Add Member modal when button is clicked', () => {
    render(<App />);

    // Find the button (there might be multiple icons, look for text)
    const addBtn = screen.getByText('Add Member');
    fireEvent.click(addBtn);

    // Check if modal header appears
    expect(screen.getByText('Add Team Member')).toBeInTheDocument();
  });

  test('can add a new team member via UI', () => {
    render(<App />);

    // 1. Open Modal
    fireEvent.click(screen.getByText('Add Member'));

    // 2. Fill Form
    const nameInput = screen.getByDisplayValue(''); // Empty input
    const roleInput = screen.getAllByRole('textbox')[1]; // Assume second input is role

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(roleInput, { target: { value: 'Developer' } });

    // 3. Click Save (Primary Button)
    const saveBtn = screen.getByText('Add Member', { selector: 'button' }); // The button inside modal
    fireEvent.click(saveBtn);

    // 4. Verify John Doe appears in sidebar
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
  });

  test('can delete a team member', () => {
    // Mock window.confirm
    window.confirm = jest.fn(() => true);

    render(<App />);

    // Find the first member (Dan from defaults)
    const danElement = screen.getByText('Dan');
    expect(danElement).toBeInTheDocument();

    // Find the Delete button associated with this row.
    // In our styled components, it's a bit tricky to select by icon alone.
    // We will look for the trash icon within the sidebar.
    // Note: This relies on the fact that 'Dan' is the first item.

    const deleteButtons = document.querySelectorAll('.actions button:last-child');
    // Click the first delete button
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    // Verify Dan is gone
    expect(screen.queryByText('Dan')).not.toBeInTheDocument();
  });
});