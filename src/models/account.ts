import { AccountInterface } from 'interfaces/account';

import { Network } from './network';

export class Account {

  private _address: string;
  public get address(): string {
    return this._address;
  }
  public set address(v: string) {
    this._address = v;
  }

  private _network: Network;
  public get network(): Network {
    return this._network;
  }
  public set network(v: Network) {
    this._network = v;
  }

  private _available_banlance: number;
  public get available_banlance(): number {
    return this._available_banlance || 0;
  }
  public get available_banlance_string(): string {
    return `${this.available_banlance} ETH`;
  }
  public set available_banlance(v: number) {
    this._available_banlance = v;
  }

  private _placed_balance: number;
  public get placed_balance(): number {
    return this._placed_balance || 0;
  }
  public get placed_balance_string(): string {
    return `${this.placed_balance} ETH`;
  }
  public set placed_balance(v: number) {
    this._placed_balance = v;
  }

  constructor(data?: AccountInterface) {
    if (data) {
      this.address            = data.address;
      this.network            = new Network(data.network);
      this.available_banlance = data.available_balance;
      this.placed_balance     = data.placed_balance;
    }
  }
}
