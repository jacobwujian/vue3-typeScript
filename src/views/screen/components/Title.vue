<template>
  <div class="screen-title">
    <img
      class="i-label"
      src="../../../static/screen/i-label.png"
    >
    <div class="name">
      {{ title }}
      <i
        v-if="isShowTri"
        :class="isUp ? 'up' : ''"
        class="i-tri iconfont iconjiantou1"
        @click="$emit('click')"
      />
    </div>
    <div class="icons">
      <i class="i-reac blue" />
      <i class="i-reac orange" />
      <i class="i-reac blue" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Title',
  props: {
    title: {
      type: String,
      default: ''
    },
    isShowTri: {
      type: Boolean,
      default: false
    },
    isUp: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang='less' scoped>
.screen-title {
  display: flex;
  width: 100%;
  height: 46px;
  padding: 0 15px;
  background: #0d4841;
  border-top: 2px solid #289A8B;
  align-items: center;
  .i-label {
    width: 16px;
    height: 25px;
    margin-right: 14px;
  }
  .name {
    color: #D7FFF6;
    text-align: justify;
    font-family: AlibabaPuHuiTiM;
    font-size: 22px;
  }
  .i-tri {
    display: inline-block;
    vertical-align: middle;
    font-size: 12px;
    transform: rotate(180deg);
    transition: all .3s;
    &.up {
      transform: rotate(0deg);
    }
  }
  .icons {
    width: 36px;
    margin-left: auto;
    .i-reac {
      display: inline-block;
      width: 6px;
      height: 6px;
      margin-left: 6px;
      &.blue { background: #16E8FF; }
      &.orange { background: #FF7B41; }
    }
  }
}
</style>
