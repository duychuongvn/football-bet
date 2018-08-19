const Web3 = require('web3')
const Rx = require('rx')

declare const window: any
const web3js = window.web3
let web3Provider: any

import { MatchInterface } from '@/shared/interfaces/match'
import * as moment from 'moment'

const NETWORKS: any = {
  '1': 'Main Net',
  '2': 'Deprecated Morden test network',
  '3': 'Ropsten test network',
  '4': 'Rinkeby test network',
  '42': 'Kovan test network',
  '4447': 'Truffle Develop Network',
  '5777': 'Ganache Blockchain'
}

export const Web3Vue = {


  initWeb3: () => Rx.Observable.create((observer: any) => {
    if (typeof web3js !== 'undefined') {
      web3Provider = new Web3(web3js.currentProvider)

      const web3Response = {
        injectedWeb3: web3Provider.currentProvider.isConnected(),
        web3: {
          ...web3Provider
        }
      }

      observer.onNext(web3Response)
      observer.onCompleted()
    } else {
      observer.error({
        msg: 'Unable to connect to Metamask',
        status_code: 403
      })
    }
  }),

  web3:() => {
    return web3Provider;
  },

  network: () => Rx.Observable.create((observer: any) => {
    let state = web3Provider.currentProvider.publicConfigStore.getState()

    const response: any = {
      networkId: NETWORKS[+state.networkVersion],
      address: state.selectedAddress
    }

    observer.onNext(response)
    observer.onCompleted()
  }),
  account: (address: string) => Rx.Observable.create((observer: any) => {
    web3Provider.eth.getBalance(address, (err: any, balance: any) => {
      if (err) {
        observer.error({
          msg: 'Unable to connect to Metamask',
          status_code: 403
        })
        observer.onCompleted()
      } else {
        const response = {
          balance: balance
        }
        observer.onNext(response)
        observer.onCompleted()
      }
    })
  }),
  toSHA3(match: MatchInterface) {
    const _date = moment(match.date).unix();
    const _val = `${match.homeTeam}${match.awayTeam}${_date}`;

    return web3Provider.utils.soliditySha3(_val);
  }
}
