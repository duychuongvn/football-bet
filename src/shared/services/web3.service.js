const Web3 = require('web3');
const Rx = require('rx');
const web3js = window.web3;
let web3Provider;
const NETWORKS = {
    '1': 'Main Net',
    '2': 'Deprecated Morden test network',
    '3': 'Ropsten test network',
    '4': 'Rinkeby test network',
    '42': 'Kovan test network',
    '4447': 'Truffle Develop Network',
    '5777': 'Ganache Blockchain'
};
export const Web3Vue = {
    initWeb3: () => Rx.Observable.create((observer) => {
        if (typeof web3js !== 'undefined') {
            web3Provider = new Web3(web3js.currentProvider);
            const web3Response = {
                injectedWeb3: web3Provider.currentProvider.isConnected(),
                web3: {
                    ...web3Provider
                }
            };
            observer.onNext(web3Response);
            observer.onCompleted();
        }
        else {
            observer.error({
                msg: 'Unable to connect to Metamask',
                status_code: 403
            });
        }
    }),
    web3: () => {
        return web3Provider;
    },
    network: () => Rx.Observable.create((observer) => {
        let state = web3Provider.currentProvider.publicConfigStore.getState();
        const response = {
            networkId: NETWORKS[+state.networkVersion],
            address: state.selectedAddress
        };
        observer.onNext(response);
        observer.onCompleted();
    }),
    account: (address) => Rx.Observable.create((observer) => {
        web3Provider.eth.getBalance(address, (err, balance) => {
            if (err) {
                observer.error({
                    msg: 'Unable to connect to Metamask',
                    status_code: 403
                });
                observer.onCompleted();
            }
            else {
                const response = {
                    balance: balance
                };
                observer.onNext(response);
                observer.onCompleted();
            }
        });
    }),
    toSHA3(value) {
        return web3Provider.utils.soliditySha3(value);
    }
};
//# sourceMappingURL=web3.service.js.map