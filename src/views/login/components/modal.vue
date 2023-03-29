<!-- formModal -->
<template>
  <div>
    <div>
      <!-- 用户注册 -->
      <a-form ref="editForm" layout="vertical" :model="form" :rules="rules">
        <a-row
          v-for="(itemRow, index) in formList"
          :key="index"
          :gutter="[16, 16]"
        >
          <template v-for="item in itemRow.formList">
            <a-col v-if="!item.noShow" :key="item.params" :span="12">
              <a-form-item
                :ref="item.params"
                has-feedback
                :label="item.label"
                :name="item.params"
                validateFirst
              >
                <a-input
                  v-if="item.type === 'input'"
                  v-model:value.trim="form[item.params]"
                  :placeholder="item.placeholder"
                  :type="item.miss || 'text'"
                >
                  <template v-if="item.params === 'smsCode'" #addonAfter>
                    <a-button
                      class="code-c"
                      :disabled="
                        form.contactWay == '' ||
                        form.contactWay == undefined ||
                        disBut
                      "
                      @click="setTime"
                    >
                      {{ disBut ? sTime + "后" : "" }}发送验证码
                    </a-button>
                  </template>
                </a-input>

                <a-input-password
                  v-if="item.type === 'pwdIpt'"
                  v-model:value.trim="form[item.params]"
                  :placeholder="item.placeholder"
                  :type="item.miss || 'text'"
                >
                  <template #prefix>
                    <a-icon type="lock" style="color: rgba(0, 0, 0, 0.25)" />
                  </template>
                </a-input-password>
                <a-select
                  v-if="item.type === 'select'"
                  v-model="form[item.params]"
                  :placeholder="item.placeholder"
                >
                  <a-select-option
                    v-for="sitem in item.data"
                    :key="sitem.value"
                    :value="sitem.value"
                  >
                    {{ sitem.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
        </a-row>
      </a-form>
    </div>
    <div class="model-footer">
      <a-space size="large">
        <a-button type="primary" @click="handleOk"> 提交 </a-button>
        <a-button type="primary" @click="resetForm"> 重置 </a-button>
        <a-button @click="close"> 取消 </a-button>
      </a-space>
    </div>
  </div>
</template>

<script lang="ts">
import { rules, formList } from "./modalValidate";
import Base64JS from "base-64";
import { companyType } from "@/utils/typeEnum";
import api from "@/api";
import { inject, ref, reactive } from "vue";

export default {
  setup(props, ctx) {
    const visible:any = inject("visible");
    const loading = ref(false);
    const sTime = ref(60);
    const disBut = ref(false);
    let setIn:any = null;
    const form:any = reactive({
      username: "",
      password: "",
      confirmpwd: "",
      contactWay: "",
      smsCode: "",
    });

    function close() {
      visible.value = false;
    }
    // VUE3中模板使用ref获取el对象
    const editForm = ref();

    function setTime() {
      editForm.value.validateFields("contactWay").then(() => {
        getCaptchaCode();
      });
    }
    async function getCaptchaCode() {
      if (disBut.value) return;
      // const res = await api.sms.send({
      // 	phone: form.contactWay,
      // 	type: 4
      // })
      const res = true;
      if (!res) return;
      disBut.value = true;
      setIn = setInterval(() => {
        if (sTime.value === 0) {
          sTime.value = 60;
          disBut.value = false;
          return clearInterval(setIn);
        }
        sTime.value--;
      }, 1000);
    }
    const $message:any = inject("$message");

    function handleOk() {
      editForm.value
        .validate()
        .then(() => {
          let newform = {
            ...form,
          };
          newform.password = Base64JS.encode(newform.password);
          newform.confirmpwd = Base64JS.encode(newform.confirmpwd);
          $message.success("注册成功, 请等待管理员审核");

          // api.user.submitRegister({
          // 		...newform
          // 	})
          // 	.then(res => {
          // 		$message.success('注册成功, 请等待管理员审核')
          // 	})
        })
        .catch((e:any) => {
          return Promise.resolve();
        });
    }

    function resetForm() {
      for (let key in form) {
        form[key] = "";
      }
      editForm.value.resetFields();
    }

    return {
      loading,
      form,
      setIn: ref(null),
      disBut,
      sTime,
      close,
      handleOk,
      resetForm,
      setTime,
      formList,
      rules: rules(editForm, form),
      editForm,
    };
  },
};
</script>
<style lang="less" scoped>
:deep(.ant-form-vertical .ant-form-item) {
  padding-bottom: 0;
}

.code-c {
  width: 100px;
  height: 30px;
  background: transparent;
  border: none;
  text-align: center;
  padding: 0;
}
</style>
