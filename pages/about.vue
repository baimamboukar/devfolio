<script setup>
import ProfileSocialLinks from '~/components/ProfileSocialLinks.vue';
definePageMeta({ title: 'About', description: 'Research, experience, and education of Baimam Boukar.' });
const { data } = await useAsyncData('about-profile', () => queryContent('about').findOne());
const degrees = computed(() => (data.value?.education || []).filter(entry => /^(Master|Bachelor) of/.test(entry.degree)));
const training = computed(() => (data.value?.education || []).filter(entry => !/^(Master|Bachelor) of/.test(entry.degree)));
const sections = [{ id: 'experience', label: 'Experience' }, { id: 'education', label: 'Education' }, { id: 'credentials', label: 'Credentials' }, { id: 'leadership', label: 'Leadership' }];
const route = useRoute();
const router = useRouter();
const sectionFor = section => section === 'training' ? 'education' : section === 'recognition' ? 'credentials' : sections.some(item => item.id === section) ? section : 'experience';
const activeSection = ref(sectionFor(route.hash.slice(1) || route.query.section));
async function selectSection(section) {
  activeSection.value = sectionFor(section);
  await router.replace({ path: route.path, query: { ...route.query, section }, hash: '' });
}
async function syncSection() {
  const requested = route.hash.slice(1) || route.query.section;
  if (typeof requested !== 'string') return;
  activeSection.value = sectionFor(requested);
  await nextTick();
  if (route.hash || ['training', 'recognition'].includes(requested)) document.getElementById(requested)?.scrollIntoView({ block: 'start' });
}
onMounted(syncSection);
watch(() => [route.query.section, route.hash], syncSection);
async function moveSection(event,index) {
  let next;
  if (event.key === 'ArrowRight') next = (index + 1) % sections.length;
  if (event.key === 'ArrowLeft') next = (index + sections.length - 1) % sections.length;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = sections.length - 1;
  if (next === undefined) return;
  event.preventDefault();
  await selectSection(sections[next].id);
  await nextTick();
  document.getElementById(`about-tab-${sections[next].id}`)?.focus();
}
useSeoMeta({ title: 'About', description: 'Mechanistic interpretability and AI safety: research background, experience, education, and service.' });
</script>
<template>
  <article class="profile-page">
    <header class="profile-heading"><h1>About</h1><p v-for="paragraph in data?.introduction" :key="paragraph" class="profile-introduction">{{ paragraph }}</p><ProfileSocialLinks class="about-socials" /></header>
    <template v-if="data">
      <div class="profile-navigation" role="tablist" aria-label="About sections"><button v-for="(section,index) in sections" :id="`about-tab-${section.id}`" :key="section.id" type="button" role="tab" :aria-selected="activeSection === section.id" :aria-controls="`about-panel-${section.id}`" :tabindex="activeSection === section.id ? 0 : -1" @click="selectSection(section.id)" @keydown="moveSection($event,index)">{{ section.label }}</button></div>
      <div id="about-panel-experience" v-show="activeSection === 'experience'" role="tabpanel" aria-labelledby="about-tab-experience" tabindex="0" class="profile-panel"><section id="experience"><Experience :experience="data.experience" /></section></div>
      <div id="about-panel-education" v-show="activeSection === 'education'" role="tabpanel" aria-labelledby="about-tab-education" tabindex="0" class="profile-panel"><section id="education" aria-labelledby="education-heading"><h2 id="education-heading">Education</h2><Education :education="degrees" /></section><section id="training" class="profile-subsection" aria-labelledby="training-heading"><h2 id="training-heading">Additional training</h2><Education :education="training" variant="records" /></section></div>
      <div id="about-panel-credentials" v-show="activeSection === 'credentials'" role="tabpanel" aria-labelledby="about-tab-credentials" tabindex="0" class="profile-panel"><section id="credentials" aria-labelledby="credentials-heading"><h2 id="credentials-heading">Credentials</h2><Certifications :certifications="data.certifications" /></section><section id="recognition" class="profile-subsection" aria-labelledby="recognition-heading"><h2 id="recognition-heading">Recognition</h2><AchievementsExpandable :achievements="data.achievements" /></section></div>
      <div id="about-panel-leadership" v-show="activeSection === 'leadership'" role="tabpanel" aria-labelledby="about-tab-leadership" tabindex="0" class="profile-panel"><section id="leadership" aria-labelledby="leadership-heading"><h2 id="leadership-heading">Service and Leadership</h2><Leadership :leadership="data.leadership" /></section></div>
    </template>
  </article>
</template>
<style scoped>
.profile-heading { margin-bottom: 23px; }
.about-socials { margin-top:12px; }
.profile-heading h1 { margin: 0; }
.profile-introduction { max-width: 72ch; color: var(--muted); font-size: 1rem; line-height: var(--content-leading); margin-top: 8px; }
.profile-introduction + .profile-introduction { margin-top: 13px; }
.profile-navigation { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: var(--section-gap); }
.profile-navigation button { min-height: 38px; padding: 8px 17px; border: 1px solid var(--line); border-radius: 22px; font-size: .8rem; color: var(--muted); background: var(--surface); }
.profile-navigation button[aria-selected=true] { color: var(--link-color); border-color: rgb(var(--primary-300) / .55); background: color-mix(in srgb, var(--link-color) 9%, var(--surface)); }
.profile-panel { min-width: 0; }
.profile-panel section { scroll-margin-top: 115px; }
.profile-panel h2 { margin-bottom: 20px; }
.profile-subsection { margin-top: var(--section-gap); }
@media (max-width: 600px) { .profile-navigation { gap: 7px; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); } .profile-navigation button { padding: 8px 9px; min-height: 44px; } .profile-introduction { font-size: .9rem; } }
</style>
