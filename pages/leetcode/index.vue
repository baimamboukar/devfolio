<script setup>
definePageMeta({ title: 'Code notebook', description: 'Coding problems and solution notes by Baimam Boukar.' });
const { data } = await useAsyncData('leetcode', () => queryContent('/leetcode').find());
const search = ref('');
const topic = ref('all');
const solutions = computed(() => data.value || []);
const topics = computed(() => [...new Set(solutions.value.flatMap(solution => solution.tags || []))].sort());
const filtered = computed(() => solutions.value.filter(solution => (topic.value === 'all' || solution.tags?.includes(topic.value)) && (solution.title + ' ' + (solution.description || '')).toLowerCase().includes(search.value.trim().toLowerCase())));
</script>
<template>
  <article class="code-notebook"><PageHeading title="Code notebook" description="Small problems, worked solutions, and notes on how they fit together." /><div v-if="solutions.length" class="collection-toolbar"><CollectionSearch v-model="search" label="Find a coding problem" /><select v-model="topic" aria-label="Coding topic"><option value="all">Every topic</option><option v-for="item in topics" :key="item" :value="item">{{ item }}</option></select></div><p class="collection-meta" role="status">{{ filtered.length }} solution{{ filtered.length === 1 ? '' : 's' }}</p><ol v-if="filtered.length" class="solution-catalog"><li v-for="(solution, index) in filtered" :key="solution._path"><span class="solution-index">{{ String(index + 1).padStart(2, '0') }}</span><AppCodeSolutionCard :problem-title="solution.title" :url="solution._path" :tags="solution.tags" :problem-url="solution.problemUrl" /></li></ol><div v-else class="notebook-empty"><h2>{{ solutions.length ? 'No matching notes' : 'No solution notes published yet' }}</h2><p>{{ solutions.length ? 'Try another title or topic.' : 'Explore the work collection for research, experiments, and software.' }}</p><button v-if="solutions.length" type="button" @click="search = ''; topic = 'all'">Reset filters</button><NuxtLink v-else to="/work">Explore work ↗</NuxtLink></div></article>
</template>
<style scoped>
.solution-catalog{list-style:none;padding:0;margin:16px 0}.solution-catalog li{display:flex;gap:18px;align-items:baseline;padding:var(--row-gap,16px) 0;border-bottom:1px solid var(--line)}.solution-index{font-size:.75rem;font-variant-numeric:tabular-nums;color:var(--muted)}.notebook-empty{margin-top:20px;background:var(--surface-alt);padding:24px;border-radius:var(--corner-radius,12px)}.notebook-empty h2{font-size:var(--section-size)}.notebook-empty p{font-size:.9rem;color:var(--muted);margin:10px 0 16px}.notebook-empty a,.notebook-empty button{font-size:.86rem;color:var(--link-color)}
</style>
