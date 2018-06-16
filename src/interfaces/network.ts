import {NetworkProvider} from '../models/NetworkProvider';

export interface NetworkProviderInterface {
  networkVersion: any;
  symbol: string;
  name: string;
  url: string;
}

export interface NetworkInterface {
  selectedAddress: any;
  provider: NetworkProvider;
}
