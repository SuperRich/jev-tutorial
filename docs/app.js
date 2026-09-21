(() => {
  'use strict';

  const { LESSONS } = window;
  const app = document.getElementById('app');
  const last = LESSONS.length - 1;

  const state = { step: 0, quizPicks: {}, simPicks: {}, copied: null };

  const clamp = (n) => Math.min(Math.max(n, 0), last);

  function parseStep(hash) {
    const m = /^#\/(\d+)$/.exec(hash);
    return m ? clamp(Number(m[1])) : 0;
  }

  function go(step) {
    location.hash = `#/${clamp(step)}`;
  }

  const current = () => LESSONS[state.step];

  const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESCAPES[c]);

  const paras = (list) => list.map((p) => `<p>${esc(p)}</p>`).join('');
  const items = (list) => list.map((p) => `<li>${esc(p)}</li>`).join('');

  const SIM_PROMPT = {
    classify: 'Pick a ticket. Jev picks the label.',
    route: 'Pick a Claude Code turn. Jev picks cheap or strong.',
  };

  const VIEWS = {
    teach: {
      body: (l) => paras(l.body),
      complete: () => true,
    },

    split: {
      body: (l) => `
        <div class="split">
          <section class="use"><h2>Use</h2><ul>${items(l.use)}</ul></section>
          <section class="dont"><h2>Don't use</h2><ul>${items(l.dont)}</ul></section>
        </div>`,
      complete: () => true,
    },

    quiz: {
      body: (l, s) => {
        const pick = s.quizPicks[l.id];
        const right = pick === l.correctId;
        const choices = l.choices
          .map((c) => {
            const picked = pick === c.id;
            const mark = picked ? (right ? ' is-right' : ' is-wrong') : '';
            return `<button type="button" class="choice${mark}" data-action="quiz-pick"
              data-choice="${c.id}" data-key="quiz:${c.id}" aria-pressed="${picked}">${esc(c.label)}</button>`;
          })
          .join('');
        const feedback = !pick
          ? ''
          : right
            ? `<p class="feedback is-right" role="status">Right. ${esc(l.because)}</p>`
            : `<p class="feedback is-wrong" role="status">Wrong. ${esc(l.because)} Pick again.</p>`;
        return `<p class="prompt">${esc(l.prompt)}</p><div class="choices">${choices}</div>${feedback}`;
      },
      complete: (l, s) => s.quizPicks[l.id] === l.correctId,
    },

    sim: {
      body: (l, s) => {
        const pick = s.simPicks[l.id];
        const cases = l.cases
          .map(
            (c) => `<button type="button" class="choice" data-action="sim-pick"
              data-case="${c.id}" data-key="sim:${c.id}" aria-pressed="${pick === c.id}">${esc(c.input)}</button>`,
          )
          .join('');
        const hit = l.cases.find((c) => c.id === pick);
        const result = !hit
          ? ''
          : `<div class="result" role="status">
              <div class="result-head"><span class="badge">FAKE</span><span class="note">Typed JSON decision</span></div>
              <pre>${esc(JSON.stringify(hit.output, null, 2))}</pre>
              <p class="why">${esc(hit.because)}</p>
            </div>`;
        return `
          <p class="note">Local fake output. No network.</p>
          <p class="prompt">${SIM_PROMPT[l.mode]}</p>
          <div class="choices">${cases}</div>
          ${result}`;
      },
      complete: (l, s) => Boolean(s.simPicks[l.id]),
    },

    commands: {
      body: (l, s) => {
        const steps = l.steps
          .map((st, i) => {
            const key = `copy:${i}`;
            const copied = s.copied === key;
            return `<li>
              <span class="label">${esc(st.label)}</span>
              <div class="cmd">
                <pre><code>${esc(st.cmd)}</code></pre>
                <button type="button" class="btn${copied ? ' is-right' : ''}" data-action="copy"
                  data-i="${i}" data-key="${key}">${copied ? 'Copied' : 'Copy'}</button>
              </div>
            </li>`;
          })
          .join('');
        return `
          ${paras(l.intro)}
          <ol class="steps">${steps}</ol>
          <ul class="notes">${items(l.notes)}</ul>
          <p class="source">Source: <a href="${esc(l.sourceHref)}" target="_blank" rel="noopener noreferrer">${esc(l.sourceLabel)}</a></p>`;
      },
      complete: () => true,
    },

    done: {
      body: (l) => `
        ${paras(l.body)}
        <h2>Links</h2>
        <ul class="links">${l.links
          .map((k) => `<li><a href="${esc(k.href)}" target="_blank" rel="noopener noreferrer">${esc(k.label)}</a></li>`)
          .join('')}</ul>`,
      complete: () => true,
    },
  };

  function render(s) {
    const lesson = LESSONS[s.step];
    const view = VIEWS[lesson.kind];
    const focused = document.activeElement && document.activeElement.dataset.key;
    const next =
      s.step === last
        ? `<a class="btn" href="#/0" data-key="next">Start again</a>`
        : `<button type="button" class="btn btn-primary" data-action="next" data-key="next"
            ${view.complete(lesson, s) ? '' : 'disabled'}>Next</button>`;

    document.title = `${lesson.title} | Jev tutorial`;
    app.innerHTML = `
      <header class="top">
        <span class="brand">jev-tutorial</span>
        <span class="progress">${s.step + 1} / ${LESSONS.length}</span>
      </header>
      <div class="bar" aria-hidden="true"><span style="width:${((s.step + 1) / LESSONS.length) * 100}%"></span></div>
      <article class="lesson lesson-${lesson.kind}">
        <h1 tabindex="-1">${esc(lesson.title)}</h1>
        ${view.body(lesson, s)}
      </article>
      <nav class="nav" aria-label="Lesson">
        <button type="button" class="btn" data-action="back" data-key="back" ${s.step === 0 ? 'disabled' : ''}>Back</button>
        ${next}
      </nav>`;

    if (focused) {
      const el = app.querySelector(`[data-key="${focused}"]`);
      if (el) el.focus();
    }
  }

  function copyText(text) {
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch (_) {
        ok = false;
      }
      ta.remove();
      return ok;
    };
    if (!navigator.clipboard || !navigator.clipboard.writeText) return Promise.resolve(fallback());
    return navigator.clipboard.writeText(text).then(() => true, fallback);
  }

  function flashCopied(key) {
    state.copied = key;
    render(state);
    setTimeout(() => {
      if (state.copied !== key) return;
      state.copied = null;
      render(state);
    }, 1500);
  }

  const ACTIONS = {
    back: () => go(state.step - 1),
    next: () => {
      const l = current();
      if (VIEWS[l.kind].complete(l, state)) go(state.step + 1);
    },
    'quiz-pick': (el) => {
      state.quizPicks[current().id] = el.dataset.choice;
      render(state);
    },
    'sim-pick': (el) => {
      state.simPicks[current().id] = el.dataset.case;
      render(state);
    },
    copy: (el) => {
      const cmd = current().steps[Number(el.dataset.i)].cmd;
      copyText(cmd).then((ok) => {
        if (ok) flashCopied(el.dataset.key);
      });
    },
  };

  app.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    ACTIONS[el.dataset.action](el);
  });

  window.addEventListener('hashchange', () => {
    state.step = parseStep(location.hash);
    state.copied = null;
    render(state);
    window.scrollTo(0, 0);
    app.querySelector('h1').focus({ preventScroll: true });
  });

  state.step = parseStep(location.hash);
  render(state);
})();
