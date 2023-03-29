<template>
  <div class="areas-wrap">
    <div class="title">
      各市核发量
    </div>
    <ul class="list">
      <li
        v-for="(item, key) in list"
        :key="key"
        class="item"
      >
        <span class="name">{{ item.name }}</span>
        <span class="separator">
          <i class="s1" />
          <i class="s2" />
        </span>
        <span
          class="value textover"
          :title="item.value"
        >{{ item.value }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AreasList',
  props: {
    list: {
      type: Array,
      default: () => ([])
    }
  }
}
</script>

<style lang='less' scoped>
.areas-wrap {
  width: 100%;
  .title {
    height: 27px;
    line-height: 27px;
    padding-left: 8px;
    font-size: 20px;
    font-family: AlibabaPuHuiTiM;
    color: #D7FFF6;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 6px;
      left: 0;
      width: 3px;
      height: 16px;
      background: #50E3C2;
    }
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    height: 102px;
  }
  .item {
    display: flex;
    width: 172px;
    height: 40px;
    line-height: 40px;
    margin: 11px 0 0 10px;
    align-items: center;
    text-align: center;
    &:nth-child(6n - 5) {
      margin-left: 0;
    }
  }
  .name {
    width: 58px;
    height: 40px;
    padding: 0 5px;
    background: rgba(0, 56, 54, .5);
    font-size: 16px;
    font-family: AlibabaPuHuiTiM;
    color: #fff;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 4px;
      left: -1px;
      width: 1px;
      height: 29px;
      background: #50E3C2;
    }

  }
  .value {
    width: 110px;
    height: 40px;
    line-height: 44px;
    padding: 0 10px;
    background: #003836;
    font-size: 18px;
    font-family: FFDINPro-Medium, FFDINPro;
    font-weight: 500;
    color: #D7FFF6;
    word-break: break-all;
  }
  .separator {
    width: 4px;
    height: 40px;
    .s1,
    .s2 {
      display: block;
      width: 100%;
      height: 1px;
      background: #003836;
    }
    .s1 { margin-top: 9px; }
    .s2 { margin-top: 22px; }
  }
}
</style>
