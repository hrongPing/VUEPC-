<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_avatar">
        <img src="@/assets/logo.png" alt="" />
      </div>
      <el-form
        class="login_form"
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
            @keyup.enter.native="login"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10  个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12  个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset () {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        window.localStorage.setItem('token', res.data.token)
        this.$router.push('/user')
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.login_container {
  background: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;
  .login_avatar {
    width: 130px;
    height: 130px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 1px solid #cccccc;
    background: #ffffff;
    padding: 10px;
    box-shadow: 0 0 10px #dddddd;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #eeeeee;
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
