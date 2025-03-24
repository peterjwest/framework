import { describe, test } from 'vitest'
import assert from 'assert';
import sinon from 'sinon';
import assertStub from 'sinon-assert-stub';

import { InputValue } from './value';
import IndexRange from './IndexRange';

import ListIndexManager from './ListIndexManager';

/** Gets a chain of IndexRange as an array */
function getIndexChain(range: IndexRange): IndexRange[] {
    return [range, ...(range.child ? getIndexChain(range.child) : [])];
}

describe('ListIndexManager', () => {
  test('Creates an output range which follows the input range', () => {
    const inputRange = new IndexRange();
    const listManager = new ListIndexManager(inputRange);

    assert.strictEqual(inputRange.child, listManager.outputRange);
  });

  test('Adds an item to the list manager', () => {
    const inputRange = new IndexRange();
    const listManager = new ListIndexManager(inputRange);

    const value = new InputValue([1, 2, 3])

    const metadata = {
        value: value.get(0),
        range: new IndexRange(),
        unrender: () => {},
    }
    listManager.addToList(0, metadata);

    assert.deepStrictEqual(listManager.list, [metadata]);
    assert.deepStrictEqual(
        getIndexChain(inputRange),
        [inputRange, metadata.range, listManager.outputRange],
    );
  });

  test('Adds multiple items to the list manager', () => {
    const inputRange = new IndexRange();
    const listManager = new ListIndexManager(inputRange);

    const value = new InputValue([1, 2, 3])

    const metadata1 = { value: value.get(0), range: new IndexRange(), unrender: () => {} };
    listManager.addToList(0, metadata1);
    const metadata2 = { value: value.get(1), range: new IndexRange(), unrender: () => {} };
    listManager.addToList(1, metadata2);
    const metadata3 = { value: value.get(2), range: new IndexRange(), unrender: () => {} };
    listManager.addToList(0, metadata3);

    assert.deepStrictEqual(listManager.list, [metadata3, metadata1, metadata2]);
    assert.deepStrictEqual(
        getIndexChain(inputRange),
        [inputRange, metadata3.range, metadata1.range, metadata2.range, listManager.outputRange],
    );
  });

  test('Removes an item from the list manager', () => {
    const inputRange = new IndexRange();
    const listManager = new ListIndexManager(inputRange);

    const value = new InputValue([1, 2, 3])

    const metadata1 = { value: value.get(0), range: new IndexRange(), unrender: () => {} };
    listManager.addToList(0, metadata1);
    const metadata2 = { value: value.get(1), range: new IndexRange(), unrender: () => {} };
    listManager.addToList(1, metadata2);
    const metadata3 = { value: value.get(2), range: new IndexRange(), unrender: () => {} };
    listManager.addToList(2, metadata3);
    listManager.removeFromList(1);

    assert.deepStrictEqual(listManager.list, [metadata1, metadata3]);
    assert.deepStrictEqual(
        getIndexChain(inputRange),
        [inputRange, metadata1.range, metadata3.range, listManager.outputRange],
    );
  });

  test('Gets an IndexRange by index', () => {
    const inputRange = new IndexRange();
    const listManager = new ListIndexManager(inputRange);

    const value = new InputValue([1, 2, 3])

    const metadata1 = { value: value.get(0), range: new IndexRange(), unrender: () => {} };
    listManager.addToList(0, metadata1);
    const metadata2 = { value: value.get(1), range: new IndexRange(), unrender: () => {} };
    listManager.addToList(1, metadata2);

    assert.strictEqual(listManager.getRange(-1), inputRange);
    assert.strictEqual(listManager.getRange(0), metadata1.range);
    assert.strictEqual(listManager.getRange(1), metadata2.range);
    assert.strictEqual(listManager.getRange(2), listManager.outputRange);
  });

  test('Throws an error when getting an IndexRange out of range', () => {
    const inputRange = new IndexRange();
    const listManager = new ListIndexManager(inputRange);

    const value = new InputValue([1, 2, 3])

    const metadata = { value: value.get(0), range: new IndexRange(), unrender: () => {} };
    listManager.addToList(0, metadata);

    assert.throws(() => {
        listManager.getRange(-2);
    });
    assert.throws(() => {
        listManager.getRange(2);
    });
  });

  test('Disconnects the outputRange child during a batch', () => {
    const inputRange = new IndexRange();
    const listManager = new ListIndexManager(inputRange);

    const value = new InputValue([1, 2, 3])

    const metadata = { value: value.get(0), range: new IndexRange(), unrender: () => {} };
    listManager.addToList(0, metadata);

    const nextChild = listManager.outputRange.createChild();
    const endBatch = listManager.startBatch();

    assert.strictEqual(listManager.outputRange.child, undefined);
    endBatch();
    assert.strictEqual(listManager.outputRange.child, nextChild);
  });

  test('Updates all Value properties', () => {
    const inputRange = new IndexRange();
    const listManager = new ListIndexManager(inputRange);

    const value = new InputValue([1, 2, 3])

    const metadata1 = { value: value.get(0), range: new IndexRange(), unrender: () => {} };
    listManager.addToList(0, metadata1);
    const metadata2 = { value: value.get(1), range: new IndexRange(), unrender: () => {} };
    listManager.addToList(0, metadata2);

    assert.strictEqual(metadata1.value.property, 0);
    assert.strictEqual(metadata2.value.property, 1);
    listManager.updateValues();
    assert.strictEqual(metadata1.value.property, 1);
    assert.strictEqual(metadata2.value.property, 0);
  })
});
