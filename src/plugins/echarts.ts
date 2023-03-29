// echarts 核心模块
// import * as echarts from 'echarts/core'
import * as echarts from 'echarts'
import {
  BarChart,
  PieChart,
  LineChart,
  MapChart,
  ScatterChart,
  EffectScatterChart
} from 'echarts/charts'

import {
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  GeoComponent,
  GraphicComponent,
  DataZoomComponent
} from 'echarts/components'

//  Canvas 渲染器
import {
  CanvasRenderer
} from 'echarts/renderers'

// 注册组件
echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  GeoComponent,
  GraphicComponent,
  DataZoomComponent,
  BarChart,
  PieChart,
  LineChart,
  MapChart,
  ScatterChart,
  EffectScatterChart,
  CanvasRenderer
] as any[])

export default echarts
