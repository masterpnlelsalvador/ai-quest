# AI Quest v0.1 — Public release candidate

AI Quest is a static browser exercise for practicing decisions around AI use. It helps people choose useful evidence without exposing sensitive information, carry a focused handoff into a new session, and plan an efficient investigation. Its scores describe choices in three **fictional scenarios**. They are not a certification, a security audit, or proof of workplace competence.

**Status:** local release candidate for review. It has not been published or deployed. The candidate includes the [MIT License](LICENSE) with Copyright (c) 2026 Alkyora.

## Run locally

You need Python 3 to serve the site. From this directory:

```sh
python -m http.server 4173 --bind 127.0.0.1 --directory .
```

Open `http://127.0.0.1:4173/` on the same computer and confirm the home page says “MIT-licensed candidate.” On Windows, `py -m http.server 4173 --bind 127.0.0.1 --directory .` is an alternative. If port 4173 is already in use, choose an unused port and use that number in the URL. Stop the server with Ctrl+C. Opening `index.html` directly may block JavaScript modules in some browsers. There is no installation step, account, API key, npm package, backend or paid service.

## Use the exercises

Choose **Start the challenge** or **Missions**, then open a mission:

1. **The Secret Leak:** select the smallest useful excerpt of a synthetic incident log. After evaluation, read the explanation for all eight lines, including why a line belongs or should be protected.
2. **Context Collapse:** select the facts needed for a useful handoff and leave out noise.
3. **The Token Trap:** order simulated investigation, verification and handoff actions within a 100-point game budget. The exercise does not perform a repair.

Each mission has deterministic rules and explains its result. See [the rubric](docs/SCORING_RUBRIC.md). A critical unsafe choice can fail even when other selections are good. Points are invented for training; they are not real tokens, cost or productivity measurements. Reloading resets selections and scores.

## AI Workbench

Open **Workbench**, choose a task type, information classification and session stage, then generate a Markdown work plan. It is a template, not an AI response or a policy approval. **Copy Markdown** and **Download .md** are explicit local actions; avoid both if you do not want an artifact. Never enter or paste real credentials, customer records or corporate material into this demo.

## Tests and structure

With Node.js installed, run `node --test tests/*.test.mjs`. The tests use built-in Node features and no dependencies. `index.html` and `assets/app.css` provide the interface; `src/app.mjs` renders it; `src/engine.mjs` holds synthetic scenarios and scoring; `tests/engine.test.mjs` checks deterministic behavior. [The security model](docs/SECURITY_MODEL.md) explains the local trust boundary.

## Contribute

Read [CONTRIBUTING.md](CONTRIBUTING.md). Useful contributions include clearer feedback, accessible interactions, translations and synthetic missions with explicit rules and regression tests. Do not submit real work data or new network services. No public repository or contribution process is open yet.

## Verified scope and limits

This candidate is checked by automated scoring tests and a local static-site check; see [verification](docs/AQ07_P3_RELEASE_READINESS.md). Prior local checks found no automatic answer storage or application requests to external services. Alkyora reports a satisfactory manual Narrator check; this review did not independently hear or repeat it. See the [Narrator procedure](docs/NARRATOR_CHECK.md). Broad human learning validation remains pending. Browser extensions, hosting configuration and browser-owned caches are outside the static application's guarantees. A supervised usability observation does not demonstrate learning.

The source contains only synthetic example data. Do not treat the practice score as a hiring, employee-ranking or compliance measure. Public release and hosting require separate authorization; see the [license and provenance review](docs/LICENSE_AND_PROVENANCE_REVIEW.md).
