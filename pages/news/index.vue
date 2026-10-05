<script setup>
definePageMeta({ title: 'Updates', description: 'Research, work, and community updates from Baimam Boukar.' });
const { data } = await useAsyncData('all-news-page', () => queryContent('news').findOne());
const search = ref('');
const route = useRoute();
const router = useRouter();
const syncSearch = () => { search.value = typeof route.query.search === 'string' ? route.query.search : ''; };
const clearSearch = () => { search.value = ''; const query = { ...route.query }; delete query.search; router.replace({ query }); };
onMounted(syncSearch);
watch(() => route.query.search, syncSearch);
const type = ref('all');
const updates = computed(() => [...(data.value?.updates || [])].sort((a, b) => b.date.localeCompare(a.date)));
const types = computed(() => [...new Set(updates.value.map(update => update.type))].sort());
const filtered = computed(() => updates.value.filter(update => (type.value === 'all' || update.type === type.value) && (update.title + ' ' + update.description).toLowerCase().includes(search.value.trim().toLowerCase())));
const years = computed(() => [...new Set(filtered.value.map(update => update.date.slice(0, 4)))]);
const date = value => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(value));
const validLink = value => typeof value === 'string' && /^https?:\/\//.test(value);
const category = value => ({ position: 'Research and Work', training: 'Learning', publication: 'Publication', talk: 'Speaking', award: 'Award', milestone: 'Milestone' }[value] || value);
</script>
<template>
  <article class="updates-page">
    <PageHeading title="Updates" description="A running record of research, new beginnings, and conversations along the way." />
    <div class="collection-toolbar updates-filter"><select v-model="type" aria-label="Update category"><option value="all">Every kind of update</option><option v-for="item in types" :key="item" :value="item">{{ category(item) }}</option></select><button v-if="search" type="button" class="clear-search" @click="clearSearch">Show all updates <SiteIcon name="arrow-right" /></button></div>
    <section v-for="year in years" :key="year" class="timeline-year" :aria-label="'Updates in ' + year"><header><h2>{{ year }}</h2></header><ol class="timeline"><li v-for="update in filtered.filter(item => item.date.startsWith(year))" :key="update.date + update.title"><div class="update-meta"><time :datetime="update.date">{{ date(update.date) }}</time><span>{{ category(update.type) }}</span></div><h3>{{ update.title }}</h3><p>{{ update.description }}</p><a v-if="validLink(update.link)" :href="update.link" target="_blank" rel="noopener noreferrer" class="update-source">Read the update ↗</a></li></ol></section>
    <div v-if="!filtered.length" class="collection-empty"><p>No updates match those filters.</p><button type="button" @click="clearSearch(); type = 'all'">Reset filters</button></div>
  </article>
</template>
<style scoped>
.updates-filter{justify-content:flex-end}.clear-search{display:inline-flex;align-items:center;gap:8px;font-size:.8rem;color:var(--link-color);min-height:42px}.updates-filter select{flex:none;width:auto}@media(max-width:600px){.updates-filter{justify-content:flex-start}.updates-filter select{width:100%}}
.timeline-year{display:grid;grid-template-columns:88px minmax(0,1fr);gap:24px;margin-top:var(--section-gap,28px)}.timeline-year>header h2{font-size:var(--section-size);line-height:1.2}.timeline{list-style:none;margin:0;padding:0 0 0 26px;border-left:1px solid var(--line)}.timeline li{position:relative;padding:0 0 calc(var(--row-gap) + 14px)}.timeline li:last-child{padding-bottom:8px}.timeline li::before{content:'';position:absolute;left:-31px;top:8px;width:9px;height:9px;border-radius:50%;background:var(--link-color);box-shadow:0 0 0 5px var(--page,var(--surface))}.update-meta{display:flex;align-items:center;gap:12px;font-size:.75rem;color:var(--muted);margin-bottom:9px}.update-meta>span{border-radius:999px;background:var(--surface-alt);padding:3px 9px}.timeline h3{font-size:var(--paper-size,17px);line-height:1.4;color:var(--ink)}.timeline p{font-size:.93rem;line-height:var(--content-leading,1.65);color:var(--muted);margin-top:7px;max-width:72ch}.update-source{display:inline-flex;padding:6px 11px;border-radius:999px;background:var(--surface-alt);font-size:.78rem;margin-top:11px}@media(max-width:600px){.timeline-year{grid-template-columns:1fr;gap:18px}.timeline-year>header{display:flex;align-items:center;gap:12px}.timeline{margin-left:4px;padding-left:22px}.timeline li::before{left:-27px}.update-meta{gap:9px;flex-wrap:wrap}}
@media(max-width:560px){:deep(.page-heading h1){font-size:min(var(--name-size),7.6vw)}.collection-toolbar{display:grid;grid-template-columns:minmax(0,1fr)}.collection-toolbar>select{width:100%}}
</style>
