// Local previews do not need the production analytics worker/iframe bridge.
const enableAnalytics = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  app: {
    // ui: {
    //   global: true,
    // },
    routes: {
      '/blog/:id': {
        component: 'pages/blog/[id].vue',
      },
    },
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'author', content: 'Baimam Boukar JJ (@baimamboukar)' },
        { name: 'robots', content: 'index, follow' },
      ],
      link: [
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
        {
          rel: 'manifest',
          href: '/site.webmanifest',
        },
      ],
      script: enableAnalytics ? [
        {
          type: 'text/partytown',
          src: 'https://measure.baimamboukar.dev/',
          async: true,
          'data-website-id': '1e0e9daa-a25b-4943-af4e-68c91b2d3c72',
        },
      ] : [],
    },
    pageTransition: false,
    layoutTransition: false,
  },

  components: [{ path: '~/components', pathPrefix: false }],

  content: {
    contentHead: false,
    documentDriven: false,
    highlight: {
      theme: 'github-dark',
      preload: ['py'],
    },
    ignores: ['drafts', 'template.md', '/drafts/', '\\.yml$'],
    markdown: {
      toc: { depth: 1, searchDepth: 2 },
    },
  },

  ui: {
    primary: 'blue',
    gray: 'cool',
  },

  colorMode: {
    disableTransition: false,
    preference: 'light',
  },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    ...(enableAnalytics ? ['@nuxtjs/partytown'] : []),
    '@nuxtjs/turnstile',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-icon',
  ],

  icon: {
    serverBundle: 'remote',
  },

  routeRules: {
    // These pages preserve search and view queries when redirecting to Work.
    '/research': { prerender: false },
    '/projects': { prerender: false },
    '/projects/more': { prerender: false },
    '/research/phoenix-safe-end-to-end-codebase-refactoring-via-multi-agent-llms': {
      redirect: { to: '/research/phoenix-safe-github-issue-resolution-via-multi-agent-llms', statusCode: 301 },
    },
    '/': { prerender: true },
    '/**': { prerender: true },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      ignore: ['/_vercel/image'],
    },
  },

  runtimeConfig: {
    // raindropToken: process.env.RAINDROP_TOKEN,
    // raindropCollectionId: process.env.RAINDROP_COLLECTION_ID,
    resendApiKey: process.env.RESEND_API_KEY,
    resendFrom: process.env.RESEND_FROM,
    resendTo: process.env.RESEND_TO,
    // turnstile: { secretKey: process.env.TURNSTILE_SECRET_KEY },
  },

  // tailwindcss: {
  //   config: {
  //     mode: 'jit',
  //     darkMode: 'class',
  //     content: [
  //       './app.vue',
  //       './components/**/*.vue',
  //       './layouts/**/*.vue',
  //       './pages/**/*.vue',
  //     ],
  //     plugins: [tailwindTypography],
  //   },
  // },

  telemetry: false,

  turnstile: {
    siteKey: '0x4AAAAAAABlDwSHN3HVmFWH',
  },

  // Serve shared CSS once as a cacheable stylesheet, rather than inlining it on every page.
  features: { inlineStyles: false },
  experimental: { appManifest: false },
  compatibilityDate: '2025-01-09',

  devtools: {
    enabled: false,
  },
})
