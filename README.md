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
```

###Project Architecture
The application has been refactored from a single file into a scalable, domain-driven structure:

`client/src/`
```plaintext
├── components/
│   ├── Header/          # Controls for Date Range, Import/Export, and Legend
│   ├── Modals/          # Forms for Adding/Editing Tasks and Members
│   ├── Sidebar/         # Sticky left column listing team members
│   ├── Timeline/        # The interactive grid (Rows, Cells, Headers)
│   └── PlannerGrid.js   # Main layout combining Sidebar and Timeline
├── context/
│   └── PlannerContext.js # Global state (Tasks, Team, ViewRange) and Actions
├── hooks/
│   └── useTaskDrag.js    # Complex logic for Drag-and-Drop and Resizing
├── utils/
│   ├── dateUtils.js      # Date math, Sprint calculation, Index conversion
│   └── constants.js      # Static data (Holidays, Color Themes, Defaults)
├── Style.js              # Global Styled Components (Emotion)
└── App.js                # Application Entry Point
```

###Key Decisions
**Context API:** Used for global state management to avoid "prop drilling" and make actions (addTask, deleteMember) accessible anywhere.

**Custom Hooks:** The Drag-and-Drop logic (useTaskDrag) is isolated from the UI components to keep the rendering logic clean and performant.

**CSS Grid:** The main layout uses CSS Grid to ensure the Sidebar and Timeline rows stay perfectly aligned, even when scrolling vertically.

**Sticky Positioning:** The Timeline Header and Sidebar Column use position: sticky to remain visible while scrolling through large date ranges.

###Technologies Used
React 19: Core framework.

Emotion: CSS-in-JS for styling.

Lucide React: Icon set.

Jest & React Testing Library: For Unit and Integration testing.