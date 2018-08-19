let contract = require('truffle-contract');
let AsianSoloBetContract = require('@/assets/contracts/AsianSoloBet.json');
const Rx = require('rx');
let soloBetContract;
export const SoloBetService = {
    init: (currentProvider) => Rx.Observable.create((observer) => {
        soloBetContract = contract(AsianSoloBetContract);
        soloBetContract.setProvider(currentProvider);
        observer.onNext(soloBetContract);
        observer.onCompleted();
    }),
    getBetting: (matchId, bettingId) => Rx.Observable.create((observer) => {
        soloBetContract.deployed()
            .then((instance) => {
            return instance.getBettingInfo.call(matchId, bettingId);
        }).then((result) => {
            let betting = {
                bettingId: bettingId,
                matchId: matchId,
                offer: result[0],
                dealer: result[1],
                selectedTeam: result[2].toNumber(),
                odds: result[3].toNumber(),
                amount: result[4].toNumber(),
                stake: SoloBetService.toEther(result[4].toNumber()),
                status: result[5].toNumber(),
            };
            if (betting.selectedTeam === 0) {
                betting.homeOffer = betting.offer;
                betting.awayOffer = betting.dealer;
            }
            else {
                betting.homeOffer = betting.dealer;
                betting.awayOffer = betting.offer;
            }
            observer.onNext(betting);
            observer.onCompleted();
        }).catch((err) => {
            observer.error(err);
        });
    }),
    newOffer: (offerObj) => Rx.Observable.create((observer) => {
        soloBetContract.deployed().then((instance) => {
            return instance.offerNewMatch(offerObj.bettingId, offerObj.homeTeam, offerObj.awayTeam, offerObj.selectedTeam, (offerObj.time / 1000), offerObj.odds, { from: offerObj.account, value: window.web3.toWei(offerObj.stake, 'ether') });
        }).then((result) => {
            observer.onNext(result);
            observer.onCompleted();
        }).catch((error) => {
            observer.error(error);
        });
    }),
    loadMatchesById: (matchId) => Rx.Observable.create((observer) => {
        let match = [];
        soloBetContract.deployed().then((instance) => {
            return instance.findMatch.call(matchId);
        }).then((result) => {
            let index = 0;
            match.matchId = matchId;
            match.homeTeam = result[index++];
            match.awayTeam = result[index++];
            match.homeGoals = result[index++].toNumber();
            match.awayGoals = result[index++].toNumber();
            match.time = result[index++].toNumber();
            match.status = result[index++].toNumber();
            match.approved = result[index++];
            if (match.status === 1) {
                let currentime = new Date().getTime() / 1000;
                if (currentime > match.time && currentime < match.time + 100 * 60) {
                    match.status = 2;
                }
            }
            observer.onNext(match);
            observer.onCompleted();
        })
            .catch((e) => {
            observer.error(e);
        });
    }),
    loadBettings: (matchId) => Rx.Observable.create((observer) => {
        soloBetContract.deployed().then((instance) => {
            return instance.totalBets.call(matchId);
        }).then((totalBets) => {
            observer.onNext(totalBets);
            observer.onCompleted();
        }).catch((err) => {
            observer.error(err);
        });
    }),
    loadBettingsByAccount: (account) => Rx.Observable.create((observer) => {
        let bettingMatches = [];
        soloBetContract.deployed().then((instance) => {
            return instance.getBettingMatchesByAddress.call(account);
        }).then((result) => {
            let matchIds = result[0];
            let bettingIds = result[1];
            let rates = result[2];
            let amounts = result[3];
            let betForHomeTeam = result[4];
            let status = result[5];
            for (let i = 0; i < matchIds.length; i++) {
                let _betting = {
                    matchId: matchIds[i],
                    match: null,
                    bettingId: bettingIds[i].toNumber(),
                    odd: rates[i].toNumber(),
                    amount: SoloBetService.toEther(amounts[i].toNumber()),
                    chooseHomeTeam: betForHomeTeam[i],
                    betFor: null,
                    status: status[i].toNumber(),
                    status_string: '',
                    receivedAmount: 0
                };
                //Open, Deal, Canceled, Refunded, Done
                if (_betting.status === 0) {
                    _betting.status_string = 'Open';
                }
                else if (_betting.status === 1) {
                    _betting.status_string = 'Settled';
                }
                else if (_betting.status === 2) {
                    _betting.status_string = 'Canceled';
                }
                else if (_betting.status === 3) {
                    _betting.status_string = 'Refunded';
                }
                else if (_betting.status === 4) {
                    _betting.status_string = 'Done';
                }
                bettingMatches.push(_betting);
            }
            observer.onNext(bettingMatches);
            observer.onCompleted();
        });
    }),
    oddsDeal: (dealObj) => Rx.Observable.create((observer) => {
        soloBetContract.deployed().then((instance) => {
            return instance.deal(dealObj.matchId, dealObj.bettingId, { from: dealObj.account, value: dealObj.amount });
        }).then((betResult) => {
            observer.onNext(betResult);
            observer.onCompleted();
        }).catch((err) => {
            observer.error(err);
        });
    }),
    cancelOdds: (oddsObj) => Rx.Observable.create((observer) => {
        soloBetContract.deployed()
            .then((instance) => {
            return instance.cancelOffer(oddsObj.matchId, oddsObj.bettingId, { from: oddsObj.account });
        })
            .then((result) => {
            observer.onNext(result);
            observer.onCompleted();
        }).catch((err) => {
            observer.error(err);
        });
    }),
    updateScore: (scoreObj) => Rx.Observable.create((observer) => {
        soloBetContract.deployed().then((instance) => {
            return instance.updateScore(scoreObj.matchId, scoreObj.homeScore, scoreObj.awayScore, { from: scoreObj.account });
        })
            .then((result) => {
            observer.onNext(result);
            observer.onCompleted();
        }).catch((err) => {
            observer.error(err);
        });
    }),
    approveScore: (scoreObj) => Rx.Observable.create((observer) => {
        soloBetContract.deployed().then((instance) => {
            return instance.approveScore(scoreObj.matchId, { from: scoreObj.account });
        })
            .then((result) => {
            observer.onNext(result);
            observer.onCompleted();
        }).catch((err) => {
            observer.error(err);
        });
    }),
    toEther(wei) {
        return wei / 1000000000000000000;
    }
};
//# sourceMappingURL=asian-solobet.service.js.map