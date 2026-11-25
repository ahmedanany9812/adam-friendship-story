/* =====================================================================
   محرّك القصة العربية التفاعلية المصوّرة والمسموعة
   - أصوات عربية طبيعية مسجّلة مسبقاً (Microsoft Neural Arabic MP3)
     لكل شخصية، مع تظليل الكلمات أثناء النطق (تعمل على كل الأجهزة)
   - قلوب الصداقة، الأوسمة، النهايات المتعددة، ووضع اللعب مع الأصدقاء
   ===================================================================== */
(() => {
  "use strict";
  const S = window.STORY, CAST = window.CAST, BADGES = window.BADGES, TALK = window.TALK;
  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const ENDINGS = Object.keys(S).filter((k) => S[k].end);
  const LETTERS = ["أ", "ب", "ج"];

  // مواقع وجوه الشخصيات على ورقة الشخصيات للصور الدائرية
  const SHEET_W = 1376, FACE_BOX = 175;
  const FACES = { adam: [150, 255], lina: [385, 280], omar: [610, 245], sami: [810, 290], huda: [1013, 220], mom: [1237, 210] };
  const EMOJI = { n: "📖", kids: "🧒", judge: "🏅" };
  const PLAYER_ICONS = ["🐯", "🐼", "🐸", "🦄"];

  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };

  let settings = Object.assign({ voice: true, music: false, slow: false }, load("afw_settings_ar", {}));
  let found = load("afw_endings", []);
  let state = null;

  // =================================================================== المؤثرات الصوتية والموسيقى
  let AC = null;
  const ac = () => (AC = AC || new (window.AudioContext || window.webkitAudioContext)());
  function tone(freq, start, dur, type = "sine", vol = 0.14) {
    const a = ac(), o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, a.currentTime + start);
    g.gain.exponentialRampToValueAtTime(vol, a.currentTime + start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + start + dur);
    o.connect(g).connect(a.destination); o.start(a.currentTime + start); o.stop(a.currentTime + start + dur + 0.05);
  }
  function sfx(kind) {
    try {
      if (kind === "page") {
        const a = ac(), n = a.sampleRate * 0.28, b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0);
        for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
        const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
        f.type = "bandpass"; f.frequency.setValueAtTime(800, a.currentTime); f.frequency.linearRampToValueAtTime(2800, a.currentTime + 0.24);
        g.gain.value = 0.1; s.buffer = b; s.connect(f).connect(g).connect(a.destination); s.start();
      } else if (kind === "pop") { tone(520, 0, 0.12, "sine", 0.18); tone(780, 0.06, 0.14, "sine", 0.16); }
      else if (kind === "heart") { tone(660, 0, 0.2, "triangle", 0.14); tone(990, 0.12, 0.3, "triangle", 0.14); }
      else if (kind === "chime") { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.09, 0.6, "sine", 0.13)); }
      else if (kind === "fanfare") { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.16, i === 3 ? 1.1 : 0.3, "triangle", 0.15)); [262, 330, 392].forEach((f) => tone(f, 0.48, 1.1, "sine", 0.07)); }
      else if (kind === "tick") { tone(1200, 0, 0.05, "square", 0.05); }
    } catch (e) {}
  }

  let musicTimer = null;
  const MELODY = [0, 4, 7, 12, 9, 7, 4, 7, 5, 9, 12, 9, 7, 4, 2, 4, 0, 4, 7, 12, 14, 12, 9, 7, 5, 4, 2, 4, 0, -1, -1, -1];
  function startMusic() {
    stopMusic(); let i = 0;
    musicTimer = setInterval(() => {
      const n = MELODY[i % MELODY.length];
      if (n >= 0) tone(523.25 * Math.pow(2, n / 12), 0, 0.9, "sine", 0.025);
      if (i % 4 === 0) tone(130.8 * Math.pow(2, [0, 5, 7, 0][(i / 4) % 4] / 12), 0, 1.6, "triangle", 0.02);
      i++;
    }, 420);
  }
  function stopMusic() { clearInterval(musicTimer); musicTimer = null; }

  // =================================================================== مشغّل الصوت العربي الطبيعي (MP3)
  let speakToken = 0, currentAudio = null, wordTimer = null;
  const audioCache = new Map();

  function stopSpeaking() {
    speakToken++;
    clearInterval(wordTimer);
    if (currentAudio) {
      try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (e) {}
      currentAudio = null;
    }
  }

  const AUDIO_VER = "v2";
  function audioUrl(key) { return `audio/${key}.mp3?${AUDIO_VER}`; }

  function preloadAudio(key) {
    if (!key || audioCache.has(key)) return;
    const a = new Audio(audioUrl(key));
    a.preload = "auto";
    audioCache.set(key, a);
  }

  // تشغيل قائمة مقاطع صوتية مع تظليل دقيق للكلمات حسب طول كل كلمة
  function speakQueue(items, onDone) {
    stopSpeaking();
    const token = speakToken;
    if (!settings.voice || !items.length) { onDone && onDone(); return; }

    let i = 0;
    const nextItem = () => {
      if (token !== speakToken) return;
      if (i >= items.length) { onDone && onDone(); return; }
      const it = items[i++];
      if (i < items.length) preloadAudio(items[i].key);

      const src = audioUrl(it.key);
      const audio = audioCache.get(it.key) || new Audio(src);
      audio.currentTime = 0;
      audio.playbackRate = settings.slow ? 0.84 : 1.0;
      currentAudio = audio;

      let ended = false;
      const finish = () => {
        if (ended) return;
        ended = true;
        clearInterval(wordTimer);
        if (token === speakToken) setTimeout(nextItem, 220);
      };

      // حساب أوزان الكلمات لتظليل متزامن مع القراءة العربية
      const words = [];
      let totalWeight = 0;
      if (it.onWord && it.text) {
        let m, re = /\S+/g;
        while ((m = re.exec(it.text))) {
          const w = Math.max(2, m[0].length) + (/[،.؟!:]/.test(m[0]) ? 3 : 0);
          words.push({ idx: m.index, start: totalWeight, end: totalWeight + w });
          totalWeight += w;
        }
      }

      audio.onplay = () => {
        if (token !== speakToken) { audio.pause(); return; }
        it.onStart && it.onStart();
        if (words.length) {
          it.onWord(words[0].idx);
          wordTimer = setInterval(() => {
            if (token !== speakToken || !audio.duration) return;
            const frac = Math.min(0.999, audio.currentTime / Math.max(0.2, audio.duration - 0.12));
            const pos = frac * totalWeight;
            let chosen = words[words.length - 1].idx;
            for (const w of words) { if (pos < w.end) { chosen = w.idx; break; } }
            it.onWord(chosen);
          }, 80);
        }
      };
      audio.onended = finish;
      audio.onerror = finish;
      audio.play().catch(finish);
    };
    setTimeout(nextItem, 260);
  }

  // =================================================================== أدوات مساعدة
  function avatar(who) {
    const a = el("div", "avatar");
    if (FACES[who]) {
      const s = 46 / FACE_BOX, [x, y] = FACES[who];
      a.style.backgroundImage = "url(images/characters.jpg)";
      a.style.backgroundSize = `${SHEET_W * s}px auto`;
      a.style.backgroundPosition = `${-(x * s - 20)}px ${-(y * s - 20)}px`;
    } else a.textContent = EMOJI[who] || "💬";
    return a;
  }
  const escapeHTML = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function wordsHTML(text) {
    let html = "", re = /\S+/g, m, last = 0;
    while ((m = re.exec(text))) {
      html += escapeHTML(text.slice(last, m.index)) + `<span class="w" data-i="${m.index}">${escapeHTML(m[0])}</span>`;
      last = m.index + m[0].length;
    }
    return html + escapeHTML(text.slice(last));
  }
  function highlightWord(container, charIndex) {
    let best = null;
    container.querySelectorAll(".w").forEach((w) => { if (+w.dataset.i <= charIndex) best = w; });
    container.querySelectorAll(".w.hl").forEach((w) => w.classList.remove("hl"));
    if (best) best.classList.add("hl");
  }
  function showScreen(id) { document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id)); }
  function imgSrc(name) { return `images/${name}.jpg`; }
  function preload(id) {
    if (!id || id[0] === "@" || !S[id]) return;
    const i = new Image(); i.src = imgSrc(S[id].img);
    preloadAudio(`${id}_0`);
  }

  // =================================================================== القصاصات الملوّنة
  const cv = $("#confetti"), cx = cv.getContext("2d");
  let parts = [], confettiRunning = false;
  function confetti(n = 130) {
    cv.width = innerWidth; cv.height = innerHeight;
    const colors = ["#ff8a3d", "#4f8ff0", "#45b86a", "#ef5d8f", "#ffd66b", "#a66be0"];
    for (let i = 0; i < n; i++) parts.push({ x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * 0.5, vx: (Math.random() - 0.5) * 4, vy: 2 + Math.random() * 4, r: 5 + Math.random() * 7, c: colors[i % colors.length], a: Math.random() * 6, va: (Math.random() - 0.5) * 0.3, heart: Math.random() < 0.2 });
    if (!confettiRunning) { confettiRunning = true; requestAnimationFrame(drawConfetti); }
  }
  function drawConfetti() {
    cx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter((p) => p.y < cv.height + 30);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.a += p.va; p.vy += 0.03;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = p.c;
      if (p.heart) { cx.font = `${p.r * 3}px sans-serif`; cx.fillText("❤", 0, 0); } else cx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
      cx.restore();
    }
    if (parts.length) requestAnimationFrame(drawConfetti); else { confettiRunning = false; cx.clearRect(0, 0, cv.width, cv.height); }
  }

  // =================================================================== الإعدادات والشاشة الرئيسية
  function refreshSettingsUI() {
    $("#tVoice").textContent = settings.voice ? "🔊 الصوت: يعمل" : "🔇 الصوت: صامت";
    $("#tSpeed").textContent = settings.slow ? "🐢 السرعة: بطيئة" : "🐇 السرعة: عادية";
    $("#tMusic").textContent = settings.music ? "🎵 الموسيقى: تعمل" : "🎵 الموسيقى: متوقفة";
    $("#hVoice").textContent = settings.voice ? "🔊" : "🔇";
    $("#hMusic").textContent = "🎵"; $("#hMusic").style.opacity = settings.music ? 1 : 0.4;
    save("afw_settings_ar", settings);
  }
  function toggleVoice() { settings.voice = !settings.voice; if (!settings.voice) { stopSpeaking(); finishReading(); } refreshSettingsUI(); }
  function toggleMusic() { settings.music = !settings.music; settings.music ? startMusic() : stopMusic(); refreshSettingsUI(); }

  function renderEndingsFound() {
    const box = $("#endingsFound");
    box.innerHTML = `⭐ النهايات المكتشفة: <b>${found.length} / ${ENDINGS.length}</b>`;
    ENDINGS.forEach((k) => {
      if (found.includes(k)) {
        const i = el("img", "mini"); i.src = imgSrc(S[k].img); i.title = S[k].end;
        i.onerror = () => {
          const svg = window.renderSceneSVG && window.renderSceneSVG(S[k].img);
          if (svg) { const w = el("span", "mini-svg", svg); w.title = S[k].end; i.replaceWith(w); }
        };
        box.appendChild(i);
      } else box.appendChild(el("span", "lock", "❔"));
    });
  }

  // =================================================================== إعداد الأصدقاء
  let playerNames = load("afw_players", ["", ""]);
  function renderPlayerInputs() {
    const box = $("#playerInputs"); box.innerHTML = "";
    playerNames.forEach((name, i) => {
      const row = el("div", "player-input");
      row.appendChild(el("span", "pi", PLAYER_ICONS[i]));
      const inp = el("input"); inp.placeholder = `اسم الصديق ${i + 1}`; inp.value = name; inp.maxLength = 14;
      inp.oninput = () => (playerNames[i] = inp.value);
      row.appendChild(inp);
      if (playerNames.length > 2) { const rm = el("button", "rm", "✖"); rm.onclick = () => { playerNames.splice(i, 1); renderPlayerInputs(); }; row.appendChild(rm); }
      box.appendChild(row);
    });
    $("#addPlayer").style.display = playerNames.length >= 4 ? "none" : "";
  }

  // =================================================================== اللعبة
  function newGame(players, mode) {
    state = { page: null, hearts: 0, badges: [], history: [], players, mode, turn: 0, reading: false };
    showScreen("story");
    if (settings.music) startMusic();
    go(window.START, false);
  }

  function go(id, push = true) {
    if (id[0] === "@") id = window.ROUTES[id](state.hearts);
    if (push && state.page) state.history.push({ page: state.page, hearts: state.hearts, badges: state.badges.slice(), turn: state.turn });
    state.page = id;
    renderPage();
  }

  function renderHeader() {
    const h = $("#hearts"); h.innerHTML = "";
    for (let i = 0; i < window.MAX_HEARTS; i++) h.appendChild(el("span", "h" + (i < state.hearts ? " on" : ""), "❤️"));
    $("#badgeCount").textContent = `🏅 ${state.badges.length}`;
    const pb = $("#playersBar"); pb.innerHTML = "";
    state.players.forEach((p) => pb.appendChild(el("span", "pl", `${p.icon} ${escapeHTML(p.name)}`)));
  }

  let currentPicture = null, picToken = 0;
  function setPicture(name) {
    const pic = $("#pic"), tok = ++picToken;
    const swapIn = (node) => {
      if (tok !== picToken) { node.remove(); return; }
      requestAnimationFrame(() => node.classList.add("show"));
      const old = currentPicture; currentPicture = node;
      if (old && old !== node) setTimeout(() => old.remove(), 750);
    };
    const img = new Image();
    img.alt = "";
    img.style.setProperty("--kz", (1.07 + Math.random() * 0.06).toFixed(3));
    img.style.setProperty("--kx", ((Math.random() - 0.5) * 3.5).toFixed(2) + "%");
    img.style.setProperty("--ky", ((Math.random() - 0.5) * 2.5).toFixed(2) + "%");
    img.onload = () => swapIn(img);
    img.onerror = () => {
      img.remove();
      const svg = window.renderSceneSVG && window.renderSceneSVG(name);
      if (svg) {
        const wrap = el("div", "scene-wrap", svg);
        wrap.style.setProperty("--kz", (1.03 + Math.random() * 0.03).toFixed(3));
        wrap.style.setProperty("--kx", ((Math.random() - 0.5) * 2).toFixed(2) + "%");
        wrap.style.setProperty("--ky", ((Math.random() - 0.5) * 1.5).toFixed(2) + "%");
        pic.appendChild(wrap);
        swapIn(wrap);
      }
    };
    img.src = imgSrc(name);
    pic.appendChild(img);
  }

  function renderPage() {
    const id = state.page, p = S[id];
    stopSpeaking();
    sfx("page");
    renderHeader();
    setPicture(p.img);

    const ch = $("#chapter");
    ch.classList.remove("show");
    if (p.chapter) { ch.textContent = p.chapter; setTimeout(() => ch.classList.add("show"), 200); setTimeout(() => ch.classList.remove("show"), 4200); }

    const linesBox = $("#lines"); linesBox.innerHTML = ""; linesBox.scrollTop = 0;
    document.querySelector(".panel").classList.toggle("quiet", !settings.voice);
    const lineEls = p.say.map(([who, text]) => {
      const c = CAST[who] || CAST.n;
      const row = el("div", "line");
      row.appendChild(avatar(who));
      const say = el("div", "say" + (who !== "n" ? " dialog" : ""));
      if (c.name) say.appendChild(el("span", "who", escapeHTML(c.name))).style.color = c.color;
      const txt = el("span", "txt", wordsHTML(text));
      say.appendChild(txt); row.appendChild(say); linesBox.appendChild(row);
      return { row, txt };
    });

    $("#talk").innerHTML = ""; $("#turn").innerHTML = ""; $("#choices").innerHTML = ""; $("#choices").className = "choices";
    const nav = $("#nav"); nav.classList.remove("hidden");
    $("#nBack").disabled = !state.history.length;
    $("#nNext").classList.remove("ready");
    $("#nNext").textContent = p.end ? "شاهد النهاية ⭐" : "التالي ←";

    const queue = p.say.map(([who, text], i) => ({
      key: `${id}_${i}`, text,
      onStart: () => {
        document.querySelectorAll(".w.hl").forEach((w) => w.classList.remove("hl"));
        lineEls.forEach((l, j) => { l.row.classList.toggle("on", j === i); if (j < i) l.row.classList.add("done"); });
        lineEls[i].row.scrollIntoView({ block: "nearest", behavior: "smooth" });
      },
      onWord: (ci) => highlightWord(lineEls[i].txt, ci)
    }));

    if (p.choices) {
      nav.classList.add("hidden");
      const talkObj = TALK[id];
      if (talkObj) $("#talk").innerHTML = `<b>💬 لنتحدث معاً:</b> ${escapeHTML(talkObj.q)}`;
      const turnKey = turnBanner();
      buildChoices(p);
      if (talkObj && state.players.length) queue.push({ key: `talk_${id}` });
      if (turnKey) queue.push({ key: turnKey });
      p.choices.forEach((c, i) => queue.push({ key: `${id}_c${i}`, onStart: () => flashChoice(i) }));
      p.choices.forEach((c) => preload(c.go));
    } else preload(p.next);

    state.reading = true;
    speakQueue(queue, finishReading);
  }

  function finishReading() {
    if (!state) return;
    state.reading = false;
    document.querySelectorAll(".line").forEach((l) => { l.classList.remove("on"); l.classList.add("done"); });
    document.querySelectorAll(".w.hl").forEach((w) => w.classList.remove("hl"));
    document.querySelectorAll(".choice.spin").forEach((c) => c.classList.remove("spin"));
    $("#nNext").classList.add("ready");
  }

  function flashChoice(i) {
    document.querySelectorAll(".choice").forEach((c, j) => c.classList.toggle("spin", j === i));
  }

  // ---------- الاختيارات: فردي / بالدور / بالتصويت
  function currentPlayer() { return state.players.length ? state.players[state.turn % state.players.length] : null; }
  function turnBanner() {
    const t = $("#turn");
    if (!state.players.length) return "";
    if (state.mode === "turns") {
      const pl = currentPlayer();
      t.innerHTML = `${pl.icon} دورك يا ${escapeHTML(pl.name)} لتختار!`;
      highlightPlayer(state.turn % state.players.length);
      return "ui_turn";
    }
    state.votes = [];
    t.innerHTML = `🗳️ وقت التصويت! يبدأ ${state.players[0].icon} ${escapeHTML(state.players[0].name)}.`;
    highlightPlayer(0);
    return "ui_voteStart";
  }
  function highlightPlayer(i) { document.querySelectorAll("#playersBar .pl").forEach((e, j) => e.classList.toggle("now", j === i)); }

  function buildChoices(p) {
    const box = $("#choices");
    p.choices.forEach((c, i) => {
      const b = el("button", `choice c${i % 3}`);
      b.innerHTML = `<span class="cl">${LETTERS[i]}</span><span class="ci">${c.icon || "⭐"}</span><span class="ct">${escapeHTML(c.t)}</span><span class="votes"></span>`;
      b.onclick = () => onChoice(i);
      box.appendChild(b);
    });
  }

  function onChoice(i) {
    sfx("pop");
    if (state.players.length && state.mode === "vote") return castVote(i);
    if (state.players.length) state.turn++;
    choose(i);
  }

  function castVote(i) {
    const n = state.players.length, voter = state.players[state.votes.length];
    state.votes.push(i);
    document.querySelectorAll(".choice")[i].querySelector(".votes").textContent += "✔";
    if (state.votes.length < n) {
      const nextP = state.players[state.votes.length];
      $("#turn").innerHTML = `${voter.icon} صوّت! والآن دور ${nextP.icon} ${escapeHTML(nextP.name)}!`;
      highlightPlayer(state.votes.length);
      speakQueue([{ key: "ui_voteNext" }]);
      return;
    }
    $("#choices").classList.add("locked");
    stopSpeaking();
    const counts = [0, 0, 0], btns = [...document.querySelectorAll(".choice")];
    btns.forEach((b) => (b.querySelector(".votes").textContent = ""));
    state.votes.forEach((v, k) => { counts[v]++; btns[v].querySelector(".votes").textContent += state.players[k].icon; });
    const max = Math.max(...counts);
    const tied = counts.map((c, k) => (c === max ? k : -1)).filter((k) => k >= 0 && k < btns.length);
    highlightPlayer(-1);
    if (tied.length === 1) return revealWinner(tied[0], btns, "انتهى التصويت!");
    $("#turn").innerHTML = "🎡 تعادل! تدور العجلة للاختيار...";
    speakQueue([{ key: "ui_voteTie" }]);
    let k = 0, steps = 14 + Math.floor(Math.random() * tied.length);
    const spin = () => {
      btns.forEach((b) => b.classList.remove("spin"));
      btns[tied[k % tied.length]].classList.add("spin"); sfx("tick");
      if (--steps > 0) { k++; setTimeout(spin, 90 + (14 - steps) * 12); }
      else revealWinner(tied[k % tied.length], btns, "اختارت العجلة...");
    };
    setTimeout(spin, 600);
  }
  function revealWinner(w, btns, msg) {
    btns.forEach((b, j) => { b.classList.remove("spin"); b.classList.toggle("dim", j !== w); });
    btns[w].classList.add("win");
    $("#turn").innerHTML = `🎉 ${msg} الاختيار (${LETTERS[w]}) يفوز!`;
    sfx("chime");
    speakQueue([{ key: `ui_win${w}` }]);
    setTimeout(() => choose(w), 2100);
  }

  function choose(i) {
    const p = S[state.page], c = p.choices[i], nextId = c.go;
    const snapshot = { page: state.page, hearts: state.hearts, badges: state.badges.slice(), turn: state.turn - (state.players.length && state.mode === "turns" ? 1 : 0) };
    if (c.heart) state.hearts = Math.min(window.MAX_HEARTS, state.hearts + c.heart);
    const newBadge = c.badge && !state.badges.includes(c.badge) ? c.badge : null;
    if (newBadge) state.badges.push(newBadge);
    const proceed = () => { state.history.push(snapshot); state.page = nextId[0] === "@" ? window.ROUTES[nextId](state.hearts) : nextId; renderPage(); };
    if (c.heart) {
      renderHeader(); sfx("heart");
      const hs = document.querySelectorAll("#hearts .h.on"); const last = hs[hs.length - 1]; if (last) last.classList.add("pop");
    }
    if (newBadge) setTimeout(() => showBadge(newBadge, proceed), c.heart ? 450 : 0);
    else setTimeout(proceed, c.heart ? 550 : 150);
  }

  function showBadge(key, then) {
    const b = BADGES[key];
    stopSpeaking();
    $("#toastIcon").textContent = b.icon; $("#toastName").textContent = b.name; $("#toastTip").textContent = b.tip;
    $("#toast").classList.add("active");
    sfx("chime"); confetti(85);
    speakQueue([{ key: `badge_${key}` }]);
    $("#toastOk").onclick = () => { $("#toast").classList.remove("active"); stopSpeaking(); sfx("pop"); then(); };
  }

  function next() {
    const p = S[state.page];
    if (p.choices) return;
    if (p.end) return showEnding();
    go(p.next);
  }
  function back() {
    if (!state.history.length) return;
    const h = state.history.pop();
    Object.assign(state, { page: h.page, hearts: h.hearts, badges: h.badges, turn: h.turn });
    renderPage();
  }

  // ---------- شاشة النهاية
  function showEnding() {
    const id = state.page, p = S[id];
    stopSpeaking();
    if (!found.includes(id)) { found.push(id); save("afw_endings", found); }
    $("#endTitle").textContent = `«${p.end}»`;
    $("#endHearts").innerHTML = Array.from({ length: window.MAX_HEARTS }, (_, i) => `<span class="${i < state.hearts ? "" : "off"}">❤️</span>`).join("");
    const eb = $("#endBadges"); eb.innerHTML = "";
    Object.entries(BADGES).forEach(([k, b]) => eb.appendChild(el("div", "eb" + (state.badges.includes(k) ? "" : " locked"), `<i>${b.icon}</i>${b.name}`)));
    const g = $("#endGallery"); g.innerHTML = "";
    ENDINGS.forEach((k) => {
      const d = el("div", "eg" + (k === id ? " now" : ""));
      if (found.includes(k)) {
        const img = el("img"); img.src = imgSrc(S[k].img); img.alt = "";
        img.onerror = () => {
          const svg = window.renderSceneSVG && window.renderSceneSVG(S[k].img);
          if (svg) img.replaceWith(el("div", "thumb-svg", svg));
        };
        d.appendChild(img);
        d.appendChild(el("div", "", escapeHTML(S[k].end)));
      } else {
        d.innerHTML = `<div class="q">❔</div><div>لم تكتشف بعد</div>`;
      }
      g.appendChild(d);
    });
    const qs = window.ENDING_TALK.slice().sort(() => Math.random() - 0.5).slice(0, 2);
    $("#endTalk").innerHTML = `<b>💬 لنتحدث معاً:</b>• ${escapeHTML(qs[0].q)}<br>• ${escapeHTML(qs[1].q)}`;
    $("#ending").classList.add("active");
    sfx("fanfare"); confetti(180);
    speakQueue([{ key: `ui_end_${id}` }, { key: qs[0].id }]);
  }

  // =================================================================== الأزرار ولوحة المفاتيح
  $("#btnSolo").onclick = () => { ac(); sfx("pop"); newGame([], "solo"); };
  $("#btnFriends").onclick = () => { ac(); sfx("pop"); renderPlayerInputs(); showScreen("setup"); };
  $("#addPlayer").onclick = () => { if (playerNames.length < 4) { playerNames.push(""); renderPlayerInputs(); } };
  $("#setupBack").onclick = () => showScreen("title");
  $("#setupGo").onclick = () => {
    const names = playerNames.map((n, i) => n.trim() || `صديق ${i + 1}`);
    save("afw_players", playerNames);
    const mode = document.querySelector('input[name="mode"]:checked').value;
    newGame(names.map((name, i) => ({ name, icon: PLAYER_ICONS[i] })), mode);
  };
  $("#tVoice").onclick = toggleVoice; $("#hVoice").onclick = toggleVoice;
  $("#tMusic").onclick = () => { ac(); toggleMusic(); }; $("#hMusic").onclick = toggleMusic;
  $("#tSpeed").onclick = () => { settings.slow = !settings.slow; refreshSettingsUI(); };
  $("#hFull").onclick = () => { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}); };
  const goHome = () => { stopSpeaking(); stopMusic(); $("#ending").classList.remove("active"); $("#toast").classList.remove("active"); renderEndingsFound(); showScreen("title"); };
  $("#hHome").onclick = goHome; $("#endHome").onclick = goHome;
  $("#endAgain").onclick = () => { $("#ending").classList.remove("active"); newGame(state.players, state.mode); };
  $("#nNext").onclick = next; $("#nBack").onclick = back;
  $("#nReplay").onclick = () => { if (!settings.voice) toggleVoice(); renderPage(); };

  document.addEventListener("keydown", (e) => {
    if (!$("#story").classList.contains("active") || e.target.tagName === "INPUT") return;
    if ($("#toast").classList.contains("active")) { if (e.key === "Enter" || e.key === " ") $("#toastOk").click(); return; }
    if ($("#ending").classList.contains("active")) return;
    if (e.key === "ArrowLeft" || e.key === " " || e.key === "Enter") { e.preventDefault(); next(); }
    else if (e.key === "ArrowRight") back();
    else if (/^[1-3]$/.test(e.key)) {
      const b = document.querySelectorAll(".choice")[+e.key - 1];
      if (b && !$("#choices").classList.contains("locked")) b.click();
    }
  });

  refreshSettingsUI();
  renderEndingsFound();
})();
