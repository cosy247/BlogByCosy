<template>
  <div class="cover" ref="cover">
    <div class="cover-content" :style="{ paddingTop: 37 * firstPageProportion + '%' }">
      <p class="cover-title" v-if="tag || archive">
        {{ tag ? "tag" : "archive" }}
        <span class="cover-title-value">.{{ tag || archive }}</span>
        <span class="cover-count">【{{ allPageCount }}】</span>
      </p>
      <template v-else>
        <p class="cover-title">
          C
          <img src="../assets/images/icon.png" alt="" />
          SY247
          <span class="cover-count">【{{ allPageCount }}】</span>
        </p>
        <p class="cover-dictum">{{ motto[0] }}</p>
        <p class="cover-dictum-2" v-for="motto in motto.slice(1)">{{ motto }}</p>
      </template>
      <div class="cover-links">
        <a
          v-for="item in themeConfig.links"
          class="cover-link"
          :href="item.href"
          target="_blank"
          v-html="item.name"
        ></a>
      </div>
    </div>
  </div>
  <div class="list">
    <a :href="item.path" class="list-item" v-for="item in pageList">
      <p class="list-item-title">{{ item.frontmatter.title }}</p>
      <div class="list-item-infos">
        <p class="list-item-info" v-show="item.frontmatter.date">
          &#xe6ad;
          {{ item.frontmatter.date }}
        </p>
      </div>
    </a>
    <div class="list-over">🐲 时间线到头了 🦄</div>
  </div>
</template>

<script>
import { pageDatas, themeConfig } from "@temp/blogMate";

export default {
  name: "Home",
  components: {},
  props: [],
  data: () => ({
    tag: "",
    archive: "",
    pageList: [],
    remainPageList: [],
    allPageCount: 0,
    pageSize: 10,
    isAddingPageList: false,
    themeConfig,
    motto: "",
    firstPageProportion: 0,
  }),
  computed: {
    cover() {
      return [this.$route.query.tag, this.$route.query.archive];
    },
  },
  watch: {
    cover: {
      handler([tag, archive]) {
        this.tag = tag;
        this.archive = archive;
        this.$nextTick(() => {
          if (!this.$refs.cover) return;
          if (tag || archive) {
            this.$refs.cover.classList.add("filter");
          } else {
            this.$refs.cover.classList.remove("filter");
          }
        });
        this.initPageList();
      },
      immediate: true,
    },
  },
  methods: {
    initPageList() {
      if (this.tag) {
        this.remainPageList = pageDatas.filter((item) => item.frontmatter.tags?.includes(this.tag));
      } else if (this.archive) {
        this.remainPageList = pageDatas.filter((item) => item.frontmatter.archive === this.archive);
      } else {
        this.remainPageList = pageDatas;
      }
      this.allPageCount = this.pageList.length + this.remainPageList.length;
      this.pageList = this.remainPageList.splice(0, this.pageSize);
    },
  },
  created() {
    if (themeConfig.motto instanceof Array) {
      this.motto = themeConfig.motto[(Math.random() * themeConfig.motto.length) >> 0];
    } else {
      this.motto = [themeConfig.motto];
    }
  },
  mounted() {
    window.addEventListener("scroll", () => {
      const { clientHeight, scrollTop, scrollHeight } = document.documentElement;
      if (scrollTop < clientHeight) {
        this.firstPageProportion = scrollTop / clientHeight;
      }
      if (this.isAddingPageList || this.remainPageList.length === 0) return;
      if (scrollHeight - clientHeight - scrollTop < 400) {
        this.isAddingPageList = true;
        this.pageList.push(...this.remainPageList.splice(0, this.pageSize));
        this.$nextTick(() => {
          this.isAddingPageList = false;
        });
      }
    });
  },
  destroy() {},
};
</script>

<style scoped>
.cover {
  position: relative;
  width: 100%;
  height: calc(100vh - 60px - var(--outer-width));
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover.filter {
  height: calc(40vh - 60px - var(--outer-width));
}

.cover-content {
  box-sizing: border-box;
  padding-bottom: 10vh;
  max-width: 67%;
}

.cover.filter .cover-content {
  padding-bottom: 5vh;
}

.cover-title {
  font-size: 11vmin;
  font-weight: 900;
  width: 100%;
  background: linear-gradient(to right, red, blue);
  background-clip: text;
  color: transparent;
  display: flex;
  align-items: baseline;
  animation: outFromBottom 0.5s;
}

@keyframes outFromBottom {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
}

.cover-title-value {
  font-size: 0.4em;
}

.cover-count {
  font-size: var(--size2);
  vertical-align: bottom;
}

.cover-title img {
  height: 1em;
}

.cover-dictum {
  font-size: var(--size2);
  margin-top: 25px;
  color: #334155;
}

.cover-dictum-2 {
  font-size: var(--size1);
  margin-top: 20px;
  color: #334155ca;
}

.cover-links {
  display: flex;
  align-items: center;
  margin-top: 40px;
  color: #5d67e8;
  font-size: var(--size1);
}

.cover-link {
  margin-right: 20px;
}

.cover-link::first-letter {
  margin-right: 5px;
}

.list {
  margin: auto;
  width: var(--content-width);
  max-width: var(--content-max-width);
}

.list-item {
  display: block;
  transition: 0.2s;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.list-item:hover {
  opacity: 1;
}

.list-item + .list-item {
  margin-top: 50px;
}

.list-item-title {
  position: relative;
  color: #1b2832;
  font-size: var(--size5);
}

.list-item-title::after {
  content: "";
  width: 100%;
  height: 2px;
  position: absolute;
  left: 0;
  top: 100%;
  background: linear-gradient(to right, red, blue);
  opacity: 0;
  transition: 0.2s;
  margin-top: 5px;
}

.list-item:hover .list-item-title::after {
  opacity: 1;
}

.list-item-infos {
  margin-top: 15px;
  font-size: var(--size1);
  display: flex;
  align-items: center;
  justify-content: right;
}

.list-item-info {
  margin-left: 15px;
}

.list-over {
  margin: 100px auto 300px;
  text-align: center;
  height: 2px;
  line-height: 2px;
  font-size: var(--size1);
  color: #1b283288;
}
</style>
