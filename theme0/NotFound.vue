<template>
  <Layout :isNotFound="true"></Layout>
</template>

<script>
  import Layout from './Layout.vue';

  export default {
    name: 'NotFound',
    components: { Layout },
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
  .NotFound {
    position: relative;
  }
</style>
