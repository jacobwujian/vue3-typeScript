<template>
  <svg
    class="svg-path-wrap"
    width="1600"
    height="4"
  >
    <path
      class="path-line"
      d="M0 1 L1600 1"
      stroke="#05625E"
      stroke-width="4"
      fill="none"
    />

    <path
      class="move-line"
      d="M0 1 L1600 1"
      stroke="#48DCB6"
      stroke-width="4"
      stroke-dasharray="67,733"
      fill="none"
    />
  </svg>
</template>

<script>
export default {
  name: 'MoveLineBottom'
}
</script>

<style lang='less' scoped>
.move-line {
  animation: move 10s linear infinite;
}

@keyframes move {
  0% {
    stroke-dashoffset: 800;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
</style>
