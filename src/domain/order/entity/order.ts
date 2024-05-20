import OrderItem from "./order-item";

export default class Order {
  private _id: string;
  private _customerId: string;
  private _items: OrderItem[] = [];

  constructor(id: string, customerId: string, items: OrderItem[]) {
    this._id = id;
    this._customerId = customerId;
    this._items = items;
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  addItem(item: OrderItem): void {
    this._items.push(item);
  }

  removeItem(itemId: string): void {
    this._items = this._items.reduce((acc, item) => {
      if (item.id !== itemId) {
        acc.push(item);
      }
      return acc;
    }, []);
  }

  validate(): boolean {
    if (!this._id) {
      throw new Error("Id is required");
    }
    if (!this._customerId) {
      throw Error("CustomerId is required");
    }
    if (!this._items.length) {
      throw new Error("Items are required");
    }

    if (this._items.some((item) => item.quantity <= 0)) {
      throw new Error("Quantity must be greater than 0");
    }
    return true;
  }

  total(): number {
    return this._items.reduce((acc, item) => acc + item.orderItemTotal(), 0);
  }
}
