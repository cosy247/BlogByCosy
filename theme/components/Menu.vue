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
                <div class="menu" v-for="menu in pageConfig.menus">
                    <span class="menu-title">
                        <Icon size="18" :icon="menu" />
                        {{ menu.name }}
                    </span>
                    <div class="menu-position">
                        <div class="menu-mask"></div>
                        <div class="menu-content">
                            <div class="menu-content-title" v-if="menu.description">
                                <span class="menu-content-title-main">
                                    <Icon size="17" :icon="menu" />
                                    {{ menu.name }}
                                </span>
                                <span class="menu-content-title-describe" v-html="menu.description"></span>
                            </div>
                            <!-- statistics -->
                            <div class="menu-content-list" v-if="menu.type === 'statistics'">
                                <a
                                    :href="`/?${menu.statistics.frontName}=${key}`"
                                    class="menu-content-item"
                                    v-for="(item, key) in countMateData[menu.statistics.frontName]">
                                    {{ key }}({{ item }})
                                </a>
                            </div>
                            <!-- exhibit -->
                            <div class="menu-exhibit-list" v-else-if="menu.type === 'exhibit'">
                                <a :href="item.url" class="menu-exhibit-item" v-for="item in menu.exhibit">
                                    <Icon class="menu-exhibit-icon" :icon="item"/>
                                    {{ item.name }}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tools">
                <div class="tool" @click="showSearchBox">&#xe618;</div>
                <span class="tool" @click="openReadMeContent">&#xe650;</span>
                <a class="tool home" href="/"><img src="../assets/images/icon.png" alt="" /></a>
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
                    ref="searchInput" />
            </div>
            <div class="search-result" @click.self="isShowSearch = false">
                <div class="search-list">
                    <p class="search-result-empty" v-if="searchList.length == 0">空空如也🍂</p>
                    <a
                        v-for="(item, index) in searchList"
                        class="search-result-item"
                        @click="goSearchLine(item.path)"
                        :class="{ 'search-result-item-active': index === this.currentSearchLineIndex }"
                        @mouseover="currentSearchLineIndex = index">
                        <p class="search-result-item-title">
                            <span
                                v-for="(key, i) in item.frontmatter.title"
                                :class="{ 'search-result-key': item.countIndexs && item.countIndexs.includes(i) }">
                                {{ key }}
                            </span>
                        </p>
                        <div class="search-result-item-infos">
                            <p class="search-result-item-info" v-show="item.frontmatter.date">
                                &#xe6ad;{{ item.frontmatter.date }}
                            </p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div class="readme-box" v-show="isShowReadMe" @click.self="closeReadMeContent">
        <div class="readme-container">
            <div class="readme-close" @click="closeReadMeContent">&#xe632;</div>
            <MdView path="/README.md" class="readme-content" />
        </div>
    </div>
</template>

<script>
import { pageList as pageDatas, countMateData, pageConfig, shadowList as shadows } from '@temp/blogMate';
import MdView from './MdView.vue';
import Icon from './Icon.vue';
import md5 from 'md5';

export default {
    name: 'Menu',
    components: { MdView, Icon },
    data: () => ({
        isSun: true,
        countMateData,
        isShowSearch: false,
        searchText: '',
        searchList: [],
        pageDatas: JSON.parse(JSON.stringify(pageDatas)),
        currentSearchLineIndex: 0,
        isShowMenu: false,
        isShowReadMe: false,
        pageConfig,
    }),
    computed: {},
    watch: {},
    methods: {
        openReadMeContent() {
            if (typeof window == 'undefined') return;
            this.isShowReadMe = true;
            window.document.body.style.overflowY = 'hidden';
            window.document.body.style.paddingRight = 'var(--outer-width)';
        },
        closeReadMeContent() {
            if (typeof window == 'undefined') return;
            this.isShowReadMe = false;
            window.document.body.style.overflowY = 'auto';
            window.document.body.style.paddingRight = '0';
        },
        showSearchBox() {
            this.isShowSearch = true;
            this.$nextTick(() => {
                this.$refs.searchInput.focus();
            });
        },
        search() {
            this.currentSearchLineIndex = 0;
            const searchText = this.searchText.toLowerCase().trim();
            if (searchText === '') {
                this.searchList = [];
            } else {
                if (md5(searchText) === this.pageConfig.shadowPassword) {
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
                code === 'ArrowDown' ||
                key === 'ArrowDown' ||
                keyCode === 40 ||
                which === 40 ||
                code === 'ArrowUp' ||
                key === 'ArrowUp' ||
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
            if (typeof window == 'undefined') return;
            if (!path) {
                const currentLine = this.searchList[this.currentSearchLineIndex];
                if (!currentLine || !currentLine.path) return;
                path = currentLine.path;
            }
            if (md5(this.searchText) === this.pageConfig.shadowPassword) {
                sessionStorage.setItem('shadow', 'shadow' + this.searchText);
            }
            window.location.href = path;
        },
    },
    created() {
        if (typeof window == 'undefined') return;
        window.addEventListener('keydown', ({ code, key, keyCode, which }) => {
            if (!this.isShowSearch) return;
            if (code === 'ArrowDown' || key === 'ArrowDown' || keyCode === 40 || which === 40) {
                this.downSearchLine();
            } else if (code === 'ArrowUp' || key === 'ArrowUp' || keyCode === 38 || which === 38) {
                this.upSearchLine();
            } else if (code === 'Enter' || key === 'Enter' || keyCode === 13 || which === 13) {
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

.menu-title {
    font-weight: 900;
    margin-left: 5px;
}

.menu-position {
    position: absolute;
    left: 0;
    top: 58px;
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

.menu-exhibit-list {
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
}

.menu-exhibit-list:hover > .menu-exhibit-item {
    opacity: 0.5;
}

.menu-exhibit-item {
    display: inline-flex;
    align-items: center;
    font-size: var(--size2);
    transition: 0.2s;
    width: fit-content;
    margin: 10px 20px;
}

.menu-exhibit-item:hover {
    opacity: 1 !important;
}

.menu-exhibit-icon {
    height: 1.4em;
    margin-right: 3px;
}

.menu-exhibit-describe {
    font-size: 12px;
    opacity: 0.5;
    font-size: var(--size1);
}

.tools {
    display: flex;
    width: 115px;
    gap: 10px;
    font-size: 18px;
    justify-content: flex-end;
    align-items: center;
    user-select: none;
}

.tool {
    cursor: pointer;
    padding: 0.5em;
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
    animation: readmeContainer 0.3s;
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
    content: '';
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

.readme-box {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: #0008;
    z-index: 9999;
    display: flex;
    backdrop-filter: blur(4px);
}
.readme-container {
    position: relative;
    height: 600px;
    width: 900px;
    max-width: 95%;
    max-height: 90%;
    background: white;
    border-radius: 10px;
    padding: 20px;
    margin: auto;
    box-sizing: border-box;
    animation: readmeContainer 0.3s;
    box-shadow: 0 0 10px #8888;
}
@keyframes readmeContainer {
    0% {
        opacity: 0.5;
        transform: translateY(10%);
    }
}
.readme-close {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    font-size: var(--size3);
    color: #555;
    z-index: 9;
}
.readme-close:hover {
    filter: brightness(1.8);
    transition-duration: 0.1s;
}
.readme-content {
    overflow: auto;
    height: 100%;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.readme-content::-webkit-scrollbar {
    display: none;
}

.readme-content :deep(h1) {
    padding-top: 0;
    margin-top: 0;
}
</style>
