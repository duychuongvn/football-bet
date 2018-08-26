<template src="./coming-soon.component.html"></template>
<style lang="scss" scoped src="./coming-soon.component.scss"></style>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  @Component({
    components: {
      'flip-countdown': () => import('@/components/flip-countdown/flip-countdown.component.vue')
    }
  })
  export default class ComingSoonPage extends Vue {

    public deadlineTime = '2018/09/08 00:00:00';

    private socialIcons: Array<Object> = [
      {
        color: 'blue darken-3',
        name: 'fab fa-telegram-plane',
        tooltip: 'Telegram',
        link_social: 'https://t.me/joinchat/JmFIJw1TjIyq43r_3c-c1Q',
        target: '_blank'
      },
      {
        color: 'light-blue darken-1',
        name: 'fab fa-twitter',
        tooltip: 'Twitter',
        link_social: 'https://twitter.com/betbether',
        target: '_blank'
      },
      {
        color: 'blue-grey darken-3',
        name: 'fab fa-github',
        tooltip: 'Github'
      },
      {
        color: 'teal lighten-1',
        name: 'fas fa-envelope',
        tooltip: 'Support',
        link_social: 'mailto:info@bether.bet',
        target: ''
      }
    ];
  }
</script>
