<script setup>
import '~/assets/css/fonts.css';
import '~/assets/css/collections.css';
import '~/assets/css/research-design.css';
useHead({
  htmlAttrs: { 'data-preview-design': 'research' },
  link: [{ rel: 'preload', href: '/fonts/dm-sans-variable-latin.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
});
</script>
<template>
  <div class="site-shell">
    <a href="#main-content" class="skip-link">Skip to content</a>
    <AppHeader />
    <NuxtLayout><NuxtPage /></NuxtLayout>
  </div>
  <ClientOnly><LazyTweakPanel /></ClientOnly>
</template>
<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
