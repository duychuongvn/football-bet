<template src="./footer.component.html"></template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  @Component
  export default class FooterComponent extends Vue {
    private socialIcons: Array<Object> = [
      {
        color: 'blue darken-3',
        name: 'fab fa-facebook-f',
        tooltip: 'Facebook'
      },
      {
        color: 'light-blue darken-1',
        name: 'fab fa-twitter',
        tooltip: 'Twitter'
      },
      {
        color: 'red darken-1',
        name: 'fab fa-google-plus-g',
        tooltip: 'Google'
      },
      {
        color: 'light-blue darken-1',
        name: 'fab fa-telegram-plane',
        tooltip: 'Telegram'
      },
      {
        color: 'teal lighten-1',
        name: 'fas fa-envelope',
        tooltip: 'Support'
      }
    ]
  }
</script>