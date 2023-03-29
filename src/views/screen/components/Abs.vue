<template>
  <div class="abs-wrap">
    <div class="content">
      {{ list && list.desc }}
    </div>
    <ul class="list">
      <li
        v-for="(item, key) of items"
        :key="`abs-list-${key}`"
        class="item"
      >
        <div class="name textover">
          {{ item.name }}
        </div>
        <div
          class="num text-right textover"
          :class="item.unit ? 'fs-26' : 'fs-18'"
        >
          {{ item.value }}
          <span
            v-if="item.unit"
            class="unit"
          >
            {{ item.unit }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Abs',
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
.abs-wrap {
  height: 468px;
  .content {
    height: 75px;
    line-height: 25px;
    margin: 17px 12px 18px;
    font-size: 18px;
    font-family: AlibabaPuHuiTiM;
    color: #fff;
    overflow: hidden;
  }
  .list {
    .item {
      display: flex;
      height: 54px;
      padding: 0 12px 0 18px;
      background: rgba(28, 65, 61, .4);
      justify-content: space-between;
      align-items: center;
      position: relative;
      transition: all .3s;
      + .item {
        margin-top: 10px;
      }
      &:hover {
        background: #174543;
        &::before {
          content: '';
          position: absolute;
          top: 16px;
          left: -1px;
          width: 4px;
          height: 22px;
          background: #00FFBD;
        }
      }
      .name {
        flex: 2;
        height: 25px;
        line-height: 25px;
        font-size: 18px;
        font-family: AlibabaPuHuiTiM;
        color: #D7FFF6;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          top: -1px;
          left: 0;
          width: 14px;
          height: 1px;
          background: #0CA3B3;
        }
      }
      .num {
        max-width: 180px;
        font-family: FFDINPro-Medium, FFDINPro;
        font-weight: 500;
        color: #74FFD2;
        .unit {
          margin-left: 7px;
          font-size: 14px;
          font-family: AlibabaPuHuiTiR;
          color: #6FFFDF;
        }
      }
    }
  }
}
</style>
