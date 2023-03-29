<template>
  <div class="sub-title">
    <i class="line-left" />
    <span class="name">{{ title }}</span>
    <i class="line-right" />
  </div>
</template>

<script>
export default {
  name: 'SubTitle',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang='less' scoped>
.sub-title {
  display: flex;
  height: 30px;
  align-items: center;
  justify-content: center;
  .line-left,
  .line-right {
    width: 805px;
    height: 1px;
  }

  .line-left {
    background: linear-gradient(90deg, rgba(151, 151, 151, .1) 10%, rgba(13, 133, 105, 1) 100%);
    position: relative;
    &::after {
      content: '';
      position: absolute;
      top: -2px;
      right: -1px;
      width: 6px;
      height: 6px;
      background: #fff;
      border-radius: 50%;
      border: 2px solid #18BF99;
    }
  }

  .line-right {
    background: linear-gradient(270deg, rgba(151, 151, 151, .1) 10%, rgba(13, 133, 105, 1) 100%);
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -1px;
      width: 6px;
      height: 6px;
      background: #fff;
      border-radius: 50%;
      border: 2px solid #18BF99;
    }
  }

  .name {
    line-height: 30px;
    margin: 0 16px;
    font-size: 22px;
    font-family: AlibabaPuHuiTiM;
    color: #D7FFF6;
  }
}
</style>
