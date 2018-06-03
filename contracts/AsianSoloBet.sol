pragma solidity ^0.4.21;
pragma experimental ABIEncoderV2;

import "./Ownable.sol";
import "./Strings.sol";


contract AsianSoloBet is Ownable, Strings {

  enum MatchStatus {NotAvailable, Waiting, Playing, Canceled, Finished}

  enum BettingStatus {Open, Deal, Canceled, Refunded, Done}

  event LogDeal(address offer, address dealer, string matchId, uint256 betingId);
  event LogApproveScore(string matchId);
  event Transfer(address indexed _from, address indexed _to, uint256 _value);

  uint256 GAS_PRICE = 21000;

  struct Match {

    string id;
    string homeTeam;
    string awayTeam;
    uint homeScore;
    uint awayScore;
    uint time;
    MatchStatus status;
    bool isApproved;
  }


  struct Betting {

    Match _match;
    address bookmaker;
    address punter;
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
  mapping(string => Match) matches;
  mapping(string => Betting[]) bettingMatches;
  string[] bettingMatchIds;

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


  function updateScore(string matchId, uint homeScore, uint awayScore) public onlyOwner returns (bool) {

    Match storage _match = matches[matchId];
    _match.homeScore = homeScore;
    _match.awayScore = awayScore;
    _match.status = MatchStatus.Finished;
    return true;
  }

  function approveScore(string matchId) public onlyOwner returns (bool) {
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

    removeBettingMatch(matchId);
    return true;
  }

  function removeBettingMatch(string matchId) internal returns (bool){
    delete bettingMatches[matchId];
    removeBettingMatchIds(matchId);
    return true;
  }


  function transferFund(address receiver, uint256 amount) internal returns (bool) {
    uint256 gaslimit = block.gaslimit;
    uint256 txFee = gaslimit * GAS_PRICE;
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

  function getBettingMatchIds() public view returns (string) {
    return join(bettingMatchIds, ",");
    //    return "";
  }


  function copyBytes(bytes dest, bytes source, uint posdes, uint posSource, uint length) public {

    for (uint i = posSource; i < posSource + length; i++) {
      dest[posdes++] = source[i];
    }
  }

  function join(string[] data, string delimiter) public returns (string) {

    bytes memory delimiterBytes = bytes(delimiter);
    uint length = delimiterBytes.length * (data.length - 1);
    uint i;
    for (i = 0; i < data.length; i++) {
      length += (bytes(data[i])).length;
    }

    string memory tmp = new string(length);
    bytes memory joinstr = bytes(tmp);
    uint j;
    uint k;
    uint joinIndex = 0;
    bytes memory itemt = bytes(data[0]);
    copyBytes(joinstr, itemt, 0, 0, itemt.length);
    joinIndex += itemt.length;


    for (j = 1; j < data.length; j++) {
      copyBytes(joinstr, delimiterBytes, joinIndex, 0, delimiterBytes.length);
      joinIndex += delimiterBytes.length;
      bytes memory dataItem = bytes(data[j]);
      copyBytes(joinstr, dataItem, joinIndex, 0, dataItem.length);
      joinIndex += dataItem.length;
    }


    return string(joinstr);
  }

  function getTotalBettingMatches() public view returns (uint256) {
    return bettingMatchIds.length;
  }

  function removeBettingMatchIds(string matchId) {
    for (uint256 i = 0; i < bettingMatchIds.length; i++) {
      string memory id = bettingMatchIds[i];
      if (keccak256(matchId) == keccak256(id)) {
        delete bettingMatchIds[i];
        break;
      }
    }
  }


  function offerNewMatch(string matchId, string homeTeam, string awayTeam, uint time, int rate) public payable returns (bool) {
    require(time + 75 * 1000 * 60 > now);
    // allow 15 minutes before the match finishes

    Match memory _match;
    _match.id = matchId;
    _match.homeTeam = homeTeam;
    _match.awayTeam = awayTeam;
    _match.homeScore = 0;
    _match.awayScore = 0;
    _match.time = time;
    if (time < now) {
      _match.status = MatchStatus.Playing;
    } else {
      _match.status = MatchStatus.Waiting;
    }

    matches[matchId] = _match;

    Betting memory _betting;
    _betting._match = _match;
    _betting.bookmaker = msg.sender;
    _betting.rate = rate;
    _betting.amount = msg.value;
    _betting.status = BettingStatus.Open;

    bettingMatches[matchId].push(_betting);

    bettingMatchIds.push(matchId);
    return true;

  }


  function offer(string matchId, int rate) public payable returns (bool) {
    Match memory _match = matches[matchId];
    Betting memory _betting;
    _betting._match = _match;
    _betting.bookmaker = msg.sender;
    _betting.rate = rate;
    _betting.status = BettingStatus.Open;
    _betting.amount = msg.value;
    bettingMatches[matchId].push(_betting);
    return true;
  }

  function deal(string matchId, uint256 bettingId) public payable returns (bool) {

    Betting storage _betting = bettingMatches[matchId][bettingId];
    require(_betting.status == BettingStatus.Open);
    _betting.punter = msg.sender;
    _betting.status = BettingStatus.Deal;
    // emit LogDeal(_betting.offer, _betting.dealer, matchId, bettingId);
    return true;
  }

  function getBettingInfo(string matchId, uint256 bettingId) public view returns (address bookmaker, address punter, int rate, uint256 amount, BettingStatus status) {
    Betting memory _betting = bettingMatches[matchId][bettingId];
    bookmaker = _betting.bookmaker;
    punter = _betting.punter;
    rate = _betting.rate;
    amount = _betting.amount;
    status = _betting.status;
  }
}
