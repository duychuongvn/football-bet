pragma solidity ^0.4.21;

contract Ownable {

  address public owner;


  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}

interface IFootballScore {
  function getMatchDetails(bytes32 matchId) view returns(bytes32, string, string, string, uint48, uint8[] goalsAndStatus) ;
  function getMatchStatus(bytes32 _matchId) view returns(uint8 status, uint48 time);
  function getFinalScore(bytes32 _matchId)  view returns(bytes32 matchId,uint8 goalsHomeTeam,uint8 goalsAwayTeam, uint8 status);
}
contract BetherContract is Ownable {


  event LogNewBet(bytes32 matchId, uint32 bettingIdx);
  event LogAcceptBet(bytes32 matchId, uint32 bettingIdx, uint32 settledIdx);
  event LogUpdateScore(bytes32 matchId);
  event LogApproveScore(bytes32 matchId);
  event LogClaimStake(bytes32 matchId);
  event CancelBet(uint256 bettingIdx);

  enum Team {Home, Away}
  enum MatchStatus {NotAvailable, Waiting, Playing, Canceled, Finished}
  enum BetStatus {Open, Deal, Settled, Canceled, Refunded, Done}
  enum BookmakerResult {None, Win, WinAHalf, Draw, LoseAHalf, Lose}

  IFootballScore footballScore;
  mapping(address => uint256) public balances;
  mapping(address => bool) public admins;
  mapping(uint8 => string) leagues;
  mapping(bytes32 => address) betContracts;
  mapping(address => uint32[]) userBets;
  mapping(address => uint32[]) userSettled;
  mapping(bytes32 => uint32[]) matchBets;
  mapping(uint32 => uint32[]) betSettled;
  mapping(address => uint256) report;

  address[] players;
  Betting[] bets;
  Settle[] settles;
  bytes32[] betIndexes;
  bytes32[] matchIds;

  struct Betting {
    uint8 bmTeam; //bMaker team
    BetStatus status;
    BookmakerResult bResult;
    uint48 time;
    int odds;
    bytes32 matchId;
    address bMaker;
    uint256 bAmount;
    uint256 settledAmount;
  }

  struct Settle {
    uint32 betIndex;
    address punter;
    uint256 amount;
  }

  struct Funding {

    address receiver;
    uint256 originAmount;
    uint256 amount;
  }


  function BetherContract(address footballContractAddr){
      footballScore = IFootballScore(footballContractAddr);
  }

  modifier isAdmin() {
    require(msg.sender == owner || admins[msg.sender]);
    _;
  }

  function changeAdmin(address user, bool isAdmin) public  onlyOwner{
    admins[user] = isAdmin;
  }

  function offerNewMatch(bytes32 matchId, uint selectedTeam, int handicap) public matchNotFinish(matchId) payable returns (bool) {

    require(msg.sender != owner);
    require(handicap % 25 == 0);

    Betting memory _betting = Betting(uint8(selectedTeam), BetStatus.Open, BookmakerResult.None,  uint48(now), handicap, matchId, msg.sender, msg.value, 0);

    uint32 betIdx = uint32(bets.push(_betting) - 1);
    userBets[msg.sender].push(betIdx);
    matchBets[matchId].push(betIdx);

    if (isPlayerNotExist(msg.sender)) {
      players.push(msg.sender);
    }
    emit LogNewBet(matchId, betIdx);
    balances[msg.sender] += msg.value;
    return true;
  }

  modifier matchNotFinish(bytes32 matchId) {
    uint8 matchStatus;
    uint48 time;
    (matchStatus, time) = footballScore.getMatchStatus(matchId);

    require(matchStatus == 1 && time > now, "Match should not finished");
    _;
  }
  function settleBet(uint32 bettingIdx) public payable returns (bool) {
    require(msg.sender != owner);

    Betting storage _betting = bets[bettingIdx];
    require(_betting.bMaker != msg.sender);
    require(_betting.status != BetStatus.Settled);
    require(_betting.bAmount - _betting.settledAmount >= msg.value);
    //TODO Check match status
//    matchNotFinish(_betting.matchId);
    if (isPlayerNotExist(msg.sender)) {
      players.push(msg.sender);
    }

    _betting.settledAmount += msg.value;
    _betting.time = uint48(now);
    if (_betting.settledAmount == _betting.bAmount) {
      _betting.status = BetStatus.Settled;
    } else {
      _betting.status = BetStatus.Deal;
    }

    uint32 betIdx = uint32(settles.push(Settle(bettingIdx, msg.sender, msg.value)) - 1);
    userSettled[msg.sender].push(betIdx);
    betSettled[bettingIdx].push(betIdx);
    balances[msg.sender] += msg.value;
    emit LogAcceptBet(_betting.matchId, bettingIdx, betIdx);
    return true;
  }

  function isPlayerNotExist(address player) internal view returns (bool) {
    return userBets[player].length <= 0 && userSettled[player].length <= 0;
  }

  function getBettingInfo(uint32 bettingIdx) public view returns (address,
    uint8, int, uint256[2] amounts, BetStatus, BookmakerResult,
    address[], uint256[]) {
    Betting memory _betting = bets[bettingIdx];

    address[] memory punters = new address[](betSettled[bettingIdx].length);
    uint256[] memory punterAmounts = new uint256[](punters.length);
    amounts[0] = _betting.bAmount;
    amounts[1] = _betting.settledAmount;
    for (uint32 i = 0; i < punters.length; i++) {
      punters[i] = settles[betSettled[bettingIdx][i]].punter;
      punterAmounts[i] = settles[betSettled[bettingIdx][i]].amount;
    }

    return (_betting.bMaker, _betting.bmTeam, _betting.odds, amounts, _betting.status, _betting.bResult, punters, punterAmounts);
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

  function findMatch(bytes32 matchId) public view returns (
    string homeTeam,
    string awayTeam,
    uint8 homeScore,
    uint8 awayScore,
    uint48 time,
    uint8 status,
    bool isApproved) {

    string memory reference ="";
    uint8[] memory goals;
    (matchId, homeTeam, awayTeam, reference, time,goals) = footballScore.getMatchDetails(matchId);

    homeScore = goals[0];
    awayScore = goals[1];
    status = goals[4];
    isApproved = matchPaid[matchId];
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

  function getSettleInfo(uint32 bettingIdx, uint32 settleIdx) public view returns (bytes32, uint32, uint32, address, uint256, uint8, int, BetStatus, BookmakerResult) {
    Betting memory _betting = bets[bettingIdx];
    return (_betting.matchId, bettingIdx, settleIdx,  settles[settleIdx].punter, settles[settleIdx].amount, 1 - _betting.bmTeam, _betting.odds * -1, _betting.status, _betting.bResult);
  }

  function countPlayers() public view returns (uint) {
    return players.length;
  }

  function getPlayerBalance(address player) public view returns (uint256) {
    return balances[player];
  }

  mapping(bytes32=> bool) matchPaid;
  function forcePayout(bytes32 matchId) public isAdmin returns (bool) {


   // require(!_match.isApproved);
    //_match.isApproved = true;
    require(!matchPaid[matchId], "Match already paid");
    uint8 homeGoals;
    uint8 awayGoals;
    uint8 status;
    (matchId, homeGoals, awayGoals, status)= footballScore.getFinalScore(matchId);
    require(status == uint8(MatchStatus.Finished));
    uint32[] memory betIdxes = matchBets[matchId];
    for (uint256 i = 0; i < betIdxes.length; i++) {
      doRefundOrTransfer(matchId, homeGoals, awayGoals, betIdxes[i]);
    }

    matchPaid[matchId] = true;
    emit LogApproveScore(matchId);
    return true;
  }

  function doRefundOrTransfer(bytes32 matchId, uint8 homeGoals, uint8 awayGoals, uint32 bettingId ) internal returns(bool) {
    Betting storage _betting = bets[bettingId];
    require(matchId == _betting.matchId);
    if (_betting.status == BetStatus.Deal || _betting.status == BetStatus.Settled) {
      doTransfer(homeGoals, awayGoals , _betting, bettingId);
      _betting.status = BetStatus.Done;
    }
    else if (_betting.status == BetStatus.Open) {
      refund(_betting);
      _betting.status = BetStatus.Refunded;
    }
  }

  function getMatchIds() public view returns(bytes32[]) {
    return matchIds;
  }
  function cancelOffer(uint256 bettingId) external returns (bool){
    Betting storage _betting = bets[bettingId];
    require(_betting.bMaker == msg.sender);
    require(_betting.status == BetStatus.Open);
    refund(_betting);
    _betting.status = BetStatus.Canceled;
    emit CancelBet(bettingId);
    return true;
  }

  function refund(Betting _betting) internal returns (bool) {
    transferFund(_betting.bMaker, _betting.bAmount);
    _betting.status = BetStatus.Refunded;
    balances[_betting.bMaker] = balances[_betting.bMaker] - _betting.bAmount;
    return true;
  }


  function doTransfer(uint8 homeGoals, uint8 awayGoals, Betting storage  _betting, uint32 betIndex) internal returns (bool) {

    Funding[] memory fundings = getFunding(homeGoals,awayGoals, _betting, betIndex);
    for (uint i = 0; i < fundings.length; i++) {
      Funding memory funding = fundings[i];
      if (funding.amount > 0 && funding.receiver != 0x0) {
        transferFund(funding.receiver, funding.amount);
      }
    }

    balances[owner] += (_betting.settledAmount * 5 / 100);
    _betting.status = BetStatus.Done;
  }

  function transferFund(address receiver, uint256 amount) private returns (bool) {
    if (receiver != 0x0) {
      receiver.transfer(amount);
    }
  }

  function createFundingForPunter(address receiver, uint256 settledAmount, BookmakerResult bResult) internal returns (Funding) {
      return createFunding(receiver, settledAmount, settledAmount, bResult);
  }
  function createFunding(address receiver, uint256 betAmount, uint256 settledAmount, BookmakerResult bResult) internal returns (Funding funding) {
    balances[receiver] -= betAmount;
    if(bResult == BookmakerResult.Win) {
      funding = Funding(receiver ,betAmount,  betAmount+ (settledAmount * 95 / 100));
      report[receiver]+= funding.amount - betAmount;
    } else if(bResult == BookmakerResult.WinAHalf) {
      funding = Funding(receiver,betAmount, betAmount + ( settledAmount * 95 / 100 / 2));
      report[receiver]+= funding.amount - betAmount;
    } else if(bResult == BookmakerResult.Draw) {
      funding = Funding(receiver, betAmount, betAmount - ( settledAmount * 5 / 100 / 2));
    } else if(bResult == BookmakerResult.LoseAHalf) {
      funding = Funding(receiver, betAmount, betAmount - (  settledAmount * 105 / 100 / 2));
    } else {
      funding = Funding(0x0, 0, 0);
    }
  }

  function getFunding(uint8 homeScore, uint8 awayScore, Betting storage  _betting, uint32 betIdx) internal returns (Funding[]) {

    // calculate for bookmaker
    if (_betting.bmTeam == uint8(Team.Home)) {
      _betting.bResult = getBookmakerResult(int(homeScore) - int(awayScore), _betting.odds);
    } else {
      _betting.bResult = getBookmakerResult(int(awayScore) - int(homeScore), _betting.odds);
    }
    Funding[] memory fundings = new Funding[](betSettled[betIdx].length + 1);
    fundings[0] = createFunding(_betting.bMaker,_betting.bAmount,  _betting.settledAmount, _betting.bResult );

    BookmakerResult pResult = BookmakerResult(5-int(_betting.bResult) + 1);
    for (uint i = 0; i < betSettled[betIdx].length; i++) {
      fundings[i + 1] = createFundingForPunter(settles[betSettled[betIdx][i]].punter,settles[betSettled[betIdx][i]].amount,pResult);
    }

    return fundings;
  }

  function getBookmakerResult(int goaldifference, int odds) private returns (BookmakerResult) {
    int dif = odds + goaldifference * 100;
    if (dif == 25) return BookmakerResult.WinAHalf;
    if (dif == - 25) return BookmakerResult.LoseAHalf;
    if (dif == 0) return BookmakerResult.Draw;
    if (dif > 25) return BookmakerResult.Win;
    return BookmakerResult.Lose;
  }

  function claimStake(bytes32 matchId, uint32[] bettingIdxes) public returns (bool) {
    uint8 homeGoals;
    uint8 awayGoals;
    uint8 status;
    (matchId, homeGoals, awayGoals, status)= footballScore.getFinalScore(matchId);
    require(status == uint8(MatchStatus.Finished));
    for (uint i = 0; i < bettingIdxes.length; i++) {
      doRefundOrTransfer(matchId, homeGoals,awayGoals, bettingIdxes[i]);
    }
    emit LogClaimStake(matchId);
    return true;
  }

  function getVolume(uint48 time) public  view returns (uint256) {
    uint256 vol;
    for(uint i = 0; i < bets.length; i++) {
      if(bets[i].time >= time) {
        vol+= bets[i].settledAmount * 2;
      }
    }
    return vol;
  }

  function countUserBet(address user) public view returns (uint256 totalSettled, uint256 win) {

    uint32[] memory betIdxes = getUserBets(user);
    uint32[] memory settledIdxes = userSettled[user];
    for(uint i =0;i<betIdxes.length;i++) {
      totalSettled+=bets[betIdxes[i]].settledAmount;
    }

    for(i = 0; i<settledIdxes.length; i++) {
      totalSettled+=settles[settledIdxes[i]].amount;
    }
    win = report[user];
  }

  function destroyContract() public onlyOwner returns (bool) {
    for (uint i = 0; i < players.length; i++) {
      if (balances[players[i]] > 0) {
        players[i].transfer(balances[players[i]]);
      }
    }
    selfdestruct(owner);
    return true;
  }

  function withdrawFee() public onlyOwner returns (bool){
    owner.transfer(balances[owner]);
    return true;
  }

}
