<script setup>
// Local development controls; never rendered in production. Settings stay in this browser.
import { PALETTES, SITE_SETTINGS, settingsVariables, settingsDataset, navigationSettings, isNeutralTheme as neutralTheme, resolvedColorMode as colorModeFor } from '~/utils/siteSettings';

const STORAGE_KEY = 'tweak-config-v7';
const LEGACY_KEYS = ['tweak-config-v6', 'tweak-config-v5', 'tweak-config-v4', 'tweak-config-v3', 'tweak-config-v2'];
const DEFAULTS = SITE_SETTINGS;
const RANGES = {
  width: [68, 70, 1, '%'], bodySize: [13, 18, 1, 'px'], nameSize: [24, 36, 1, 'px'],
  sectionSize: [16, 24, 1, 'px'], paperSize: [14, 20, 1, 'px'], leading: [1.4, 1.9, .05, ''],
  sectionGap: [16, 44, 2, 'px'], rowGap: [8, 24, 1, 'px'], portraitSize: [96, 176, 8, 'px'],
  headingWeight: [400, 700, 100, ''], corners: [0, 18, 1, 'px'],
};
const CHOICES = {
  heading: ['Fraunces', 'DM Sans', 'Georgia', 'System sans'],
  body: ['DM Sans', 'System sans', 'Georgia', 'System mono'],
  color: Object.keys(PALETTES), theme: ['light', 'dark', 'black', 'monochrome', 'system'],
  portrait: ['show', 'hide'], summaries: ['show', 'hide'], authors: ['show', 'hide'],
  updates: ['show', 'hide'], links: ['show', 'hide'], dividers: ['show', 'hide'],
  motion: ['subtle', 'none'], headingStyle: ['normal', 'italic'], sectionCase: ['normal', 'uppercase'],
  linkStyle: ['hover', 'always'], surface: ['white', 'warm', 'cool'], projectSurface: ['neutral', 'tinted'], textAlign: ['left', 'justify'],
  navPosition: ['sticky', 'static'], navAlign: ['left', 'center'], navIndicator: ['pill', 'quiet', 'dot', 'solid'], navDensity: ['compact', 'comfortable'],
  navWriting: ['show', 'hide'], navTalks: ['show', 'hide'], navPhotos: ['show', 'hide'], navNews: ['show', 'hide'], navCv: ['show', 'hide'], navCustomize: ['show', 'hide'], navBrand: ['home', 'initials', 'name'],
};
const GROUPS = [
  { name: 'Appearance', open: true, ranges: [], selects: [['theme', 'Theme']] },
  { name: 'Navigation', open: true, ranges: [], selects: [['navPosition', 'Bar position'], ['navAlign', 'Bar alignment'], ['navIndicator', 'Active link'], ['navDensity', 'Bar spacing'], ['navBrand', 'Home label']] },
  { name: 'Layout', open: true, ranges: [['width', 'Page width'], ['sectionGap', 'Section spacing'], ['rowGap', 'Row spacing'], ['portraitSize', 'Portrait size'], ['corners', 'Corner radius']], selects: [['dividers', 'Section dividers'], ['textAlign', 'Paragraph alignment']] },
  { name: 'Typography', open: false, ranges: [['bodySize', 'Body text'], ['nameSize', 'Name heading'], ['sectionSize', 'Section headings'], ['paperSize', 'Paper titles'], ['leading', 'Line height'], ['headingWeight', 'Heading weight']], selects: [['heading', 'Heading font'], ['body', 'Body font'], ['headingStyle', 'Heading style'], ['sectionCase', 'Section case'], ['linkStyle', 'Link treatment']] },
  { name: 'Color', open: false, ranges: [], selects: [['surface', 'Light background'], ['projectSurface', 'Featured cards']] },
  { name: 'Content', open: false, ranges: [], selects: [['portrait', 'Portrait'], ['summaries', 'Paper summaries'], ['authors', 'Paper authors'], ['updates', 'Recent updates'], ['links', 'Profile links']] },
  { name: 'Motion', open: false, ranges: [], selects: [['motion', 'Transitions']] },
];
const open = useState('preview-appearance-open', () => false);
const mobileNavigationExpanded = useState('preview-mobile-nav-expanded', () => false);
const colorMode = useColorMode();
const navigationPreferences = useState('site-navigation-preferences', () => ({}));
let returnFocus = null;
const state = reactive({ ...DEFAULTS });
const isNeutralTheme = computed(() => neutralTheme(state.theme));
const resolvedColorMode = () => colorModeFor(state.theme);
const panel = ref(null);
const trigger = ref(null);
const settingsText = ref('');
const settingsMessage = ref('');
const panelId = 'preview-appearance-panel';

const normalize = (saved) => {
  const result = { ...DEFAULTS };
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return result;
  for (const [key, options] of Object.entries(CHOICES)) {
    if (options.includes(saved[key])) result[key] = saved[key];
  }
  for (const [key, [min, max, step]] of Object.entries(RANGES)) {
    if (typeof saved[key] !== 'number' || !Number.isFinite(saved[key])) continue;
    const clamped = Math.min(max, Math.max(min, saved[key]));
    result[key] = Number((min + Math.round((clamped - min) / step) * step).toFixed(2));
  }
  return result;
};
const apply = () => {
  const root = document.documentElement;
  // Remove previous preview experiments before applying the current settings.
  Array.from(root.classList).filter(name => name.startsWith('tw-')).forEach(name => root.classList.remove(name));
  root.style.removeProperty('font-size');
  for (const [name, value] of Object.entries(settingsVariables(state))) root.style.setProperty(name, value);
  for (const [name, value] of Object.entries(settingsDataset(state))) root.dataset[name] = value;
  navigationPreferences.value = navigationSettings(state);
  if (colorMode.preference !== resolvedColorMode()) colorMode.preference = resolvedColorMode();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
};
const reset = () => {
  Object.assign(state, DEFAULTS);
  settingsText.value = '';
  settingsMessage.value = 'Default settings restored.';
  try { LEGACY_KEYS.forEach(key => localStorage.removeItem(key)); } catch {}
  apply();
};
const close = () => {
  open.value = false;
  (returnFocus?.isConnected ? returnFocus : trigger.value)?.focus();
};
const exportSettings = () => {
  settingsText.value = JSON.stringify(normalize(state), null, 2);
  settingsMessage.value = 'Settings ready to copy.';
};
const importSettings = () => {
  try {
    const value = JSON.parse(settingsText.value);
    if (!value || typeof value !== 'object' || Array.isArray(value) || !Object.keys(DEFAULTS).some(key => Object.hasOwn(value, key))) throw new Error('Invalid settings');
    Object.assign(state, normalize(value));
    apply();
    settingsMessage.value = 'Settings applied. Unsupported values use defaults.';
  } catch {
    settingsMessage.value = 'Enter a valid settings JSON object.';
  }
};
watch(open, async (value) => {
  if (value) { returnFocus = document.activeElement; await nextTick(); panel.value?.focus(); }
});
watch(mobileNavigationExpanded, expanded => { if (expanded) open.value = false; });
onMounted(() => {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) Object.assign(state, normalize(JSON.parse(current)));
    else {
      for (const key of LEGACY_KEYS) {
        try {
          const legacy = JSON.parse(localStorage.getItem(key) || 'null');
          if (legacy && typeof legacy === 'object' && !Array.isArray(legacy)) {
            const migrated = normalize(legacy);
            // A new design resets dimensions and heading defaults, retaining reading/color preferences.
            for (const name of ['width', 'bodySize', 'nameSize', 'sectionSize', 'paperSize', 'sectionGap', 'rowGap', 'portraitSize', 'corners', 'heading', 'headingWeight', ...Object.keys(DEFAULTS).filter(key => key.startsWith('nav'))]) migrated[name] = DEFAULTS[name];
            Object.assign(state, migrated);
            break;
          }
        } catch {}
      }
    }
  } catch {}
  apply();
  watch(state, apply, { deep: true });
  watch(() => colorMode.preference, preference => {
    if (preference === resolvedColorMode() || !['light', 'dark', 'system'].includes(preference)) return;
    // The header's sun/moon switch keeps the selected neutral theme family.
    state.theme = isNeutralTheme.value && preference !== 'system'
      ? (preference === 'dark' ? 'black' : 'monochrome')
      : preference;
  });
});
const colorName = name => name === 'meta' ? 'Meta blue' : name.charAt(0).toUpperCase() + name.slice(1);
const choiceLabel = (key, value) => {
  if (key === 'theme') return ({ light: 'Light', dark: 'Dark', black: 'True black', monochrome: 'Black and white', system: 'System' })[value];
  if (key === 'linkStyle') return value === 'hover' ? 'Color on hover' : 'Always underline';
  if (key === 'navIndicator') return ({ pill: 'Filled pill', quiet: 'Quiet pill', dot: 'Dot', solid: 'Filled tab' })[value];
  if (key === 'navBrand') return ({ home: 'Home', initials: 'BB initials', name: 'Baimam' })[value];
  if (key === 'navPosition') return value === 'sticky' ? 'Stays in view' : 'Scrolls with page';
  if (key === 'motion') return value === 'subtle' ? 'Subtle' : 'Off';
  return value.charAt(0).toUpperCase() + value.slice(1);
};
</script>

<template>
  <div class="appearance-tools print:hidden" :class="{ 'navigation-expanded': mobileNavigationExpanded }" @keydown.esc.stop.prevent="close">
    <button
      id="appearance-toggle"
      ref="trigger"
      type="button"
      class="appearance-trigger"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="open = !open"
    >
      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M4 2v16M10 2v16M16 2v16M1 7h6M7 13h6M13 6h6" /></svg>
      Tweak
    </button>
    <section v-if="open" :id="panelId" ref="panel" class="appearance-panel" aria-labelledby="appearance-title" tabindex="-1">
      <header class="appearance-header">
        <div><h2 id="appearance-title">Customize</h2><p>Saved in this browser.</p></div>
        <button type="button" class="appearance-close" aria-label="Close customization" @click="close">×</button>
      </header>
      <div class="appearance-content">
        <details v-for="group in GROUPS" :key="group.name" class="settings-group" :open="group.open">
          <summary>{{ group.name }}</summary>
          <div class="group-controls">
            <label v-for="[key, label] in group.ranges" :key="key" class="range-control" :for="`tweak-${key}`">
              <span>{{ label }}</span><output :for="`tweak-${key}`">{{ state[key] }}{{ RANGES[key][3] }}</output>
              <input :id="`tweak-${key}`" v-model.number="state[key]" type="range" :min="RANGES[key][0]" :max="RANGES[key][1]" :step="RANGES[key][2]">
            </label>
            <label v-for="[key, label] in group.selects" :key="key" class="select-control" :for="`tweak-${key}`">
              <span>{{ label }}</span>
              <select :id="`tweak-${key}`" v-model="state[key]"><option v-for="option in CHOICES[key]" :key="option" :value="option">{{ choiceLabel(key, option) }}</option></select>
            </label>
            <fieldset v-if="group.name === 'Color'" class="accent-control" :disabled="isNeutralTheme">
              <legend>Accent <span>{{ colorName(state.color) }}</span></legend>
              <div class="palette-options">
                <button v-for="(palette, name) in PALETTES" :key="name" type="button" class="palette-option" :style="{ '--swatch': palette[500] }" :title="colorName(name)" :aria-label="colorName(name)" :aria-pressed="state.color === name" @click="state.color = name"><span v-if="state.color === name" aria-hidden="true">✓</span></button>
              </div>
            </fieldset>
            <p v-if="group.name === 'Color' && isNeutralTheme" class="control-note">Neutral colors throughout. Your accent choice is saved for Light and Dark.</p>
            <p v-if="group.name === 'Appearance'" class="control-note">True black uses a pure black background.</p>
            <p v-if="group.name === 'Motion'" class="control-note">Your device’s reduced-motion preference is always respected.</p>
          </div>
        </details>
        <details class="settings-group settings-transfer">
          <summary>Save / restore settings</summary>
          <div class="group-controls">
            <label for="tweak-settings-json">Settings JSON</label>
            <textarea id="tweak-settings-json" v-model="settingsText" rows="5" spellcheck="false" placeholder="Generate settings to copy, or paste saved settings here." />
            <div class="transfer-actions"><button type="button" @click="exportSettings">Generate JSON</button><button type="button" @click="importSettings">Apply JSON</button></div>
          </div>
        </details>
      </div>
      <footer class="appearance-footer">
        <span>{{ state.width }}% width · {{ state.bodySize }}px text</span>
        <button type="button" @click="reset">Reset all</button>
      </footer>
      <p v-if="settingsMessage" class="settings-message" role="status">{{ settingsMessage }}</p>
    </section>
  </div>
</template>

<style scoped>
.appearance-tools { position: fixed; bottom: max(18px, env(safe-area-inset-bottom)); right: max(18px, env(safe-area-inset-right)); z-index: 60; font-family: "DM Sans", system-ui, sans-serif; font-size: 13px; line-height: 1.4; }
.appearance-trigger { display: flex; align-items: center; justify-content: center; gap: 7px; min-height: 38px; padding: 0 13px; border: 1px solid var(--line); border-radius: 999px; background: var(--surface); color: var(--ink); box-shadow: 0 2px 9px #172b4d12; font-size: 12px; font-weight: 500; }
.appearance-trigger:hover { color: rgb(var(--primary-600)); border-color: currentColor; }
.appearance-panel { position: absolute; bottom: 48px; right: 0; display: flex; flex-direction: column; width: min(350px, calc(100vw - 36px)); max-height: min(700px, calc(100dvh - 94px - env(safe-area-inset-bottom))); border: 1px solid var(--line); border-radius: 14px; background: var(--surface); color: var(--ink); box-shadow: 0 8px 30px #172b4d1f; overflow: hidden; outline: none; text-align: left; }
.appearance-header { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px 12px; border-bottom: 1px solid var(--line); }
.appearance-header h2 { margin: 0; font-family: "DM Sans", system-ui, sans-serif; font-size: 16px; font-style: normal; font-weight: 600; line-height: 1.3; letter-spacing: 0; text-transform: none; }
.appearance-header p { margin-top: 3px; color: var(--muted); font-size: 11px; }
.appearance-close { display: grid; place-items: center; min-width: 32px; min-height: 32px; border: 1px solid transparent; border-radius: 4px; color: var(--muted); font-size: 23px; font-weight: 400; }
.appearance-close:hover { border-color: var(--line); color: var(--ink); }
.appearance-content { min-height: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-gutter: stable; padding: 0 16px; }
.settings-group { border-bottom: 1px solid var(--line); }
.settings-group:last-child { border-bottom: 0; }
.settings-group summary { cursor: pointer; padding: 13px 0; font-size: 12px; font-weight: 600; }
.group-controls { display: grid; gap: 13px; padding: 0 0 16px; }
.range-control { display: grid; grid-template-columns: 1fr auto; align-items: center; column-gap: 12px; font-size: 12px; }
.range-control output { color: var(--muted); font-variant-numeric: tabular-nums; font-size: 11px; }
.range-control input { grid-column: 1 / -1; width: 100%; min-width: 0; height: 22px; margin: 2px 0 0; padding: 0; accent-color: rgb(var(--primary-500)); cursor: pointer; }
.select-control { display: grid; grid-template-columns: minmax(95px, 1fr) minmax(0, 145px); align-items: center; gap: 12px; font-size: 12px; }
.select-control select { width: 100%; min-width: 0; min-height: 32px; padding: 5px 25px 5px 8px; border: 1px solid var(--line); border-radius: 4px; background-color: var(--surface); color: var(--ink); font-family: inherit; font-size: 12px; }
.accent-control { min-width: 0; margin: 0; }
.accent-control:disabled .palette-options { opacity: .45; filter: grayscale(1); }
.accent-control legend { padding: 0; margin-bottom: 10px; font-size: 12px; }
.accent-control legend span { margin-left: 8px; color: var(--muted); font-size: 11px; }
.palette-options { display: grid; grid-template-columns: repeat(9, minmax(0, 1fr)); gap: 5px; }
.palette-option { display: grid; place-items: center; width: 100%; aspect-ratio: 1; min-height: 24px; border: 3px solid var(--surface); border-radius: 50%; background: var(--swatch); color: white; box-shadow: 0 0 0 1px transparent; font-size: 11px; }
.palette-option[aria-pressed='true'] { box-shadow: 0 0 0 1.5px var(--ink); }
.palette-option:hover { box-shadow: 0 0 0 1px var(--muted); }
.control-note { color: var(--muted); font-size: 11px; line-height: 1.5; }
.settings-transfer label { font-size: 12px; }
.settings-transfer textarea { width: 100%; min-width: 0; max-width: 100%; min-height: 80px; resize: vertical; padding: 8px; border: 1px solid var(--line); border-radius: 4px; background: var(--surface); color: var(--ink); font-family: ui-monospace, monospace; font-size: 11px; }
.transfer-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.transfer-actions button, .appearance-footer button { min-height: 32px; padding: 5px 9px; border: 1px solid var(--line); border-radius: 4px; background: var(--surface); color: var(--ink); font-size: 11px; }
.transfer-actions button:hover, .appearance-footer button:hover { border-color: currentColor; color: rgb(var(--primary-600)); }
.appearance-footer { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 16px; border-top: 1px solid var(--line); }
.appearance-footer span { color: var(--muted); font-size: 11px; }
.settings-message { flex: none; padding: 0 16px 10px; color: var(--muted); font-size: 11px; }
.appearance-tools :is(button, input, select, summary, textarea):focus-visible { outline: 2px solid rgb(var(--primary-500)); outline-offset: 3px; }
:global(.dark) .appearance-trigger:hover, :global(.dark) .transfer-actions button:hover, :global(.dark) .appearance-footer button:hover { color: rgb(var(--primary-300)); }
@media (max-width: 767px) { .appearance-tools.navigation-expanded { display: none; } }
@media (max-width: 380px) { .appearance-tools { right: 12px; bottom: max(12px, env(safe-area-inset-bottom)); } .appearance-panel { width: calc(100vw - 24px); max-height: calc(100dvh - 84px - env(safe-area-inset-bottom)); } .appearance-header, .appearance-footer { padding-left: 13px; padding-right: 13px; } .appearance-content { padding: 0 13px; } }
</style>
