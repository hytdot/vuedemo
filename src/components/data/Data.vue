<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/runstate' }">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item>数据管理</el-breadcrumb-item>
      <el-breadcrumb-item>监测数据</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容"
          v-model="queryInfo.query" clearable
          @clear="getDataList">
            <el-button slot="append" icon="el-icon-search" @click="getDataList">
            </el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 数据列表区域 -->
      <el-table :data="dataList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="轴承型号" prop="name"></el-table-column>
        <el-table-column label="开始运行时间" prop="begintime"></el-table-column>
        <el-table-column label="监测振动频率">12kHz</el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" 
            size="small" @click="removeDataByName(scope.row.name)"></el-button>
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
      // 获取数据列表的参数对象
      queryInfo: {
        query: ''
      },
      dataList: [],
      // 删除的数据信息对象
      deleForm: {
        name: ''
      },
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    async getDataList () {
      const { data: res } = await this.$axios.get('datas', { params: this.queryInfo })
      if (res.code !== 200) {
        return this.$message.error('获取数据列表失败！')
      }
      this.dataList = res.datas
      console.log(res)
    },
    // 根据数据名删除对应的数据信息
    async removeDataByName (name) {
      const confirmResult = await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)

      // 如果数据确认删除，则返回值为字符串 confirm
      // 如果数据取消删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      this.deleForm.name = name
      const { data: res } = await this.$axios.get('deleequipment', { params: this.deleForm })
      console.log(res)
      if (res.code !== 200) return this.$message.error('删除数据失败！')
      this.$message.success('删除数据成功')
      this.getDataList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
