<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/runstate' }">首页</el-breadcrumb-item> -->
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
          @clear="getEquipmentList">
            <el-button slot="append" icon="el-icon-search" @click="getEquipmentList">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加设备</el-button>
        </el-col>
      </el-row>

      <!-- 设备列表区域 -->
      <el-table :data="equipmentList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="轴承型号" prop="name"></el-table-column>
        <el-table-column label="轴承类型" prop="type"></el-table-column>
        <el-table-column label="内圈直径" prop="ir_diameter"></el-table-column>
        <el-table-column label="外圈直径" prop="or_diameter"></el-table-column>
        <el-table-column label="滚动体直径" prop="roller_diameter"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit"
            size="small" @click="showEditDialog(scope.row.name, scope.row.type, scope.row.ir_diameter, scope.row.or_diameter, scope.row.roller_diameter)"></el-button>
            <!-- 运行状态按钮 -->
            <el-tooltip effect="dark" content="查看运行状态" placement="top">
              <el-button type="success" icon="el-icon-loading"
              size="small" @click="equipmentRunstate(scope.row.type)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" 
            size="small" @click="removeEquipmentByName(scope.row.name)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 修改设备的对话框 -->
    <el-dialog title="修改设备" :visible.sync="editDialogVisible"
    width="40%" @close="editDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="editForm"
      ref="editFormRef" label-width="70px">
        <el-form-item label="轴承型号">
          <el-input v-model="editForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="轴承类型">
          <el-select v-model="editForm.type">
            <el-option label="驱动端轴承" value="驱动端轴承"></el-option>
            <el-option label="风扇端轴承" value="风扇端轴承"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内圈直径">
          <el-input v-model="editForm.ir_diameter"></el-input>
        </el-form-item>
        <el-form-item label="外圈直径">
          <el-input v-model="editForm.or_diameter"></el-input>
        </el-form-item>
        <el-form-item label="滚动体">
          <el-input v-model="editForm.roller_diameter"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editEquipmentInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加设备的对话框 -->
    <el-dialog title="添加设备" :visible.sync="addDialogVisible"
    width="40%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm"
      ref="addFormRef" label-width="70px">
        <el-form-item label="轴承型号" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="轴承类型">
          <el-select v-model="addForm.type" placeholder="请选择轴承类型">
            <el-option label="驱动端轴承" value="驱动端轴承"></el-option>
            <el-option label="风扇端轴承" value="风扇端轴承"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内圈直径" prop="ir_diameter">
          <el-input v-model="addForm.ir_diameter"></el-input>
        </el-form-item>
        <el-form-item label="外圈直径" prop="or_diameter">
          <el-input v-model="addForm.or_diameter"></el-input>
        </el-form-item>
        <el-form-item label="滚动体" prop="roller_diameter">
          <el-input v-model="addForm.roller_diameter"></el-input>
        </el-form-item>
        <el-form-item label="监测数据" prop="">
          <el-upload
            ref="uploadFile"
            action="none"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :on-change="handleChange"
            :auto-upload="false">
            <el-button size="small" type="primary">点击上传txt文件</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEquipment">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取设备列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      equipmentList: [],
      // 控制修改设备对话框的显示与隐藏
      editDialogVisible: false,
      // 修改的设备信息对象
      editForm: {
        name: '',
        type: '',
        ir_diameter: '',
        or_diameter: '',
        roller_diameter: ''
      },
      // 删除的设备信息对象
      deleForm: {
        name: ''
      },
      total: 0,
      addDialogVisible: false,
      addForm: {
        name: '',
        type: '',
        ir_diameter: '',
        or_diameter: '',
        roller_diameter: '',
      },
      file: null
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
      this.equipmentList = res.equipments
      this.total = res.total
      console.log(res)
    },
    // 展示编辑设备的对话框
    showEditDialog (name, type, ir_diameter, or_diameter, roller_diameter) {
      this.editDialogVisible = true
      // console.log(username, password)
      this.editForm.name = name
      this.editForm.type = type
      this.editForm.ir_diameter = ir_diameter
      this.editForm.or_diameter = or_diameter
      this.editForm.roller_diameter = roller_diameter
    },
    // 监听修改设备对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改设备信息并提交
    editEquipmentInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起修改设备的网络请求
        const { data: res } = await this.$axios.post('editequipment', this.editForm)
        if (res.code !== 200) return this.$message.error('更新设备信息失败！')
        this.$message.success('更新设备信息成功')
        // 隐藏修改设备的对话框
        this.editDialogVisible = false
        // 重新获取设备列表数据
        this.getEquipmentList()
      })
    },
    // 根据设备型号删除对应的设备信息
    async removeEquipmentByName (name) {
      const confirmResult = await this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
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
      this.deleForm.name = name
      const { data: res } = await this.$axios.get('deleequipment', { params: this.deleForm })
      console.log(res)
      if (res.code !== 200) return this.$message.error('删除设备失败！')
      this.$message.success('删除设备成功')
      this.getEquipmentList()
    },
    equipmentRunstate (type) {
      if (type === '驱动端轴承') {
        window.sessionStorage.setItem('activePath', 'destate')
        this.$router.push('/destate')
        // this.$router.go(0)
      }
      if (type === '风扇端轴承') {
        window.sessionStorage.setItem('activePath', 'festate')
        this.$router.push('/festate')
        // this.$router.go(0)
      }
    },
    // 点击按钮，添加新设备
    addEquipment () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        // console.log(this.file)s
        let myformData = new FormData()
        myformData.append('file', this.file.raw)
        myformData.append('name', this.addForm.name)
        myformData.append('type', this.addForm.type)
        myformData.append('ir_diameter', this.addForm.ir_diameter)
        myformData.append('or_diameter', this.addForm.or_diameter)
        myformData.append('roller_diameter', this.addForm.roller_diameter)
        const { data: res } = await this.$axios.post('addequipment', myformData)
        if (res.code !== 200) return this.$message.error('添加设备失败！')
        this.$message.success('添加设备成功')
        // 隐藏添加设备的对话框
        this.addDialogVisible = false
        // 重新获取设备列表数据
        this.getEquipmentList()
      })
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
      this.$refs.uploadFile.clearFiles()
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleRemove(file) {
      console.log(file)
    },
    handleExceed(files) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length} 个文件`)
    },
    handleChange(file) {
      this.file = file
    }
  }
}
</script>

<style lang="less" scoped>

</style>
