import { describe, test } from 'vitest'
import assert from 'assert';

import diffList, { ACTIONS } from './diffList';

function expandList(list: number[]) {
  return list.map((id) => ({ id }));
}

describe('diffList', () => {
  test('Reorders items, replacing one with another', () => {
    const A = expandList([1, 2, 3, 4, 5]);
    const B = expandList([2, 3, 4, 5, 6]);

    assert.deepStrictEqual(diffList(A, B, 'id'), [[ACTIONS.replace, 0, 4], [ACTIONS.move, 0, 4]]);
  });

  test('No changes', () => {
    const A = expandList([1, 2, 3, 4, 5]);
    const B = expandList([1, 2, 3, 4, 5]);

    assert.deepStrictEqual(diffList(A, B, 'id'), []);
  });

  test('Reverse order', () => {
    const A = expandList([1, 2, 3, 4, 5]);
    const B = expandList([5, 4, 3, 2, 1]);

    assert.deepStrictEqual(diffList(A, B, 'id'), [
      [ACTIONS.move, 4, 0],
      [ACTIONS.move, 4, 1],
      [ACTIONS.move, 4, 2],
      [ACTIONS.move, 4, 3],
    ]);
  });

  test('Replace all items, but with less', () => {
    const A = expandList([1, 2, 3, 4, 5]);
    const B = expandList([6, 7, 8]);

    assert.deepStrictEqual(diffList(A, B, 'id'), [
      [ACTIONS.remove, 4],
      [ACTIONS.remove, 3],
      [ACTIONS.replace, 0, 0],
      [ACTIONS.replace, 1, 1],
      [ACTIONS.replace, 2, 2],
    ]);
  });

  test('Remove some and reorder', () => {
    const A = expandList([1, 2, 3, 4, 5, 6]);
    const B = expandList([6, 3, 1]);

    assert.deepStrictEqual(diffList(A, B, 'id'), [
      [ACTIONS.remove, 4],
      [ACTIONS.remove, 3],
      [ACTIONS.remove, 1],
      [ACTIONS.move, 2, 0],
      [ACTIONS.move, 2, 1],
    ]);
  });

  test('Adds some, replaces one', () => {
    const A = expandList([1, 2, 3]);
    const B = expandList([4, 5, 6, 1, 2]);

    assert.deepStrictEqual(diffList(A, B, 'id'), [
      [ACTIONS.replace, 2, 0],
      [ACTIONS.move, 2, 0],
      [ACTIONS.add, 1],
      [ACTIONS.add, 2],
    ]);
  });

  test('Replaces all items', () => {
    const A = expandList([1, 2, 3, 4]);
    const B = expandList([5, 6, 7, 8]);

    assert.deepStrictEqual(diffList(A, B, 'id'), [
      [ACTIONS.replace, 0, 0],
      [ACTIONS.replace, 1, 1],
      [ACTIONS.replace, 2, 2],
      [ACTIONS.replace, 3, 3],
    ]);
  });

  test('Moves one, replaces the rest', () => {
    const A = expandList([1, 2, 3, 4]);
    const B = expandList([5, 6, 7, 1]);

    assert.deepStrictEqual(diffList(A, B, 'id'), [
      [ACTIONS.replace, 1, 0],
      [ACTIONS.replace, 2, 1],
      [ACTIONS.replace, 3, 2],
      [ACTIONS.move, 0, 3]
    ]);
  });

  test('Adds all', () => {
    const A = expandList([]);
    const B = expandList([1, 2, 3, 4]);

    assert.deepStrictEqual(diffList(A, B, 'id'), [
      [ACTIONS.add, 0],
      [ACTIONS.add, 1],
      [ACTIONS.add, 2],
      [ACTIONS.add, 3],
    ]);
  });

  test('Removes all', () => {
    const A = expandList([1, 2, 3, 4]);
    const B = expandList([]);

    assert.deepStrictEqual(diffList(A, B, 'id'), [
      [ACTIONS.remove, 3],
      [ACTIONS.remove, 2],
      [ACTIONS.remove, 1],
      [ACTIONS.remove, 0],
    ]);
  });

  test('Removes some with missing keys', () => {
    const A = [{}, { id: 2 }, { id: 3 }, {}];
    const B = [{ id: 2}, {}];

    assert.deepStrictEqual(diffList(A, B, 'id'), [
      [ACTIONS.remove, 3],
      [ACTIONS.remove, 2],
      [ACTIONS.replace, 0, 1],
      [ACTIONS.move, 1, 0],
    ]);
  });

  test('Replaces all with no keys', () => {
    const A: Array<{ id?: number, x: number }> = [{ x: 1 }, { x: 2 }, { x: 3 }];
    const B: Array<{ id?: number, x: number }> = [{ x: 1 }, { x: 2 }, { x: 3 }];

    assert.deepStrictEqual(diffList(A, B, 'id'), [
      [ACTIONS.replace, 0, 0],
      [ACTIONS.replace, 1, 1],
      [ACTIONS.replace, 2, 2],
    ]);
  });

  test('Removes one with no keys', () => {
    const A: Array<{ id?: number, x: number }> = [{ x: 1 }, { x: 2 }, { x: 3 }];
    const B: Array<{ id?: number, x: number }> = [{ x: 1 }, { x: 2 }];

    assert.deepStrictEqual(diffList(A, B, 'id'), [
      [ACTIONS.remove, 2],
      [ACTIONS.replace, 0, 0],
      [ACTIONS.replace, 1, 1],
    ]);
  });

  test('Reorders various items', () => {
    const A = expandList([1, 2, 3, 4, 5]);
    const B = expandList([5, 2, 1, 4, 3]);

    assert.deepStrictEqual(diffList(A, B, 'id'), [
      [ACTIONS.move, 4, 0],
      [ACTIONS.move, 4, 3],
      [ACTIONS.move, 1, 2],
    ]);
  });

  test('Deals with duplicate keys', () => {
    const A = expandList([1, 1, 3, 4, 5]);
    const B = expandList([1, 1, 2, 3, 4]);

    assert.deepStrictEqual(diffList(A, B, 'id'), [
      [ACTIONS.replace, 4, 2],
      [ACTIONS.move, 4, 2],
    ]);
  });

  test('Deals with duplicate keys on raw objects', () => {
    const A = [1, 1, 3, 4, 5];
    const B = [1, 1, 2, 3, 4];

    assert.deepStrictEqual(diffList(A, B), [
      [ACTIONS.replace, 4, 2],
      [ACTIONS.move, 4, 2],
    ]);
  });
});
