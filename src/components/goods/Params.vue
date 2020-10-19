<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
      >
      </el-alert>
      <el-row class="row_mt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectCateKeys"
            :options="selectCateList"
            :props="cateListForm"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="用户管理" name="many"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addDialogCate"
            >添加参数</el-button
          >
          <el-table :data="manyTbaleList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(v, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="removeTag(i, scope.row)"
                >
                  {{ v }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @change="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数列表"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditdialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="配置管理" name="only"
          ><el-button type="primary" size="mini" @click="addDialogCate"
            >添加属性</el-button
          >
          <el-table :data="onlyTbaleList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(v, i) in scope.row.attr_vals" :key="i" closable>
                  {{ v }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数列表"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditdialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table></el-tab-pane
        >
      </el-tabs>
    </el-card>
    <el-dialog
      :title="'添加' + addDialogTitle"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="removeAdddialog"
    >
      <el-form
        :model="addRuleForm"
        :rules="addRules"
        ref="addRuleForm"
        label-width="100px"
      >
        <el-form-item :label="addDialogTitle" prop="attr_name">
          <el-input v-model="addRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialog">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'编辑' + addDialogTitle"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="removeeditdialog"
    >
      <el-form
        :model="editRuleForm"
        :rules="editRules"
        ref="editRuleForm"
        label-width="100px"
      >
        <el-form-item :label="addDialogTitle" prop="attr_name">
          <el-input v-model="editRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectCateList: [],
      selectCateKeys: [],
      expandTrigger: 'hover',
      cateListForm: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      activeName: 'many',
      manyTbaleList: [],
      onlyTbaleList: [],
      adddialogVisible: false,
      addRuleForm: {
        attr_name: ''
      },
      addRules: {
        attr_name: [{ required: true, message: '请输入动态参数', trigger: 'blur' }]
      },
      editdialogVisible: false,
      editRuleForm: {

      },
      editRules: {
        attr_name: [{ required: true, message: '请输入动态参数', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取列表失败')
      // console.log(res)
      this.selectCateList = res.data
    },
    handleChange () {
      this.getTabsList()
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = []
        this.manyTbaleList = []
        this.onlyTbaleList = []
      }
    },
    handleTabClick () {
      this.getTabsList()
    },
    async getTabsList () {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      res.data.forEach(v => {
        v.attr_vals = v.attr_vals ? v.attr_vals.split(' ') : []
        v.inputVisible = false
        v.inputValue = ''
      })
      console.log(res)
      if (this.activeName === 'many') {
        this.manyTbaleList = res.data
      } else {
        this.onlyTbaleList = res.data
      }
    },
    addDialogCate () {
      this.adddialogVisible = true
    },
    addDialog () {
      this.$refs.addRuleForm.validate(async valid => {
        if (!valid) this.$message.error('添加属性失败')
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addRuleForm.attr_name, attr_sel: this.activeName })
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加属性失败')
        this.$message.success('添加属性成功')
        this.adddialogVisible = false
        this.getTabsList()
      })
    },
    removeAdddialog () {
      this.$refs.addRuleForm.resetFields()
    },
    async showEditdialog (attrId) {
      this.editdialogVisible = true
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, { params: { attr_sel: this.activeName } })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取属性失败')
      this.$message.success('获取属性成功')
      this.editRuleForm = res.data
    },
    removeeditdialog () {
      this.$refs.editRuleForm.resetFields()
    },
    editDialog () {
      this.$refs.editRuleForm.validate(async valid => {
        if (!valid) return this.$message.error('修改属性失败')
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editRuleForm.attr_id}`, { attr_name: this.editRuleForm.attr_name, attr_sel: this.activeName })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('修改属性失败')
        this.$message.success('修改属性成功')
        this.editdialogVisible = false
        this.getTabsList()
      })
    },
    async removeParams (id) {
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') {
        return this.$message.info('已经取消操作')
      } else {
        const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getTabsList()
      }
    },
    handleInputConfirm (row) {
      row.inputVisible = false
      row.attr_vals.push(row.inputValue)
      this.editTaglist(row)
      row.inputValue = ''
    },
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async editTaglist (row) {
      const { data: res } = await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除数据失败')
      this.$message.success('删除数据成功')
    },
    removeTag (index, row) {
      row.attr_vals.splice(index, 1)
      this.editTaglist(row)
    }
  },
  computed: {
    isDisabled () {
      if (this.selectCateKeys.length === 3) {
        return false
      }
      return true
    },
    cateId () {
      if (this.selectCateKeys.length === 3) {
        return this.selectCateKeys[2]
      }
      return null
    },
    addDialogTitle () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="scss" scoped>
.row_mt {
  margin-top: 15px;
}
.input-new-tag {
  width: 70px;
}
</style>
