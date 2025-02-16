/** Item in a list which contains a key */
type Item<Key extends string> = { [ItemKey in Key]: any }

/** Finds the max difference between indexes in a map */
function maxDiffIndex(transformMap: Map<number, number>) {
  let max = 0;
  let maxIndex: number | undefined = undefined;
  for (const [currentIndex, nextIndex] of transformMap.entries()) {
    const diff = Math.abs(nextIndex - currentIndex)
    if (diff > max) {
      max = diff;
      maxIndex = currentIndex;
    }
  }
  return maxIndex;
}

/** Creates a map from item keys to indexes */
function createKeyMap<Key extends string>(list: Item<Key>[], key: Key) {
  const keyMap = new Map<any, number>();
  for (let i = 0; i < list.length; i++) {
    keyMap.set(list[i][key], i);
  }
  return keyMap;
}

type Action = ['move', number, number] | ['add', number] | ['remove', number];

/** Computes the actions to update a list */
export default function diffList<Key extends string>(currentList: Item<Key>[], nextList: Item<Key>[], key: Key) {
  const actions: Action[] = [];

  const nextKeyMap = createKeyMap(nextList, key);

  /** List of removed items, included ones to be reassigned */
  const removedItemsList = [];
  for (let index = 0; index < currentList.length; index++) {
    const itemKey = currentList[index][key];
    const nextIndex = nextKeyMap.get(itemKey);
    if (nextIndex === undefined) {
      removedItemsList.push(index);
    }
  }

  const addedCount = nextList.length - (currentList.length - removedItemsList.length);

  /** The number of removed items which can be reassigned to added items */
  const reassignCount = Math.min(addedCount, removedItemsList.length);

  /** Set of removed items, excluding reassignments */
  const removedItems = new Set(removedItemsList.slice(reassignCount));

  const prunedCurrentList: Item<Key>[] = [];
  // Iterate backwards to avoid messing up indexes
  for (let currentIndex = currentList.length - 1; currentIndex >= 0; currentIndex--) {
    if (removedItems.has(currentIndex)) {
      actions.push(['remove', currentIndex]);
    } else {
      prunedCurrentList.push(currentList[currentIndex]);
    }
  }
  prunedCurrentList.reverse();

  const currentKeyMap = createKeyMap(prunedCurrentList, key);

  // Create a set of additions
  const addedItems = new Set<number>();
  for (let nextIndex = 0; nextIndex < nextList.length; nextIndex++) {
    const itemKey = nextList[nextIndex][key];
    const currentIndex = currentKeyMap.get(itemKey);
    if (currentIndex === undefined) {
      addedItems.add(nextIndex);
    }
  }

  /** The number of items which must be added to the DOM */
  const strictAddCount = addedItems.size - reassignCount;

  // Create a new list of elements to be moved around
  const prunedNextList: Item<Key>[] = [];
  let added = 0;
  // Iterate backwards to avoid messing up indexes
  for (let nextIndex = nextList.length - 1; nextIndex >= 0; nextIndex--) {
    if (addedItems.has(nextIndex) && added < strictAddCount) {
      added++;
    } else {
      if (addedItems.has(nextIndex)) addedItems.delete(nextIndex);
      prunedNextList.push(nextList[nextIndex]);
    }
  }
  prunedNextList.reverse();

  // Create mapping of index offsets from currentList to nextList
  const transformMap = new Map<number, number>();
  let removedIndex = 0;
  for (let nextIndex = 0; nextIndex < prunedNextList.length; nextIndex++) {
    const nextItemKey = prunedNextList[nextIndex][key];
    const currentIndex = currentKeyMap.get(nextItemKey);
    if (currentIndex !== undefined) {
      transformMap.set(currentIndex, nextIndex);
      currentKeyMap.delete(nextItemKey);
    } else {
      transformMap.set(removedItemsList[removedIndex++], nextIndex);
    }
  }

  // TODO: If the max diff is one, don't need to search anymore
  let currentIndex = maxDiffIndex(transformMap);
  while (currentIndex !== undefined) {
    const nextIndex = transformMap.get(currentIndex) as number;
    actions.push(['move', currentIndex, nextIndex]);

    let replaceValue = nextIndex;
    const direction = nextIndex - currentIndex > 0 ? 1 : -1;
    for (let index = nextIndex; direction === 1 ? index >= currentIndex : index <= currentIndex; index -= direction) {
      const value = transformMap.get(index) as number;
      transformMap.set(index, replaceValue);
      replaceValue = value;
    }
    currentIndex = maxDiffIndex(transformMap);
  }

  for (const index of addedItems) {
    actions.push(['add', index])
  }

  return actions;
}
