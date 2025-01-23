import { JSXInternal } from './jsx';

export type { JSXInternal as JSX }

export interface VNode<Props = {}> {
	type: ComponentType<Props> | string;
	props: Props & { children: ComponentChildren };
	/**
	 * ref is not guaranteed by React.ReactElement, for compatibility reasons
	 * with popular react libs we define it as optional too
	 */
	ref?: Ref<any> | null;
	/**
	 * The time this `vnode` started rendering. Will only be set when
	 * the devtools are attached.
	 * Default value: `0`
	 */
	startTime?: number;
	/**
	 * The time that the rendering of this `vnode` was completed. Will only be
	 * set when the devtools are attached.
	 * Default value: `-1`
	 */
	endTime?: number;
}

export type Key = string | number | any;

export type RefObject<T> = { current: T | null };
export type RefCallback<T> = (instance: T | null) => void;
export type Ref<T> = RefObject<T> | RefCallback<T> | null;

export type ComponentChild =
	| VNode<any>
	| object
	| string
	| number
	| bigint
	| boolean
	| null
	| undefined;
export type ComponentChildren = ComponentChild[] | ComponentChild;

export interface Context<T> extends preact.Provider<T> {
	Consumer: preact.Consumer<T>;
	Provider: preact.Provider<T>;
	displayName?: string;
}

export interface Attributes {
	key?: Key | undefined;
	jsx?: boolean | undefined;
}

export interface ClassAttributes<T> extends Attributes {
	ref?: Ref<T>;
}

export interface ErrorInfo {
	componentStack?: string;
}

export interface Component<P = {}, S = {}> {
	componentWillMount?(): void;
	componentDidMount?(): void;
	componentWillUnmount?(): void;
	getChildContext?(): object;
	componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
	shouldComponentUpdate?(
		nextProps: Readonly<P>,
		nextState: Readonly<S>,
		nextContext: any
	): boolean;
	componentWillUpdate?(
		nextProps: Readonly<P>,
		nextState: Readonly<S>,
		nextContext: any
	): void;
	getSnapshotBeforeUpdate?(oldProps: Readonly<P>, oldState: Readonly<S>): any;
	componentDidUpdate?(
		previousProps: Readonly<P>,
		previousState: Readonly<S>,
		snapshot: any
	): void;
	componentDidCatch?(error: any, errorInfo: ErrorInfo): void;
}

export interface ComponentClass<P = {}, S = {}> {
	new (props: P, context?: any): Component<P, S>;
	displayName?: string;
	defaultProps?: Partial<P>;
	contextType?: Context<any>;
	getDerivedStateFromProps?(
		props: Readonly<P>,
		state: Readonly<S>
	): Partial<S> | null;
	getDerivedStateFromError?(error: any): Partial<S> | null;
}

export interface FunctionComponent<P = {}> {
	(props: RenderableProps<P>, context?: any): ComponentChildren;
	displayName?: string;
	defaultProps?: Partial<P> | undefined;
}

export type RenderableProps<P, RefType = any> = (
	P &
	Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<RefType> }>
);

export type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;



/**
 * Create an virtual node (used for JSX)
 * @param {import('./internal').VNode["type"]} type The node name or Component constructor for this
 * virtual node
 * @param {object | null | undefined} [props] The properties of the virtual node
 * @param {Array<import('.').ComponentChildren>} [children] The children of the
 * virtual node
 * @returns {import('./internal').VNode}
 */
export function createElement(
	type: 'input',
	props:
		| (JSXInternal.DOMAttributes<HTMLInputElement> &
				ClassAttributes<HTMLInputElement>)
		| null,
	...children: ComponentChild[]
): VNode<
	JSXInternal.DOMAttributes<HTMLInputElement> &
		ClassAttributes<HTMLInputElement>
>;
export function createElement<
	P extends JSXInternal.HTMLAttributes<T>,
	T extends HTMLElement
>(
	type: keyof JSXInternal.IntrinsicElements,
	props: (ClassAttributes<T> & P) | null,
	...children: ComponentChild[]
): VNode<ClassAttributes<T> & P>;
export function createElement<
	P extends JSXInternal.SVGAttributes<T>,
	T extends HTMLElement
>(
	type: keyof JSXInternal.IntrinsicSVGElements,
	props: (ClassAttributes<T> & P) | null,
	...children: ComponentChild[]
): VNode<ClassAttributes<T> & P>;
export function createElement<T extends HTMLElement>(
	type: string,
	props:
		| (ClassAttributes<T> &
				JSXInternal.HTMLAttributes &
				JSXInternal.SVGAttributes)
		| null,
	...children: ComponentChild[]
): VNode<
	ClassAttributes<T> & JSXInternal.HTMLAttributes & JSXInternal.SVGAttributes
>;
export function createElement<P>(
	type: ComponentType<P> | string,
	props: (Attributes & P) | null,
	...children: ComponentChild[]
): VNode<P>;

export function createElement<
	P extends JSXInternal.SVGAttributes<T>,
	T extends HTMLElement
>(
	type: 'input' | keyof JSXInternal.IntrinsicElements | keyof JSXInternal.IntrinsicSVGElements | string | ComponentType<P> | string,
	props: (JSXInternal.DOMAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement>) | (ClassAttributes<T> & P) | (ClassAttributes<T> & JSXInternal.HTMLAttributes & JSXInternal.SVGAttributes) | (Attributes & P) | null,
	...children: ComponentChild[]
):
	VNode<JSXInternal.DOMAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement>> |
	VNode<ClassAttributes<T> & P> |
	VNode<ClassAttributes<T> & P> |
	VNode<ClassAttributes<T> & JSXInternal.HTMLAttributes & JSXInternal.SVGAttributes> |
	VNode<P>
{
	if (props === null) props = {}
	const normalizedProps = { ...props, children };

	// If a Component VNode, check for and apply defaultProps
	// Note: type may be undefined in development, must never error here.
	if (typeof type == 'function' && type.defaultProps != null) {
		for (let i in type.defaultProps) {
			if (normalizedProps[i as keyof typeof normalizedProps] === undefined) {
				normalizedProps[i as keyof typeof normalizedProps] = type.defaultProps[i];
			}
		}
	}

	return createVNode(type, normalizedProps);
}

/**
 * Create a VNode (used internally by Preact)
 * @param {import('./internal').VNode["type"]} type The node name or Component
 * Constructor for this virtual node
 * @param {object | string | number | null} props The properties of this virtual node.
 * If this virtual node represents a text node, this is the text of the node (string or number).
 * @returns {import('./internal').VNode}
 */
export function createVNode<
	P extends JSXInternal.SVGAttributes<T>,
	T extends HTMLElement
>(
	type: string | ComponentClass<P, {}> | FunctionComponent<P>,
	props: (
		(JSXInternal.DOMAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement> & { children: ComponentChild[] })  |
		(ClassAttributes<T> & P & { children: ComponentChild[] }) |
		(ClassAttributes<T> & JSXInternal.HTMLAttributes & JSXInternal.SVGAttributes & { children: ComponentChild[] }) |
		(Attributes & P & { children: ComponentChild[] }))
):
	VNode<JSXInternal.DOMAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement>> |
	VNode<ClassAttributes<T> & P> |
	VNode<ClassAttributes<T> & P> |
	VNode<ClassAttributes<T> & JSXInternal.HTMLAttributes & JSXInternal.SVGAttributes> |
	VNode<P>
{
	// V8 seems to be better at detecting type shapes if the object is allocated from the same call site
	// Do not inline into createElement and coerceToVNode!
	/** @type {import('./internal').VNode} */
	const vnode = {
		type,
		props,
		_children: null,
		_parent: null,
		_depth: 0,
		_dom: null,
		_component: null,
		constructor: undefined,
		_index: -1,
		_flags: 0
	};

	// TODO: Fix
	return vnode as VNode<JSXInternal.DOMAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement>> |
	VNode<ClassAttributes<T> & P> |
	VNode<ClassAttributes<T> & P> |
	VNode<ClassAttributes<T> & JSXInternal.HTMLAttributes & JSXInternal.SVGAttributes> |
	VNode<P>;
}

export function createRef() {
	return { current: null };
}

export function Fragment(props: RenderableProps<{}>) {
	return props.children;
}
