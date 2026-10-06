<script setup>
import '~/assets/css/fonts.css';
import '~/assets/css/research-design.css';
import { SITE_SETTINGS, settingsHtmlAttrs } from '~/utils/siteSettings';
const showTweak=import.meta.dev;
const TweakPanel=import.meta.dev?defineAsyncComponent(()=>import('~/components/TweakPanel.vue')):null;
const props=defineProps({error:Object});
const missing=computed(()=>props.error?.statusCode===404);
useHead({title:()=>`${missing.value?'Page not found':'Unable to open page'} · Baimam Boukar`,htmlAttrs:{'data-preview-design':'research',...(showTweak?{}:settingsHtmlAttrs(SITE_SETTINGS))}});
</script>
<template><div class="site-shell"><AppHeader /><main id="main-content" class="error-page" tabindex="-1"><section><span class="error-code">{{ error?.statusCode||500 }}</span><h1>{{ missing?"This page isn't here.":'This page could not load.' }}</h1><p>{{ missing?'The address may have changed. Research and projects are available from the navigation.':'Try returning home, then open the page again.' }}</p><div class="error-actions"><button type="button" @click="clearError({redirect:'/'})">Return home</button><a href="/research">Research index ↗</a></div></section><AppFooter /></main></div><ClientOnly v-if="TweakPanel"><component :is="TweakPanel" /></ClientOnly></template>
<style scoped>
.error-page > section { padding:var(--section-gap) 0; min-height:40vh; }
.error-code { font-size:.8rem; color:var(--muted); }
h1 { margin:12px 0; }
p { max-width:60ch; color:var(--muted); }
.error-actions { display:flex; flex-wrap:wrap; align-items:center; gap:12px 20px; margin-top:24px; font-size:.85rem; }
.error-actions button { padding:8px 15px; min-height:42px; border:0; border-radius:var(--corner-radius); color:white; background:rgb(var(--primary-600)); }
.error-actions a { color:var(--link-color); }
</style>
