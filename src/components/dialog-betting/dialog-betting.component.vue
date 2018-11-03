<template src="./dialog-betting.component.html"></template>
<style lang="scss" scoped src="./dialog-betting.component.scss"></style>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { Getter, Action } from 'vuex-class';

  import { DIALOG_NAME, DIALOG_CLOSE } from '@/shared/enums/dialog';
  import { ODDS_TYPE } from '@/shared/enums/odds';

  import { Betting } from '@/shared/model/betting';

  import { DateTime } from 'luxon';

  const isEqual = require('lodash/isEqual');
  const Big = require('big.js');

  @Component
  export default class DialogBettingComponent extends Vue {
    @Action('openDialog', { namespace: 'dialog' }) openDialog: any;
    @Action('setInitData', { namespace: 'dialog' }) setInitData: any;
    @Getter('isStoreBetting', { namespace: 'dialog' }) isStoreBetting!: boolean;
    @Getter('initData', { namespace: 'dialog' }) initData: any;

    @Action('createOffer', { namespace: 'solobet' }) createOffer: any;
    @Action('createDeal', { namespace: 'solobet' }) createDeal: any;
    @Getter('newOffer', { namespace: 'solobet' }) newOffer: any;
    @Getter('newDeal', { namespace: 'solobet' }) newDeal: any;
    @Getter('account', { namespace: 'web3' }) account!: any;

    @Action('notify', { namespace: 'notify' }) notify: any;

    @Getter('bettings', { namespace: 'betting' }) bettings!: Betting[];

    public bettingSelected = 0;
    public oddsSelected: any = ODDS_TYPE.UNDER_ONE;
    public stakeSelected = 0.5;
    private _match: any;

    public formOdds: boolean = false;

    public rules: any = {
      maxHandicap: []
    };

    isMerge: boolean = false;
    checkBettings: Betting[] | any = [];
    mergeBetSelected: any = null;

    checkOwnerBettings: any = null;

    get potential() {
      const stake = !!this.odds ? this.odds.bookmakerAmount : this.stakeSelected;

      return !!this.stakeSelected ? (this.stakeSelected * 0.95) : 0
    }

    get match() {
      if (this.initData && this.initData.match) {
        return this.initData.match
      }
    }

    get odds() {
      if (this.initData && this.initData.odds) {
        this.bettingSelected = this.initData.odds.bookmakerTeam;
        this.stakeSelected = new Big(this.initData.odds.bookmakerAmount).minus(this.initData.odds.settledAmount);
        let _validation = new Big(this.initData.odds.bookmakerAmount).minus(this.initData.odds.settledAmount);
        this.rules.maxHandicap.push((v: any) => (v <= _validation || `Max Stake ${_validation}`))
        return this.initData.odds
      }
    }

    get oddsString() {
      return this.isHomeTeamActive ? this.oddsSignHome : this.oddsSignAway
    }

    get oddsSignHome() {
      let _odds: any = this.odds ? (parseFloat(this.odds.odds) / 100) : parseFloat(this.oddsSelected);

      if (this.isHomeTeamActive) {
        _odds = _odds > 0 ? `+${_odds}` : _odds;
      } else {
        _odds = _odds > 0 ? `-${_odds}` : `+${-_odds}`;
      }

      return _odds;
    }

    get oddsSignAway() {
      let _odds: any = this.odds ? (parseFloat(this.odds.odds) / 100) : parseFloat(this.oddsSelected);

      if (this.isAwayTeamActive) {
        _odds = _odds > 0 ? `+${_odds}` : _odds;
      } else {
        _odds = _odds > 0 ? `-${_odds}` : `+${-_odds}`;
      }

      return _odds;
    }

    get dialogTitle() {
      if (this.isMerge) {
        return 'Merge Bet';
      }
      return this.odds ? 'Settle Bet' : 'Create Bet';
    }

    get dialogBtn() {
      return this.odds ? 'Settle' : 'Create';
    }

    get oddsType() {
      const _oddsType = [];

      for(let i in ODDS_TYPE) {
        _oddsType.push({
          id: i,
          text: ODDS_TYPE[i]
        })
      }

      return _oddsType
    }

    get isHomeTeamActive() {
      return this.bettingSelected === 0;
    }

    get isAwayTeamActive() {
      return this.bettingSelected !== 0;
    }

    get selectedTeam(): string {
      if (this.odds) {
        return this.isHomeTeamActive ? this.match.awayTeam.name : this.match.homeTeam.name;
      }
      return this.isHomeTeamActive ? this.match.homeTeam.name : this.match.awayTeam.name;
    }

    get homeTeamFlag() {
      return this.match ? this.match.homeTeam.flag : ''
    }

    get homeTeam() {
      return this.match ? `${this.match.homeTeam.name}` : ''
    }

    get awayTeamFlag() {
      return this.match ? this.match.awayTeam.flag : ''
    }

    get awayTeam() {
      return this.match ? `${this.match.awayTeam.name}` : ''
    }

    get mergeText() {
      const _number = this.checkBettings.length;
      return `We have found ${ _number } open handicap matching with your bet.`;
    }

    changeTeam(team: number) {
      if(!!this.odds) return;
      this.bettingSelected = team
    }

    saveBet() {
      if (!!this.odds) {
        this._createOdds()
      } else {
        this.checkMergeBet()
      }
    }

    checkMergeBet() {
      this.checkBettings = this.bettings.map((betting: Betting) => {
        const _address: boolean = !isEqual(betting.bookmakerAddress, this.account.address);
        const _teamSelected: boolean = !isEqual(this.bettingSelected, betting.bookmakerTeam);
        const _stake: boolean = isEqual(+this.stakeSelected, betting.bookmakerAmount);
        const _settledAmount: boolean = betting.settledAmount === 0;
        const _handicap: boolean = isEqual(this.oddsSelected * 100, betting.odds);

        if (_address && _teamSelected && _stake && _settledAmount && _handicap) {
          return betting;
        }
      }).filter(Boolean);

      // this.checkOwnerBettings = this.bettings.map((betting: Betting) => {
      //   const _address: boolean = isEqual(betting.bookmakerAddress, this.account.address);
      //   const _teamSelected: boolean = isEqual(this.bettingSelected, betting.bookmakerTeam);
      //   const _stake: boolean = isEqual(+this.stakeSelected, betting.bookmakerAmount);
      //   const _settledAmount: boolean = betting.settledAmount === 0 || betting.bookmakerAmount > betting.settledAmount;
      //   const _handicap: boolean = isEqual(this.oddsSelected * 100, betting.odds);
      //
      //   if (_address && _teamSelected && _stake && _settledAmount && _handicap) {
      //     return betting;
      //   }
      // }).filter(Boolean);
      //
      // if (this.checkOwnerBettings.length !== 0) {
      //   this.notify({
      //     mode: 'info',
      //     message: 'You had created bet with same requirement!'
      //   });
      //   return;
      // }

      if (this.checkBettings.length !== 0) {
        this.mergeBetSelected = this.checkBettings[0];
        this.isMerge = true;
      } else {
        this.createBet();
      }
    }

    createBet() {
      const _opts = {
        account: this.account.address,
        match: this.match,
        homeTeam: this.match.homeTeam.name,
        awayTeam: this.match.awayTeam.name,
        time: (DateTime.fromISO(this.match.date).toMillis() / 1000),
        odds: this.oddsSelected * 100,
        stake: +this.stakeSelected,
        selectedTeam: this.bettingSelected
      };

      this.createOffer(_opts)
    }

    _createOdds() {
      const _odds: any = {
        matchId: this.match,
        bettingId: this.odds.bettingId,
        account: this.account.address,
        amount: +this.stakeSelected
      };

      this.createDeal(_odds);
    }

    mergeBet() {
      const _odds: any = {
        matchId: this.mergeBetSelected.matchId,
        bettingId: this.mergeBetSelected.bettingId,
        account: this.account.address,
        amount: this.mergeBetSelected.bookmakerAmount
      };

      this.createDeal(_odds);
    }

    closeDialog(dataDialog?: any) {
      this.toogleDialog(DIALOG_NAME.STORE_BETTING, false, dataDialog);
    }

    toogleDialog(dialogName: string, status: boolean, dataDialog?: any) {
      let _initOpts: any = {
        key: dialogName,
        isOpen: status
      };

      if (dialogName === DIALOG_NAME.BETTING_SHARING) {
        _initOpts.name = 'dialog-sharing'
      }

      if (!!dataDialog) {
        _initOpts.initData = dataDialog
      }

      this.openDialog(_initOpts)
    }

    @Watch('initData')
    getInitData(value: any, oldValue: any) {
      if (!isEqual(value, oldValue) && oldValue) {
        this.setInitData(oldValue)
      }
    }

    @Watch('newOffer')
    getNewOffer(value: any) {
      if (value) {
        this._match = JSON.parse(JSON.stringify(this.match));
        this.closeDialog({
          key: DIALOG_CLOSE.BETTING_RELOAD
        });

        setTimeout(() => {
          this.toogleDialog(DIALOG_NAME.BETTING_SHARING, true, {
            isLoading: true,
            message: 'Your request has been submitted!'
          });
        }, 50);
      }
    }

    @Watch('newDeal')
    getNewDeal(value: any) {
      if (value) {
        this._match = JSON.parse(JSON.stringify(this.match));
        const _bettingId = (this.isMerge ? this.mergeBetSelected.bettingId : this.odds.bettingId);
        const _amount = (this.isMerge ? this.mergeBetSelected.bookmakerAmount : +this.stakeSelected);

        const _odds: any = {
          bettingId: _bettingId,
          account: this.account.address,
          amount: _amount
        };

        this.closeDialog({ key: DIALOG_CLOSE.BETTING_DEAL_RELOAD, data: _odds });

        this.notify({
          mode: 'success',
          message: 'Your settlement has been submitted!'
        });

        setTimeout(() => {
          this.toogleDialog(DIALOG_NAME.BETTING_SHARING, true, {
            bettingId: _odds.bettingId,
            message: 'Your settlement has been submitted!'
          });
        }, 50);
      }
    }
  }
</script>
