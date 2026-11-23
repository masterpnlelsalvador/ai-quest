# Public candidate inventory

This inventory applies only to the separate `release/ai-quest-public-rc/` copy. The source project was not edited for packaging.

| Included path | Purpose |
|---|---|
| `index.html`, `assets/app.css` | Static interface and styles |
| `src/app.mjs`, `src/engine.mjs` | UI logic, synthetic data, deterministic scoring and AQ-05E explanations |
| `tests/engine.test.mjs` | Technical regression tests |
| `README.md`, `CONTRIBUTING.md`, `.gitignore`, `LICENSE` | Usage, contribution boundaries, local exclusions and approved MIT license |
| `docs/PRODUCT_BRIEF.md`, `docs/SCORING_RUBRIC.md`, `docs/SECURITY_MODEL.md` | Public educational and technical context |
| `docs/DEMO_GUIDE.md`, this inventory, `docs/VERIFICATION_REPORT.md` | Demonstration and release review |
| `docs/LICENSE_AND_PROVENANCE_REVIEW.md`, `docs/NARRATOR_CHECK.md`, `docs/AQ07_P3_RELEASE_READINESS.md` | Licensing, Narrator report and current release check |

**Excluded from the source project:** `pilot-package/` including facilitator keys, participant PRE/POST and the duplicate site; `docs/pilot/` including evaluation cases and rubric; `docs/AQ05D_ZERO_RETENTION_GUIDE.md` (controlled pilot operation); `AI_Quest_AQ02_Fix.patch`; `docs/CODEX_MISSION_01.md`; `docs/ROADMAP.md` (internal release gates); `docs/DEMO_90_SECONDS.md` and `docs/INICIO_RAPIDO_ES.md` (older drafts with stale or personal paths); and the source README, CONTRIBUTING and .gitignore (replaced with candidate-specific versions). The original `LICENSE` was copied after Alkyora's AQ-07-P3 authorization. No individual results or private storage files were copied.

The candidate has no declared external dependency or asset. The presence of a `.gitignore` is not a substitute for reviewing staged files before any future commit or publication.

In AQ-07-P2 and P3, candidate-only editorial wording changed in `index.html`, `src/app.mjs` and `docs/PRODUCT_BRIEF.md`. Scoring and interactions were not changed. Current hashes and differences are in `AQ07_P3_RELEASE_READINESS.md`; `VERIFICATION_REPORT.md` records the earlier P2 snapshot.
