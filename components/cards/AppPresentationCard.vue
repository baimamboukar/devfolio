<script setup>
const props = defineProps({ presentationTitle: { type: String, default: '' }, presentationCommunity: { type: String, default: '' }, presentationUrl: { type: String, default: '' }, presentationDate: { type: String, default: '' }, cover: { type: String, default: '' }, icon: { type: String, default: '' } });
const external = computed(() => /^https?:\/\//.test(props.presentationUrl));
const validUrl = computed(() => external.value || /^\/(?!\/)/.test(props.presentationUrl));
const date = computed(() => { const value = new Date(props.presentationDate); return Number.isNaN(value.getTime()) ? '' : new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(value); });
</script>
<template>
  <article class="talk-note"><img v-if="cover" :src="cover" :alt="presentationTitle" width="240" height="150" loading="lazy" decoding="async" /><div><p>{{ presentationCommunity }}<span v-if="date"> · {{ date }}</span></p><h3><NuxtLink v-if="validUrl" :to="presentationUrl" :external="external" :target="external ? '_blank' : undefined" rel="noopener noreferrer">{{ presentationTitle }}</NuxtLink><template v-else>{{ presentationTitle }}</template></h3><NuxtLink v-if="validUrl" :to="presentationUrl" :external="external" :target="external ? '_blank' : undefined" rel="noopener noreferrer" class="talk-resource">Open resource ↗</NuxtLink></div></article>
</template>
<style scoped>
.talk-note{display:flex;align-items:center;gap:18px;padding:16px;background:var(--surface-alt);border-radius:var(--corner-radius,12px)}.talk-note img{width:132px;height:86px;object-fit:contain;border-radius:6px;background:var(--surface)}.talk-note>div{min-width:0}.talk-note p{font-size:.73rem;color:var(--muted);margin-bottom:6px}.talk-note h3{font-size:var(--paper-size,17px);line-height:1.4}.talk-note h3 a{color:var(--ink)}.talk-resource{display:inline-flex;font-size:.78rem;margin-top:9px}@media(max-width:500px){.talk-note{align-items:flex-start;flex-direction:column}.talk-note img{width:100%;height:140px}}
</style>
