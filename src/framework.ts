export interface ElementNode<Props = {}> {
	type: Component<Props> | string;
	props: Props & { children: ComponentChildren };
}

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
