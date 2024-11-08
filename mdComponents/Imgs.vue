<template>
    <div class="imgs">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'Imgs',
    components: {},
    data: () => ({}),
    computed: {},
    watch: {},
    methods: {},
    created() {
        console.log(JSON.parse(this.$slots.content()[0].children));
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
