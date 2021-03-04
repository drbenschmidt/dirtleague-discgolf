class ListNode<T> {
  public id: number | null = null;

  public next: ListNode<T> | null = null;

  public prev: ListNode<T> | null = null;

  constructor(public data: T, id: number | null = null) {
    this.id = id;
  }
}

export default ListNode;
