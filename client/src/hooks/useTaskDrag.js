import { useState, useRef, useEffect } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { DAY_WIDTH } from '../utils/constants'; // Adjusted path if needed
import { getStorageIndexFromViewIndex } from '../utils/dateUtils';

export const useTaskDrag = () => {
  const { viewRange, actions } = usePlanner();

  // Resize State
  const [resizingTask, setResizingTask] = useState(null);
  const isResizingRef = useRef(false);

  // --- DRAG (MOVE) HANDLERS ---
  const onDragStart = (e, task) => {
    if (isResizingRef.current) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('taskId', task.id);
    const rect = e.target.getBoundingClientRect();
    const clickOffset = Math.floor((e.clientX - rect.left) / DAY_WIDTH);
    e.dataTransfer.setData('clickOffset', clickOffset);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDropRow = (e, memberId) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    if (!taskId) return;

    const clickOffset = parseInt(e.dataTransfer.getData('clickOffset'));
    const rowRect = e.currentTarget.getBoundingClientRect();
    const dropPixelX = e.clientX - rowRect.left;
    const dropViewIndex = Math.floor(dropPixelX / DAY_WIDTH);
    const newStartViewIndex = dropViewIndex - clickOffset;
    const newStorageIdx = getStorageIndexFromViewIndex(viewRange.start, newStartViewIndex);

    actions.updateTask({
      id: taskId,
      resourceId: memberId,
      startIdx: newStorageIdx
    });
  };

  // --- RESIZE HANDLERS ---
  const onResizeStart = (e, task) => {
    e.stopPropagation();
    e.preventDefault();
    isResizingRef.current = true;
    setResizingTask({ id: task.id, initialX: e.clientX, initialDuration: task.duration });
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!resizingTask) return;

      const deltaPixels = e.clientX - resizingTask.initialX;
      const deltaDays = Math.round(deltaPixels / DAY_WIDTH);
      let newDuration = resizingTask.initialDuration + deltaDays;
      if (newDuration < 1) newDuration = 1;

      actions.updateTask({
        id: resizingTask.id,
        duration: newDuration
      });
    };

    const handleGlobalMouseUp = () => {
      if (resizingTask) {
        setResizingTask(null);
        // Timeout ensures we don't trigger 'onClick' immediately after releasing mouse
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
  }, [resizingTask, actions]);

  return {
    onDragStart,
    onDragOver,
    onDropRow,
    onResizeStart,
    isResizingRef // <--- RETURN THE REF ITSELF
  };
};