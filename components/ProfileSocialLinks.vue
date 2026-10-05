<script setup>
const profiles = [
  { name: 'GitHub', icon: 'github', url: 'https://github.com/baimamboukar' },
  { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/in/baimamboukar' },
  { name: 'Google Scholar', icon: 'scholar', url: 'https://scholar.google.com/citations?view_op=list_works&hl=en&user=nufEeDEAAAAJ' },
  { name: 'Medium', icon: 'medium', url: 'https://medium.com/@baimamboukar' },
  { name: 'LessWrong', image: '/icons/lesswrong.ico', url: 'https://www.lesswrong.com/users/baimam-boukar-jean-jacques' },
  { name: 'Hugging Face', icon: 'huggingface', url: 'https://huggingface.co/baimamboukar' },
  { name: 'Credly', icon: 'credly', url: 'https://www.credly.com/users/baimamboukar' },
  { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com/baimamboukar' },
];
</script>
<template>
  <nav class="social-profiles" aria-label="Social profiles"><a v-for="profile in profiles" :key="profile.name" :href="profile.url" :aria-label="profile.name" :title="profile.name" target="_blank" rel="noopener noreferrer"><img v-if="profile.image" :src="profile.image" width="19" height="19" alt="" /><SiteIcon v-else :name="profile.icon" /></a></nav>
</template>
<style scoped>
.social-profiles { display:grid; grid-template-columns:repeat(8,minmax(0,1fr)); align-items:center; gap:4px; width:286px; max-width:100%; min-width:0; }
.social-profiles a { display:grid; place-items:center; height:40px; min-width:0; border-radius:8px; color:var(--muted); }
.social-profiles a:hover { color:var(--ink); background:var(--surface-alt); }
.social-profiles .site-icon,.social-profiles img { width:19px; height:19px; object-fit:contain; }
@media(max-width:360px) { .social-profiles { gap:2px; } }
</style>
