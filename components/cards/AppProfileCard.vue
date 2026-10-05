<script setup>
const profiles = [
  { name: 'GitHub', icon: 'github', url: 'https://github.com/baimamboukar' },
  { name: 'Google Scholar', icon: 'scholar', url: 'https://scholar.google.com/citations?view_op=list_works&hl=en&user=nufEeDEAAAAJ' },
  { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/in/baimamboukar' },
  { name: 'Hugging Face', icon: 'huggingface', url: 'https://huggingface.co/baimamboukar' },
];
</script>
<template>
  <div class="profile-identity">
    <NuxtLink to="/" class="profile-home" aria-label="Baimam Boukar home">
      <img src="/images/baimam-portrait-160.webp" alt="" width="64" height="64" class="profile-avatar" decoding="async" />
      <div>
        <p class="profile-name">Baimam Boukar JJ</p>
        <p class="profile-role">Mechanistic Interpretability and AI Safety</p>
      </div>
    </NuxtLink>
    <div class="profile-socials" aria-label="Find me online">
      <a v-for="profile in profiles" :key="profile.name" :href="profile.url" :title="profile.name" :aria-label="profile.name" target="_blank" rel="noopener noreferrer"><SiteIcon :name="profile.icon" /></a>
      <a href="mailto:baimamboukar@gmail.com" title="Email" aria-label="Email Baimam"><SiteIcon name="mail" /></a>
    </div>
  </div>
</template>
<style scoped>
.profile-home { display: flex; flex-direction: column; align-items: flex-start; gap: 18px; }
.profile-avatar { width: 64px; height: 64px; border-radius: 20px; object-fit: cover; object-position: center 25%; box-shadow: 0 2px 8px #17255414; }
.profile-name { color: var(--ink); font-size: 1.15rem; font-weight: 600; letter-spacing: -.035em; }
.profile-role { margin-top: 4px; font-size: .82rem; color: var(--muted); }
.profile-socials { display: flex; gap: 5px; margin: 14px 0 0 -7px; }
.profile-socials a { display: grid; place-items: center; width: 32px; height: 36px; border-radius: 10px; color: var(--muted); transition: background .15s, color .15s; }
.profile-socials a:hover { background: var(--surface); color: rgb(var(--primary-600)); }
@media (max-width: 767px) { .profile-home { flex-direction: row; align-items: center; gap: 11px; } .profile-avatar { width: 42px; height: 42px; border-radius: 14px; } .profile-name { font-size: 1rem; } .profile-role { font-size: .72rem; margin-top: 1px; } .profile-socials { display: none; } }
</style>
