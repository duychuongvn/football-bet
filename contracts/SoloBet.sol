pragma solidity ^0.4.21;

import "./Ownable.sol";


contract SoloBet is Ownable {

  enum MatchStatus {NotAvailable, Waiting, Playing, Canceled, Finished}

  enum BettingStatus {Open, Deal, Canceled, Refunded, Done}

  event LogDeal(address offer, address dealer, string matchId, uint256 betingId);
  event LogApproveScore(string matchId);
  event Transfer(address indexed _from, address indexed _to, uint256 _value);

  struct Match {

    string id;
    string homeTeam;
    string awayTeam;
    uint homeGoals;
    uint awayGoals;
    uint time;
    MatchStatus status;
    bool isApproved;
  }


  struct Betting {

    Match _match;
    address offer;
    address dealer;
    uint[2] rate;
    uint256 amount;
    BettingStatus status;
  }

  address public feeOwner;
  mapping(string => Match) matches;
  mapping(string => Betting[]) bettingMatches;


  function SoloBet() public {

    feeOwner = msg.sender;
  }


  function changeFeeOwner(address _feeOwner) public onlyOwner returns (bool) {
    feeOwner = _feeOwner;
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


    function updateScore(string matchId, uint homeScore, uint awayScore) public onlyOwner returns (bool) {

    Match storage _match = matches[matchId];
    _match.homeGoals = homeScore;
    _match.awayGoals = awayScore;
    _match.status = MatchStatus.Finished;
    return true;
  }

  function approveScore(string matchId) public onlyOwner returns (bool) {
    Match storage _match = matches[matchId];
    _match.isApproved = true;

    Betting[] storage _bettings = bettingMatches[matchId];
    for (uint256 i = 0; i < _bettings.length; i++) {

      Betting storage _betting = _bettings[i];
      if(_betting.status == BettingStatus.Deal) {
        funding(_match, _betting );
      } else {
        refund(_betting);
      }

    }

    return true;
  }


  function refund(Betting _betting) internal returns (bool) {

      _betting.offer.transfer(_betting.amount);
      _betting.status = BettingStatus.Refunded;
     return true;
  }

  function funding(Match _match, Betting _betting) internal returns (bool) {


    uint[2] memory rate = _betting.rate;

    uint homeGoals = _match.homeGoals * 100;
    uint awayGoals = _match.awayGoals * 100;
    uint256  fee = _betting.amount - _betting.amount * 95 / 100;
    uint256 amountAfterFee = _betting.amount - fee;
    uint256  amount = amountAfterFee;
    address winner;
    address looser;
    if(rate[0] > rate[1]) { // bet home team wins

      if (rate[0] < homeGoals) { // home team scores are more than expected from offer
        // home team win and offer win
        winner = _betting.offer;
        looser = _betting.dealer;

      } else if(rate[0] == homeGoals) { // dealer wins if home team scores equals offer score

        winner = _betting.dealer;
        looser = _betting.offer;

      if(rate[1] == 25) { // offer looses 50% if bet 1/4 for away team
         amount =  amountAfterFee - amountAfterFee*50/100;
          // offer lose 50%
        } else if (rate[1] == 50) { // offer loose all if bet 1/2 for away team
           amount =  amountAfterFee - amountAfterFee*75/100;
          //offer lose 75%
        } else {
         amount = amountAfterFee;
          // offer lose all
        }

      } else {
        winner = _betting.dealer;
        looser = _betting.offer;
      }

    } else

    {
      if (rate[1] < awayGoals) {
        // home team win and offer win

        winner = _betting.offer;
        looser = _betting.dealer;


      } else if(rate[0] == awayGoals) {

        winner = _betting.dealer;
        looser = _betting.offer;
        if(rate[0] == 25) {
          amount =  amountAfterFee - amountAfterFee*25/100;
          // offer lose 50%
        } else if (rate[0] == 50) {
          amount =  amountAfterFee - amountAfterFee*50/100;
          //offer lose 75%
        } else {
          amount = amountAfterFee;
          // offer lose all
        }

      } else {

        winner = _betting.dealer;
        looser = _betting.offer;

      }

    }


    uint256 totalFund  = _betting.amount + amount;
    feeOwner.transfer(fee);
    winner.transfer(totalFund);

}

  function offerNewMatch(string matchId, string homeTeam, string awayTeam, uint time, uint[2] rate) public payable returns (bool) {
    require(time + 75 * 1000 * 60 > now);
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
    return true;
  }

  function deal(string matchId, uint256 bettingId) public payable returns (bool) {

    Betting storage _betting = bettingMatches[matchId][bettingId];
    require(_betting.status == BettingStatus.Open);
    _betting.dealer = msg.sender;
    _betting.status = BettingStatus.Deal;
   // emit LogDeal(_betting.offer, _betting.dealer, matchId, bettingId);
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
