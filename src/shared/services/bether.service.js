import { Web3Vue } from '@/shared/services/web3.service';
import ENV from '@/environment/index';
let contract = require('truffle-contract');
let betherContractABI = require('@/assets/contracts/BetherContractABI.json');
const Rx = require('rx');
let betherContract;
let bether;
export const BetherContractService = {
    init: () => Rx.Observable.create((observer) => {
        const betherContract = window.web3.eth.contract(betherContractABI);
        bether = betherContract.at(ENV.CONTRACT_ADDRESS);
        observer.onNext(bether);
        observer.onCompleted();
    }),
    newOffer: (offerObj) => Rx.Observable.create((observer) => {
        let id = Web3Vue.toSHA3(offerObj.bettingId);
        console.log(id);
        console.log(offerObj);
        bether.offerNewMatch(id, offerObj.homeTeam, offerObj.awayTeam, offerObj.bookmakerTeam, offerObj.time / 1000, offerObj.odds, { from: offerObj.account, value: window.web3.toWei(offerObj.stake, 'ether') }, (err, result) => {
            if (err) {
                observer.error(err);
            }
            else {
                observer.onNext(result);
            }
            observer.onCompleted();
        });
    }),
    oddsDeal: (dealObj) => Rx.Observable.create((observer) => {
        BetherContractService.getBettingInfo(dealObj.bettingId).subscribe((result) => {
            if ((result.status === 0 || result.status === 1) && (result.bookmakerAmount - result.settledAmount >= dealObj.amount)) {
                console.log(dealObj.bettingId);
                bether.deal(dealObj.bettingId, { from: dealObj.account, value: window.web3.toWei(dealObj.amount, 'ether') }, (error, result) => {
                    console.log(error);
                    console.log(result);
                    if (error) {
                        observer.error(error);
                    }
                    else {
                        observer.onNext(result);
                        observer.onCompleted();
                    }
                });
            }
            else {
                throw "Betting not valid";
            }
        });
    }),
    updateScore: (scoreObj) => Rx.Observable.create((observer) => {
        let id = Web3Vue.toSHA3(scoreObj.bettingId);
        bether.approveScore(id, scoreObj.homeScore, scoreObj.awayScore, { from: scoreObj.account }, (err, result) => {
            observer.onCompleted();
        });
    }),
    approveScore: (dealObj) => Rx.Observable.create((observer) => {
        let id = Web3Vue.toSHA3(dealObj.bettingId);
        bether.approveScore(id, { from: dealObj.account }, (err, result) => {
            observer.onCompleted();
        });
    }),
    getBettingInfo: (bettingIdx) => Rx.Observable.create((observer) => {
        bether.getBettingInfo.call(bettingIdx, (error, result) => {
            if (error) {
                observer.error(error);
            }
            else {
                var index = 0;
                var betting = {
                    'id': bettingIdx,
                    'bettingId': bettingIdx,
                    'matchId': null,
                    'bookmakerAddress': result[index++],
                    'bookmakerTeam': result[index++].toNumber(),
                    'odds': result[index++].toNumber(),
                    'bookmakerAmount': BetherContractService.toEther(result[index++].toNumber()),
                    'settledAmount': BetherContractService.toEther(result[index++].toNumber()),
                    'status': result[index++].toNumber(),
                    'punters': []
                };
                for (var i = 0; i < result[index].length; i++) {
                    betting.punters.push({ "no": i + 1, 'wallet': result[index][i], 'settledAmount': BetherContractService.toEther(result[index + 1][i].toNumber()) });
                }
                bether.getMatchId.call(betting.bettingId, (err, result) => {
                    betting.matchId = result;
                    observer.onNext(betting);
                    observer.onCompleted();
                });
            }
        });
    }),
    getBettingIds: (matchId) => Rx.Observable.create((observer) => {
        bether.getBettings.call(matchId, (err, result) => {
            let ids = [];
            if (result && result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    ids[i] = result[i].toNumber();
                }
            }
            observer.onNext(ids);
            observer.onCompleted();
        });
    }),
    getBettings: (matchId) => Rx.Observable.create((observer) => {
        let id = Web3Vue.toSHA3(matchId);
        BetherContractService.getBettingIds(id).subscribe((ids) => {
            let bettings = [];
            if (ids && ids.length !== 0) {
                for (let i = 0; i < ids.length; i++) {
                    BetherContractService.getBettingInfo(ids[i]).subscribe((result) => {
                        bettings.push(result);
                    });
                }
            }
            observer.onNext(bettings);
            observer.onCompleted();
        });
    }),
    countBettings: (matchIds) => Rx.Observable.create((observer) => {
        bether.countBetStatus.call(matchIds, (err, result) => {
            var bettingStatus = [];
            for (var i = 0; i < matchIds.length; i++) {
                bettingStatus.push({
                    "matchId": matchIds[i],
                    "open": result[0][i].toNumber(),
                    "portionSettled": result[1][i].toNumber(),
                    "settledOrDone": result[2][i].toNumber(),
                    "canceled": result[3][i].toNumber(),
                    "refuned": result[4][i].toNumber(),
                });
            }
            observer.onNext(bettingStatus);
            observer.onCompleted();
        });
    }),
    cacheBetting(bettings, betting) {
        console.log(bettings);
        console.log(betting);
        var match;
        for (var i = 0; i < bettings.length; i++) {
            if (bettings[i].matchId === betting.matchId) {
                match = bettings[i];
                break;
            }
        }
        if (!match) {
            match = { "matchId": betting.matchId, "bettings": [] };
            bettings.push(match);
        }
        var bettingItem;
        for (var i = 0; i < match.bettings.length; i++) {
            if (match.bettings[i].bettingId === betting.bettingId) {
                bettingItem = match.bettings[i];
                break;
            }
        }
        if (!bettingItem) {
            bettingItem = { "bettingId": betting.bettingId,
                'bookmakerAddress': betting.bookmakerAddress,
                'bookmakerTeam': betting.bookmakerTeam,
                'odds': betting.odds,
                'bookmakerAmount': betting.bookmakerAmount,
                'settledAmount': betting.settledAmount,
                'status': betting.status,
                'punters': []
            };
            match.bettings.push(bettingItem);
        }
        bettingItem.punters.push(...betting.punters);
        return bettings;
    },
    getUserBets: (account) => Rx.Observable.create((observe) => {
        bether.getUserBets.call(account, (err, bettingIds) => {
            var bettings = [];
            for (var i = 0; i < bettingIds.length; i++) {
                BetherContractService.getBettingInfo(bettingIds[i]).subscribe((res) => {
                    BetherContractService.cacheBetting(bettings, res);
                });
            }
            bether.getUserSettles.call(account, (error, result) => {
                for (var i = 0; i < result[0].length; i++) {
                    bether.getSettleInfo.call(result[0][i], result[1][i], (settleInfoErr, settleInfoResult) => {
                        var colIdx = 0;
                        var betting = {
                            'matchId': settleInfoResult[colIdx++],
                            'bettingId': settleInfoResult[colIdx++],
                            'bookmakerAddress': settleInfoResult[colIdx++],
                            'bookmakerTeam': settleInfoResult[colIdx++].toNumber(),
                            'odds': settleInfoResult[colIdx++].toNumber(),
                            'bookmakerAmount': BetherContractService.toEther(settleInfoResult[colIdx++].toNumber()),
                            'settledAmount': BetherContractService.toEther(settleInfoResult[colIdx++].toNumber()),
                            'status': settleInfoResult[colIdx++].toNumber(),
                            'punters': []
                        };
                        betting.punters.push({ 'wallet': settleInfoResult[colIdx++],
                            'settledAmount': BetherContractService.toEther(settleInfoResult[colIdx].toNumber()) });
                        BetherContractService.cacheBetting(bettings, betting);
                    });
                }
                observe.onNext(bettings);
                observe.onCompleted();
            });
        });
    }),
    getVolume: (time) => Rx.Observable.create((observe) => {
        bether.getVolume.call(time, (err, result) => {
            if (err) {
                observe.error(err);
            }
            else {
                observe.onNext(result.toNumber());
            }
            observe.onCompleted();
        });
    }),
    toEther(wei) {
        return window.web3.fromWei(wei, 'ether');
    }
};
//# sourceMappingURL=bether.service.js.map
//# sourceMappingURL=bether.service.js.map