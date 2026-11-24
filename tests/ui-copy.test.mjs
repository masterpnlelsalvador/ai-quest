import test from 'node:test';
import assert from 'node:assert/strict';

test('Workbench passes the displayed Markdown to the clipboard API', async () => {
  const previous = Object.fromEntries(['document', 'history', 'location', 'window'].map(key => [key, globalThis[key]]));
  const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const handlers = {};
  const main = { innerHTML: '', focus() {} };
  const output = { textContent: '' };
  let copied = null;

  globalThis.document = {
    querySelector(selector) {
      if (selector === '#main') return main;
      if (selector === '#plan-output') return main.innerHTML.includes('id="plan-output"') ? output : null;
      return { focus() {} };
    },
    querySelectorAll() { return []; },
    addEventListener(type, handler) { handlers[type] = handler; },
  };
  globalThis.history = { replaceState() {} };
  globalThis.location = { hash: '' };
  globalThis.window = { addEventListener() {}, scrollTo() {} };
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: { clipboard: { async writeText(text) { copied = text; } } },
  });

  const click = action => handlers.click({
    target: { closest(selector) { return selector === '[data-action]' ? { dataset: { action } } : null; } },
  });

  try {
    await import(`../src/app.mjs?ui-copy-test=${Date.now()}`);
    await click('open-workbench');
    await click('generate-plan');
    assert.match(output.textContent, /## Safety gate/);
    assert.match(output.textContent, /## Context strategy/);
    await click('copy-plan');
    assert.equal(copied, output.textContent);
    assert.match(main.innerHTML, /Markdown copied to clipboard/);
    handlers.change({ target: { dataset: { wb: 'sensitivity' }, value: 'sensitive' } });
    assert.doesNotMatch(main.innerHTML, /id="plan-output"/);
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete globalThis[key];
      else globalThis[key] = value;
    }
    if (navigatorDescriptor) Object.defineProperty(globalThis, 'navigator', navigatorDescriptor);
    else delete globalThis.navigator;
  }
});
