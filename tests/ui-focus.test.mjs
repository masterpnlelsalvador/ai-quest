import test from 'node:test';
import assert from 'node:assert/strict';
import { efficiencyActions } from '../src/engine.mjs';

test('mission evaluation moves focus to one debrief and changing a choice invalidates it', async () => {
  const previous = Object.fromEntries(['document', 'history', 'location', 'window'].map(key => [key, globalThis[key]]));
  const handlers = {};
  const focused = [];
  const main = { innerHTML: '', focus() { focused.push('#main'); } };
  const documentStub = {
    querySelector(selector) {
      if (selector === '#main') return main;
      if (selector.startsWith('#') && !main.innerHTML.includes(`id="${selector.slice(1)}"`)) return null;
      return { focus() { focused.push(selector); } };
    },
    querySelectorAll() { return []; },
    addEventListener(type, handler) { handlers[type] = handler; },
  };
  globalThis.document = documentStub;
  globalThis.history = { replaceState() {} };
  globalThis.location = { hash: '' };
  globalThis.window = { addEventListener() {}, scrollTo() {} };

  const click = (selector, dataset) => handlers.click({
    target: { closest(candidate) { return candidate === selector ? { dataset } : null; } },
  });

  try {
    await import(`../src/app.mjs?ui-focus-test=${Date.now()}`);

    await click('[data-mission]', { mission: 'context' });
    await click('[data-action]', { action: 'evaluate-context' });
    assert.equal(focused.at(-1), '#context-result');
    assert.match(main.innerHTML, /id="context-result" tabindex="-1"/);
    assert.match(main.innerHTML, /role="region" aria-label="Mission debrief:/);
    assert.doesNotMatch(main.innerHTML.match(/<section class="result[^>]*>/)?.[0] ?? '', /aria-live/);
    handlers.change({ target: { dataset: { context: 'goal' }, checked: true } });
    assert.doesNotMatch(main.innerHTML, /id="context-result"/);

    await click('[data-mission]', { mission: 'efficiency' });
    await click('[data-action]', { action: 'evaluate-efficiency' });
    assert.equal(focused.at(-1), '#efficiency-result');
    assert.match(main.innerHTML, /id="efficiency-result" tabindex="-1"/);
    assert.doesNotMatch(main.innerHTML.match(/<section class="result[^>]*>/)?.[0] ?? '', /aria-live/);
    await click('[data-efficiency]', { efficiency: efficiencyActions[0].id });
    assert.doesNotMatch(main.innerHTML, /id="efficiency-result"/);

    await click('[data-mission]', { mission: 'secret' });
    await click('[data-action]', { action: 'evaluate-secret' });
    assert.equal(focused.at(-1), '#secret-result');
    assert.match(main.innerHTML, /id="secret-result" tabindex="-1"/);
    assert.match(main.innerHTML, /Why each line matters/);
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete globalThis[key];
      else globalThis[key] = value;
    }
  }
});
