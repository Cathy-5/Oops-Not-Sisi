import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_PROTECTED_NAME,
  STARTING_LIVES,
  START_TIME,
  canShowComboHole,
  canShowDoubleSisi,
  getBetterScore,
  getProtectedName,
  getSisiPhase,
  getSisiStatus,
  getTargetMoleCount,
  getTargetSisiCount,
} from '../.test-build/src/gameLogic.js';

test('default game settings give the player enough time and lives', () => {
  assert.equal(START_TIME, 30);
  assert.equal(STARTING_LIVES, 3);
});

test('difficulty adds groundhogs gradually based on elapsed play time', () => {
  assert.equal(getTargetMoleCount(0), 3);
  assert.equal(getTargetMoleCount(29), 3);
  assert.equal(getTargetMoleCount(30), 4);
  assert.equal(getTargetMoleCount(59), 4);
  assert.equal(getTargetMoleCount(60), 5);
});

test('Sisi count increases but always stays lower than groundhog count', () => {
  const checkpoints = [0, 30, 60, 90, 120];

  for (const elapsedTime of checkpoints) {
    const moleCount = getTargetMoleCount(elapsedTime);
    const sisiCount = getTargetSisiCount(elapsedTime, moleCount);

    assert.ok(sisiCount < moleCount);
  }
});

test('Sisi trick stages unlock in the intended order', () => {
  assert.equal(getSisiPhase(59), 'Regular');
  assert.equal(getSisiPhase(60), 'Masked');
  assert.equal(getSisiPhase(90), 'Mixed');
  assert.equal(getSisiPhase(120), 'Disaster');
});

test('combo holes and double-Sisi holes unlock only after the right survival time', () => {
  assert.equal(canShowComboHole(89), false);
  assert.equal(canShowComboHole(90), true);
  assert.equal(canShowDoubleSisi(119), false);
  assert.equal(canShowDoubleSisi(120), true);
});

test('mixed Sisi alternates between disguised and regular appearances', () => {
  assert.equal(getSisiStatus(90, 0), 'disguised-sisi');
  assert.equal(getSisiStatus(90, 1), 'sisi');
});

test('protected name handles empty user input safely', () => {
  assert.equal(getProtectedName(undefined), DEFAULT_PROTECTED_NAME);
  assert.equal(getProtectedName(null), DEFAULT_PROTECTED_NAME);
  assert.equal(getProtectedName('   '), DEFAULT_PROTECTED_NAME);
  assert.equal(getProtectedName('mom'), 'mom');
  assert.equal(getProtectedName('  Luna  '), 'Luna');
});

test('best score only updates when current score is higher', () => {
  assert.equal(getBetterScore(12, 20), 20);
  assert.equal(getBetterScore(22, 20), 22);
});
