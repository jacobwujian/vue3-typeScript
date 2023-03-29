<template>
  <a-space class="star-wrap">
    <a-icon
      v-for="index in numberCount"
      :key="index"
      type="star"
      theme="filled"
      :style="{ fontSize, color }"
    />
  </a-space>
</template>

<script>
export default {
  props: {
    count: {
      type: [Number, String],
      default: 0
    },
    fontSize: {
      type: String,
      default: '20px'
    },
    color: {
      type: String,
      default: '#fadb14'
    }
  },
  computed: {
    numberCount() {
      return Number(this.count)
    }
  }
}
</script>
