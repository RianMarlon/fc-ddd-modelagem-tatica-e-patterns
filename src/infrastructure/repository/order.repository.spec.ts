import { Sequelize } from "sequelize-typescript";
import CustomerRepository from "./customer.repository";
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import OrderModel from "../db/sequelize/model/order.model";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: {
        id: order.id,
      },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should return a order by id", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("C1", "Name");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("P1", "Product", 10);

    await productRepository.create(product);

    const orderItem1 = new OrderItem(
      "OI1",
      product.name,
      product.price,
      product.id,
      5
    );

    const orderRepository = new OrderRepository();
    const order = new Order("O1", customer.id, [orderItem1]);

    await orderRepository.create(order);

    const orderFound = await orderRepository.find(order.id);
    expect(orderFound).toStrictEqual(order);
  });

  it("should throw an error when order is not found", async () => {
    const orderRepository = new OrderRepository();
    await expect(orderRepository.find("12")).rejects.toThrow("Order not found");
  });

  it("should return all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("C1", "Name");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product("P1", "Product 1", 10);
    const product2 = new Product("P2", "Product 2", 50);

    await productRepository.create(product1);
    await productRepository.create(product2);

    const orderItem1 = new OrderItem(
      "OI1",
      product1.name,
      product1.price,
      product1.id,
      2
    );

    const orderItem2 = new OrderItem(
      "OI2",
      product1.name,
      product1.price,
      product1.id,
      5
    );

    const orderRepository = new OrderRepository();
    const order1 = new Order("O1", customer.id, [orderItem1]);
    const order2 = new Order("O2", customer.id, [orderItem2]);

    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();
    expect(orders).toStrictEqual([order1, order2]);
  });

  it("should add a item to the order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("C1", "Name");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("P1", "Product", 10);

    await productRepository.create(product);

    const orderItem1 = new OrderItem(
      "OI1",
      product.name,
      product.price,
      product.id,
      5
    );

    const orderItem2 = new OrderItem(
      "OI2",
      product.name,
      product.price,
      product.id,
      30
    );

    const orderRepository = new OrderRepository();
    const order = new Order("O1", customer.id, [orderItem1]);

    await orderRepository.create(order);

    const oldOrder = await orderRepository.find(order.id);

    expect(oldOrder).toStrictEqual(order);

    order.addItem(orderItem2);
    await orderRepository.update(order);
    const changedOrder = await orderRepository.find(order.id);

    expect(changedOrder).toStrictEqual(order);
  });

  it("should remove a item from the order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("C1", "Name");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("P1", "Product", 10);

    await productRepository.create(product);

    const orderItem1 = new OrderItem(
      "OI1",
      product.name,
      product.price,
      product.id,
      5
    );

    const orderItem2 = new OrderItem(
      "OI2",
      product.name,
      product.price,
      product.id,
      30
    );

    const orderItem3 = new OrderItem(
      "OI3",
      product.name,
      product.price,
      product.id,
      45
    );

    const orderRepository = new OrderRepository();
    const order = new Order("O1", customer.id, [orderItem1, orderItem2]);

    await orderRepository.create(order);

    const oldOrder = await orderRepository.find(order.id);

    expect(oldOrder).toStrictEqual(order);

    order.removeItem(orderItem2.id);
    order.addItem(orderItem3);
    await orderRepository.update(order);
    const changedOrder = await orderRepository.find(order.id);

    expect(changedOrder).toStrictEqual(order);
  });
});
