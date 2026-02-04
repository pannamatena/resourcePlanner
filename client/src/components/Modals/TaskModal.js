import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, X, ExternalLink, Plane, Copy } from 'lucide-react';
import { usePlanner } from '../../context/PlannerContext';
import { getStorageIndexFromDateString, getDateStringFromStorageIndex } from '../../utils/dateUtils';
import * as S from '../../Style';

export const TaskModal = ({ task, onClose }) => {
  const { actions } = usePlanner();

  const [formData, setFormData] = useState({
    title: '',
    startStr: '',
    endStr: '',
    url: '',
    isOOO: false
  });

  useEffect(() => {
    if (task) {
      const startStr = getDateStringFromStorageIndex(task.startIdx);
      // Duration is inclusive (-1)
      const endStr = getDateStringFromStorageIndex(task.startIdx + task.duration - 1);

      setFormData({
        title: task.title,
        url: task.url || '',
        isOOO: task.isOOO || false,
        startStr,
        endStr
      });
    }
  }, [task]);

  const handleSave = () => {
    const newStartIdx = getStorageIndexFromDateString(formData.startStr);
    const newEndIdx = getStorageIndexFromDateString(formData.endStr);

    // Inclusive math (+1)
    const newDuration = (newEndIdx - newStartIdx) + 1;

    if (newDuration <= 0) return alert("End date must be after or equal to start date");

    const taskData = {
      ...task,
      // Auto-set title to 'OOO' if empty and OOO flag is checked
      title: formData.title || (formData.isOOO ? 'OOO' : 'New Task'),
      url: formData.url,
      startIdx: newStartIdx,
      duration: newDuration,
      isOOO: formData.isOOO
    };

    if (task._isNew) {
      const { _isNew, ...cleanTask } = taskData;
      actions.addTask(cleanTask);
    } else {
      actions.updateTask(taskData);
    }

    onClose();
  };

  const handleDelete = () => {
    if (task && !task._isNew) {
      actions.deleteTask(task.id);
    }
    onClose();
  };

  const handleDuplicate = () => {
    if (task._isNew) return; // Cannot duplicate an unsaved task

    // 1. Calculate new start (Immediately after original ends)
    const originalStartIdx = getStorageIndexFromDateString(formData.startStr);
    const currentDuration = (getStorageIndexFromDateString(formData.endStr) - originalStartIdx) + 1;
    const newStartIdx = originalStartIdx + currentDuration;

    // 2. Create New Task Object
    const newTask = {
      id: Date.now(), // Generate new ID
      resourceId: task.resourceId,
      title: formData.title + ' (Copy)', // Optional: Add label
      startIdx: newStartIdx,
      duration: currentDuration,
      url: formData.url,
      isOOO: formData.isOOO
    };

    // 3. Save and Close
    actions.addTask(newTask);
    onClose();
  };

  const toggleOOO = (e) => {
    const isChecked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      isOOO: isChecked,
      title: isChecked ? 'OOO' : ''
    }));
  };

  if (!task) return null;

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent onClick={e => e.stopPropagation()}>
        <S.ModalHeader>
          <h3>{task._isNew ? 'Add Task' : 'Edit Task'}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </S.ModalHeader>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* 1. TITLE INPUT */}
          <S.InputGroup>
            <label htmlFor="task-title">Task Title</label>
            <input
              id="task-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder={formData.isOOO ? "e.g., Vacation, Sick Leave" : "Task Name"}
            />
          </S.InputGroup>

          {/* 2. DATE INPUTS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <S.InputGroup>
              <label htmlFor="task-start">Start Date</label>
              <input
                id="task-start"
                type="date"
                value={formData.startStr}
                onChange={(e) => setFormData({...formData, startStr: e.target.value})}
              />
            </S.InputGroup>
            <S.InputGroup>
              <label htmlFor="task-end">End Date</label>
              <input
                id="task-end"
                type="date"
                value={formData.endStr}
                onChange={(e) => setFormData({...formData, endStr: e.target.value})}
              />
            </S.InputGroup>
          </div>

          {/* 3. URL INPUT (Hidden if OOO) */}
          {!formData.isOOO && (
            <S.InputGroup>
              <label htmlFor="task-url">Jira/Doc URL</label>
              <div style={{ display: 'flex' }}>
                <span style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRight: 0, borderRadius: '4px 0 0 4px', padding: '8px', display: 'flex', alignItems: 'center' }}>
                    <LinkIcon size={16} color="#64748b"/>
                </span>
                <input
                  id="task-url"
                  type="text"
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  style={{ borderRadius: '0 4px 4px 0', width: '100%' }}
                />
              </div>
            </S.InputGroup>
          )}

          {!formData.isOOO && formData.url && (
            <div style={{ marginTop: '-12px', marginBottom: '8px', textAlign: 'right' }}>
              <a
                href={formData.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.85rem', color: '#4f46e5', textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', backgroundColor: '#eef2ff', borderRadius: '4px' }}
              >
                Open Link <ExternalLink size={12} />
              </a>
            </div>
          )}

          {/* 4. OOO CHECKBOX (Moved to Bottom) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <input
              id="is-ooo"
              type="checkbox"
              checked={formData.isOOO}
              onChange={toggleOOO}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="is-ooo" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
              Mark as Out of Office <Plane size={14} />
            </label>
          </div>

          {/* 5. BUTTONS */}
          <S.ButtonRow>
            <S.Button variant="danger" onClick={handleDelete}>Delete</S.Button>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!task._isNew && (
                <S.Button
                  type="button"
                  onClick={handleDuplicate}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f1f5f9', color: '#475569' }}
                >
                  <Copy size={14} /> Duplicate
                </S.Button>
              )}

              <S.Button variant="primary" onClick={handleSave}>Save Changes</S.Button>
            </div>
          </S.ButtonRow>
        </div>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};