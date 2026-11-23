import {
  secretLines, secretExplanations, contextItems, efficiencyActions,
  scoreSecretLeak, scoreContextCollapse, scoreTokenTrap,
  buildWorkbenchPlan, profileSummary,
} from './engine.mjs';

const missionMeta = [
  { id: 'secret', number: '01', icon: '◇', title: 'The Secret Leak', category: 'AI Safety', detail: 'Choose the smallest safe, useful excerpt of an incident log before sharing it with an AI assistant.', competency: 'Security judgment' },
  { id: 'context', number: '02', icon: '▤', title: 'Context Collapse', category: 'Context Management', detail: 'Create a focused handoff that preserves real decisions and leaves unnecessary noise behind.', competency: 'Context discipline' },
  { id: 'efficiency', number: '03', icon: '⚡', title: 'The Token Trap', category: 'AI Efficiency', detail: 'Select an investigation and handoff sequence within a fixed resource budget.', competency: 'Efficient planning' },
];

const state = {
  view: 'home', mission: null,
  secretSelected: new Set(), contextSelected: new Set(),
  efficiencySelected: [], warning: '', results: {},
  plan: '', workbench: { task: 'support', sensitivity: 'internal', stage: 'new' },
  notice: '',
};
const root = document.querySelector('#main');
const byId = id => missionMeta.find(m => m.id === id);
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function primaryBtn(label, action, extra = '') { return `<button type="button" class="button primary" data-action="${action}" ${extra}>${escapeHtml(label)}</button>`; }
function ghostBtn(label, action) { return `<button type="button" class="button ghost" data-action="${action}">${escapeHtml(label)}</button>`; }
function resultMarkup(result, focusId = '') {
  if (!result) return '';
  return `<section class="result ${result.passed ? '' : 'fail'}" aria-live="polite" ${focusId ? `id="${focusId}" tabindex="-1"` : ''}>
    <div class="scoreline"><span class="chip ${result.passed ? '' : 'warn'}">${result.passed ? 'Passed' : 'Review recommended'}</span><span class="bigscore">${result.score}/100</span></div>
    <h3>${escapeHtml(result.title)}</h3><p>${escapeHtml(result.feedback)}</p>
    <div class="small">Scenario practice score only. This is not a professional certification or a real security audit.</div>
  </section>`;
}
function setView(view, mission = null) {
  state.view = view;
  state.mission = mission;
  state.notice = '';
  history.replaceState(null, '', `#${view}${mission ? '-' + mission : ''}`);
  render();
  document.querySelector('#main')?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function renderHome() {
  const p = profileSummary(state.results);
  return `<section class="hero">
    <p class="eyebrow">Interactive AI literacy · MIT licensed</p>
    <h1>Use AI with <span class="gradient-text">better judgment.</span></h1>
    <p class="lead">Most AI training teaches you what to type. AI Quest teaches you how to make decisions: protect information, manage context, verify results and avoid unnecessary work.</p>
    <div class="actions">${primaryBtn('Start the challenge →', 'start')}${ghostBtn('Open AI Workbench', 'open-workbench')}</div>
  </section>
  <section class="statstrip" aria-label="Your current progress">
    <div class="stat"><strong>${p.done}/${p.total}</strong><small>Scenarios attempted</small></div>
    <div class="stat"><strong>${p.average == null ? '—' : p.average + '/100'}</strong><small>Practice average</small></div>
    <div class="stat"><strong>0</strong><small>External API calls</small></div>
  </section>
  <div class="section-heading"><h2>Explore the survival lab</h2><span class="chip">3 interactive missions</span></div>
  <div class="grid">${missionMeta.map(m => `<article class="card">
    <div class="iconbox" aria-hidden="true">${m.icon}</div>
    <span class="step">MISSION ${m.number} · ${escapeHtml(m.category)}</span>
    <h3>${escapeHtml(m.title)}</h3><p>${escapeHtml(m.detail)}</p>
    <div class="mission-card-footer">${state.results[m.id] ? `<span class="chip ${state.results[m.id].passed ? '' : 'warn'}">${state.results[m.id].score}/100</span>` : '<span class="small">Not started</span>'}
    <button type="button" class="button" data-mission="${m.id}">Open mission →</button></div>
  </article>`).join('')}</div>
  <div class="section-heading"><h2>Practice. Then apply.</h2></div>
  <div class="grid two">
    <article class="card light"><div class="iconbox" aria-hidden="true">▣</div><h3>AI Workbench</h3><p>Generate a reusable work plan and session handoff with clear safety gates. No chatbot, login or remote data collection required.</p>${ghostBtn('Open Workbench →', 'open-workbench')}</article>
    <article class="card"><div class="iconbox" aria-hidden="true">✓</div><h3>Evidence over hype</h3><p>The rules are transparent and deterministic. Simulations measure decisions within the exercises—not your total professional ability.</p>${ghostBtn('How evaluation works →', 'open-about')}</article>
  </div>`;
}

function renderMissionsIndex() {
  const p = profileSummary(state.results);
  return `<section class="page-heading"><p class="eyebrow">Your learning path</p><h1>Scenario decisions stay in this browser tab and reset when you reload. The app does not upload your answers; a web host may still log normal page requests.</p></section>
   <div class="statstrip"><div class="stat"><strong>${p.done}/3</strong><small>Scenarios attempted</small></div><div class="stat"><strong>${p.average == null ? '—' : p.average}</strong><small>Average practice score</small></div></div>
   <div class="grid">${missionMeta.map(m => `<article class="card"><div class="iconbox">${m.icon}</div><span class="step">MISSION ${m.number} · ${escapeHtml(m.category)}</span><h3>${escapeHtml(m.title)}</h3><p>${escapeHtml(m.detail)}</p><div class="mission-card-footer">${state.results[m.id] ? `<span class="chip ${state.results[m.id].passed ? '' : 'warn'}">${state.results[m.id].passed ? 'Passed' : 'Retry'} · ${state.results[m.id].score}/100</span>` : '<span class="small">Ready to practice</span>'}<button type="button" class="button" data-mission="${m.id}">Practice →</button></div></article>`).join('')}</div>
   ${p.complete ? `<div class="card light" style="margin-top:22px"><h3>Training snapshot: ${escapeHtml(p.label)}</h3><p>Practice average: <strong>${p.average}/100</strong>. ${p.critical ? 'A critical safety choice was detected. Review that mission before claiming completion.' : p.allPassed ? 'All three simulated scenarios passed.' : 'Some scenarios need another attempt.'} These results are not a validated competency certification.</p>${ghostBtn('Try again', 'reset-all')}</div>` : ''}`;
}

function renderSecretMission() {
  const explanation = state.results.secret ? `<section class="card" aria-labelledby="secret-explanation-heading" style="margin-top:18px">
    <h3 id="secret-explanation-heading">Why each line matters</h3>
    <p class="small">These choices apply to this fictional exercise with an approved tool. Public, internal, personal and secret information require different handling. Even useful internal evidence needs authorization for its destination; removing identifiers does not automatically make sharing safe.</p>
    <ol class="history secret-explanations">${secretLines.map(line => {
      const item = secretExplanations[line.id];
      return `<li><strong>${escapeHtml(line.text)}</strong><br><span class="small">${state.secretSelected.has(line.id) ? 'You selected this line.' : 'You omitted this line.'} ${escapeHtml(item.category)} · ${escapeHtml(item.decision)}</span>
        <p><strong>Why:</strong> ${escapeHtml(item.why)}</p><p><strong>Risk:</strong> ${escapeHtml(item.risk)}</p><p><strong>At work:</strong> ${escapeHtml(item.transfer)}</p></li>`;
    }).join('')}</ol>
  </section>` : '';
  return `<p class="question">An AI assistant can help diagnose a dashboard failure. You have eight lines from a <strong>fictional</strong> support log. Select only what is useful and appropriate to share with an approved AI tool.</p>
  <div class="callout">All identifiers, email addresses and keys shown here are invented demonstration values. In real work, verify your company's policies and the tool's data classification before sharing anything.</div>
  <div class="option-list">${secretLines.map(line => `<label class="option"><input type="checkbox" data-secret="${line.id}" ${state.secretSelected.has(line.id) ? 'checked' : ''}/><span><strong class="code">${escapeHtml(line.text)}</strong></span></label>`).join('')}</div>
  <div class="action-row"><span class="small">Selected: ${state.secretSelected.size} of ${secretLines.length}</span><div class="actions" style="margin:0">${ghostBtn('Reset choices', 'reset-secret')}${primaryBtn('Evaluate my decisions', 'evaluate-secret')}</div></div>
  ${resultMarkup(state.results.secret, 'secret-result')}
  ${explanation}`;
}

function renderContextMission() {
  const selected = contextItems.filter(item => state.contextSelected.has(item.id));
  return `<p class="question">Your AI-assisted team is about to open a new session. The previous conversation is long. Select the information that actually needs to travel to the next session, while avoiding unnecessary noise.</p>
  <div class="option-list">${contextItems.map(item => `<label class="option"><input type="checkbox" data-context="${item.id}" ${state.contextSelected.has(item.id) ? 'checked' : ''}/><span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.detail)}</small></span></label>`).join('')}</div>
  <div class="action-row"><span class="small">Selected: ${state.contextSelected.size} items</span><div class="actions" style="margin:0">${ghostBtn('Reset choices', 'reset-context')}${primaryBtn('Evaluate handoff', 'evaluate-context')}</div></div>
  ${selected.length ? `<div class="card" style="margin-top:18px"><h3>Your handoff preview</h3><p class="small">Only selected context is included:</p><ul class="history">${selected.map(item => `<li><strong>${escapeHtml(item.title)}:</strong> ${escapeHtml(item.detail)}</li>`).join('')}</ul></div>` : ''}
  ${resultMarkup(state.results.context)}`;
}

function renderEfficiencyMission() {
  const latest = scoreTokenTrap(state.efficiencySelected);
  const spent = latest.spent;
  return `<p class="question">A fictional dashboard started returning HTTP 500 immediately after an update. Select an investigation, verification and handoff sequence within <strong>100 simulated resource points</strong>. This exercise does not perform a repair or run a test.</p>
  <div class="callout">Resource points are a training mechanic, <strong>not</strong> token counts or real API costs. The exercise rewards quality, ordering and useful evidence—not spending the fewest points at any price.</div>
  <div class="statstrip" style="margin-top:18px"><div class="stat"><strong class="budget">${latest.remaining}</strong><small>Points remaining</small><div class="meter"><span style="width:${latest.remaining}%"></span></div></div><div class="stat"><strong>${state.efficiencySelected.length}</strong><small>Actions taken</small></div></div>
  <div class="option-list">${efficiencyActions.map(action => `<div class="option"><div style="flex:1"><strong>${escapeHtml(action.label)}</strong><small>${escapeHtml(action.info)} · Cost: ${action.cost} points</small></div><button type="button" class="button" data-efficiency="${action.id}" aria-label="Choose: ${escapeHtml(action.label)}" ${spent + action.cost > 100 ? 'disabled title="Insufficient simulated points"' : ''}>Choose</button></div>`).join('')}</div>
  ${state.warning ? `<div class="callout warnbox" role="status">${escapeHtml(state.warning)}</div>` : ''}
  ${state.efficiencySelected.length ? `<div class="card" style="margin:18px 0"><h3>Decision trail</h3><ol class="history">${state.efficiencySelected.map(id => `<li>${escapeHtml(efficiencyActions.find(a => a.id === id)?.label || id)}</li>`).join('')}</ol></div>` : ''}
  <div class="action-row"><span class="small">Outcome depends on evidence and the order of verification.</span><div class="actions" style="margin:0">${ghostBtn('Reset scenario', 'reset-efficiency')}${primaryBtn('Evaluate my outcome', 'evaluate-efficiency')}</div></div>
  ${resultMarkup(state.results.efficiency)}`;
}

function renderMission(id) {
  const m = byId(id); if (!m) return renderMissionsIndex();
  const missionBody = id === 'secret' ? renderSecretMission() : id === 'context' ? renderContextMission() : renderEfficiencyMission();
  const hints = {
    secret: ['Use the minimum relevant evidence.', 'Do not share unnecessary personal data or credentials.', 'The tool being used must be approved for the information classification.'],
    context: ['Preserve decisions, verified status and a concrete next action.', 'Summaries should be actionable for the next person.', 'More text is not automatically more useful context.'],
    efficiency: ['Check the smallest relevant evidence first.', 'Verification should follow investigation.', 'Never take disruptive production action blindly.'],
  };
  return `<button type="button" class="button ghost" data-action="open-missions" style="margin-bottom:20px">← All missions</button>
  <div class="mission-head"><div><p class="eyebrow">MISSION ${m.number} · ${escapeHtml(m.category)}</p><h2>${escapeHtml(m.title)}</h2><p class="subtle">${escapeHtml(m.competency)} · Deterministic simulated assessment</p></div><span class="chip">Fictional scenario</span></div>
  <div class="mission-layout"><div class="card">${missionBody}</div><aside class="card sidebar-card"><h3>What matters here?</h3><ul>${hints[id].map(h => `<li>${escapeHtml(h)}</li>`).join('')}</ul><div class="callout"><strong>Important:</strong> This is an educational simulation, not real incident handling, security clearance or a guarantee of competence.</div></aside></div>`;
}

function renderWorkbench() {
  return `<section class="page-heading"><p class="eyebrow">Useful beyond the training lab</p><h1>AI Workbench</h1><p>Prepare a task before asking AI to work on it. The resulting Markdown template is assembled locally and contains no uploaded data.</p></section>
  <div class="grid two"><section class="card"><h3>Create a responsible AI work plan</h3>
    <div class="field"><label class="label" for="wb-task">Task type</label><select class="select" id="wb-task" data-wb="task"><option value="support" ${state.workbench.task === 'support' ? 'selected' : ''}>Technical investigation</option><option value="development" ${state.workbench.task === 'development' ? 'selected' : ''}>Feature development</option><option value="documentation" ${state.workbench.task === 'documentation' ? 'selected' : ''}>Documentation</option></select></div>
    <div class="field"><label class="label" for="wb-sensitivity">Information classification</label><select class="select" id="wb-sensitivity" data-wb="sensitivity"><option value="public" ${state.workbench.sensitivity === 'public' ? 'selected' : ''}>Public or synthetic</option><option value="internal" ${state.workbench.sensitivity === 'internal' ? 'selected' : ''}>Internal company information</option><option value="sensitive" ${state.workbench.sensitivity === 'sensitive' ? 'selected' : ''}>Sensitive or confidential</option></select></div>
    <div class="field"><label class="label" for="wb-stage">Session state</label><select class="select" id="wb-stage" data-wb="stage"><option value="new" ${state.workbench.stage === 'new' ? 'selected' : ''}>Starting a new session</option><option value="handoff" ${state.workbench.stage === 'handoff' ? 'selected' : ''}>Continuing with a handoff</option></select></div>
    ${primaryBtn('Generate work plan →', 'generate-plan')}
    <p class="small">This tool does not connect to an AI model, validate company policy, or inspect real project data. It prepares a safer starting structure.</p>
  </section><aside class="card"><div class="iconbox">▣</div><h3>From our playbook</h3><p>Goal → Requirements → Constraints → Acceptance criteria → Implementation → Verification → Learning.</p><div class="callout">Engineering first. AI second. Human judgment remains responsible for the final decision.</div></aside></div>
  ${state.plan ? `<section class="card" style="margin-top:20px"><div class="mission-head"><div><h2>Your reusable plan</h2><p class="subtle">Markdown document · generated in your browser</p></div><div class="actions" style="margin:0">${ghostBtn('Copy Markdown', 'copy-plan')}${primaryBtn('Download .md', 'download-plan')}</div></div><pre id="plan-output" class="plan"></pre>${state.notice ? `<p class="small" role="status">${escapeHtml(state.notice)}</p>` : ''}</section>` : ''}`;
}

function renderAbout() {
  return `<section class="page-heading"><p class="eyebrow">Our approach</p><h1>Beyond “good prompt / bad prompt”</h1><p>AI Quest teaches practical decision-making: when to use AI, how to work efficiently, which information to protect, what to verify and how to preserve reusable knowledge.</p></section>
  <div class="grid two"><article class="card"><div class="iconbox">⌁</div><h3>How practice is evaluated</h3><p>Each mission uses transparent, deterministic rules. The safety mission treats inclusion of sensitive fields as a critical failure. The context mission checks whether useful handoff elements are selected. The efficiency mission verifies an ordered sequence and simulated budget.</p></article>
  <article class="card"><div class="iconbox">◎</div><h3>What results do not prove</h3><p>Completing three scenarios is not professional certification, a validated AI maturity diagnosis, or evidence of safe performance in production. Scores describe decisions made within these specific exercises only.</p></article>
  <article class="card"><div class="iconbox">◇</div><h3>Privacy by default</h3><p>Scenario data and calculations stay in this page. This version does not send requests to model APIs, collect analytics or store responses automatically. The example data is fictional. A web host or browser may keep request records; do not assume anonymous access.</p></article>
  <article class="card"><div class="iconbox">↗</div><h3>Shareable by design</h3><p>Plain HTML, CSS and JavaScript modules. No build system, backend or paid dependencies. Anyone can fork the code, add missions and publish the static application using GitHub Pages or another static host.</p></article></div>
  <div class="card light" style="margin-top:20px"><h3>Guiding philosophy</h3><p><strong>Learn by doing. Practice your judgment. Share what works.</strong></p><p>AI Quest is a static browser exercise by Alkyora, derived from practical AI engineering principles. Its source is public under the MIT License on GitHub. It is separate from Agent Gauntlet.</p></div>`;
}

function render() {
  const body = state.view === 'home' ? renderHome() : state.view === 'workbench' ? renderWorkbench() : state.view === 'about' ? renderAbout() : state.view === 'missions' && state.mission ? renderMission(state.mission) : renderMissionsIndex();
  root.innerHTML = body;
  for (const el of document.querySelectorAll('[data-view]')) {
    el.classList.toggle('active', el.dataset.view === state.view);
    if (el.dataset.view === state.view) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
  }
  if (state.plan && state.view === 'workbench') document.querySelector('#plan-output').textContent = state.plan;
}

document.addEventListener('click', async event => {
  const nav = event.target.closest('[data-view]');
  if (nav) { setView(nav.dataset.view); return; }
  const mission = event.target.closest('[data-mission]');
  if (mission) { setView('missions', mission.dataset.mission); return; }
  const efficiency = event.target.closest('[data-efficiency]');
  if (efficiency) {
    const action = efficiencyActions.find(a => a.id === efficiency.dataset.efficiency);
    const spent = scoreTokenTrap(state.efficiencySelected).spent;
    if (action && spent + action.cost <= 100) {
      state.efficiencySelected.push(action.id);
      delete state.results.efficiency;
      state.warning = action.critical ? 'Unsafe production action selected. This is only a simulation; consider resetting and investigating first.' : '';
    } else state.warning = 'Not enough simulated resource points. Reset and try a more focused strategy.';
    render();
    const selectedButton = document.querySelector(`[data-efficiency="${efficiency.dataset.efficiency}"]`);
    if (selectedButton && !selectedButton.disabled) selectedButton.focus({ preventScroll: true });
    else document.querySelector('[data-action="evaluate-efficiency"]')?.focus({ preventScroll: true });
    return;
  }
  const button = event.target.closest('[data-action]');
  if (!button) return;
  switch (button.dataset.action) {
    case 'start': setView('missions', 'secret'); return;
    case 'open-missions': setView('missions'); return;
    case 'open-workbench': setView('workbench'); return;
    case 'open-about': setView('about'); return;
    case 'evaluate-secret':
      state.results.secret = scoreSecretLeak([...state.secretSelected]);
      render();
      document.querySelector('#secret-result')?.focus();
      return;
    case 'evaluate-context': state.results.context = scoreContextCollapse([...state.contextSelected]); break;
    case 'evaluate-efficiency': state.results.efficiency = scoreTokenTrap(state.efficiencySelected); break;
    case 'reset-secret': state.secretSelected.clear(); delete state.results.secret; break;
    case 'reset-context': state.contextSelected.clear(); delete state.results.context; break;
    case 'reset-efficiency': state.efficiencySelected = []; state.warning = ''; delete state.results.efficiency; break;
    case 'reset-all': state.secretSelected.clear(); state.contextSelected.clear(); state.efficiencySelected = []; state.results = {}; setView('missions'); return;
    case 'generate-plan': state.plan = buildWorkbenchPlan(state.workbench); state.notice = ''; break;
    case 'copy-plan':
      try { await navigator.clipboard.writeText(state.plan); state.notice = 'Markdown copied to clipboard.'; }
      catch { state.notice = 'Clipboard unavailable in this browser. Use Download .md instead.'; }
      break;
    case 'download-plan': {
      const blob = new Blob([state.plan], {type:'text/markdown;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'ai-quest-work-plan.md'; document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      state.notice = 'Download initiated locally.';
      break;
    }
    default: return;
  }
  render();
});

document.addEventListener('change', event => {
  const input = event.target;
  if (input.dataset.secret) {
    if (input.checked) state.secretSelected.add(input.dataset.secret); else state.secretSelected.delete(input.dataset.secret);
    delete state.results.secret;
  } else if (input.dataset.context) {
    if (input.checked) state.contextSelected.add(input.dataset.context); else state.contextSelected.delete(input.dataset.context);
    delete state.results.context;
  } else if (input.dataset.wb) {
    const allowed = {task:['support','development','documentation'],sensitivity:['public','internal','sensitive'],stage:['new','handoff']};
    if (allowed[input.dataset.wb]?.includes(input.value)) {
      state.workbench[input.dataset.wb] = input.value; state.plan = ''; state.notice = '';
    }
  } else return;
  // Preserve keyboard focus after re-rendering a selected field.
  const focusSelector = input.dataset.secret ? `[data-secret="${input.dataset.secret}"]` : input.dataset.context ? `[data-context="${input.dataset.context}"]` : input.dataset.wb ? `[data-wb="${input.dataset.wb}"]` : null;
  render();
  if (focusSelector) document.querySelector(focusSelector)?.focus({preventScroll:true});
});

window.addEventListener('hashchange' , () => {
  const hash = window.location.hash.replace('#','');
  const [view, mission] = hash.split('-');
  if (['home','missions','workbench','about'].includes(view)) {
    state.view = view; state.mission = byId(mission) ? mission : null; render();
  }
});
const initial = location.hash.replace('#','').split('-');
if (['home','missions','workbench','about'].includes(initial[0])) { state.view = initial[0]; state.mission = byId(initial[1]) ? initial[1] : null; }
render();
