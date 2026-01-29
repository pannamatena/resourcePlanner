import React from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { usePlanner } from '../../context/PlannerContext';
import { useTaskDrag } from '../../hooks/useTaskDrag';
import { getSprintInfo, getHolidayType, getViewIndexFromStorageIndex, getDateStringFromStorageIndex } from '../../utils/dateUtils';
import * as S from '../../Style';

export const TimelineRow = ({ member, onEditTask, onAddTask }) => {
  const { dates, tasks, totalDays, viewRange } = usePlanner();
  const { onDragStart, onDragOver, onDropRow, onResizeStart, isResizing } = useTaskDrag();

  // Filter tasks for this member
  const memberTasks = tasks.filter(t => t.resourceId === member.id);

  const handleCellClick = (index) => {
    // Don't trigger add if we just finished resizing/dragging
    if (isResizing) return;
    onAddTask(member.id, index);
  };

  return (
    <S.TimelineRow
      totalDays={totalDays}
      onDragOver={onDragOver}
      onDrop={(e) => onDropRow(e, member.id)}
    >
      {/* 1. Background Grid Cells */}
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
            onClick={() => handleCellClick(index)}
          />
        );
      })}

      {/* 2. Task Bars */}
      {memberTasks.map(task => {
        // Calculate position relative to current view
        const viewStartIndex = getViewIndexFromStorageIndex(viewRange.start, task.startIdx);

        // Performance: Don't render if completely out of view
        if (viewStartIndex + task.duration < 0 || viewStartIndex > totalDays) return null;

        return (
          <S.TaskBar
            key={task.id}
            startIndex={viewStartIndex}
            duration={task.duration}
            color={member.color}
            onClick={(e) => { e.stopPropagation(); if(!isResizing) onEditTask(task); }}
            draggable
            onDragStart={(e) => onDragStart(e, task)}
          >
            <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
            {task.url && <LinkIcon size={12} style={{ marginLeft: 4, opacity: 0.5 }} />}

            <S.ResizeHandle onMouseDown={(e) => onResizeStart(e, task)} />
          </S.TaskBar>
        );
      })}
    </S.TimelineRow>
  );
};