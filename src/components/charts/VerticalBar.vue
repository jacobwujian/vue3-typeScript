<template>
  <div :id="id" :class="className" :style="{ width, height }" />
</template>

<script>
import echarts from '@/plugins/echarts'
import {resize} from '@/mixins/resize'

export default {
  name: 'VerticalBar',
  props: {
    id: {
      type: String,
      default: 'VerticalBar'
    },
    className: {
      type: String,
      default: 'vertical-bar'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    // 传入的坐标
    propLabels: {
      type: Array,
      default: () => []
    },
    // 传入的值
    propValues: {
      type: Array,
      default: () => []
    },
    chartData: {
      type: Array,
      default: () => []
    },
    unit: {
      type: String,
      default: ''
    },
    // 是否加趋势折线
    trendLine: {
      type: Boolean,
      default: false
    }
  },
  setup(){
    resize()
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    labels() {
      if (this.propLabels && this.propLabels.length) {
        return this.propLabels
      }

      return this.chartData.map(item => item.name)
    },
    values() {
      if (this.propValues && this.propValues.length) {
        return this.propValues
      }

      return this.chartData.map(item => item.value)
    },
    seriesOptions() {
      let series = [
        {
          data: this.values,
          type: 'bar',
          barWidth: 15,
          itemStyle: {
            color: 'rgba(91, 143, 249, .85)'
          }
        }
      ]

      if (this.trendLine) {
        series.push({
          data: this.values,
          type: 'line',
          lineStyle: {
            color: '#E8684A'
          }
        })
      }

      return series
    }
  },
  watch: {
    chartData() {
      this.$nextTick(() => {
        this.chart.dispose()
        this.chart = null
        this.initChart()
      })
    },
    propValues() {
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
          top: 50,
          left: '2%',
          right: '2%',
          bottom: 0,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.labels,
          axisLabel: {
            color: 'rgba(0, 0, 0, .45)',
            lineHeight: 16,
            formatter: function(value) {
              const valArr = value.split(' ')
              if (valArr && valArr.length) {
                return valArr.join('\n')
              }
              return value
            },
            showMaxLabel: true
          },
          axisTick: {
            alignWithLabel: true,
            interval: 0,
            rotate: -30,
            margin: -15
          },
          axisLine: {
            lineStyle: {
              width: 2,
              color: 'rgba(0, 0, 0, 0.15)',
              opacity: 0.2
            },

            interval: 0,
            rotate: 40
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: 'rgba(0, 0, 0, .15)',
              opacity: 0.2
            }
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            color: 'rgba(0, 0, 0, .45)'
          }
        },
        series: that.seriesOptions
      })
    }
  }
}
</script>
