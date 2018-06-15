//
// const AsianSoloBet = artifacts.require("AsianSoloBet");
// const betAmount = 1000000000000000000;// 2 Ether
// const  amountAfterFee = betAmount * 95 / 100;
// const  gasUsedToSendTx = 21000;
// const totalAmountReceivedAfterWin = betAmount + amountAfterFee - gasUsedToSendTx;// 5% fee and 21000 gas
//
// const halfAmountPaidAfterFee = betAmount * 95 / 100/2;
// const totalAmountReceivedWhenloseAHalf = halfAmountPaidAfterFee - gasUsedToSendTx;
// const totalAmountRecievedWhenWinAHalf = betAmount + totalAmountReceivedWhenloseAHalf;
// var offerNewMatch = (owner) => {
//
// }
//
// sleep = () => {
//   setTimeout(function () {
//
//   }, 5000);
// }
//
// toGwei = (wei) => {
//   return parseInt(wei / 1000000000);
// }
// var assertThrow = async (fn, args) => {
//   try {
//     await fn.apply(null, args)
//     assert(false, 'the contract should throw here')
//   } catch (error) {
//     assert(
//       /invalid opcode/.test(error) || /revert/.test(error),
//       `the error message should be invalid opcode or revert, the error was ${error}`
//     )
//   }
// }
//   describe('When admin approve score and pair is Russia x/x USA (USA is stronger than Russia and bookmaker choose Russia, Punter choose USA)', async () => {
//
//     contract("AsianSoloBet", accounts => {
//       const [firstAccount] = accounts;
//       const contractOwner = accounts[0]
//       const feeOwner = contractOwner;
//       const bookmaker = accounts[1]
//       const punter = accounts[2];
//       const matchTime = 1548728850000;
//       const homeTeam = "RusSia";
//       const awayTeam = "USA";
//       let contract;
//
//
//       beforeEach('setup contract for each test', async () => {
//         contract = await AsianSoloBet.new();
//       })
//
//       it('should transfer a half stake to punter when  pair is Russia 1/4:0 USA (0.25) and bookmaker choose Russia and the match draw', async () => {
//
//         const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
//         contract.offerNewMatch(0x126, homeTeam, awayTeam, 0, matchTime, 25, {from: bookmaker, value: betAmount});
//
//         contract.deal(0x126, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x126, 0, 0); // Russia 0:0 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x126);
//
//         await sleep();
//         await contract.updateScore(0x126, 0, 0); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount deu to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountRecievedWhenWinAHalf), "Bookmaker wins half amount when the match is draw")
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedWhenloseAHalf), "Punter loses half amount when the match is draw")
//
//       });
//
//       it('should transfer stake to punter when  pair is Russia 1/4:0 USA (0.25) and bookmaker choose Russia and the Russia loses ', async () => {
//
//         const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
//         contract.offerNewMatch(0x127, homeTeam, awayTeam, 0, matchTime, 25, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x127, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x127, 0, 1); // Russia 0:1 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x127);
//
//         await sleep();
//         await contract.updateScore(0x127, 0, 1); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer ), "Bookmaker lose all when russia lose 0-1");
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win all when Rusa lose 0-1")
//
//       });
//
//
//       it('should transfer stake to bookmaker when  pair is Russia 1/4:0 USA (0.25) and bookmaker choose Russia and the Russia win 1-0 ', async () => {
//
//         contract.offerNewMatch(0x128, homeTeam, awayTeam, 0, matchTime, 25, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x128, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x128, 1, 0); // Russia 0:0 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x128);
//
//         await sleep();
//         await contract.updateScore(0x128, 1, 0); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin), "Bookmaker win all when Russia win")
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal), "Punter lose all amount when Russia win")
//
//       });
//
//       it('should transfer all to bookmaker when  pair is [Russia 1/2:0 USA] (0.5) and bookmaker choose Russia and the Russia win 1-0 ', async () => {
//
//         const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
//         contract.offerNewMatch(0x129, homeTeam, awayTeam, 0, matchTime, 50, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x129, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x129, 1, 0); // Russia 1:0 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x129);
//
//         await sleep();
//         await contract.updateScore(0x129, 1, 0); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin), "Bookmaker win all Russia win")
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal), "Punter lose all amount when Russia win")
//
//       });
//
//       it('should transfer stake to punter when  pair is [Russia 1/2:0 USA] (0.5) and bookmaker choose Russia and the Russia lose 0-1 ', async () => {
//
//         const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
//         contract.offerNewMatch(0x130, homeTeam, awayTeam, 0, matchTime, 50, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x130, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x130, 0, 1); // Russia 0:1 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x130);
//
//         await sleep();
//         await contract.updateScore(0x130, 0, 1); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer), "Bookmaker lose all when Russia win")
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win all when Russia win")
//
//       });
//
//
//       it('should transfer stake to bookmaker when  pair is [Russia 1/2:0 USA] (0.5) and bookmaker choose Russia  and the match result is Russia 2-2 USA (draw) ', async () => {
//
//         contract.offerNewMatch(0x131, homeTeam, awayTeam, 0, matchTime, 50, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x131, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x131, 2, 2); // Russia 2:2 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x131);
//
//         await sleep();
//         await contract.updateScore(0x131, 2, 2); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin), "Bookmaker win all when the match is draw")
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal), "Punter lose all amount when the match is draw")
//
//       });
//
//
//       it('should transfer stake to bookmaker when  pair is [Russia 3/4:0 USA] (0.75) and bookmaker choose Russia and the Russia win 1-0 ', async () => {
//
//         contract.offerNewMatch(0x132, homeTeam, awayTeam, 0, matchTime, 75, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x132, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x132, 1, 0); // Russia 1:0 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x132);
//
//         await sleep();
//         await contract.updateScore(0x132, 1, 0); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker win all when Russia win 1-0")
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal ), "Punter lose all amount when Russia win")
//
//       });
//
//
//       it('should transfer all to bookmaker when  pair is [Russia 3/4:0 USA] (0.75) and bookmaker choose Russia and the Russia draw ', async () => {
//         const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
//         contract.offerNewMatch(0x133, homeTeam, awayTeam, 0, matchTime, 75, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x133, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x133, 2, 2); // Russia 2:2 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x133);
//
//         await sleep();
//         await contract.updateScore(0x133, 2, 2); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker win all when Russia win 2-1")
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal ), "Punter lose all amount when Russia win 2-1")
//
//       });
//
//       it('should transfer a half to bookmaker and punter when  pair is [Russia 3/4:0 USA] (0.75) and bookmaker choose Russia and the match is Russia 1-2 USA ', async () => {
//         const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
//         contract.offerNewMatch(0x134, homeTeam, awayTeam, 0, matchTime, 75, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x134, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x134, 1, 2); // Russia 1:2 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x134);
//
//         await sleep();
//         await contract.updateScore(0x134, 1, 2); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedWhenloseAHalf) , "Bookmaker lose a half when choose Russia and the match is Russia 1-2 USA" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountRecievedWhenWinAHalf), "Punter win when chose USA and the match is Russia 1-2 USA");
//
//       });
//
//
//       it('should transfer all to punter when  pair is [Russia 3/4:0 USA] (0.75) and bookmaker choose Russia  and the match is Russia 1-3 USA (Russia lose)', async () => {
//         contract.offerNewMatch(0x135, homeTeam, awayTeam, 0, matchTime, 75, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x135, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x135, 1, 3); // Russia 1:3 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x135);
//
//         await sleep();
//         await contract.updateScore(0x135, 1, 3); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer) , "Bookmaker lose when choose Russia and result is Russia 2-3 USA (Russia lose)" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win when choose Russia and result is Russia 2-3 USA (Russia lose)");
//
//       });
//
//
//       it('should transfer all stake to bookmaker when  pair is [Russia 1:0 USA] (1.00) and bookmaker choose Russia and the match result Russia 1-0 USA (Russia win 1 goals)', async () => {
//         contract.offerNewMatch(0x136, homeTeam, awayTeam, 0, matchTime, 100, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x136, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x136, 1, 0); // Russia 1:0 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x136);
//
//         await sleep();
//         await contract.updateScore(0x136, 1, 0); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker win all amount when result is Russia 1-0 USA" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal), "Punter lose all amount when result is  Russia 1-0 USA");
//
//       });
//
//       it('should transfer to punter when  pair is [Russia 1:0 USA] (1.00) and bookmaker choose Russia and the match is draw ', async () => {
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 100, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 2, 2); // Russia 2:2 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 2, 2); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker wins all when the match is draw (2-2)" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal ), "Punter loses all money when the mach is draw (2-2)");
//
//       });
//
//
//       it('should refund to bookmaker and punter when  pair is [Russia 1:0 USA] (1.00) and bookmaker choose Russia and the match is Russia 1-2 USA (USA win 1 goals)', async () => {
//         contract.offerNewMatch(0x137, homeTeam, awayTeam, 0, matchTime, 100, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x137, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x137, 1, 2); // Russia 1:2 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x137);
//
//         await sleep();
//         await contract.updateScore(0x137, 1, 2); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + amountAfterFee - gasUsedToSendTx) , "Bookmaker receive refund when the match result is Russia 2-1 USA" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + amountAfterFee - gasUsedToSendTx), "Bookmaker receive refund when the match result is Russia 2-1 USA");
//
//       });
//
//
//       it('should transfer to punter when  pair is [Russia 1:0 USA] (1.00) and bookmaker choose Russia and the match result is Russia 1-3 USA (USA win 2 goals) ', async () => {
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 100, {from: bookmaker, value: betAmount});
//         // punter deals with bookmaker means that
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 3); // Russia 1:3 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 3); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer) , "Bookmaker lose all when the match is Russia 2-1 USA" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win all when the mach is Russia 2-1 USA");
//
//       });
//
//       it('should transfer to bookmaker when  pair is [Russia 1 1/4:0 USA] (1.25) and bookmaker choose Russia and the match Russia 3-2 USA', async () => {
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 125, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 3, 2); // Russia 3:2USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 3, 2); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker win all when the match is Russia 3-2 USA" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal), "Punter lose all money when the mach is Russia 3-2 USA");
//
//       });
//
//
//       it('should transfer all to bookmaker when  pair is [Russia 1 1/4:0 USA] (1.25) and bookmaker choose Russia and the match Russia 3-3 USA (draw)', async () => {
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 125, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 3, 3); // Russia 3:3 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 3, 3); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker wins all  when the match is Russia 3-3 USA (draw)" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal ), "Punter loses all when the mach is Russia 3-3 USA (draw)");
//
//       });
//
//       it('should transfer a half to bookmaker and punter when  pair is [Russia 1 1/4:0 USA] (1.25) and bookmaker choose Russia and the match Russia 2-3 USA (USA win 1 goal)', async () => {
//         const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 125, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 2, 3); // Russia 2:3 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 2, 3); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountRecievedWhenWinAHalf) , "Bookmaker wins a half  when the match is Russia 2-3 USA" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedWhenloseAHalf), "Punter win a half when the mach is Russia 2-3 USA");
//
//       });
//
//
//       it('should transfer all to punter when  pair is [Russia 1 1/4:0 USA] (1.25) and bookmaker choose Russia and the match Russia 1-3 USA (USA win 2 goals)', async () => {
//         const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 125, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 3); // Russia 1:3 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 3); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer) , "Bookmaker lose all  when the match is Russia 3-4 USA (Russia lose)" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win all when the mach is Russia 3-4 USA (Russia lose)");
//
//       });
//
//
//       it('should transfer all to bookmaker when  pair is [Russia 1 1/2 : 0 USA] (1.50) and bookmaker choose Russia and the match Russia 2-1  USA (Russia wins)', async () => {
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 150, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 2,1); // Russia 2:1 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 2, 1); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker win all  when the match is Russia 2-1 USA (Russia win)" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal), "Punter lose all when the mach is Russia 2-1 USA (Russia win)");
//
//       });
//
//
//       it('should transfer all to bookmaker when  pair is [Russia 1 1/2 :0 USA] (1.50) and bookmaker choose Russia and the match Russia 3-3  USA (Russia draw)', async () => {
//         const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 150, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 3, 3); // Russia 3:3 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 3, 3); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker wins all  when the match is Russia 3-3 USA (Russia draw)" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal), "Punter loses all when the mach is Russia 3-3 USA (Russia draw)");
//
//       });
//
//       it('should transfer all to bookmaker when  pair is [Russia 1 1/2 : 0 USA] (1.50) and bookmaker choose Russia and the match Russia 2-3  USA (USA win 1 goals)', async () => {
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 150, {from: bookmaker, value: betAmount});
//
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 2, 3); // Russia 2:3 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 2, 3); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker wins all  when the match is Russia 2-3 USA (USA win 1 goal)" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal  ), "Punter loses all when the mach is Russia 2-3 USA (USA win 1 goal)");
//
//       });
//
//
//       it('should transfer all to punter when  pair is [Russia 1 1/2 : 0 USA] (1.50) and bookmaker choose Russia and the match Russia 1-3  USA (USA wins 2 goals)', async () => {
//         const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 150, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 3); // Russia 1:3 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 3); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer) , "Bookmaker lose all  when the match is Russia 1-2 USA (Russia lose)" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win all when the mach is Russia 1-2 USA (Russia lose)");
//
//       });
//
//
//       it('should transfer all to bookmaker when  pair is [Russia 1 3/4 : 0 USA] (1.75) and bookmaker choose Russia and the match Russia 1-0  USA (Russia win)', async () => {
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 175, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 0); // Russia 1:0 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 0); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker win all  when the match is Russia 4-1 USA (Russia win >= 3 goals)" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal ), "Punter lose all when the match is Russia 4-1 USA (Russia win >= 3 goals)");
//
//       });
//
//       it('should transfer all to bookmaker when  pair is [Russia 1 3/4 : 0 USA] (1.75) and bookmaker choose Russia and the match Russia 1-1  USA (Russia draw)', async () => {
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 175, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 1); // Russia 1:0 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 1); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker win all  when the match is Russia 1-1 USA" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal ), "Punter lose all when the match is Russia 1-1 USA");
//
//       });
//       it('should transfer all to bookmaker when  pair is [Russia 1 3/4 : 0 USA] (1.75) and bookmaker choose Russia and the match Russia 1-2  USA (Russia win)', async () => {
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 175, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 2); // Russia 1:2 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 2); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker win all  when the match is Russia 4-1 USA (Russia win >= 3 goals)" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal ), "Punter lose all when the match is Russia 4-1 USA (Russia win >= 3 goals)");
//
//       });
//
//
//       it('should transfer a half to bookmaker and punter when  pair is [Russia 1 3/4 : 0 USA] (1.75) and bookmaker choose Russia and the match Russia 2-4  USA (USA win = 2 goals)', async () => {
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 175, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 2, 4); // Russia 2:4 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 2, 4); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedWhenloseAHalf) , "Bookmaker loses a half  when the match is Russia 2-4 USA (USA win 2 goals)" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountRecievedWhenWinAHalf), "Punter win a half all when the match is Russia 2-4 USA (USA win 2 goals)");
//
//       });
//
//       it('should transfer all to punter when  pair is [Russia 1 3/4 : 0 USA] (1.75) and bookmaker choose Russia and the match Russia 1-4 USA (USA win >=3 goals)', async () => {
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 175, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 4); // Russia 1:4 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 4); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer) , "Bookmaker lose all when the match is Russia 4-3 USA (Russia win 1 goal)" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter win all when the match is Russia 4-3 USA (Russia win 1 goal)");
//
//       });
//
//
//       it('should transfer all to bookmaker when  pair is [Russia 2:0 USA] (2.00) and bookmaker choose Russia and the match Russia 1-0  USA (Russia win)', async () => {
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 200, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 0); // Russia 1:0 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 0); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker win all when the match is Russia 1-0 USA (Russia win )" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal ), "Punter lose all when the match is Russia 1-0 USA (Russia wins)");
//
//       });
//
//       it('should transfer all to bookmaker when  pair is [Russia 2:0 USA] (2.00) and bookmaker choose Russia and the match Russia 1-1  USA (Russia draw)', async () => {
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 200, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 1); // Russia 1:1 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 1); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker win all when the match is Russia 1-0 USA (Russia win )" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal ), "Punter lose all when the match is Russia 1-0 USA (Russia wins)");
//
//       });
//
//       it('should transfer all to bookmaker when  pair is [Russia 2:0 USA] (2.00) and bookmaker choose Russia and the match Russia 1-2  USA (Russia loses 1 goals)', async () => {
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 200, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 2); // Russia 1:2 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 2); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin) , "Bookmaker win all when the match is Russia 1-0 USA (Russia win )" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal ), "Punter lose all when the match is Russia 1-0 USA (Russia wins)");
//
//       });
//
//       it('should refund to bookmaker and punter when  pair is [Russia 2:0 USA] (2.00) and bookmaker choose Russia and the match Russia 2-4  USA (Russia loses 2 goals)', async () => {
//         const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 200, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 2, 4); // Russia 2:4 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 2, 4); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer + amountAfterFee) , "Bookmaker receives refund when the match is Russia 4-2 USA (Russia win 2 goals)" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + amountAfterFee ), "Punter recieves refund when the match is Russia 4-2 USA (Russia win 2 goals)");
//
//       });
//
//
//       it('should transfer to punter when  pair is [Russia 2:0 USA] (2.00) and bookmaker choose Russia and the match Russia 1-4  USA (Russia loose 3 goals)', async () => {
//         const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
//         contract.offerNewMatch(0x138, homeTeam, awayTeam, 0, matchTime, 200, {from: bookmaker, value: betAmount});
//
//         // punter deals with bookmaker means that
//         contract.deal(0x138, 0, {from: punter, value: betAmount});
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 4); // Russia 1:4 USA
//         const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         contract.approveScore(0x138);
//
//         await sleep();
//         await contract.updateScore(0x138, 1, 4); // cheat here to wait for network update new balance
//
//         const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//
//         //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer ) , "Bookmaker lose all when the match is Russia 4-3 USA (Russia win 1 goals)" )
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore),toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin ), "Punter win refund when the match is Russia 4-3 USA (Russia win 1 goals)");
//
//       });
//
//   });
//
//
// });
//
