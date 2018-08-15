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
        observer.onNext(betherContract);
        observer.onCompleted();
    }),
    newOffer: (offerObj) => Rx.Observable.create((observer) => {
        let id = Web3Vue.toSHA3(offerObj.homeTeam + offerObj.awayTeam + (offerObj.time / 1000));
        BetherContractService.init().subscribe((result) => {
            return bether.offerNewMatch(id, offerObj.homeTeam, offerObj.awayTeam, offerObj.selectedTeam, (offerObj.time), offerObj.odds, { from: offerObj.account, value: window.web3.toWei(offerObj.stake, 'ether') }, (err, result) => {
                if (err) {
                    observer.error(err);
                    console.log(err);
                }
                else {
                    console.log(result);
                    observer.onNext(result);
                }
                observer.onCompleted();
            });
        });
    }),
    oddsDeal: (dealObj) => Rx.Observable.create((observer) => {
        BetherContractService.getBettingInfo(dealObj.bettingId).subscribe((result) => {
            if (result.status == 0 && (result.bookmakerAmount - result.settledAmount >= dealObj.amount)) {
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
    updateScore: (dealObj) => Rx.Observable.create((observer) => {
    }),
    approveScore: (dealObj) => Rx.Observable.create((observer) => {
    }),
    getBettingInfo: (bettingIdx) => Rx.Observable.create((observer) => {
        bether.getBettingInfo.call(bettingIdx, (error, result) => {
            if (error) {
                observer.error(error);
            }
            else {
                var index = 0;
                var betting = {
                    'bettingId': bettingIdx,
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
                observer.onNext(betting);
                observer.onCompleted();
            }
        });
    }),
    getBettingIds: (matchId) => Rx.Observable.create((observer) => {
        bether.getBettings.call(matchId, (err, result) => {
            var ids = [];
            for (var i = 0; i < result.length; i++) {
                ids[i] = result[i].toNumber();
            }
            observer.onNext(ids);
            observer.onCompleted();
        });
    }),
    getBettings: (matchId) => Rx.Observable.create((observer) => {
        BetherContractService.getBettingIds(matchId).subscribe((ids) => {
            var bettings = [];
            for (var i = 0; i < ids.length; i++) {
                BetherContractService.getBettingInfo(ids[i]).subscribe((result) => {
                    bettings.push(result);
                });
            }
            observer.onNext(bettings);
            observer.onCompleted();
        });
    }),
    countBettings: (matchIds) => Rx.Observable.create((observer) => {
        bether.countBetStatus(matchIds, (err, result) => {
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
            console.log(bettingStatus);
            observer.onNext(bettingStatus);
            observer.onCompleted();
        });
    }),
    toEther(wei) {
        return window.web3.fromWei(wei, 'ether');
    }
};
//# sourceMappingURL=bether.service.js.map
//# sourceMappingURL=bether.service.js.map