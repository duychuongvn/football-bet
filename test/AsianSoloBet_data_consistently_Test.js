// const AsianSoloBet = artifacts.require("AsianSoloBet");
// const betAmount = 1000000000000000000;// 2 Ether
// const amountAfterFee = betAmount * 95 / 100;
// const gasUsedToSendTx = 21000;
// const totalAmountReceivedAfterWin = betAmount + amountAfterFee - gasUsedToSendTx;// 5% fee and 21000 gas
//
// const halfAmountPaidAfterFee = betAmount * 95 / 100 / 2;
// const totalAmountReceivedWhenloseAHalf = halfAmountPaidAfterFee - gasUsedToSendTx;
// const totalAmountRecievedWhenWinAHalf = betAmount + totalAmountReceivedWhenloseAHalf;
//
// sleep = () => {
//   setTimeout(function () {
//
//   }, 5000);
// }
//
// toGwei = (wei) => {
//   return (wei / 10000000000000000).toFixed(2);
// }
// // var assertThrow = async (fn, args) => {
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
// // The bookmaker choose weaker team
//
// describe('Test data consistently when admin update score and kill contract', async () => {
//
//   contract("AsianSoloBet", accounts => {
//     const [firstAccount] = accounts;
//     const contractOwner = accounts[0]
//     const feeOwner = contractOwner;
//     const bookmaker = accounts[1]
//     const punter = accounts[2];
//     const matchTime = 1548728850000;
//     const homeTeam = "RusSia";
//     const awayTeam = "USA";
//     let contract;
//
//
//     beforeEach('setup contract for each test', async () => {
//       contract = await AsianSoloBet.new();
//     })
//
//
//     // it('should update balance of players when the match is approved', async () => {
//     //
//     //   const balanceOfBookmarkerBeforeOffer = await web3.eth.getBalance(bookmaker);
//     //   const balanceOfPunterBeforeDeal = await web3.eth.getBalance(punter);
//     //   contract.offerNewMatch(0x123, homeTeam, awayTeam, 0, matchTime, 0, {from: bookmaker, value: betAmount});
//     //
//     //   contract.deal(0x123, 0, {from: punter, value: betAmount});
//     //
//     //   contract.offerNewMatch(0x124, homeTeam, awayTeam, 0, matchTime, 0, {from: bookmaker, value: betAmount});
//     //
//     //   contract.deal(0x124, 0, {from: punter, value: betAmount});
//     //
//     //   contract.offerNewMatch(0x125, homeTeam, awayTeam, 0, matchTime, 0, {from: bookmaker, value: betAmount});
//     //
//     //
//     //   const balanceOfBookmarkerInContract = await contract.getPlayerBalance(bookmaker);
//     //   const balanceOfPunterInContract = await contract.getPlayerBalance(punter);
//     //
//     //   await contract.updateScore(0x123, 1, 0);
//     //   await contract.approveScore(0x123);
//     //
//     //   await contract.updateScore(0x125, 1, 0);
//     //   await contract.approveScore(0x125);
//     //   await sleep();
//     //   await contract.updateScore(0x123, 1, 0);
//     //
//     //
//     //   await sleep();
//     //   const balanceOfBookmarkerInContractAfterApproveScore = await contract.getPlayerBalance(bookmaker);
//     //   const balanceOfPunterInContractApproveScore = await contract.getPlayerBalance(punter);
//     //
//     //   assert.equal(balanceOfBookmarkerInContract, betAmount * 3, "Balance of bookmaker in contract should be triple bet amount when offer three times");
//     //   assert.equal(balanceOfPunterInContract, betAmount * 2, "Balance of punter in contract should be double bet amount when offer twice");
//     //
//     //   assert.equal(balanceOfBookmarkerInContractAfterApproveScore, betAmount, "Balance of bookmaker in contract should be  bet amount when offer three times and 2 match is approved");
//     //   assert.equal(balanceOfPunterInContractApproveScore, betAmount, "Balance of punter in contract should be the same  bet amount when offetr twice and 1 match is approved");
//     //
//     //
//     // });
//     //
//     //
//     // it('should refund all balance to players when admin kill contract', async () => {
//     //   const balanceOfBookmarkerBeforeOffer = await web3.eth.getBalance(bookmaker);
//     //   const balanceOfPunterBeforeDeal = await web3.eth.getBalance(punter);
//     //   contract.offerNewMatch(0x123, homeTeam, awayTeam, 0, matchTime, 0, {from: bookmaker, value: betAmount});
//     //
//     //   contract.deal(0x123, 0, {from: punter, value: betAmount});
//     //
//     //   contract.offerNewMatch(0x124, homeTeam, awayTeam, 0, matchTime, 0, {from: bookmaker, value: betAmount});
//     //
//     //   contract.deal(0x124, 0, {from: punter, value: betAmount});
//     //
//     //   contract.offerNewMatch(0x125, homeTeam, awayTeam, 0, matchTime, 0, {from: bookmaker, value: betAmount});
//     //
//     //
//     //   //  await contract.destroyContract();
//     //
//     //   const balanceOfBookmarkerAfterDestroyContract = await web3.eth.getBalance(bookmaker);
//     //   const balanceOfPunterDestroyContract = await web3.eth.getBalance(punter);
//     //
//     //   const players = await contract.countPlayers();
//     //   console.log("==========" + players);
//     //
//     //   // need to convert to ether due to lack of gas, could not assert small amount
//     //   assert.equal(toGwei(balanceOfBookmarkerBeforeOffer), toGwei(balanceOfBookmarkerAfterDestroyContract), "refund all balance to bookmaker when destroy contract")
//     //   assert.equal(toGwei(balanceOfPunterBeforeDeal), toGwei(balanceOfPunterDestroyContract), "refund all balance to punter when destroy contract")
//     //
//     // });
//     //
//     // it('should throw exception when input not valid odds', async () => {
//     //    contract.offerNewMatch(0x125, homeTeam, awayTeam, 0, matchTime, -1, {
//     //     from: bookmaker,
//     //     value: betAmount
//     //   }).then(result => {
//     //     assert(false, "Should not return result when odds is invalid")
//     //    }).catch(err => {
//     //      assert(true, "System throws revert exception when input invalid odds")
//     //    })
//     // });
//     //
//     // it('should throw exception when other account try to updates core', async () => {
//     //   await contract.offerNewMatch(0x125, homeTeam, awayTeam, 0, matchTime, -25, {from: bookmaker, value: betAmount});
//     //   contract.updateScore(0x125, 0, 0, {from: bookmaker})
//     //     .then(result => {
//     //       assert(false, "System does not through revert exception")
//     //     })
//     //     .catch(err => {
//     //       assert(true, "System throw revert exception");
//     //     });
//     //
//     // });
//     // it('should throw exception when other account try to approve core', async () => {
//     //   await contract.offerNewMatch(0x125, homeTeam, awayTeam, 0, matchTime, -25, {from: bookmaker, value: betAmount});
//     //   await contract.updateScore(0x125, 0, 0);
//     //   contract.approveScore(0x125).then(result => {
//     //     assert(false, "System does not through revert exception")
//     //   })
//     //     .catch(err => {
//     //       assert(true, "System throw revert exception");
//     //     });
//     //
//     // });
//     // //
//     // // it('should allow user claim stake when the match is finished', async() => {
//     // //   contract.offerNewMatch(0x124, homeTeam, awayTeam, 0, matchTime, 0, {from: bookmaker, value: betAmount});
//     // //   contract.deal(0x124, 0, {from: punter, value: betAmount});
//     // //   contract.updateScore(0x124, 1,0)
//     // //   const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//     // //   const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//     // //
//     // //   contract.claimStake(0x124, {from: bookmaker, gasPrice: 30, gasLimit: 210000});
//     // //   contract.updateScore(0x124, 1,0); // cheat here to wait for network updates balances
//     // //
//     // //   const amountOfBookMakerAfterClaim = await web3.eth.getBalance(bookmaker).toNumber();
//     // //   const amountOfPunterAfterClaim = await  web3.eth.getBalance(punter).toNumber();
//     // //
//     // //   console.log(amountOfBookMakerAfterOffer)
//     // //   console.log(amountOfPunterAfterDeal)
//     // //   console.log(amountOfBookMakerAfterClaim)
//     // //   console.log(amountOfPunterAfterClaim)
//     // //   assert.equal(toGwei(amountOfBookMakerAfterClaim), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin), "Bookmaker wins all and get all stake" );
//     // //   assert.equal(toGwei(amountOfPunterAfterClaim), toGwei(amountOfPunterAfterDeal), "Bookmaker loses all and don't get stake back" );
//     // // });
//     //
//     // // it('should not update balance when use claims twices', async() => {
//     // //   contract.offerNewMatch(0x124, homeTeam, awayTeam, 0, matchTime, 0, {from: bookmaker, value: betAmount});
//     // //   contract.deal(0x124, 0, {from: punter, value: betAmount});
//     // //   contract.updateScore(0x124, 1,0)
//     // //   const amountOfBookMakerAfterOffer = await web3.eth.getBalance(bookmaker).toNumber();
//     // //   const amountOfPunterAfterDeal = await  web3.eth.getBalance(punter).toNumber();
//     // //
//     // //   contract.updateScore(0x124, 1,0); // cheat here to wait for network update new balance
//     // //   contract.claimStake(0x124, {from: bookmaker, gasPrice: 30, gasLimit: 210000});
//     // //   contract.updateScore(0x124, 1,0); // cheat here to wait for network update new balance
//     // //   contract.claimStake(0x124, {from: bookmaker, gasPrice: 30, gasLimit: 210000});
//     // //   contract.updateScore(0x124, 1,0); // cheat here to wait for network update new balance
//     // //
//     // //   const amountOfBookMakerAfterClaim = await web3.eth.getBalance(bookmaker).toNumber();
//     // //   const amountOfPunterAfterClaim = await  web3.eth.getBalance(punter).toNumber();
//     // //
//     // //   assert.equal(toGwei(amountOfBookMakerAfterClaim), toGwei(amountOfBookMakerAfterOffer + totalAmountReceivedAfterWin), "Bookmaker wins all and get all stake" );
//     // //   assert.equal(toGwei(amountOfPunterAfterClaim), toGwei(amountOfPunterAfterDeal), "Bookmaker loses all and don't get stake back" );
//     // // });
//
//
//   });
//
//
// })
//
//
