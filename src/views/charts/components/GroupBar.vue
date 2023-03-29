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
      default: () => <any>{}
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
        title: {
          show: !!that.unit,
          subtext: that.unit,
          top: 0,
          right: 30
        },
        grid: {
          top: '15%',
          left: '2%',
          right: 48,
          bottom: 0,
          containLabel: true
        },
        legend: {
          data: that.legends,
          orient: 'vertical',
          right: -4,
          top: 40,
          icon: 'rect',
          textStyle: {
            color: '#8C8C8C'
          },
          itemGap: 4,
          itemWidth: 8,
          itemHeight: 8
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: that.labels,
          axisLabel: {
            color: 'rgba(0, 0, 0, 0.45)'
          },
          axisLine: {
            lineStyle: {
              width: 2,
              color: 'rgba(0, 0, 0, 0.15)',
              opacity: .2
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: 'rgba(0, 0, 0, .15)',
              opacity: .2
            }
          },
          axisLabel: {
            color: 'rgba(0, 0, 0, 0.45)'
          }
        },
        series: that.seriesOptions
      })
    }
  }
}
</script>
