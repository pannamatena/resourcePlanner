import React from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { usePlanner } from '../../context/PlannerContext';
import { useTaskDrag } from '../../hooks/useTaskDrag';
import { getSprintInfo, getHolidayType, getViewIndexFromStorageIndex, isSameDay } from '../../utils/dateUtils';
import * as S from '../../Style';

export const TimelineRow = ({ member, onEditTask, onAddTask }) => {
  const { dates, tasks, totalDays, viewRange, today } = usePlanner();
  // Destructure the Ref here
  const { onDragStart, onDragOver, onDropRow, onResizeStart, isResizingRef } = useTaskDrag();

  const memberTasks = tasks.filter(t => t.resourceId === member.id);

  const handleCellClick = (index) => {
    // Check .current property
    if (isResizingRef.current) return;
    onAddTask(member.id, index);
  };

  return (
    <S.TimelineRow
      totalDays={totalDays}
      onDragOver={onDragOver}
      onDrop={(e) => onDropRow(e, member.id)}
    >
      {dates.map((date, index) => {
        const { isSprintStart } = getSprintInfo(date);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const holidayType = getHolidayType(date);
        const isToday = isSameDay(date, today);

        return (
          <S.GridCell
            key={index}
            isSprintStart={isSprintStart}
            isWeekend={isWeekend}
            holidayType={holidayType}
            isToday={isToday}
            onClick={() => handleCellClick(index)}
          />
        );
      })}

      {memberTasks.map(task => {
        const viewStartIndex = getViewIndexFromStorageIndex(viewRange.start, task.startIdx);
        if (viewStartIndex + task.duration < 0 || viewStartIndex > totalDays) return null;

        return (
          <S.TaskBar
            key={task.id}
            startIndex={viewStartIndex}
            duration={task.duration}
            color={member.color}
            onClick={(e) => {
              e.stopPropagation();
              // Check .current property here to get the "Live" value
              if(!isResizingRef.current) onEditTask(task);
            }}
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