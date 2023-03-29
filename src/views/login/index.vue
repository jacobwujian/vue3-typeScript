<template>
  <div class="login-wrap">
    <div class="login-header flex-box">
      <div class="logo flex-box">
        <img src="../../static/login/logo_01.png" class="logo-img" />
        <span class="name">{{ title }}</span>
      </div>
    </div>
    <div class="login-box">
      <div class="title">用户登录</div>
      <a-form :model="formInline" class="login-form">
        <a-form-item>
          <a-input
            v-model:value.trim="formInline.username"
            placeholder="请输入用户名/手机号"
            autocomplete="username"
          >
            <template #prefix>
              <a-icon type="user" style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input-password
            v-model:value.trim="formInline.password"
            placeholder="请输入密码"
            autocomplete="new-password"
          >
            <template #prefix>
              <a-icon type="lock" style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input-password>
        </a-form-item>
        <div class="captcha">
          <a-form-item class="code-form-item">
            <a-input
              v-model:value.trim="formInline.smsCode"
              placeholder="请输入验证码"
            >
              <template #prefix>
                <a-icon type="edit" style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input>
          </a-form-item>
          <component :is="VerifyCode"></component>
        </div>
        <div class="forget text-right">
          <div class="cur-pointer" @click="openForm('Pwdmodel')">忘记密码</div>
        </div>

        <a-form-item class="btns">
          <a-button
            block
            type="primary"
            html-type="submit"
            :disabled="
              disBut ||
              formInline.user === '' ||
              formInline.password === '' ||
              formInline.smsCode === ''
            "
            @click="handleSubmit"
          >
            登录
          </a-button>
        </a-form-item>

        <div class="regist text-right">
          还没账户？
          <span
            class="cur-pointer"
            @click="openForm('UserRegistrationAgreement')"
          >
            用户注册</span
          >
        </div>
      </a-form>
    </div>
    <a-modal
      v-model:visible="visible"
      :title="openItem.title"
      :width="openItem.width"
      :footer="null"
      :destroy-on-close="true"
      :mask-closable="false"
    >
      <component :is="openItem.type" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, provide, inject } from "vue";
import ZModal from "./components/modal.vue"; //注册
import Pwdmodel from "./components/pwdmodel.vue"; //忘记密码
import UserRegistrationAgreement from "./components/userRegistrationAgreement.vue";
import VerifyCode from "./components/verifyCode.vue"; //验证码
import { accessToken } from "@/utils/constant";
import Base64JS from "base-64";

import { getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const app:any = getCurrentInstance()!.appContext.app;
//子组件列表
const modalList = [
  {
    name: "UserRegistrationAgreement",
    type: UserRegistrationAgreement,
    title: "用户须知",
    width: 700,
  },
  {
    name: "ZModal",
    type: ZModal,
    title: "注册",
    width: 1500,
  },
  {
    name: "Pwdmodel",
    type: Pwdmodel,
    title: "忘记密码",
    width: 500,
  },
];
const show = ref<boolean>(false);
const openType = ref("ZModal");
const visible = ref(false);
provide("visible", visible);
provide("openType", openType);
// 三个依赖注入
const message:any = inject("$message");
const api:any = inject("$api");
const cPath:any = inject("$cPath");

const formInline:{[key:string]:any} = reactive({
  username: "",
  password: "",
  smsCode: "",
});
let disBut = ref(false);
const loginShow = ref(false);
const verifyCode = ref();
provide("verifyCode", verifyCode);
const title = computed(() => `浙江省绿色电力积分管理中心`);
const openItem:any = computed(() => modalList.find((it) => it.name == openType.value));

function showItem() {
  openForm("ZModal");
}

function closeShow() {
  visible.value = false;
}

function init() {
  for (let key in formInline) {
    formInline[key] = "";
  }
}

function callback(key:boolean) {
  loginShow.value = key;
  init();
}

function handleSubmit(e:any) {
  let newFormInline:any = {
    ...formInline,
    type: loginShow,
  };
  const code = verifyCode.value.validate(newFormInline.smsCode);
  if (!code) return message.error("验证码错误");
  const redirect = route.query.redirect;
  newFormInline.password = Base64JS.encode(newFormInline.password.toString());
  //router.push(cPath)
  api.login
    .login({
      ...newFormInline,
    })
    .then((res:any) => {
      if (res.Authorization) {
        app.ls.set(accessToken, res.Authorization);
        if (redirect) {
          window.location.href = <string>redirect;
        } else {
          router.push(cPath);
        }
      }
    })
    .catch(() => {
      verifyCode.value.refresh();
    });
}

function openForm(type:string, data?:any) {
  openType.value = type;
  visible.value = true;
}
</script>

<style scoped lang="less">
@import url("./index.less");
</style>
