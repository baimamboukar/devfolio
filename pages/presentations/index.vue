<script setup>
definePageMeta({ title: 'Talks', description: 'Talks, workshops, and research presentations by Baimam Boukar.' });
const { data } = await useAsyncData('talk-collection', () => queryContent('presentations').findOne());
const search = ref('');
const type = ref('all');
const limit = ref(8);
const selected = ref(null);
const talks = computed(() => [...(data.value?.presentations || [])].sort((a, b) => b.date.localeCompare(a.date)));
const types = computed(() => [...new Set(talks.value.map(talk => talk.type))].sort());
const filtered = computed(() => talks.value.filter(talk => (type.value === 'all' || talk.type === type.value) && (talk.title + ' ' + talk.event).toLowerCase().includes(search.value.trim().toLowerCase())));
const visible = computed(() => filtered.value.slice(0, limit.value));
const years = computed(() => [...new Set(visible.value.map(talk => talk.date.slice(0, 4)))]);
const month = value => new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' }).format(new Date(value));
const date = value => new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));
const validLink = value => typeof value === 'string' && /^https?:\/\//.test(value);
const label = value => ({ community: 'Community', academic: 'Academic', workshop: 'Workshop' }[value] || value);
watch([search, type], () => { limit.value = 8; });
const clear = () => { search.value = ''; type.value = 'all'; };
</script>
<template>
  <article class="talks-page">
    <PageHeading title="Talks and Conversations" description="Research on the board, ideas in a room, and things learned together." />
    <div class="collection-toolbar">
      <CollectionSearch v-model="search" label="Find a talk or event" />
      <div class="format-select">
        <select v-model="type" aria-label="Presentation type"><option value="all">Every format</option><option v-for="item in types" :key="item" :value="item">{{ label(item) }}</option></select>
        <SiteIcon name="chevron" />
      </div>
    </div>
    <div v-if="years.length" class="talk-timeline">
    <section v-for="year in years" :key="year" class="talk-year" :aria-label="'Presentations in ' + year"><div class="year-label"><h2>{{ year }}</h2></div><div class="event-list"><article v-for="talk in visible.filter(item => item.date.startsWith(year))" :key="talk.title" class="event-strip"><time :datetime="talk.date"><span>{{ month(talk.date) }}</span><strong>{{ talk.date.slice(8) }}</strong></time><div class="event-copy"><div class="event-context"><span>{{ label(talk.type) }}</span><span>{{ talk.event }}</span></div><h3>{{ talk.title }}</h3><div class="event-actions"><button v-if="talk.cover" type="button" @click="selected = talk">Preview</button><a v-if="validLink(talk.slides)" :href="talk.slides" target="_blank" rel="noopener noreferrer">Slides <SiteIcon name="external" /></a><a v-if="validLink(talk.video)" :href="talk.video" target="_blank" rel="noopener noreferrer">Recording <SiteIcon name="external" /></a></div></div><button v-if="talk.cover" type="button" class="event-cover" :aria-label="'View image: ' + talk.title" @click="selected = talk"><img :src="talk.cover" :alt="'Presentation image for ' + talk.title" width="240" height="150" loading="lazy" decoding="async" /></button></article></div></section>
    </div>
    <div v-if="!filtered.length" class="collection-empty"><p>No talks match those filters.</p><button type="button" @click="clear">Reset filters</button></div>
    <button v-if="limit < filtered.length" type="button" class="collection-load" @click="limit += 8">Earlier talks <SiteIcon name="chevron" /></button>
    <SiteDialog :open="!!selected" title-id="talk-image-title" wide @close="selected = null"><figure v-if="selected" class="talk-preview"><img :src="selected.cover" :alt="'Presentation image for ' + selected.title" /><figcaption><p>{{ selected.event }} · {{ date(selected.date) }}</p><h2 id="talk-image-title">{{ selected.title }}</h2></figcaption></figure></SiteDialog>
  </article>
</template>
<style scoped>
.format-select{position:relative;max-width:100%;min-width:0}
.format-select select{appearance:none;width:100%;max-width:100%;min-height:42px;font:inherit;font-size:.82rem;padding:8px 40px 8px 12px;border:1px solid var(--line);border-radius:var(--corner-radius);background-color:var(--surface);color:var(--ink)}
.format-select>.site-icon{position:absolute;right:14px;top:50%;width:14px;height:14px;transform:translateY(-50%);pointer-events:none;color:var(--muted)}
.talk-timeline{position:relative;margin-top:var(--section-gap,28px)}
.talk-timeline::before{content:'';position:absolute;top:12px;bottom:0;left:26px;width:1px;background:var(--line)}
.talk-year{position:relative;display:grid;grid-template-columns:72px minmax(0,1fr);gap:24px;padding-bottom:var(--section-gap,28px)}
.talk-year:last-child{padding-bottom:0}.year-label h2{position:relative;z-index:1;width:max-content;font-size:20px;line-height:1.3;color:var(--ink);background:var(--page);padding:0 0 12px}
.event-strip{display:grid;grid-template-columns:44px minmax(0,1fr) 132px;align-items:center;gap:18px;padding:var(--row-gap,16px);background:var(--surface);border:1px solid var(--line);border-radius:var(--corner-radius,12px);margin-bottom:12px}
.event-strip:last-child{margin-bottom:0}.event-strip time{display:flex;flex-direction:column;align-items:center;color:var(--muted);font-size:.72rem;gap:3px}.event-strip time strong{font-size:23px;font-weight:500;color:var(--ink)}
.event-context{display:flex;flex-wrap:wrap;align-items:center;gap:7px 10px;font-size:.72rem;color:var(--muted);margin-bottom:7px}.event-context>span:first-child{color:var(--link-color)}.event-context>span+span{border-left:1px solid var(--line);padding-left:10px}
.event-copy{min-width:0}.event-copy h3{font-size:var(--paper-size,17px);line-height:1.4;color:var(--ink)}
.event-actions{display:flex;flex-wrap:wrap;gap:8px 16px;margin-top:7px;font-size:.78rem;color:var(--link-color)}.event-actions button,.event-actions a{display:inline-flex;align-items:center;gap:6px;text-align:left;min-height:30px}.event-actions button:hover,.event-actions a:hover{text-decoration:underline;text-underline-offset:4px}
.event-cover{display:grid;place-items:center;min-height:89px;border-radius:var(--corner-radius);overflow:hidden;background:var(--surface);padding:3px}.event-cover img{display:block;width:auto;max-width:100%;height:auto;max-height:83px;border-radius:var(--corner-radius);object-fit:contain}
.collection-load{display:flex;align-items:center;gap:12px}
.talk-preview img{display:block;margin:auto;width:auto;height:auto;max-width:100%;max-height:65dvh;border-radius:var(--corner-radius);object-fit:contain}.talk-preview figcaption{padding-top:18px}.talk-preview p{font-size:.8rem;color:var(--muted);margin-bottom:7px}.talk-preview h2{font-size:20px;line-height:1.4}
@media(max-width:850px){.talk-timeline{padding-left:16px}.talk-timeline::before{left:0;top:13px}.talk-year{grid-template-columns:1fr;gap:12px}.year-label h2{padding:0}.year-label::before{content:'';position:absolute;width:5px;height:5px;background:var(--muted);border-radius:50%;top:10px;left:-18px;box-shadow:0 0 0 4px var(--page)}}
@media(max-width:560px){.event-strip{grid-template-columns:28px minmax(0,1fr);gap:9px;padding:12px}.event-cover{grid-column:2;width:100%;max-width:210px;min-height:106px}.event-cover img{height:auto;max-height:100px}.event-strip time{align-self:start;padding-top:4px}.event-actions button,.event-actions a{min-height:44px}.event-copy h3{font-size:var(--paper-size,17px)}}
@media(max-width:600px){.format-select{flex:1}}
@media(max-width:560px){:deep(.page-heading h1){font-size:min(var(--name-size),7.6vw)}.collection-toolbar{display:grid;grid-template-columns:minmax(0,1fr)}.format-select{width:100%}}
</style>
