<script setup>
definePageMeta({ title: 'Writing', description: 'Research notes, replications, and software engineering articles by Baimam Boukar.' });
const search = ref('');
const topic = ref('all');
const clean = value => (value || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const { data: posts } = await useAsyncData('writing-collection', async () => {
  const localPostsPromise = queryContent('blog').where({ published: true }).find();
  const featured = {
    id: 'matryoshka-saes-lesswrong',
    title: 'How Matryoshka Sparse AutoEncoders Recover Feature Hierarchies That Vanilla SAEs Lose',
    link: 'https://www.lesswrong.com/posts/EpLj8FTBdGvt44TTF/how-matryoshka-sparse-autoencoders-recover-feature',
    description: 'A guided replication of Matryoshka SAEs, exploring feature hierarchies, feature absorption, and the reconstruction–sparsity tradeoff.',
    tags: ['Mechanistic Interpretability', 'Sparse Autoencoders'],
    date: '2026-06-15',
    platform: 'LessWrong',
    cover: '/matryoshka-saes-cover.png',
    coverAlt: 'The Matryoshka SAE encoder and nested training objective.',
  };
  let items = [];
  try {
    const feed = await $fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@baimamboukar', { timeout: 4000, retry: 0 });
    items = (feed.items || []).map(post => ({
      id: post.guid || post.link, title: clean(post.title), link: post.link,
      description: clean(post.description).length > 240 ? clean(post.description).slice(0, 240).replace(/\s+\S*$/, '') + '…' : clean(post.description),
      tags: post.categories || [], date: post.pubDate.split(' ')[0], platform: 'Medium',
    }));
  } catch { /* The verified local entry remains available if the feed is offline. */ }
  const local = await localPostsPromise;
  const localPosts = local.filter(post => post.listed !== false).map(post => ({ id: post._path, title: post.title, link: post._path, description: post.description, tags: post.tags || [], date: post.published_on, platform: 'Notebook' }));
  return [featured, ...items, ...localPosts];
});
const topics = computed(() => [...new Set((posts.value || []).flatMap(post => post.tags))].sort());
const filtered = computed(() => (posts.value || []).filter(post => (topic.value === 'all' || post.tags.includes(topic.value)) && (post.title + ' ' + post.description).toLowerCase().includes(search.value.trim().toLowerCase())).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title)));
const lead = computed(() => !search.value.trim() && topic.value === 'all' ? filtered.value.find(post => post.id === 'matryoshka-saes-lesswrong') || filtered.value[0] : filtered.value[0]);
const readingList = computed(() => filtered.value.filter(post => post.id !== lead.value?.id));
const external = value => /^https?:\/\//.test(value || '');
const date = value => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));
const excerpt = value => {
  const text = clean(value);
  return text.length > 170 ? text.slice(0, 170).replace(/\s+\S*$/, '') + '…' : text;
};
const clear = () => { search.value = ''; topic.value = 'all'; };
</script>
<template>
  <article class="journal-page">
    <PageHeading title="Writing" description="Notes from research and the work of building things.">
      <a href="https://medium.com/@baimamboukar" target="_blank" rel="noopener noreferrer" class="journal-action"><SiteIcon name="medium" />Medium</a>
      <a href="https://www.lesswrong.com/users/baimam-boukar-jean-jacques" target="_blank" rel="noopener noreferrer" class="journal-action"><img src="/icons/lesswrong.ico" width="19" height="19" alt="" class="journal-brand" />LessWrong</a>
    </PageHeading>
    <div class="collection-toolbar"><CollectionSearch v-model="search" label="Search writing" /><select v-model="topic" aria-label="Writing topic"><option value="all">Every topic</option><option v-for="item in topics" :key="item" :value="item">{{ item }}</option></select></div>
    <article v-if="lead" class="lead-story" :class="{ 'has-cover': lead.cover }">
      <div class="lead-media">
        <NuxtLink v-if="lead.cover" :to="lead.link" :external="external(lead.link)" :target="external(lead.link) ? '_blank' : undefined" rel="noopener noreferrer" class="lead-cover" :aria-label="`Read ${lead.title}`">
          <img :src="lead.cover" :alt="lead.coverAlt || ''" width="1999" height="1035" decoding="async" />
        </NuxtLink>
        <div class="lead-caption"><span class="story-platform platform-label"><SiteIcon v-if="lead.platform === 'Medium'" name="medium" /><img v-else-if="lead.platform === 'LessWrong'" src="/icons/lesswrong.ico" alt="" width="16" height="16" />{{ lead.platform }}</span><time :datetime="lead.date">{{ date(lead.date) }}</time></div>
      </div>
      <div class="lead-copy"><p class="story-topic">{{ lead.tags.slice(0, 2).join(' / ') }}</p><h2><NuxtLink :to="lead.link" :external="external(lead.link)" :target="external(lead.link) ? '_blank' : undefined" rel="noopener noreferrer">{{ lead.title }}</NuxtLink></h2><p class="story-description">{{ lead.description }}</p></div>
    </article>
    <section v-if="readingList.length" class="reading-archive" aria-label="More writing">
      <ul>
        <li v-for="post in readingList" :key="post.id">
          <div class="entry-meta"><span class="platform-label"><SiteIcon v-if="post.platform === 'Medium'" name="medium" /><img v-else-if="post.platform === 'LessWrong'" src="/icons/lesswrong.ico" alt="" width="16" height="16" />{{ post.platform }}</span><time :datetime="post.date">{{ date(post.date) }}</time></div>
          <h3><NuxtLink :to="post.link" :external="external(post.link)" :target="external(post.link) ? '_blank' : undefined" rel="noopener noreferrer"><span>{{ post.title }}</span><SiteIcon :name="external(post.link) ? 'external' : 'arrow-right'" /></NuxtLink></h3>
          <p>{{ excerpt(post.description) }}</p>
        </li>
      </ul>
    </section>
    <div v-if="!filtered.length" class="collection-empty"><p>No writing matches those filters.</p><button type="button" @click="clear">Reset filters</button></div>
  </article>
</template>
<style scoped>
.journal-action{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;background:var(--surface-alt);border:1px solid var(--line);border-radius:999px;font-size:.82rem;color:var(--ink)}
.journal-action:hover{border-color:var(--muted);background:var(--surface)}
.journal-action .site-icon,.journal-brand{width:19px;height:19px;flex:none;object-fit:contain}
.lead-story{display:grid;grid-template-columns:145px minmax(0,1fr);gap:28px;padding:26px;background:var(--surface-alt);border-radius:var(--corner-radius,12px);margin-top:16px}
.lead-story.has-cover{grid-template-columns:minmax(0,.85fr) minmax(0,1.35fr);gap:24px}
.lead-media{min-width:0;display:flex;flex-direction:column;gap:14px}
.lead-cover{display:grid;place-items:center;overflow:hidden;background:#fff;border:1px solid var(--line);border-radius:calc(var(--corner-radius,12px) * .6);aspect-ratio:1.93}
.lead-cover img{display:block;width:100%;height:auto;object-fit:contain}
.lead-caption{display:flex;flex-direction:column;gap:12px;font-size:.78rem;color:var(--muted)}
.has-cover .lead-caption{flex-direction:row;align-items:center;flex-wrap:wrap;gap:8px 12px}
.story-platform{width:max-content;background:var(--surface);padding:5px 10px;border-radius:999px;color:var(--link-color)}
.platform-label{display:inline-flex;align-items:center;gap:6px}.platform-label .site-icon,.platform-label img{width:16px;height:16px;flex:none;object-fit:contain}
.lead-copy{min-width:0}.story-topic{color:var(--muted);font-size:.78rem;margin-bottom:10px}
.lead-copy h2{max-width:45ch;font-size:var(--section-size);line-height:1.4}.lead-copy h2 a,.reading-archive h3 a{color:var(--ink)}
.story-description{color:var(--muted);font-size:.94rem;line-height:var(--content-leading,1.65);margin:12px 0 0}
.reading-archive{margin-top:var(--section-gap,28px)}
.reading-archive ul{list-style:none;margin:0;padding:0}
.reading-archive li{padding:calc(var(--row-gap,14px) + 6px) 0;border-bottom:1px solid var(--line)}
.entry-meta{display:flex;align-items:center;flex-wrap:wrap;gap:8px 12px;color:var(--muted);font-size:.73rem;margin-bottom:7px}
.entry-meta span{font-weight:500;color:var(--link-color)}.entry-meta time{padding-left:12px;border-left:1px solid var(--line)}
.reading-archive h3{font-size:var(--paper-size,18px);line-height:1.4}
.reading-archive h3 a{display:flex;align-items:baseline;justify-content:space-between;gap:20px;min-height:28px}
.reading-archive h3 a:hover,.reading-archive h3 a:focus-visible{color:var(--link-color)}
.reading-archive h3 .site-icon{width:16px;height:16px;color:var(--muted)}
.reading-archive li p{margin-top:7px;color:var(--muted);font-size:.88rem;line-height:var(--content-leading,1.65);max-width:74ch}
@media(max-width:700px){.lead-story,.lead-story.has-cover{grid-template-columns:1fr;gap:16px;padding:20px}.lead-caption{flex-direction:row;align-items:center;flex-wrap:wrap}.reading-archive h3 a{min-height:44px;gap:12px}.reading-archive li p{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}}
@media(max-width:560px){.lead-story,.lead-story.has-cover{padding:16px}.lead-copy h2{font-size:min(var(--section-size),5.5vw)}:deep(.page-heading h1){font-size:min(var(--name-size),7.6vw)}.collection-toolbar{display:grid;grid-template-columns:minmax(0,1fr)}.collection-toolbar>select{width:100%}}
</style>
