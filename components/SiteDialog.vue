<script setup>
const props = defineProps({ open: Boolean, titleId: { type: String, required: true }, wide: Boolean });
const emit = defineEmits(['close']);
const dialog = ref(null);
let previousOverflow;
let scrollLocked = false;
const unlock = () => {
  if (!scrollLocked) return;
  document.body.style.overflow = previousOverflow;
  scrollLocked = false;
};
const sync = () => {
  if (!dialog.value) return;
  if (props.open && !dialog.value.open) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    scrollLocked = true;
    dialog.value.showModal();
  } else if (!props.open && dialog.value.open) {
    dialog.value.close();
    unlock();
  }
};
onMounted(sync);
watch(() => props.open, async () => { await nextTick(); sync(); });
onBeforeUnmount(unlock);
</script>
<template>
  <dialog ref="dialog" :aria-labelledby="titleId" class="site-dialog" :class="{ wide }" @cancel.prevent="emit('close')" @click="event => { if (event.target === dialog) emit('close'); }">
    <div class="dialog-content">
      <button type="button" autofocus class="dialog-close" aria-label="Close dialog" @click="emit('close')">Close</button>
      <slot />
    </div>
  </dialog>
</template>
<style scoped>
.site-dialog { width: min(620px, calc(100vw - 32px)); max-height: calc(100dvh - 48px); overflow-y: auto; padding: 0; background: var(--surface); color: var(--ink); border: 1px solid var(--line); border-radius: var(--corner-radius); box-shadow: 0 28px 100px #0003; }
.site-dialog::backdrop { background: #111821b3; }
.site-dialog.wide { width: min(990px, calc(100vw - 32px)); }
.dialog-content { position: relative; padding: 64px 26px 26px; }
.dialog-close { position: absolute; right: 14px; top: 14px; min-width: 54px; height: 34px; padding: 0 10px; background: var(--surface-alt); font-size: .8rem; display: grid; place-items: center; border-radius: 8px; z-index: 2; }
@media (max-width: 540px) { .dialog-content { padding: 64px 20px 24px; } }
</style>
