import { Unrender } from './util';
import IndexRange from './IndexRange';
import { PropertyValue, InputPropertyValue } from './value';

/**
 * Metadata for a list item:
 * - Value for the data of the item
 * - IndexRange to track the final index of the item
 * - unrender function for removing the item
 */
type ListItemMetadata = {
  value: PropertyValue<any, any[], number> | InputPropertyValue<any, any[], number>;
  range: IndexRange;
  unrender: Unrender | undefined;
}

/** Stores/manages ListItemMetadata */
export default class ListIndexManager {
  list: ListItemMetadata[] = [];
  inputRange: IndexRange;
  outputRange: IndexRange;

  constructor(inputRange: IndexRange) {
    this.inputRange = inputRange;
    this.outputRange = inputRange.next();
  }

  /** Adds a new item to the list and IndexRange chain */
  addToList(index: number, metadata: ListItemMetadata) {
    this.list.splice(index, 0, metadata);
    this.getRange(index - 1).setChild(metadata.range);
    metadata.range.setChild(this.getRange(index + 1));
  }

  /** Removes an item from the list and IndexRange chain */
  removeFromList(index: number) {
    this.getRange(index - 1).setChild(this.getRange(index + 1));
    this.list.splice(index, 1);
  }

  /** Gets the IndexRange for an index, the first index is `this.inputRange` and the last is `this.outputRange` */
  getRange(index: number) {
    if (index === -1) return this.inputRange;
    if (index === this.list.length) return this.outputRange;
    if (index >= 0 && index < this.list.length) return this.list[index]!.range;
    throw new Error(`Index ${index} out of range`);
  }

  /**
   * Temporarily remove outputRange child to prevent updating all children during a batch of actions,
   * returns a function to restore the child and update child indexes.
   */
  startBatch() {
    const detachedChild = this.outputRange.child;
    this.outputRange.child = undefined;

    return () => {
      this.outputRange.child = detachedChild;
      this.outputRange.updateChildren();
    }
  }

  /** Updates the property of all values after mutation */
  updateValues() {
    // TODO: Can this optimised?
    for (let index = 0; index < this.list.length; index++) {
      this.list[index]!.value.setProperty(index);
    }
  }
}
