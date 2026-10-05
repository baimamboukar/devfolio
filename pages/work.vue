<script setup>
import WorkCard from '~/components/WorkCard.vue';

definePageMeta({ title: 'Work', description: 'Research, experiments, and the software behind them.' });
const { work } = await useWorkCollection();
const { config } = await useSiteConfig();
const route = useRoute();
const router = useRouter();
const searchFromQuery = query => typeof query.search === 'string' ? query.search : '';
const viewFromQuery = query => ['featured', 'archive'].includes(query.view) ? query.view : 'all';
const search = ref(searchFromQuery(route.query));
const category = ref(viewFromQuery(route.query));
const filters = [
  { value: 'all', label: 'All Work' },
  { value: 'featured', label: 'Featured' },
  { value: 'archive', label: 'Archive' },
];

const filtered = computed(() => {
  const query = search.value.trim().toLowerCase();
  return (work.value || []).filter(entry => entry.searchText.toLowerCase().includes(query)
    && (category.value === 'all' || (category.value === 'featured' ? entry.featured : !entry.featured)));
});
const featured = computed(() => filtered.value.filter(entry => entry.featured));
const archive = computed(() => filtered.value.filter(entry => !entry.featured));
const external = url => /^https?:\/\//.test(url || '');
const repository = url => /^https?:\/\/(?:www\.)?github\.com\//.test(url || '');
const metadata = entry => entry.type === 'paper'
  ? [entry.status, ...(entry.venue ? [entry.venue] : entry.tags.slice(0, 2))].filter(Boolean)
  : entry.tags.slice(0, 2);
const description = entry => String(entry.description || '').replace(/\u2728\uFE0F?/gu, '').trim();

const syncQuery = () => {
  const query = {};
  if (search.value) query.search = search.value;
  if (category.value !== 'all') query.view = category.value;
  return router.replace({ path: '/work', query });
};
const updateSearch = value => { search.value = value; syncQuery(); };
const updateCategory = value => { category.value = value; syncQuery(); };
const clear = () => { search.value = ''; category.value = 'all'; syncQuery(); };
watch(() => route.query, query => {
  search.value = searchFromQuery(query);
  category.value = viewFromQuery(query);
});

useSeoMeta({
  title: 'Work',
  description: 'Research, experiments, and the software behind them.',
  ogTitle: 'Work | Baimam Boukar',
  ogDescription: 'Research, experiments, and the software behind them.',
});
useHead(() => ({ link: [{ rel: 'canonical', href: new URL('/work', config.site.url).href }] }));
</script>

<template>
  <article class="work-index work-collection">
    <PageHeading title="Work" description="Research, experiments, and the software behind them." />

    <div class="collection-toolbar work-toolbar">
      <CollectionSearch :model-value="search" label="Find work, an author, or a topic" @update:model-value="updateSearch" />
      <CollectionFilters :model-value="category" :options="filters" label="Work selection" @update:model-value="updateCategory" />
    </div>

    <section v-if="featured.length" class="work-section" aria-labelledby="featured-work-heading">
      <div class="work-section-heading"><h2 id="featured-work-heading">Featured Work</h2></div>
      <div class="work-feature-grid">
        <WorkCard
          v-for="entry in featured"
          :key="entry.id"
          :title="entry.title"
          :description="entry.description"
          :description-class="entry.type === 'paper' ? 'research-summary' : ''"
          :url="entry.url"
          :status="entry.status"
          :tags="entry.tags"
          :kind="entry.kind"
        />
      </div>
    </section>

    <section v-if="archive.length" id="archive" class="work-section work-archive" aria-labelledby="work-archive-heading">
      <div class="work-section-heading"><h2 id="work-archive-heading">Archive</h2></div>
      <ul class="work-directory">
        <li v-for="entry in archive" :key="entry.id" :data-work-type="entry.type">
          <NuxtLink
            :to="entry.url"
            :external="external(entry.url)"
            :target="external(entry.url) ? '_blank' : undefined"
            :rel="external(entry.url) ? 'noopener noreferrer' : undefined"
            class="work-entry"
            prefetch-on="interaction"
          >
            <div class="work-entry-identity">
              <h3 class="work-entry-title">{{ entry.title }}</h3>
              <SiteIcon v-if="repository(entry.url)" name="github" class="repository-mark" />
            </div>
            <p v-if="entry.type === 'project' && description(entry)" class="work-entry-description">{{ description(entry) }}</p>
            <p v-if="metadata(entry).length" class="work-entry-meta"><span v-for="(item, index) in metadata(entry)" :key="item" :class="{ 'paper-status': entry.type === 'paper' && index === 0 && entry.status }">{{ item }}</span></p>
            <span v-if="external(entry.url)" class="sr-only">Opens in a new tab</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <div v-if="!filtered.length" class="collection-empty" role="status">
      <p>No work matches those filters.</p>
      <button type="button" @click="clear">Show all work</button>
    </div>
  </article>
</template>

<style scoped>
.work-archive { scroll-margin-top:96px; }
.work-index .work-directory { grid-template-columns:minmax(0,1fr); row-gap:var(--row-gap); }
.work-index .work-entry { padding-block:6px; }
.work-entry-identity { display:flex; align-items:baseline; gap:12px; width:100%; min-width:0; }
.work-entry-title { min-width:0; }
.work-entry-description { margin:0; color:var(--muted); font-size:.85rem; line-height:var(--content-leading); }
.work-entry-meta { display:flex; flex-wrap:wrap; gap:3px 0; }
.work-entry-meta span { min-width:0; overflow-wrap:anywhere; }
.work-entry-meta span + span::before { content:'·'; padding:0 8px; color:var(--muted); }
.paper-status { font-weight:550; }
.repository-mark { width:14px; height:14px; flex:none; margin-left:auto; color:var(--muted); opacity:.7; }
.work-entry:hover .repository-mark { color:var(--link-color); opacity:1; }
</style>
