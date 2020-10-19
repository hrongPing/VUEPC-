<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8"
          ><el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList()"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4"
          ><el-button
            type="primary"
            icon="el-icon-search"
            class="ml"
            @click="addGoods"
            >添加商品</el-button
          ></el-col
        >
      </el-row>
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格"
          width="
        95px"
          prop="goods_price"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="160px">
          <template #default="{ row }">
            {{ row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template #default="{ row }">
            <el-button
              type="primary "
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger "
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 12, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.$message.success('获取商品列表成功')
      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(this.goodsList)
    },
    handleSizeChange (newpage) {
      this.queryInfo.pagesize = newpage
      this.getGoodsList()
    },
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getGoodsList()
    },
    async deleteGoods (row) {
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') return this.$message.info('已经取消操作')
      const { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
      if (res.meta.status !== 200) return this.$message.error('删除商品列表失败')
      this.$message.success('删除商品列表成功')
      this.getGoodsList()
    },
    addGoods () {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="scss" scoped>
.ml {
  margin-left: 18px;
}
</style>
