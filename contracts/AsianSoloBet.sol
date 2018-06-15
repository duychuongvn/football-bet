pragma solidity ^0.4.21;

import "./Ownable.sol";
import "./SoloBet.sol";


contract AsianSoloBet is Ownable, SoloBet {

  string public name;
  uint256 GAS_PRICE = 21000;
  uint256 GAS_LIMIT = 1; // 1Gwei


  function AsianSoloBet() public {
    name = "Asia Solo Bet";
    feeOwner = msg.sender;
  }


  function getBettingMatchesByAddress(address owner) public view returns (bytes32[], uint256[], int[], uint256[], bool[], uint[]) {
    bytes32[] memory matchIds = new bytes32[](myBets[owner].length);
    uint256[] memory betIdxes = new uint256[](matchIds.length);
    uint256[] memory amounts = new uint256[](matchIds.length);
    bool[]memory chooseHomeTeam = new bool[](matchIds.length);
    uint256[] memory status = new uint256[](matchIds.length);
    int[] memory odds = new int[](matchIds.length);
    for (uint32 i = 0; i < matchIds.length; i++) {

      matchIds[i] = myBets[owner][i].matchId;
      betIdxes[i] = uint256(myBets[owner][i].betIdx);
      chooseHomeTeam[i] = myBets[owner][i].bet4Weaker;

      odds[i] = bettingMatches[matchIds[i]][betIdxes[i]].rate;
      amounts[i] = bettingMatches[matchIds[i]][betIdxes[i]].amount;
      status[i] = uint256(bettingMatches[matchIds[i]][betIdxes[i]].status);
    }

    return (matchIds, betIdxes, odds, amounts, chooseHomeTeam, status);
  }


  function totalBets(bytes32 matchId) public view returns (uint256) {
    return bettingMatches[matchId].length;
  }


  function findMatch(bytes32 matchId) public view returns (
    string homeTeam,
    string awayTeam,
    uint homeScore,
    uint awayScore,
    uint time,
    MatchStatus status) {

    Match memory _match = matches[matchId];

    homeTeam = _match.homeTeam;
    awayTeam = _match.awayTeam;
    homeScore = _match.homeScore;
    awayScore = _match.awayScore;
    status = _match.status;
    time = _match.time;
  }


  function updateScore(bytes32 matchId, uint homeScore, uint awayScore) public onlyOwner returns (bool) {

    Match storage _match = matches[matchId];
    _match.homeScore = uint8(homeScore);
    _match.awayScore = uint8(awayScore);
    _match.status = MatchStatus.Finished;
    return true;
  }

  function approveScore(bytes32 matchId) public onlyOwner returns (bool) {
    Match storage _match = matches[matchId];
    _match.isApproved = true;

    Betting[] storage _bettings = bettingMatches[matchId];
    for (uint256 i = 0; i < _bettings.length; i++) {

      Betting storage _betting = _bettings[i];
      if (_betting.status == BettingStatus.Deal) {
        funding(_match, _betting);
      } else if (_betting.status == BettingStatus.Open) {
        refund(_betting);
      }

    }

    removeBettingMatch(_match);
    emit LogApproveScore(_match.id);
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
    Betting memory _betting = bettingMatches[matchId][bettingId];
    require(_betting.bookmaker == msg.sender);
    require(_betting.status == BettingStatus.Open);
    refund(_betting);
    return true;
  }

  function removeBettingMatch(Match _match) internal returns (bool){
    delete bettingMatches[_match.id];
    removeBettingMatchIndex(_match);
    return true;
  }

  function removeBettingMatchIndex(Match _match) internal returns (bool) {

    uint32 toDelete = _match.index;
    uint32 lastIndex = uint32(bettingMatchIndexes.length - 1);
    bettingMatchIndexes[toDelete] = bettingMatchIndexes[lastIndex];
    matches[bettingMatchIndexes[toDelete]].index = toDelete;
    bettingMatchIndexes.length--;
    return true;
  }

  function transferFund(address receiver, uint256 amount) internal returns (bool) {
    if (receiver != 0x0) {
      uint256 txFee = GAS_LIMIT * GAS_PRICE;
      receiver.transfer(amount - txFee);
      emit Transfer(msg.sender, receiver, amount);
    }
  }

  function refund(Betting _betting) internal returns (bool) {
    transferFund(_betting.bookmaker, _betting.amount);
    _betting.status = BettingStatus.Refunded;
    balances[_betting.bookmaker] = balances[_betting.bookmaker] - _betting.amount;
    emit UpdateFund(_betting.bookmaker, _betting.amount, "refund");
    return true;
  }

  function funding(Match _match, Betting _betting) internal returns (bool) {

    Funding[2] memory fundings = getFunding(_match, _betting);
    for (uint i = 0; i < fundings.length; i++) {
      Funding memory funding = fundings[i];
      if (funding.receiver != 0x0) {
        transferFund(funding.receiver, funding.amount);
        funding.betting.status = BettingStatus.Done;

      }
    }

    balances[_betting.bookmaker] = balances[_betting.bookmaker] - _betting.amount;
    balances[_betting.punter] = balances[_betting.punter] - _betting.amount;
    balances[feeOwner] = balances[feeOwner] + _betting.amount - _betting.amount * 95 / 100;

  }

  event UpdateFund(address player, uint256 value, string note);
  event RemainFund(address player, uint256 value, string note);

  function calcFundForBetting00AndBookmakerChooseStrongerTeam(int bookMarkerTeamScore, int punterTeamScore, uint amountAfterFee, Betting _betting) internal returns (Funding[2] bookmakerFunding) {

    if (bookMarkerTeamScore > punterTeamScore) {// home team win
      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
    } else if (bookMarkerTeamScore == punterTeamScore) {

      bookmakerFunding[0] = Funding(_betting.bookmaker, amountAfterFee, _betting);
      bookmakerFunding[1] = Funding(_betting.punter, amountAfterFee, _betting);

    } else {
      bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
    }
  }

  function calcFundForBetting025AndBookmakerChooseStrongerTeam(int bookmakerTeamScore, int punterTeamScore, uint amountAfterFee, Betting _betting) internal returns (Funding[2] bookmakerFunding) {
    uint256 halfAmount = amountAfterFee / 2;
    if (bookmakerTeamScore > punterTeamScore) {// home team win
      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
    } else if (bookmakerTeamScore == punterTeamScore) {

      bookmakerFunding[0] = Funding(_betting.bookmaker, halfAmount, _betting);
      bookmakerFunding[1] = Funding(_betting.punter, _betting.amount + halfAmount, _betting);
    } else {
      bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
    }
  }

  function calcFundForBetting025AndBookmakerChooseWeakerTeam(int bookmakerTeamScore, int punterTeamScore, uint amountAfterFee, Betting _betting) internal returns (Funding[2] bookmakerFunding) {
    uint256 halfAmount = amountAfterFee / 2;
    if (punterTeamScore > bookmakerTeamScore) {
      bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);


    } else if (punterTeamScore == bookmakerTeamScore) {

      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + halfAmount, _betting);
      bookmakerFunding[1] = Funding(_betting.punter, halfAmount, _betting);
    } else {
      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
    }
  }


  function calcFundForBetting050AndBookmakerChooseStrongerTeam(int bookmakerTeamScore, int punterTeamScore, uint amountAfterFee, Betting _betting) internal returns (Funding[2] bookmakerFunding) {
    if (bookmakerTeamScore > punterTeamScore) {// home team win

      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
    } else {
      bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
    }
  }

  function calcFundForBetting050AndBookmakerChooseWeakerTeam(int bookmakerTeamScore, int punterTeamScore, uint amountAfterFee, Betting _betting) internal returns (Funding[2] bookmakerFunding) {
    if (punterTeamScore > bookmakerTeamScore) {// home team win
      bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
    } else {
      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
    }
  }


  function calcFundForBetting075AndBookmakerChooseStrongerTeam(int bookmakerTeamScore, int punterTeamScore, uint amountAfterFee, Betting _betting) internal returns (Funding[2] bookmakerFunding) {
    int score = bookmakerTeamScore - punterTeamScore;
    uint256 halfAmount = amountAfterFee / 2;
    if (score > 1) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
    } else if (score == 1) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + halfAmount, _betting);
      bookmakerFunding[1] = Funding(_betting.punter, halfAmount, _betting);

    } else {
      bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
    }
  }

  function calcFundForBetting075AndBookmakerChooseWeakerTeam(int bookmakerTeamScore, int punterTeamScore, uint amountAfterFee, Betting _betting) internal returns (Funding[2] bookmakerFunding) {
    int score = bookmakerTeamScore - punterTeamScore;
    uint256 halfAmount = amountAfterFee / 2;
    if (score >= 0) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
    } else if (score == - 1) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, halfAmount, _betting);
      bookmakerFunding[1] = Funding(_betting.punter, _betting.amount + halfAmount, _betting);
    } else {
      bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
    }
  }

  function calcFundForBetting100AndBookmakerChooseStrongerTeam(int bookmakerTeamScore, int punterTeamScore, uint amountAfterFee, Betting _betting) internal returns (Funding[2] bookmakerFunding) {
    int score = bookmakerTeamScore - punterTeamScore;
    if (score > 1) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
    } else if (score == 1) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, amountAfterFee, _betting);
      bookmakerFunding[1] = Funding(_betting.punter, amountAfterFee, _betting);
    } else {
      bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
    }
  }

  function calcFundForBetting100AndBookmakerChooseWeakerTeam(int bookmakerTeamScore, int punterTeamScore, uint amountAfterFee, Betting _betting) internal returns (Funding[2] bookmakerFunding) {
    int score = bookmakerTeamScore - punterTeamScore;
    if (score >= 0) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
    } else if (score == - 1) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, amountAfterFee, _betting);
      bookmakerFunding[1] = Funding(_betting.punter, amountAfterFee, _betting);
    } else {
      bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);

    }
  }


  function calcFundForBetting125AndBookmakerChooseStrongerTeam(int bookmakerTeamScore, int punterTeamScore, uint amountAfterFee, Betting _betting) internal returns (Funding[2] bookmakerFunding) {
    int score = bookmakerTeamScore - punterTeamScore;
    uint256 halfAmount = amountAfterFee / 2;
    if (score > 1) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
    } else if (score == 1) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, halfAmount, _betting);
      bookmakerFunding[1] = Funding(_betting.punter, _betting.amount + halfAmount, _betting);
    } else {
      bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);

    }
  }

  function calcFundForBetting125AndBookmakerChooseWeakerTeam(int bookmakerTeamScore, int punterTeamScore, uint amountAfterFee, Betting _betting) internal returns (Funding[2] bookmakerFunding) {
    int score = bookmakerTeamScore - punterTeamScore;
    uint256 halfAmount = amountAfterFee / 2;
    if (score >= 0) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
    } else if (score == - 1) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + halfAmount, _betting);
      bookmakerFunding[1] = Funding(_betting.punter, halfAmount, _betting);
    } else {
      bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
    }
  }

  function calcFundForBetting150AndBookmakerChooseStrongerTeam(int bookmakerTeamScore, int punterTeamScore, uint amountAfterFee, Betting _betting) internal returns (Funding[2] bookmakerFunding) {
    int score = bookmakerTeamScore - punterTeamScore;
    if (score > 1) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
    } else {
      bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
    }
  }

  function calcFundForBetting150AndBookmakerChooseWeakerTeam(int bookmakerTeamScore, int punterTeamScore, uint amountAfterFee, Betting _betting) internal returns (Funding[2] bookmakerFunding) {
    int score = bookmakerTeamScore - punterTeamScore;
    if (score >= - 1) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);

    } else {
      bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
    }
  }

  function calcFundForBetting175AndBookmakerChooseStrongerTeam(int bookmakerTeamScore, int punterTeamScore, uint amountAfterFee, Betting _betting) internal returns (Funding[2] bookmakerFunding) {
    int score = bookmakerTeamScore - punterTeamScore;
    uint256 halfAmount = amountAfterFee / 2;
    if (score > 2) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
    } else if (score == 2) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + halfAmount, _betting);
      bookmakerFunding[1] = Funding(_betting.punter, halfAmount, _betting);

    } else {
      bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
    }
  }

  function calcFundForBetting175AndBookmakerChooseWeakerTeam(int bookmakerTeamScore, int punterTeamScore, uint amountAfterFee, Betting _betting) internal returns (Funding[2] bookmakerFunding) {
    int score = bookmakerTeamScore - punterTeamScore;
    uint256 halfAmount = amountAfterFee / 2;
    if (score >= - 1) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
    } else if (score == - 2) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, halfAmount, _betting);
      bookmakerFunding[1] = Funding(_betting.punter, _betting.amount + halfAmount, _betting);

    } else {
      bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
    }
  }

  function calcFundForBetting200AndBookmakerChooseStrongerTeam(int bookmakerTeamScore, int punterTeamScore, uint amountAfterFee, Betting _betting) internal returns (Funding[2] bookmakerFunding) {
    int score = bookmakerTeamScore - punterTeamScore;
    if (score > 2) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);

    } else if (score == 2) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, amountAfterFee, _betting);
      bookmakerFunding[1] = Funding(_betting.punter, amountAfterFee, _betting);

    } else {
      bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
    }
  }

  function calcFundForBetting200AndBookmakerChooseWeakerTeam(int bookmakerTeamScore, int punterTeamScore, uint amountAfterFee, Betting _betting) internal returns (Funding[2] bookmakerFunding) {

    int score = bookmakerTeamScore - punterTeamScore;
    if (score >= - 1) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
    } else if (score == - 2) {
      bookmakerFunding[0] = Funding(_betting.bookmaker, amountAfterFee, _betting);
      bookmakerFunding[1] = Funding(_betting.punter, amountAfterFee, _betting);

    } else {
      bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
    }
  }


  function getFunding(Match _match, Betting _betting) internal returns (Funding[2] bookmakerFunding) {
    int bookmakerTeamScore = _match.homeScore;
    int punterTeamScore = _match.awayScore;
    uint256 fee = _betting.amount - _betting.amount * 95 / 100;
    uint256 amountAfterFee = _betting.amount - fee;
    uint256 halfAmount = amountAfterFee / 2;
    int score;
    int rate = _betting.rate;
    if (_betting.pair == uint8(Pair.Away_Home)) {
      rate = rate * - 1;
      bookmakerTeamScore = _match.awayScore;
      punterTeamScore = _match.homeScore;
    }

    if (rate == 0) {
      bookmakerFunding = calcFundForBetting00AndBookmakerChooseStrongerTeam(bookmakerTeamScore, punterTeamScore, amountAfterFee, _betting);
    } else if (rate == - 25) {
      bookmakerFunding = calcFundForBetting025AndBookmakerChooseStrongerTeam(bookmakerTeamScore, punterTeamScore, amountAfterFee, _betting);
    } else if (rate == 25) {// bet for away team
      bookmakerFunding = calcFundForBetting025AndBookmakerChooseWeakerTeam(punterTeamScore, bookmakerTeamScore, amountAfterFee, _betting);
    } else if (rate == - 50) {// bet for home team
      bookmakerFunding = calcFundForBetting050AndBookmakerChooseStrongerTeam(bookmakerTeamScore, punterTeamScore, amountAfterFee, _betting);
    } else if (rate == 50) {// bet for away team
      bookmakerFunding = calcFundForBetting050AndBookmakerChooseWeakerTeam(punterTeamScore, bookmakerTeamScore, amountAfterFee, _betting);
    } else if (rate == - 75) {// bet for home team
      bookmakerFunding = calcFundForBetting075AndBookmakerChooseStrongerTeam(bookmakerTeamScore, punterTeamScore, amountAfterFee, _betting);
    } else if (rate == 75) {// bet for away team
      bookmakerFunding = calcFundForBetting075AndBookmakerChooseWeakerTeam(punterTeamScore, bookmakerTeamScore, amountAfterFee, _betting);
    } else if (rate == - 100) {// bet for home team
      bookmakerFunding = calcFundForBetting100AndBookmakerChooseStrongerTeam(bookmakerTeamScore, punterTeamScore, amountAfterFee, _betting);
    } else if (rate == 100) {// bet for away team
      bookmakerFunding = calcFundForBetting100AndBookmakerChooseWeakerTeam(punterTeamScore, bookmakerTeamScore, amountAfterFee, _betting);
    } else if (rate == - 125) {// bet for home team
      bookmakerFunding = calcFundForBetting125AndBookmakerChooseStrongerTeam(bookmakerTeamScore, punterTeamScore, amountAfterFee, _betting);
    } else if (rate == 125) {// bet for away team
      bookmakerFunding = calcFundForBetting125AndBookmakerChooseWeakerTeam(punterTeamScore, bookmakerTeamScore, amountAfterFee, _betting);
    } else if (rate == - 150) {
      bookmakerFunding = calcFundForBetting150AndBookmakerChooseStrongerTeam(bookmakerTeamScore, punterTeamScore, amountAfterFee, _betting);
    } else if (rate == 150) {// bet for away team
      bookmakerFunding = calcFundForBetting150AndBookmakerChooseWeakerTeam(punterTeamScore, bookmakerTeamScore, amountAfterFee, _betting);
    } else if (rate == - 175) {
      bookmakerFunding = calcFundForBetting175AndBookmakerChooseStrongerTeam(bookmakerTeamScore, punterTeamScore, amountAfterFee, _betting);
    } else if (rate == 175) {
      bookmakerFunding = calcFundForBetting175AndBookmakerChooseWeakerTeam(punterTeamScore, bookmakerTeamScore, amountAfterFee, _betting);
    } else if (rate == - 200) {
      bookmakerFunding = calcFundForBetting200AndBookmakerChooseStrongerTeam(bookmakerTeamScore, punterTeamScore, amountAfterFee, _betting);
    } else if (rate == 200) {
      bookmakerFunding = calcFundForBetting200AndBookmakerChooseWeakerTeam(punterTeamScore, bookmakerTeamScore, amountAfterFee, _betting);
    }

    return bookmakerFunding;
  }

  function getBettingMatchIds() public view returns (bytes32[]) {
    return bettingMatchIndexes;
  }

  function getTotalBettingMatches() public view returns (uint256) {
    return bettingMatchIndexes.length;
  }

  function abs(int value) internal view returns (int) {
    if (value < 0) {
      return value * - 1;
    }
    return value;
  }

  function offerNewMatch(bytes32 matchId, string homeTeam, string awayTeam, uint pair, uint time, int rate) public payable returns (bool) {
    require(time + 75 * 60 > now);// allow 15 minutes before the match finishes
    require(rate == 0 || abs(rate) == 25 || abs(rate) == 50 || abs(rate) == 75 || abs(rate) == 100 || abs(rate) == 125 || abs(rate) == 150 || abs(rate) == 175 || abs(rate) == 200);

    MatchStatus status;
    if (time < now) {
      status = MatchStatus.Playing;
    } else {
      status = MatchStatus.Waiting;
    }


    Match memory _match = matches[matchId];

    if (_match.status == MatchStatus.NotAvailable) {
      _match.id = matchId;
      _match.homeTeam = homeTeam;
      _match.awayTeam = awayTeam;
      _match.homeScore = 0;
      _match.awayScore = 0;
      _match.time = uint48(time);
      _match.status = status;
      _match.index = uint32(bettingMatchIndexes.push(matchId) - 1);
      matches[matchId] = _match;
    }

    Betting memory _betting = Betting(msg.sender, 0x0, _match.id, uint8(pair), rate, msg.value, BettingStatus.Open);
    uint32 betIdx = uint32(bettingMatches[matchId].push(_betting) - 1);
    if (isPlayerNotExist(msg.sender)) {
      players.push(msg.sender);
    }
    myBets[msg.sender].push(MyBet(betIdx, matchId, rate >= 0));
    balances[msg.sender] += msg.value;

    return true;

  }


  function deal(bytes32 matchId, uint256 bettingId) public payable returns (bool) {
    Betting storage _betting = bettingMatches[matchId][bettingId];
    require(_betting.amount == msg.value);
    require(_betting.bookmaker != msg.sender);
    require(_betting.status == BettingStatus.Open);
    _betting.punter = msg.sender;
    _betting.status = BettingStatus.Deal;

    if (isPlayerNotExist(msg.sender)) {
      players.push(msg.sender);
    }
    myBets[msg.sender].push(MyBet(uint32(bettingId), matchId, _betting.rate < 0));
    balances[msg.sender] += msg.value;

    emit LogDeal(_betting.bookmaker, _betting.punter, matchId, bettingId);

    return true;
  }

  function getBettingInfo(bytes32 matchId, uint256 bettingId) public view returns (address bookmaker, address punter, uint8 pair, int odds, uint256 amount, BettingStatus status) {
    Betting memory _betting = bettingMatches[matchId][bettingId];
    bookmaker = _betting.bookmaker;
    punter = _betting.punter;
    odds = _betting.rate;
    amount = _betting.amount;
    status = _betting.status;
    pair = _betting.pair;
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
