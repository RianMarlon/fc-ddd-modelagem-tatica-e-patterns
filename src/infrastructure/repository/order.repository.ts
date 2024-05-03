import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

interface OrderItemModalDataInterface {
  id: string;
  name: string;
  price: number;
  product_id: string;
  quantity: number;
  order_id: string;
}

export default class OrderRepository implements OrderRepositoryInterface {
  async findAll(): Promise<Order[]> {
    const orders = await OrderModel.findAll({
      include: OrderItemModel,
    });

    return orders.map(
      (order) =>
        new Order(
          order.id,
          order.customer_id,
          order.items.map(
            (item) =>
              new OrderItem(
                item.id,
                item.name,
                item.price,
                item.product_id,
                item.quantity
              )
          )
        )
    );
  }

  async find(id: string): Promise<Order> {
    let order;
    try {
      order = await OrderModel.findOne({
        where: {
          id,
        },
        include: OrderItemModel,
        rejectOnEmpty: true,
      });
    } catch (e) {
      throw new Error("Order not found");
    }

    const orderItems = order.items.map(
      (item) =>
        new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        )
    );

    return new Order(order.id, order.customer_id, orderItems);
  }

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: OrderItemModel,
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const actualOrderItems = await OrderItemModel.findAll({
      where: {
        order_id: entity.id,
      },
    });

    const orderItemsIdsToDelete = actualOrderItems.reduce(
      (acc, actualOrderItem) => {
        const orderItemFounded = entity.items.find(
          (item) => actualOrderItem.id === item.id
        );

        if (orderItemFounded) {
          return acc;
        }

        acc.push(actualOrderItem.id);
        return acc;
      },
      []
    );

    if (orderItemsIdsToDelete.length)
      await OrderItemModel.destroy({
        where: { id: orderItemsIdsToDelete },
      });

    const orderItemsToCreate: OrderItemModalDataInterface[] = [];
    const orderItemsToUpdate: OrderItemModalDataInterface[] = [];

    entity.items.forEach((item) => {
      const orderItemFounded = actualOrderItems.find(
        (actualOrderItem) => actualOrderItem.id === item.id
      );

      const itemData = {
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id,
      };

      if (orderItemFounded) {
        orderItemsToUpdate.push(itemData);
      } else {
        orderItemsToCreate.push(itemData);
      }
    });

    await Promise.all([
      ...orderItemsToCreate.map(async (item) => {
        await OrderItemModel.create({ ...item });
      }),
      ...orderItemsToUpdate.map(async (item) => {
        await OrderItemModel.update(item, {
          where: {
            id: item.id,
          },
        });
      }),
    ]);
  }
}
