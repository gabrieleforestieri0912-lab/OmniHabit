import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcStreak, shiftDate, legacySeed, countInMonth, daysInMonth, isDoneToday } from '../lib/utils/streak.js';

const today = '2026-08-06';

test('calcStreak: 0 when today and yesterday are empty', () => {
  assert.equal(calcStreak([], today), 0);
  assert.equal(calcStreak(['2026-08-04'], today), 0);
});

test('calcStreak: counts consecutive days ending today', () => {
  assert.equal(calcStreak(['2026-08-06', '2026-08-05', '2026-08-04'], today), 3);
});

test('calcStreak: broken streak resets', () => {
  assert.equal(calcStreak(['2026-08-06', '2026-08-05', '2026-08-02'], today), 2);
});

test('calcStreak: yesterday keeps streak alive until today checkin', () => {
  assert.equal(calcStreak(['2026-08-05', '2026-08-04'], today), 2);
});

test('calcStreak: out of order and duplicate dates are safe', () => {
  assert.equal(calcStreak(['2026-08-04', '2026-08-06', '2026-08-05', '2026-08-06'], today), 3);
});

test('shiftDate: +-1 day', () => {
  assert.equal(shiftDate('2026-08-06', -1), '2026-08-05');
  assert.equal(shiftDate('2026-08-31', 1), '2026-09-01');
  assert.equal(shiftDate('2026-03-01', -1), '2026-02-28');
});

test('legacySeed: completed seeds including today', () => {
  const seed = legacySeed(true, 3, today);
  assert.deepEqual(seed.sort(), ['2026-08-04', '2026-08-05', '2026-08-06'].sort());
});

test('legacySeed: not completed seeds ending yesterday', () => {
  const seed = legacySeed(false, 2, today);
  assert.deepEqual(seed.sort(), ['2026-08-04', '2026-08-05'].sort());
  assert.ok(!seed.includes(today));
});

test('countInMonth & daysInMonth', () => {
  assert.equal(countInMonth(['2026-08-01', '2026-08-20', '2026-07-30'], 7), 2);
  assert.equal(daysInMonth(1, 2026), 28);
  assert.equal(daysInMonth(7, 2026), 31);
});

test('isDoneToday', () => {
  assert.equal(isDoneToday(['2026-08-06'], today), true);
  assert.equal(isDoneToday(['2026-08-05'], today), false);
});
