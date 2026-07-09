<script setup>
// TEMPORARY design tweak panel — delete this component (and its plumbing in
// app.vue + tailwind.config.js) once fonts/colors are chosen.

const FONTS = [
  // Sans / grotesque
  { name: 'Inter', gf: 'Inter:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Onest', gf: 'Onest:wght@400;500;600;700' },
  { name: 'Plus Jakarta Sans', gf: 'Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Space Grotesk', gf: 'Space+Grotesk:wght@400;500;600;700' },
  { name: 'Sora', gf: 'Sora:wght@400;500;600;700' },
  { name: 'Manrope', gf: 'Manrope:wght@400;500;600;700' },
  { name: 'Outfit', gf: 'Outfit:wght@400;500;600;700' },
  { name: 'DM Sans', gf: 'DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Work Sans', gf: 'Work+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Figtree', gf: 'Figtree:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Albert Sans', gf: 'Albert+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Hanken Grotesk', gf: 'Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Public Sans', gf: 'Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Schibsted Grotesk', gf: 'Schibsted+Grotesk:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Bricolage Grotesque', gf: 'Bricolage+Grotesque:wght@400;500;600;700' },
  { name: 'Instrument Sans', gf: 'Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Geist', gf: 'Geist:wght@400;500;600;700' },
  { name: 'IBM Plex Sans', gf: 'IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Libre Franklin', gf: 'Libre+Franklin:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  // Serif / editorial
  { name: 'Fraunces', gf: 'Fraunces:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Source Serif 4', gf: 'Source+Serif+4:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Newsreader', gf: 'Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Lora', gf: 'Lora:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Spectral', gf: 'Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Crimson Pro', gf: 'Crimson+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'EB Garamond', gf: 'EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Playfair Display', gf: 'Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Instrument Serif', gf: 'Instrument+Serif:ital@0;1' },
];

const PALETTES = {
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

const UNDERLINES = ['none', 'gradient', 'wavy', 'highlight'];
const WEIGHTS = ['default', '600', '700', '800'];
const TRACKINGS = ['default', 'tight', 'wide'];
const RADII = ['sharp', 'default', 'round'];
const BACKGROUNDS = ['default', 'white', 'warm', 'tint'];
const TEXT_SCALES = { S: '15px', M: '', L: '17.5px' };

const DEFAULTS = {
  heading: 'Inter',
  body: 'Inter',
  color: 'sky',
  italicHero: false,
  underline: 'none',
  weight: 'default',
  tracking: 'default',
  capsSections: false,
  radius: 'default',
  background: 'default',
  textScale: 'M',
};

// Load every candidate font (browsers only download faces actually rendered)
useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    ...FONTS.map((f) => ({
      rel: 'stylesheet',
      href: `https://fonts.googleapis.com/css2?family=${f.gf}&display=swap`,
    })),
  ],
});

const open = ref(false);
const state = reactive({ ...DEFAULTS });

const hexToTriplet = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

const apply = () => {
  const root = document.documentElement;
  root.style.setProperty('--font-heading', `"${state.heading}"`);
  root.style.setProperty('--font-body', `"${state.body}"`);
  const palette = PALETTES[state.color];
  for (const [shade, hex] of Object.entries(palette)) {
    root.style.setProperty(`--primary-${shade}`, hexToTriplet(hex));
  }
  root.classList.toggle('tw-italic-hero', state.italicHero);
  root.classList.toggle('tw-caps-sections', state.capsSections);
  UNDERLINES.forEach((u) => root.classList.toggle(`tw-underline-${u}`, state.underline === u));
  WEIGHTS.forEach((w) => root.classList.toggle(`tw-hw-${w}`, state.weight === w));
  TRACKINGS.forEach((t) => root.classList.toggle(`tw-track-${t}`, state.tracking === t));
  RADII.forEach((r) => root.classList.toggle(`tw-radius-${r}`, state.radius === r));
  BACKGROUNDS.forEach((b) => root.classList.toggle(`tw-bg-${b}`, state.background === b));
  root.style.fontSize = TEXT_SCALES[state.textScale] || '';
  localStorage.setItem('tweak-config', JSON.stringify(state));
};

const reset = () => {
  Object.assign(state, DEFAULTS);
  localStorage.removeItem('tweak-config');
};

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem('tweak-config') || 'null');
    if (saved) Object.assign(state, { ...DEFAULTS, ...saved });
  } catch {}
  apply();
  watch(state, apply);
});

const summary = computed(() => {
  const extras = Object.entries(state)
    .filter(([k, v]) => !['heading', 'body', 'color'].includes(k) && v !== DEFAULTS[k])
    .map(([k, v]) => (v === true ? k : `${k}:${v}`));
  return `${state.heading} / ${state.body} / ${state.color}` + (extras.length ? ' / ' + extras.join(' / ') : '');
});
</script>

<template>
  <div class="fixed bottom-4 left-4 z-[60] print:hidden">
    <!-- Toggle button -->
    <button
      @click="open = !open"
      class="flex items-center gap-2 px-3 h-10 rounded-full shadow-lg bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-sm font-semibold hover:scale-105 transition-transform"
      title="Design tweak panel (temporary)"
    >
      <Icon name="heroicons:paint-brush-20-solid" class="w-4 h-4" />
      <span v-if="!open">Tweak</span>
      <span v-else>Close</span>
    </button>

    <!-- Panel -->
    <div
      v-if="open"
      class="absolute bottom-12 left-0 w-[22rem] max-h-[75vh] overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xl p-4 space-y-5"
    >
      <p class="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
        Temporary design panel — current: <span class="text-zinc-700 dark:text-zinc-200 normal-case">{{ summary }}</span>
      </p>

      <!-- Primary color -->
      <div>
        <h4 class="text-xs font-bold mb-2 text-zinc-600 dark:text-zinc-300 uppercase tracking-wide">Primary color</h4>
        <div class="grid grid-cols-9 gap-2">
          <button
            v-for="(palette, name) in PALETTES"
            :key="name"
            @click="state.color = name"
            :title="name"
            class="w-7 h-7 rounded-full border border-black/10 transition-transform hover:scale-110"
            :class="state.color === name ? 'ring-2 ring-offset-2 ring-zinc-500 dark:ring-offset-zinc-900' : ''"
            :style="{ backgroundColor: palette[500] }"
          />
        </div>
      </div>

      <!-- Heading font -->
      <div>
        <h4 class="text-xs font-bold mb-2 text-zinc-600 dark:text-zinc-300 uppercase tracking-wide">Heading font</h4>
        <div class="max-h-44 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700 divide-y divide-zinc-100 dark:divide-zinc-800">
          <button
            v-for="f in FONTS"
            :key="'h-' + f.name"
            @click="state.heading = f.name"
            class="w-full text-left px-3 py-1.5 text-base hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between"
            :style="{ fontFamily: `'${f.name}'` }"
          >
            {{ f.name }}
            <Icon v-if="state.heading === f.name" name="heroicons:check-20-solid" class="w-4 h-4 text-emerald-500 shrink-0" />
          </button>
        </div>
      </div>

      <!-- Body font -->
      <div>
        <h4 class="text-xs font-bold mb-2 text-zinc-600 dark:text-zinc-300 uppercase tracking-wide">Body font</h4>
        <div class="max-h-44 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700 divide-y divide-zinc-100 dark:divide-zinc-800">
          <button
            v-for="f in FONTS"
            :key="'b-' + f.name"
            @click="state.body = f.name"
            class="w-full text-left px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between"
            :style="{ fontFamily: `'${f.name}'` }"
          >
            {{ f.name }} — why methods fail to generalize
            <Icon v-if="state.body === f.name" name="heroicons:check-20-solid" class="w-4 h-4 text-emerald-500 shrink-0" />
          </button>
        </div>
      </div>

      <!-- Typography -->
      <div>
        <h4 class="text-xs font-bold mb-2 text-zinc-600 dark:text-zinc-300 uppercase tracking-wide">Typography</h4>
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-xs">
            <span class="w-24 text-zinc-500 shrink-0">Text size</span>
            <button
              v-for="(px, label) in TEXT_SCALES" :key="label" @click="state.textScale = label"
              class="px-2.5 py-1 rounded-full border"
              :class="state.textScale === label ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent' : 'border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300'"
            >{{ label }}</button>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <span class="w-24 text-zinc-500 shrink-0">Heading weight</span>
            <button
              v-for="w in WEIGHTS" :key="w" @click="state.weight = w"
              class="px-2.5 py-1 rounded-full border capitalize"
              :class="state.weight === w ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent' : 'border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300'"
            >{{ w }}</button>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <span class="w-24 text-zinc-500 shrink-0">Tracking</span>
            <button
              v-for="t in TRACKINGS" :key="t" @click="state.tracking = t"
              class="px-2.5 py-1 rounded-full border capitalize"
              :class="state.tracking === t ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent' : 'border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300'"
            >{{ t }}</button>
          </div>
        </div>
      </div>

      <!-- Accents -->
      <div>
        <h4 class="text-xs font-bold mb-2 text-zinc-600 dark:text-zinc-300 uppercase tracking-wide">Accents</h4>
        <label class="flex items-center gap-2 text-sm mb-2 cursor-pointer">
          <input type="checkbox" v-model="state.italicHero" class="accent-zinc-700" />
          Italic hero intro
        </label>
        <label class="flex items-center gap-2 text-sm mb-2 cursor-pointer">
          <input type="checkbox" v-model="state.capsSections" class="accent-zinc-700" />
          Uppercase section titles
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="u in UNDERLINES"
            :key="u"
            @click="state.underline = u"
            class="px-2.5 py-1 rounded-full text-xs border capitalize"
            :class="state.underline === u
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent'
              : 'border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300'"
          >
            {{ u }} underline
          </button>
        </div>
      </div>

      <!-- Shape & background -->
      <div>
        <h4 class="text-xs font-bold mb-2 text-zinc-600 dark:text-zinc-300 uppercase tracking-wide">Shape &amp; background</h4>
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-xs">
            <span class="w-24 text-zinc-500 shrink-0">Corners</span>
            <button
              v-for="r in RADII" :key="r" @click="state.radius = r"
              class="px-2.5 py-1 rounded-full border capitalize"
              :class="state.radius === r ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent' : 'border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300'"
            >{{ r }}</button>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <span class="w-24 text-zinc-500 shrink-0">Background</span>
            <button
              v-for="b in BACKGROUNDS" :key="b" @click="state.background = b"
              class="px-2.5 py-1 rounded-full border capitalize"
              :class="state.background === b ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent' : 'border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300'"
            >{{ b }}</button>
          </div>
          <p class="text-[10px] text-zinc-400">Background applies in light mode only.</p>
        </div>
      </div>

      <button
        @click="reset"
        class="w-full py-2 rounded-lg text-sm font-semibold border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        Reset to defaults
      </button>
    </div>
  </div>
</template>
