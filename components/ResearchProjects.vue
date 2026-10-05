<script setup>
import WorkCard from '~/components/WorkCard.vue';
import { slugify } from '~/utils/slugify';

const [{ data }, { data: homepage }] = await Promise.all([
  useAsyncData('research', () => queryContent('research').findOne()),
  useAsyncData('research-feature-summaries', () => queryContent('homepage').only(['selected_research']).findOne())
]);
const route = useRoute();
const research = computed(() => (data.value?.research || []).filter(paper => paper.listed !== false));
const search = ref(typeof route.query.search === 'string' ? route.query.search : '');
const category = ref(['featured', 'papers'].includes(route.query.view) ? route.query.view : 'all');
const filters = [
  { value: 'all', label: 'All Research' },
  { value: 'featured', label: 'Featured' },
  { value: 'papers', label: 'All Papers' }
];
const authors = paper => paper.authors?.length ? paper.authors : [{ name: 'Baimam Boukar Jean Jacques' }, ...(paper.contributors || [])];
const filtered = computed(() => research.value.filter(paper => [paper.title, ...authors(paper).map(author => author.name), paper.venue || '', paper.status || '', ...(paper.topics || [])].join(' ').toLowerCase().includes(search.value.trim().toLowerCase())));
const metadata = paper => [paper.status, ...(paper.venue ? [paper.venue] : (paper.topics || []).slice(0, 2))].filter(Boolean);
const kind = paper => paper.title.startsWith('Cross-Model Generalization') ? 'refit' : paper.title.startsWith('Selection Regret') ? 'selection' : null;
const current = computed(() => filtered.value.filter(kind));
const summary = paper => homepage.value?.selected_research?.find(item => item.slug === slugify(paper.title))?.summary || paper.abstract || '';
const hasResults = computed(() => category.value === 'featured' ? current.value.length > 0 : filtered.value.length > 0);
const clear = () => { search.value = ''; category.value = 'all'; };
watch(() => route.query.search, value => { search.value = typeof value === 'string' ? value : ''; });
watch(() => route.query.view, value => { category.value = ['featured', 'papers'].includes(value) ? value : 'all'; });
</script>

<template>
  <section class="study-index work-collection" aria-label="Research papers">
    <div class="work-toolbar">
      <CollectionSearch v-model="search" label="Find a paper, author, or topic" />
      <CollectionFilters v-model="category" :options="filters" label="Research selection" />
    </div>
    <section v-if="current.length && category !== 'papers'" class="work-section" aria-labelledby="featured-research-heading">
      <div class="work-section-heading"><h2 id="featured-research-heading">Featured Research</h2></div>
      <div class="current-studies work-feature-grid">
        <WorkCard
          v-for="paper in current"
          :key="paper.title"
          class="study-feature"
          :title="paper.title"
          :description="summary(paper)"
          description-class="research-summary"
          :url="'/research/' + slugify(paper.title)"
          :status="paper.status"
          :tags="paper.topics"
          :kind="kind(paper)"
        />
      </div>
    </section>
    <section v-if="filtered.length && category !== 'featured'" class="bibliography work-section" aria-labelledby="research-index-heading">
      <div class="work-section-heading"><h2 id="research-index-heading">All Research</h2></div>
      <ul class="research-list work-directory">
        <li v-for="paper in filtered" :key="paper.title" class="study-record">
          <NuxtLink :to="'/research/' + slugify(paper.title)" class="record-summary work-entry" prefetch-on="interaction">
            <h3 class="work-entry-title">{{ paper.title }}</h3>
            <p class="record-meta work-entry-meta"><span v-for="(item, index) in metadata(paper)" :key="item" :class="{ 'record-status': index === 0 && paper.status }">{{ item }}</span></p>
          </NuxtLink>
        </li>
      </ul>
    </section>
    <div v-if="!hasResults" class="collection-empty" role="status"><p>No papers match those filters.</p><button type="button" @click="clear">Show all research</button></div>
  </section>
</template>

<style scoped>
.record-meta { display:flex; flex-wrap:wrap; gap:3px 0; }
.record-meta span { min-width:0; overflow-wrap:anywhere; }
.record-meta span + span::before { content:'·'; padding:0 8px; color:var(--muted); }
.record-status { font-weight:550; }
</style>
