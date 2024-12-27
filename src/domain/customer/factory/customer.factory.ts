import Customer from "../entity/customer";
import { v4 as uuid } from "uuid";
import Address from "../value-object/address";

export default class CustomerFactory {
  public static create(name: string, address: Address): Customer {
    return new Customer(uuid(), name, address);
  }
}
