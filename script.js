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
        'Here\'s how AscendDay is built:',
        { list: [
          'React, TypeScript, Vite and Tailwind on the front end',
          'Postgres with row-level security, so each person sees only their own data',
          'Edge functions and scheduled jobs; points are counted on the server',
          'Works offline and syncs across devices',
          'Installable app (PWA) with push reminders',
          'Automated tests and a CI check before every release'
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
        'Email is the quickest way. He\'s also on LinkedIn and GitHub.',
        'Email: mzakriakhan55@gmail.com. He works remotely from Risalpur, Pakistan.'
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
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var busy = false;
  var stopWriting = null;
  var timers = [];

  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(function (t) { if (t && t.cancel) t.cancel(); else clearTimeout(t); }); timers = []; }
  function scrollDown() { thread.scrollTop = thread.scrollHeight; }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function setBusy(v) { busy = v; send.disabled = v || !input.value.trim(); }

  function addMine(text) {
    var e = el('div', 'msg me');
    e.appendChild(el('div', 'bubble', text));
    thread.appendChild(e);
    scrollDown();
  }

  // Small highlighter for the stack card. Builds DOM nodes, never HTML strings.
  function paintLine(line) {
    var span = el('span', 'ln');
    var re = /("(?:[^"\\]|\\.)*")(\s*:)?|([{}\[\],])/g;
    var last = 0, m;
    while ((m = re.exec(line))) {
      if (m.index > last) span.appendChild(document.createTextNode(line.slice(last, m.index)));
      if (m[1]) { span.appendChild(el('span', m[2] ? 't-key' : 't-str', m[1])); if (m[2]) span.appendChild(el('span', 't-pun', m[2])); }
      else span.appendChild(el('span', 't-pun', m[3]));
      last = re.lastIndex;
    }
    if (last < line.length) span.appendChild(document.createTextNode(line.slice(last)));
    return span;
  }

  function oraShell() {
    var e = el('div', 'msg ora');
    var img = el('img', 'av'); img.src = 'avatar.svg'; img.alt = ''; img.width = 28; img.height = 28;
    e.appendChild(img);
    var body = el('div', 'body');
    e.appendChild(body);
    thread.appendChild(e);
    return { e: e, body: body };
  }

  // Ora's reply, written word by word. Click the reply to show it all at once.
  function addOra(answer, done) {
    var shell = oraShell();
    var e = shell.e, body = shell.body;
    e.classList.add('writing');

    var steps = [];
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
        card.appendChild(el('div', 'code-head', part.name));
        var pre = el('pre'); card.appendChild(pre); body.appendChild(card);
        part.text.forEach(function (line, i) {
          steps.push({ kind: 'line', pre: pre, line: line, parent: i === 0 ? card : null });
        });
      }
    });

    var caret = el('span', 'caret'); caret.setAttribute('aria-hidden', 'true');
    var follow = true;
    function onScroll() { follow = thread.scrollHeight - thread.scrollTop - thread.clientHeight < 80; }
    thread.addEventListener('scroll', onScroll);

    function show(step, full) {
      if (step.parent) step.parent.hidden = false;
      if (step.kind === 'line') { if (!step.done) { step.pre.appendChild(paintLine(step.line)); step.done = true; } return; }
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

    // Smooth typing: one animation frame loop, characters added at a steady speed
    // to a single text node (no re-rendering of the whole line on every word).
    var CPS = 75;                         // characters per second
    var si = 0, ci = 0, textNode = null, carry = 0, lastT = 0, raf = 0, pauseUntil = 0;
    function frame(t) {
      if (!lastT) lastT = t;
      var dt = Math.min(t - lastT, 50); lastT = t;
      if (t < pauseUntil) { raf = requestAnimationFrame(frame); return; }
      carry += dt * CPS / 1000;
      while (carry >= 1 && si < steps.length) {
        var st = steps[si];
        if (st.kind === 'line') {
          show(st); si += 1; carry -= 6;
          var lastLn = st.pre.lastChild; if (lastLn) lastLn.appendChild(caret);
          continue;
        }
        if (!textNode) { show(st); st.node.textContent = ''; textNode = document.createTextNode(''); st.node.appendChild(textNode); st.node.appendChild(caret); st.full = st.words.join(' '); }
        var take = Math.min(Math.floor(carry), st.full.length - ci);
        textNode.nodeValue += st.full.slice(ci, ci + take);
        ci += take; carry -= take;
        var ch = st.full.charAt(ci - 1);
        if (ci >= st.full.length) { si += 1; ci = 0; textNode = null; carry = 0; pauseUntil = t + 140; break; }
        if (/[.!?]/.test(ch) && st.full.charAt(ci) === ' ') { carry = 0; pauseUntil = t + 110; break; }
      }
      if (follow) scrollDown();
      if (si >= steps.length) { finish(); return; }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    timers.push({ raf: true, cancel: function () { cancelAnimationFrame(raf); } });
    stopWriting = function () { clearTimers(); finish(); };
  }

  // "Thinking" for a moment, then the answer.
  function think(then) {
    var shell = oraShell();
    shell.e.classList.add('thinking');
    shell.body.setAttribute('role', 'status');
    shell.body.appendChild(el('span', 'think', 'Thinking'));
    scrollDown();
    later(function () { shell.e.remove(); then(); }, 650 + Math.random() * 350);
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
    addMine(text);
    input.value = '';

    var answer = pick(text);
    var norm = normalize(text);
    if (norm === lastAsked && answer.id && ['thanks', 'greet', 'salam'].indexOf(answer.id) === -1) {
      answer = { id: answer.id, reply: ['Same answer as a moment ago:'].concat(answer.reply), links: answer.links, next: answer.next };
    }
    lastAsked = norm;

    var go = function () { addOra(answer, function () { setBusy(false); }); };
    if (reduceMotion) go(); else think(go);
  }

  function start() {
    clearTimers();
    stopWriting = null;
    thread.innerHTML = '';
    lastAsked = null;
    var intro = el('div', 'intro');
    intro.appendChild(el('p', 'intro-tag', '// ask about zakria'));
    intro.appendChild(el('h1', '', 'Hi, I\'m Ora.'));
    intro.appendChild(el('p', 'intro-text', 'I know Zakria\'s work: what he builds, the tools he uses, and how to reach him. Pick a question or type your own.'));
    thread.appendChild(intro);
    setChips(START_CHIPS);
    setBusy(false);
  }

  thread.addEventListener('click', function (e) { if (stopWriting && e.target.closest('.writing') && !e.target.closest('a')) stopWriting(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
  input.addEventListener('input', function () { send.disabled = busy || !input.value.trim(); });
  document.getElementById('reset-btn').addEventListener('click', function () { start(); input.focus(); });

  // ---------- Theme (dark by default) ----------
  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  function syncMeta() { meta.content = root.dataset.theme === 'light' ? '#f4f3ef' : '#0d1015'; }
  function toggleTheme() {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('ora_theme', root.dataset.theme); } catch (e) {}
    syncMeta();
  }
  syncMeta();
  document.getElementById('theme-btn').addEventListener('click', toggleTheme);

  start();
})();
