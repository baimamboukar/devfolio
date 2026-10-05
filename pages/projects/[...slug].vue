<script setup>
import SiteIcon from '~/components/SiteIcon.vue';
import StudySketch from '~/components/StudySketch.vue';

definePageMeta({ title: 'Project', key: route => route.path });
const route = useRoute();
const projectPath = route.path;
const { data: project } = await useAsyncData('project:' + projectPath, () => queryContent(projectPath).findOne());
if (!project.value) throw createError({ statusCode: 404, statusMessage: 'Project not found' });

const validLink = value => typeof value === 'string' && /^https?:\/\//.test(value);
const showImage = computed(() => project.value?.image && !project.value.image.includes('placehold.co'));
const methods = computed(() => project.value?.stack?.length ? project.value.stack : project.value?.tags || []);
const hasFacts = computed(() => project.value?.status || project.value?.role || project.value?.period || project.value?.team?.name);
const resources = computed(() => {
  const links = [];
  if (validLink(project.value?.live_url)) {
    const url = project.value.live_url;
    links.push({ url, label: url.includes('arxiv.org') ? 'Read paper' : url.includes('lesswrong.com') ? 'Read writeup' : url.includes('github.com') ? 'Source code' : 'Visit project' });
  }
  if (validLink(project.value?.source_url) && !links.some(link => link.url === project.value.source_url)) {
    links.push({ url: project.value.source_url, label: project.value.source_url.includes('github.com') ? 'Source code' : 'Project website' });
  }
  return links;
});
const method = computed(() => project.value.title.startsWith('Cross-Model') ? 'refit' : project.value.title.startsWith('Selection Regret') ? 'selection' : project.value.title.startsWith('Coordinate') ? 'alignment' : project.value.title.startsWith('Measuring Delusion') ? 'support' : project.value.title.includes('Matryoshka') ? 'sae' : null);
useSeoMeta({ title: () => project.value?.title, description: () => project.value?.description, ogTitle: () => project.value?.title, ogDescription: () => project.value?.description, ogImage: () => showImage.value ? project.value.image : undefined, ogType: 'article' });
</script>

<template>
  <article v-if="project" class="project-reading">
    <NuxtLink to="/work" class="project-back">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12H4m7-7-7 7 7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
      Work
    </NuxtLink>

    <header class="project-heading">
      <h1>{{ project.title }}</h1>
      <p v-if="project.description" class="project-description">{{ project.description }}</p>
      <dl v-if="hasFacts" class="project-facts">
        <div v-if="project.status"><dt>Status</dt><dd>{{ project.status }}</dd></div>
        <div v-if="project.role"><dt>My role</dt><dd>{{ project.role }}</dd></div>
        <div v-if="project.period"><dt>Period</dt><dd>{{ project.period }}</dd></div>
        <div v-if="project.team?.name"><dt>With</dt><dd><a v-if="validLink(project.team.url)" :href="project.team.url" target="_blank" rel="noopener noreferrer">{{ project.team.name }}<SiteIcon name="external" /></a><span v-else>{{ project.team.name }}</span></dd></div>
      </dl>
      <nav v-if="resources.length" class="project-resources" aria-label="Project resources">
        <a v-for="resource in resources" :key="resource.url" :href="resource.url" target="_blank" rel="noopener noreferrer">{{ resource.label }}<SiteIcon name="external" /></a>
      </nav>
    </header>

    <div v-if="method" class="project-study"><StudySketch :kind="method" /></div>
    <figure v-else-if="showImage" class="project-image"><NuxtImg :src="project.image" :alt="project.title + ' preview'" width="1200" height="675" format="webp" quality="80" loading="lazy" decoding="async" /></figure>

    <section v-if="project.about?.length" class="project-section project-overview" aria-labelledby="project-overview-heading">
      <h2 id="project-overview-heading">Overview</h2>
      <div class="project-prose"><p v-for="paragraph in project.about" :key="paragraph">{{ paragraph }}</p></div>
    </section>
    <ContentRenderer v-if="project.body?.children?.length" :value="project" class="prose dark:prose-invert max-w-none project-body" />
    <section v-if="methods.length" class="project-section project-methods" aria-labelledby="project-methods-heading">
      <h2 id="project-methods-heading">Methods and Tools</h2>
      <ul><li v-for="tag in methods" :key="tag">{{ tag }}</li></ul>
    </section>
    <details v-if="project.milestones?.length" class="project-milestones">
      <summary>Project milestones<SiteIcon name="chevron" /></summary>
      <ol><li v-for="milestone in project.milestones" :key="milestone.title"><span>{{ milestone.date }}</span><div><h3>{{ milestone.title }}</h3><p>{{ milestone.description }}</p></div></li></ol>
    </details>
  </article>
</template>

<style scoped>
.project-reading { min-width:0; }
.project-back { display:inline-flex; align-items:center; gap:8px; min-height:36px; margin:0 0 18px; font-size:.8rem; color:var(--muted); }
.project-back svg { width:16px; height:16px; flex:none; }
.project-back:hover { color:var(--link-color); text-decoration:underline; }
.project-heading { margin-bottom:28px; }
.project-heading h1 { margin:0; font-size:var(--name-size); line-height:1.25; text-wrap:pretty; }
.project-description { margin-top:12px; max-width:74ch; color:var(--muted); font-size:1.05rem; line-height:var(--content-leading); text-wrap:pretty; }
.project-facts { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:18px 24px; margin-top:28px; }
.project-facts > div { min-width:0; }
.project-facts dt { margin-bottom:4px; color:var(--muted); font-size:.76rem; }
.project-facts dd { margin:0; font-size:.9rem; line-height:1.6; }
.project-facts a { display:inline; color:var(--link-color); }
.project-facts a svg { display:inline; width:13px; height:13px; margin-left:5px; vertical-align:baseline; }
.project-resources { display:flex; flex-wrap:wrap; gap:8px 22px; margin-top:20px; }
.project-resources a { display:inline-flex; align-items:center; gap:8px; min-height:36px; font-size:.87rem; color:var(--link-color); text-decoration:underline; text-underline-offset:5px; }
.project-resources svg { width:14px; height:14px; flex:none; }
.project-study { padding:26px 28px; margin-bottom:30px; border-radius:var(--corner-radius); background:color-mix(in srgb,var(--surface-alt) 65%,var(--page)); }
.project-study :deep(.sketch-canvas) { max-width:640px; margin:0 auto; }
.project-study :deep(.sketch-label) { margin-bottom:18px; font-size:.8rem; }
.project-study :deep(.method-note) { margin-top:18px; }
.project-image { margin:0 0 30px; overflow:hidden; border-radius:var(--corner-radius); background:var(--surface); }
.project-image img { width:100%; height:auto; max-height:440px; object-fit:contain; }
.project-section { display:grid; grid-template-columns:minmax(130px,.25fr) minmax(0,1fr); gap:20px 30px; align-items:start; }
.project-section h2 { margin:0; font-size:var(--section-size); line-height:1.5; }
.project-prose { min-width:0; }
.project-prose p,.project-body { color:var(--muted); font-size:1rem; line-height:var(--content-leading); }
.project-prose p + p { margin-top:18px; }
.project-body { margin-bottom:28px; }
.project-body :deep(:is(h1,h2,h3,h4,strong)) { color:var(--ink); }
.project-body :deep(:not(pre) > code) { background:var(--surface-alt); color:var(--ink); border-radius:4px; padding:2px 5px; }
.project-overview + .project-body { margin-top:28px; }
.project-methods { margin-top:28px; }
.project-methods h2 { font-size:1rem; line-height:1.7; }
.project-methods ul { display:flex; flex-wrap:wrap; gap:5px 0; margin:0; padding:0; list-style:none; color:var(--muted); font-size:.85rem; line-height:1.85; }
.project-methods li { display:inline; }
.project-methods li:not(:last-child)::after { content:'·'; margin:0 9px; color:var(--muted); }
.project-milestones { margin-top:30px; }
.project-milestones summary { display:flex; align-items:center; gap:10px; width:fit-content; min-height:40px; list-style:none; font-size:.9rem; }
.project-milestones summary::-webkit-details-marker { display:none; }
.project-milestones summary svg { width:16px; height:16px; }
.project-milestones[open] summary svg { transform:rotate(180deg); }
.project-milestones ol { display:grid; gap:22px; margin:20px 0 0; padding:0; list-style:none; }
.project-milestones li { display:grid; grid-template-columns:minmax(130px,.25fr) minmax(0,1fr); gap:20px 30px; }
.project-milestones li > span { font-size:.78rem; color:var(--muted); }
.project-milestones h3 { margin:0; font-size:1rem; }
.project-milestones p { color:var(--muted); font-size:.9rem; line-height:var(--content-leading); margin-top:6px; }
@media(max-width:700px) {
  .project-heading h1 { font-size:calc(var(--name-size) * .84); }
  .project-facts { grid-template-columns:1fr; gap:14px; margin-top:22px; }
  .project-study { padding:20px 16px; }
  .project-section,.project-milestones li { grid-template-columns:1fr; gap:12px; }
  .project-description { font-size:1rem; }
  .project-methods { margin-top:24px; }
}
@media(max-width:380px) {
  .project-study { padding:18px 12px; }
}
</style>
