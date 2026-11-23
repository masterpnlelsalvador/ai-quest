# AI Quest — Transparent Practice Rubric v0.1

## Purpose

Each mission measures **decisions made in the simulation**, not a validated universal capability. Rules are deterministic. `src/engine.mjs` is canonical; this document is an explanation.

## Mission 1 — Secret Leak

Select from eight synthetic log lines:

- Four are useful diagnostic evidence (timestamp, HTTP failure, stack trace, recent change).
- Three contain categories of sensitive data (fictional email, fictional API key, fictional customer IP).
- One is harmless but irrelevant.

Scoring: 55 points for **no sensitive line selected** + up to 45 for relevant evidence completeness; subtract 5 for an irrelevant line. Including any sensitive line marks a **critical failure** and caps the score at 39. Passing requires **all four useful lines, no sensitive lines and no irrelevant lines**.

Note: The goal is data minimization. A production tool would also need organizational approval, legal/policy context and actual redaction validation. This demo is not such a tool.

After evaluation, the interface explains all eight synthetic lines: the reason for including or omitting each, a possible risk and a transferable practice. These explanations do not change the score or critical-failure rule and are not shown before evaluation.

## Mission 2 — Context Collapse

Five core facts (goal, approved decision, verified tests, open blocker, next action) and three pieces of noise. Score = `90 * important_fraction + 10 if no noise - 12 * noise_count`, capped to [0,100]. Passing requires:

- at least four of five important facts,
- **goal**, **approved decision** and **next action** present,
- no noise.

## Mission 3 — The Token Trap

A fictional incident with a 100-point action budget. Four essential decisions are: review recent change (10), inspect focused log (15), verify with test (20) and document handoff (10). Minimum viable route costs **55 simulated points**. The test must occur after both evidence-gathering actions, and the summary after the test.

Score starts at 100, loses `0.85 * max(0, spent - 55)`, 20 for wrong order, and 15 per missing essential action. Invalid/over-budget sessions and a blind production reset cannot pass. A blind reset is a critical error capped at 29. Passing requires completed ordered steps, at most 100 spent, no critical action and a score of at least 70. **Completing the required steps within the 100-point budget does not guarantee a pass**: for example, an ordered route costing exactly 100 points scores 62/100 and reports `Efficiency target not met`, not a success message. Repeated actions keep their existing v0.1 scoring and ordering behavior; this patch does not redefine those rules.

**Important:** Points do NOT map to actual tokens, money or measured runtime. They are a game design abstraction to teach allocation and verification. In a real project, quality and risk come before cost minimization.

## Reporting

- Mission result: score 0–100, pass/review, feedback and optional critical flag.
- Aggregate: arithmetic average of attempted missions, displayed as a **practice average**.
- No inferred job-readiness, expert status, certification or employer-facing staff rankings.
- Scores do not persist or transmit.

## Proposed future validity review

Pilot with 5–10 volunteers across job functions; observe ambiguous answer paths, clarity of feedback, false negatives and whether participants can apply the principle later. Do not treat a pilot score as a scientifically validated skill measure.
