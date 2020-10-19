<template>
  <el-container class="user-container">
    <el-header>
      <div>
        <img src="@/assets/heima.png" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleAside">|||</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#21A3F1"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="saveNavState"
        >
          <el-submenu :index="i.id + ''" v-for="i in userLists" :key="i.id">
            <template slot="title">
              <i :class="iconList[i.id]"></i>
              <span>{{ i.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + soni.path + ''"
              v-for="soni in i.children"
              :key="soni.id"
              @click="activeNavState('/' + soni.path)"
              ><template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ soni.authName }}</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created () {
    this.userList()
    this.saveNavState = window.localStorage.getItem('active')
  },
  data () {
    return {
      userLists: [],
      iconList: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      saveNavState: ''
    }
  },
  methods: {
    async logout () {
      const r = await this.$confirm('是否要退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (r !== 'confirm') return this.$message.info('已经取消操作')
      window.localStorage.clear()
      this.$router.push('/login')
    },
    async userList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userLists = res.data
    },
    toggleAside () {
      this.isCollapse = !this.isCollapse
    },
    activeNavState (activeNav) {
      window.localStorage.setItem('active', activeNav)
      this.saveNavState = activeNav
    }
  }
}
</script>

<style lang="scss" scoped>
.user-container {
  height: 100%;
}
.el-header {
  display: flex;
  background: #363c42;
  align-items: center;
  justify-content: space-between;
  padding-left: 0;
  > div {
    color: #ffffff;
    font-size: 20px;
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
}
.el-aside {
  background: #313743;
}
.el-main {
  background: #eee;
}
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border-right: none;
}
.toggle-button {
  background: #495065;
  text-align: center;
  font-size: 10px;
  line-height: 20px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
