// src/utils/dateUtils.js
import { ANCHOR_DATE, HOLIDAYS_2026 } from './constants';

export const toISODate = (date) => date.toISOString().split('T')[0];

export const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const getHolidayType = (date) => {
  const dateStr = toISODate(date);
  const match = HOLIDAYS_2026.find(h => h.date === dateStr);
  return match ? match.type : null;
};

export const getCurrentQuarter = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  let startMonth, endMonth, endDay;

  if (month <= 2) { startMonth = 0; endMonth = 2; endDay = 31; }
  else if (month <= 5) { startMonth = 3; endMonth = 5; endDay = 30; }
  else if (month <= 8) { startMonth = 6; endMonth = 8; endDay = 30; }
  else { startMonth = 9; endMonth = 11; endDay = 31; }

  const start = new Date(year, startMonth, 1);
  const end = new Date(year, endMonth, endDay);
  return { start: toISODate(start), end: toISODate(end) };
};

export const generateDateRange = (startStr, endStr) => {
  const dates = [];
  const start = new Date(startStr);
  const end = new Date(endStr);

  // Safety check
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 365 * 2) return { dates: [], totalDays: 0 };

  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return { dates, totalDays: dates.length };
};

export const getSprintInfo = (date) => {
  const diffTime = date.getTime() - ANCHOR_DATE.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  const isSprintStart = diffDays % 14 === 0;
  let label = null;
  if (isSprintStart) {
    const sprintNum = Math.floor(diffDays / 14) + 1;
    label = diffDays < 0 ? `Sprint ${Math.floor(diffDays/14)}` : `Sprint ${sprintNum}`;
  }
  return { isSprintStart, label };
};

// Conversions
export const getStorageIndexFromViewIndex = (viewStartDate, viewIndex) => {
  const viewDate = new Date(viewStartDate);
  viewDate.setDate(viewDate.getDate() + viewIndex);
  const diffTime = viewDate.getTime() - ANCHOR_DATE.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getViewIndexFromStorageIndex = (viewStartDate, storageIdx) => {
  const taskDate = new Date(ANCHOR_DATE);
  taskDate.setDate(taskDate.getDate() + storageIdx);
  const viewStart = new Date(viewStartDate);
  // Reset hours to avoid timezone glitches
  taskDate.setHours(0,0,0,0);
  viewStart.setHours(0,0,0,0);
  const diffTime = taskDate.getTime() - viewStart.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getDateStringFromStorageIndex = (idx) => {
  const d = new Date(ANCHOR_DATE);
  d.setDate(d.getDate() + idx);
  // Use local date components to avoid UTC offset shifting the date in UTC+ timezones
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getStorageIndexFromDateString = (dateStr) => {
  const d = new Date(dateStr);
  d.setHours(0,0,0,0);
  const anchor = new Date(ANCHOR_DATE);
  anchor.setHours(0,0,0,0);
  const diff = d.getTime() - anchor.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const isSameDay = (d1, d2) => {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
};