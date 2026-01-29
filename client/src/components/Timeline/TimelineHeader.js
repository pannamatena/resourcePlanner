import React from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { getSprintInfo, getHolidayType, formatDate, isSameDay } from '../../utils/dateUtils';
import * as S from '../../Style';

export const TimelineHeader = () => {
  const { dates, totalDays, today } = usePlanner();

  return (
    <S.TimelineHeader totalDays={totalDays}>
      {dates.map((date, index) => {
        const { isSprintStart, label } = getSprintInfo(date);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const holidayType = getHolidayType(date);
        const isToday = isSameDay(date, today);

        return (
          <S.DayHeaderCell
            key={index}
            isSprintStart={isSprintStart}
            sprintLabel={label}
            isWeekend={isWeekend}
            holidayType={holidayType}
            isToday={isToday}
          >
            {/* NEW: Today Label */}
            {isToday && <S.TodayLabel>Today</S.TodayLabel>}

            <span>{isSprintStart ? formatDate(date) : date.getDate()}</span>
          </S.DayHeaderCell>
        );
      })}
    </S.TimelineHeader>
  );
};