import Address from "../value-object/address";

export default class Customer {
  private _id: string;
  private _name: string;
  private _address!: Address;
  private _active: boolean = true;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string, address: Address) {
    this._id = id;
    this._name = name;
    this._address = address;
    this.validate();
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

  changeAddress(address: Address) {
    this._address = address;
    this.validate();
  }
}
