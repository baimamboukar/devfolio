<script setup>
const route = useRoute();
const expanded = ref(false);
const navElement = ref(null);
const menuButton = ref(null);
const navigationId = useId();
const mobileNavigationExpanded = useState('preview-mobile-nav-expanded', () => false);
const links = [
  { label: 'Home', path: '/', icon: 'home' },
  { label: 'Work', path: '/work', icon: 'projects' },
  { label: 'About', path: '/about', icon: 'about' },
  { label: 'Writing', path: '/blog', icon: 'writing' },
  { label: 'Talks', path: '/presentations', icon: 'talks' },
];
const active = path => path === '/work'
  ? /^\/(work|research|projects)(\/|$)/.test(route.path)
  : route.path === path || (path !== '/' && route.path.startsWith(path + '/'));
const close = (restoreFocus = false) => { const wasOpen = expanded.value; expanded.value = false; if (restoreFocus && wasOpen) menuButton.value?.focus(); };
watch(() => route.fullPath, () => close());
watch(expanded, (value) => {
  if (navElement.value?.classList.contains('mobile-navigation')) mobileNavigationExpanded.value = value;
});
onBeforeUnmount(() => {
  if (navElement.value?.classList.contains('mobile-navigation')) mobileNavigationExpanded.value = false;
});
onClickOutside(navElement, () => close());
</script>
<template>
  <nav ref="navElement" aria-label="Primary navigation" class="site-navigation glass-surface" :class="{ expanded }" @keydown.esc.stop.prevent="close(true)">
    <ul :id="navigationId">
      <li v-for="link in links" :key="link.path">
        <NuxtLink :to="link.path" :aria-current="active(link.path) ? 'page' : undefined" :class="{ active: active(link.path) }" @click="close()"><SiteIcon :name="link.icon" /><span>{{ link.label }}</span><span v-if="active(link.path)" class="active-dot" aria-hidden="true" /></NuxtLink>
      </li>
    </ul>
    <button ref="menuButton" type="button" class="menu-toggle" :aria-expanded="expanded" :aria-controls="navigationId" :aria-label="expanded ? 'Close navigation' : 'Open navigation'" @click="expanded = !expanded"><SiteIcon :name="expanded ? 'close' : 'menu'" /><span>{{ expanded ? 'Close' : 'Explore' }}</span></button>
  </nav>
</template>
<style scoped>
.site-navigation { padding: 7px; border-radius: 22px; }
ul { display: grid; gap: 3px; }
li a { display: flex; align-items: center; gap: 12px; padding: 11px 13px; border-radius: 15px; color: var(--muted); font-size: .9rem; font-weight: 500; transition: background .18s, color .18s; }
li a:hover { background: rgb(var(--primary-50) / .65); color: rgb(var(--primary-700)); }
li a.active { background: var(--surface); color: var(--ink); box-shadow: 0 1px 5px #182d5010, inset 0 1px 0 #fff4; }
.active-dot { margin-left: auto; width: 5px; height: 5px; border-radius: 50%; background: rgb(var(--primary-500)); }
.menu-toggle { display: none; }
:global(.dark) li a:hover { background: #ffffff08; color: var(--ink); }
@media (max-width: 767px) {
  .site-navigation { position: fixed; bottom: max(18px, env(safe-area-inset-bottom)); right: 20px; z-index: 50; min-width: 120px; padding: 6px; border-radius: 22px; }
  .site-navigation ul { display: none; }
  .menu-toggle { display: flex; align-items: center; justify-content: center; gap: 9px; min-height: 42px; width: 100%; padding: 0 16px; font-size: .85rem; border-radius: 16px; }
  .expanded { width: min(300px, calc(100vw - 40px)); }
  .expanded ul { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); padding: 5px; margin-bottom: 5px; }
  .expanded li a { font-size: .83rem; padding: 13px 10px; gap: 8px; }
  .expanded .menu-toggle { background: var(--surface); }
}
</style>
