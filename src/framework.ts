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

export type CreateState = <Type>(value: Type) => Input<Type>;

export function createState<Type>(value: Type) {
  return new Input<Type>(value);
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

export class Value<Type> {
  protected value: Type;
  dependents: Set<ComputedValue<unknown>> = new Set();
  deriveListeners: Array<(value: Value<any>, computed: Value<any>) => void> = [];
  updateListeners: Array<(value: any) => void> = [];

  constructor(value: Type) {
    this.value = value;
  }

  static extract<Type>(value: Value<Type>) {
    return value.value;
  }

  static computed<Inputs extends Value<unknown>[], ResultType>(
    inputs: [...Inputs],
    compute: (...values: ExtractValues<Inputs>) => ResultType,
  ): ComputedValue<ResultType> {
    const value = new ComputedValue(() => compute(...inputs.map((value) => value.value) as any));
    for (const input of inputs) {
      input.dependents.add(value);
    }
    return value;
  }

  computed<ResultType>(compute: (value: Type) => ResultType): ComputedValue<ResultType> {
    const computed = Value.computed([this], compute);
    for (const listener of this.deriveListeners) {
      listener(this, computed);
    }
    return computed;
  }

  addUpdateListener(compute: (value: Type) => void) {
    this.updateListeners.push(compute);
    compute(this.value);
  }

  addDeriveListener(listener: (value: Value<any>, computed: Value<any>) => void) {
    this.deriveListeners.push(listener);
  }

  get<Key extends keyof Type>(path: Key): Value<Type[Key]> {
    return this.computed((value) => value[path]);
  }

  update(value: Type) {
    this.value = value;
    for (const dependent of this.dependents) {
      dependent.recompute();
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
  compute: () => Type;

  constructor(compute: () => Type) {
    super(compute());
    this.compute = compute;
  }

  recompute() {
    this.value = this.compute();
    this.update(this.value);
  }
}

export class Input<Type> extends Value<Type> {}

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

export function permuteValues(inputs: Input<any>[], values: Value<any>[] = []) {
  values = values.concat(inputs);
  for (const input of inputs) {
    values = permuteValues(Array.from(input.dependents), values);
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
  const index = Value.extract(indexValue);
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
  childIndex: Value<number> = new Value(0),
  derivedListener?: DeriveValueListener,
): [Unrender | undefined, Value<number>] {

  if (isPrimitive(element)) {
    // TODO: Cast properly
    const textNode = document.createTextNode(element ? String(element) : '');
    insertAtIndex(parentElement, childIndex, textNode);
    return [() => textNode.remove(), childIndex.computed((value) => value + 1)];
  }

  if (element instanceof Value) {
    const textNode = document.createTextNode('');
    element.addUpdateListener((value) => {
      textNode.textContent = value;
    });
    insertAtIndex(parentElement, childIndex, textNode);
    // TODO: Remove listener
    return [() => textNode.remove(), childIndex.computed((value) => value + 1)];
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
    insertAtIndex(parentElement, childIndex, elementNode);

    let nextChildIndex = new Value(0);
    for (const child of element.props.children) {
      const [_, childIndex] = renderElement(child, elementNode, nextChildIndex, derivedListener);
      nextChildIndex = childIndex;
    }

    return [() => elementNode.remove(), childIndex.computed((index) => index + 1)];
  }

  if (element.type === Condition) {
    const component: ElementNode<ConditionProps> = element;

    const nextChildIndex = new Value(0);
    let unrender: Unrender | undefined;
    let lastCondition: boolean | undefined;
    component.props.if.addUpdateListener((condition) => {
      if (lastCondition !== Boolean(condition)) {
        const block = condition ? component.props.then : component.props.else;
        if (unrender) {
          unrender();
          unrender = undefined;
        }

        const nextChildIndex = new Value(0);
        if (block) {
          const component: ElementNode<{}> = { type: block, props: { children: [] }};
          let returnedChildIndex: Value<number>;
          [unrender, returnedChildIndex] = renderElement(component, parentElement, childIndex, derivedListener);
          nextChildIndex.update(Value.extract(returnedChildIndex))
        } else {
          nextChildIndex.update(Value.extract(childIndex));
        }

        lastCondition = Boolean(condition);
      }
    });
    return [() => { if (unrender) unrender(); }, nextChildIndex];
  }

  let inputs: Input<any>[] = [];
  const createState = <Type>(value: Type) => {
    const input = new Input<Type>(value);
    inputs.push(input);
    return input;
  }
  const processedChild = element.type(element.props, createState);
  const derivedMapping: Map<Value<any>, Value<any>> = derivedListener ? derivedListener.extract() : new Map();
  const values = permuteValues(Array.from(derivedMapping.values()).concat(inputs));

  const newListener = new DeriveValueListener(values, derivedListener);
  const [unrender, nextChildIndex] = renderElement(processedChild, parentElement, childIndex, newListener);

  // TODO: Add to unrender:
  //  - decouple DeriveValueListener
  //  - decouple derivedMapping
  //  - remove effects

  return [unrender, nextChildIndex];
}
