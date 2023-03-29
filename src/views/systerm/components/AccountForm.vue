<template>
  <a-form
    ref="accountForm"
    :model="form"
    :rules="rules"
    v-bind="formItemLayout"
  >
    <a-form-item
      v-for="(item, index) in formItemsFilter"
      :key="index"
      :label="item.label"
      :prop="item.params"
    >
      <a-input
        v-if="item.type === 'input'"
        v-model:value.trim="form[item.params]"
        :max-length="item.max || -1"
        :placeholder="`请输入${item.label}`"
        allow-clear
        :disabled="notEditable || item.disabled||(item.params === 'username'&& modalName !== 'add')"
      />

      <a-input-password
        v-if="item.type === 'password'"
        v-model:value="form[item.params]"
        :placeholder="`请输入${item.label}`"
        :disabled="modalName === 'view'"
      />

      <a-select
        v-if="item.type === 'select' && item.params === 'roleId'"
        v-model:value="form[item.params]"
        :disabled="modalName !== 'add'"
        :placeholder="`请选择${item.label}`"
        :not-fount-content="null"
        allow-clear
        @popupScroll="handlePopupScroll"
      >
        <a-select-option
          v-for="(op, i) in list"
          :key="`${i}-${op.id}`"
          :value="op.id"
        >
          {{ op.roleName }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-divider />

    <a-row class="btns-row">
      <a-col class="text-center">
        <a-space size="large">
          <a-button
            v-if="modalName !== 'view'"
            type="primary"
            html-type="submit"
            :loading="loading"
            @click="submitForm"
          >
            确定
          </a-button>
          <a-button
            @click="$emit('close')"
          >
            取消
          </a-button>
        </a-space>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import { validateZhEnNum, validatePhone, validateLoginPwd, validateEnNum } from '@/utils/validate'
import Base64 from "crypto-js/enc-base64";
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}
const regex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}')

export default {
  props: {
    detail: {
      type: Object,
      default: null
    },
    modalName: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      formItemLayout,
      formItems: [
        {
          type: 'input',
          label: '用户名称',
          show: true,
          params: 'realName'
        }, {
          type: 'select',
          label: '角色名称',
          params: 'roleId',
          show: true
        }, {
          type: 'input',
          label: '联系方式',
          params: 'contactWay',
          show: true,
          max: 11
        }, {
          type: 'input',
          label: '登录账户',
          show: true,
          params: 'username'
        }, {
          type:'password',
          label: '登录密码',
          params: 'password',
          show: true,
          max: 20
        }, {
          type:'password',
          label: '支付密码',
          params: 'payPassword',
          show: this.modalName!== 'add',
          max: 20
        }
      ],
      form: {
        username: '',
        roleId: undefined,
        contactWay: '',
        realName: '',
        password: '',
        payPassword: ''
      },
      loading: false,
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      list: [] // 角色列表
    }
  },
  computed: {
    rules() {
      return {
        realName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { validator: validateZhEnNum, trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择角色名称', trigger: 'change' }
        ],
        contactWay: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { validator: validateEnNum, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { validator: validateLoginPwd, trigger: 'blur' }
        ],
        payPassword: [
          { validator: validateLoginPwd, trigger: 'blur' },
          { required: true, message: '请输入支付密码', trigger: 'blur' }
        ]
      }
    },
    notEditable() {
      return this.modalName === 'view'
    },
    formItemsFilter(){
      return this.formItems.filter(e => { return e.show }).map(e => e)
    }
  },
  created() {
    if (this.modalName !== 'add' && Object.keys(this.detail).length) {
      this.initForm()

      this.list = [{
        id: this.detail.roleId,
        roleName: this.detail.roleName
      }]
    }

    this.getRoleList()
  },
  methods: {
    /* 初始化表单 */
    initForm() {
      for (const key in this.form) {
        if (key in this.detail) {
          this.form[key] = this.detail[key]
        }
      }
    },
    submitForm() {
      this.$refs.accountForm.validate(valid => {
        if (!valid) return false
        this.form.password = Base64.encode(this.form.password)
        this.form.payPassword = Base64.encode(this.form.payPassword)
        if(this.modalName === 'add') this.add()
        else if(this.modalName === 'edit') this.edit()
      })
    },
    add() {
      this.loading = true

      this.$api.account.addAccount(this.form)
        .then(res => {
          this.$message.success('保存成功')
          this.$emit('close', true)
        })
        .finally(() => {
          this.loading = false
        })
    },
    edit() {
      this.loading = true

      this.$api.account.updateAccount({
        id: this.detail.id,
        ...this.form
      })
        .then(res => {
          this.$message.success('修改成功')
          this.$emit('close', true)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handlePopupScroll({ target }) {
      if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        if (this.list.length < this.pagination.total) {
          this.pagination.pageNum++
          this.getroleList()
        }
      }
    },
    // 获取角色列表用于关联
    getRoleList(val) {
      this.loading = true

      const params = {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      }
      if (val) params.roleName = val

      this.$api.role.allRole(params)
        .then(res => {
          const { list, total } = res
          this.pagination.total = total
          if (Array.isArray(list)) {
            let newList = list.filter(item => item.id!=='2'&&item.id!=='3'&&item.status === 1)
            // 过滤已有角色 & 停用角色
            if (this.list && this.list.length) {
              const shiftRole = this.list[0]
              newList = newList.filter(item => item.id !== shiftRole.id && item.status === 1)
            }
            this.list.push(...newList)
          }
        }).finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
