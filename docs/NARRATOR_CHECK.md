# AQ-07-P3 — Manual Narrator check

**Status:** Alkyora reports that a manual Narrator test was satisfactory. This review did not observe the spoken output, browser version or Windows configuration, so its independent result is **NOT TESTED**. This procedure remains available for a repeatable release check; do not infer broad accessibility conformance from one report.

1. Serve only this candidate on `127.0.0.1` using the README command. Open it in the intended Windows browser and turn on Narrator through Windows Accessibility settings.
2. Navigate with the keyboard to **Start the challenge** and open **The Secret Leak**. Before evaluating, confirm Narrator does **not** announce “Why each line matters” or reveal the eight explanations.
3. Select the fictional customer email and activate **Evaluate my decisions** with Enter. Confirm focus moves to the result, Narrator announces the critical outcome and score coherently, and the user can continue to the **Why each line matters** heading.
4. Navigate through all eight explanation list items. Confirm each line has a readable selection status, classification, decision, **Why**, **Risk** and **At work** text, in logical order. Check that the email and API-key items are understandable without relying on color.
5. Change the selection, confirm stale feedback disappears, then select the four diagnostic lines and evaluate again. Confirm the passing outcome is read without implying security approval or certification.
6. Record only `PASS`, `FAIL` or `NOT TESTED` for each step and a description of any interface defect. Do not record a participant's identity, answers or voice. Turn Narrator off and close the local server when finished.

A genuine result requires observing Narrator's spoken output with the actual browser and Windows configuration. If speech cannot be heard or verified, report **NOT TESTED**.
