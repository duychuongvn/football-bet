import { NetworkInterface } from 'interfaces/network';

export class Network {

  private _name : string;
  public get name() : string {
    return this._name;
  }
  public set name(v : string) {
    this._name = v;
  }

  private _chainId : number;
  public get chainId() : number {
    return this._chainId;
  }
  public set chainId(v : number) {
    this._chainId = v;
  }

  private _symbol : string;
  public get symbol() : string {
    return this._symbol;
  }
  public set symbol(v : string) {
    this._symbol = v;
  }

  constructor(data?: NetworkInterface) {
    if (data) {
      this.name = data.name;
      this.chainId = data.chainId;
      this.symbol = data.symbol;
    }
  }
}
