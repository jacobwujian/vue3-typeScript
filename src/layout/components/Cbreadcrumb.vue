<template>
  <a-breadcrumb :routes="breadcrumblist" >
    <template #itemRender="{ route, routes }">
      <template v-if="route.path">
        <span
          v-if="
            routes.indexOf(route) === routes.length - 1 || route.meta.noTouch
          "
        >
          {{ route.meta.title }}
        </span>
        <span v-else :style="{ cursor: 'pointer' }" @click="relink(route.path)" >
          {{ route.meta.title }}
        </span>
      </template>
    </template>
  </a-breadcrumb>
</template>

<script lang="ts">
import { breadcrumbStore } from "@/stores/breadcrumb";
import { useRouter } from "vue-router";
import { reactive,computed } from "vue";
import type { forEach } from "lodash";
export default {
  setup() {
    const store = breadcrumbStore();
    const breadcrumblist = reactive(store.breadcrumb);
	for(let item of breadcrumblist){
		item.children = []
	}
    const userRouter = useRouter();
    const relink = function (path: any) {
      userRouter.push(path);
    };
    return {
      relink,
      breadcrumblist,
    };
  },
};
</script>

<style scoped>
.handpoint {
  cursor: pointer;
}
</style>
