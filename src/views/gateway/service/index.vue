<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCRU" :visible.sync="crud.status.cru > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" :disabled="!!crud.status.read" size="small" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="编码" prop="serviceCode">
            <el-input v-model="form.serviceCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item v-for="item in form.upstreamServiceVersions" :key="item.env" :label="item.env+' 环境'">
            <el-input v-model="item.address" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div v-if="!crud.status.read" slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="serviceCode" label="编码" />
        <el-table-column prop="gmtCreated" label="创建时间" />
        <el-table-column label="操作" width="180px" align="center">
          <div slot-scope="scope" class="operation-cell">
            <el-button size="mini" type="primary" icon="el-icon-view" @click="crud.toRead(scope.row)" />
            <udOperation
              v-if="checkPer(['admin','upstreamService:edit','upstreamService:del'])"
              :data="scope.row"
              :permission="permission"
            />
          </div>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudUpstreamService from '@/api/upstreamService'
import crudEnvironment from '@/api/environment'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, name: null, serviceCode: null, gmtCreated: null, gmtModified: null, creator: null, modifier: null, isDeleted: null, upstreamServiceVersions: [] }
export default {
  name: 'UpstreamService',
  components: { pagination, crudOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return [
      CRUD({ tag: 'default', title: '应用', url: 'api/upstreamService', idField: 'id', sort: 'id,desc', crudMethod: { ...crudUpstreamService }}),
      CRUD({ tag: 'env', title: '环境', url: 'api/environment', idField: 'id', sort: 'id,desc', crudMethod: { ...crudEnvironment }})
    ]
  },
  data() {
    return {
      permission: {
        add: ['admin', 'upstreamService:add'],
        edit: ['admin', 'upstreamService:edit'],
        del: ['admin', 'upstreamService:del']
      },
      rules: {
        name: [
          { required: true, message: 'service name不能为空', trigger: 'blur' }
        ],
        serviceCode: [
          { required: true, message: 'service code不能为空', trigger: 'blur' }
        ],
        gmtCreated: [
          { required: true, message: 'record created time不能为空', trigger: 'blur' }
        ],
        gmtModified: [
          { required: true, message: 'record updated time不能为空', trigger: 'blur' }
        ],
        creator: [
          { required: true, message: 'who created the record不能为空', trigger: 'blur' }
        ],
        modifier: [
          { required: true, message: 'who updated the record不能为空', trigger: 'blur' }
        ],
        isDeleted: [
          { required: true, message: 'logical delete identifier(Y-effective,N-ineffective)不能为空', trigger: 'blur' }
        ]
      }}
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    [CRUD.HOOK.beforeToAdd]() {
      this.form = {
        ...defaultForm,
        upstreamServiceVersions: this.$crud.env.data.map(item => ({
          env: item.env,
          address: ''
        }))
      }
      this.crud.form = this.form
    }
  }
}
</script>

<style lang="less" scoped>
.operation-cell {
  display: flex;
  justify-content: space-between;
}
</style>
