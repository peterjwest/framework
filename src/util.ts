import { Primitive, ComponentChildren, ComponentChild } from './jsx';
import { Value } from './value';

/** Omits all methods from an object type */
export type OmitMethods<Type> = {
  [Key in keyof Type as Type[Key] extends Function ? never : Key]: Type[Key];
};

/** Maps all property values in an object to a specified type */
export type ReplaceValues<Type, Value> = {
  [Key in keyof Type]: Value;
};

/** Maps all property values to be optionally wrapped in a Value */
export type WrapAttributes<Type> = {
  [Key in keyof Type]?: Type[Key] | Value<Type[Key] | undefined>;
};

/** An event type for a handler with a specialised currentTarget */
export type TargetedEvent<Target extends EventTarget, TypedEvent extends Event> = (
  Omit<TypedEvent, 'currentTarget'> & { readonly currentTarget: Target }
);

/** Set of all primitives */
export const PRIMITIVES: Set<Primitive> = new Set([
  'string', 'number', 'bigint', 'boolean', 'null', 'undefined',
])

/** Returns whether a value is a primtive */
export function isPrimitive(value: any): value is Primitive {
  return PRIMITIVES.has(typeof value);
}

/** Casts any value to a string, except null and undefined which are converted to '' */
export function primitiveToString(value: any) {
  if (value === undefined || value === null) return '';
  return String(value);
}

/** Normalises component children to an array */
export function childrenToArray(children: ComponentChildren | undefined): ComponentChild[] {
  if (children === undefined) return [];
  return Array.isArray(children) ? children : [children];
}

/** Strict equality for Value comparison */
export function strictEquals<Type>(prev: Type, next: Type) {
  return prev === next;
}

/** Expands a named type to show its contents */
export type Expand<Type> = Type extends infer Obj ? { [Key in keyof Obj]: Obj[Key] } : never;

/** Takes a string tuple and inverts it to an object */
type InvertTuple<Type extends readonly string[]> = {
  [Key in (keyof Type & `${number}`) as Type[Key]]: Key
}

/** Creates an enum from a string tuple */
export function createEnumNumeric<const T extends readonly string[]>(arr: T): Expand<InvertTuple<T>> {
  return Object.fromEntries(arr.map((value, index) => [value, index])) as Expand<InvertTuple<T>>;
}

/** Returns a list sorted by a function and also a list of indexes */
export function sortWithIndexes<Type>(list: Type[], sort?: (a: Type, b: Type) => number): [Type[], number[]] {
  const listPairs = list.map<[Type, number]>((item, i) => [item, i]);
  listPairs.sort(sort ? (a, b) => sort(a[0], b[0]) : undefined);
  const sorted: Type[] = [];
  const indexes: number[] = [];
  for (const [item, index] of listPairs) {
    sorted.push(item);
    indexes.push(index);
  }
  return [sorted, indexes];
}
