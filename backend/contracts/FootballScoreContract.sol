pragma solidity ^0.4.24;

import "./strings.sol";

contract Ownable {

  address public owner;


  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
}
contract FootballScoreContract is Ownable {

  using strings for *;
  enum MatchStatus {NotAvailable, Waiting, Playing, Canceled, Finished}
  enum LeagueStatus {NotAvailable, Available, Done}
  event UploadLeagueEvent(bytes32 leagueId, string leagueName, uint totalMatches);
  event UpdateMatchEvent(bytes32 matchId, bytes32 leagueId);
  event UpdateMatchScoreEvent();

  struct Match {

    uint8 goalsHomeTeam;
    uint8 goalsAwayTeam;
    uint8 halfTimeGoalsHomeTeam;
    uint8 halfTimeGoalsAwayTeam;
    uint48 time;
    MatchStatus status;
    bytes32 id;
    bytes32 leagueId;
    bytes32 homeTeam; // home Team
    bytes32 awayTeam; // away Team
    bytes32 reference;
  }

  struct League {
    LeagueStatus status;
    uint32 idx;
    bytes32[] matchIds;
    string name;

  }

  bytes32[] private leagueIds;
  mapping(bytes32=>Match) private  matches;
  mapping(bytes32=>League) private leagues;

  function FootballScoreContract() {

  }

  function uploadLeague(string homeTeams, string awayTeams, string references, uint48[] times, string leagueName, uint totalMatches) public onlyOwner returns(uint) {

    var token = ";".toSlice();
    var homeTeamSlice = homeTeams.toSlice();
    var awayTeamSlice = awayTeams.toSlice();
    var referenceSlice = references.toSlice();

    require(homeTeamSlice.count(token) + 1 == totalMatches, "Total record of Home Teams must equal to totalMatches");
    require(awayTeamSlice.count(token) + 1 == totalMatches, "Total record of Away Teams must equal to totalMatches");
    require(referenceSlice.count(token) + 1 == totalMatches, "Total record of Reference must equal to totalMatches");
    require(times.length == totalMatches, "Total record of Times must equal to totalMatches");
    bytes32 leagueId = keccak256(abi.encodePacked(leagueName));

    League storage league = leagues[leagueId];
    if(league.status == LeagueStatus.NotAvailable) {
      league.name = leagueName;
      league.status = LeagueStatus.Available;
      league.idx = uint32(leagueIds.push(leagueId)) - 1;
    }
    for(uint i = 0; i < totalMatches; i ++) {
        Match memory _match;
        _match.homeTeam = stringToBytes32(homeTeamSlice.split(token).toString());
        _match.awayTeam =  stringToBytes32(awayTeamSlice.split(token).toString());
        _match.reference =  stringToBytes32(referenceSlice.split(token).toString());
        _match.id = keccak256(abi.encodePacked(_match.homeTeam, _match.awayTeam, leagueName));
        if( matches[_match.id].status == MatchStatus.NotAvailable) {
          _match.goalsHomeTeam = 0;
          _match.goalsAwayTeam = 0;
          _match.halfTimeGoalsHomeTeam = 0;
          _match.halfTimeGoalsAwayTeam = 0;
          _match.status = MatchStatus.Waiting;
          _match.leagueId =  leagueId;
          _match.time = times[i];
          matches[_match.id] = _match;
          leagues[leagueId].matchIds.push(_match.id);
        }
      }
      emit UploadLeagueEvent(leagueId, leagueName, totalMatches);
  }


  function updateMatch(bytes32 matchId, uint48 matchTime) public onlyOwner {

    require(matchTime > now, "Match should not finished");
    Match storage _match = matches[matchId];
    require((_match.status == MatchStatus.Waiting || _match.status == MatchStatus.Canceled), "Match must be in the system and has not played");
    _match.time = matchTime;
    _match.status = MatchStatus.Waiting;
    emit UpdateMatchEvent(matchId, _match.leagueId);
  }


  function updateScore(bytes32[] _matchIds, uint8[] homeGoals, uint8[] awayGoals,
    uint8[] halfTimeHomeGoals, uint8[] halfTimeAwayGoals)
  public onlyOwner  returns(bool) {

    for(uint i = 0; i < _matchIds.length;i++) {

      matches[_matchIds[i]].goalsHomeTeam = homeGoals[i];
      matches[_matchIds[i]].goalsAwayTeam = awayGoals[i];
      matches[_matchIds[i]].halfTimeGoalsHomeTeam = halfTimeHomeGoals[i];
      matches[_matchIds[i]].halfTimeGoalsAwayTeam = halfTimeAwayGoals[i];
      matches[_matchIds[i]].status = MatchStatus.Finished;
    }
    emit UpdateMatchScoreEvent();
    return true;
  }

  // Get details of match by id
  // @param matchId: bytes32
  // return (bytes32: match id, string: home team name, string: away team name, string: reference information of match,
  //          uint48: time of match,
  //          uint8[5]:
  //                   [0] - home goals
  //                   [1] - away goals
  //                   [2] - half time home goals
  //                   [3] - half time away goals
  //                   [4] - status of match
  //         )
  function getMatchDetails(bytes32 matchId) external view returns(bytes32, string, string, string, uint48, uint8[]) {
    uint8[] memory goals = new uint8[](5);
    goals[0]=matches[matchId].goalsHomeTeam;
    goals[1]=matches[matchId].goalsAwayTeam;
    goals[2]=matches[matchId].halfTimeGoalsHomeTeam;
    goals[3]=matches[matchId].halfTimeGoalsAwayTeam;
    goals[4]=uint8(matches[matchId].status);
    return(matchId,bytes32ToString( matches[matchId].homeTeam), bytes32ToString(matches[matchId].awayTeam), bytes32ToString(matches[matchId].reference),
    matches[matchId].time, goals);
  }

  // Get status and time of match by match id
  // @param matchId: bytes32 - id of match
  // return (match status, time of match)
  function getMatchStatus(bytes32 matchId) external view returns(uint8, uint48) {
    return (uint8(matches[matchId].status), matches[matchId].time);
  }

  // Get final result of match by match id
  // @id: bytes32 - id of match. This value is calculated by keccak256(abi.encodePacked(home team name, away team name, league name)
  // return (matchId, goalsHomeTeam, goalsAwayTeam, status)
  function getFinalScore(bytes32 id) external view returns(bytes32 matchId,uint8 goalsHomeTeam,uint8 goalsAwayTeam, uint8 status) {
    return (id, matches[id].goalsHomeTeam, matches[id].goalsAwayTeam, uint8(matches[id].status));
  }


  // Remove league out of available leagues
  function removeLeagueId(bytes32 leagueId) public onlyOwner returns (bool) {

    leagues[leagueId].status = LeagueStatus.Done;
    uint32 toDelete = leagues[leagueId].idx;
    uint32 lastIdx = uint32(leagueIds.length - 1);
    leagueIds[toDelete] = leagueIds[lastIdx];
    leagues[leagueIds[toDelete]].idx = toDelete;
    leagueIds.length--;
    return true;
  }

  // get array of available leagues
  function getLeagues() public  view returns(bytes32[]) {
    return leagueIds;
  }

  //
  // Get league info by leauge id
  // @param: leagueId - keccak256(league name)
  // return: bytes32 - league id, string - league name, uint8 - league status, bytes32[] - array of match ids
  function getLeagueInfoById(bytes32 leagueId) public view returns(bytes32, string, uint8, bytes32[]) {
    return (leagueId, leagues[leagueId].name, uint8(leagues[leagueId].status), leagues[leagueId].matchIds);
  }

  function bytes32ToString(bytes32 x) constant returns (string) {
    bytes memory bytesString = new bytes(32);
    uint charCount = 0;
    for (uint j = 0; j < 32; j++) {
      byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
      if (char != 0) {
        bytesString[charCount] = char;
        charCount++;
      }
    }
    bytes memory bytesStringTrimmed = new bytes(charCount);
    for (j = 0; j < charCount; j++) {
      bytesStringTrimmed[j] = bytesString[j];
    }
    return string(bytesStringTrimmed);
  }
  function stringToBytes32(string memory source) returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
      return 0x0;
    }

    assembly {
      result := mload(add(source, 32))
    }
  }
}
