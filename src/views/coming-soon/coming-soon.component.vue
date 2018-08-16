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

    private socialIcons: Array<Object> = [
      {
        color: 'blue darken-3',
        name: 'fab fa-telegram-plane',
        tooltip: 'telegram'
      },
      {
        color: 'light-blue darken-1',
        name: 'fab fa-twitter',
        tooltip: 'Twitter'
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
        mailto: 'mailto:info@bether.bet'
      }
    ]

    mounted() {
      require('@/plugins/demo.js')
    }
  }
</script>
