<template>
  <div
    class="capacity-doughnut-wrap"
    :style="{ width, height }"
  >
    <div class="animate-ring" />

    <div
      :id="id"
      class="doughnut"
    />
  </div>
</template>

<script>
import echarts from '@/plugins/echarts'
import {resize} from '@/mixins/resize'

const CapacityColors = ['#08F2B5', '#EA7E58', '#26D6E9', '#C4FFFE']
const Ring = '../../../../static/screen/ring2.png'

export default {
  name: 'CapacityDoughnut',
  props: {
    id: {
      type: String,
      default: 'Doughnut'
    },
    title: {
      type: String,
      default: ''
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
      default: () => ([])
    }
  },
  setup(){
    resize(null)
  },
  data() {
    return {
      chart: null,
      currentIdx: 0
    }
  },
  computed: {
    labels() {
      return this.chartData.map(item => item.name)
    },
    values() {
      return this.chartData.map(item => item.value)
    },
    total() {
      if (this.values.length) {
        return this.values.reduce((a, b) => a + b * 1)
      } else {
        return 0
      }
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
        color : CapacityColors,
        legend: {
          left: 'center',
          bottom: 20,
          data: this.labels,
          icon: 'rect',
          textStyle: {
            padding: [0, 0, 0, 7],
            color: '#fff',
            fontFamily: 'AlibabaPuHuiTiR',
            fontSize: 16
          },
          itemGap: 24,
          itemWidth: 10,
          itemHeight: 10,
          selectedMode: false,
          formatter: (name) => {
            return name + (that.chartData.find(item => item.name === name).percentage)+ '%'
          }
        },
        graphic: {
          elements: [{
            type: 'image',
            z: 1,
            style: {
              image: Ring,
              width: 197,
              height: 182
            },
            left: 'center',
            top:  17.5
          }]
        },
        series: [{
          id: 'series0',
          type: 'pie',
          radius: [60, 71],
          center: ['50%', 110],
          itemStyle: {
            borderColor: '#0A1934',
            borderWidth: 4,
            color: function({ dataIndex }) {
              return CapacityColors[dataIndex]
            }
          },
          label: {
            show: false,
            position: 'center',
            verticalAlign: 'middle',
            padding: [10, 0, 0, 0],
            formatter: function({ name, percent }) {
              return '{per|' + percent + '%}\n{name|' + name + '}'
            },
            rich: {
              per: {
                lineHeight: 32,
                color: '#fff',
                fontSize: 26,
                fontFamily: 'FFDINPro-Medium, FFDINPro',
                fontWeight: 500
              },
              name: {
                lineHeight: 20,
                color: '#fff',
                fontSize: 14,
                fontFamily: 'AlibabaPuHuiTiR',
                opacity: .8
              }
            }
          },
          labelLine: {
            show: false
          },
          emphasis: {
            scale: false,
            label: {
              show: true
            }
          },
          data: this.chartData
        }]
      })

      this.chart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: this.currentIdx })

      this.chart.on('mouseover', (e) => {
        if (e.seriesId === 'series0') {
          this.chart.dispatchAction({ type: 'downplay', seriesIndex: 0, dataIndex: this.currentIdx })
          this.chart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: e.dataIndex })
          this.currentIdx = e.dataIndex
        }
      })

      this.chart.on('mouseout', (e) => {
        if (e.seriesId === 'series0') {
          this.chart.dispatchAction({ type: 'downplay', seriesIndex: 0, dataIndex: this.currentIdx })
          this.chart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: e.dataIndex })
          this.currentIdx = e.dataIndex
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.capacity-doughnut-wrap {
  position: relative;
  .doughnut {
    width: 100%;
    height: 100%;
  }
  .animate-ring {
    position: absolute;
    top: 0;
    left: 50%;
    width: 156px;
    height: 156px;
    margin-left: -78px;
    margin-top: 31px;
    background: url(../../../static/screen/ring.png) no-repeat center;
    background-size: 100%;
    animation: ringTurning 12s linear infinite;
  }
}
</style>
