// src/utils/constants.js

export const DAY_WIDTH = 40;

// Anchor: Jan 8, 2026 (Start of Sprint 1)
export const ANCHOR_DATE = new Date('2026-01-08T00:00:00');

export const COLOR_THEMES = [
  { name: 'Purple',  text: '#f9eeff', main: '#C97CF4' },
  { name: 'Dark Purple',  text: '#f9eeff', main: '#8b5cf6' },
  { name: 'Blue',    text: '#e5f6ff', main: '#669DF1' },
  { name: 'Dark Blue',    text: '#e5f6ff', main: '#1868DB' },
  { name: 'Green',   text: '#f1fff4', main: '#4BCE97' },
  { name: 'Dark Green',   text: '#f1fff4', main: '#1F845A' },
  { name: 'Teal',     text: '#cdefff', main: '#6CC3E0' },
  { name: 'Dark Teal',     text: '#cdefff', main: '#227D9B' },
  { name: 'Yellow',   text: '#322905', main: '#EED12B' },
  { name: 'Dark Yellow',   text: '#fff4e7', main: '#BD5B00' },
  { name: 'Red',     text: '#ffe3e3', main: '#F87168' },
  { name: 'Dark Red',     text: '#ffe3e3', main: '#C9372C' },
  { name: 'Gray',  text: '#e1e1e1', main: '#8C8F97' },
  { name: 'Dark Gray',  text: '#e1e1e1', main: '#6B6E76' },
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