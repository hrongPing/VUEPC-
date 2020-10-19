<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRule"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="goodsList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="v in artValList"
              :key="v.attr_id"
              :label="v.attr_name"
            >
              <el-checkbox-group v-model="v.attr_vals">
                <el-checkbox
                  v-for="(v2, i) in v.attr_vals"
                  :key="i"
                  :label="v2"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="v in onlyList"
              :key="v.attr_id"
              :label="v.attr_name"
            >
              <el-input v-model="v.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <el-button type="primary" class="mt" @click="add"
              >点击提交</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="预览效果"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img :src="previewPath" class="img" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRule: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请输入商品数量', trigger: 'blur' }]
      },
      goodsList: [],
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      artValList: [],
      onlyList: [],
      uploadUrl: 'http://vue-shop-api.itheima.net/api/private/v1/upload',
      headersObj: {
        Authorization: window.localStorage.getItem('token')
      },
      previewDialogVisible: false,
      previewPath: ''
    }
  },
  created () {
    this.getAddGoodsList()
  },
  methods: {
    async  getAddGoodsList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.goodsList = res.data
      // console.log(this.goodsList)
    },
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选取分类')
        return false
      }
    },
    async tabClick () {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error('获取数据失败')
        res.data.forEach(v => {
          v.attr_vals = v.attr_vals.length === 0 ? [] : v.attr_vals.split(' ')
        })
        this.artValList = res.data
        // console.log(this.artValList)
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error('获取数据失败')
        this.onlyList = res.data
        // console.log(this.onlyList)
      } else if (this.activeIndex === '3') {

      }
    },
    handlePreview (file) {
      console.log(file)
      this.previewDialogVisible = true
      this.previewPath = file.response.data.url
    },
    handleRemove (file) {
      // console.log(file)
      const picInfo = file.response.data.tmp_path
      // console.log(picInfo)
      const index = this.addForm.pics.findIndex(v => {
        return v.pic === picInfo
      })
      this.addForm.pics.splice(index, 1)
      // console.log(this.addForm)
    },
    handleSuccess (response) {
      // console.log(response)
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
      // console.log(this.addForm)
    },
    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写表单必要项')
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        this.artValList.forEach(v => {
          const manyForm = { attr_id: v.attr_id, attr_value: v.attr_vals.join(' ') }
          this.addForm.attrs.push(manyForm)
        })
        this.onlyList.forEach(v => {
          const onlyForm = { attr_id: v.attr_id, attr_value: v.attr_vals }
          this.addForm.attrs.push(onlyForm)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        const { data: res } = await this.$http.post('goods', form)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加商品失败')
        this.$router.push('/categories')
      })
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
.el-steps {
  margin-top: 18px;
}
.img {
  width: 100%;
}
.mt {
  margin-top: 18px;
}
</style>
