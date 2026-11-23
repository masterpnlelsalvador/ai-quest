# AQ-07-P2 — Local verification of public candidate

> Historical pre-publication verification. For current status, see the [README](../README.md).

**Historical snapshot.** License and Git status changed in AQ-07-P3; use [the current readiness report](AQ07_P3_RELEASE_READINESS.md) for the current candidate.

**Status:** PASS WITH FINDINGS as a local review artifact. No repository, commit, deployment or publication was created.

## Integrity and editorial differences

Five copied files still match the original project byte for byte. Three candidate-only text changes remove premature release claims; the source project remains unchanged:

| Path | Candidate SHA-256 | Compared with source |
|---|---|---|
| `index.html` | `2AD8E0CBA541B68B8A1E887A78EA1086339149AA125ED24B10AFC7601440FA39` | Different: description and footer wording only |
| `assets/app.css` | `91C391EFD302D6FFB164E910AE22D1734F71363DAA55A44BADE712001C045F64` | Identical |
| `src/app.mjs` | `D2FEF94B63C456A1E0B27045EC247ADECACA79A029F3C64D2210AFA384C16D5A` | Different: home-page label only |
| `src/engine.mjs` | `BEBE77208394E4EEB604F9A65D0924E7F3B82B4348E711AB547BCEF7CB82E6E8` | Identical |
| `tests/engine.test.mjs` | `21C5CCA6E858548FFCA3A11FE1C5AEFFF07251D3BEAC88082012496348894FD7` | Identical |
| `docs/PRODUCT_BRIEF.md` | `57C1336FADECF2014209C7AF8E9A3CBE3B516144C082396236C0F4FA7CFE118D` | Different: licensing status and promise wording only |
| `docs/SCORING_RUBRIC.md` | `A52097F9C05FAA96404D45F139DC9D0F49C971553DCC5A84622A7C39EDC7018A` | Identical |
| `docs/SECURITY_MODEL.md` | `294B7451D536DAD898759A85F30BBF27B73EF6DA4C3DC0C48F3A49ABC2013023` | Identical |

Rows without a difference note are identical to source. README, CONTRIBUTING, .gitignore, demo guide, inventory, license review, Narrator check and this report were authored for the candidate. No application logic or scoring differs from the source.

## Tests and browser flow

- From the candidate root, `node --test tests/*.test.mjs`: **25 tests passed, 0 failed, 0 skipped**. This includes safety-critical Secret Leak paths and AQ-05E explanation coverage.
- Followed the README command from a clean candidate root: `python -m http.server 4173 --bind 127.0.0.1`. The browser completed Secret Leak, Context Collapse and Token Trap on their focused routes, each with 100/100. Workbench generated a local Markdown plan with a Safety gate. The engine remains deterministic and the efficiency route states that no repair or resolution was performed.
- A separate browser check found the eight Secret Leak explanations absent before evaluation and present after correct and incorrect evaluations. The result received focus; editing a selection removed stale feedback.
- The page's Network events showed local GETs for the document, CSS, two modules and favicon only, with no external page request or POST in the tested flows. localStorage, sessionStorage, cookies, IndexedDB, Cache Storage and service-worker registrations were empty. Reloading and a fresh private context reset selections and results. This does not audit browser extensions, hosting infrastructure or every browser.

## Privacy and public boundary

The candidate contains no `pilot-package/`, `docs/pilot/`, PRE/POST material, answer key, ACL file, individual result or private storage directory. A path/name scan found none of those files. A content scan found no personal Windows path, private-key marker, credential-like token or network/storage API call; the only URL match was the local `127.0.0.1` instruction. The fictional key in `src/engine.mjs` is deliberately labeled `FAKE_DEMO_KEY_NOT_REAL`.

HTTP probes for facilitator keys, pilot rubric, private storage and `LICENSE` returned 404 from the candidate server. These results depend on serving this directory as the web root; serving its parent would be a different configuration.

## Findings before any public release

1. **License approval and provenance confirmation required.** The original project contains an MIT license, but it was not copied because this mission did not authorize a license choice. The candidate README does not grant reuse rights; see [license review](LICENSE_AND_PROVENANCE_REVIEW.md). The premature “Open-source starter” UI claim was removed from the candidate.
2. **Real Narrator test pending.** Keyboard and accessibility-structure checks from AQ-05E are available, but a real Narrator reading test has not been evidenced; use the [manual check](NARRATOR_CHECK.md) before claiming accessibility conformance.
3. **Human learning validity pending.** A supervised usability observation is not evidence of transferable learning. Do not make outcome claims or publish participant results.
4. **Final publication review pending.** Recheck the complete staged file list, license, branding and live hosting/network behavior after a repository and hosting destination are explicitly authorized.

The package's `.gitignore` is defense in depth, not a guarantee against previously tracked or manually copied private files. Git rules were not exercised because no repository was initialized.
