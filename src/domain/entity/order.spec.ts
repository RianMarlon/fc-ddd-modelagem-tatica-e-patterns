import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let order = new Order("", "123", []);
    }).toThrow("Id is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order = new Order("123", "", []);
    }).toThrow("CustomerId is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order = new Order("123", "123", []);
    }).toThrow("Items are required");
  });

  it("should calculate total", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
    const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);

    const order = new Order("o1", "c1", [item]);
    expect(order.total()).toBe(200);

    const order2 = new Order("o2", "c2", [item, item2]);
    expect(order2.total()).toBe(600);
  });

  it("should check if the item quantity is less or equal zero", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 0);
      const order = new Order("o1", "c1", [item]);
    }).toThrow("Quantity must be greater than 0");
  });
});
