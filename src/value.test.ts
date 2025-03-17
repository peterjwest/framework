import { describe, test } from 'vitest'
import assert from 'assert';
import sinon from 'sinon';
import assertStub from 'sinon-assert-stub';

import { InputValue, Value, InputPropertyValue, ProxyValue } from './value';
import { TargetedEvent } from './util';

describe('Value', () => {
  test('Combines two Values to compute a ComputedValue', () => {
    const text = new Value('Testing');
    const length = new Value(4);
    const compute = sinon.spy((value: string, length: number): string => value.slice(0, length));
    const computedValue = Value.computed([text, length], compute);

    assert.strictEqual(computedValue.extract(), 'Test');
    assertStub.calledOnceWith(compute, ['Testing', 4]);
  });

  test('Derives a ComputedValue from a Value', () => {
    const value = new Value('Test');
    const compute = sinon.spy((value: string) => value.length);
    const computedValue = value.computed(compute);

    assert.strictEqual(computedValue.extract(), 4);
    assertStub.calledOnceWith(compute, ['Test']);
  });

  test('Calls a deriveListener when a Value is derived', () => {
    const value = new InputValue('Test');
    const listener = sinon.spy();
    value.addDeriveListener(listener);
    const computedValue = value.computed((value: string) => value.length);

    assertStub.calledOnceWith(listener, [value, computedValue]);
  });

  test("Doesn't call a removed deriveListener when a Value is derived", () => {
    const value = new InputValue('Test');
    const deriveListener = sinon.spy();
    value.addDeriveListener(deriveListener);
    const computedValue = value.computed((value: string) => value.length);

    assertStub.calledOnceWith(deriveListener, [value, computedValue]);
    deriveListener.resetHistory();

    value.removeDeriveListener(deriveListener);
    value.computed((value: string) => value.toLowerCase());

    assertStub.notCalled(deriveListener);
  });
});

describe('InputValue', () => {
  test('Updates an InputValue when changed', () => {
    const value = new InputValue(123);
    value.change(456);

    assert.strictEqual(value.extract(), 456);
  });

  test('Updates an InputValue when changed by function', () => {
    const value = new InputValue(123);
    value.change((count) => count + 123);

    assert.strictEqual(value.extract(), 246);
  });

  test('Updates a function InputValue when changed by function', () => {
    const increment = (count: number) => count + 1;
    const decrement = (count: number) => count - 1;
    const value = new InputValue(increment);
    value.change(() => decrement);

    assert.strictEqual(value.extract(), decrement);
  });

  test('Updates a ComputedValue when an InputValue changes', () => {
    const value = new InputValue('Test');
    const compute = sinon.spy((value: string) => value.length);
    const computedValue = value.computed(compute);

    assert.strictEqual(computedValue.extract(), 4);
    assertStub.calledOnceWith(compute, ['Test']);
    compute.resetHistory();

    value.change('Testing');

    assert.strictEqual(computedValue.extract(), 7);
    assertStub.calledOnceWith(compute, ['Testing']);
  });

  test('Updates multiple ComputedValues when an InputValue changes', () => {
    const value = new InputValue('Test');
    const compute1 = sinon.spy((value: string) => value.length);
    const computedValue1 = value.computed(compute1);

    const compute2 = sinon.spy((value: string) => value.toUpperCase());
    const computedValue2 = value.computed(compute2);

    assert.strictEqual(computedValue1.extract(), 4);
    assert.strictEqual(computedValue2.extract(), 'TEST');
    assertStub.calledOnceWith(compute1, ['Test']);
    assertStub.calledOnceWith(compute2, ['Test']);
    compute1.resetHistory();
    compute2.resetHistory();

    value.change('Testing');

    assert.strictEqual(computedValue1.extract(), 7);
    assert.strictEqual(computedValue2.extract(), 'TESTING');
    assertStub.calledOnceWith(compute1, ['Testing']);
    assertStub.calledOnceWith(compute2, ['Testing']);
  });

  test('Updates a nested ComputedValue when an InputValue changes', () => {
    const value = new InputValue('Test');
    const compute = sinon.spy((value: string) => value.length);
    const computedValue = value.computed(compute);
    const nestedCompute = sinon.spy((value: number) => value + 3);
    const nestedComputedValue = computedValue.computed(nestedCompute);

    assert.strictEqual(computedValue.extract(), 4);
    assertStub.calledOnceWith(compute, ['Test']);
    assert.strictEqual(nestedComputedValue.extract(), 7);
    assertStub.calledOnceWith(nestedCompute, [4]);
    compute.resetHistory();
    nestedCompute.resetHistory();

    value.change('Testing');

    assert.strictEqual(computedValue.extract(), 7);
    assertStub.calledOnceWith(compute, ['Testing']);
    assert.strictEqual(nestedComputedValue.extract(), 10);
    assertStub.calledOnceWith(nestedCompute, [7]);
  });

  test('Calls an update listener when bound to an InputValue', () => {
    const value = new InputValue('Test');
    const compute = sinon.spy((value: string) => value.length);
    const computedValue = value.computed(compute);
    const valueUpdateListener = sinon.spy();
    const computedUpdateListener = sinon.spy();
    value.addUpdateListener(valueUpdateListener);
    computedValue.addUpdateListener(computedUpdateListener);

    assertStub.calledOnceWith(valueUpdateListener, ['Test']);
    assertStub.calledOnceWith(computedUpdateListener, [4]);
  });

  test('Calls an update listener when an InputValue changes', () => {
    const value = new InputValue('Test');
    const compute = sinon.spy((value: string) => value.length);
    const computedValue = value.computed(compute);
    const valueUpdateListener = sinon.spy();
    const computedUpdateListener = sinon.spy();
    value.addUpdateListener(valueUpdateListener);
    computedValue.addUpdateListener(computedUpdateListener);
    value.change('Testing');

    assertStub.calledWith(valueUpdateListener, [['Test'], ['Testing']]);
    assertStub.calledWith(computedUpdateListener, [[4], [7]]);
  });

  test("Doesn't call a removed update listener when an InputValue changes", () => {
    const value = new InputValue('Test');
    const compute = sinon.spy((value: string) => value.length);
    const computedValue = value.computed(compute);
    const valueUpdateListener = sinon.spy();
    const computedUpdateListener = sinon.spy();
    value.addUpdateListener(valueUpdateListener);
    computedValue.addUpdateListener(computedUpdateListener);

    assertStub.calledOnceWith(valueUpdateListener, ['Test']);
    assertStub.calledOnceWith(computedUpdateListener, [4]);
    valueUpdateListener.resetHistory();
    computedUpdateListener.resetHistory();

    value.removeUpdateListener(valueUpdateListener);
    computedValue.removeUpdateListener(computedUpdateListener);

    value.change('Testing');

    assertStub.notCalled(valueUpdateListener);
    assertStub.notCalled(computedUpdateListener);
  });

  test("Doesn't update a removed ComputedValue when an InputValue changes", () => {
    const value = new InputValue('Test');
    const compute = sinon.spy((value: string) => value.length);
    const computedValue = value.computed(compute);

    assert.strictEqual(computedValue.extract(), 4);
    assertStub.calledOnceWith(compute, ['Test']);
    compute.resetHistory();

    value.removeDerivedValue(computedValue);
    value.change('Testing');

    assert.strictEqual(computedValue.extract(), 4);
    assertStub.notCalled(compute);
  });

  test("Doesn't update computed value or listeners when change is strictly equal", () => {
    type Item = { foo: string };

    const data: Item = { foo: 'bar' }
    const value = new InputValue(data);
    const compute = sinon.spy((value: Item) => value.foo);
    const computedValue = value.computed(compute);
    const valueUpdateListener = sinon.spy();
    value.addUpdateListener(valueUpdateListener);

    assertStub.calledOnceWith(compute, [data]);
    assertStub.calledOnceWith(valueUpdateListener, [data]);
    compute.resetHistory();
    valueUpdateListener.resetHistory();

    value.change(data);

    assert.strictEqual(computedValue.extract(), 'bar');
    assertStub.notCalled(compute);
    assertStub.notCalled(valueUpdateListener);
  });

  test("Doesn't update computed value when change is equal by custom function", () => {
    type Item = { id: number };

    const data: Item = { id: 1 };
    const value = new InputValue<Item>(data, (a, b) => a.id === b.id);
    const compute = sinon.spy((value: Item) => value.id);
    const computedValue = value.computed(compute);
    const valueUpdateListener = sinon.spy();
    value.addUpdateListener(valueUpdateListener);

    assertStub.calledOnceWith(compute, [data]);
    assertStub.calledOnceWith(valueUpdateListener, [data]);
    compute.resetHistory();
    valueUpdateListener.resetHistory();

    const data2 = { id: 1, foo: 'bar' };
    value.change(data2);

    assert.strictEqual(computedValue.extract(), 1);
    assertStub.notCalled(compute);
    assertStub.notCalled(valueUpdateListener);
  });

  test("Binds a listener to the property of an event", () => {
    const value = new InputValue('Value');
    const bound = value.bind<'value', Event, HTMLInputElement>('value');

    bound({ currentTarget: { value: 'New Value' } } as unknown as TargetedEvent<HTMLInputElement, Event>);

    assert.strictEqual(value.extract(), 'New Value');
  });

  test("Binds a listener to the property of an event", () => {
    const value = new InputValue('Value');
    const bound = value.bind<'value', Event, HTMLInputElement>('value');

    bound({ currentTarget: { value: 'New Value' } } as unknown as TargetedEvent<HTMLInputElement, Event>);

    assert.strictEqual(value.extract(), 'New Value');
  });

  test("Binds a listener to the property of an event using a transform function", () => {
    const value = new InputValue(0);
    const bound = value.bind<'value', Event, HTMLInputElement>('value', (value) => value.length);
    bound({ currentTarget: { value: '123456789' } } as unknown as TargetedEvent<HTMLInputElement, Event>);

    assert.strictEqual(value.extract(), 9);
  });

  test("Binds a listener to a method of an event", () => {
    const value = new InputValue<Function | undefined>(undefined);
    const bound = value.bind<'checkValidity', Event, HTMLInputElement>('checkValidity');
    function checkValidity() {}
    bound({ currentTarget: { checkValidity } } as unknown as TargetedEvent<HTMLInputElement, Event>);

    assert.strictEqual(value.extract(), checkValidity);
  });

  test("Gets an InputPropertyValue from an InputValue", () => {
    const value = new InputValue({ foo: 'bar' });
    const innerValue = value.get('foo');
    assert.strictEqual(innerValue.extract(), 'bar');
  });

  test("Gets an InputPropertyValue from an InputValue", () => {
    const value = new InputValue({ foo: 'bar' });
    const innerValue = value.get('foo');
    assert(innerValue instanceof InputPropertyValue);
    assert.strictEqual(innerValue.extract(), 'bar');
  });

  test("Changing an InputPropertyValue updates the InputValue", () => {
    const value = new InputValue({ foo: 'bar', zim: 'gir' });
    const innerValue = value.get('foo');
    innerValue.change('zip');

    assert.deepStrictEqual(value.extract(), { foo: 'zip', zim: 'gir' });
  });

  test("Changing an InputPropertyValue by function updates the InputValue", () => {
    const value = new InputValue({ foo: 'bar', zim: 'gir' });
    const innerValue = value.get('foo');
    innerValue.change((value) => value.toUpperCase());

    assert.deepStrictEqual(value.extract(), { foo: 'BAR', zim: 'gir' });
  });

  test("Changing an InputValue updates an InputPropertyValue", () => {
    const value = new InputValue({ foo: 'bar', zim: 'gir' });
    const innerValue = value.get('foo');
    value.change({ foo: 'zip', zim: 'gir' });

    assert.deepStrictEqual(innerValue.extract(), 'zip');
  });

  test("Changing an InputValue doesn't update an InputPropertyValue if equal", () => {
    const value = new InputValue({ foo: 'bar', zim: 'zig' });
    const innerValue = value.get('foo');
    const updateListener = sinon.spy();
    innerValue.addUpdateListener(updateListener)
    updateListener.resetHistory();
    value.change({ foo: 'bar', zim: 'zig' });

    assertStub.notCalled(updateListener);
    assert.deepStrictEqual(innerValue.extract(), 'bar');
  });

  test("Gets a nested InputPropertyValue from an InputValue", () => {
    const value = new InputValue({ foo: { bar: 'zim' } });
    const innerValue = value.get('foo');
    const innerInnerValue = innerValue.get('bar');
    assert(innerInnerValue instanceof InputPropertyValue);
    assert.strictEqual(innerInnerValue.extract(), 'zim');
  });

  test("Gets an InputPropertyValue from an InputValue with a custom equality function", () => {
    const value = new InputValue({ foo: { id: 1, bar: 'zim' } });
    const isEqual = (a: { id: number }, b: { id: number }) => a.id === b.id;
    const innerValue = value.get('foo', isEqual);

    assert.strictEqual(innerValue.isEqual, isEqual);
  });

  test("Does not change an InputPropertyValue when isEqual to previous value", () => {
    const value = new InputValue({ foo: { id: 1, bar: 'zim' } });
    const innerValue = value.get('foo', (a, b) => a.id === b.id);

    innerValue.change({ id: 1, bar: 'gir' });
    assert.deepStrictEqual(innerValue.extract(), { id: 1, bar: 'zim' });
  });

  test("Changing a nested InputPropertyValue updates an InputValue and InputPropertyValue", () => {
    const value = new InputValue({ foo: { bar: 'zim' } });
    const innerValue = value.get('foo');
    const innerInnerValue = innerValue.get('bar');
    innerInnerValue.change('gir');

    assert.deepStrictEqual(value.extract(), { foo: { bar: 'gir' } });
    assert.deepStrictEqual(innerValue.extract(), { bar: 'gir' });
  });

  test("Changing an intermediate InputPropertyValue updates an InputValue and nested InputPropertyValue", () => {
    const value = new InputValue({ foo: { bar: 'zim' } });
    const innerValue = value.get('foo');
    const innerInnerValue = innerValue.get('bar');
    innerValue.change({ bar: 'gir' });

    assert.deepStrictEqual(value.extract(), { foo: { bar: 'gir' } });
    assert.strictEqual(innerInnerValue.extract(), 'gir');
  });

  test("Changing an InputValue updates a nested InputPropertyValue", () => {
    const value = new InputValue({ foo: { bar: 'zim' } });
    const innerValue = value.get('foo');
    const innerInnerValue = innerValue.get('bar');
    value.change({ foo: { bar: 'gir' } });

    assert.strictEqual(innerInnerValue.extract(), 'gir');
  });

  test("Changing an InputPropertyValue does not update an unrelated InputPropertyValue", () => {
    const value = new InputValue({ foo: { bar: 'zim' }, gir: 'dig'});
    const innerValue1 = value.get('foo');
    const innerValue2 = value.get('gir');
    const updateListener = sinon.spy();
    innerValue2.addUpdateListener(updateListener);
    updateListener.resetHistory();
    innerValue1.change({ bar: 'dug' });

    assertStub.notCalled(updateListener);
  });

  test("Changing an InputPropertyValue triggers update listeners in parent InputValues", () => {
    const value = new InputValue({ foo: { bar: 'zim' }});
    const innerValue = value.get('foo');
    const innerInnerValue = innerValue.get('bar');
    const updateListener = sinon.spy();
    const innerUpdateListener = sinon.spy();
    value.addUpdateListener(updateListener);
    innerValue.addUpdateListener(innerUpdateListener);
    updateListener.resetHistory();
    innerUpdateListener.resetHistory();
    innerInnerValue.change('gir');

    assertStub.calledOnceWith(updateListener, [{ foo: { bar: 'gir' }}]);
    assertStub.calledOnceWith(innerUpdateListener, [{ bar: 'gir' }]);
  });

  test("Changing an InputPropertyValue updates dervied values in parent InputValues", () => {
    const value = new InputValue({ foo: { bar: 'zim' }});
    const innerValue = value.get('foo');
    const innerInnerValue = innerValue.get('bar');
    const compute = sinon.spy();
    const innerCompute = sinon.spy();
    value.computed(compute);
    innerValue.computed(innerCompute);
    compute.resetHistory();
    innerCompute.resetHistory();
    innerInnerValue.change('gir');

    assertStub.calledOnceWith(compute, [{ foo: { bar: 'gir' }}]);
    assertStub.calledOnceWith(innerCompute, [{ bar: 'gir' }]);
  });

  test("Changing an InputValue triggers update listeners in child InputPropertyValue", () => {
    const value = new InputValue({ foo: { bar: 'zim' }});
    const innerValue = value.get('foo');
    const innerInnerValue = innerValue.get('bar');
    const innerUpdateListener = sinon.spy();
    const innerInnerUpdateListener = sinon.spy();
    innerValue.addUpdateListener(innerUpdateListener);
    innerInnerValue.addUpdateListener(innerInnerUpdateListener);
    innerUpdateListener.resetHistory();
    innerInnerUpdateListener.resetHistory();
    value.change({ foo: { bar: 'gir' }});

    assertStub.calledOnceWith(innerUpdateListener, [{ bar: 'gir' }]);
    assertStub.calledOnceWith(innerInnerUpdateListener, ['gir']);
  });

  test("Changing an InputPropertyValue updates dervied values in child InputPropertyValue", () => {
    const value = new InputValue({ foo: { bar: 'zim' }});
    const innerValue = value.get('foo');
    const innerInnerValue = innerValue.get('bar');
    const innerCompute = sinon.spy();
    const innerInnerCompute = sinon.spy();
    innerValue.computed(innerCompute);
    innerInnerValue.computed(innerInnerCompute);
    innerCompute.resetHistory();
    innerInnerCompute.resetHistory();
    value.change({ foo: { bar: 'gir' }});

    assertStub.calledOnceWith(innerCompute, [{ bar: 'gir' }]);
    assertStub.calledOnceWith(innerInnerCompute, ['gir']);
  });

  test("Doesn't update a removed InputPropertyValue when an InputValue is changed", () => {
    const value = new InputValue({ foo: { bar: 'zim' }});
    const innerValue = value.get('foo');
    value.removePropertyValue(innerValue);
    value.change({ foo: { bar: 'gir' }});

    assert.deepStrictEqual(innerValue.extract(), { bar: 'zim' });
  });

  test("Getting an InputPropertyValue from an InputValue triggers a derive listener", () => {
    const value = new InputValue({ foo: { bar: 'zim' }});
    const deriveListener = sinon.spy();
    value.addDeriveListener(deriveListener);
    const innerValue = value.get('foo');

    assertStub.calledOnceWith(deriveListener, [value, innerValue]);
  });

  test("Gets an InputPropertyValue from a ComputedValue", () => {
    const value = new InputValue({ foo: 'bar' });
    const computedValue = value.computed((value) => ({ foo: value.foo.toUpperCase() }));
    const innerValue = computedValue.get('foo');

    assert.strictEqual(innerValue.extract(), 'BAR');
  });

  test("Creates a ProxyValue from an InputValue", () => {
    const value = new InputValue('foo');
    const proxyValue = new ProxyValue(value);

    assert.strictEqual(proxyValue.extract(), 'foo');
  });

  test("Updates a ProxyValue when an InputValue updates", () => {
    const value = new InputValue('foo');
    const proxyValue = new ProxyValue(value);
    value.change('bar');

    assert.strictEqual(proxyValue.extract(), 'bar');
  });

  test("Updates a ProxyValue target", () => {});
  test("Gets an InputPropertyValue from a ProxyValue", () => {});
  test("Deactivates a ProxyValue", () => {});
});
