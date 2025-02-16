import { describe, test } from 'vitest'
import assert from 'assert';

import diffList, { Item } from './diffList';

function expandList(list: number[]) {
  return list.map((id) => ({ id }));
}

describe('diffList', () => {
  test('Reorders items, replacing one with another', () => {
    const A = expandList([1, 2, 3, 4, 5]);
    const B = expandList([2, 3, 4, 5, 6]);

    assert.deepStrictEqual(diffList(A, B, 'id'), [['move', 0, 4]]);
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
      ['move', 4, 0],
      ['move', 4, 1],
      ['move', 4, 2],
      ['move', 4, 3],
    ]);
  });

  test('Replace all items, but with less', () => {
    const A = expandList([1, 2, 3, 4, 5]);
    const B = expandList([6, 7, 8]);

    assert.deepStrictEqual(diffList(A, B, 'id'), [
      ['remove', 4],
      ['remove', 3],
    ]);
  });

  test('Remove some and reorder', () => {
    const A = expandList([1, 2, 3, 4, 5, 6]);
    const B = expandList([6, 3, 1]);

    assert.deepStrictEqual(diffList(A, B, 'id'), [
      ['remove', 4],
      ['remove', 3],
      ['remove', 1],
      ['move', 2, 0],
      ['move', 2, 1],
    ]);
  });

  test('Adds some, replaces one', () => {
    const A = expandList([1, 2, 3]);
    const B = expandList([4, 5, 6, 1, 2]);

    assert.deepStrictEqual(diffList(A, B, 'id'), [
      ['move', 2, 0],
      ['add', 1],
      ['add', 2],
    ]);
  });

  test('Replaces all items', () => {
    const A = expandList([1, 2, 3, 4]);
    const B = expandList([5, 6, 7, 8]);

    assert.deepStrictEqual(diffList(A, B, 'id'), []);
  });

  test('Moves one, replaces the rest', () => {
    const A = expandList([1, 2, 3, 4]);
    const B = expandList([5, 6, 7, 1]);

    assert.deepStrictEqual(diffList(A, B, 'id'), [['move', 0, 3]]);
  });

  test('Adds all', () => {
    const A = expandList([]);
    const B = expandList([1, 2, 3, 4]);

    assert.deepStrictEqual(diffList(A, B, 'id'), [
      ['add', 0],
      ['add', 1],
      ['add', 2],
      ['add', 3],
    ]);
  });

  test('Removes all', () => {
    const A = expandList([1, 2, 3, 4]);
    const B = expandList([]);

    assert.deepStrictEqual(diffList(A, B, 'id'), [
      ['remove', 3],
      ['remove', 2],
      ['remove', 1],
      ['remove', 0],
    ]);
  });

  test('Removes some with missing keys', () => {
    const A = [{}, { id: 2 }, { id: 3 }, {}];
    const B = [{ id: 2}, {}];

    assert.deepStrictEqual(diffList(A, B, 'id'), [
      ['remove', 3],
      ['remove', 2],
      ['move', 1, 0],
    ]);
  });

  test('Replaces all with no keys', () => {
    const A: Array<{ id?: number, x: number }> = [{ x: 1 }, { x: 2 }, { x: 3 }];
    const B: Array<{ id?: number, x: number }> = [{ x: 1 }, { x: 2 }, { x: 3 }];

    assert.deepStrictEqual(diffList(A, B, 'id'), []);
  });

  test('Removes one with no keys', () => {
    const A: Array<{ id?: number, x: number }> = [{ x: 1 }, { x: 2 }, { x: 3 }];
    const B: Array<{ id?: number, x: number }> = [{ x: 1 }, { x: 2 }];

    assert.deepStrictEqual(diffList(A, B, 'id'), [['remove', 2]]);
  });
});
