import {
  toISODate,
  getSprintInfo,
  getStorageIndexFromDateString,
  getDateStringFromStorageIndex,
  generateDateRange,
  isSameDay
} from './dateUtils';

import { ANCHOR_DATE } from './constants';

describe('Date Utilities', () => {

  test('toISODate formats dates correctly', () => {
    const date = new Date('2026-01-08T15:00:00');
    expect(toISODate(date)).toBe('2026-01-08');
  });

  test('getSprintInfo calculates Sprint 1 correctly', () => {
    // Anchor date is Jan 8, 2026
    const anchor = new Date(ANCHOR_DATE);
    const { isSprintStart, label } = getSprintInfo(anchor);

    expect(isSprintStart).toBe(true);
    expect(label).toBe('Sprint 1');
  });

  test('getSprintInfo calculates Sprint 2 correctly', () => {
    // 14 days after Jan 8 is Jan 22
    const sprint2Date = new Date('2026-01-22T00:00:00');
    const { isSprintStart, label } = getSprintInfo(sprint2Date);

    expect(isSprintStart).toBe(true);
    expect(label).toBe('Sprint 2');
  });

  test('getSprintInfo identifies non-sprint-start days', () => {
    const randomDay = new Date('2026-01-09T00:00:00');
    const { isSprintStart, label } = getSprintInfo(randomDay);

    expect(isSprintStart).toBe(false);
    expect(label).toBeNull();
  });

  test('Storage Index Math is reversible', () => {
    // If we convert Date -> Index -> Date, we should get the same result
    const testDateStr = '2026-02-01';

    const index = getStorageIndexFromDateString(testDateStr);
    const resultDateStr = getDateStringFromStorageIndex(index);

    expect(resultDateStr).toBe(testDateStr);
  });

  test('generateDateRange creates correct array size', () => {
    const start = '2026-01-01';
    const end = '2026-01-05'; // 5 days inclusive
    const { dates, totalDays } = generateDateRange(start, end);

    expect(totalDays).toBe(5);
    expect(dates[0].toISOString().split('T')[0]).toBe('2026-01-01');
    expect(dates[4].toISOString().split('T')[0]).toBe('2026-01-05');
  });

  test('isSameDay correctly identifies dates', () => {
    const d1 = new Date('2026-01-01T10:00:00');
    const d2 = new Date('2026-01-01T22:00:00'); // Same day, different time
    const d3 = new Date('2026-01-02T10:00:00'); // Different day

    expect(isSameDay(d1, d2)).toBe(true);
    expect(isSameDay(d1, d3)).toBe(false);
  });
});