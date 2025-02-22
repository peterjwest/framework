import { InputValue, Value } from './value';
import { IntrinsicMathMLElements } from './mathML';
import { SVGAttributes, IntrinsicSVGElements } from './svg';
import { HTMLAttributes, IntrinsicHTMLElements } from './html';

export type Primitive = string | number | bigint | boolean | null | undefined;

export interface ElementNode<Props = {}> {
  type: Component<Props> | string;
  props: Props & { children: ComponentChild[] };
}

export type ComponentChild = ElementNode<any> | Value<any> | Primitive;
export type ComponentChildren = ComponentChild[] | ComponentChild;
export type ChildrenNodeProps = { children?: ComponentChildren };
export type CreateState = <Type>(value: Type) => InputValue<Type>;
export type HTMLNodeProps = HTMLAttributes & SVGAttributes & Omit<Record<string, any>, 'children'>;

export interface Component<Props = {}> {
  (props: Props & ChildrenNodeProps, createState: CreateState): ComponentChild;
}

export namespace JSX {
  export type IntrinsicElements = IntrinsicHTMLElements & IntrinsicSVGElements & IntrinsicMathMLElements;

  // See: https://www.typescriptlang.org/docs/handbook/jsx.html#the-jsx-function-return-type
  export type ElementType = keyof IntrinsicElements | Component<any>;
  export type Element = ElementNode<any>;
  export type ElementClass = Component<any>;

  // See: https://www.typescriptlang.org/docs/handbook/jsx.html#attribute-type-checking
  export type IntrinsicAttributes = {};
  export interface ElementAttributesProperty { props: any }

  // See: https://www.typescriptlang.org/docs/handbook/jsx.html#children-type-checking
  export interface ElementChildrenAttribute { children: any }

  // TODO: Look into JSX.IntrinsicClassAttributes<T>
}
