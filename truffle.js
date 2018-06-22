var RpcProvider = require('./wallet-provider/RpcProvider.js');
const admin_key = 'a23bab9997d45e730d5a72d35918d3d53efad56c64d53455edfe7420a3577fe5';
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

    rinkeby: {
      provider: function() {
        return new RpcProvider(admin_key, "https://rinkeby.infura.io")
      },
      gasPrice:3000000000,
      network_id: 4
    },
    etz: {
      provider: function() {
        return new RpcProvider(admin_key, "https://rpc.etherzero.org")
      },
      gasPrice:30000000000,
      network_id: 88
    },
    clo: {
      provider: function() {
        return new RpcProvider(admin_key, "http://127.0.0.1:8545")
      },
      gasPrice:30000000000,
      network_id: 4
    },
    ganache: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    }
  }

}
;
