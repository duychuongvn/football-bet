pragma solidity ^0.4.21;

import "./Ownable.sol";
import "./SoloBet.sol";

contract AsianSoloBet is Ownable, SoloBet {

  uint256 GAS_PRICE = 21000;
//  uint256 GAS_LIMIT = 1; // 1Gwei


  function AsianSoloBet() public {
    feeOwner = msg.sender;
  }


  function getBettingMatchesByAddress(address owner) public view returns (bytes32[], uint256[], int[], uint256[], bool[], uint[]) {
    bytes32[] memory matchIds = new bytes32[](myBets[owner].length);
    uint256[] memory betIdxes = new uint256[](matchIds.length);
    uint256[] memory amounts = new uint256[](matchIds.length);
    bool[]memory slHTeam = new bool[](matchIds.length);
    uint256[] memory status = new uint256[](matchIds.length);
    int[] memory odds = new int[](matchIds.length);
    for (uint32 i = 0; i < matchIds.length; i++) {

      matchIds[i] = myBets[owner][i].matchId;
      betIdxes[i] = uint256(myBets[owner][i].betIdx);
      slHTeam[i] = myBets[owner][i].bet4Weaker;

      odds[i] = bets[matchIds[i]][betIdxes[i]].rate;
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
    MatchStatus status) {

    Match memory _match = matches[matchId];

    homeTeam = _match.hT;
    awayTeam = _match.aT;
    homeScore = _match.hSc;
    awayScore = _match.aSc;
    status = _match.status;
    time = _match.time;
  }


  function updateScore(bytes32 matchId, uint homeScore, uint awayScore) public onlyOwner returns (bool) {
    Match storage _match = matches[matchId];
    _match.hSc = uint8(homeScore);
    _match.aSc = uint8(awayScore);
    _match.status = MatchStatus.Finished;
    return true;
  }

  function approveScore(bytes32 matchId) public onlyOwner returns (bool) {
    Match storage _match = matches[matchId];
    _match.isApproved = true;

    Betting[] storage _bettings = bets[matchId];
    for (uint256 i = 0; i < _bettings.length; i++) {

      Betting storage _betting = _bettings[i];
      if (_betting.status == BetStatus.Deal) {
        funding(_match, _betting);
      } else if (_betting.status == BetStatus.Open) {
        refund(_betting);
      }

    }

    rmBet(_match);
    return true;
  }
//
//  function claimStake(bytes32 matchId, uint256 bettingId) public returns (bool) {
//    require(matches[matchId].status == MatchStatus.Finished);
//
//    Betting storage _betting = bettingMatches[matchId][bettingId];
//    require(_betting.status == BettingStatus.Deal);
//    funding(matches[matchId], _betting);
//    return true;
//
//  }

  function cancelOffer(bytes32 matchId, uint256 bettingId) external returns (bool){
    Betting memory _betting = bets[matchId][bettingId];
    require(_betting.bMaker == msg.sender);
    require(_betting.status == BetStatus.Open);
    refund(_betting);
    return true;
  }

  function rmBet(Match _match) internal returns (bool){
    delete bets[_match.id];
    rmBetIdx(_match);
    return true;
  }

  function rmBetIdx(Match _match) internal returns (bool) {

    uint32 toDelete = _match.idx;
    uint32 lastIdx = uint32(betIndexes.length - 1);
    betIndexes[toDelete] = betIndexes[lastIdx];
    matches[betIndexes[toDelete]].idx = toDelete;
    betIndexes.length--;
    return true;
  }

  function transferFund(address receiver, uint256 amount) internal returns (bool) {
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

  function funding(Match _match, Betting _betting) internal returns (bool) {

    Funding[2] memory fundings = getFunding(_match, _betting);
    for (uint i = 0; i < fundings.length; i++) {
      Funding memory funding = fundings[i];
      if (funding.receiver != 0x0) {
        transferFund(funding.receiver, funding.amount);
        funding.betting.status = BetStatus.Done;

      }
    }

    balances[_betting.bMaker] = balances[_betting.bMaker] - _betting.amount;
    balances[_betting.punter] = balances[_betting.punter] - _betting.amount;
    balances[feeOwner] = balances[feeOwner] + _betting.amount - _betting.amount * 95 / 100;

  }


  function b00Strong(int bSc, int pTScore, uint winAmount, Betting _betting) internal returns (Funding[2] fundings) {

    if (bSc > pTScore) {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount, _betting);
    } else if (bSc == pTScore) {

      fundings[0] = Funding(_betting.bMaker, winAmount, _betting);
      fundings[1] = Funding(_betting.punter, winAmount, _betting);

    } else {
      fundings[0] = Funding(_betting.punter, _betting.amount + winAmount, _betting);
    }
  }

  function b25Strong(int bTScore, int pTScore, uint winAmount, Betting _betting) internal returns (Funding[2] fundings) {

    if (bTScore > pTScore) {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount, _betting);
    } else if (bTScore == pTScore) {
      fundings[0] = Funding(_betting.bMaker, winAmount / 2, _betting);
      fundings[1] = Funding(_betting.punter, _betting.amount + winAmount / 2, _betting);
    } else {
      fundings[0] = Funding(_betting.punter, _betting.amount + winAmount, _betting);
    }
  }

  function b25Weak(int bTScore, int pTScore, uint winAmount, Betting _betting) internal returns (Funding[2] fundings) {
    if (pTScore > bTScore) {
      fundings[0] = Funding(_betting.punter, _betting.amount + winAmount, _betting);
    } else if (pTScore == bTScore) {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount / 2, _betting);
      fundings[1] = Funding(_betting.punter, winAmount / 2, _betting);
    } else {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount, _betting);
    }
  }


  function b50Strong(int bTScore, int pTScore, uint winAmount, Betting _betting) internal returns (Funding[2] fundings) {
    if (bTScore > pTScore) {// home team win

      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount, _betting);
    } else {
      fundings[0] = Funding(_betting.punter, _betting.amount + winAmount, _betting);
    }
  }

  function b50Weak(int bTScore, int pTScore, uint winAmount, Betting _betting) internal returns (Funding[2] fundings) {
    if (pTScore > bTScore) {
      fundings[0] = Funding(_betting.punter, _betting.amount + winAmount, _betting);
    } else {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount, _betting);
    }
  }


  function b75Strong(int bTScore, int pTScore, uint winAmount, Betting _betting) internal returns (Funding[2] fundings) {
    int score = bTScore - pTScore;
    if (score > 1) {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount, _betting);
    } else if (score == 1) {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount / 2, _betting);
      fundings[1] = Funding(_betting.punter, winAmount / 2, _betting);

    } else {
      fundings[0] = Funding(_betting.punter, _betting.amount + winAmount, _betting);
    }
  }

  function b75Weak(int bTScore, int pTScore, uint winAmount, Betting _betting) internal returns (Funding[2] fundings) {
    int score = bTScore - pTScore;
    if (score >= 0) {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount, _betting);
    } else if (score == - 1) {
      fundings[0] = Funding(_betting.bMaker, winAmount / 2, _betting);
      fundings[1] = Funding(_betting.punter, _betting.amount + winAmount / 2, _betting);
    } else {
      fundings[0] = Funding(_betting.punter, _betting.amount + winAmount, _betting);
    }
  }

  function b100Strong(int bTScore, int pTScore, uint winAmount, Betting _betting) internal returns (Funding[2] fundings) {
    int score = bTScore - pTScore;
    if (score > 1) {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount, _betting);
    } else if (score == 1) {
      fundings[0] = Funding(_betting.bMaker, winAmount, _betting);
      fundings[1] = Funding(_betting.punter, winAmount, _betting);
    } else {
      fundings[0] = Funding(_betting.punter, _betting.amount + winAmount, _betting);
    }
  }

  function b100Weak(int bTScore, int pTScore, uint winAmount, Betting _betting) internal returns (Funding[2] fundings) {
    int score = bTScore - pTScore;
    if (score >= 0) {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount, _betting);
    } else if (score == - 1) {
      fundings[0] = Funding(_betting.bMaker, winAmount, _betting);
      fundings[1] = Funding(_betting.punter, winAmount, _betting);
    } else {
      fundings[0] = Funding(_betting.punter, _betting.amount + winAmount, _betting);

    }
  }


  function b125Strong(int bTScore, int pTScore, uint winAmount, Betting _betting) internal returns (Funding[2] fundings) {
    int score = bTScore - pTScore;
    if (score > 1) {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount, _betting);
    } else if (score == 1) {
      fundings[0] = Funding(_betting.bMaker, winAmount / 2, _betting);
      fundings[1] = Funding(_betting.punter, _betting.amount + winAmount / 2, _betting);
    } else {
      fundings[0] = Funding(_betting.punter, _betting.amount + winAmount, _betting);

    }
  }

  function b125Weak(int bTScore, int pTScore, uint winAmount, Betting _betting) internal returns (Funding[2] fundings) {
    int score = bTScore - pTScore;
    if (score >= 0) {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount, _betting);
    } else if (score == - 1) {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount / 2, _betting);
      fundings[1] = Funding(_betting.punter, winAmount / 2, _betting);
    } else {
      fundings[0] = Funding(_betting.punter, _betting.amount + winAmount, _betting);
    }
  }

  function b150Strong(int bTScore, int pTScore, uint winAmount, Betting _betting) internal returns (Funding[2] fundings) {
    int score = bTScore - pTScore;
    if (score > 1) {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount, _betting);
    } else {
      fundings[0] = Funding(_betting.punter, _betting.amount + winAmount, _betting);
    }
  }

  function b150Weak(int bTScore, int pTScore, uint winAmount, Betting _betting) internal returns (Funding[2] fundings) {
    int score = bTScore - pTScore;
    if (score >= - 1) {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount, _betting);

    } else {
      fundings[0] = Funding(_betting.punter, _betting.amount + winAmount, _betting);
    }
  }

  function b175Strong(int bTScore, int pTScore, uint winAmount, Betting _betting) internal returns (Funding[2] fundings) {
    int score = bTScore - pTScore;
    if (score > 2) {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount, _betting);
    } else if (score == 2) {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount / 2, _betting);
      fundings[1] = Funding(_betting.punter, winAmount / 2, _betting);

    } else {
      fundings[0] = Funding(_betting.punter, _betting.amount + winAmount, _betting);
    }
  }

  function b175Weak(int bTScore, int pTScore, uint winAmount, Betting _betting) internal returns (Funding[2] fundings) {
    int score = bTScore - pTScore;
    if (score >= - 1) {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount, _betting);
    } else if (score == - 2) {
      fundings[0] = Funding(_betting.bMaker, winAmount / 2, _betting);
      fundings[1] = Funding(_betting.punter, _betting.amount + winAmount / 2, _betting);

    } else {
      fundings[0] = Funding(_betting.punter, _betting.amount + winAmount, _betting);
    }
  }

  function b200Strong(int bTScore, int pTScore, uint winAmount, Betting _betting) internal returns (Funding[2] fundings) {
    int score = bTScore - pTScore;
    if (score > 2) {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount, _betting);

    } else if (score == 2) {
      fundings[0] = Funding(_betting.bMaker, winAmount, _betting);
      fundings[1] = Funding(_betting.punter, winAmount, _betting);

    } else {
      fundings[0] = Funding(_betting.punter, _betting.amount + winAmount, _betting);
    }
  }

  function b200Weak(int bTScore, int pTScore, uint winAmount, Betting _betting) internal returns (Funding[2] fundings) {

    int score = bTScore - pTScore;
    if (score >= - 1) {
      fundings[0] = Funding(_betting.bMaker, _betting.amount + winAmount, _betting);
    } else if (score == - 2) {
      fundings[0] = Funding(_betting.bMaker, winAmount, _betting);
      fundings[1] = Funding(_betting.punter, winAmount, _betting);

    } else {
      fundings[0] = Funding(_betting.punter, _betting.amount + winAmount, _betting);
    }
  }


  function getFunding(Match _match, Betting _betting) internal returns (Funding[2] fundings) {
    int bTScore = _match.hSc;
    int pTScore = _match.aSc;
    uint256 winAmount = _betting.amount * 95 / 100;
    int score;
    int odds = _betting.rate;

    if (_betting.bmTeam == uint8(Team.Away)) {
      bTScore = _match.aSc;
      pTScore = _match.hSc;
    }

    if (odds == 0) {
      fundings = b00Strong(bTScore, pTScore, winAmount, _betting);
    } else if (odds == - 25) {
      fundings = b25Strong(bTScore, pTScore, winAmount, _betting);
    } else if (odds == 25) {
      fundings = b25Weak(bTScore, pTScore, winAmount, _betting);
    } else if (odds == - 50) {
      fundings = b50Strong(bTScore, pTScore, winAmount, _betting);
    } else if (odds == 50) {
      fundings = b50Weak(bTScore, pTScore, winAmount, _betting);
    } else if (odds == - 75) {
      fundings = b75Strong(bTScore, pTScore, winAmount, _betting);
    } else if (odds == 75) {
      fundings = b75Weak(bTScore, pTScore, winAmount, _betting);
    } else if (odds == - 100) {
      fundings = b100Strong(bTScore, pTScore, winAmount, _betting);
    } else if (odds == 100) {
      fundings = b100Weak(bTScore, pTScore, winAmount, _betting);
    } else if (odds == - 125) {
      fundings = b125Strong(bTScore, pTScore, winAmount, _betting);
    } else if (odds == 125) {
      fundings = b125Weak(bTScore, pTScore, winAmount, _betting);
    } else if (odds == - 150) {
      fundings = b150Strong(bTScore, pTScore, winAmount, _betting);
    } else if (odds == 150) {
      fundings = b150Weak(bTScore, pTScore, winAmount, _betting);
    } else if (odds == - 175) {
      fundings = b175Strong(bTScore, pTScore, winAmount, _betting);
    } else if (odds == 175) {
      fundings = b175Weak(bTScore, pTScore, winAmount, _betting);
    } else if (odds == - 200) {
      fundings = b200Strong(bTScore, pTScore, winAmount, _betting);
    } else if (odds == 200) {
      fundings = b200Weak(bTScore, pTScore, winAmount, _betting);
    }

    return fundings;
  }

  function getBettingMatchIds() public view returns (bytes32[]) {
    return betIndexes;
  }

  function getTotalBettingMatches() public view returns (uint256) {
    return betIndexes.length;
  }

  function offerNewMatch(bytes32 matchId, string homeTeam, string awayTeam, uint selectedTeam, uint time, int odds) public payable returns (bool) {

    MatchStatus status;
    if (time < now) {
      status = ssMatchStatus.Playing;
    } else {
      status = MatchStatus.Waiting;
    }


    Match memory _match = matches[matchId];

    if (_match.status == MatchStatus.NotAvailable) {
      _match.id = matchId;
      _match.hT = homeTeam;
      _match.aT = awayTeam;
      _match.time = uint48(time);
      _match.status = status;
      _match.idx = uint32(betIndexes.push(matchId) - 1);
      matches[matchId] = _match;
    }

    Betting memory _betting = Betting(msg.sender, 0x0, _match.id, uint8(selectedTeam), odds, msg.value, BetStatus.Open);
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
    odds = _betting.rate;
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
