/* =====================================================================
   Animated Picture-Book Scene Renderer (16:9 SVG + watercolor cutouts)
   Used for scenes that don't have a painted .jpg yet, and also for
   ending gallery previews. Dropping images/<name>.jpg overrides any scene.
   ===================================================================== */
(() => {
  "use strict";

  // Aspect ratios of transparent watercolor character sprites in images/chars/
  const CHAR_AR = {
    adam: 197 / 505, biscuit: 101 / 174, lina: 229 / 487,
    omar: 210 / 521, sami: 162 / 477, huda: 204 / 578, mom: 181 / 620
  };

  // Place a watercolor character sprite with soft ground shadow & gentle animation
  // x, bottomY in 1376x768 coordinates; h = height; flip = mirror horizontally
  function ch(name, x, bottomY, h, opts = {}) {
    const w = Math.round(h * CHAR_AR[name]);
    const y = bottomY - h;
    const flip = opts.flip ? `translate(${x * 2},0) scale(-1,1)` : "";
    const anim = opts.anim || "breathe";
    const delay = opts.delay || "0s";
    const shadow = opts.noShadow ? "" :
      `<ellipse cx="${x}" cy="${bottomY - 6}" rx="${Math.round(w * 0.42)}" ry="13" fill="rgba(90,65,40,0.22)"/>`;
    const body = `<g transform="${flip}">
      <image href="images/chars/${name}.png" x="${x - w / 2}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>
    </g>`;
    return `${shadow}<g class="sc-${anim}" style="transform-origin:${x}px ${bottomY}px;animation-delay:${delay}">${body}</g>`;
  }

  // Reusable storybook props
  const DEFS = `<defs>
    <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#9bd8f5"/><stop offset="65%" stop-color="#d8f2ff"/><stop offset="100%" stop-color="#fff4db"/>
    </linearGradient>
    <linearGradient id="skySunset" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ff9a6c"/><stop offset="48%" stop-color="#ffd180"/><stop offset="100%" stop-color="#fff0c9"/>
    </linearGradient>
    <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#a8db7e"/><stop offset="100%" stop-color="#7bbf5c"/>
    </linearGradient>
    <linearGradient id="wallWarm" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff6df"/><stop offset="100%" stop-color="#f6e3be"/>
    </linearGradient>
    <linearGradient id="floorWood" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ecd0a1"/><stop offset="100%" stop-color="#d7ae76"/>
    </linearGradient>
    <linearGradient id="gymWall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff3da"/><stop offset="100%" stop-color="#f2d9b2"/>
    </linearGradient>
    <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff7b2" stop-opacity="0.95"/>
      <stop offset="55%" stop-color="#ffe07d" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#ffe07d" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="72%">
      <stop offset="72%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#8c5a2b" stop-opacity="0.18"/>
    </radialGradient>
    <filter id="softShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#5c3d1e" flood-opacity="0.18"/>
    </filter>
  </defs>`;

  function cloud(x, y, s = 1, cls = "sc-drift") {
    return `<g class="${cls}" transform="translate(${x},${y}) scale(${s})" fill="#fffdf6" stroke="#dce9f2" stroke-width="3">
      <path d="M-70,15 C-70,-12 -45,-25 -22,-18 C-10,-42 28,-42 40,-16 C64,-22 86,-2 80,20 C80,32 68,36 52,36 L-50,36 C-65,36 -70,26 -70,15 Z"/>
    </g>`;
  }

  function tree(x, y, s = 1) {
    return `<g transform="translate(${x},${y}) scale(${s})">
      <path d="M-16,120 L-12,0 L12,0 L18,120 Z" fill="#9c6b44" stroke="#69452a" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="-48" cy="-18" r="56" fill="#7ec267" stroke="#538a41" stroke-width="4"/>
      <circle cx="48" cy="-14" r="52" fill="#88cb6f" stroke="#538a41" stroke-width="4"/>
      <circle cx="0" cy="-62" r="66" fill="#9ad87e" stroke="#538a41" stroke-width="4"/>
      <circle cx="-18" cy="-80" r="22" fill="#b7e89c" opacity="0.7"/>
    </g>`;
  }

  function banners(y = 65) {
    const cols = ["#f26d6d", "#ffd166", "#58b8e5", "#7ec96e", "#b388eb", "#ff9b54"];
    let flags = "";
    for (let i = 0; i < 14; i++) {
      const x = 40 + i * 95;
      const dip = Math.sin((i / 13) * Math.PI) * 38;
      flags += `<polygon points="${x},${y + dip} ${x + 76},${y + dip + 4} ${x + 38},${y + dip + 66}" fill="${cols[i % cols.length]}" stroke="#6b4b32" stroke-width="3" stroke-linejoin="round"/>`;
    }
    return `<g class="sc-sway">
      <path d="M0,${y} Q688,${y + 85} 1376,${y}" fill="none" stroke="#6b4b32" stroke-width="4"/>
      ${flags}
    </g>`;
  }

  function balloon(x, y, color, delay = "0s") {
    return `<g class="sc-float" style="animation-delay:${delay}" transform="translate(${x},${y})">
      <path d="M0,45 Q-8,85 6,125" fill="none" stroke="#856a52" stroke-width="2.5"/>
      <ellipse cx="0" cy="0" rx="34" ry="42" fill="${color}" stroke="#6b4b32" stroke-width="3.5"/>
      <ellipse cx="-11" cy="-14" rx="8" ry="13" fill="#fff" opacity="0.45" transform="rotate(-18 -11 -14)"/>
      <polygon points="-6,41 6,41 0,49" fill="${color}" stroke="#6b4b32" stroke-width="2"/>
    </g>`;
  }

  function soccerBall(x, y, r = 34) {
    return `<g transform="translate(${x},${y})">
      <circle r="${r}" fill="#fff" stroke="#3c3129" stroke-width="3.5"/>
      <polygon points="0,${-r * 0.38} ${r * 0.36},${-r * 0.12} ${r * 0.22},${r * 0.32} ${-r * 0.22},${r * 0.32} ${-r * 0.36},${-r * 0.12}" fill="#3c3129"/>
      <line x1="0" y1="${-r * 0.38}" x2="0" y2="${-r}" stroke="#3c3129" stroke-width="2.5"/>
      <line x1="${r * 0.36}" y1="${-r * 0.12}" x2="${r * 0.92}" y2="${-r * 0.3}" stroke="#3c3129" stroke-width="2.5"/>
      <line x1="${-r * 0.36}" y1="${-r * 0.12}" x2="${-r * 0.92}" y2="${-r * 0.3}" stroke="#3c3129" stroke-width="2.5"/>
      <line x1="${r * 0.22}" y1="${r * 0.32}" x2="${r * 0.6}" y2="${r * 0.8}" stroke="#3c3129" stroke-width="2.5"/>
      <line x1="${-r * 0.22}" y1="${r * 0.32}" x2="${-r * 0.6}" y2="${r * 0.8}" stroke="#3c3129" stroke-width="2.5"/>
    </g>`;
  }

  function heart(x, y, s = 1, color = "#ff5c77", delay = "0s") {
    return `<g class="sc-float" style="animation-delay:${delay}" transform="translate(${x},${y}) scale(${s})">
      <path d="M0,14 C-22,-6 -36,16 -20,34 L0,52 L20,34 C36,16 22,-6 0,14 Z" fill="${color}" stroke="#7a323e" stroke-width="3" stroke-linejoin="round"/>
    </g>`;
  }

  function star(x, y, r = 18, color = "#ffd154", delay = "0s") {
    let pts = [];
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      const rad = i % 2 === 0 ? r : r * 0.45;
      pts.push(`${(Math.cos(a) * rad).toFixed(1)},${(Math.sin(a) * rad).toFixed(1)}`);
    }
    return `<polygon class="sc-twinkle" style="transform-origin:${x}px ${y}px;animation-delay:${delay}" points="${pts.join(" ")}" transform="translate(${x},${y})" fill="${color}" stroke="#8a6220" stroke-width="2.5" stroke-linejoin="round"/>`;
  }

  function butterfly(x, y, color = "#ff9f43", delay = "0s") {
    return `<g class="sc-float" style="animation-delay:${delay}" transform="translate(${x},${y})">
      <ellipse cx="-14" cy="-6" rx="14" ry="10" fill="${color}" stroke="#6b4b32" stroke-width="2.2" transform="rotate(-25 -14 -6)"/>
      <ellipse cx="14" cy="-6" rx="14" ry="10" fill="${color}" stroke="#6b4b32" stroke-width="2.2" transform="rotate(25 14 -6)"/>
      <ellipse cx="-10" cy="9" rx="9" ry="7" fill="#ffd166" stroke="#6b4b32" stroke-width="2"/>
      <ellipse cx="10" cy="9" rx="9" ry="7" fill="#ffd166" stroke="#6b4b32" stroke-width="2"/>
      <rect x="-3" y="-12" width="6" height="24" rx="3" fill="#5c4033"/>
    </g>`;
  }

  function thoughtBubble(x, y, rx, ry, tailX, tailY, inner) {
    return `<g filter="url(#softShadow)">
      <circle cx="${tailX}" cy="${tailY}" r="10" fill="#fffdf8" stroke="#6b4b32" stroke-width="3.5"/>
      <circle cx="${(tailX + x) / 2}" cy="${(tailY + y + ry * 0.7) / 2}" r="16" fill="#fffdf8" stroke="#6b4b32" stroke-width="3.5"/>
      <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fffdf8" stroke="#6b4b32" stroke-width="4"/>
      ${inner}
    </g>`;
  }

  function bench(x, y) {
    return `<g transform="translate(${x},${y})">
      <rect x="-150" y="-70" width="300" height="32" rx="8" fill="#c98e55" stroke="#6b4528" stroke-width="4"/>
      <rect x="-150" y="-30" width="300" height="32" rx="8" fill="#d89d63" stroke="#6b4528" stroke-width="4"/>
      <rect x="-165" y="14" width="330" height="24" rx="8" fill="#c2834b" stroke="#6b4528" stroke-width="4"/>
      <rect x="-130" y="38" width="18" height="62" rx="4" fill="#6b4b32"/>
      <rect x="112" y="38" width="18" height="62" rx="4" fill="#6b4b32"/>
    </g>`;
  }

  function rocketCastle(x, y, scale = 1, state = "intact") {
    // Matches building.jpg: tall cardboard rocket-castle with colorful paint splashes, robot, dinosaur!
    const topCone = state === "broken"
      ? `<g transform="translate(155,145) rotate(68)">
          <polygon points="-95,0 0,-135 95,0" fill="#d3a36d" stroke="#6b4528" stroke-width="5" stroke-linejoin="round"/>
          <line x1="0" y1="-135" x2="0" y2="0" stroke="#9e6f3f" stroke-width="3"/>
        </g>`
      : `<g>
          <polygon points="-95,-230 0,-365 95,-230" fill="#d3a36d" stroke="#6b4528" stroke-width="5" stroke-linejoin="round"/>
          <line x1="0" y1="-365" x2="0" y2="-230" stroke="#9e6f3f" stroke-width="3"/>
          ${state === "fixed" ? `
            <rect x="-45" y="-248" width="90" height="22" rx="4" fill="#f5e6c4" stroke="#8a7456" stroke-width="3" transform="rotate(-7 0 -238)"/>
            <rect x="-35" y="-250" width="75" height="20" rx="4" fill="#f5e6c4" stroke="#8a7456" stroke-width="3" transform="rotate(9 0 -240)"/>
            ${star(-52, -236, 20, "#ffd154")} ${star(46, -242, 22, "#ffd154", "0.3s")} ${star(0, -268, 17, "#fff29c", "0.6s")}
            <line x1="0" y1="-365" x2="0" y2="-430" stroke="#6b4528" stroke-width="5"/>
            <polygon points="0,-430 62,-410 0,-390" fill="#ef5d8f" stroke="#6b4528" stroke-width="3.5"/>` : ""}
        </g>`;
    return `<g transform="translate(${x},${y}) scale(${scale})">
      <ellipse cx="0" cy="175" rx="165" ry="22" fill="rgba(85,55,25,0.2)"/>
      <!-- fins -->
      <polygon points="-95,30 -160,155 -95,155" fill="#c4915a" stroke="#6b4528" stroke-width="5" stroke-linejoin="round"/>
      <polygon points="95,30 160,155 95,155" fill="#c4915a" stroke="#6b4528" stroke-width="5" stroke-linejoin="round"/>
      <!-- main cardboard body -->
      <path d="M-95,-230 L-60,-230 L-60,-212 L-30,-212 L-30,-230 L30,-230 L30,-212 L60,-212 L60,-230 L95,-230 L95,160 L-95,160 Z" fill="#dca972" stroke="#6b4528" stroke-width="5" stroke-linejoin="round"/>
      <!-- colorful paint splashes -->
      <circle cx="-48" cy="-40" r="24" fill="#f26d6d" opacity="0.85"/>
      <circle cx="-22" cy="-5" r="26" fill="#ffd166" opacity="0.85"/>
      <circle cx="-58" cy="20" r="20" fill="#58b8e5" opacity="0.85"/>
      <circle cx="-12" cy="36" r="22" fill="#82cc6c" opacity="0.85"/>
      <circle cx="44" cy="-95" r="18" fill="#b388eb" opacity="0.8"/>
      <!-- porthole window -->
      <circle cx="-20" cy="-130" r="38" fill="#8ecae6" stroke="#6b4528" stroke-width="6"/>
      <circle cx="-20" cy="-130" r="26" fill="#6ab5db"/>
      <!-- little green dino peeking in window -->
      <circle cx="-18" cy="-126" r="15" fill="#6dbd63" stroke="#3c6e37" stroke-width="2.5"/>
      <circle cx="-13" cy="-130" r="3" fill="#2d2016"/>
      <!-- little silver robot on the side -->
      <g transform="translate(68,-45)">
        <rect x="-24" y="-32" width="48" height="36" rx="8" fill="#d0d6dc" stroke="#535c66" stroke-width="3.5"/>
        <circle cx="-9" cy="-16" r="4" fill="#3c3129"/><circle cx="9" cy="-16" r="4" fill="#3c3129"/>
        <rect x="-20" y="6" width="40" height="44" rx="6" fill="#b9c2cc" stroke="#535c66" stroke-width="3.5"/>
        <rect x="-11" y="16" width="22" height="14" rx="3" fill="#ffd166" stroke="#535c66" stroke-width="2"/>
        <line x1="0" y1="-32" x2="0" y2="-48" stroke="#535c66" stroke-width="3"/><circle cx="0" cy="-50" r="5" fill="#58b8e5"/>
      </g>
      <!-- castle arch door -->
      <path d="M-38,160 L-38,95 A38,38 0 0,1 38,95 L38,160 Z" fill="#8f5d34" stroke="#6b4528" stroke-width="5"/>
      ${topCone}
    </g>`;
  }

  // ---------------- REUSABLE BACKDROPS ----------------
  function bgClassroom() {
    return `
      <rect width="1376" height="768" fill="url(#wallWarm)"/>
      <rect y="535" width="1376" height="233" fill="url(#floorWood)"/>
      <line x1="0" y1="535" x2="1376" y2="535" stroke="#b8905c" stroke-width="4"/>
      <!-- sunny window right -->
      <rect x="1030" y="65" width="250" height="295" rx="10" fill="url(#skyDay)" stroke="#b8844c" stroke-width="10"/>
      <circle cx="1165" cy="145" r="42" fill="#ffe07d"/>
      <ellipse cx="1155" cy="340" rx="125" ry="50" fill="#9ed87e"/>
      <line x1="1155" y1="65" x2="1155" y2="360" stroke="#b8844c" stroke-width="8"/>
      <line x1="1030" y1="210" x2="1280" y2="210" stroke="#b8844c" stroke-width="8"/>
      <!-- green chalkboard -->
      <rect x="130" y="70" width="660" height="285" rx="12" fill="#4f8564" stroke="#b37b46" stroke-width="12"/>
      <path d="M220,165 Q245,125 290,145 Q330,120 360,160 Q385,165 375,185 L215,185 Z" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="4"/>
      <circle cx="670" cy="155" r="32" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="4"/>
      <rect x="122" y="352" width="676" height="16" rx="6" fill="#c78e56" stroke="#85582e" stroke-width="3"/>
      <!-- bookshelf -->
      <rect x="820" y="130" width="165" height="395" rx="8" fill="#d9a56c" stroke="#85582e" stroke-width="5"/>
      <line x1="825" y1="240" x2="980" y2="240" stroke="#85582e" stroke-width="6"/>
      <line x1="825" y1="350" x2="980" y2="350" stroke="#85582e" stroke-width="6"/>
      <rect x="840" y="160" width="24" height="75" rx="3" fill="#e76f51" stroke="#6b4528" stroke-width="2.5"/>
      <rect x="868" y="172" width="22" height="63" rx="3" fill="#58b8e5" stroke="#6b4528" stroke-width="2.5"/>
      <rect x="894" y="155" width="26" height="80" rx="3" fill="#ffd166" stroke="#6b4528" stroke-width="2.5"/>
      <rect x="926" y="168" width="24" height="67" rx="3" fill="#7ec96e" stroke="#6b4528" stroke-width="2.5"/>
      <rect x="845" y="275" width="28" height="70" rx="3" fill="#b388eb" stroke="#6b4528" stroke-width="2.5"/>
      <rect x="878" y="265" width="25" height="80" rx="3" fill="#ff9b54" stroke="#6b4528" stroke-width="2.5"/>
      <rect x="910" y="280" width="25" height="65" rx="3" fill="#ef5d8f" stroke="#6b4528" stroke-width="2.5"/>
    `;
  }

  function bgPlayground(pavement = false) {
    return `
      <rect width="1376" height="768" fill="url(#skyDay)"/>
      <circle cx="1170" cy="115" r="140" fill="url(#sunGlow)"/>
      <circle cx="1170" cy="115" r="56" fill="#ffe27a" stroke="#e0ad42" stroke-width="4"/>
      ${cloud(240, 120, 1.05)} ${cloud(760, 95, 0.85)}
      <!-- gentle hills & school fence -->
      <path d="M0,430 Q350,360 720,420 Q1080,365 1376,415 L1376,768 L0,768 Z" fill="url(#grass)"/>
      ${tree(135, 340, 1.05)} ${tree(1245, 330, 1.1)} ${tree(960, 355, 0.72)}
      <!-- wooden fence -->
      <g stroke="#9e744c" stroke-width="4" fill="#e7cfa8">
        ${Array.from({ length: 16 }, (_, i) => `<rect x="${20 + i * 86}" y="388" width="18" height="70" rx="4"/>`).join("")}
        <rect x="0" y="405" width="1376" height="12"/><rect x="0" y="438" width="1376" height="12"/>
      </g>
      ${pavement
        ? `<path d="M-20,515 Q688,465 1396,515 L1396,768 L-20,768 Z" fill="#e5dccf" stroke="#bfb29f" stroke-width="5"/>`
        : `<path d="M0,458 L1376,458 L1376,768 L0,768 Z" fill="url(#grass)"/>`}
    `;
  }

  function bgCafeteria() {
    return `
      <rect width="1376" height="768" fill="#fff4e0"/>
      <rect y="510" width="1376" height="258" fill="#ead6b7"/>
      <!-- big bright windows -->
      <rect x="110" y="65" width="320" height="240" rx="12" fill="url(#skyDay)" stroke="#c5945d" stroke-width="10"/>
      <rect x="945" y="65" width="320" height="240" rx="12" fill="url(#skyDay)" stroke="#c5945d" stroke-width="10"/>
      <line x1="270" y1="65" x2="270" y2="305" stroke="#c5945d" stroke-width="7"/>
      <line x1="1105" y1="65" x2="1105" y2="305" stroke="#c5945d" stroke-width="7"/>
      <!-- cute fruit poster -->
      <rect x="575" y="75" width="225" height="165" rx="14" fill="#fffdf6" stroke="#d1a068" stroke-width="6"/>
      <circle cx="645" cy="162" r="34" fill="#ef5d60" stroke="#7a3234" stroke-width="3.5"/>
      <path d="M645,128 Q655,108 668,118" fill="none" stroke="#538a41" stroke-width="5"/>
      <circle cx="728" cy="164" r="32" fill="#ffd166" stroke="#8a6220" stroke-width="3.5"/>
      <circle cx="688" cy="182" r="24" fill="#82cc6c" stroke="#487d39" stroke-width="3.5"/>
    `;
  }

  function bgFair() {
    return `
      <rect width="1376" height="768" fill="url(#gymWall)"/>
      <rect y="535" width="1376" height="233" fill="url(#floorWood)"/>
      <line x1="0" y1="535" x2="1376" y2="535" stroke="#b8905c" stroke-width="5"/>
      <!-- background booths -->
      <rect x="55" y="340" width="220" height="195" rx="8" fill="#f7e3c4" stroke="#b38352" stroke-width="4"/>
      <path d="M40,340 L290,340 L275,295 L55,295 Z" fill="#ff8a5b" stroke="#854528" stroke-width="4"/>
      <rect x="1100" y="340" width="220" height="195" rx="8" fill="#f7e3c4" stroke="#b38352" stroke-width="4"/>
      <path d="M1085,340 L1335,340 L1320,295 L1100,295 Z" fill="#58b8e5" stroke="#2f6b8a" stroke-width="4"/>
      ${banners(45)}
      ${balloon(135, 195, "#f26d6d", "0s")}
      ${balloon(200, 235, "#ffd166", "0.5s")}
      ${balloon(1180, 200, "#7ec96e", "0.3s")}
      ${balloon(1250, 240, "#b388eb", "0.8s")}
    `;
  }

  function desk(x, y, w = 230) {
    return `<g transform="translate(${x},${y})">
      <rect x="${-w / 2}" y="0" width="${w}" height="24" rx="8" fill="#d9a166" stroke="#7a512b" stroke-width="4"/>
      <rect x="${-w / 2 + 12}" y="24" width="${w - 24}" height="46" rx="4" fill="#c78e54" stroke="#7a512b" stroke-width="4"/>
      <rect x="${-w / 2 + 18}" y="70" width="14" height="90" fill="#8b96a0" stroke="#4d555c" stroke-width="3"/>
      <rect x="${w / 2 - 32}" y="70" width="14" height="90" fill="#8b96a0" stroke="#4d555c" stroke-width="3"/>
    </g>`;
  }

  // ---------------- ALL 31 BESPOKE SCENES ----------------
  const BUILDERS = {
    schoolgate: () => `
      <rect width="1376" height="768" fill="url(#skyDay)"/>
      <circle cx="1160" cy="110" r="130" fill="url(#sunGlow)"/>
      <circle cx="1160" cy="110" r="54" fill="#ffe27a" stroke="#e0ad42" stroke-width="4"/>
      ${cloud(210, 110, 1)} ${cloud(690, 95, 0.85)}
      <path d="M0,480 Q688,440 1376,480 L1376,768 L0,768 Z" fill="url(#grass)"/>
      <path d="M510,505 L865,505 L990,768 L385,768 Z" fill="#efe2cc" stroke="#c9b492" stroke-width="4"/>
      ${tree(145, 360, 1.1)} ${tree(1235, 355, 1.15)}
      <!-- Big cheerful yellow school with red door -->
      <g transform="translate(688,325)">
        <rect x="-335" y="-130" width="670" height="315" rx="14" fill="#ffe074" stroke="#8a6220" stroke-width="6"/>
        <polygon points="-365,-125 0,-250 365,-125" fill="#e56b55" stroke="#7d3225" stroke-width="6" stroke-linejoin="round"/>
        <!-- school clock -->
        <circle cx="0" cy="-175" r="36" fill="#fffdf6" stroke="#7d3225" stroke-width="5"/>
        <line x1="0" y1="-175" x2="0" y2="-198" stroke="#4a3728" stroke-width="4" stroke-linecap="round"/>
        <line x1="0" y1="-175" x2="18" y2="-175" stroke="#4a3728" stroke-width="4" stroke-linecap="round"/>
        <!-- windows -->
        ${[-245, -135, 135, 245].map((wx) => `
          <rect x="${wx - 36}" y="-75" width="72" height="84" rx="8" fill="#bce6fa" stroke="#8a6220" stroke-width="4"/>
          <line x1="${wx}" y1="-75" x2="${wx}" y2="9" stroke="#8a6220" stroke-width="3.5"/>
          <line x1="${wx - 36}" y1="-33" x2="${wx + 36}" y2="-33" stroke="#8a6220" stroke-width="3.5"/>
          <rect x="${wx - 36}" y="42" width="72" height="84" rx="8" fill="#bce6fa" stroke="#8a6220" stroke-width="4"/>
        `).join("")}
        <!-- big red double door -->
        <path d="M-66,185 L-66,35 A66,50 0 0,1 66,35 L66,185 Z" fill="#d94e4e" stroke="#6e2424" stroke-width="6"/>
        <line x1="0" y1="-14" x2="0" y2="185" stroke="#6e2424" stroke-width="4"/>
        <circle cx="-16" cy="105" r="7" fill="#ffd166"/><circle cx="16" cy="105" r="7" fill="#ffd166"/>
      </g>
      ${ch("mom", 545, 735, 425)}
      ${ch("adam", 725, 735, 345)}
      <!-- cute butterflies near Adam's tummy -->
      ${butterfly(825, 535, "#ff9f43", "0s")}
      ${butterfly(870, 485, "#ff7eb6", "0.4s")}
      ${butterfly(845, 590, "#70d6ff", "0.8s")}
    `,

    classintro: () => `
      ${bgClassroom()}
      ${ch("huda", 285, 650, 445)}
      ${ch("adam", 495, 655, 365)}
      <!-- classmates sitting at desks -->
      ${ch("lina", 870, 625, 310, { noShadow: true })} ${desk(870, 515, 210)}
      ${ch("omar", 1070, 645, 330, { noShadow: true })} ${desk(1070, 535, 215)}
      ${ch("sami", 1245, 635, 300, { noShadow: true })} ${desk(1245, 525, 190)}
      ${heart(395, 225, 0.9, "#ff8fa3")}
    `,

    linadesk: () => `
      ${bgClassroom()}
      ${ch("adam", 470, 620, 420, { noShadow: true })}
      ${ch("lina", 905, 615, 410, { noShadow: true })}
      <!-- big foreground classroom desk -->
      <rect x="190" y="485" width="996" height="285" rx="18" fill="#dfb078" stroke="#7a512b" stroke-width="6"/>
      <!-- Lina's drawing paper of a green dinosaur with a golden crown -->
      <g transform="translate(688,615) rotate(-3)" filter="url(#softShadow)">
        <rect x="-185" y="-110" width="370" height="215" rx="8" fill="#fffdf8" stroke="#b5a38e" stroke-width="4"/>
        <!-- cute green dinosaur -->
        <ellipse cx="-10" cy="25" rx="68" ry="42" fill="#7ec96e" stroke="#457d39" stroke-width="4"/>
        <path d="M-70,32 Q-125,22 -140,48 Q-100,62 -62,48 Z" fill="#7ec96e" stroke="#457d39" stroke-width="4"/>
        <path d="M35,5 Q55,-52 78,-55 Q115,-55 112,-22 Q108,8 65,12 Z" fill="#7ec96e" stroke="#457d39" stroke-width="4"/>
        <circle cx="88" cy="-35" r="5" fill="#2b2118"/>
        <path d="M84,-16 Q96,-10 105,-18" fill="none" stroke="#2b2118" stroke-width="3" stroke-linecap="round"/>
        <rect x="-42" y="52" width="22" height="36" rx="7" fill="#7ec96e" stroke="#457d39" stroke-width="4"/>
        <rect x="16" y="52" width="22" height="36" rx="7" fill="#7ec96e" stroke="#457d39" stroke-width="4"/>
        <!-- golden crown! -->
        <polygon points="56,-56 64,-88 80,-68 95,-92 106,-56" fill="#ffd154" stroke="#8a6220" stroke-width="3.5" stroke-linejoin="round"/>
        ${star(-120, -65, 16, "#ffd154")} ${star(135, -62, 14, "#ff9f43", "0.4s")}
      </g>
    `,

    shywave: () => `
      ${bgClassroom()}
      ${ch("huda", 240, 625, 420)}
      ${ch("lina", 580, 610, 290, { noShadow: true })} ${desk(580, 505, 195)}
      ${ch("omar", 790, 620, 310, { noShadow: true })} ${desk(790, 515, 200)}
      ${ch("adam", 1045, 700, 370)}
      <!-- extra rosy blush & gentle shy wave sparkles -->
      <circle cx="1010" cy="438" r="18" fill="#ff758f" opacity="0.45"/>
      <circle cx="1080" cy="438" r="18" fill="#ff758f" opacity="0.45"/>
      <g transform="translate(935,455)" stroke="#ff8a3d" stroke-width="4" fill="none" stroke-linecap="round">
        <path d="M0,0 Q-18,-16 -6,-34"/><path d="M-16,12 Q-36,-10 -22,-32"/>
      </g>
    `,

    samibook: () => `
      ${bgClassroom()}
      ${ch("adam", 495, 625, 420, { noShadow: true })}
      ${ch("sami", 885, 620, 405, { noShadow: true })}
      <rect x="190" y="485" width="996" height="285" rx="18" fill="#dfb078" stroke="#7a512b" stroke-width="6"/>
      <!-- big open space book with Saturn & stars -->
      <g transform="translate(688,600)" filter="url(#softShadow)">
        <path d="M-240,-95 Q-120,-118 0,-90 Q120,-118 240,-95 L252,108 Q120,90 0,114 Q-120,90 -252,108 Z" fill="#1e2d5a" stroke="#fff8ec" stroke-width="10" stroke-linejoin="round"/>
        <line x1="0" y1="-90" x2="0" y2="114" stroke="#fff8ec" stroke-width="5"/>
        <!-- Saturn with rings -->
        <ellipse cx="115" cy="5" rx="74" ry="20" fill="none" stroke="#ffd166" stroke-width="10" transform="rotate(-18 115 5)"/>
        <circle cx="115" cy="5" r="38" fill="#f4a261" stroke="#fff2cc" stroke-width="3"/>
        <path d="M46,24 Q115,44 184,-14" fill="none" stroke="#ffd166" stroke-width="9"/>
        <!-- Earth / blue planet -->
        <circle cx="-125" cy="-10" r="42" fill="#58b8e5" stroke="#bfe9ff" stroke-width="3"/>
        <path d="M-150,-20 Q-125,-35 -105,-10 Q-120,10 -145,8 Z" fill="#7ec96e"/>
        <circle cx="-60" cy="55" r="18" fill="#ef5d8f"/>
        ${star(-185, -55, 11, "#fff29c")} ${star(-55, -55, 14, "#ffd154", "0.3s")} ${star(50, -52, 10, "#fff29c", "0.5s")} ${star(195, -55, 13, "#ffd154", "0.7s")} ${star(62, 65, 12, "#fff29c", "0.2s")}
      </g>
    `,

    playground: () => `
      ${bgPlayground(false)}
      <!-- center chalk pavement patch -->
      <ellipse cx="688" cy="595" rx="265" ry="95" fill="#e6ddd0" stroke="#bfb29f" stroke-width="4"/>
      <!-- colorful chalk flowers on pavement -->
      <circle cx="635" cy="600" r="18" fill="#ffd166"/><circle cx="635" cy="576" r="13" fill="#ff7eb6"/>
      <circle cx="658" cy="600" r="13" fill="#ff7eb6"/><circle cx="612" cy="600" r="13" fill="#ff7eb6"/>
      <circle cx="635" cy="624" r="13" fill="#ff7eb6"/>
      <circle cx="755" cy="585" r="22" fill="#ffd166" stroke="#f4a261" stroke-width="4"/>
      <!-- left: Omar playing soccer -->
      ${ch("omar", 225, 625, 315)}
      ${soccerBall(335, 595, 28)}
      <!-- middle: Lina drawing -->
      ${ch("lina", 690, 565, 260)}
      <!-- right: Sami alone on bench -->
      ${bench(1145, 540)}
      ${ch("sami", 1145, 600, 265, { noShadow: true })}
      <!-- front center: Adam deciding, holding cookie bag -->
      ${ch("adam", 515, 745, 360)}
      <g transform="translate(610,605) rotate(-8)">
        <rect x="-24" y="-32" width="48" height="62" rx="6" fill="#d9a56c" stroke="#7a512b" stroke-width="3.5"/>
        <circle cx="-6" cy="0" r="9" fill="#c98544"/><circle cx="10" cy="10" r="9" fill="#c98544"/>
      </g>
    `,

    soccer: () => `
      ${bgPlayground(false)}
      <!-- goal net right -->
      <g transform="translate(1155,495)" stroke="#6c757d" stroke-width="3">
        <rect x="-110" y="-110" width="210" height="175" rx="10" fill="rgba(255,255,255,0.35)" stroke="#f8f9fa" stroke-width="10"/>
        ${[-70, -35, 0, 35, 70].map((gx) => `<line x1="${gx}" y1="-105" x2="${gx}" y2="60" opacity="0.45"/>`).join("")}
        ${[-70, -35, 0, 35].map((gy) => `<line x1="-105" y1="${gy}" x2="95" y2="${gy}" opacity="0.45"/>`).join("")}
      </g>
      ${ch("omar", 355, 690, 395, { anim: "hop" })}
      ${ch("adam", 665, 715, 395, { anim: "hop", delay: "0.25s" })}
      <!-- flying soccer ball with motion trails -->
      <path d="M770,585 Q880,465 995,435" fill="none" stroke="#fffdf6" stroke-width="7" stroke-dasharray="14 12" stroke-linecap="round"/>
      <g class="sc-float">${soccerBall(1005, 425, 42)}</g>
      ${star(865, 365, 22, "#ffd154")} ${star(925, 500, 16, "#ff9f43", "0.3s")}
    `,

    ballchalk: () => `
      ${bgPlayground(true)}
      <!-- smudged chalk drawing on foreground pavement -->
      <g transform="translate(720,635)">
        <ellipse cx="0" cy="0" rx="225" ry="82" fill="#f7c8d6" opacity="0.55"/>
        <ellipse cx="40" cy="12" rx="165" ry="52" fill="#ffd98a" opacity="0.5"/>
        <ellipse cx="-55" cy="-10" rx="120" ry="38" fill="#a8dff5" opacity="0.55"/>
        <!-- chalk smudge streaks -->
        <path d="M-110,-20 L95,25 M-90,15 L120,-15" stroke="#cfc4b4" stroke-width="24" stroke-linecap="round" opacity="0.7"/>
        ${soccerBall(40, -15, 42)}
      </g>
      <!-- Adam surprised in back -->
      ${ch("adam", 315, 585, 305)}
      <text x="395" y="345" font-size="64" font-weight="900" fill="#ef5d60" stroke="#fff" stroke-width="3">!</text>
      <!-- Lina sad by her drawing -->
      ${ch("lina", 995, 685, 370)}
      <ellipse cx="968" cy="462" rx="7" ry="12" fill="#58b8e5" class="sc-float"/>
      <ellipse cx="1020" cy="468" rx="7" ry="12" fill="#58b8e5" class="sc-float" style="animation-delay:.3s"/>
    `,

    rainbowdragon: () => `
      ${bgPlayground(true)}
      <!-- GIANT RAINBOW CHALK DRAGON on pavement! -->
      <g transform="translate(688,630)">
        <path d="M-360,25 Q-240,-95 -90,-25 Q60,45 210,-50 Q280,-85 335,-35" fill="none" stroke="#ff6b6b" stroke-width="24" stroke-linecap="round"/>
        <path d="M-355,42 Q-235,-76 -85,-8 Q65,62 215,-33 Q282,-68 335,-18" fill="none" stroke="#ffd166" stroke-width="22" stroke-linecap="round"/>
        <path d="M-350,58 Q-230,-58 -80,10 Q70,80 220,-15 Q285,-50 335,0" fill="none" stroke="#7ec96e" stroke-width="22" stroke-linecap="round"/>
        <path d="M-345,74 Q-225,-40 -75,28 Q75,98 225,3 Q288,-32 335,18" fill="none" stroke="#58b8e5" stroke-width="22" stroke-linecap="round"/>
        <path d="M-340,90 Q-220,-22 -70,46 Q80,116 230,21 Q290,-14 335,34" fill="none" stroke="#b388eb" stroke-width="20" stroke-linecap="round"/>
        <!-- friendly dragon head -->
        <circle cx="345" cy="-12" r="46" fill="#7ec96e" stroke="#fff" stroke-width="5"/>
        <circle cx="358" cy="-22" r="7" fill="#3c3129"/>
        <path d="M335,4 Q358,18 378,2" fill="none" stroke="#3c3129" stroke-width="4" stroke-linecap="round"/>
        <!-- chalk soccer ball next to dragon -->
        <g opacity="0.85">${soccerBall(435, 35, 32)}</g>
      </g>
      ${ch("adam", 375, 585, 345, { anim: "hop" })}
      ${ch("lina", 685, 575, 345, { anim: "hop", delay: "0.2s" })}
      ${ch("omar", 995, 585, 365, { anim: "hop", delay: "0.4s" })}
      ${star(520, 250, 22, "#ffd154")} ${star(855, 240, 20, "#ff9f43", "0.3s")}
    `,

    apology: () => `
      ${bgPlayground(false)}
      ${ch("omar", 335, 695, 395)}
      ${ch("adam", 585, 705, 395)}
      ${ch("lina", 895, 705, 390)}
      ${heart(740, 345, 1.55, "#ff6b8b")}
      ${star(660, 285, 18, "#ffd154")} ${star(820, 295, 18, "#ffd154", "0.4s")}
    `,

    chalkcity: () => `
      ${bgPlayground(true)}
      <!-- Chalk City drawn across the ground -->
      <g transform="translate(688,635)" stroke="#fffdf8" stroke-width="5" stroke-linejoin="round">
        <rect x="-360" y="-25" width="110" height="95" fill="#f7a8b8" opacity="0.85"/>
        <polygon points="-375,-25 -305,-85 -235,-25" fill="#ffd166" opacity="0.9"/>
        <rect x="-210" y="-45" width="95" height="115" fill="#a8dff5" opacity="0.85"/>
        <polygon points="-222,-45 -162,-95 -103,-45" fill="#ff9b54" opacity="0.9"/>
        <!-- chalk sun -->
        <circle cx="0" cy="-65" r="36" fill="#ffd166" opacity="0.9"/>
        <!-- chalk rocket -->
        <path d="M125,55 L125,-35 Q150,-88 175,-35 L175,55 Z" fill="#b388eb" opacity="0.9"/>
        <!-- chalk dinosaur -->
        <ellipse cx="305" cy="25" rx="60" ry="34" fill="#82cc6c" opacity="0.9"/>
        <circle cx="355" cy="-15" r="24" fill="#82cc6c" opacity="0.9"/>
      </g>
      ${ch("adam", 475, 585, 355)}
      ${ch("lina", 895, 585, 355)}
      ${star(688, 250, 22, "#ffd154")}
    `,

    lastchalk: () => `
      ${bgPlayground(true)}
      ${ch("adam", 440, 695, 410)}
      ${ch("lina", 936, 695, 405)}
      <!-- ONE glowing blue chalk piece in the center -->
      <g transform="translate(688,585)" filter="url(#softShadow)">
        <circle r="92" fill="#fff7c2" opacity="0.75"/>
        <rect x="-56" y="-18" width="112" height="36" rx="12" fill="#4fa3e0" stroke="#285f8a" stroke-width="5" transform="rotate(-14)"/>
        <rect x="-32" y="-10" width="60" height="8" rx="4" fill="#a8ddff" opacity="0.7" transform="rotate(-14)"/>
      </g>
      ${star(625, 475, 18, "#ffd154")} ${star(755, 480, 18, "#ffd154", "0.35s")}
    `,

    sharechalk: () => `
      ${bgPlayground(true)}
      <!-- beautiful chalk sky & sea waves -->
      <path d="M210,645 Q380,585 550,645 Q720,705 890,645 Q1060,585 1210,645 L1210,745 L210,745 Z" fill="#8ed3f4" opacity="0.7"/>
      ${ch("adam", 455, 670, 390, { anim: "hop" })}
      ${ch("lina", 915, 670, 385, { anim: "hop", delay: "0.25s" })}
      <!-- two happy halves of the blue chalk -->
      <g transform="translate(688,430)" filter="url(#softShadow)">
        <rect x="-92" y="-16" width="64" height="32" rx="10" fill="#4fa3e0" stroke="#285f8a" stroke-width="4" transform="rotate(-18 -60 0)"/>
        <rect x="28" y="-16" width="64" height="32" rx="10" fill="#4fa3e0" stroke="#285f8a" stroke-width="4" transform="rotate(18 60 0)"/>
        ${heart(0, -78, 1.1, "#ff6b8b")}
      </g>
    `,

    grabchalk: () => `
      ${bgPlayground(true)}
      <!-- Lina sad in the distance -->
      ${ch("lina", 315, 595, 295)}
      <!-- Adam alone in front with little gloomy cloud -->
      ${ch("adam", 910, 710, 400)}
      <g transform="translate(910,210)" fill="#b9c6d4" stroke="#6c7a89" stroke-width="4">
        <path d="M-75,18 C-75,-12 -45,-26 -20,-18 C-6,-42 36,-40 48,-14 C75,-18 92,4 82,26 L-55,26 C-70,26 -75,24 -75,18 Z"/>
      </g>
      <rect x="755" y="540" width="68" height="22" rx="8" fill="#4fa3e0" stroke="#285f8a" stroke-width="4" transform="rotate(-15 789 551)"/>
    `,

    bench: () => `
      ${bgPlayground(false)}
      ${bench(688, 565)}
      ${ch("adam", 565, 695, 375, { noShadow: true })}
      ${ch("sami", 815, 695, 365, { noShadow: true })}
      <!-- big delicious chocolate-chip cookie being offered! -->
      <g transform="translate(690,515)" filter="url(#softShadow)" class="sc-float">
        <circle r="44" fill="#d99a52" stroke="#7a4c1d" stroke-width="4.5"/>
        <circle cx="-15" cy="-12" r="7" fill="#4a2c12"/><circle cx="14" cy="-16" r="6" fill="#4a2c12"/>
        <circle cx="4" cy="6" r="7" fill="#4a2c12"/><circle cx="-18" cy="14" r="6" fill="#4a2c12"/>
        <circle cx="20" cy="14" r="6" fill="#4a2c12"/>
      </g>
      ${star(635, 435, 16, "#ffd154")} ${star(748, 430, 18, "#ffd154", "0.3s")}
    `,

    stars: () => `
      ${bgPlayground(false)}
      ${bench(688, 605)}
      ${ch("adam", 565, 725, 355, { noShadow: true })}
      ${ch("sami", 815, 725, 345, { noShadow: true })}
      <!-- dreamy space imagination cloud! -->
      ${thoughtBubble(688, 215, 315, 145, 755, 385, `
        <ellipse cx="688" cy="215" rx="285" ry="120" fill="#1d2b57"/>
        <ellipse cx="785" cy="215" rx="92" ry="24" fill="none" stroke="#ffd166" stroke-width="11" transform="rotate(-16 785 215)"/>
        <circle cx="785" cy="215" r="46" fill="#f4a261" stroke="#fff0c9" stroke-width="3"/>
        <path d="M700,238 Q785,260 870,192" fill="none" stroke="#ffd166" stroke-width="10"/>
        <circle cx="565" cy="195" r="44" fill="#58b8e5" stroke="#c8ecff" stroke-width="3"/>
        <path d="M540,185 Q565,165 588,195 Q570,215 545,210 Z" fill="#7ec96e"/>
        <path d="M675,145 A32,32 0 1,0 705,195 A24,24 0 1,1 675,145 Z" fill="#fff29c"/>
        ${star(475, 170, 14, "#fff29c")} ${star(635, 275, 16, "#ffd154", "0.2s")} ${star(905, 170, 15, "#fff29c", "0.5s")} ${star(885, 265, 12, "#ffd154", "0.8s")}
      `)}
    `,

    spill: () => `
      ${bgCafeteria()}
      ${ch("adam", 435, 625, 405, { noShadow: true })}
      ${ch("sami", 915, 620, 395, { noShadow: true })}
      <!-- cafeteria table -->
      <rect x="140" y="485" width="1096" height="285" rx="20" fill="#e6be8a" stroke="#855a2e" stroke-width="6"/>
      <!-- spilled orange juice puddle & tipped juice box -->
      <ellipse cx="785" cy="605" rx="145" ry="44" fill="#ff9f43" opacity="0.85" stroke="#c96b16" stroke-width="3"/>
      <ellipse cx="695" cy="635" rx="52" ry="18" fill="#ff9f43" opacity="0.85"/>
      <g transform="translate(885,565) rotate(-72)">
        <rect x="-26" y="-42" width="52" height="84" rx="8" fill="#ff8a3d" stroke="#7a3e14" stroke-width="4"/>
        <line x1="0" y1="-42" x2="18" y2="-68" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
      </g>
      <!-- Sami's teardrops -->
      <ellipse cx="890" cy="365" rx="7" ry="12" fill="#58b8e5" class="sc-float"/>
      <ellipse cx="942" cy="370" rx="7" ry="12" fill="#58b8e5" class="sc-float" style="animation-delay:.3s"/>
    `,

    sharefood: () => `
      ${bgCafeteria()}
      ${ch("lina", 290, 610, 365, { noShadow: true })}
      ${ch("adam", 545, 615, 380, { noShadow: true })}
      ${ch("sami", 830, 615, 370, { noShadow: true })}
      ${ch("omar", 1090, 615, 390, { noShadow: true })}
      <rect x="130" y="495" width="1116" height="275" rx="20" fill="#e6be8a" stroke="#855a2e" stroke-width="6"/>
      <!-- Shared feast: cheese sandwich halves, purple grapes, shiny red apple! -->
      <g transform="translate(688,605)">
        <!-- sandwich -->
        <polygon points="-130,30 -40,-45 15,30" fill="#f5d59a" stroke="#8a5f2a" stroke-width="4" stroke-linejoin="round"/>
        <polygon points="-118,22 -42,-34 2,22" fill="#ffd154"/>
        <!-- purple grapes -->
        <g transform="translate(-225,5)" fill="#8e5cc4" stroke="#532d7d" stroke-width="3">
          <circle cx="0" cy="-16" r="16"/><circle cx="-18" cy="4" r="16"/><circle cx="18" cy="4" r="16"/>
          <circle cx="-10" cy="24" r="16"/><circle cx="10" cy="24" r="16"/><circle cx="0" cy="42" r="15"/>
        </g>
        <!-- shiny red apple -->
        <g transform="translate(185,12)">
          <circle r="38" fill="#e84a4a" stroke="#7d2222" stroke-width="4"/>
          <path d="M0,-38 Q12,-58 28,-48" fill="none" stroke="#538a41" stroke-width="6" stroke-linecap="round"/>
          <ellipse cx="-14" cy="-12" rx="7" ry="12" fill="#fff" opacity="0.4" transform="rotate(-20 -14 -12)"/>
        </g>
      </g>
      ${heart(688, 225, 1.35, "#ff6b8b")}
      ${heart(420, 260, 0.9, "#ff9f43", "0.4s")}
      ${heart(960, 250, 0.9, "#7ec96e", "0.7s")}
    `,

    giggle: () => `
      ${bgCafeteria()}
      ${ch("adam", 445, 625, 405, { noShadow: true })}
      ${ch("sami", 940, 625, 390, { noShadow: true })}
      <rect x="140" y="490" width="1096" height="280" rx="20" fill="#e6be8a" stroke="#855a2e" stroke-width="6"/>
      <ellipse cx="890" cy="610" rx="120" ry="36" fill="#ff9f43" opacity="0.82"/>
      <!-- Adam's empathy thought bubble -->
      ${thoughtBubble(688, 210, 145, 92, 560, 325, `
        ${heart(688, 178, 1.35, "#ff6b8b")}
      `)}
      <ellipse cx="916" cy="368" rx="8" ry="13" fill="#58b8e5" class="sc-float"/>
    `,

    fairnews: () => `
      ${bgClassroom()}
      <!-- Colorful School Fair poster on chalkboard -->
      <g transform="translate(460,210)" filter="url(#softShadow)">
        <rect x="-155" y="-110" width="310" height="220" rx="14" fill="#fffdf6" stroke="#ff8a3d" stroke-width="7"/>
        <!-- ferris wheel -->
        <circle cx="0" cy="10" r="66" fill="none" stroke="#58b8e5" stroke-width="5"/>
        <line x1="-66" y1="10" x2="66" y2="10" stroke="#58b8e5" stroke-width="3"/>
        <line x1="0" y1="-56" x2="0" y2="76" stroke="#58b8e5" stroke-width="3"/>
        <line x1="-46" y1="-36" x2="46" y2="56" stroke="#58b8e5" stroke-width="3"/>
        <line x1="46" y1="-36" x2="-46" y2="56" stroke="#58b8e5" stroke-width="3"/>
        <polygon points="-45,92 0,10 45,92" fill="none" stroke="#85582e" stroke-width="5"/>
        ${star(-105, -62, 18, "#ffd154")} ${star(105, -62, 18, "#ef5d8f", "0.3s")}
      </g>
      ${ch("huda", 215, 690, 445)}
      ${ch("adam", 585, 705, 345, { anim: "hop" })}
      ${ch("lina", 795, 705, 340, { anim: "hop", delay: "0.15s" })}
      ${ch("omar", 1005, 705, 365, { anim: "hop", delay: "0.3s" })}
      ${ch("sami", 1200, 705, 330, { anim: "hop", delay: "0.45s" })}
    `,

    argue: () => `
      ${bgClassroom()}
      <!-- Three competing idea bubbles -->
      ${thoughtBubble(260, 175, 130, 95, 300, 320, `
        <!-- soccer robot -->
        <rect x="225" y="130" width="70" height="54" rx="10" fill="#c7d1dc" stroke="#4a5560" stroke-width="4"/>
        <circle cx="245" cy="152" r="6" fill="#3c3129"/><circle cx="275" cy="152" r="6" fill="#3c3129"/>
        ${soccerBall(260, 212, 22)}
      `)}
      ${thoughtBubble(688, 165, 135, 98, 688, 310, `
        <!-- painted castle -->
        <rect x="635" y="145" width="106" height="72" fill="#f7c8d6" stroke="#8c4a63" stroke-width="4"/>
        <polygon points="622,145 650,95 678,145" fill="#b388eb" stroke="#5b3d85" stroke-width="4"/>
        <polygon points="698,145 726,95 754,145" fill="#b388eb" stroke="#5b3d85" stroke-width="4"/>
        <path d="M670,217 L670,182 A18,18 0 0,1 706,182 L706,217 Z" fill="#ffd166" stroke="#8c4a63" stroke-width="3.5"/>
      `)}
      ${thoughtBubble(1115, 175, 130, 95, 1080, 320, `
        <!-- rocket ship -->
        <path d="M1088,215 L1088,155 Q1115,100 1142,155 L1142,215 Z" fill="#58b8e5" stroke="#2c5d78" stroke-width="4"/>
        <circle cx="1115" cy="165" r="14" fill="#fff7b2" stroke="#2c5d78" stroke-width="3"/>
        <polygon points="1088,195 1066,225 1088,215" fill="#ef5d60"/>
        <polygon points="1142,195 1164,225 1142,215" fill="#ef5d60"/>
      `)}
      ${ch("omar", 275, 725, 375)}
      ${ch("adam", 545, 725, 360)}
      ${ch("lina", 820, 725, 355)}
      ${ch("sami", 1095, 725, 345)}
    `,

    voting: () => `
      ${bgClassroom()}
      ${ch("adam", 285, 650, 375, { noShadow: true })}
      ${ch("lina", 535, 645, 365, { noShadow: true })}
      ${ch("sami", 845, 645, 355, { noShadow: true })}
      ${ch("omar", 1095, 650, 385, { noShadow: true })}
      <rect x="175" y="515" width="1026" height="255" rx="18" fill="#dfb078" stroke="#7a512b" stroke-width="6"/>
      <!-- Cute shoebox ballot box with folded papers -->
      <g transform="translate(688,585)" filter="url(#softShadow)">
        <rect x="-115" y="-55" width="230" height="145" rx="12" fill="#58b8e5" stroke="#2c5d78" stroke-width="5"/>
        <rect x="-126" y="-72" width="252" height="30" rx="8" fill="#77cbf2" stroke="#2c5d78" stroke-width="5"/>
        <rect x="-46" y="-62" width="92" height="10" rx="5" fill="#2c5d78"/>
        <rect x="-26" y="-118" width="52" height="62" rx="4" fill="#fffdf6" stroke="#856a52" stroke-width="3.5" class="sc-float"/>
        ${star(0, 22, 26, "#ffd154")}
      </g>
    `,

    bossy: () => `
      ${bgClassroom()}
      ${ch("lina", 250, 680, 325)}
      ${ch("sami", 465, 680, 315)}
      ${ch("omar", 1110, 685, 345)}
      ${ch("adam", 785, 720, 415)}
      <!-- grumpy cloud above Adam -->
      <g transform="translate(785,180)" fill="#9daab8" stroke="#535c66" stroke-width="4">
        <path d="M-85,20 C-85,-14 -50,-30 -22,-20 C-6,-48 42,-46 56,-16 C86,-22 104,4 94,28 L-65,28 C-80,28 -85,26 -85,20 Z"/>
        <polygon points="-10,28 12,28 -2,54 16,54 -14,88 -4,56 -22,56" fill="#ffd154" stroke="#8a6220" stroke-width="2.5"/>
      </g>
    `,

    fair: () => `
      ${bgFair()}
      ${rocketCastle(688, 520, 1.05, "intact")}
      ${ch("adam", 295, 720, 355, { anim: "hop" })}
      ${ch("lina", 465, 720, 350, { anim: "hop", delay: "0.2s" })}
      ${ch("omar", 925, 720, 375, { anim: "hop", delay: "0.4s" })}
      ${ch("sami", 1100, 720, 345, { anim: "hop", delay: "0.6s" })}
      ${star(520, 200, 22, "#ffd154")} ${star(865, 195, 22, "#ffd154", "0.4s")}
    `,

    broken: () => `
      ${bgFair()}
      ${rocketCastle(688, 520, 1.02, "broken")}
      ${ch("adam", 255, 715, 350)}
      ${ch("lina", 435, 715, 345)}
      ${ch("omar", 1125, 715, 370)}
      ${ch("sami", 935, 720, 340)}
      <!-- comic shock sparks around broken nose cone -->
      ${star(805, 575, 22, "#ff8a3d")} ${star(905, 625, 18, "#ffd154", "0.25s")}
      <ellipse cx="912" cy="485" rx="7" ry="12" fill="#58b8e5" class="sc-float"/>
    `,

    fixing: () => `
      ${bgFair()}
      ${rocketCastle(688, 525, 1.05, "fixed")}
      ${ch("omar", 430, 715, 370, { anim: "hop" })}
      ${ch("adam", 550, 725, 350, { anim: "hop", delay: "0.15s" })}
      ${ch("lina", 845, 725, 345, { anim: "hop", delay: "0.3s" })}
      ${ch("sami", 1015, 715, 340, { anim: "hop", delay: "0.45s" })}
      ${star(565, 205, 24, "#ffd154")} ${star(815, 210, 24, "#ffd154", "0.3s")} ${heart(688, 125, 1.15, "#ff6b8b")}
    `,

    samicry: () => `
      <rect width="1376" height="768" fill="#f2e4cf"/>
      <rect y="545" width="1376" height="223" fill="url(#floorWood)"/>
      <!-- tall soft stage curtain on the right -->
      <g fill="#b84a5a" stroke="#6e2531" stroke-width="5">
        <path d="M980,0 L1376,0 L1376,650 Q1290,670 1215,650 Q1135,670 1055,650 Q1010,665 980,650 Z"/>
        <line x1="1065" y1="0" x2="1055" y2="650" stroke="#852d3b" stroke-width="6"/>
        <line x1="1150" y1="0" x2="1140" y2="650" stroke="#852d3b" stroke-width="6"/>
        <line x1="1235" y1="0" x2="1225" y2="650" stroke="#852d3b" stroke-width="6"/>
        <line x1="1315" y1="0" x2="1305" y2="650" stroke="#852d3b" stroke-width="6"/>
      </g>
      ${ch("adam", 560, 715, 400)}
      ${ch("sami", 915, 715, 380)}
      <ellipse cx="892" cy="458" rx="7" ry="12" fill="#58b8e5" class="sc-float"/>
      ${heart(740, 355, 1.45, "#ff6b8b")}
    `,

    judges: () => `
      ${bgFair()}
      ${rocketCastle(688, 525, 0.98, "fixed")}
      <!-- four friends holding hands on the left -->
      ${ch("adam", 175, 725, 330)}
      ${ch("lina", 315, 725, 325)}
      ${ch("omar", 455, 725, 345)}
      ${ch("sami", 570, 725, 315)}
      <!-- two friendly illustrated judges with clipboards on the right -->
      <g transform="translate(1015,525)">
        <ellipse cx="0" cy="195" rx="68" ry="14" fill="rgba(85,55,25,0.2)"/>
        <rect x="-46" y="10" width="92" height="175" rx="22" fill="#5a7d9a" stroke="#344a5c" stroke-width="4.5"/>
        <circle cx="0" cy="-48" r="46" fill="#f0c39d" stroke="#7a512b" stroke-width="4.5"/>
        <path d="M-44,-60 Q0,-105 44,-60 Q48,-85 0,-96 Q-48,-85 -44,-60 Z" fill="#5e412e"/>
        <path d="M-32,-22 Q0,14 32,-22 Q20,-4 0,-4 Q-20,-4 -32,-22 Z" fill="#5e412e"/>
        <circle cx="-15" cy="-54" r="5" fill="#2d2016"/><circle cx="15" cy="-54" r="5" fill="#2d2016"/>
        <path d="M-10,-32 Q0,-23 10,-32" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>
        <!-- clipboard -->
        <rect x="-78" y="32" width="66" height="86" rx="8" fill="#c78e54" stroke="#6b4528" stroke-width="4"/>
        <rect x="-70" y="44" width="50" height="64" rx="4" fill="#fffdf6"/>
      </g>
      <g transform="translate(1195,530)">
        <ellipse cx="0" cy="190" rx="66" ry="14" fill="rgba(85,55,25,0.2)"/>
        <rect x="-44" y="14" width="88" height="170" rx="22" fill="#9c72b8" stroke="#533769" stroke-width="4.5"/>
        <circle cx="0" cy="-44" r="44" fill="#f7cfb0" stroke="#7a512b" stroke-width="4.5"/>
        <path d="M-44,-45 Q-46,-98 0,-96 Q46,-98 44,-45 Q24,-70 0,-70 Q-24,-70 -44,-45 Z" fill="#7c4a2d"/>
        <circle cx="-16" cy="-46" r="12" fill="none" stroke="#3c3129" stroke-width="3.5"/>
        <circle cx="16" cy="-46" r="12" fill="none" stroke="#3c3129" stroke-width="3.5"/>
        <line x1="-4" y1="-46" x2="4" y2="-46" stroke="#3c3129" stroke-width="3"/>
        <circle cx="-16" cy="-46" r="4" fill="#2d2016"/><circle cx="16" cy="-46" r="4" fill="#2d2016"/>
        <path d="M-12,-24 Q0,-14 12,-24" fill="none" stroke="#7a3e2e" stroke-width="3.5" stroke-linecap="round"/>
      </g>
    `,

    best: () => `
      ${bgFair()}
      <!-- Stage floor -->
      <rect x="85" y="575" width="1206" height="195" rx="16" fill="#d99f62" stroke="#7a4c1d" stroke-width="6"/>
      ${ch("huda", 190, 695, 420)}
      ${ch("adam", 445, 710, 355, { anim: "hop" })}
      ${ch("lina", 625, 710, 350, { anim: "hop", delay: "0.15s" })}
      ${ch("omar", 990, 710, 375, { anim: "hop", delay: "0.3s" })}
      ${ch("sami", 1175, 710, 345, { anim: "hop", delay: "0.45s" })}
      <!-- Giant golden star trophy! -->
      <g transform="translate(808,430)" filter="url(#softShadow)" class="sc-float">
        <path d="M-65,-85 L65,-85 Q58,35 0,48 Q-58,35 -65,-85 Z" fill="#ffd154" stroke="#8a6220" stroke-width="6"/>
        <path d="M-65,-65 C-108,-65 -108,8 -54,8" fill="none" stroke="#ffd154" stroke-width="14"/>
        <path d="M65,-65 C108,-65 108,8 54,8" fill="none" stroke="#ffd154" stroke-width="14"/>
        <rect x="-18" y="45" width="36" height="58" fill="#e8b235" stroke="#8a6220" stroke-width="5"/>
        <rect x="-64" y="98" width="128" height="32" rx="8" fill="#8f5d34" stroke="#523117" stroke-width="5"/>
        ${star(0, -32, 30, "#fff5b8")}
      </g>
      ${star(335, 195, 22, "#ffd154")} ${star(585, 165, 20, "#ff6b8b", "0.2s")} ${star(1025, 175, 22, "#58b8e5", "0.4s")} ${star(810, 145, 26, "#ffd154", "0.6s")}
    `,

    good: () => `
      ${bgFair()}
      ${ch("adam", 310, 715, 365, { anim: "hop" })}
      ${ch("lina", 510, 715, 360, { anim: "hop", delay: "0.15s" })}
      ${ch("omar", 870, 715, 385, { anim: "hop", delay: "0.3s" })}
      ${ch("sami", 1075, 715, 355, { anim: "hop", delay: "0.45s" })}
      <!-- Big shiny Blue Ribbon Rosette! -->
      <g transform="translate(690,340)" filter="url(#softShadow)" class="sc-float">
        <polygon points="-42,52 -68,195 -20,165 8,195 2,52" fill="#3a7bd5" stroke="#1e467d" stroke-width="5" stroke-linejoin="round"/>
        <polygon points="42,52 68,195 20,165 -8,195 -2,52" fill="#4f8ff0" stroke="#1e467d" stroke-width="5" stroke-linejoin="round"/>
        <circle r="86" fill="#4f8ff0" stroke="#1e467d" stroke-width="6"/>
        <circle r="66" fill="#6aa5f8" stroke="#fff8ec" stroke-width="5" stroke-dasharray="10 7"/>
        ${star(0, 0, 42, "#ffd154")}
      </g>
      ${star(420, 210, 22, "#ffd154")} ${star(960, 210, 22, "#ffd154", "0.4s")}
    `,

    okay: () => `
      <rect width="1376" height="768" fill="url(#skySunset)"/>
      <circle cx="688" cy="365" r="220" fill="url(#sunGlow)"/>
      <circle cx="688" cy="365" r="95" fill="#fff2b2" opacity="0.9"/>
      ${cloud(260, 150, 1)} ${cloud(1120, 140, 0.9)}
      <!-- warm yellow school facade behind -->
      <rect x="140" y="180" width="1096" height="320" rx="14" fill="#f7d27c" stroke="#9e6d36" stroke-width="6" opacity="0.82"/>
      <!-- wide stone school steps -->
      <rect x="0" y="485" width="1376" height="82" fill="#ecd8bd" stroke="#b59b79" stroke-width="4"/>
      <rect x="0" y="567" width="1376" height="90" fill="#e2cbb0" stroke="#b59b79" stroke-width="4"/>
      <rect x="0" y="657" width="1376" height="111" fill="#d7bca0" stroke="#b59b79" stroke-width="4"/>
      <!-- four friends sitting/standing happily eating ice cream cones! -->
      ${ch("sami", 320, 685, 345)}
      ${ch("adam", 555, 695, 360)}
      ${ch("lina", 815, 695, 355)}
      ${ch("omar", 1060, 690, 380)}
      <!-- four colorful ice cream cones -->
      ${[[405, 515, "#ff8fa3"], [645, 520, "#7ec96e"], [905, 520, "#ffd166"], [1155, 515, "#8ecae6"]].map(([ix, iy, ic]) => `
        <g transform="translate(${ix},${iy}) rotate(-12)">
          <polygon points="-16,8 16,8 0,58" fill="#e0a96d" stroke="#7a4c1d" stroke-width="3"/>
          <circle cx="0" cy="-2" r="21" fill="${ic}" stroke="#6b4528" stroke-width="3"/>
        </g>`).join("")}
      ${heart(688, 220, 1.35, "#ff6b8b")}
    `
  };

  window.renderSceneSVG = function (name) {
    const fn = BUILDERS[name];
    if (!fn) return null;
    return `<svg class="scene-svg" viewBox="0 0 1376 768" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      ${DEFS}
      ${fn()}
      <rect width="1376" height="768" fill="url(#vignette)" pointer-events="none"/>
    </svg>`;
  };
})();
