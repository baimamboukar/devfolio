// Site appearance settings. SITE_SETTINGS is what every visitor sees; the
// Tweak panel (local development only) starts from these values.
export const PALETTES = {
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

export const NEUTRAL_PALETTE = { 50:'#fafafa',100:'#f0f0f0',200:'#dedede',300:'#c4c4c4',400:'#9a9a9a',500:'#404040',600:'#303030',700:'#242424',800:'#181818',900:'#101010',950:'#080808' };

export const FONT_STACKS = {
  Fraunces: '"Fraunces", Georgia, serif',
  'DM Sans': '"DM Sans", system-ui, sans-serif',
  Georgia: 'Georgia, serif',
  'System sans': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  'System mono': 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

export const SITE_SETTINGS = Object.freeze({
  width: 68, bodySize: 15, nameSize: 26, sectionSize: 18, paperSize: 15,
  leading: 1.4, sectionGap: 16, rowGap: 8, portraitSize: 176,
  heading: 'Fraunces', body: 'DM Sans', headingWeight: 600, corners: 7,
  color: 'meta', theme: 'dark', portrait: 'show', summaries: 'hide',
  authors: 'show', updates: 'show', links: 'show', dividers: 'hide',
  motion: 'subtle', headingStyle: 'normal', sectionCase: 'normal',
  linkStyle: 'hover', surface: 'white', projectSurface: 'neutral', textAlign: 'left',
  navPosition: 'sticky', navAlign: 'left', navIndicator: 'pill', navDensity: 'comfortable',
  // Retired navigation keys stay for saved-settings compatibility; the header ignores them.
  navWriting: 'hide', navTalks: 'hide', navPhotos: 'hide', navNews: 'hide', navCv: 'hide', navCustomize: 'show', navBrand: 'home',
});

export const isNeutralTheme = theme => ['black', 'monochrome'].includes(theme);
export const resolvedColorMode = theme => theme === 'black' ? 'dark' : theme === 'monochrome' ? 'light' : theme;

const hexToTriplet = (hex) => {
  const value = parseInt(hex.slice(1), 16);
  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`;
};

// CSS custom properties applied to <html>.
export const settingsVariables = (settings) => {
  const variables = {
    '--site-width': `${settings.width}%`, '--body-size': `${settings.bodySize}px`,
    '--name-size': `${settings.nameSize}px`, '--section-size': `${settings.sectionSize}px`,
    '--paper-size': `${settings.paperSize}px`, '--content-leading': String(settings.leading),
    '--section-gap': `${settings.sectionGap}px`, '--row-gap': `${settings.rowGap}px`,
    '--portrait-size': `${settings.portraitSize}px`, '--heading-weight': String(settings.headingWeight),
    '--corner-radius': `${settings.corners}px`, '--font-heading': FONT_STACKS[settings.heading],
    '--font-body': FONT_STACKS[settings.body],
    '--project-card-surface': settings.projectSurface === 'tinted' ? 'var(--study-surface)' : 'var(--surface)',
  };
  const palette = isNeutralTheme(settings.theme) ? NEUTRAL_PALETTE : PALETTES[settings.color];
  for (const [shade, hex] of Object.entries(palette)) variables[`--primary-${shade}`] = hexToTriplet(hex);
  return variables;
};

// data-* attributes on <html>, keyed as element.dataset properties.
export const settingsDataset = settings => ({
  siteTheme: settings.theme, portrait: settings.portrait, paperSummaries: settings.summaries,
  paperAuthors: settings.authors, homeUpdates: settings.updates, homeLinks: settings.links,
  dividers: settings.dividers, motion: settings.motion, headingStyle: settings.headingStyle,
  sectionCase: settings.sectionCase, linkStyle: settings.linkStyle, surface: settings.surface,
  projectSurface: settings.projectSurface, textAlign: settings.textAlign, navPosition: settings.navPosition, navAlign: settings.navAlign,
  navIndicator: settings.navIndicator, navDensity: settings.navDensity,
});

// Server-rendered <html> attributes, so the published site never depends on the Tweak panel.
export const settingsHtmlAttrs = (settings) => {
  const attrs = {};
  for (const [name, value] of Object.entries(settingsDataset(settings))) {
    attrs[`data-${name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`] = value;
  }
  attrs.style = Object.entries(settingsVariables(settings)).map(([name, value]) => `${name}: ${value}`).join('; ');
  return attrs;
};

// Header preferences, keyed without the nav prefix (navAlign -> align).
export const navigationSettings = settings => Object.fromEntries(
  Object.keys(settings).filter(key => key.startsWith('nav')).map(key => [key.slice(3).toLowerCase(), settings[key]]),
);
