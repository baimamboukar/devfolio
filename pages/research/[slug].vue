<script setup>
import SiteIcon from '~/components/SiteIcon.vue';
import { slugify } from '~/utils/slugify';
import { projectNotesForResearch } from '~/utils/workCollection';

definePageMeta({ key: route => route.path });
const route = useRoute();
const { data: researchData } = await useAsyncData('research', () => queryContent('research').findOne());
const { config } = await useSiteConfig();
const canonicalUrl = computed(() => new URL(route.path, config.site.url).href);
const project = computed(() => researchData.value?.research?.find(study => slugify(study.title) === route.params.slug));
const projectNotes = computed(() => projectNotesForResearch(route.params.slug));

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Research project not found' });
}

const projectAuthors = computed(() => project.value?.authors?.length ? project.value.authors : [
  { name: 'Baimam Boukar Jean Jacques', affiliation: 'Carnegie Mellon University Africa' },
  ...(project.value?.contributors || []),
]);
const affiliationKey = value => value?.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
const affiliations = computed(() => {
  const seen = new Set();
  return projectAuthors.value.flatMap(author => {
    const key = affiliationKey(author.affiliation);
    if (!key || seen.has(key)) return [];
    seen.add(key);
    return [{ key, name: author.affiliation.trim(), number: seen.size }];
  });
});
const authorByline = computed(() => projectAuthors.value.map(author => ({
  ...author,
  affiliationNumber: affiliations.value.find(affiliation => affiliation.key === affiliationKey(author.affiliation))?.number,
  isSiteAuthor: /^Baimam Boukar(?:\s|$)/i.test(author.name),
})));

const validLink = value => {
  try { return ['https:', 'http:'].includes(new URL(value).protocol); }
  catch { return false; }
};
const validImage = value => typeof value === 'string'
  && (value.startsWith('/') && !value.startsWith('//') || validLink(value))
  && !/placehold\.(co|it)|placeholder\.com/i.test(value);
const cover = computed(() => validImage(project.value?.cover) ? {
  src: project.value.cover,
  alt: project.value.cover_alt || `${project.value.title} — featured figure`,
  caption: project.value.cover_caption,
} : null);
const figures = computed(() => {
  const seen = new Set(cover.value ? [cover.value.src] : []);
  return (project.value?.figures || []).filter(figure => {
    if (!validImage(figure.src) || seen.has(figure.src)) return false;
    seen.add(figure.src);
    return true;
  });
});

const resources = computed(() => {
  const study = project.value;
  if (!study) return [];
  const candidates = [
    { url: study.paper_link, label: 'Paper', icon: 'file' },
    { url: study.links?.preprint, label: 'Preprint', icon: 'file' },
    { url: study.links?.code, label: 'Code', icon: 'github' },
    { url: study.links?.data, label: 'Data', icon: 'chart' },
    { url: study.links?.slides, label: 'Slides', icon: 'talks' },
  ];
  const seen = new Set();
  return candidates.flatMap(resource => {
    if (!validLink(resource.url)) return [];
    const parsed = new URL(resource.url);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    const isArxiv = host === 'arxiv.org' || host.endsWith('.arxiv.org');
    const key = isArxiv
      ? `arxiv:${parsed.pathname.replace(/^\/(abs|pdf)\//, '').replace(/\.pdf$/, '')}`
      : `${parsed.origin}${parsed.pathname.replace(/\/$/, '')}${parsed.search}`;
    if (seen.has(key)) return [];
    seen.add(key);
    if (isArxiv) return [{ ...resource, label: 'arXiv', icon: 'arxiv' }];
    if (host === 'github.com') return [{ ...resource, label: 'GitHub', icon: 'github' }];
    if (host === 'ieeexplore.ieee.org' || ['doi.org', 'dx.doi.org'].includes(host) && parsed.pathname.startsWith('/10.1109/')) return [{ ...resource, label: 'IEEE', icon: 'file' }];
    if (['doi.org', 'dx.doi.org'].includes(host)) return [{ ...resource, label: 'Publisher', icon: 'file' }];
    return [{ ...resource, icon: resource.label === 'Code' ? 'projects' : resource.icon }];
  });
});

useSeoMeta({
  title: () => project.value ? `${project.value.title} | Research` : 'Research Project Not Found',
  description: () => project.value?.abstract || 'Research project details.',
  ogTitle: () => project.value?.title,
  ogDescription: () => project.value?.abstract,
  ogImage: () => cover.value?.src,
  ogUrl: () => canonicalUrl.value,
});

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: [{
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ScholarlyArticle',
      headline: project.value.title,
      url: canonicalUrl.value,
      ...(cover.value ? { image: cover.value.src } : {}),
      abstract: project.value.abstract,
      author: projectAuthors.value.map(author => ({
        '@type': 'Person',
        name: author.name,
        ...(author.affiliation ? { affiliation: { '@type': 'Organization', name: author.affiliation } } : {}),
      })),
      ...(project.value.date ? { datePublished: project.value.date } : {}),
    }),
  }],
}));
</script>

<template>
  <article v-if="project" class="research-paper">
    <NuxtLink to="/work" class="paper-back"><SiteIcon name="previous" />Work</NuxtLink>

    <header class="paper-heading">
      <h1>{{ project.title }}</h1>
      <p v-if="project.status || project.venue" class="paper-publication">
        <span v-if="project.status">{{ project.status }}</span>
        <span v-if="project.status && project.venue" aria-hidden="true">·</span>
        <span v-if="project.venue">{{ project.venue }}</span>
      </p>

      <div class="paper-authors">
        <ul class="author-byline" aria-label="Authors">
          <li v-for="(author, index) in authorByline" :key="author.name">
            <span :class="{ 'site-author': author.isSiteAuthor }">{{ author.name }}</span><sup v-if="author.affiliationNumber" :aria-label="`Affiliation ${author.affiliationNumber}`">{{ author.affiliationNumber }}</sup><span v-if="index < authorByline.length - 1" class="author-separator" aria-hidden="true">, </span>
          </li>
        </ul>
        <ul v-if="affiliations.length" class="author-affiliations" aria-label="Affiliations">
          <li v-for="affiliation in affiliations" :key="affiliation.key"><sup>{{ affiliation.number }}</sup> {{ affiliation.name }}</li>
        </ul>
      </div>

      <nav v-if="resources.length" class="paper-resources" aria-label="Paper links">
        <a v-for="resource in resources" :key="resource.url" :href="resource.url" target="_blank" rel="noopener noreferrer">
          <SiteIcon v-if="resource.icon" :name="resource.icon" />
          <span>{{ resource.label }}</span>
        </a>
      </nav>
    </header>

    <figure v-if="cover" class="paper-figure paper-cover">
      <a :href="cover.src" target="_blank" rel="noopener noreferrer" aria-label="Open featured figure at full size">
        <img :src="cover.src" :alt="cover.alt" decoding="async" fetchpriority="high">
      </a>
      <figcaption v-if="cover.caption">{{ cover.caption }}</figcaption>
    </figure>

    <section v-if="project.abstract" class="paper-section paper-abstract" aria-labelledby="paper-abstract-heading">
      <h2 id="paper-abstract-heading">Abstract</h2>
      <p>{{ project.abstract }}</p>
    </section>

    <figure v-for="(figure, index) in figures" :key="figure.src" class="paper-figure paper-result">
      <a :href="figure.src" target="_blank" rel="noopener noreferrer" :aria-label="`Open figure ${index + 2} at full size`">
        <img :src="figure.src" :alt="figure.alt || `${project.title} — figure ${index + 2}`" loading="lazy" decoding="async">
      </a>
      <figcaption v-if="figure.caption">{{ figure.caption }}</figcaption>
    </figure>

    <section v-if="project.contributions?.length" class="paper-section" aria-labelledby="paper-contributions-heading">
      <h2 id="paper-contributions-heading">Key Contributions</h2>
      <ul class="paper-contributions"><li v-for="contribution in project.contributions" :key="contribution">{{ contribution }}</li></ul>
    </section>

    <footer v-if="project.topics?.length || project.supervision?.trim() || projectNotes" class="paper-notes">
      <NuxtLink v-if="projectNotes" :to="projectNotes" class="project-notes-link">Project notes</NuxtLink>
      <p v-if="project.supervision?.trim()"><span>Supervision</span> {{ project.supervision.trim() }}</p>
      <ul v-if="project.topics?.length" aria-label="Research topics"><li v-for="topic in project.topics" :key="topic">{{ topic }}</li></ul>
    </footer>
  </article>
</template>

<style scoped>
.research-paper { min-width:0; }
.paper-back { display:inline-flex; align-items:center; gap:6px; min-height:36px; margin-bottom:18px; color:var(--muted); font-size:.8rem; }
.paper-back :deep(svg) { width:14px; height:14px; flex:none; }
.paper-back:hover { color:var(--link-color); text-decoration:underline; }
.paper-heading { margin-bottom:26px; }
.paper-heading h1 { margin:0; font-size:clamp(1.25rem,calc(var(--name-size,36px) * .73),2rem); line-height:1.32; text-wrap:pretty; }
.paper-publication { display:flex; flex-wrap:wrap; gap:4px 9px; margin-top:12px; font-size:.8rem; color:var(--muted); }
.paper-authors { margin-top:20px; }
.author-byline { margin:0; padding:0; list-style:none; font-size:.9rem; line-height:1.85; }
.author-byline li { display:inline-block; max-width:100%; vertical-align:top; }
.site-author { color:var(--link-color); font-weight:700; }
.author-separator { margin-right:.22em; }
.paper-authors sup { position:static; vertical-align:super; margin-left:2px; font-size:.65em; line-height:0; }
.author-affiliations { display:flex; flex-wrap:wrap; gap:4px 18px; margin:7px 0 0; padding:0; list-style:none; color:var(--muted); font-size:.76rem; line-height:1.6; }
.author-affiliations sup { margin-left:0; margin-right:2px; }
.paper-resources { display:flex; flex-wrap:wrap; gap:8px; margin-top:20px; }
.paper-resources a { display:inline-flex; align-items:center; justify-content:center; gap:7px; min-height:36px; padding:6px 13px; border:1px solid var(--line); border-radius:var(--corner-radius,12px); color:var(--ink); background:var(--page); font-size:.81rem; font-weight:500; line-height:1.4; text-decoration:none; }
.paper-resources a:hover { color:var(--link-color); border-color:var(--muted); background:var(--surface-alt); }
.paper-resources :deep(svg) { width:16px; height:16px; flex:none; }
.paper-figure { min-width:0; margin:0; }
.paper-figure > a { display:block; overflow:hidden; border:1px solid var(--line); border-radius:var(--corner-radius,12px); background:#fff; }
.paper-figure img { display:block; width:100%; height:auto; max-height:480px; object-fit:contain; }
.paper-figure figcaption { margin-top:9px; color:var(--muted); font-size:.76rem; line-height:1.6; }
.paper-cover { margin-bottom:26px; }
.paper-section { margin-top:26px; }
.paper-section h2 { margin:0 0 12px; font-size:calc(var(--section-size,24px) * .84); }
.paper-abstract p { margin:0; color:var(--muted); font-size:.94rem; line-height:var(--content-leading,1.65); }
.paper-result { margin-top:28px; }
.paper-contributions { display:grid; gap:10px; margin:0; padding-left:18px; list-style:disc; color:var(--muted); font-size:.92rem; line-height:var(--content-leading,1.65); }
.paper-notes { display:grid; gap:8px; margin-top:28px; color:var(--muted); font-size:.76rem; line-height:1.7; }
.project-notes-link { justify-self:start; color:var(--link-color); text-decoration:underline; text-underline-offset:4px; }
.paper-notes p > span { color:var(--ink); margin-right:8px; }
.paper-notes ul { display:flex; flex-wrap:wrap; gap:4px 0; margin:0; padding:0; list-style:none; }
.paper-notes li:not(:last-child)::after { content:'·'; margin:0 9px; }
@media(max-width:650px) {
  .paper-back { margin-bottom:12px; }
  .paper-heading h1 { font-size:clamp(1.2rem,calc(var(--name-size,36px) * .64),1.6rem); }
  .paper-authors { margin-top:16px; }
  .author-byline { font-size:.85rem; line-height:1.85; }
  .author-affiliations { font-size:.73rem; }
  .paper-heading,.paper-cover { margin-bottom:22px; }
  .paper-section { margin-top:22px; }
}
</style>
