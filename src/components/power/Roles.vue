<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-form>
            <el-button type="primary" @click="addRoles">添加角色</el-button>
          </el-form>
        </el-col>
      </el-row>
      <el-table :data="rolesList">
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-row
              :class="['bdbtm', i1 === 0 ? 'bdtop' : '', 'vertical']"
              v-for="(v1, i1) in row.children"
              :key="v1.id"
            >
              <el-col :span="5">
                <el-tag closable @close="moveRoleList(row, v1.id)">
                  {{ v1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i
              ></el-col>
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vertical']"
                  v-for="(v2, i2) in v1.children"
                  :key="v2.id"
                >
                  <el-col :span="6"
                    ><el-tag
                      closable
                      @close="moveRoleList(row, v2.id)"
                      type="success"
                      >{{ v2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i
                  ></el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="v3 in v2.children"
                      :key="v3.id"
                      type="warning"
                      closable
                      @close="moveRoleList(row, v3.id)"
                    >
                      {{ v3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
              {{ row }}
            </pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editRole(scope.row)"
              >编辑</el-button
            ><el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            ><el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetdiglog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="SetDialogVisible"
      width="50%"
      @close="clearKeyArr"
    >
      <el-tree
        :data="getRightList"
        :props="treeProp"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defaultList"
        ref="getRuleId"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleRight">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%">
      <el-form :model="addRolesList" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="addRolesList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="用户描述">
          <el-input v-model="addRolesList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editInfo"
    >
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="用户描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      addRolesList: {
        roleName: '',
        roleDesc: ''
      },
      SetDialogVisible: false,
      getRightList: [],
      treeProp: {
        children: 'children',
        label: 'authName'
      },
      defaultList: [],
      roleId: '',
      addDialogVisible: false,
      editForm: {},
      editDialogVisible: false
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
      // console.log(this.rolesList)
    },
    async moveRoleList (role, id) {
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') return this.$message.info('已经取消删除')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${id}`)
      console.log(res)
      role.children = res.data
    },
    async showSetdiglog (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      this.getRightList = res.data
      console.log(this.getRightList)
      this.SetDialogVisible = true
      this.getDefaultList(role, this.defaultList)
    },
    getDefaultList (node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach((v) => {
        this.getDefaultList(v, arr)
      })
    },
    clearKeyArr () {
      this.defaultList = []
    },
    async editRoleRight () {
      const rightArr = [...this.$refs.getRuleId.getCheckedKeys(), ...this.$refs.getRuleId.getHalfCheckedKeys()]
      const rightStr = rightArr.join(',')
      // console.log(rightStr)
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: rightStr })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.SetDialogVisible = false
      this.getRolesList()
    },
    addRoles () {
      this.addDialogVisible = true
    },
    async addRole () {
      const { data: res } = await this.$http.post('/roles', this.addRolesList)
      console.log(res)
      if (res.meta.status !== 201) return this.$message.error('添加角色失败')
      this.$message.success('添加角色成功')
      this.addDialogVisible = false
      this.getRolesList()
    },
    async editRole (role) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('roles/' + role.id)
      console.log(res)
      this.editForm = res.data
    },
    async editInfo () {
      const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc })
      if (res.meta.status !== 200) return this.$message.error('修改角色失败')
      this.$message.success('修改角色成功')
      this.getRolesList()
      this.editDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #cccccc;
}
.bdbtm {
  border-bottom: 1px solid #cccccc;
}
.vertical {
  display: flex;
  align-items: center;
}
</style>
