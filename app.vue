<script setup>
  import "@fontsource/inter/400.css";
  import "@fontsource/inter/500.css";
  import "@fontsource/inter/600.css";
  import "@fontsource/inter/700.css";
  import "@fontsource/jetbrains-mono/400.css";
  import "@fontsource/jetbrains-mono/500.css";
  import "@fontsource/jetbrains-mono/600.css";
  import "@fontsource/jetbrains-mono/700.css";
</script>

<template>
  <!-- Main Layout Container -->
  <div class="w-[90%] md:w-[82%] max-w-site mx-auto min-w-[20rem] md:min-h-screen pt-4 pb-6 flex items-start flex-col md:flex-row">
    <!-- Skip Navigation Link -->
    <a
      href="#main-content"
      class="flex items-center justify-center bg-sky-600 h-8 absolute top-0 left-1/2 -translate-x-1/2 py-2 px-4 rounded-md mx-auto z-50 transform duration-300 -translate-y-[125%] opacity-0 focus-visible:translate-y-2 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-50 text-zinc-100"
      >Skip to Main Content</a
    >

    <!-- Sidebar -->
    <app-side-bar />

    <!-- Main Content -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>

  <!-- Mobile Navigation -->
  <app-nav
    class="flex ring-1 ring-inset ring-blue-500 md:hidden after:shadow-2xl"
  />

  <!-- TEMPORARY design tweak panel -->
  <ClientOnly>
    <TweakPanel />
  </ClientOnly>
</template>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer utilities {
    /* Uniform Card Style */
    .card-style {
      @apply border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-700/50 bg-gray-50;
    }

    .global-focus {
      @apply outline-none ring-2 ring-offset-0 ring-blue-400 ring-opacity-75;
    }

    .icon-link {
      @apply w-8 h-8 flex items-center justify-center mx-1 rounded-full;
      @apply [&>svg]:w-5 [&>svg]:h-5;
    }
  }

  /* TWEAK PANEL defaults (sky palette) — the panel overrides these at runtime.
     When a theme is chosen, hardcode the winners and delete TweakPanel.vue. */
  :root {
    --primary-50: 240 249 255;
    --primary-100: 224 242 254;
    --primary-200: 186 230 253;
    --primary-300: 125 211 252;
    --primary-400: 56 189 248;
    --primary-500: 14 165 233;
    --primary-600: 2 132 199;
    --primary-700: 3 105 161;
    --primary-800: 7 89 133;
    --primary-900: 12 74 110;
    --primary-950: 8 47 73;
    --font-heading: "Inter";
    --font-body: "Inter";
  }

  html {
    @apply m-0 p-0;
    font-family: var(--font-body), "Inter", sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading), "Inter", sans-serif;
  }

  /* Tweak panel accent styles */
  html.tw-italic-hero .hero-intro {
    font-style: italic;
  }
  html.tw-underline-gradient h2 {
    position: relative;
    width: fit-content;
  }
  html.tw-underline-gradient h2::after {
    content: "";
    position: absolute;
    left: 0;
    right: -0.5rem;
    bottom: -5px;
    height: 3px;
    border-radius: 9999px;
    background: linear-gradient(to right, rgb(var(--primary-500)), transparent);
  }
  html.tw-underline-wavy h2 {
    text-decoration: underline wavy rgb(var(--primary-400));
    text-decoration-thickness: 2px;
    text-underline-offset: 7px;
  }
  html.tw-underline-highlight h2 {
    width: fit-content;
    background: linear-gradient(transparent 62%, rgb(var(--primary-500) / 0.3) 62%);
  }

  /* Heading weight */
  html.tw-hw-600 :is(h1, h2, h3, h4) { font-weight: 600 !important; }
  html.tw-hw-700 :is(h1, h2, h3, h4) { font-weight: 700 !important; }
  html.tw-hw-800 :is(h1, h2, h3, h4) { font-weight: 800 !important; }

  /* Heading letter-spacing */
  html.tw-track-tight :is(h1, h2, h3) { letter-spacing: -0.03em; }
  html.tw-track-wide :is(h2, h3) { letter-spacing: 0.05em; }

  /* Uppercase section titles */
  html.tw-caps-sections h2 {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 1.05rem;
  }

  /* Corner radius */
  html.tw-radius-sharp :is(.rounded-md, .rounded-lg, .rounded-xl, .rounded-2xl) {
    border-radius: 0.25rem !important;
  }
  html.tw-radius-round .rounded-md { border-radius: 0.625rem !important; }
  html.tw-radius-round .rounded-lg { border-radius: 0.875rem !important; }
  html.tw-radius-round .rounded-xl { border-radius: 1.25rem !important; }
  html.tw-radius-round .rounded-2xl { border-radius: 1.75rem !important; }

  /* Page background (light mode only) */
  html.tw-bg-white:not(.dark) :is(body, main) { background-color: #ffffff; }
  html.tw-bg-warm:not(.dark) :is(body, main) { background-color: #faf8f4; }
  html.tw-bg-tint:not(.dark) :is(body, main) { background-color: rgb(var(--primary-50)); }

  body {
    /* Keep background and text colors on body */
    @apply bg-gray-50 dark:bg-zinc-900 md:dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 md:overflow-y-auto;
  }

  main {
    @apply w-full rounded-xl pt-6 md:px-10 py-4 pb-12 bg-transparent md:bg-gray-50 md:dark:bg-zinc-900/40 font-normal overflow-x-visible -z-0;
  }

  span.highlight,
  span.subtle-highlight {
    @apply relative text-zinc-700 dark:text-zinc-200 font-medium;
  }

  span.highlight::after {
    @apply w-full h-px content-[''] rounded absolute -bottom-[1.5px] -left-0 -right-0 bg-gradient-to-r from-blue-400 to-lime-400 -z-10 transition-all duration-150 opacity-75 hover:opacity-100;
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: all 150ms;
  }
  .slide-enter-from,
  .slide-leave-to {
    opacity: 0;
    transform: translateY(1%);
  }
</style>