/* =====================================================================
   عالم فلفل وتوتا القصصي — خريطة تفاعلية حية تتغير حسب قرارات الطفل
   + مشاهد قصصية مصورة ومتحركة باستخدام شخصيات الألوان المائية
   ===================================================================== */
(() => {
  "use strict";

  const AR = {
    felfel: 266 / 479,
    toota:  204 / 371,
    meemo:  288 / 404,
    boody:  284 / 456
  };

  function ch(name, x, bottomY, h, opts = {}) {
    const w = Math.round(h * AR[name]);
    const y = bottomY - h;
    const flip = opts.flip ? `translate(${x * 2},0) scale(-1,1)` : "";
    const anim = opts.anim || "breathe";
    const delay = opts.delay || "0s";
    const shadow = opts.noShadow ? "" :
      `<ellipse cx="${x}" cy="${bottomY - 6}" rx="${Math.round(w * 0.42)}" ry="12" fill="rgba(75,55,30,0.22)"/>`;
    return `${shadow}<g class="sc-${anim}" style="transform-origin:${x}px ${bottomY}px;animation-delay:${delay}">
      <g transform="${flip}">
        <image href="images/felfel/chars/${name}.png" x="${x - w / 2}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>
      </g>
    </g>`;
  }

  const DEFS = `<defs>
    <linearGradient id="fSkyDay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8fd6f7"/><stop offset="65%" stop-color="#d7f3ff"/><stop offset="100%" stop-color="#fff4db"/>
    </linearGradient>
    <linearGradient id="fSkyRain" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#9cb2c7"/><stop offset="70%" stop-color="#c8d6e3"/><stop offset="100%" stop-color="#e8eff5"/>
    </linearGradient>
    <linearGradient id="fGrass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#a5dc7b"/><stop offset="100%" stop-color="#76bd5a"/>
    </linearGradient>
    <linearGradient id="fRiver" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#73c7ef"/><stop offset="100%" stop-color="#4ea8de"/>
    </linearGradient>
    <linearGradient id="fRoomWarm" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff5df"/><stop offset="100%" stop-color="#f2dab3"/>
    </linearGradient>
    <radialGradient id="fSun" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff6ad"/><stop offset="60%" stop-color="#ffe078" stop-opacity="0.45"/><stop offset="100%" stop-color="#ffe078" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="fVig" cx="50%" cy="50%" r="72%">
      <stop offset="75%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#7d4f22" stop-opacity="0.16"/>
    </radialGradient>
  </defs>`;

  function cloud(x, y, s = 1, dark = false) {
    const fill = dark ? "#b4c3d1" : "#fffdf7";
    const stroke = dark ? "#7c8d9e" : "#d9e9f2";
    return `<g class="sc-drift" transform="translate(${x},${y}) scale(${s})" fill="${fill}" stroke="${stroke}" stroke-width="3">
      <path d="M-70,15 C-70,-12 -45,-25 -22,-18 C-10,-42 28,-42 40,-16 C64,-22 86,-2 80,20 C80,32 68,36 52,36 L-50,36 C-65,36 -70,26 -70,15 Z"/>
    </g>`;
  }

  function tree(x, y, s = 1) {
    return `<g transform="translate(${x},${y}) scale(${s})">
      <path d="M-15,115 L-11,0 L11,0 L16,115 Z" fill="#9a6840" stroke="#664328" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="-46" cy="-16" r="54" fill="#79bf63" stroke="#4f853e" stroke-width="4"/>
      <circle cx="46" cy="-12" r="50" fill="#84c96c" stroke="#4f853e" stroke-width="4"/>
      <circle cx="0" cy="-60" r="64" fill="#97d67b" stroke="#4f853e" stroke-width="4"/>
    </g>`;
  }

  function flower(x, y, col = "#ff7eb6", s = 1) {
    return `<g transform="translate(${x},${y}) scale(${s})">
      <circle cx="0" cy="-11" r="8" fill="${col}"/><circle cx="11" cy="0" r="8" fill="${col}"/>
      <circle cx="0" cy="11" r="8" fill="${col}"/><circle cx="-11" cy="0" r="8" fill="${col}"/>
      <circle cx="0" cy="0" r="6" fill="#ffd154"/>
    </g>`;
  }

  function heart(x, y, s = 1, col = "#ff6b8b", delay = "0s") {
    return `<g class="sc-float" style="animation-delay:${delay}" transform="translate(${x},${y}) scale(${s})">
      <path d="M0,14 C-22,-6 -36,16 -20,34 L0,52 L20,34 C36,16 22,-6 0,14 Z" fill="${col}" stroke="#7a323e" stroke-width="3"/>
    </g>`;
  }

  function star(x, y, r = 18, col = "#ffd154", delay = "0s") {
    let pts = [];
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      const rad = i % 2 === 0 ? r : r * 0.45;
      pts.push(`${(Math.cos(a) * rad).toFixed(1)},${(Math.sin(a) * rad).toFixed(1)}`);
    }
    return `<polygon class="sc-twinkle" style="transform-origin:${x}px ${y}px;animation-delay:${delay}" points="${pts.join(" ")}" transform="translate(${x},${y})" fill="${col}" stroke="#8a6220" stroke-width="2.5"/>`;
  }

  function rainbow(cx, cy, r = 240) {
    const cols = ["#ff6b6b", "#ffa94d", "#ffd43b", "#69db7c", "#4dabf7", "#b197fc"];
    return `<g opacity="0.72">${cols.map((c, i) => `<path d="M${cx - (r - i * 14)},${cy} A${r - i * 14},${r - i * 14} 0 0,1 ${cx + (r - i * 14)},${cy}" fill="none" stroke="${c}" stroke-width="14" stroke-linecap="round"/>`).join("")}</g>`;
  }

  function rain(count = 26) {
    let drops = "";
    for (let i = 0; i < count; i++) {
      const x = 60 + ((i * 53) % 1260), y = 130 + ((i * 89) % 450);
      drops += `<line class="sc-rain" style="animation-delay:${(i % 7) * 0.18}s" x1="${x}" y1="${y}" x2="${x - 10}" y2="${y + 32}" stroke="#6ca6d9" stroke-width="4" stroke-linecap="round" opacity="0.7"/>`;
    }
    return drops;
  }

  // ===================================================================
  //  خريطة العالم القصصي الحية (تتغير بصرياً حسب mood والـ discoveries!)
  // ===================================================================
  window.renderFelfelMapSVG = function (mood = "init", visited = []) {
    const isRain = mood === "rainy" || mood === "sad";
    const isHappy = mood === "happy" || mood === "celebrate";
    const isTalk = mood === "talking";

    // مواضع وتصرف الشخصيات على الخريطة تتغيّر حسب نتيجة القصة!
    let charsOnMap = "";
    if (isHappy) {
      // توتا وفلفل يضحكان ويلعبان معاً في الحديقة + ميمو وبودي يحتفلان في الساحة!
      charsOnMap = `
        ${ch("felfel", 275, 585, 165, { anim: "hop" })}
        ${ch("toota", 385, 590, 130, { anim: "hop", delay: "0.2s" })}
        ${ch("meemo", 995, 295, 130, { anim: "hop", delay: "0.35s" })}
        ${ch("boody", 1135, 300, 155, { anim: "hop", delay: "0.5s" })}
        ${heart(330, 415, 0.9, "#ff6b8b")}
        ${star(688, 255, 22, "#ffd154")} ${star(1065, 125, 20, "#ffd154", "0.3s")}
      `;
    } else if (isTalk) {
      // فلفل وتوتا فوق جسر التفاهم يتحدثان بلطف!
      charsOnMap = `
        ${ch("felfel", 630, 420, 150, { anim: "breathe" })}
        ${ch("toota", 745, 422, 122, { anim: "breathe", delay: "0.25s" })}
        ${ch("meemo", 1015, 295, 125)}
        ${ch("boody", 1135, 300, 150)}
        <g transform="translate(688,255)" class="sc-float">
          <ellipse rx="52" ry="30" fill="#fffdf6" stroke="#6b4b32" stroke-width="3.5"/>
          <circle cx="-18" cy="0" r="6" fill="#ff8a3d"/><circle cx="0" cy="0" r="6" fill="#4f8ff0"/><circle cx="18" cy="0" r="6" fill="#45b86a"/>
        </g>
      `;
    } else {
      // البداية أو الحزن: فلفل عند بيته/الحديقة، توتا حزينة عند بيتها، ميمو وبودي في الساحة
      charsOnMap = `
        ${ch("felfel", 250, 315, 145)}
        ${ch("toota", 1075, 610, 125)}
        ${ch("meemo", 995, 295, 125)}
        ${ch("boody", 1135, 300, 150)}
        ${isRain ? `<g transform="translate(1075,455)" fill="#9eb4c9" stroke="#63788c" stroke-width="3">
          <path d="M-40,10 C-40,-8 -22,-16 -8,-10 C2,-26 24,-24 30,-6 C46,-8 52,8 42,18 L-30,18 Z"/>
        </g>` : ""}
      `;
    }

    return `<svg class="map-svg" viewBox="0 0 1376 768" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      ${DEFS}
      <!-- السماء والأرض الخضراء -->
      <rect width="1376" height="768" fill="${isRain ? "url(#fSkyRain)" : "url(#fSkyDay)"}"/>
      ${!isRain ? `<circle cx="688" cy="95" r="145" fill="url(#fSun)"/><circle cx="688" cy="95" r="52" fill="#ffe27a" stroke="#e0ad42" stroke-width="4"/>` : ""}
      ${isHappy ? rainbow(688, 390, 260) : ""}
      ${cloud(190, 88, 0.9, isRain)} ${cloud(1180, 92, 0.95, isRain)} ${isRain ? cloud(688, 100, 1.15, true) : ""}

      <!-- تلال وحديقة المدينة القصصية -->
      <path d="M0,185 Q340,140 688,185 Q1036,140 1376,180 L1376,768 L0,768 Z" fill="url(#fGrass)"/>
      <!-- النهر الأزرق الهادئ يمر تحت جسر التفاهم -->
      <path d="M580,175 Q640,360 690,460 Q755,585 650,768 L770,768 Q855,585 775,450 Q715,345 675,175 Z" fill="url(#fRiver)" stroke="#3e8ec2" stroke-width="4"/>

      <!-- ممرات ترابية دافئة تربط الأماكن الخمسة -->
      <path d="M310,505 Q470,455 688,395 Q900,335 1065,245" fill="none" stroke="#f2dec0" stroke-width="42" stroke-linecap="round"/>
      <path d="M295,255 Q460,335 688,395 Q900,475 1065,535" fill="none" stroke="#f2dec0" stroke-width="42" stroke-linecap="round"/>
      <path d="M310,505 Q470,455 688,395 Q900,335 1065,245" fill="none" stroke="#d8bc93" stroke-width="4" stroke-dasharray="14 14"/>
      <path d="M295,255 Q460,335 688,395 Q900,475 1065,535" fill="none" stroke="#d8bc93" stroke-width="4" stroke-dasharray="14 14"/>

      <!-- أشجار وزهور محيطة -->
      ${tree(85, 165, 0.85)} ${tree(505, 165, 0.72)} ${tree(1285, 185, 0.88)}
      ${tree(90, 620, 0.9)} ${tree(1290, 635, 0.85)}
      ${flower(185, 585, "#ff7eb6", 1.1)} ${flower(250, 645, "#ffd166", 1.0)} ${flower(425, 625, "#ff8a3d", 1.1)}
      ${flower(470, 560, "#b388eb", 0.95)} ${flower(920, 620, "#ff7eb6", 1.0)} ${flower(1190, 540, "#ffd166", 0.95)}

      <!-- 1. بيت فلفل (أعلى اليسار) -->
      <g transform="translate(275,215)">
        <ellipse cx="0" cy="78" rx="115" ry="26" fill="rgba(75,55,30,0.16)"/>
        <rect x="-78" y="-32" width="156" height="106" rx="18" fill="#fff1d6" stroke="#85582e" stroke-width="5"/>
        <polygon points="-96,-28 0,-105 96,-28" fill="#ff8a5b" stroke="#854528" stroke-width="5" stroke-linejoin="round"/>
        <!-- جزرة زينة لطيفة فوق الباب -->
        <path d="M-24,74 L-24,22 A24,24 0 0,1 24,22 L24,74 Z" fill="#c98544" stroke="#6b4528" stroke-width="4"/>
        <circle cx="-48" cy="18" r="18" fill="#bce6fa" stroke="#85582e" stroke-width="4"/>
        <circle cx="48" cy="18" r="18" fill="#bce6fa" stroke="#85582e" stroke-width="4"/>
      </g>

      <!-- 2. بيت توتا (أسفل اليمين - كوخ على شكل صدفة سلحفاة دافئة!) -->
      <g transform="translate(1075,525)">
        <ellipse cx="0" cy="78" rx="125" ry="28" fill="rgba(75,55,30,0.18)"/>
        <path d="M-98,74 A98,98 0 0,1 98,74 Z" fill="#63b995" stroke="#356e56" stroke-width="5"/>
        <path d="M-65,20 Q0,-25 65,20" fill="none" stroke="#ffd166" stroke-width="6"/>
        <path d="M-32,74 L-32,26 A32,32 0 0,1 32,26 L32,74 Z" fill="#f2c57c" stroke="#7a512b" stroke-width="4.5"/>
        <circle cx="56" cy="34" r="17" fill="#fff3b0" stroke="#356e56" stroke-width="4"/>
      </g>

      <!-- 3. حديقة البداية (أسفل اليسار - بوابة زهور) -->
      <g transform="translate(325,530)">
        <ellipse cx="0" cy="52" rx="145" ry="44" fill="#b7e88e" stroke="#68ad4e" stroke-width="4"/>
        <path d="M-95,38 A95,95 0 0,1 95,38" fill="none" stroke="#8f5d34" stroke-width="10" stroke-linecap="round"/>
        ${flower(-88, -10, "#ff7eb6", 1.1)} ${flower(-45, -45, "#ffd166", 1.1)} ${flower(0, -56, "#ff8a3d", 1.15)} ${flower(45, -45, "#b388eb", 1.1)} ${flower(88, -10, "#ff7eb6", 1.1)}
      </g>

      <!-- 4. جسر التفاهم (المنتصف فوق النهر) -->
      <g transform="translate(688,395)">
        <path d="M-112,26 Q0,-26 112,26 L112,56 Q0,6 -112,56 Z" fill="#d99f62" stroke="#7a4c1d" stroke-width="5" stroke-linejoin="round"/>
        <path d="M-108,8 Q0,-44 108,8" fill="none" stroke="#8f5d34" stroke-width="7" stroke-linecap="round"/>
        ${[-80, -40, 0, 40, 80].map((px) => `<line x1="${px}" y1="${-16 + Math.abs(px) * 0.2}" x2="${px}" y2="${18 + Math.abs(px) * 0.16}" stroke="#7a4c1d" stroke-width="5"/>`).join("")}
      </g>

      <!-- 5. ساحة الأصدقاء (أعلى اليمين - شجرة عملاقة وأعلام ملونة!) -->
      <g transform="translate(1065,215)">
        <ellipse cx="0" cy="64" rx="155" ry="44" fill="#f7e3c2" stroke="#c9a573" stroke-width="4"/>
        ${tree(0, -40, 1.05)}
        <path d="M-135,-25 Q0,18 135,-25" fill="none" stroke="#6b4528" stroke-width="3.5"/>
        <polygon points="-95,-14 -68,-8 -82,16" fill="#ff6b6b" stroke="#6b4528" stroke-width="2"/>
        <polygon points="-45,-4 -18,0 -32,24" fill="#ffd166" stroke="#6b4528" stroke-width="2"/>
        <polygon points="15,0 42,-4 28,24" fill="#4dabf7" stroke="#6b4528" stroke-width="2"/>
        <polygon points="68,-8 95,-14 82,16" fill="#b197fc" stroke="#6b4528" stroke-width="2"/>
      </g>

      <!-- 6. ملعب الألعاب العادلة (أسفل المنتصف - خيمة ألعاب ملوّنة وصندوق كنز!) -->
      <g transform="translate(688,635)">
        <ellipse cx="0" cy="48" rx="155" ry="38" fill="#ffeec9" stroke="#d4b175" stroke-width="4"/>
        <polygon points="-76,34 0,-56 76,34" fill="#ff758f" stroke="#7a2c3b" stroke-width="4.5" stroke-linejoin="round"/>
        <polygon points="-32,34 0,-56 32,34" fill="#fffdf6" stroke="#7a2c3b" stroke-width="3.5"/>
        <line x1="0" y1="-56" x2="0" y2="-82" stroke="#7a2c3b" stroke-width="4"/>
        <polygon points="0,-82 32,-70 0,-58" fill="#ffd154" stroke="#8a6220" stroke-width="2.5"/>
        <!-- صندوق كنز صغير لامع -->
        <rect x="64" y="14" width="44" height="30" rx="5" fill="#c98544" stroke="#6b4528" stroke-width="3.5"/>
        <rect x="64" y="24" width="44" height="6" fill="#ffd154"/>
      </g>

      <!-- الشخصيات الحية على الخريطة -->
      ${charsOnMap}
      ${isRain ? rain(22) : ""}
      <rect width="1376" height="768" fill="url(#fVig)" pointer-events="none"/>
    </svg>`;
  };

  // ===================================================================
  //  مشاهد مصورة ومتحركة لكل مسار فرعي ونهاية (للمشاهد بدون .jpg)
  // ===================================================================
  function bgGarden(rainy = false) {
    return `
      <rect width="1376" height="768" fill="${rainy ? "url(#fSkyRain)" : "url(#fSkyDay)"}"/>
      ${!rainy ? `<circle cx="1150" cy="115" r="135" fill="url(#fSun)"/><circle cx="1150" cy="115" r="52" fill="#ffe27a" stroke="#e0ad42" stroke-width="4"/>` : ""}
      ${cloud(220, 115, 1, rainy)} ${cloud(720, 95, 0.9, rainy)}
      <path d="M0,445 Q400,385 780,435 Q1120,385 1376,430 L1376,768 L0,768 Z" fill="url(#fGrass)"/>
      ${tree(145, 345, 1.1)} ${tree(1235, 340, 1.15)}
      ${flower(255, 650, "#ff7eb6", 1.2)} ${flower(425, 685, "#ffd166", 1.1)} ${flower(960, 670, "#b388eb", 1.15)} ${flower(1145, 645, "#ff8a3d", 1.2)}
      ${rainy ? rain(28) : ""}
    `;
  }

  function bgCozyRoom(tint = "#fff4dc") {
    return `
      <rect width="1376" height="768" fill="${tint}"/>
      <rect y="535" width="1376" height="233" fill="#e2be8d"/>
      <line x1="0" y1="535" x2="1376" y2="535" stroke="#b38450" stroke-width="5"/>
      <ellipse cx="688" cy="655" rx="340" ry="62" fill="#f7c89b" stroke="#c98544" stroke-width="5"/>
      <!-- نافذة دائرية دافئة -->
      <circle cx="688" cy="235" r="128" fill="url(#fSkyDay)" stroke="#b37b46" stroke-width="12"/>
      <line x1="688" y1="107" x2="688" y2="363" stroke="#b37b46" stroke-width="8"/>
      <line x1="560" y1="235" x2="816" y2="235" stroke="#b37b46" stroke-width="8"/>
    `;
  }

  function bgPlaza(party = false) {
    return `
      <rect width="1376" height="768" fill="url(#fSkyDay)"/>
      <circle cx="1170" cy="115" r="140" fill="url(#fSun)"/><circle cx="1170" cy="115" r="54" fill="#ffe27a" stroke="#e0ad42" stroke-width="4"/>
      ${party ? rainbow(688, 430, 340) : ""}
      ${cloud(240, 110, 1)} ${cloud(760, 95, 0.85)}
      <path d="M0,450 Q688,390 1376,450 L1376,768 L0,768 Z" fill="url(#fGrass)"/>
      <ellipse cx="688" cy="645" rx="540" ry="110" fill="#f5e1be" stroke="#ccb083" stroke-width="5"/>
      ${tree(145, 320, 1.2)} ${tree(1235, 320, 1.2)}
      <!-- أعلام ملونة -->
      <g class="sc-sway">
        <path d="M120,165 Q688,245 1256,165" fill="none" stroke="#6b4528" stroke-width="4"/>
        ${["#ff6b6b", "#ffd166", "#4dabf7", "#69db7c", "#b197fc", "#ff922b", "#ff6b6b", "#ffd166", "#4dabf7", "#69db7c"].map((c, i) => {
          const x = 185 + i * 100, dip = Math.sin((i / 9) * Math.PI) * 52;
          return `<polygon points="${x},${172 + dip} ${x + 68},${176 + dip} ${x + 34},${232 + dip}" fill="${c}" stroke="#6b4528" stroke-width="3"/>`;
        }).join("")}
      </g>
    `;
  }

  const SCENE_BUILDERS = {
    garden: () => `${bgGarden(false)}${ch("felfel", 470, 695, 365, { anim: "hop" })}${ch("toota", 930, 695, 300)}<ellipse cx="905" cy="525" rx="7" ry="12" fill="#58b8e5" class="sc-float"/>`,
    talk_direct: () => `${bgGarden(false)}${ch("felfel", 510, 695, 365)}${ch("toota", 880, 695, 300)}${heart(695, 355, 1.2, "#ff8fa3")}`,
    angry_reply: () => `${bgGarden(false)}${ch("felfel", 420, 695, 365)}${ch("toota", 990, 695, 290, { flip: true })}<g transform="translate(420,235)" fill="#ff8a5b" stroke="#7a3225" stroke-width="4"><polygon points="0,-38 14,-8 46,-18 22,12 40,38 4,22 -24,42 -16,10 -46,-10 -12,-14"/></g><ellipse cx="965" cy="525" rx="7" ry="12" fill="#58b8e5" class="sc-float"/>`,
    go_play: () => `${bgGarden(false)}${ch("felfel", 655, 705, 365)}<circle cx="875" cy="645" r="46" fill="#ff6b6b" stroke="#7a2626" stroke-width="5"/><path d="M845,612 Q875,645 845,678 M905,612 Q875,645 905,678" fill="none" stroke="#ffd166" stroke-width="6"/><text x="655" y="290" font-size="68" font-weight="900" fill="#ff8a3d" text-anchor="middle">؟</text>`,
    temp_sad: () => `${bgGarden(true)}${ch("felfel", 390, 695, 340)}${ch("toota", 985, 695, 285)}<ellipse cx="960" cy="530" rx="8" ry="13" fill="#58b8e5" class="sc-float"/>`,
    ask_meemo: () => `${bgGarden(false)}${ch("felfel", 425, 695, 355)}${ch("meemo", 725, 695, 330, { anim: "hop" })}${ch("toota", 1045, 695, 285)}`,
    misunderstanding: () => `${bgGarden(true)}${ch("felfel", 360, 695, 350, { flip: true })}${ch("meemo", 705, 695, 325)}${ch("toota", 1055, 695, 285)}`,
    toota_house: () => `${bgCozyRoom("#edf8f2")}${ch("toota", 688, 685, 340)}<ellipse cx="655" cy="485" rx="8" ry="13" fill="#58b8e5" class="sc-float"/><ellipse cx="722" cy="490" rx="8" ry="13" fill="#58b8e5" class="sc-float" style="animation-delay:.3s"/>`,
    toota_tells_meemo: () => `${bgCozyRoom("#edf8f2")}${ch("toota", 545, 685, 325)}${ch("meemo", 845, 685, 345)}${heart(695, 375, 1.25, "#ff6b8b")}`,
    toota_alone: () => `${bgCozyRoom("#e9f2f7")}${ch("toota", 688, 690, 325)}<g transform="translate(688,235)" class="sc-float">${star(-40, -15, 16, "#ffd154")}${star(40, 15, 16, "#ff8a3d", "0.3s")}</g>`,
    felfel_house: () => `${bgCozyRoom("#fff4df")}${ch("felfel", 688, 690, 375)}<g transform="translate(865,300)" class="sc-float"><circle r="44" fill="#fffdf6" stroke="#85582e" stroke-width="4"/><text x="0" y="16" font-size="48" text-anchor="middle">💭</text></g>`,
    direct_apology: () => `${bgGarden(false)}${ch("felfel", 535, 695, 365)}${ch("toota", 855, 695, 305)}${heart(695, 335, 1.5, "#ff6b8b")}${star(595, 275, 20, "#ffd154")}${star(795, 280, 20, "#ffd154", "0.3s")}`,
    ask_boody: () => `${bgCozyRoom("#f6f2e4")}${ch("felfel", 365, 695, 340)}${ch("boody", 695, 695, 395)}${ch("toota", 1015, 695, 290)}`,
    boody_help: () => `${bgPlaza(false)}${ch("felfel", 390, 695, 340, { anim: "hop" })}${ch("boody", 688, 695, 390)}${ch("toota", 985, 695, 295, { anim: "hop", delay: "0.2s" })}${heart(688, 250, 1.35, "#ff6b8b")}`,
    bridge: () => `
      <rect width="1376" height="768" fill="url(#fSkyDay)"/>
      ${rainbow(688, 420, 320)}
      ${cloud(210, 115, 0.95)} ${cloud(1150, 110, 0.95)}
      <path d="M0,455 Q688,410 1376,455 L1376,768 L0,768 Z" fill="url(#fGrass)"/>
      <path d="M460,460 Q688,525 916,460 L1080,768 L296,768 Z" fill="url(#fRiver)"/>
      <path d="M180,585 Q688,455 1196,585 L1196,650 Q688,520 180,650 Z" fill="#d99f62" stroke="#7a4c1d" stroke-width="6"/>
      ${ch("felfel", 535, 605, 340, { anim: "hop" })}
      ${ch("toota", 835, 605, 290, { anim: "hop", delay: "0.2s" })}
      ${heart(688, 285, 1.5, "#ff6b8b")}
    `,
    plaza: () => `${bgPlaza(false)}${ch("felfel", 295, 695, 335)}${ch("toota", 545, 695, 285)}${ch("boody", 825, 695, 385)}${ch("meemo", 1095, 695, 325)}`,
    play_again: () => `${bgPlaza(true)}${ch("felfel", 290, 695, 340, { anim: "hop" })}${ch("toota", 550, 695, 290, { anim: "hop", delay: "0.15s" })}${ch("meemo", 820, 695, 335, { anim: "hop", delay: "0.3s" })}${ch("boody", 1090, 695, 380, { anim: "hop", delay: "0.45s" })}${star(445, 225, 24, "#ffd154")}${star(925, 225, 24, "#ffd154", "0.3s")}`,
    end_friends: () => `${bgPlaza(true)}${ch("felfel", 475, 695, 375, { anim: "hop" })}${ch("toota", 885, 695, 320, { anim: "hop", delay: "0.2s" })}${heart(688, 285, 1.65, "#ff6b8b")}${star(445, 235, 22, "#ffd154")}${star(935, 235, 22, "#ffd154", "0.3s")}`,
    end_talk: () => `
      <rect width="1376" height="768" fill="url(#fSkyDay)"/>
      ${cloud(240, 120, 0.95)} ${cloud(1120, 115, 0.95)}
      <path d="M0,455 Q688,410 1376,455 L1376,768 L0,768 Z" fill="url(#fGrass)"/>
      <path d="M180,585 Q688,465 1196,585 L1196,650 Q688,530 180,650 Z" fill="#d99f62" stroke="#7a4c1d" stroke-width="6"/>
      ${ch("felfel", 485, 600, 330)}${ch("toota", 745, 600, 285)}${ch("boody", 1045, 645, 365)}
      <g transform="translate(615,295)" class="sc-float"><ellipse rx="72" ry="42" fill="#fffdf6" stroke="#6b4b32" stroke-width="4"/><circle cx="-24" cy="0" r="8" fill="#ff8a3d"/><circle cx="0" cy="0" r="8" fill="#4f8ff0"/><circle cx="24" cy="0" r="8" fill="#45b86a"/></g>
    `,
    end_misunderstanding: () => `${bgGarden(true)}${ch("felfel", 315, 695, 355, { flip: true })}${ch("toota", 1065, 695, 295)}<ellipse cx="1040" cy="525" rx="8" ry="13" fill="#58b8e5" class="sc-float"/>`,
    end_team: () => `${bgPlaza(true)}${ch("felfel", 290, 695, 345, { anim: "hop" })}${ch("toota", 550, 695, 295, { anim: "hop", delay: "0.15s" })}${ch("meemo", 820, 695, 335, { anim: "hop", delay: "0.3s" })}${ch("boody", 1090, 695, 385, { anim: "hop", delay: "0.45s" })}${heart(688, 225, 1.6, "#ff6b8b")}${star(405, 195, 24, "#ffd154")}${star(965, 195, 24, "#ffd154", "0.3s")}`,
    garden_flowers: () => `${bgGarden(false)}${flower(688, 635, "#ff7eb6", 1.8)}${flower(590, 665, "#ffd166", 1.5)}${flower(790, 660, "#b388eb", 1.5)}${ch("felfel", 475, 695, 360)}${ch("toota", 905, 695, 305)}<circle cx="688" cy="590" r="14" fill="#e63946" stroke="#3c1b1f" stroke-width="3"/>${star(688, 430, 22, "#ffd154")}`,
    boody_knock: () => `${bgCozyRoom("#edf8f2")}<rect x="975" y="210" width="210" height="330" rx="100" fill="#c98544" stroke="#6b4528" stroke-width="7"/>${ch("toota", 455, 685, 325)}${ch("boody", 835, 690, 395)}${heart(645, 355, 1.3, "#ff8fa3")}`,
    toota_note: () => `${bgCozyRoom("#edf8f2")}${ch("toota", 435, 685, 340)}<g transform="translate(865,485) rotate(-4)"><rect x="-150" y="-105" width="300" height="210" rx="18" fill="#fffdf6" stroke="#ff8a3d" stroke-width="6"/>${flower(-55, -10, "#ff7eb6", 1.7)}${heart(55, -25, 1.4, "#ff6b8b")}</g>${star(675, 295, 20, "#ffd154")}`,
    mirror_practice: () => `${bgCozyRoom("#fff4df")}<g transform="translate(945,380)"><ellipse rx="145" ry="185" fill="#d9f2ff" stroke="#c98544" stroke-width="14"/><ellipse rx="125" ry="165" fill="none" stroke="#fff" stroke-width="4" opacity="0.7"/></g>${ch("felfel", 515, 695, 385)}${ch("felfel", 945, 535, 250, { flip: true, noShadow: true })}${star(730, 265, 20, "#ffd154")}`,
    gift_prep: () => `${bgCozyRoom("#fff4df")}${ch("felfel", 485, 695, 380)}<g transform="translate(885,535)" class="sc-float"><rect x="-78" y="-65" width="156" height="130" rx="16" fill="#ff758f" stroke="#7a2c3b" stroke-width="5"/><rect x="-16" y="-65" width="32" height="130" fill="#ffd154"/><rect x="-78" y="-16" width="156" height="32" fill="#ffd154"/><circle cx="-24" cy="-84" r="24" fill="#ffd154" stroke="#8a6220" stroke-width="4"/><circle cx="24" cy="-84" r="24" fill="#ffd154" stroke="#8a6220" stroke-width="4"/></g>${heart(705, 330, 1.35, "#ff6b8b")}`,
    meadow: () => `${bgPlaza(false)}<g transform="translate(688,430)"><polygon points="-95,85 0,-35 95,85" fill="#ff758f" stroke="#7a2c3b" stroke-width="5"/><polygon points="-40,85 0,-35 40,85" fill="#fffdf6" stroke="#7a2c3b" stroke-width="4"/></g>${ch("felfel", 295, 700, 340, { anim: "hop" })}${ch("toota", 550, 700, 290)}${ch("meemo", 825, 700, 330, { anim: "hop", delay: "0.2s" })}${ch("boody", 1085, 700, 380)}`,
    unfair_race: () => `${bgGarden(false)}<line x1="1080" y1="450" x2="1080" y2="755" stroke="#fff" stroke-width="10" stroke-dasharray="18 14"/>${ch("felfel", 1045, 685, 345, { anim: "hop" })}${ch("toota", 265, 695, 290)}`,
    hide_seek: () => `${bgGarden(false)}<ellipse cx="920" cy="655" rx="95" ry="52" fill="#b7c2cc" stroke="#6c7885" stroke-width="5"/>${ch("toota", 920, 685, 250)}${ch("felfel", 415, 695, 355)}${ch("meemo", 645, 665, 310, { anim: "hop" })}${star(920, 415, 22, "#ffd154")}`,
    treasure_hunt: () => `${bgPlaza(false)}<g transform="translate(688,335)" class="sc-float"><rect x="-110" y="-75" width="220" height="150" rx="14" fill="#f7e3b5" stroke="#8f5d34" stroke-width="6"/><path d="M-75,35 Q-10,-35 65,15" fill="none" stroke="#d94e4e" stroke-width="6" stroke-dasharray="12 10"/><text x="68" y="32" font-size="44" font-weight="900" fill="#d94e4e" text-anchor="middle">✕</text></g>${ch("felfel", 275, 705, 335)}${ch("toota", 540, 705, 290)}${ch("meemo", 830, 705, 330, { anim: "hop" })}${ch("boody", 1095, 705, 380)}`,
    end_treasure: () => `${bgPlaza(true)}<g transform="translate(688,585)"><rect x="-115" y="-55" width="230" height="125" rx="16" fill="#c98544" stroke="#6b4528" stroke-width="6"/><rect x="-115" y="-12" width="230" height="22" fill="#ffd154"/><circle cx="0" cy="-2" r="18" fill="#ffe885" stroke="#8a6220" stroke-width="4"/>${star(-55, -88, 22, "#ffd154")}${star(0, -108, 28, "#fff29c", "0.2s")}${star(55, -88, 22, "#ffd154", "0.4s")}</g>${ch("felfel", 250, 705, 340, { anim: "hop" })}${ch("toota", 455, 705, 305, { anim: "hop", delay: "0.15s" })}${ch("meemo", 925, 705, 330, { anim: "hop", delay: "0.3s" })}${ch("boody", 1125, 705, 375, { anim: "hop", delay: "0.45s" })}`,
    end_letter: () => `${bgGarden(false)}${rainbow(688, 420, 320)}<g transform="translate(688,430)" class="sc-float"><rect x="-120" y="-82" width="240" height="164" rx="18" fill="#fffdf6" stroke="#ff8a3d" stroke-width="6"/><path d="M-120,-82 L0,18 L120,-82" fill="none" stroke="#ff8a3d" stroke-width="5"/>${heart(0, -24, 1.35, "#ff6b8b")}</g>${ch("felfel", 425, 705, 365, { anim: "hop" })}${ch("toota", 950, 705, 310, { anim: "hop", delay: "0.2s" })}`
  };

  window.renderFelfelSceneSVG = function (name) {
    const fn = SCENE_BUILDERS[name];
    if (!fn) return null;
    return `<svg class="scene-svg" viewBox="0 0 1376 768" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      ${DEFS}${fn()}<rect width="1376" height="768" fill="url(#fVig)" pointer-events="none"/>
    </svg>`;
  };
})();
