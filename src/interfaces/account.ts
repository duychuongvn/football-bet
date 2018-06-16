import { NetworkInterface } from './network';

export interface AccountInterface {
  address: string,
  network: NetworkInterface,
  available_balance: number,
  placed_balance: number
};
