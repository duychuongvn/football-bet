const AsianSoloBet = artifacts.require("AsianSoloBet");
const betAmount = 2000000000000000000;// 2 Ether
const totalAmountReceivedAfterWin = betAmount + betAmount * 95 / 100 - 21000;// 5% fee and 21000 gas
const halfAmountPaidAfterFee = betAmount * 95 / 100/2;
const totalAmountReceivedAfterDrawAndGetHaldPaid = betAmount + halfAmountPaidAfterFee - 21000;// 5% fee and 21000 gas
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

describe('When offer new match', () => {


  contract("AsianSoloBet", accounts => {
    const [firstAccount] = accounts;
    const owner = accounts[0]
    const matchTime = 1548728850000;
    const homeTeam = "Rusia";
    const awayTeam = "USA";
    let contract;


    beforeEach('setup contract for each test', async () => {
      contract = await AsianSoloBet.new();
      console.log(web3.eth.getBalance(owner));
    })


    it("findMatchAndBetting", async () => {
      contract.offerNewMatch(0x123, homeTeam, awayTeam, 0, matchTime, -25, {value: 3000000000000000000});
      // const asianSoloBet = await AsianSoloBet.new();
      const match = await  contract.findMatch(0x123);
      var expectedHomeTeam = "Rusia";
      var expectedAwayTeam = "USA";
      assert.equal(match[0], expectedHomeTeam, "newOfferMatch should update hometeam name correctly")

      assert.equal(match[1], expectedAwayTeam, "newOfferMatch should update awayteam name correctly")
      assert.equal(match[2].toNumber(), 0, "newOfferMatch should default home team score is 0")
      assert.equal(match[3].toNumber(), 0, "newOfferMatch should default away team score is 0")
      assert.equal(match[4].toNumber(), 1548728850000, "newOfferMatch should update time correctly")
      assert.equal(match[5].toNumber(), 1, "newOfferMatch should match status is Open (1)")


      const betting = await contract.getBettingInfo(0x123, 0);
      assert.equal(betting[0], owner, "newOfferMatch should store bookmarker is sender");
      assert.equal(betting[1], 0x0, "newOfferMatch should store punter is 0x0");
      assert.equal(betting[2].toNumber(), 0, "newOfferMatch should store odds is -25");
      assert.equal(betting[3].toNumber(), -25, "newOfferMatch should store pair is 0");
      assert.equal(betting[4].toNumber(), 3000000000000000000, "newOfferMatch should store stake is 3 ether");
      assert.equal(betting[5].toNumber(), 0, "newOfferMatch should store betting state is opening");


    });

    it('test deal an offer', async () => {
      contract.offerNewMatch(0x123, homeTeam, awayTeam, 0, matchTime, -25, {value: 3000000000000000000});
      contract.deal(0x123, 0, {from: '0xf17f52151ebef6c7334fad080c5704d77216b732', value: 3000000000000000000});
      const result = await contract.getBettingInfo(0x123, 0);
      assert.equal(result[0], owner, "newOfferMatch should store bookmarker is sender");
      assert.equal(result[1], '0xf17f52151ebef6c7334fad080c5704d77216b732', "newOfferMatch should store punter is 0x0");
      assert.equal(result[2].toNumber(), 0, "newOfferMatch should store odds is -25");
      assert.equal(result[3].toNumber(), -25, "newOfferMatch should store pair is 0");
      assert.equal(result[4].toNumber(), 3000000000000000000, "newOfferMatch should store stake is 3 ether");
      assert.equal(result[5].toNumber(), 1, "newOfferMatch should store betting state is Deal (1)");
    })
  });

  describe('When admin approve score', async () => {

    contract("AsianSoloBet", accounts => {
      const [firstAccount] = accounts;
      const bookmaker = accounts[1]
      const punter = accounts[2];
      const matchTime = 1548728850000;
      const homeTeam = "Rusia";
      const awayTeam = "USA";
      let contract;


      beforeEach('setup contract for each test', async () => {
        contract = await AsianSoloBet.new();
      })

      it('should show error when punter send different amount with bookmaker', async () => {
        contract.offerNewMatch(0x123, homeTeam, awayTeam, 0, matchTime, -25, {
          from: bookmaker,
          value: 2000000000000000000
        });
        contract.deal(0x123, 0, {from: punter, value: 1000000000000000000}).then(result => {
          assert(false, "Should not return success when punter send different amount with bookmaker");
        }).catch(err => {
          assert(true, "Verify punter send different amount with bookmaker");
        });

      })
      it('user choose home team and odds is 0 and the match result draw then refund to participants', async () => {
        const betAmount = 2000000000000000000;
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x123, homeTeam, awayTeam, 0, matchTime, 0, {from: bookmaker, value: betAmount});

        contract.deal(0x123, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x123, 0, 0); // Russia 0:0 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x123);

        await sleep();
        await contract.updateScore(0x123, 0, 0); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

      });

      it('should transfer stake to winner when he choose home team and odds is 0 and away team is lost', async () => {
        const betAmount = 2000000000000000000;
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x124, homeTeam, awayTeam, 0, matchTime, 0, {from: bookmaker, value: betAmount});

        contract.deal(0x124, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x124, 1, 0); // Russia 0:0 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x124);

        await sleep();
        await contract.updateScore(0x124, 1, 0); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        console.log(amountOfBookMakerBeforeOffer);
        console.log(amountOfBookMakerAfterOffer);
        console.log(amountOfPunterBeforeDeal);
        console.log(amountOfPunterAfterDeal);
        console.log(amountOfBookMakerAfterApproveMatchScore);
        console.log(amountOfPunterAfterApproveMatchScore);

        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin), "Bookmaker win")
        assert.equal(toGwei(amountOfPunterAfterDeal), toGwei(amountOfPunterAfterApproveMatchScore), "Punter lost")
      });

      it('should transfer stake to winner when he choose away team and odds is 0 and away team won', async () => {
        const betAmount = 2000000000000000000;

        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x125, homeTeam, awayTeam, 0, matchTime, 0, {from: bookmaker, value: betAmount});

        contract.deal(0x125, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x125, 0, 1); // Russia 0:0 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x125);

        await sleep();
        await contract.updateScore(0x125, 0, 1); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount deu to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterOffer), toGwei(amountOfBookMakerAfterApproveMatchScore), "Bookmaker loose")
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore), toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win")
      });

      it('should transfer stake to punter when  pair is Rusia 0:1/4 USA and bookmaker choose Rusia (-25) and the match draw', async () => {
        const betAmount = 2000000000000000000;

        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x126, homeTeam, awayTeam, 0, matchTime, -25, {from: bookmaker, value: betAmount});

        contract.deal(0x126, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x126, 0, 0); // Russia 0:0 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x126);

        await sleep();
        await contract.updateScore(0x126, 0, 0); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        console.log(amountOfBookMakerBeforeOffer);
        console.log(amountOfBookMakerAfterOffer);
        console.log(amountOfPunterBeforeDeal);
        console.log(amountOfPunterAfterDeal);
        console.log(amountOfBookMakerAfterApproveMatchScore);
        console.log(amountOfPunterAfterApproveMatchScore);
        //cannot verify exact amount deu to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + halfAmountPaidAfterFee), "Bookmaker loose half amount when the match is draw")
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + betAmount + halfAmountPaidAfterFee), "Punter win half amount when the match is draw")

      });

      it('should transfer stake to punter when  pair is Rusia 0:1/4 USA and bookmaker choose Rusia (-25) and the Rusia loses ', async () => {
        const betAmount = 2000000000000000000;

        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x127, homeTeam, awayTeam, 0, matchTime, -25, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x127, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x127, 0, 1); // Russia 0:0 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x127);

        await sleep();
        await contract.updateScore(0x127, 0, 1); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        console.log(amountOfBookMakerBeforeOffer);
        console.log(amountOfBookMakerAfterOffer);
        console.log(amountOfPunterBeforeDeal);
        console.log(amountOfPunterAfterDeal);
        console.log(amountOfBookMakerAfterApproveMatchScore);
        console.log(amountOfPunterAfterApproveMatchScore);
        //cannot verify exact amount deu to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + halfAmountPaidAfterFee), "Bookmaker loose half amount when the match is draw")
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + betAmount + halfAmountPaidAfterFee), "Punter win half amount when the match is draw")

      });


    });


  });


});

