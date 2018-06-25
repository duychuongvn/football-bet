pragma solidity ^0.4.21;

import "./Ownable.sol";
import "./SoloBet.sol";

contract AsianSoloBet is Ownable, SoloBet {

  uint256 GAS_PRICE = 21000;
  //  uint256 GAS_LIMIT = 1; // 1Gwei


  function AsianSoloBet() public {
    feeOwner = msg.sender;
  }


  function getBettingMatchesByAddress(address bettingOwner) public view returns (bytes32[], uint256[], int[], uint256[], bool[], uint[]) {
    bytes32[] memory matchIds = new bytes32[](myBets[bettingOwner].length);
    uint256[] memory betIdxes = new uint256[](matchIds.length);
    uint256[] memory amounts = new uint256[](matchIds.length);
    bool[]memory slHTeam = new bool[](matchIds.length);
    uint256[] memory status = new uint256[](matchIds.length);
    int[] memory odds = new int[](matchIds.length);
    for (uint32 i = 0; i < matchIds.length; i++) {

      matchIds[i] = myBets[bettingOwner][i].matchId;
      betIdxes[i] = uint256(myBets[bettingOwner][i].betIdx);
      if (bettingOwner == bets[matchIds[i]][betIdxes[i]].bMaker) {
        odds[i] = bets[matchIds[i]][betIdxes[i]].odds;
      } else {
        odds[i] = bets[matchIds[i]][betIdxes[i]].odds * - 1;
      }
      slHTeam[i] = myBets[bettingOwner][i].bet4HTeam;
      amounts[i] = bets[matchIds[i]][betIdxes[i]].amount;
      status[i] = uint256(bets[matchIds[i]][betIdxes[i]].status);
    }

    return (matchIds, betIdxes, odds, amounts, slHTeam, status);
  }


  function totalBets(bytes32 matchId) public view returns (uint256) {
    return bets[matchId].length;
  }


  function findMatch(bytes32 matchId) public view returns (
    string homeTeam,
    string awayTeam,
    uint homeScore,
    uint awayScore,
    uint time,
    MatchStatus status,
    bool isApproved) {

    Match memory _match = matches[matchId];

    homeTeam = _match.hT;
    awayTeam = _match.aT;
    homeScore = _match.hSc;
    awayScore = _match.aSc;
    status = _match.status;
    time = _match.time;
    isApproved = _match.isApproved;
  }


  function updateScore(bytes32 matchId, uint homeScore, uint awayScore) public onlyOwner returns (bool) {
    Match storage _match = matches[matchId];
    _match.hSc = uint8(homeScore);
    _match.aSc = uint8(awayScore);
    _match.status = MatchStatus.Finished;
    return true;
  }

  function approveScore(bytes32 matchId) public onlyOwner returns (bool) {
    require(!matches[matchId].isApproved);
    Match storage _match = matches[matchId];
    _match.isApproved = true;

    Betting[] storage _bettings = bets[matchId];
    for (uint256 i = 0; i < _bettings.length; i++) {

      Betting storage _betting = _bettings[i];
      if (_betting.status == BetStatus.Deal) {
        doTransfer(_match, _betting);
        _betting.status = BetStatus.Done;
      } else if (_betting.status == BetStatus.Open) {
        refund(_betting);
        _betting.status = BetStatus.Refunded;
      }

    }

    rmBet(_match);
    return true;
  }

  event LogClaim(bytes32 matchid, uint betidx, uint256 amount);
  event logrefund(bytes32 matchid, uint betidx, uint256 amount);
  function claimStake(bytes32 matchId) public returns (bool) {
    Match memory _match = matches[matchId];
    require(_match.status == MatchStatus.Finished);
    uint betCount = myBets[msg.sender].length;
    for (uint i = 0; i < betCount; i++) {

      if (myBets[msg.sender][i].matchId == matchId) {
        Betting storage _betting = bets[matchId][myBets[msg.sender][i].betIdx];
        if (_betting.status == BetStatus.Deal) {
          doTransfer(_match, _betting);
          _betting.status = BetStatus.Done;
        } else if (_betting.status == BetStatus.Open) {
          refund(_betting);
          _betting.status = BetStatus.Refunded;
        }
      }
    }
    return true;

  }

  //    function claimStake(bytes32 matchId, uint[]bettingIds) public returns (bool) {
  //      Match memory _match = matches[matchId];
  //      require(_match.status == MatchStatus.Finished);
  //      Betting storage _betting;
  //      for(uint i = 0;i < bettingIds.length; i++) {
  //         _betting = bets[matchId][bettingIds[i]];
  //        if(_betting.status == BetStatus.Deal) {
  //          doTransfer(_match, _betting);
  //        } else if(_betting.status == BetStatus.Open) {
  //          refund(_betting);
  //        }
  //      }
  //      return true;
  //
  //    }

  function cancelOffer(bytes32 matchId, uint256 bettingId) external returns (bool){
    Betting storage _betting = bets[matchId][bettingId];
    require(_betting.bMaker == msg.sender);
    require(_betting.status == BetStatus.Open);
    refund(_betting);
    _betting.status = BetStatus.Canceled;
    return true;
  }

  function rmBet(Match _match) private returns (bool){
    //delete bets[_match.id];
    rmBetIdx(_match);
    return true;
  }

  function rmBetIdx(Match _match) private returns (bool) {

    uint32 toDelete = _match.idx;
    uint32 lastIdx = uint32(betIndexes.length - 1);
    betIndexes[toDelete] = betIndexes[lastIdx];
    matches[betIndexes[toDelete]].idx = toDelete;
    betIndexes.length--;
    return true;
  }

  function transferFund(address receiver, uint256 amount) private returns (bool) {
    if (receiver != 0x0) {
      receiver.transfer(amount - GAS_PRICE);
      emit Transfer(msg.sender, receiver, amount - GAS_PRICE);
    }
  }

  function refund(Betting _betting) internal returns (bool) {
    transferFund(_betting.bMaker, _betting.amount);
    _betting.status = BetStatus.Refunded;
    balances[_betting.bMaker] = balances[_betting.bMaker] - _betting.amount;
    return true;
  }

  function doTransfer(Match _match, Betting _betting) internal returns (bool) {

    Funding[2] memory fundings = getFunding(_match, _betting);
    for (uint i = 0; i < fundings.length; i++) {
      Funding memory funding = fundings[i];
      if (funding.amount > 0 && funding.receiver != 0x0) {
        transferFund(funding.receiver, funding.amount);
      }
    }

    balances[_betting.bMaker] = balances[_betting.bMaker] - _betting.amount;
    balances[_betting.punter] = balances[_betting.punter] - _betting.amount;
    balances[feeOwner] = balances[feeOwner] + _betting.amount - _betting.amount * 95 / 100;
    _betting.status = BetStatus.Done;
  }


  function getFunding(Match _match, Betting _betting) internal returns (Funding[2] fundings) {

    if (_betting.bmTeam == uint8(Team.Home)) {
      fundings[0] = Funding(_betting.bMaker, calculateAmount(int(_match.hSc) - int(_match.aSc), _betting.odds, _betting.amount), _betting);
    } else {
      fundings[0] = Funding(_betting.bMaker, calculateAmount(int(_match.aSc) - int(_match.hSc), _betting.odds, _betting.amount), _betting);
    }

    uint punterAmount = _betting.amount + _betting.amount * 95 / 100 - fundings[0].amount;
    if (punterAmount > 0) {
      fundings[1] = Funding(_betting.punter, punterAmount, _betting);
    }
    return fundings;
  }

  function calculateAmount(int goaldifference, int odds, uint amount) private returns (uint256) {
    if ((odds + goaldifference * 100) == 25) return amount + amount * 95 / 100 / 2;
    if ((odds + goaldifference * 100) == - 25) return amount * 95 / 100 / 2;
    if ((odds + goaldifference * 100) == 0) return amount - amount * 5 / 100 / 2;
    if ((odds + goaldifference * 100) > 25) return amount + amount * 95 / 100;

    return 0;

  }

  function getBettingMatchIds() public view returns (bytes32[]) {
    return betIndexes;
  }

  function getTotalBettingMatches() public view returns (uint256) {
    return betIndexes.length;
  }

  function offerNewMatch(bytes32 matchId, string homeTeam, string awayTeam, uint selectedTeam, uint time, int odds) public payable returns (bool) {

    require(time > now);
    require((odds % 25 == 0) && (odds / 25 <= 8) && (odds / 25 >= - 8));

    Match memory _match = matches[matchId];

    if (_match.status == MatchStatus.NotAvailable) {
      _match.id = matchId;
      _match.hT = homeTeam;
      _match.aT = awayTeam;
      _match.time = uint48(time);
      _match.status = MatchStatus.Waiting;
      _match.idx = uint32(betIndexes.push(matchId) - 1);
      matches[matchId] = _match;
    }

    Betting memory _betting = Betting(msg.sender, 0x0, uint8(selectedTeam), odds, msg.value, BetStatus.Open);
    uint32 betIdx = uint32(bets[matchId].push(_betting) - 1);
    if (isPlayerNotExist(msg.sender)) {
      players.push(msg.sender);
    }
    myBets[msg.sender].push(MyBet(betIdx, matchId, selectedTeam == uint8(Team.Home)));
    balances[msg.sender] += msg.value;
    return true;

  }

  function deal(bytes32 matchId, uint256 bettingId) public payable returns (bool) {
    Betting storage _betting = bets[matchId][bettingId];
    require(_betting.amount == msg.value);
    require(_betting.bMaker != msg.sender);
    require(_betting.status == BetStatus.Open);
    _betting.punter = msg.sender;
    _betting.status = BetStatus.Deal;

    if (isPlayerNotExist(msg.sender)) {
      players.push(msg.sender);
    }

    myBets[msg.sender].push(MyBet(uint32(bettingId), matchId, _betting.bmTeam != uint8(Team.Home)));

    balances[msg.sender] += msg.value;

    emit LogDeal(_betting.bMaker, _betting.punter, matchId, bettingId);

    return true;
  }

  function getBettingInfo(bytes32 matchId, uint256 bettingId) public view returns (address bMaker, address punter, uint8 selectedTeam, int odds, uint256 amount, BetStatus status) {
    Betting memory _betting = bets[matchId][bettingId];
    bMaker = _betting.bMaker;
    punter = _betting.punter;
    odds = _betting.odds;
    amount = _betting.amount;
    status = _betting.status;
    selectedTeam = _betting.bmTeam;
  }

  event LogSelfDestruct(address sender, uint amount);

  function destroyContract() public onlyOwner {
    for (uint i = 0; i < players.length; i++) {
      if (balances[players[i]] > 0) {
        players[i].transfer(balances[players[i]]);
        emit Transfer(address(this), players[i], balances[players[i]]);
      }
    }

    emit LogSelfDestruct(owner, this.balance);
    selfdestruct(owner);
  }
}
