pragma solidity ^0.4.21;

import "./Ownable.sol";

contract SoloBet is Ownable {
  enum Pair {Home_Away, Away_Home}
  enum MatchStatus {NotAvailable, Waiting, Playing, Canceled, Finished}
  enum BettingStatus {Open, Deal, Canceled, Refunded, Done}

  event LogDeal(address bookmaker, address punter, bytes32 matchId, uint256 betingId);
  event LogApproveScore(bytes32 matchId);
  event Transfer(address indexed _from, address indexed _to, uint256 _value);

  struct Match {

    bytes32 id;
    uint8 homeScore;
    uint8 awayScore;
    uint32 index;
    uint48 time;
    MatchStatus status;
    bool isApproved;
    string homeTeam;
    string awayTeam;

  }

  bytes32[] bettingMatchIndexes;

  struct Betting {
    address bookmaker;
    address punter;
    bytes32 matchId;
    uint8 pair;
    int rate; // rate >= 0: bookmakers bets for home team else bet for away team
    uint256 amount;
    BettingStatus status;
  }


  struct Funding {

    address receiver;
    uint256 amount;
    Betting betting;

  }

  address public feeOwner;
  mapping(bytes32 => Match) matches;
  mapping(bytes32 => Betting[]) bettingMatches;
  mapping(address => uint256) balances;
  address[] players;
  mapping(address => MyBet[]) myBets;

  struct MyBet {

    uint32 betIdx;
    bytes32 matchId;
    bool bet4Weaker;

  }


  function isPlayerNotExist(address player) internal view returns (bool) {
    return myBets[player].length <= 0;
  }

  function countPlayers() public view returns (uint) {
    return players.length;
  }

  function getPlayerBalance(address player) public view returns (uint256) {
    return balances[player];
  }

  function changeFeeOwner(address _feeOwner) public onlyOwner returns (bool) {
    feeOwner = _feeOwner;
  }

  function totalBets(bytes32 matchId) public view returns (uint256);

  function getBettingMatchIds() public view returns (bytes32[]);

  function getTotalBettingMatches() public view returns (uint256);

  function findMatch(bytes32 matchId) public view returns (string homeTeam, string awayTeam, uint homeScore, uint awayScore, uint time, MatchStatus status);

  function getBettingInfo(bytes32 matchId, uint256 bettingId) public view returns (address bookmaker, address punter, uint8 pair, int odds, uint256 amount, BettingStatus status);

  function getBettingMatchesByAddress(address owner) public view returns (bytes32[] matchIds, uint256[] betIdxes, int[] odds, uint256[] amounts, bool[]chooseHomeTeam, uint[] status);

  function deal(bytes32 matchId, uint256 bettingId) public payable returns (bool);

  function offerNewMatch(bytes32 matchId, string homeTeam, string awayTeam, uint pair, uint time, int rate) public payable returns (bool);

  function cancelOffer(bytes32 matchId, uint256 bettingId) external returns (bool);

  function approveScore(bytes32 matchId) public onlyOwner returns (bool);

  function updateScore(bytes32 matchId, uint homeScore, uint awayScore) public onlyOwner returns (bool);
//  function claimStake(bytes32 matchId, uint256 bettingId) public returns (bool);

  function withDrawFee() public onlyOwner {
    owner.transfer(balances[feeOwner]);
    emit Transfer(address(this), owner, balances[feeOwner]);
  }
}
