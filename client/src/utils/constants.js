// src/utils/constants.js

export const DAY_WIDTH = 40;

// Anchor: Jan 8, 2026 (Start of Sprint 1)
export const ANCHOR_DATE = new Date('2026-01-08T00:00:00');

export const COLOR_THEMES = [
  { name: 'Purple',  bg: '#ce9df7', main: '#8a4baf' },
  { name: 'Blue',    bg: '#8cb5f7', main: '#4275d6' },
  { name: 'Green',   bg: '#7fe0a2', main: '#40895e' },
  { name: 'Sky',     bg: '#8bd9f5', main: '#3f7e9e' },
  { name: 'Amber',   bg: '#efdf6b', main: '#b06929' },
  { name: 'Red',     bg: '#ec8b82', main: '#bf463a' },
  { name: 'Gray',    bg: '#9398a0', main: '#646871' },
];

export const INITIAL_TEAM = [
  { id: 1, name: 'Dan', role: 'Frontend', color: COLOR_THEMES[0] },
  { id: 2, name: 'Amit', role: 'Frontend', color: COLOR_THEMES[1] },
];

export const INITIAL_TASKS = [
  { id: 101, resourceId: 1, title: 'Auth Service', startIdx: 0, duration: 10, url: '' },
];

export const HOLIDAYS_2026 = [
  { date: '2026-01-01', type: 'IE' }, { date: '2026-01-01', type: 'UK' }, { date: '2026-01-01', type: 'US' },
  { date: '2026-01-19', type: 'US' },
  { date: '2026-02-02', type: 'IE' },
  { date: '2026-02-16', type: 'US' },
  { date: '2026-03-17', type: 'IE' },
  { date: '2026-04-03', type: 'UK' },
  { date: '2026-04-06', type: 'IE' }, { date: '2026-04-06', type: 'UK' },
  { date: '2026-05-04', type: 'IE' }, { date: '2026-05-04', type: 'UK' },
  { date: '2026-05-25', type: 'UK' }, { date: '2026-05-25', type: 'US' },
  { date: '2026-06-01', type: 'IE' },
  { date: '2026-06-19', type: 'US' },
  { date: '2026-07-04', type: 'US' },
  { date: '2026-08-03', type: 'IE' },
  { date: '2026-08-31', type: 'UK' },
  { date: '2026-09-07', type: 'US' },
  { date: '2026-10-26', type: 'IE' },
  { date: '2026-11-26', type: 'US' },
  { date: '2026-12-25', type: 'IE' }, { date: '2026-12-25', type: 'UK' }, { date: '2026-12-25', type: 'US' },
  { date: '2026-12-26', type: 'IE' }, { date: '2026-12-26', type: 'UK' },
];