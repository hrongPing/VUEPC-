<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template #default="{ row }">
            <el-tag v-if="row.level === '0'">等级一</el-tag>
            <el-tag type="success" v-else-if="row.level === '1'">等级二</el-tag>
            <el-tag type="danger" v-else>等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsList = res.data
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
