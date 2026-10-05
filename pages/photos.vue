<script setup>
definePageMeta({ title: 'Photos', description: 'Photographs from Baimam Boukar’s time in Kenya, alongside a sample photography collection.' });
const { data } = await useAsyncData('photo-album', () => queryContent('photos').findOne());
const collection = ref('all');
const filters = [
  { value: 'all', label: 'All photos' },
  { value: 'personal', label: 'Personal' },
  { value: 'samples', label: 'Samples' },
];
const groups = computed(() => [
  { id: 'personal', title: 'Personal photographs', photos: (data.value?.photos || []).filter(photo => !photo.sample) },
  { id: 'samples', title: 'Sample photographs', description: 'A visual study with sample photographs.', photos: (data.value?.photos || []).filter(photo => photo.sample) },
].filter(group => collection.value === 'all' || collection.value === group.id));
const visiblePhotos = computed(() => groups.value.flatMap(group => group.photos));
const selectedId = ref(null);
const selected = computed(() => visiblePhotos.value.find(photo => photo.id === selectedId.value));
let opener = null;
const openPhoto = (photo, event) => {
  opener = event.currentTarget;
  selectedId.value = photo.id;
};
const closePhoto = async () => {
  selectedId.value = null;
  await nextTick();
  opener?.focus({ preventScroll: true });
};
const step = direction => {
  const photos = visiblePhotos.value;
  const index = photos.findIndex(photo => photo.id === selectedId.value);
  if (photos.length && index !== -1) selectedId.value = photos[(index + direction + photos.length) % photos.length].id;
};
watch(collection, () => { selectedId.value = null; });
</script>

<template>
  <article class="photos-page">
    <PageHeading title="Outside the notebook" description="Work, walks, and moments in between." />
    <CollectionFilters v-model="collection" class="album-filters" :options="filters" label="Photo collections" />

    <section v-for="group in groups" :key="group.id" class="photo-collection" :class="`collection-${group.id}`" :aria-labelledby="`photos-${group.id}`">
      <header class="collection-heading">
        <h2 :id="`photos-${group.id}`">{{ group.title }}</h2>
        <p v-if="group.description">{{ group.description }}</p>
      </header>
      <div class="photo-grid">
        <figure v-for="(photo, index) in group.photos" :key="photo.id" class="photo-frame">
          <button type="button" class="photo-open" :aria-label="`Open photo: ${photo.title}`" @click="openPhoto(photo, $event)">
            <img
              :src="photo.thumbnail || photo.src"
              :srcset="photo.thumbnail ? `${photo.thumbnail} 600w, ${photo.src} ${photo.width}w` : undefined"
              sizes="(max-width: 600px) 69vw, (max-width: 850px) 34vw, 23vw"
              :alt="photo.alt" :width="photo.width" :height="photo.height" :style="photo.position ? { objectPosition: photo.position } : undefined"
              :loading="group.id === 'personal' && index < 3 ? 'eager' : 'lazy'" decoding="async"
            />
          </button>
          <figcaption>
            <p>{{ photo.title }}</p>
            <a v-if="photo.sample" :href="photo.source" target="_blank" rel="noopener noreferrer" :aria-label="`${photo.title} by ${photo.credit}`">{{ photo.credit }}</a>
          </figcaption>
        </figure>
      </div>
    </section>

    <SiteDialog :open="!!selected" title-id="photo-detail-title" wide @close="closePhoto" @keydown.left.prevent="step(-1)" @keydown.right.prevent="step(1)">
      <figure v-if="selected" class="photo-detail">
        <img :key="selected.id" :src="selected.src" :alt="selected.alt" :width="selected.width" :height="selected.height" />
        <figcaption>
          <div class="photo-description" aria-live="polite">
            <span v-if="selected.sample" class="sample-label">Sample photograph</span>
            <h2 id="photo-detail-title">{{ selected.title }}</h2>
            <p>{{ selected.caption }}</p>
            <a :href="selected.source" target="_blank" rel="noopener noreferrer">{{ selected.credit }}</a>
          </div>
          <div v-if="visiblePhotos.length > 1" class="photo-controls" role="group" aria-label="Browse photographs">
            <button type="button" aria-label="Previous photograph" @click="step(-1)"><SiteIcon name="previous" /></button>
            <button type="button" aria-label="Next photograph" @click="step(1)"><SiteIcon name="next" /></button>
          </div>
        </figcaption>
      </figure>
    </SiteDialog>
  </article>
</template>

<style scoped>
.photos-page > :deep(.page-heading) { margin-bottom: 18px; }
.album-filters { margin-bottom: 24px; }
.album-filters :deep(button) { border-radius: 999px; }
.photo-collection + .photo-collection { margin-top: 34px; }
.collection-heading { margin-bottom: 12px; }
.collection-heading h2 { font-size: var(--section-size); line-height: 1.35; }
.collection-heading p { margin-top: 5px; color: var(--muted); font-size: .88rem; line-height: 1.5; }
.photo-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px 14px; }
.photo-frame { min-width: 0; }
.photo-open { display: block; width: 100%; overflow: hidden; border-radius: min(var(--corner-radius), 6px); background: var(--surface-alt); }
.photo-open img { display: block; width: 100%; height: auto; aspect-ratio: 3 / 2; object-fit: cover; }
.collection-personal .photo-open img { height: 250px; aspect-ratio: auto; object-position: 50% 40%; }
.photo-frame figcaption { padding-top: 7px; font-size: .78rem; line-height: 1.45; }
.photo-frame figcaption p { color: var(--ink); }
.photo-frame figcaption a { display: block; width: fit-content; color: var(--muted); font-size: .7rem; margin-top: 2px; }
.photo-frame figcaption a:hover { color: var(--link-color); }
.photo-open:hover img { opacity: .94; }
.photo-detail > img { display: block; width: auto; height: auto; max-width: 100%; max-height: 64dvh; object-fit: contain; margin: auto; border-radius: 4px; }
.photo-detail figcaption { display: flex; justify-content: space-between; gap: 20px; align-items: center; margin-top: 18px; }
.photo-description { min-width: 0; }
.photo-detail h2 { font-size: 20px; line-height: 1.4; }
.photo-detail p { font-size: .86rem; line-height: 1.5; color: var(--muted); margin: 6px 0; }
.photo-detail a { font-size: .76rem; color: var(--link-color); }
.sample-label { display: block; margin-bottom: 4px; color: var(--muted); font-size: .72rem; }
.photo-controls { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.photo-controls button { display: grid; place-items: center; width: 42px; height: 42px; border: 1px solid var(--line); border-radius: 50%; color: var(--ink); }
.photo-controls button:hover { background: var(--surface-alt); }
.photo-controls :deep(svg) { width: 18px; height: 18px; }
@media (prefers-reduced-motion: no-preference) { .photo-open img { transition: opacity 160ms ease; } }
@media (max-width: 850px) { .photo-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .collection-personal .photo-open img { height: 240px; } }
@media (max-width: 600px) { .photo-grid { grid-template-columns: minmax(0, 1fr); gap: 22px; } .collection-personal .photo-open img { height: auto; aspect-ratio: 1; } .photo-frame figcaption { font-size: .82rem; } .photo-frame figcaption a { font-size: .74rem; } .photo-detail figcaption { align-items: flex-start; flex-direction: column; gap: 14px; } .photo-detail > img { max-height: 52dvh; } }
</style>
