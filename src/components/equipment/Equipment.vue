<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>设备管理</el-breadcrumb-item>
      <el-breadcrumb-item>设备列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容"
          v-model="queryInfo.query" clearable
          @click="getEquipmentList">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加设备</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="equipmentList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="设备名" prop="name"></el-table-column>
        <el-table-column label="设备管理员" prop="supervisor"></el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="small"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="small"></el-button>
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
      equipmentList: [],
      total: 0
    }
  },
  created () {
    this.getEquipmentList()
  },
  methods: {
    async getEquipmentList () {
      const { data: res } = await this.$axios.get('equipment', { params: this.queryInfo })
      if (res.code !== 200) {
        return this.$message.error('获取设备列表失败！')
      }
      this.equipmentList = res.equipment
      this.total = res.total
      console.log(res)
    },
    // // 监听 pagesize 改变的事件
    // handleSizeChange (newSize) {
    //   // console.log(newSize)
    //   this.page.pagesize = newSize
    //   this.getEquipmentList()
    // },
    // // 监听 页码值 改变的事件
    // handleCurrentChange (newPage) {
    //   // console.log(newPage)
    //   this.page.pagenum = newPage
    //   this.getEquipmentList()
    // }
  }
}
</script>

<style lang="less" scoped>

</style>
