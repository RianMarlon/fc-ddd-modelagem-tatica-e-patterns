import Address from "./address";
import Customer from "./customer";

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
      let customer = new Customer("", "John", address);
    }).toThrow("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
      let customer = new Customer("123", "", address);
    }).toThrow("Name is required");
  });

  it("should throw error when address is not informed", () => {
    expect(() => {
      let customer = new Customer("123", "John", null);
    }).toThrow("Address is required");
  });

  it("should change name", () => {
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    const customer = new Customer("123", "John", address);
    customer.changeName("Jane");
    expect(customer.name).toBe("Jane");
  });

  it("should change address", () => {
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    const customer = new Customer("123", "John", address);
    const newAddress = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.changeAddress(newAddress);

    expect(customer.address).toBe(newAddress);
  });

  it("should activate customer", () => {
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    const customer = new Customer("1", "Customer 1", address);
    customer.activate();

    expect(customer.isActive()).toBeTruthy();
  });

  it("should deactivate customer", () => {
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    const customer = new Customer("1", "Customer 1", address);

    customer.deactivate();

    expect(customer.isActive()).toBeFalsy();
  });

  it("should add reward points", () => {
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    const customer = new Customer("1", "Customer 1", address);
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });
});
