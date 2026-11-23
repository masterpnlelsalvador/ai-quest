# Security & Privacy Model — AI Quest v0.1

## Data classification

All authored training data is synthetic. Identifiers use reserved/dummy values, including `example.invalid`, RFC 5737 documentation IPs and a plainly fake API-key string. The tool does not request, require or parse user data.

## Trust boundary

Browser JavaScript running locally or on a static host. There are **no outbound application network calls**, accounts, analytics, server routes, cookies, local storage, third-party scripts, AI providers or database connections. Loading the static files from a web host necessarily requires ordinary HTTPS page requests; the app itself makes no external API calls.

## Threat assumptions

- A malicious hosting provider or injected browser extension is out of scope.
- DOM XSS exposure is minimized by using authored fixed strings, escaping markup and rendering plan text through `textContent`. No user-supplied arbitrary HTML is processed.
- The Workbench generates templates from strict option allowlists, not personal text entries.
- Browser clipboard access is optional; if blocked, users can download a Markdown file.
- Session progress is in memory only and disappears on refresh.

## Explicit prohibitions

- Never use real employee, customer or business secrets as example content.
- Never silently integrate LLM API calls or telemetry; a new privacy model and permission UX is required first.
- Never label the results as a certification, penetration test or evidence of compliance.
- Never put an actual credential in a demo, code comment or screenshot.

## Before public release

1. Inspect all source files for secrets and personal data.
2. Verify no unexpected HTTP requests are emitted in the browser developer tools.
3. Test keyboard navigation, focus and narrow-screen behavior.
4. Independently verify scoring and critical safety paths.
5. Review accessibility and any employer policy concerns.
6. Obtain explicit approval before creating/publicly deploying the repository.

## Risk register

| Risk | Control |
|---|---|
| Users mistake simulation for real risk approval | Repeated warnings and scope labels |
| Employees enter internal materials | No text input/upload surface; synthetic data only |
| Score mistaken for human skill certification | “Practice score”, limitations in UI/docs |
| Score optimized without learning | Explicit outcome requirements and safety gate |
| Model output treated as ground truth | No LLM in v0.1; scoring rules published |
| Hidden service costs | Zero API/runtime dependencies |
