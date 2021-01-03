<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/runstate' }">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item>运行状态</el-breadcrumb-item>
      <el-breadcrumb-item>风扇端</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 故障率分析 -->
    <div id="left">
      <div id="rate"></div>
    </div>

    <!-- 能量分析 -->
    <div id="right">
      <div id="energy"></div>
    </div>

    <!-- 设备列表区域 -->
    <el-table id="bottom" :data="runstates" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="轴承型号" prop="name"></el-table-column>
      <el-table-column label="运行时间/h" prop="time"></el-table-column>
      <el-table-column label="预测设备状态" prop="state"></el-table-column>
      <el-table-column label="预测故障率" prop="rate"></el-table-column>
      <el-table-column label="诊断结果" prop="result"></el-table-column>
      <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 运行状态按钮 -->
            <el-tooltip effect="dark" content="查看故障诊断图例" placement="top">
              <el-button type="primary" icon="el-icon-s-tools"
              size="small" @click="showDrawDialog(scope.row.energys)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
    </el-table>

    <!-- 故障诊断视图的对话框 -->
    <el-dialog title="故障诊断" :visible.sync="drawDialogVisible"
    width="40%">
      <!-- 内容主体区域 -->
      <div id="diagnose" style="width: 550px; height:400px; margin: auto; margin-top: 10px"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="drawDialogVisible = false">确 定</el-button>
        <!-- <el-button type="primary" @click="editEquipmentInfo">确 定</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        X1List: [],
        Y1List: [],
        X2List: [1, 2, 3, 4, 5, 6, 7, 8],
        Y21List: [],
        Y22List: [],
        Y23List: [],
        Y24List: [],
        inForm: {
          type: '风扇端轴承'
        },
        runstates: [],
        drawDialogVisible: false
      }
    },
    created () {
      this.getData()
      this.getRunState()
    },
    methods:{
      async getData () {
        const { data: res } = await this.$axios.get('faultdata', { params: this.inForm })
        if (res.code === 400) {
          return this.$message.error('获取故障率数据失败！')
        }
        if (res.code === 401) {
          return this.$message.error('获取能量数据失败！')
        }
        this.X1List = res.times
        this.Y1List = res.rates
        this.Y21List = res.energys1
        this.Y22List = res.energys2
        this.Y23List = res.energys3
        this.Y24List = res.energys4
        console.log(res)
        this.drawLine1('rate', '故障预测模型', this.X1List, this.Y1List)
        this.drawLine2('energy', '故障诊断模型', this.X2List, this.Y21List, this.Y22List, this.Y23List, this.Y24List)
      },
      drawLine1(container, titleName, xData, seriesData) {
        var myChart = this.$echarts.init(document.getElementById(container));
        let myOption = {
          color : [ '#6a7985' ],
          //标题样式
          title : {
            text : titleName,
            textStyle : {
                color : 'black',
            },
            left : 'center'
          },
          //提示框
          tooltip : {
            trigger : 'axis',
            position : 'top',
            axisPointer : {
                type : 'cross',
                label : {
                    backgroundColor : '#6a7985'
                }
            }
          },
          //图形位置
          grid : {
            left : '4%',
            right : '10%',
            bottom : '4%',
            top : 50,
            containLabel : true
          },
          //x轴
          xAxis : [ {
            name : '时间/h',
            type : 'category',
            //坐标轴两边留白策略，即x轴坐标点开始与结束点位置都在最边缘
            boundaryGap : false,
            data : xData
          } ],
          //y轴
          yAxis : [ {
            name : '故障率',
            type : 'value'
          } ],
          series : [ {
            name : '故障率',
            type : 'line',
            //折线平滑
            smooth : true,
            data : seriesData
          } ]
        };
        myChart.setOption(myOption);
      },
      drawLine2(container, titleName, xData, seriesData1, seriesData2, seriesData3, seriesData4) {
        var myChart = this.$echarts.init(document.getElementById(container));
        let myOption = {
          color : [ '#6a7985' ],
          //标题样式
          title : {
            text : titleName,
            textStyle : {
                color : 'black',
            },
            left : 'center'
          },
          //提示框
          tooltip : {
            trigger : 'axis',
            position : 'top',
            axisPointer : {
                type : 'cross',
                label : {
                    backgroundColor : '#6a7985'
                }
            }
          },
          //图形位置
          grid : {
            left : '4%',
            right : '10%',
            bottom : '4%',
            top : 50,
            containLabel : true
          },
          //x轴
          xAxis : [ {
            type : 'category',
            //坐标轴两边留白策略，即x轴坐标点开始与结束点位置都在最边缘
            boundaryGap : false,
            data : xData
          } ],
          //y轴
          yAxis : [ {
            name : '能量',
            type : 'value'
          } ],
          series : [ 
            {
              name : '正常',
              // color: [ 'black' ],
              type : 'line',
              smooth : false,
              data : seriesData1
            },
            {
              name : '内圈',
              type : 'line',
              smooth : false,
              data : seriesData2
            },
            {
              name : '滚动体',
              type : 'line',
              smooth : false,
              data : seriesData3
            },
            {
              name : '外圈',
              type : 'line',
              smooth : false,
              data : seriesData4
            } 
          ]
        };
        myChart.setOption(myOption);
      },
      drawLine3(container, titleName, xData, seriesData1, seriesData2, seriesData3, seriesData4, seriesData5) {
        var myChart = this.$echarts.init(document.getElementById(container));
        let myOption = {
          color : [ '#6a7985' ],
          //标题样式
          title : {
            text : titleName,
            textStyle : {
                color : 'black',
            },
            left : 'center'
          },
          //提示框
          tooltip : {
            trigger : 'axis',
            position : 'top',
            axisPointer : {
                type : 'cross',
                label : {
                    backgroundColor : '#6a7985'
                }
            }
          },
          //图形位置
          grid : {
            left : '4%',
            right : '6%',
            bottom : '4%',
            top : 50,
            containLabel : true
          },
          //x轴
          xAxis : [ {
            type : 'category',
            //坐标轴两边留白策略，即x轴坐标点开始与结束点位置都在最边缘
            boundaryGap : false,
            data : xData
          } ],
          //y轴
          yAxis : [ {
            name : '能量',
            type : 'value'
          } ],
          series : [ 
            {
              name : '正常',
              // color: [ 'black' ],
              type : 'line',
              smooth : false,
              data : seriesData1
            },
            {
              name : '内圈',
              type : 'line',
              smooth : false,
              data : seriesData2
            },
            {
              name : '滚动体',
              type : 'line',
              smooth : false,
              data : seriesData3
            },
            {
              name : '外圈',
              type : 'line',
              smooth : false,
              data : seriesData4
            },
            {
              name : '监测数据',
              color: [ 'black' ],
              type : 'line',
              smooth : false,
              data : seriesData5
            }
          ]
        };
        myChart.setOption(myOption);
      },
      // 请求后端获取运行状态数据
      async getRunState () {
        const { data: res } = await this.$axios.get('runstate', { params: this.inForm })
        if (res.code === 201) {
          return this.$message.error('获取运行状态数据失败！')
        }
        console.log(res)
        this.runstates = res.runstates
      },
        // 展示编辑设备的对话框
      showDrawDialog (energys) {
        console.log(energys)
        this.drawDialogVisible = true
        this.$nextTick(()=>{
          // this.drawLine2('diagnose', '故障诊断模型', this.X2List, this.Y21List, this.Y22List, this.Y23List, this.Y24List)
           this.drawLine3('diagnose', '诊断模型', this.X2List, this.Y21List, this.Y22List, this.Y23List, this.Y24List, energys)
        })
      }
    },
    mounted() {
      this.timer = setInterval(this.getRunState, 60000);
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
  }
</script>

<style scoped>
  #left {
    width: 50%;
    float:left;
    height: 430px;
  }
  #right {
    width: 50%;
    float:left;
    height: 430px;
  }
  #rate {
    width: 550px;
    height:400px;
    margin: auto;
    margin-top: 10px
  }
  #energy {
    width: 550px;
    height:400px;
    margin: auto;
    margin-top: 10px
  }
  #bottom {
    margin-top: 450px;
  }
</style>