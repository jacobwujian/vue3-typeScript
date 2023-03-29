<template>
  <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
    <div class="logo">
      <router-link :to="cPath"> 浙江绿色电力管理中心 </router-link>
    </div>
    <a-menu
      theme="dark"
      :default-selected-keys="[route.path]"
      :default-open-keys="[route.path]"
      mode="inline"
    >
      <template v-for="Mitem in menulist" :key="Mitem.path">
        <a-sub-menu v-if="Mitem.children">
          <template #title>
            <a-icon :type="Mitem.icon" /><span
              :style="collapsed ? 'opacity: 0;' : 'opacity: 1;'"
              >{{ Mitem.name }}</span
            >
          </template>
          <a-menu-item
            v-for="Sitem in Mitem.children"
            :key="Sitem.path"
            @click="alink(Sitem.path)"
          >
            {{ Sitem.name }}
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item v-else :key="Mitem.path" @click="alink(Mitem.path)">
          <a-icon :type="Mitem.icon" />
          <span :style="collapsed ? 'opacity: 0;' : 'opacity: 1;'">
            {{ Mitem.name }}
          </span>
        </a-menu-item>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<script lang="ts">
import { cPath } from "@/utils/constant";
import { menuStore } from "@/stores/menu";
import { useRouter } from "vue-router";
import { inject, computed, watch, ref, reactive } from "vue";
export default {
  setup(props, ctx) {
    const { menulist } = menuStore();
    const route: any = useRouter();
    const alink = function (data: any) {
      route.push(data);
    };
    const collapsed = ref(inject("collapsed"));
    return {
      collapsed,
      route,
      alink,
      cPath,
      menulist,
    };
  },
};
</script>

<style scoped>
a {
  color: #ffffff;
}
.logo {
  height: 32px;
  margin: 16px;
  line-height: 32px;
  color: #ddd;
  overflow: hidden;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
