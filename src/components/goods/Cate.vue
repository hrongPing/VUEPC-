<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="cateList"
        :columns="columns"
        show-index
        index-text="#"
        border
        stripe
        :expand-type="false"
        :selection-type="false"
      >
        <template slot="opt" slot-scope="scope"
          ><i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i
          ><i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="handle">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 7, 9, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加商品"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="resetForm"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            @change="parentCateChange"
            :props="cascaderProps"
          ></el-cascader
        ></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'opt'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '排序',
          type: 'template',
          template: 'handle'
        }
      ],
      total: 0,
      addDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      selectedKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newPage) {
      this.queryInfo.pagesize = newPage
      this.getCateList()
    },
    handleCurrentChange (newPageSize) {
      this.queryInfo.pagenum = newPageSize
      this.getCateList()
    },
    addDialog () {
      this.getParentSelect()
      this.addDialogVisible = true
    },
    async getParentSelect () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.parentCateList = res.data
    },
    parentCateChange () {
      if (this.selectedKeys) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate () {
      this.$refs.addCateRef.validate(async valid => {
        if (!valid) return this.$message.error('添加失败')
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getCateList()
      })
    },
    resetForm () {
      this.$refs.addCateRef.resetFields()
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.selectedKeys = []
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 10px;
}
.el-cascader {
  width: 100%;
}
</style>
