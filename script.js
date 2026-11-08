// Ora: a small chat demo that answers questions about Zakria's work.
// No AI and no server. Each answer below was written by hand; Ora picks the one
// whose keywords match the question best.
(function () {
  'use strict';

  var LINKS = {
    ascend: { label: 'Visit AscendDay', href: 'https://ascendday.com' },
    portfolio: { label: 'Portfolio', href: 'https://zakyprojects.github.io/' },
    work: { label: 'See all work', href: 'https://zakyprojects.github.io/#work' },
    email: { label: 'Email Zakria', href: 'mailto:mzakriakhan55@gmail.com?subject=Hello%20Zakria' },
    linkedin: { label: 'LinkedIn', href: 'https://www.linkedin.com/in/zakria-khan-dev' },
    github: { label: 'GitHub', href: 'https://github.com/zakyprojects' },
    finance: { label: 'Finance Tracker', href: 'https://zakyprojects.github.io/finance-tracker/' },
    weather: { label: 'Weather app', href: 'https://zakyprojects.github.io/weather/' },
    todo: { label: 'Todo app', href: 'https://zakyprojects.github.io/todo/' },
    password: { label: 'Password generator', href: 'https://zakyprojects.github.io/Random-Password-Generator/' },
    qr: { label: 'QR code generator', href: 'https://zakyprojects.github.io/qr-code-generator/' },
    quotes: { label: 'Quote of the day', href: 'https://zakyprojects.github.io/quotes-generator/' },
    services: { label: 'Services', href: 'https://zakyprojects.github.io/#services' }
  };

  // Which "file" each answer comes from. Shown while Ora looks it up, and in the explorer.
  var FILES = {
    about: 'about.md', location: 'about.md', lang: 'about.md', interests: 'about.md', why: 'about.md', experience: 'about.md', cv: 'about.md',
    build: 'projects/README.md', ascend: 'projects/ascendday.tsx', 'ascend-tech': 'projects/ascendday.tsx',
    tradeedge: 'projects/tradeedge.ts', finance: 'projects/finance-tracker.js', small: 'projects/small-apps/', code: 'projects/README.md',
    ora: 'ora.md', stack: 'stack.json', edu: 'education.md',
    hire: 'services.md', services: 'services.md', price: 'services.md', reviews: 'services.md', contact: 'contact.ts'
  };
  var TREE = [
    { file: 'about.md', q: 'Who is Zakria?' },
    { folder: 'projects' },
    { file: 'projects/ascendday.tsx', q: 'Tell me about AscendDay', nested: true },
    { file: 'projects/tradeedge.ts', q: 'Tell me about TradeEdge', nested: true },
    { file: 'projects/finance-tracker.js', q: 'Tell me about the Finance Tracker', nested: true },
    { file: 'projects/small-apps/', q: 'Show the small projects', nested: true },
    { file: 'stack.json', q: 'What\'s his stack?' },
    { file: 'services.md', q: 'What services does he offer?' },
    { file: 'education.md', q: 'Where did he study?' },
    { file: 'contact.ts', q: 'How do I contact him?' },
    { file: 'ora.md', q: 'How do you work?' }
  ];

  // Each answer: keywords (single words or short phrases), the reply, optional links and follow-up chips.
  var ANSWERS = [
    {
      id: 'greet',
      keys: ['hi', 'hello', 'hey', 'salam', 'assalam', 'assalamualaikum', 'aoa', 'good morning', 'good evening'],
      reply: ['Hello! I can tell you about Zakria: what he builds, his skills, and how to work with him. What would you like to know?'],
      next: ['What does Zakria build?', 'Is he available for work?']
    },
    {
      id: 'salam',
      keys: ['assalam', 'assalamualaikum', 'salam', 'aoa'],
      weight: 2,
      reply: ['Wa alaikum assalam! I can tell you about Zakria\'s projects, skills and how to reach him. Where should we start?'],
      next: ['What does Zakria build?', 'Tell me about AscendDay']
    },
    {
      id: 'about',
      keys: ['zakria', 'kon', 'kaun', 'who is he', 'about him', 'introduce', 'background', 'himself', 'tell me about zakria'],
      reply: [
        'Zakria Khan is a web developer and Computer Science student from Risalpur, Khyber Pakhtunkhwa, Pakistan.',
        'He works mostly with React, TypeScript and Supabase, and cares about the details: speed, phones, and code that\'s easy to change. His biggest project is AscendDay, an app with real users that he planned, built and keeps improving.'
      ],
      links: ['portfolio'],
      next: ['Tell me about AscendDay', 'What\'s his stack?']
    },
    {
      id: 'build',
      weight: 1.2,
      keys: ['build', 'builds', 'make', 'projects', 'project', 'work', 'portfolio', 'made', 'created', 'apps'],
      reply: [
        'Here\'s what he has built:',
        { list: [
          'AscendDay: a gamified self-improvement app, live in beta.',
          'TradeEdge: a trading journal for spot traders, in progress and private.',
          'Finance Tracker: income and expenses with charts.',
          'Ora: me, a chat demo.',
          'Smaller ones: weather, todo, password, QR code and quote apps.'
        ] }
      ],
      links: ['work'],
      next: ['Tell me about AscendDay', 'Show the small projects']
    },
    {
      id: 'ascend',
      keys: ['ascendday', 'ascend', 'habit', 'habits', 'gamified', 'league', 'leagues', 'points', 'self improvement', 'biggest'],
      weight: 2,
      reply: [
        'AscendDay is his main project: a gamified self-improvement app. Daily habits, focus sessions, journaling, skills and workouts turn into points, and friends compete on weekly and monthly leagues. A new season starts every 90 days.',
        'The hard part he solved: habit apps are easy to cheat. So points are calculated on the server, data syncs across devices and works offline, and the app installs on phones with push reminders.'
      ],
      links: ['ascend'],
      next: ['How is AscendDay built?', 'What\'s his stack?']
    },
    {
      id: 'ascend-tech',
      keys: ['how is ascendday built', 'under the hood', 'architecture', 'backend', 'database', 'security', 'how built', 'tech behind'],
      weight: 2,
      reply: [
        'Under the hood, AscendDay runs on React, TypeScript, Vite and Tailwind, with Supabase for the backend:',
        { code: 'tree', name: 'ascendday/', text: [
          'ascendday/',
          '├── client    React · TypeScript · Vite · Tailwind',
          '├── data      Postgres + row-level security (you only see your own data)',
          '├── server    edge functions · scheduled jobs · server-side points',
          '├── sync      offline first, synced across devices',
          '├── app       installable PWA with push reminders',
          '└── ship      automated tests → CI check → Vercel'
        ] }
      ],
      links: ['ascend'],
      next: ['Is he available for work?']
    },
    {
      id: 'tradeedge',
      keys: ['tradeedge', 'trading', 'trade', 'journal', 'expectancy', 'trader', 'traders'],
      weight: 2,
      reply: ['TradeEdge is a trading journal for spot traders, still in progress and private. It tracks trades and shows clear stats like expectancy and R, each with its sample size, and a beginner mode explains things in plain words.'],
      next: ['What else has he built?']
    },
    {
      id: 'finance',
      keys: ['finance', 'tracker', 'money', 'expense', 'expenses', 'budget', 'income'],
      weight: 2,
      reply: ['Finance Tracker lets you write down income and expenses and see where the money goes each month, with charts, search and CSV export. Your data stays in your own browser.'],
      links: ['finance'],
      next: ['Show the small projects']
    },
    {
      id: 'small',
      keys: ['small projects', 'small apps', 'weather app', 'todo', 'to do app', 'password', 'qr', 'quote app', 'quotes app', 'quote of the day', 'mini projects', 'other projects', 'what else'],
      weight: 1.5,
      reply: ['These are the smaller apps he built while learning. Each one is live:'],
      links: ['weather', 'todo', 'password', 'qr', 'quotes'],
      next: ['Tell me about AscendDay']
    },
    {
      id: 'ora',
      weight: 1.5,
      keys: ['ora', 'you', 'yourself', 'are you ai', 'ai', 'bot', 'chatgpt', 'gemini', 'real', 'robot', 'how do you work'],
      reply: [
        'I\'m Ora, a small demo. I\'m not an AI: Zakria wrote every answer himself, and I match your question to the closest one. So I only know about his work, but everything I say is true.'
      ],
      next: ['What does Zakria build?', 'How do I contact him?']
    },
    {
      id: 'stack',
      keys: ['stack', 'skills', 'skill', 'tech', 'technologies', 'languages programming', 'react', 'typescript', 'supabase', 'javascript', 'tools', 'know', 'frontend', 'front end'],
      reply: [
        'His main stack is React, TypeScript and Supabase. Here\'s the full list:',
        { code: 'json', name: 'stack.json', text: [
          '{',
          '  "main": ["React", "TypeScript", "Supabase"],',
          '  "frontend": ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS"],',
          '  "backend": ["Supabase", "PostgreSQL", "SQL", "Edge Functions"],',
          '  "tools": ["Git", "GitHub", "Vite", "Vercel", "VS Code"],',
          '  "also": ["Python", "Flask", "SQLite", "C", "C++"]',
          '}'
        ] }
      ],
      next: ['What services does he offer?', 'Where did he study?']
    },
    {
      id: 'edu',
      keys: ['study', 'studied', 'education', 'university', 'degree', 'student', 'cs50', 'harvard', 'certificate', 'college'],
      reply: [
        'He\'s doing a BS in Computer Science at The University of Agriculture, Peshawar (2024 to 2028).',
        'He started with Harvard\'s CS50x and earned its certificate in 2025, then finished the lectures of CS50P (Python) and CS50W (web programming).'
      ],
      next: ['What\'s his stack?']
    },
    {
      id: 'hire',
      keys: ['hire', 'available', 'can he build', 'can you build', 'build me', 'make me', 'need a website', 'need an app', 'kaam', 'availability', 'job', 'freelance', 'freelancer', 'remote', 'work with', 'open to', 'opportunity', 'role'],
      weight: 1.5,
      reply: ['Yes. Zakria is available for remote jobs and freelance work. The best way to start is a short email about your project or role.'],
      links: ['email', 'linkedin'],
      next: ['What services does he offer?']
    },
    {
      id: 'services',
      keys: ['services', 'service', 'offer', 'help with', 'help my', 'website', 'landing page', 'web app', 'dashboard', 'fix', 'speed', 'slow'],
      reply: [
        'He can help with three things:',
        { list: [
          'Websites and landing pages: fast, clean, good on phones and on Google.',
          'Web apps: dashboards, trackers and tools with sign-in and a real database.',
          'Fix and speed up: finding why a site is slow or broken on phones, and fixing it.'
        ] }
      ],
      links: ['services', 'email'],
      next: ['How much does he charge?', 'How do I contact him?']
    },
    {
      id: 'price',
      keys: ['price', 'pricing', 'paise', 'kitne', 'kitna', 'cost', 'charge', 'rate', 'rates', 'budget', 'how much', 'fee', 'quote me'],
      weight: 1.5,
      reply: ['It depends on the size of the work, so he prefers to hear about it first. Send him a short email with what you need and your timeline, and he\'ll reply with a clear price.'],
      links: ['email'],
      next: ['What services does he offer?']
    },
    {
      id: 'contact',
      keys: ['contact', 'rabta', 'number de', 'email', 'reach', 'message', 'talk', 'linkedin', 'github', 'mail', 'social', 'connect'],
      reply: [
        'Email is the quickest way. He\'s also on LinkedIn and GitHub:',
        { code: 'ts', name: 'contact.ts', text: [
          'export const contact = {',
          '  email: "mzakriakhan55@gmail.com",',
          '  linkedin: "linkedin.com/in/zakria-khan-dev",',
          '  github: "github.com/zakyprojects",',
          '  based: "Risalpur, Pakistan",',
          '  works: "remote",',
          '};'
        ] }
      ],
      links: ['email', 'linkedin', 'github'],
      next: ['Is he available for work?']
    },
    {
      id: 'location',
      keys: ['where', 'location', 'based', 'country', 'city', 'pakistan', 'from', 'live', 'timezone'],
      reply: ['He\'s based in Risalpur, Khyber Pakhtunkhwa, Pakistan, and works remotely.'],
      next: ['Is he available for work?']
    },
    {
      id: 'lang',
      keys: ['language', 'languages', 'speak', 'english', 'urdu', 'pashto'],
      weight: 1.2,
      reply: ['He speaks Pashto (native), Urdu (fluent) and English (intermediate to fluent).'],
      next: ['How do I contact him?']
    },
    {
      id: 'interests',
      keys: ['hobby', 'hobbies', 'interests', 'free time', 'psychology', 'like to do', 'outside coding'],
      reply: ['Outside coding, he reads about psychology and how habits form. That interest is a big part of why he built AscendDay.'],
      next: ['Tell me about AscendDay']
    },
    {
      id: 'help',
      keys: ['help', 'help me', 'what can you do', 'what can i ask', 'options', 'menu', 'commands', 'start'],
      weight: 2,
      reply: ['I can answer questions about Zakria: his projects, how AscendDay works, his skills, education, services, and how to reach him. Pick one to start:'],
      next: ['What does Zakria build?', 'What\'s his stack?', 'What services does he offer?', 'How do I contact him?']
    },
    {
      id: 'why',
      keys: ['why hire', 'why should', 'why him', 'strengths', 'strength', 'good at', 'best at', 'what makes', 'different', 'stand out'],
      weight: 2,
      reply: [
        'Honest answer: he ships real things and keeps improving them. AscendDay is live with real users, and he built the hard parts himself, like server-side points, offline sync and push reminders.',
        'He also cares about the boring details that matter: speed on phones, clean code that\'s easy to change, and honest products.'
      ],
      links: ['ascend', 'work'],
      next: ['Is he available for work?']
    },
    {
      id: 'experience',
      keys: ['experience', 'years', 'senior', 'junior', 'how long', 'worked at', 'companies', 'company', 'employer'],
      weight: 1.5,
      reply: ['He\'s a Computer Science student (2024 to 2028) who learns by building real apps. His biggest is AscendDay, which he planned, built and keeps shipping to real users. For a job or project, the best proof is to try it and look at the code.'],
      links: ['ascend', 'github'],
      next: ['What\'s his stack?', 'Is he available for work?']
    },
    {
      id: 'reviews',
      keys: ['reviews', 'review', 'clients', 'client', 'testimonials', 'rating', 'ratings', 'fiverr', 'upwork', 'trust'],
      weight: 1.5,
      reply: ['He doesn\'t list client reviews yet, and he won\'t show fake ones. What you can check for yourself: AscendDay is live, and his code is public on GitHub.'],
      links: ['ascend', 'github'],
      next: ['Is he available for work?']
    },
    {
      id: 'cv',
      keys: ['cv', 'resume', 'résumé', 'curriculum'],
      weight: 2,
      reply: ['There\'s no CV posted yet. His portfolio covers his work, skills and education, and he can send more details by email.'],
      links: ['portfolio', 'email']
    },
    {
      id: 'code',
      keys: ['source code', 'code', 'open source', 'repo', 'repository', 'repositories'],
      weight: 1.2,
      reply: ['Most of his projects are public on GitHub, including this one. TradeEdge is private while it\'s in progress.'],
      links: ['github']
    },
    {
      id: 'private',
      keys: ['age', 'how old', 'phone', 'phone number', 'whatsapp', 'address', 'home', 'married', 'girlfriend', 'wife', 'salary', 'family', 'photo', 'picture', 'face', 'instagram', 'password of', 'personal'],
      weight: 2.5,
      reply: ['That\'s personal, so I\'ll leave it to Zakria. For anything about work, email is the best way to reach him.'],
      links: ['email'],
      next: ['What does Zakria build?']
    },
    {
      id: 'offtopic',
      keys: ['weather', 'temperature', 'news', 'today in', 'joke', 'jokes', 'funny', 'poem', 'essay', 'write me', 'write a', 'translate', 'recipe', 'capital of', 'president', 'prime minister', 'who won', 'score', 'cricket', 'football', 'movie', 'movies', 'song', 'music', 'game', 'time now', 'what time', 'what date', 'stock', 'bitcoin', 'crypto', 'homework', 'assignment', 'debug my', 'fix my code', 'meaning of life', 'google'],
      weight: 2.5,
      reply: ['That\'s outside what I know. I\'m a small demo that only knows Zakria and his work, so I can\'t look things up or chat about other topics. Here\'s what I can help with:'],
      next: ['What does Zakria build?', 'Is he available for work?', 'How do I contact him?']
    },
    {
      id: 'rude',
      keys: ['stupid', 'idiot', 'dumb', 'useless', 'shut up', 'hate', 'trash', 'sucks', 'worst', 'fool'],
      weight: 3,
      reply: ['Fair enough, I\'m only a simple demo. If something here could be better, Zakria would like to hear it. An email works best.'],
      links: ['email']
    },
    {
      id: 'thanks',
      keys: ['thanks', 'thank', 'thx', 'shukriya', 'great', 'nice', 'cool', 'awesome', 'ok', 'okay'],
      reply: ['Happy to help! Anything else you\'d like to know about Zakria?'],
      next: ['How do I contact him?', 'What does Zakria build?']
    },
    {
      id: 'bye',
      keys: ['bye', 'goodbye', 'see you', 'allah hafiz', 'khuda hafiz'],
      weight: 1.5,
      reply: ['Thanks for stopping by. If you\'d like to work with Zakria, an email is the quickest way.'],
      links: ['email']
    }
  ];

  var FALLBACK = {
    reply: ['I only know about Zakria and his work, so that one\'s outside what I can answer. Try one of these:'],
    next: ['What does Zakria build?', 'What\'s his stack?', 'Is he available for work?', 'How do I contact him?']
  };

  var START_CHIPS = ['What does Zakria build?', 'Tell me about AscendDay', 'What\'s his stack?', 'Is he available for work?', 'How do I contact him?'];

  // ---------- Matching ----------
  var MATH = { reply: ['I\'m not a calculator, sorry. I only know about Zakria and his work.'], next: ['What does Zakria build?', 'What\'s his stack?'] };
  var GIBBERISH = { reply: ['I didn\'t catch that. Try asking in a few words, like "What does he build?"'], next: ['What does Zakria build?', 'Is he available for work?', 'How do I contact him?'] };
  var REDIRECT = {
    reply: ['I\'m still not sure what you mean. If your question is for Zakria himself, he answers email personally.'],
    links: ['email'],
    next: ['What does Zakria build?', 'Is he available for work?']
  };

  function normalize(s) {
    return ' ' + s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9+\-*/=\s]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
  }
  // Small typo tolerance: "ascnedday" or "skils" still match. Only for words of 5+ letters.
  function close(a, b) {
    if (Math.abs(a.length - b.length) > 2) return false;
    var prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length] <= 1 || (a.length > 6 && prev[b.length] <= 2);
  }

  var NO_FUZZY = ['offtopic', 'private', 'rude'];   // these only fire on exact words
  var misses = 0;
  var lastAsked = null;

  function pick(text) {
    var q = normalize(text);
    var letters = q.replace(/[^a-z]/g, '');
    if (/\d\s*[-+*/x=]\s*\d/.test(q) && letters.replace(/x/g, '').length < 12) return MATH;
    if (letters.length < 2 || !/[aeiou]/.test(letters)) return GIBBERISH;

    var words = q.trim().split(' ');
    var best = null, bestScore = 0;
    ANSWERS.forEach(function (a) {
      var score = 0;
      a.keys.forEach(function (k) {
        var key = normalize(k);
        var size = key.trim().split(' ').length;
        if (q.indexOf(key) !== -1) score += size;               // exact word or phrase
        else if (size === 1 && NO_FUZZY.indexOf(a.id) === -1 && key.trim().length >= 5 && words.some(function (w) { return w.length >= 4 && close(w, key.trim()); })) score += 0.8; // near miss
      });
      score *= a.weight || 1;
      if (score > bestScore) { bestScore = score; best = a; }
    });

    if (!best) {
      misses += 1;
      return misses >= 2 ? REDIRECT : FALLBACK;
    }
    misses = 0;
    return best;
  }

  // ---------- Rendering ----------
  var thread = document.getElementById('thread');
  var chips = document.getElementById('chips');
  var form = document.getElementById('composer');
  var input = document.getElementById('input');
  var send = document.getElementById('send');
  var tabFile = document.getElementById('tab-file');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var busy = false;
  var asked = 0;
  var stopWriting = null;
  var timers = [];

  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function scrollDown() { thread.scrollTop = thread.scrollHeight; }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function extOf(name) { return /\/$/.test(name) ? 'dir' : (name.split('.').pop() || ''); }
  function setBusy(v) { busy = v; send.disabled = v || !input.value.trim(); }

  function head(who, extra) {
    var h = el('div', 'entry-head');
    if (who === 'ora') { var img = el('img'); img.src = 'avatar.svg'; img.alt = ''; h.appendChild(img); }
    h.appendChild(el('span', 'who', who));
    if (extra) h.appendChild(extra);
    return h;
  }

  function addMine(text) {
    var e = el('div', 'entry me');
    e.appendChild(head('you'));
    e.appendChild(el('div', 'body', text));
    thread.appendChild(e);
    scrollDown();
  }

  // Tiny highlighter for the code cards (json / ts / tree). Builds DOM nodes, never HTML strings.
  function paintLine(line, lang) {
    var span = el('span', 'ln');
    if (lang === 'tree') {
      var m = line.match(/^([│├└─\s]*)(\S+)(\s*)(.*)$/);
      if (!m) { span.textContent = line; return span; }
      span.appendChild(el('span', 't-dim', m[1]));
      span.appendChild(el('span', 't-key', m[2]));
      span.appendChild(document.createTextNode(m[3]));
      span.appendChild(el('span', 't-str', m[4]));
      return span;
    }
    var re = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(export|const|let|return)\b|(\d+(?:\.\d+)?)|([{}\[\],;:=])|([A-Za-z_$][\w$]*)(\s*:)?/g;
    var last = 0, m2;
    while ((m2 = re.exec(line))) {
      if (m2.index > last) span.appendChild(document.createTextNode(line.slice(last, m2.index)));
      if (m2[1]) { span.appendChild(el('span', m2[2] ? 't-key' : 't-str', m2[1])); if (m2[2]) span.appendChild(el('span', 't-pun', m2[2])); }
      else if (m2[3]) span.appendChild(el('span', 't-kw', m2[3]));
      else if (m2[4]) span.appendChild(el('span', 't-num', m2[4]));
      else if (m2[5]) span.appendChild(el('span', 't-pun', m2[5]));
      else if (m2[6]) { span.appendChild(el('span', m2[7] ? 't-key' : '', m2[6])); if (m2[7]) span.appendChild(el('span', 't-pun', m2[7])); }
      last = re.lastIndex;
    }
    if (last < line.length) span.appendChild(document.createTextNode(line.slice(last)));
    return span;
  }

  // Ora's reply: written word by word, code cards line by line.
  function addOra(answer, done) {
    var e = el('div', 'entry ora writing');
    var src = null;
    var file = answer.id && FILES[answer.id];
    if (file) { src = el('span', 'src'); src.appendChild(document.createTextNode('· from ')); src.appendChild(el('b', '', file)); }
    e.appendChild(head('ora', src));
    var body = el('div', 'body');
    e.appendChild(body);
    thread.appendChild(e);

    var steps = [];                      // each step reveals one piece
    answer.reply.forEach(function (part) {
      if (typeof part === 'string') {
        var p = el('p'); body.appendChild(p); p.hidden = true;
        steps.push({ kind: 'words', node: p, words: part.split(' ') });
      } else if (part.list) {
        var ul = el('ul'); body.appendChild(ul); ul.hidden = true;
        part.list.forEach(function (item, i) {
          var li = el('li'); ul.appendChild(li);
          steps.push({ kind: 'words', node: li, words: item.split(' '), parent: i === 0 ? ul : null });
        });
      } else if (part.code) {
        var card = el('div', 'code'); card.hidden = true;
        var ch = el('div', 'code-head');
        ch.appendChild(el('span', '', part.name));
        ch.appendChild(el('span', '', part.code === 'tree' ? 'tree' : part.code));
        card.appendChild(ch);
        var pre = el('pre'); card.appendChild(pre); body.appendChild(card);
        part.text.forEach(function (line, i) {
          steps.push({ kind: 'line', pre: pre, line: line, lang: part.code, parent: i === 0 ? card : null });
        });
      }
    });

    var caret = el('span', 'caret'); caret.setAttribute('aria-hidden', 'true');
    var follow = true;
    function onScroll() { follow = thread.scrollHeight - thread.scrollTop - thread.clientHeight < 80; }
    thread.addEventListener('scroll', onScroll);

    function show(step, full) {
      if (step.parent) step.parent.hidden = false;
      if (step.kind === 'line') { if (!step.done) { step.pre.appendChild(paintLine(step.line, step.lang)); step.done = true; } return; }
      step.node.hidden = false;
      if (full) step.node.textContent = step.words.join(' ');
    }

    function finish() {
      stopWriting = null;
      thread.removeEventListener('scroll', onScroll);
      steps.forEach(function (st) { show(st, true); });
      caret.remove();
      e.classList.remove('writing');
      body.removeAttribute('aria-busy');
      if (answer.links && answer.links.length) {
        var row = el('div', 'links');
        answer.links.forEach(function (key) {
          var l = LINKS[key];
          var a = el('a', '', l.label);
          a.href = l.href;
          if (l.href.indexOf('http') === 0) { a.target = '_blank'; a.rel = 'noopener'; }
          row.appendChild(a);
        });
        body.appendChild(row);
      }
      setChips(answer.next || START_CHIPS);
      if (follow) scrollDown();
      if (done) done();
    }

    if (reduceMotion) { finish(); return; }
    body.setAttribute('aria-busy', 'true');
    var si = 0, wi = 0;
    function tick() {
      if (si >= steps.length) { finish(); return; }
      var st = steps[si], pause;
      if (st.kind === 'line') {
        show(st); si += 1; pause = 70;
        var lastLn = st.pre.lastChild; if (lastLn) lastLn.appendChild(caret);
      } else {
        show(st);
        wi += 1;
        st.node.textContent = st.words.slice(0, wi).join(' ');
        st.node.appendChild(caret);
        var w = st.words[wi - 1] || '';
        pause = /[.!?:]$/.test(w) ? 130 : /,$/.test(w) ? 65 : 24 + Math.random() * 20;
        if (wi >= st.words.length) { si += 1; wi = 0; pause += 80; }
      }
      if (follow) scrollDown();
      later(tick, pause);
    }
    stopWriting = function () { clearTimers(); finish(); };
    tick();
  }

  // A short, honest "thinking" log: what Ora is actually doing to find the answer.
  function think(answer, then) {
    var box = el('div', 'think');
    box.setAttribute('role', 'status');
    var spinChars = ['◐', '◓', '◑', '◒'];
    function line(text, file) {
      var l = el('div');
      var sp = el('span', 'spin', '◐');
      l.appendChild(sp);
      l.appendChild(document.createTextNode(text));
      if (file) l.appendChild(el('b', '', file));
      box.appendChild(l);
      return sp;
    }
    thread.appendChild(box);
    var t0 = performance.now();
    var sp1 = line('thinking');
    var frame = 0;
    var spinTimer = setInterval(function () { frame += 1; box.querySelectorAll('.spin:not(.ok)').forEach(function (s) { s.textContent = spinChars[frame % spinChars.length]; }); }, 110);
    timers.push(spinTimer);
    scrollDown();
    var file = answer.id && FILES[answer.id];
    later(function () {
      sp1.textContent = '✓'; sp1.className = 'spin ok';
      if (file) {
        var sp2 = line('reading ', file);
        openTab(file);
        later(function () { sp2.textContent = '✓'; sp2.className = 'spin ok'; end(); }, 420 + Math.random() * 250);
      } else end();
    }, 480 + Math.random() * 300);
    function end() {
      clearInterval(spinTimer);
      var ms = Math.round(performance.now() - t0);
      var l = el('div'); l.appendChild(el('span', 'spin ok', '✓')); l.appendChild(document.createTextNode('answer ready in ' + (ms / 1000).toFixed(1) + 's'));
      box.appendChild(l);
      later(function () { box.remove(); then(); }, 260);
    }
  }

  function openTab(file) {
    tabFile.hidden = false;
    tabFile.textContent = '';
    tabFile.appendChild(el('span', 'dot-file ' + extOf(file)));
    tabFile.appendChild(document.createTextNode(file.split('/').filter(Boolean).pop() + (/\/$/.test(file) ? '/' : '')));
    document.querySelectorAll('.ex-file').forEach(function (b) { b.classList.toggle('active', b.dataset.file === file); });
  }

  function setChips(list) {
    chips.innerHTML = '';
    list.forEach(function (text) {
      var b = el('button', 'chip', text);
      b.type = 'button';
      b.addEventListener('click', function () { ask(text); });
      chips.appendChild(b);
    });
    chips.scrollLeft = 0;
  }

  var lastAsked = null;
  function ask(text) {
    text = String(text).trim();
    if (!text || busy) return;
    setBusy(true);
    closeExplorer();
    addMine(text);
    input.value = '';
    asked += 1;
    document.getElementById('sb-count').textContent = asked + (asked === 1 ? ' question' : ' questions');

    var answer = pick(text);
    var norm = normalize(text);
    if (norm === lastAsked && answer.id && ['thanks', 'greet', 'salam'].indexOf(answer.id) === -1) {
      answer = { id: answer.id, reply: ['Same answer as a moment ago:'].concat(answer.reply), links: answer.links, next: answer.next };
    }
    lastAsked = norm;

    var go = function () { addOra(answer, function () { setBusy(false); }); };
    if (reduceMotion) go(); else think(answer, go);
  }

  function start() {
    clearTimers();
    stopWriting = null;
    thread.innerHTML = '';
    tabFile.hidden = true;
    document.querySelectorAll('.ex-file').forEach(function (b) { b.classList.remove('active'); });
    lastAsked = null;
    var boot = el('div', 'boot');
    [['ora', ' v2 · demo build'], ['loaded', ' ' + TREE.filter(function (n) { return n.file; }).length + ' files from ~/zakria'], ['mode', ' hand-written answers, no AI, nothing leaves your browser']].forEach(function (r) {
      var l = el('div'); l.appendChild(el('b', '', r[0])); l.appendChild(document.createTextNode(r[1])); boot.appendChild(l);
    });
    thread.appendChild(boot);
    setBusy(true);
    addOra({
      reply: ['Hi, I\'m Ora. I know Zakria\'s work by heart: his projects, his stack, and how to reach him. Ask me anything, open a file on the left, or press Ctrl K to see every question.'],
      next: START_CHIPS
    }, function () { setBusy(false); });
  }

  // ---------- Explorer ----------
  var tree = document.getElementById('ex-tree');
  TREE.forEach(function (n) {
    if (n.folder) {
      var f = el('div', 'ex-folder');
      f.appendChild(el('span', 'chev', '▾')); f.appendChild(document.createTextNode(n.folder));
      tree.appendChild(f);
      return;
    }
    var b = el('button', 'ex-file' + (n.nested ? ' nested' : ''));
    b.type = 'button';
    b.dataset.file = n.file;
    b.appendChild(el('span', 'dot-file ' + extOf(n.file)));
    b.appendChild(document.createTextNode(n.file.replace(/^projects\//, '')));
    b.addEventListener('click', function () { if (stopWriting) stopWriting(); ask(n.q); });
    tree.appendChild(b);
  });

  var explorer = document.getElementById('explorer');
  var scrim = document.getElementById('scrim');
  var filesBtn = document.getElementById('files-btn');
  function closeExplorer() { explorer.classList.remove('open'); scrim.hidden = true; filesBtn.setAttribute('aria-expanded', 'false'); }
  filesBtn.addEventListener('click', function () {
    var open = !explorer.classList.contains('open');
    explorer.classList.toggle('open', open); scrim.hidden = !open; filesBtn.setAttribute('aria-expanded', String(open));
  });
  scrim.addEventListener('click', closeExplorer);

  // ---------- Command palette ----------
  var palette = document.getElementById('palette');
  var pInput = document.getElementById('palette-input');
  var pList = document.getElementById('palette-list');
  var QUESTIONS = ['Who is Zakria?', 'What does Zakria build?', 'Tell me about AscendDay', 'How is AscendDay built?', 'Tell me about TradeEdge', 'Tell me about the Finance Tracker', 'Show the small projects', 'What\'s his stack?', 'Where did he study?', 'What services does he offer?', 'How much does he charge?', 'Is he available for work?', 'Why should I hire him?', 'Does he have reviews?', 'How do I contact him?', 'What languages does he speak?', 'How do you work?'];
  var COMMANDS = [
    { label: 'New chat', ic: '↺', run: function () { start(); } },
    { label: 'Switch light or dark theme', ic: '◐', run: function () { toggleTheme(); } },
    { label: 'Open portfolio', ic: '↗', run: function () { window.open('https://zakyprojects.github.io/', '_blank', 'noopener'); } },
    { label: 'Open AscendDay', ic: '↗', run: function () { window.open('https://ascendday.com', '_blank', 'noopener'); } },
    { label: 'Email Zakria', ic: '@', run: function () { location.href = LINKS.email.href; } }
  ];
  var pItems = [], pSel = 0, lastFocus = null;

  function renderPalette() {
    var q = pInput.value.toLowerCase().trim();
    pList.innerHTML = '';
    pItems = [];
    function group(name, list) {
      var hits = list.filter(function (x) { return (x.label || x).toLowerCase().indexOf(q) !== -1; });
      if (!hits.length) return;
      pList.appendChild(el('li', 'group', name));
      hits.forEach(function (x) {
        var item = typeof x === 'string' ? { label: x, ic: '›', run: function () { ask(x); } } : x;
        var li = el('li', 'item');
        li.setAttribute('role', 'option');
        li.appendChild(el('span', 'ic', item.ic));
        li.appendChild(document.createTextNode(item.label));
        var idx = pItems.length;
        li.addEventListener('mousemove', function () { if (pSel !== idx) { pSel = idx; mark(); } });
        li.addEventListener('click', function () { choose(idx); });
        pList.appendChild(li);
        pItems.push({ li: li, item: item });
      });
    }
    group('Questions', QUESTIONS);
    group('Commands', COMMANDS);
    if (!pItems.length) {
      var typed = pInput.value.trim();
      var li = el('li', 'item');
      li.appendChild(el('span', 'ic', '›'));
      li.appendChild(document.createTextNode('Ask: ' + typed));
      li.addEventListener('click', function () { choose(0); });
      pList.appendChild(li);
      pItems.push({ li: li, item: { run: function () { ask(typed); } } });
    }
    pSel = 0; mark();
  }
  function mark() { pItems.forEach(function (x, i) { x.li.classList.toggle('sel', i === pSel); x.li.setAttribute('aria-selected', String(i === pSel)); }); if (pItems[pSel]) pItems[pSel].li.scrollIntoView({ block: 'nearest' }); }
  function openPalette() { lastFocus = document.activeElement; palette.hidden = false; pInput.value = ''; renderPalette(); pInput.focus(); }
  function closePalette() { palette.hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  function choose(i) {
    var x = pItems[i]; if (!x) return;
    closePalette();
    if (busy && stopWriting) stopWriting();
    x.item.run();
  }
  pInput.addEventListener('input', renderPalette);
  pInput.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); pSel = (pSel + 1) % pItems.length; mark(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); pSel = (pSel - 1 + pItems.length) % pItems.length; mark(); }
    else if (e.key === 'Enter') { e.preventDefault(); if (pInput.value.trim() || pItems.length) choose(pSel); }
    else if (e.key === 'Escape') { e.preventDefault(); closePalette(); }
    else if (e.key === 'Tab') { e.preventDefault(); }
  });
  palette.addEventListener('mousedown', function (e) { if (e.target === palette) closePalette(); });
  document.getElementById('palette-btn').addEventListener('click', openPalette);
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); if (palette.hidden) openPalette(); else closePalette(); }
    else if (e.key === '/' && palette.hidden && document.activeElement !== input) { e.preventDefault(); input.focus(); }
    else if (e.key === 'Escape' && palette.hidden && stopWriting) { stopWriting(); }
  });

  // ---------- Composer ----------
  thread.addEventListener('click', function (e) { if (stopWriting && e.target.closest('.writing') && !e.target.closest('a')) stopWriting(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
  input.addEventListener('input', function () { send.disabled = busy || !input.value.trim(); });
  document.getElementById('reset-btn').addEventListener('click', function () { start(); input.focus(); });

  // ---------- Status bar clock (Zakria's local time) ----------
  var clock = document.getElementById('sb-clock');
  function tickClock() {
    try { clock.textContent = 'Risalpur ' + new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Karachi' }).format(new Date()); } catch (e) { clock.hidden = true; }
  }
  tickClock(); setInterval(tickClock, 30000);

  // ---------- Theme (dark by default) ----------
  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  function syncMeta() { meta.content = root.dataset.theme === 'light' ? '#f4f3ef' : '#0b0e14'; }
  function toggleTheme() {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('ora_theme', root.dataset.theme); } catch (e) {}
    syncMeta();
  }
  syncMeta();
  document.getElementById('theme-btn').addEventListener('click', toggleTheme);

  start();
})();
