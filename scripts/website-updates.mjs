#!/usr/bin/env node
import { randomUUID } from 'node:crypto';
import { constants } from 'node:fs';
import { access, mkdir, open, readFile, rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = new Set(['publication', 'conference', 'award', 'collaboration', 'position', 'certification', 'opensource', 'talk', 'milestone', 'training', 'media', 'service', 'presentation', 'status']);
const STATUSES = new Set(['pending', 'approved', 'rejected', 'applied']);
const ID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const HELP = `Website update drafts (nothing publishes automatically)
  node scripts/website-updates.mjs init
  node scripts/website-updates.mjs add --input /absolute/path/draft.json
  node scripts/website-updates.mjs list
  node scripts/website-updates.mjs show ID
  node scripts/website-updates.mjs revise ID --input /absolute/path/revised-draft.json
  node scripts/website-updates.mjs approve ID --note "Evidence checked; user approved this wording"
  node scripts/website-updates.mjs reject ID [--note "Reason"]
  node scripts/website-updates.mjs apply ID
  node scripts/website-updates.mjs check
Use --root PATH for an isolated checkout or test fixture. Apply changes the local news file only.`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function object(value, label) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label} must be an object`);
}

function string(value, label, max) {
  assert(typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max, `${label} must be a nonempty string of at most ${max} characters`);
  assert(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value), `${label} contains control characters`);
  return value.trim();
}

function date(value, label = 'date') {
  assert(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value), `${label} must be YYYY-MM-DD`);
  const parsed = new Date(`${value}T00:00:00.000Z`);
  assert(Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value, `${label} must be a real calendar date`);
  assert(value <= new Date().toISOString().slice(0, 10), `${label} cannot be in the future`);
  return value;
}

function checkedAt(value) {
  assert(typeof value === 'string', 'source.checkedAt must be an ISO date or timestamp');
  date(value.slice(0, 10), 'source.checkedAt');
  if (value.length === 10) return value;
  assert(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value), 'source.checkedAt timestamp must use UTC ISO format');
  const parsed = new Date(value);
  assert(Number.isFinite(parsed.getTime()) && parsed.getTime() <= Date.now(), 'source.checkedAt must be valid and cannot be in the future');
  assert(parsed.toISOString().slice(0, 19) === value.slice(0, 19), 'source.checkedAt must be a real time');
  return value;
}

function url(value, label, { document = false } = {}) {
  const input = string(value, label, 2048);
  assert(!/\s|\\/.test(input), `${label} cannot contain whitespace or backslashes`);
  assert(/^(https?:\/\/|file:\/\/\/)/i.test(input), `${label} must be an absolute HTTP(S)${document ? ' or file' : ''} URL`);
  let parsed;
  try { parsed = new URL(input); } catch { throw new Error(`${label} must be a valid URL`); }
  assert(parsed.protocol === 'http:' || parsed.protocol === 'https:' || (document && parsed.protocol === 'file:'), `${label} uses an unsupported URL scheme`);
  assert(!parsed.username && !parsed.password, `${label} cannot contain credentials`);
  if (parsed.protocol === 'file:') {
    assert(!parsed.host && parsed.pathname.startsWith('/') && !parsed.search, `${label} must refer to an absolute local document`);
  } else {
    assert(Boolean(parsed.hostname), `${label} must contain a host`);
  }
  return parsed.href;
}

function news(value, { legacy = false, warnings = [] } = {}) {
  object(value, 'news item');
  const result = {
    date: date(value.date),
    title: string(value.title, 'title', 180),
    description: string(value.description, 'description', 800),
    type: string(value.type, 'type', 40),
  };
  assert(TYPES.has(result.type), `Unknown news type: ${result.type}`);
  assert(Array.isArray(value.tags) && value.tags.length <= 12, 'tags must be an array of at most 12 strings');
  result.tags = [...new Set(value.tags.map((tag) => string(tag, 'tag', 60)))];
  if (value.link !== undefined) {
    if (legacy && value.link === '#') {
      result.link = '#';
      warnings.push(`Placeholder link: ${result.title}`);
    } else result.link = url(value.link, 'link');
  }
  return result;
}

function sources(value) {
  assert(Array.isArray(value) && value.length > 0 && value.length <= 20, 'sources must contain 1–20 concise references');
  return value.map((source) => {
    object(source, 'source');
    assert(['public', 'email', 'document'].includes(source.kind), 'source.kind must be public, email, or document');
    return {
      kind: source.kind,
      url: url(source.url, 'source.url', { document: source.kind === 'document' }),
      label: string(source.label, 'source.label', 200),
      checkedAt: checkedAt(source.checkedAt),
    };
  });
}

function normalized(value) {
  return value.normalize('NFKC').toLocaleLowerCase('en').replace(/\s+/gu, ' ').trim();
}

function realLink(value) {
  if (!value || value === '#') return undefined;
  const parsed = new URL(value);
  parsed.hash = '';
  for (const key of [...parsed.searchParams.keys()]) {
    if (key.startsWith('utm_') || ['fbclid', 'gclid'].includes(key)) parsed.searchParams.delete(key);
  }
  parsed.searchParams.sort();
  return parsed.href.replace(/\/$/, '');
}

function sameNews(a, b) {
  return (a.date === b.date && normalized(a.title) === normalized(b.title)) ||
    (Boolean(realLink(a.link)) && realLink(a.link) === realLink(b.link));
}

function matchingDraft(records, candidate) {
  const references = new Set(candidate.sources.map((source) => source.url));
  return records.find((record) => sameNews(record.news, candidate.news) || record.sources.some((source) => references.has(source.url)));
}

function validateId(id) {
  assert(typeof id === 'string' && ID_PATTERN.test(id), 'ID must be a draft UUID, without paths or traversal');
  return id;
}

function paths(root) {
  const directory = path.join(root, '.private', 'website-updates');
  return { directory, queue: path.join(directory, 'queue.json'), lock: path.join(directory, '.lock'), news: path.join(root, 'content', 'news.yaml') };
}

async function atomicWrite(filename, value, mode = 0o600) {
  const temporary = `${filename}.${randomUUID()}.tmp`;
  let handle;
  try {
    handle = await open(temporary, 'wx', mode);
    await handle.writeFile(value, 'utf8');
    await handle.sync();
    await handle.close();
    handle = undefined;
    await rename(temporary, filename);
  } finally {
    if (handle) await handle.close();
    await unlink(temporary).catch((error) => { if (error.code !== 'ENOENT') throw error; });
  }
}

async function withLock(filename, operation) {
  let handle;
  try {
    handle = await open(filename, 'wx', 0o600);
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error(`Another update operation holds ${filename}. Wait for it to finish; do not remove an active lock.`);
    throw error;
  }
  try {
    await handle.writeFile(JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }));
    return await operation();
  } finally {
    await handle.close();
    await unlink(filename);
  }
}

async function readQueue(filename, { allowMissing = false } = {}) {
  let bytes;
  try { bytes = await readFile(filename, 'utf8'); } catch (error) {
    if (allowMissing && error.code === 'ENOENT') return { version: 1, records: [] };
    if (error.code === 'ENOENT') throw new Error('Draft queue is not initialized. Run init first.');
    throw error;
  }
  let queue;
  try { queue = JSON.parse(bytes); } catch { throw new Error('Draft queue is malformed JSON; it was left untouched.'); }
  object(queue, 'queue');
  assert(queue.version === 1 && Array.isArray(queue.records), 'Unsupported or malformed draft queue; it was left untouched.');
  const ids = new Set();
  for (const record of queue.records) {
    object(record, 'record');
    validateId(record.id);
    assert(!ids.has(record.id), 'Draft queue contains duplicate IDs');
    ids.add(record.id);
    assert(STATUSES.has(record.status), 'Draft queue contains an invalid status');
    news(record.news);
    sources(record.sources);
    if (['approved', 'applied'].includes(record.status)) {
      object(record.approval, 'approval');
      string(record.approval.note, 'approval.note', 1000);
    }
  }
  return queue;
}

async function saveQueue(filename, queue) {
  await atomicWrite(filename, `${JSON.stringify(queue, null, 2)}\n`);
}

async function readNews(filename) {
  const bytes = await readFile(filename, 'utf8');
  let document;
  try { document = yaml.load(bytes, { schema: yaml.JSON_SCHEMA }); }
  catch { throw new Error('content/news.yaml is malformed YAML; it was left untouched.'); }
  object(document, 'content/news.yaml');
  assert(Array.isArray(document.updates), 'content/news.yaml must contain an updates array; it was left untouched.');
  const warnings = [];
  document.updates.forEach((item, index) => {
    try { news(item, { legacy: true, warnings }); }
    catch (error) { throw new Error(`Existing news item ${index + 1}: ${error.message}; content/news.yaml was left untouched.`); }
  });
  return { document, warnings };
}

async function checkNews(filename, root) {
  const errors = [];
  let warnings = [];
  let count = 0;
  try {
    const loaded = await readNews(filename);
    warnings = loaded.warnings;
    count = loaded.document.updates.length;
    for (let index = 0; index < count; index += 1) {
      const item = loaded.document.updates[index];
      if (loaded.document.updates.slice(0, index).some((previous) => sameNews(previous, item))) warnings.push(`Possible duplicate news: ${item.title}`);
      for (const key of ['image', 'thumbnail']) {
        const reference = item[key];
        if (typeof reference !== 'string' || !reference.startsWith('/') || reference.startsWith('//')) continue;
        const asset = path.resolve(root, 'public', reference.slice(1).split(/[?#]/)[0]);
        if (!asset.startsWith(`${path.resolve(root, 'public')}${path.sep}`)) {
          errors.push(`Invalid local ${key}: ${reference}`);
          continue;
        }
        try { await access(asset, constants.R_OK); } catch { errors.push(`Missing local ${key}: ${reference}`); }
      }
    }
  } catch (error) { errors.push(error.message); }
  return { result: errors.length ? 'invalid' : 'valid', count, warnings, errors };
}

function parseArguments(argv) {
  const options = {};
  const positional = [];
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument.startsWith('--')) {
      if (argument === '--help') return { command: 'help', options: {}, positional: [] };
      assert(['--root', '--input', '--note'].includes(argument), `Unknown option: ${argument}`);
      assert(options[argument.slice(2)] === undefined, `Repeated option: ${argument}`);
      const value = argv[++index];
      assert(value && !value.startsWith('--'), `${argument} needs a value`);
      options[argument.slice(2)] = value;
    } else positional.push(argument);
  }
  return { command: positional.shift() || 'help', positional, options };
}

export async function run(argv) {
  const { command, positional, options } = parseArguments(argv);
  if (command === 'help') return { help: HELP };
  assert(['init', 'add', 'list', 'show', 'revise', 'approve', 'reject', 'apply', 'check'].includes(command), `Unknown command: ${command}`);
  const needsId = ['show', 'revise', 'approve', 'reject', 'apply'].includes(command);
  assert(positional.length === (needsId ? 1 : 0), `${command} ${needsId ? 'requires exactly one ID' : 'does not accept positional arguments'}`);
  if (needsId) validateId(positional[0]);
  assert(options.input === undefined || ['add', 'revise'].includes(command), '--input is only valid with add or revise');
  assert(options.note === undefined || ['approve', 'reject'].includes(command), '--note is only valid with approve or reject');
  if (command === 'approve') string(options.note, 'An evidence and approval note', 1000);
  const root = path.resolve(options.root || DEFAULT_ROOT);
  const files = paths(root);
  if (command === 'check') return checkNews(files.news, root);
  if (['list', 'show'].includes(command)) {
    const queue = await readQueue(files.queue);
    if (command === 'list') return { records: queue.records.map(({ id, status, news: item }) => ({ id, status, date: item.date, title: item.title })) };
    const record = queue.records.find((item) => item.id === positional[0]);
    assert(record, `No draft found for ID ${positional[0]}`);
    return { record };
  }
  let candidate;
  if (['add', 'revise'].includes(command)) {
    assert(options.input, `${command} requires --input FILE containing a JSON draft`);
    let payload;
    try { payload = JSON.parse(await readFile(path.resolve(options.input), 'utf8')); }
    catch (error) { throw new Error(`Cannot read draft JSON: ${error.message}`); }
    object(payload, 'draft');
    candidate = { news: news(payload), sources: sources(payload.sources) };
  }
  await mkdir(files.directory, { recursive: true, mode: 0o700 });
  return withLock(files.lock, async () => {
    const queue = await readQueue(files.queue, { allowMissing: command === 'init' || command === 'add' });
    if (command === 'init') {
      await saveQueue(files.queue, queue);
      return { result: 'initialized', queue: files.queue, count: queue.records.length };
    }
    const now = new Date().toISOString();
    if (command === 'add') {
      const duplicate = matchingDraft(queue.records, candidate);
      if (duplicate) return { result: 'duplicate', record: duplicate };
      const record = { id: randomUUID(), status: 'pending', createdAt: now, updatedAt: now, ...candidate };
      queue.records.push(record);
      await saveQueue(files.queue, queue);
      return { result: 'added', record };
    }
    const record = queue.records.find((item) => item.id === positional[0]);
    assert(record, `No draft found for ID ${positional[0]}`);
    if (command === 'revise') {
      assert(['pending', 'approved'].includes(record.status), `Only pending or approved drafts can be revised (current status: ${record.status})`);
      const duplicate = matchingDraft(queue.records.filter((item) => item.id !== record.id), candidate);
      assert(!duplicate, `Revised draft duplicates another draft: ${duplicate?.id}`);
      record.news = candidate.news;
      record.sources = candidate.sources;
      record.status = 'pending';
      record.revisionCount = (record.revisionCount || 0) + 1;
      delete record.approval;
    } else if (command === 'approve') {
      if (record.status === 'approved') return { result: 'already_approved', record };
      assert(record.status === 'pending', `Only pending drafts can be approved (current status: ${record.status})`);
      record.status = 'approved';
      record.approval = { note: string(options.note, 'approval note', 1000), at: now };
    } else if (command === 'reject') {
      if (record.status === 'rejected') return { result: 'already_rejected', record };
      assert(record.status !== 'applied', 'An applied draft cannot be rejected; review a separate correction.');
      record.status = 'rejected';
      record.rejection = { note: options.note ? string(options.note, 'rejection note', 1000) : 'Rejected after review.', at: now };
    } else if (command === 'apply') {
      if (record.status === 'applied') return { result: 'already_applied', record };
      assert(record.status === 'approved', `Apply requires explicit approval with an evidence note (current status: ${record.status})`);
      return withLock(`${files.news}.website-updates.lock`, async () => {
        const { document, warnings } = await readNews(files.news);
        const duplicate = document.updates.some((item) => sameNews(item, record.news));
        if (!duplicate) {
          // Only this explicit projection may enter the site's public content.
          document.updates.push(news(record.news));
          document.updates.sort((a, b) => b.date.localeCompare(a.date));
          await atomicWrite(files.news, yaml.dump(document, { lineWidth: -1, noRefs: true, sortKeys: false }), 0o644);
        }
        // If saving the queue fails after the news write, a retry finds the same
        // public item above and finishes recording the application without adding it twice.
        record.status = 'applied';
        record.appliedAt = now;
        record.updatedAt = now;
        record.application = { matchedExistingNews: duplicate };
        await saveQueue(files.queue, queue);
        return { result: duplicate ? 'matched_existing_news' : 'applied_locally', record, warnings };
      });
    }
    record.updatedAt = now;
    await saveQueue(files.queue, queue);
    return { result: record.status, record };
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run(process.argv.slice(2)).then((result) => {
    process.stdout.write(`${result.help || JSON.stringify(result, null, 2)}\n`);
    if (result.errors?.length) process.exitCode = 1;
  }).catch((error) => {
    process.stderr.write(`Website updates: ${error.message}\n`);
    process.exitCode = 1;
  });
}
