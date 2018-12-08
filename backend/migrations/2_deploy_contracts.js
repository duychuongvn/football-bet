var BetherContract = artifacts.require("./BetherContract.sol");
var FootballMatch = artifacts.require("./FootballScoreContract.sol");
module.exports = function(deployer) {
  deployer.deploy(FootballMatch).then(function () {
    return  deployer.deploy(BetherContract, FootballMatch.address);
  });
};
