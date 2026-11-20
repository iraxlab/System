/* IRA X LAB · iraxlab.com · pages are built from data/entries.json */
(function () {
  'use strict';

  var DATA = { shelves: [], entries: [] };
  var view = document.getElementById('view');
  /* real page per topic (SEO): the page says which route it shows when the address has no #hash */
  var ROUTE0 = document.body.getAttribute('data-route') || '';
  function curHash() { return location.hash.replace(/^#/, '') || ROUTE0; }
  var topTrack = document.getElementById('shelfTrack');
  var subnav = document.getElementById('subnav');
  var subTrack = document.getElementById('subTrack');
  var panel = document.getElementById('panel');
  var sticky = document.getElementById('sticky');
  var q = document.getElementById('q');
  var results = document.getElementById('results');
  var spy = null;

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- study music: one looping track, off until pressed ---------- */
  var tuneBtn = document.getElementById('tune'), tune = null;
  function setTune(on) {
    tuneBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    var t = on ? 'Pause study music' : 'Play study music';
    tuneBtn.setAttribute('aria-label', t); tuneBtn.title = on ? 'Study music on' : 'Study music';
  }
  tuneBtn.addEventListener('click', function () {
    if (!tune) { tune = new Audio('media/study-music.mp3'); tune.loop = true; tune.volume = 0.5; tune.preload = 'auto'; }
    if (tune.paused) { var pr = tune.play(); if (pr && pr.catch) pr.catch(function () { setTune(false); }); setTune(true); }
    else { tune.pause(); setTune(false); }
  });

  /* ---------- bell: a soft chime on every link click ---------- */
  var bellBtn = document.getElementById('bell');
  var soundOn = true, actx = null;
  try { soundOn = localStorage.getItem('irax-sound') !== 'off'; } catch (e) {}
  function setBell() {
    bellBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    var t = soundOn ? 'Sound on' : 'Sound off';
    bellBtn.setAttribute('aria-label', t); bellBtn.title = t;
  }
  function chime() {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      var t0 = actx.currentTime, out = actx.createGain();
      out.gain.value = 0.14; out.connect(actx.destination);
      [[1318.5, 1, 1.4], [2637, 0.35, 0.8], [3951, 0.12, 0.5]].forEach(function (p) {
        var o = actx.createOscillator(), g = actx.createGain();
        o.type = 'sine'; o.frequency.value = p[0];
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(p[1], t0 + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + p[2]);
        o.connect(g); g.connect(out); o.start(t0); o.stop(t0 + p[2] + 0.05);
      });
    } catch (e) {}
  }
  bellBtn.addEventListener('click', function () {
    soundOn = !soundOn; setBell();
    try { localStorage.setItem('irax-sound', soundOn ? 'on' : 'off'); } catch (e) {}
    chime();
  });
  setBell();
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href], button');
    if (a && a !== bellBtn) chime();
  }, true);

  /* ---------- lab details: paste links here; each one appears on the site once it is set ---------- */
  var SITE = {
    email: 'iraxlab@gmail.com',
    social: [
      ['Instagram', 'https://www.instagram.com/iraxlab'],
      ['YouTube', 'https://www.youtube.com/@iraxlab'],
      ['LinkedIn', 'https://www.linkedin.com/in/iraxlab'],
      ['TikTok', 'https://www.tiktok.com/@iraxlab'],
      ['X', 'https://twitter.com/iraxlab']
    ]
  };
  function socialsOn() { return SITE.social.filter(function (x) { return /^https:\/\//.test(x[1]); }); }
  function socialHtml() {
    var AB = { Instagram: 'IG', YouTube: 'YT', LinkedIn: 'IN', TikTok: 'TT', X: 'X' };
    return socialsOn().map(function (x) {
      return '<a class="soc" href="' + x[1] + '" target="_blank" rel="noopener" title="' + x[0] + '" aria-label="' + x[0] + ' (opens in a new tab)">' +
        '<span class="ab">' + (AB[x[0]] || x[0]) + '</span><span class="full">' + x[0] + '</span></a>';
    }).join('');
  }
  document.getElementById('footSocial').innerHTML = socialHtml();
  document.getElementById('navSocial').innerHTML = socialHtml();
  document.getElementById('navSocialM').innerHTML = socialHtml();

  /* back to top */
  var toTopBtn = document.getElementById('toTop');
  function showTop() { toTopBtn.hidden = window.scrollY < 600; }
  window.addEventListener('scroll', showTop, { passive: true });
  toTopBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* mobile site menu */
  var menuBtn = document.getElementById('menuBtn'), siteNav = document.getElementById('siteNav');
  menuBtn.addEventListener('click', function () {
    var open = siteNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  siteNav.addEventListener('click', function (e) {
    if (e.target.closest('a')) { siteNav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  });

  /* ---------- support: paste the donation link here; buttons appear once it is set ---------- */
  var GIVE_URL = 'https://ko-fi.com/iraxlab';
  var GIVE_ON = /^https:\/\//.test(GIVE_URL);
  var heartN = 0;
  function heart() {
    var id = 'hc' + (++heartN), d = 'M24 41S6 30 6 17a9 9 0 0 1 18-3 9 9 0 0 1 18 3c0 13-18 24-18 24z';
    return '<svg class="give-ico" viewBox="0 0 48 48" aria-hidden="true">' +
      '<defs><clipPath id="' + id + '"><path d="' + d + '"/></clipPath></defs>' +
      '<g clip-path="url(#' + id + ')"><rect class="heart-fill" x="0" y="0" width="48" height="48"/></g>' +
      '<path d="' + d + '" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></svg>';
  }
  function giveHtml(size) {
    return '<section class="give give-' + size + '" aria-label="Support">' +
      '<div class="wrap give-in">' + heart() +
        '<div class="give-text"><span class="give-label">Support the lab</span>' +
          '<h2>Your gift keeps the lab open</h2>' +
          '<p>IRA X LAB is free for everyone. No ads, no paywall. Each gift pays for new methods, sketches and videos.</p></div>' +
        (GIVE_ON ? '<a class="give-btn" href="' + GIVE_URL + '" target="_blank" rel="noopener">Give now <span aria-hidden="true">→</span></a>' : '') +
      '</div></section>';
  }
  document.getElementById('giveFoot').innerHTML = giveHtml('foot');
  var ts = document.getElementById('topStrip'); if (GIVE_ON) ts.href = GIVE_URL; else { ts.removeAttribute('target'); ts.removeAttribute('rel'); }

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function safeUrl(u) { return /^(https?:|media\/)/i.test(u || '') ? u : '#'; }
  function hashOf(id) { return '#' + String(id).replace('.', '-'); }
  function secById(id) { return DATA.shelves.filter(function (s) { return s.id === id; })[0]; }
  function secBySlug(sl) { return DATA.shelves.filter(function (s) { return s.slug === sl; })[0]; }
  function secHash(s, extra) { return '#' + s.slug + (extra ? '-' + extra : ''); }
  function groupsOf(s) { return (s && s.groups) || []; }
  function partsOf(s) { return (s && s.parts) || []; }
  function num(e) { return e.lesson || e.id; }
  function gtilesHtml(s, list, compact, only) {
    function tiles(gs) {
      return '<div class="gtiles' + (compact ? ' compact' : '') + '">' + gs.map(function (g) {
        var its = list.filter(function (e) { return e.group === g.n; }), c = its.length;
        var d = its.filter(function (e) { return isDone(e.id); }).length, nx = g.n === nextChapterOf(s, only) && !compact;
        var tone = (g.part ? g.part === 1 : g.n === 1) ? 'b' : 's';
        return '<a class="gtile' + (nx ? ' next' : '') + (c && d === c ? ' done' : '') + (!c ? ' soon' : '') + '" href="' + secHash(s, g.n) + '">' + caseSvg(nx ? 'b' : tone) + '<span class="n">' + pnum(g) + '</span><b>' + esc(g.title) + '</b>' +
          '<span class="c">' + (compact ? c + ' topics' : esc(g.line)) + '</span>' +
          (compact ? '' : '<span class="prog">' + (!c ? 'Coming soon' : (nx ? (d ? 'Continue here · ' : (Object.keys(DONE).length ? 'Next up · ' : 'Start here · ')) : '') + d + ' / ' + c + ' done' + (planOf(s, g.n).length ? ' · ' + planOf(s, g.n).length + ' coming' : '')) + '</span>') + '</a>';
      }).join('') + '</div>';
    }
    if (only) return tiles(only);
    if (!partsOf(s).length) return tiles(groupsOf(s));
    return partsOf(s).map(function (p) {
      var gs = groupsOf(s).filter(function (g) { return g.part === p.n; });
      return '<div class="part-label">' + esc(p.title) + '</div>' + tiles(gs);
    }).join('');
  }
  function seriesOf(s) { return (s && s.series) || []; }
  function serById(s, id) { return seriesOf(s).filter(function (x) { return x.id === id; })[0]; }
  function partsIn(s, g) { return g && g.series ? groupsOf(s).filter(function (x) { return x.series === g.series; }) : groupsOf(s); }
  function seriesGroups(s, sid) { return groupsOf(s).filter(function (x) { return x.series === sid; }); }
  function pnum(g) { return g.pn || g.n; }
  function setAcc(ser) {
    if (ser) { view.style.setProperty('--acc', ser.color); view.style.setProperty('--acc-ink', ser.ink || '#000'); }
    else { view.style.removeProperty('--acc'); view.style.removeProperty('--acc-ink'); }
  }
  function seriesTabs(s, on) {
    return seriesOf(s).map(function (x) { return { href: secHash(s, x.id), n: String(x.n), label: x.short || x.title, on: x.id === on, color: x.color }; });
  }
  function groupById(s, n) { return groupsOf(s).filter(function (g) { return g.n === n; })[0]; }
  function entriesOn(id) {
    return DATA.entries.filter(function (e) { return e.shelf === id; })
      .sort(function (a, b) {
        var la = String(a.lesson || '').split('.').map(Number), lb = String(b.lesson || '').split('.').map(Number);
        return ((a.group || 0) - (b.group || 0)) || ((la[1] || 0) - (lb[1] || 0)) || a.id.localeCompare(b.id, undefined, { numeric: true });
      });
  }
  function entryById(id) { return DATA.entries.filter(function (e) { return e.id === id; })[0]; }
  function slots(n) { var h = ''; for (var i = 0; i < n; i++) h += '<div class="slot"></div>'; return '<div class="slots">' + h + '</div>'; }
  function pic(name, alt, eager) {
    return '<picture><source type="image/webp" srcset="media/' + name + '-750.webp 750w, media/' + name + '-1500.webp 1500w" sizes="(max-width:900px) 100vw, 1200px">' +
      '<img src="media/' + name + '-1500.jpg" srcset="media/' + name + '-750.jpg 750w, media/' + name + '-1500.jpg 1500w" sizes="(max-width:900px) 100vw, 1200px" alt="' + esc(alt) + '" width="1500" height="858"' + (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async"></picture>';
  }
  function scrollToEl(el, smooth) {
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - sticky.offsetHeight - 18;
    window.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'instant' });
  }
  function toTop() { window.scrollTo({ top: 0, behavior: 'instant' }); }

  /* aluminum case icon: 'b' = bronze (key), 's' = silver */
  function caseSvg(tone) {
    var fill = tone === 'b' ? '#AA976C' : '#C0C0C0', latch = tone === 'b' ? '#000' : '#AA976C', line = tone === 'b' ? '#000' : '#fff';
    return '<svg class="case-svg case-' + tone + '" viewBox="0 0 108 78" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M42 18v-6a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v6" stroke="#000" stroke-width="2.5"/>' +
      '<rect x="6" y="42" width="96" height="33" rx="4" stroke="#000" stroke-width="2.5" fill="' + fill + '"/>' +
      '<path d="M12 58h84" stroke="' + line + '" stroke-width="1.5" opacity=".6"/>' +
      '<g class="lid"><rect x="6" y="18" width="96" height="24" rx="4" stroke="#000" stroke-width="2.5" fill="' + fill + '"/>' +
      '<path d="M12 30h84" stroke="' + line + '" stroke-width="1.5" opacity=".6"/></g>' +
      '<rect x="24" y="38" width="9" height="9" rx="1.5" fill="' + latch + '" stroke="' + latch + '"/>' +
      '<rect x="75" y="38" width="9" height="9" rx="1.5" fill="' + latch + '" stroke="' + latch + '"/>' +
    '</svg>';
  }
  function legend() {
    return '<p class="legend"><span>' + caseSvg('b') + 'Bronze case · key, start here</span><span>' + caseSvg('s') + 'Silver case · more depth</span></p>';
  }

  /* ---------- top menu: the 12 sections ---------- */
  function buildTopNav() {
    topTrack.style.setProperty('--n', DATA.shelves.length);
    var secM = document.getElementById('navSecM');
    if (secM) secM.innerHTML = DATA.shelves.map(function (s) { return '<a href="' + secHash(s) + '"><span class="n">' + s.id + '</span>' + esc(s.short || s.title) + '</a>'; }).join('');
    topTrack.innerHTML = DATA.shelves.map(function (s) {
      return '<button class="chip" data-sec="' + s.id + '" aria-expanded="false" title="' + esc(s.title) + '" aria-label="' + esc(s.id + ' ' + s.title) + '"><span class="n">' + s.id + '</span><span class="l">' + esc(s.short || s.title) + '</span></button>';
    }).join('');
    topTrack.addEventListener('click', function (e) {
      var b = e.target.closest('.chip');
      if (!b) return;
      var s = secById(b.getAttribute('data-sec'));
      closePanel();
      var h = secHash(s);
      if (location.hash === h) { route(); window.scrollTo(0, 0); } else location.hash = h;
    });
  }

  function openPanel(id) {
    var s = secById(id);
    var list = entriesOn(id);
    var body;
    if (groupsOf(s).length) {
      body = gtilesHtml(s, list, true);
    } else if (s.slug === 'index') {
      body = '<div class="gtiles">' +
        '<a class="gtile" href="' + secHash(s, 'az') + '"><span class="n">1</span><b>All Topics</b><span class="c">' + DATA.entries.length + ' topics</span></a>' +
        '<a class="gtile" href="' + secHash(s, 'sources') + '"><span class="n">2</span><b>Every Source</b><span class="c">Names and links</span></a>' +
        '<a class="gtile" href="' + secHash(s, 'terms') + '"><span class="n">3</span><b>Every Term</b><span class="c">Plain definitions</span></a></div>';
    } else {
      body = slots(3);
    }
    panel.innerHTML =
      '<div class="wrap panel-in">' +
        '<div class="panel-head">' +
          '<div><span class="pn">' + s.id + '</span><h2>' + esc(s.title) + '</h2><p>' + esc(s.line) + '</p></div>' +
          '<div class="panel-act"><a class="copy" href="' + secHash(s) + '">Open ' + esc(s.title) + '</a>' +
          '<button class="close" aria-label="Close">&times;</button></div>' +
        '</div>' + body +
      '</div>';
    panel.hidden = false;
    panel.setAttribute('data-sec', id);
    markTop(id, true);
    panel.querySelector('.close').addEventListener('click', closePanel);
  }
  function closePanel() {
    panel.hidden = true;
    panel.removeAttribute('data-sec');
    markTop(currentSec(), false);
  }
  function markTop(id, expanded) {
    Array.prototype.forEach.call(topTrack.children, function (c) {
      var on = c.getAttribute('data-sec') === id;
      c.classList.toggle('on', on);
      c.setAttribute('aria-expanded', on && expanded ? 'true' : 'false');
    });
  }
  function currentSec() {
    var h = curHash();
    var m = h.match(/^(\d\d)-\d+$/);
    if (m) return m[1];
    var s = DATA.shelves.filter(function (x) { return h === x.slug || h.indexOf(x.slug + '-') === 0; })[0];
    return s ? s.id : null;
  }

  /* ---------- second menu ---------- */
  // items: { id, label, n } scroll inside the page · { href, label, n, on } open another page
  function setSubnav(items) {
    if (spy) { spy(); spy = null; }
    if (!items || !items.length) { subnav.hidden = true; subTrack.innerHTML = ''; return; }
    subnav.hidden = false;
    subTrack.style.setProperty('--n', Math.min(items.length, 9));
    subTrack.classList.toggle('many', items.length > 9);
    subTrack.innerHTML = items.map(function (it) {
      var inner = (it.color ? '<span class="dot" style="background:' + it.color + '"></span>' : '') + (it.n ? '<span class="n">' + esc(it.n) + '</span>' : '') + '<span class="l">' + esc(it.label) + '</span>';
      return it.href
        ? '<a class="chip' + (it.on ? ' on' : '') + '" href="' + it.href + '">' + inner + '</a>'
        : '<a class="chip" href="#' + it.id + '" data-target="' + it.id + '">' + inner + '</a>';
    }).join('');
    var inPage = items.filter(function (it) { return it.id; });
    if (!inPage.length) return;
    var chips = subTrack.querySelectorAll('.chip[data-target]');
    function onScroll() {
      var line = sticky.offsetHeight + 40, cur = null;
      inPage.forEach(function (it) {
        var el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= line) cur = it.id;
      });
      Array.prototype.forEach.call(chips, function (c) { c.classList.toggle('on', c.getAttribute('data-target') === cur); });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    spy = function () { window.removeEventListener('scroll', onScroll); };
    onScroll();
  }
  subTrack.addEventListener('click', function (e) {
    var a = e.target.closest('.chip[data-target]');
    if (!a) return;
    e.preventDefault();
    scrollToEl(document.getElementById(a.getAttribute('data-target')), true);
  });

  /* ---------- building blocks ---------- */
  /* ---------- progress: lessons a visitor has finished (this browser only) ---------- */
  var DONE = {};
  try { DONE = JSON.parse(localStorage.getItem('irax-done') || '{}') || {}; } catch (err) { DONE = {}; }
  function isDone(id) { return !!DONE[id]; }
  function markDone(id) {
    if (DONE[id]) return; DONE[id] = 1;
    try { localStorage.setItem('irax-done', JSON.stringify(DONE)); } catch (err) {}
  }
  function chapterItems(s, n) { return entriesOn(s.id).filter(function (e) { return e.group === n; }); }
  function chapterDone(s, n) { var it = chapterItems(s, n); return it.length && it.every(function (e) { return isDone(e.id); }); }
  function nextChapterOf(s, only) { var g = (only || groupsOf(s)).filter(function (x) { return chapterItems(s, x.n).length && !chapterDone(s, x.n); })[0]; return g ? g.n : 0; }
  function tile(e, nextId) {
    var done = isDone(e.id), nx = e.id === nextId;
    var label = done ? ' · Done &#10003;' : (nx ? ' · Next up' : (e.key ? ' · Start here' : ''));
    return '<a class="etile' + (e.key ? ' key' : '') + (done ? ' done' : '') + (nx ? ' next' : '') + '" href="' + hashOf(e.id) + '">' + caseSvg(e.key || nx ? 'b' : 's') +
      '<span class="n">' + esc(num(e)) + label + '</span><b>' + esc(e.title) + '</b><span class="w">' + esc(e.what) + '</span></a>';
  }
  function head(n, title, line, id) {
    return '<div class="head"' + (id ? ' id="' + id + '"' : '') + '>' + (n ? '<span class="n">' + n + '</span>' : '') + '<h2>' + esc(title) + '</h2>' + (line ? '<span class="hline">' + esc(line) + '</span>' : '') + '</div>';
  }
  function azNames(list) {
    var names = list.map(function (e) { return { name: e.title, id: e.id, main: true }; });
    DATA.shelves.forEach(function (s) {
      (s.aliases || []).forEach(function (a) {
        if (list.some(function (e) { return e.id === a.id; })) names.push({ name: a.name, id: a.id, main: false });
      });
    });
    names.forEach(function (x) { x.key = x.name.replace(/^(the|a|an)\s+/i, ''); });
    return names.sort(function (a, b) { return a.key.localeCompare(b.key); });
  }
  function azHtml(list) {
    var names = azNames(list), groups = [], cur = null;
    names.forEach(function (x) {
      var L = x.key.charAt(0).toUpperCase();
      if (/\d/.test(L)) L = '#';
      if (!cur || cur.L !== L) { cur = { L: L, items: [] }; groups.push(cur); }
      cur.items.push(x);
    });
    return '<div class="az">' + groups.map(function (g) {
      return '<div class="az-group"><div class="letter">' + esc(g.L) + '</div><ul>' + g.items.map(function (x) {
        var e = entryById(x.id);
        return '<li><a href="' + hashOf(x.id) + '"' + (x.main ? '' : ' class="alias"') + '><span class="nm">' + esc(x.name) + '</span>' +
          '<span class="to">' + esc(e ? num(e) : x.id) + (x.main ? '' : ' · ' + esc(e ? e.title : '')) + '</span></a></li>';
      }).join('') + '</ul></div>';
    }).join('') + '</div>';
  }

  /* ---------- pages ---------- */
  function home() {
    view.innerHTML =
      '<section class="hero">' +
        '<h1 class="sr">IRA X LAB · Laboratory of the Mind</h1>' +
        '<figure>' + pic('hall-far', 'Room of aluminum cases with the bronze IRA X LAB counter', true).replace(/1200px/g, '100vw') + '</figure>' +
      '</section>' +
      giveHtml('home') + '<div class="wrap">' +
        '<section class="section" id="lab">' + head('', 'The Lab') +
          '<div class="cards">' +
            card('01', 'One open place', 'What the mind can do, organized section by section.', 'b') +
            card('02', 'Distilled by Irina', 'Summarized by Irina Medelye, creative founder, step by step.') +
            card('03', 'Open to everyone', 'Free and public, one section at a time.') +
          '</div>' +
        '</section>' +
        '<section class="section" id="sections">' + head('', 'The Sections') +
          '<div class="cases">' + DATA.shelves.map(function (s) {
            return '<a class="case" href="' + secHash(s) + '">' + caseSvg(entriesOn(s.id).length || s.slug === 'index' ? 'b' : 's') +
              '<div><div class="n">' + s.id + '</div><h3>' + esc(s.title) + '</h3><p>' + esc(s.line) + '</p></div></a>';
          }).join('') + '</div>' +
        '</section>' +
        '<section class="section" id="method">' + head('', 'How We Work') +
          '<div class="doc">' +
            '<figure>' + pic('counter', 'Bronze counter with the IRA X LAB logo') + '</figure>' +
            '<ol class="rules">' +
              rule('1', 'Own words', 'Every entry is summarized, never copied.') +
              rule('2', 'Named sources', 'Every entry names its person, institute, book or study.') +
              rule('3', 'Science', 'Science is marked as science.') +
              rule('4', 'Tradition', 'Tradition is marked as tradition, never presented as proven.') +
              rule('5', 'Safety', 'Every practice that changes breath, body or state carries a safety line.', true) +
              rule('6', 'No promises', 'No promises of results, cures or income.', true) +
            '</ol>' +
          '</div>' +
        '</section>' +
      '</div>';
    setSubnav([{ id: 'lab', label: 'The Lab' }, { id: 'sections', label: 'The Sections' }, { id: 'method', label: 'How We Work' }]);
    document.title = 'IRA X LAB · Laboratory of the Mind';
  }
  function card(n, t, p, tone) { return '<div class="card">' + caseSvg(tone || 's') + '<div class="n">' + n + '</div><h3>' + t + '</h3><p>' + p + '</p></div>'; }
  function rule(n, t, p, no) { return '<li' + (no ? ' class="no"' : '') + '><span class="n">' + n + '</span><div><b>' + t + '</b><span>' + p + '</span></div></li>'; }

  /* MIT course blocks are Irina's study list, for now only. At launch set SHOW_STUDY to false to remove them everywhere. */
  var SHOW_STUDY = true;
  function studyHtml(s) {
    if (!SHOW_STUDY || !s.study || !s.study.length) return '';
    var list = entriesOn(s.id);
    return '<section class="section" id="courses">' + head('', 'MIT Courses for This Section') +
      '<p class="study-line">Free courses from MIT OpenCourseWare. The topics here are written from them, in our own words.</p>' +
      '<div class="etiles">' + s.study.map(function (c) {
        var used = list.filter(function (e) { return e.source && e.source.url === c.url; }).map(num);
        return '<a class="etile study' + (used.length ? ' key' : '') + '" href="' + esc(safeUrl(c.url)) + '" target="_blank" rel="noopener">' + caseSvg(used.length ? 'b' : 's') +
          '<span class="n">MIT ' + esc(c.code) + '</span><b>' + esc(c.title) + '</b><span class="w">' + esc(c.focus) + '</span>' +
          '<span class="used">' + (used.length ? 'In topics ' + used.join(' · ') : 'Next to study') + '</span></a>';
      }).join('') + '</div></section>';
  }
  function allLessonsHtml() {
    return DATA.shelves.filter(function (x) { return entriesOn(x.id).length; }).map(function (x) {
      var list = entriesOn(x.id), gs = groupsOf(x);
      if (seriesOf(x).length) {
        var scols = seriesOf(x).map(function (sr) {
          var its = partItems(x, sr).filter(function (it) { return it.e; });
          if (!its.length) return '';
          return '<div class="ix-ch"><a class="ix-cht" href="' + secHash(x, sr.id) + '">' + caseSvg(sr.n === 1 ? 'b' : 's') + '<span>Part ' + sr.n + '</span><b>' + esc(sr.title) + '</b></a><ol>' +
            its.map(function (it) { return '<li><a href="' + hashOf(it.e.id) + '"' + (it.e.key ? ' class="key"' : '') + '><span class="ix-n">' + esc(it.n) + '</span>' + esc(it.e.title) + '</a></li>'; }).join('') + '</ol></div>';
        }).join('');
        return '<section class="section ix" id="all-' + x.id + '">' + head(x.id, x.title, list.length + ' topics') + '<div class="ix-grid">' + scols + '</div></section>';
      }
      var cols = (gs.length ? gs.filter(function (g) { return list.some(function (e) { return e.group === g.n; }); }) : [{ n: 0, title: 'Topics' }]).map(function (g) {
        var items = gs.length ? list.filter(function (e) { return e.group === g.n; }) : list;
        return '<div class="ix-ch"><a class="ix-cht" href="' + secHash(x, g.n || '') + '">' + caseSvg(g.n === 1 || (g.part && g.part === 1) ? 'b' : 's') +
          '<span>' + (g.n ? (g.series ? esc((serById(x, g.series) || {}).short || '') + ' · ' : '') + 'Part ' + pnum(g) : '') + '</span><b>' + esc(g.title) + '</b></a><ol>' +
          items.map(function (e) { return '<li><a href="' + hashOf(e.id) + '"' + (e.key ? ' class="key"' : '') + '><span class="ix-n">' + esc(num(e)) + '</span>' + esc(e.title) + '</a></li>'; }).join('') +
          '</ol></div>';
      }).join('');
      return '<section class="section ix" id="all-' + x.id + '">' + head(x.id, x.title, list.length + ' topics') + '<div class="ix-grid">' + cols + '</div></section>';
    }).join('');
  }
  function partsNav(s, n, all) {
    var gs = partsIn(s, groupById(s, n)), at = gs.map(function (g) { return g.n; }).indexOf(n), pg = gs[at - 1], ng = gs[at + 1];
    return '<nav class="parts-nav" aria-label="Parts">' +
      (pg ? '<a class="pv" href="' + secHash(s, pg.n) + '"><span class="ar">&#8249;</span>Part ' + pnum(pg) + '</a>' : '<span class="pv off"></span>') +
      '<div class="parts-all" style="--n:' + Math.min(gs.length, 6) + '">' + gs.map(function (g) {
        var cls = g.n === n ? ' on' : (chapterDone(s, g.n) ? ' done' : '');
        return '<a class="pa' + cls + '" href="' + secHash(s, g.n) + '" title="' + esc(g.title) + '"' + (g.n === n ? ' aria-current="page"' : '') + '><small>Part ' + pnum(g) + '</small>' + esc(g.short || g.title) + (cls === ' done' ? ' &#10003;' : '') + '</a>';
      }).join('') + '</div>' +
      (ng ? '<a class="nx' + (all ? ' pulse' : '') + '" href="' + secHash(s, ng.n) + '">Part ' + pnum(ng) + '<span class="ar">&#8250;</span></a>' : '<span class="nx off"></span>') +
    '</nav>';
  }
  function planOf(s, n) { return (s.plan || []).filter(function (p) { return p.group === n; }); }
  function planTile(p) {
    return '<div class="etile plan" aria-disabled="true">' + caseSvg('s') + '<span class="n">' + esc(p.lesson) + ' · Coming soon</span><b>' + esc(p.title) + '</b></div>';
  }
  function chapterPage(s, n) {
    var g0 = groupById(s, n), ser = g0 && g0.series ? serById(s, g0.series) : null;
    var gs = partsIn(s, g0), at = gs.map(function (g) { return g.n; }).indexOf(n), g = gs[at];
    setAcc(ser);
    var items = chapterItems(s, n), firstOpen = items.filter(function (e) { return !isDone(e.id); })[0];
    var d = items.filter(function (e) { return isDone(e.id); }).length, all = d === items.length && items.length;
    var pg = gs[at - 1], ng = gs[at + 1];
    view.innerHTML =
      '<section class="sec-hero ch-hero"><canvas class="sec-fx" aria-hidden="true"></canvas><div class="sec-shade"></div>' +
        '<div class="wrap sec-hero-in"><div class="sec-hero-text">' +
          '<a class="back-btn" href="' + secHash(s, ser ? ser.id : '') + '"><span class="ar" aria-hidden="true">&#8249;</span>Back to ' + esc(ser ? ser.title : s.title) + '</a>' +
          '<span class="label">' + s.id + ' ' + esc(s.title) + (ser ? ' · ' + esc(ser.title) : '') + ' · Part ' + pnum(g) + ' of ' + gs.length + '</span>' +
          '<h1>' + esc(g.title) + '</h1><p>' + esc(g.line || '') + '</p>' +
          '<p class="count">' + (items.length ? items.length + (items.length === 1 ? ' topic · ' : ' topics · ') + d + ' / ' + items.length + ' done' : 'Coming soon') + '</p>' +
        '</div></div></section>' +
      '<div class="wrap">' + partsNav(s, n, all) +
        '<section class="section ch-list">' + 
          '<div class="etiles">' + items.map(function (e) { return tile(e, firstOpen ? firstOpen.id : ''); }).concat(planOf(s, n).map(planTile))
            .sort(function (a, b) { var x = +(a.match(/class="n">\d+\.(\d+)/) || [0, 0])[1], y = +(b.match(/class="n">\d+\.(\d+)/) || [0, 0])[1]; return x - y; }).join('') + '</div>' +
          (!items.length ? '<p class="ch-soon">The topics for this part are coming soon.</p>' : '') +
          (all ? '<p class="ch-done">Part done. ' + (ng ? 'Part ' + pnum(ng) + ' is next.' : 'You finished every part of ' + esc(ser ? ser.title : s.title) + '.') + '</p>' : '') +
        '</section>' +
        partsNav(s, n, all) +
      '</div>';
    setSubnav(ser ? seriesTabs(s, ser.id) : gs.map(function (x) { return { href: secHash(s, x.n), n: String(x.n), label: x.short || x.title, on: x.n === n }; }));
    if (window.IRAXFX) IRAXFX.start(view.querySelector('.sec-fx'), s.id);
    document.title = 'Part ' + pnum(g) + ' · ' + g.title + ' · ' + s.title + ' · IRA X LAB';
  }
  function partItems(s, ser) {
    var out = [], list = entriesOn(s.id);
    seriesGroups(s, ser.id).forEach(function (g) {
      var its = list.filter(function (e) { return e.group === g.n; });
      if (!its.length) out.push({ g: g, n: g.ln });
      its.forEach(function (e) { out.push({ g: g, e: e, n: e.lesson }); });
    });
    return out;
  }
  function lessonTile(it, nextId) {
    var g = it.g, e = it.e;
    if (!e) return '<div class="etile plan" id="g' + g.n + '">' + caseSvg('s') + '<span class="n">' + it.n + ' · Coming soon</span><b>' + esc(g.title) + '</b><span class="w">' + esc(g.line) + '</span>' +
      (SHOW_STUDY && g.url ? '<a class="mit" href="' + esc(safeUrl(g.url)) + '" target="_blank" rel="noopener">MIT source</a>' : '') + '</div>';
    var done = isDone(e.id), nx = e.id === nextId;
    var label = done ? ' · Done &#10003;' : (nx ? ' · Next up' : (e.key ? ' · Start here' : ''));
    return '<a class="etile' + (e.key ? ' key' : '') + (done ? ' done' : '') + (nx ? ' next' : '') + '" id="g' + g.n + '" href="' + hashOf(e.id) + '">' + caseSvg(e.key || nx ? 'b' : 's') +
      '<span class="n">' + it.n + label + '</span><b>' + esc(e.title) + '</b><span class="w">' + esc(e.what) + '</span></a>';
  }
  function partLinks(s, ser) {
    return '<nav class="ch-steps part-links" aria-label="Parts">' +
      seriesOf(s).map(function (x) { return '<a class="ser-link' + (x.id === ser.id ? ' on' : '') + '" style="--c:' + x.color + '" href="' + secHash(s, x.id) + '"><small>Part ' + x.n + '</small>' + esc(x.short) + '</a>'; }).join('') +
    '</nav>';
  }
  function ytId(u) {
    var m = String(u || '').trim().match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/) || String(u || '').trim().match(/^([A-Za-z0-9_-]{11})$/);
    return m ? m[1] : '';
  }
  function videoHtml(e) {
    var id = ytId(e.video);
    if (!id) return '<figure class="yt yt-empty" aria-label="Video coming soon"><div class="yt-box">' +
      '<video class="yt-loop" src="media/coming-soon.mp4" poster="media/coming-soon.jpg" muted loop playsinline autoplay preload="auto" aria-hidden="true"></video>' +
      '<div class="yt-wait"><svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#FFFFFF" stroke="#AA976C" stroke-width="2.5"/><path d="M26 20l20 12-20 12z" fill="#AA976C"/></svg>' +
      '<span>Video coming soon</span></div></div></figure>';
    return '<figure class="yt"><div class="yt-box"><iframe src="https://www.youtube-nocookie.com/embed/' + id + '?rel=0" title="' + esc(e.title) + ' · video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div></figure>';
  }
  function lessonBar(s, ser, cur) {
    return '<nav class="lbar" aria-label="All topics in ' + esc(ser.title) + '"><span class="lbar-t">' + esc(ser.title) + '</span><div class="lbar-n">' + partItems(s, ser).map(function (it) {
      if (!it.e) return '<span class="lb soon" title="' + esc(it.g.title) + ' · Coming soon">' + it.n + '</span>';
      var on = it.e.id === cur.id;
      return '<a class="lb' + (on ? ' on' : (isDone(it.e.id) ? ' done' : '')) + '" href="' + hashOf(it.e.id) + '" title="' + esc(it.e.title) + '"' + (on ? ' aria-current="page"' : '') + '>' + it.n + '</a>';
    }).join('') + '</div></nav>';
  }
  function seriesPage(s, ser, slot) {
    var items = partItems(s, ser), list = items.filter(function (it) { return it.e; });
    var d = list.filter(function (it) { return isDone(it.e.id); }).length;
    var firstOpen = list.filter(function (it) { return !isDone(it.e.id); })[0];
    setAcc(ser);
    view.innerHTML =
      '<section class="sec-hero ch-hero"><canvas class="sec-fx" aria-hidden="true"></canvas><div class="sec-shade"></div>' +
        '<div class="wrap sec-hero-in"><div class="sec-hero-text">' +
          '<a class="back-btn" href="' + secHash(s) + '"><span class="ar" aria-hidden="true">&#8249;</span>Back to ' + esc(s.title) + '</a>' +
          '<span class="label">' + s.id + ' ' + esc(s.title) + ' · Part ' + ser.n + ' of ' + seriesOf(s).length + '</span>' +
          '<h1>' + esc(ser.title) + '</h1><p>' + esc(ser.line) + '</p>' +
          '<p class="count">' + items.length + ' topics' + (d ? ' · ' + d + ' done' : '') + '</p>' +
        '</div></div></section>' +
      '<div class="wrap">' +
        '<section class="section part-lessons">' + 
          '<div class="etiles">' + items.map(function (it) { return lessonTile(it, firstOpen ? firstOpen.e.id : ''); }).join('') + '</div>' +
          (SHOW_STUDY && ser.url ? '<p class="study-line"><a href="' + esc(safeUrl(ser.url)) + '" target="_blank" rel="noopener">MIT source for this part</a></p>' : '') +
        '</section>' + partLinks(s, ser) +
      '</div>';
    setSubnav(seriesTabs(s, ser.id));
    if (window.IRAXFX) IRAXFX.start(view.querySelector('.sec-fx'), s.id);
    document.title = ser.title + ' · ' + s.title + ' · IRA X LAB';
    if (slot) { var t = document.getElementById('g' + slot); if (t) setTimeout(function () { scrollToEl(t, false); }, 0); }
  }
  function seriesCards(s) {
    return '<div class="ser-cards">' + seriesOf(s).map(function (x) {
      var gs = seriesGroups(s, x.id), list = entriesOn(s.id).filter(function (e) { return gs.some(function (g) { return g.n === e.group; }); });
      var d = list.filter(function (e) { return isDone(e.id); }).length;
      return '<a class="ser-card" href="' + secHash(s, x.id) + '" style="--c:' + x.color + ';--ci:' + (x.ink || '#000') + '">' +
        '<div class="ser-band">' + caseSvg(x.n === 1 ? 'b' : 's') + '<span>Part ' + x.n + '</span><h3>' + (x.lines || [x.title]).map(esc).join('<br>') + '</h3></div>' +
        '<div class="ser-body"><p>' + esc(x.line) + '</p>' +
        '<span class="ser-meta">' + partItems(s, x).length + ' topics' + (d ? ' · ' + d + ' done' : '') + '</span>' +
        '<span class="ser-open">Open &#8250;</span></div></a>';
    }).join('') + '</div>';
  }
  function sectionPage(s, focus) {
    setAcc(null);
    if (seriesOf(s).length && focus && serById(s, focus)) return seriesPage(s, serById(s, focus));
    var i = DATA.shelves.indexOf(s);
    var N = DATA.shelves.length, prev = DATA.shelves[(i + N - 1) % N], next = DATA.shelves[(i + 1) % N];
    var list = entriesOn(s.id), body = '', sub = [], intro = '';

    if (s.slug === 'index') {
      var sources = {}, terms = [];
      DATA.entries.forEach(function (e) {
        if (e.source && e.source.name) sources[e.source.name] = e.source;
        (e.words || e.terms || []).forEach(function (t) { if (!terms.some(function (x) { return x.term === t.term; })) terms.push(t); });
      });
      var srcList = Object.keys(sources).sort().map(function (k) { return sources[k]; });
      terms.sort(function (a, b) { return a.term.localeCompare(b.term); });
      body =
        allLessonsHtml() +
        '<section class="section" id="sources">' + head('2', 'Every Source') +
          (srcList.length ? '<ol class="rules">' + srcList.map(function (src, k) {
            return '<li><span class="n">' + (k + 1) + '</span><div><b>' + esc(src.name) + '</b><span>' +
              (src.url ? '<a href="' + esc(safeUrl(src.url)) + '" target="_blank" rel="noopener">' + esc(src.url.replace(/^https?:\/\//, '')) + '</a>' : '') + '</span></div></li>';
          }).join('') + '</ol>' : slots(3)) + '</section>' +
        '<section class="section" id="terms">' + head('3', 'Every Term') +
          (terms.length ? '<dl class="tlist">' + terms.map(function (t) { return '<dt>' + esc(t.term) + '</dt><dd>' + esc(t.meaning) + '</dd>'; }).join('') + '</dl>' : slots(3)) + '</section>';
      sub = DATA.shelves.filter(function (x) { return entriesOn(x.id).length; }).map(function (x) { return { id: 'all-' + x.id, n: x.id, label: x.short || x.title }; })
        .concat([{ id: 'sources', n: 'A–Z', label: 'Sources' }, { id: 'terms', n: 'A–Z', label: 'Terms' }]);
    } else if (groupsOf(s).length) {
      if (/^\d+$/.test(focus || '') && groupById(s, +focus)) {
        var fg = groupById(s, +focus);
        return fg.series ? seriesPage(s, serById(s, fg.series), fg.n) : chapterPage(s, +focus);
      }
      if (seriesOf(s).length) {
        intro = '<p class="count">' + seriesOf(s).length + ' parts · ' + list.length + ' topics</p>';
        body = '<section class="section" id="overview">' + seriesCards(s) + '</section>';
        sub = seriesTabs(s, '');
      } else {
      intro = '<p class="count">' + list.length + ' topics · ' + groupsOf(s).length + ' parts</p>';
      body = '<section class="section" id="overview">' + legend() + gtilesHtml(s, list, false) + '</section>' + studyHtml(s);
      sub = groupsOf(s).map(function (g) { return { href: secHash(s, g.n), n: String(g.n), label: g.short || g.title }; });
      if (SHOW_STUDY && s.study && s.study.length && sub.length < 9) sub.push({ id: 'courses', n: 'MIT', label: 'Courses' });
      }
    } else {
      body = list.length
        ? '<section class="section" id="entries">' + '<div class="etiles">' + list.map(tile).join('') + '</div></section>'
        : '';
      body += studyHtml(s);
      if (!body) body = '<section class="section" id="entries">' + slots(3) + '</section>';
    }

    view.innerHTML =
      '<section class="sec-hero"><canvas class="sec-fx" aria-hidden="true"></canvas><div class="sec-shade"></div>' +
        '<div class="wrap sec-hero-in"><div class="sec-hero-text">' +
          '<div class="label">' + s.id + ' / ' + String(DATA.shelves.length).padStart(2, '0') + '</div><h1>' + esc(s.title) + '</h1><p>' + esc(s.line) + '</p>' + intro +
        '</div></div></section>' +
      '<div class="wrap">' + body +
        '<nav class="sec-steps" aria-label="Previous and next section">' +
          '<a href="' + secHash(prev) + '">&#8249; ' + prev.id + ' ' + esc(prev.title) + '</a>' +
          '<a href="#sections">All sections</a>' +
          '<a href="' + secHash(next) + '">' + next.id + ' ' + esc(next.title) + ' &#8250;</a>' +
        '</nav>' +
      '</div>';
    setSubnav(sub);
    if (window.IRAXFX) IRAXFX.start(view.querySelector('.sec-fx'), s.id);
    document.title = s.title + ' · IRA X LAB';
    if (focus) {
      var target = document.getElementById(/^\d$/.test(focus) ? 'g' + focus : focus);
      setTimeout(function () { scrollToEl(target, false); }, 0);
    }
  }

  var PHASE = { P: 'Prepare', D: 'Do', C: 'Check' };

  /* ---------- lesson blocks: explore maps, strips, cards, tiles, stats, flow, neuron, fun ---------- */
  var BRAIN = {
    side:
      '<path class="bm-out" d="M118 232C96 150 168 66 282 58C392 50 492 86 528 168C548 214 534 262 502 286C474 304 446 302 428 298C398 326 330 334 282 320C236 332 186 320 160 294C136 276 122 256 118 232Z"/>' +
      '<path class="bm-out" d="M430 300C440 340 500 352 528 326C546 308 532 286 508 288C488 300 458 304 430 300Z"/>' +
      '<path class="bm-out" d="M392 312C394 350 392 380 386 404L414 404C418 378 420 346 424 312Z"/>' +
      '<path class="bm-line" d="M332 60C318 120 316 190 300 252M190 252C250 236 320 222 392 216M462 92C470 150 474 190 470 232M230 80C214 120 236 160 220 200M258 270C290 280 320 284 360 278M380 70C372 110 392 140 380 180M440 300C470 314 500 316 520 306"/>',
    cut:
      '<path class="bm-out" d="M118 232C96 150 168 66 282 58C392 50 492 86 528 168C548 214 534 262 502 286C474 304 446 302 428 298C410 304 390 300 380 296C360 300 330 300 300 290C250 300 190 300 160 286C136 274 122 256 118 232Z"/>' +
      '<path class="bm-wm" d="M150 228C140 165 190 100 282 92C370 86 452 112 486 172C500 204 494 236 474 256C440 268 400 262 380 254C350 236 330 230 300 232C260 240 210 252 170 250Z"/>' +
      '<path class="bm-out" d="M440 296C448 338 500 350 526 326C544 308 532 284 508 286C488 296 462 300 440 296Z"/>' +
      '<path class="bm-out" d="M352 284C356 320 356 352 352 380L380 380C384 352 386 320 384 284Z"/>' +
      '<path class="bm-out" d="M356 380L358 420L374 420L376 380Z"/>' +
      '<ellipse class="bm-part" cx="305" cy="200" rx="30" ry="20"/>' +
      '<path class="bm-part" d="M318 256C330 244 360 244 368 256C360 262 344 262 336 258"/>' +
      '<ellipse class="bm-part" cx="286" cy="262" rx="11" ry="7"/>' +
      '<path class="bm-part" d="M150 268C162 262 190 262 204 268"/>' +
      '<path class="bm-line" d="M250 70C240 90 262 104 252 124M330 66C322 90 344 104 334 126M410 84C398 106 420 120 408 140M462 300C480 312 500 314 518 304M466 316C482 326 500 326 514 318"/>'
  };
  function icoOf(b, k) { return b.icons && b.icons[k] && window.ICON ? ICON(b.icons[k]) : ''; }
  function icoBox(b, k) { var s = icoOf(b, k); return s ? '<span class="ico-box">' + s + '</span>' : ''; }
  function blockHead(b) { return '<div class="bm-head">' + (b.k ? '<span class="k">' + esc(b.k) + '</span>' : '') + (b.h ? '<h2>' + esc(b.h) + '</h2>' : '') + '</div>'; }
  var BLOCK = {
    explore: function (b, i) {
      return '<section class="bm" data-block="' + i + '">' + blockHead(b) +
        '<div class="bm-body">' +
          '<div class="bm-stage"><svg viewBox="80 40 480 390" role="img" aria-label="Map of the brain">' + (BRAIN[b.view] || BRAIN.side) +
            b.parts.map(function (r) {
              return '<g class="bm-r' + (r.deep ? ' deep' : '') + '" data-n="' + r.n + '" tabindex="0" role="button" aria-label="' + esc(r.name) + '">' +
                '<ellipse class="bm-zone" cx="' + r.x + '" cy="' + r.y + '" rx="' + r.rx + '" ry="' + r.ry + '"/>' +
                '<circle class="bm-dot" cx="' + r.x + '" cy="' + r.y + '" r="11"/>' +
                '<text class="bm-num" x="' + r.x + '" y="' + (r.y + 4) + '">' + r.n + '</text></g>';
            }).join('') +
            '<text class="bm-note" x="96" y="424">Front</text><text class="bm-note" x="510" y="424">Back</text>' +
          '</svg></div>' +
          '<div class="bm-card" aria-live="polite"></div>' +
        '</div>' +
        '<div class="bm-list">' + b.parts.map(function (r) {
          return '<button class="bm-pick" data-n="' + r.n + '"><span>' + r.n + '</span>' + esc(r.name) + '</button>';
        }).join('') + '</div>' +
        (b.foot ? '<p class="bm-foot">' + esc(b.foot) + '</p>' : '') +
      '</section>';
    },
    strip: function (b) {
      return '<section class="bob' + (b.dark ? '' : ' light') + '">' + blockHead(b) +
        '<ol class="bob-strip" style="--n:' + b.items.length + '">' + b.items.map(function (t, k) { return '<li>' + icoBox(b, k) + '<span class="bob-n">' + (k + 1) + '</span><p>' + esc(t) + '</p></li>'; }).join('') + '</ol>' +
        (b.end ? '<p class="bob-end">' + esc(b.end) + '</p>' : '') + '</section>';
    },
    cards: function (b) {
      return '<section class="ideas">' + blockHead(b) +
        '<div class="ideas-grid">' + b.items.map(function (x, k) { return '<div class="idea' + (icoOf(b, k) ? ' has-ico' : '') + '">' + caseSvg(k === 0 ? 'b' : 's') + icoBox(b, k) + '<span class="bm-n">' + (k + 1) + '</span><h3>' + esc(x[0]) + '</h3><p>' + esc(x[1]) + '</p></div>'; }).join('') + '</div></section>';
    },
    tiles: function (b) {
      return '<section class="tools">' + blockHead(b) +
        '<div class="tools-grid">' + b.items.map(function (x, k) { return '<div class="tool' + (icoOf(b, k) ? ' has-ico' : '') + '">' + icoBox(b, k) + '<b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></div>'; }).join('') + '</div>' +
        (b.end ? '<p class="block-end">' + esc(b.end) + '</p>' : '') + '</section>';
    },
    stats: function (b) {
      return '<section class="stats">' + blockHead(b) +
        '<div class="stats-grid">' + b.items.map(function (x, k) { return '<div class="stat">' + icoBox(b, k) + '<b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></div>'; }).join('') + '</div></section>';
    },
    flow: function (b) {
      return '<section class="flow">' + blockHead(b) +
        '<div class="flow-rows">' + b.rows.map(function (r) {
          return '<div class="flow-row' + (r[1] ? '' : ' direct') + '"><span class="fl-a">' + esc(r[0]) + '</span><span class="fl-arrow" aria-hidden="true"></span>' +
            (r[1] ? '<span class="fl-b">' + esc(r[1]) + '</span><span class="fl-arrow" aria-hidden="true"></span>' : '<span class="fl-skip">Direct</span><span class="fl-arrow" aria-hidden="true"></span>') +
            '<span class="fl-c">' + esc(r[2]) + '</span></div>';
        }).join('') + '</div>' + (b.end ? '<p class="block-end">' + esc(b.end) + '</p>' : '') + '</section>';
    },
    neuron: function (b) {
      var svg = '<svg class="neuron-svg" viewBox="0 0 640 160" aria-hidden="true" fill="none" stroke-linecap="round">' +
        '<path d="M70 80L20 40M70 80L16 78M70 80L24 122M44 56L30 30M40 100L22 104M44 60L14 56" stroke="#C0C0C0" stroke-width="3"/>' +
        '<circle cx="90" cy="80" r="26" fill="#111" stroke="#fff" stroke-width="3"/><circle cx="90" cy="80" r="8" fill="#AA976C"/>' +
        '<path d="M116 80H540" stroke="#fff" stroke-width="3"/>' +
        [150, 230, 310, 390, 470].map(function (x) { return '<rect x="' + x + '" y="70" width="56" height="20" rx="10" fill="#AA976C"/>'; }).join('') +
        '<path d="M540 80L580 50M540 80L590 80M540 80L580 112" stroke="#fff" stroke-width="3"/>' +
        '<circle cx="586" cy="46" r="6" fill="#AA976C"/><circle cx="596" cy="80" r="6" fill="#AA976C"/><circle cx="586" cy="116" r="6" fill="#AA976C"/>' +
        '<circle class="spark" cx="120" cy="80" r="6" fill="#fff"/>' +
        [['1', 30, 150], ['2', 90, 132], ['3', 330, 120], ['4', 178, 52], ['5', 610, 150]].map(function (t) {
          return '<g><circle cx="' + t[1] + '" cy="' + t[2] + '" r="10" fill="#000" stroke="#C0C0C0"/><text x="' + t[1] + '" y="' + (t[2] + 4) + '" fill="#fff" font-size="11" font-weight="700" text-anchor="middle" font-family="Inter,sans-serif">' + t[0] + '</text></g>';
        }).join('') + '</svg>';
      return '<section class="neuron">' + blockHead(b) + '<div class="neuron-stage">' + svg + '</div>' +
        '<ol class="neuron-list">' + b.items.map(function (x, k) { return '<li><span class="bob-n">' + (k + 1) + '</span><b>' + esc(x[0]) + '</b><p>' + esc(x[1]) + '</p></li>'; }).join('') + '</ol></section>';
    },
    read: function (b) {
      return '<section class="read">' + blockHead(b) + '<div class="read-body">' + b.paras.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div></section>';
    },
    fun: function (b) { return '<div class="fun"><span class="k">' + esc(b.k || 'Worth knowing') + '</span><p>' + esc(b.text) + '</p></div>'; }
  };
  function blocksHtml(e) {
    return (e.blocks || []).map(function (b, i) {
      var h = BLOCK[b.type] ? BLOCK[b.type](b, i) : '';
      if (h && b.end && (b.type === 'cards' || b.type === 'stats')) h = h.replace(/<\/section>$/, '<p class="block-end">' + esc(b.end) + '</p></section>');
      return h;
    }).join('');
  }
  function blocksWire(e) {
    (e.blocks || []).forEach(function (b, i) {
      if (b.type !== 'explore') return;
      var box = view.querySelector('[data-block="' + i + '"]'); if (!box) return;
      var card = box.querySelector('.bm-card');
      function pick(n) {
        var r = b.parts.filter(function (x) { return x.n === n; })[0]; if (!r) return;
        Array.prototype.forEach.call(box.querySelectorAll('[data-n]'), function (el) { el.classList.toggle('on', +el.getAttribute('data-n') === n); });
        var go = r.link ? '<a class="bm-go" href="#' + r.link + '">Open it &#8250;</a>' : (r.linksec ? '<a class="bm-go" href="#' + r.linksec + '">Go to the section &#8250;</a>' : '');
        card.innerHTML = caseSvg('b') + '<span class="bm-n">' + r.n + ' / ' + b.parts.length + '</span><h3>' + esc(r.name) + '</h3>' +
          '<span class="bm-where">' + esc(r.where) + '</span><p>' + esc(r.job) + '</p>' + go;
      }
      box.addEventListener('click', function (ev) { var t = ev.target.closest('[data-n]'); if (t) pick(+t.getAttribute('data-n')); });
      box.addEventListener('keydown', function (ev) { var t = ev.target.closest('[data-n]'); if (t && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); pick(+t.getAttribute('data-n')); } });
      pick(b.pick || 1);
    });
  }
  function entryPage(id) {
    var e = entryById(id);
    if (!e) return missing();
    var s = secById(e.shelf) || { id: e.shelf, title: '', slug: '' };
    var g = groupById(s, e.group);
    var src = e.source || {};
    var ser = g && g.series ? serById(s, g.series) : null;
    var all = entriesOn(e.shelf).filter(function (x) { var gg = groupById(s, x.group); return !ser || (gg && gg.series === ser.id); }), at = all.indexOf(e);
    setAcc(ser);
    var prev = all[at - 1], next = all[at + 1];
    function lab(x) { return ser ? num(x) + ' · ' : num(x) + ' '; }
    var steps = e.steps || [], n = 0, last = '';
    var stepsHtml = steps.map(function (st) {
      var p = st.p || 'D', h = '';
      if (p !== last) { h += '<li class="phase ph-' + p + '"><span>' + PHASE[p] + '</span></li>'; last = p; }
      n++;
      return h + '<li class="st ph-' + p + '"><span class="num">' + n + '</span><span class="tx">' + esc(st.t) + '</span></li>';
    }).join('');
    view.innerHTML =
      '<div class="wrap"><article class="entry">' +
        '<a class="back-btn" href="' + secHash(s, ser ? ser.id : (g ? g.n : '')) + '"><span class="ar" aria-hidden="true">&#8249;</span>Back to ' + esc(ser ? ser.title : (g ? g.title : s.title)) + '</a>' +
        '<nav class="pn-top" aria-label="Previous and next lesson">' +
          (prev ? '<a class="pt-prev" href="' + hashOf(prev.id) + '"><span class="ar">&#8249;</span><span class="tx"><small>Previous</small>' + esc(lab(prev)) + esc(prev.title) + '</span></a>' : '<span></span>') +
          (next ? '<a class="pt-next pulse" href="' + hashOf(next.id) + '"><span class="tx"><small>Next</small>' + esc(lab(next)) + esc(next.title) + '</span><span class="ar">&#8250;</span></a>' : '<span></span>') +
        '</nav>' +
        
        '<div class="head"><span class="n">' + esc(num(e)) + '</span><h1>' + esc(e.title) + '</h1>' +
          (e.kind ? '<span class="tag">' + esc(e.kind) + '</span>' : '') + '</div>' +
        '<div class="lead">' +
          '<div class="lead-row"><span class="k">What it is</span><p class="big">' + esc(e.what) + '</p></div>' +
          (e.gives ? '<div class="lead-row"><span class="k">What it gives you</span><p>' + esc(e.gives) + '</p></div>' : '') +
        '</div>' +
        videoHtml(e) +
        blocksHtml(e) +
        (e.sketch && !e.blocks ? '<figure class="pic"><div class="pic-img"><img src="' + esc(safeUrl(e.sketch)) + '" alt=""></div>' +
          '<figcaption><span class="k">The picture</span>' + esc(e.pic || '') + '</figcaption></figure>' : '') +
        (e.safety ? '<div class="safety"><span class="k">Safety</span>' + esc(e.safety) + '</div>' : '') +
        '<section class="steps2">' +
          '<div class="steps-head"><h2>Steps' + (e.time ? '<span class="time"> · ' + esc(e.time) + '</span>' : '') + '</h2>' +
            '<button class="copy" id="copySteps">Copy steps</button></div>' +
          '<ol class="stlist">' + stepsHtml + '</ol>' +
        '</section>' +
        ((e.words || []).length ? '<section class="words"><h2>Words to know</h2><dl>' + e.words.map(function (w) {
          return '<div class="w"><dt>' + esc(w.term) + '</dt><dd>' + esc(w.meaning) + '</dd></div>';
        }).join('') + '</dl></section>' : '') +
        (/^MIT OpenCourseWare/.test(src.name || '') ? '' : '<p class="src"><span class="k">Source</span>' + (src.url ? '<a href="' + esc(safeUrl(src.url)) + '" target="_blank" rel="noopener">' + esc(src.name) + '</a>' : esc(src.name || '')) + '</p>') +
        (ser ? lessonBar(s, ser, e) : '') +
        '<nav class="pn" aria-label="Previous and next method">' +
          (prev ? '<a href="' + hashOf(prev.id) + '">&#8249; ' + esc(lab(prev)) + esc(prev.title) + '</a>' : '<span></span>') +
          '<a href="' + secHash(s, g ? g.n : '') + '">' + (ser ? esc(ser.title) : (g ? 'Part ' + pnum(g) : esc(s.title))) + '</a>' +
          (next ? '<a href="' + hashOf(next.id) + '">' + esc(lab(next)) + esc(next.title) + ' &#8250;</a>' : '<span></span>') +
        '</nav>' +
      '</article></div>';
    blocksWire(e);
    var endEl = view.querySelector('.pn');
    if (endEl && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { markDone(e.id); io.disconnect(); } });
      io.observe(endEl);
    }
    Array.prototype.forEach.call(view.querySelectorAll('.pt-next, .pn a'), function (a) { a.addEventListener('click', function () { markDone(e.id); }); });
    document.getElementById('copySteps').addEventListener('click', function () {
      var k = 0, lastP = '';
      copyText(num(e) + ' ' + e.title + '\n' + steps.map(function (st) {
        var p = st.p || 'D', pre = p !== lastP ? '\n' + PHASE[p].toUpperCase() + '\n' : ''; lastP = p;
        return pre + (++k) + '. ' + st.t;
      }).join('\n') + '\n\n' + (e.url ? 'https://iraxlab.com' + e.url : location.origin + location.pathname + hashOf(e.id)));
    });
    setSubnav(ser ? seriesTabs(s, ser.id) : groupsOf(s).map(function (x) { return { href: secHash(s, x.n), n: String(x.n), label: x.short || x.title, on: x.n === e.group }; }));
    document.title = e.title + ' · ' + (ser ? ser.title : s.title) + ' · IRA X LAB';
  }
  function fact(k, v, cls) { return '<div class="fact' + (cls ? ' ' + cls : '') + '"><div class="k">' + k + '</div><div class="v">' + v + '</div></div>'; }


  /* ---------- about pages ---------- */
  var ABOUT_NAV = [['about', 'About the Lab'], ['founder', 'The Founder'], ['offer', 'What We Offer'], ['contact', 'Contact']];
  function aboutShell(key, label, title, lead, body) {
    view.innerHTML =
      '<div class="wrap about">' +
        '<div class="about-top"><div class="label">' + label + '</div><h1>' + title + '</h1>' +
        (lead ? '<p class="about-lead">' + lead + '</p>' : '') + '</div>' + body +
      '</div>';
    setSubnav([]);
    document.title = title.replace(/<[^>]+>/g, '') + ' · IRA X LAB';
    markSite(key);
  }
  function markSite(key) {
    Array.prototype.forEach.call(siteNav.querySelectorAll('a'), function (a) {
      a.classList.toggle('on', a.getAttribute('href') === '#' + key);
    });
  }
  function aboutPage() {
    aboutShell('about', 'IRA X LAB', 'About the Lab',
      'IRA X LAB is an open laboratory of the mind. One clear place for what the mind can do, written as steps anyone can follow.',
      '<section class="section">' + head('', 'What We Do') +
        '<div class="cards">' +
          card('01', 'What we study', 'Consciousness, neuroplasticity, states of mind, focus, breath, the language of the mind and the old practices.', 'b') +
          card('02', 'How we write', 'Each method is cut to what matters: what it is, what it gives you and the steps.') +
          card('03', 'Open to everyone', 'Free and public. No ads, no paywall, no sign-up.') +
        '</div></section>' +
      '<section class="section">' + head('', 'The Name') +
        '<div class="cards">' +
          card('IRA', 'The founder', 'The vision. The lead.', 'b') +
          card('X', 'The variable', 'The unknown. The future.') +
          card('LAB', 'The structure', 'The method. The order.') +
        '</div></section>' +
      '<section class="section">' + head('', 'How We Work') +
        '<div class="doc"><figure>' + pic('counter', 'Bronze counter with the IRA X LAB logo') + '</figure>' +
        '<ol class="rules">' +
          rule('1', 'Own words', 'Every method is summarized, never copied.') +
          rule('2', 'Named sources', 'Every method names its person, institute, book or study.') +
          rule('3', 'Science and tradition', 'Science is marked as science. Tradition is marked as tradition.') +
          rule('4', 'Safety', 'Every practice that changes breath, body or state carries a safety line.', true) +
          rule('5', 'No promises', 'No promises of results, cures or income.', true) +
          rule('6', 'Free', 'Everything here stays free for everyone.') +
        '</ol></div></section>' +
      '<div class="about-next"><a class="btn-dark" href="#sections">See the sections</a><a class="btn-line" href="#founder">Meet the founder</a></div>');
  }
  function founderPage() {
    view.innerHTML =
      '<section class="fd-hero"><div class="wrap fd-hero-in">' +
        '<figure class="fd-photo"><picture><source type="image/webp" srcset="media/irina-medelye-600.webp 600w, media/irina-medelye.webp 1151w" sizes="(max-width:900px) 100vw, 560px"><img src="media/irina-medelye.jpg" srcset="media/irina-medelye-600.jpg 600w, media/irina-medelye.jpg 1151w" sizes="(max-width:900px) 100vw, 560px" width="1151" height="1152" alt="Irina Medelye, creative founder of IRA X LAB" decoding="async"></picture></figure>' +
        '<div class="fd-id">' +
          '<span class="fd-label">The Founder</span>' +
          '<h1>Irina Medelye</h1>' +
          '<p class="fd-role">Creative founder of IRA X LAB</p>' +
          '<div class="fd-stats">' +
            '<div><b>2013</b><span>Founded</span></div>' +
            '<div><b>28</b><span>Years</span></div>' +
            '<div><b>100+</b><span>Brands and clients</span></div>' +
          '</div>' +
          '<p class="fd-fields">Fashion · Fine art · Luxury retail · Immersive 3D · AI film · Brand systems</p>' +
        '</div>' +
      '</div></section>' +
      '<div class="wrap about">' +
        '<section class="fd-pair">' +
          '<article class="fd-panel">' + caseSvg('b') + '<span class="fd-k">01 · Who I am</span>' +
            '<p>I am Irina Medelye, creative founder of IRA X LAB. For 28 years I have worked across fashion, fine art, luxury retail, immersive 3D, AI film and brand systems, with more than 100 brands and clients.</p></article>' +
          '<article class="fd-panel">' + caseSvg('s') + '<span class="fd-k">02 · What I do here</span>' +
            '<p>I keep and distill. I collect what matters about the mind: consciousness, neuroplasticity and states of mind. I sort it, then write each method in my own words, as short steps with a picture.</p></article>' +
        '</section>' +
        '<section class="fd-quote">' +
          '<span class="fd-k">03 · Why this lab</span>' +
          '<blockquote>I have always kept what I learn like an encyclopedia, all in one place. This lab opens that place to everyone looking for clear answers about the mind.</blockquote>' +
          '<p class="fd-sign">Irina</p>' +
        '</section>' +
        '<div class="about-next fd-next"><a class="btn-dark" href="#offer">What we offer</a><a class="btn-line" href="#contact">Contact</a></div>' +
      '</div>';
    setSubnav([]);
    document.title = 'Irina Medelye · IRA X LAB';
    markSite('founder');
  }
  function offerPage() {
    var ig = SITE.social[0][1], yt = SITE.social[1][1];
    function link(u, t) { return /^https:\/\//.test(u) ? ' <a href="' + u + '" target="_blank" rel="noopener">' + t + ' &#8250;</a>' : ''; }
    aboutShell('offer', 'What We Offer', 'What We Offer',
      'Everything is free. Here is what you find, and where.',
      '<section class="section"><div class="cards">' +
        card('01', 'The library', 'Methods with steps, pictures, safety lines and sources, section by section. <a href="#sections">Open &#8250;</a>', 'b') +
        card('02', 'Instagram', 'Each method as a 9-slide carousel: title, what, why, steps, sketch and source.' + link(ig, 'Follow')) +
        card('03', 'YouTube', 'Each section as a video in voice and pictures.' + link(yt, 'Watch')) +
      '</div></section>' +
      '<section class="need">' +
        '<div><span class="label">Need something?</span><h2>Ask for a topic or a method</h2>' +
        '<p>Write to us with a question, a topic you want covered, or a collaboration.</p></div>' +
        '<a class="btn-dark" href="#contact">Contact</a>' +
      '</section>');
  }
  function contactPage() {
    var mail = SITE.email && /@/.test(SITE.email);
    var soc = socialHtml();
    aboutShell('contact', 'Contact', 'Contact',
      'Topic requests, questions about a method, collaborations and press.',
      '<section class="section"><div class="cards">' +
        (mail ? card('01', 'Write to the lab', '<a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + '</a>') : '') +
        (soc ? '<div class="card">' + caseSvg('s') + '<div class="n">02</div><h3>Follow</h3><p class="socials">' + soc + '</p></div>' : '') +
        card('03', 'Support', 'Your gift keeps the lab free. <a href="#support">Give &#8250;</a>', 'b') +
      '</div></section>');
  }
  function missing() {
    view.innerHTML = '<div class="wrap missing">' + head('', 'This page does not exist') + '<p><a href="#">Back to home</a></p></div>';
    setSubnav([]);
  }

  function copyText(t) {
    function done() { toast('Steps copied'); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (x) { /* ignore */ }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).then(done, fallback);
    else fallback();
  }
  function toast(msg) {
    var d = document.createElement('div');
    d.className = 'toast'; d.textContent = msg;
    document.body.appendChild(d);
    setTimeout(function () { d.remove(); }, 1800);
  }

  /* ---------- search ---------- */
  var cursor = -1;
  function search(term) {
    term = term.trim().toLowerCase();
    if (!term) { results.hidden = true; return; }
    var hits = [], seen = {};
    function push(h) { if (!seen[h.href + h.t]) { seen[h.href + h.t] = 1; hits.push(h); } }
    DATA.shelves.forEach(function (s) {
      if ((s.id + ' ' + s.title + ' ' + s.line).toLowerCase().indexOf(term) > -1) push({ href: secHash(s), n: s.id, t: s.title, kind: 'Section' });
      groupsOf(s).forEach(function (g) {
        if ((g.title + ' ' + g.line).toLowerCase().indexOf(term) > -1) push({ href: secHash(s, g.n), n: 'Ch ' + g.n, t: g.title, kind: s.title });
      });
      (s.aliases || []).forEach(function (a) {
        if (a.name.toLowerCase().indexOf(term) > -1) { var e = entryById(a.id); if (e) push({ href: hashOf(e.id), n: num(e), t: e.title, kind: a.name }); }
      });
    });
    DATA.entries.forEach(function (e) {
      var s = secById(e.shelf) || {};
      var hay = [e.id, e.title, e.what, e.gives, s.title, (groupById(s, e.group) || {}).title, (e.keywords || []).join(' '), (e.source || {}).name].join(' ').toLowerCase();
      if (hay.indexOf(term) > -1) push({ href: hashOf(e.id), n: num(e), t: e.title, kind: s.title || '' });
    });
    cursor = hits.length ? 0 : -1;
    results.innerHTML = hits.length
      ? hits.slice(0, 18).map(function (h, k) {
          return '<a href="' + h.href + '"' + (k === 0 ? ' class="on"' : '') + '><span class="num">' + esc(h.n) + '</span><span>' + esc(h.t) + '</span><span class="kind">' + esc(h.kind) + '</span></a>';
        }).join('')
      : '<p>Nothing matches this search.</p>';
    results.hidden = false;
  }
  q.addEventListener('input', function () { search(q.value); });
  q.addEventListener('focus', function () { if (q.value.trim()) search(q.value); });
  q.addEventListener('keydown', function (e) {
    var links = results.querySelectorAll('a');
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!links.length) return;
      e.preventDefault();
      cursor = (cursor + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
      Array.prototype.forEach.call(links, function (l, k) { l.classList.toggle('on', k === cursor); });
    } else if (e.key === 'Enter') {
      if (links[cursor]) { location.hash = links[cursor].getAttribute('href'); clearSearch(); }
    } else if (e.key === 'Escape') clearSearch();
  });
  results.addEventListener('click', function (e) { if (e.target.closest('a')) clearSearch(); });
  function clearSearch() { results.hidden = true; q.value = ''; q.blur(); }
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.search')) results.hidden = true;
    if (!panel.hidden && !e.target.closest('#sticky')) closePanel();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) closePanel();
    if (e.key === '/' && document.activeElement !== q && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); q.focus(); }
  });


  /* ---------- share: every page, its real address (SEO pages) ---------- */
  var SHARE_ICO = {
    x: '<path d="M4 4l16 16M20 4L4 20" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
    in: '<rect x="3" y="9" width="4" height="12" fill="currentColor"/><circle cx="5" cy="5" r="2.2" fill="currentColor"/><path d="M10 9h4v2c1-1.6 2.4-2.3 4.2-2.3 2.6 0 3.8 1.7 3.8 4.8V21h-4v-6.6c0-1.6-.6-2.4-1.9-2.4-1.4 0-2.1 1-2.1 2.6V21h-4z" fill="currentColor"/>',
    fb: '<path d="M14 21v-8h3l.5-3.5H14V7.4c0-1 .3-1.7 1.8-1.7H18V2.6C17.6 2.5 16.5 2.4 15.2 2.4 12.5 2.4 10.6 4 10.6 7v2.5H7.6V13h3v8z" fill="currentColor"/>',
    wa: '<path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 8.5c.3-.6.7-.6 1-.6l.6 1.5-.6.9c.5 1 1.3 1.8 2.3 2.3l.9-.6 1.5.6c0 .3 0 .7-.6 1-.7.4-1.7.3-3-.5a8 8 0 0 1-2.6-2.6c-.8-1.3-.9-2.3-.5-3z" fill="currentColor"/>',
    em: '<rect x="3" y="5" width="18" height="14" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 6l9 7 9-7" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    ln: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
  };
  function shareIco(k) { return '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' + SHARE_ICO[k] + '</svg>'; }
  function addShare() {
    var old = document.getElementById('shareBar'); if (old) old.remove();
    var h = curHash();
    var path = (DATA.urls || {})[h];
    if (path == null) return;
    var url = 'https://iraxlab.com' + path, t = document.title, u = encodeURIComponent(url), tt = encodeURIComponent(t);
    var links = [
      ['x', 'X', 'https://twitter.com/intent/tweet?url=' + u + '&text=' + tt],
      ['in', 'LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url=' + u],
      ['fb', 'Facebook', 'https://www.facebook.com/sharer/sharer.php?u=' + u],
      ['wa', 'WhatsApp', 'https://wa.me/?text=' + encodeURIComponent(t + ' ' + url)],
      ['em', 'Email', 'mailto:?subject=' + tt + '&body=' + u]];
    var box = document.createElement('section');
    box.id = 'shareBar'; box.className = 'share wrap'; box.setAttribute('aria-label', 'Share this page');
    box.innerHTML = '<span class="share-k">Share this page</span><div class="share-row">' +
      links.map(function (l) { return '<a class="share-b" href="' + l[2] + '" target="_blank" rel="noopener" aria-label="Share on ' + l[1] + '">' + shareIco(l[0]) + '<span>' + l[1] + '</span></a>'; }).join('') +
      '<button class="share-b" type="button" id="shareCopy" aria-label="Copy link for Instagram, TikTok or YouTube">' + shareIco('ln') + '<span>Copy link</span></button></div>' +
      '<p class="share-note">For Instagram, TikTok and YouTube, copy the link and paste it into your bio, story or description.</p>';
    view.appendChild(box);
    document.getElementById('shareCopy').addEventListener('click', function () {
      var b = this, done = function () { b.querySelector('span').textContent = 'Link copied'; setTimeout(function () { b.querySelector('span').textContent = 'Copy link'; }, 2000); };
      if (navigator.share && /Mobi|Android|iPhone/i.test(navigator.userAgent)) { navigator.share({ title: t, url: url }).catch(function () {}); return; }
      try { navigator.clipboard.writeText(url).then(done, function () { prompt('Copy this link', url); }); } catch (err) { prompt('Copy this link', url); }
    });
  }
  /* ---------- router ---------- */
  var HOME = { lab: 1, sections: 1, method: 1 };
  var PAGES = { about: aboutPage, founder: founderPage, offer: offerPage, contact: contactPage };
  function route() {
    if (window.IRAXFX) IRAXFX.stop();
    setAcc(null);
    var h = curHash();
    panel.hidden = true;
    var m, s;
    markSite(h);
    document.getElementById('giveFoot').hidden = (!h || h === 'top' || !!HOME[h]);
    if (!h || h === 'top') { home(); toTop(); }
    else if (PAGES[h]) { toTop(); PAGES[h](); }
    else if (h === 'support') {
      if (!view.innerHTML) home();
      setTimeout(function () { scrollToEl(document.getElementById('giveFoot'), false); }, 0);
    }
    else if (HOME[h]) {
      if (!document.getElementById('lab')) home();
      setTimeout(function () { scrollToEl(document.getElementById(h), false); }, 0);
    }
    else if ((m = h.match(/^(\d\d)-(\d+)$/))) { toTop(); entryPage(m[1] + '.' + m[2]); }
    else if ((s = secBySlug(h))) { toTop(); sectionPage(s, ''); }
    else if ((m = h.match(/^(.+)-(\d+|az|sources|terms|[a-z]+)$/)) && (s = secBySlug(m[1]))) { toTop(); sectionPage(s, m[2]); }
    else missing();
    markTop(currentSec(), false);
    addShare();
  }
  window.addEventListener('hashchange', route);

  fetch('data/entries.json', { cache: 'no-cache' })
    .then(function (r) { return r.json(); })
    .then(function (d) { DATA = d; buildTopNav(); route(); })
    .catch(function () { missing(); });
})();
