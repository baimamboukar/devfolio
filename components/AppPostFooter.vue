<template>
  <section
    class="flex items-center [&>span]:text-zinc-300 [&>span]:dark:text-zinc-700 space-x-3 text-zinc-400 [&>a]:border-b-[.1rem]"
  >
    <p class="my-0 font-bold">Let's Connect</p>

    <Icon name="heroicons:chevron-right-20-solid" class="text-sky-500" />

    <nuxt-link
      class="focus-visible:global-focus"
      to="https://twitter.com/baimamboukarr"
      target="_blank"
      external
      >Twitter
    </nuxt-link>

    <span>&bull;</span>

    <nuxt-link
      class="focus-visible:global-focus"
      to="https://github.com/baimamboukar"
      target="_blank"
      external
      >GitHub
    </nuxt-link>

    <span>&bull;</span>

    <nuxt-link
      class="focus-visible:global-focus"
      to="https://linkedin.com/in/baimamboukar"
      target="_blank"
      external
      >LinkedIn
    </nuxt-link>
  </section>
</template>
