<script setup>
const props = defineProps({ experience: { type: Array, required: true }, heading: { type: String, default: 'Experience' } });
const headingId = useId();
const dialogId = useId();
const selected = ref(null);
const roleDialog = ref(null);
const organizationImage = role => role.icon && role.icon !== '/favicon.png' ? role.icon : null;
const initials = role => role.company === 'BASE Fellowship' ? 'BASE' : role.company === 'Sentient Futures Project Incubator' ? 'SF' : role.company.slice(0,2);
async function openRole(role) {
  selected.value = role;
  await nextTick();
  roleDialog.value?.showModal();
}
function closeRole() { roleDialog.value?.close(); }
onBeforeUnmount(closeRole);
</script>

<template>
  <section class="career-preview" :aria-labelledby="headingId">
    <h2 :id="headingId">{{ heading }}</h2>
    <ol class="career-timeline">
      <li v-for="role in experience" :key="role.company + role.title" class="career-stop">
        <article class="career-card">
          <div class="career-header">
            <div class="organization-mark">
              <img v-if="organizationImage(role)" :src="organizationImage(role)" :alt="role.company" width="96" height="96" loading="lazy" decoding="async">
              <span v-else class="organization-initials" aria-hidden="true">{{ initials(role) }}</span>
            </div>
            <div class="career-identity">
              <h3>{{ role.title }}</h3>
              <p class="career-company">{{ role.company }}</p>
              <p class="career-meta"><span v-if="role.location">{{ role.location }}</span><span>{{ role.period }}</span></p>
              <ul v-if="role.tags?.length" class="career-tags" aria-label="Areas of work"><li v-for="tag in role.tags" :key="tag">{{ tag }}</li></ul>
            </div>
            <button v-if="role.responsibilities?.length" type="button" class="role-details-button" :aria-label="`View details: ${role.company}, ${role.title}`" :title="`Details about this role at ${role.company}`" aria-haspopup="dialog" @click="openRole(role)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></svg>
            </button>
          </div>
        </article>
      </li>
    </ol>
    <dialog ref="roleDialog" class="role-dialog" :aria-labelledby="dialogId" @click="event => event.target === roleDialog && closeRole()">
      <template v-if="selected">
        <div class="dialog-heading"><div><p class="dialog-company">{{ selected.company }}</p><h3 :id="dialogId">{{ selected.title }}</h3><p class="career-meta"><span v-if="selected.location">{{ selected.location }}</span><span>{{ selected.period }}</span></p></div><button type="button" class="dialog-close" aria-label="Close role details" autofocus @click="closeRole"><span aria-hidden="true">×</span></button></div>
        <div class="dialog-content"><h4>Responsibilities and contributions</h4><ul><li v-for="responsibility in selected.responsibilities" :key="responsibility">{{ responsibility }}</li></ul><ul v-if="selected.tags?.length" class="career-tags" aria-label="Areas of work"><li v-for="tag in selected.tags" :key="tag">{{ tag }}</li></ul></div>
      </template>
    </dialog>
  </section>
</template>

<style scoped>
.career-preview > h2 { margin-bottom: 20px; }
.career-timeline { list-style: none; margin: 0; padding: 0; }
.career-stop { position: relative; padding-left: 33px; padding-bottom: calc(var(--row-gap) + 9px); }
.career-stop::before { content: ''; position: absolute; left: 6px; top: 8px; bottom: -8px; width: 1px; background: var(--line); }
.career-stop:last-child::before { bottom: 40px; background: linear-gradient(var(--line),transparent); }
.career-stop::after { content: ''; position: absolute; left: 2px; top: 9px; width: 9px; height: 9px; border-radius: 50%; background: rgb(var(--primary-400)); box-shadow: 0 0 0 4px var(--page); }
.career-card { position: relative; overflow: hidden; border: 1px solid var(--line); background: var(--surface); border-radius: var(--corner-radius,12px); padding: 22px; }
.career-card::before { content: ''; pointer-events: none; position: absolute; inset: 0 0 0 62%; opacity: .07; background-image: linear-gradient(90deg,transparent 31px,rgb(var(--primary-500)) 31px,rgb(var(--primary-500)) 32px,transparent 32px),linear-gradient(0deg,transparent 31px,rgb(var(--primary-500)) 31px,rgb(var(--primary-500)) 32px,transparent 32px); background-size: 32px 32px; mask-image: linear-gradient(to right,transparent,#000); }
.career-header { position: relative; display: grid; grid-template-columns: 96px minmax(0,1fr) auto; align-items: center; gap: 18px; }
.organization-mark { display: grid; place-items: center; min-width: 0; width: 96px; height: 96px; border-radius: 12px; overflow: hidden; background: #fff; }
.organization-mark img { width: 96px; height: 96px; object-fit: contain; }
.organization-initials { font-size: 1.2rem; font-weight: 650; color: rgb(var(--primary-600)); letter-spacing: -.03em; }
.career-identity { min-width: 0; }
.career-identity h3 { font-size: var(--paper-size,18px); font-weight: var(--heading-weight); line-height: 1.4; }
.career-company { margin-top: 5px; font-size: .95rem; font-weight: 550; }
.career-meta { display: flex; flex-wrap: wrap; column-gap: 9px; row-gap: 1px; margin-top: 8px; color: var(--muted); font-size: .78rem; line-height: 1.55; }
.career-meta span + span::before { content: '·'; display: inline-block; margin-right: 9px; }
.career-tags { display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 0; padding: 0; list-style: none; }
.career-tags li { padding: 3px 8px; border-radius: 20px; background: color-mix(in srgb, var(--link-color) 9%, var(--surface)); color: var(--link-color); font-size: .69rem; line-height: 1.5; }
.role-details-button { display: grid; place-items: center; align-self: start; width: 44px; height: 44px; margin: -9px -9px 0 0; border-radius: 50%; color: var(--muted); transition: color 120ms ease, background 120ms ease; }
.role-details-button:hover { color: var(--link-color); background: var(--surface-alt); }
.role-details-button:focus-visible { outline: 2px solid var(--link-color); outline-offset: 2px; }
.role-details-button svg { width: 20px; height: 20px; }
.role-dialog { position: fixed; width: min(680px,calc(100vw - 32px)); max-width: none; max-height: calc(100dvh - 40px); padding: 0; border: 1px solid var(--line); border-radius: var(--corner-radius,12px); color: var(--ink); background: var(--surface); overflow: auto; margin: auto; }
.role-dialog::backdrop { background: rgb(10 20 35 / .45); }
.dialog-heading { position: relative; padding: 25px 68px 21px 25px; border-bottom: 1px solid var(--line); }
.dialog-company { font-size: .8rem; color: var(--muted); margin-bottom: 6px; }
.dialog-heading h3 { font-size: 1.25rem; line-height: 1.4; }
.dialog-close { position: absolute; right: 14px; top: 14px; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: var(--surface-alt); font-size: 1.6rem; line-height: 1; }
.dialog-content { padding: 23px 25px 26px; }
.dialog-content h4 { font-size: .88rem; margin-bottom: 12px; }
.dialog-content > ul:not(.career-tags) { list-style: disc; padding-left: 19px; display: grid; gap: 12px; color: var(--muted); font-size: .9rem; line-height: var(--content-leading); }
@media (max-width: 600px) { .career-stop { padding-left: 0; } .career-stop::before,.career-stop::after { display: none; } .career-card { padding: 15px; } .career-header { grid-template-columns: minmax(0,1fr) auto; gap: 12px; } .organization-mark,.organization-mark img { width: 58px; height: 58px; } .career-identity { grid-column: 1 / -1; grid-row: 2; } .career-identity h3 { font-size: min(var(--paper-size,18px),1.02rem); } .career-company { font-size: .84rem; } .career-meta { display: block; font-size: .73rem; } .career-meta span { display: block; } .career-meta span + span::before { display: none; } .role-details-button { grid-column: 2; grid-row: 1; margin: -6px -6px 0 0; } .career-tags { gap: 5px; } .dialog-heading { padding-left: 19px; } .dialog-content { padding: 20px; } }
</style>
