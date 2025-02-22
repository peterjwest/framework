import { Primitive, ComponentChildren, ComponentChild } from './jsx';

/** Omits all methods from an object type */
export type OmitMethods<Type> = {
  [Key in keyof Type as Type[Key] extends Function ? never : Key]: Type[Key];
};

/** Maps all values in an object to a specified type */
export type MapValue<Type, Value> = {
  [Key in keyof Type]?: Value;
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
