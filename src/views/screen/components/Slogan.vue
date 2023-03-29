<template>
  <div class="slogan">
    <p
      v-for="(val, index) of subTitle"
      :key="`p-${index}`"
    >
      {{ val }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'Slogan',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    subTitle() {
      let arr = []

      if (this.title) {
        arr = this.title.split(/\r?\n/)
      }

      return arr
    }
  }
}
</script>

<style lang='less' scoped>
.slogan {
  height: 108px;
  margin-top: 24px;
  padding-top: 17px;
  background: url(../../../static/screen/title-bg.png) no-repeat center;
  overflow: hidden;
  p {
    width: 350px;
    height: 33px;
    line-height: 33px;
    margin: 0 auto;
    text-align: center;
    font-size: 24px;
    font-family: AlibabaPuHuiTiM;
    color: #FFFFFF;
    overflow: hidden;
    + p { margin-top: 11px; }
    span {
      margin: 0 8px;
    }
  }
}
</style>
