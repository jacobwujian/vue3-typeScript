<template>
  <div
    :id="id"
    :class="className"
    :style="{ width, height }"
  />
</template>

<script>
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
    title: {
      type: String,
      default: ''
    },
    grid: {
      type: Object,
      default: () => ({
        top: '4%',
        left: '2%',
        right: '2%',
        bottom: '2%',
        containLabel: true
      })
    },
    barColor: {
      type: String,
      default: 'rgba(24, 234, 181, .8)'
    },
    chartData: {
      type: Array,
      default: () => ([])
    }
  },
  setup(){
    resize()
  },
  data() {
    return{
      chart: null
    }
  },
  computed: {
    labels() {
      return this.chartData.map(item => item.name)
    },
    values() {
      return this.chartData.map(item => item.value)
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
      const that = this
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption({
        grid: that.grid,
        title: {
          show: !!that.title,
          text: that.title,
          top: 0,
          left: -5,
          textStyle: {
            height: 27,
            lineHeight: 27,
            color: '#D7FFF6',
            fontSize: 20,
            fontFamily: 'AlibabaPuHuiTiM'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          show: false
        },
        yAxis: [{
          triggerEvent: true,
          show: true,
          inverse: true,
          data: this.labels,
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        }, {
          triggerEvent: true,
          show: true,
          inverse: true,
          data: this.values,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            verticalAlign: 'bottom',
            lineHeight: 22,
            align: 'right',
            color: '#DFFEFF',
            fontSize: 18,
            fontFamily: 'FFDINPro-Medium, FFDINPro',
            fontWeight: 500
          }
        }],
        series: [
          {
            data: this.values,
            type: 'bar',
            label: {
              show: true,
              position: ['0', '-19x'],
              color: '#fff',
              fontSize: 16,
              fontFamily: 'AlibabaPuHuiTiM',
              formatter: function(a, b) {
                return a.name
              }
            },
            showBackground: true,
            backgroundStyle: {
              color: '#1C313B',
              opacity: .8
            },
            barWidth: 3,
            itemStyle: {
              color: that.barColor
            }
          }
        ]
      })
    }
  }
}
</script>
