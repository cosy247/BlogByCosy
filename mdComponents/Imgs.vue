<template>
    <div class="imgs">
        ✨✨
        <slot></slot>
        ✨✨
    </div>
</template>

<script>
export default {
    name: 'Imgs',
    props: ['params','contents'],
    components: {},
    data: () => ({}),
    computed: {},
    watch: {},
    methods: {},
    created() {
        console.log((this.contents));
    },
    mounted() {},
    destroy() {},
};
</script>

<style scoped>
.imgs {
    position: relative;
}
</style>
