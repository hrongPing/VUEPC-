import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import '../assets/css/base.css'
import User from '@/components/User.vue'
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/users/Users.vue'
import Rights from '@/components/power/Rights.vue'
import Roles from '@/components/power/Roles.vue'
import Cate from '@/components/goods/Cate.vue'
import Params from '@/components/goods/Params.vue'
import Categories from '@/components/goods/Categories.vue'
import Add from '@/components/goods/Add.vue'
import Order from '@/components/order/Order.vue'
import Report from '@/components/report/Report.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/user',
    redirect: '/welcome',
    component: User,
    children: [{
      path: '/welcome',
      component: Welcome
    }, {
      path: '/users',
      component: Users
    }, {
      path: '/rights',
      component: Rights
    }, {
      path: '/roles',
      component: Roles
    }, {
      path: '/goods',
      component: Cate
    },
    { path: '/params', component: Params },
    {
      path: '/categories', component: Categories
    }, {
      path: '/goods/add', component: Add
    }, {
      path: '/orders', component: Order
    }, {
      path: '/reports', component: Report
    }
    ]
  }
  // {
  //   // path: '/about',
  //   // name: 'About',
  //   // // route level code-splitting
  //   // // this generates a separate chunk (about.[hash].js) for this route
  //   // // which is lazy-loaded when the route is visited.
  //   // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') next()
  const tokenStr = window.localStorage.getItem('token')
  if (!tokenStr) next('/login')
  next()
})
export default router
