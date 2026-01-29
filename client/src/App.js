/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { PlannerProvider, usePlanner } from './context/PlannerContext';
import { Header } from './components/Header/Header';
import { PlannerGrid } from './components/PlannerGrid';
import { TaskModal } from './components/Modals/TaskModal';
import { MemberModal } from './components/Modals/MemberModal';
import { getStorageIndexFromViewIndex, getDateStringFromStorageIndex } from './utils/dateUtils';
import * as S from './Style';

const PlannerApp = () => {
  // We consume the context here to get the 'viewRange' for new task calculations
  const { viewRange } = usePlanner();

  // --- UI STATE (Modals) ---
  const [modalState, setModalState] = useState({
    type: null, // 'task' | 'member' | null
    data: null  // the task or member object
  });

  const closeModal = () => setModalState({ type: null, data: null });

  // --- HANDLERS TO OPEN MODALS ---

  const handleEditMember = (member) => {
    setModalState({ type: 'member', data: member }); // Pass member object to edit
  };

  const handleAddMember = () => {
    setModalState({ type: 'member', data: null }); // Pass null to add
  };

  const handleEditTask = (task) => {
    setModalState({ type: 'task', data: task }); // Pass task object to edit
  };

  const handleAddTask = (resourceId, viewIndex) => {
    // 1. Calculate the start date based on where the user clicked
    const storageIdx = getStorageIndexFromViewIndex(viewRange.start, viewIndex);

    // 2. Create a temporary "New Task" object
    // We add a flag `_isNew` so the modal knows to call `addTask` instead of `updateTask`
    const newTaskDraft = {
      id: Date.now(),
      resourceId,
      title: 'New Task',
      startIdx: storageIdx,
      duration: 5,
      url: '',
      _isNew: true
    };

    setModalState({ type: 'task', data: newTaskDraft });
  };

  return (
    <S.Container>
      <Header />

      <PlannerGrid
        onEditMember={handleEditMember}
        onAddMember={handleAddMember}
        onEditTask={handleEditTask}
        onAddTask={handleAddTask}
      />

      {/* Conditionally Render Modals */}
      {modalState.type === 'member' && (
        <MemberModal
          member={modalState.data}
          onClose={closeModal}
        />
      )}

      {modalState.type === 'task' && (
        <TaskModal
          task={modalState.data}
          onClose={closeModal}
        />
      )}

    </S.Container>
  );
};

// Wrap the App in the Provider
const App = () => (
  <PlannerProvider>
    <PlannerApp />
  </PlannerProvider>
);

export default App;