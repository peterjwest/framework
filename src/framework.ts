import { JSXInternal  } from './jsx';

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

function isCondition(element: ElementNode<any>): element is ElementNode<ConditionProps>{
  return element.type === Condition;
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

export function renderElement(element: ComponentChild, derivedListener?: DeriveValueListener) {
  if (isPrimitive(element)) return element;
  if (element instanceof Value) return element;
  if (element.type === List) return element; // TODO: Process this

  if (typeof element.type === 'string' || element.type === Fragment) {
    for (const child of element.props.children) {
      renderElement(child, derivedListener);
    }
    return element;
  }

  if (isCondition(element)) {
    const condition: ElementNode<ConditionProps> = element;
    // TODO: Capture unrender
    let unrender: (() => void) | undefined;
    let prevValue: boolean | undefined;
    condition.props.if.addUpdateListener((value) => {
      if (prevValue !== Boolean(value)) {
        const block = value ? condition.props.then : condition.props.else;
        if (unrender) {
          unrender();
          unrender = undefined;
        }
        if (block) {
          const component: ElementNode<{}> = { type: block, props: { children: [] }};
          unrender = renderElement(component, derivedListener);
        }
        prevValue = Boolean(value);
      }
    });
    // TODO: If true, render
    // TODO: Setup listener to render/unrender when condition changes
      // renderElement, passing in derivedListener
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

  // console.log('🥭', {
  //   type: component.type,
  //   inputs,
  //   derivedMapping,
  //   permutedValues: values,
  //   // processedChild,
  // });

  // TODO: While rendering HTML, iterate through outputs and identify binds

  const newListener = new DeriveValueListener(values, derivedListener)
  renderElement(processedChild, newListener);

  // TODO: Return unrender:
  //  - decouple DeriveValueListener
  //  - decouple derivedMapping
  //  - remove effects

  return processedChild;
}
