/* IRA X LAB · moving section heroes · one canvas, brand colours only */
(function () {
  'use strict';
  var C = { bronze: '#AA976C', plat: '#C0C0C0', blue: '#AABEC9', sil: '#D1DCE3', stel: '#89929A', white: '#FFFFFF', black: '#000000' };
  function rgba(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  var T = {};

  /* 01 Mind · a living network: nodes drift, links glow, signals travel */
  T['01'] = function (w, h) {
    var N = Math.round(Math.min(130, w * h / 6000)), nodes = [], pulses = [];
    for (var i = 0; i < N; i++) nodes.push({ x: rnd(0, w), y: rnd(0, h), vx: rnd(-.15, .15), vy: rnd(-.15, .15) });
    return function (x, t) {
      x.fillStyle = C.black; x.fillRect(0, 0, w, h);
      var R = 150;
      nodes.forEach(function (a) { a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > w) a.vx *= -1; if (a.y < 0 || a.y > h) a.vy *= -1; });
      for (var i = 0; i < N; i++) for (var j = i + 1; j < N; j++) {
        var a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < R) {
          x.strokeStyle = rgba(C.plat, (1 - d / R) * .35); x.lineWidth = 1;
          x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke();
          if (Math.random() < .0009) pulses.push({ a: a, b: b, p: 0 });
        }
      }
      nodes.forEach(function (a) { x.fillStyle = rgba(C.plat, .8); x.beginPath(); x.arc(a.x, a.y, 1.8, 0, 7); x.fill(); });
      pulses = pulses.filter(function (q) {
        q.p += .02; if (q.p > 1) return false;
        var px = q.a.x + (q.b.x - q.a.x) * q.p, py = q.a.y + (q.b.y - q.a.y) * q.p;
        x.fillStyle = C.bronze; x.shadowColor = C.bronze; x.shadowBlur = 12;
        x.beginPath(); x.arc(px, py, 3, 0, 7); x.fill(); x.shadowBlur = 0; return true;
      });
    };
  };

  /* 02 Plasticity · new branches keep growing, linking and slowly fading */
  T['02'] = function (w, h) {
    var tips = [];
    function seed() { tips.push({ x: rnd(w * .35, w * .95), y: rnd(h * .1, h * .9), a: rnd(0, 6.28), life: rnd(260, 420), gen: 0 }); }
    for (var i = 0; i < 10; i++) seed();
    var frameN = 0;
    return function (x) {
      if (++frameN % 3 === 0) { x.fillStyle = 'rgba(0,0,0,.035)'; x.fillRect(0, 0, w, h); }
      var next = [];
      for (var s = 0; s < 2; s++) {
        next = [];
        tips.forEach(function (p) {
          var nx = p.x + Math.cos(p.a) * 1.6, ny = p.y + Math.sin(p.a) * 1.6;
          x.strokeStyle = p.gen === 0 ? rgba(C.bronze, .95) : rgba(C.plat, .75 - p.gen * .1); x.lineWidth = Math.max(.7, 2.4 - p.gen * .45);
          x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(nx, ny); x.stroke();
          p.x = nx; p.y = ny; p.a += rnd(-.1, .1); p.life--;
          if (p.life > 0 && nx > -10 && nx < w + 10 && ny > -10 && ny < h + 10) {
            next.push(p);
            if (Math.random() < .018 && p.gen < 4) next.push({ x: p.x, y: p.y, a: p.a + rnd(-1, 1), life: p.life * .6, gen: p.gen + 1 });
          } else {
            x.fillStyle = C.bronze; x.shadowColor = C.bronze; x.shadowBlur = 10;
            x.beginPath(); x.arc(p.x, p.y, 2.6, 0, 7); x.fill(); x.shadowBlur = 0;
          }
        });
        tips = next.slice(0, 90);
      }
      while (tips.length < 8) seed();
    };
  };

  /* 03 Consciousness · falling 0 and 1 */
  T['03'] = function (w, h) {
    var fs = 16, cols = Math.ceil(w / fs), drops = [];
    for (var i = 0; i < cols; i++) drops.push(rnd(-h / fs, 0));
    return function (x) {
      x.fillStyle = 'rgba(0,0,0,.09)'; x.fillRect(0, 0, w, h);
      x.font = '600 ' + fs + 'px "Titillium Web", monospace';
      for (var i = 0; i < cols; i++) {
        var y = drops[i] * fs, ch = Math.random() < .5 ? '0' : '1';
        x.fillStyle = Math.random() < .06 ? C.white : (i % 7 === 0 ? C.bronze : rgba(C.plat, .75));
        x.fillText(ch, i * fs, y);
        drops[i] += .42;
        if (y > h && Math.random() > .975) drops[i] = rnd(-8, 0);
      }
    };
  };

  /* 04 Focus · scattered points gather into one bright centre, then release */
  T['04'] = function (w, h) {
    var cx = w < 700 ? w * .5 : w * .72, cy = w < 700 ? h * .3 : h * .5, P = [];
    for (var i = 0; i < 220; i++) P.push({ a: rnd(0, 6.28), r: rnd(40, Math.max(w, h) * .6), s: rnd(.4, 1) });
    return function (x, t) {
      x.fillStyle = C.black; x.fillRect(0, 0, w, h);
      var k = (Math.sin(t / 2600) + 1) / 2; // 0 = wide, 1 = focused
      for (var r = 1; r <= 4; r++) {
        x.strokeStyle = rgba(C.plat, .08 + .06 * r * k); x.lineWidth = 1;
        x.beginPath(); x.arc(cx, cy, r * 46 * (1.6 - k), 0, 7); x.stroke();
      }
      P.forEach(function (p) {
        var rr = p.r * (1 - .92 * k * p.s), px = cx + Math.cos(p.a + t / 9000) * rr, py = cy + Math.sin(p.a + t / 9000) * rr * .8;
        x.fillStyle = rgba(C.plat, .35 + .5 * k); x.fillRect(px, py, 2, 2);
      });
      x.fillStyle = C.bronze; x.shadowColor = C.bronze; x.shadowBlur = 30 * k;
      x.beginPath(); x.arc(cx, cy, 4 + 6 * k, 0, 7); x.fill(); x.shadowBlur = 0;
    };
  };

  /* 05 Breath · slow inhale and exhale, rings ripple out (5.5 breaths a minute) */
  T['05'] = function (w, h) {
    var cx = w < 700 ? w * .5 : w * .72, cy = w < 700 ? h * .3 : h * .5, rings = [], last = 0;
    return function (x, t) {
      x.fillStyle = C.black; x.fillRect(0, 0, w, h);
      var cyc = 10900, ph = (t % cyc) / cyc, b = (1 - Math.cos(ph * 6.283)) / 2; // 0..1..0
      if (t - last > cyc / 2) { rings.push({ r: 40 + 80 * b, a: .5 }); last = t; }
      rings = rings.filter(function (q) {
        q.r += .55; q.a -= .0022;
        x.strokeStyle = rgba(C.blue, Math.max(q.a, 0)); x.lineWidth = 1.5;
        x.beginPath(); x.arc(cx, cy, q.r, 0, 7); x.stroke(); return q.a > 0;
      });
      var R = 70 + 120 * b, g = x.createRadialGradient(cx, cy, 0, cx, cy, R);
      g.addColorStop(0, rgba(C.sil, .55)); g.addColorStop(.7, rgba(C.blue, .25)); g.addColorStop(1, rgba(C.blue, 0));
      x.fillStyle = g; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.fill();
      x.strokeStyle = rgba(C.white, .7); x.lineWidth = 1.5; x.beginPath(); x.arc(cx, cy, R * .62, 0, 7); x.stroke();
      x.font = '700 12px Inter, sans-serif'; x.textAlign = 'center';
      x.fillStyle = rgba(C.bronze, .9); x.fillText(ph < .5 ? 'IN' : 'OUT', cx, cy + 4); x.textAlign = 'left';
    };
  };

  /* 06 NLP · words of the method drift and link into sentences */
  T['06'] = function (w, h) {
    var WORDS = ['RAPPORT', 'ANCHOR', 'REFRAME', 'STATE', 'FRAME', 'MAP', 'TERRITORY', 'OUTCOME', 'PACE', 'LEAD', 'SUBMODALITY', 'META MODEL', 'MILTON MODEL', 'SWISH', 'TIMELINE', 'VALUES', 'BELIEF', 'CHUNK', 'MIRROR', 'CALIBRATE', 'STRATEGY', 'VAKOG', 'PERCEPTION', 'LANGUAGE'];
    var small = w < 700, top = small ? h * .4 : h - 10, left = small ? 0 : w * .15;
    var W = (small ? WORDS.slice(0, 12) : WORDS).map(function (s, i) { return { s: s, x: rnd(small ? 10 : w * .25, w - 60), y: rnd(20, top), vx: rnd(-.25, .25), vy: rnd(-.12, .12), b: i % 5 === 0, sz: small ? rnd(10, 13) : rnd(11, 18) }; });
    return function (x) {
      x.fillStyle = C.black; x.fillRect(0, 0, w, h);
      for (var i = 0; i < W.length; i++) for (var j = i + 1; j < W.length; j++) {
        var a = W[i], c = W[j], d = Math.hypot(a.x - c.x, a.y - c.y);
        if (d < 170) { x.strokeStyle = rgba(C.plat, (1 - d / 170) * .28); x.lineWidth = 1; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(c.x, c.y); x.stroke(); }
      }
      W.forEach(function (o) {
        o.x += o.vx; o.y += o.vy;
        if (o.x < left || o.x > w - 60) o.vx *= -1; if (o.y < 20 || o.y > top) o.vy *= -1;
        x.font = '700 ' + o.sz + 'px Inter, sans-serif';
        x.fillStyle = o.b ? C.bronze : rgba(C.plat, .85);
        x.fillText(o.s, o.x, o.y);
        x.fillStyle = o.b ? C.bronze : C.plat; x.fillRect(o.x - 6, o.y - o.sz * .35, 3, 3);
      });
    };
  };

  /* 07 Expanded States · layered sound waves, slowly shifting together */
  T['07'] = function (w, h) {
    return function (x, t) {
      x.fillStyle = C.black; x.fillRect(0, 0, w, h);
      for (var k = 0; k < 7; k++) {
        var f = .006 + k * .0018, amp = h * (.06 + k * .025), ph = t / (1800 + k * 400);
        x.strokeStyle = k === 3 ? C.bronze : rgba(k % 2 ? C.blue : C.plat, .25 + k * .07); x.lineWidth = k === 3 ? 2.2 : 1.2;
        x.beginPath();
        for (var px = 0; px <= w; px += 6) {
          var y = h / 2 + Math.sin(px * f + ph) * amp * Math.sin(t / 5000 + k) + Math.sin(px * f * 2.03 + ph * 1.3) * amp * .3;
          if (px === 0) x.moveTo(px, y); else x.lineTo(px, y);
        }
        x.stroke();
      }
    };
  };

  /* 08 Old Practices · a slowly turning star of two tetrahedra (Merkaba form) */
  T['08'] = function (w, h) {
    var s = Math.min(w, h) * (w < 700 ? .26 : .34), cx = w < 700 ? w * .5 : w * .72, cy = w < 700 ? h * .28 : h * .5;
    var A = [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]], B = A.map(function (p) { return [-p[0], -p[1], -p[2]]; });
    var E = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
    function pr(p, a, b) {
      var x1 = p[0] * Math.cos(a) - p[2] * Math.sin(a), z1 = p[0] * Math.sin(a) + p[2] * Math.cos(a);
      var y1 = p[1] * Math.cos(b) - z1 * Math.sin(b), z2 = p[1] * Math.sin(b) + z1 * Math.cos(b);
      var k = 3 / (4 + z2); return [cx + x1 * s * k * .6, cy + y1 * s * k * .6];
    }
    return function (x, t) {
      x.fillStyle = C.black; x.fillRect(0, 0, w, h);
      var a = t / 4200, b = .45 + Math.sin(t / 9000) * .2;
      x.strokeStyle = rgba(C.plat, .12); x.beginPath(); x.arc(cx, cy, s * .95, 0, 7); x.stroke();
      [[A, C.bronze, a], [B, C.plat, -a]].forEach(function (g) {
        var P = g[0].map(function (p) { return pr(p, g[2], b); });
        x.strokeStyle = g[1]; x.lineWidth = 1.6;
        E.forEach(function (e) { x.beginPath(); x.moveTo(P[e[0]][0], P[e[0]][1]); x.lineTo(P[e[1]][0], P[e[1]][1]); x.stroke(); });
        P.forEach(function (p) { x.fillStyle = g[1]; x.beginPath(); x.arc(p[0], p[1], 2.5, 0, 7); x.fill(); });
      });
    };
  };

  /* 09 Emotions · a heartbeat line that quickens and settles */
  T['09'] = function (w, h) {
    var Y = new Array(Math.ceil(w)).fill(h / 2), cur = 0;
    function beatY(ph) {
      var y = 0;
      if (ph > .30 && ph < .36) y = -Math.sin((ph - .30) / .06 * Math.PI) * .06;
      else if (ph >= .40 && ph < .43) y = -(ph - .40) / .03 * .38;
      else if (ph >= .43 && ph < .47) y = -.38 + (ph - .43) / .04 * .52;
      else if (ph >= .47 && ph < .50) y = .14 - (ph - .47) / .03 * .14;
      else if (ph > .60 && ph < .72) y = -Math.sin((ph - .60) / .12 * Math.PI) * .09;
      return h / 2 + y * h;
    }
    var acc = 0;
    return function (x, t) {
      var period = 1000 + Math.sin(t / 6000) * 380; // heart rate rises and falls
      for (var k = 0; k < 4; k++) { cur = (cur + 1) % Y.length; acc += 1; Y[cur] = beatY(((t + k * 4) % period) / period); }
      x.fillStyle = C.black; x.fillRect(0, 0, w, h);
      x.strokeStyle = rgba(C.plat, .08); x.lineWidth = 1;
      for (var gy = 0; gy < h; gy += 36) { x.beginPath(); x.moveTo(0, gy); x.lineTo(w, gy); x.stroke(); }
      x.lineWidth = 2.2; x.shadowColor = C.bronze; x.shadowBlur = 10;
      for (var i = 1; i < Y.length; i++) {
        if (i === cur + 1 || i - 1 === cur) continue;
        var age = (cur - i + Y.length) % Y.length, a = Math.max(0, 1 - age / Y.length);
        x.strokeStyle = rgba(C.bronze, a);
        x.beginPath(); x.moveTo(i - 1, Y[i - 1]); x.lineTo(i, Y[i]); x.stroke();
      }
      x.shadowBlur = 0;
      x.fillStyle = C.white; x.beginPath(); x.arc(cur, Y[cur], 3.5, 0, 7); x.fill();
    };
  };

  /* 10 Sleep · a night sky with slow delta waves */
  T['10'] = function (w, h) {
    var S = []; for (var i = 0; i < 160; i++) S.push({ x: rnd(0, w), y: rnd(0, h * .7), r: rnd(.4, 1.6), p: rnd(0, 6.28) });
    return function (x, t) {
      x.fillStyle = C.black; x.fillRect(0, 0, w, h);
      S.forEach(function (s) { x.fillStyle = rgba(C.sil, .25 + .55 * (Math.sin(t / 1400 + s.p) + 1) / 2); x.beginPath(); x.arc(s.x, s.y, s.r, 0, 7); x.fill(); });
      var mx = w * .78, my = h * .3, mr = Math.min(w, h) * .11;
      x.fillStyle = C.plat; x.beginPath(); x.arc(mx, my, mr, 0, 7); x.fill();
      x.fillStyle = C.black; x.beginPath(); x.arc(mx + mr * .45, my - mr * .2, mr * .92, 0, 7); x.fill();
      for (var k = 0; k < 3; k++) {
        x.strokeStyle = k === 1 ? rgba(C.bronze, .8) : rgba(C.blue, .35); x.lineWidth = 1.5; x.beginPath();
        for (var px = 0; px <= w; px += 8) { var y = h * (.78 + k * .06) + Math.sin(px * .006 + t / (3200 + k * 900)) * h * .04; if (px === 0) x.moveTo(px, y); else x.lineTo(px, y); }
        x.stroke();
      }
    };
  };

  /* 11 Memory · a wall of small cases; traces light up one after another */
  T['11'] = function (w, h) {
    var cw = 34, ch = 22, g = 8, cols = Math.ceil(w / (cw + g)), rows = Math.ceil(h / (ch + g)), L = {}, path = [], last = 0;
    return function (x, t) {
      x.fillStyle = C.black; x.fillRect(0, 0, w, h);
      if (t - last > 140) {
        last = t;
        if (!path.length || Math.random() < .08) path = [[Math.floor(rnd(cols * .3, cols)), Math.floor(rnd(0, rows))]];
        var p = path[path.length - 1], n = [p[0] + Math.round(rnd(-1, 1)), p[1] + Math.round(rnd(-1, 1))];
        n[0] = Math.max(0, Math.min(cols - 1, n[0])); n[1] = Math.max(0, Math.min(rows - 1, n[1]));
        path.push(n); L[n[0] + ',' + n[1]] = 1;
      }
      for (var c = 0; c < cols; c++) for (var r = 0; r < rows; r++) {
        var k = c + ',' + r, v = L[k] || 0, px = c * (cw + g) + 4, py = r * (ch + g) + 4;
        x.strokeStyle = rgba(C.plat, .18 + v * .6); x.lineWidth = 1; x.strokeRect(px, py, cw, ch);
        if (v > 0) { x.fillStyle = rgba(C.bronze, v * .85); x.fillRect(px + 1, py + 1, cw - 2, ch - 2); L[k] = v - .004; if (L[k] <= 0) delete L[k]; }
        x.fillStyle = rgba(C.plat, .3); x.fillRect(px + cw / 2 - 4, py - 2, 8, 2);
      }
    };
  };

  /* 12 Index · letters A to Z settle into order */
  T['12'] = function (w, h) {
    var AB = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), P = [];
    for (var i = 0; i < 90; i++) P.push({ c: AB[i % 26], x: rnd(w * .2, w), y: rnd(0, h), vy: rnd(.15, .5), sz: rnd(12, 30) });
    return function (x, t) {
      x.fillStyle = C.black; x.fillRect(0, 0, w, h);
      P.forEach(function (p) {
        p.y += p.vy; if (p.y > h + 30) { p.y = -20; p.x = rnd(w * .2, w); }
        x.font = '700 ' + p.sz + 'px Inter, sans-serif';
        x.fillStyle = p.c === 'A' || p.c === 'Z' ? C.bronze : rgba(C.plat, .15 + p.sz / 60);
        x.fillText(p.c, p.x, p.y);
      });
    };
  };

  var running = null;
  function start(canvas, id) {
    stop();
    var make = T[id] || T['01'];
    var dpr = Math.min(window.devicePixelRatio || 1, 2), x = canvas.getContext('2d'), draw = null, w = 0, h = 0;
    function size() {
      var r = canvas.getBoundingClientRect(); w = Math.max(1, r.width); h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      x.fillStyle = C.black; x.fillRect(0, 0, w, h);
      draw = make(w, h);
    }
    size();
    var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var raf = 0, t0 = performance.now(), visible = true;
    function frame(now) {
      if (visible && !document.hidden) draw(x, now - t0);
      raf = requestAnimationFrame(frame);
    }
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }) : null;
    if (io) io.observe(canvas);
    var onR = function () { size(); };
    window.addEventListener('resize', onR);
    if (still) { for (var i = 0; i < 240; i++) draw(x, i * 16); }
    else raf = requestAnimationFrame(frame);
    running = function () { cancelAnimationFrame(raf); if (io) io.disconnect(); window.removeEventListener('resize', onR); };
  }
  function stop() { if (running) { running(); running = null; } }
  window.IRAXFX = { start: start, stop: stop };
})();
