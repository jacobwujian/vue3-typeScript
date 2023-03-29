<template>
	<div class="err">
		<Empty description="页面没找到" />
	</div>
</template>

<script lang="ts">
	import {
		Empty
	} from 'ant-design-vue'
	export default {
		components: {
			Empty
		}
	}
</script>

<style scoped>
	.err {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
