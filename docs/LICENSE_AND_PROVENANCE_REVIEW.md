# AQ-07-P3 — License and provenance review

**Decision:** Alkyora explicitly approved MIT for this candidate in AQ-07-P3. The original `LICENSE` was copied byte for byte; both copies have SHA-256 `D3A5266C5190058D4DAB5844107A0A22287C1C3DA619B8335E412A1C42FA52C7`. This does not authorize creating a public repository or deploying the site.

The original project's `LICENSE` contains the standard MIT permission, notice-retention and warranty-disclaimer text, with `Copyright (c) 2026 Alkyora`. Its permission and notice language match the [SPDX MIT record](https://spdx.org/licenses/MIT) and the [Open Source Initiative MIT text](https://opensource.org/license/mit). The copyright line states a claimed holder; it does not independently prove authorship or authority to license every file.

## Local provenance evidence

The candidate uses handwritten HTML, CSS and JavaScript modules. There is no package manifest, vendored library, downloaded font, image, media asset or external runtime script in the candidate. The CSS lists `Inter` as an optional installed font and falls back to system fonts; it does not import or bundle Inter. Decorative symbols are text glyphs. The fictional log uses `example.invalid`, a documentation address and `FAKE_DEMO_KEY_NOT_REAL`. No additional third-party license notice was found in the candidate.

This file inventory cannot independently establish who authored each line. The original project has no Git history to trace provenance. Alkyora's explicit MIT authorization is recorded for this candidate, and the scan found no contradictory third-party notices. The branding, prose and scenarios should still receive a final owner review before publication. Preserve any notices that a later provenance review finds necessary; review the complete staged file list before a commit or publication.

## Pending publication gate

The candidate README links the copied MIT license, and the interface says “MIT-licensed candidate.” It does not claim that a public repository exists. The original project and its `LICENSE` remain unchanged. Public repository creation and hosting still require separate authorization.
