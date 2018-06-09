pragma solidity ^0.4.21;

import "./Ownable.sol";

import "./Strings.sol";


contract AsianSoloBet is Ownable, Strings {

  enum MatchStatus {NotAvailable, Waiting, Playing, Canceled, Finished}

  enum BettingStatus {Open, Deal, Canceled, Refunded, Done}

  event LogDeal(address offer, address dealer, bytes32 matchId, uint256 betingId);
  event LogApproveScore(bytes32 matchId);
  event Transfer(address indexed _from, address indexed _to, uint256 _value);

  uint256 GAS_PRICE = 21000;

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

  mapping(address => MyBet[]) myBets;

  struct MyBet {

    uint32 bettingIndex;
    bytes32 matchId;
  }

  function AsianSoloBet() public {

    feeOwner = msg.sender;
  }


  function getBettingMatchesByAddress(address owner) public view returns (bytes32[], uint32[], int[], uint256[]) {
    MyBet[] memory bets = myBets[owner];
    bytes32[] memory matchIds = new bytes32[](bets.length);
    uint32[] memory bettingIndexes = new uint32[](matchIds.length);
    uint256[] memory amounts = new uint256[](matchIds.length);
    int[] memory rates = new int[](matchIds.length);

    for (uint32 i = 0; i < bets.length; i++) {

      matchIds[i] = bets[i].matchId;
      bettingIndexes[i] = bets[i].bettingIndex;
      rates[i] = bettingMatches[matchIds[i]][bettingIndexes[i]].rate;
      amounts[i] = bettingMatches[matchIds[i]][bettingIndexes[i]].amount;
    }

    return (matchIds, bettingIndexes, rates, amounts);
  }

  function getBalance(address owner) public view returns (uint256) {
    return balances[owner];
  }

  function changeFeeOwner(address _feeOwner) public onlyOwner returns (bool) {
    feeOwner = _feeOwner;
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
    uint256 gaslimit = block.gaslimit;
    uint256 txFee = gaslimit * GAS_PRICE;
    balances[receiver] -= amount;
    receiver.transfer(amount - txFee);

  }

  function refund(Betting _betting) internal returns (bool) {
    transferFund(_betting.bookmaker, _betting.amount);
    _betting.status = BettingStatus.Refunded;
    return true;
  }


  function getFunding(Match _match, Betting _betting) internal returns (Funding[2] bookmakerFunding) {
    uint homeScore = _match.homeScore * 100;
    uint awayScore = _match.awayScore * 100;
    uint256 fee = _betting.amount - _betting.amount * 95 / 100;
    uint256 amountAfterFee = _betting.amount - fee;
    uint256 halfAmount = amountAfterFee / 2;
    uint score;
    //    Funding[2] memory bookmakerFunding;
    int rate = _betting.rate;

    if (rate == 0) {

      if (homeScore > awayScore) {// home team win
        //  bookmakerFunding.push(Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
      } else if (homeScore == awayScore) {

        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount, _betting);
        bookmakerFunding[1] = Funding(_betting.punter, _betting.amount, _betting);

      } else {
        bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
      }

    } else if (rate == - 25) {
      if (homeScore > awayScore) {// home team win
        // bookmakerFunding.push(Funding(_betting.bookmaker, amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, amountAfterFee, _betting);
      } else if (homeScore == awayScore) {

        //  bookmakerFunding.push(Funding(_betting.bookmaker, halfAmount, _betting));
        //  bookmakerFunding.push(Funding(_betting.punter, _betting.amount + halfAmount, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, halfAmount, _betting);
        bookmakerFunding[1] = Funding(_betting.punter, _betting.amount + halfAmount, _betting);
      } else {
        // bookmakerFunding.push(Funding(_betting.punter, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
      }
    } else if (rate == 25) {// bet for away team
      if (homeScore > awayScore) {// home team win
        //        bookmakerFunding.push(Funding(_betting.punter, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);


      } else if (homeScore == awayScore) {

        //  bookmakerFunding.push(Funding(_betting.bookmaker, halfAmount, _betting));
        //  bookmakerFunding.push(Funding(_betting.punter, _betting.amount + halfAmount, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, halfAmount, _betting);
        bookmakerFunding[1] = Funding(_betting.punter, _betting.amount + halfAmount, _betting);
      } else {
        // bookmakerFunding.push(Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
      }
    } else if (rate == - 50) {// bet for home team
      if (homeScore > awayScore) {// home team win

        //        bookmakerFunding.push(Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
      } else {
        //        bookmakerFunding.push(Funding(_betting.punter, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
      }
    } else if (rate == 50) {// bet for away team
      if (homeScore > awayScore) {// home team win
        // bookmakerFunding.push(Funding(_betting.punter, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
      } else {
        //  bookmakerFunding.push(Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
      }
    } else if (rate == - 75) {// bet for home team
      score = homeScore - awayScore;
      if (score > 1) {
        //        bookmakerFunding.push(Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
      } else if (score == 1) {
        //        bookmakerFunding.push(Funding(_betting.bookmaker, _betting.amount + halfAmount, _betting));
        //        bookmakerFunding.push(Funding(_betting.punter, halfAmount, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + halfAmount, _betting);
        bookmakerFunding[1] = Funding(_betting.punter, halfAmount, _betting);

      } else {
        //        bookmakerFunding.push(Funding(_betting.punter, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);

      }
    } else if (rate == 75) {// bet for away team
      score = awayScore - homeScore;
      if (score > 1) {
        //        bookmakerFunding.push(Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);

      } else if (score == 1) {
        halfAmount = amountAfterFee / 2;
        //        bookmakerFunding.push(Funding(_betting.bookmaker, _betting.amount + halfAmount, _betting));
        //        bookmakerFunding.push(Funding(_betting.punter, halfAmount, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + halfAmount, _betting);
        bookmakerFunding[1] = Funding(_betting.punter, halfAmount, _betting);
      } else {
        //        bookmakerFunding.push(Funding(_betting.punter, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
      }
    } else if (rate == - 100) {// bet for home team
      score = homeScore - awayScore;
      if (score > 1) {
        //        bookmakerFunding.push(Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
      } else if (score == 1) {
        //        bookmakerFunding.push(Funding(_betting.bookmaker, _betting.amount, _betting));
        //        bookmakerFunding.push(Funding(_betting.punter, _betting.amount, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount, _betting);
        bookmakerFunding[1] = Funding(_betting.punter, _betting.amount, _betting);
      } else {
        //        bookmakerFunding.push(Funding(_betting.punter, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
      }
    } else if (rate == 100) {// bet for away team
      score = awayScore - homeScore;
      if (score > 1) {
        //        bookmakerFunding.push(Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
      } else if (score == 1) {
        //        bookmakerFunding.push(Funding(_betting.bookmaker, _betting.amount, _betting));
        //        bookmakerFunding.push(Funding(_betting.punter, _betting.amount, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount, _betting);
        bookmakerFunding[1] = Funding(_betting.punter, _betting.amount, _betting);
      } else {
        //        bookmakerFunding.push(Funding(_betting.punter, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);

      }
    } else if (rate == - 125) {// bet for home team
      score = homeScore - awayScore;
      if (score > 1) {
        //        bookmakerFunding.push(Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
      } else if (score == 1) {
        //        bookmakerFunding.push(Funding(_betting.bookmaker, halfAmount, _betting));
        //        bookmakerFunding.push(Funding(_betting.punter, _betting.amount + halfAmount, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, halfAmount, _betting);
        bookmakerFunding[1] = Funding(_betting.punter, _betting.amount + halfAmount, _betting);
      } else {
        //        bookmakerFunding.push(Funding(_betting.punter, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);

      }
    } else if (rate == 125) {// bet for away team
      score = awayScore - homeScore;
      if (score > 1) {
        //        bookmakerFunding.push(Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
      } else if (score == 1) {
        //        bookmakerFunding.push(Funding(_betting.bookmaker, halfAmount, _betting));
        //        bookmakerFunding.push(Funding(_betting.punter, _betting.amount + halfAmount, _betting));

        bookmakerFunding[0] = Funding(_betting.bookmaker, halfAmount, _betting);
        bookmakerFunding[1] = Funding(_betting.punter, _betting.amount + halfAmount, _betting);
      } else {
        //        bookmakerFunding.push(Funding(_betting.punter, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
      }
    } else if (rate == - 150) {// bet for home team
      score = homeScore - awayScore;
      if (score > 1) {
        //        bookmakerFunding.push(Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
      } else {
        //        bookmakerFunding.push(Funding(_betting.punter, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
      }
    } else if (rate == 150) {// bet for away team
      score = awayScore - homeScore;
      if (score > 1) {
        //        bookmakerFunding.push(Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);

      } else {
        //        bookmakerFunding.push(Funding(_betting.punter, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
      }
    } else if (rate == - 200) {// bet for home team
      score = homeScore - awayScore;
      if (score > 2) {
        //        bookmakerFunding.push(Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);

      } else if (score == 2) {
        //        bookmakerFunding.push(Funding(_betting.bookmaker, _betting.amount, _betting));
        //        bookmakerFunding.push(_betting.punter, _betting.amount);
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount, _betting);
        bookmakerFunding[1] = Funding(_betting.punter, _betting.amount, _betting);

      } else {
        //        bookmakerFunding.push(Funding(_betting.punter, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
      }
    } else if (rate == 200) {// bet for away team
      score = awayScore - homeScore;
      if (score > 2) {
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount + amountAfterFee, _betting);
      } else if (score == 2) {
        bookmakerFunding[0] = Funding(_betting.bookmaker, _betting.amount, _betting);
        bookmakerFunding[1] = Funding(_betting.punter, _betting.amount, _betting);

      } else {
        //        bookmakerFunding.push(Funding(_betting.punter, _betting.amount + amountAfterFee, _betting));
        bookmakerFunding[0] = Funding(_betting.punter, _betting.amount + amountAfterFee, _betting);
      }
    }
    return bookmakerFunding;
  }

  function funding(Match _match, Betting _betting) internal returns (bool) {

    Funding[2] memory fundings = getFunding(_match, _betting);
    for (uint i = 0; i < 2; i++) {
      Funding memory funding = fundings[i];
      if (funding.receiver != 0x0) {
        transferFund(funding.receiver, funding.amount);
        funding.betting.status = BettingStatus.Done;
      }
    }

  }

  function getBettingMatchIds() public view returns (bytes32[]) {
    return bettingMatchIndexes;
  }

  function getTotalBettingMatches() public view returns (uint256) {
    return bettingMatchIndexes.length;
  }


  function offerNewMatch(bytes32 matchId, string homeTeam, string awayTeam, uint time, int rate) public payable returns (bool) {
    require(time + 75 * 1000 * 60 > now);
    // allow 15 minutes before the match finishes

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

    Betting memory _betting = Betting(msg.sender, 0x0, _match.id, rate, msg.value, BettingStatus.Open);
//    bettingMatches[matchId].push(_betting);
    uint32 bettingIndex = uint32(bettingMatches[matchId].push(_betting) -1);
    myBets[msg.sender].push(MyBet( bettingIndex, matchId));
    return true;

  }


  function deal(bytes32 matchId, uint256 bettingId) public payable returns (bool) {

    Betting storage _betting = bettingMatches[matchId][bettingId];
    require(_betting.bookmaker != msg.sender);
    require(_betting.status == BettingStatus.Open);
    _betting.punter = msg.sender;
    _betting.status = BettingStatus.Deal;

    myBets[msg.sender].push(MyBet(uint32(bettingId),matchId));
    // emit LogDeal(_betting.offer, _betting.dealer, matchId, bettingId);
    return true;
  }

  function getBettingInfo(bytes32 matchId, uint256 bettingId) public view returns (address bookmaker, address punter, int rate, uint256 amount, BettingStatus status) {
    Betting memory _betting = bettingMatches[matchId][bettingId];
    bookmaker = _betting.bookmaker;
    punter = _betting.punter;
    rate = _betting.rate;
    amount = _betting.amount;
    status = _betting.status;
  }
}
