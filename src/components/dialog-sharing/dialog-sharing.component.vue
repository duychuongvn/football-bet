<template src="./dialog-sharing.component.html"></template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Getter, Action } from 'vuex-class'
  import { DIALOG_NAME } from '@/shared/enums/dialog';
  import axios from 'axios'
  import * as moment from 'moment'

  const isUndefined = require('lodash/isUndefined');

  @Component
  export default class DialogSharingComponent extends Vue {
    @Action('notify', { namespace: 'notify' }) notify: any

    @Getter('isSharingBetting', { namespace: 'dialog' }) isSharingBetting!: boolean;
    @Getter('initData', { namespace: 'dialog' }) initData: any;

    public sharePath: string = '';

    public matchKey: string = '';

    public isLoading: boolean = false;

    public bettingId: number | undefined;

    get isDialog() {
      if (this.initData) {
        if (this.$route.params && this.$route.params.key) {
          this.matchKey = this.$route.params.key;
        } else {
          this.matchKey = btoa(JSON.stringify({
            id: this.initData.bettingId,
            matchId: this.initData.matchId,
            homeTeam: this.initData.homeTeam,
            awayTeam: this.initData.awayTeam,
            date: this.initData.date
          }));
        }

        if (!isUndefined(this.initData.bettingId)) {
          this.bettingId = this.initData.bettingId;
        }

        if (this.initData.isLoading) {
          this.isLoading = this.initData.isLoading;
        }

        const _url = `http://chuonghd.vantechdns.net/match-details/${encodeURIComponent(this.matchKey)}?accept=${this.bettingId}`
        this.shortLink(_url)
      }
      return this.isSharingBetting;
    }

    get shareText(): string {
      let _match: any;
      if (this.$route.params && this.$route.params.key) {
        _match = JSON.parse(atob(this.matchKey));
      } else {
        _match = {
          homeTeam: this.initData.homeTeam,
          awayTeam: this.initData.awayTeam,
          date: this.initData.date
        }
      }

      const _dateTime = moment(_match.date).local().format('MMM DD, YYYY - HH:mm A')

      return `Join my bet on Bether for the match ${_match.homeTeam} - ${_match.awayTeam} at ${_dateTime}`
    }

    set isDialog(v: any) {
      this.$emit('close-dialog', DIALOG_NAME.BETTING_SHARING)
    }

    get isSocial() {
      return this.initData && this.initData.key === DIALOG_NAME.SHARING_SOCIAL;
    }

    get message() {
      if (this.initData && this.initData.message) {
        return this.initData.message;
      }
      return '';
    }

    onCopy() {
      this.notify({
        mode: 'success',
        message: 'Copied your bet link'
      });
    }

    shortLink (url: string) {
      const BITLY_URL = 'https://api-ssl.bitly.com/v3/shorten?';
      const BITLY_LOGIN = "o_4nm0b7lfsb";
      const BITLY_KEY = "R_3acba2a6f39844c2adb685084688f6bd";

      axios.get(BITLY_URL, {
        params : {
          "format": "json",
          "apiKey": BITLY_KEY,
          "login": BITLY_LOGIN,
          "longUrl": url
        }
      })
        .then((response) => {
          if(response.status == 200) {
            this.sharePath = response.data.data.url;
          } else {
            console.log('Opps dude, status code != 200 :( ')
          }
        })
        .catch((error) => {
          console.log('Error! ' + error);
        });
    }
  }
</script>
