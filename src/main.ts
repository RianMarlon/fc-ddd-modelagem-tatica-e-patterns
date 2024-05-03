import Address from "./domain/entity/address";
import Customer from "./domain/entity/customer";
import Order from "./domain/entity/order";
import OrderItem from "./domain/entity/order_item";

const address = new Address("Rua dois", 2, "12345-678", "São Paulo");
const customer = new Customer("123", "Wesley Williams", address);
customer.activate();

const item1 = new OrderItem("1", "Item 1", 10, "123", 2);
const item2 = new OrderItem("2", "Item 2", 15, "123", 4);

const order = new Order("1", "123", [item1, item2]);
