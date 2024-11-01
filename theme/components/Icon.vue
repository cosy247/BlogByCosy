<template>
    <span :style="style" v-if="(icon && icon.fontIcon) || fontIcon" v-html="(icon && icon.fontIcon) || fontIcon"></span>
    <img
        class="imgIcon"
        :style="style"
        v-else-if="(icon && icon.imgIcon) || imgIcon"
        :src="(icon && icon.imgIcon) || imgIcon" />
</template>

<script>
export default {
    name: 'Icon',
    props: ['size', 'icon', 'fontIcon', 'imgIcon'],
    computed: {
        style() {
            if (!this.size) return {};
            if (!Number.isNaN(this.size)) return { fontSize: `${this.size}px` };
            return { fontSize: this.size };
        },
    },
};
</script>

<style scoped>
.imgIcon {
    height: 1.2em;
}
</style>
