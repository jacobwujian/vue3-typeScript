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
import geoJson from '@/static/geojson/ZJ.json'

const AreaOptions = {
  '杭州市': {
    color: 'rgba(14, 134, 145, .9)',
    position: { left: 0, top: 80 }
  },
  '湖州市': {
    color: 'rgba(21, 90, 114, .9)',
    position: { left: 0, top: 10 }
  },
  '嘉兴市': {
    color: 'rgba(41, 154, 131, .9)',
    position: { right: 50, top: 0 }
  },
  '绍兴市': {
    color: 'rgba(0, 151, 193, .9)',
    position: { right: 0, top: 120 }
  },
  '宁波市': {
    color: 'rgba(132, 97, 165, .9)',
    position: { right: 0, top: 130 }
  },
  '衢州市': {
    color: 'rgba(21, 114, 93, .9)',
    position: { left: 0, top: 130 }
  },
  '金华市': {
    color: 'rgba(26, 140, 82, .9)',
    position: { right: 100, top: 130 }
  },
  '台州市': {
    color: 'rgba(0, 85, 133, .9)',
    position: { right: 50, top: 130 }
  },
  '丽水市': {
    color: 'rgba(20, 103, 133, .9)',
    position: { left: 0, top: 130 }
  },
  '温州市': {
    color: 'rgba(21, 114, 93, .9)',
    position: { right: 80, top: 130 }
  },
  '舟山市': {
    color: 'rgba(49, 151, 132, .9)',
    position: { right: -20, top: 80 }
  }
}

export default {
  name: 'Map',
  props: {
    id: {
      type: String,
      default: 'Map'
    },
    className: {
      type: String,
      default: 'map'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '410px'
    },
    chartData: {
      type: Array,
      default: () => ([])
    },
    // 散点比例 默认 1:1000
    proportion: {
      type: [String, Number],
      default: 1000
    }
  },
  setup(){
    resize()
  },
  data() {
    return{
      chart: null,
      geoJson,
      points: []
    }
  },
  computed: {
    values() {
      let arr = []
      for (const item of this.chartData) {
        arr.push({
          ...item,
          itemStyle: {
            areaColor: AreaOptions[item.name].color
          }
        })
      }

      return arr
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
      echarts.registerMap('ZJ', geoJson)
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          extraCssText: 'padding: 0; background-color: transparent; border-color: transparent;',
          position: function(point, params) {
            return AreaOptions[params.name].position
          },
          formatter: function({ name, data }) {
            let tipHtml = `<div class="maptip-wrap"><div class="header">${name}</div>`
                + '<div class="body"><div class="title">非水平价绿电积分</div>'
                + '<ul class="datas"><li class="item flex-2"><div class="name">核发量</div>'
                + `<div class="num">${data && data.unusual || 0}</div></li>`
                + `<li class="item flex-1"><div class="name">占比</div><div class="num">${data && data.unusualPercent || 0}%`
                + `<svg x="0" y="0" width="22" height="22" viewBox="0 0 22 22">`
                + `<circle stroke="#465E67" fill="none" stroke-width="2" cx="11" cy="11" r="9" />`
                + `<circle stroke="#FF7959" fill="none" stroke-width="2" cx="11" cy="11" r="9" stroke-linecap="round" stroke-dasharray="${that.getRingPercent(data && data.unusualPercent, 9)}" />`
                + '</svg></div></li></ul>'
                + '<div class="title mt30">普通绿电积分</div>'
                + '<ul class="datas"><li class="item flex-2"><div class="name">核发量</div>'
                + `<div class="num">${data && data.usual || 0}</div></li>`
                + `<li class="item flex-1"><div class="name">占比</div><div class="num">${data && data.usualPercent || 0}%`
                + `<svg x="0" y="0" width="22" height="22" viewBox="0 0 22 22">`
                + `<circle stroke="#465E67" fill="none" stroke-width="2" cx="11" cy="11" r="9" />`
                + `<circle stroke="#FF7959" fill="none" stroke-width="2" cx="11" cy="11" r="9" stroke-dasharray="${that.getRingPercent(data && data.usualPercent, 9)}" />`
                + '</svg></div></li></ul></div></div>'

            return tipHtml
          }
        },
        geo: {
          map: 'ZJ',
          aspectScale: 1.4,
          top: 46,
          zoom: 1.19,
          silent: true,
          itemStyle: {
            borderColor: 'rgba(46, 255, 251, .5)',
            borderWidth: 2,
            color: 'rgba(12, 140, 182, .3)'
          }
        }
      })

      const geo = this.chart.getModel().getComponent('geo').coordinateSystem

      this.chartData.forEach(({ name, value }) => {
        const region = geo.getRegion(name)
        if (!region) return

        const rect = region.getBoundingRect()
        // 散点比例 默认 1:1000
        for (let i = Math.round(value / (Number(this.proportion) || 1000)); i > 0; i--) {
          let coord = [Infinity, Infinity]
          while (!region.contain(coord)) {
            coord[0] = rect.x + Math.random() * rect.width
            coord[1] = rect.y + Math.random() * rect.height
          }
          this.points.push({
            name: `${name}-${i}`,
            value: coord
          })
        }
      })

      this.chart.setOption({
        series: [
          {
            name: '绿色电力积分发行数量',
            type: 'map',
            map: 'ZJ',
            data: this.values,
            aspectScale: 1.4,
            top: 34,
            zoom: 1.19,
            label: {
              show: true,
              color: '#fff',
              fontSize: 12,
              fontFamily: 'AlibabaPuHuiTiM'
            },
            itemStyle: {
              borderWidth: 1.6,
              borderColor: '#88FFEF'
            },
            emphasis: {
              itemStyle: {
                areaColor: '#9A7C28'
              },
              label: {
                height: 26,
                lineHeight: 26,
                padding: [0, 14],
                backgroundColor: 'rgba(0, 93, 75, .7)',
                borderRadius: 16,
                color: '#fff',
                fontSize: 12,
                fontFamily: 'AlibabaPuHuiTiM'
              }
            }
          }, {
            name: 'density',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'roundRect',
            symbolSize: [3, 2],
            large: true,
            silent: true,
            itemStyle: {
              color: '#FFC28A',
              shadowColor: '#FFCD88',
              shadowBlur: 3
            },
            data: this.points
          }
        ]
      })
    },
    // 计算圆环长度数据
    getRingPercent(percent = 0, r = 0) {
      // 周长
      let perimeter = Math.PI * 2 * r
      return ((percent / 100) * perimeter).toFixed() + ',' + perimeter.toFixed()
    }
  }
}
</script>

<style lang='less' scoped>
/deep/.maptip-wrap {
  width: 286px;
  position: relative;
  .header {
    height: 45px;
    line-height: 41px;
    padding: 0 25px;
    background: #10534A;
    border: 2px solid #08CAA4;
    font-size: 20px;
    font-family: AlibabaPuHuiTiM;
    color: #FFFFFF;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 14px;
      left: 12px;
      width: 4px;
      height: 14px;
      background: #00FFC4;
    }
  }
  .body {
    height: 256px;
    margin-top: 2px;
    padding: 18px 24px;
    background: rgba(0, 42, 37, .8);
    border: 2px solid #119F83;
    .title {
      font-size: 20px;
      font-family: AlibabaPuHuiTiM;
      color: #fff;
    }
    .datas {
      display: flex;
      margin-top: 10px;
      .name {
        height: 22px;
        line-height: 22px;
        font-size: 16px;
        font-weight: 400;
        color: #fff;
        opacity: .8;
      }
      .num {
        height: 34px;
        line-height: 34px;
        margin-top: 3px;
        font-size: 28px;
        font-family: FFDINPro-Medium, FFDINPro;
        font-weight: 500;
        color: #fff;
        svg {
          margin-left: 5px;
        }
      }
    }

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      border-top: 10px solid transparent;
      border-bottom: 10px solid #119F83;
      border-left: 14px solid transparent;
      border-right: 14px solid #119F83;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -1.5px;
      right: -1px;
      border-top: 10px solid transparent;
      border-bottom: 10px solid #041716;
      border-left: 14px solid transparent;
      border-right: 14px solid #041716;
    }
  }
  .flex-1 { flex: 1; }
  .flex-2 { flex: 2; }
  .mt30 { margin-top: 30px; }
}
</style>
