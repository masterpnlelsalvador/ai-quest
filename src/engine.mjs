/**
 * AI Quest evaluation engine, v0.1.
 * Deterministic, offline-only training scenarios. Not a certification or a security scanner.
 */
export const secretLines = Object.freeze([
  { id: 'time', text: '2026-11-18 09:41:22 UTC — incident started', useful: true, sensitive: false },
  { id: 'http', text: 'GET /dashboard → HTTP 500 after deployment', useful: true, sensitive: false },
  { id: 'stack', text: 'TypeError: cannot read property in widgets/renderer.js:84', useful: true, sensitive: false },
  { id: 'change', text: 'Recent change: widgets package updated from 2.3 to 2.4', useful: true, sensitive: false },
  { id: 'email', text: 'Customer email: demo.customer@example.invalid', useful: false, sensitive: true },
  { id: 'key', text: 'X-Api-Key: FAKE_DEMO_KEY_NOT_REAL', useful: false, sensitive: true },
  { id: 'ip', text: 'Customer IP: 192.0.2.42 (documentation-only address)', useful: false, sensitive: true },
  { id: 'noise', text: 'Team chat: lunch meeting moved to 12:30', useful: false, sensitive: false },
]);

export const secretExplanations = Object.freeze({
  time: { category: 'Internal operational detail', decision: 'Include in this fictional exercise', why: 'The timestamp helps place the failure in order.', risk: 'Without it, the investigation may follow the wrong event.', transfer: 'Use only the minimum time detail needed, and confirm that the AI tool is approved for internal logs.' },
  http: { category: 'Internal operational detail', decision: 'Include in this fictional exercise', why: 'The HTTP 500 line states the observed failure.', risk: 'Omitting the symptom can lead to guesses; a real route may also reveal internal structure.', transfer: 'Share a focused symptom only after checking the tool and the information classification.' },
  stack: { category: 'Internal technical detail', decision: 'Include in this fictional exercise', why: 'The short stack trace points to a relevant failure location.', risk: 'A full real trace can expose paths, personal data or secrets mixed into logs.', transfer: 'Inspect and minimize a real excerpt before using an approved tool; redaction alone is not automatic permission.' },
  change: { category: 'Internal operational detail', decision: 'Include in this fictional exercise', why: 'The recent package update gives a plausible lead to investigate.', risk: 'Without the change, work may drift; real version details may be restricted.', transfer: 'Include a relevant change only when its classification and destination are approved.' },
  email: { category: 'Personal information', decision: 'Omit or protect', why: 'A customer address is not needed to diagnose this failure.', risk: 'Sharing a real address could expose a person to an unapproved service.', transfer: 'Remove unnecessary personal data and follow the approved handling policy; a masked value is not automatically safe.' },
  key: { category: 'Secret credential', decision: 'Omit or protect', why: 'An API key is not diagnostic evidence for this question.', risk: 'A real key could grant unauthorized access if disclosed.', transfer: 'Never paste credentials into an unapproved AI tool; use the incident process if a real key is exposed.' },
  ip: { category: 'Potentially personal information', decision: 'Omit or protect', why: 'The customer IP is unnecessary for the stated diagnosis.', risk: 'A real IP may identify or help link activity to a person, depending on context.', transfer: 'Minimize identifiers and check policy before sharing; anonymization does not by itself establish permission.' },
  noise: { category: 'Internal but irrelevant', decision: 'Omit', why: 'The lunch-chat line adds no evidence about the dashboard failure.', risk: 'Extra context can distract the investigation and may disclose unrelated internal conversation.', transfer: 'Keep only task-relevant material, even when a line is not a credential or personal identifier.' },
});

export const contextItems = Object.freeze([
  { id: 'goal', title: 'Goal', detail: 'Fix dashboard HTTP 500 without changing existing user permissions.', essential: true },
  { id: 'decision', title: 'Approved decision', detail: 'Limit the patch to the widgets renderer; no framework migration.', essential: true },
  { id: 'tests', title: 'Verified evidence', detail: 'Login, navigation and 12 regression tests pass locally.', essential: true },
  { id: 'blocker', title: 'Open issue', detail: 'Dashboard still fails on empty widgets data.', essential: true },
  { id: 'next', title: 'Next action', detail: 'Add empty-state guard, then rerun dashboard tests before release.', essential: true },
  { id: 'joke', title: 'Casual chat', detail: 'A teammate suggested naming the bug “The Gremlin”.', essential: false, exclusion: 'The nickname does not affect the goal, verified status or next action.' },
  { id: 'old', title: 'Discarded idea', detail: 'Earlier proposal to rewrite the dashboard from scratch (rejected).', essential: false, exclusion: 'The approved decision already rules out a rewrite; this rejected idea adds no new action.' },
  { id: 'raw', title: 'Unfiltered transcript', detail: 'Copy all 500 prior messages into the next conversation.', essential: false, exclusion: 'A full transcript buries the verified facts; carry a focused summary instead.' },
]);

export const efficiencyActions = Object.freeze([
  { id: 'change', label: 'Check the most recent change', cost: 10, info: 'Narrow down where the failure appeared.' },
  { id: 'logs', label: 'Inspect a focused error excerpt', cost: 15, info: 'Get a relevant and sanitized stack trace.' },
  { id: 'test', label: 'Run a targeted verification test', cost: 20, info: 'Confirm the suspected fix with a focused test.' },
  { id: 'summary', label: 'Document findings and the next step', cost: 10, info: 'Create a short, actionable handoff.' },
  { id: 'repeat', label: 'Ask the same broad question again', cost: 20, info: 'Repeat work without new evidence.' },
  { id: 'alllogs', label: 'Analyze every log from the last month', cost: 45, info: 'Large, unfocused analysis; simulated cost only.' },
  { id: 'reset', label: 'Reset production before investigating', cost: 60, info: 'Unsafe operational choice (simulation only).', critical: true },
]);

function normalizeSelection(ids, catalog) {
  const allowed = new Set(catalog.map(item => item.id));
  return new Set((Array.isArray(ids) ? ids : []).filter(id => allowed.has(id)));
}
function clamp(n) { return Math.max(0, Math.min(100, Math.round(n))); }

export function scoreSecretLeak(ids) {
  const selected = normalizeSelection(ids, secretLines);
  const good = secretLines.filter(item => item.useful && selected.has(item.id)).length;
  const exposed = secretLines.filter(item => item.sensitive && selected.has(item.id));
  const irrelevant = secretLines.filter(item => !item.useful && !item.sensitive && selected.has(item.id)).length;
  let score = clamp((exposed.length ? 0 : 55) + (good / 4) * 45 - irrelevant * 5);
  const critical = exposed.length > 0;
  if (critical) score = Math.min(score, 39);
  return {
    score, critical, passed: !critical && good === 4 && irrelevant === 0,
    title: critical ? 'Sensitive information included' : good === 4 && irrelevant === 0 ? 'Relevant evidence, no exposed data' : 'Improve evidence selection',
    feedback: critical
      ? `You included ${exposed.length} sensitive field(s). Even fake values represent categories that should be withheld or redacted before sharing real records.`
      : `You selected ${good}/4 useful diagnostic lines and ${irrelevant} irrelevant line(s). The safest useful excerpt contains the timestamp, HTTP failure, stack trace and recent change.`,
  };
}

export function scoreContextCollapse(ids) {
  const selected = normalizeSelection(ids, contextItems);
  const good = contextItems.filter(item => item.essential && selected.has(item.id)).length;
  const nonessential = contextItems.filter(item => !item.essential && selected.has(item.id));
  const noise = nonessential.length;
  const exclusions = nonessential.length
    ? nonessential.map(item => `${item.title}: ${item.exclusion}`).join(' ')
    : 'No nonessential items were included.';
  const required = ['goal', 'decision', 'next'].every(id => selected.has(id));
  const score = clamp((good / 5) * 90 + (noise === 0 ? 10 : 0) - noise * 12);
  return {
    score, critical: false, passed: required && good >= 4 && noise === 0,
    title: good >= 4 && noise === 0 && required ? 'Handoff ready' : 'Handoff needs refinement',
    feedback: `You preserved ${good}/5 essential items and included ${noise} nonessential item(s). ${exclusions} A strong handoff maintains the goal, decisions, verified evidence, unresolved issue and next action.`,
  };
}

export function scoreTokenTrap(ids) {
  const lookup = new Map(efficiencyActions.map(action => [action.id, action]));
  const actions = (Array.isArray(ids) ? ids : []).filter(id => lookup.has(id));
  const spent = actions.reduce((sum, id) => sum + lookup.get(id).cost, 0);
  const required = ['change', 'logs', 'test', 'summary'];
  const completedSteps = required.filter(id => actions.includes(id)).length;
  const stepsInOrder = actions.indexOf('change') >= 0 && actions.indexOf('logs') >= 0 &&
    actions.indexOf('test') > actions.indexOf('change') && actions.indexOf('test') > actions.indexOf('logs') &&
    actions.indexOf('summary') > actions.indexOf('test');
  const critical = actions.includes('reset');
  const complete = completedSteps === 4 && stepsInOrder && spent <= 100 && !critical;
  let score = clamp(100 - Math.max(0, spent - 55) * 0.85 - (stepsInOrder ? 0 : 20) - (completedSteps === 4 ? 0 : (4 - completedSteps) * 15));
  if (spent > 100) score = Math.min(score, 30);
  if (critical) score = Math.min(score, 29);
  const passed = complete && score >= 70;
  const missing = required.filter(id => !actions.includes(id)).map(id => lookup.get(id).label);
  const orderIssues = [];
  if (actions.includes('test') && actions.includes('change') && actions.indexOf('test') <= actions.indexOf('change')) orderIssues.push('The verification test came before reviewing the recent change.');
  if (actions.includes('test') && actions.includes('logs') && actions.indexOf('test') <= actions.indexOf('logs')) orderIssues.push('The verification test came before inspecting the focused error excerpt.');
  if (actions.includes('summary') && actions.includes('test') && actions.indexOf('summary') <= actions.indexOf('test')) orderIssues.push('The handoff came before the verification test.');
  const details = [missing.length ? `Missing actions: ${missing.join(', ')}.` : '', ...orderIssues, spent > 100 ? 'The 100-point budget was exceeded.' : ''].filter(Boolean).join(' ');
  return {
    score, critical, passed, spent, remaining: Math.max(0, 100 - spent),
    title: critical ? 'Unsafe choice made' : passed ? 'Efficient investigation sequence selected' : complete ? 'Efficiency target not met' : 'Objective not yet verified',
    feedback: critical
      ? `A production reset without investigation is an unsafe shortcut. This was simulated; no real action occurred. ${details}`.trim()
      : passed
        ? `You selected an efficient investigation and handoff sequence using ${spent}/100 simulated resource points. No repair or incident resolution was performed or verified by this exercise.`
        : complete
          ? `You selected the required actions in order, but used ${spent}/100 simulated resource points and scored below the 70-point efficiency target. No repair or incident resolution was performed or verified by this exercise.`
          : `You used ${spent}/100 simulated resource points. ${details} No repair or incident resolution was performed or verified by this exercise.`.trim(),
  };
}

const taskInstructions = Object.freeze({
  support: ['Describe the observed symptom and expected behavior.', 'Gather the minimum diagnostic evidence needed.', 'List hypotheses and a targeted verification plan.'],
  development: ['State the acceptance criteria and non-goals.', 'Identify interfaces, constraints and rollback considerations.', 'Define tests before editing implementation.'],
  documentation: ['Identify the audience, purpose and source of truth.', 'Separate verified facts from assumptions.', 'Plan a review for accuracy and ownership.'],
});
const taskLabels = { support: 'Technical investigation', development: 'Feature development', documentation: 'Documentation' };
const sensitivityNotes = {
  public: 'Use public or synthetic data. Verify facts independently.',
  internal: 'Confirm the tool and workspace are authorized for company-internal data. Minimize and redact before sharing.',
  sensitive: 'STOP before sharing. Use only an explicitly approved environment and policy; never paste secrets or personal data into unapproved AI tools.',
};
const stageNotes = {
  new: 'Begin with objective, constraints, non-goals, evidence and definition of done.',
  handoff: 'Carry over approved decisions, verified evidence, pending issues and next action. Do not paste full chat transcripts.',
};

export function buildWorkbenchPlan({ task = 'support', sensitivity = 'internal', stage = 'new' } = {}) {
  if (!Object.hasOwn(taskInstructions, task) || !Object.hasOwn(sensitivityNotes, sensitivity) || !Object.hasOwn(stageNotes, stage)) {
    throw new Error('Invalid workbench selection');
  }
  return [
    '# AI Quest — AI Work Plan',
    '',
    `- Task: ${taskLabels[task]}`,
    `- Information classification: ${sensitivity}`,
    `- Session mode: ${stage === 'new' ? 'New session' : 'Handoff'}`,
    '',
    '## Safety gate',
    sensitivityNotes[sensitivity],
    '',
    '## Before using AI',
    ...taskInstructions[task].map((item, i) => `${i + 1}. ${item}`),
    '',
    '## Context strategy',
    stageNotes[stage],
    '',
    '## Execution contract (fill offline; do not add sensitive information)',
    '- Objective:',
    '- Relevant context:',
    '- Constraints / non-goals:',
    '- Success criteria:',
    '- Verification steps:',
    '- Stop conditions:',
    '',
    '## Handoff (complete when finished)',
    '- Current state:',
    '- Verified work:',
    '- Approved decisions:',
    '- Open risks / blockers:',
    '- Next action:',
    '',
    'Generated locally by AI Quest v0.1. This is a planning template, not a security approval.',
  ].join('\n');
}

export function profileSummary(results = {}) {
  const ids = ['secret', 'context', 'efficiency'];
  const done = ids.filter(id => results[id] && typeof results[id].score === 'number');
  const complete = done.length === ids.length;
  const average = done.length ? Math.round(done.reduce((sum, id) => sum + results[id].score, 0) / done.length) : null;
  const critical = done.some(id => results[id].critical);
  const allPassed = complete && ids.every(id => results[id].passed);
  return { done: done.length, total: ids.length, complete, average, critical, allPassed, label: !complete ? 'Training in progress' : allPassed ? 'All scenarios passed' : 'Review recommended' };
}
