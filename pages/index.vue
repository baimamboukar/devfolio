<script setup>
import { slugify } from '~/utils/slugify';
import StudySketch from '~/components/StudySketch.vue';
import ProfileSocialLinks from '~/components/ProfileSocialLinks.vue';
definePageMeta({ title: 'Baimam Boukar', description: 'Mechanistic interpretability and AI safety research by Baimam Boukar.' });
const [{ content }, { data: papers }] = await Promise.all([
  useHomepageContent(),
  useAsyncData('home-study-workspace', async () => {
    const doc=await queryContent('research').findOne();
    return (doc?.research||[]).filter(paper=>paper.featured).slice(0,2).map(({title,status,links,authors})=>({title,status,links,authors,slug:slugify(title)}));
  }),

]);
const selected=ref(0);
const current=computed(()=>papers.value?.[selected.value]);
const tabs=[{label:'Generalization',question:'When does a probe generalize?',kind:'refit'},{label:'Interventions',question:'Can a probe guide an intervention?',kind:'selection'}];
const changeTab=(event,index)=>{
  let next=index;
  if(event.key==='ArrowRight') next=(index+1)%tabs.length;
  else if(event.key==='ArrowLeft') next=(index+tabs.length-1)%tabs.length;
  else if(event.key==='Home') next=0;
  else if(event.key==='End') next=tabs.length-1;
  else return;
  event.preventDefault(); selected.value=next;
  nextTick(()=>document.getElementById(`study-tab-${next}`)?.focus());
};
const summaryFor=slug=>content?.selected_research?.find(item=>item.slug===slug)?.summary||'';
const introduction=computed(()=>[content?.hero.introduction,content?.hero.research_summary].filter(Boolean).join(' '));
useHead({ title:'Baimam Boukar',titleTemplate:'%s' });
useSeoMeta({description:()=>introduction.value,ogTitle:'Baimam Boukar',ogDescription:()=>introduction.value});
</script>
<template>
  <div class="home-page">
    <section class="research-introduction" aria-labelledby="intro-title">
      <div class="intro-copy">
        <h1 id="intro-title">{{ content?.hero.name }}</h1>
        <p class="intro-discipline">{{ content?.hero.discipline }}</p>
        <p class="intro-summary">{{ introduction }}</p>
        <div class="intro-context">
          <div class="profile-links"><ProfileSocialLinks /></div>
          <NuxtLink to="/about?section=experience" class="lab-affiliation" prefetch-on="interaction">
            <img src="/images/jinesis-lab.webp" alt="Jinesis AI Lab logo" width="30" height="30" decoding="async" />
            <span>Research Assistant · Jinesis AI Lab, University of Toronto</span>
          </NuxtLink>
        </div>
      </div>
      <figure class="intro-portrait"><img src="/images/baimam-portrait-320.webp" srcset="/images/baimam-portrait-320.webp 320w, /images/baimam-portrait-640.webp 640w" sizes="(max-width: 760px) 96px, 176px" width="320" height="368" alt="Baimam Boukar" fetchpriority="high" decoding="async" /></figure>
    </section>
    <NewsTicker class="recent-updates" />
    <section v-if="current" class="research-workspace" aria-labelledby="current-heading">
      <div class="home-section-heading"><h2 id="current-heading">Research In Progress</h2></div>
      <div class="study-tabs" role="tablist" aria-label="Current research topics"><button v-for="(tab,index) in tabs" :id="`study-tab-${index}`" :key="tab.kind" type="button" role="tab" :aria-selected="selected===index" :tabindex="selected===index?0:-1" aria-controls="current-study-panel" @click="selected=index" @keydown="changeTab($event,index)">{{ tab.label }}</button></div>
      <div id="current-study-panel" class="study-workspace" role="tabpanel" :aria-labelledby="`study-tab-${selected}`" tabindex="0">
        <div class="study-question"><h3>{{ tabs[selected].question }}</h3><p class="research-summary">{{ summaryFor(current.slug) }}</p><div class="study-actions"><NuxtLink :to="'/research/'+current.slug" class="read-study" prefetch-on="interaction">Read study</NuxtLink></div></div>
        <StudySketch :kind="tabs[selected].kind" />
      </div>
    </section>
  </div>
</template>
<style scoped>
.home-page { display:grid; gap:var(--section-gap); }
.research-introduction { display:grid; grid-template-columns:minmax(0,1fr) var(--portrait-size); gap:38px; align-items:start; }
.intro-copy { min-width:0; }
h1 { margin:0; font-size:var(--name-size); font-weight:var(--heading-weight); line-height:1.18; letter-spacing:-.035em; }
.intro-discipline { margin-top:7px; font-size:1.25rem; line-height:1.4; color:var(--muted); }
.intro-summary { margin-top:16px; max-width:64ch; font-family:var(--font-body); font-size:1rem; line-height:var(--content-leading); text-wrap:pretty; }
.intro-portrait { margin:0; overflow:hidden; aspect-ratio:20/23; border-radius:var(--corner-radius); background:var(--surface-alt); }
.intro-portrait img { display:block; width:100%; height:100%; object-fit:contain; }
.intro-context { display:flex; flex-direction:column; align-items:flex-start; gap:8px; margin-top:12px; }
.lab-affiliation { display:flex; align-items:center; gap:10px; font-size:.875rem; line-height:1.5; color:var(--muted); }
.lab-affiliation img { width:30px; height:30px; border-radius:50%; object-fit:cover; flex:none; }
.profile-links { display:flex; align-items:center; flex-wrap:wrap; gap:10px 18px; width:100%; font-size:.875rem; font-weight:500; }
.home-section-heading { margin-bottom:10px; }
.home-section-heading h2 { font-size:var(--section-size); line-height:1.35; font-weight:var(--heading-weight); letter-spacing:-.025em; }
.study-tabs { display:flex; flex-wrap:wrap; gap:12px; margin-bottom:12px; }
.study-tabs button { min-height:36px; padding:7px 27px; border-radius:999px; background:var(--surface-alt); color:var(--ink); font-size:.875rem; line-height:1.4; }
.study-tabs button[aria-selected='true'] { background:rgb(var(--primary-500)); color:white; box-shadow:0 3px 8px rgb(var(--primary-500) / .08); }
.study-workspace { display:grid; grid-template-columns:minmax(0,.43fr) minmax(0,.57fr); gap:26px; align-items:stretch; padding:16px 20px; background:var(--study-surface); border-radius:var(--corner-radius); }
.study-question { display:flex; flex-direction:column; align-items:flex-start; min-width:0; }
.study-question h3 { font-size:var(--section-size); line-height:1.3; margin-top:0; font-weight:var(--heading-weight); letter-spacing:-.035em; }
.research-summary { margin:8px 0 18px; font-size:1rem; line-height:1.5; color:var(--muted); }
.study-actions { margin-top:auto; padding-top:9px; display:flex; flex-wrap:wrap; gap:9px 13px; font-size:.875rem; }
.study-actions a { min-height:38px; padding:7px 16px; border:1px solid var(--line); display:inline-flex; gap:13px; align-items:center; border-radius:var(--corner-radius); color:var(--ink); background:color-mix(in srgb,var(--surface-alt) 80%,var(--surface)); }
.study-actions .site-icon { width:17px; height:17px; }
.study-actions .read-study { background:rgb(var(--primary-500)); border-color:transparent; border-radius:999px; color:white; }
.study-actions .read-study:hover { background:rgb(var(--primary-600)); }
.study-workspace :deep(.study-sketch) { background:transparent; border-left:1px solid var(--line); border-radius:0; padding:0 0 0 26px; }
.study-workspace :deep(.sketch-label) { margin-bottom:8px; }
.study-workspace :deep(.method-note) { display:none; }
@media(max-width:1100px) { .intro-context { gap:8px 20px; } .research-introduction { gap:24px; } .study-workspace { gap:18px; padding:18px; } .study-workspace :deep(.study-sketch) { padding-left:18px; } }
@media(max-width:900px) { .study-workspace { grid-template-columns:1fr; } .study-workspace :deep(.study-sketch) { padding:18px 0 0; border-left:0; border-top:1px solid var(--line); } }
@media(max-width:760px) {
  .research-introduction { grid-template-columns:minmax(0,1fr) calc(var(--portrait-size) * .55); gap:12px; }
  .intro-copy { display:contents; } h1 { grid-column:1; grid-row:1; align-self:center; font-size:min(var(--name-size),30px); }
  .intro-portrait { grid-column:2; grid-row:1; align-self:center; }
  .intro-discipline,.intro-summary,.intro-context { grid-column:1/-1; margin-top:0; }
  .intro-discipline { font-size:1.0625rem; }
  .study-tabs button,.study-actions a { min-height:44px; }
  .study-tabs { gap:8px; } .study-tabs button { padding-inline:18px; }
}
@media(max-width:400px) { .study-workspace { padding:14px; } h1 { font-size:min(var(--name-size),26px); } .research-introduction { grid-template-columns:minmax(0,1fr) 64px; } .study-tabs button { padding-inline:11px; font-size:.8rem; } .lab-affiliation { align-items:flex-start; font-size:.8rem; } .study-question h3 { font-size:21px; } }
</style>
