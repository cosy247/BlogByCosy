<template>
  <div class="Album">
	<div class="album-item" @click="$router.push(item.path)" v-for="item in albums">
		{{ item.frontmatter.title }}
	</div>
  </div>
</template>

<script>
//   import { userPageData } from 'vuepress/client';
  import { pageDatas } from '@temp/blogMate';

  export default {
    name: 'Album',
    components: {},
	data: () => ({
		albums: []
	}),
    computed: {},
    watch: {},
    methods: {},
    created() {
      this.albums = pageDatas.album;
    },
    mounted() {},
    destroy() {},
  };
</script>

<style scoped>
  .Album {
    position: relative;
  }
</style>
