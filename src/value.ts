import { strictEquals, TargetedEvent } from './util';

/** Function interface to check if two values are considered equal */
export interface IsEqual<Type> {
  (prev: Type, next: Type): boolean;
}

/** Extracts Type from Value<Type> */
export type ExtractValue<Type> = Type extends Value<infer X> ? X : never;

/** Extracts each Type from a tuple of Value<Type> */
type ExtractValues<Type extends Value<unknown>[]> = {
  [Index in keyof Type]: ExtractValue<Type[Index]>;
} & {length: Type['length']};

/** Value which is derived from another Value */
export type DerivedValue<Type> = ProxyValue<Type> | ComputedValue<Type> | InputPropertyValue<Type, any, any>;

/** A signal based wrapper for values */
export abstract class Value<Type> {
  /** Values which use this Value in their computation */
  derivedValues: Set<DerivedValue<unknown>> = new Set();

  /** Listeners which fire when this Value is used to derive another value */
  deriveListeners: Array<(value: Value<unknown>, derived: DerivedValue<unknown>) => void> = [];

  /** Listeners which fire when this Value is updated */
  updateListeners: Set<(value: any) => void> = new Set();

  /** Creates a new ComputedValue derived from all inputs */
  static computed<Inputs extends Value<unknown>[], ResultType>(
    inputs: [...Inputs],
    compute: (...values: ExtractValues<Inputs>) => ResultType,
  ): ComputedValue<ResultType> {
    const value = new ComputedValue(() => compute(...inputs.map((input) => input.extract()) as any));
    for (const input of inputs) {
      input.addDerivedValue(value);
    }
    return value;
  }

  /** Adds a Value which has been derived from this Value and triggers all deriveListeners */
  addDerivedValue(value: DerivedValue<unknown>) {
    this.derivedValues.add(value);
    for (const listener of this.deriveListeners) {
      listener(this, value);
    }
  }

  /** Removes a Value which is no longer derived from this Value */
  removeDerivedValue(value: DerivedValue<unknown>) {
    this.derivedValues.delete(value);
  }

  /** Adds an update listener which triggers the value of this Value updates */
  addUpdateListener(compute: (value: Type) => void) {
    this.updateListeners.add(compute);
    compute(this.extract());
  }

  /** Adds an update listener */
  removeUpdateListener(compute: (value: Type) => void) {
    this.updateListeners.delete(compute);
  }

  /** Adds a listener which triggers when a Value is derived from this Value */
  addDeriveListener(listener: (value: Value<unknown>, derived: DerivedValue<unknown>) => void) {
    this.deriveListeners.push(listener);
  }

  /** Extracts the wrapped value */
  abstract extract(): Type

  /** Returns a new ComputedValue derived from this Value using `compute` */
  computed<ResultType>(compute: (value: Type) => ResultType): ComputedValue<ResultType> {
    return Value.computed([this], compute);
  }

  /**
   * Returns a new ComputedValue which updates after the original Value
   * has not changed for `time` milliseconds.
   */
  // debounce(time: number, leadingEdge = false) {
  //   // TODO: setup timers to update computed value
  //   return this;
  // }
}

export class StaticValue<Type> extends Value<Type> {
  protected value: Type;
  isEqual: IsEqual<Type>;

  constructor(value: Type, isEqual = strictEquals) {
    super();
    this.value = value;
    this.isEqual = isEqual;
  }

  extract() {
    return this.value;
  }
}

export class InputValue<Type> extends Value<Type> {
  protected value: Type;
  isEqual: IsEqual<Type>;

  constructor(value: Type, isEqual = strictEquals) {
    super();
    this.value = value;
    this.isEqual = isEqual;
  }

  extract() {
    return this.value;
  }

  change(value: Type) {
    if (this.isEqual(this.value, value)) return;
    this.value = value;

    for (const listener of this.updateListeners) {
      listener(this.value);
    }
    for (const derived of this.derivedValues) {
      derived.update();
    }
  }

  /** Propagates a change from a child property value */
  propagateChange(value: Type) {
    if (this.isEqual(this.value, value)) return;
    this.value = value;

    for (const listener of this.updateListeners) {
      listener(this.value);
    }
  }

  /** Returns a new InputPropertyValue for this Value */
  get<Key extends keyof Type>(path: Key): InputPropertyValue<Type[Key], Type, Key> {
    return new InputPropertyValue(this, path);
  }

  /**
   * Returns a function which updates a Value based on a property of the currentTarget of an Event.
   * A transform function must be passed if the types do not match
   */
  bind<Property extends keyof Element, TypedEvent extends Event, Element extends EventTarget & { [P in Property]: Type }>(
    property: Property,
  ): (event: TargetedEvent<Element, TypedEvent>) => void;
  bind<Property extends keyof Element, TypedEvent extends Event, Element extends EventTarget>(
    property: Property,
    transform: (value: Element[Property]) => Type,
  ): (event: TargetedEvent<Element, TypedEvent>) => void;
  bind<Property extends keyof Element, TypedEvent extends Event, Element extends EventTarget | (EventTarget & { [P in Property]: Type })>(
    property: Property,
    transform?: (value: Element[Property]) => Type,
  ): (event: TargetedEvent<Element, TypedEvent>) => void {
    return (event: TargetedEvent<Element, TypedEvent>) => {
      const value = event.currentTarget[property];
      this.change(transform ? transform(value): (value as Type));
    };
  }
}

export class ComputedValue<Type> extends Value<Type> {
  protected value: Type;
  compute: () => Type;

  constructor(compute: () => Type) {
    super();
    this.value = compute();
    this.compute = compute;
  }

  extract() {
    return this.value;
  }

  update() {
    this.value = this.compute();
    for (const derived of this.derivedValues) {
      derived.update();
    }
    for (const listener of this.updateListeners) {
      listener(this.value);
    }
  }

  /** Returns a new ComputedValue from a property of this Value */
  get<Key extends keyof Type>(path: Key): ComputedValue<Type[Key]> {
    return this.computed((value) => value[path]);
  }
}

export class ProxyValue<Type> extends Value<Type> {
  target!: Value<Type>;

  constructor(target: Value<Type>) {
    super();
    this.setTarget(target);
  }

  setTarget(target: Value<Type>) {
    if (this.target) this.target.removeDerivedValue(this);
    this.target = target;
    this.target.addDerivedValue(this);
    this.update();
  }

  update() {
    const value = this.extract();
    for (const listener of this.updateListeners) {
      listener(value);
    }

    for (const derived of this.derivedValues) {
      derived.update();
    }
  }

  /** Returns a new ComputedValue from a property of this Value's target */
  get<Key extends keyof Type>(path: Key): ComputedValue<Type[Key]> {
    return this.target.computed((value) => value[path]);
  }

  deactivate() {
    this.target.removeDerivedValue(this);
  }

  extract() {
    return this.target.extract();
  }
}

// TODO: Non-input property value(?)

export class InputPropertyValue<Type extends ParentType[Key], ParentType, Key extends keyof ParentType> extends Value<Type> {
    parent!: InputValue<ParentType> | InputPropertyValue<ParentType, any, any>;
    property: Key;
    isEqual: IsEqual<ParentType[Key]>;

    constructor(
      parent: InputValue<ParentType> | InputPropertyValue<ParentType, any, any>,
      property: Key,
      isEqual = strictEquals,
    ) {
      super();
      this.setParent(parent);
      this.property = property;
      this.isEqual = isEqual;
    }

    setParent(parent: InputValue<ParentType> | InputPropertyValue<ParentType, any, any>) {
      if (this.parent) this.parent.removeDerivedValue(this);
      this.parent = parent;
      this.parent.addDerivedValue(this);
      this.update();
    }

    // TODO: Support function
    change(value: ParentType[Key]) {
      const parentValue = this.parent.extract();
      if (this.isEqual(parentValue[this.property], value)) return;
      parentValue[this.property] = value;
      this.parent.propagateChange(parentValue);

      for (const listener of this.updateListeners) {
        listener(value);
      }
      for (const derived of this.derivedValues) {
        derived.update();
      }

    }

    // TODO: This currently ignores derived values, but we need to only ignore property values,
    // since the relevant property has been updated already, computed values need to be re-run

    /** Propagates a change from a child property value up through parents. */
    propagateChange(value: Type) {
      const parentValue = this.parent.extract();
      parentValue[this.property] = value;
      this.parent.propagateChange(parentValue);

      for (const listener of this.updateListeners) {
        listener(value);
      }
    }

    // TODO: Support isEqual on all methods

    /** Returns a new InputPropertyValue for this Value */
    get<Key extends keyof Type>(path: Key): InputPropertyValue<Type[Key], Type, Key> {
      return new InputPropertyValue(this, path);
    }

    update() {
      const value = this.extract();
      for (const listener of this.updateListeners) {
        listener(value);
      }
      for (const derived of this.derivedValues) {
        derived.update();
      }
    }

    deactivate() {
      this.parent.removeDerivedValue(this);
    }

    extract(): Type {
      return this.parent.extract()[this.property] as Type;
    }
  }

export class DeriveValueListener {
  children: Set<DeriveValueListener> = new Set();
  derived: Map<Value<any>, Value<any>> = new Map();
  ref: any;

  constructor(values: Value<any>[], parent?: DeriveValueListener) {
    for (const value of values) {
      value.addDeriveListener(this.addValue);
    }
    if (parent) parent.children.add(this);
  }

  addValue = (value: Value<any>, derived: DerivedValue<unknown>) => {
    this.derived.set(value, derived);
    for (const child of this.children) {
      child.addValue(value, derived);
    }
  }

  removeChild(child: DeriveValueListener) {
    this.children.delete(child);
  }

  extract() {
    const derived = this.derived;
    this.derived = new Map();
    return derived;
  }
}
