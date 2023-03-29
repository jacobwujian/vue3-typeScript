<template>
	<div class="screen-wrap">
		<div class="container">
			<div class="header clearfix">
				<div class="title">
					{{ middleData && middleData.title || '浙江省绿色电力积分交易管理中心' }}
				</div>
				<div class="setting">
					<router-link :to="'/adm'" class="item">
						<i class="iconfont iconguanlizhongxin" />
						管理中心
					</router-link>
					<li class="time">
						{{ currentTime }}
					</li>
				</div>

				<MoveLineLeft class="move-line-left" />

				<MoveLineRight class="move-line-right" />
			</div>

			<div class="page-one">
				<div class="left">
					<!-- 概况 -->
					<div class="abs">
						<Title :title="leftData && leftData.title" />

						<Abs :list="leftData" />
					</div>

					<!-- 各地级市交易量 -->
					<div class="trade">
						<Title title="各地市交易量" />

						<TradeDoughnut id="trade" title="交易量" height="310px" :chart-data="tradeData" />
					</div>
				</div>
				<div class="middle">
					<!-- 标语 -->
					<Slogan :title="middleData && middleData.subtitle" />

					<!-- 电力发行数量 -->
					<Count class="count-item" :num="pointCount" />

					<!-- 各市核发量 -->
					<Map class="map-item" :chart-data="mapData" :proportion="middleData && middleData.proportion" />

					<AreasList :list="areasCheckData" />

					<div class="points">
						<!-- 积分核发量分时图 -->
						<div class="points-time item">
							<Title title="绿色电力积分核发量分时图" />

							<GroupBar id="pointsBar" height="168px" :chart-data="groupBarData"
								:labels="groupBarTimes" />
						</div>

						<!-- 积分核发量统计图 -->
						<div class="points-count item">
							<Title title="绿色电力积分核发数量统计" />

							<SmoothLine id="pointsLine" height="168px" :chart-data="pointsCountByMount"
								:labels="pointsMounts" />
						</div>
					</div>
				</div>
				<div class="right">
					<!-- 电力装机容量 -->
					<div class="capacity">
						<Title :title="rightData && rightData.title" />

						<CapacityList :list="rightData" />

						<CapacityDoughnut id="capacity" height="300px" :chart-data="capacityData" />
					</div>

					<!-- 累计核发量 -->
					<div class="addup">
						<Title title="累计风电核发量" is-show-tri :is-up="isShowPageTwo" @click="isShowPageTwo = true" />

						<HorizontalBar id="addupBar" class="item addup-brabd" height="420px"
							bar-color="rgba(24, 234, 181, .8)" :chart-data="windCount" />
					</div>
				</div>
			</div>

			<transition name="fade-updown" mode="out-in">
				<div v-if="isShowPageTwo" class="page-two">
					<div class="inner">
						<div class="head">
							<div class="icon-tri" @click="isShowPageTwo = false">
								<i class="iconfont iconjiantou1" />
							</div>
							<div class="title">
								累计风电核发量
							</div>
						</div>

						<div class="chart-body">
							<div v-for="(val, key) in addupCount" :key="key">
								<SubTitle :title="`${EnumMap(energyType, Number(key))}量`"  :key="`${key}-title`" />
								<div class="list">
									<div v-for="(v, k) of val" :key="k">
										<HorizontalBar :id="`${addupIds[key]}${k}Count`" class="item" height="420px"
											:title="`累计${EnumMap(energyType, Number(key))}${addupType[k]}量`"
											:grid="horizontalBarGrid" :chart-data="v" :bar-color="Colors[key]"  :key="`${key}-${k}`"/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</transition>

			<MoveLineTop class="move-line-top line-left" />
			<MoveLineTop class="move-line-top line-right" />
			<MoveLineBottom class="move-line-bottom" />
		</div>
	</div>
</template>

<script>
	import Title from './components/Title.vue'
	import Abs from './components/Abs.vue'
	import TradeDoughnut from './components/TradeDoughnut.vue'
	import Slogan from './components/Slogan.vue'
	import Count from './components/Count.vue'
	import Map from './components/Map.vue'
	import AreasList from './components/AreasList.vue'
	import GroupBar from './components/GroupBar.vue'
	import SmoothLine from './components/SmoothLine.vue'
	import CapacityList from './components/CapacityList.vue'
	import CapacityDoughnut from './components/CapacityDoughnut.vue'
	import HorizontalBar from './components/HorizontalBar.vue'
	import SubTitle from './components/SubTitle.vue'
	import MoveLineTop from './components/MoveLineTop.vue'
	import MoveLineBottom from './components/MoveLineBottom.vue'
	import MoveLineLeft from './components/MoveLineLeft.vue'
	import MoveLineRight from './components/MoveLineRight.vue'

	import {
		energyType,
		cityCode,
		EnumMap
	} from '@/utils/typeEnum'

	const Colors = ['rgba(24, 234, 181, .8)', 'rgba(31, 151, 167, .8)', 'rgba(234, 126, 88, .8)']

	const horizontalBarGrid = {
		top: 47,
		left: 0,
		right: '2%',
		bottom: '2%',
		containLabel: true
	}

	const addupType = {
		checkCount: '核发',
		tradeCount: '交易',
		publishCount: '挂牌'
	}

	const addupIds = ['light', 'wind', 'water']

	export default {
		name: 'Screen',
		components: {
			Title,
			Abs,
			TradeDoughnut,
			Slogan,
			Count,
			Map,
			AreasList,
			GroupBar,
			SmoothLine,
			CapacityList,
			CapacityDoughnut,
			HorizontalBar,
			SubTitle,
			MoveLineLeft,
			MoveLineRight,
			MoveLineTop,
			MoveLineBottom
		},
		data() {
			return {
				energyType,
				EnumMap,
				Colors,
				currentTime: null, // 当前时间
				isShowPageTwo: false,
				timer: null,
				chartsTimer: null,
				horizontalBarGrid,
				// 各地市交易量
				tradeData: [],
				// 积分核发量分时图（中-下-左）
				groupBarData: {},
				groupBarTimes: [],
				// 积分核发量（中-下-右）
				pointsMounts: [],
				pointsCountByMount: {},
				// 装机容量
				capacityData: [],
				// 各累计量
				addupCount: {},
				addupType,
				addupIds,
				// 配置数据
				leftData: {},
				middleData: {},
				rightData: {}
			}
		},
		computed: {
			// 积分发行总量
			pointCount() {
				return this.areasCheckData && this.areasCheckData.reduce((total, item) => total + item.value, 0)
			},
			// 地图数据
			mapData() {
				let items = []
				for (const key in this.middleData) {
					const item = this.middleData[key]
					if (!item || typeof item !== 'object') {
						continue
					}

					if (!key || !EnumMap(cityCode, Number(key))) {
						continue
					}

					const unusual = (Number(item.unusual) || 0).toFixed()
					const usual = (Number(item.usual) || 0).toFixed()
					// 总核发量
					const count = Number(unusual) + Number(usual)

					items.push({
						name: EnumMap(cityCode, Number(key)),
						areaCode: key,
						...item,
						unusual,
						usual,
						unusualPercent: Math.round(Number(unusual) / count * 100).toFixed(),
						usualPercent: Math.round(Number(usual) / count * 100).toFixed(),
						value: count
					})
				}

				return items
			},
			// 各市核发量
			areasCheckData() {
				return this.mapData && this.mapData.map(item => {
					return {
						name: item.name,
						value: item.value
					}
				})
			},
			// 累计风电核发量
			windCount() {
				if (!this.addupCount || !Object.keys(this.addupCount).length) {
					return []
				}

				let arr = []
				if (this.addupCount.hasOwnProperty(1) && this.addupCount[1].hasOwnProperty('checkCount')) {
					arr = this.addupCount[1].checkCount
				}

				return arr
			}
		},
		created() {
			this.getChartsData()
			this.findStatisticsManageList()
			this.getCurrentTime()
			this.chartsTimer = setInterval(() => {
				this.getChartsData()
			}, 12 * 60 * 60 * 1000)
		},
		beforeDestroy() {
			if (this.timer) {
				clearInterval(this.timer)
				this.timer = null
			}

			if (this.chartsTimer) {
				clearInterval(this.chartsTimer)
				this.chartsTimer = null
			}
		},
		methods: {
			// 获取当前时间
			getCurrentTime() {
				this.timer = setInterval(() => {
					this.formatTime()
				}, 500)
			},
			formatTime() {
				let hh = new Date().getHours()
				let mm = new Date().getMinutes() < 10 ? `0${new Date().getMinutes()}` : new Date().getMinutes()
				let ss = new Date().getSeconds() < 10 ? `0${new Date().getSeconds()}` : new Date().getSeconds()
				this.currentTime = `${hh}:${mm}:${ss}`
			},
			getChartsData() {
				this.getTradeCountOfCity()
				this.getElectricTimeFrameQuantity()
				this.getStockMonthTotal()
				this.getGreenOfPower()
				this.getTotalWindPower()
			},
			// 各地市交易量(左下)
			getTradeCountOfCity() {
				return
				this.$api.monitorScreen.tradeCountOfCity()
					.then(res => {
						if (res && res.length) {
							this.tradeData = []
							for (const item of res) {
								if (!item.area || !EnumMap(cityCode, Number(item.area))) continue

								this.tradeData.push({
									name: EnumMap(cityCode, Number(item.area)),
									value: (item.tradeCount || 0) / 100
								})
							}
						}
					})
			},
			// 绿色电力积分分时核发量(中下左)
			getElectricTimeFrameQuantity() {
				return
				this.$api.monitorScreen.electricTimeFrameQuantity()
					.then(res => {
						if (res && Object.keys(res).length) {
							this.groupBarData = this.formatCountData(res.data)
							this.formatGroupTime(res.timeFrame)
						}
					})
			},
			// 绿色电力积分月份核发量(中下右)
			getStockMonthTotal() {
				return
				this.$api.monitorScreen.stockMonthTotal()
					.then(res => {
						if (res && Object.keys(res).length) {
							this.pointsCountByMount = this.formatCountData(res.list)
							this.pointsMounts = res.months.map(item => `${item}月`)
						}
					})
			},
			// 绿色电力能源占比(右上)
			getGreenOfPower() {
				return
				this.$api.monitorScreen.greenOfPower()
					.then(res => {
						if (res && res.length) {
							this.capacityData = []
							res.forEach(item => {
								this.capacityData.push({
									name: EnumMap(energyType, item.energyType),
									value: item.count,
									percentage: item.percentage
								})
							})
						}
					})
			},
			// 累计核发量(右下)
			getTotalWindPower() {
				return
				this.$api.monitorScreen.totalWindPower()
					.then(res => {
						if (res && Object.keys(res).length) {
							for (const key in res) {
								this.$set(this.addupCount, key, {})
								let checkCount = [],
									publishCount = [],
									tradeCount = []
								for (const item of res[key]) {
									if (!item || !Object.keys(item).length) continue

									if (!item.area || !EnumMap(cityCode, Number(item.area))) continue

									checkCount.push({
										name: EnumMap(cityCode, Number(item.area)),
										value: (item.checkCount || 0) / 100
									})

									publishCount.push({
										name: EnumMap(cityCode, Number(item.area)),
										value: (item.publishCount || 0) / 100
									})

									tradeCount.push({
										name: EnumMap(cityCode, Number(item.area)),
										value: (item.tradeCount || 0) / 100
									})
								}
								this.$set(this.addupCount[key], 'checkCount', checkCount)
								this.$set(this.addupCount[key], 'publishCount', publishCount)
								this.$set(this.addupCount[key], 'tradeCount', tradeCount)
							}
						}
					})
			},
			formatGroupTime(times) {
				if (times && times.length) {
					for (const val of times) {
						if (val) {
							let time = this.$dayjs(val).format('DD HH')
							time = time.split(' ')
							this.groupBarTimes.push(`${time[0]}日 ${time[1]}时`)
						} else {
							this.groupBarTimes.push(undefined)
						}
					}
				}
			},
			formatCountData(list) {
				if (!list || !Object.keys(list).length) return {}

				const obj = {}
				for (const key in list) {
					obj[key] = []
					for (const item of list[key]) {
						obj[key].push((item && item.total || 0) / 100)
					}
				}

				return obj
			},
			// 获取自定义数据
			findStatisticsManageList() {
				return
				this.$api.statisticsManage.findStatisticsManageList()
					.then(res => {
						if (!res || !res.length) return false

						for (const item of res) {
							if (!['left', 'middle', 'right'].includes(item.code) || !item.data) {
								continue
							}

							this[`${item.code}Data`] = JSON.parse(item.data)
						}
					})
			}
		}
	}
</script>

<style lang='less' scoped>
	.screen-wrap {
		width: 100%;
		height: 100vh;
		background: linear-gradient(180deg, #0B2827 0%, #010D0C 100%);
		overflow: hidden;
		position: relative;

		.container {
			width: 100%;
			height: 100%;
			background: url(../../static/screen/bg.png) no-repeat cover center;
			position: relative;
		}

		.header {
			height: 120px;
			text-align: center;
			position: relative;

			.title {
				line-height: 55px;
				padding-top: 30px;
				font-size: 40px;
				font-family: AlibabaPuHuiTiB;
				color: rgba(255, 255, 255, 0.99);
			}

			.setting {
				position: absolute;
				top: 36px;
				right: 42px;
				display: flex;
				align-items: center;

				.item {
					width: 147px;
					height: 24px;
					line-height: 24px;
					border-right: 1px solid #05625E;
					font-size: 18px;
					font-family: AlibabaPuHuiTiM;
					color: #D3FFFE;

					.iconfont {
						display: inline-block;
						margin: -2px 6px 0 0;
						vertical-align: middle;
						font-size: 22px;
					}
				}

				.time {
					width: 122px;
					height: 38px;
					line-height: 44px;
					margin-left: 23px;
					font-size: 32px;
					font-family: FFDINPro-Medium, FFDINPro;
					font-weight: 500;
					color: #D3FFFE;
				}
			}

			.move-line-left {
				position: absolute;
				top: 45px;
				left: 75px;
			}

			.move-line-right {
				position: absolute;
				top: 45px;
				left: 0;
				transform: translateX(318px);
			}

			.move-line-right {
				position: absolute;
				top: 45px;
				left: 50%;
				transform: translateX(318px);
			}
		}

		.page-one {
			display: flex;
			padding: 0 36px;

			.left,
			.right {
				width: 355px;
			}

			.middle {
				width: 1082px;
				margin: 0 26px;
				position: relative;

				.count-item {
					position: absolute;
				}

				.map-item {
					margin-top: 30px;
				}

				.points {
					display: flex;
					justify-content: space-between;
					margin-top: 14px;

					.item {
						width: 533px;
					}
				}
			}

			.left {
				.trade {
					margin-top: 20px;
				}
			}
		}

		.page-two {
			width: 1852px;
			height: calc(100% - 142px);
			padding: 18px 0 50px;
			background: #0B1918;
			position: absolute;
			top: 120px;
			left: 50%;
			transform: translateX(-50%);
			z-index: 2;

			.inner {
				height: 100%;
				padding: 0 66px;
				border-radius: 4px 4px 0 0;
				border: 2px solid #044542;
			}

			::-webkit-scrollbar {
				width: 6px;
			}

			::-webkit-scrollbar-thumb {
				width: 6px;
				background: #23605E;
				border-radius: 4px;
				background-clip: content-box;
			}

			::-webkit-scrollbar-track {
				background: transparent;
			}

			::-webkit-scrollbar-track-piece {
				background: transparent;
			}

			.chart-body {
				height: calc(100% - 150px);
				overflow: hidden;
				overflow-y: scroll;
			}

			.head {
				margin-bottom: 28px;
				text-align: center;

				.icon-tri {
					width: 62px;
					height: 28px;
					line-height: 28px;
					margin: 0 auto;
					background: #05625E;
					border-radius: 0 0 4px 4px;

					.iconfont {
						display: inline-block;
						color: #2EE4DC;
						font-size: 20px;
						transform: rotate(180deg);
					}
				}

				.title {
					height: 33px;
					line-height: 33px;
					margin-top: 29px;
					font-size: 24px;
					font-family: AlibabaPuHuiTiM;
					color: #D7FFF6;
				}
			}

			.list {
				display: flex;
				margin-top: 10px;

				.item {
					flex: 1;

					&:nth-child(3n - 1) {
						margin: 0 36px;
					}
				}
			}
		}

		// fade-updown
		.fade-updown-leave-active,
		.fade-updown-enter-active {
			transition: .6s;
		}

		.fade-updown-enter {
			top: 100%;
		}

		.fade-updown-leave-to {
			top: 100%;
		}

		.move-line-top {
			position: absolute;
			top: 20px;

			&.line-left {
				left: 286px;
			}

			&.line-right {
				right: 286px;
			}
		}

		.move-line-bottom {
			position: absolute;
			left: 163px;
			bottom: 16px;
		}
	}
</style>
