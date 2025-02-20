import { JSXInternal  } from './jsx';
import diffList, { ACTIONS } from './diffList';

// interface FakeTextNode {
//   textContent: string;
// }

// class FakeHTMLElement {
//   tagName: string;
//   children: (FakeHTMLElement | Text)[] = [];

//   constructor(tagName: string) {
//     this.tagName = tagName;
//   }

//   appendChild(element: FakeHTMLElement | Text) {
//     this.children.push(element);
//   }

//   insertBefore(element: FakeHTMLElement | Text, beforeChild: FakeHTMLElement | Text) {
//     const index = this.children.findIndex((child) => child === beforeChild);
//     if (index === -1) throw new Error('Child not found');
//     this.children.splice(index, 0, element)
//   }
// }

// export const document = {
//   createElement: (tagName: string): HTMLElement => new HTMLElement(tagName),
//   createTextNode: (textContent: string): Text => ({ textContent }),
// };

export interface ElementNode<Props = {}> {
  type: Component<Props> | string;
  props: Props & { children: ComponentChild[] };
}

const PRIMITIVES = new Set([
  'string', 'number', 'bigint', 'boolean', 'null', 'undefined',
])

type Primitive = string | number | bigint | boolean | null | undefined;

/** Returns whether a value is a primtive */
function isPrimitive(value: any): value is Primitive {
  return PRIMITIVES.has(typeof value);
}

/** Casts any value to a string, except null and undefined which are converted to '' */
function toString(value: any) {
  if (value === undefined || value === null) return '';
  return String(value);
}

export type ComponentChild = ElementNode<any> | Value<any> | Primitive;
export type ComponentChildren = ComponentChild[] | ComponentChild;
export type ChildrenNodeProps = { children?: ComponentChildren };

export interface Component<Props = {}> {
  (props: Props & ChildrenNodeProps, createState: CreateState): ComponentChild;
}

export function Fragment(props: ChildrenNodeProps) {
  return props.children;
}

export type EventProp = {
  [Key in keyof HTMLElementEventMap]?: (this: HTMLAnchorElement, ev: HTMLElementEventMap[Key]) => any
};

type HtmlNodeProps = JSXInternal.HTMLAttributes & JSXInternal.SVGAttributes & Omit<Record<string, any>, 'children'>;

function childrenToArray(children: ComponentChildren | undefined): ComponentChild[] {
  if (children === undefined) return [];
  return Array.isArray(children) ? children : [children];
}

export type CreateState = <Type>(value: Type) => InputValue<Type>;

export interface IsEqual<Type> {
  (prev: Type, next: Type): boolean;
}

export function createState<Type>(value: Type) {
  return new InputValue<Type>(value);
}

export function createElementNode(
  type: string,
  maybeProps: (HtmlNodeProps & ChildrenNodeProps) | null,
): ElementNode<HtmlNodeProps & ChildrenNodeProps>;

export function createElementNode<Props>(
  type: Component<Props>,
  maybeProps: (Props & ChildrenNodeProps) | null,
): ElementNode<Props & ChildrenNodeProps>;

// TODO: Support "key" in props
export function createElementNode<Props>(
  type: string | Component<Props>,
  maybeProps: (HtmlNodeProps & ChildrenNodeProps) | (Props & ChildrenNodeProps) | null,
): ElementNode<HtmlNodeProps> | ElementNode<Props> {
  if (typeof type === 'string') {
    const props = (maybeProps ? maybeProps : {}) as HtmlNodeProps & ChildrenNodeProps;
    return { type, props: { ...props, children: childrenToArray(props.children) } };
  }

  const props = (maybeProps ? maybeProps : {}) as Props & ChildrenNodeProps;
  return { type, props: { ...props, children: childrenToArray(props.children) } };
}

type ExtractValue<Type> = Type extends Value<infer X> ? X : never;

type ExtractValues<Type extends Value<unknown>[]> = {
  [Index in keyof Type]: ExtractValue<Type[Index]>;
} & {length: Type['length']};

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

  /** Adds a Value which has been derived from this Value, triggering deriveListeners */
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

  addUpdateListener(compute: (value: Type) => void) {
    this.updateListeners.add(compute);
    compute(this.extract());
  }

  removeUpdateListener(compute: (value: Type) => void) {
    this.updateListeners.delete(compute);
  }

  addDeriveListener(listener: (value: Value<unknown>, derived: DerivedValue<unknown>) => void) {
    this.deriveListeners.push(listener);
  }

  get<Key extends keyof Type>(path: Key): Value<Type[Key]> {
    return this.computed((value) => value[path]);
  }

  abstract extract(): Type

  /** Creates a new ComputedValue derived from this Value */
  computed<ResultType>(compute: (value: Type) => ResultType): ComputedValue<ResultType> {
    return Value.computed([this], compute);
  }
}

function strictEquals<Type>(prev: Type, next: Type) {
  return prev === next;
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

  update(value: Type) {
    if (this.isEqual(this.value, value)) return;
    this.value = value;
    for (const derived of this.derivedValues) {
      derived.update();
    }
    for (const listener of this.updateListeners) {
      listener(this.value);
    }
  }

  debounce(time: number) {
    // TODO: setup timers to update computed value
    return this;
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
    for (const derived of this.derivedValues) {
      derived.update();
    }
    const target = this.extract();
    for (const listener of this.updateListeners) {
      listener(target);
    }
  }

  deactivate() {
    this.target.removeDerivedValue(this);
  }

  extract() {
    return this.target.extract();
  }
}

type DerivedValue<Type> = ProxyValue<Type> | ComputedValue<Type>;

interface ConditionProps {
  if: Value<boolean | number>,
  then?: (() => ComponentChild) | ComponentChild,
  else?: (() => ComponentChild) | ComponentChild,
}

export function Condition(props: ConditionProps): ElementNode<ConditionProps> {
  // Note: this is never actually called, but needed for types
  return {
    type: Condition,
    props: { ...props, children: [] },
  }
}

interface ListProps<Type> {
  data: Value<Type[]>,
  itemKey: string,
  itemIsEqual?: IsEqual<Type>,
  each: (item: Value<Type>) => ComponentChild,
}

export function List<Type>(props: ListProps<Type>): ElementNode<ListProps<Type>> {
  // Note: this is never actually called, but needed for types
  return {
    type: List,
    props: { ...props, children: [] },
  }
}

export function permuteValues(inputs: Value<any>[], values: Value<any>[] = []) {
  values = values.concat(inputs);
  for (const input of inputs) {
    values = permuteValues(Array.from(input.derivedValues), values);
  }
  return values;
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

  addValue = (value: Value<any>, derived: DerivedValue<any>) => {
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

/** Inserts an element at the specified index in a parent element */
export function insertAtIndex(parent: HTMLElement, indexValue: Value<number>, element: HTMLElement | Text) {
  const index = indexValue.extract();
  if (index >= parent.children.length) {
    parent.appendChild(element);
  } else {
    parent.insertBefore(element, parent.children[index]);
  }
}

/** Wrapper for createState helper to track inputs */
export class StateWatcher {
  inputs: InputValue<any>[] = [];

  createState = <Type>(value: Type) => {
    const input = new InputValue(value);
    this.inputs.push(input);
    return input;
  }

  extract() {
    const inputs = this.inputs;
    this.inputs = [];
    return inputs;
  }
}

type Unrender = () => void;

type ListItemMetadata = {
  input: InputValue<any>
  startIndex: ProxyValue<number>
  endIndex: Value<number>
  unrender: Unrender | undefined
}

export function renderElement(
  element: ComponentChild,
  parentElement: HTMLElement,
  stateWatcher = new StateWatcher(),
  childIndex: Value<number> = new InputValue(0),
  derivedListener?: DeriveValueListener,
): [Unrender | undefined, Value<number>] {

  if (isPrimitive(element)) {
    const textNode = document.createTextNode(toString(element));
    insertAtIndex(parentElement, childIndex, textNode);
    return [() => textNode.remove(), childIndex.computed((value) => value + 1)];
  }

  if (element instanceof Value) {
    const textNode = document.createTextNode('');
    const updateListener = (value: any) => {
      textNode.textContent = toString(value);
    }
    element.addUpdateListener(updateListener);
    insertAtIndex(parentElement, childIndex, textNode);
    const unrender = () => {
      element.removeUpdateListener(updateListener);
      textNode.remove();
    }
    return [unrender, childIndex.computed((value) => value + 1)];
  }

  if (element.type === Fragment) {
    const unrenders: Unrender[] = [];
    let nextChildIndex = childIndex;
    for (const child of element.props.children) {
      const [unrender, childIndex] = renderElement(child, parentElement, stateWatcher, nextChildIndex, derivedListener);
      if (unrender) unrenders.push(unrender);
      nextChildIndex = childIndex;
    }

    return [() => { for (const unrender of unrenders) unrender(); }, nextChildIndex];
  }

  if (typeof element.type === 'string') {
    const elementNode = document.createElement(element.type);
    for (const attr in element.props) {
      if (attr !== 'children' && attr !== 'onChange' && attr !== 'onClick' ) {
        elementNode.setAttribute(attr, element.props[attr])
      }
    }

    type ListenerMetadata = [HTMLElement, keyof HTMLElementEventMap, EventListenerOrEventListenerObject];
    const events: ListenerMetadata[] = [];

    // TODO: Support all events
    if (element.props.onChange) {
      events.push([elementNode, 'change', element.props.onChange]);
    }
    if (element.props.onInput) {
      events.push([elementNode, 'input', element.props.onInput]);
    }
    if (element.props.onClick) {
      events.push([elementNode, 'click', element.props.onClick]);
    }
    for (const [elementNode, eventName, listener] of events) {
      elementNode.addEventListener(eventName, listener);
    }

    let nextChildIndex: Value<number> = new InputValue(0);
    for (const child of element.props.children) {
      const [_, childIndex] = renderElement(child, elementNode, stateWatcher, nextChildIndex, derivedListener);
      nextChildIndex = childIndex;
    }

    insertAtIndex(parentElement, childIndex, elementNode);

    const unrender = () => {
      for (const [elementNode, eventName, listener] of events) {
        elementNode.removeEventListener(eventName, listener);
      }
      elementNode.remove()
    }

    return [unrender, childIndex.computed((index) => index + 1)];
  }

  if (element.type === List) {
    const component: ElementNode<ListProps<any>> = element;

    let currentData: any[] = [];
    const listMetadata: ListItemMetadata[] = [];
    const finalChildIndex = new ProxyValue(childIndex);

    const updateListener = (nextData: any[]) => {
      const actions = diffList(currentData, nextData, component.props.itemKey);

      for (const action of actions) {
        // TODO: move and replace
        if (action[0] === ACTIONS.add) {
          const index = action[1];
          const input = new InputValue(nextData[index], component.props.itemIsEqual || undefined);

          const startIndex = new ProxyValue(index === 0 ? childIndex : listMetadata[index - 1].endIndex);
          const childComponent: ElementNode<{}> = {
            type: function ListItem() { return component.props.each(input); },
            props: { children: [] },
          };
          const [unrender, endIndex] = renderElement(childComponent, parentElement, stateWatcher, startIndex, derivedListener);

          const metadata = {
            unrender,
            input,
            startIndex,
            endIndex,
          }
          listMetadata.splice(index, 0, metadata);

          // Add proxy index to chain
          const nextMetadata: ListItemMetadata | undefined = listMetadata[index + 1];
          const nextIndex = nextMetadata ? nextMetadata.startIndex : finalChildIndex;
          nextIndex.setTarget(metadata.endIndex);
        }
        if (action[0] === ACTIONS.remove) {
          const index = action[1];
          const metadata = listMetadata[index];

          if (metadata.unrender) metadata.unrender();

          // Remove proxy index from chain
          const nextMetadata: ListItemMetadata | undefined = listMetadata[index + 1];
          const prevMetadata: ListItemMetadata | undefined = listMetadata[index - 1];
          const nextIndex = nextMetadata ? nextMetadata.startIndex : finalChildIndex;
          nextIndex.setTarget(prevMetadata ? prevMetadata.endIndex : childIndex)
          metadata.startIndex.deactivate();

          listMetadata.splice(index, 1);
        }
      }

      currentData = nextData;
      for (let index = 0; index < listMetadata.length; index++) {
        listMetadata[index].input.update(currentData[index]);
      }
    }

    component.props.data.addUpdateListener(updateListener);

    const unrender = () => {
      for (const metadata of listMetadata) if (metadata.unrender) metadata.unrender();
      component.props.data.removeUpdateListener(updateListener);
    }

    return [unrender, finalChildIndex];
  }

  if (element.type === Condition) {
    const component: ElementNode<ConditionProps> = element;

    const nextChildIndex = new ProxyValue(childIndex);
    let unrenderBlock: Unrender | undefined;
    let lastCondition: boolean | undefined;

    const updateListener = (condition: number | boolean) => {
      if (lastCondition !== Boolean(condition)) {
        const block = condition ? component.props.then : component.props.else;
        if (unrenderBlock) {
          unrenderBlock();
          unrenderBlock = undefined;
        }

        if (block) {
          const component: ComponentChild = (
            typeof block === 'function' ?
            { type: function ConditionBlock() { return block() }, props: { children: [] }} :
            block
          );
          let returnedChildIndex: Value<number>;
          [unrenderBlock, returnedChildIndex] = renderElement(component, parentElement, stateWatcher, childIndex, derivedListener);
          nextChildIndex.setTarget(returnedChildIndex);
        } else {
          nextChildIndex.setTarget(childIndex);
        }

        lastCondition = Boolean(condition);
      }
    };

    component.props.if.addUpdateListener(updateListener);

    const unrender = () => {
      component.props.if.removeUpdateListener(updateListener);
      if (unrenderBlock) unrenderBlock();
    };

    return [unrender, nextChildIndex];
  }

  const processedElement = element.type(element.props, stateWatcher.createState);
  const derivedMapping: Map<Value<unknown>, DerivedValue<unknown>> = derivedListener ? derivedListener.extract() : new Map();
  const values = permuteValues(Array.from(derivedMapping.values()), stateWatcher.extract());

  const newListener = new DeriveValueListener(values, derivedListener);
  newListener.ref = element.type;
  const [unrenderElement, nextChildIndex] = renderElement(processedElement, parentElement, stateWatcher, childIndex, newListener);

  const unrender = () => {
    if (unrenderElement) unrenderElement();

    if (derivedListener) derivedListener.removeChild(newListener)
    for (const [input, derived] of derivedMapping.entries()) {
      input.removeDerivedValue(derived);
    }
  }

  return [unrender, nextChildIndex];
}

// TODO: Attributes vs. properties
