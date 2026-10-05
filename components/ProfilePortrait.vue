<script setup>
const atWork = ref(false);
</script>
<template>
  <figure class="portrait-widget">
    <button type="button" class="portrait-frame" :aria-label="atWork ? 'Show studio portrait' : 'Show photo at IBM Research'" :aria-pressed="atWork" @click="atWork = !atWork">
      <img v-if="!atWork" src="/images/baimam-portrait-640.webp" srcset="/images/baimam-portrait-320.webp 320w, /images/baimam-portrait-640.webp 640w" sizes="(max-width: 767px) 220px, (max-width: 1050px) 160px, 216px" width="640" height="736" alt="Baimam Boukar in a dark suit and blue tie" fetchpriority="high" decoding="async" />
      <img v-else src="/images/baimam-at-ibm.webp" width="720" height="540" alt="Baimam presenting his internship work at IBM Research" class="at-work" decoding="async" />
      <span class="photo-control glass-surface"><SiteIcon name="photo" />{{ atWork ? 'Portrait' : 'At work' }}</span>
    </button>
    <figcaption><a v-if="atWork" href="https://www.africa.engineering.cmu.edu/news/2026/02/03-jacques.html" target="_blank" rel="noopener noreferrer">Photo: CMU Africa <SiteIcon name="external" /></a></figcaption>
  </figure>
</template>
<style scoped>
.portrait-widget { width: 100%; margin: 3px 0 0; }
.portrait-frame { display: block; position: relative; width: 100%; aspect-ratio: 4 / 5; border-radius: 23px; background: #e8eaed; transform: rotate(2deg); box-shadow: 0 12px 32px #20334c12, 0 1px 3px #20334c15; transition: transform .28s ease; border: 5px solid var(--surface); overflow: hidden; }
.portrait-frame:hover, .portrait-frame:focus-visible { transform: rotate(0); }
.portrait-frame img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
.portrait-frame .at-work { object-position: 12% center; }
.photo-control { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 6px; white-space: nowrap; padding: 7px 12px; border-radius: 20px; font-size: .72rem; color: var(--ink); }
figcaption { min-height: 1.5rem; margin-top: 16px; font-size: .72rem; color: var(--muted); text-align: center; }
figcaption a { display: inline-flex; gap: 5px; align-items: center; }
</style>
