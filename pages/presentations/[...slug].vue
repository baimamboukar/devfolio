<script setup>
  definePageMeta({
    layout: "project-layout",
  });

  useHead({
    titleTemplate: "%s (Presentation) · Baimam Boukar JJ",
  });

  const route = useRoute();

  const { data } = await useAsyncData("get-presentation", () =>
    queryContent(route.path).only(["title", "description", "cover"]).findOne()
  );

  const {
    title: projectTitle,
    description: projectDescription,
    image: projectImage,
  } = data.value;

  const serverMeta = {
    ogType: "article",
    ogLocale: "en_US",
    twitterCard: "summary",
    twitterCreator: "@baimamboukar",
  };

  useSeoMeta({
    title: () => projectTitle,
    description: () => projectDescription,
    ogTitle: () => `${projectTitle} (Presentation) · Baimam Boukar JJ`,
    twitterTitle: () => `${projectTitle} (Presentation) · Baimam Boukar JJ`,
    ogDescription: () => projectDescription,
    twitterDescription: () => projectDescription,
    ogImage: () => projectImage,
    twitterImage: () => projectImage,
    ogUrl: () => `https://baimamboukar.dev${route.path}`,
    ...serverMeta,
  });
</script>

<template>
  <ContentDoc>
    <template #default="{ doc }">
      <!-- Project Name -->
      <h1
        class="flex items-center mb-4 text-xl font-bold text-left not-prose sm:text-3xl"
      >
        <nuxt-link
          to="/projects"
          class="no-underline focus-visible:global-focus border-b-[.1rem] border-b-blue-500/75"
          >Presentations</nuxt-link
        >
        <Icon
          name="heroicons:chevron-right-20-solid"
          class="mx-1 text-sky-500"
        />
        <span>{{ doc.title }}</span>
      </h1>

      <!-- Project Screenshot -->
      <section class="my-4 overflow-hidden rounded-xl max-h-72 card-style">
        <nuxt-img
          preload
          placeholder
          height="350"
          format="webp"
          loading="lazy"
          :src="doc.image"
          :alt="`Presentation Cover for My ${doc.title} Talk`"
          class="object-cover object-top w-full h-full m-0 text-center"
        />
      </section>

      <section
        class="flex items-start justify-between gap-4 mt-2 mb-4 sm:items-center"
      >
        <!-- Project Tags -->
        <!-- <ul class="p-0 m-0 space-x-1">
          <li
            class="my-0 px-2 py-[.125rem] inline-block rounded-full font-medium font-mono text-xs bg-zinc-300/75 dark:bg-zinc-700/75 text-zinc-800 dark:text-zinc-100"
            v-for="tag in doc.tags"
            :key="tag"
          >
            {{ tag }}
          </li>
        </ul> -->

        <!-- Relevant Links -->
        <div class="flex items-center space-x-2 text-xl">
          <nuxt-link
            :to="doc.url"
            title="Source Code"
            aria-label="Source Code"
            class="flex items-center justify-center w-8 h-8 p-1 border-none rounded-full bg-zinc-800 text-zinc-50"
          >
            <Icon name="simple-icons:github" />
          </nuxt-link>
          <nuxt-link
            :to="doc.url"
            title="Live Preview"
            aria-label="Live Preview"
            class="flex items-center justify-center w-8 h-8 p-1 bg-sky-500 border-none rounded-full text-zinc-800"
          >
            <Icon name="heroicons:arrow-up-right-20-solid" />
          </nuxt-link>
        </div>
      </section>

      <!-- Main Project content -->
      <ContentRenderer :value="doc" />
    </template>
    <template #not-found>
      <app-not-found />
    </template>
  </ContentDoc>
</template>
