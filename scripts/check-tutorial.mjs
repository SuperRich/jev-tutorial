#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const docs = join(root, 'docs');

function fail(msg) {
  console.error(`FAIL ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`ok  ${msg}`);
}

const requiredFiles = [
  'docs/index.html',
  'docs/.nojekyll',
  '.github/workflows/pages.yml',
];

for (const rel of requiredFiles) {
  if (existsSync(join(root, rel))) ok(`exists ${rel}`);
  else fail(`missing ${rel}`);
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const textFiles = walk(docs).filter((p) =>
  /\.(html|css|js|md|txt)$/.test(p),
);
const blob = textFiles.map((p) => readFileSync(p, 'utf8')).join('\n');
const readme = existsSync(join(root, 'README.md'))
  ? readFileSync(join(root, 'README.md'), 'utf8')
  : '';
const all = `${blob}\n${readme}`;

if (!blob.trim()) fail('docs/ has no html/css/js text');

const required = [
  ['npm i -g jev-router', 'jev-router install command'],
  ['~/.jev-router.env', 'jev-router env file path'],
  ['JEV_API_KEY', 'JEV_API_KEY'],
  ['jev-claude', 'jev-claude launch'],
  ['/jev-explain', '/jev-explain'],
  ['claude plugin marketplace add typesafe-ai/skills', 'marketplace add'],
  ['claude plugin install typesafe@typesafe-ai', 'plugin install'],
  ['not a coding LLM', 'not a coding LLM'],
  ['smart if-statement', 'smart if-statement'],
  ['function call', 'function call'],
  ['System 1', 'System 1'],
  ['System 2', 'System 2'],
  ['compaction', 'compaction named as a do-not-use'],
  ['no API key', 'tutorial needs no API key'],
  ['https://github.com/gargpratyush/jev-router', 'jev-router source link'],
  ['https://github.com/typesafe-ai/skills', 'TypeSafe skill source link'],
  ['https://superrich.github.io/jev-tutorial/', 'play URL in README'],
];

for (const [needle, label] of required) {
  const hay = needle === 'https://superrich.github.io/jev-tutorial/' ? readme : blob;
  const found =
    needle === 'not a coding LLM'
      ? /not a coding LLM/i.test(hay)
      : needle === 'no API key'
        ? /no API key/i.test(hay)
        : hay.includes(needle);
  if (found) ok(label);
  else fail(`missing ${label}: ${needle}`);
}

const forbidden = [
  ['jev-codex', 'jev-codex is outside the two Claude Code paths'],
  ['npm install -g jev-router', 'use npm i -g jev-router as specified'],
  ['two orders of magnitude', 'do not invent speed claims'],
  ['$0.042', 'do not invent price numbers'],
  ['70ms', 'do not invent latency numbers'],
  ['193.6', 'do not invent eval numbers'],
  ['TYPESAFE_API_KEY', 'not in the two tutorial paths'],
  ['npx skills add', 'not in the two Claude Code paths'],
];

for (const [needle, why] of forbidden) {
  if (all.includes(needle)) fail(`forbidden "${needle}" (${why})`);
  else ok(`absent ${needle}`);
}

if (existsSync(join(root, '.github/workflows/pages.yml'))) {
  const wf = readFileSync(join(root, '.github/workflows/pages.yml'), 'utf8');
  if (wf.includes('actions/deploy-pages') || wf.includes('peaceiris/actions-gh-pages')) {
    ok('pages workflow deploys');
  } else fail('pages workflow does not deploy GitHub Pages');
}

if (/fetch\(|XMLHttpRequest|api\.typesafe\.ai/.test(blob)) {
  fail('tutorial must not call a real Jev API');
} else ok('no live API calls in docs');

console.log(process.exitCode ? 'check failed' : 'check passed');
process.exit(process.exitCode || 0);
