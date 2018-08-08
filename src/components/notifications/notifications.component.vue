<template src="./notifications.component.html"></template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, Getter } from 'vuex-class';

@Component
export default class NotificationsComponent extends Vue {

  @Getter('notifyOpen', { namespace: 'notify' }) notifyOpen: any
  @Getter('notifyObj', { namespace: 'notify' }) notifyObj: any

  public notify: boolean = false

  get notifyIcon() {
    switch (this.notifyObj.mode) {
      case 'success':
        return 'fas fa-check-circle'
      case 'error':
        return 'fas fa-exclamation-circle'
      case 'warning':
        return 'fas fa-exclamation-triangle'
      case 'info':
        return 'fas fa-info-circle'
    }
  }

  get notifyColor() {
    switch (this.notifyObj.mode) {
      case 'success':
        return 'teal lighten-2'
      case 'error':
        return 'red lighten-2'
      case 'warning':
        return 'yellow darken-3'
      case 'info':
        return 'blue lighten-1'
    }
  }

  @Watch('notifyOpen')
  getNotifyOpen (newVal: any, oldVal: any) {
    this.notify = newVal
  }
}
</script>