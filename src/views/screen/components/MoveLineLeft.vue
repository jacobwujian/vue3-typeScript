<template>
  <svg
    class="svg-path-wrap"
    width="561"
    height="16"
  >
    <path
      class="path-line"
      d="M0 1 L444 1 L462 15 L561 15"
      stroke="#05625E"
      stroke-width="2"
      fill="none"
    />

    <path
      class="move-line"
      d="M0 1 L444 1 L462 15 L561 15"
      stroke="#48DCB6"
      stroke-width="2"
      stroke-dasharray="14,267"
      fill="none"
    />
  </svg>
</template>

<script>
export default {
  name: 'MoveLineLeft'
}
</script>

<style lang='less' scoped>
.move-line {
  animation: move 8s linear infinite;
}

@keyframes move {
  0% {
    stroke-dashoffset: 561;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
</style>
