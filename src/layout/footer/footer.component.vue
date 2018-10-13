<template src="./footer.component.html"></template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  @Component
  export default class FooterComponent extends Vue {
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
      // {
      //   color: 'blue-grey darken-3',
      //   name: 'fab fa-github',
      //   tooltip: 'Github',
      //   link_social: 'https://twitter.com/betbether',
      //   target: '_blank'
      // },
      {
        color: 'teal lighten-1',
        name: 'fas fa-envelope',
        tooltip: 'Support',
        link_social: 'mailto:info@bether.bet'
      }
    ]
  }
</script>
