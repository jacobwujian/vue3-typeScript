<template>
  <div
    :id="id"
    :class="className"
    :style="{ width, height }"
  />
</template>

<script lang="ts">
import echarts from '@/plugins/echarts'
import {resize} from '@/mixins/resize'

export default {
  name: 'HorizontalBar',
  props: {
    id: {
      type: String,
      default: 'HorizontalBar'
    },
    className: {
      type: String,
      default: 'horizonta-bar'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    chartData: {
      type: Array,
      default: () => <any>[]
    },
    unit: {
      type: String,
      default: ''
    }
  },
  setup(){
    resize(null)
  },
  data() {
    return{
      chart: null
    }
  },
  computed: {
    labels() {
      return this.chartData.map((item:any) => item.name)
    },
    values() {
      return this.chartData.map((item:any) => item.value)
    }
  },
  watch: {
    chartData() {
      this.$nextTick(() => {
        this.chart.dispose()
        this.chart = null
        this.initChart()
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      let that = this
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption({
        title: {
          show: !!that.unit,
          subtext: that.unit,
          right: 0
        },
        grid: {
          top: '15%',
          left: '2%',
          right: '2%',
          bottom: 0,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLabel: {
            show: true,
            color: 'rgba(0, 0, 0, .6)'
          }
        },
        yAxis: {
          type: 'category',
          data: this.labels,
          axisLabel: {
            color: 'rgba(0, 0, 0, .6)'
          },
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            data: this.values,
            type: 'bar',
            barWidth: 6,
            itemStyle: {
              color: '#5AD8A6'
            }
          }
        ]
      })
    }
  }
}
</script>
