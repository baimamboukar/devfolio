<script setup>
useHead({
  titleTemplate: "%s · Baimam Boukar",
});

const route = useRoute();

const serverMeta = {
  ogImage: "/og-image.png",
  twitterImage: "/og-image.png",
  ogType: "website",
  ogLocale: "en_US",
  twitterCard: "summary",
  twitterCreator: "@baimamboukar",
};

useSeoMeta({
  title: () => route.meta.title,
  description: () => route.meta.description,
  ogTitle: () => `${route.meta.title} · Baimam Boukar`,
  twitterTitle: () => `${route.meta.title} · Baimam Boukar`,
  ogDescription: () => route.meta.description,
  twitterDescription: () => route.meta.description,
  ogUrl: () => `https://baimamboukar.dev${route.path}`,
  ...serverMeta,
});
</script>

<!-- Default Layout -->
<template>
  <main id="main-content">
    <slot />
  </main>
</template>
