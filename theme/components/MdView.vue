<template>
    <div class="mdView">
        <Content :path="path" class="mdContent" />
    </div>
</template>

<script>
import '../styles/md.css';

export default {
    name: 'MdView',
    components: {},
    props: ['path'],
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
.MdView {
    position: relative;
}
</style>
