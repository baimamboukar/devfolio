<script setup>
// Local preview controls. These settings stay in this browser.
const PALETTES = {
  meta:    { 50:'#eef5ff',100:'#dbeaff',200:'#b8d5ff',300:'#89b6ff',400:'#5193ff',500:'#0866ff',600:'#0054df',700:'#0044b8',800:'#00378f',900:'#002b70',950:'#001b47' },
  sky:     { 50:'#f0f9ff',100:'#e0f2fe',200:'#bae6fd',300:'#7dd3fc',400:'#38bdf8',500:'#0ea5e9',600:'#0284c7',700:'#0369a1',800:'#075985',900:'#0c4a6e',950:'#082f49' },
  blue:    { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a',950:'#172554' },
  indigo:  { 50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',400:'#818cf8',500:'#6366f1',600:'#4f46e5',700:'#4338ca',800:'#3730a3',900:'#312e81',950:'#1e1b4b' },
  violet:  { 50:'#f5f3ff',100:'#ede9fe',200:'#ddd6fe',300:'#c4b5fd',400:'#a78bfa',500:'#8b5cf6',600:'#7c3aed',700:'#6d28d9',800:'#5b21b6',900:'#4c1d95',950:'#2e1065' },
  purple:  { 50:'#faf5ff',100:'#f3e8ff',200:'#e9d5ff',300:'#d8b4fe',400:'#c084fc',500:'#a855f7',600:'#9333ea',700:'#7e22ce',800:'#6b21a8',900:'#581c87',950:'#3b0764' },
  fuchsia: { 50:'#fdf4ff',100:'#fae8ff',200:'#f5d0fe',300:'#f0abfc',400:'#e879f9',500:'#d946ef',600:'#c026d3',700:'#a21caf',800:'#86198f',900:'#701a75',950:'#4a044e' },
  pink:    { 50:'#fdf2f8',100:'#fce7f3',200:'#fbcfe8',300:'#f9a8d4',400:'#f472b6',500:'#ec4899',600:'#db2777',700:'#be185d',800:'#9d174d',900:'#831843',950:'#500724' },
  rose:    { 50:'#fff1f2',100:'#ffe4e6',200:'#fecdd3',300:'#fda4af',400:'#fb7185',500:'#f43f5e',600:'#e11d48',700:'#be123c',800:'#9f1239',900:'#881337',950:'#4c0519' },
  red:     { 50:'#fef2f2',100:'#fee2e2',200:'#fecaca',300:'#fca5a5',400:'#f87171',500:'#ef4444',600:'#dc2626',700:'#b91c1c',800:'#991b1b',900:'#7f1d1d',950:'#450a0a' },
  orange:  { 50:'#fff7ed',100:'#ffedd5',200:'#fed7aa',300:'#fdba74',400:'#fb923c',500:'#f97316',600:'#ea580c',700:'#c2410c',800:'#9a3412',900:'#7c2d12',950:'#431407' },
  amber:   { 50:'#fffbeb',100:'#fef3c7',200:'#fde68a',300:'#fcd34d',400:'#fbbf24',500:'#f59e0b',600:'#d97706',700:'#b45309',800:'#92400e',900:'#78350f',950:'#451a03' },
  emerald: { 50:'#ecfdf5',100:'#d1fae5',200:'#a7f3d0',300:'#6ee7b7',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857',800:'#065f46',900:'#064e3b',950:'#022c22' },
  teal:    { 50:'#f0fdfa',100:'#ccfbf1',200:'#99f6e4',300:'#5eead4',400:'#2dd4bf',500:'#14b8a6',600:'#0d9488',700:'#0f766e',800:'#115e59',900:'#134e4a',950:'#042f2e' },
  cyan:    { 50:'#ecfeff',100:'#cffafe',200:'#a5f3fc',300:'#67e8f9',400:'#22d3ee',500:'#06b6d4',600:'#0891b2',700:'#0e7490',800:'#155e75',900:'#164e63',950:'#083344' },
  lime:    { 50:'#f7fee7',100:'#ecfccb',200:'#d9f99d',300:'#bef264',400:'#a3e635',500:'#84cc16',600:'#65a30d',700:'#4d7c0f',800:'#3f6212',900:'#365314',950:'#1a2e05' },
  niagara: { 50:'#f1fcf9',100:'#d0f7ee',200:'#a1eedd',300:'#6adec9',400:'#3bc6b2',500:'#22aa98',600:'#1b998b',700:'#186d65',800:'#175852',900:'#184945',950:'#082b2a' },
  slate:   { 50:'#f8fafc',100:'#f1f5f9',200:'#e2e8f0',300:'#cbd5e1',400:'#94a3b8',500:'#64748b',600:'#475569',700:'#334155',800:'#1e293b',900:'#0f172a',950:'#020617' },
};


const STORAGE_KEY = 'tweak-config-v7';
const LEGACY_KEYS = ['tweak-config-v6', 'tweak-config-v5', 'tweak-config-v4', 'tweak-config-v3', 'tweak-config-v2'];
const DEFAULTS = {
  width: 69, bodySize: 16, nameSize: 36, sectionSize: 24, paperSize: 18,
  leading: 1.6, sectionGap: 30, rowGap: 14, portraitSize: 160,
  heading: 'DM Sans', body: 'DM Sans', headingWeight: 700, corners: 12,
  color: 'meta', theme: 'light', portrait: 'show', summaries: 'show',
  authors: 'show', updates: 'show', links: 'show', dividers: 'show',
  motion: 'subtle', headingStyle: 'normal', sectionCase: 'normal',
  linkStyle: 'hover', surface: 'white', projectSurface: 'neutral', textAlign: 'left',
  navPosition: 'sticky', navAlign: 'center', navIndicator: 'pill', navDensity: 'compact',
  // Retain retired navigation keys for saved-settings compatibility; their controls stay hidden.
  navWriting: 'show', navTalks: 'show', navPhotos: 'hide', navNews: 'hide', navCv: 'hide', navCustomize: 'show', navBrand: 'home',
};
const FONT_STACKS = {
  Fraunces: '"Fraunces", Georgia, serif',
  'DM Sans': '"DM Sans", system-ui, sans-serif',
  Georgia: 'Georgia, serif',
  'System sans': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  'System mono': 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};
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
const isNeutralTheme = computed(() => ['black', 'monochrome'].includes(state.theme));
const resolvedColorMode = () => state.theme === 'black' ? 'dark' : state.theme === 'monochrome' ? 'light' : state.theme;
const NEUTRAL_PALETTE = { 50:'#fafafa',100:'#f0f0f0',200:'#dedede',300:'#c4c4c4',400:'#9a9a9a',500:'#404040',600:'#303030',700:'#242424',800:'#181818',900:'#101010',950:'#080808' };
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
const hexToTriplet = (hex) => {
  const value = parseInt(hex.slice(1), 16);
  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`;
};
const apply = () => {
  const root = document.documentElement;
  // Remove previous preview experiments before applying the current settings.
  Array.from(root.classList).filter(name => name.startsWith('tw-')).forEach(name => root.classList.remove(name));
  root.style.removeProperty('font-size');
  const variables = {
    '--site-width': `${state.width}%`, '--body-size': `${state.bodySize}px`,
    '--name-size': `${state.nameSize}px`, '--section-size': `${state.sectionSize}px`,
    '--paper-size': `${state.paperSize}px`, '--content-leading': String(state.leading),
    '--section-gap': `${state.sectionGap}px`, '--row-gap': `${state.rowGap}px`,
    '--portrait-size': `${state.portraitSize}px`, '--heading-weight': String(state.headingWeight),
    '--corner-radius': `${state.corners}px`, '--font-heading': FONT_STACKS[state.heading],
    '--font-body': FONT_STACKS[state.body],
    '--project-card-surface': state.projectSurface === 'tinted' ? 'var(--study-surface)' : 'var(--surface)',
  };
  for (const [name, value] of Object.entries(variables)) root.style.setProperty(name, value);
  const palette = isNeutralTheme.value ? NEUTRAL_PALETTE : PALETTES[state.color];
  for (const [shade, hex] of Object.entries(palette)) root.style.setProperty(`--primary-${shade}`, hexToTriplet(hex));
  const attributes = {
    siteTheme: state.theme, portrait: state.portrait, paperSummaries: state.summaries,
    paperAuthors: state.authors, homeUpdates: state.updates, homeLinks: state.links,
    dividers: state.dividers, motion: state.motion, headingStyle: state.headingStyle,
    sectionCase: state.sectionCase, linkStyle: state.linkStyle, surface: state.surface,
    projectSurface: state.projectSurface, textAlign: state.textAlign, navPosition: state.navPosition, navAlign: state.navAlign,
    navIndicator: state.navIndicator, navDensity: state.navDensity,
  };
  for (const [name, value] of Object.entries(attributes)) root.dataset[name] = value;
  navigationPreferences.value = Object.fromEntries(Object.keys(DEFAULTS).filter(key => key.startsWith('nav')).map(key => [key.slice(3).toLowerCase(), state[key]]));
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
