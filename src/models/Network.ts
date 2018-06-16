import {NetworkInterface} from '../interfaces/network';
import {NetworkProvider} from './NetworkProvider';

export class Network {

  private _selectedAddress: any;
  private _provider: NetworkProvider;

  constructor(data?: NetworkInterface) {
    if (data) {
      this.selectedAddress = data.selectedAddress;
      this.provider = data.provider;
    }
  }

  get selectedAddress(): any {
    return this._selectedAddress;
  }

  set selectedAddress(value: any) {
    this._selectedAddress = value;
  }


  get provider(): NetworkProvider {
    return this._provider;
  }

  set provider(value: NetworkProvider) {
    this._provider = value;
  }
}
