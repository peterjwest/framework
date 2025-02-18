import { JSXInternal  } from './jsx';

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

function isPrimitive(value: any): value is Primitive {
  return PRIMITIVES.has(typeof value);
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

type HtmlNodeProps = JSXInternal.HTMLAttributes & JSXInternal.SVGAttributes & Omit<Record<string, any>, 'children'>;

function childrenToArray(children: ComponentChildren | undefined): ComponentChild[] {
  if (children === undefined) return [];
  return Array.isArray(children) ? children : [children];
}

export type CreateState = <Type>(value: Type) => InputValue<Type>;

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
  derivedValues: Set<ProxyValue<unknown> | ComputedValue<unknown>> = new Set();
  /** Listeners which fire when this Value is used to derive another value */
  deriveListeners: Array<(value: Value<unknown>, computed: Value<unknown>) => void> = [];
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
  addDerivedValue(value: ProxyValue<unknown> | ComputedValue<unknown>) {
    this.derivedValues.add(value);
    for (const listener of this.deriveListeners) {
      listener(this, value);
    }
  }

  /** Removes a Value which is no longer derived from this Value */
  removeDerivedValue(value: ProxyValue<unknown> | ComputedValue<unknown>) {
    this.derivedValues.delete(value);
  }

  addUpdateListener(compute: (value: Type) => void) {
    this.updateListeners.add(compute);
    compute(this.extract());
  }

  removeUpdateListener(compute: (value: Type) => void) {
    this.updateListeners.delete(compute);
  }

  addDeriveListener(listener: (value: Value<unknown>, computed: Value<unknown>) => void) {
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

export class InputValue<Type> extends Value<Type> {
  protected value: Type;

  constructor(value: Type) {
    super();
    this.value = value;
  }

  extract() {
    return this.value;
  }

  // TODO: Avoid update if value hasn't changed
  update(value: Type) {
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
    if (this.target) {
      this.target.removeDerivedValue(this);
    }
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

  extract() {
    return this.target.extract();
  }
}

// TODO: Support raw components
interface ConditionProps {
  if: Value<boolean | number>,
  then?: () => ComponentChild,
  else?: () => ComponentChild,
}

export function Condition(props: ConditionProps): ElementNode<ConditionProps> {
  return {
    type: Condition,
    props: { ...props, children: [] },
  }
}

interface ListProps<Type> {
  data: Value<Type[]>,
  element: (item: Value<Type>) => ComponentChild,
}

export function List<Type>(props: ListProps<Type>): ElementNode<ListProps<Type>> {
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

  addValue = (value: Value<any>, derived: Value<any>) => {
    this.derived.set(value, derived);
    for (const child of this.children) {
      child.derived.set(value, derived);
    }
  }

  constructor(values: Value<any>[], parent?: DeriveValueListener) {
    for (const value of values) {
      value.addDeriveListener(this.addValue);
    }
    if (parent) parent.children.add(this);
  }

  extract() {
    const derived = this.derived;
    this.derived = new Map();
    return derived;
  }
}


export function insertAtIndex(parent: HTMLElement, indexValue: Value<number>, element: HTMLElement | Text) {
  const index = indexValue.extract();
  if (index >= parent.children.length) {
    parent.appendChild(element);
  } else {
    parent.insertBefore(element, parent.children[index]);
  }
}


type Unrender = () => void;

export function renderElement(
  element: ComponentChild,
  parentElement: HTMLElement,
  childIndex: Value<number> = new InputValue(0),
  derivedListener?: DeriveValueListener,
): [Unrender | undefined, Value<number>] {

  if (isPrimitive(element)) {
    // TODO: Cast properly
    const textNode = document.createTextNode(element ? String(element) : '');
    insertAtIndex(parentElement, childIndex, textNode);
    return [() => textNode.remove(), childIndex.computed((value) => value + 1)];
  }

  // TODO: Strong typing?
  if (element instanceof Value) {
    const textNode = document.createTextNode('');
    const updateListener = (value: string) => {
      textNode.textContent = value;
    }
    element.addUpdateListener(updateListener);
    insertAtIndex(parentElement, childIndex, textNode);
    const unrender = () => {
      element.removeUpdateListener(updateListener);
      textNode.remove();
    }
    return [unrender, childIndex.computed((value) => value + 1)];
  }

  if (element.type === List) return [undefined, childIndex]; // TODO: Process this

  if (element.type === Fragment) {
    const unrenders: Unrender[] = [];
    let nextChildIndex = childIndex;
    for (const child of element.props.children) {
      const [unrender, childIndex] = renderElement(child, parentElement, nextChildIndex, derivedListener);
      if (unrender) unrenders.push(unrender);
      nextChildIndex = childIndex;
    }

    return [() => { for (const unrender of unrenders) unrender(); }, nextChildIndex];
  }

  if (typeof element.type === 'string') {
    const elementNode = document.createElement(element.type);
    for (const attr in element.props) {
      if (attr !== 'children' && attr !== 'onChange') {
        elementNode.setAttribute(attr, element.props[attr])
      }
    }
    if (element.props.onChange) {
      // TODO: Unregister
      elementNode.addEventListener('change', element.props.onChange);
      elementNode.addEventListener('input', element.props.onChange);
    }

    let nextChildIndex: Value<number> = new InputValue(0);
    for (const child of element.props.children) {
      const [_, childIndex] = renderElement(child, elementNode, nextChildIndex, derivedListener);
      nextChildIndex = childIndex;
    }

    insertAtIndex(parentElement, childIndex, elementNode);

    return [() => elementNode.remove(), childIndex.computed((index) => index + 1)];
  }

  if (element.type === Condition) {
    const component: ElementNode<ConditionProps> = element;

    const nextChildIndex = new InputValue(0);
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
          const component: ElementNode<{}> = { type: block, props: { children: [] }};
          let returnedChildIndex: Value<number>;
          [unrenderBlock, returnedChildIndex] = renderElement(component, parentElement, childIndex, derivedListener);
          nextChildIndex.update(returnedChildIndex.extract())
        } else {
          nextChildIndex.update(childIndex.extract());
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

  // TODO: Make this work globally i.e. in conditions and loops
  let inputs: InputValue<any>[] = [];
  const createState = <Type>(value: Type) => {
    const input = new InputValue(value);
    inputs.push(input);
    return input;
  }
  const processedChild = element.type(element.props, createState);
  const derivedMapping: Map<Value<any>, Value<any>> = derivedListener ? derivedListener.extract() : new Map();
  const values = permuteValues(Array.from(derivedMapping.values()), inputs);

  const newListener = new DeriveValueListener(values, derivedListener);
  const [unrender, nextChildIndex] = renderElement(processedChild, parentElement, childIndex, newListener);

  // TODO: Add to unrender:
  //  - decouple DeriveValueListener
  //  - decouple derivedMapping
  //  - remove effects

  return [unrender, nextChildIndex];
}
