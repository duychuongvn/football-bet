const FootballScoreContract = artifacts.require("FootballScoreContract");
const betAmount = 1000000000000000000;// 1 Ether
const amountAfterFee = betAmount * 95 / 100;
const gasUsedToSendTx = 21000;
const totalAmountReceivedAfterWin = betAmount + amountAfterFee - gasUsedToSendTx;// 5% fee and 21000 gas
const refundAfterDraw = betAmount - betAmount * 5 / 100 / 2;

const halfAmountPaidAfterFee = betAmount * 95 / 100 / 2;
const totalAmountReceivedWhenloseAHalf = halfAmountPaidAfterFee - gasUsedToSendTx;
const totalAmountRecievedWhenWinAHalf = betAmount + totalAmountReceivedWhenloseAHalf;
var offerNewMatch = (owner) => {

}

sleep = () => {
  setTimeout(function () {

  }, 5000);
}

toGwei = (wei) => {
  return parseInt(wei / 1000000000000);
}
var assertThrow = async (fn, args) => {
  try {
    await fn.apply(null, args)
    assert(false, 'the contract should throw here')
  } catch (error) {
    assert(
      /invalid opcode/.test(error) || /revert/.test(error),
      `the error message should be invalid opcode or revert, the error was ${error}`
    )
  }
}


describe('Test', async () => {

  contract("FootballMatch", accounts => {
    const [firstAccount] = accounts;
    const contractOwner = accounts[0]
    const feeOwner = contractOwner;
    const bookmaker = accounts[1]
    const punter = accounts[2];
    const matchTime = 1548728850;
    const homeTeam = "RusSia";
    const awayTeam = "USA";
    let contract;


    beforeEach('setup contract for each test', async () => {
      contract = await FootballScoreContract.new();
      contract.UploadLeagueEvent().watch((err, res)=>{
        console.log("leagueId: "+res.args.leagueId)

      })})



    it('should query', async () => {

      // contract.offerNewMatch(0x126, homeTeam, awayTeam, 1, matchTime, 25, {from: bookmaker, value: betAmount});
      // contract.offerNewMatch(0x126, homeTeam, awayTeam, 1, matchTime, 25, {from: accounts[5], value: betAmount});
      // var info = await contract.getBettingInfo(0);
      // console.log(info);
      // contract.bet(0, {from: punter, value: betAmount / 2});

      let homeName = "await contract.getPendingMatchIds.call";
      let awayName = "away contract.getPendingMatchIds.call";
      let time = [];
      for(let i = 1; i <=36;i++) {
        homeName+=i + ";";
        awayName+=i + ";";
        time.push(i+100000000);
      }

      contract.uploadLeague('Ma;AA','Mb;BB',';',[155424467,155424467],'Premier League 18/19',2, {from: '0x627306090abab3a6e1400e9345bc60c78a8bef57'})
      contract.uploadLeague('Viet;Thai','Thai;Viet',';',[155424467,155424467],'AFF 2018',2, {from: '0x627306090abab3a6e1400e9345bc60c78a8bef57'})
      // contract.uploadLeague('Man;AA','Mb;BBma',';',[155424467,155424467],'Premier League 19/20',2, {from: '0x627306090abab3a6e1400e9345bc60c78a8bef57'})
      // contract.uploadLeague(homeName.substring(0, homeName.length - 1),
     //   awayName.substring(0, awayName.length - 1), time,'Premier League 18/19',36, {from: accounts[0]})
      contract.getLeagueMatchIds.call('Premier League 18/19').then(r=>{
        console.log('getLeagueMatchIds',r[0])
        // console.log(r[0][1].toNumber())
        // contract.getMatchDetails(r[0]).then(r2=>{
        //   console.log(r2)
        // });
      });
      // 0x6858d4efe80e3d023d968ea361e925a7a1c55ff64c915140cfec09d0e56def77
      // 0x6858d4efe80e3d023d968ea361e925a7a1c55ff64c915140cfec09d0e56def78
     contract.updateScore(['0x03238defdfa505bdc40d4d88fb509a78cd015d8ac0bf58fa8b32d8af71478293'],[0],[1],[0],[0], {from: '0x627306090abab3a6e1400e9345bc60c78a8bef57'})
      contract.getMatchDetails('0x6858d4efe80e3d023d968ea361e925a7a1c55ff64c915140cfec09d0e56def77').then(r=>{
        console.log(r[5][0].toNumber())
        console.log(r[5][1].toNumber())

      });
     //B.settleBet(0, {from: '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef', value: web3.toWei(1, 'ether')})
//B.offerNewMatch('0x03238defdfa505bdc40d4d88fb509a78cd015d8ac0bf58fa8b32d8af71478293', 0, 25, {value: web3.toWei(1, 'ether'), from: '0xf17f52151ebef6c7334fad080c5704d77216b732'})

     // B.offerNewMatch('0x03238defdfa505bdc40d4d88fb509a78cd015d8ac0bf58fa8b32d8af71478293', 0, 25, {from: 0xf17f52151ebef6c7334fad080c5704d77216b732})

     // FootballScoreContract.deployed().then(i=>{contract = i})
      // BetherContract.deployed().then(i=>{B=i})
      // contract.uploadLeague('Ma;AA','Mb;BB',';',[1554244670,1554244670],'Premier League 18/19',2, {from: '0x627306090abab3a6e1400e9345bc60c78a8bef57'})
      //
    });

  })
})
