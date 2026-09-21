# jev-tutorial

A click-through tutorial on Jev and two Claude Code setups. Plain HTML, CSS, and JavaScript. No build step. The tutorial runs with no API key.

https://superrich.github.io/jev-tutorial/

If that URL 404s, open the repo Settings, then Pages, and set Source to GitHub Actions. The workflow publishes the `docs` folder from `main`. Until then, open `docs/index.html` locally.

Repo: https://github.com/SuperRich/jev-tutorial

## What you'll learn

- What Jev is: a TypeSafe System-1 classifier. Typed JSON decisions. Not a coding LLM.
- When to use it. A smart if-statement, a function call. Not compaction. Not judging complex LLM outputs.
- Two Claude Code paths: jev-router (`jev-claude`) and the TypeSafe skill (plugin install).

## Run it locally

Open `docs/index.html` in a browser, or serve the `docs` folder with any static file server.

## Check the content

```sh
node scripts/check-tutorial.mjs
```
