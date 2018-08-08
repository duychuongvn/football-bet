<template src="./image.component.html"></template>
<style lang="scss" scoped src="./image.component.scss"></style>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'
  import { uiAvatars } from '@/shared/utils/ui-avatars'

  @Component
  export default class ImageComponent extends Vue {
    @Prop({ default: '100px' }) private imgWidth!: string
    @Prop({ default: '100px' }) private imgHeight!: string
    @Prop({ default: 'image' }) private imgName!: string
    @Prop() private imgPath!: string

    private isLoading: boolean = true

    get imagePath() {
      return `url('${this.imgPath}')`
    }

    imageLoading() {
      this.isLoading = false
    }

    imageError() {
      this.imgPath = uiAvatars(this.imgName);
    }
  }
</script>
