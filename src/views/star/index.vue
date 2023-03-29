<template>
	<div id="star" class="main">
		<img @mouseover="starUp" @mouseout="desIn" class="topImg" src="../../static/index/mask_topsky.png" />
		<img @mouseover="starDown" @mouseout="desIn" class="bottomImg" src="../../static/index/mask_bottomsky.png" />
		<div @mouseover="starLeft" @mouseout="desIn" class="starLeft" />
		<div @mouseover="starRight" @mouseout="desIn" class="starRight" />
		<div :style="backPostion" id="myChart" class="chart" />
	</div>
</template>

<script setup>
	import echarts from '@/plugins/echarts'
	import graph from './data.json'
	import {
		onMounted,
		computed,
		ref,
		inject
	} from 'vue'

	const nowChart = ref()
	let rightoff = 0
	let leftOff = 0
	const nowrightoff = ref(0)
	const nowleftOff = ref(0)
	let canChange = false
	let postioin = [0, 0]
	let innerTimer = 0
	let count = 0
	let option = {}
	let starJumpTimer = 0
	const changeMainStyle = inject('changeMainStyle')
	changeMainStyle.padding = '0'
	// 刷新图片
	// const reflash = () => {
	// 	nowChart.dispose()
	// 	initChart()
	// 	nowrightoff.value = 0
	// 	nowleftOff.value = 0
	// }
	// 初始化echats
	const initChart = () => {
		const chartDom = document.getElementById('myChart')
		const myChart = echarts.init(chartDom)
		nowChart.value = myChart
		myChart.hideLoading()
		option = {
			tooltip: {
				show: false
			},
			series: [{
				id: 'star',
				name: 'star',
				type: 'graph',
				layout: 'force',
				data: graph.nodes,
				links: graph.links,
				categories: graph.categories,
				draggable: false,
				clickable: true,
				force: {
					gravity: 0,
					repulsion: 0,
					friction: 0.1,
					edgeLength: 10,
					initLayout: 'none',
					layoutAnimation: true
				},
				focusNodeAdjacency: true,
				edgeSymbol: ['none', 'none'],
				roam: false,
				emphasis: {
					focus: 'none'
				},
				label: {
					show: true,
					position: 'left',
					formatter: '{b}',
					color: '#d8d8d8',
					fontSize: 16
				},
				labelLayout: {
					hideOverlap: true
				},
				scaleLimit: {
					min: 1,
					max: 1
				},
				lineStyle: {
					color: 'rgba(8, 255, 255, 1.0)',
					curveness: 0,
					width: 4
				},
				Animation: true
			}]
		}

		myChart.setOption(option)
		//starJumpTimer = setInterval(funAdd, 100)
		// 节点闪烁
		// const funAdd = () => {
		// 	if (count < 10) {
		// 		for (let item of graph.nodes) {
		// 			item.symbolSize = item.symbolSize * 0.98
		// 		}
		// 		count = count + 1
		// 	} else if (count < 20) {
		// 		for (let item of graph.nodes) {
		// 			item.symbolSize = item.symbolSize / 0.98
		// 		}
		// 		count = count + 1
		// 	} else {
		// 		count = 0
		// 	}
		// 	nowChart.setOption(option)
		// }
		// myChart.on('click', e => {
		// 	if (e.data.click) {
		// 		$router.push(e.data.click)
		// 	}
		// })
		myChart.on('mouseup', function(params) {
			let option2 = myChart.getOption()
			option2.series[0].data[params.dataIndex].x = params.event.offsetX
			option2.series[0].data[params.dataIndex].y = params.event.offsetY
			option2.series[0].data[params.dataIndex].fixed = true
			myChart.setOption(option2)
		})
		chartDom.addEventListener('mousedown', (e) => {
			canChange = true
			postioin = [e.clientX, e.clientY]
		})
		chartDom.addEventListener('mousemove', (e) => {
			if (canChange) {
				const ore = e.clientX - postioin[0] + nowrightoff.value
				const ofe = e.clientY - postioin[1] + nowleftOff.value
				if (ore > -chartDom.parentElement.offsetWidth * 0.5 && ore < 0 && ofe > -chartDom
					.parentElement.offsetHeight * 0.6 && ofe < 0) {
					nowrightoff.value = e.clientX - postioin[0] + nowrightoff.value
					nowleftOff.value = e.clientY - postioin[1] + nowleftOff.value
				}
				postioin = [e.clientX, e.clientY]
			}
		})
		chartDom.addEventListener('mouseup', () => {
			canChange = false
		})
		chartDom.addEventListener('mouseleave', () => {
			canChange = false
		})
		chartDom.addEventListener('mouseout', () => {
			canChange = false
		})
	}
	//图片上移
	const starUp = () => {
		innerTimer = setInterval(() => {
			if (nowleftOff.value + 1 < 0) {
				nowleftOff.value++
			}
		}, 5)
	}
	//图片下移
	const starDown = () => {
		const chartDom = document.getElementById('myChart')
		innerTimer = setInterval(() => {
			if (nowleftOff.value - 1 > -chartDom.parentElement.offsetHeight * 0.6) {
				nowleftOff.value--
			}
		}, 5)
	}
	//图片左移
	const starRight = () => {
		const chartDom = document.getElementById('myChart')
		innerTimer = setInterval(() => {
			if (nowrightoff.value - 1 > -chartDom.parentElement.offsetWidth * 0.5) {
				nowrightoff.value--
			}
		}, 5)
	}
	//图片右移
	const starLeft = () => {
		const chartDom = document.getElementById('myChart')
		innerTimer = setInterval(() => {
			if (nowrightoff.value + 1 < 0) {
				nowrightoff.value++
			}
		}, 5)
	}
	// 清除chat里的定时任务
	const desIn = () => {
		clearInterval(innerTimer)
	}
	//给chat帮平移属性
	let backPostion = computed(() => {
		return {
			transform: 'translate(' + nowrightoff.value + 'px, ' + nowleftOff.value + 'px)'
		}
	})
	// 初始化chat
	onMounted(() => initChart())

</script>

<style lang="less" scoped>
	.main {
		height: calc(100vh - 88px);
		background-color: #00184f;
		position: relative;
		overflow: hidden;

		.topImg {
			width: 100%;
			height: 100px;
			position: fixed;
			display: inline-flex;
			top: 106px;
			cursor: pointer;
			z-index: 9;
		}

		.bottomImg {
			cursor: pointer;
			width: 100%;
			height: 100px;
			position: fixed;
			display: inline-flex;
			bottom: 0;
			z-index: 9;
		}

		.starLeft {
			cursor: pointer;
			width: 100px;
			height: 160vh;
			position: fixed;
			display: inline-flex;
			z-index: 9;
		}

		.starRight {
			cursor: pointer;
			width: 100px;
			height: 160vh;
			position: fixed;
			display: inline-flex;
			right: 0;
			z-index: 9;
		}

		.chart {
			position: absolute;
			width: 150vw;
			height: 160vh;
			background: url('../../static/index/backsky.jpg') no-repeat;
			background-size: 150vw 160vh;
			overflow: hidden;
		}
	}
</style>
