<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <div>
          <el-input v-model="input" placeholder="请输入用户名（支持模糊搜索）"></el-input>
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
      <!-- <el-table-column label="头像" width="70">
        <template slot-scope="scope">{{ scope.row.headid }}</template>
      </el-table-column> -->
      <el-table-column
        label="注册时间"
        width="170"
        align="center"
        prop="signintime"
        :formatter="dateFormat"
      ></el-table-column>
      <el-table-column label="用户名" width="130" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="email" align="center" width="180">
        <template slot-scope="scope">{{ scope.row.email }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="电话号码" align="center">
        <template slot-scope="scope">{{ scope.row.phonenumber }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="性别" width="75">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="签名" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.underwrite }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="编辑" width="200">
        <template slot-scope="scope">
          <span>
            <el-button type="primary" @click="handleeditClose(scope.row.id)">编辑</el-button>
            <el-button type="danger" @click="handledeleteClose(scope.row.id,scope.row.username)">删除</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>是否删除：{{username}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitdelete()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑信息" :visible.sync="dialogVisible2" width="30%">
      <el-form :rules="rules" :ref="user" :model="user">
        <span>
          <el-form-item prop="email">
            <el-input style="margin-bottom:10px" v-model="user.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input style="margin-bottom:10px" v-model="user.phone" placeholder="请输入电话号码"></el-input>
          </el-form-item>
          <el-form-item prop="sex">
            <el-select v-model="user.sex" placeholder="请选择性别" style="margin-bottom:10px">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="underwrite">
            <el-input style="margin-bottom:10px" v-model="user.underwrite" placeholder="请输入个性签名"></el-input>
          </el-form-item>
        </span>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitedit(id,user.email,user.phone,user.sex,user.underwrite)"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from "@/api/table";
import { deleteList } from "@/api/table";
import { editUser } from "@/api/user";

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
    const checkEmail = (rule, value, callback) => {
      const reg = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
      if (value == "" || value == undefined || value == null) {
        callback();
      } else {
        if (!reg.test(value)) {
          callback(new Error("请输入正确的邮箱"));
        } else {
          callback();
        }
      }
    };
    const checkPhone = (rule, value, callback) => {
      const reg1 = /^1[3456789]\d{9}$/;
      if (value == "" || value == undefined || value == null) {
        callback();
      } else {
        if (!reg1.test(value) && value != "") {
          callback(new Error("请输入正确的电话号码"));
        } else {
          callback();
        }
      }
    };
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      dialogVisible2: false,
      id: "",
      username: "",
      page: {
        total: 0,
        current: 1
      },
      user: {
        id: 0,
        email: "",
        phone: "",
        sex: "",
        underwrite: ""
      },
      input: "",
      options: [
        {
          value: 1,
          label: "男"
        },
        {
          value: 0,
          label: "女"
        }
      ],
      value: "",
      rules: {
        email: [
          {
            required: true,
            message: "请输入正确的邮箱格式",
            trigger: "blur",
            validator: checkEmail
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入正确的电话格式",
            trigger: "blur",
            validator: checkPhone
          }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        underwrite: [
          { required: true, message: "请输入个性签名", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.fetchData(this.input, this.page.current);
  },

  methods: {
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
      getList(input, current, 20).then(response => {
        this.list = response.data.list;
        this.page.total = response.data.total;
        this.listLoading = false;
      });
    },

    handledeleteClose(id, username) {
      this.id = id;
      this.username = username;
      this.dialogVisible = true;
    },

    submitdelete() {
      deleteList(this.id).then(response => {
        this.fetchData(this.input, this.page.current);
      });
      this.dialogVisible = false;
    },

    handleeditClose(id) {
      this.id = id;
      this.dialogVisible2 = true;
    },
    submitedit(id, email, phone, sex, underwrite) {
     
      this.$refs[this.user].validate((valid) => {
        if (valid) {
          this.email = email;
          this.phone = phone;
          this.sex = sex;
          this.underwrite = underwrite;

          //form对象传参
          editUser(id, email, phone, sex, underwrite).then(
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
    }
  }
};
</script>
