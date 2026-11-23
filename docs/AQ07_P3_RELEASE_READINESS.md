# AQ-07-P3 — Local Git and MIT readiness

> Historical pre-publication snapshot. For current status, see the [README](../README.md).

**Result: PASS WITH FINDINGS.** The public candidate is a local Git repository on branch `main`, with **no HEAD commit, no staged files and no remote**. The original project root is not a Git repository. Nothing has been pushed, deployed or published.

## License and provenance

Alkyora explicitly approved MIT in AQ-07-P3. `LICENSE` is byte-identical to the original MIT text with `Copyright (c) 2026 Alkyora`; SHA-256: `D3A5266C5190058D4DAB5844107A0A22287C1C3DA619B8335E412A1C42FA52C7`. The [provenance review](LICENSE_AND_PROVENANCE_REVIEW.md) found no bundled library, downloaded font, image, media file or external runtime asset needing an additional notice. This local scan cannot independently establish authorship of every line; Alkyora's authorization is recorded, and the final owner should review branding and prose before publication.

## Application integrity and tests

From this candidate, `node --test tests/*.test.mjs` passed **25/25**, with 0 failures and 0 skips. The local browser on `127.0.0.1:4177` completed all three focused missions at 100/100 and generated a Workbench Markdown plan with a Safety gate. The page's Network events showed local GETs for the document, CSS, two modules and favicon only; no external page request or POST was observed. localStorage, sessionStorage, cookies, IndexedDB, Cache Storage and service-worker registrations were empty; reload and a fresh private context reset practice state. These checks do not audit all browser extensions, hosting or browser configurations.

The engine, tests and CSS match the original project exactly. Candidate-only text changes remain in `index.html`, `src/app.mjs` and `docs/PRODUCT_BRIEF.md`; no scoring code or budget changed. Current SHA-256:

| File | Candidate hash | Source comparison |
|---|---|---|
| `index.html` | `2AD8E0CBA541B68B8A1E887A78EA1086339149AA125ED24B10AFC7601440FA39` | Candidate wording only |
| `assets/app.css` | `91C391EFD302D6FFB164E910AE22D1734F71363DAA55A44BADE712001C045F64` | Identical |
| `src/app.mjs` | `879FD8AA54DF9194AE9147D06D9AA0EF727D5E80304F4AE9555E60E720FBA67F` | Candidate label only |
| `src/engine.mjs` | `BEBE77208394E4EEB604F9A65D0924E7F3B82B4348E711AB547BCEF7CB82E6E8` | Identical |
| `tests/engine.test.mjs` | `21C5CCA6E858548FFCA3A11FE1C5AEFFF07251D3BEAC88082012496348894FD7` | Identical |

Port 4173 on this machine was already serving another local site. The candidate was therefore tested on 4177 with its directory specified explicitly. The README now says how to choose an unused port and verify the candidate label. On the candidate server, `/` and `/LICENSE` returned 200; facilitator key and pilot-rubric paths returned 404.

## First commit inventory — proposed, not staged

The following **19 paths** are the intended first-commit set. This report itself is included. Re-run `git ls-files --others --exclude-standard` and `git add --dry-run -A` immediately before any future commit; do not rely solely on this static list.

```text
.gitignore
CONTRIBUTING.md
LICENSE
README.md
assets/app.css
docs/AQ07_P3_RELEASE_READINESS.md
docs/DEMO_GUIDE.md
docs/GITHUB_PUBLICATION_PLAN.md
docs/LICENSE_AND_PROVENANCE_REVIEW.md
docs/NARRATOR_CHECK.md
docs/PRODUCT_BRIEF.md
docs/PUBLIC_INVENTORY.md
docs/SCORING_RUBRIC.md
docs/SECURITY_MODEL.md
docs/VERIFICATION_REPORT.md
index.html
src/app.mjs
src/engine.mjs
tests/engine.test.mjs
```

The candidate `.gitignore` was checked with `git check-ignore --no-index`: pilot package, pilot docs, pilot data/results, private storage, ACL, patch and environment-file probes were ignored. Public files such as LICENSE, README, app and tests were not ignored. The final staged list must still be inspected because `.gitignore` does not protect tracked or forcibly added files.

## Privacy and accessibility status

No facilitator keys, reserved PRE/POST cases, pilot rubric, ACL backup, individual result or private directory is present in the candidate. A scan found no personal Windows path, private-key marker or new external runtime call. Alkyora reports a satisfactory manual Narrator check; this review did **not** observe its speech or configuration, and does not claim independent accessibility conformance. The [repeatable checklist](NARRATOR_CHECK.md) remains available.

## Recommendation and remaining gates

**GO** to authorize a first **local** commit after rechecking the exact staged inventory. **NO-GO** for creating a public GitHub repository, pushing or deploying within AQ-07-P3; those actions need separate authorization. Before public release, Alkyora should confirm final branding/prose ownership, retain MIT attribution, review the staged files and repeat the privacy/network check against the chosen hosting configuration. Practice scores are not certification or measured learning gains.
