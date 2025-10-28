<script setup>
  const profiles = [
    {
      name: "GitHub",
      icon: "simple-icons:github",
      url: "https://github.com/baimamboukar"
    },
    {
      name: "LinkedIn",
      icon: "simple-icons:linkedin",
      url: "https://linkedin.com/in/baimamboukar"
    },
    {
      name: "Google Scholar",
      icon: "fa7-brands:google-scholar",
      url: "https://scholar.google.com/citations?user=YOUR_ID"
    },
    {
      name: "HuggingFace",
      icon: "simple-icons:huggingface",
      url: "https://huggingface.co/baimamboukar"
    },
    {
      name: "Kaggle",
      icon: "cib:kaggle",
      url: "https://www.kaggle.com/baimamboukar"
    },
    {
      name: "X",
      icon: "simple-icons:x",
      url: "https://twitter.com/baimamboukar"
    },
    {
      name: "Credly",
      icon: "simple-icons:credly",
      url: "https://www.credly.com/users/baimamboukar"
    },
    {
      name: "Instagram",
      icon: "simple-icons:instagram",
      url: "https://instagram.com/baimamboukar"
    }
  ];
</script>

<!-- Profile card: Profile Picture, Name, Title + Social Profiles -->
<template>
  <div
    class="w-full flex flex-col items-center bg-transparent relative [&>*]:mb-1 md:[&>*]:mb-3 last:[&>*]:mb-0 p-1 pb-2 md:pb-1"
  >
    <nuxt-img
      preload
      placeholder
      format="webp"
      loading="lazy"
      width="112"
      height="112"
      src="/baimamboukar.jpeg"
      alt="Profile Picture"
      class="text-center border rounded-full w-28 border-zinc-200 dark:border-zinc-800"
    />
    <h2 class="text-xl font-bold md:text-2xl text-zinc-900 dark:text-zinc-100">
      Baimam Boukar JJ
    </h2>

    <h2 class="text-lg font-medium md:text-xl text-zinc-700 dark:text-zinc-400">
      Designed for Failure
    </h2>
    <div
      class="flex items-center justify-center w-full h-8 text-zinc-900 dark:text-zinc-200"
    >
      <nuxt-link
        v-for="profile in profiles"
        :key="profile.name"
        class="focus-visible:global-focus icon-link"
        :to="profile.url"
        :title="profile.name"
        :aria-label="`Link to My ${profile.name} Profile`"
        target="_blank"
        external
      >
        <Icon :name="profile.icon" />
      </nuxt-link>
    </div>
  </div>
</template>
