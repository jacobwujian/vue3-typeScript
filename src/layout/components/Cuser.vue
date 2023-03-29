<!-- 用户信息 -->
<template>
  <div class="admin-user flex-box">
    <div class="menus">
      <router-link
        v-for="(item, index) in menus"
        :key="`menu-${index}`"
        class="item"
        :to="item.path"
      >
        {{ item.name }}
      </router-link>
      <a class="item" @click="exit"> 退出登录 </a>
    </div>
    <a-tooltip placement="left">
      <template slot="title">
        <span>{{ userInfo && userInfo.companyName }}</span>
      </template>
      <span id="companyName" class="system textover">{{
        userInfo && userInfo.companyName
      }}</span>
    </a-tooltip>
  </div>
</template>

<script lang="ts">
import { userStore } from "@/stores/user";
import api from "@/api";
import { reactive } from "vue";
export default {
  components: {},
  computed: {
    menus() {
      return [
        {
          name: "监控大屏",
          path: "/screen",
        },
      ];
    },
  },
  setup(props, ctx) {
    const store = userStore();
    const userInfo = reactive(store.userInfo);
    const exit = function () {
      store.logout();
      api.user.logout().then((res: any) => {});
    };
    return {
      userInfo,
      exit,
    };
  },
};
</script>
<style lang="less" scoped>
a {
  color: black;
}
.admin-user {
  .menus {
    margin-right: 60px;

    .item {
      display: inline-block;
      line-height: 20px;
      padding-left: 16px;
      margin-left: 16px;
      position: relative;

      + .item {
        &::before {
          content: "";
          position: absolute;
          top: 4px;
          left: 0;
          width: 1px;
          height: 13px;
          background: rgba(0, 0, 0, 0.25);
        }
      }
    }
  }

  .system {
    width: 120px;
    color: #405554;

    div {
      height: 40px;
      line-height: 40px;
      text-align: center;
      background-color: #eee;
    }
  }
}
</style>
