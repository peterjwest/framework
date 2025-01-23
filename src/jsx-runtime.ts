import { JSXInternal  } from './jsx';
import { Fragment, ElementNode, ChildrenNodeProps, Component } from './framework';

type HtmlNodeProps = JSXInternal.HTMLAttributes & JSXInternal.SVGAttributes & Record<string, any>;

function createElementNode(
	type: string,
	props: HtmlNodeProps & ChildrenNodeProps,
): ElementNode<any>;

function createElementNode<Props>(
	type: Component<Props>,
	props: Props & ChildrenNodeProps,
): ElementNode<any>;

function createElementNode<Props>(
	type: string | Component<Props>,
	props: (HtmlNodeProps | Props) & ChildrenNodeProps,
): ElementNode<any> {
	if (!props) props = {};

	if (props.children && !Array.isArray(props.children)) {
		props.children = [props.children];
	}

	return { type, props };
}

export {
	createElementNode as jsx,
	createElementNode as jsxs,
	createElementNode as jsxDEV,
	Fragment,
};
export type { JSXInternal as JSX };
