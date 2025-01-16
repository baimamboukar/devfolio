<script setup>
  useHead({
    titleTemplate: "%s · Baimam Boukar JJ",
  });

  const route = useRoute();

  const serverMeta = {
    ogImage: "/og-image.jpg",
    twitterImage: "/og-image.jpg",
    ogType: "website",
    ogLocale: "en_US",
    twitterCard: "summary",
    twitterCreator: "@baimamboukar",
  };

  useSeoMeta({
    title: () => route.meta.title,
    description: () => route.meta.description,
    ogTitle: () => `${route.meta.title} · Baimam Boukar JJ`,
    twitterTitle: () => `${route.meta.title} · Baimam Boukar JJ`,
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
