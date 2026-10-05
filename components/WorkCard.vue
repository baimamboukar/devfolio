<script setup>
import StudySketch from '~/components/StudySketch.vue';
const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  url: { type: String, required: true },
  status: { type: String, default: '' },
  tags: { type: Array, default: () => [] },
  kind: { type: String, default: null },
  headingTag: { type: String, default: 'h3' },
  descriptionClass: { type: String, default: '' },
});
const external = computed(() => /^https?:\/\//.test(props.url));
</script>
<template>
  <NuxtLink :to="url" :external="external" :target="external ? '_blank' : undefined" :rel="external ? 'noopener noreferrer' : undefined" :aria-label="external ? title + ' (opens in a new tab)' : title" class="work-card" prefetch-on="interaction">
    <div v-if="kind" class="work-card-media"><StudySketch :kind="kind" compact /></div>
    <div class="work-card-copy">
      <component :is="headingTag" class="work-card-title">{{ title }}</component>
      <div v-if="status" class="work-card-meta"><span>{{ status }}</span></div>
      <p v-if="description" class="work-card-description" :class="descriptionClass">{{ description }}</p>
      <div v-if="tags.length" class="work-card-topics">{{ tags.slice(0, 2).join(' · ') }}</div>
    </div>
  </NuxtLink>
</template>
<style scoped>
.work-card { min-width:0; color:var(--ink); display:flex; flex-direction:column; border-radius:var(--corner-radius,12px); padding:20px; border:1px solid var(--line); background:var(--project-card-surface,var(--surface)); height:100%; }
.work-card:hover { text-decoration:none; }
/* Every diagram uses the same media slot; short methods stay centered within it. */
.work-card-media { display:flex; align-items:center; justify-content:center; width:100%; height:230px; min-height:230px; }
.work-card-media :deep(.study-sketch) { max-width:100%; }
.work-card-media :deep(.diagram-wide) { height:220px; width:100%; }
.work-card-media :deep(.method-note) { display:none; }
.work-card-media :deep(.blue-box), .work-card-media :deep(.teal-box), .work-card-media :deep(.blue-edge), .work-card-media :deep(.teal-edge), .work-card-media :deep(.violet-box) { padding:8px 6px; font-size:12px; line-height:1.35; }
.work-card-media :deep(.narrow-stage > strong) { font-size:12px; line-height:1.3; margin-bottom:6px; }
.work-card-media :deep(.stage-down) { font-size:17px; line-height:1; margin:4px 0; }
.work-card-media :deep(.selection-narrow .blue-box), .work-card-media :deep(.selection-narrow .teal-box), .work-card-media :deep(.selection-narrow .violet-box) { padding:5px 6px; }
.work-card-media :deep(.selection-narrow .narrow-stage > strong) { margin-bottom:3px; }
.work-card-media :deep(.selection-narrow .stage-down) { margin:2px 0; }
.work-card-media :deep(.narrow-branch + .narrow-branch) { margin-top:10px; }
.work-card-media :deep(.narrow-pair) { gap:7px; }
.work-card-media :deep(.comparison-branches) { gap:10px; }
.work-card-media :deep(.nested-features) { padding:8px 5px; }
.work-card-media :deep(.nested-features > strong) { font-size:11px; }
.work-card-media :deep(.nested-features span) { margin-top:5px; padding:5px 3px; font-size:10px; }
.work-card-copy { padding-top:18px; min-width:0; }
.work-card-meta { display:flex; flex-wrap:wrap; align-items:center; gap:9px; color:var(--muted); font-size:.72rem; margin-top:9px; }
.work-card-meta span { color:var(--link-color); background:color-mix(in srgb,rgb(var(--primary-500)) 7%,var(--page)); border-radius:99px; padding:3px 8px; }
.work-card-title { color:var(--ink); font-family:var(--font-heading),sans-serif; font-size:var(--paper-size,18px); font-weight:var(--heading-weight,700); line-height:1.35; margin-top:0; }
.work-card-description { margin-top:8px; color:var(--muted); font-size:.91rem; line-height:var(--content-leading,1.65); }
.work-card-topics { color:var(--muted); font-size:.76rem; margin-top:12px; line-height:1.6; }
.work-card:hover .work-card-title { color:var(--link-color); }
.work-card:focus-visible { outline:2px solid rgb(var(--primary-500)); outline-offset:6px; }
@media(max-width:540px) { .work-card { padding:15px; } }
</style>
