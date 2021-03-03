/* eslint-disable max-classes-per-file */
// Based on https://dev.to/glebirovich/typescript-data-structures-linked-list-3o8i#implementation
// and https://github.com/sfkiwi/linked-list-typescript/blob/master/src/index.ts
// Modified to make mapping easier.

import ListNode from './listNode';

class LinkedList<T> {
  private head: ListNode<T> | null = null;

  constructor(data: T[] = []) {
    data.forEach(i => this.append(i));
  }

  append(data: T): ListNode<T> {
    const node = new ListNode(data);
    if (!this.head) {
      this.head = node;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const getLast = (node: ListNode<T>): ListNode<T> => {
        return node.next ? getLast(node.next) : node;
      };

      const lastNode = getLast(this.head);
      node.prev = lastNode;
      lastNode.next = node;
    }
    return node;
  }

  prepend(data: T): ListNode<T> {
    const node = new ListNode(data);
    if (!this.head) {
      this.head = node;
    } else {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    }
    return node;
  }

  deleteNode(node: ListNode<T>): void {
    if (!node.prev) {
      this.head = node.next;
    } else {
      const prevNode = node.prev;
      prevNode.next = node.next;
    }
  }

  search(comparator: (data: T) => boolean): ListNode<T> | null {
    const checkNext = (node: ListNode<T>): ListNode<T> | null => {
      if (comparator(node.data)) {
        return node;
      }
      return node.next ? checkNext(node.next) : null;
    };

    return this.head ? checkNext(this.head) : null;
  }

  traverse(): T[] {
    const array: T[] = [];
    if (!this.head) {
      return array;
    }

    const addToArray = (node: ListNode<T>): T[] => {
      array.push(node.data);
      return node.next ? addToArray(node.next) : array;
    };
    return addToArray(this.head);
  }

  size(): number {
    return this.traverse().length;
  }

  forEach(callback: (value: T, index: number) => void): void {
    let index = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const val of this) {
      // eslint-disable-next-line no-plusplus
      callback(val, index++);
    }
  }

  async asyncForEach(callback: (value: T) => void): Promise<void> {
    // eslint-disable-next-line no-restricted-syntax
    for (const val of this) {
      // eslint-disable-next-line no-await-in-loop
      await callback(val);
    }
  }

  *iteratorNode(): IterableIterator<ListNode<T>> {
    let currentItem = this.head;

    while (currentItem) {
      yield currentItem;
      currentItem = currentItem.next;
    }
  }

  *iterator(): IterableIterator<T> {
    let currentItem = this.head;

    while (currentItem) {
      yield currentItem.data;
      currentItem = currentItem.next;
    }
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.iterator();
  }

  *map<TNew>(callback: (item: T) => TNew): IterableIterator<TNew> {
    // eslint-disable-next-line no-restricted-syntax
    for (const node of this) {
      yield callback(node);
    }
  }

  *mapNode<TNew>(
    callback: (item: ListNode<T>, index: number) => TNew
  ): IterableIterator<TNew> {
    let index = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const node of this.iteratorNode()) {
      // eslint-disable-next-line no-plusplus
      yield callback(node, index++);
    }
  }

  mapReact<TNew>(callback: (item: ListNode<T>, index: number) => TNew): TNew[] {
    return Array.from(this.iteratorNode(), callback);
  }
}

export default LinkedList;
