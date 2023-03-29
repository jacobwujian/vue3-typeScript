<!--  -->
<template>
  <div>
    <c-page
      ref="base"
      :search-type="searchType"
      :columns="columns"
      :data="data"
      @fetch="fetch"
    >
      <template slot="headerLeft">
        <a-button
          v-if="userInfo.userType === 0"
          type="primary"
          @click="showModal('add')"
        >
          新增
        </a-button>
      </template>
      <template
        #action="{ record }"
      >
        <a-button
          v-if="record.status === 2"
          type="link"
          @click="showConfirm('start', record.id)"
        >
          启用
        </a-button>
        <a-button
          v-if="record.status === 1&&userInfo.userType === 0"
          type="link"
          @click="showConfirm('stop', record.id)"
        >
          停用
        </a-button>
        <a-button
          type="link"
          @click="showModal('edit', record)"
        >
          修改
        </a-button>
        <a-button
          type="link"
          @click="showModal('view', record)"
        >
          详情
        </a-button>
      </template>
    </c-page>

    <a-modal
      v-model="modalVisible"
      :title="modalTitle"
      :width="600"
      :footer="null"
      :destroy-on-close="true"
    >
      <AccountForm
        ref="accountForm"
        :detail="detail"
        :modal-name="modalName"
        @close="close"
      />
    </a-modal>
  </div>
</template>

<script lang="ts">
import AccountForm from './components/AccountForm.vue'
import { accountStatus } from '@/utils/typeEnum'
import Base64 from "base-64";
import api from '@/api'
import {
	userStore
} from '@/stores/user'
import { mapState } from 'pinia'
const searchType = [
  {
    type: 'input',
    label: '用户名称',
    params: 'realName'
  }, {
    type: 'datePicker',
    label: '创建时间',
    params: 'create'
  }, {
    type: 'select',
    label: '状态',
    params: 'status',
    data: accountStatus
  }
]

const columns = [
  {
    title: '序号',
    width: 55,
    scopedSlots: { customRender: 'no' }
  }, {
    title: '用户名称',
    dataIndex: 'realName'
  }, {
    title: '角色权限',
    dataIndex: 'roleName'
  }, {
    title: '联系方式',
    dataIndex: 'contactWay'
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'createTime', type: 'time' }
  }, {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status', type: 'select', data: accountStatus }
  }, {
    title: '操作',
    key: 'action',
    width: 200,
    scopedSlots: { customRender: 'action' }
  }
]

const confirmTypes:any = {
  stop: {
    api: 'stopAccount',
    title: '停用'
  },
  start: {
    api: 'startAccount',
    title: '启用'
  }
}

const data:any = []

export default {
  components: {
    AccountForm
  },
  data() {
    return {
      accountStatus,
      searchType,
      data,
      columns,
      modalName: '', // view- 详情 add- 新增 edit- 修改
      modalVisible: false,
      detail: ''
    }
  },
  computed: {
	  ...mapState(userStore, ['userInfo']),
    modalTitle() {
      if (this.modalName === 'add') return '新增账户'
      else if (this.modalName === 'edit') return '修改账户'
      else return '账户详情'
    }
  },
  methods: {
    /**
     * 查询table data
     * @param {Object} params 查询参数
     */
    fetch(params:any, success:any, fetchFinally:any) {
      api.account.allAccount(params)
        .then((res:any) => {
          if(!res) res = {list: [], total: 0}
           res.data = res.list.map((e:any) => { e.password = Base64.decode(e.password); e.payPassword = Base64.decode(e.payPassword); return e })
          success(res)
        })
        .finally(() => {
          fetchFinally()
        })
    },
    /**
     * 弹窗open
     * @param {String} type 操作类型
     * @param {String} detail 该条数据详情
     */
    showModal(type:any, record?:any) {
		return
      this.modalName = type
      this.detail = record
      this.modalVisible = true
    },
    /**
     * 确认弹窗
     * @param {string} type 操作类型
     * @param {string} id
     */
    showConfirm(type:any, id:any) {
		return
      const title = confirmTypes[type].title
      const content = confirmTypes[type].content || `是否确定${title}该账号？`
      const that = this;
      (<any>this).$confirm({
        title: `${title}提示`,
        content: content,
        onOk() {
          that.confirmActions(type, id)
        },
        onCancel() {}
      })
    },
    // 确认操作
    confirmActions(type:any, id:any) {
      const apiName = confirmTypes[type].api
      apiName && api.account[apiName]({ id })
        .then((res:any) => {
          (<any>this).$message.success('操作成功')
          (<any>this.$refs.base).fetch()
        })
    },
    close(isFetch = false) {
      this.modalVisible = false
      if (isFetch) (<any>this.$refs.base).fetch()
    }
  }
}
</script>
<style lang='less' scoped>
</style>