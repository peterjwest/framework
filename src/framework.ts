import { JSXInternal  } from './jsx';

export interface ElementNode<Props = {}> {
  type: Component<Props> | string;
  props: Props & { children?: ComponentChild[] };
}

// TODO: Change this to be more standardised
export type ComponentChild =
  | ElementNode<any>
  | object
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined;
export type ComponentChildren = ComponentChild[] | ComponentChild;
export type ChildrenNodeProps = { children?: ComponentChildren };

export interface Component<Props = {}> {
  (props: Props & ChildrenNodeProps, context?: any): ComponentChildren;
}

export function Fragment(props: ChildrenNodeProps) {
  return props.children;
}

type HtmlNodeProps = JSXInternal.HTMLAttributes & JSXInternal.SVGAttributes & Record<string, any>;

function childrenToArray(children: ComponentChildren): ComponentChild[] {
  return Array.isArray(children) ? children : [children];
}

export function createElementNode(
  type: string,
  props: HtmlNodeProps & ChildrenNodeProps,
): ElementNode<any>;

export function createElementNode<Props>(
  type: Component<Props>,
  props: Props & ChildrenNodeProps,
): ElementNode<any>;

export function createElementNode<Props>(
  type: string | Component<Props>,
  props: (HtmlNodeProps | Props) & ChildrenNodeProps | null,
): ElementNode<any> {
  if (!props) props = {};

  if (props.children) {
    props.children = childrenToArray(props.children);
  }

  if (typeof type !== 'string') {
    props.children = childrenToArray(type(props as Props & ChildrenNodeProps));
  }

  return { type, props };
}

type ExtractValue<Type> = Type extends Value<infer X> ? X : never;

type ExtractValues<Type extends Value<unknown>[]> = {
  [Index in keyof Type]: ExtractValue<Type[Index]>;
} & {length: Type['length']};

export class Value<Type> {
  protected inner: Type;
  hooks: Map<Value<unknown>, () => unknown> = new Map();

  constructor(value: Type) {
    this.inner = value;
  }

  static computed<Type extends Value<unknown>[], Result>(
    dependencies: [...Type],
    compute: (...values: ExtractValues<Type>) => Result,
  ): Value<Result> {
    const value = new Value(compute(...dependencies.map((value) => value.inner) as any));
    const update = () => compute(...dependencies.map((value) => value.inner) as any);
    for (const dependency of dependencies) {
      dependency.hooks.set(value, update);
    }
    return value;
  }

  computed<Result>(compute: (inner: Type) => Result): Value<Result> {
    const value = new Value(compute(this.inner));
    this.hooks.set(value, () => compute(this.inner));
    return value;
  }

  get<Key extends keyof Type>(path: Key): Value<Type[Key]> {
    return this.computed((value) => value[path]);
  }

  debounce(time: number) {
    // TODO: setup timers to update computed value
    return this;
  }

  update() {
    for (const [value, update] of this.hooks) {
      value.inner = update();
    }
  }
}

export class Input<Type> extends Value<Type> {
}

Value.computed([new Input(1), new Value('x')], (a, b) => {
  return String(a) + b;
})

interface ConditionProps {
  if: Value<boolean | number>,
  then?: (() => ComponentChild) | ComponentChild,
  else?: (() => ComponentChild) | ComponentChild,
}

export function Condition(props: ConditionProps): ElementNode<ConditionProps> {
  return {
    type: Condition,
    props,
  }
}

interface ListProps<Type> {
  data: Value<Type[]>,
  element: (item: Value<Type>) => ComponentChild,
}

export function List<Type>(props: ListProps<Type>): ElementNode<ListProps<Type>> {
  return {
    type: List,
    props,
  }
}
