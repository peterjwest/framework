import { strictEquals, sortWithIndexes, TargetedEvent } from './util';

/** Function interface to check if two values are considered equal */
export interface IsEqual<Type> {
  (prev: Type, next: Type): boolean;
}

type ChangeFunction<Type> = (value: Type) => Type;
type ChangeValue<Type> = (Type extends Function ? ChangeFunction<Type> : Type) | ChangeFunction<Type>;

/** Extracts Type from Value<Type> */
export type ExtractValue<Type> = Type extends Value<infer X> ? X : never;

export type SortCompare<Type> = Type extends Array<infer Item> ? (a: Item, b: Item) => number : never;

/** Extracts each Type from a tuple of Value<Type> */
type ExtractValues<Type extends Value<unknown>[]> = {
  [Index in keyof Type]: ExtractValue<Type[Index]>;
} & {length: Type['length']};

/** Value which is derived from another Value */
export type DerivedValue<Type> = (
  ProxyValue<Type> |
  ComputedValue<Type> |
  InputPropertyValue<Type, any, any> |
  PropertyValue<Type, any, any> |
  InputArrayViewValue<Type>
);

export type AnyValue<Type> = Value<Type> | InputValue<Type>;

(window as any).values = []

/** A signal based wrapper for values */
export class Value<Type> {
  protected value: Type;

  /** Values which use this Value in their computation */
  derivedValues: Set<DerivedValue<any>> = new Set();

  /** Listeners which fire when this Value is used to derive another value */
  deriveListeners: Set<(value: AnyValue<any>, derived: DerivedValue<any>) => void> = new Set();

  /** Listeners which fire when this Value is updated */
  updateListeners: Set<(value: any) => void> = new Set();

  constructor(value: Type) {
    this.value = value;
    (window as any).values.push(this);
  }

  /** Creates a new ComputedValue derived from all inputs */
  static computed<Inputs extends AnyValue<any>[], ResultType>(
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
  addDerivedValue(value: DerivedValue<any>) {
    this.derivedValues.add(value);
    for (const listener of this.deriveListeners) {
      listener(this, value);
    }
  }

  /** Removes a Value which is no longer derived from this Value */
  removeDerivedValue(value: DerivedValue<any>) {
    this.derivedValues.delete(value);
  }

  /** Adds an update listener which triggers the value of this Value updates */
  addUpdateListener(compute: (value: Type) => void) {
    this.updateListeners.add(compute);
    compute(this.value);
  }

  /** Adds an update listener */
  removeUpdateListener(compute: (value: Type) => void) {
    this.updateListeners.delete(compute);
  }

  callUpdateListeners() {
    const value = this.value;
    for (const listener of this.updateListeners) {
      listener(value);
    }
  }

  /** Adds a listener which triggers when a Value is derived from this Value */
  addDeriveListener(listener: (value: Value<any>, derived: DerivedValue<any>) => void) {
    this.deriveListeners.add(listener);
  }

  /** Removes a listener which triggers when a Value is derived from this Value */
  removeDeriveListener(listener: (value: Value<any>, derived: DerivedValue<any>) => void) {
    this.deriveListeners.delete(listener);
  }

  updateDerivedValues() {
    for (const derivedValue of this.derivedValues) {
      derivedValue.update();
    }
  }

  /** Gets the wrapped value */
  extract() {
    return this.value;
  }

  /** Returns a new ComputedValue derived from this Value using `compute` */
  computed<ResultType>(compute: (value: Type) => ResultType): ComputedValue<ResultType> {
    return Value.computed([this], compute);
  }
}

export class ComparableValue<Type> extends Value<Type> {
  isEqual: IsEqual<Type>;

  constructor(value: Type, isEqual: IsEqual<Type> = strictEquals) {
    super(value);
    this.isEqual = isEqual;
  }

  /** Removes an InputPropertyValue which is no longer derived from this Value */
  removePropertyValue(value: DerivedValue<any>) {
    this.derivedValues.delete(value);
  }

  /** Returns a new PropertyValue for a property of this value */
  get<Key extends keyof Type>(path: Key) {
    return new PropertyValue(this, path)
  }
}

export class InputValue<Type> extends ComparableValue<Type> {
  /** InputPropertyValues which are properties of this Value */
  propertyValues: Set<InputPropertyValue<any, any, any>> = new Set();

  constructor(value: Type, isEqual: IsEqual<Type> = strictEquals) {
    super(value, isEqual);
  }

  /** Adds an InputPropertyValue which has is a property of this InputValue and triggers all deriveListeners */
  addPropertyValue(value: InputPropertyValue<any, any, any>) {
    this.propertyValues.add(value);
    for (const listener of this.deriveListeners) {
      listener(this, value);
    }
  }

  /** Removes an InputPropertyValue which is no longer derived from this Value */
  removePropertyValue(value: InputPropertyValue<any, any, any>) {
    this.propertyValues.delete(value);
  }

  /** Updates all InputPropertyValues */
  updatePropertyValues() {
    for (const propertyValue of this.propertyValues) {
      propertyValue.update();
    }
  }

  /** Returns a new InputPropertyValue for this Value */
  get<Key extends keyof Type>(property: Key, isEqual?: IsEqual<Type[Key]>): InputPropertyValue<Type[Key], Type, Key> {
    return new InputPropertyValue(this, property, isEqual);
  }

  sorted(sort?: SortCompare<Type>): Type extends Array<infer Item> ? InputArrayViewValue<Item> : never {
    if (!Array.isArray(this.value)) throw new Error('sorted() can only be called on an InputValue which contains an array');
    return new InputArrayViewValue(this as any, sort) as any;
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
      const transformed = transform ? transform(value): (value as Type);
      this.change(transformed instanceof Function ? () => transformed : transformed as ChangeValue<Type>);
    };
  }

  change(value: ChangeValue<Type>) {
    const computedValue = value instanceof Function ? value(this.value) : value as Type;
    if (this.isEqual(this.value, computedValue)) return;

    this.value = computedValue;
    this.callUpdateListeners();
    this.updateDerivedValues();
    this.updatePropertyValues();
  }

  /** Propagates a change from a child property value */
  propagateChange() {
    this.callUpdateListeners();
    this.updateDerivedValues();
  }
}

export class InputPropertyValue<Type extends ParentType[Key], ParentType, Key extends keyof ParentType> extends InputValue<Type> {
  parent: InputValue<ParentType>;
  property: Key;

  constructor(
    parent: InputValue<ParentType> | InputArrayViewValue<ParentType extends Array<infer Item> ? Item : never>,
    property: Key,
    isEqual: IsEqual<Type> = strictEquals,
  ) {
    super((parent as InputValue<ParentType>).extract()[property] as Type, isEqual);
    this.property = property;
    this.parent = parent as InputValue<ParentType>;
    this.parent.addPropertyValue(this);
  }

  change(value: ChangeValue<Type>) {
    const computedValue = value instanceof Function ? value(this.value) : value as Type;
    if (this.isEqual(this.value, computedValue)) return;

    this.value = computedValue;
    this.parent.extract()[this.property] = this.value;
    this.propagateChange();
    this.updatePropertyValues();
  }

  /** Propagates a change from a child property value up through parents. */
  propagateChange() {
    this.parent.propagateChange();
    this.callUpdateListeners();
    this.updateDerivedValues();
  }

  setProperty(property: Key) {
    this.property = property;
    this.update();
  }

  update() {
    const value = this.parent.extract()[this.property] as Type;
    if (this.isEqual(this.value, value)) return;
    this.value = value;

    this.callUpdateListeners();
    this.updateDerivedValues();
    this.updatePropertyValues();
  }
}

export class ComputedValue<Type> extends ComparableValue<Type> {
  compute: () => Type;

  constructor(compute: () => Type, isEqual: IsEqual<Type> = strictEquals) {
    super(compute(), isEqual);
    this.compute = compute;
  }

  update() {
    const value = this.compute();
    if (this.isEqual(this.value, value)) return;
    this.value = value;

    this.callUpdateListeners();
    this.updateDerivedValues();
  }
}

export class ProxyValue<Type> extends Value<Type> {
  target: Value<Type>;

  constructor(target: Value<Type>) {
    super(target.extract());
    this.target = target;
    this.target.addDerivedValue(this);
  }

  setTarget(target: Value<Type>) {
    if (this.target) this.target.removeDerivedValue(this);
    this.target = target;
    this.target.addDerivedValue(this);
    this.update();
  }

  update() {
    this.value = this.target.extract();

    this.callUpdateListeners();
    this.updateDerivedValues();
  }

  removeTarget() {
    this.target.removeDerivedValue(this);
  }
}

export class PropertyValue<Type extends ParentType[Key], ParentType, Key extends keyof ParentType> extends ComparableValue<Type> {
  parent: ComparableValue<ParentType>;
  property: Key;

  constructor(
    parent: ComparableValue<ParentType>,
    property: Key,
    isEqual: IsEqual<Type> = strictEquals
  ) {
    super(parent.extract()[property] as Type, isEqual);
    this.property = property;
    this.parent = parent;
    this.parent.addDerivedValue(this);
  }

  setProperty(property: Key) {
    this.property = property;
    this.update();
  }

  update() {
    const value = this.parent.extract()[this.property] as Type;
    if (this.isEqual(this.value, value)) return;
    this.value = value;

    this.callUpdateListeners();
    this.updateDerivedValues();
  }
}


export class InputArrayViewValue<Item> extends Value<Item[]> {
  list: InputValue<Item[]>;
  indexes: number[];
  sort?: (a: Item, b: Item) => number;

  constructor(list: InputValue<Item[]>, sort?: (a: Item, b: Item) => number) {
    const [sorted, indexes] = sortWithIndexes(list.extract(), sort);
    super(sorted);
    this.indexes = indexes;
    this.list = list;
    this.sort = sort;
    list.addDerivedValue(this);
  }

  update() {
    const [sorted, indexes] = sortWithIndexes(this.list.extract(), this.sort);
    this.value = sorted;
    this.indexes = indexes;
  }

  propagateChange() {
    this.list.propagateChange();
    this.callUpdateListeners();
    this.updateDerivedValues();
  }

  addPropertyValue(value: InputPropertyValue<any, any, any>) {
    return this.list.addPropertyValue(value);
  }

  removePropertyValue(value: InputPropertyValue<any, any, any>) {
    return this.list.removePropertyValue(value);
  }

  /** Returns a new InputPropertyValue for this Value */
  get<Key extends keyof Item[]>(property: Key, isEqual?: IsEqual<Item[][Key]>): InputPropertyValue<Item[][Key], Item[], Key> {
    if (typeof property === 'number') {
      property = this.indexes[property] as Key;
    }
    return new InputPropertyValue(this as any, property, isEqual);
  }
}
