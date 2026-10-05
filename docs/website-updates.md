# Website updates for review

New findings become private drafts. The public website and its design stay unchanged until you approve specific wording and ask to apply it. Applying a draft edits the local news file; it does not commit, push, deploy, or send a message.

Drafts live in `.private/website-updates/queue.json`, outside the site's content directory. This directory must stay excluded from Git and deployment uploads. It stores short proposed news copy and source references, never raw email bodies, attachments, or full application documents. Email and application material should be summarized privately and included in public wording only with your explicit approval.

## Reviewing updates

From the project directory:

```sh
node scripts/website-updates.mjs init
node scripts/website-updates.mjs list
node scripts/website-updates.mjs show DRAFT_ID
```

Review the wording, event date, and referenced evidence. Then approve or reject the draft:

```sh
node scripts/website-updates.mjs approve DRAFT_ID --note "I checked the evidence and approve this wording."
node scripts/website-updates.mjs reject DRAFT_ID --note "Do not include this update."
```

To change proposed wording or evidence, prepare a complete replacement JSON draft using the structure below and run `node scripts/website-updates.mjs revise DRAFT_ID --input .private/website-updates/revised.json`. This keeps the draft ID, checks for duplicates, and resets any prior approval to pending. Applied or rejected drafts cannot be revised; a public correction needs a separate review.

Approval is a manual review record, not an authentication system. Scheduled runs must never approve or apply drafts. A request to prepare drafts does not authorize either action. Rejected drafts remain in the queue so the same finding does not keep returning.

After you explicitly ask to apply an approved draft:

```sh
node scripts/website-updates.mjs apply DRAFT_ID
node scripts/website-updates.mjs check
```

Only the public news fields are copied into `content/news.yaml`. Source references, review notes, and private metadata stay in the queue. New content is sorted by date. Reapplying a draft does not add it twice. Existing `#` links are reported as warnings; new drafts require a real HTTP(S) link or no link.

## Preparing a draft

Save a JSON file inside the private directory, then import it:

```sh
node scripts/website-updates.mjs add --input .private/website-updates/candidate.json
```

Example structure (replace the example with actual verified facts):

```json
{
  "date": "2026-09-01",
  "title": "Published a research note",
  "description": "A brief description of the work and what readers can learn from it.",
  "type": "publication",
  "tags": ["Interpretability"],
  "link": "https://example.org/research-note",
  "sources": [
    {
      "kind": "public",
      "url": "https://example.org/research-note",
      "label": "Research note by the author",
      "checkedAt": "2026-09-07"
    }
  ]
}
```

The event date must be a real date that is not in the future. `checkedAt` is a real date or UTC ISO timestamp when the evidence was checked. Source kinds are `public`, `email`, and `document`. Use HTTP(S) references for public pages and email permalinks; local documents may use an absolute `file:///` reference. Labels should identify the source briefly, without copying private correspondence. Distinct findings in the same document need distinct fragment references, such as `file:///path/cv.pdf#research-role` and `file:///path/cv.pdf#publication`.

Supported types are `publication`, `conference`, `award`, `collaboration`, `position`, `certification`, `opensource`, `talk`, `milestone`, `training`, `media`, `service`, `presentation`, and `status`. Titles allow 180 characters, descriptions 800, up to 12 tags of 60 characters, and up to 20 sources with labels of 200 characters. Extra input fields are discarded. Do not place raw email or document content in an input file in the first place.

Duplicate findings reuse the existing draft when a source reference, normalized date/title, or real news link matches. Website content is checked for the same date/title or real link before an approved item is applied. This is a useful safeguard, not a replacement for checking whether two items describe the same event.

## Automation and maintenance

Daily intake and periodic profile reviews should read only the authorized sources, prepare concise drafts, and report meaningful new findings or blockers. When nothing changes, they should remain quiet. The script itself does not access an email account, schedule work, verify claims on the web, or publish; connected tools and the scheduled task handle source gathering.

Queue writes and news writes use atomic file replacement with exclusive locks. If applying the news succeeds but recording that application is interrupted, retrying detects the existing news item and completes the record. Malformed queue or news files are left untouched. A lock left by an interrupted process needs manual inspection: read its process ID, verify that the process has stopped, and only then remove that lock file. Never remove a live operation's lock.

`check` validates news fields and reports missing local news images or thumbnails. It does not audit every page, prove factual accuracy, or verify remote links. Use `--root /path/to/fixture` to test in an isolated directory. Run the workflow's checks with:

```sh
node --test tests/website-updates.test.mjs
```
