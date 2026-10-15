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

test('Jev requests use Gateway and validate boolean probabilities', async () => {
  const originalFetch = global.fetch;
  const originalError = console.error;
  const originalKey = process.env.AI_GATEWAY_API_KEY;
  delete process.env.AI_GATEWAY_API_KEY;
  console.error = () => {};
  try {
    const { getResponse } = load('app/actions/ai.ts', {
      '@vercel/oidc': { getVercelOidcToken: async () => 'test-oidc' },
    });
    for (const probability of [0, 0.2, 0.5, 0.9, 1, -1, 2, '0.8', null]) {
      global.fetch = async (url, options) => {
        assert.equal(url, 'https://ai-gateway.vercel.sh/v1/evaluate');
        assert.equal(options.headers.Authorization, 'Bearer test-oidc');
        assert.equal(options.cache, 'no-store');
        const request = JSON.parse(options.body);
        assert.equal(request.model, 'typesafe-ai/jev');
        assert.equal(request.questions.wearShorts.type, 'boolean');
        assert.equal(request.state.units.temperature, 'Celsius');
        return { ok: true, headers: new Headers(), json: async () => ({
          answers: { wearShorts: { type: 'boolean', probability } },
        }) };
      };
      const result = await getResponse({ avgTemp: 23 });
      const valid = typeof probability === 'number' && probability >= 0 && probability <= 1;
      assert.equal(result.error, !valid);
      assert.equal(result.wearShorts, valid && probability > 0.5);
    }
  } finally {
    global.fetch = originalFetch;
    console.error = originalError;
    if (originalKey === undefined) delete process.env.AI_GATEWAY_API_KEY;
    else process.env.AI_GATEWAY_API_KEY = originalKey;
  }
});

test('Gateway API keys take precedence; HTTP, network, and malformed responses fail safely', async () => {
  const originalFetch = global.fetch;
  const originalError = console.error;
  const originalKey = process.env.AI_GATEWAY_API_KEY;
  process.env.AI_GATEWAY_API_KEY = 'test-key';
  const logs = [];
  console.error = (...args) => logs.push(args);
  try {
    const { getResponse } = load('app/actions/ai.ts', {
      '@vercel/oidc': { getVercelOidcToken: () => { throw new Error('OIDC must not be used'); } },
    });
    for (const mode of ['http', 'network', 'malformed', 'json']) {
      global.fetch = async (url, options) => {
        assert.equal(options.headers.Authorization, 'Bearer test-key');
        if (mode === 'network') throw new Error('private upstream details');
        return { ok: mode !== 'http', status: 402, headers: new Headers(), json: async () => {
          if (mode === 'json') throw new SyntaxError('private response');
          if (mode === 'http') return { error: { type: 'no_providers_available', message: 'Gateway denied test-key' } };
          return {};
        } };
      };
      assert.equal((await getResponse({})).error, true);
    }
    assert.equal(logs.length, 4);
    assert.doesNotMatch(JSON.stringify(logs), /test-key|private/);
    delete process.env.AI_GATEWAY_API_KEY;
    global.fetch = async () => { assert.fail('Missing credentials must not send a request'); };
    assert.equal((await getResponse({})).error, true);
  } finally {
    global.fetch = originalFetch;
    console.error = originalError;
    if (originalKey === undefined) delete process.env.AI_GATEWAY_API_KEY;
    else process.env.AI_GATEWAY_API_KEY = originalKey;
  }
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
