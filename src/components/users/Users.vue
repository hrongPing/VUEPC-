<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div>
        <el-row :gutter="20">
          <el-col :span="8"
            ><el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
              ></el-button> </el-input
          ></el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true"
              >添加用户</el-button
            >
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-table :data="userList" style="width: 100%" stripe border="">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="role_name" label="超级管理员"> </el-table-column>
      <el-table-column prop="mg_state" label="状态">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="toggleSwich(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template v-slot="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editUserInfo(scope.row.id)"
          ></el-button
          ><el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteUserInfo(scope.row.id)"
          ></el-button>
          <el-tooltip content="分配角色" placement="top" :enterable="false">
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRole(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 3, 5, 7]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%">
      <el-form
        :model="addRuleForm"
        :rules="addRules"
        ref="editRuleFormref"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addRuleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addRuleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addRuleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addRuleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetAdd">取 消</el-button>
        <el-button type="primary" @click="regAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改用户信息"
      :visible.sync="infodialogVisible"
      width="30%"
      @close="closeDiglog"
    >
      <el-form
        :model="infoRuleForm"
        :rules="infoRules"
        ref="ruleForm"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="infoRuleForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="infoRuleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="mobile">
          <el-input v-model="infoRuleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="infodialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配权限"
      :visible.sync="setdialogVisible"
      width="30%"
      @close="closeSelect"
    >
      <div>
        <p>角色名称:{{ userInfo.username }}</p>
        <p>当前权限:{{ userInfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setSelectRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    var checkEmail = (rule, value, to) => {
      const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (emailReg.test(value)) {
        return to()
      }
      to(new Error('请输入正确的邮箱'))
    }
    var checkMobile = (rule, value, to) => {
      const mobilReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (mobilReg.test(value)) return to()
      to(new Error('请输入正确的手机号码'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      addRuleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      infodialogVisible: false,
      infoRuleForm: {},
      infoRules: {
        email: [
          { required: true, message: '请正确的用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请正确的用户电话号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      setRuleForm: {},
      setdialogVisible: false,
      userInfo: {},
      roleList: [],
      selectRoleId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('/users', { params: this.queryInfo })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange (newPage) {
      // console.log(newPage)
      this.queryInfo.pagesize = newPage
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async toggleSwich (info) {
      const { data: res } = await this.$http.put(`users/${info.id}/state/${info.mg_state}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        info.mg_state = !info.mg_state
        return this.$message.error('改变状态失败')
      }
      this.$message.success('改变状态成功')
    },
    resetAdd () {
      this.$refs.editRuleFormref.resetFields()
      this.addDialogVisible = false
    },
    regAdd () {
      this.$refs.editRuleFormref.validate(async valid => {
        if (!valid) return this.$message.error('添加用户失败')
        const { data: res } = await this.$http.post('/users', this.addRuleForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
      })
    },
    async editUserInfo (id) {
      // console.log(id)
      this.infodialogVisible = true
      const { data: res } = await this.$http.get('/users/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.infoRuleForm = res.data
    },
    closeDiglog () {
      this.$refs.ruleForm.resetFields()
    },
    editInfo () {
      this.$refs.ruleForm.validate(async valid => {
        const { data: res } = await this.$http.put('/users/' + this.infoRuleForm.id, { mobile: this.infoRuleForm.mobile, email: this.infoRuleForm.email })
        if (res.meta.status !== 200) return this.$message.error('修改用户信息失败')
        this.$message.success('修改用户信息成功')
        this.getUserList()
        this.infodialogVisible = false
      })
    },
    async deleteUserInfo (id) {
      const r = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(r)
      if (r !== 'confirm') return this.$message.info('已经取消删除')
      const { data: res } = await this.$http.delete('/users/' + id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getUserList()
    },
    async setRole (info) {
      this.userInfo = info
      this.setdialogVisible = true
      const { data: res } = await this.$http.get('roles/')
      this.roleList = res.data
      console.log(this.roleList)
    },
    async  setSelectRole () {
      if (!this.selectRoleId) this.$message.error('请选择权限！')
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.getUserList()
      this.setdialogVisible = false
    },
    closeSelect () {
      this.selectRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
