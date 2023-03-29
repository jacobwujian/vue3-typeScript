<template>
  <svg
    class="svg-path-wrap"
    width="158"
    height="16"
  >
    <path
      class="path-line"
      d="M0 14 L79 14 L95 1 L156 1"
      stroke="#05625E"
      stroke-width="2"
      fill="none"
    />

    <path
      class="move-line"
      d="M0 14 L79 14 L95 1 L156 1"
      stroke="#48DCB6"
      stroke-width="2"
      stroke-dasharray="14,170"
      fill="none"
    />
  </svg>
</template>

<script>
export default {
  name: 'MoveLineRight'
}
</script>

<style lang='less' scoped>
.move-line {
  animation: move 6s linear infinite;
}

@keyframes move {
  0% {
    stroke-dashoffset: 360;
  }
  100% {
    stroke-dashoffset: 40;
  }
}
</style>
