<template>
  <div class="dashboard-container">
    <el-row>
      <el-col :span="12">
        <div id="main" style="width: 650px;height:400px;"></div>
      </el-col>
      <el-col :span="12">
        <div id="likenum" style="width: 650px;height:400px;"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { sortText } from "@/api/table";
import { sortLikeText } from "@/api/table";

export default {
  data() {
    return {
      titleList: [],
      scannedList: [],
      likeTitleList: [],
      likeNumList: []
    };
  },

  mounted() {
    this.draw();
    this.drawlike();
  },
  methods: {
    draw() {
      var echarts = require("echarts/lib/echarts");
      // 引入柱状图组件
      require("echarts/lib/chart/bar");
      // 引入提示框和title组件
      require("echarts/lib/component/tooltip");
      require("echarts/lib/component/title");
      var myChart = echarts.init(document.getElementById("main"));
      // 绘制图表
      sortText().then(response => {
        this.titleList = response.data.title;
        this.scannedList = response.data.scanned;
        myChart.setOption({
          title: {
            text: "浏览量前五"
          },
          tooltip: {},
          xAxis: {
            data: this.titleList
          },
          yAxis: {},
          series: [
            {
              name: "浏览量",
              type: "bar",
              data: this.scannedList
            }
          ]
        });
      });
    },
    drawlike() {
      var echarts = require("echarts/lib/echarts");
      // 引入柱状图组件
      require("echarts/lib/chart/bar");
      // 引入提示框和title组件
      require("echarts/lib/component/tooltip");
      require("echarts/lib/component/title");
      var myChart = echarts.init(document.getElementById("likenum"));
      // 绘制图表
      sortLikeText().then(response => {
        this.likeTitleList = response.data.title;
        this.likeNumList = response.data.likenum;
        myChart.setOption({
          title: {
            text: "点赞数前五"
          },
          tooltip: {},
          xAxis: {
            data: this.likeTitleList
          },
          yAxis: {},
          series: [
            {
              name: "点赞",
              type: "bar",
              data: this.likeNumList
            }
          ]
        });
      });
    }
  },

  computed: {}
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
