<template>
    <el-container class="root">
      <!-- <TopBar/> -->
      <el-container class="content">
        <el-main>
          <div class="main">
            <el-card class="box-card" v-if="info_list!=[]">
              <div style="margin-bottom:20px">
                <span style="font-size:35px;font-weight:bolder">{{info_list.paper_name}}</span>
                <h4>来源：{{info_list.origin}} &#12288; 引用次数：{{info_list.cite_number}}</h4>
              </div>
              <div  class="text item">
                作者：<span v-for="i in info_list.author_name" :key="i"> {{i}}</span>
              </div>
              <div  class="text item">
                摘要：{{info_list.abstract}}
              </div>
              <div  class="text item">
                关键词：<span v-for="i in info_list.keyword" :key="i"> {{i}}</span>
              </div>
              <div  class="text item">
                年份：{{info_list.date}}
              </div>
              <div  class="text item">
                DOI：{{info_list.DOI}}
              </div>
              <div class="button">
                  <el-button round icon="el-icon-star-off" v-if="!info_list.collect_flag" @click="collect()" title="收藏">收藏</el-button>
                  <el-button round icon="el-icon-star-on" v-else @click="collect()" title="取消收藏">已收藏</el-button>
                  <el-button round icon="el-icon-link" @click="quote()">引用</el-button>
                  <el-button round icon="el-icon-warning-outline" @click="ComplainVisible = true">申诉</el-button>
                  <el-button round icon="el-icon-share" @click="ShareVisible = true">分享</el-button>
              </div>
         
            </el-card>
            <el-card class="box-card2">
                <span style="font-size:25px;font-weight:bolder">全部来源</span>
                <div class="origion">
                    <div class="org" v-for="i in info_list.readlist" :key="i">
                        <div class="logo">
                            <img :src="i.icon" alt="" width="20px" height="20px">
                        </div>
                          {{i.name}}
                    </div>
                </div>
            </el-card>
          </div>
          <div class="remark">
            <el-card>
              <el-tabs >
                <el-tab-pane label="相关文献">
                    <div class="about" v-if="about_list!=[]">
                      <div class="relative" v-for="i in about_list" :key="i">
                          <aboutCard :name="i.paper_name" :author="i.author_name" :cite="i.cite_number" :origin="i.magazine" :intro="i.abstarct" :date="i.date" :paper_id="i.paper_id"/>
                      </div>
                  </div>
                    <div id="load">
                    <el-button style="width:100%" @click="load()" v-loading = "start">加载更多</el-button>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="评论">
                    <div class="creat_comment">
                          <el-button @click="CreatCommentVisible =true">我要评论</el-button>
                      </div>
                      <div v-if="Object.keys(remark_list).length!=0">
                        <div class="comment" v-for="i in remark_list" :key="i">
                          <remark :list="i[0].remark[0]" :paper_id="paper_id"  @throw_remark="react_remark"/>
                      </div>
                      </div>
                      <div v-else><el-empty description="还没有评论，发表第一个评论吧"></el-empty></div>
                    
                </el-tab-pane>
                <el-tab-pane label="笔记">
                      <div class="creat_mark">
                          <el-button @click="CreatMark =true">上传笔记</el-button>
                      </div>
                      <div v-if="Object.keys(mark_list).length!=0">
                        <div class="mark" v-for="i in mark_list" :key="i">
                          <note :list="i" @reaction_note="aboutNoteInit()"/>
                        </div>
                      </div>
                      <div v-else><el-empty description="还没有笔记，发表第一篇笔记吧"></el-empty></div>
                      
                </el-tab-pane>
                  
              </el-tabs>
            </el-card>
            
          </div>
          <el-dialog
            title="引用"
            :visible.sync="QuoteVisible"
            width="30%"
            >
            <div v-for="i in quote_list" :key="i" style="margin-top:15px">
              <span>{{i.type}}</span>: <span>{{i.content}}</span> 
            </div>
          </el-dialog>
          <el-dialog
              title="文章申诉"
              :visible.sync="ComplainVisible"
              width="30%"
                class="complain">
              <div class="describe">
                  问题描述：
                <el-input
                style="margin-top:20px"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入需要申诉的内容"
                  v-model="describe"
                  maxlength="200"
                  show-word-limit
                  >
                </el-input>
              </div>
              <div class="picture">
                相关图片：
               <el-upload
            class="upload-demo"
            drag
            action=""
            :on-change="loadJsonFromFile"
            :http-request="submitAvatarHttp"
            :file-list="uploadFiles"
            limit="1"
            list-type="picture">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
        </el-upload>
                
              </div>
              <div class="contact">
                联系方式：
                <el-input
                style="margin-top:20px"
                  type="text"
                  placeholder="请输入你的联系方式，手机号、微信号、邮箱均可"
                  v-model="contact"
                  maxlength="25"
                  show-word-limit
                >
                </el-input>
              </div>
              <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
                <el-button type="primary" @click="submit()">提交申诉</el-button>
              </span>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
          </el-dialog>
          <el-dialog
            title="分享"
            :visible.sync="ShareVisible"
            width="30%"
            >
            <div style="margin-bottom:40px">
              <span>localhost:8080{{this.$route.path}}</span>
            </div>
            <el-button round icon="el-icon-document-copy">复制链接</el-button>
            
          </el-dialog>
          <el-dialog
                    title="上传笔记"
                    :visible.sync="CreatMark"
                    width="30%"
                    >
                    <uploadMark :paper_id="paper_id" @finish_upload="CreatMark=false"/>
          </el-dialog>
          <el-dialog
                title="留下你的评论吧~"
                :visible.sync="CreatCommentVisible"
                width="30%"
                >
                <CreateComment :paper_id="paper_id" :receiver_id="receiver_id" :remark_id="remark_id" @finish_remark="close_comment"/>
          </el-dialog>
        </el-main>
        <el-aside>
          <div class="about">
            <el-card class="gap">
              <div class="about_content" style="width:100%;">
                来源期刊
                <div class="ogjournal">
                  <a href="https://book.qq.com/book-detail/34129913" style="text-decoration:none" class="journal_content">{{info_list.origin}}</a>
                </div> 
              </div>
            </el-card>
            <el-card class="gap">
              <div class="about_content" style="width:100%;">
                研究领域
                <div class="domain">
                  <el-tag class="domain_content" v-for="i in info_list.domain" :key="i">{{i}}</el-tag>
                </div>
              </div>
            </el-card>
            <el-card class="gap">
              <div class="about_content">
                <div id="echarts_box" style="width:100%;height:300px"></div>
              </div>
            </el-card>
          </div>
        </el-aside>
      </el-container>
    </el-container>
</template>


<script>
import * as echarts from 'echarts/core'
import { Loading } from 'element-ui';
import { init } from 'echarts';
import aboutCard from "../../components/aboutCard.vue"
import remark from "../../components/remark.vue"
import CreateComment from "../../components/CreateComment.vue"
import uploadMark from "../../components/uploadMark.vue"
import note from "../../components/note.vue"
import TopBar from "@/components/TopBar";
let formdata = new FormData();
export default {
  inject: ['reload'],
    data(){
      return{
        number:4,//后期要改成session
        start:false,
        ComplainVisible:false,
        QuoteVisible:false,
        ShareVisible:false,
        dialogImageUrl: '',
        dialogVisible: false,
        CreatCommentVisible:false,
        CreatMark:false,
        describe:'',
        contact:'',
        paper_id:this.$route.params.paper_id,
        about_list:[],
        now_list:[],
        info_list:[],
        quote_list:[],
        uploadFiles:[],
      //  remark_list:{1:{1:{flag:0,name:'胡博轩',image:require("../../assets/Cooper.jpg"),comment:"马哥太尴尬了哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈"},2:{flag:1,name:'李阳',image:require("../../assets/mosy.jpg"),res_name:'胡博轩',comment:"确实，怎么可以这么尬"},3:{flag:1,name:'朱康乐',image:require("../../assets/le.jpg"),res_name:'李阳',comment:"你是懂尴尬的"},4:{flag:1,name:'马泽远',image:require("../../assets/ma.jpg"),res_name:'胡博轩',comment:"基操勿6"}},
      //   2:{1:{flag:0,name:'马泽远',image:require("../../assets/ma.jpg"),comment:"感谢大家支持"}},
      //   3:{1:{flag:0,name:'王域杰',image:require("../../assets/jie.jpg"),comment:"苏珊，小心我告你"},2:{flag:1,name:'王域杰',image:require("../../assets/jie.jpg"),res_name:'王域杰',comment:"别来沾边"},3:{flag:1,name:'朱康乐',image:require("../../assets/le.jpg"),res_name:'王域杰',comment:"支持杰哥维权"},4:{flag:1,name:'马泽远',image:require("../../assets/ma.jpg"),res_name:'王域杰',comment:"我错了杰哥，我苏珊"}},
      //   4:{1:{flag:0,name:'马泽远',image:require("../../assets/ma.jpg"),comment:"感谢大家支持"}},
      //   5:{1:{flag:0,name:'王域杰',image:require("../../assets/jie.jpg"),comment:"苏珊，小心我告你"},2:{flag:1,name:'王域杰',image:require("../../assets/jie.jpg"),res_name:'王域杰',comment:"别来沾边"},3:{flag:1,name:'朱康乐',image:require("../../assets/le.jpg"),res_name:'王域杰',comment:"支持杰哥维权"},4:{flag:1,name:'马泽远',image:require("../../assets/ma.jpg"),res_name:'王域杰',comment:"我错了杰哥，我苏珊"}},},
      //   mark_list:{1:{name:'胡博轩',image:require("../../assets/Cooper.jpg"),intro:"这篇笔记记录了第一章杰哥出世",likes:8},
      //   2:{name:'李阳',image:require("../../assets/mosy.jpg"),intro:"这篇笔记非常精彩，不看后悔",likes:5},
      //   3:{name:'朱康乐',image:require("../../assets/le.jpg"),intro:"第一篇笔记，请大家多多支持",likes:10}}
        remark_list:[],
        mark_list:[]
      }
    },
    methods:{
      submitAvatarHttp(val){
       formdata.append('img',val.file)
      },
    loadJsonFromFile(file, fileList) {
      this.uploadFiles = fileList
    },
      chart_init(cite_number){
        var myChart = echarts.init(document.getElementById('echarts_box'))
        myChart.setOption({
        title: {
          text: '引用走势'
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: ['2017', '2018', '2019', '2020', '2021', '2022']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '引用量',
            type: 'line',
            data: this.calculate(cite_number)
          }
        ]
        });
      },
      calculate(cite_number){
        var a=[];
        var y6 = cite_number;
        var y5 = parseInt(0.8*y6);
        var y4 = y5 - parseInt(Math.random()*(0.1*y5-1)+0.1*y5+1);
        var y3 = y4 - parseInt(Math.random()*(0.1*y4-1)+0.1*y4+1);
        var y2 = parseInt(0.6*y3);
        var y1 = parseInt(0.4*y2);
        a.push(y1,y2,y3,y4,y5,y6)
        return a;
      },
      handleRemove(file) {
        console.log(file);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleDownload(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`最多上传四张图片`);
      },
      react_note(data){
        if(data.flag==1){
          this.aboutNoteInit()
        }
      },
      paper_init(){
           this.$axios({
            url:"http://127.0.0.1:8000/paperInformation/",
            method:"post",
            data:{
                paper_id:this.$route.params.paper_id
            }
        }).then(res=>{
          // console.log(res.data.about_list)
            this.remark_list = res.data.remark_list
            this.mark_list = res.data.note_list
            this.about_list = res.data.about_list
            this.info_list = res.data.info_list[0]
            console.log(res.data.remark_list)
            this.chart_init(res.data.info_list[0].cite_number)
            // this._loadFile(this.pdf_src)
        })
        
      },

      paperInfoInit(){
        this.$axios({
            url:"http://127.0.0.1:8000/paperInfoInit/",
            method:"post",
            data:{
                paper_id:this.$route.params.paper_id
            }
        }).then(res=>{
          // console.log(res.data.about_list)
            this.info_list = res.data.info_list[0]
            this.chart_init(res.data.info_list[0].cite_number)
            // this._loadFile(this.pdf_src)
        })
      },
       aboutListInit(){
          this.$axios({
            url:"http://127.0.0.1:8000/aboutListInit/",
            method:"post",
            data:{
                paper_id:this.$route.params.paper_id
            }
        }).then(res=>{
          this.about_list = res.data.about_list
        })
       },
       aboutNoteInit(){
          this.$axios({
            url:"http://127.0.0.1:8000/aboutNoteInit/",
            method:"post",
            data:{
                paper_id:this.$route.params.paper_id
            }
        }).then(res=>{
          this.mark_list = res.data.note_list
        })
       },
       paperRemarkInit(){
          this.$axios({
            url:"http://127.0.0.1:8000/paperRemarkInit/",
            method:"post",
            data:{
                paper_id:this.$route.params.paper_id
            }
        }).then(res=>{
          this.remark_list = res.data.remark_list
        })
       },

      quote(){
        this.QuoteVisible = true
         this.$axios({
            url:"http://127.0.0.1:8000/paperQuote/",
            method:"post",
            data:{
                paper_id:this.$route.params.paper_id
            }
        }).then(res=>{
            this.quote_list = res.data.quote
        })
      },
      collect(){
        if(this.info_list.collect_flag){
          this.$axios({
            url:"http://127.0.0.1:8000/paperCollection/",
            method:"post",
            data:{
                paper_id:this.$route.params.paper_id,
                note_id:"",
                op:0
            }
          }).then(res=>{
              this.$message.success("已取消收藏")
              this.paperInfoInit()
          })
        }
        else{
          this.$axios({
            url:"http://127.0.0.1:8000/paperCollection/",
            method:"post",
            data:{
                paper_id:this.$route.params.paper_id,
                note_id:"",
                op:1
            }
          }).then(res=>{
            this.$message.success("已收藏")
            this.paperInfoInit()
          })
        }
      },
      react_remark(data){
        if(data.op=="remark"){
             this.CreatCommentVisible = true;
            this.remark_id = data.remark_id
            this.receiver_id = data.sender_id
            console.log(data)
        }
        else if(data.op=="like"){
           this.paperRemarkInit()
        }
     },
     close_comment(data){
          this.CreatCommentVisible = false;
          this.paperRemarkInit()
     },

     submit(){
       this.$axios({
                method: "post",
                headers: { "Content-Type": "multipart/form-data" },
                url: "http://127.0.0.1:8000/paperComplain/" ,
                data: {
                  img: formdata.get('img'),
                  contact:this.contact,
                  introduction:this.describe,
                  paper_id:this.$route.params.paper_id
                },

              })
                .then((res) => {
                      this.ComplainVisible = false
                      
                });
     }
    },
    components:{
        aboutCard,
        remark,
        CreateComment,
        uploadMark,
        note,
        TopBar,
    },
    created() {
      
    },
    mounted() {
      // this.paper_init();
      this.paperInfoInit()
      this.aboutListInit()
      this.aboutNoteInit()
      this.paperRemarkInit()
      // this.chart_init();
    }
}
</script>

<style lang="scss" scoped>
.root{
  margin: 0 auto;
  height: 100%;
  width: 80%;
}
.content{
  margin-top: 60px;
  // width: 900px;
  height: auto;
  min-height: calc(100vh);
}
.el-main{
  // margin-left: 10vw;
}
.about{
  margin-left:10px;
}

.ogjournal{
  margin-top:25px;
  font-size: 15px;
}
.about_content{
  //  margin-top: 20px;
   width: 280px;
   font-weight: bold;
   text-align: left;
   font-size: 18px;
}
#load{
  margin-top:20px
}
.button{
  margin-top: 20px;
}
.logo{
  float: left;
  margin-right: 20px;
}
.button .el-button{
  margin-right:50px;
}
.relative{
  margin-top: 20px;
}
.domain{
  // margin-top:20px;
}
.domain_content{
  margin-top: 10px;
  margin-left:10px;
  color: #000;
}
.journal_content:hover{
  color: antiquewhite;
}
.journal_content{
  margin-top: 10px;
  margin-left:10px;
  color: #000;
}
.org{
  margin-top:15px;
  margin-bottom:15px;
  float: left;
  width: 50%;
}
.el-tag{
  background-color:#f5f8f9;
}
.remark{
  margin-top:30px;
}
.el-tabs>>>.el-tabs__content{
  height: 800px;
  overflow-y: scroll;

}
  .text {
    font-size: 14px;
  }

  .item {
    padding: 10px 0;
  }

  .box-card {
    width: 100%;
    text-align: left;
  }
  .box-card2 {
    width: 100%;
    text-align: left;
    margin-top: 25px;
  }
  .el-tabs{
    height: 100%;
  }
 .el-tabs>>>.el-tabs__nav{
    width:100%;
 }
 .el-tabs>>>.el-tabs__item{
    width:33.4%;
 }
.describe{
//  width: 60%;
 padding: 20px;
 text-align: left;
}
.picture{
  padding: 20px;
  text-align: left;
}
.contact{
  // width: 60%;
  padding: 20px;
  text-align: left;
}
.creat_comment{
  width:100%;
 
}
.creat_comment .el-button{
  width:100%;
  opacity: 0.6;

}
.creat_mark{
  width:100%;
 
}
.creat_mark .el-button{
  width:100%;
  opacity: 0.6;

}
.el-card {
  border-radius: 20px !important;
	border: none !important;
  box-shadow: 0 0 7px rgba(204, 204, 204, 0.713);
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(40px) brightness(100%);
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
  background: #003B55;
}
.gap {
  margin-top: 20px;
}
.el-tag {
  border-radius: 50px;
}
</style>