pragma solidity ^0.4.24;

import "./strings.sol";
import "./Ownable.sol";
contract FootballScoreContract is Ownable {

  using strings for *;
  bytes32[] public matchIds;
  enum MatchStatus {NotAvailable, Waiting, Playing, Canceled, Finished}
  event UploadLeagueEvent(bytes32 leagueId, string leagueName, uint totalMatches);
  event UpdateMatchEvent(bytes32 matchId, string leagueId, string leagueName);
  event UpdateMatchScoreEvent(bytes32 matchId, string leagueId, string leagueName, MatchStatus status);

  struct Match {

    uint8 goalsHomeTeam;
    uint8 goalsAwayTeam;
    uint8 halfTimeGoalsHomeTeam;
    uint8 halfTimeGoalsAwayTeam;
    uint32 idx;
    uint48 time;
    MatchStatus status;
    bytes32 id;
    string homeTeam; // home Team
    string awayTeam; // away Team
    string reference;
  }

  struct League {
    bytes32[] matchIds;
    string name;
  }

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
    leagues[leagueId].name = leagueName;

    for(uint i = 0; i < totalMatches; i ++) {
      Match memory _match;

      _match.goalsHomeTeam = 0;
      _match.goalsAwayTeam = 0;
      _match.halfTimeGoalsHomeTeam = 0;
      _match.halfTimeGoalsAwayTeam = 0;
      _match.status = MatchStatus.Waiting;
      _match.homeTeam =  homeTeamSlice.split(token).toString();
      _match.awayTeam =  awayTeamSlice.split(token).toString();
      _match.reference =  referenceSlice.split(token).toString();
      _match.time = times[i];
      _match.id = keccak256(abi.encodePacked(_match.homeTeam, _match.awayTeam, leagueName));
      _match.idx = uint32(matchIds.push(_match.id)) - 1;
       matches[_match.id] = _match;
      leagues[leagueId].matchIds.push(_match.id);
    }

    emit UploadLeagueEvent(leagueId, leagueName, totalMatches);
  }

  uint id;
  function updateMatch(string homeTeam, string awayTeam, string leagueName, uint48 matchTime) public onlyOwner {
      bytes32 matchId =  keccak256(abi.encodePacked(homeTeam, awayTeam, leagueName));

      require(matchTime > now, "Match should not finished");
      require((matches[matchId].status == MatchStatus.Waiting || matches[matchId].status == MatchStatus.Canceled), "Match must be in the system and has not played");
      matches[matchId].time = matchTime;
      matches[matchId].status = MatchStatus.Waiting;
  }

  function updateScore(bytes32[] _matchIds, uint8[] homeGoals, uint8[] awayGoals,
                                           uint8[] halfTimeHomeGoals, uint8[] halfTimeAwayGoals)
                      public  returns(bool) {


        for(uint i = 0; i < _matchIds.length;i++) {

          matches[_matchIds[i]].goalsHomeTeam = homeGoals[i];
          matches[_matchIds[i]].goalsAwayTeam = awayGoals[i];
          matches[_matchIds[i]].halfTimeGoalsHomeTeam = halfTimeHomeGoals[i];
          matches[_matchIds[i]].halfTimeGoalsAwayTeam = halfTimeAwayGoals[i];
          matches[_matchIds[i]].status = MatchStatus.Finished;
        }

    return true;
  }

  function getMatchDetails(bytes32 matchId) external view returns(bytes32, string, string, string, uint48, uint8[]) {
      uint8[] memory goals = new uint8[](5);
    goals[0]=matches[matchId].goalsHomeTeam;
    goals[1]=matches[matchId].goalsAwayTeam;
    goals[2]=matches[matchId].halfTimeGoalsHomeTeam;
    goals[3]=matches[matchId].halfTimeGoalsAwayTeam;
    goals[4]=uint8(matches[matchId].status);
      return(matchId,matches[matchId].homeTeam, matches[matchId].awayTeam, matches[matchId].reference, matches[matchId].time, goals);
  }

  function getMatchStatus(bytes32 matchId) external view returns(uint8, uint48) {
     return (uint8(matches[matchId].status), matches[matchId].time);
  }
  function getFinalScore(bytes32 id) external view returns(bytes32 matchId,uint8 goalsHomeTeam,uint8 goalsAwayTeam, uint8 status) {
    return (id, matches[id].goalsHomeTeam, matches[id].goalsAwayTeam, uint8(matches[id].status));
  }
  function removeMatchIds(bytes32 matchId) private returns (bool) {

    uint32 toDelete = matches[matchId].idx;
    uint32 lastIdx = uint32(matchIds.length - 1);
    matchIds[toDelete] = matchIds[lastIdx];
    matches[matchIds[toDelete]].idx = toDelete;
    matchIds.length--;
    return true;
  }

  function getPendingMatchIds() public view returns(bytes32[]) {
    return matchIds;
  }

  function getLeagueMatchIds(string leagueName) public view returns (bytes32[]) {
    bytes32 leagueId = keccak256(abi.encodePacked(leagueName));

    return leagues[leagueId].matchIds;
  }
}
