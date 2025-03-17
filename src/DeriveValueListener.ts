import { Value, DerivedValue } from './value';

export default class DeriveValueListener {
  children: Set<DeriveValueListener> = new Set();
  derived: Map<Value<any>, Value<any>> = new Map();

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
