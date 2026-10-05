<script setup>
defineProps({ education: { type: Array, required: true }, variant: { type: String, default: 'timeline' } });
const period = entry => entry.period.replace(/-/g, ' – ');
</script>
<template>
  <ol class="education-timeline" :class="{ 'training-records': variant === 'records' }" :aria-label="variant === 'records' ? 'Additional training' : 'Education'">
    <li v-for="entry in education" :key="entry.institution + entry.degree" class="education-stop">
      <div class="institution-mark"><img :src="entry.icon" :alt="entry.institution" width="72" height="72" loading="lazy" decoding="async"></div>
      <article class="education-card"><header><h3>{{ entry.degree }}</h3><div class="institution-meta"><p>{{ entry.institution }}</p><span class="study-date">{{ period(entry) }}</span></div><p v-if="entry.specialization" class="specialization">{{ entry.specialization }}</p></header><ul v-if="entry.courses?.length" class="coursework" aria-label="Coursework"><li v-for="(course,index) in entry.courses" :key="`${course}-${index}`">{{ course }}</li></ul></article>
    </li>
  </ol>
</template>
<style scoped>
.education-timeline { list-style: none; margin: 0; padding: 0; }
.education-stop { position: relative; display: grid; grid-template-columns: 72px minmax(0,1fr); align-items: start; gap: 19px; padding-bottom: calc(var(--row-gap) + 12px); }
.education-stop:not(:last-child)::before { content: ''; position: absolute; left: 35px; top: 94px; bottom: -14px; border-left: 1px dashed var(--line); }
.institution-mark { position: relative; display: grid; place-items: center; width: 72px; height: 72px; margin-top: 16px; padding: 4px; border-radius: 50%; background: #fff; }
.institution-mark img { width: 64px; height: 64px; object-fit: contain; border-radius: 50%; }
.education-card { min-width: 0; border: 1px solid var(--line); background: var(--surface); border-radius: var(--corner-radius,12px); overflow: hidden; }
.education-card header { padding: 19px 21px; }
.education-card h3 { font-size: var(--paper-size,18px); line-height: 1.45; font-weight: var(--heading-weight); }
.institution-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 11px; margin-top: 5px; color: var(--muted); font-size: .86rem; }
.study-date { display: inline-block; padding: 2px 7px; border-radius: 5px; background: color-mix(in srgb, var(--link-color) 9%, var(--surface)); color: var(--link-color); font-size: .72rem; white-space: nowrap; }
.specialization { margin-top: 6px; font-size: .83rem; color: var(--muted); }
.coursework { list-style: none; padding: 17px 21px; margin: 0; border-top: 1px solid var(--line); display: grid; gap: 5px; }
.coursework li { position: relative; padding-left: 14px; color: var(--muted); font-size: .82rem; line-height: 1.65; }
.coursework li::before { content: ''; position: absolute; width: 5px; height: 5px; border-radius: 50%; left: 0; top: .65em; background: rgb(var(--primary-400)); }
@media (max-width: 600px) { .education-stop { display: block; padding-top: 22px; } .education-stop::before { display: none; } .institution-mark { width: 52px; height: 52px; margin: 0 0 -21px 14px; transform: translateY(-22px); border: 1px solid var(--line); } .institution-mark img { width: 44px; height: 44px; } .education-card header { padding: 24px 14px 16px; } .education-card h3 { font-size: min(var(--paper-size,18px),1.02rem); } .institution-meta { font-size: .82rem; } .coursework { padding: 15px 14px; } .coursework li { font-size: .77rem; } }
</style>
