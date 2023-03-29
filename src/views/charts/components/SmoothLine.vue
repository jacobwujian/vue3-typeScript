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

import { energyType, EnumMap } from '@/utils/typeEnum'

const Colors:any = ['#5AD8A6', '#E8684A', '#5B8FF9']

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
        title: {
          show: !!that.unit,
          subtext: that.unit,
          right: 0
        },
        legend: {
          data: that.legends,
          left: 6,
          top: 20,
          icon: 'rect',
          textStyle: {
            color: '#8C8C8C'
          },
          itemGap: 20,
          itemWidth: 10,
          itemHeight: 15
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: 65,
          left: '2%',
          right: '2%',
          bottom: 0,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            color: 'rgba(0, 0, 0, .45)'
          },
          axisTick: {
            inside: false,
            length: 4,
            lineStyle: {
              width: 1,
              color: 'rgba(0, 0, 0, 0.45)',
              opacity: .2
            }
          },
          axisLine: {
            lineStyle: {
              width: 2,
              color: 'rgba(0, 0, 0, 0.15)',
              opacity: .2
            }
          },
          data: that.labels
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: 'rgba(0, 0, 0, .45)'
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(0, 0, 0, .15)',
              opacity: .2
            }
          }
        },
        series: that.seriesOptions
      })
    }
  }
}
</script>
