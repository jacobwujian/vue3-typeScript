<template>
  <svg
    class="svg-path-wrap"
    :width="width"
    height="4"
  >
    <path
      class="path-line"
      d="M0 1 L400 1"
      stroke="#05625E"
      stroke-width="4"
      fill="none"
    />

    <path
      class="move-line"
      d="M0 1 L400 1"
      stroke="#48DCB6"
      stroke-width="4"
      stroke-dasharray="17,383"
      fill="none"
    />
  </svg>
</template>

<script>
export default {
  name: 'MoveLineTop',
  props: {
    width: {
      type: [String, Number],
      default: 400
    }
  }
}
</script>

<style lang='less' scoped>
.move-line {
  animation: move 8s linear infinite;
}

@keyframes move {
  0% {
    stroke-dashoffset: 400;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
</style>
