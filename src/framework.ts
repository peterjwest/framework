import { isPrimitive, childrenToArray, primitiveToString } from './util';
import { Component, ElementNode, HTMLNodeProps, ComponentChild, ChildrenNodeProps } from './jsx';
import { Value, InputValue, DerivedValue, IsEqual, ProxyValue, DeriveValueListener } from './value';

import diffList, { ACTIONS } from './diffList';

export function Fragment(props: ChildrenNodeProps) {
  return props.children;
}

export function createState<Type>(value: Type) {
  return new InputValue<Type>(value);
}

export function createElementNode(
  type: string,
  maybeProps: (HTMLNodeProps & ChildrenNodeProps) | null,
): ElementNode<HTMLNodeProps & ChildrenNodeProps>;

export function createElementNode<Props>(
  type: Component<Props>,
  maybeProps: (Props & ChildrenNodeProps) | null,
): ElementNode<Props & ChildrenNodeProps>;

// TODO: Support "key" in props
export function createElementNode<Props>(
  type: string | Component<Props>,
  maybeProps: (HTMLNodeProps & ChildrenNodeProps) | (Props & ChildrenNodeProps) | null,
): ElementNode<HTMLNodeProps> | ElementNode<Props> {
  if (typeof type === 'string') {
    const props = (maybeProps ? maybeProps : {}) as HTMLNodeProps & ChildrenNodeProps;
    return { type, props: { ...props, children: childrenToArray(props.children) } };
  }

  const props = (maybeProps ? maybeProps : {}) as Props & ChildrenNodeProps;
  return { type, props: { ...props, children: childrenToArray(props.children) } };
}

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

/** Inserts an element at the specified index in a parent element */
export function insertAtIndex(parent: HTMLElement, indexValue: Value<number>, element: HTMLElement | Text) {
  const index = indexValue.extract();
  if (index >= parent.children.length) {
    parent.appendChild(element);
  } else {
    parent.insertBefore(element, parent.children[index] as Element);
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
  // TODO: Create StaticValue
  childIndex: Value<number> = new InputValue(0),
  derivedListener?: DeriveValueListener,
): [Unrender | undefined, Value<number>] {

  if (isPrimitive(element)) {
    const textNode = document.createTextNode(primitiveToString(element));
    insertAtIndex(parentElement, childIndex, textNode);
    return [() => textNode.remove(), childIndex.computed((value) => value + 1)];
  }

  if (element instanceof Value) {
    const textNode = document.createTextNode('');
    const updateListener = (value: any) => {
      textNode.textContent = primitiveToString(value);
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

    const events = element.props.events || {};
    for (const name in events) {
      elementNode.addEventListener(name, events[name]);
    }

    let nextChildIndex: Value<number> = new InputValue(0);
    for (const child of element.props.children) {
      const [_, childIndex] = renderElement(child, elementNode, stateWatcher, nextChildIndex, derivedListener);
      nextChildIndex = childIndex;
    }

    insertAtIndex(parentElement, childIndex, elementNode);

    const unrender = () => {
      for (const name in events) {
        elementNode.removeEventListener(name, events[name]);
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

          const prevMetadata = listMetadata[index - 1];
          const startIndex = new ProxyValue(prevMetadata ? prevMetadata.endIndex : childIndex);
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
          const nextMetadata = listMetadata[index + 1];
          const nextIndex = nextMetadata ? nextMetadata.startIndex : finalChildIndex;
          nextIndex.setTarget(metadata.endIndex);
        }
        if (action[0] === ACTIONS.remove) {
          const index = action[1];
          const metadata = listMetadata[index]!;

          if (metadata.unrender) metadata.unrender();

          // Remove proxy index from chain
          const nextMetadata = listMetadata[index + 1];
          const prevMetadata = listMetadata[index - 1];
          const nextIndex = nextMetadata ? nextMetadata.startIndex : finalChildIndex;
          nextIndex.setTarget(prevMetadata ? prevMetadata.endIndex : childIndex)
          metadata.startIndex.deactivate();

          listMetadata.splice(index, 1);
        }
      }

      currentData = nextData;
      for (let index = 0; index < listMetadata.length; index++) {
        listMetadata[index]!.input.update(currentData[index]);
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
