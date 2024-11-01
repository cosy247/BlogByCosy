<template>
    <div class="blog-infos">
        <a :href="item.url" class="blog-info" v-for="item in staticFrontmatter">
            <span class="blog-info-text">{{ item.value }}</span>
            <Icon class="blog-info-icon" :icon="staticFrontmatterIconMap[item.name]" />
        </a>
        <div v-if="staticFrontmatter.length" class="blog-info-br"></div>
        <div class="blog-info" @click="gotoRecom" v-if="recommendations.length">
            <span class="blog-info-text">相关推荐</span>
            <span class="blog-info-icon">&#xe60d;</span>
        </div>
        <div class="blog-info" @click="gotoComment">
            <span class="blog-info-text">评论</span>
            <span class="blog-info-icon">&#xe6b3;</span>
        </div>
        <div class="blog-info" @click="gotoTop">
            <span class="blog-info-text">顶部</span>
            <span class="blog-info-icon">&#xe62b;</span>
        </div>
    </div>
    <MdView class="blog-mdView" />
    <p class="recom-title">✨相关推荐✨</p>
    <div class="recoms" ref="recom" v-if="recommendations.length">
        <a :href="item.path" class="recom" v-for="(item, index) in recommendations" :key="index">
            ✨ {{ item.frontmatter.title }}
        </a>
    </div>
    <p class="recom-title">🧐评论🧐</p>
    <div class="blog-comment" ref="comment">
        <div class="blog-comment-main">
            <Giscus
                repo="cosy247/vuepress-theme-cosy"
                repoId="R_kgDOJI48fw"
                category="Announcements"
                categoryId="DIC_kwDOJI48f84Ceg84"
                mapping="pathname"
                term="Welcome to @giscus/react component!"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme="light"
                lang="zh-CN" />
        </div>
    </div>
    <Toc class="blog-toc" ref="toc" />
</template>

<script>
import { pageList as pageDatas, pageConfig } from '@temp/blogMate';
import { usePageData } from '@vuepress/client';
import MdView from '../components/MdView.vue';
import Icon from '../components/Icon.vue';
import Giscus from '@giscus/vue';
import md5 from 'md5';

export default {
    name: 'Blog',
    components: { MdView, Giscus, Icon },
    props: [],
    data: () => ({
        currentHash: '',
        pageData: usePageData().value,
    }),
    computed: {
        staticFrontmatterIconMap() {
            return pageConfig.menus
                .filter((item) => item.type === 'statistics')
                .reduce((staticFrontmatterIconMap, item) => {
                    staticFrontmatterIconMap[item.statistics.frontName] = {
                        fontIcon: item.fontIcon,
                        imgIcon: item.imgIcon,
                    };
                    return staticFrontmatterIconMap;
                }, {});
        },
        staticFrontmatter() {
            return pageConfig.countMateNames.reduce((staticFrontmatter, name) => {
                if (!this.pageData.frontmatter[name]) return staticFrontmatter;
                if (pageConfig.isArrMateNames.includes(name)) {
                    this.pageData.frontmatter[name].split(' ').forEach((n) => {
                        staticFrontmatter.push({
                            name: name,
                            value: n,
                            url: `/?${name}=${n}`,
                        });
                    });
                } else {
                    staticFrontmatter.push({
                        name: name,
                        value: this.pageData.frontmatter[name],
                        url: `/?${name}=${this.pageData.frontmatter[name]}`,
                    });
                }
                return staticFrontmatter;
            }, []);
        },
        recommendations() {
            const pageData = pageDatas.find((i) => i.frontmatter.id === this.pageData.frontmatter.id);
            if (pageData && pageData.frontmatter && pageData.frontmatter.recommendations) {
                return pageData.frontmatter.recommendations
                    .map((id) => pageDatas.find((i) => i.frontmatter.id === +id))
                    .filter((i) => i);
            }
            return [];
        },
    },
    watch: {},
    methods: {
        gotoComment() {
            if (typeof window == 'undefined') return;
            window.document.documentElement.scrollTop = this.$refs.comment.offsetTop - 200;
        },
        gotoTop() {
            if (typeof window == 'undefined') return;
            window.document.documentElement.scrollTop = 0;
        },
        gotoRecom() {
            if (typeof window == 'undefined') return;
            window.document.documentElement.scrollTop = this.$refs.recom.offsetTop - 200;
        },
    },
    created() {
        if (typeof window == 'undefined') return;

        // 检查是否直接进入隐藏文件
        if (this.pageData.frontmatter.shadow === true) {
            const shadow = sessionStorage.getItem('shadow');
            if (!shadow || md5(shadow.slice(6)) !== themeConfig.shadowPassword) {
                this.$router.push('/');
            }
            return;
        }

        // toc滚动跟随
        window.addEventListener('scroll', () => {
            if (this.currentHash === location.hash) return;
            this.currentHash = location.hash;
            const activeToc = this.$refs.toc.querySelector('.route-link.vuepress-toc-link.active');
            if (!activeToc) return;
            this.$refs.toc.scrollTop = activeToc.offsetTop - this.$refs.toc.clientHeight / 2;
        });
    },
    mounted() {},
    destroy() {},
};
</script>

<style scoped>
.blog-infos {
    position: fixed;
    top: 50%;
    right: calc(50% + 420px);
    overflow: auto;
    transform: translate(0, -50%);
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    align-items: flex-end;
    transition: 0.5s;
    z-index: 10;
}
.blog-infos.hidden {
    opacity: 0;
    pointer-events: none;
}
.blog-infos:hover .blog-info-text {
    opacity: 0.3;
}
.blog-info {
    padding: 10px 0;
    cursor: pointer;
    white-space: nowrap;
}
.blog-info-br {
    font-size: var(--size2);
    height: 1px;
    width: 2em;
    background: var(--color-theme);
    opacity: 0.2;
    transition: 0.5s;
}
.blog-infos:hover .blog-info-br {
    width: 100%;
    opacity: 1;
}
.blog-info-text {
    font-size: var(--size1);
    margin-right: 10px;
    opacity: 0;
    font-weight: 900;
    transition: 0.5s;
}
.blog-info:hover > .blog-info-text {
    opacity: 1;
}
.blog-info-icon {
    display: inline-block;
    margin: auto;
    font-size: var(--size2);
    height: 2em;
    width: 2em;
    line-height: 2em;
    text-align: center;
    background: #f1f3f3;
    border-radius: 50%;
    cursor: pointer;
    transition: 0.3s;
    color: #999;
}
.blog-info:hover .blog-info-icon {
    color: #333;
}
.blog-tags {
    margin-top: 20px;
    flex-wrap: wrap;
}
.blog-tag {
    font-size: var(--size1);
    padding: 0.1em 0.7em;
    border-radius: 0.5em;
    border: 2px solid #333;
    margin-right: 0.5em;
    cursor: pointer;
}
.blog-mdView {
    margin: auto;
    width: 95%;
    max-width: var(--blog-width);
}
.recom-title {
    font-size: var(--size3);
    text-align: center;
    margin-top: 100px;
}
.recoms {
    display: flex;
    gap: 20px;
    width: 95%;
    max-width: var(--blog-width);
    margin: 30px auto 0;
    flex-wrap: wrap;
}
.recoms:empty {
    margin-top: 0;
}
.recom {
    border: 1px solid #1979df88;
    padding: 10px;
    border-radius: 10px;
    font-size: var(--size1);
    font-weight: 900;
}
.recom:hover {
    border: 1px solid #1979df;
    background: #1979df;
    color: white;
}
.blog-comment {
    position: relative;
    top: 200px;
    padding-bottom: 200px;
    background: linear-gradient(#fff0, #fff 50px);
    z-index: 1;
    pointer-events: none;
}
.blog-comment-main {
    position: relative;
    top: -150px;
    width: 95%;
    max-width: var(--blog-width);
    margin: auto;
    pointer-events: auto;
}
.blog-toc {
    position: fixed;
    top: 50%;
    padding-right: 10px;
    left: calc(50% + 420px);
    width: fit-content;
    max-width: calc(50% - 420px);
    max-height: 50%;
    overflow-y: auto;
    overflow-x: clip;
    transform: translate(0, -50%);
    font-size: var(--size1);
    transition: 0.5s;
    white-space: nowrap;
}

.blog-toc::-webkit-scrollbar {
    background: #0000;
}

.blog-toc::-webkit-scrollbar-thumb {
    background: #0000;
}
</style>

<style>
.blog-mdView div > h1:first-child {
    font-size: var(--size7);
    margin-bottom: 20px;
    word-break: break-all;
}
.blog-toc .vuepress-toc-item > a {
    opacity: 0.5;
    transition: 0.5s;
    color: transparent;
    display: block;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding: 0.1em 0;
    font-size: var(--size1);
}
.blog-toc:hover .vuepress-toc-item > a {
    color: inherit;
    opacity: 0.6;
}
.blog-toc .vuepress-toc-item > a:hover {
    opacity: 1;
}
.blog-toc .vuepress-toc-item > a.active {
    opacity: 1;
    color: inherit;
    font-weight: 900;
}
.blog-toc .vuepress-toc-item > a::before {
    content: '';
    width: 1em;
    height: 0.25em;
    background: #c1c2c4;
    display: inline-block;
    vertical-align: middle;
    margin-right: 0.5em;
    border-radius: 1em;
}
.blog-toc .vuepress-toc-item > a:hover::before {
    opacity: 0.5;
    background: var(--color-theme);
}
.blog-toc .vuepress-toc-item > a.active::before {
    opacity: 1;
    background: var(--color-theme);
}
.blog-toc .vuepress-toc-list > .vuepress-toc-item > .vuepress-toc-list .vuepress-toc-item > a::before {
    width: 1.5em;
}
</style>
