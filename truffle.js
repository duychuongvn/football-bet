// var HDWalletProvider = require("truffle-hdwallet-provider");
// var mnemonic = "trigger cancel decorate place sound fashion nut bag swift casual silent shell";

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

    // rinkeby: {
    //   provider: function() {
    //     return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io")
    //   },
    //   network_id: 4,
    //   gasPrice:3000000000
    // },
    ganache: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    }
  }

}
;
