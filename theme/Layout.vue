<template>
  <PageOuter />
  <Home v-if="path === 'home'" />
  <Blog v-else-if="path === 'blog'" />
  <Blog v-else-if="path === 'userinfo'" :userinfo="true" />
  <NotFound v-else-if="path === 'notFound'" />
</template>

<script>
  import './styles/common.css';
  import Home from './views/Home.vue';
  import Blog from './views/Blog.vue';
  import PageOuter from './components/PageOuter.vue';
  import NotFound from './views/NotFound.vue';

  export default {
    name: 'Index',
    components: { Home, Blog, NotFound, PageOuter },
    props: ['isNotFound'],
    data: () => ({
      scrollCallbacks: [],
    }),
    computed: {
      path() {
        const { path } = this.$route;
        if (path === '/userinfo.html') {
          return 'userinfo';
        } else if (path === '/') {
          return 'home';
        } else if (this.isNotFound) {
          return 'notFound';
        } else {
          return 'blog';
        }
      },
    },
    watch: {},
    methods: {},
    created() {},
    mounted() {},
    destroy() {},
  };
</script>

<style scoped>
  .Index {
    position: relative;
    height: 100vh;
    width: 100vw;
    border: var(--outer-width) solid #1a232c;
    box-sizing: border-box;
  }

  .Index::before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    outline: var(--outer-width) solid #1a232c;
    z-index: 600;
    pointer-events: none;
    border-radius: var(--outer-width);
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }

  .router {
    position: relative;
    width: 100%;
    min-height: 100%;
    z-index: 1;
    padding-bottom: 100px;
  }

  .notFound {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .notFound-icon {
    font-size: 40vmin;
  }

  .notFound-text {
    font-size: 10vmin;
  }
</style>
·
