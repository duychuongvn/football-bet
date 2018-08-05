const BetherContract = artifacts.require("BetherContract");
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
  return parseInt(wei / 1000000000);
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

  contract("BetherContract", accounts => {
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
      contract = await BetherContract.new();
    })


    it('should query', async () => {

      contract.offerNewMatch(0x126, homeTeam, awayTeam, 1, matchTime, 25, {from: bookmaker, value: betAmount});
      contract.offerNewMatch(0x126, homeTeam, awayTeam, 1, matchTime, 25, {from: accounts[5], value: betAmount});
//
      var info = await contract.getBettingInfo(0);
      console.log(info);
      contract.deal(0, {from: punter, value: betAmount / 2});
      // contract.deal(0, {from: accounts[3], value: betAmount / 2});
      // //
      // var info2 = await contract.getBettingInfo(0);
      // console.log(info2[7][0].toNumber());
      //
      // var betInfo = await  contract.getBettings(0x126);
      // console.log(betInfo);
      //
      // console.log("ssss");
      // for (let i = 0; i < betInfo.length; i++) {
      //   var info3 = await contract.getBettingInfo(i);
      //   console.log(info3);
      // }
      //
      // var userBalance = await contract.getPlayerBalance(punter);
      // console.log(userBalance);
      // var userBalance = await contract.getPlayerBalance(accounts[3]);
      // console.log(userBalance);

//
    });
    it('should transfer all to bookmaker when  pair is [Russia 3/4:0 USA] (0.75) and bookmaker choose Russia and the Russia draw ', async () => {
      const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
      const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();

      console.log("new")
      console.log(amountOfBookMakerBeforeOffer);
      console.log(amountOfPunterBeforeDeal);
     await contract.offerNewMatch(0x133, homeTeam, awayTeam, 0, matchTime, 75, {from: bookmaker, value: betAmount});

      // punter deals with bookmaker means that
     await contract.deal(0, {from: punter, value: betAmount/2});
     await contract.deal(0, {from: accounts[4], value: betAmount/2});
      const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
      const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

      console.log("after deal")
      console.log(amountOfBookMakerAfterOffer);
      console.log(amountOfPunterAfterDeal);
      await sleep();
      await contract.updateScore(0x133, 2, 2); // Russia 2:2 USA
      contract.approveScore(0x133);

    //  await sleep();
      await contract.updateScore(0x133, 2, 2); // cheat here to wait for network update new balance

      const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
      const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
      console.log("after approve")
      console.log(amountOfBookMakerAfterApproveMatchScore);
      console.log(amountOfPunterAfterApproveMatchScore);

      //cannot verify exact amount due to lack of gas
      assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin), "Bookmaker win all when Russia win 2-1")
      assert.equal(toGwei(amountOfPunterAfterApproveMatchScore), toGwei(amountOfPunterAfterDeal), "Punter lose all amount when Russia win 2-1")

    });
  })
})
