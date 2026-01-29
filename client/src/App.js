/** @jsxImportSource @emotion/react */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link as LinkIcon, X, Calendar, ExternalLink, Plus, Trash2, Pencil, Download, Upload } from 'lucide-react';
import * as S from './Style';

// --- HELPERS ---
const toISODate = (date) => date.toISOString().split('T')[0];
const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

// --- HOLIDAY DATA (2026) ---
const HOLIDAYS_2026 = [
  // JAN
  { date: '2026-01-01', type: 'IE' }, { date: '2026-01-01', type: 'UK' }, { date: '2026-01-01', type: 'US' },
  { date: '2026-01-19', type: 'US' },
  // FEB
  { date: '2026-02-02', type: 'IE' },
  { date: '2026-02-16', type: 'US' },
  // MAR
  { date: '2026-03-17', type: 'IE' },
  // APR
  { date: '2026-04-03', type: 'UK' },
  { date: '2026-04-06', type: 'IE' }, { date: '2026-04-06', type: 'UK' },
  // MAY
  { date: '2026-05-04', type: 'IE' }, { date: '2026-05-04', type: 'UK' },
  { date: '2026-05-25', type: 'UK' }, { date: '2026-05-25', type: 'US' },
  // JUN
  { date: '2026-06-01', type: 'IE' },
  { date: '2026-06-19', type: 'US' },
  // JUL
  { date: '2026-07-04', type: 'US' },
  // AUG
  { date: '2026-08-03', type: 'IE' },
  { date: '2026-08-31', type: 'UK' },
  // SEP
  { date: '2026-09-07', type: 'US' },
  // OCT
  { date: '2026-10-26', type: 'IE' },
  // NOV
  { date: '2026-11-26', type: 'US' },
  // DEC
  { date: '2026-12-25', type: 'IE' }, { date: '2026-12-25', type: 'UK' }, { date: '2026-12-25', type: 'US' },
  { date: '2026-12-26', type: 'IE' }, { date: '2026-12-26', type: 'UK' },
];

const getHolidayType = (date) => {
  const dateStr = toISODate(date);
  const match = HOLIDAYS_2026.find(h => h.date === dateStr);
  return match ? match.type : null;
};

const getCurrentQuarter = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  let startMonth, endMonth, endDay;
  if (month <= 2) { startMonth = 0; endMonth = 2; endDay = 31; }
  else if (month <= 5) { startMonth = 3; endMonth = 5; endDay = 30; }
  else if (month <= 8) { startMonth = 6; endMonth = 8; endDay = 30; }
  else { startMonth = 9; endMonth = 11; endDay = 31; }
  const start = new Date(year, startMonth, 1);
  const end = new Date(year, endMonth, endDay);
  return { start: toISODate(start), end: toISODate(end) };
};

const generateDateRange = (startStr, endStr) => {
  const dates = [];
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 365 * 2) return { dates: [], totalDays: 0 };
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return { dates, totalDays: dates.length };
};

const ANCHOR_DATE = new Date('2026-01-08T00:00:00');

const getStorageIndexFromViewIndex = (viewStartDate, viewIndex) => {
  const viewDate = new Date(viewStartDate);
  viewDate.setDate(viewDate.getDate() + viewIndex);
  const diffTime = viewDate.getTime() - ANCHOR_DATE.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getViewIndexFromStorageIndex = (viewStartDate, storageIdx) => {
  const taskDate = new Date(ANCHOR_DATE);
  taskDate.setDate(taskDate.getDate() + storageIdx);
  const viewStart = new Date(viewStartDate);
  taskDate.setHours(0,0,0,0);
  viewStart.setHours(0,0,0,0);
  const diffTime = taskDate.getTime() - viewStart.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getDateStringFromStorageIndex = (idx) => {
  const d = new Date(ANCHOR_DATE);
  d.setDate(d.getDate() + idx);
  return toISODate(d);
};

const getStorageIndexFromDateString = (dateStr) => {
  const d = new Date(dateStr);
  d.setHours(0,0,0,0);
  const anchor = new Date(ANCHOR_DATE);
  anchor.setHours(0,0,0,0);
  const diff = d.getTime() - anchor.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// --- UPDATED COLORS BASED ON UPLOADED IMAGE ---
const COLOR_THEMES = [
  { name: 'Purple',  bg: '#ce9df7', main: '#8a4baf' },
  { name: 'Blue',    bg: '#8cb5f7', main: '#4275d6' },
  { name: 'Green',   bg: '#7fe0a2', main: '#40895e' },
  { name: 'Sky',     bg: '#8bd9f5', main: '#3f7e9e' },
  { name: 'Amber',   bg: '#efdf6b', main: '#b06929' },
  { name: 'Red',     bg: '#ec8b82', main: '#bf463a' },
  { name: 'Gray',    bg: '#9398a0', main: '#646871' },
];

const INITIAL_TEAM = [
  { id: 1, name: 'Dan', role: 'Frontend', color: COLOR_THEMES[0] },
  { id: 2, name: 'Amit', role: 'Frontend', color: COLOR_THEMES[1] },
];
const INITIAL_TASKS = [
  { id: 101, resourceId: 1, title: 'Auth Service', startIdx: 0, duration: 10, url: '' },
];

const App = () => {
  const [viewRange, setViewRange] = useState(getCurrentQuarter());
  const { dates, totalDays } = useMemo(() => generateDateRange(viewRange.start, viewRange.end), [viewRange]);

  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem('planner_team');
    // Map saved teams to new color structure if necessary, or default
    if (saved) {
      // Optional: logic to ensure saved colors match new themes could go here
      return JSON.parse(saved);
    }
    return INITIAL_TEAM;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('planner_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  useEffect(() => { localStorage.setItem('planner_team', JSON.stringify(team)); }, [team]);
  useEffect(() => { localStorage.setItem('planner_tasks', JSON.stringify(tasks)); }, [tasks]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [memberForm, setMemberForm] = useState({ id: null, name: '', role: '', colorIdx: 0 });
  const [resizingTask, setResizingTask] = useState(null);
  const isResizingRef = useRef(false);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const dataStr = JSON.stringify({ team, tasks, version: 1 }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `planner-backup-${toISODate(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const triggerImport = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleImportFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (json.team && Array.isArray(json.team) && json.tasks && Array.isArray(json.tasks)) {
          if(window.confirm("This will overwrite your current data. Continue?")) {
            setTeam(json.team);
            setTasks(json.tasks);
          }
        } else {
          alert("Invalid file format. Missing team or tasks data.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = null; // Reset input so same file can be selected again
  };

  const getSprintInfo = (date) => {
    const diffTime = date.getTime() - ANCHOR_DATE.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    const isSprintStart = diffDays % 14 === 0;
    let label = null;
    if (isSprintStart) {
      const sprintNum = Math.floor(diffDays / 14) + 1;
      label = diffDays < 0 ? `Sprint ${Math.floor(diffDays/14)}` : `Sprint ${sprintNum}`;
    }
    return { isSprintStart, label };
  };

  const openMemberModal = (member = null) => {
    if (member) {
      // Try to find the matching color from the new theme list
      let colorIdx = COLOR_THEMES.findIndex(c => c.main === member.color.main);
      // Fallback if the saved color doesn't exist in new themes
      if (colorIdx === -1) colorIdx = 0;

      setMemberForm({ id: member.id, name: member.name, role: member.role, colorIdx });
    } else {
      setMemberForm({ id: null, name: '', role: '', colorIdx: 0 });
    }
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = () => {
    if (!memberForm.name) return alert("Name is required");
    const newColor = COLOR_THEMES[memberForm.colorIdx];
    if (memberForm.id) {
      setTeam(prev => prev.map(m => m.id === memberForm.id ? { ...m, name: memberForm.name, role: memberForm.role, color: newColor } : m));
    } else {
      setTeam([...team, { id: Date.now(), name: memberForm.name, role: memberForm.role || 'Contributor', color: newColor }]);
    }
    setIsMemberModalOpen(false);
  };

  const handleDeleteMember = (id) => {
    if (window.confirm("Delete this member?")) {
      setTeam(prev => prev.filter(m => m.id !== id));
      setTasks(prev => prev.filter(t => t.resourceId !== id));
    }
  };

  const handleAddTask = (resourceId, viewIndex) => {
    if (isResizingRef.current) return;
    const storageIdx = getStorageIndexFromViewIndex(viewRange.start, viewIndex);
    const startStr = getDateStringFromStorageIndex(storageIdx);
    const endStr = getDateStringFromStorageIndex(storageIdx + 5);
    setEditingTask({ id: Date.now(), resourceId, title: 'New Task', startStr, endStr, url: '' });
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    if (isResizingRef.current) return;
    const startStr = getDateStringFromStorageIndex(task.startIdx);
    const endStr = getDateStringFromStorageIndex(task.startIdx + task.duration);
    setEditingTask({ ...task, startStr, endStr });
    setIsModalOpen(true);
  };

  const saveTask = () => {
    const newStartIdx = getStorageIndexFromDateString(editingTask.startStr);
    const newEndIdx = getStorageIndexFromDateString(editingTask.endStr);
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

  const onDragStart = (e, task, viewIndex) => {
    if (isResizingRef.current) { e.preventDefault(); return; }
    e.dataTransfer.setData('taskId', task.id);
    const rect = e.target.getBoundingClientRect();
    const clickOffset = Math.floor((e.clientX - rect.left) / S.DAY_WIDTH);
    e.dataTransfer.setData('clickOffset', clickOffset);
  };
  const onDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const onDropRow = (e, memberId) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    if (!taskId) return;
    const clickOffset = parseInt(e.dataTransfer.getData('clickOffset'));
    const rowRect = e.currentTarget.getBoundingClientRect();
    const dropPixelX = e.clientX - rowRect.left;
    const dropViewIndex = Math.floor(dropPixelX / S.DAY_WIDTH);
    const newStartViewIndex = dropViewIndex - clickOffset;
    const newStorageIdx = getStorageIndexFromViewIndex(viewRange.start, newStartViewIndex);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, resourceId: memberId, startIdx: newStorageIdx } : t));
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
        <S.HeaderLeft>
          <S.Title><Calendar size={24} /> Resource Planner</S.Title>
          <S.LegendContainer>
            <span style={{ fontWeight: 600, marginRight: 4 }}>Bank Holidays:</span>
            <S.LegendItem><S.LegendSwatch type="US"/> <span>USA</span></S.LegendItem>
            <S.LegendItem><S.LegendSwatch type="IE"/> <span>Ireland</span></S.LegendItem>
            <S.LegendItem><S.LegendSwatch type="UK"/> <span>UK</span></S.LegendItem>
          </S.LegendContainer>
        </S.HeaderLeft>

        <S.HeaderControls>
          <S.DateRangePicker>
            <span>From:</span>
            <input type="date" value={viewRange.start} onChange={(e) => setViewRange({...viewRange, start: e.target.value})} />
            <span>To:</span>
            <input type="date" value={viewRange.end} onChange={(e) => setViewRange({...viewRange, end: e.target.value})} />
          </S.DateRangePicker>
          <S.ButtonGroup>
            <S.HeaderBtn onClick={handleExport}><Download size={16} /> Export</S.HeaderBtn>
            <S.HeaderBtn onClick={triggerImport}><Upload size={16} /> Import</S.HeaderBtn>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".json" onChange={handleImportFile} />
          </S.ButtonGroup>
        </S.HeaderControls>
      </S.Header>

      <S.PlannerLayout>
        <S.Sidebar>
          <S.SidebarRow isHeader>Team Member</S.SidebarRow>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {team.map(member => (
              <S.SidebarRow key={member.id}>
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1, minWidth: 0 }} onClick={() => openMemberModal(member)}>
                  <S.Avatar color={member.color}>{member.name.charAt(0)}</S.Avatar>
                  <S.MemberInfo>
                    <S.MemberName title={member.name}>{member.name}</S.MemberName>
                    <S.MemberRole title={member.role}>{member.role}</S.MemberRole>
                  </S.MemberInfo>
                </div>
                <S.ActionBtnGroup className="actions">
                  <S.ActionBtn hoverBg="#e0e7ff" hoverColor="#4f46e5" onClick={() => openMemberModal(member)}><Pencil size={14} /></S.ActionBtn>
                  <S.ActionBtn hoverBg="#fee2e2" hoverColor="#ef4444" onClick={() => handleDeleteMember(member.id)}><Trash2 size={14} /></S.ActionBtn>
                </S.ActionBtnGroup>
              </S.SidebarRow>
            ))}
          </div>
          <S.AddMemberBtn onClick={() => openMemberModal(null)}><Plus size={16} /> Add Member</S.AddMemberBtn>
        </S.Sidebar>

        <S.TimelineScrollArea>
          <S.TimelineContent totalDays={totalDays}>
            <S.TimelineHeader totalDays={totalDays}>
              {dates.map((date, index) => {
                const { isSprintStart, label } = getSprintInfo(date);
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                const holidayType = getHolidayType(date);
                return (
                  <S.DayHeaderCell
                    key={index}
                    isSprintStart={isSprintStart}
                    sprintLabel={label}
                    isWeekend={isWeekend}
                    holidayType={holidayType}
                  >
                    <span>{isSprintStart ? formatDate(date) : date.getDate()}</span>
                  </S.DayHeaderCell>
                );
              })}
            </S.TimelineHeader>

            {team.map(member => (
              <S.TimelineRow key={member.id} totalDays={totalDays} onDragOver={onDragOver} onDrop={(e) => onDropRow(e, member.id)}>
                {dates.map((date, index) => {
                  const { isSprintStart } = getSprintInfo(date);
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  const holidayType = getHolidayType(date);
                  return (
                    <S.GridCell
                      key={index}
                      isSprintStart={isSprintStart}
                      isWeekend={isWeekend}
                      holidayType={holidayType}
                      onClick={() => handleAddTask(member.id, index)}
                    />
                  );
                })}
                {tasks.filter(t => t.resourceId === member.id).map(task => {
                  const viewStartIndex = getViewIndexFromStorageIndex(viewRange.start, task.startIdx);
                  if (viewStartIndex + task.duration < 0 || viewStartIndex > totalDays) return null;
                  return (
                    <S.TaskBar key={task.id} startIndex={viewStartIndex} duration={task.duration} color={member.color} onClick={(e) => { e.stopPropagation(); handleEditTask(task); }} draggable onDragStart={(e) => onDragStart(e, task, viewStartIndex)}>
                      <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
                      {task.url && <LinkIcon size={12} style={{ marginLeft: 4, opacity: 0.5 }} />}
                      <S.ResizeHandle onMouseDown={(e) => handleResizeStart(e, task)} />
                    </S.TaskBar>
                  );
                })}
              </S.TimelineRow>
            ))}
          </S.TimelineContent>
        </S.TimelineScrollArea>
      </S.PlannerLayout>

      {/* MODALS UNCHANGED */}
      {isMemberModalOpen && (
        <S.ModalOverlay onClick={() => setIsMemberModalOpen(false)}>
          <S.ModalContent onClick={e => e.stopPropagation()}>
            <S.ModalHeader><h3>{memberForm.id ? 'Edit Member' : 'Add Team Member'}</h3><button onClick={() => setIsMemberModalOpen(false)}><X size={20} /></button></S.ModalHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <S.InputGroup><label>Name</label><input type="text" value={memberForm.name} onChange={(e) => setMemberForm({...memberForm, name: e.target.value})} /></S.InputGroup>
              <S.InputGroup><label>Role</label><input type="text" value={memberForm.role} onChange={(e) => setMemberForm({...memberForm, role: e.target.value})} /></S.InputGroup>
              <S.InputGroup><label>Color Theme</label><S.ColorSwatchContainer>{COLOR_THEMES.map((theme, idx) => (<S.ColorSwatch key={idx} color={theme.main} isSelected={memberForm.colorIdx === idx} onClick={() => setMemberForm({...memberForm, colorIdx: idx})} />))}</S.ColorSwatchContainer></S.InputGroup>
              <S.ButtonRow><div /><S.Button variant="primary" onClick={handleSaveMember}>{memberForm.id ? 'Save Changes' : 'Add Member'}</S.Button></S.ButtonRow>
            </div>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
      {isModalOpen && editingTask && (
        <S.ModalOverlay onClick={() => setIsModalOpen(false)}>
          <S.ModalContent onClick={e => e.stopPropagation()}>
            <S.ModalHeader><h3>Manage Allocation</h3><button onClick={() => setIsModalOpen(false)}><X size={20} /></button></S.ModalHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <S.InputGroup><label>Task Title</label><input type="text" value={editingTask.title} onChange={(e) => setEditingTask({...editingTask, title: e.target.value})} /></S.InputGroup>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <S.InputGroup><label>Start Date</label><input type="date" value={editingTask.startStr} onChange={(e) => setEditingTask({...editingTask, startStr: e.target.value})} /></S.InputGroup>
                <S.InputGroup><label>End Date</label><input type="date" value={editingTask.endStr} onChange={(e) => setEditingTask({...editingTask, endStr: e.target.value})} /></S.InputGroup>
              </div>
              <S.InputGroup><label>Jira/Doc URL</label><div style={{ display: 'flex' }}><span style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRight: 0, borderRadius: '4px 0 0 4px', padding: '8px', display: 'flex', alignItems: 'center' }}><LinkIcon size={16} color="#64748b"/></span><input type="text" value={editingTask.url} onChange={(e) => setEditingTask({...editingTask, url: e.target.value})} style={{ borderRadius: '0 4px 4px 0', width: '100%' }} /></div></S.InputGroup>
              {editingTask.url && <div style={{ marginTop: '-12px', marginBottom: '8px', textAlign: 'right' }}><a href={editingTask.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: '#4f46e5', textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', backgroundColor: '#eef2ff', borderRadius: '4px' }}>Open Link <ExternalLink size={12} /></a></div>}
              <S.ButtonRow><S.Button variant="danger" onClick={deleteTask}>Delete</S.Button><S.Button variant="primary" onClick={saveTask}>Save Changes</S.Button></S.ButtonRow>
            </div>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </S.Container>
  );
};
export default App;