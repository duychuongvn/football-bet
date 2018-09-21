pragma solidity ^0.4.21;
import "btherDB.sol";
import "safeMath.sol";
import "sharedLibrary.sol";
library MatchLibrary {
  // match status: 0: not available, 1: open, 2: canceled, 3: finished

  function addMatch(address db, string homeTeam, string awayTeam, uint time) internal returns (byte32){

    bytes32 matchId = sha3(homeTeam, awayTeam, time);
    if(!isMatchExists(db, matchId)) {
      BetherDB(db).setStringValue(sha3("match/homeTeam", matchId), homeTeam);
      BetherDB(db).setStringValue(sha3("match/awayTeam", matchId), awayTeam);
      BetherDB(db).setUIntValue(sha3("match/time", matchId), time);
      BetherDB(db).setUInt8Value(sha3("match/status", matchId), 1);
    }
  }

  function updateScore(address db, bytes32 matchId, uint homeScore, uint awayScore) internal {
    require(getStatus(db, matchId) == 1 || getStatus(db, matchId) ==3);
    BetherDB(db).setStringValue(sha3("match/homeScore", matchId), homeScore);
    BetherDB(db).setStringValue(sha3("match/awayScore", matchId), awayScore);
    BetherDB(db).setUInt8Value(sha3("match/status", matchId), 3);
  }

  function cancelMatch(address db, bytes32 matchId) internal {
    require(isMatchExists(db, matchId));
    BetherDB(db).setUInt8Value(sha3("match/status", matchId), 2);
  }

  function isMatchExists(address db, bytes32 matchId) internal returns (bool) {
     return getStatus(db, matchId) > 0;
  }

  function getStatus(address db, bytes32 matchId) internal returns(uint8) {
    return BetherDB(db).getUInt8Value(sha3("match/status", matchId));
  }
}
