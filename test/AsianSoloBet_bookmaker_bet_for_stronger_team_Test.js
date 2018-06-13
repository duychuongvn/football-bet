
const AsianSoloBet = artifacts.require("AsianSoloBet");
const betAmount = 1000000000000000000;// 2 Ether
const  amountAfterFee = betAmount * 95 / 100;
const  gasUsedToSendTx = 21000;
const totalAmountReceivedAfterWin = betAmount + amountAfterFee - gasUsedToSendTx;// 5% fee and 21000 gas

const halfAmountPaidAfterFee = betAmount * 95 / 100/2;
const totalAmountReceivedWhenLooseAHalf = halfAmountPaidAfterFee - gasUsedToSendTx;
const totalAmountRecievedWhenWinAHalf = betAmount + totalAmountReceivedWhenLooseAHalf;
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

  describe('When admin approve score and pair is Russia x/x USA (Russia is stronger than USA and bookmaker choose Russia, Punter choose USA)', async () => {

    contract("AsianSoloBet", accounts => {
      const [firstAccount] = accounts;
      const contractOwner = accounts[0]
      const feeOwner = contractOwner;
      const bookmaker = accounts[1]
      const punter = accounts[2];
      const matchTime = 1548728850000;
      const homeTeam = "RusSia";
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
      it('should refund to bookmaker and punter when pair is Russia 0:0 Usa (0) and bookmaker choose Russia and then match is draw', async () => {
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

        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + amountAfterFee - gasUsedToSendTx), "Bookmaker receive refund when the match is draw")
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore), toGwei(amountOfPunterAfterDeal + amountAfterFee - gasUsedToSendTx), "Punter receive refund when the match is draw")

      });

      it('should transfer stake to bookmaker when pair is Russia 0:0 USA (0) and bookmaker choose Russia and the match result is Russia 1:0 USA (Russia win 1 goals)', async () => {
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

        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin), "Bookmaker win")
        assert.equal(toGwei(amountOfPunterAfterDeal), toGwei(amountOfPunterAfterApproveMatchScore), "Punter lost")
      });

      it('should transfer stake to punter when pair is Russia 0:0 USA (0) and bookmaker choose Russia and result is Russia 0:1 USA (Russia loose)', async () => {

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

      it('should transfer a half stake to punter when  pair is Rusia 0:1/4 USA (0.25) and bookmaker choose Rusia and the match draw', async () => {

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

        //cannot verify exact amount deu to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + halfAmountPaidAfterFee), "Bookmaker loose half amount when the match is draw")
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + betAmount + halfAmountPaidAfterFee), "Punter win half amount when the match is draw")

      });

      it('should transfer stake to punter when  pair is Rusia 0:1/4 USA (0.25) and bookmaker choose Russia and the Russia looses ', async () => {

        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x127, homeTeam, awayTeam, 0, matchTime, -25, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x127, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x127, 0, 1); // Russia 0:1 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x127);

        await sleep();
        await contract.updateScore(0x127, 0, 1); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer ), "Bookmaker loose all when russia lose 0-1");
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win all when Rusa lose 0-1")

      });


      it('should transfer stake to bookmaker when  pair is Rusia 0:1/4 USA (0.25) and bookmaker choose Russia and the Russia win 1-0 ', async () => {

        contract.offerNewMatch(0x128, homeTeam, awayTeam, 0, matchTime, -25, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x128, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x128, 1, 0); // Russia 0:0 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x128);

        await sleep();
        await contract.updateScore(0x128, 1, 0); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin), "Bookmaker win all when Rusia win")
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal), "Punter lose all amount when Russia win")

      });

      it('should transfer stake to bookmaker when  pair is [Rusia 0:1/2 USA] (0.5) and bookmaker choose Russia and the Russia win 1-0 ', async () => {

        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x129, homeTeam, awayTeam, 0, matchTime, -50, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x129, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x129, 1, 0); // Russia 1:0 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x129);

        await sleep();
        await contract.updateScore(0x129, 1, 0); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin), "Bookmaker win all Rusia win")
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal), "Punter lose all amount when rusia win")

      });

      it('should transfer stake to punter when  pair is [Rusia 0:1/2 USA] (0.5) and bookmaker choose Russia and the Russia lose 0-1 ', async () => {

        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x130, homeTeam, awayTeam, 0, matchTime, -50, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x130, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x130, 0, 1); // Russia 0:1 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x130);

        await sleep();
        await contract.updateScore(0x130, 0, 1); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer), "Bookmaker win all when Russia win")
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter lose all when Russia win")

      });


      it('should transfer stake to punter when  pair is [Rusia 0:1/2 USA] (0.5) and bookmaker choose Russia  and the match result is Russia 2-2 USA (draw) ', async () => {

        contract.offerNewMatch(0x131, homeTeam, awayTeam, 0, matchTime, -50, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x131, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x131, 2, 2); // Russia 2:2 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x131);

        await sleep();
        await contract.updateScore(0x131, 2, 2); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer), "Bookmaker loose all when the match is draw")
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win all amount when the match is draw")

      });


      it('should transfer stake to bookmaker when  pair is [Rusia 0:3/4 USA] (0.75) and bookmaker choose Russia and the Russia win 3-1 ', async () => {

        contract.offerNewMatch(0x132, homeTeam, awayTeam, 0, matchTime, -75, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x132, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x132, 3, 1); // Russia 3:1 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x132);

        await sleep();
        await contract.updateScore(0x132, 3, 1); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker win all when Russia win 3-1")
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal ), "Punter lose all amount when Russia win")

      });


      it('should transfer a half stake to bookmaker when  pair is [Rusia 0:3/4 USA] (0.75) and bookmaker choose Rusia (-75) and the Russia win 2-1 ', async () => {
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x133, homeTeam, awayTeam, 0, matchTime, -75, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x133, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x133, 2, 1); // Russia 2:1 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x133);

        await sleep();
        await contract.updateScore(0x133, 2, 1); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountRecievedWhenWinAHalf) , "Bookmaker win 1/2 when Russia win 2-1")
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedWhenLooseAHalf), "Punter lose 1/2 amount when Russia win 2-1")

      });

      it('should transfer all stake to punter when  pair is [Rusia 0:3/4 USA] (0.75) and bookmaker choose Russia and the match is draw 2-2 ', async () => {
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x134, homeTeam, awayTeam, 0, matchTime, -75, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x134, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x134, 2, 2); // Russia 2:2 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x134);

        await sleep();
        await contract.updateScore(0x134, 2, 2); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer) , "Bookmaker loose when choose Rusia and the match is draw" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win when chose USA and the match is draw");

      });


      it('should transfer all stake to punter when  pair is [Rusia 0:3/4 USA] (0.75) and bookmaker choose Russia  and the match is Russia 2-3 USA (Russia loose)', async () => {
        contract.offerNewMatch(0x135, homeTeam, awayTeam, 0, matchTime, -75, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x135, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x135, 2, 3); // Russia 2:3 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x135);

        await sleep();
        await contract.updateScore(0x135, 2, 3); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer) , "Bookmaker loose when choose Russia and result is Russia 2-3 USA (Russia loose)" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win when choose Russia and result is Russia 2-3 USA (Russia loose)");

      });


      it('should transfer all stake to bookmaker when  pair is [Rusia 0:1 USA] (1.00) and bookmaker choose Russia and the match result Russia 2-0 USA (Russia win 2 goals)', async () => {
        contract.offerNewMatch(0x136, homeTeam, awayTeam, 0, matchTime, -100, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x136, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x136, 2, 0); // Russia 2:0 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x136);

        await sleep();
        await contract.updateScore(0x136, 2, 0); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker win all amount when result is Rusia 2-0 USA" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal), "Punter loose all amount when result is  Rusia 2-0 USA");

      });


      it('should refund to bookmaker and punter when  pair is [Russia 0:1 USA] (1.00) and bookmaker choose Russia and the match is Russia 2-1 USA (Russia win 1 goals)', async () => {
        contract.offerNewMatch(0x137, homeTeam, awayTeam, 0, matchTime, -100, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x137, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x137, 2, 1); // Russia 2:1 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x137);

        await sleep();
        await contract.updateScore(0x137, 2, 1); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + amountAfterFee - gasUsedToSendTx) , "Bookmaker receive refund when the match result is Rusia 2-1 USA" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + amountAfterFee - gasUsedToSendTx), "Bookmaker receive refund when the match result is Rusia 2-1 USA");

      });

      it('should transfer to punter when  pair is [Rusia 0:1 USA] (1.00) and bookmaker choose Rusia and the match is draw ', async () => {
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -100, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 2, 2); // Russia 2:2 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 2, 2); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer) , "Bookmaker loose all when the match is draw (2-2)" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win all money when the mach is draw (2-2)");

      });

      it('should transfer to punter when  pair is [Rusia 0:1 USA] (1.00) and bookmaker choose Russia and the match result is Russia 1-2 USA (Russia loose) ', async () => {
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -100, {from: bookmaker, value: betAmount});
        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 1, 2); // Russia 1:2 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 1, 2); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer) , "Bookmaker loose all when the match is Russia 2-1 USA" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win all when the mach is Russia 2-1 USA");

      });

      it('should transfer to bookmaker when  pair is [Rusia 0:1 1/4 USA] (1.25) and bookmaker choose Rusia and the match Russia 3-1 USA', async () => {
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -125, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 3, 1); // Russia 3:1USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 3, 1); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker win all when the match is Russia 3-1 USA" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal), "Punter loose all money when the mach is Russia 3-1 USA");

      });


      it('should transfer a half to bookmaker and punter when  pair is [Rusia 0:1 1/4 USA] (1.25) and bookmaker choose Russia and the match Russia 3-2 USA (Russia win 1 goal)', async () => {
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -125, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 3, 2); // Russia 3:1USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 3, 2); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedWhenLooseAHalf) , "Bookmaker loose a half  when the match is Russia 3-2 USA" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountRecievedWhenWinAHalf), "Punter win a half when the mach is Russia 3-2 USA");

      });


      it('should transfer all to punter when  pair is [Rusia 0:1 1/4 USA] (1.25) and bookmaker choose Rusia and the match Russia 3-3 USA (draw)', async () => {
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -125, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 3, 3); // Russia 3:1USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 3, 3); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer) , "Bookmaker loose all  when the match is Russia 3-3 USA (draw)" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win all when the mach is Russia 3-3 USA (draw)");

      });

      it('should transfer all to punter when  pair is [Rusia 0:1 1/4 USA] (1.25) and bookmaker choose Rusia and the match Russia 3-4 USA (Russia loose)', async () => {
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -125, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 3, 4); // Russia 3:1USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 3, 4); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer) , "Bookmaker loose all  when the match is Russia 3-4 USA (Russia loose)" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win all when the mach is Russia 3-4 USA (Russia loose)");

      });


      it('should transfer all to bookmaker when  pair is [Rusia 0:1 1/2 USA] (1.50) and bookmaker choose Rusia and the match Russia 3-1  USA (Russia win 2 goals)', async () => {
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -150, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 3, 1); // Russia 3:1USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 3, 1); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker win all  when the match is Russia 3-1 USA (Russia win)" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal), "Punter loose all when the mach is Russia 3-1 USA (Russia win)");

      });

      it('should transfer all to punter when  pair is [Rusia 0:1 1/2 USA] (1.50) and bookmaker choose Rusia and the match Russia 3-2  USA (Russia win 1 goals)', async () => {
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -150, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 3, 2); // Russia 3:2 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 3, 2); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer) , "Bookmaker loose all  when the match is Russia 3-2 USA (Russia win 1 goal)" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win all when the mach is Russia 3-1 USA (Russia win 1 goal)");

      });

      it('should transfer all to punter when  pair is [Rusia 0:1 1/2 USA] (1.50) and bookmaker choose Rusia and the match Russia 3-3  USA (Russia draw)', async () => {
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -150, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 3, 3); // Russia 3:2 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 3, 3); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer) , "Bookmaker loose all  when the match is Russia 3-3 USA (Russia draw)" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win all when the mach is Russia 3-3 USA (Russia draw)");

      });


      it('should transfer all to punter when  pair is [Rusia 0:1 1/2 USA] (1.50) and bookmaker choose Rusia and the match Russia 1-2  USA (Russia loose)', async () => {
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -150, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 1, 2); // Russia 1:2 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 1, 2); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer) , "Bookmaker loose all  when the match is Russia 1-2 USA (Russia loose)" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win all when the mach is Russia 1-2 USA (Russia loose)");

      });


      it('should transfer all to bookmaker when  pair is [Rusia 0:1 3/4 USA] (1.75) and bookmaker choose Rusia and the match Russia 4-1  USA (Russia win >= 3 goals)', async () => {
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -175, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 4, 1); // Russia 4:1 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 4, 1); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker win all  when the match is Russia 4-1 USA (Russia win >= 3 goals)" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal ), "Punter loose all when the match is Russia 4-1 USA (Russia win >= 3 goals)");

      });


      it('should transfer a half to bookmaker and punter when  pair is [Rusia 0:1 3/4 USA] (1.75) and bookmaker choose Rusia and the match Russia 4-2  USA (Russia win = 2 goals)', async () => {
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -175, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 4, 2); // Russia 4:2 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 4, 2); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountRecievedWhenWinAHalf) , "Bookmaker win a half  when the match is Russia 4-2 USA (Russia win 2 goals)" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedWhenLooseAHalf), "Punter loose a half all when the match is Russia 4-1 USA (Russia win 2 goals)");

      });

      it('should transfer all to punter when  pair is [Rusia 0:1 3/4 USA] (1.75) and bookmaker choose Rusia and the match Russia 4-3  USA (Russia win = 1 goals)', async () => {
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -175, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 4, 3); // Russia 4:3 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 4, 3); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer) , "Bookmaker loose all when the match is Russia 4-3 USA (Russia win 1 goal)" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win all when the match is Russia 4-3 USA (Russia win 1 goal)");

      });


      it('should transfer all to punter when  pair is [Rusia 0:1 3/4 USA] (1.75) and bookmaker choose Rusia and the match Russia 4-4  USA (Russia draw)', async () => {
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -175, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 4, 4); // Russia 4:3 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 4, 4); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer) , "Bookmaker loose all when the match is Russia 4-4 USA (Russia draw)" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win all when the match is Russia 4-4 USA (Russia draw)");

      });

      it('should transfer all to punter when  pair is [Rusia 0:1 3/4 USA] (1.75) and bookmaker choose Rusia and the match Russia 4-5  USA (Russia loose)', async () => {
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -175, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 4, 5); // Russia 4:5 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 4, 5); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer) , "Bookmaker loose all when the match is Russia 4-5 USA (Russia loose)" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win all when the match is Russia 4-5 USA (Russia loose)");

      });

      it('should transfer all to bookmaker when  pair is [Rusia 0:2 USA] (2.00) and bookmaker choose Rusia and the match Russia 4-1  USA (Russia win >=3 goals)', async () => {
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -200, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 4, 1); // Russia 4:1 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 4, 1); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker win all when the match is Russia 4-1 USA (Russia win 3 goals)" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal ), "Punter loose all when the match is Russia 4-1 USA (Russia win 3 goals)");

      });

      it('should refund to bookmaker and punter when  pair is [Rusia 0:2 USA] (2.00) and bookmaker choose Rusia and the match Russia 4-2  USA (Russia win 2 goals)', async () => {
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -200, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 4, 2); // Russia 4:2 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 4, 2); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + amountAfterFee) , "Bookmaker receives refund when the match is Russia 4-2 USA (Russia win 2 goals)" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + amountAfterFee ), "Punter recieves refund when the match is Russia 4-2 USA (Russia win 2 goals)");

      });


      it('should transfer to punter when  pair is [Rusia 0:2 USA] (2.00) and bookmaker choose Rusia and the match Russia 4-3  USA (Russia win 1 goals)', async () => {
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -200, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 4, 3); // Russia 4:3 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 4, 3); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer ) , "Bookmaker loose all when the match is Russia 4-3 USA (Russia win 1 goals)" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin ), "Punter win refund when the match is Russia 4-3 USA (Russia win 1 goals)");

      });
      it('should transfer to punter when  pair is [Rusia 0:2 USA] (2.00) and bookmaker choose Rusia and the match Russia 4-4  USA (Russia draw)', async () => {
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -200, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 4, 4); // Russia 4:4 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 4, 4); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer ) , "Bookmaker loose all when the match is Russia 4-4 USA (Russia draw)" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin ), "Punter win refund when the match is Russia 4-4 USA (Russia draw)");

      });


      it('should transfer to punter when  pair is [Rusia 0:2 USA] (2.00) and bookmaker choose Rusia and the match Russia 4-5  USA (Russia loose)', async () => {
        const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
        contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, -200, {from: bookmaker, value: betAmount});

        // punter deals with bookmaker means that
        contract.deal(0x138, 0, {from: punter, value: betAmount});

        await sleep();
        await contract.updateScore(0x138, 4, 5); // Russia 4:5 USA
        const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();

        contract.approveScore(0x138);

        await sleep();
        await contract.updateScore(0x138, 4, 5); // cheat here to wait for network update new balance

        const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
        const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();

        //cannot verify exact amount due to lack of gas
        assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer ) , "Bookmaker loose all when the match is Russia 4-5 USA (Russia loose)" )
        assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin ), "Punter win refund when the match is Russia 4-5 USA (Russia loose)");

      });


    });



  });


});

