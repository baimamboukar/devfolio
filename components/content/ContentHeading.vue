<script setup>
defineProps({ tag: { type: String, required: true }, id: { type: String, default: undefined } });
</script>
<template>
  <component :is="tag" :id="id" class="content-heading">
    <a v-if="id" :href="`#${id}`"><UIcon name="i-heroicons-hashtag-20-solid" class="heading-anchor" aria-hidden="true" /><slot /></a>
    <slot v-else />
  </component>
</template>
<style scoped>
.content-heading { position:relative; scroll-margin-top:96px; }
.content-heading a { font-weight:inherit; border:0; text-decoration:none; }
.heading-anchor { position:absolute; left:-24px; top:8px; width:16px; height:16px; opacity:0; color:var(--link-color); }
@media(min-width:1024px) { .content-heading a:hover .heading-anchor,.content-heading a:focus-visible .heading-anchor { opacity:1; } }
</style>
