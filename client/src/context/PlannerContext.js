// src/context/PlannerContext.js
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_TEAM, INITIAL_TASKS } from '../utils/constants';
import { getCurrentQuarter, generateDateRange } from '../utils/dateUtils';

const PlannerContext = createContext();

export const PlannerProvider = ({ children }) => {
  const [viewRange, setViewRange] = useState(getCurrentQuarter());
  const [isCondensed, setIsCondensed] = useState(false);

  // --- NEW: Track "Today" automatically ---
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    // Check for date change every minute
    const timer = setInterval(() => {
      setToday(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const { dates, totalDays } = useMemo(() =>
      generateDateRange(viewRange.start, viewRange.end),
    [viewRange]
  );

  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem('planner_team');
    return saved ? JSON.parse(saved) : INITIAL_TEAM;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('planner_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  useEffect(() => { localStorage.setItem('planner_team', JSON.stringify(team)); }, [team]);
  useEffect(() => { localStorage.setItem('planner_tasks', JSON.stringify(tasks)); }, [tasks]);

  // Actions
  const addMember = (newMember) => setTeam(prev => [...prev, newMember]);

  // --- FIXED: Merge updates instead of replacing ---
  const updateMember = (updatedMember) => {
    setTeam(prev => prev.map(m => m.id === updatedMember.id ? { ...m, ...updatedMember } : m));
  };

  const deleteMember = (id) => {
    setTeam(prev => prev.filter(m => m.id !== id));
    setTasks(prev => prev.filter(t => t.resourceId !== id));
  };

  const moveMember = (id, direction) => {
    setTeam(prev => {
      const index = prev.findIndex(m => m.id === id);
      if (index < 0) return prev;

      // Prevent moving out of bounds
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;

      const newTeam = [...prev];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;

      // Swap elements
      [newTeam[index], newTeam[swapIndex]] = [newTeam[swapIndex], newTeam[index]];

      return newTeam;
    });
  };

  const addTask = (newTask) => setTasks(prev => [...prev, newTask]);

  // --- FIXED: Merge updates instead of replacing ---
  const updateTask = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? { ...t, ...updatedTask } : t));
  };

  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  const importData = (importedTeam, importedTasks) => {
    setTeam(importedTeam);
    setTasks(importedTasks);
  };

  const toggleCondensedView = () => setIsCondensed(prev => !prev);

  const value = {
    viewRange,
    dates,
    totalDays,
    team,
    tasks,
    today,
    isCondensed,
    setViewRange,
    actions: { addMember, updateMember, deleteMember, moveMember, addTask, updateTask, deleteTask, importData, toggleCondensedView }
  };

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) throw new Error('usePlanner must be used within a PlannerProvider');
  return context;
};