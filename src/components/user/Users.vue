<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容"
          v-model="queryInfo.query" clearable
          @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="角色">超级管理员</el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit"
            size="small" @click="showEditDialog(scope.row.username, scope.row.password)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" 
            size="small" @click="removeUserByUsername(scope.row.username)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="page.pagenum" :page-sizes="[1, 2, 5, 10]"
      :page-size="page.pagesize" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination> -->
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible"
    width="40%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules"
      ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible"
    width="40%" @close="editDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="editForm" :rules="editFormRules"
      ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 修改的用户信息对象
      editForm: {
        username: '',
        password: ''
      },
      // 修改表单的验证规则对象
      editFormRules: {
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 删除的用户信息对象
      deleForm: {
        username: ''
      },
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$axios.get('users', { params: this.queryInfo })
      if (res.code !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.userList = res.users
      this.total = res.total
      console.log(res)
    },
    // // 监听 pagesize 改变的事件
    // handleSizeChange (newSize) {
    //   // console.log(newSize)
    //   this.page.pagesize = newSize
    //   this.getUserList()
    // },
    // // 监听 页码值 改变的事件
    // handleCurrentChange (newPage) {
    //   // console.log(newPage)
    //   this.page.pagenum = newPage
    //   this.getUserList()
    // }
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$axios.post('adduser', this.addForm)
        if (res.code !== 201) return this.$message.error('用户已存在，添加用户失败！')
        this.$message.success('添加用户成功')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    showEditDialog (username, password) {
      // console.log(username, password)
      this.editDialogVisible = true
      this.editForm.username = username
      this.editForm.password = password
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起修改用户的网络请求
        const { data: res } = await this.$axios.post('edituser', this.editForm)
        if (res.code !== 200) return this.$message.error('更新用户信息失败！')
        this.$message.success('更新用户信息成功')
        // 隐藏修改用户的对话框
        this.editDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 根据用户名删除对应的用户信息
    async removeUserByUsername (username) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      this.deleForm.username = username
      const { data: res } = await this.$axios.get('deleuser', { params: this.deleForm })
      console.log(res)
      if (res.code !== 200) return this.$message.error('删除用户失败！')
      this.$message.success('删除用户成功')
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
