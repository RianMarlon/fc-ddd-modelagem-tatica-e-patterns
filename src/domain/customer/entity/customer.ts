import EventDispatcher from "../../@shared/event/event-dispatcher";
import { CustomerAddressChanged } from "../event/customer-address-changed";
import { CustomerCreatedEvent } from "../event/customer-created.event";
import { EnviaConsoleLog1WhenCustomerIsCreatedHandler } from "../event/handler/envia-console-log-1-when-customer-is-created.handler";
import { EnviaConsoleLog2WhenCustomerIsCreatedHandler } from "../event/handler/envia-console-log-2-when-customer-is-created.handler";
import { EnviaConsoleLogWhenCustomerAddressIsChangedHandler } from "../event/handler/envia-console-log-when-customer-address-is-changed.handler";
import Address from "../value-object/address";

export default class Customer {
  private _id: string;
  private _name: string;
  private _address!: Address;
  private _active: boolean = true;
  private _rewardPoints: number = 0;
  private static _eventDispatcher: EventDispatcher | undefined;

  constructor(id: string, name: string, address: Address) {
    this._id = id;
    this._name = name;
    this._address = address;
    this.validate();
  }

  static registerEvents() {
    if (!Customer._eventDispatcher) {
      Customer._eventDispatcher = new EventDispatcher();
      Customer._eventDispatcher.register(
        CustomerCreatedEvent.name,
        new EnviaConsoleLog1WhenCustomerIsCreatedHandler()
      );

      Customer._eventDispatcher.register(
        CustomerCreatedEvent.name,
        new EnviaConsoleLog2WhenCustomerIsCreatedHandler()
      );

      Customer._eventDispatcher.register(
        CustomerAddressChanged.name,
        new EnviaConsoleLogWhenCustomerAddressIsChangedHandler()
      );
    }
  }

  static create(id: string, name: string, address: Address): Customer {
    const customer = new Customer(id, name, address);
    this._eventDispatcher.notify(new CustomerCreatedEvent(customer));
    return customer;
  }

  changeAddress(address: Address) {
    this._address = address;
    this.validate();
    Customer._eventDispatcher.notify(new CustomerAddressChanged(this));
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  get address(): Address {
    return this._address;
  }

  isActive(): boolean {
    return this._active;
  }

  validate() {
    if (!this._name) {
      throw new Error("Name is required");
    }
    if (!this._address) {
      throw new Error("Address is required");
    }
    if (!this._id) {
      throw new Error("Id is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  activate() {
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }
}
