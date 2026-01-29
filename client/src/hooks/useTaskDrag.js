import { useState, useRef, useEffect } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { DAY_WIDTH } from '../Style'; // or utils/constants
import { getStorageIndexFromViewIndex } from '../utils/dateUtils';

export const useTaskDrag = () => {
  const { viewRange, totalDays, actions } = usePlanner();

  // Resize State
  const [resizingTask, setResizingTask] = useState(null);
  const isResizingRef = useRef(false); // Flag to prevent drag conflicts

  // --- DRAG (MOVE) HANDLERS ---
  const onDragStart = (e, task) => {
    if (isResizingRef.current) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('taskId', task.id);

    // Calculate where inside the bar the user clicked
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

    // Calculate new position relative to the row
    const rowRect = e.currentTarget.getBoundingClientRect();
    const dropPixelX = e.clientX - rowRect.left;
    const dropViewIndex = Math.floor(dropPixelX / DAY_WIDTH);

    // Adjust start index based on click offset
    const newStartViewIndex = dropViewIndex - clickOffset;

    // Convert View Index (relative to scroll) -> Storage Index (relative to Anchor)
    const newStorageIdx = getStorageIndexFromViewIndex(viewRange.start, newStartViewIndex);

    // Call Context Action
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

  // Global Listeners for Resize
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!resizingTask) return;

      const deltaPixels = e.clientX - resizingTask.initialX;
      const deltaDays = Math.round(deltaPixels / DAY_WIDTH);

      let newDuration = resizingTask.initialDuration + deltaDays;
      if (newDuration < 1) newDuration = 1;

      // Optimistic UI update via Context
      actions.updateTask({
        id: resizingTask.id,
        duration: newDuration
      });
    };

    const handleGlobalMouseUp = () => {
      if (resizingTask) {
        setResizingTask(null);
        // Small timeout to prevent the "Click" event from firing on the task immediately after resize
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
    isResizing: isResizingRef.current
  };
};