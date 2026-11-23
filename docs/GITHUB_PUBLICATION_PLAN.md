# AQ-07-P3 — Future GitHub publication plan

This is a proposal only. AQ-07-P3 creates a local Git repository in this candidate, with **no commit, remote, push or deployment**.

| Item | Proposal |
|---|---|
| Repository name | `ai-quest` |
| Short description | Static, privacy-aware AI judgment practice with three deterministic scenarios and a local Markdown workbench. |
| Initial branch | `main` |
| Proposed first commit | `Initial AI Quest v0.1 public release candidate` |
| Website hosting | Decide separately after repository review; no hosting is configured here. |

## First commit inventory

The intended first commit contains only the files enumerated by `git ls-files --others --exclude-standard` in this candidate. Record the exact output in [the readiness report](AQ07_P3_RELEASE_READINESS.md) and inspect it again before staging. Do not add the parent project, pilot package, private data, temporary profiles or anything outside this directory.

## Future sequence after explicit authorization

1. Re-run `node --test tests/*.test.mjs` and inspect `git status --short --untracked-files=all` from this candidate.
2. Review every file that would be staged; use `git add --dry-run -A` first. Verify MIT text, copyright, attribution, README, Narrator record and the absence of pilot material or personal paths.
3. Only when the first commit is authorized, stage the reviewed files, inspect `git diff --cached --name-only` and `git diff --cached --check`, then create the approved commit. Neither staging nor committing occurs in AQ-07-P3.
4. Only after separate approval to publish, create a dedicated GitHub repository named `ai-quest` without importing the private parent project. Review the remote URL and visibility before adding it. Push only the reviewed branch after explicit authorization. A deployment or GitHub Pages setup requires another approval.

## Safety gate before any public push

- Confirm repository root is this candidate, not the original `ai-quest` project.
- Confirm no facilitator keys, PRE/POST cases, pilot rubric, individual results, ACL backups, temporary files, personal paths or secrets are staged. `.gitignore` does not protect previously tracked or explicitly forced files.
- Confirm the MIT `LICENSE` matches the approved Alkyora notice and that any newly discovered third-party notice is preserved.
- Confirm the 25 tests, local site flows, browser Network review and accessibility evidence are current for the exact staged version.
- Confirm scores are described as simulated practice, not certification or measured learning gains.
- Confirm no remote, push, hosting or public link is used until separately authorized.
