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

const Colors = ['#5AD8A6', '#E8684A', '#5B8FF9']

export default {
  name: 'SmoothLine',
  props: {
    id: {
      type: String,
      default: 'SmoothLine'
    },
    className: {
      type: String,
      default: 'smooth-line'
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
      chart: null
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
          type: 'line',
          smooth: true,
          symbol: 'none',
          itemStyle: {
            color: Colors[key]
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: Colors[key]
            }, {
              offset: 1,
              color: 'transparent'
            }])
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
        legend: {
          data: that.legends,
          right: 6,
          top: 0,
          textStyle: {
            padding: [0, 0, 0, 9],
            color: {},
            fontFamily: 'AlibabaPuHuiTiR',
            fontSize: 14
          },
          itemGap: 20,
          itemWidth: 10,
          itemHeight: 15
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '15%',
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: that.labels,
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
    }
  }
}
</script>
