<template src="./image.component.html"></template>
<style lang="scss" scoped src="./image.component.scss"></style>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'
  import { uiAvatars } from '@/shared/utils/ui-avatars'

  @Component
  export default class ImageComponent extends Vue {
    @Prop({ default: '100px' }) public imgWidth!: string
    @Prop({ default: '100px' }) public imgHeight!: string
    @Prop({ default: 'image' }) public imgName!: string
    @Prop() public imgPath!: string

    private isLoading: boolean = true
    public isError: boolean = false

    private no_img = require('@/assets/images/no-images.png');

    get imagePath() {
      return `url('${this.isError ? this.no_img : this.imgPath}')`
    }

    imageLoading() {
      this.isLoading = false
    }

    imageError() {
      this.isError = true;
    }
  }
</script>
