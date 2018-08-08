export interface Web3Account {
  address: string;
  networkId: string;
  balance: number;
  avatar: string
}

export interface Web3State {
  injectedWeb3: boolean;
  web3?: any;
  account?: Web3Account;
}