<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <div>
          <el-input v-model="input" placeholder="请输入标题（支持模糊搜索）"></el-input>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-button @click="search">查询</el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="page.total"
            @prev-click="preclick"
            @current-change="currentpage"
            @next-click="nextclick"
            :page-size="20"
            :current-page="page.current"
          />
        </div>
      </el-col>
    </el-row>
    <br />
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      height="520px"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
    >
      <el-table-column align="center" label="Id" width="75">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="标题" width="270">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column
        label="发布时间"
        width="170"
        align="center"
        prop="releasetime"
        :formatter="dateFormat"
      ></el-table-column>
      <el-table-column label="审核状态" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布者id" align="center" width="100">
        <template slot-scope="scope">{{ scope.row.userid }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="类型" align="center">
        <template slot-scope="scope">{{ scope.row.type }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="浏览量" width="75">
        <template slot-scope="scope">
          <span>{{ scope.row.scanned }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="编辑" width="270">
        <template slot-scope="scope">
          <span>
            <el-button @click="searchtext(scope.row.id)">浏览</el-button>
            <el-button type="primary" @click="handleeditClose(scope.row.id)">编辑</el-button>
            <el-button type="danger" @click="handledeleteClose(scope.row.id)">删除</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>是否删除：{{id}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitdelete()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑信息" :visible.sync="dialogVisible2" width="30%">
      <el-form :rules="rules" :ref="text" :model="text">
        <span>
          <el-form-item>
            <el-select v-model="text.status" placeholder="请选择审核状态" style="margin-bottom:10px">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </span>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submitedit(id,text.status)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="正文" :visible.sync="dialogVisible3" width="70%">
      <span>{{content}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="clear()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTextList } from "@/api/table";
import { deleteTextList } from "@/api/table";
import { editText } from "@/api/table";
import { searchText } from "@/api/table";

import Axios from "axios";
import moment from "moment";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  //初始化
  data() {
    return {
      rules: {
        status: [
          {
            required: true,
            message: "请选择状态",
            trigger: "blur"
          }
        ]
      },
      list: null,
      listLoading: true,
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      id: "",
      page: {
        total: 0,
        current: 1
      },
      input: "",
      options: [
        {
          value: "false",
          label: "未审核"
        },
        {
          value: "true",
          label: "已通过"
        },
        {
          value: "fail",
          label: "未通过"
        }
      ],
      text: {
        status: ""
      },
      content: "",
      value: ""
    };
  },
  created() {
    this.fetchData(this.input, this.page.current);
  },

  methods: {
    clear() {
      this.content = "";
      this.dialogVisible3 = false;
    },
    search(input, current) {
      this.fetchData(this.input, this.page.current);
    },
    nextclick(data) {
      this.page.current = data;
      this.fetchData(this.input, data);
    },
    preclick(data) {
      this.page.current = data;
      this.fetchData(this.input, data);
    },
    currentpage(data) {
      this.page.current = data;
      this.fetchData(this.input, data);
    },

    fetchData(input, current) {
      this.input = input;
      this.listLoading = true;
      getTextList(input, current, 20).then(response => {
        this.list = response.data.list;
        this.page.total = response.data.total;
        this.listLoading = false;
      });
    },

    handledeleteClose(id) {
      this.id = id;

      this.dialogVisible = true;
    },

    submitdelete() {
      deleteTextList(this.id).then(response => {
        this.fetchData(this.input, this.page.current);
      });
      this.dialogVisible = false;
    },

    handleeditClose(id) {
      this.id = id;
      this.dialogVisible2 = true;
    },
    submitedit(id, status) {
      this.$refs[this.text].validate(valid => {
        if (valid) {
          this.status = status;
          editText(id, status).then(
            this.fetchData(this.input, this.page.current)
          );
          this.dialogVisible2 = false;
        } else {
        }
      });
    },

    dateFormat(row, column) {
      var date = row[column.property];

      if (date == undefined) {
        return "";
      }

      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },

    searchtext(id) {
      searchText(id).then(response => {
        this.content = response.data;
      });
      this.dialogVisible3 = true;
    }
  }
};
</script>
