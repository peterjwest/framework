import { JSXInternal  } from './jsx';
import { Fragment, VNode, ComponentChild, ComponentType, Attributes } from './framework';

let vnodeId = 0;

/**
 * @fileoverview
 * This file exports various methods that implement Babel's "automatic" JSX runtime API:
 * - jsx(type, props, key)
 * - jsxs(type, props, key)
 * - jsxDEV(type, props, key, __source, __self)
 *
 * The implementation of createVNode here is optimized for performance.
 * Benchmarks: https://esbench.com/bench/5f6b54a0b4632100a7dcd2b3
 */

/**
 * JSX.Element factory used by Babel's {runtime:"automatic"} JSX transform
 */

type CreateVNodeProps<P> = (
	(
		JSXInternal.HTMLAttributes &
		JSXInternal.SVGAttributes &
		Record<string, any> & { children?: ComponentChild }
	) |
	Attributes & P & { children?: ComponentChild }
);

function createVNode(
	type: string,
	props: JSXInternal.HTMLAttributes &
		JSXInternal.SVGAttributes &
		Record<string, any> & { children?: ComponentChild },
	key?: string,
): VNode<any>;

function createVNode<P>(
	type: ComponentType<P>,
	props: Attributes & P & { children?: ComponentChild },
	key?: string,
): VNode<any>;

function createVNode<P>(
	type: string | ComponentType<P>,
	props: CreateVNodeProps<P>,
	key?: string,
): VNode<any> {
	if (!props) props = {};

	/** @type {VNode & { __source: any; __self: any }} */
	const vnode = {
		type,
		props,
		key,
		_children: null,
		_parent: null,
		_depth: 0,
		_dom: null,
		_component: null,
		constructor: undefined,
		_original: --vnodeId,
		_index: -1,
		_flags: 0,
	};

	return vnode;
}

export {
	createVNode as jsx,
	createVNode as jsxs,
	createVNode as jsxDEV,
	Fragment,
};
export type { JSXInternal as JSX };
