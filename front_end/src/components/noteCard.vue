<template>
  <div class="other_note">
    <el-card>
      <span
        class="link1"
        style="font-weight: bolder; font-size: large; color: #003b55"
        title="点击阅读笔记"
        @click="goto_note(note.note_id)"
        >{{ note.introduction }}</span
      >
      <span class="link2" @click="goto_paper(note.paper_id)" title="了解此论文"
        >关联论文：{{ note.paper_name }}</span
      >
      <!-- <span class="inline">获赞：{{note.likes}}</span>
        <span class="inline">评论：{{note.remarks}}</span>
        <span class="inline">收藏：{{note.collections}}</span> -->
      <!-- <i class="el-icon-thumb">{{note.likes}}</i>
        <i class="el-icon-star-off">{{note.collections}}</i>
        <i class="el-icon-chat-round">{{note.remarks}}</i> -->
      <div class="info">
        <div class="thumb">{{ note.likes }}</div>
        <i class="el-icon-star-off" title="收藏"
          >&nbsp;{{ note.collections }}</i
        >
        <i class="el-icon-chat-round">&nbsp;{{ note.remarks }}</i>
      </div>
    </el-card>
  </div>
</template>

<script>
import { $data } from "../../static/pdf/build/pdf.worker";

export default {
  props: {
    note: {
      note_id: "",
      paper_id: "",
      paper_name: "",
      introduction: "",
      likes: "",
      collections: "",
      remarks: "",
    },
  },
  data() {
    return {};
  },
  methods: {
    goto_paper(paper_id) {
      // this.$router.push({
      //     name:'PaperInformation',
      //     params:{
      //      paper_id:paper_id
      //     }
      //   })

      let routeData = this.$router.resolve({
        name: "PaperInformation",
        params: { paper_id: paper_id },
      });
      window.open(routeData.href, "_blank");
    },
    goto_note(note_id) {
      // this.$router.push({
      //     name:'NoteInformation',
      //     params:{
      //      note_id:note_id
      //     }
      //   })
      //   window.location.reload()

      let routeData = this.$router.resolve({
        name: "NoteInformation",
        params: { note_id: note_id },
      });
      window.open(routeData.href, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./link.scss";
@import "./3infos.scss";
.other_note {
  margin-top: 15px;
  .el-card {
    background-color: rgba(255, 255, 255, 0.231) !important;
    border-radius: 15px !important;
    border: solid 1px #003b556d;
    box-shadow: none;
  }
}
.other_note span {
  display: block;
  text-align: left;
  margin-bottom: 15px;
  cursor: pointer;
}
.other_note i {
  display: block;
  float: left;
  margin-bottom: 15px;
  margin-right: 40px;
}
.thumb {
  @include thumb-base;
  background-image: url("../assets/icon/like.svg");
}
.thumb-filled {
  @include thumb-base;
  background-image: url("../assets/icon/like-filled.svg");
}
.link1 {
  @include link();
}
.link2 {
  @include link();
}
</style>
