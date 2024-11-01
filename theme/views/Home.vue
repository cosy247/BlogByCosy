<template>
    <div class="cover" :class="{ filter: pageFilterType }">
        <div class="cover-content" :style="{ paddingTop: 37 * firstPageProportion + '%' }">
            <p class="cover-title" v-if="pageFilterType">
                {{ pageFilterType }}
                <span class="cover-title-value">.{{ pageFilterValue }}</span>
                <span class="cover-count">【{{ allPageCount }}】</span>
            </p>
            <template v-else>
                <div class="cover-title">
                    <div class="cover-logo">
                        C
                        <img src="../assets/images/icon.png" alt="" />
                        SY247
                    </div>
                    <span class="cover-count">【{{ allPageCount }}】</span>
                </div>
                <p class="cover-dictum">{{ mottos[0] }}</p>
                <p class="cover-dictum-2" v-for="motto in mottos.slice(1)">{{ motto }}</p>
            </template>
            <div class="cover-links">
                <a v-for="item in pageConfig.links" class="cover-link" :href="item.url" target="_blank">
                    <Icon :icon="item" />
                    {{ item.name }}
                </a>
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
import { pageList as pageDatas, pageConfig } from '@temp/blogMate';
import Icon from '../components/Icon.vue';

export default {
    name: 'Home',
    components: { Icon },
    props: [],
    data: () => ({
        tag: '',
        archive: '',
        pageList: [],
        remainPageList: [],
        allPageCount: 0,
        pageSize: 10,
        isAddingPageList: false,
        mottos: [],
        firstPageProportion: 0,
        pageConfig,
    }),
    computed: {
        pageFilterType() {
            return this.pageConfig.countMateNames.find((name) => this.$route.query[name]) || '';
        },
        pageFilterValue() {
            return this.$route.query[this.pageFilterType] || '';
        },
    },
    watch: {
        pageFilterType() {
            this.initPageList();
        },
        pageFilterValue() {
            this.initPageList();
        },
    },
    methods: {
        initPageList() {
            if (this.pageFilterType) {
                console.log(this.pageFilterType, this.pageFilterValue);
                if (this.pageConfig.isArrMateNames.includes(this.pageFilterType)) {
                    this.remainPageList = pageDatas.filter((item) =>
                        item.frontmatter[this.pageFilterType].includes(this.pageFilterValue)
                    );
                } else {
                    this.remainPageList = pageDatas.filter(
                        (item) => item.frontmatter[this.pageFilterType] === this.pageFilterValue
                    );
                }
            } else {
                this.remainPageList = pageDatas;
            }
            this.allPageCount = this.pageList.length + this.remainPageList.length;
            this.pageList = this.remainPageList.splice(0, this.pageSize);
        },
    },
    created() {
        if (this.pageConfig.mottos instanceof Array) {
            this.mottos = this.pageConfig.mottos[(Math.random() * this.pageConfig.mottos.length) >> 0];
        } else {
            this.mottos = [this.pageConfig.mottos];
        }
        this.initPageList();
    },
    mounted() {
        if (typeof window == 'undefined') return;
        window.addEventListener('scroll', () => {
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
}

.cover-title img {
    height: 1em;
}

.cover-logo {
    display: flex;
    align-items: center;
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
