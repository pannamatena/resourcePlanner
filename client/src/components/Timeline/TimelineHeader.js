import React from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { getSprintInfo, getHolidayType, formatDate, isSameDay } from '../../utils/dateUtils';
import * as S from '../../Style';

export const TimelineHeader = () => {
  const { dates, totalDays, today, isCondensed } = usePlanner();

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
            sprintLabel={isCondensed ? '' : label}
            isWeekend={isWeekend}
            holidayType={holidayType}
            isToday={isToday}
            isCondensed={isCondensed}
          >
            {/* Today Label */}
            {isToday && !isCondensed && <S.TodayLabel>Today</S.TodayLabel>}

            {/* Normal View: Show Day/Date */}
            {!isCondensed && <span>{isSprintStart ? formatDate(date) : date.getDate()}</span>}

            {/* Condensed View: Show only Sprint Start Date */}
            {isCondensed && isSprintStart && (
              <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', fontSize: '0.6rem', fontWeight: 'bold', marginTop: '4px' }}>
                {formatDate(date)}
              </span>
            )}
          </S.DayHeaderCell>
        );
      })}
    </S.TimelineHeader>
  );
};