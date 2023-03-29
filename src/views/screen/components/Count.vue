<template>
  <div class="count">
    <div class="title">
      <img
        class="i-label"
        src="../../../static/screen/i-label.png"
      >
      绿色电力积分发行数量
    </div>

    <a-statistic
      class="num"
      :value="num"
      :value-style="{
        color: '#D7FFF6',
        fontSize: '46px',
        fontFamily: 'FFDINPro-Medium, FFDINPro'
      }"
    />
  </div>
</template>

<script>
export default {
  name: 'Count',
  props: {
    num: {
      type: [Number, String],
      default: 0
    }
  }
}
</script>

<style lang='less' scoped>
.count {
  width: 286px;
  .title {
    height: 30px;
    line-height: 30px;
    font-size: 22px;
    font-family: AlibabaPuHuiTiM;
    color: #D7FFF6;
    .i-label {
      display: inline-block;
      width: 16px;
      height: 25px;
      margin: -4px 8px 0 0;
      vertical-align: middle;
    }
  }
  .num {
    height: 55px;
    line-height: 55px;
    margin-top: 5px;
    font-family: FFDINPro-Medium, FFDINPro;
    font-weight: 500;
  }
}
</style>
