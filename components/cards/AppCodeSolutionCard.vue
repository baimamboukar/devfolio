<script setup>
const props = defineProps({ problemTitle: String, url: String, tags: Array, problemUrl: String });
const platform = computed(() => { try { return new URL(props.problemUrl).hostname.replace(/^www\./, ''); } catch { return ''; } });
</script>
<template>
  <div class="solution-note"><div><h3><NuxtLink :to="url">{{ problemTitle }}</NuxtLink></h3><p v-if="tags?.length">{{ tags.join(' · ') }}</p><span v-if="platform" class="solution-platform">{{ platform }}</span></div><NuxtLink :to="url" class="solution-open" :aria-label="'Read solution: ' + problemTitle">Read ↗</NuxtLink></div>
</template>
<style scoped>
.solution-note{display:flex;justify-content:space-between;align-items:center;gap:20px;width:100%;min-width:0}.solution-note h3{font-size:var(--paper-size,17px);line-height:1.4}.solution-note h3 a{color:var(--ink)}.solution-note p{font-size:.78rem;color:var(--muted);margin-top:6px}.solution-platform{display:block;font-size:.72rem;color:var(--muted);margin-top:5px}.solution-open{flex-shrink:0;font-size:.78rem;padding:8px 12px;border-radius:999px;background:var(--surface-alt)}@media(max-width:500px){.solution-note{align-items:flex-start;flex-direction:column;gap:10px}}
</style>
