/* =====================================================================
   Interactive Picture-Book Engine (Arabic RTL default + English LTR)
   - Arabic & English character voices (Web Speech API + /api/tts fallback)
   - Word-by-word highlighting while speaking
   - Friendship hearts, badges, multiple endings (saved in localStorage)
   - Play with friends: Take Turns or Everyone Votes (with tie wheel)
   ===================================================================== */
(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  // Face positions on images/characters.jpg (1376 x 768) for round avatars
  const SHEET_W = 1376, FACE_BOX = 175;
  const FACES = { adam: [150, 255], lina: [385, 280], omar: [610, 245], sami: [810, 290], huda: [1013, 220], mom: [1237, 210] };
  const EMOJI = { n: "📖", kids: "🧒", judge: "🏅" };
  const PLAYER_ICONS = ["🐯", "🐼", "🐸", "🦄"];

  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) {} return d; };

  let settings = Object.assign({ lang: "ar", voice: true, music: false, slow: false }, load("afw_settings", {}));
  let found = load("afw_endings", []);
  let state = null;

  // Dynamic getters for active language
  const L = () => settings.lang === "en" ? "en" : "ar";
  const T = () => window.UI_TEXT[L()];
  const S = () => window.STORY_BY_LANG[L()];
  const CAST = () => window.CAST_BY_LANG[L()];
  const BADGES = () => window.BADGES_BY_LANG[L()];
  const TALK = () => window.TALK_BY_LANG[L()];
  const ENDING_TALK = () => window.ENDING_TALK_BY_LANG[L()];
  const ENDINGS = Object.keys(window.STORY_BY_LANG.ar).filter((k) => window.STORY_BY_LANG.ar[k].end);

  // =================================================================== AUDIO
  let AC = null;
  const ac = () => (AC = AC || new (window.AudioContext || window.webkitAudioContext)());
  function tone(freq, start, dur, type = "sine", vol = 0.15) {
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
        const a = ac(), n = a.sampleRate * 0.3, b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0);
        for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
        const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
        f.type = "bandpass"; f.frequency.setValueAtTime(800, a.currentTime); f.frequency.linearRampToValueAtTime(3000, a.currentTime + 0.25);
        g.gain.value = 0.12; s.buffer = b; s.connect(f).connect(g).connect(a.destination); s.start();
      } else if (kind === "pop") { tone(520, 0, 0.12, "sine", 0.2); tone(780, 0.06, 0.15, "sine", 0.18); }
      else if (kind === "heart") { tone(660, 0, 0.2, "triangle", 0.15); tone(990, 0.12, 0.3, "triangle", 0.15); }
      else if (kind === "chime") { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.09, 0.6, "sine", 0.14)); }
      else if (kind === "fanfare") { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.16, i === 3 ? 1.1 : 0.3, "triangle", 0.16)); [262, 330, 392].forEach((f) => tone(f, 0.48, 1.1, "sine", 0.08)); }
      else if (kind === "tick") { tone(1200, 0, 0.05, "square", 0.05); }
    } catch (e) {}
  }

  let musicTimer = null;
  const MELODY = [0, 4, 7, 12, 9, 7, 4, 7, 5, 9, 12, 9, 7, 4, 2, 4, 0, 4, 7, 12, 14, 12, 9, 7, 5, 4, 2, 4, 0, -1, -1, -1];
  function startMusic() {
    stopMusic(); let i = 0;
    musicTimer = setInterval(() => {
      const n = MELODY[i % MELODY.length];
      if (n >= 0) tone(523.25 * Math.pow(2, n / 12), 0, 0.9, "sine", 0.035);
      if (i % 4 === 0) tone(130.8 * Math.pow(2, [0, 5, 7, 0][(i / 4) % 4] / 12), 0, 1.6, "triangle", 0.025);
      i++;
    }, 420);
  }
  function stopMusic() { clearInterval(musicTimer); musicTimer = null; }

  // =================================================================== VOICES (Arabic + English + /api/tts fallback)
  const synth = window.speechSynthesis;
  let VOICES = { ar: {}, en: {} };
  const VOICE_PREFS = {
    ar: {
      narrator: [/Salma.*Natural/i, /Zariyah.*Natural/i, /Laila.*Natural/i, /Sana.*Natural/i, /Fatima.*Natural/i, /Natural/i, /Google.*العربية|Google.*Arabic/i, /Mariam/i, /Laila/i, /Hoda/i, /ar/i],
      boy:      [/Shakir.*Natural/i, /Hamed.*Natural/i, /Taim.*Natural/i, /Hamdan.*Natural/i, /Bassel.*Natural/i, /Maged/i, /Tarik/i, /Naayf/i, /ar/i],
      boy2:     [/Hamed.*Natural/i, /Shakir.*Natural/i, /Hamdan.*Natural/i, /Omar.*Natural/i, /Tarik/i, /Maged/i, /ar/i],
      girl:     [/Sana.*Natural/i, /Amany.*Natural/i, /Fatima.*Natural/i, /Salma.*Natural/i, /Noura.*Natural/i, /Laila/i, /Mariam/i, /ar/i],
      woman:    [/Zariyah.*Natural/i, /Fatima.*Natural/i, /Laila.*Natural/i, /Salma.*Natural/i, /Hoda/i, /Mariam/i, /ar/i],
      woman2:   [/Salma.*Natural/i, /Zariyah.*Natural/i, /Rana.*Natural/i, /Amina.*Natural/i, /Hoda/i, /ar/i],
      man:      [/Hamed.*Natural/i, /Shakir.*Natural/i, /Jamal.*Natural/i, /Maged/i, /Naayf/i, /ar/i]
    },
    en: {
      narrator: [/Jenny.*Natural/i, /Aria.*Natural/i, /Emma.*Natural/i, /Ava.*Natural/i, /Natural/i, /Google US English/i, /Samantha/i, /Zira/i],
      boy:      [/Ana.*Natural/i, /Maisie.*Natural/i, /Google UK English Male/i, /Daniel/i, /David/i, /Zira/i],
      boy2:     [/Guy.*Natural/i, /Ryan.*Natural/i, /Daniel/i, /David/i, /Zira/i],
      girl:     [/Maisie.*Natural/i, /Ana.*Natural/i, /Google UK English Female/i, /Karen/i, /Zira/i],
      woman:    [/Michelle.*Natural/i, /Aria.*Natural/i, /Libby.*Natural/i, /Google UK English Female/i, /Samantha/i, /Zira/i],
      woman2:   [/Aria.*Natural/i, /Emma.*Natural/i, /Sonia.*Natural/i, /Google US English/i, /Victoria/i, /Zira/i],
      man:      [/Guy.*Natural/i, /Christopher.*Natural/i, /Ryan.*Natural/i, /Google UK English Male/i, /David/i, /Mark/i]
    }
  };

  function loadVoices() {
    if (!synth) return;
    const raw = synth.getVoices();
    for (const lang of ["ar", "en"]) {
      const re = lang === "ar" ? /^ar([-_]|$)/i : /^en([-_]|$)/i;
      const all = raw.filter((v) => re.test(v.lang) || (lang === "ar" && /Arabic|العربية/i.test(v.name)));
      VOICES[lang] = { _has: all.length > 0 };
      const used = new Set();
      for (const role of Object.keys(VOICE_PREFS[lang])) {
        let chosen = null;
        for (const p of VOICE_PREFS[lang][role]) {
          const v = all.find((v) => p.test(v.name) && !used.has(v.name));
          if (v) { chosen = v; break; }
        }
        if (!chosen) for (const p of VOICE_PREFS[lang][role]) { const v = all.find((v) => p.test(v.name)); if (v) { chosen = v; break; } }
        chosen = chosen || all[0] || null;
        if (chosen && role !== "narrator" && role !== "woman2") used.add(chosen.name);
        VOICES[lang][role] = chosen;
      }
    }
  }
  if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }

  let speakToken = 0, keepAlive = [], currentAudio = null, wordTimer = null;
  function stopSpeaking() {
    speakToken++;
    clearInterval(wordTimer);
    if (synth) synth.cancel();
    if (currentAudio) { try { currentAudio.pause(); currentAudio.src = ""; } catch (e) {} currentAudio = null; }
  }

  // Fallback cloud TTS via /api/tts (works automatically when hosted on Vercel and browser lacks Arabic TTS, e.g. Chrome on Windows)
  function playCloudTTS(text, lang, rate, onStart, onWord, onEnd, token) {
    const url = `/api/tts?lang=${encodeURIComponent(lang)}&text=${encodeURIComponent(text)}`;
    const audio = new Audio(url);
    currentAudio = audio;
    let done = false;
    const finish = () => { if (done) return; done = true; clearInterval(wordTimer); onEnd(); };
    audio.playbackRate = Math.max(0.7, Math.min(1.3, rate));
    audio.onplay = () => {
      if (token !== speakToken) { audio.pause(); return; }
      onStart && onStart();
      if (onWord) {
        const starts = [];
        let m, re = /\S+/g;
        while ((m = re.exec(text))) starts.push(m.index);
        wordTimer = setInterval(() => {
          if (token !== speakToken || !audio.duration || !starts.length) return;
          const idx = Math.min(starts.length - 1, Math.floor((audio.currentTime / audio.duration) * starts.length));
          onWord(starts[idx]);
        }, 120);
      }
    };
    audio.onended = finish;
    audio.onerror = finish;
    audio.play().catch(finish);
  }

  function speakQueue(items, onDone) {
    stopSpeaking();
    const token = speakToken;
    const lang = L();
    if (!settings.voice) { onDone && onDone(); return; }
    const hasNative = synth && VOICES[lang] && VOICES[lang]._has;
    const canCloud = location.protocol === "http:" || location.protocol === "https:";
    if (!hasNative && !canCloud) { onDone && onDone(); return; }

    let i = 0;
    keepAlive = [];
    const nextItem = () => {
      if (token !== speakToken) return;
      if (i >= items.length) { onDone && onDone(); return; }
      const it = items[i++];
      const c = CAST()[it.who] || CAST().n;
      const rate = (c.rate || 1) * (settings.slow ? 0.82 : 1);

      if (!hasNative && canCloud) {
        playCloudTTS(it.text, lang, rate, it.onStart, it.onWord, () => setTimeout(nextItem, 220), token);
        return;
      }

      const v = VOICES[lang][c.voice] || VOICES[lang].narrator;
      const u = new SpeechSynthesisUtterance(it.text);
      if (v) { u.voice = v; u.lang = v.lang; }
      else u.lang = lang === "ar" ? "ar-EG" : "en-US";
      const natural = v && /Natural|Online/i.test(v.name);
      u.pitch = Math.max(0.1, Math.min(2, natural ? 1 + (c.pitch - 1) * 0.35 : c.pitch));
      u.rate = rate;
      let ended = false;
      const finish = () => { if (ended) return; ended = true; clearTimeout(guard); clearInterval(wordTimer); setTimeout(nextItem, 260); };
      const guard = setTimeout(finish, 3000 + it.text.length * 130 / u.rate);
      let gotBoundary = false;
      u.onstart = () => {
        if (token !== speakToken) return;
        it.onStart && it.onStart();
        // Smooth fallback highlight if browser doesn't fire onboundary for Arabic
        if (it.onWord) {
          const starts = []; let m, re = /\S+/g;
          while ((m = re.exec(it.text))) starts.push(m.index);
          const estMs = Math.max(900, (it.text.length * 72) / u.rate);
          const t0 = Date.now();
          wordTimer = setInterval(() => {
            if (gotBoundary || token !== speakToken || !starts.length) return;
            const p = Math.min(0.99, (Date.now() - t0) / estMs);
            it.onWord(starts[Math.floor(p * starts.length)]);
          }, 140);
        }
      };
      u.onboundary = (e) => {
        if (token === speakToken && e.name !== "sentence" && it.onWord) {
          gotBoundary = true;
          it.onWord(e.charIndex);
        }
      };
      u.onend = finish; u.onerror = finish;
      keepAlive.push(u);
      synth.speak(u);
    };
    setTimeout(nextItem, 320);
  }

  // =================================================================== HELPERS
  function avatar(who) {
    const a = el("div", "avatar");
    if (FACES[who]) {
      const s = 52 / FACE_BOX, [x, y] = FACES[who];
      a.style.backgroundImage = "url(images/characters.jpg)";
      a.style.backgroundSize = `${SHEET_W * s}px auto`;
      a.style.backgroundPosition = `${-(x * s - 23)}px ${-(y * s - 23)}px`;
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
  function preload(id) { if (!id || id[0] === "@" || !S()[id]) return; const i = new Image(); i.src = imgSrc(S()[id].img); }

  // =================================================================== CONFETTI
  const cv = $("#confetti"), cx = cv.getContext("2d");
  let parts = [], confettiRunning = false;
  function confetti(n = 140) {
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

  // =================================================================== LANGUAGE & SETTINGS UI
  function applyLanguage() {
    const t = T();
    document.documentElement.lang = L();
    document.documentElement.dir = t.dir;
    document.title = t.docTitle;
    $("#tH1").innerHTML = t.h1;
    $("#tSub").textContent = t.sub;
    $("#btnSolo").textContent = t.btnSolo;
    $("#btnFriends").textContent = t.btnFriends;
    $("#tHint").textContent = t.hint;
    $("#sTitle").textContent = t.setupTitle;
    $("#sSub").textContent = t.setupSub;
    $("#addPlayer").textContent = t.addPlayer;
    $("#sModeTitle").textContent = t.modeTitle;
    $("#sModeTurnsT").textContent = t.modeTurnsTitle;
    $("#sModeTurnsS").textContent = t.modeTurnsSub;
    $("#sModeVoteT").textContent = t.modeVoteTitle;
    $("#sModeVoteS").textContent = t.modeVoteSub;
    $("#setupBack").textContent = t.back;
    $("#setupGo").textContent = t.startStory;
    $("#nBack").textContent = t.dir === "rtl" ? "▶" : "◀";
    $("#nReplay").textContent = t.replay;
    $("#toastTitle").textContent = t.toastTitle;
    $("#toastOk").textContent = t.toastOk;
    $("#endBanner").textContent = t.theEnd;
    $("#endBadgesLbl").textContent = t.yourBadges;
    $("#endGalleryLbl").textContent = t.foundEndings;
    $("#endHome").textContent = t.home;
    $("#endAgain").textContent = t.again;
    refreshSettingsUI();
    renderEndingsFound();
    if ($("#setup").classList.contains("active")) renderPlayerInputs();
    if ($("#story").classList.contains("active") && state) renderPage();
  }

  function refreshSettingsUI() {
    const t = T();
    $("#tLang").textContent = t.langBtn;
    $("#hLang").textContent = L() === "ar" ? "EN" : "ع";
    $("#tVoice").textContent = settings.voice ? t.voiceOn : t.voiceOff;
    $("#tSpeed").textContent = settings.slow ? t.speedSlow : t.speedNorm;
    $("#tMusic").textContent = settings.music ? t.musicOn : t.musicOff;
    $("#hVoice").textContent = settings.voice ? "🔊" : "🔇";
    $("#hMusic").textContent = "🎵"; $("#hMusic").style.opacity = settings.music ? 1 : 0.4;
    save("afw_settings", settings);
  }
  function toggleLang() { settings.lang = L() === "ar" ? "en" : "ar"; save("afw_settings", settings); applyLanguage(); }
  function toggleVoice() { settings.voice = !settings.voice; if (!settings.voice) { stopSpeaking(); finishReading(); } refreshSettingsUI(); }
  function toggleMusic() { settings.music = !settings.music; settings.music ? startMusic() : stopMusic(); refreshSettingsUI(); }

  function renderEndingsFound() {
    const box = $("#endingsFound"), s = S();
    box.innerHTML = T().endingsFound(found.length, ENDINGS.length);
    ENDINGS.forEach((k) => {
      if (found.includes(k)) {
        const i = el("img", "mini"); i.src = imgSrc(s[k].img); i.title = s[k].end;
        i.onerror = () => {
          const svg = window.renderSceneSVG && window.renderSceneSVG(s[k].img);
          if (svg) { const w = el("span", "mini-svg", svg); w.title = s[k].end; i.replaceWith(w); }
        };
        box.appendChild(i);
      } else box.appendChild(el("span", "lock", "❔"));
    });
  }

  // =================================================================== FRIENDS SETUP
  let playerNames = load("afw_players", ["", ""]);
  function renderPlayerInputs() {
    const box = $("#playerInputs"); box.innerHTML = "";
    playerNames.forEach((name, i) => {
      const row = el("div", "player-input");
      row.appendChild(el("span", "pi", PLAYER_ICONS[i]));
      const inp = el("input"); inp.placeholder = T().friendPh(i + 1); inp.value = name; inp.maxLength = 14;
      inp.oninput = () => (playerNames[i] = inp.value);
      row.appendChild(inp);
      if (playerNames.length > 2) { const rm = el("button", "rm", "✖"); rm.onclick = () => { playerNames.splice(i, 1); renderPlayerInputs(); }; row.appendChild(rm); }
      box.appendChild(row);
    });
    $("#addPlayer").style.display = playerNames.length >= 4 ? "none" : "";
  }

  // =================================================================== GAME
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
      if (old && old !== node) setTimeout(() => old.remove(), 800);
    };
    const img = new Image();
    img.alt = "";
    img.style.setProperty("--kz", (1.08 + Math.random() * 0.08).toFixed(3));
    img.style.setProperty("--kx", ((Math.random() - 0.5) * 4).toFixed(2) + "%");
    img.style.setProperty("--ky", ((Math.random() - 0.5) * 3).toFixed(2) + "%");
    img.onload = () => swapIn(img);
    img.onerror = () => {
      img.remove();
      const svg = window.renderSceneSVG && window.renderSceneSVG(name);
      if (svg) {
        const wrap = el("div", "scene-wrap", svg);
        wrap.style.setProperty("--kz", (1.04 + Math.random() * 0.04).toFixed(3));
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
    const id = state.page, p = S()[id], t = T(), cast = CAST();
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
      const c = cast[who] || cast.n;
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
    $("#nNext").textContent = p.end ? t.seeEnding : t.next;

    const queue = p.say.map(([who, text], i) => ({
      who, text,
      onStart: () => {
        lineEls.forEach((l, j) => { l.row.classList.toggle("on", j === i); if (j < i) l.row.classList.add("done"); });
        lineEls[i].row.scrollIntoView({ block: "nearest", behavior: "smooth" });
      },
      onWord: (ci) => highlightWord(lineEls[i].txt, ci)
    }));

    if (p.choices) {
      nav.classList.add("hidden");
      const talkQ = TALK()[id];
      if (talkQ) $("#talk").innerHTML = `<b>${t.talkLabel}</b> ${escapeHTML(talkQ)}`;
      const turnText = turnBanner();
      buildChoices(p);
      if (talkQ && state.players.length) queue.push({ who: "n", text: t.talkSpeakPrefix + talkQ });
      if (turnText) queue.push({ who: "n", text: turnText.replace(/<[^>]+>/g, "") });
      p.choices.forEach((c, i) => queue.push({ who: "n", text: t.choiceSpeak(t.letters[i], c.t), onStart: () => flashChoice(i) }));
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

  // ---------- choices: solo / turns / vote
  function currentPlayer() { return state.players.length ? state.players[state.turn % state.players.length] : null; }
  function turnBanner() {
    const t = $("#turn"), ui = T();
    if (!state.players.length) return "";
    if (state.mode === "turns") {
      const pl = currentPlayer();
      t.innerHTML = ui.turnSolo(pl.icon, escapeHTML(pl.name));
      highlightPlayer(state.turn % state.players.length);
      return ui.turnSolo("", pl.name);
    }
    state.votes = [];
    t.innerHTML = ui.voteStart(state.players[0].icon, escapeHTML(state.players[0].name));
    highlightPlayer(0);
    return ui.voteStartSpeak(state.players[0].name);
  }
  function highlightPlayer(i) { document.querySelectorAll("#playersBar .pl").forEach((e, j) => e.classList.toggle("now", j === i)); }

  function buildChoices(p) {
    const box = $("#choices"), letters = T().letters;
    p.choices.forEach((c, i) => {
      const b = el("button", `choice c${i % 3}`);
      b.innerHTML = `<span class="cl">${letters[i]}</span><span class="ci">${c.icon || "⭐"}</span><span class="ct">${escapeHTML(c.t)}</span><span class="votes"></span>`;
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
    const ui = T(), n = state.players.length, voter = state.players[state.votes.length];
    state.votes.push(i);
    document.querySelectorAll(".choice")[i].querySelector(".votes").textContent += "✔";
    if (state.votes.length < n) {
      const next = state.players[state.votes.length];
      $("#turn").innerHTML = ui.voteNext(voter.icon, next.icon, escapeHTML(next.name));
      highlightPlayer(state.votes.length);
      speakQueue([{ who: "n", text: ui.voteNextSpeak(next.name) }]);
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
    if (tied.length === 1) return revealWinner(tied[0], btns, ui.voteDone);
    $("#turn").innerHTML = ui.voteTie;
    speakQueue([{ who: "n", text: ui.voteTieSpeak }]);
    let k = 0, steps = 14 + Math.floor(Math.random() * tied.length);
    const spin = () => {
      btns.forEach((b) => b.classList.remove("spin"));
      btns[tied[k % tied.length]].classList.add("spin"); sfx("tick");
      if (--steps > 0) { k++; setTimeout(spin, 90 + (14 - steps) * 12); }
      else revealWinner(tied[k % tied.length], btns, ui.wheelPick);
    };
    setTimeout(spin, 600);
  }
  function revealWinner(w, btns, msg) {
    const ui = T();
    btns.forEach((b, j) => { b.classList.remove("spin"); b.classList.toggle("dim", j !== w); });
    btns[w].classList.add("win");
    $("#turn").innerHTML = ui.wins(msg, ui.letters[w]);
    sfx("chime");
    speakQueue([{ who: "n", text: ui.winsSpeak(msg, ui.letters[w]) }]);
    setTimeout(() => choose(w), 2200);
  }

  function choose(i) {
    const p = S()[state.page], c = p.choices[i], nextId = c.go;
    const snapshot = { page: state.page, hearts: state.hearts, badges: state.badges.slice(), turn: state.turn - (state.players.length && state.mode === "turns" ? 1 : 0) };
    if (c.heart) state.hearts = Math.min(window.MAX_HEARTS, state.hearts + c.heart);
    const newBadge = c.badge && !state.badges.includes(c.badge) ? c.badge : null;
    if (newBadge) state.badges.push(newBadge);
    const proceed = () => { state.history.push(snapshot); state.page = nextId[0] === "@" ? window.ROUTES[nextId](state.hearts) : nextId; renderPage(); };
    if (c.heart) {
      renderHeader(); sfx("heart");
      const hs = document.querySelectorAll("#hearts .h.on"); const last = hs[hs.length - 1]; if (last) last.classList.add("pop");
    }
    if (newBadge) setTimeout(() => showBadge(newBadge, proceed), c.heart ? 500 : 0);
    else setTimeout(proceed, c.heart ? 600 : 150);
  }

  function showBadge(key, then) {
    const b = BADGES()[key], ui = T();
    stopSpeaking();
    $("#toastIcon").textContent = b.icon; $("#toastName").textContent = b.name; $("#toastTip").textContent = b.tip;
    $("#toast").classList.add("active");
    sfx("chime"); confetti(90);
    speakQueue([{ who: "n", text: ui.toastSpeak(b.name, b.tip) }]);
    $("#toastOk").onclick = () => { $("#toast").classList.remove("active"); stopSpeaking(); sfx("pop"); then(); };
  }

  function next() {
    const p = S()[state.page];
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

  // ---------- ending
  function showEnding() {
    const id = state.page, s = S(), p = s[id], ui = T();
    stopSpeaking();
    if (!found.includes(id)) { found.push(id); save("afw_endings", found); }
    $("#endTitle").textContent = `«${p.end}»`;
    $("#endHearts").innerHTML = Array.from({ length: window.MAX_HEARTS }, (_, i) => `<span class="${i < state.hearts ? "" : "off"}">❤️</span>`).join("");
    const eb = $("#endBadges"); eb.innerHTML = "";
    Object.entries(BADGES()).forEach(([k, b]) => eb.appendChild(el("div", "eb" + (state.badges.includes(k) ? "" : " locked"), `<i>${b.icon}</i>${b.name}`)));
    const g = $("#endGallery"); g.innerHTML = "";
    ENDINGS.forEach((k) => {
      const d = el("div", "eg" + (k === id ? " now" : ""));
      if (found.includes(k)) {
        const img = el("img"); img.src = imgSrc(s[k].img); img.alt = "";
        img.onerror = () => {
          const svg = window.renderSceneSVG && window.renderSceneSVG(s[k].img);
          if (svg) img.replaceWith(el("div", "thumb-svg", svg));
        };
        d.appendChild(img);
        d.appendChild(el("div", "", escapeHTML(s[k].end)));
      } else {
        d.innerHTML = `<div class="q">❔</div><div>${escapeHTML(ui.notFound)}</div>`;
      }
      g.appendChild(d);
    });
    const qs = ENDING_TALK().slice().sort(() => Math.random() - 0.5).slice(0, 2);
    $("#endTalk").innerHTML = `<b>${ui.talkTogether}</b>• ${escapeHTML(qs[0])}<br>• ${escapeHTML(qs[1])}`;
    $("#ending").classList.add("active");
    sfx("fanfare"); confetti(200);
    const left = ENDINGS.length - found.length;
    speakQueue([
      { who: "n", text: ui.endSpeak1(p.end, state.hearts, state.badges.length) },
      { who: "n", text: left ? ui.endSpeakMore(left) : ui.endSpeakAll },
      { who: "n", text: ui.talkSpeakPrefix + qs[0] }
    ]);
  }

  // =================================================================== WIRING
  $("#btnSolo").onclick = () => { ac(); sfx("pop"); newGame([], "solo"); };
  $("#btnFriends").onclick = () => { ac(); sfx("pop"); renderPlayerInputs(); showScreen("setup"); };
  $("#addPlayer").onclick = () => { if (playerNames.length < 4) { playerNames.push(""); renderPlayerInputs(); } };
  $("#setupBack").onclick = () => showScreen("title");
  $("#setupGo").onclick = () => {
    const names = playerNames.map((n, i) => n.trim() || T().friendDef(i + 1));
    save("afw_players", playerNames);
    const mode = document.querySelector('input[name="mode"]:checked').value;
    newGame(names.map((name, i) => ({ name, icon: PLAYER_ICONS[i] })), mode);
  };
  $("#tLang").onclick = toggleLang; $("#hLang").onclick = toggleLang;
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
    const isRTL = T().dir === "rtl";
    if ((isRTL && e.key === "ArrowLeft") || (!isRTL && e.key === "ArrowRight") || e.key === " " || e.key === "Enter") { e.preventDefault(); next(); }
    else if ((isRTL && e.key === "ArrowRight") || (!isRTL && e.key === "ArrowLeft")) back();
    else if (/^[1-3]$/.test(e.key) || /^[abc]$/i.test(e.key)) {
      const i = /\d/.test(e.key) ? +e.key - 1 : "abc".indexOf(e.key.toLowerCase());
      const b = document.querySelectorAll(".choice")[i]; if (b && !$("#choices").classList.contains("locked")) b.click();
    }
  });

  applyLanguage();
})();
