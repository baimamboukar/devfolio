<script setup>
defineProps({ certifications: { type: Array, required: true } });
const validLink = value => typeof value === 'string' && /^https?:\/\//.test(value);
</script>
<template>
  <ul class="credential-gallery" aria-label="Certifications">
    <li v-for="certificate in certifications" :key="certificate.name" class="credential-tile"><img v-if="certificate.badge" :src="certificate.badge" :alt="`${certificate.name} badge`" width="112" height="112" loading="lazy" decoding="async"><div><h3>{{ certificate.name }}</h3><p v-if="certificate.issuer" class="credential-meta">{{ certificate.issuer }}</p><p v-if="certificate.date" class="credential-meta">{{ certificate.date }}</p><p v-if="certificate.description" class="credential-description">{{ certificate.description }}</p><ul v-if="certificate.skills?.length" class="credential-skills"><li v-for="skill in certificate.skills" :key="skill">{{ skill }}</li></ul><a v-if="validLink(certificate.credentialUrl)" :href="certificate.credentialUrl" target="_blank" rel="noopener noreferrer">View credential <SiteIcon name="arrow-right" /></a></div></li>
  </ul>
</template>
<style scoped>
.credential-gallery { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 13px; margin: 0; padding: 0; list-style: none; }
.credential-tile { min-width: 0; padding: 20px 13px 16px; border: 1px solid var(--line); border-radius: var(--corner-radius,12px); background: var(--surface); text-align: center; }
.credential-tile > img { width: 104px; height: 104px; object-fit: contain; margin: 0 auto 17px; }
.credential-tile h3 { font-size: .84rem; font-weight: var(--heading-weight); line-height: 1.5; }
.credential-meta { margin-top: 4px; color: var(--muted); font-size: .75rem; }
.credential-description,.credential-skills { margin-top: 8px; color: var(--muted); font-size: .8rem; line-height: 1.6; }
.credential-tile a { display: inline-flex; align-items: center; gap: 7px; margin-top: 10px; color: var(--link-color); font-size: .76rem; }
.credential-tile a :deep(svg) { width: 14px; height: 14px; }
@media (max-width: 900px) { .credential-gallery { grid-template-columns: repeat(2,minmax(0,1fr)); } }
@media (max-width: 600px) { .credential-gallery { gap: 9px; } .credential-tile { padding: 15px 8px 13px; } .credential-tile > img { width: 78px; height: 78px; margin-bottom: 12px; } .credential-tile h3 { font-size: .75rem; } }
</style>
