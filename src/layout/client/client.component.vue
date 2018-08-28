<template src="./client.component.html"></template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Action, Getter } from 'vuex-class';

  import { DIALOG_NAME } from '@/shared/enums/dialog';

  @Component({
    components: {
      'footercomp': () => import('@/layout/footer/footer.component.vue'),
      'headcomp': () => import('@/layout/header/header.component.vue'),
      'dialog-base': () => import('@/components/dialog-base/dialog-base.component.vue'),
      'notify-comp': () => import('@/components/notifications/notifications.component.vue')
    }
  })
  export default class Client extends Vue {

    @Action('openDialog', { namespace: 'dialog' }) openDialog: any;
    @Action('registerWeb3', { namespace: 'web3' }) registerWeb3: any;
    @Getter('isAccount', { namespace: 'web3' }) isAccount!: boolean;

    @Action('initContract', { namespace: 'solobet' }) initContract: any;

    // Init App
    created() {
      this.initProgressBar();
      this.registerWeb3();
      this.initContract();
    }

    get isHeader(): boolean {
      return this.$route.meta && this.$route.meta.noHeader ? false : true
    }

    initProgressBar() {
      //  [App.vue specific] When App.vue is first loaded start the progress bar
      Vue.prototype.$Progress.start();
      //  hook the progress bar to start before we move router-view
      this.$router.beforeEach((to, from, next) => {
        //  does the page we want to go to have a meta.progress object
        if (to.meta.progress !== undefined) {
          let meta = to.meta.progress;
          // parse meta tags
          Vue.prototype.$Progress.parseMeta(meta);
        }
        //  start the progress bar
        Vue.prototype.$Progress.start();
        //  continue to next page
        next();
      });
      //  hook the progress bar to finish after we've finished moving router-view
      this.$router.afterEach((to, from) => {
        //  finish the progress bar
        Vue.prototype.$Progress.finish();
      })
    }
  }
</script>
