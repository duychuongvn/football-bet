pragma solidity ^0.4.21;

import "./Ownable.sol";
import "./etherDB.sol";
import "./sharedLibrary";
import "./matchLibrary";
contract AsianHandicapContract is Ownable {

    address public betherDB;
    function AsianHandicapContract(address bether){
      betherDB = bether;
    }

  uint256 public balance;
  uint256 private availableBalance;

  mapping(byte32=> int) public handicaps;

  function setHandicap(bytes32 matchId, int handicap) payable returns(uint index){
      require(MatchLibrary.isMatchExists(betherDB, matchId));
      index = SharedLibrary.createNext(betherDB,"bookmaker/handicap", msg.sender);
      BetherDB.setIntValue(sha3("bookmaker/handicap",index), handicap);
      BetherDB.setIntValue(sha3("bookmaker/handicap/matchId",index), matchId);
  }


  function acceptBet(byte32 matchId) public payable {


    require(availableBalance>=msg.value);

  }

  function getAvaliableBalance()

}
