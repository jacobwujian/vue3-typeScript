<template>
  <ul class="screen-list">
    <li
      v-for="(item, key) in items"
      :key="`capacity-${key}`"
      class="item"
    >
      <div class="name textover">
        {{ item.name }}
      </div>
      <div class="line" />
      <div class="values">
        <span
          class="num textover"
          :title="item.value"
        >{{ item.value }}</span>
        <span class="unit">{{ item.unit }}</span>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'CapacityList',
  props: {
    list: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    items() {
      let items = []
      for (const key in this.list) {
        if (!key || !key.startsWith('item')) {
          continue
        }

        items.push(this.list[key])
      }

      return items
    }
  }
}
</script>

<style lang='less' scoped>
.screen-list {
  height: 146px;
  margin-top: 12px;
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    + .item { margin-top: 10px; }
  }
  .name {
    max-width: 176px;
    height: 22px;
    font-size: 16px;
    font-family: AlibabaPuHuiTiM;
    color: #F1FFFC;
    line-height: 22px;
  }
  .line {
    flex: 1;
    height: 1px;
    margin-left: 4px;
    background: #289A8B;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: 0;
      width: 2px;
      height: 5px;
      background: #12D7A4;
    }
  }
  .values {
    width: 168px;
    .num {
      display: inline-block;
      width: 129px;
      height: 36px;
      line-height: 36px;
      padding: 0 6px;
      background: #021C19;
      border: 2px solid #05625E;
      text-align: right;
      font-size: 24px;
      font-family: FFDINPro-Medium, FFDINPro;
      font-weight: 500;
      position: relative;
      color: #fff;
      &::before {
        content: '';
        position: absolute;
        top: 12px;
        left: -3px;
        width: 3px;
        height: 7px;
        background: #00FFBD;
      }
    }
    .unit {
      margin-left: 5px;
      font-size: 12px;
      font-family: SourceHanSansCN-Bold, SourceHanSansCN;
      font-weight: bold;
      color: #F1FFFC;
    }
  }
}
</style>
