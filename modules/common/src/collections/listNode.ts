class ListNode<T> {
  public next: ListNode<T> | null = null;

  public prev: ListNode<T> | null = null;

  constructor(public data: T) {}
}

export default ListNode;
