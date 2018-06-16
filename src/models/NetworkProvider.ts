import {NetworkProviderInterface} from '../interfaces/network';

export class NetworkProvider {

  private _name: string;
  private _symbol: string;
  private _networkVersion: any;
  private _url: any;

  constructor(data?: NetworkProviderInterface) {
    if (data) {
      this.name = data.name;
      this.symbol = data.symbol;
      this.networkVersion = data.networkVersion;
      this.url = data.url;

    }
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get symbol(): string {
    return this._symbol;
  }

  set symbol(value: string) {
    this._symbol = value;
  }

  get networkVersion(): any {
    return this._networkVersion;
  }

  set networkVersion(value: any) {
    this._networkVersion = value;
  }

  get url(): any {
    return this._url;
  }

  set url(value: any) {
    this._url = value;
  }
}
