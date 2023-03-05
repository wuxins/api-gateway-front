<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="编码">
            <el-input v-model="form.groupCode" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="groupCode" label="编码" />
        <el-table-column prop="gmtCreated" label="创建时间" />
        <el-table-column v-if="checkPer(['admin','group:edit','group:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudGroup from '@/api/group'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, name: null, groupCode: null, gmtCreated: null, gmtModified: null, creator: null, modifier: null, isDeleted: null }
export default {
  name: 'Group',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '分组', url: 'api/group', idField: 'id', sort: 'id,desc', crudMethod: { ...crudGroup }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'group:add'],
        edit: ['admin', 'group:edit'],
        del: ['admin', 'group:del']
      },
      rules: {
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
    }
  }
}
</script>

<style scoped>

</style>
