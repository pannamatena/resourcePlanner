/** @jsxImportSource @emotion/react */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link as LinkIcon, X, Calendar, RotateCcw, ExternalLink, Plus, Trash2, Pencil } from 'lucide-react'; // Added Pencil
import * as S from './Style';

// --- Helpers ---
const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getDateStringFromIndex = (startDate, index) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + index);
  return date.toISOString().split('T')[0];
};

const getIndexFromDateString = (startDate, dateString) => {
  const target = new Date(dateString);
  const start = new Date(startDate);
  target.setHours(0,0,0,0);
  start.setHours(0,0,0,0);
  const diffTime = target - start;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const generateQuarterDates = () => {
  const dates = [];
  const anchorDate = new Date('2026-02-05T00:00:00');
  const startDate = new Date(anchorDate);
  startDate.setDate(anchorDate.getDate() - 14);
  for (let i = 0; i < S.TOTAL_DAYS; i++) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);
    dates.push(current);
  }
  return { dates, startDate, anchorDate };
};

// --- DATA ---
const COLOR_THEMES = [
  { name: 'Blue',    main: '#0284c7', bg: '#e0f2fe' },
  { name: 'Cyan',    main: '#0891b2', bg: '#cffafe' },
  { name: 'Violet',  main: '#7c3aed', bg: '#ede9fe' },
  { name: 'Indigo',  main: '#4f46e5', bg: '#e0e7ff' },
  { name: 'Pink',    main: '#db2777', bg: '#fce7f3' },
  { name: 'Emerald', main: '#059669', bg: '#d1fae5' },
  { name: 'Orange',  main: '#ea580c', bg: '#ffedd5' },
  { name: 'Slate',   main: '#475569', bg: '#f1f5f9' },
];

const INITIAL_TEAM = [
  { id: 1, name: 'Dan', role: 'Frontend', color: COLOR_THEMES[0] },
  { id: 2, name: 'Amit', role: 'Frontend', color: COLOR_THEMES[1] },
  { id: 3, name: 'Aisling', role: 'Backend', color: COLOR_THEMES[2] },
  { id: 4, name: 'Alain', role: 'Backend', color: COLOR_THEMES[3] },
  { id: 5, name: 'JB', role: 'Backend', color: COLOR_THEMES[4] },
  { id: 6, name: 'Craig', role: 'QA',      color: COLOR_THEMES[5] },
];

const INITIAL_TASKS = [
  { id: 101, resourceId: 1, title: 'Auth Service', startIdx: 0, duration: 10, url: '' },
  { id: 102, resourceId: 3, title: 'API Gateway', startIdx: 14, duration: 10, url: '' },
  { id: 103, resourceId: 6, title: 'Regression Testing', startIdx: 16, duration: 5, url: '' },
];

const App = () => {
  const { dates, startDate, anchorDate } = useMemo(() => generateQuarterDates(), []);

  // --- STATE ---
  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem('planner_team');
    return saved ? JSON.parse(saved) : INITIAL_TEAM;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('planner_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  // Persistence
  useEffect(() => { localStorage.setItem('planner_team', JSON.stringify(team)); }, [team]);
  useEffect(() => { localStorage.setItem('planner_tasks', JSON.stringify(tasks)); }, [tasks]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false); // Task Modal
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false); // Member Modal

  const [editingTask, setEditingTask] = useState(null);

  // Member Form State: 'id' is null if adding, set if editing
  const [memberForm, setMemberForm] = useState({ id: null, name: '', role: '', colorIdx: 0 });

  const [resizingTask, setResizingTask] = useState(null);
  const isResizingRef = useRef(false);

  // --- HANDLERS: Reset ---
  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all data (Tasks & Team)?")) {
      setTeam(INITIAL_TEAM);
      setTasks(INITIAL_TASKS);
      localStorage.removeItem('planner_team');
      localStorage.removeItem('planner_tasks');
    }
  };

  const getSprintInfo = (date) => {
    const diffTime = date.getTime() - anchorDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isSprintStart = diffDays % 14 === 0;
    let label = null;
    if (isSprintStart) {
      const sprintNum = Math.floor(diffDays / 14) + 1;
      label = diffDays < 0 ? `Sprint 0` : `Sprint ${sprintNum}`;
    }
    return { isSprintStart, label };
  };

  // --- HANDLERS: Members (Add & Edit) ---

  const openMemberModal = (member = null) => {
    if (member) {
      // EDIT MODE: Find color index
      const colorIdx = COLOR_THEMES.findIndex(c => c.main === member.color.main);
      setMemberForm({
        id: member.id,
        name: member.name,
        role: member.role,
        colorIdx: colorIdx >= 0 ? colorIdx : 0
      });
    } else {
      // ADD MODE
      setMemberForm({ id: null, name: '', role: '', colorIdx: 0 });
    }
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = () => {
    if (!memberForm.name) return alert("Name is required");

    const newColor = COLOR_THEMES[memberForm.colorIdx];

    if (memberForm.id) {
      // EDIT EXISTING
      setTeam(prev => prev.map(m =>
        m.id === memberForm.id
          ? { ...m, name: memberForm.name, role: memberForm.role, color: newColor }
          : m
      ));
    } else {
      // ADD NEW
      const newMember = {
        id: Date.now(),
        name: memberForm.name,
        role: memberForm.role || 'Contributor',
        color: newColor
      };
      setTeam([...team, newMember]);
    }

    setIsMemberModalOpen(false);
  };

  const handleDeleteMember = (id) => {
    if (window.confirm("Delete this member? All their assigned tasks will also be removed.")) {
      setTeam(prev => prev.filter(m => m.id !== id));
      setTasks(prev => prev.filter(t => t.resourceId !== id)); // Cleanup tasks
    }
  };

  // --- HANDLERS: Tasks ---

  const handleAddTask = (resourceId, dayIndex) => {
    if (isResizingRef.current) return;
    const startStr = getDateStringFromIndex(startDate, dayIndex);
    const endStr = getDateStringFromIndex(startDate, dayIndex + 5);
    setEditingTask({ id: Date.now(), resourceId, title: 'New Task', startStr, endStr, url: '' });
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    if (isResizingRef.current) return;
    const startStr = getDateStringFromIndex(startDate, task.startIdx);
    const endStr = getDateStringFromIndex(startDate, task.startIdx + task.duration);
    setEditingTask({ ...task, startStr, endStr });
    setIsModalOpen(true);
  };

  const saveTask = () => {
    const newStartIdx = getIndexFromDateString(startDate, editingTask.startStr);
    const newEndIdx = getIndexFromDateString(startDate, editingTask.endStr);
    const newDuration = newEndIdx - newStartIdx;

    if (newDuration <= 0) return alert("End date must be after start date");

    const taskToSave = { ...editingTask, startIdx: newStartIdx, duration: newDuration };
    setTasks(prev => {
      const exists = prev.find(t => t.id === taskToSave.id);
      return exists ? prev.map(t => t.id === taskToSave.id ? taskToSave : t) : [...prev, taskToSave];
    });
    setIsModalOpen(false);
  };

  const deleteTask = () => {
    setTasks(prev => prev.filter(t => t.id !== editingTask.id));
    setIsModalOpen(false);
  };

  // --- HANDLERS: Drag & Resize (Unchanged) ---
  const onDragStart = (e, task) => {
    if (isResizingRef.current) { e.preventDefault(); return; }
    e.dataTransfer.setData('taskId', task.id);
    const rect = e.target.getBoundingClientRect();
    const dayOffset = Math.floor((e.clientX - rect.left) / S.DAY_WIDTH);
    e.dataTransfer.setData('dayOffset', dayOffset);
  };
  const onDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const onDropRow = (e, memberId) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    if (!taskId) return;
    const dayOffset = parseInt(e.dataTransfer.getData('dayOffset'));
    const rowRect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rowRect.left;
    let dropIndex = Math.floor(clickX / S.DAY_WIDTH);
    let newStartIdx = dropIndex - dayOffset;
    if (newStartIdx < 0) newStartIdx = 0;
    if (newStartIdx > S.TOTAL_DAYS - 1) newStartIdx = S.TOTAL_DAYS - 1;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, resourceId: memberId, startIdx: newStartIdx } : t));
  };
  const handleResizeStart = (e, task) => {
    e.stopPropagation(); e.preventDefault();
    isResizingRef.current = true;
    setResizingTask({ id: task.id, initialX: e.clientX, initialDuration: task.duration });
  };
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!resizingTask) return;
      const deltaPixels = e.clientX - resizingTask.initialX;
      const deltaDays = Math.round(deltaPixels / S.DAY_WIDTH);
      let newDuration = resizingTask.initialDuration + deltaDays;
      if (newDuration < 1) newDuration = 1;
      setTasks(prev => prev.map(t => t.id === resizingTask.id ? { ...t, duration: newDuration } : t));
    };
    const handleGlobalMouseUp = () => {
      if (resizingTask) {
        setResizingTask(null);
        setTimeout(() => { isResizingRef.current = false; }, 100);
      }
    };
    if (resizingTask) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [resizingTask]);

  return (
    <S.Container>
      <S.Header>
        <div>
          <S.Title><Calendar size={24} /> Quarterly Resource Planner</S.Title>
          <S.Subtitle>Drag bar to move • Drag edge to resize</S.Subtitle>
        </div>
        <button onClick={handleResetData} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', color: '#64748b', cursor: 'pointer', fontSize: '0.875rem' }}>
          <RotateCcw size={16} /> Reset Data
        </button>
      </S.Header>

      <S.PlannerLayout>
        <S.Sidebar>
          <S.SidebarRow isHeader>Team Member</S.SidebarRow>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {team.map(member => (
              <S.SidebarRow key={member.id}>
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => openMemberModal(member)}>
                  <S.Avatar color={member.color}>{member.name.charAt(0)}</S.Avatar>
                  <div style={{ lineHeight: 1.2 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{member.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{member.role}</div>
                  </div>
                </div>

                {/* Edit & Delete Buttons */}
                <S.ActionBtnGroup className="actions">
                  <S.ActionBtn hoverBg="#e0e7ff" hoverColor="#4f46e5" onClick={() => openMemberModal(member)}>
                    <Pencil size={14} />
                  </S.ActionBtn>
                  <S.ActionBtn hoverBg="#fee2e2" hoverColor="#ef4444" onClick={() => handleDeleteMember(member.id)}>
                    <Trash2 size={14} />
                  </S.ActionBtn>
                </S.ActionBtnGroup>

              </S.SidebarRow>
            ))}
          </div>
          {/* Add Member Button */}
          <S.AddMemberBtn onClick={() => openMemberModal(null)}>
            <Plus size={16} /> Add Member
          </S.AddMemberBtn>
        </S.Sidebar>

        {/* Timeline View */}
        <S.TimelineScrollArea>
          <S.TimelineContent>
            <S.TimelineHeader>
              {dates.map((date, index) => {
                const { isSprintStart, label } = getSprintInfo(date);
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                return (
                  <S.DayHeaderCell key={index} isSprintStart={isSprintStart} sprintLabel={label} isWeekend={isWeekend}>
                    <span>{isSprintStart ? formatDate(date) : date.getDate()}</span>
                  </S.DayHeaderCell>
                );
              })}
            </S.TimelineHeader>

            {team.map(member => (
              <S.TimelineRow key={member.id} onDragOver={onDragOver} onDrop={(e) => onDropRow(e, member.id)}>
                {dates.map((date, index) => {
                  const { isSprintStart } = getSprintInfo(date);
                  return (
                    <S.GridCell key={index} isSprintStart={isSprintStart} onClick={() => handleAddTask(member.id, index)} />
                  );
                })}
                {tasks.filter(t => t.resourceId === member.id).map(task => (
                  <S.TaskBar key={task.id} startIndex={task.startIdx} duration={task.duration} color={member.color} onClick={(e) => { e.stopPropagation(); handleEditTask(task); }} draggable onDragStart={(e) => onDragStart(e, task)}>
                    <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
                    {task.url && <LinkIcon size={12} style={{ marginLeft: 4, opacity: 0.5 }} />}
                    <S.ResizeHandle onMouseDown={(e) => handleResizeStart(e, task)} />
                  </S.TaskBar>
                ))}
              </S.TimelineRow>
            ))}
          </S.TimelineContent>
        </S.TimelineScrollArea>
      </S.PlannerLayout>

      {/* --- MEMBER MODAL (Shared Add/Edit) --- */}
      {isMemberModalOpen && (
        <S.ModalOverlay onClick={() => setIsMemberModalOpen(false)}>
          <S.ModalContent onClick={e => e.stopPropagation()}>
            <S.ModalHeader>
              <h3>{memberForm.id ? 'Edit Member' : 'Add Team Member'}</h3>
              <button onClick={() => setIsMemberModalOpen(false)}><X size={20} /></button>
            </S.ModalHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <S.InputGroup>
                <label>Name</label>
                <input type="text" placeholder="e.g. Sarah" value={memberForm.name} onChange={(e) => setMemberForm({...memberForm, name: e.target.value})} />
              </S.InputGroup>
              <S.InputGroup>
                <label>Role</label>
                <input type="text" placeholder="e.g. Frontend" value={memberForm.role} onChange={(e) => setMemberForm({...memberForm, role: e.target.value})} />
              </S.InputGroup>
              <S.InputGroup>
                <label>Color Theme</label>
                <S.ColorSwatchContainer>
                  {COLOR_THEMES.map((theme, idx) => (
                    <S.ColorSwatch
                      key={idx}
                      color={theme.main}
                      isSelected={memberForm.colorIdx === idx}
                      onClick={() => setMemberForm({...memberForm, colorIdx: idx})}
                      title={theme.name}
                    />
                  ))}
                </S.ColorSwatchContainer>
              </S.InputGroup>
              <S.ButtonRow>
                <div />
                <S.Button variant="primary" onClick={handleSaveMember}>
                  {memberForm.id ? 'Save Changes' : 'Add Member'}
                </S.Button>
              </S.ButtonRow>
            </div>
          </S.ModalContent>
        </S.ModalOverlay>
      )}

      {/* --- TASK MODAL (Unchanged) --- */}
      {isModalOpen && editingTask && (
        <S.ModalOverlay onClick={() => setIsModalOpen(false)}>
          <S.ModalContent onClick={e => e.stopPropagation()}>
            <S.ModalHeader>
              <h3>Manage Allocation</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </S.ModalHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <S.InputGroup>
                <label>Task Title</label>
                <input type="text" value={editingTask.title} onChange={(e) => setEditingTask({...editingTask, title: e.target.value})} />
              </S.InputGroup>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <S.InputGroup>
                  <label>Start Date</label>
                  <input type="date" value={editingTask.startStr} onChange={(e) => setEditingTask({...editingTask, startStr: e.target.value})} />
                </S.InputGroup>
                <S.InputGroup>
                  <label>End Date</label>
                  <input type="date" value={editingTask.endStr} onChange={(e) => setEditingTask({...editingTask, endStr: e.target.value})} />
                </S.InputGroup>
              </div>
              <S.InputGroup>
                <label>Jira/Doc URL</label>
                <div style={{ display: 'flex' }}>
                  <span style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRight: 0, borderRadius: '4px 0 0 4px', padding: '8px', display: 'flex', alignItems: 'center' }}>
                    <LinkIcon size={16} color="#64748b"/>
                  </span>
                  <input type="text" placeholder="https://..." value={editingTask.url} onChange={(e) => setEditingTask({...editingTask, url: e.target.value})} style={{ borderRadius: '0 4px 4px 0', width: '100%' }} />
                </div>
              </S.InputGroup>
              {editingTask.url && (
                <div style={{ marginTop: '-12px', marginBottom: '8px', textAlign: 'right' }}>
                  <a href={editingTask.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: '#4f46e5', textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', backgroundColor: '#eef2ff', borderRadius: '4px' }}>
                    Open Link <ExternalLink size={12} />
                  </a>
                </div>
              )}
              <S.ButtonRow>
                <S.Button variant="danger" onClick={deleteTask}>Delete</S.Button>
                <S.Button variant="primary" onClick={saveTask}>Save Changes</S.Button>
              </S.ButtonRow>
            </div>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </S.Container>
  );
};

export default App;