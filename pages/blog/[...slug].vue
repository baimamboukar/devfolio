<script setup>
    definePageMeta({
      layout: "blog-layout",
    });

    useHead({
      titleTemplate: "%s | Blog · Baimam Boukar",
    });

    const route = useRoute();

    // const { data } = await useAsyncData("get-blog-post", () =>
    //   queryContent("/blog/create-iam-users-with-aws").only(["title", "description", "image"]).findOne()
    // );

    // const {
    //   title: postTitle,
    //   description: postDescription,
    //   image: postCover,
    // } = data.value;
    const data = {
      title: 'Create',
      description: 'Create IAM Users with AWS',
      image: 'https://baimamboukar.dev/assets/images/baimamboukar.png'
  }
    const serverMeta = {
      ogType: "article",
      ogLocale: "en_US",
      twitterCard: "summary",
      twitterCreator: "@baimamboukarr",
    };

    useSeoMeta({
      title: () => postTitle,
      description: () => postDescription,
      ogTitle: () => `${postTitle} | Blog · Baimam Boukar JJ`,
      twitterTitle: () => `${postTitle} | Blog · Baimam Boukar JJ`,
      ogDescription: () => postDescription,
      twitterDescription: () => postDescription,
      ogImage: () => postCover,
      twitterImage: () => postCover,
      ogUrl: () => `https://baimamboukar.dev${route.path}`,
      ...serverMeta,
    });
</script>

<template>
  <ContentDoc>
    <template #default="{ doc }">
      <!-- Post Title -->
      <h1 class="mb-4">
        {{ doc.title }}
      </h1>

      <!-- Post Cover Image -->
      <nuxt-img
        v-if="doc.image"
        preload
        placeholder
        format="webp"
        loading="lazy"
        height="300"
        :src="doc.image"
        :alt="doc.title"
        class="text-center"
      />

      <!-- Table of Contents -->
      <template v-if="doc.body.toc.links.length > 0">
        <details
          open
          class="flex items-center self-start px-4 py-3 mb-2 bg-white border rounded-lg dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
        >
          <summary
            class="flex items-center list-none appearance-none cursor-pointer focus:outline-none group"
          >
            <span class="inline-block mr-2 text-lg font-bold">Outlines</span>
            <Icon
              class="text-sky-500 arrow-right group-focus-visible:global-focus rounded-full"
              name="heroicons:chevron-right-20-solid"
              size="1.5rem"
            />
            <Icon
              class="text-sky-500 arrow-down group-focus-visible:global-focus rounded-full"
              name="heroicons:chevron-down-20-solid"
              size="1.5rem"
            />
          </summary>

          <ol class="my-1">
            <li v-for="link of doc.body.toc.links" :key="link.id">
              <a :href="`#${link.id}`">{{ link.text }}</a>
            </li>
          </ol>
        </details>
      </template>

      <!-- Main Content -->
      <ContentRenderer :value="doc" />

      <app-divider class="w-1/2 my-8 md:w-2/3" />

      <!-- Let's Connect -->
      <app-post-footer />
    </template>
    <template #not-found>
      <app-not-found />
    </template>
  </ContentDoc>
</template>

<style scoped>
  img {
    @apply w-full h-auto object-cover bg-cover origin-center border border-zinc-300 dark:border-zinc-600;
  }

  details > summary::marker,
  details > summary::-webkit-details-marker {
    @apply hidden;
  }

  /* Collapsed */
  details > summary .arrow-right {
    @apply inline-block;
  }
  details > summary .arrow-down {
    @apply hidden;
  }

  /* Expanded */
  details[open] > summary .arrow-down {
    @apply inline-block;
  }
  details[open] > summary .arrow-right {
    @apply hidden;
  }
</style>
