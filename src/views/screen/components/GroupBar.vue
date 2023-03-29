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

import { energyType, EnumMap } from '@/utils/typeEnum'

const Colors = ['#05FEB6', '#EA7E58', '#53C3FF']

export default {
  name: 'GroupBar',
  props: {
    id: {
      type: String,
      default: 'GroupBar'
    },
    className: {
      type: String,
      default: 'group-bar'
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
      type: Object,
      default: () => ({})
    },
    labels: {
      type: Array,
      default: () => ([])
    }
  },
  setup(){
    resize()
  },
  data() {
    return{
      chart: null,
      timer: null
    }
  },
  computed: {
    legends() {
      if (!Object.keys(this.chartData).length) {
        return []
      }

      let legends = []
      for (const key in this.chartData) {
        legends.push(EnumMap(energyType, Number(key)))
      }
      return legends
    },
    seriesOptions() {
     if (!Object.keys(this.chartData).length) {
        return []
      }

      let series = []
      const list = this.chartData
      for (const key in list) {
        series.push({
          name: EnumMap(energyType, Number(key)),
          type: 'bar',
          barWidth: 6,
          itemStyle: {
            color: Colors[key]
          },
          data: list[key]
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
        grid: {
          top: '15%',
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        legend: {
          data: that.legends,
          right: 0,
          top: 0,
          icon: 'rect',
          textStyle: {
            padding: [0, 0, 0, 10],
            color: {},
            fontFamily: 'AlibabaPuHuiTiR',
            fontSize: 14
          },
          itemGap: 16,
          itemWidth: 11,
          itemHeight: 6
        },
        tooltip: {
          trigger: 'axis'
        },
        dataZoom: {
          show: false,
          start: 0,
          end: 20,
          throttle: 3000
        },
        xAxis: {
          type: 'category',
          data: this.labels,
          axisLabel: {
            color: '#fff',
            fontWeight: 400,
            fontFamily: 'FFDINPro-Regular, FFDINPro',
            fontSize:14
          },
          axisLine: {
            lineStyle: {
              width: 2,
              color: '#115A65'
            }
          },
          axisTick: {
            inside: false,
            alignWithLabel: true,
            length: 5,
            lineStyle: {
              width: 1,
              color: '#00909F'
            }
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#08373E'
            }
          },
          axisLabel: {
            color: '#fff',
            fontWeight: 400,
            fontFamily: 'FFDINPro-Regular, FFDINPro',
            fontSize:14
          }
        },
        series: that.seriesOptions
      })

      function removing() {
        if (!that.chart) return false

        let options = that.chart.getOption()

        if (!options.series || !options.series.length) return false

        let data0 = options.series[0] && options.series[0].data
        let data1 = options.series[1] && options.series[1].data
        let data2 = options.series[2] && options.series[2].data

        if (data0 && data0.length > 6) {
          let prev0 = data0.shift()
          data0.push(prev0)
        }

        if (data1 && data1.length > 6) {
          let prev1 = data1.shift()
          data1.push(prev1)
        }

        if (data2 && data2.length > 6) {
          let prev2 = data2.shift()
          data2.push(prev2)
        }

        let xAxis = options.xAxis[0] && options.xAxis[0].data

        if (xAxis && xAxis.length > 6) {
          let prevX = options.xAxis[0].data.shift()
          options.xAxis[0].data.push(prevX)
        }

        that.chart.setOption(options)
      }

      function startTimer() {
        that.timer = setInterval(removing, 3100)
      }

      setTimeout(startTimer, 2000)
    }
  }
}
</script>
