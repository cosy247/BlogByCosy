<template>
  <div class="AlbumItem">
    <MdView />
  </div>
</template>

<script>
  import MdView from '../components/MdView.vue';

  export default {
    name: 'AlbumItem',
    components: { MdView },
    data: () => ({}),
    computed: {},
    watch: {},
    methods: {},
    created() {},
    mounted() {},
    destroy() {},
  };
</script>

<style scoped>
  .AlbumItem {
    position: relative;
  }
</style>
