import { createEnumNumeric  } from './util';

/** Item in a list which contains a key */
export type Item<Key extends string> = { [ItemKey in Key]?: any }

/** Enum of list diff actions  */
export const ACTIONS = createEnumNumeric(['move', 'add', 'remove', 'replace']);

type MoveAction = [typeof ACTIONS.move, number, number];
type AddAction = [typeof ACTIONS.add, number];
type RemoveAction = [typeof ACTIONS.remove, number];
type ReplaceAction = [typeof ACTIONS.replace, number, number];
type Action = MoveAction | AddAction | RemoveAction | ReplaceAction;

/** Gets an item key, falling back to the item itself */
function getItemKey(item: any, key?: string): any {
  const itemKey = item && key !== undefined ? item[key] : undefined;
  return itemKey === undefined || itemKey === null ? item : itemKey;
}

/** Finds the max difference between indexes in a map */
function maxDiffIndex(transformMap: Map<number, number>, prevMax?: number): [number | undefined, number] {
  let max = 0;
  let maxIndex: number | undefined = undefined;
  for (const [currentIndex, nextIndex] of transformMap.entries()) {
    const diff = Math.abs(nextIndex - currentIndex);
    if (diff > max) {
      max = diff;
      maxIndex = currentIndex;

      // If the previous max was 1, the next one cannot be higher, so we can exit early
      if (prevMax === 1) break;
    }
  }
  return [maxIndex, max];
}

/** Creates a map from item keys to indexes */
function createKeyMap(list: any[], key?: string): Map<any, number[]> {
  const keyMap = new Map<any, number[]>();
  for (let i = 0; i < list.length; i++) {
    const itemKey = getItemKey(list[i]!, key);
    const mapItem = keyMap.get(itemKey);
    if (mapItem) {
      mapItem.push(i);
    } else {
      keyMap.set(itemKey, [i]);
    }
  }
  for (const value of keyMap.values()) {
    value.reverse();
  }
  return keyMap;
}

/** Computes the actions to update a list */
export default function diffList(currentList: any[], nextList: any[], key?: string) {
  const actions: Action[] = [];

  const nextKeyMap = createKeyMap(nextList, key);

  /** List of removed items, including ones to be replaced */
  const removedItemsList: number[] = [];

  for (let currentIndex = 0; currentIndex < currentList.length; currentIndex++) {
    const itemKey = getItemKey(currentList[currentIndex]!, key);
    const nextIndexList = nextKeyMap.get(itemKey);
    const nextIndex = nextIndexList && nextIndexList.pop();
    if (nextIndex === undefined) {
      removedItemsList.push(currentIndex);
    }
  }

  const addedCount = nextList.length - (currentList.length - removedItemsList.length);

  /** Set of removed items, excluding replacements */
  const removedItems = new Set(removedItemsList.slice(addedCount));
  /** Current list with removals (but not replacements) removed */
  const prunedCurrentList: any[] = [];

  for (let currentIndex = 0; currentIndex < currentList.length; currentIndex++) {
    if (removedItems.has(currentIndex)) {
      actions.push([ACTIONS.remove, currentIndex]);
    } else {
      prunedCurrentList.push(currentList[currentIndex]!);
    }
  }

  // Reverse actions so each removal doesn't affect indexes of the next
  actions.reverse();

  const currentKeyMap = createKeyMap(prunedCurrentList, key);

  /** Set of additions, excluding replacements */
  const addedItems = new Set<number>();
  /** Map of desired transformation of list indexes */
  const transformMap = new Map<number, number>();

  /** Index of current next item (excluding added items) */
  let newNextIndex = 0;

  /** Track number of items replaced */
  let replaced = 0;
  for (let nextIndex = 0; nextIndex < nextList.length; nextIndex++) {
    const nextItemKey = getItemKey(nextList[nextIndex]!, key);
    const currentIndexList = currentKeyMap.get(nextItemKey);
    const currentIndex = currentIndexList && currentIndexList.pop();

    // If there's no currentIndex this is an added item
    if (currentIndex === undefined) {
      // If there are removed items, replace instead of adding
      if (replaced < removedItemsList.length) {
        const removedIndex = removedItemsList[replaced++]!;
        actions.push([ACTIONS.replace, removedIndex, nextIndex]);
        transformMap.set(removedIndex, newNextIndex++);
      } else {
        addedItems.add(nextIndex);
      }
    } else {
      transformMap.set(currentIndex, newNextIndex++);
    }
  }

  // Iteratively move the most impactful element until we have the correct order
  let [currentIndex, currentMax] = maxDiffIndex(transformMap);
  while (currentIndex !== undefined) {
    const nextIndex = transformMap.get(currentIndex) as number;
    actions.push([ACTIONS.move, currentIndex, nextIndex]);

    // Move the intend item, then update all affected item indexes
    let substituteIndex = nextIndex;
    const direction = nextIndex - currentIndex > 0 ? 1 : -1;
    for (let index = nextIndex; direction === 1 ? index >= currentIndex : index <= currentIndex; index -= direction) {
      const mappedIndex = transformMap.get(index) as number;
      transformMap.set(index, substituteIndex);
      substituteIndex = mappedIndex;
    }
    [currentIndex, currentMax] = maxDiffIndex(transformMap, currentMax);
  }

  for (const index of addedItems) {
    actions.push([ACTIONS.add, index])
  }

  return actions;
}


// diffList algorithm:
// REMOVALS
// - create nextKeyMap of next item key -> index
// - iterate through current items
//   - items missing from nextKeyMap are removals
// ADDITIONS / REPLACEMENTS
// - compute added count
// - compute replaced count
// - create pruned current items, without removed items
// - create currentKeyMap from pruned list of current item key -> index
// - iterate through next items
//   - items missing from currentKeyMap are additions
//   - items within replaced count are replacements
// MOVES
// - create pruned next list, without added items
// - iterate through pruned next list
//   - create transformMap of current index -> next index
// - while not finished:
//   - move index with max diff to new position
