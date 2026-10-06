<script setup>
import '~/assets/css/fonts.css';
import '~/assets/css/collections.css';
import '~/assets/css/research-design.css';
import { SITE_SETTINGS, settingsHtmlAttrs } from '~/utils/siteSettings';
// The Tweak panel exists only on the local dev server; published pages render SITE_SETTINGS directly.
const showTweak = import.meta.dev;
// The dev-only import is removed from production bundles entirely.
const TweakPanel = import.meta.dev ? defineAsyncComponent(() => import('~/components/TweakPanel.vue')) : null;
useHead({
  htmlAttrs: { 'data-preview-design': 'research', ...(showTweak ? {} : settingsHtmlAttrs(SITE_SETTINGS)) },
  link: [{ rel: 'preload', href: '/fonts/dm-sans-variable-latin.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
});
</script>
<template>
  <div class="site-shell">
    <a href="#main-content" class="skip-link">Skip to content</a>
    <AppHeader />
    <NuxtLayout><NuxtPage /></NuxtLayout>
  </div>
  <ClientOnly v-if="TweakPanel"><component :is="TweakPanel" /></ClientOnly>
</template>
<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
