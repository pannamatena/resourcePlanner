import React from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { getSprintInfo, getHolidayType, formatDate } from '../../utils/dateUtils';
import * as S from '../../Style';

export const TimelineHeader = () => {
  const { dates, totalDays } = usePlanner();

  return (
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
  );
};