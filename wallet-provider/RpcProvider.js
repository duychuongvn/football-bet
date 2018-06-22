var ethwallet = require('ethereumjs-wallet');
var ProviderEngine = require("web3-provider-engine");
var FiltersSubprovider = require('web3-provider-engine/subproviders/filters.js');
var HookedSubprovider = require('web3-provider-engine/subproviders/hooked-wallet.js');
var ProviderSubprovider = require("web3-provider-engine/subproviders/provider.js");
var Web3 = require("web3");
var Transaction = require('ethereumjs-tx');

function RpcProvider(privateKey, provider_url) {
  this.provider_url = provider_url;
  this.wallet = ethwallet.fromPrivateKey(Buffer.from(privateKey, 'hex'));

  this.engine = new ProviderEngine();
  this.engine.addProvider(new HookedSubprovider({
    getAccounts: function (cb) {
      cb(null, (new Array()).push(this.wallet));
    },
    getPrivateKey: function (address, cb) {
      cb(null, this.wallet.getPrivateKey().toString('hex'));
    },
    signTransaction: function (txParams, cb) {
      let pkey = this.wallet.getPrivateKey();
      var tx = new Transaction(txParams);
      tx.sign(pkey);
      var rawTx = '0x' + tx.serialize().toString('hex');
      cb(null, rawTx);
    }
  }));
  this.engine.addProvider(new FiltersSubprovider());
  this.engine.addProvider(new ProviderSubprovider(new Web3.providers.HttpProvider(this.provider_url)));
  this.engine.start();
};

RpcProvider.prototype.sendAsync = function () {
  this.engine.sendAsync.apply(this.engine, arguments);
};

RpcProvider.prototype.send = function () {
  return this.engine.send.apply(this.engine, arguments);
};

// returns the address of the given address_index, first checking the cache
module.exports = RpcProvider;
