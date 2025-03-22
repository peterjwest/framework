import { isPrimitive, childrenToArray, primitiveToString } from './util';
import { Component, ElementNode, ComponentChild, ChildrenNodeProps } from './jsx';
import { Value, AnyValue, InputValue, InputPropertyValue, PropertyValue, DerivedValue, IsEqual, ComputedValue, InputArrayViewValue } from './value';
import DeriveValueListener from './DeriveValueListener';
import IndexRange from './IndexRange';

import diffList, { ACTIONS } from './diffList';

export function Fragment(props: ChildrenNodeProps) {
  return props.children;
}

export function createState<Type>(value: Type) {
  return new InputValue<Type>(value);
}

export function createElementNode<Props extends ChildrenNodeProps>(
  type: string | Component<Props>,
  maybeProps: Props | null,
  key: any,
): ElementNode<Props> {
  const props = (maybeProps ? maybeProps : {}) as Props;
  const maybeKey = key === undefined ? {} : { key };
  return { type, props: { ...props, ...maybeKey, children: childrenToArray(props.children) } };
}

interface ConditionProps {
  if: AnyValue<any>,
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

interface ComputedListProps<Type> {
  data: ComputedValue<Type[]>,
  itemKey: string,
  itemIsEqual?: IsEqual<Type>,
  each: (item: PropertyValue<Type, any, any>) => ComponentChild,
}

interface InputListProps<Type> {
  data: InputValue<Type[]> | InputPropertyValue<Type[], any, any>,
  itemKey: string,
  itemIsEqual?: IsEqual<Type>,
  each: (item: InputPropertyValue<Type, any, any>) => ComponentChild,
}

interface InputArrayViewListProps<Type> {
  data: InputArrayViewValue<Type>,
  itemKey: string,
  itemIsEqual?: IsEqual<Type>,
  each: (item: InputPropertyValue<Type, any, any>) => ComponentChild,
}

type ListProps<Type> = ComputedListProps<Type> | InputListProps<Type> | InputArrayViewListProps<Type>;
type ListReturn<Type> = ElementNode<ComputedListProps<Type>> | ElementNode<InputListProps<Type>> | ElementNode<InputArrayViewListProps<Type>>;

export function List<Type>(props: ComputedListProps<Type>): ElementNode<ComputedListProps<Type>>;
export function List<Type>(props: InputListProps<Type>): ElementNode<InputListProps<Type>>;
export function List<Type>(props: InputArrayViewListProps<Type>): ElementNode<InputArrayViewListProps<Type>>;
export function List<Type>(props: ListProps<Type>): ListReturn<Type> {
  // Note: this is never actually called, but needed for types
  return {
    type: List,
    props: { ...props, children: [] },
  } as ListReturn<Type>;
}

export function permuteValues(inputs: Value<any>[], values: Value<any>[] = []) {
  values = values.concat(inputs);
  for (const input of inputs) {
    values = permuteValues(Array.from(input.derivedValues), values);
  }
  return values;
}

/** Inserts an element at the specified index in a parent element */
export function insertAtIndex(parent: HTMLElement, index: number, element: HTMLElement | Text) {
  if (index >= parent.childNodes.length) {
    parent.appendChild(element);
  } else {
    parent.insertBefore(element, parent.childNodes[index] as Element);
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
  value: PropertyValue<any, any[], number> | InputPropertyValue<any, any[], number>
  range: IndexRange
  unrender: Unrender | undefined
}

/** Maps a property value before applying to the DOM */
function mapProperty(name: string, value: any) {
  // Data attributes are set without modification
  if (name.startsWith('data-')) {
    return value;
  }

  if (typeof value === 'boolean') {
    // Aria booleans are set with string values
    if (name.startsWith('aria-')) {
      return value ? 'true' : 'false';
    }

    // Conventional booleans are set with empty string or unset
    return value ? '' : undefined;
  }

  return value === undefined ? undefined : value;
}

export function renderElement(
  element: ComponentChild,
  parentElement: HTMLElement,
  stateWatcher = new StateWatcher(),
  inputRange = new IndexRange(),
  derivedListener?: DeriveValueListener,
): [Unrender | undefined, IndexRange] {

  if (isPrimitive(element)) {
    const textNode = document.createTextNode(primitiveToString(element));
    insertAtIndex(parentElement, inputRange.nextIndex(), textNode);
    return [() => textNode.remove(), inputRange.increment()];
  }

  if (element instanceof Value) {
    const textNode = document.createTextNode('');
    const updateListener = (value: any) => {
      textNode.textContent = primitiveToString(value);
    }
    element.addUpdateListener(updateListener);
    insertAtIndex(parentElement, inputRange.nextIndex(), textNode);
    const unrender = () => {
      element.removeUpdateListener(updateListener);
      textNode.remove();
    }
    return [unrender, inputRange.increment()];
  }

  if (element.type === Fragment) {
    const unrenders: Unrender[] = [];
    let nextChildIndex = inputRange;
    for (const child of element.props.children) {
      const [unrender, inputRange] = renderElement(child, parentElement, stateWatcher, nextChildIndex, derivedListener);
      if (unrender) unrenders.push(unrender);
      nextChildIndex = inputRange;
    }

    return [() => { for (const unrender of unrenders) unrender(); }, nextChildIndex];
  }

  if (typeof element.type === 'string') {
    const elementNode = document.createElement(element.type);

    const propertyValueListeners: Array<[Value<any>, (value: any) => void]> = []
    for (const property in element.props) {
      if (property === 'children' || property == 'events') continue;
      const value = element.props[property];

      if (value instanceof Value) {
        elementNode.setAttribute(property, value.extract());
        const listener = (value: any) => {
          (elementNode as any)[property] = mapProperty(property, value);
        }
        value.addUpdateListener(listener);
        propertyValueListeners.push([value, listener]);
      }
      else {
        elementNode.setAttribute(property, value);
        (elementNode as any)[property] = mapProperty(property, value);
      }
    }


    const events = element.props.events || {};
    for (const name in events) {
      elementNode.addEventListener(name, events[name]);
    }

    let nextChildIndex = new IndexRange();
    for (const child of element.props.children) {
      const [_, inputRange] = renderElement(child, elementNode, stateWatcher, nextChildIndex, derivedListener);
      nextChildIndex = inputRange;
    }

    insertAtIndex(parentElement, inputRange.nextIndex(), elementNode);

    const unrender = () => {
      for (const name in events) {
        elementNode.removeEventListener(name, events[name]);
      }
      for (const [value, listener] of propertyValueListeners) {
        value.removeUpdateListener(listener);
      }
      elementNode.remove()
    }

    return [unrender, inputRange.increment()];
  }

  if (element.type === List) {
    const component: ElementNode<ComputedListProps<unknown>> | ElementNode<InputListProps<unknown>> = element;

    let currentData: any[] = [];
    const listMetadata: ListItemMetadata[] = [];
    const listRange = inputRange.next();
    const outputRange = listRange.next();

    function addToList(index: number, metadata: ListItemMetadata) {
      listMetadata.splice(index, 0, metadata);
      getRange(index - 1).setChild(metadata.range);
      metadata.range.setChild(getRange(index + 1));
    }

    function removeFromList(index: number) {
      getRange(index - 1).setChild(getRange(index + 1));
      listMetadata.splice(index, 1);
    }

    function getRange(index: number) {
      if (index === -1) return listRange;
      if (index === listMetadata.length) return outputRange;
      if (index >= 0 && index < listMetadata.length) return listMetadata[index]!.range;
      throw new Error(`Index ${index} out of range`);
    }

    const updateListener = (nextData: any[]) => {
      const actions = diffList(currentData, nextData, component.props.itemKey);

      // Temporarily remove outputRange child to prevent updating all children on each action
      const outputRangeChild = outputRange.child;
      outputRange.child = undefined;

      for (const action of actions) {
        if (action[0] === ACTIONS.add) {
          const index = action[1];
          const value = component.props.data.get(index);

          const itemRange = getRange(index - 1).next();
          const childComponent: ElementNode<{}> = {
            type: function ListItem() { return component.props.each(value as any); },
            props: { children: [] },
          };
          const [unrender, renderedRange] = renderElement(childComponent, parentElement, stateWatcher, itemRange, derivedListener);

          addToList(index, { unrender, value, range: renderedRange });
          itemRange.updateChildren();
        }

        if (action[0] === ACTIONS.move) {
          const currentIndex = action[1];
          const newIndex = action[2];

          const metadata = listMetadata[currentIndex]!;
          const sourceRange = getRange(currentIndex);
          let destinationIndex = getRange(newIndex).startIndex;

          if (currentIndex > newIndex) {
            for (let i = sourceRange.startIndex; i < sourceRange.nextIndex(); i++) {
               insertAtIndex(parentElement, destinationIndex++, parentElement.childNodes[i]! as HTMLElement | Text);
            }
          }
          else {
            for (let i = sourceRange.nextIndex() - 1; i >= sourceRange.startIndex; i--) {
              insertAtIndex(parentElement, destinationIndex--, parentElement.childNodes[i]! as HTMLElement | Text);
            }
          }

          removeFromList(currentIndex);
          addToList(newIndex, metadata);
          getRange(Math.min(currentIndex, newIndex) - 1).updateChildren();
        }

        if (action[0] === ACTIONS.remove) {
          const index = action[1];
          const metadata = listMetadata[index]!;
          component.props.data.removePropertyValue(metadata.value as any);

          if (metadata.unrender) metadata.unrender();

          removeFromList(index);
          getRange(index - 1).updateChildren();
        }
      }

      // Reinstate outputRange child and update children
      outputRange.child = outputRangeChild;
      outputRange.updateChildren();

      currentData = nextData;
      for (let index = 0; index < listMetadata.length; index++) {
        listMetadata[index]!.value.setProperty(index);
      }
    }

    component.props.data.addUpdateListener(updateListener);

    const unrender = () => {
      for (const metadata of listMetadata) if (metadata.unrender) metadata.unrender();
      component.props.data.removeUpdateListener(updateListener);
      for (const metadata of listMetadata) {
        component.props.data.removePropertyValue(metadata.value as any);
      }
    }

    return [unrender, outputRange];
  }

  if (element.type === Condition) {
    const component: ElementNode<ConditionProps> = element;

    let conditionRange = inputRange.next();
    let outputRange = conditionRange.next();
    let unrenderBlock: Unrender | undefined;
    let renderedRange: IndexRange | undefined;
    let lastCondition: boolean | undefined;

    const updateListener = (condition: any) => {
      if (lastCondition === Boolean(condition)) return;
      lastCondition = Boolean(condition);

      const block = condition ? component.props.then : component.props.else;
      if (unrenderBlock) {
        unrenderBlock();
        unrenderBlock = undefined;
      }

      conditionRange.count = 0;
      if (block) {
        const component: ComponentChild = (
          typeof block === 'function' ?
          { type: function ConditionBlock() { return block() }, props: { children: [] }} :
          block
        );

        [unrenderBlock, renderedRange] = renderElement(component, parentElement, stateWatcher, conditionRange, derivedListener);
        renderedRange.setChild(outputRange);
        renderedRange.updateChildren();

      } else {
        conditionRange.setChild(outputRange);
        conditionRange.updateChildren();
        if (renderedRange) renderedRange.child = undefined;
      }
    };

    component.props.if.addUpdateListener(updateListener);

    const unrender = () => {
      component.props.if.removeUpdateListener(updateListener);
      if (unrenderBlock) unrenderBlock();
    };

    return [unrender, outputRange];
  }

  const processedElement = element.type(element.props, stateWatcher.createState);
  const derivedMapping: Map<Value<any>, DerivedValue<unknown>> = derivedListener ? derivedListener.extract() : new Map();
  const values = permuteValues(Array.from(derivedMapping.values()), stateWatcher.extract());

  const newListener = new DeriveValueListener(values, derivedListener);
  const [unrenderElement, nextChildIndex] = renderElement(processedElement, parentElement, stateWatcher, inputRange, newListener);

  const unrender = () => {
    if (unrenderElement) unrenderElement();

    if (derivedListener) derivedListener.removeChild(newListener);
    for (const [input, derived] of derivedMapping.entries()) {
      input.removeDerivedValue(derived);
    }
  }

  return [unrender, nextChildIndex];
}
