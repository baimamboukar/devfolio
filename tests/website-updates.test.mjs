import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import yaml from 'js-yaml';
import { run } from '../scripts/website-updates.mjs';

const sample = {
  date: '2024-07-10',
  title: 'A new research note',
  description: 'A concise, reviewed description for readers.',
  type: 'publication',
  tags: ['Interpretability'],
  link: 'https://example.org/research/note',
  sources: [{ kind: 'public', url: 'https://example.org/research/note', label: 'Research note', checkedAt: '2024-07-11' }],
};

async function fixture(t, content = 'updates: []\n') {
  const root = await mkdtemp(path.join(os.tmpdir(), 'website-updates-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'content'));
  const newsFile = path.join(root, 'content', 'news.yaml');
  const queueFile = path.join(root, '.private', 'website-updates', 'queue.json');
  await writeFile(newsFile, content);
  const command = (...args) => run([...args, '--root', root]);
  async function add(payload = sample) {
    const input = path.join(root, 'input.json');
    await writeFile(input, JSON.stringify(payload));
    return command('add', '--input', input);
  }
  return { root, newsFile, queueFile, command, add };
}

test('new drafts remain private and cannot be applied without a review note', async (t) => {
  const f = await fixture(t);
  const { record } = await f.add();
  assert.equal(record.status, 'pending');
  await assert.rejects(f.command('apply', record.id), /requires explicit approval/);
  await assert.rejects(f.command('approve', record.id), /approval note/);
  assert.equal(await readFile(f.newsFile, 'utf8'), 'updates: []\n');
  assert.equal((await f.command('show', record.id)).record.status, 'pending');
});

test('application projects public keys, preserves unrelated data, sorts, and is idempotent', async (t) => {
  const older = { ...sample, date: '2023-01-01', title: 'Older work', link: '#', privateLegacyKey: 'preserved' };
  delete older.sources;
  const f = await fixture(t, yaml.dump({ editorial: { owner: 'unchanged', enabled: true }, updates: [older] }));
  const { record } = await f.add({
    ...sample,
    rawEmail: 'PRIVATE MESSAGE BODY MUST NOT PERSIST',
    applicationDetails: 'PRIVATE APPLICATION DETAILS',
    sources: [{ kind: 'email', url: 'https://mail.google.com/mail/u/0/#inbox/123', label: 'Private correspondence', checkedAt: '2024-07-11', body: 'PRIVATE SOURCE BODY' }],
  });
  const queueBytes = await readFile(f.queueFile, 'utf8');
  assert.ok(!queueBytes.includes('PRIVATE MESSAGE BODY'));
  assert.ok(!queueBytes.includes('PRIVATE SOURCE BODY'));
  assert.ok(!queueBytes.includes('PRIVATE APPLICATION DETAILS'));
  await f.command('approve', record.id, '--note', 'User reviewed the wording and checked the email evidence.');
  const result = await f.command('apply', record.id);
  assert.equal(result.result, 'applied_locally');
  const bytes = await readFile(f.newsFile, 'utf8');
  const document = yaml.load(bytes);
  assert.deepEqual(document.editorial, { owner: 'unchanged', enabled: true });
  assert.deepEqual(document.updates.map((item) => item.date), ['2024-07-10', '2023-01-01']);
  assert.equal(document.updates[1].privateLegacyKey, 'preserved');
  assert.deepEqual(Object.keys(document.updates[0]).sort(), ['date', 'description', 'link', 'tags', 'title', 'type']);
  for (const privateValue of ['sources', 'mail.google.com', 'approval', 'Private correspondence', record.id]) assert.ok(!bytes.includes(privateValue));
  assert.equal((await f.command('apply', record.id)).result, 'already_applied');
  assert.equal(await readFile(f.newsFile, 'utf8'), bytes);
});

test('duplicate source references and normalized date/title return the original draft', async (t) => {
  const f = await fixture(t);
  const initial = await f.add();
  const sourceDuplicate = await f.add({ ...sample, title: 'Reworded title', link: 'https://example.org/different' });
  assert.equal(sourceDuplicate.result, 'duplicate');
  assert.equal(sourceDuplicate.record.id, initial.record.id);
  const titleDuplicate = await f.add({ ...sample, title: '  A NEW   RESEARCH NOTE ', link: 'https://example.org/other', sources: [{ ...sample.sources[0], url: 'https://example.org/other' }] });
  assert.equal(titleDuplicate.record.id, initial.record.id);
  assert.equal((await f.command('list')).records.length, 1);
});

test('same real link deduplicates even when title, date, and source differ', async (t) => {
  const f = await fixture(t);
  const initial = await f.add();
  const duplicate = await f.add({ ...sample, date: '2024-07-12', title: 'Different wording', link: `${sample.link}?utm_source=email#summary`, sources: [{ ...sample.sources[0], url: 'https://example.org/new-source' }] });
  assert.equal(duplicate.result, 'duplicate');
  assert.equal(duplicate.record.id, initial.record.id);
});

test('document and email fragment locators can distinguish unrelated source references', async (t) => {
  const f = await fixture(t);
  const { record: first } = await f.add({ ...sample, link: undefined, sources: [{ kind: 'document', url: 'file:///tmp/cv.pdf#paper-a', label: 'CV, paper A', checkedAt: '2024-07-11' }] });
  const { record: second } = await f.add({ ...sample, title: 'Another paper', link: undefined, sources: [{ kind: 'document', url: 'file:///tmp/cv.pdf#paper-b', label: 'CV, paper B', checkedAt: '2024-07-11' }] });
  assert.notEqual(first.id, second.id);
});

test('existing public news deduplicates without rewriting its bytes', async (t) => {
  const publicItem = { ...sample };
  delete publicItem.sources;
  const original = `# Keep this comment and formatting\n${yaml.dump({ updates: [publicItem] })}`;
  const f = await fixture(t, original);
  const { record } = await f.add({ ...sample, title: 'Same linked work, new wording' });
  await f.command('approve', record.id, '--note', 'User approved after checking the public article.');
  assert.equal((await f.command('apply', record.id)).result, 'matched_existing_news');
  assert.equal(await readFile(f.newsFile, 'utf8'), original);
  assert.equal((await f.command('show', record.id)).record.status, 'applied');
});

test('a retry recovers when public content exists but the draft is still approved', async (t) => {
  const f = await fixture(t);
  const { record } = await f.add();
  await f.command('approve', record.id, '--note', 'User approved the verified article.');
  const publicItem = { ...sample };
  delete publicItem.sources;
  await writeFile(f.newsFile, yaml.dump({ updates: [publicItem] }));
  await f.command('apply', record.id);
  assert.equal(yaml.load(await readFile(f.newsFile, 'utf8')).updates.length, 1);
  assert.equal((await f.command('show', record.id)).record.status, 'applied');
});

test('malformed destination YAML is preserved and the draft stays approved', async (t) => {
  const malformed = 'updates: [unterminated\n';
  const f = await fixture(t, malformed);
  const { record } = await f.add();
  await f.command('approve', record.id, '--note', 'User approved wording and evidence.');
  await assert.rejects(f.command('apply', record.id), /malformed YAML/);
  assert.equal(await readFile(f.newsFile, 'utf8'), malformed);
  assert.equal((await f.command('show', record.id)).record.status, 'approved');
});

test('invalid destination shape and duplicate YAML keys are preserved', async (t) => {
  for (const malformed of ['updates: not-an-array\n', 'updates: []\nupdates: []\n']) {
    const f = await fixture(t, malformed);
    const { record } = await f.add();
    await f.command('approve', record.id, '--note', 'User approved wording and evidence.');
    await assert.rejects(f.command('apply', record.id));
    assert.equal(await readFile(f.newsFile, 'utf8'), malformed);
  }
});

test('malformed dates, future dates, invalid URLs, and invalid source metadata are rejected', async (t) => {
  const f = await fixture(t);
  const bad = [
    { date: '2024-02-30' }, { date: '2023-02-29' }, { date: '9999-01-01' }, { date: '2024-7-1' },
    { link: '#' }, { link: 'javascript:alert(1)' }, { link: '/research' }, { link: 'https://user:password@example.org/note' },
    { type: 'invented-type' }, { title: '' }, { description: 'x'.repeat(801) }, { tags: 'research' },
    { sources: [] },
    { sources: [{ ...sample.sources[0], checkedAt: '2024-02-30T12:00:00Z' }] },
    { sources: [{ ...sample.sources[0], checkedAt: '2024-07-11T25:00:00Z' }] },
    { sources: [{ ...sample.sources[0], url: 'file:///tmp/email.txt' }] },
    { sources: [{ ...sample.sources[0], kind: 'unknown' }] },
  ];
  for (const patch of bad) await assert.rejects(f.add({ ...sample, ...patch }), JSON.stringify(patch));
  assert.equal(await readFile(f.newsFile, 'utf8'), 'updates: []\n');
});

test('known legacy types and placeholder links pass check with warnings', async (t) => {
  const legacyTypes = ['status', 'training', 'media', 'service', 'presentation', 'milestone'];
  const updates = legacyTypes.map((type, index) => ({ ...sample, type, title: `Legacy ${index}`, link: '#', sources: undefined }));
  const f = await fixture(t, yaml.dump({ updates }));
  const result = await f.command('check');
  assert.equal(result.result, 'valid');
  assert.equal(result.count, legacyTypes.length);
  assert.equal(result.warnings.length, legacyTypes.length);
});

test('check reports missing local news images and invalid public content', async (t) => {
  const f = await fixture(t, yaml.dump({ updates: [{ ...sample, sources: undefined, image: '/images/missing.png' }] }));
  const result = await f.command('check');
  assert.equal(result.result, 'invalid');
  assert.match(result.errors[0], /Missing local image/);
  await writeFile(f.newsFile, 'updates: [{date: "2024-02-30"}]\n');
  assert.equal((await f.command('check')).result, 'invalid');
});

test('rejected drafts cannot be approved or applied and deduplicate future intake', async (t) => {
  const f = await fixture(t);
  const { record } = await f.add();
  await f.command('reject', record.id, '--note', 'Do not publish this private event.');
  await assert.rejects(f.command('approve', record.id, '--note', 'Attempt'), /Only pending/);
  await assert.rejects(f.command('apply', record.id), /requires explicit approval/);
  assert.equal((await f.add()).record.status, 'rejected');
});

test('revisions reset previous approval and cannot collide with another draft', async (t) => {
  const f = await fixture(t);
  const { record } = await f.add();
  await f.command('approve', record.id, '--note', 'User approved the original wording.');
  const input = path.join(f.root, 'revision.json');
  await writeFile(input, JSON.stringify({ ...sample, description: 'The corrected proposed wording.' }));
  const revised = await f.command('revise', record.id, '--input', input);
  assert.equal(revised.record.status, 'pending');
  assert.equal(revised.record.revisionCount, 1);
  assert.equal(revised.record.approval, undefined);
  assert.equal(revised.record.news.description, 'The corrected proposed wording.');
  await assert.rejects(f.command('apply', record.id), /requires explicit approval/);
  const other = { ...sample, title: 'Separate event', link: 'https://example.org/separate', sources: [{ ...sample.sources[0], url: 'https://example.org/separate' }] };
  await f.add(other);
  await writeFile(input, JSON.stringify(other));
  await assert.rejects(f.command('revise', record.id, '--input', input), /duplicates another draft/);
  assert.equal((await f.command('show', record.id)).record.news.description, 'The corrected proposed wording.');
});

test('queue lock blocks mutation and is never removed by a competing operation', async (t) => {
  const f = await fixture(t);
  await f.command('init');
  const lock = path.join(path.dirname(f.queueFile), '.lock');
  await writeFile(lock, 'active-lock');
  await assert.rejects(f.add(), /Another update operation/);
  assert.equal(await readFile(lock, 'utf8'), 'active-lock');
  assert.equal((await f.command('list')).records.length, 0);
});

test('destination lock blocks apply without changing news or the approved status', async (t) => {
  const f = await fixture(t);
  const { record } = await f.add();
  await f.command('approve', record.id, '--note', 'User approved the evidence and wording.');
  const lock = `${f.newsFile}.website-updates.lock`;
  await writeFile(lock, 'active-lock');
  await assert.rejects(f.command('apply', record.id), /Another update operation/);
  assert.equal(await readFile(f.newsFile, 'utf8'), 'updates: []\n');
  assert.equal(await readFile(lock, 'utf8'), 'active-lock');
  assert.equal((await f.command('show', record.id)).record.status, 'approved');
});

test('malformed private queue is never overwritten by init or add', async (t) => {
  const f = await fixture(t);
  await f.command('init');
  await writeFile(f.queueFile, '{broken');
  await assert.rejects(f.command('init'), /malformed JSON/);
  await assert.rejects(f.add(), /malformed JSON/);
  assert.equal(await readFile(f.queueFile, 'utf8'), '{broken');
});

test('IDs reject traversal and new private files have restricted permissions', async (t) => {
  const f = await fixture(t);
  const { record } = await f.add();
  await assert.rejects(f.command('show', '../../content/news.yaml'), /UUID/);
  assert.equal((await stat(f.queueFile)).mode & 0o777, 0o600);
  assert.equal((await stat(path.dirname(f.queueFile))).mode & 0o777, 0o700);
  assert.equal((await f.command('show', record.id)).record.id, record.id);
});
