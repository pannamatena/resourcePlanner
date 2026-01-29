# Resource Planner

A modern, interactive React application for managing team resources, allocating tasks, and visualizing project timelines.

## Features

* **Interactive Timeline**: Visual grid with support for Sprints (14-day cycles), Weekends, and **Bank Holidays** (US, UK, IE).
* **Team Management**: Add, edit, and remove team members with custom color themes (Purple, Blue, Green, Sky, Amber, Red, Gray).
* **Task Management**:
    * **Drag & Drop**: Move tasks between days or reassign to different team members.
    * **Resize**: Extend or shorten task duration by dragging the right edge of the task bar.
    * **Edit**: Click to update details, add Jira/Doc links, or delete tasks.
* **Data Persistence**:
    * Auto-saves to browser **LocalStorage**.
    * **Export** data to JSON for backups or sharing.
    * **Import** JSON files to restore data.
* **Responsive Layout**: Features a synchronized "Excel-style" layout with sticky headers and a sticky sidebar for easy navigation of large plans.

## Getting Started

### Prerequisites

* Node.js (v14 or higher)
* npm or yarn

### Installation

1.  Clone the repository or download the source code.
2.  Navigate to the client directory:
    ```bash
    cd resource-planner/client
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
    *(Note: If you encounter dependency conflicts with React 19, try `npm install --legacy-peer-deps`)*

### Running the App

Runs the app in development mode.
```bash
# Ensure you are in the client folder
cd client
npm start