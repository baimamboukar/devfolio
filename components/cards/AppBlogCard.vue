<script setup>
const props = defineProps({ description: String, blogTitle: String, url: String, title: String, tags: Array, readTime: String, pubDate: String, coverImage: String });
const published = computed(() => { const value = new Date(props.pubDate); return Number.isNaN(value.getTime()) ? '' : new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(value); });
const isExternal = computed(() => /^https?:\/\//.test(props.url || ''));
</script>
<template>
  <article class="writing-note"><img v-if="coverImage" :src="coverImage" :alt="blogTitle || title" width="240" height="160" loading="lazy" decoding="async" /><div><div class="writing-note-meta"><time v-if="published" :datetime="pubDate">{{ published }}</time><span v-if="readTime">{{ readTime }}</span></div><h3><NuxtLink :to="url" :external="isExternal" :target="isExternal ? '_blank' : undefined" rel="noopener noreferrer">{{ blogTitle || title }}</NuxtLink></h3><p v-if="description">{{ description }}</p><small v-if="tags?.length">{{ tags.slice(0, 3).join(' · ') }}</small></div></article>
</template>
<style scoped>
.writing-note{display:flex;gap:20px;padding:var(--row-gap,16px) 0;border-bottom:1px solid var(--line)}.writing-note>img{width:112px;height:84px;object-fit:cover;border-radius:8px}.writing-note>div{min-width:0}.writing-note-meta{display:flex;gap:12px;font-size:.73rem;color:var(--muted);margin-bottom:7px}.writing-note h3{font-size:var(--paper-size,17px);line-height:1.45}.writing-note h3 a{color:var(--ink)}.writing-note p{color:var(--muted);font-size:.9rem;line-height:1.6;margin-top:8px}.writing-note small{display:block;font-size:.74rem;color:var(--muted);margin-top:9px}@media(max-width:500px){.writing-note{flex-direction:column}.writing-note>img{width:100%;height:150px}}
</style>
