const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToString } = require('react-dom/server');

// Load the existing TypeScript with isolated dependencies, without a test framework.
function load(file, mocks = {}) {
  const filename = path.resolve(file);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.React, esModuleInterop: true },
  }).outputText;
  const module = { exports: {} };
  const localRequire = (id) => {
    if (id in mocks) return mocks[id];
    if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), id + '.ts'), mocks);
    return require(id);
  };
  new Function('require', 'module', 'exports', source)(localRequire, module, module.exports);
  return module.exports;
}

function storage() {
  const values = new Map();
  global.window = new EventTarget();
  window.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  return load('app/helpers.ts');
}

test('hooks render on the server without browser globals', () => {
  delete global.window;
  const hooks = load('app/hooks.ts');
  function View() {
    return React.createElement('div', null,
      JSON.stringify([hooks.useShortsUses(), hooks.useLang(), hooks.useLastDecision()]));
  }
  assert.match(renderToString(React.createElement(View)), /3,&quot;en&quot;,null/);
});

test('usage refunds preserve the previous decision and notify the current tab', () => {
  const helpers = storage();
  let updates = 0;
  window.addEventListener('shorts-updated', () => updates++);
  helpers.runUsage();
  helpers.addWearShorts(true);
  helpers.runUsage();
  helpers.addOneToUsage();
  assert.equal(helpers.readShorts().uses, 2);
  assert.equal(helpers.readShorts().wearShorts, true);
  assert.equal(updates, 4);
  window.localStorage.setItem('shorts', '{broken');
  assert.equal(helpers.readShorts(), null);
  assert.equal(helpers.runUsage(), true);
});

test('failed AI and weather requests refund usage without saving a false decision', async () => {
  for (const failure of ['ai', 'weather']) {
    const helpers = storage();
    helpers.runUsage();
    helpers.addWearShorts(true);
    const { getShorts } = load('app/actions/shorts.ts', {
      '../helpers': helpers,
      './weather': { getWeather: async () => {
        if (failure === 'weather') throw new Error('upstream failure');
        return {};
      } },
      './ai': { getResponse: async () => ({ wearShorts: false, error: true }) },
    });
    assert.equal((await getShorts({ neighborhood: 'Test' })).error, true);
    assert.equal(helpers.readShorts().uses, 2);
    assert.equal(helpers.readShorts().wearShorts, true);
  }
});

test('a successful pants recommendation is saved and consumes exactly one use', async () => {
  const helpers = storage();
  const { getShorts } = load('app/actions/shorts.ts', {
    '../helpers': helpers,
    './weather': { getWeather: async () => ({}) },
    './ai': { getResponse: async () => ({ wearShorts: false, error: false }) },
  });
  assert.equal((await getShorts({ neighborhood: 'Test' })).error, false);
  assert.equal(helpers.readShorts().uses, 2);
  assert.equal(helpers.readShorts().wearShorts, false);
});

test('AI exceptions and malformed outputs are explicit errors; booleans remain valid', async () => {
  const originalError = console.error;
  const logs = [];
  console.error = (...args) => logs.push(args);
  try {
    for (const output of [null, { wearShorts: 'false' }, { wearShorts: false }, 'throw']) {
      class FakeOpenAI {
        static APIError = class extends Error {};
        responses = { parse: async () => {
          if (output === 'throw') throw new FakeOpenAI.APIError('private upstream details');
          return { output_parsed: output };
        } };
      }
      const { getResponse } = load('app/actions/ai.ts', { openai: FakeOpenAI });
      const result = await getResponse({});
      assert.equal(result.error, output === 'throw' || output === null || typeof output.wearShorts !== 'boolean');
    }
    assert.equal(logs.length, 3);
    assert.doesNotMatch(JSON.stringify(logs), /private upstream details/);
  } finally { console.error = originalError; }
});

test('weather encodes locations and rejects upstream error responses', async () => {
  const originalFetch = global.fetch;
  const originalKey = process.env.WEATHER_API;
  const originalError = console.error;
  process.env.WEATHER_API = 'test-key';
  console.error = () => {};
  try {
    global.fetch = async (url) => {
      assert.equal(new URL(url).searchParams.get('q'), 'A & B / México');
      assert.equal(new URL(url).searchParams.get('aqi'), 'no');
      return { ok: false, status: 401, json: async () => ({ error: { code: 2006 } }) };
    };
    await assert.rejects(load('app/actions/weather.ts').getWeather({ neighborhood: 'A & B / México' }), /Weather unavailable/);
  } finally {
    global.fetch = originalFetch;
    console.error = originalError;
    if (originalKey === undefined) delete process.env.WEATHER_API;
    else process.env.WEATHER_API = originalKey;
  }
});

test('the error screen wins over resolved async status and exhausted usage', () => {
  for (const uses of [0, 3]) {
    const Home = load('app/page.tsx', {
      '@react-hook/async': { useAsync: () => [{ status: 'success', value: { error: true, wearShorts: false } }, () => {}] },
      './actions/shorts': {},
      './components/Background': { Background: ({ children }) => children },
      './views/Idle': { Idle: () => 'idle' },
      './views/Success': { Success: () => 'success' },
      './views/Error': { Error: () => 'error' },
      './hooks': { useShortsUses: () => uses, useGeolocation: () => ({ location: {}, loading: false }) },
    }).default;
    assert.match(renderToString(React.createElement(Home)), />error</);
  }
});
