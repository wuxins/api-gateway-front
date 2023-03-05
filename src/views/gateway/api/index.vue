<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="800px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="维护人" prop="maintainer">
            <el-input v-model="form.maintainer" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="请求方式">
            <el-radio-group v-model="form.method" style="width: 370px">
              <el-radio label="GET">GET</el-radio>
              <el-radio label="POST">POST</el-radio>
              <el-radio label="PUT">PUT</el-radio>
              <el-radio label="DELETE">DELETE</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="源路径" prop="srcUrl">
            <el-input v-model="form.srcUrl" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="目标路径" prop="desUrl">
            <el-input v-model="form.desUrl" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="上游应用" prop="upstreamServices">
            <el-select v-model="form.serviceCode" style="width: 370px" placeholder="请选择上游应用">
              <el-option
                v-for="item in upstreamServices"
                :key="item.serviceCode"
                :label="item.name"
                :value="item.serviceCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否限流">
            <el-radio-group v-model="form.needRateLimit" style="width: 178px">
              <el-radio label="Y">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="限流大小">
            <el-input v-model="form.rateLimit" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否限流">
            <el-radio-group v-model="form.needFallback" style="width: 178px">
              <el-radio label="Y">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="降级内容">
            <el-input v-model="form.fallback" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否开启监控">
            <el-radio-group v-model="form.needMonitor" style="width: 178px">
              <el-radio label="Y">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="超时时间">
            <el-input v-model="form.readTimeout" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="头信息忽略">
            <el-input v-model="form.ignoreHeaderParams" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="参数信息忽略">
            <el-input v-model="form.ignoreQueryParams" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="描述信息" prop="description">
            <el-input v-model="form.description" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <el-dialog title="API信息" :visible.sync="dialogReadFormVisible">
        <el-tabs v-model="apiTab" type="card">
          <el-tab-pane v-for="(item, index) in apiInfo.apiVersions" :key="index" :label="item.env" :name="item.env">
            <el-form ref="form" :model="item" :rules="rules" size="small" label-width="80px" disabled>
              <el-form-item label="名称" prop="name">
                <el-input v-model="apiInfo.name" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="维护人" prop="maintainer">
                <el-input v-model="apiInfo.maintainer" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="请求方式">
                <el-radio-group v-model="item.method" style="width: 370px">
                  <el-radio label="GET">GET</el-radio>
                  <el-radio label="POST">POST</el-radio>
                  <el-radio label="PUT">PUT</el-radio>
                  <el-radio label="DELETE">DELETE</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="源路径" prop="srcUrl">
                <el-input v-model="item.srcUrl" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="目标路径" prop="desUrl">
                <el-input v-model="item.desUrl" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="上游应用" prop="upstreamServices">
                <el-select v-model="item.serviceCode" style="width: 370px" placeholder="请选择上游应用" />
              </el-form-item>
              <el-form-item label="是否限流">
                <el-radio-group v-model="item.needRateLimit" style="width: 178px">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="限流大小">
                <el-input v-model="item.rateLimit" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="是否限流">
                <el-radio-group v-model="item.needFallback" style="width: 178px">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="降级内容">
                <el-input v-model="item.fallback" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="是否开启监控">
                <el-radio-group v-model="item.needMonitor" style="width: 178px">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="超时时间">
                <el-input v-model="item.readTimeout" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="头信息忽略">
                <el-input v-model="item.ignoreHeaderParams" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="参数信息忽略">
                <el-input v-model="item.ignoreQueryParams" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="描述信息" prop="description">
                <el-input v-model="apiInfo.description" style="width: 370px;" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>

      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="apiCode" label="API编码" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="srcUrl" label="路径" />
        <el-table-column prop="method" label="请求方式" />
        <el-table-column prop="serviceCode" label="上游应用" />
        <el-table-column prop="maintainer" label="维护人" />
        <el-table-column prop="gmtCreated" label="创建时间" />
        <el-table-column v-if="checkPer(['admin','apiVersion:edit','apiVersion:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-view" @click="getApi(scope.row.apiCode)" />
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
import crudApiVersion, { query } from '@/api/apiVersion'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getAll } from '@/api/upstreamService'
import rightPanel from '@/components/RightPanel/index.vue'

const defaultForm = {
  id: null,
  apiCode: null,
  method: null,
  srcUrl: null,
  desUrl: null,
  serviceCode: null,
  env: null,
  needRateLimit: null,
  rateLimit: null,
  needFallback: null,
  fallback: null,
  needMonitor: null,
  readTimeout: null,
  ignoreHeaderParams: null,
  ignoreQueryParams: null,
  gmtCreated: null,
  gmtModified: null,
  creator: null,
  modifier: null,
  isDeleted: null,
  upstreamServices: []
}
export default {
  name: 'ApiVersion',
  components: { pagination, crudOperation, rrOperation, udOperation },
  computed: {
    rightPanel() {
      return rightPanel
    }
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: 'API',
      url: 'api/apiVersion',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudApiVersion }
    })
  },
  data() {
    return {
      apiInfo: {},
      upstreamServices: [],
      dialogReadFormVisible: false,
      permission: {
        add: ['admin', 'apiVersion:add'],
        edit: ['admin', 'apiVersion:edit'],
        del: ['admin', 'apiVersion:del']
      },
      rules: {
        apiCode: [
          { required: true, message: 'api code不能为空', trigger: 'blur' }
        ],
        method: [
          { required: true, message: 'api request method不能为空', trigger: 'blur' }
        ],
        srcUrl: [
          { required: true, message: 'api request origin url不能为空', trigger: 'blur' }
        ],
        desUrl: [
          { required: true, message: 'api proxy forwarding url不能为空', trigger: 'blur' }
        ],
        serviceCode: [
          { required: true, message: 'api service code不能为空', trigger: 'blur' }
        ],
        env: [
          { required: true, message: 'api env不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {

    [CRUD.HOOK.afterToCU](crud, form) {
      this.getUpstreamServices()
    },
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 获取弹窗内角色数据
    getUpstreamServices() {
      getAll().then(res => {
        this.upstreamServices = res
      }).catch(() => {
      })
    },
    getApi(apiCode) {
      query(apiCode).then(res => {
        this.apiInfo = res
      }).catch(() => {
      })
      this.dialogReadFormVisible = true
    }
  }
}
</script>

<style scoped>

</style>
