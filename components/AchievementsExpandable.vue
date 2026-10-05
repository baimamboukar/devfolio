<script setup>
defineProps({ achievements: { type: Array, required: true } });
const validLink = value => typeof value === 'string' && /^https?:\/\//.test(value);
</script>
<template>
  <ul class="recognition-list"><li v-for="achievement in achievements" :key="achievement.title || achievement.name" class="recognition-record"><img v-if="achievement.icon" :src="achievement.icon" :alt="achievement.organization || achievement.place || ''" width="40" height="40" loading="lazy" decoding="async"><div class="recognition-content"><h3>{{ achievement.title || achievement.name }}</h3><p class="recognition-meta">{{ [achievement.year || achievement.date, achievement.organization, achievement.place].filter(Boolean).join(' · ') }}</p><p v-if="achievement.description" class="recognition-detail">{{ achievement.description }}</p><details v-if="achievement.details?.length"><summary>More details <SiteIcon name="chevron" /></summary><ul><li v-for="detail in achievement.details" :key="detail">{{ detail }}</li></ul></details><a v-if="validLink(achievement.link)" :href="achievement.link" target="_blank" rel="noopener noreferrer">Read more</a></div></li></ul>
</template>
<style scoped>
.recognition-list { list-style: none; margin: 0; padding: 0; }
.recognition-record { display: flex; gap: 16px; align-items: start; padding: var(--row-gap) 0; }
.recognition-record + .recognition-record { border-top: 1px solid var(--line); }
.recognition-record > img { width: 40px; height: 40px; padding: 3px; border-radius: 7px; object-fit: contain; background: #fff; flex-shrink: 0; }
.recognition-content { min-width: 0; }
.recognition-content h3 { font-size: .88rem; line-height: 1.5; font-weight: var(--heading-weight); }
.recognition-meta { margin-top: 4px; color: var(--muted); font-size: .75rem; }
.recognition-detail { margin-top: 5px; color: var(--muted); font-size: .82rem; line-height: var(--content-leading); }
.recognition-content details { margin-top: 5px; }
.recognition-content summary { display: flex; align-items: center; gap: 8px; min-height: 32px; list-style: none; cursor: pointer; font-size: .76rem; color: var(--link-color); }
.recognition-content summary::-webkit-details-marker { display: none; }
.recognition-content summary :deep(svg) { width: 12px; height: 12px; }
.recognition-content details[open] summary :deep(svg) { transform: rotate(180deg); }
.recognition-content details ul { list-style: disc; padding-left: 16px; font-size: .82rem; color: var(--muted); }
.recognition-content a { display: inline-block; margin-top: 8px; font-size: .78rem; }
@media (max-width: 600px) { .recognition-record { gap: 10px; } .recognition-record > img { width: 32px; height: 32px; } }
</style>
