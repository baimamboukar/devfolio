<script setup>
const route = useRoute();
const expanded = useState('preview-mobile-nav-expanded', () => false);
const preferences = useState('site-navigation-preferences', () => ({}));
const defaults = { position: 'sticky', align: 'center', indicator: 'pill', density: 'compact', brand: 'home' };
const settings = computed(() => ({ ...defaults, ...preferences.value }));
const header = ref(null);
const menuButton = ref(null);
const navigation = [
  { label: 'Work', path: '/work' },
  { label: 'About', path: '/about' },
  { label: 'Writing', path: '/blog' },
  { label: 'Talks', path: '/presentations' },
];
const mobileLinks = [{ label: 'Home', path: '/' }, ...navigation];
const active = path => path === '/work'
  ? /^\/(work|research|projects)(\/|$)/.test(route.path)
  : route.path === path || (path !== '/' && route.path.startsWith(path + '/'));
const close = (restore = false) => {
  if (restore && expanded.value) menuButton.value?.focus();
  expanded.value = false;
};
watch(() => route.fullPath, () => close());
onClickOutside(header, () => close());
onBeforeUnmount(() => { expanded.value = false; });
</script>

<template>
  <header ref="header" class="site-header" :class="{ 'inner-page-header': route.path !== '/' }" :data-position="settings.position" :data-align="settings.align" :data-indicator="settings.indicator" :data-density="settings.density" @keydown.esc.stop.prevent="close(true)">
    <NuxtLink v-if="route.path !== '/'" to="/" class="header-identity" prefetch-on="interaction" aria-label="Baimam Boukar home">{{ settings.brand === 'initials' ? 'BB' : 'Baimam Boukar' }}</NuxtLink>
    <div class="navigation-rail">
      <div class="navigation-links">
      <NuxtLink to="/" class="header-home" prefetch-on="interaction" aria-label="Baimam Boukar home" :aria-current="active('/') ? 'page' : undefined"><span>{{ settings.brand === 'name' ? 'Baimam' : settings.brand === 'initials' ? 'BB' : 'Home' }}</span></NuxtLink>
      <nav class="header-navigation" aria-label="Primary navigation">
        <NuxtLink v-for="link in navigation" :key="link.path" :to="link.path" prefetch-on="interaction" :aria-current="active(link.path) ? 'page' : undefined">{{ link.label }}</NuxtLink>
      </nav>
      </div>
      <div class="header-tools">
        <AppThemeToggle />
        <button ref="menuButton" class="header-menu-toggle" type="button" :aria-expanded="expanded" aria-controls="mobile-site-menu" @click="expanded = !expanded">{{ expanded ? 'Close' : 'Menu' }}<SiteIcon :name="expanded ? 'close' : 'menu'" /></button>
      </div>
    </div>
    <nav v-if="expanded" id="mobile-site-menu" class="header-mobile-menu" aria-label="Mobile navigation">
      <NuxtLink v-for="link in mobileLinks" :key="link.path" :to="link.path" prefetch-on="interaction" :aria-current="active(link.path) ? 'page' : undefined" @click="close()">{{ link.label }}</NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
.site-header { position: sticky; top: 0; z-index: 45; padding: 16px 0 10px; background: var(--page); font-family: var(--font-body); }
.site-header[data-position='static'] { position: relative; }
.header-identity { display:none; }
.navigation-links { display:contents; }
.navigation-rail { width: max-content; max-width: 100%; display: flex; align-items: center; gap: 10px; min-height: 54px; padding: 8px 14px 8px 10px; margin-inline: auto; border-radius: 999px; background: var(--surface-alt); }
.site-header[data-align='left'] .navigation-rail { margin-inline: 0 auto; }
.header-home { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 9px; flex: none; min-height: 38px; padding: 0 18px; border-radius: 999px; color: var(--muted); font-size: 13px; font-weight: 500; line-height: 1.3; text-decoration: none !important; }
.header-navigation { display: flex; align-items: center; gap: 2px; min-width: 0; }
.header-navigation > a { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 7px; min-height: 38px; padding: 0 18px; border-radius: 999px; color: var(--muted); font-size: 13px; font-weight: 500; line-height: 1.3; white-space: nowrap; text-decoration: none !important; }
.header-home:hover, .header-navigation > a:hover { color: var(--ink); background: color-mix(in srgb, var(--surface) 65%, transparent); }
:is(.header-home[aria-current], .header-navigation > a[aria-current]) { background: rgb(var(--primary-500)); color: white; }
.site-header[data-indicator='quiet'] :is(.header-home[aria-current],.header-navigation > a[aria-current]) { background: var(--surface); color: var(--ink); box-shadow: 0 1px 3px #15213a0b; }
.site-header[data-indicator='dot'] :is(.header-home[aria-current],.header-navigation > a[aria-current]) { background: transparent; color: var(--link-color); }
.site-header[data-indicator='dot'] :is(.header-navigation > a[aria-current])::after { content: ''; position: absolute; width: 4px; height: 4px; border-radius: 50%; background: currentColor; bottom: 1px; left: calc(50% - 2px); }
.site-header[data-indicator='solid'] :is(.header-home[aria-current],.header-navigation > a[aria-current]) { border-radius: 8px; background: rgb(var(--primary-600)); color: white; }
.site-header[data-density='comfortable'] .navigation-rail { min-height: 64px; padding-block: 11px; }
.site-header[data-density='comfortable'] :is(.header-home,.header-navigation > a) { min-height: 42px; }
.header-tools { display: flex; align-items: center; flex: none; gap: 10px; margin-left: 16px; }
.header-tools :deep(.theme-switch) { width: 34px; height: 38px; padding: 7px; border: 0; border-radius: 999px; background: transparent; color: var(--ink); box-shadow: none; backdrop-filter: none; }
.header-tools :deep(.theme-switch:hover) { transform: none; background: var(--surface); }
.header-tools :deep(.theme-switch .site-icon) { width: 17px; height: 17px; }
.header-menu-toggle, .header-mobile-menu { display: none; }
.site-header :is(a,button):focus-visible { outline: 2px solid rgb(var(--primary-500)); outline-offset: 2px; }
@media (max-width: 1400px) { .header-tools { margin-left: 8px; gap: 6px; } .header-navigation > a { padding-inline: 12px; } }
@media (max-width: 1080px) { .navigation-rail { gap: 6px; padding-right: 10px; } .header-navigation > a { padding-inline: 9px; } }
@media (min-width: 851px) { .header-mobile-menu { display: none; } }
@media (max-width: 850px) {
  .site-header { padding-top: 10px; padding-bottom: 8px; }
  .navigation-rail { padding: 6px; min-height: 50px; gap: 6px; }
  .header-navigation { display: none; }
  .header-home { font-size: 13px; padding-inline: 12px; gap: 7px; }
  .header-tools { gap: 2px; margin-left: 6px; }
  .header-tools :deep(.theme-switch) { width: 30px; min-height: 38px; }
  .header-menu-toggle { display: flex; align-items: center; gap: 6px; min-height: 38px; padding: 0 8px; border-radius: 999px; font-size: 13px; color: var(--ink); }
  .header-menu-toggle .site-icon { width: 14px; height: 14px; }
  .header-mobile-menu { position: absolute; top: calc(100% - 2px); left: 0; right: 0; z-index: 46; display: grid; grid-template-columns: 1fr 1fr; gap: 3px; padding: 8px; background: var(--surface); border: 1px solid var(--line); border-radius: 14px; box-shadow: 0 8px 24px #172b4d15; }
  .header-mobile-menu :is(a,button) { display: flex; align-items: center; min-height: 44px; padding: 6px 9px; border-radius: 8px; font-size: 13px; color: var(--ink); text-decoration: none !important; }
  .header-mobile-menu :is(a,button):hover, .header-mobile-menu a[aria-current] { color: var(--link-color); background: color-mix(in srgb, rgb(var(--primary-500)) 8%, var(--surface)); }
}

/* Inside pages retain the concept's identity / navigation / tools composition. */
@media (min-width: 1301px) {
  .inner-page-header { display:grid; grid-template-columns:minmax(0,1fr) auto minmax(0,1fr); align-items:center; column-gap:18px; min-height:64px; padding:10px 0; }
  .inner-page-header .header-identity { display:inline-flex; align-items:center; justify-self:start; min-height:44px; color:var(--ink); font-size:17px; font-weight:700; line-height:1.3; letter-spacing:-.035em; white-space:nowrap; text-decoration:none; }
  .inner-page-header .navigation-rail { display:contents; }
  .inner-page-header .navigation-links { display:flex; align-items:center; gap:2px; padding:5px; border-radius:999px; background:var(--surface-alt); width:max-content; max-width:100%; }
  .inner-page-header .header-home, .inner-page-header .header-navigation > a { padding-inline:14px; min-height:34px; font-size:13px; }
  .inner-page-header .header-tools { justify-self:end; margin-left:0; gap:7px; }
  .inner-page-header[data-align='left'] { grid-template-columns:auto minmax(0,1fr) auto; }
  .inner-page-header[data-align='left'] .navigation-links { justify-self:start; }
  .inner-page-header[data-density='comfortable'] .navigation-links { padding-block:8px; }
  .inner-page-header[data-density='comfortable'] :is(.header-home,.header-navigation > a) { min-height:40px; }
}
@media (prefers-reduced-motion: reduce) { .site-header *, .site-header :deep(*) { transition: none !important; } }
</style>
