var SoloBet = artifacts.require("./BetherContract.sol");
module.exports = function(deployer) {
  deployer.deploy(SoloBet);
};
