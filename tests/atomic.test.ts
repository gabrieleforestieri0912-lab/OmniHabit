import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  daysSinceLastCheckin,
  isNeverMissTwiceAtRisk,
  habitConsistency
} from '../lib/utils/atomic.js';

const today = '2026-08-06';

test('daysSinceLastCheckin: never completed is Infinity', () => {
  assert.equal(daysSinceLastCheckin([], today), Infinity);
});

test('daysSinceLastCheckin: counts full days since last check-in', () => {
  assert.equal(daysSinceLastCheckin(['2026-08-06'], today), 0);
  assert.equal(daysSinceLastCheckin(['2026-08-05'], today), 1);
  assert.equal(daysSinceLastCheckin(['2026-08-03'], today), 3);
});

test('isNeverMissTwiceAtRisk: false for new habits and when on track', () => {
  assert.equal(isNeverMissTwiceAtRisk([], today), false);
  assert.equal(isNeverMissTwiceAtRisk(['2026-08-06'], today), false);
  assert.equal(isNeverMissTwiceAtRisk(['2026-08-05'], today), false); // done yesterday, not yet today
});

test('isNeverMissTwiceAtRisk: true when missed yesterday and today (would be the 2nd miss)', () => {
  assert.equal(isNeverMissTwiceAtRisk(['2026-08-04'], today), true);
  assert.equal(isNeverMissTwiceAtRisk(['2026-08-02', '2026-08-03'], today), true);
});

test('habitConsistency: 100% for a single check-in today', () => {
  assert.equal(habitConsistency(['2026-08-06'], today), 100);
});

test('habitConsistency: proportion of days done since the first check-in', () => {
  // 3 check-ins, first one 6 days ago (08-01) → 3/6 = 50%
  assert.equal(habitConsistency(['2026-08-06', '2026-08-04', '2026-08-01'], today), 50);
  // consecutive check-ins since the first one → 100%
  assert.equal(habitConsistency(['2026-08-06', '2026-08-05', '2026-08-04'], today), 100);
});

test('habitConsistency: 0 for never completed', () => {
  assert.equal(habitConsistency([], today), 0);
});
