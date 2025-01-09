<template>
  <span :style="style" v-if="(icon && icon.fontIcon) || fontIcon" v-html="(icon && icon.fontIcon) || fontIcon"></span>
  <img
    class="imgIcon"
    :style="style"
    v-else-if="(icon && icon.imgIcon) || imgIcon"
    :src="(icon && icon.imgIcon) || imgIcon" />
</template>

<script setup>
import { computed } from 'vue';

const { size, icon, fontIcon, imgIcon } = defineProps(['size', 'icon', 'fontIcon', 'imgIcon']);
const style = computed(() => {
  if (!size) return {};
  if (!Number.isNaN(size)) return { fontSize: `${size}px` };
  return { fontSize: size };
});
</script>

<style scoped>
.imgIcon {
  height: 1.2em;
}
</style>
