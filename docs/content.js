window.LESSONS = [
  {
    id: 'start',
    kind: 'teach',
    title: 'Jev, then Claude Code',
    body: [
      'This is a click-through. You need no API key.',
      'You will learn what Jev is. Then when to use it. Then two real Claude Code setups.',
      'Copy the commands later. Do not add steps that are not on the screen.',
    ],
  },
  {
    id: 'what',
    kind: 'teach',
    title: 'What Jev is',
    body: [
      "Jev is TypeSafe's System-1 decision model. A classifier.",
      'You send it state. You get a typed JSON decision.',
      'It is not a coding LLM. It does not write functions, comments, or refactors.',
    ],
  },
  {
    id: 's1s2',
    kind: 'teach',
    title: 'System 1 and System 2',
    body: [
      'System 1 is reflex. Classify. Route. Yes or no.',
      'System 2 is reasoning. Long chains. Code. Judging a messy answer.',
      'Jev is System 1. Keep System 2 on a reasoning model.',
    ],
  },
  {
    id: 'if',
    kind: 'teach',
    title: 'A smart if-statement',
    body: [
      'Treat Jev like a smart if-statement. Call it as a function call in your code.',
      'Your code owns the branch. Jev only returns the typed decision.',
    ],
  },
  {
    id: 'use-dont',
    kind: 'split',
    title: "Use and don't use",
    use: [
      'Classify a ticket into a closed set of labels.',
      'Route a Claude Code turn to a cheap model or a strong model.',
      'A yes/no gate in application code.',
    ],
    dont: [
      'Write or refactor code.',
      'Compaction of a chat, or summarising history.',
      'Judging a complex LLM output, such as a long diff or a multi-step plan.',
    ],
  },
  {
    id: 'q-ticket',
    kind: 'quiz',
    title: 'Quiz 1 of 6',
    prompt:
      'Incoming ticket. "Charged twice, refund please." Classify billing vs engineering. Is this a Jev job?',
    choices: [
      { id: 'yes-jev', label: 'Yes, a Jev job' },
      { id: 'no-jev', label: 'No, not a Jev job' },
    ],
    correctId: 'yes-jev',
    because: 'Closed labels. Typed choice. That is classify work.',
  },
  {
    id: 'q-write',
    kind: 'quiz',
    title: 'Quiz 2 of 6',
    prompt: 'Write a TypeScript client for this REST API. Is this a Jev job?',
    choices: [
      { id: 'yes-jev', label: 'Yes, a Jev job' },
      { id: 'no-jev', label: 'No, not a Jev job' },
    ],
    correctId: 'no-jev',
    because: 'That is code generation. A coding LLM. Not Jev.',
  },
  {
    id: 'q-typo',
    kind: 'quiz',
    title: 'Quiz 3 of 6',
    prompt:
      'A Claude Code turn. "Fix the typo in README." Route cheap vs strong. Is this a Jev job?',
    choices: [
      { id: 'yes-jev', label: 'Yes, a Jev job' },
      { id: 'no-jev', label: 'No, not a Jev job' },
    ],
    correctId: 'yes-jev',
    because: 'Route each turn to cheap or strong. That is jev-router.',
  },
  {
    id: 'q-compact',
    kind: 'quiz',
    title: 'Quiz 4 of 6',
    prompt: 'Summarise this 40-message thread so the next model sees less. Is this a Jev job?',
    choices: [
      { id: 'yes-jev', label: 'Yes, a Jev job' },
      { id: 'no-jev', label: 'No, not a Jev job' },
    ],
    correctId: 'no-jev',
    because: 'That is compaction. Do not use Jev for that.',
  },
  {
    id: 'q-judge',
    kind: 'quiz',
    title: 'Quiz 5 of 6',
    prompt:
      'Read this 400-line LLM refactor and say if the architecture is right. Is this a Jev job?',
    choices: [
      { id: 'yes-jev', label: 'Yes, a Jev job' },
      { id: 'no-jev', label: 'No, not a Jev job' },
    ],
    correctId: 'no-jev',
    because: 'Judging a complex LLM output is System 2. Not Jev.',
  },
  {
    id: 'q-urgent',
    kind: 'quiz',
    title: 'Quiz 6 of 6',
    prompt:
      'Is this checkout request urgent? Yes or no, then my code branches. Is this a Jev job?',
    choices: [
      { id: 'yes-jev', label: 'Yes, a Jev job' },
      { id: 'no-jev', label: 'No, not a Jev job' },
    ],
    correctId: 'yes-jev',
    because: 'A function call. A smart if-statement.',
  },
  {
    id: 'sim-classify',
    kind: 'sim',
    title: 'Fake classify',
    mode: 'classify',
    cases: [
      {
        id: 'pay',
        input: 'Payment failed twice. I want a refund.',
        output: { choice: 'billing', confidence: 0.94 },
        because: 'Payment and refund are money words. That is billing.',
      },
      {
        id: 'crash',
        input: 'The app crashes when I tap Save.',
        output: { choice: 'bug', confidence: 0.91 },
        because: 'A crash on one action. That is a bug.',
      },
      {
        id: 'email',
        input: 'Can I change my email?',
        output: { choice: 'account', confidence: 0.88 },
        because: 'A profile detail. That is account.',
      },
    ],
  },
  {
    id: 'sim-route',
    kind: 'sim',
    title: 'Fake route',
    mode: 'route',
    cases: [
      {
        id: 'typo',
        input: 'fix the typo in README',
        output: { choice: 'cheap', confidence: 0.96 },
        because: 'A one-line text change. Cheap tier.',
      },
      {
        id: 'auth',
        input: 'redesign the auth state machine',
        output: { choice: 'strong', confidence: 0.93 },
        because: 'Design work across files. Strong tier.',
      },
      {
        id: 'log',
        input: 'add a log line in parseDate',
        output: { choice: 'cheap', confidence: 0.95 },
        because: 'One known function, one line. Cheap tier.',
      },
      {
        id: 'race',
        input: 'find why the race on checkout only happens in prod',
        output: { choice: 'strong', confidence: 0.92 },
        because: 'Hard debugging with unknowns. Strong tier.',
      },
    ],
  },
  {
    id: 'router',
    kind: 'commands',
    title: 'Path 1: jev-router',
    intro: [
      'Routes each Claude Code turn to a cheap model or a strong model.',
      'This is a wrapper around Claude Code. Jev picks the tier. Claude Code still writes the code.',
    ],
    steps: [
      { label: 'Install', cmd: 'npm i -g jev-router' },
      { label: 'Key file', cmd: 'echo "JEV_API_KEY=..." > ~/.jev-router.env' },
      { label: 'Launch', cmd: 'jev-claude' },
    ],
    notes: [
      'Put JEV_API_KEY in ~/.jev-router.env.',
      'Inside the session, run /jev-explain to see the last routing decision.',
      'You need no API key to finish this tutorial. The commands are for later, on your machine.',
    ],
    sourceHref: 'https://github.com/gargpratyush/jev-router',
    sourceLabel: 'gargpratyush/jev-router',
  },
  {
    id: 'skill',
    kind: 'commands',
    title: 'Path 2: TypeSafe skill',
    intro: [
      'Claude Code writes code that calls the Jev API. Jev still does not write the code.',
    ],
    steps: [
      { label: 'Marketplace', cmd: 'claude plugin marketplace add typesafe-ai/skills' },
      { label: 'Install', cmd: 'claude plugin install typesafe@typesafe-ai' },
    ],
    notes: [
      'Then ask Claude Code to write the function call in your app.',
      'You need no API key to finish this tutorial.',
    ],
    sourceHref: 'https://github.com/typesafe-ai/skills',
    sourceLabel: 'typesafe-ai/skills',
  },
  {
    id: 'q-path-router',
    kind: 'quiz',
    title: 'Which path?',
    prompt: 'I want Claude Code to pick cheap vs strong each turn. Which path?',
    choices: [
      { id: 'jev-router', label: 'jev-router' },
      { id: 'typesafe-skill', label: 'TypeSafe skill' },
    ],
    correctId: 'jev-router',
    because: 'jev-router launches jev-claude and routes per turn.',
  },
  {
    id: 'q-path-skill',
    kind: 'quiz',
    title: 'Which path?',
    prompt: 'I want Claude Code to write app code that calls the Jev API. Which path?',
    choices: [
      { id: 'jev-router', label: 'jev-router' },
      { id: 'typesafe-skill', label: 'TypeSafe skill' },
    ],
    correctId: 'typesafe-skill',
    because: 'The TypeSafe skill teaches Claude Code to write the function call.',
  },
  {
    id: 'done',
    kind: 'done',
    title: "That's the lot",
    body: [
      'Jev classifies. It is not a coding LLM.',
      'Use it as a smart if-statement. A function call in your code.',
      'Skip compaction and complex LLM judgement.',
      'Two Claude Code paths: jev-router for per-turn routing, TypeSafe skill for code that calls Jev.',
      'You needed no API key for this tutorial.',
    ],
    links: [
      { href: 'https://github.com/gargpratyush/jev-router', label: 'jev-router on GitHub' },
      { href: 'https://github.com/typesafe-ai/skills', label: 'typesafe-ai/skills on GitHub' },
      {
        href: 'https://typesafe.ai/blog/introducing-system-one-models-and-jev',
        label: 'TypeSafe blog, introducing System-1 models and Jev',
      },
      {
        href: 'https://jevaiguide.com/integrations/claude-code/',
        label: 'Jev AI guide, Claude Code integration',
      },
      { href: 'https://docs.typesafe.ai/agent-skill', label: 'TypeSafe docs, agent skill' },
    ],
  },
];
