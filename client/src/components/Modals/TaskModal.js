import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, X, ExternalLink } from 'lucide-react';
import { usePlanner } from '../../context/PlannerContext';
import { getStorageIndexFromDateString, getDateStringFromStorageIndex } from '../../utils/dateUtils';
import * as S from '../../Style';

export const TaskModal = ({ task, onClose }) => {
  const { actions } = usePlanner();

  // Local form state
  const [formData, setFormData] = useState({
    title: '',
    startStr: '',
    endStr: '',
    url: ''
  });

  // Initialize form when task changes
  useEffect(() => {
    if (task) {
      // Calculate date strings from the stored indices
      const startStr = getDateStringFromStorageIndex(task.startIdx);
      // Duration is inclusive, so end date math might need -1 depending on preference,
      // but for consistency with previous code:
      const endStr = getDateStringFromStorageIndex(task.startIdx + task.duration);

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
    const newDuration = newEndIdx - newStartIdx;

    if (newDuration <= 0) return alert("End date must be after start date");

    const taskData = {
      ...task,
      title: formData.title,
      url: formData.url,
      startIdx: newStartIdx,
      duration: newDuration
    };

    // If ID exists, update; otherwise it's a new task (handled by caller logic usually,
    // but here we can distinguish based on if we passed a 'new' ID or existing)
    // For simplicity, our AddTask logic in App.js creates a temp object with an ID.
    // So we always use updateTask logic effectively, or we can separate add/update actions.
    // However, based on our Context, we have addTask and updateTask.
    // *Correction*: In the previous App.js, we decided "Add" or "Edit" before opening.
    // So we can just call updateTask if we treat the "New Task" as an object that already exists in state?
    // NO, usually "Add" creates a draft.
    // Let's use the generic "upsert" approach or check if task exists in context.

    // To keep it simple and consistent with your previous code:
    // We will assume `actions.updateTask` handles both if we treat the ID as the key.
    // Actually, `addTask` pushes to array, `updateTask` maps.

    // Let's rely on the parent to define the action? No, keep logic here.
    // We'll check if the task exists in the store (Edit) or not (Add).
    // *Simplest Path*: The `onSave` prop from parent handles the dispatch choice.
    // BUT, we want to use Context.

    // Let's just assume `actions.updateTask` works for everything because in `App.js` logic
    // we created the object with an ID *before* opening the modal for "Add".
    // Wait, in previous code: handleAddTask -> setEditingTask(newObject) -> setIsModalOpen(true).
    // The newObject was NOT added to `tasks` state yet.
    // So we need to know if it's new.

    if (task._isNew) {
      // Remove the temporary flag before saving
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
          <S.InputGroup>
            <label>Task Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </S.InputGroup>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <S.InputGroup>
              <label>Start Date</label>
              <input
                type="date"
                value={formData.startStr}
                onChange={(e) => setFormData({...formData, startStr: e.target.value})}
              />
            </S.InputGroup>
            <S.InputGroup>
              <label>End Date</label>
              <input
                type="date"
                value={formData.endStr}
                onChange={(e) => setFormData({...formData, endStr: e.target.value})}
              />
            </S.InputGroup>
          </div>

          <S.InputGroup>
            <label>Jira/Doc URL</label>
            <div style={{ display: 'flex' }}>
              <span style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRight: 0, borderRadius: '4px 0 0 4px', padding: '8px', display: 'flex', alignItems: 'center' }}>
                <LinkIcon size={16} color="#64748b"/>
              </span>
              <input
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