import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, X, ExternalLink } from 'lucide-react';
import { usePlanner } from '../../context/PlannerContext';
import { getStorageIndexFromDateString, getDateStringFromStorageIndex } from '../../utils/dateUtils';
import * as S from '../../Style';

export const TaskModal = ({ task, onClose }) => {
  const { actions } = usePlanner();

  const [formData, setFormData] = useState({
    title: '',
    startStr: '',
    endStr: '',
    url: ''
  });

  useEffect(() => {
    if (task) {
      const startStr = getDateStringFromStorageIndex(task.startIdx);
      // Duration is inclusive (-1)
      const endStr = getDateStringFromStorageIndex(task.startIdx + task.duration - 1);

      setFormData({
        title: task.title,
        url: task.url || '',
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
      title: formData.title,
      url: formData.url,
      startIdx: newStartIdx,
      duration: newDuration
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

  if (!task) return null;

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent onClick={e => e.stopPropagation()}>
        <S.ModalHeader>
          <h3>{task._isNew ? 'Add Task' : 'Edit Task'}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </S.ModalHeader>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* TITLE INPUT */}
          <S.InputGroup>
            <label htmlFor="task-title">Task Title</label>
            <input
              id="task-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </S.InputGroup>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* START DATE */}
            <S.InputGroup>
              <label htmlFor="task-start">Start Date</label>
              <input
                id="task-start"
                type="date"
                value={formData.startStr}
                onChange={(e) => setFormData({...formData, startStr: e.target.value})}
              />
            </S.InputGroup>

            {/* END DATE */}
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

          {/* URL INPUT */}
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

          {formData.url && (
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

          <S.ButtonRow>
            <S.Button variant="danger" onClick={handleDelete}>Delete</S.Button>
            <S.Button variant="primary" onClick={handleSave}>Save Changes</S.Button>
          </S.ButtonRow>
        </div>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};