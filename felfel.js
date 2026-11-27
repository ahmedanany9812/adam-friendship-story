/* =====================================================================
   محرّك عالم فلفل وتوتا القصصي التفاعلي
   - خريطة عالم حية تتغير بصرياً حسب قرارات الطفل والنهايات المكتشفة
   - 5 أماكن قابلة للاستكشاف المباشر + مسارات متفرعة + 4 نهايات + نهاية مؤقتة
   - أصوات عربية طبيعية مسجّلة (Neural Arabic MP3) مع تظليل الكلمات
   ===================================================================== */
(() => {
  "use strict";
  const SCENES = window.FELFEL_SCENES;
  const CAST = window.FELFEL_CAST;
  const PLACES = window.FELFEL_PLACES;
  const BADGES = window.FELFEL_BADGES || {};
  const ENDINGS = Object.keys(SCENES).filter((k) => SCENES[k].end);

  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const escapeHTML = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // مواضع الوجوه في images/felfel/characters.jpg (1376x768)
  const SHEET_W = 1376, FACE_BOX = 210;
  const FACES = { felfel: [215, 365], toota: [528, 365], meemo: [845, 355], boody: [1175, 295] };
  const EMOJI = { n: "📖", all: "🎉" };

  const MOOD_LABELS = {
    init:      "☀️ مغامرة جديدة",
    sad:       "😢 الصديق الحزين",
    rainy:     "🌧️ سوء الفهم مستمر",
    talking:   "🗣️ وقت الحوار",
    happy:     "🌸 أصدقاء من جديد",
    celebrate: "🧩 فريق التفاهم!"
  };

  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) {} return d; };

  let settings = Object.assign({ voice: true, music: false, slow: false }, load("felfel_settings", {}));
  let progress = Object.assign({ mood: "init", visited: [], endings: [], badges: [], hearts: 0 }, load("felfel_progress", {}));
  if (!Array.isArray(progress.badges)) progress.badges = [];
  let currentId = null, history = [];

  // =================================================================== المؤثرات والموسيقى
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
      if (kind === "pop") { tone(540, 0, 0.11, "sine", 0.17); tone(810, 0.06, 0.13, "sine", 0.15); }
      else if (kind === "page") { tone(440, 0, 0.09, "triangle", 0.1); tone(660, 0.06, 0.12, "triangle", 0.1); }
      else if (kind === "heart") { tone(660, 0, 0.18, "triangle", 0.14); tone(990, 0.1, 0.28, "triangle", 0.14); }
      else if (kind === "fanfare") { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.15, i === 3 ? 1.0 : 0.28, "triangle", 0.14)); }
    } catch (e) {}
  }

  let musicTimer = null;
  const MELODY = [0, 4, 7, 12, 9, 7, 4, 7, 5, 9, 12, 9, 7, 4, 2, 4];
  function startMusic() {
    stopMusic(); let i = 0;
    musicTimer = setInterval(() => {
      tone(523.25 * Math.pow(2, MELODY[i % MELODY.length] / 12), 0, 0.85, "sine", 0.022);
      i++;
    }, 450);
  }
  function stopMusic() { clearInterval(musicTimer); musicTimer = null; }

  // =================================================================== مشغّل الصوت العربي الطبيعي (MP3)
  let speakToken = 0, currentAudio = null, wordTimer = null;
  const audioCache = new Map();
  const audioUrl = (key) => `audio/felfel/${key}.mp3?v2`;

  function stopSpeaking() {
    speakToken++;
    clearInterval(wordTimer);
    if (currentAudio) { try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (e) {} currentAudio = null; }
  }
  function preloadAudio(key) {
    if (!key || audioCache.has(key)) return;
    const a = new Audio(audioUrl(key)); a.preload = "auto"; audioCache.set(key, a);
  }
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
      const audio = audioCache.get(it.key) || new Audio(audioUrl(it.key));
      audio.currentTime = 0;
      audio.playbackRate = settings.slow ? 0.84 : 1.0;
      currentAudio = audio;
      let ended = false;
      const finish = () => { if (ended) return; ended = true; clearInterval(wordTimer); if (token === speakToken) setTimeout(nextItem, 220); };

      const words = []; let totalW = 0;
      if (it.onWord && it.text) {
        let m, re = /\S+/g;
        while ((m = re.exec(it.text))) {
          const w = Math.max(2, m[0].length) + (/[،.؟!:]/.test(m[0]) ? 3 : 0);
          words.push({ idx: m.index, end: totalW + w });
          totalW += w;
        }
      }
      audio.onplay = () => {
        if (token !== speakToken) { audio.pause(); return; }
        it.onStart && it.onStart();
        if (words.length) {
          it.onWord(words[0].idx);
          wordTimer = setInterval(() => {
            if (token !== speakToken || !audio.duration) return;
            const pos = Math.min(0.999, audio.currentTime / Math.max(0.2, audio.duration - 0.12)) * totalW;
            let chosen = words[words.length - 1].idx;
            for (const w of words) { if (pos < w.end) { chosen = w.idx; break; } }
            it.onWord(chosen);
          }, 80);
        }
      };
      audio.onended = finish; audio.onerror = finish;
      audio.play().catch(finish);
    };
    setTimeout(nextItem, 240);
  }

  // =================================================================== قصاصات احتفالية
  const cv = $("#confetti"), cx = cv.getContext("2d");
  let parts = [], confRunning = false;
  function confetti(n = 120) {
    cv.width = innerWidth; cv.height = innerHeight;
    const cols = ["#ff8a3d", "#4f8ff0", "#45b86a", "#ef5d8f", "#ffd66b", "#9b6be0"];
    for (let i = 0; i < n; i++) parts.push({ x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * 0.4, vx: (Math.random() - 0.5) * 4, vy: 2 + Math.random() * 4, r: 5 + Math.random() * 7, c: cols[i % cols.length], a: Math.random() * 6, va: (Math.random() - 0.5) * 0.3 });
    if (!confRunning) { confRunning = true; requestAnimationFrame(drawConf); }
  }
  function drawConf() {
    cx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter((p) => p.y < cv.height + 30);
    for (const p of parts) { p.x += p.vx; p.y += p.vy; p.a += p.va; p.vy += 0.03; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = p.c; cx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); cx.restore(); }
    if (parts.length) requestAnimationFrame(drawConf); else { confRunning = false; cx.clearRect(0, 0, cv.width, cv.height); }
  }

  // =================================================================== أدوات مساعدة
  function showScreen(id) { document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id)); }
  function avatar(who) {
    const a = el("div", "avatar");
    if (FACES[who]) {
      const s = 46 / FACE_BOX, [x, y] = FACES[who];
      a.style.backgroundImage = "url(images/felfel/characters.jpg)";
      a.style.backgroundSize = `${SHEET_W * s}px auto`;
      a.style.backgroundPosition = `${-(x * s - 20)}px ${-(y * s - 20)}px`;
    } else a.textContent = EMOJI[who] || "💬";
    return a;
  }
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

  function refreshSettings() {
    $("#mVoice").textContent = settings.voice ? "🔊" : "🔇";
    $("#sVoice").textContent = settings.voice ? "🔊" : "🔇";
    $("#mMusic").textContent = "🎵"; $("#mMusic").style.opacity = settings.music ? 1 : 0.4;
    $("#sMusic").textContent = "🎵"; $("#sMusic").style.opacity = settings.music ? 1 : 0.4;
    $("#sSpeed").textContent = settings.slow ? "🐢" : "🐇";
    save("felfel_settings", settings);
  }
  function toggleVoice() { settings.voice = !settings.voice; if (!settings.voice) { stopSpeaking(); finishReading(); } refreshSettings(); }
  function toggleMusic() { settings.music = !settings.music; settings.music ? startMusic() : stopMusic(); refreshSettings(); }

  // =================================================================== شاشة خريطة العالم الحية
  function renderMap(speakMood = false) {
    stopSpeaking();
    $("#endOverlay").classList.remove("active");
    showScreen("mapScreen");
    save("felfel_progress", progress);

    $("#mPlaces").textContent = `🗺️ ${progress.visited.length} / ${PLACES.length}`;
    $("#mBadges").textContent = `🏅 ${progress.badges.length} / ${Object.keys(BADGES).length}`;
    $("#mEndings").textContent = `⭐ ${progress.endings.length} / ${ENDINGS.length}`;
    $("#mMood").textContent = MOOD_LABELS[progress.mood] || MOOD_LABELS.init;

    // رسم الخريطة الحية حسب حالة العالم (mood)
    $("#mapCanvas").innerHTML = window.renderFelfelMapSVG(progress.mood, progress.visited);

    // الأماكن الخمسة القابلة للضغط فوق الخريطة
    const pins = $("#mapPins"); pins.innerHTML = "";
    PLACES.forEach((pl) => {
      const visited = progress.visited.includes(pl.id);
      const b = el("button", "pin" + (visited ? " visited" : ""));
      b.style.left = pl.x + "%";
      b.style.top = pl.y + "%";
      b.innerHTML = `<span class="p-ic">${pl.icon}</span><span>${pl.name}</span>${visited ? `<span class="p-check">✓</span>` : ""}`;
      const desc = pl.desc[progress.mood] || pl.desc.init;
      b.onmouseenter = () => ($("#mapHoverTip").textContent = `${pl.icon} ${pl.name}: ${desc}`);
      b.onclick = () => { ac(); sfx("pop"); history = []; openScene(pl.start, false); };
      pins.appendChild(b);
    });

    // شريط النهايات
    const strip = $("#mapEndingsStrip"); strip.innerHTML = "";
    ENDINGS.forEach((k) => {
      const ok = progress.endings.includes(k);
      strip.appendChild(el("span", "end-chip " + (ok ? "on" : "off"), ok ? SCENES[k].end : "❔ نهاية مخبّأة"));
    });

    if (speakMood) {
      const keyMap = { happy: "ui_map_happy", talking: "ui_map_talking", rainy: "ui_map_rainy", sad: "ui_map_rainy", celebrate: "ui_map_celebrate" };
      speakQueue([{ key: keyMap[progress.mood] || "ui_map_welcome" }]);
    }
  }

  // =================================================================== شاشة المشهد التفاعلي
  let curPic = null, picTok = 0;
  function setPicture(name) {
    const pic = $("#pic"), tok = ++picTok;
    const swapIn = (node) => {
      if (tok !== picTok) { node.remove(); return; }
      requestAnimationFrame(() => node.classList.add("show"));
      const old = curPic; curPic = node;
      if (old && old !== node) setTimeout(() => old.remove(), 700);
    };
    const img = new Image();
    img.alt = "";
    img.style.setProperty("--kz", (1.07 + Math.random() * 0.05).toFixed(3));
    img.style.setProperty("--kx", ((Math.random() - 0.5) * 3).toFixed(2) + "%");
    img.style.setProperty("--ky", ((Math.random() - 0.5) * 2).toFixed(2) + "%");
    img.onload = () => swapIn(img);
    img.onerror = () => {
      img.remove();
      const svg = window.renderFelfelSceneSVG(name);
      if (svg) {
        const wrap = el("div", "scene-wrap", svg);
        wrap.style.setProperty("--kz", (1.03 + Math.random() * 0.03).toFixed(3));
        wrap.style.setProperty("--kx", ((Math.random() - 0.5) * 2).toFixed(2) + "%");
        wrap.style.setProperty("--ky", ((Math.random() - 0.5) * 1.5).toFixed(2) + "%");
        pic.appendChild(wrap);
        swapIn(wrap);
      }
    };
    img.src = `images/felfel/${name}.jpg`;
    pic.appendChild(img);
  }

  function openScene(id, push = true) {
    if (push && currentId) history.push(currentId);
    currentId = id;
    const p = SCENES[id];
    if (p.place && !progress.visited.includes(p.place)) progress.visited.push(p.place);
    if (p.mood) progress.mood = p.mood;
    if (p.end && !progress.endings.includes(id)) progress.endings.push(id);
    save("felfel_progress", progress);

    showScreen("sceneScreen");
    renderScene();
  }

  function renderScene() {
    const id = currentId, p = SCENES[id];
    stopSpeaking();
    sfx("page");
    setPicture(p.img);

    const plObj = PLACES.find((x) => x.id === p.place) || PLACES[0];
    $("#sPlaceBadge").textContent = `${plObj.icon} ${plObj.name}`;
    $("#sHearts").textContent = `💛 ${progress.hearts}`;

    const ch = $("#chapter");
    ch.classList.remove("show");
    if (p.chapter) { ch.textContent = p.chapter; setTimeout(() => ch.classList.add("show"), 180); setTimeout(() => ch.classList.remove("show"), 4000); }

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

    const choicesBox = $("#choices"); choicesBox.innerHTML = "";
    choicesBox.className = "choices" + (p.choices && p.choices.length === 4 ? " grid4" : "");
    const nav = $("#nav"); nav.classList.remove("hidden");
    $("#nBack").disabled = !history.length;
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
      p.choices.forEach((c, i) => {
        const b = el("button", `choice c${i % 4}`);
        b.innerHTML = `<span class="ci">${c.icon}</span><span class="ct">${escapeHTML(c.t)}</span>`;
        b.onclick = () => {
          sfx(c.heart ? "heart" : "pop");
          if (c.heart) progress.hearts++;
          const newB = c.badge && BADGES[c.badge] && !progress.badges.includes(c.badge) ? c.badge : null;
          if (newB) progress.badges.push(newB);
          save("felfel_progress", progress);
          if (newB) {
            const bm = BADGES[newB];
            stopSpeaking();
            $("#btIcon").textContent = bm.icon; $("#btName").textContent = bm.name; $("#btTip").textContent = bm.tip;
            $("#badgeToast").classList.add("active");
            sfx("fanfare"); confetti(90);
            speakQueue([{ key: `badge_${newB}` }]);
            $("#btOk").onclick = () => { $("#badgeToast").classList.remove("active"); stopSpeaking(); sfx("pop"); openScene(c.go, true); };
          } else {
            openScene(c.go, true);
          }
        };
        choicesBox.appendChild(b);
        queue.push({ key: `${id}_c${i}`, onStart: () => flashChoice(i) });
        preloadAudio(`${c.go}_0`);
      });
    } else if (p.next) {
      preloadAudio(`${p.next}_0`);
    }

    speakQueue(queue, finishReading);
  }

  function finishReading() {
    document.querySelectorAll(".line").forEach((l) => { l.classList.remove("on"); l.classList.add("done"); });
    document.querySelectorAll(".w.hl").forEach((w) => w.classList.remove("hl"));
    document.querySelectorAll(".choice.spin").forEach((c) => c.classList.remove("spin"));
    $("#nNext").classList.add("ready");
  }
  function flashChoice(i) { document.querySelectorAll(".choice").forEach((c, j) => c.classList.toggle("spin", j === i)); }

  function showEndingModal() {
    const id = currentId, p = SCENES[id];
    stopSpeaking();
    $("#endTitle").textContent = p.end;
    $("#endLesson").textContent = `💡 ${p.lesson}`;
    const g = $("#endGrid"); g.innerHTML = "";
    ENDINGS.forEach((k) => {
      const ok = progress.endings.includes(k);
      g.appendChild(el("div", "eg " + (ok ? "found" : "locked") + (k === id ? " now" : ""), ok ? SCENES[k].end : "❔ نهاية لم تكتشف بعد"));
    });
    $("#endOverlay").classList.add("active");
    if (p.mood === "happy" || p.mood === "celebrate") { sfx("fanfare"); confetti(160); } else sfx("pop");
  }

  // =================================================================== الأزرار
  $("#btnStartGarden").onclick = () => { ac(); sfx("pop"); history = []; openScene("garden", false); };
  $("#btnToMap").onclick = () => { sfx("pop"); renderMap(false); };
  $("#endToMap").onclick = () => { sfx("pop"); renderMap(true); };
  $("#endRetry").onclick = () => { $("#endOverlay").classList.remove("active"); sfx("pop"); history = []; openScene("garden", false); };
  $("#nNext").onclick = () => { const p = SCENES[currentId]; if (p.end) showEndingModal(); else if (p.next) openScene(p.next, true); };
  $("#nBack").onclick = () => { if (!history.length) return; openScene(history.pop(), false); };
  $("#nReplay").onclick = () => { if (!settings.voice) toggleVoice(); renderScene(); };
  $("#mVoice").onclick = toggleVoice; $("#sVoice").onclick = toggleVoice;
  $("#mMusic").onclick = () => { ac(); toggleMusic(); }; $("#sMusic").onclick = toggleMusic;
  $("#sSpeed").onclick = () => { settings.slow = !settings.slow; refreshSettings(); };
  const toggleFull = () => { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}); };
  $("#mFull").onclick = toggleFull; $("#sFull").onclick = toggleFull;
  $("#mReset").onclick = () => {
    sfx("pop");
    progress = { mood: "init", visited: [], endings: [], badges: [], hearts: 0 };
    save("felfel_progress", progress);
    renderMap(true);
  };

  document.addEventListener("keydown", (e) => {
    if (!$("#sceneScreen").classList.contains("active") || $("#endOverlay").classList.contains("active")) return;
    if (e.key === "ArrowLeft" || e.key === " " || e.key === "Enter") { e.preventDefault(); $("#nNext").click(); }
    else if (e.key === "ArrowRight") $("#nBack").click();
  });

  refreshSettings();
  renderMap(false);
})();
