# Content-only production release

The production website has content corrections and a visual baseline that are not fully represented by the older `main` checkout. Do not deploy unrelated unfinished local UI work.

This release overlays the scoped source content on the verified September 9 production output (`dpl_9ZigdTna3xdgLhX8N48wFhLKRygH`). The source content and text-only component edits are versioned on this branch. CSS, fonts, images, layout, and interaction logic stay at that baseline. Client module filenames are refreshed when their wording or imports change so immutable caches cannot retain stale copy.

Use a fresh copy of the baseline output in an isolated release directory. Restore the pinned function runtime with its saved package lock, then run:

```sh
npm ci --ignore-scripts --no-audit --no-fund --prefix "$RELEASE_DIRECTORY/.vercel/output/functions/__nitro.func"
node scripts/release-content-overlay.cjs "$RELEASE_DIRECTORY"
NODE_ENV=production node scripts/render-content-release.mjs "$RELEASE_DIRECTORY"
```

Run each overlay on a fresh baseline; it is not an incremental build. Verify rendered routes, payloads, client navigation, research dialogs, news search, mobile overflow, private-path exclusion, and unchanged style/font/resume hashes. Deploy the validated output using the existing Vercel project with `--prebuilt`, recording the exact source commit and baseline deployment in metadata. Verify READY provider state and the custom-domain alias before reporting publication.

Private review records and application PDFs must remain outside the deployed output and Git. Current manuscripts are described as Manuscript or Under Review; no private manuscript downloads or employment announcements are included. Existing publication metadata and public resume remain at their previously verified production values.
