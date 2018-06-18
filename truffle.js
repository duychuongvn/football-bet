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

    ganache: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    }
  }

}
;
