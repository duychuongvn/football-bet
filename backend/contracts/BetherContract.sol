pragma solidity ^0.4.21;

import "./Ownable.sol";
contract BetherContract is Ownable {


  function BetherContract(){

  }

  event LogNewBet(uint32 bettingIdx);
  event LogAcceptBet(uint32 bettingIdx, uint32 settledIdx);
  enum Team {Home, Away}
  enum MatchStatus {NotAvailable, Waiting, Playing, Canceled, Finished}
  enum BetStatus {Open, Deal, Settled, Canceled, Refunded, Done}
  enum BookmakerResult {Win, Draw, WinAHalf, LoseAHalf, Lose}

  address public feeOwner;
  mapping(address => uint256) balances;
  mapping(uint8 => string) leagues;
  mapping(bytes32 => address) betContracts;
  mapping(address => uint32[]) userBets;
  mapping(address => uint32[]) userSettled;
  mapping(bytes32 => Match) matches;
  mapping(bytes32 => uint32[]) matchBets;
  mapping(uint32 => uint32[]) betSettled;
  mapping(address => bool) admins;


  address[] players;
  Betting[] bets;
  Settle[] settles;
  bytes32[] betIndexes;
  bytes32[] matchIds;

  struct Betting {
    uint8 bmTeam; //bMaker team
    int8 odds;
    BetStatus status;
    bytes32 matchId;
    uint48 time;
    address bMaker;
    uint256 bAmount;
    uint256 settledAmount;
  }

  struct Settle {
    uint32 betIndex;
    address punter;
    uint256 amount;
  }

  struct Match {

    uint8 homeScore; // home score
    uint8 awayScore;  // away score
    uint32 idx;
    uint48 time;
    MatchStatus status;
    bool isApproved;
    bytes32 id;
    string homeTeam; // home Team
    string awayTeam; // away Team
  }


  struct Funding {

    address receiver;
    uint256 amount;

  }


  modifier canUpdate() {
    require(msg.sender == owner || admins[msg.sender]);
    _;
  }

  function updateLeague(uint8 id, string ipfsHash) canUpdate public returns (bool){
    leagues[id] = ipfsHash;
  }

  function getLeague(uint8 id) public view returns (string league) {
    league = leagues[id];
  }


  function offerNewMatch(bytes32 matchId, string homeTeam, string awayTeam, uint selectedTeam, uint time, int8 odds) public payable returns (bool) {

    require(time > now);
    require((odds % 25 == 0) && (odds / 25 <= 8) && (odds / 25 >= - 8));

    Match memory _match = matches[matchId];

    if (_match.status == MatchStatus.NotAvailable) {
      _match.homeTeam = homeTeam;
      _match.awayTeam = awayTeam;
      _match.time = uint48(time);
      _match.status = MatchStatus.Waiting;
      _match.idx = uint32(matchIds.push(matchId) - 1);
      matches[matchId] = _match;

    }

    Betting memory _betting = Betting(uint8(selectedTeam), odds, BetStatus.Open, matchId, uint48(now), msg.sender, msg.value, 0);

    uint32 betIdx = uint32(bets.push(_betting) - 1);
    userBets[msg.sender].push(betIdx);
    matchBets[matchId].push(betIdx);

    if (isPlayerNotExist(msg.sender)) {
      players.push(msg.sender);
    }
    emit LogNewBet(betIdx);
    balances[msg.sender] += msg.value;
    return true;
  }

  function deal(uint32 bettingIdx) public payable returns (bool) {
    Betting storage _betting = bets[bettingIdx];

    require(_betting.bMaker != msg.sender);
    require(_betting.status != BetStatus.Settled);
    require(_betting.bAmount - _betting.settledAmount >= msg.value);

    if (isPlayerNotExist(msg.sender)) {
      players.push(msg.sender);
    }

    _betting.settledAmount += msg.value;
    if (_betting.settledAmount == _betting.bAmount) {
      _betting.status = BetStatus.Settled;
    } else {
      _betting.status = BetStatus.Deal;
    }

    uint32 betIdx = uint32(settles.push(Settle(bettingIdx, msg.sender, msg.value)) - 1);
    userSettled[msg.sender].push(betIdx);
    betSettled[bettingIdx].push(betIdx);
    balances[msg.sender] += msg.value;
    emit LogAcceptBet(bettingIdx, betIdx);
    return true;
  }

  function isPlayerNotExist(address player) internal view returns (bool) {
    return userBets[player].length <= 0 && userSettled[player].length <= 0;
  }

  function getBettingInfo(uint32 bettingIdx) public view returns (address,
    uint8, int, uint256, uint256, BetStatus,
    address[], uint256[]) {
    Betting memory _betting = bets[bettingIdx];

    address[] memory punters = new address[](betSettled[bettingIdx].length);
    uint256[] memory punterAmounts = new uint256[](punters.length);
    for (uint32 i = 0; i < punters.length; i++) {
      punters[i] = settles[betSettled[bettingIdx][i]].punter;
      punterAmounts[i] = settles[betSettled[bettingIdx][i]].amount;
    }

    return (_betting.bMaker, _betting.bmTeam, _betting.odds, _betting.bAmount, _betting.settledAmount, _betting.status, punters, punterAmounts);
  }

  function getMatchId(uint32 bettingIdx) public view returns(bytes32) {
    return bets[bettingIdx].matchId;
  }
  function countBetStatus(bytes32[] matchIds) public view  returns(uint[], uint[], uint[], uint[], uint[]) {
    uint32[] memory betIdxes;
    uint[] memory open = new uint[](matchIds.length);
    uint[] memory settledOrDone = new uint[](matchIds.length);
    uint[] memory canceled = new uint[](matchIds.length);
    uint[] memory deal = new uint[](matchIds.length);
    uint[] memory refunded = new uint[](matchIds.length);

    for(uint i=0;i< matchIds.length;i++) {

      betIdxes = getBettings(matchIds[i]);

      for(uint j = 0;j<betIdxes.length;j++) {
        Betting memory _betting = bets[betIdxes[j]];
        if(_betting.status == BetStatus.Open) {
          open[i]++;
        } else if(_betting.status == BetStatus.Canceled) {
          canceled[i]++;
        } else if(_betting.status == BetStatus.Settled || _betting.status == BetStatus.Done) {
          settledOrDone[i]++;
        }  else if(_betting.status == BetStatus.Deal) {
          deal[i]++;
        }
        else if(_betting.status == BetStatus.Refunded) {
          refunded[i]++;
        }
      }
    }
    return (open, deal, settledOrDone, canceled, refunded);
  }

  function getBettings(bytes32 matchId) public view returns (uint32[]) {
    return matchBets[matchId];
  }


  function getUserBets(address user) public view returns (uint32[]) {
    return userBets[user];
  }

  function getUserSettles(address user) public view returns (uint32[], uint32[]) {

    uint32[] memory betIdex = new  uint32[](userSettled[user].length);
    for (uint i = 0; i < userSettled[user].length; i++) {

      betIdex[i] = settles[userSettled[user][i]].betIndex;
    }

    return (betIdex, userSettled[user]);
  }

  function getSettleInfo(uint32 bettingIdx, uint32 settleIdx) public view returns (bytes32, uint32, address,
    uint8, int, uint256, uint256, BetStatus,
    address, uint256) {
    Betting memory _betting = bets[bettingIdx];
    address punter = settles[settleIdx].punter;
    uint256 punterAmount = settles[settleIdx].amount;
    return (_betting.matchId, bettingIdx,_betting.bMaker, _betting.bmTeam, _betting.odds, _betting.bAmount, _betting.settledAmount, _betting.status, punter, punterAmount);
  }

  function countPlayers() public view returns (uint) {
    return players.length;
  }

  function getPlayerBalance(address player) public view returns (uint256) {
    return balances[player];
  }

  function updateScore(bytes32 matchId, uint homeScore, uint awayScore) public canUpdate returns (bool) {
    Match storage _match = matches[matchId];
    _match.homeScore = uint8(homeScore);
    _match.awayScore = uint8(awayScore);
    _match.status = MatchStatus.Finished;
    return true;
  }


  function approveScore(bytes32 matchId) public canUpdate returns (bool) {

    require(!matches[matchId].isApproved);
    Match storage _match = matches[matchId];
    _match.isApproved = true;

    uint32[] memory betIdxes = matchBets[matchId];
    for (uint256 i = 0; i < betIdxes.length; i++) {

      Betting storage _betting = bets[betIdxes[i]];

      if (_betting.status == BetStatus.Deal || _betting.status == BetStatus.Settled) {
        doTransfer(_match, _betting, 0);
        _betting.status = BetStatus.Done;
      }
      else if (_betting.status == BetStatus.Open) {

        refund(_betting);
        _betting.status = BetStatus.Refunded;
      }

    }

    rmBetIdx(_match);
    return true;
  }
  function rmBetIdx(Match _match) private returns (bool) {

    uint32 toDelete = _match.idx;
    uint32 lastIdx = uint32(matchIds.length - 1);
    matchIds[toDelete] = matchIds[lastIdx];
    matches[matchIds[toDelete]].idx = toDelete;
    matchIds.length--;
    return true;
  }

  function cancelOffer(uint256 bettingId) external returns (bool){
    Betting storage _betting = bets[bettingId];
    require(_betting.bMaker == msg.sender);
    require(_betting.status == BetStatus.Open);
    refund(_betting);
    _betting.status = BetStatus.Canceled;
    return true;
  }

  function refund(Betting _betting) internal returns (bool) {
    transferFund(_betting.bMaker, _betting.bAmount);
    _betting.status = BetStatus.Refunded;
    balances[_betting.bMaker] = balances[_betting.bMaker] - _betting.bAmount;
    return true;
  }

  function doTransfer(Match _match, Betting _betting, uint32 betIndex) internal returns (bool) {

    Funding[] memory fundings = getFunding(_match, _betting, betIndex);
    for (uint i = 0; i < fundings.length; i++) {
      Funding memory funding = fundings[i];
      if (funding.amount > 0 && funding.receiver != 0x0) {
        transferFund(funding.receiver, funding.amount);
      }
    }

    balances[_betting.bMaker] = balances[_betting.bMaker] - _betting.bAmount;
    balances[feeOwner] = balances[feeOwner] + (_betting.settledAmount - _betting.settledAmount * 95 / 100);
    _betting.status = BetStatus.Done;
  }

  function transferFund(address receiver, uint256 amount) private returns (bool) {
    if (receiver != 0x0) {
      receiver.transfer(amount);
    }
  }

  function getFunding(Match _match, Betting _betting, uint32 betIdx) internal returns (Funding[]) {

    BookmakerResult bmResult;

    // calculate for bookmaker
    if (_betting.bmTeam == uint8(Team.Home)) {
      bmResult = getBookmakerResult(int(_match.homeScore) - int(_match.awayScore), _betting.odds);
    } else {
      bmResult = getBookmakerResult(int(_match.awayScore) - int(_match.homeScore), _betting.odds);
    }
    Funding[] memory fundings = new Funding[](betSettled[betIdx].length + 1);
    if (bmResult == BookmakerResult.Win) {
      fundings[0] = Funding(_betting.bMaker, _betting.bAmount + _betting.settledAmount * 95 / 100);
      for (uint i = 0; i < betSettled[betIdx].length; i++) {
        balances[settles[betSettled[betIdx][i]].punter] -= settles[betSettled[betIdx][i]].amount;
      }
    } else if (bmResult == BookmakerResult.Draw) {
      fundings[0] = Funding(_betting.bMaker, _betting.bAmount + (_betting.settledAmount - _betting.settledAmount * 5 / 100 / 2));
      for (i = 0; i < betSettled[betIdx].length; i++) {
        fundings[i + 1] = Funding(settles[betSettled[betIdx][i]].punter, settles[betSettled[betIdx][i]].amount - settles[betSettled[betIdx][i]].amount * 5 / 100 / 2);
        balances[settles[betSettled[betIdx][i]].punter] -= settles[betSettled[betIdx][i]].amount;
      }
    } else if (bmResult == BookmakerResult.WinAHalf) {
      fundings[0] = Funding(_betting.bMaker, _betting.bAmount + (_betting.settledAmount + _betting.settledAmount * 95 / 100 / 2));
      for (i = 0; i < betSettled[betIdx].length; i++) {
        fundings[i + 1] = Funding(settles[betSettled[betIdx][i]].punter, settles[betSettled[betIdx][i]].amount - settles[betSettled[betIdx][i]].amount * 95 / 100 / 2);
        balances[settles[betSettled[betIdx][i]].punter] -= settles[betSettled[betIdx][i]].amount;
      }
    } else if (bmResult == BookmakerResult.LoseAHalf) {
      fundings[0] = Funding(_betting.bMaker, _betting.bAmount + _betting.settledAmount * 95 / 100 / 2);
      for (i = 0; i < betSettled[betIdx].length; i++) {
        fundings[i + 1] = Funding(settles[betSettled[betIdx][i]].punter, settles[betSettled[betIdx][i]].amount + settles[betSettled[betIdx][i]].amount * 95 / 100 / 2);
        balances[settles[betSettled[betIdx][i]].punter] -= settles[betSettled[betIdx][i]].amount;
      }
    }
    else {
      fundings[0] = Funding(_betting.bMaker, _betting.bAmount - _betting.settledAmount);
      for (i = 0; i < betSettled[betIdx].length; i++) {
        fundings[i + 1] = Funding(settles[betSettled[betIdx][i]].punter, settles[betSettled[betIdx][i]].amount + settles[betSettled[betIdx][i]].amount * 95 / 100);
        balances[settles[betSettled[betIdx][i]].punter] -= settles[betSettled[betIdx][i]].amount;
      }

    }

    return fundings;
  }

  function getBookmakerResult(int goaldifference, int odds) private returns (BookmakerResult) {
    if ((odds + goaldifference * 100) == 25) return BookmakerResult.WinAHalf;
    if ((odds + goaldifference * 100) == - 25) return BookmakerResult.LoseAHalf;
    if ((odds + goaldifference * 100) == 0) return BookmakerResult.Draw;
    if ((odds + goaldifference * 100) > 25) return BookmakerResult.Win;
    return BookmakerResult.Lose;
  }

  function claimStake(bytes32 matchId, uint32[] bettingIdxes) public returns (bool) {

    Match memory _match = matches[matchId];
    require(_match.status == MatchStatus.Finished);
    for (uint i = 0; i < bettingIdxes.length; i++) {
      Betting storage _betting = bets[bettingIdxes[i]];
      if (_betting.matchId == matchId) {
        doTransfer(_match, _betting, bettingIdxes[i]);
      }

    }
    return true;

  }


  function getVolume(uint48 time) public  view returns (uint256) {

    uint256 vol;
    for(uint i =0;i< bets.length;i++) {
      if(bets[i].time >= time) {
        vol+= bets[i].bAmount + bets[i].settledAmount;
      }
    }
    return vol;
  }

}
