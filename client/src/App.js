/** @jsxImportSource @emotion/react */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link as LinkIcon, X, Calendar } from 'lucide-react';
import * as S from './Style';

// --- Date Helpers ---
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

const INITIAL_TEAM = [
  { id: 1, name: 'Dan', role: 'Frontend', color: { main: '#0284c7', bg: '#e0f2fe' } },
  { id: 2, name: 'Amit', role: 'Frontend', color: { main: '#0891b2', bg: '#cffafe' } },
  { id: 3, name: 'Aisling', role: 'Backend', color: { main: '#7c3aed', bg: '#ede9fe' } },
  { id: 4, name: 'Alain', role: 'Backend', color: { main: '#4f46e5', bg: '#e0e7ff' } },
  { id: 5, name: 'JB', role: 'Backend', color: { main: '#db2777', bg: '#fce7f3' } },
  { id: 6, name: 'Craig', role: 'QA',      color: { main: '#059669', bg: '#d1fae5' } },
];

const App = () => {
  const { dates, startDate, anchorDate } = useMemo(() => generateQuarterDates(), []);
  const [team] = useState(INITIAL_TEAM);

  const [tasks, setTasks] = useState([
    { id: 101, resourceId: 1, title: 'Auth Service', startIdx: 0, duration: 10, url: '' },
    { id: 102, resourceId: 3, title: 'API Gateway', startIdx: 14, duration: 10, url: '' },
    { id: 103, resourceId: 6, title: 'Regression Testing', startIdx: 16, duration: 5, url: '' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // --- Resize State ---
  const [resizingTask, setResizingTask] = useState(null); // { id, initialX, initialDuration }

  // Ref to track if we are currently resizing (to prevent opening modal on mouseUp)
  const isResizingRef = useRef(false);

  // --- Helpers ---
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

  // --- Modal Logic ---
  const handleAddTask = (resourceId, dayIndex) => {
    if (isResizingRef.current) return; // Don't add if we just finished resizing
    const startStr = getDateStringFromIndex(startDate, dayIndex);
    const endStr = getDateStringFromIndex(startDate, dayIndex + 5);
    setEditingTask({ id: Date.now(), resourceId, title: 'New Task', startStr, endStr, url: '' });
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    if (isResizingRef.current) return; // Don't edit if we just finished resizing
    const startStr = getDateStringFromIndex(startDate, task.startIdx);
    const endStr = getDateStringFromIndex(startDate, task.startIdx + task.duration);
    setEditingTask({ ...task, startStr, endStr });
    setIsModalOpen(true);
  };

  const saveTask = () => {
    const newStartIdx = getIndexFromDateString(startDate, editingTask.startStr);
    const newEndIdx = getIndexFromDateString(startDate, editingTask.endStr);
    const newDuration = newEndIdx - newStartIdx;

    if (newDuration <= 0) {
      alert("End date must be after start date");
      return;
    }
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

  // --- Drag and Drop (Move) Logic ---
  const onDragStart = (e, task) => {
    // If resizing, don't allow dragging
    if (isResizingRef.current) {
      e.preventDefault();
      return;
    }
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

  // --- RESIZE LOGIC (Mouse Events) ---

  const handleResizeStart = (e, task) => {
    e.stopPropagation(); // Prevent triggering Drag or Click
    e.preventDefault();  // Prevent text selection

    isResizingRef.current = true;
    setResizingTask({
      id: task.id,
      initialX: e.clientX,
      initialDuration: task.duration
    });
  };

  // Global Mouse Listeners for Resizing
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!resizingTask) return;

      // Calculate delta in pixels
      const deltaPixels = e.clientX - resizingTask.initialX;

      // Convert to days (Snap)
      const deltaDays = Math.round(deltaPixels / S.DAY_WIDTH);

      let newDuration = resizingTask.initialDuration + deltaDays;
      if (newDuration < 1) newDuration = 1; // Minimum 1 day

      setTasks(prev => prev.map(t =>
        t.id === resizingTask.id ? { ...t, duration: newDuration } : t
      ));
    };

    const handleGlobalMouseUp = () => {
      if (resizingTask) {
        setResizingTask(null);
        // Slight delay before allowing clicks again to prevent modal from popping up
        setTimeout(() => {
          isResizingRef.current = false;
        }, 100);
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
      </S.Header>

      <S.PlannerLayout>
        <S.Sidebar>
          <S.SidebarRow isHeader>Team Member</S.SidebarRow>
          {team.map(member => (
            <S.SidebarRow key={member.id}>
              <S.Avatar color={member.color}>{member.name.charAt(0)}</S.Avatar>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{member.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{member.role}</div>
              </div>
            </S.SidebarRow>
          ))}
        </S.Sidebar>

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
              <S.TimelineRow
                key={member.id}
                onDragOver={onDragOver}
                onDrop={(e) => onDropRow(e, member.id)}
              >
                {dates.map((date, index) => {
                  const { isSprintStart } = getSprintInfo(date);
                  return (
                    <S.GridCell
                      key={index}
                      isSprintStart={isSprintStart}
                      onClick={() => handleAddTask(member.id, index)}
                    />
                  );
                })}

                {tasks.filter(t => t.resourceId === member.id).map(task => (
                  <S.TaskBar
                    key={task.id}
                    startIndex={task.startIdx}
                    duration={task.duration}
                    color={member.color}
                    onClick={(e) => { e.stopPropagation(); handleEditTask(task); }}
                    draggable // HTML5 Drag for moving
                    onDragStart={(e) => onDragStart(e, task)}
                  >
                    <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {task.title}
                    </div>
                    {task.url && <LinkIcon size={12} style={{ marginLeft: 4, opacity: 0.5 }} />}

                    {/* NEW: Resize Handle inside the bar */}
                    <S.ResizeHandle onMouseDown={(e) => handleResizeStart(e, task)} />
                  </S.TaskBar>
                ))}
              </S.TimelineRow>
            ))}

          </S.TimelineContent>
        </S.TimelineScrollArea>
      </S.PlannerLayout>

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