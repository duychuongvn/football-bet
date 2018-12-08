// const BetherContract = artifacts.require("BetherContract");
// const betAmount = 1000000000000000000;// 1 Ether
// const amountAfterFee = betAmount * 95 / 100;
// const gasUsedToSendTx = 21000;
// const totalAmountReceivedAfterWin = betAmount + amountAfterFee - gasUsedToSendTx;// 5% fee and 21000 gas
// const refundAfterDraw = betAmount - betAmount * 5 / 100 / 2;
//
// const halfAmountPaidAfterFee = betAmount * 95 / 100 / 2;
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
//   return parseInt(wei / 1000000000000);
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
//
//
// describe('Test', async () => {
//
//   contract("BetherContract", accounts => {
//     const [firstAccount] = accounts;
//     const contractOwner = accounts[0]
//     const feeOwner = contractOwner;
//     const bookmaker = accounts[1]
//     const punter = accounts[2];
//     const matchTime = 1548728850;
//     const homeTeam = "RusSia";
//     const awayTeam = "USA";
//     let contract;
//
//
//     beforeEach('setup contract for each test', async () => {
//       contract = await BetherContract.new();
//     })
//
//
//     it('should query', async () => {
//
//       // contract.offerNewMatch(0x126, homeTeam, awayTeam, 1, matchTime, 25, {from: bookmaker, value: betAmount});
//       // contract.offerNewMatch(0x126, homeTeam, awayTeam, 1, matchTime, 25, {from: accounts[5], value: betAmount});
//       // var info = await contract.getBettingInfo(0);
//       // console.log(info);
//       // contract.bet(0, {from: punter, value: betAmount / 2});
//
//     });
//     it('should transfer all to bookmaker when  pair is [Russia 3/4:0 USA] (0.75) and bookmaker choose Russia and the Russia draw ', async () => {
//       const amountOfBookMakerBeforeOffer = await web3.eth.getBalance(bookmaker).toNumber();
//       const amountOfPunterBeforeDeal = await  web3.eth.getBalance(punter).toNumber();
//
//       console.log("new")
//       console.log(amountOfBookMakerBeforeOffer);
//       console.log(amountOfPunterBeforeDeal);
//      // await contract.offerNewMatch(0x133, homeTeam, awayTeam, 0, matchTime, 75, {from: bookmaker, value: betAmount});
//       await contract.offerNewMatch(0x133, homeTeam, awayTeam, 1, matchTime, -125, {from: bookmaker, value: betAmount});
//       // await contract.offerNewMatch(0x134, homeTeam, awayTeam, 0, matchTime, 75, {from: bookmaker, value: betAmount});
//       // await contract.offerNewMatch(0x135, homeTeam, awayTeam, 0, matchTime, 75, {from: bookmaker, value: betAmount});
//
//       // punter deals with bookmaker means that
//       await contract.bet(0, {from: punter, value: betAmount});
//    //   await contract.bet(0, {from: punter, value: betAmount/2});
//    //   await contract.bet(0, {from: accounts[4], value: betAmount/2});
//    //   await contract.bet(2, {from: accounts[4], value: betAmount});
//       const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//       const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//
//         console.log("after deal")
//         console.log(amountOfBookMakerAfterOffer);
//         console.log(amountOfPunterAfterDeal);
//         const  bookmakerPlaced = await contract.getPlayerBalance(bookmaker);
//         const  punterPlaced = await contract.getPlayerBalance(punter);
//
//
//         console.log(bookmakerPlaced.toNumber());
//         console.log(punterPlaced.toNumber());
//         // console.log(await contract.getPlayerBalance(punter));
//       //   await sleep();
//       await contract.updateScore(0x133, 1, 2); // Russia 2:2 USA
//     //  await contract.updateScore(0x134, 1, 5); // Russia 2:2 USA
//     //  await contract.updateScore(0x135, 2, 2); // Russia 2:2 USA
//       await contract.approveScore(0x133);
//       // const appr = await contract.approveScore(0x134);
//       // const appr2 = await contract.approveScore(0x135);
//       //console.log(appr)
//       //   contract.claimStake(0x133, [0])
//       //
//       // //  await sleep();
//       //   await contract.updateScore(0x133, 2, 2); // cheat here to wait for network update new balance
//       //
//       await contract.updateScore(0x133, 1, 5); // Russia 2:2 USA
//
//       await contract.updateScore(0x133, 1, 5); // Russia 2:2 USA
//
//       const amountOfBookMakerAfterApproveMatchScore = await web3.eth.getBalance(bookmaker).toNumber();
//         const amountOfPunterAfterApproveMatchScore = await  web3.eth.getBalance(punter).toNumber();
//         console.log("after approve")
//         console.log(amountOfBookMakerAfterApproveMatchScore);
//         console.log(amountOfPunterAfterApproveMatchScore);
//
//       //   //cannot verify exact amount due to lack of gas
//         assert.equal(toGwei(amountOfBookMakerAfterApproveMatchScore), toGwei(amountOfBookMakerAfterOffer), "Bookmaker win all when Russia win 2-1")
//         assert.equal(toGwei(amountOfPunterAfterApproveMatchScore), toGwei(amountOfPunterAfterDeal + totalAmountReceivedAfterWin), "Punter lose all amount when Russia win 2-1")
//       // //
//
//     //   const matchIds = ['0x133', '0x134', '0x135'];
//     //   const matchStatus = await contract.countBetStatus(matchIds);
//     //
//     //   console.log(matchStatus)
//     //   console.log(matchStatus)
//     //   for(let i = 0; i < matchIds.length;i++) {
//     //     console.log("----------")
//     //     console.log("MatchId:" + matchIds[i]);
//     //     console.log("Open:" + matchStatus[0][i].toNumber());
//     //     console.log("Partical Settle:" + matchStatus[1][i].toNumber());
//     //     console.log("Settled Or Done:" + matchStatus[2][i].toNumber());
//     //     console.log("Canceled:" + matchStatus[3][i].toNumber());
//     //     console.log("Refunded:" + matchStatus[4][i].toNumber());
//     //     console.log("----------")
//     //   }
//     });
//   })
// })
