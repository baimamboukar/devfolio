<script setup>
const { data: items } = await useAsyncData('home-recent-news', async () => {
  const doc = await queryContent('news').findOne();
  return [...(doc?.updates || [])].sort((a,b) => b.date.localeCompare(a.date)).slice(0,5).map(({date,title}) => ({date,title}));
});
const index = ref(0);
const currentItem = computed(() => items.value?.[index.value]);
const paused = ref(false);
const hovering = ref(false);
const focused = ref(false);
const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
const dateFormat = new Intl.DateTimeFormat('en-US', { month:'short', day:'numeric', year:'numeric', timeZone:'UTC' });
let timer;
onMounted(() => {
  timer = window.setInterval(() => {
    if (!paused.value && !hovering.value && !focused.value && !reducedMotion.value && document.visibilityState === 'visible' && document.documentElement.dataset.motion !== 'none' && items.value?.length > 1) index.value = (index.value + 1) % items.value.length;
  }, 5000);
});
onBeforeUnmount(() => window.clearInterval(timer));
const leaveFocus = event => { if (!event.currentTarget.contains(event.relatedTarget)) focused.value = false; };
</script>
<template>
  <section v-if="currentItem" class="news-widget" aria-labelledby="news-heading" @mouseenter="hovering = true" @mouseleave="hovering = false" @focusin="focused = true" @focusout="leaveFocus">
    <h2 id="news-heading"><span class="news-dot" aria-hidden="true" />Recent updates</h2>
    <NuxtLink class="current-update" :to="{path:'/news',query:{search:currentItem.title}}" :title="currentItem.title" prefetch-on="interaction"><time :datetime="currentItem.date">{{ dateFormat.format(new Date(currentItem.date)) }}</time><span>{{ currentItem.title }}</span></NuxtLink>
    <div v-if="items.length > 1" class="news-controls" role="group" aria-label="Choose an update">
      <button v-for="(item,itemIndex) in items" :key="item.date+item.title" type="button" class="update-selector" :aria-label="item.title" :aria-pressed="index === itemIndex" @click="index = itemIndex"><span /></button>
      <button type="button" class="pause-updates" :aria-label="paused ? 'Resume rotating updates' : 'Pause rotating updates'" :aria-pressed="paused" @click="paused = !paused"><svg viewBox="0 0 20 20" aria-hidden="true"><path v-if="paused" d="m7 4 9 6-9 6Z" fill="currentColor" /><path v-else d="M7 5v10M13 5v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg></button>
    </div>
    <NuxtLink to="/news" class="all-news" prefetch-on="interaction">See all</NuxtLink>
  </section>
</template>
<style scoped>
.news-widget { display:flex; align-items:center; gap:16px; min-width:0; padding:11px 14px; border:1px solid var(--line); border-radius:var(--corner-radius); background:var(--study-surface); }
.news-widget h2 { display:flex; align-items:center; gap:8px; flex:none; font-family:var(--font-body); font-size:.75rem; font-weight:600; letter-spacing:0; color:var(--link-color); }
.news-dot { width:6px; height:6px; flex:none; border-radius:50%; background:rgb(var(--primary-500)); }
.current-update { min-width:0; flex:1; display:flex; align-items:baseline; gap:9px; color:var(--ink); font-size:.8125rem; line-height:1.5; }
.current-update time { flex:none; font-size:.7rem; color:var(--muted); }
.current-update > span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.news-controls { display:flex; align-items:center; flex:none; gap:0; }
.update-selector { width:20px; height:28px; display:grid; place-items:center; border-radius:5px; }
.update-selector span { width:5px; height:5px; border-radius:99px; background:var(--muted); opacity:.45; }
.update-selector[aria-pressed=true] span { width:14px; background:rgb(var(--primary-500)); opacity:1; }
.pause-updates { width:25px; height:28px; display:grid; place-items:center; color:var(--muted); border-radius:5px; }
.pause-updates svg { width:14px; height:14px; }
@media (prefers-reduced-motion: reduce) { .pause-updates { display:none; } }
.all-news { display:inline-flex; align-items:center; gap:5px; flex:none; min-height:28px; font-size:.72rem; font-weight:500; color:var(--link-color); }
@media(max-width:1100px) { .news-widget { flex-wrap:wrap; gap:7px 12px; } .news-widget h2 { order:0; } .current-update { order:2; flex-basis:100%; } .all-news { order:1; margin-left:auto; } .news-controls { order:3; margin-left:auto; } }
@media(max-width:600px) { .news-widget { padding:12px; } .current-update { display:block; font-size:.8rem; } .current-update time { display:block; margin-bottom:4px; } .current-update > span { display:block; white-space:normal; } .update-selector { width:30px; height:36px; } .pause-updates { width:30px; height:36px; } }
</style>
