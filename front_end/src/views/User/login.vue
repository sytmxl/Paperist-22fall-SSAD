<template>

  <div class="login">
    <el-row class="logo_area">
      <div id="logo1" class="home_logo"></div>
    </el-row>
    <div class="kuang">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="邮箱登录" name="first">
          <el-form ref="form" :model="form" class="form">
            <el-form-item
              prop="email"
              :rules="[{ required: true, message: '邮箱不能为空' }]"
            >
              <el-input
                v-model="form.email"
                placeholder="请输入您的邮箱"
                type="email"
                autocomplete="off"
                clearable
                prefix-icon="el-icon-postcard"
              ></el-input>
            </el-form-item>
            <el-form-item
              id="password1"
              prop="password1"
              :rules="[{ required: true, message: '密码不能为空' }]"
            >
              <el-input
                prefix-icon="el-icon-lock"
                placeholder="请输入您的密码"
                show-password
                type="password"
                clearable
                v-model="form.password1"
                autocomplete="off"
                @keyup.enter.native="login"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login" round
                >登&nbsp;&nbsp;录</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="用户名登录" name="second">
          <el-form ref="form" :model="form" class="form">
            <el-form-item
              prop="username"
              :rules="[{ required: true, message: '用户名不能为空' }]"
            >
              <el-input
                v-model="form.username"
                placeholder="请输入您的用户名"
                type="username"
                autocomplete="off"
                clearable
                prefix-icon="el-icon-postcard"
              ></el-input>
            </el-form-item>
            <el-form-item
              id="password2"
              prop="password2"
              :rules="[{ required: true, message: '密码不能为空' }]"
            >
              <el-input
                prefix-icon="el-icon-lock"
                placeholder="请输入您的密码"
                show-password
                type="password"
                clearable
                v-model="form.password2"
                autocomplete="off"
                @keyup.enter.native="login"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login" round
                >登&nbsp;&nbsp;录</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-dialog
          v-if="forgetDialogVisible"
          :modal="false"
          title="请输入您的邮箱"
          :visible.sync="forgetDialogVisible"
          width="30%"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :append-to-body="true"
          center
        >
          <el-form
            ref="forget"
            :model="forget"
            class="forget"
            :hide-required-asterisk="true"
          >
            <el-form-item
              prop="forget_email"
              :rules="[
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                {
                  type: 'email',
                  message: '请输入正确的邮箱地址',
                  trigger: ['blur', 'change'],
                },
              ]"
            >
              <el-input
                id="forget"
                v-model="forget.forget_email"
                placeholder="请输入注册时所用邮箱，用于找回密码"
                type="email"
                autocomplete="off"
                prefix-icon="el-icon-postcard"
              ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button
              class="forget"
              @click="(forgetDialogVisible = false), resetForm('forget')"
              >取 消</el-button
            >
            <el-button
              class="forget"
              type="primary"
              @click="toReset(forget.forget_email)"
              >确 定
            </el-button>
          </span>
        </el-dialog>
        <div class="back" @click="forgetPass()">忘记密码</div>
        <div class="regis" @click="toRegister">没有账号？前去注册</div>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import qs from "qs";
export default {
  name: "Login",
  mounted() {
    var body = document.getElementById("topbar");
    body.style.display = "none";
  },
  data() {
    return {
      form: {
        email: "",
        password1: "",
        password2: "",
        username: "",
      },
      forget: {
        forget_email: "",
      },
      loginmethod: "",
      activeName: "first",
      forgetDialogVisible: false,
      ogpath: "",
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // 通过 `vm` 访问组件实例,将值传入fromPath
      vm.ogpath = from.path;
    });
  },
  methods: {
    forgetPass() {
      this.forgetDialogVisible = true;
    },
    toRegister() {
      this.$router.push("/register");
    },
    toReset(i) {
      if (this.forget.forget_email === "") {
        this.$message.warning("注册邮箱不能为空！");
        return;
      }
      if (
        !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.exec(
          this.forget.forget_email
        )
      ) {
        this.$message.warning("请检查您的邮箱格式！");
        return;
      }
      this.$axios({
        method: "post",
        url: "app/send_email/",
        data: qs.stringify({
          email: i,
          type: 1,
        }),
      })
        .then(
          (res) => {
            if (res.data.errno == 0) {
              this.$message.success("邮件已发送,请前往您的邮箱查看信息");
            } else {
              this.$message({
                message: res.data.msg,
                center: true,
                type: "error",
              });
            }
          },
          (this.forgetDialogVisible = false),
          this.resetForm("forget"),
          this.$router.push("/forgetPassword")
        )
        .catch((err) => {});
    },
    resetForm() {
      this.form = {
        email: "",
        username: "",
        password1: "",
        password2: "",
      };
    },
    async login() {
      //login by email
      if (this.activeName === "first"){
        this.$axios({
          url: "user/login/",
          method: "post",
          data: {
            email: this.form.email,
            encrypted_pwd: CryptoJS.MD5(this.form.password1).toString(),
          },
        }).then(async (res) => {
          console.log(res.data);
          if (res.data.errornumber == "-1") {
            this.$message({
              message: "邮箱账号不存在，请您检查输入",
              type: "warning",
            });
          } else if (res.data.errornumber == "-2") {
            this.$message({
              message: "您输入的密码不正确，请您检查输入",
              type: "warning",
            });
          } else {
            this.$message({
              message: "登录成功，正在为您跳转",
              type: "success",
            });
            sessionStorage.setItem("token", res.data.token);
            // await this.$router.push("/FirstPage")
            setTimeout(async () => {
              if (this.ogpath != "/register") {
                await window.history.go(-1);
              } else {
                await this.$router.push("/FirstPage");
              }
            }, 1000);
          }
        });
      }
      //login by username
      else {
        // this.$confirm(
        //     JSON.stringify(this.activeName)+' '
        //     +JSON.stringify(this.form.email)+' '
        //     +JSON.stringify(this.form.username)+' '
        //     +JSON.stringify(this.form.password2))
        this.$axios({
          url: "user/login/",
          method: "post",
          data: {
            username: this.form.username,
            encrypted_pwd: CryptoJS.MD5(this.form.password2).toString(),
          },
        }).then(async (res) => {
          console.log(res.data);
          if (res.data.errornumber == "-1") {
            this.$message({
              message: "您输入的密码不正确，请您检查输入",
              type: "warning",
            });
          } else if (res.data.errornumber == "-2") {
            this.$message({
              message: "您输入的密码不正确，请您检查输入",
              type: "warning",
            });
          } else {
            this.$message({
              message: "登录成功，正在为您跳转",
              type: "success",
            });
            sessionStorage.setItem("token", res.data.token);
            // await this.$router.push("/FirstPage")
            setTimeout(async () => {
              if (this.ogpath != "/register") {
                await window.history.go(-1);
              } else {
                await this.$router.push("/FirstPage");
              }
            }, 1000);
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home_logo {
  // display:none !important;
  width: 300px;
  height: 200px;
  margin: 0 auto;
}
.logo_area {
  width: 100%;
  margin: 0 auto;
  padding-top: 100px;
  clear: both;
}

.kuang {
  width: 400px;
  height: auto;
  padding: 0px 15px;
  /* border: 1px solid grey; */
  margin: 21px auto;
  line-height: 80px;
  /*可以让文字往下移一点 */

  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -35%);

  transition: 0.4s;

  border-radius: 20px !important;
  border: none !important;
  box-shadow: 0 0 7px rgba(204, 204, 204, 0.713);
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(40px) brightness(105%);
  // box-shadow: 0 0px 0px rgb(0 0 0 / 10%), 0 12px 20px rgb(38 38 38 / 12%);
}

.kuang:hover {
  // transform: scale(105%);
}

.login {
  height: calc(100vh);
  width: 100%;
  overflow: hidden;
  overflow-y: hidden;
}

.login img {
  height: 100%;
  width: 100%;
}
.el-tabs {
  // margin-top: 30px;
}

.regis {
  font-size: 12px;
  float: right;
  color: #999;
  cursor: pointer;
  transition: 0.4s;
}

.regis:hover {
  color: rgb(145, 171, 203);
  font-size: 15px;
  padding: 0px 0px 10px 0px;
}

.back {
  font-size: 12px;
  float: left;
  color: #999;
  cursor: pointer;
  transition: 0.4s;
}

.back:hover {
  color: rgb(145, 171, 203);
  font-size: 15px;
  padding: 0px 0px 10px 0px;
}

.el-form {
  border-radius: 20px !important;
}

.el-button:not(.forget) {
  border: none;
  border-radius: 10px !important;
  background-color: rgba(121, 167, 213, 0.73);
  font-size: 20px;
  width: 90%;
  transition: 0.4s !important;
}

// .el-button:hover:not(.forget:hover) {
//   border-radius: 20px !important;
//   background-color: rgba(121, 167, 213, 0.377);
//   margin: 10px 0px 10px 0px;
//   font-size: 20px;
// }

// .el-button:active:not(.forget:active) {
//   border-radius: 20px !important;
//   background-color: rgb(82, 109, 137);

//   font-size: 20px;
// }
.forget {
  width: 40%;
}
/deep/ #forget {
  width: 250% !important;
}
//tabs
.el-tabs--left {
  color: rgb(164, 170, 183) !important;
  /* background: #000; */
  border: rgba(164, 170, 183, 0.403) solid 1px;
  border-radius: 28px !important;
  // background-color: #ffffff7a;
  padding: 10px 0px;
}
/* 这里的样式应该只能用/deep/改 */
/deep/ .el-tabs__item.is-active {
  color: rgb(2, 2, 2);
}
/deep/ .el-tabs__item:hover {
  color: #75889c;
}
/deep/ .el-tabs__item {
  color: #909399;
  font-size: 14px;
  font-weight: 500;
}
/deep/ .el-tabs__active-bar {
  height: 4px;
  border-radius: 2px;
  background: #003b55;
}
@media (max-width: 800px) {
  .kuang {
    width: 80%;
    // top: 55%;
  }
  .logo_area {
    padding-top: 50px;
  }
}
</style>
