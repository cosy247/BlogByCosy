<template>
  <div class="Menu">
    <div class="content">
      <a href="/" class="logo">
        C
        <img src="../assets/images/icon.png" alt="" />
        SY247
      </a>
      <div href="/" class="logo mobile" :class="{ showMenu: isShowMenu }" @click="isShowMenu = !isShowMenu">
        C
        <img src="../assets/images/icon.png" alt="" />
        SY247
      </div>
      <div class="menus">
        <div class="menu">
          &#xe617;
          <span class="menu-title">标签</span>
          <div class="menu-position">
            <div class="menu-mask"></div>
            <div class="menu-content">
              <div class="menu-content-title">
                &#xe617;
                <span class="menu-content-title-main">标签</span>
                <span class="menu-content-title-describe">
                  tag&nbsp;∈&nbsp;[1,&nbsp;N]&nbsp;·&nbsp;one;&nbsp;&nbsp;&nbsp;one&nbsp;∈&nbsp;[0,&nbsp;5]&nbsp;·&nbsp;tag
                </span>
              </div>
              <div class="menu-content-list">
                <a :href="`/?tag=${key}`" class="menu-content-item" v-for="(item, key) in tags"
                  >{{ key }}({{ item }})</a
                >
              </div>
            </div>
          </div>
        </div>
        <div class="menu">
          &#xe69d;
          <span class="menu-title">归档</span>
          <div class="menu-position">
            <div class="menu-mask"></div>
            <div class="menu-content">
              <div class="menu-content-title">
                &#xe69d;
                <span class="menu-content-title-main">归档</span>
                <span class="menu-content-title-describe">
                  archive&nbsp;∈&nbsp;[1,&nbsp;N]&nbsp;·&nbsp;one;&nbsp;&nbsp;&nbsp;one&nbsp;∈&nbsp;[0,&nbsp;1]&nbsp;·&nbsp;archive
                </span>
              </div>
              <div class="menu-content-list">
                <a :href="`/?archive=${key}`" class="menu-content-item" v-for="(item, key) in archive"
                  >{{ key }}[{{ item }}]</a
                >
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="menu">
          &#xe67d;
          <RouterLink to="/album">图册</RouterLink>
        </div> -->
        <div class="menu">
          &#xe64f;
          <span class="menu-title">独立</span>
          <div class="menu-position">
            <div class="menu-mask"></div>
            <div class="menu-content">
              <div class="menu-content-title">
                &#xe64f;
                <span class="menu-content-title-main">独立</span>
                <span class="menu-content-title-describe">独立于本网站的应用、网页、服务、插件等。</span>
              </div>
              <div class="menu-alone-list">
                <a :href="item.url" class="menu-alone-item" v-for="item in alones">
                  <img v-if="item.icon" class="menu-alone-icon" :src="item.icon" :alt="item.name" />
                  {{ item.name }}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="menu">
          &#xe66d;
          <span class="menu-title">友链</span>
          <div class="menu-position">
            <div class="menu-mask"></div>
            <div class="menu-content">
              <div class="menu-content-title">
                &#xe66d;
                <span class="menu-content-title-main">友链</span>
                <span class="menu-content-title-describe">相逢何必曾相识，联系我创建关联。</span>
              </div>
              <div class="menu-alone-list">
                <a :href="item.url" class="menu-alone-item" v-for="item in blogFriends">
                  <img v-if="item.icon" class="menu-alone-icon" :src="item.icon" :alt="item.name" />
                  {{ item.name }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tools">
        <div class="tool" @click="showSearchBox">&#xe618;</div>
        <!-- <div class="tool" v-if="isSun" @click="changeTheme">&#xe63e;</div>
        <div class="tool" v-else @click="changeTheme">&#xe6c2;</div> -->
        <a class="tool" href="/userinfo.html">&#xe650;</a>
        <a class="tool home" href="/"> <img src="../assets/images/icon.png" alt="" /></a>
      </div>
    </div>
  </div>
  <div class="search-box" v-show="isShowSearch" @click.self="isShowSearch = false">
    <div class="search-main">
      <div class="search-input">
        <input
          class="search-input-text"
          type="text"
          @input="search"
          @keydown="searchPreventDefault"
          v-model="searchText"
          placeholder="输入关键词进行搜索"
          ref="searchInput"
        />
      </div>
      <div class="search-result" @click.self="isShowSearch = false">
        <div class="search-list">
          <p class="search-result-empty" v-if="searchList.length == 0">空空如也🍂</p>
          <a
            v-for="(item, index) in searchList"
            class="search-result-item"
            @click="goSearchLine(item.path)"
            :class="{ 'search-result-item-active': index === this.currentSearchLineIndex }"
            @mouseover="currentSearchLineIndex = index"
          >
            <p class="search-result-item-title">
              <span
                v-for="(key, i) in item.frontmatter.title"
                :class="{ 'search-result-key': item.countIndexs && item.countIndexs.includes(i) }"
                >{{ key }}</span
              >
            </p>
            <div class="search-result-item-infos">
              <p class="search-result-item-info" v-show="item.frontmatter.date">&#xe6ad;{{ item.frontmatter.date }}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { pageDatas, countMateData, themeConfig } from "@temp/blogMate";
import shadows from "@temp/shadows";
import md5 from "md5";

export default {
  name: "Menu",
  components: {},
  data: () => ({
    isSun: true,
    tags: countMateData.tags,
    archive: countMateData.archive,
    alones: themeConfig.alones,
    blogFriends: themeConfig.blogFriends,
    shadowPassword: themeConfig.shadowPassword,
    isShowSearch: false,
    searchText: "",
    searchList: [],
    pageDatas: JSON.parse(JSON.stringify(pageDatas)),
    currentSearchLineIndex: 0,
    isShowMenu: false,
  }),
  computed: {},
  watch: {},
  methods: {
    showSearchBox() {
      this.isShowSearch = true;
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
    },
    search() {
      this.currentSearchLineIndex = 0;
      const searchText = this.searchText.toLowerCase().trim();
      if (searchText === "") {
        this.searchList = [];
      } else {
        if (md5(searchText) === this.shadowPassword) {
          this.searchList = shadows;
        } else {
          this.searchList = this.pageDatas
            .map((item) => {
              let count = 0;
              const countIndexs = [];
              const lowerCasetitle = item.frontmatter.title.toLowerCase();
              for (let index = 0; index < lowerCasetitle.length; index++) {
                if (lowerCasetitle[index] !== searchText[count]) continue;
                count++;
                countIndexs.push(index);
                if (count < searchText.length) continue;
                return {
                  countIndexs,
                  ...item,
                };
              }
            })
            .filter((item) => item);
        }
      }
    },
    searchPreventDefault(event) {
      const { code, key, keyCode, which } = event;
      if (
        code === "ArrowDown" ||
        key === "ArrowDown" ||
        keyCode === 40 ||
        which === 40 ||
        code === "ArrowUp" ||
        key === "ArrowUp" ||
        keyCode === 38 ||
        which === 38
      ) {
        event.preventDefault();
        return;
      }
    },
    downSearchLine() {
      this.currentSearchLineIndex = Math.min(this.currentSearchLineIndex + 1, this.searchList.length - 1);
    },
    upSearchLine() {
      this.currentSearchLineIndex = Math.max(this.currentSearchLineIndex - 1, 0);
    },
    goSearchLine(path) {
      if (!path) {
        const currentLine = this.searchList[this.currentSearchLineIndex];
        if (!currentLine || !currentLine.path) return;
        path = currentLine.path;
      }
      if (md5(this.searchText) === this.shadowPassword) {
        sessionStorage.setItem("shadow", "shadow" + this.searchText);
      }
      window.location.href = path;
    },
  },
  created() {
    window.addEventListener("keydown", ({ code, key, keyCode, which }) => {
      if (!this.isShowSearch) return;
      if (code === "ArrowDown" || key === "ArrowDown" || keyCode === 40 || which === 40) {
        this.downSearchLine();
      } else if (code === "ArrowUp" || key === "ArrowUp" || keyCode === 38 || which === 38) {
        this.upSearchLine();
      } else if (code === "Enter" || key === "Enter" || keyCode === 13 || which === 13) {
        this.goSearchLine();
      }
    });
  },
  mounted() {},
  destroy() {},
};
</script>

<style scoped>
.Menu {
  position: fixed;
  top: var(--outer-width);
  left: calc(var(--outer-width) - 1px);
  width: calc(100vw - 2 * var(--outer-width) + 2px);
  background: white;
  z-index: 500;
  box-shadow: 0 0 10px #8882;
  transform: translateY(-1px);
  border-radius: var(--outer-width) var(--outer-width) 0 0;
}

.content {
  width: var(--content-max-width);
  max-width: 90%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  cursor: pointer;
  font-size: 26px;
  background: linear-gradient(to right, red, blue);
  font-weight: 900;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: flex;
  align-items: center;
  width: 200px;
}

.logo.mobile {
  display: none;
  width: fit-content;
}

.logo img {
  height: 1em;
  vertical-align: bottom;
  margin: 0 0.1em;
}

.menus {
  display: flex;
  transition: color 0.1s;
  color: #1a1a1a;
}

.menus:hover {
  color: #1a1a1a88;
}

.menu {
  cursor: pointer;
  padding: 20px;
  transition: color 0.1s;
  font-size: 15px;
  z-index: 9;
}

.menu:hover {
  color: #1a1a1a;
}

.menu::first-letter {
  font-size: 1.2em;
  vertical-align: baseline;
}

.menu-title {
  font-weight: 900;
  margin-left: 5px;
}

.menu-position {
  position: absolute;
  left: 0;
  top: 60px;
  width: 100%;
  background: transparent;
  pointer-events: none;
  z-index: 0;
}

.menu-position:hover,
.menu:hover > .menu-position {
  pointer-events: all;
  background: white;
}

.menu-mask {
  position: absolute;
  display: none;
  top: 100%;
  width: 100%;
  height: 100vh;
  background: transparent;
  pointer-events: none;
  backdrop-filter: blur(3px);
  transition-delay: 0.2s;
}

.menu-position:hover .menu-mask,
.menu:hover .menu-mask {
  background: #1112;
  display: block;
}

.menu-content {
  width: 505px;
  margin: 20px auto;
  opacity: 0;
}

.menu-position:hover .menu-content,
.menu:hover .menu-content {
  opacity: 1;
}

.menu-content-title-main {
  font-weight: 900;
  margin-right: 20px;
}

.menu-content-title-describe {
  opacity: 0.8;
}

.menu-content-list {
  display: flex;
  flex-wrap: wrap;
  white-space: nowrap;
  margin-top: 30px;
  padding: 0 20px;
  color: #1a1a1a;
  width: fit-content;
}

.menu-content-list:hover {
  color: #999;
}

.menu-content-item {
  padding: 0.5em 1em;
}

.menu-content-item:hover {
  color: #000;
}

.menu-alone-list {
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
}

.menu-alone-list:hover > .menu-alone-item {
  opacity: 0.5;
}

.menu-alone-item {
  display: inline-flex;
  align-items: center;
  font-size: var(--size2);
  transition: 0.2s;
  width: fit-content;
  margin: 10px 20px;
}

.menu-alone-item:hover {
  opacity: 1 !important;
}

.menu-alone-icon {
  height: 1.5em;
}

.menu-alone-describe {
  font-size: 12px;
  opacity: 0.5;
  font-size: var(--size1);
}

.tools {
  display: flex;
  width: 115px;
  gap: 20px;
  font-size: 18px;
  justify-content: flex-end;
  align-items: center;
  user-select: none;
}

.tool {
  cursor: pointer;
}

.tool.home {
  display: none;
}

.tool.home img {
  height: 1.2em;
  display: block;
}

.search-box {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #8888;
  backdrop-filter: blur(4px);
  z-index: 550;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-main {
  margin-bottom: 10vh;
  width: 750px;
  max-width: 90%;
}

.search-input {
  padding: 20px 30px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 0 5px #7898;
}

.search-input-text {
  border: none;
  outline: none;
  width: 100%;
  flex: 1;
  border-bottom: 1px solid #9a88;
  padding: 5px 10px;
  box-sizing: border-box;
  font-size: var(--size3);
  font-weight: 100;
  font-family: inherit;
}

.search-button {
  font-size: var(--size3);
  margin-left: 10px;
  cursor: pointer;
}

.search-result {
  margin-top: 3vh;
  height: 50vh;
}

.search-list {
  padding: 0 10px;
  border: 20px solid white;
  border-radius: 8px;
  background: white;
  box-shadow: 0 0 5px #7898;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
  max-height: 100%;
  -ms-overflow-style: none;
}

.search-list::-webkit-scrollbar {
  display: none;
}

.search-result-empty {
  text-align: center;
  margin: 20px 0;
  font-size: var(--size3);
  opacity: 0.5;
  user-select: none;
}

.search-result-item {
  display: block;
  transition: 0.2s;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.search-result-item-active {
  opacity: 1;
}

.search-result-item + .search-result-item {
  margin-top: 20px;
}

.search-result-item-title {
  position: relative;
  color: #1b2832;
  font-size: var(--size2);
}

.search-result-item-title::after {
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
.search-result-item-active .search-result-item-title::after {
  opacity: 1;
}

.search-result-key {
  color: var(--color-theme);
  text-decoration: underline;
}

.search-result-item-infos {
  margin-top: 10px;
  font-size: var(--size1);
  display: flex;
  align-items: center;
  justify-content: right;
}

.search-result-item-info {
  margin-left: 15px;
}

.search-result-over {
  margin: 100px auto 300px;
  text-align: center;
  height: 2px;
  line-height: 2px;
  font-size: var(--size1);
  color: #1b283288;
}
</style>
