<template src="./dialog-betting.component.html"></template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  import { DIALOG_NAME, DIALOG_CLOSE } from '@/shared/enums/dialog'
  import { ODDS_TYPE } from '@/shared/enums/odds'

  import * as moment from 'moment'

  const isEqual = require('lodash/isEqual');
  const Big = require('big.js');

  @Component
  export default class DialogBettingComponent extends Vue {
    @Action('openDialog', { namespace: 'dialog' }) openDialog: any
    @Action('setInitData', { namespace: 'dialog' }) setInitData: any
    @Getter('isStoreBetting', { namespace: 'dialog' }) isStoreBetting!: boolean
    @Getter('initData', { namespace: 'dialog' }) initData: any

    @Action('createOffer', { namespace: 'solobet' }) createOffer: any
    @Action('createDeal', { namespace: 'solobet' }) createDeal: any
    @Getter('newOffer', { namespace: 'solobet' }) newOffer: any
    @Getter('newDeal', { namespace: 'solobet' }) newDeal: any
    @Getter('account', { namespace: 'web3' }) account!: any

    @Action('notify', { namespace: 'notify' }) notify: any

    public bettingSelected = 0
    public oddsSelected: any = ODDS_TYPE.UNDER_ONE
    public stakeSelected = 0.05
    private _match: any;

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
        return this.initData.odds
      }
    }

    get oddsString() {
      return this.isHomeTeamActive ? this.oddsSignHome : this.oddsSignAway
    }

    get oddsSignHome() {
      let _odds: any = this.odds ? (parseFloat(this.odds.odds) / 100) : parseFloat(this.oddsSelected)

      if (this.isHomeTeamActive) {
        _odds = _odds > 0 ? `+${_odds}` : _odds;
      } else {
        _odds = _odds > 0 ? `-${_odds}` : `+${-_odds}`;
      }

      return _odds;
    }

    get oddsSignAway() {
      let _odds: any = this.odds ? (parseFloat(this.odds.odds) / 100) : parseFloat(this.oddsSelected)

      if (this.isAwayTeamActive) {
        _odds = _odds > 0 ? `+${_odds}` : _odds;
      } else {
        _odds = _odds > 0 ? `-${_odds}` : `+${-_odds}`;
      }

      return _odds;
    }

    get dialogTitle() {
      return this.odds ? 'Settle Bet' : 'Create Bet';
    }

    get dialogButn() {
      return this.odds ? 'Settle' : 'Create';
    }

    get oddsWith() {
      return this.isHomeTeamActive ? this.odds.bookmakerAddress : this.odds.awayOffer
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
        return this.isHomeTeamActive ? this.match.awayTeam : this.match.homeTeam;
      }
      return this.isHomeTeamActive ? this.match.homeTeam : this.match.awayTeam;
    }

    get notselectedTeam(): string {
      if (this.odds) {
        return this.isHomeTeamActive ? this.match.homeTeam : this.match.awayTeam;
      }
      return this.isHomeTeamActive ? this.match.awayTeam : this.match.homeTeam;
    }

    get homeTeamFlag() {
      return this.match ? this.match.homeTeamFlag : ''
    }

    get homeTeam() {
      return this.match ? `${this.match.homeTeam}` : ''
    }

    get awayTeamFlag() {
      return this.match ? this.match.awayTeamFlag : ''
    }

    get awayTeam() {
      return this.match ? `${this.match.awayTeam}` : ''
    }

    get handicapInfo () {
      const _handicap = (this.oddsSelected * 100) / 100;
      let msg = `You win if `;

      switch (_handicap) {
        case 0:
          msg += `${this.selectedTeam} wins.<br/>You draw if ${this.selectedTeam} draws with ${this.notselectedTeam}`;
          break;
        case 0.5:
          msg += `You win if ${this.selectedTeam} draws with ${this.notselectedTeam} or ${this.selectedTeam} wins.`;
          break;
        case -0.5:
          msg += `You win if ${this.selectedTeam} wins.`;
          break;
        case 1:
          msg += `${this.selectedTeam} wins by more than 1 goal.`;
          msg += `<br/>You draw if ${this.selectedTeam} loses by 1 goal`;
          break;
        case -1:
          msg += `${this.selectedTeam} draws with ${this.notselectedTeam} or ${this.selectedTeam} wins.`;
          msg += `<br/>You draw if ${this.selectedTeam} wins by 1 goal`;
          break;
        case 1.5:
          msg += `You win if ${this.selectedTeam} loses by 1 goal or ${this.selectedTeam} wins`;
          break;
        case -1.5:
          msg += `You win if A wins by 2 goals or more`;
          break;
      }
      return msg;
    }

    changeTeam(team: number) {
      if(!!this.odds) return
      this.bettingSelected = team
    }

    saveBet() {
      if (!!this.odds) {
        this._createOdds()
      } else {
        this._createBet()
      }
    }

    _createBet() {
      const _opts = {
        account: this.account.address,
        match: this.match,
        homeTeam: this.match.homeTeam,
        awayTeam: this.match.awayTeam,
        time: moment(this.match.date).unix(),
        odds: this.oddsSelected * 100,
        stake: +this.stakeSelected,
        selectedTeam: this.bettingSelected
      }

      this.createOffer(_opts)
    }

    _createOdds() {
      const _odds: any = {
        matchId: this.match,
        bettingId: this.odds.bettingId,
        account: this.account.address,
        amount: +this.stakeSelected
      }

      this.createDeal(_odds)
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
    getNewOffer(value: any, oldValue: any) {
      if (value) {
        this._match = JSON.parse(JSON.stringify(this.match));
        this.closeDialog({
          key: DIALOG_CLOSE.BETTING_RELOAD
        });

        setTimeout(() => {
          this.toogleDialog(DIALOG_NAME.BETTING_SHARING, true, {
            homeTeam: this._match.homeTeam,
            awayTeam: this._match.awayTeam,
            date: this._match.date,
            message: 'Your request has been submitted!'
          });
        }, 50);
      }
    }

    @Watch('newDeal')
    getNewDeal(value: any, oldValue: any) {
      if (value) {
        this._match = JSON.parse(JSON.stringify(this.match));

        const _odds: any = {
          bettingId: this.odds.bettingId,
          account: this.account.address,
          amount: +this.stakeSelected
        };

        this.closeDialog({ key: DIALOG_CLOSE.BETTING_DEAL_RELOAD, data: _odds });

        this.notify({
          mode: 'success',
          message: 'Your settlement has been submitted!'
        });

        setTimeout(() => {
          this.toogleDialog(DIALOG_NAME.BETTING_SHARING, true, {
            homeTeam: this._match.homeTeam,
            awayTeam: this._match.awayTeam,
            date: this._match.date,
            message: 'Your settlement has been submitted!'
          });
        }, 50);
      }
    }
  }
</script>
