<template>
  <div
    class="trade-doughnut-wrap"
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

const TradeColors = ['#5A88DE', '#4FDEA8', '#4F6381', '#F1E28C', '#FF7959', '#5DAECE', '#00BED1', '#D98946', '#FF7959', '#5DAECE', '#00BED1']

const Ring = '../../../static/screen/ring2.png'

export default {
  name: 'TradeDoughnut',
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
    resize()
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
        color : TradeColors,
        title: {
          show: !!that.title,
          zlevel: 0,
          text: '{a|' + that.title + '}\n{b|' + that.total + '}',
          textStyle: {
            rich: {
              a: {
                lineHeight: 20,
                color: '#fff',
                fontSize: 14,
                fontFamily: 'AlibabaPuHuiTiR',
                opacity: .8
              },
              b: {
                lineHeight: 32,
                color: '#fff',
                fontSize: 26,
                fontFamily: 'FFDINPro-Medium, FFDINPro',
                fontWeight: 500
              }
            }
          },
          top: 74,
          left: '48%',
          textAlign: 'center'
        },
        legend: {
          left: 'center',
          bottom: 0,
          data: this.labels,
          icon: 'rect',
          textStyle: {
            padding: [0, 0, 0, 7],
            color: '#fff',
            fontFamily: 'AlibabaPuHuiTiR',
            fontSize: 16
          },
          itemHeight: 22,
          itemGap: 20,
          itemWidth: 10,
          itemHeight: 10,
          selectedMode: false
        },
        graphic: {
          elements: [{
            type: 'image',
            z: 1,
            style: {
              image: Ring,
              width: 210,
              height: 162
            },
            left: 'center',
            top:  29
          }]
        },
        series: [{
          id: 'series0',
          type: 'pie',
          radius: [63, 74],
          center: ['50%', 110],
          itemStyle: {
            borderColor: '#0A1934',
            borderWidth: 4,
            color: function({ dataIndex }) {
              return TradeColors[dataIndex]
            }
          },
          label: {
            show: false,
            position: 'center',
            formatter: '占比：{d}%',
            fontSize: 14,
            color: '#fff',
            fontFamily: 'AlibabaPuHuiTiR',
            opacity: .8
          },
          emphasis: {
            label: {
              show: true,
              verticalAlign: 'top',
              padding: [17, 0, 0, 0]
            },
            scale: false
          },
          labelLine: {
            show: false
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
.trade-doughnut-wrap {
  position: relative;
  .doughnut {
    width: 100%;
    height: 100%;
  }
  .animate-ring {
    position: absolute;
    top: 0;
    left: 50%;
    width: 117px;
    height: 117px;
    margin-left: -58.5px;
    margin-top: 51.5px;
    background: url(../../../static/screen/ring.png) no-repeat center;
    background-size: 100%;
    animation: ringTurning 10s linear infinite;
    z-index: 1;
  }
}
</style>
