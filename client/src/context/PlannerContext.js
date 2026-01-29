// src/context/PlannerContext.js
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_TEAM, INITIAL_TASKS } from '../utils/constants';
import { getCurrentQuarter, generateDateRange } from '../utils/dateUtils';

const PlannerContext = createContext();

export const PlannerProvider = ({ children }) => {
  // --- View State ---
  const [viewRange, setViewRange] = useState(getCurrentQuarter());

  // Memoized date generation
  const { dates, totalDays } = useMemo(() =>
      generateDateRange(viewRange.start, viewRange.end),
    [viewRange]
  );

  // --- Data State (with Persistence) ---
  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem('planner_team');
    return saved ? JSON.parse(saved) : INITIAL_TEAM;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('planner_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  // Persistence Effects
  useEffect(() => { localStorage.setItem('planner_team', JSON.stringify(team)); }, [team]);
  useEffect(() => { localStorage.setItem('planner_tasks', JSON.stringify(tasks)); }, [tasks]);

  // --- Actions ---

  const addMember = (newMember) => {
    setTeam(prev => [...prev, newMember]);
  };

  const updateMember = (updatedMember) => {
    setTeam(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  const deleteMember = (id) => {
    setTeam(prev => prev.filter(m => m.id !== id));
    setTasks(prev => prev.filter(t => t.resourceId !== id)); // Cascade delete
  };

  const addTask = (newTask) => {
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const importData = (importedTeam, importedTasks) => {
    setTeam(importedTeam);
    setTasks(importedTasks);
  };

  const value = {
    // State
    viewRange,
    dates,
    totalDays,
    team,
    tasks,
    // Setters
    setViewRange,
    // Actions
    actions: {
      addMember,
      updateMember,
      deleteMember,
      addTask,
      updateTask,
      deleteTask,
      importData
    }
  };

  return (
    <PlannerContext.Provider value={value}>
      {children}
    </PlannerContext.Provider>
  );
};

// Custom Hook for easy access
export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};