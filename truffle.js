// var HDWalletProvider = require("truffle-hdwallet-provider");
// var mnemonic = "trigger cancel decorate place sound fashion nut bag swift casual silent shell";
var RpcProvider = require('./wallet-provider/RpcProvider.js');
const admin_key = '1b5abcbd07d26094e56c827df0a2c8f75b721cd81d210db1af67669097deef61';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id,
      gasPrice:3000000000

    },
    mocha: {
      useColors: true
    },

    etz: {
      provider:function () {
        return new RpcProvider(admin_key,"https://etzrpc.org:443")

      },
      port:9646,
      network_id: 90,
      gasPrice:20000000000,
      gasLimit:4000000

    },
    rinkeby: {
      provider: function() {
        return new  RpcProvider(admin_key,"https://rinkeby.infura.io")
      },
      network_id: 4,
      gasPrice:3000000000
    },
    ganache: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    }
  }

}
;
