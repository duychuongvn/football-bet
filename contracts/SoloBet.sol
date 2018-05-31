pragma solidity ^0.4.21;

import "./Ownable.sol";


contract SoloBet is Ownable {

  enum MatchStatus {NotAvailable, Waiting, Playing, Canceled, Finished}

  enum BettingStatus {Open, Deal, Canceled}

  event LogDeal(address offer, address dealer, string matchId, uint256 betingId);
  event LogApproveScore(string matchId);

  struct Match {

    string id;
    string homeTeam;
    string awayTeam;
    uint homeGoals;
    uint awayGoals;
    uint time;
    MatchStatus status;
  }


  struct Betting {

    Match _match;
    address offer;
    address dealer;
    uint[2] rate;
    uint256 amount;
    BettingStatus status;
  }

  mapping(string => Match) matches;
  mapping(string => Betting[]) bettingMatches;

  mapping(address => uint256) balanceof;

  function SoloBet() public {

  }

  function totalBets(string matchId) public view returns (uint256) {
    return bettingMatches[matchId].length;
  }


  function findMatch(string matchId) public view returns (
    string homeTeam,
    string awayTeam,
    uint homeGoals,
    uint awayGoals,
    uint time,
    MatchStatus status) {

    Match memory _match = matches[matchId];

    homeTeam = _match.homeTeam;
    awayTeam = _match.awayTeam;
    homeGoals = _match.homeGoals;
    awayGoals = _match.awayGoals;
    status = _match.status;
    time = _match.time;
  }

  function offerNewMatch(string matchId, string homeTeam, string awayTeam, uint time, uint[2] rate) public payable returns (bool) {
    require(time + 74 * 1000 * 60 > now);
    // allow 15 minutes before the match finishes

    Match memory _match;
    _match.id = matchId;
    _match.homeTeam = homeTeam;
    _match.awayTeam = awayTeam;
    _match.homeGoals = 0;
    _match.awayGoals = 0;
    _match.time = time;
    if (time < now) {
      _match.status = MatchStatus.Playing;
    } else {
      _match.status = MatchStatus.Waiting;
    }

    matches[matchId] = _match;

    Betting memory _betting;
    _betting._match = _match;
    _betting.offer = msg.sender;
    _betting.rate = rate;
    _betting.amount = msg.value;
    _betting.status = BettingStatus.Open;

    bettingMatches[matchId].push(_betting);
    balanceof[msg.sender] = balanceof[msg.sender] + msg.value;
    return true;

  }


  function offer(string matchId, uint[2] rate) public payable returns (bool) {
    Match memory _match = matches[matchId];
    Betting memory _betting;
    _betting._match = _match;
    _betting.offer = msg.sender;
    _betting.rate = rate;
    _betting.status = BettingStatus.Open;
    _betting.amount = msg.value;
    bettingMatches[matchId].push(_betting);
    balanceof[msg.sender] = balanceof[msg.sender] + msg.value;
    return true;
  }

  function deal(string matchId, uint256 bettingId) external payable returns (bool) {

    Betting storage _betting = bettingMatches[matchId][bettingId];
    require(_betting.status == BettingStatus.Open);
    _betting.dealer = msg.sender;
    _betting.status = BettingStatus.Deal;
    balanceof[msg.sender] = balanceof[msg.sender] + msg.value;
    emit LogDeal(_betting.offer, _betting.dealer, matchId, bettingId);
    return true;
  }

  function getBettingInfo(string matchId, uint256 bettingId) public view returns (address offer, address dealer, uint[2] rate, uint256 amount, BettingStatus status) {
    Betting memory _betting = bettingMatches[matchId][bettingId];
    offer = _betting.offer;
    dealer = _betting.dealer;
    rate = _betting.rate;
    amount = _betting.amount;
    status = _betting.status;
  }
}
