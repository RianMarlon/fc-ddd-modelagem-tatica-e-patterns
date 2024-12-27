import CustomerFactory from "./customer.factory";
import Address from "../value-object/address";

describe("Customer factory unit test", () => {
  it("should create a customer", () => {
    const address = new Address("Street", 1, "13330-250", "São Paulo");

    let customer = CustomerFactory.create("John", address);

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John");
    expect(customer.address).toBe(address);
  });
});
