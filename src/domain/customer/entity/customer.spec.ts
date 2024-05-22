import { CustomerAddressChanged } from "../event/customer-address-changed";
import { CustomerCreatedEvent } from "../event/customer-created.event";
import { EnviaConsoleLog1WhenCustomerIsCreatedHandler } from "../event/handler/envia-console-log-1-when-customer-is-created.handler";
import { EnviaConsoleLog2WhenCustomerIsCreatedHandler } from "../event/handler/envia-console-log-2-when-customer-is-created.handler";
import { EnviaConsoleLogWhenCustomerAddressIsChangedHandler } from "../event/handler/envia-console-log-when-customer-address-is-changed.handler";
import Address from "../value-object/address";
import Customer from "./customer";

describe("Customer unit tests", () => {
  let spyEnviaConsoleLog1WhenCustomerIsCreatedHandler: jest.SpyInstance<
    void,
    [event: CustomerCreatedEvent],
    any
  >;
  let spyEnviaConsoleLog2WhenCustomerIsCreatedHandler: jest.SpyInstance<
    void,
    [event: CustomerCreatedEvent],
    any
  >;
  let spyEnviaConsoleLogWhenCustomerAddressIsChangedHandler: jest.SpyInstance<
    void,
    [event: CustomerAddressChanged],
    any
  >;

  beforeAll(() => {
    Customer.registerEvents();
  });

  beforeEach(() => {
    spyEnviaConsoleLog1WhenCustomerIsCreatedHandler = jest.spyOn(
      EnviaConsoleLog1WhenCustomerIsCreatedHandler.prototype,
      "handle"
    );
    spyEnviaConsoleLog2WhenCustomerIsCreatedHandler = jest.spyOn(
      EnviaConsoleLog2WhenCustomerIsCreatedHandler.prototype,
      "handle"
    );
    spyEnviaConsoleLogWhenCustomerAddressIsChangedHandler = jest.spyOn(
      EnviaConsoleLogWhenCustomerAddressIsChangedHandler.prototype,
      "handle"
    );
  });

  it("should create an user", () => {
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    const customer = Customer.create("123", "John", address);

    expect(spyEnviaConsoleLog1WhenCustomerIsCreatedHandler).toHaveBeenCalled();
    expect(spyEnviaConsoleLog2WhenCustomerIsCreatedHandler).toHaveBeenCalled();
    expect(
      spyEnviaConsoleLogWhenCustomerAddressIsChangedHandler
    ).not.toHaveBeenCalled();

    expect(customer.id).toEqual("123");
    expect(customer.name).toEqual("John");
    expect(customer.address).toEqual(address);
  });

  it("should throw error when id is empty", () => {
    expect(() => {
      const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
      let customer = Customer.create("", "John", address);
    }).toThrow("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
      let customer = Customer.create("123", "", address);
    }).toThrow("Name is required");
  });

  it("should throw error when address is not informed", () => {
    expect(() => {
      let customer = Customer.create("123", "John", null);
    }).toThrow("Address is required");
  });

  it("should change name", () => {
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    const customer = Customer.create("123", "John", address);
    customer.changeName("Jane");
    expect(customer.name).toBe("Jane");
  });

  it("should change address", () => {
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    const customer = Customer.create("123", "John", address);
    const newAddress = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.changeAddress(newAddress);

    expect(
      spyEnviaConsoleLogWhenCustomerAddressIsChangedHandler
    ).toHaveBeenCalled();
  });

  it("should activate customer", () => {
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    const customer = Customer.create("1", "Customer 1", address);
    customer.activate();

    expect(customer.isActive()).toBeTruthy();
  });

  it("should deactivate customer", () => {
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    const customer = Customer.create("1", "Customer 1", address);

    customer.deactivate();

    expect(customer.isActive()).toBeFalsy();
  });

  it("should add reward points", () => {
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    const customer = Customer.create("1", "Customer 1", address);
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });
});
