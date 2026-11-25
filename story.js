// =====================================================================
//  آدم وأسبوع الصداقة الكبير  (Adam and the Big Friendship Week)
//  قصة تفاعلية مصورة ومسموعة للأطفال عن الصداقة والتعاون
//  Supports Arabic (default, RTL) and English (LTR)
// =====================================================================

window.UI_TEXT = {
  ar: {
    dir: "rtl",
    docTitle: "آدم وأسبوع الصداقة الكبير",
    h1: "آدم <span>و</span>أسبوع الصداقة الكبير",
    sub: "قصة مصوّرة ومسموعة.. أنت من يختار ماذا سيحدث!",
    btnSolo: "▶ ابدأ القصة",
    btnFriends: "👫 العب مع أصدقائك",
    hint: "💡 القصة تعمل بالصوت العربي على الكمبيوتر والموبايل.",
    setupTitle: "👫 من سيلعب معنا؟",
    setupSub: "اكتب أسماءكم (من ٢ إلى ٤ أصدقاء)",
    friendPh: (i) => `اسم الصديق ${i}`,
    friendDef: (i) => `صديق ${i}`,
    addPlayer: "➕ أضف صديقاً",
    modeTitle: "كيف ستختارون؟",
    modeTurnsTitle: "🔄 بالدور",
    modeTurnsSub: "كل صديق يختار قراراً واحداً ثم يأتي دور صديقه",
    modeVoteTitle: "🗳️ تصويت جماعي",
    modeVoteSub: "الجميع يصوّت، والاختيار الأكثر أصواتاً يفوز!",
    back: "رجوع ◀",
    startStory: "ابدأ المغامرة ▶",
    endingsFound: (a, b) => `⭐ النهايات المكتشفة: <b>${a} / ${b}</b>`,
    voiceOn: "🔊 الصوت: يعمل",
    voiceOff: "🔇 الصوت: صامت",
    speedSlow: "🐢 السرعة: بطيئة",
    speedNorm: "🐇 السرعة: عادية",
    musicOn: "🎵 الموسيقى: تعمل",
    musicOff: "🎵 الموسيقى: متوقفة",
    langBtn: "🌐 English",
    replay: "🔁 أعد القراءة",
    next: "التالي ◀",
    seeEnding: "شاهد النهاية ⭐",
    talkLabel: "💬 لنتحدث معاً:",
    turnSolo: (icon, name) => `${icon} دورك يا ${name} لتختار!`,
    voteStart: (icon, name) => `🗳️ وقت التصويت! يبدأ ${icon} ${name}.`,
    voteStartSpeak: (name) => `وقت التصويت! يبدأ ${name}.`,
    voteNext: (vIcon, nIcon, name) => `${vIcon} صوّت! والآن دور ${nIcon} ${name}!`,
    voteNextSpeak: (name) => `دورك في التصويت يا ${name}!`,
    voteDone: "انتهى التصويت!",
    voteTie: "🎡 تعادل! تدور العجلة للاختيار...",
    voteTieSpeak: "تعادل! لنُدِر العجلة!",
    wheelPick: "اختارت العجلة...",
    wins: (msg, letter) => `🎉 ${msg} الاختيار (${letter}) يفوز!`,
    winsSpeak: (msg, letter) => `${msg} الاختيار ${letter}!`,
    toastTitle: "وسام صداقة جديد!",
    toastOk: "رائع! ◀",
    toastSpeak: (name, tip) => `وسام جديد! ${name}. ${tip}`,
    theEnd: "✨ النهاية ✨",
    yourBadges: "أوسمة الصداقة التي حصلت عليها",
    foundEndings: "النهايات التي اكتشفتها",
    notFound: "لم تكتشف بعد",
    talkTogether: "💬 لنتحدث معاً:",
    home: "🏠 الرئيسية",
    again: "🔄 العب مرة أخرى",
    letters: ["أ", "ب", "ج"],
    endSpeak1: (title, h, b) => `النهاية! ${title}. لقد جمعت ${h} قلوب صداقة و${b} أوسمة!`,
    endSpeakMore: (left) => `لا تزال هناك ${left === 1 ? "نهاية واحدة أخرى" : left + " نهايات أخرى"} بانتظارك. العب مرة أخرى وجرّب اختيارات جديدة!`,
    endSpeakAll: "رائع! لقد اكتشفت جميع النهايات!",
    talkSpeakPrefix: "لنتحدث معاً! ",
    choiceSpeak: (letter, text) => `الاختيار ${letter}: ${text}`
  },
  en: {
    dir: "ltr",
    docTitle: "Adam and the Big Friendship Week",
    h1: "Adam <span>and the</span> Big Friendship Week",
    sub: "An interactive picture-book adventure. You choose what happens!",
    btnSolo: "▶ Play",
    btnFriends: "👫 Play with Friends",
    hint: "💡 Tip: open in Microsoft Edge or on your phone for the most natural voices.",
    setupTitle: "👫 Who is playing?",
    setupSub: "Write your names (2 to 4 friends)",
    friendPh: (i) => `Friend ${i} name`,
    friendDef: (i) => `Friend ${i}`,
    addPlayer: "➕ Add a friend",
    modeTitle: "How do you choose?",
    modeTurnsTitle: "🔄 Take turns",
    modeTurnsSub: "Each friend picks one choice, one after another",
    modeVoteTitle: "🗳️ Everyone votes",
    modeVoteSub: "All friends vote, and the most votes wins!",
    back: "◀ Back",
    startStory: "Start the story ▶",
    endingsFound: (a, b) => `⭐ Endings found: <b>${a} / ${b}</b>`,
    voiceOn: "🔊 Voice: on",
    voiceOff: "🔇 Voice: off",
    speedSlow: "🐢 Speed: slow",
    speedNorm: "🐇 Speed: normal",
    musicOn: "🎵 Music: on",
    musicOff: "🎵 Music: off",
    langBtn: "🌐 العربية",
    replay: "🔁 Read again",
    next: "Next ▶",
    seeEnding: "See the ending ⭐",
    talkLabel: "💬 Talk about it:",
    turnSolo: (icon, name) => `${icon} ${name}, it's your turn to choose!`,
    voteStart: (icon, name) => `🗳️ Everybody votes! ${icon} ${name} goes first.`,
    voteStartSpeak: (name) => `Everybody votes! ${name} goes first.`,
    voteNext: (vIcon, nIcon, name) => `${vIcon} voted! Now ${nIcon} ${name}, your vote!`,
    voteNextSpeak: (name) => `${name}, your vote!`,
    voteDone: "The votes are in!",
    voteTie: "🎡 It's a tie! Spinning the wheel...",
    voteTieSpeak: "It's a tie! Let's spin!",
    wheelPick: "The wheel picked...",
    wins: (msg, letter) => `🎉 ${msg} ${letter} wins!`,
    winsSpeak: (msg, letter) => `${msg} ${letter}!`,
    toastTitle: "New Friendship Badge!",
    toastOk: "Yay! ▶",
    toastSpeak: (name, tip) => `New badge! ${name}. ${tip}`,
    theEnd: "✨ THE END ✨",
    yourBadges: "Your friendship badges",
    foundEndings: "Endings you found",
    notFound: "Not found yet",
    talkTogether: "💬 Talk together:",
    home: "🏠 Home",
    again: "🔄 Play again",
    letters: ["A", "B", "C"],
    endSpeak1: (title, h, b) => `The end! ${title}. You collected ${h} friendship hearts and ${b} badges!`,
    endSpeakMore: (left) => `There ${left === 1 ? "is" : "are"} ${left} more ${left === 1 ? "ending" : "endings"} to find. Play again and make different choices!`,
    endSpeakAll: "Wow! You found every ending!",
    talkSpeakPrefix: "Talk about it! ",
    choiceSpeak: (letter, text) => `${letter}: ${text}`
  }
};

window.CAST_BY_LANG = {
  ar: {
    n:     { name: "",             color: "#5b4636", pitch: 1.0,  rate: 0.94, voice: "narrator" },
    adam:  { name: "آدم",          color: "#e2463c", pitch: 1.3,  rate: 1.0,  voice: "boy" },
    lina:  { name: "لينا",         color: "#d89400", pitch: 1.55, rate: 1.02, voice: "girl" },
    omar:  { name: "عمر",          color: "#2e9e4f", pitch: 1.05, rate: 1.05, voice: "boy2" },
    sami:  { name: "سامي",         color: "#3a7bd5", pitch: 1.45, rate: 0.92, voice: "boy" },
    huda:  { name: "الأستاذة هدى", color: "#8e5cc4", pitch: 1.08, rate: 0.95, voice: "woman" },
    mom:   { name: "ماما",         color: "#138a8a", pitch: 1.0,  rate: 0.93, voice: "woman2" },
    kids:  { name: "الجميع",       color: "#d94f8c", pitch: 1.45, rate: 1.04, voice: "girl" },
    judge: { name: "الحكم",        color: "#7a6a00", pitch: 0.85, rate: 0.95, voice: "man" }
  },
  en: {
    n:     { name: "",           color: "#5b4636", pitch: 1.0,  rate: 0.92, voice: "narrator" },
    adam:  { name: "Adam",       color: "#e2463c", pitch: 1.3,  rate: 1.0,  voice: "boy" },
    lina:  { name: "Lina",       color: "#d89400", pitch: 1.6,  rate: 1.02, voice: "girl" },
    omar:  { name: "Omar",       color: "#2e9e4f", pitch: 1.05, rate: 1.08, voice: "boy2" },
    sami:  { name: "Sami",       color: "#3a7bd5", pitch: 1.5,  rate: 0.9,  voice: "boy" },
    huda:  { name: "Miss Huda",  color: "#8e5cc4", pitch: 1.1,  rate: 0.95, voice: "woman" },
    mom:   { name: "Mom",        color: "#138a8a", pitch: 1.0,  rate: 0.93, voice: "woman2" },
    kids:  { name: "Everyone",   color: "#d94f8c", pitch: 1.5,  rate: 1.05, voice: "girl" },
    judge: { name: "Judge",      color: "#7a6a00", pitch: 0.8,  rate: 0.95, voice: "man" }
  }
};

window.BADGES_BY_LANG = {
  ar: {
    brave:   { icon: "🦁", name: "صوت شجاع",     tip: "تحدثت بشجاعة حتى عندما شعرت ببعض التوتر!" },
    sorry:   { icon: "🙏", name: "الاعتذار اللطيف", tip: "اعتذرت بلطف وأصلحت ما حدث." },
    share:   { icon: "🍪", name: "المشاركة",      tip: "شاركت أصدقاءك، وهذا أسعد الجميع!" },
    include: { icon: "🤝", name: "عدم ترك أحد وحيداً", tip: "اهتممت بصديقك ولم تتركه وحده." },
    help:    { icon: "🧻", name: "يد العون",       tip: "ساعدت صديقك عندما احتاج إلى المساعدة." },
    team:    { icon: "🧩", name: "روح الفريق",    tip: "استمعت لأفكار جميع أصدقائك." },
    forgive: { icon: "💛", name: "التسامح",       tip: "سامحت صديقك عندما أخطأ دون قصد." }
  },
  en: {
    brave:   { icon: "🦁", name: "Brave Voice",      tip: "You spoke up even when you felt nervous!" },
    sorry:   { icon: "🙏", name: "Saying Sorry",     tip: "You said sorry and made things right." },
    share:   { icon: "🍪", name: "Sharing",          tip: "You shared, and that made everyone happy." },
    include: { icon: "🤝", name: "Including Others", tip: "You made sure nobody was left out." },
    help:    { icon: "🧻", name: "Helping Hand",     tip: "You helped a friend when they needed it." },
    team:    { icon: "🧩", name: "Teamwork",         tip: "You listened to everyone's ideas." },
    forgive: { icon: "💛", name: "Forgiving",        tip: "You forgave a friend's accident." }
  }
};

window.TALK_BY_LANG = {
  ar: {
    classintro: "كيف تشعر أنت عندما تقابل أصدقاء جدداً لأول مرة؟",
    playground: "لو كنت مكان آدم، إلى أين ستذهب؟ ولماذا؟",
    ballchalk:  "ماذا تفعل لو أفسدت شيئاً لصديقك دون قصد؟",
    lastchalk:  "هل المشاركة سهلة أم صعبة أحياناً؟ ولماذا؟",
    spill:      "برأيك، كيف يشعر سامي في هذه اللحظة؟",
    teamsplit:  "ماذا نفعل عندما يريد كل صديق فكرة مختلفة؟",
    alone:      "كيف يشعر آدم الآن وهو يعمل وحده؟",
    broken:     "ماذا تقول لصديقك عندما يقع في خطأ غير مقصود؟"
  },
  en: {
    classintro: "How do YOU feel when you meet new people?",
    playground: "If you were Adam, where would you go? Why?",
    ballchalk:  "What would you do if you broke something by accident?",
    lastchalk:  "Is it easy or hard to share? Why?",
    spill:      "How do you think Sami feels right now?",
    teamsplit:  "What do you do when friends want different things?",
    alone:      "How does Adam feel right now?",
    broken:     "What do you say when a friend makes a mistake?"
  }
};

window.ENDING_TALK_BY_LANG = {
  ar: [
    "هل شعرت بالخجل يوماً في مكان جديد؟ وماذا ساعدك؟",
    "ماذا يمكنك أن تفعل إذا رأيت طفلاً يجلس وحيداً؟",
    "كيف تشعر عندما يعتذر منك صديقك بلطف؟",
    "ما الشيء الجميل الذي يمكنك مشاركته مع صديقك غداً؟",
    "ما الصفات التي تجعل الشخص صديقاً رائعاً؟",
    "هل تتذكر موقفاً جميلاً ساعدك فيه أحد أصدقائك؟"
  ],
  en: [
    "Have you ever felt shy in a new place? What helped you?",
    "What can you do if you see someone sitting all alone?",
    "How do you feel when someone says sorry to you?",
    "What is something you can share with a friend tomorrow?",
    "What makes someone a good friend?",
    "Can you remember a time a friend helped you?"
  ]
};

window.START = "wake";
window.MAX_HEARTS = 5;

window.STORY_BY_LANG = {
  ar: {
    // ------------------------------------------------------------ الصباح
    wake: { img: "wake", chapter: "الفصل الأول: يوم جديد", say: [
      ["n", "تِرن تِرن! رنّ المنبّه الصغير. فتح آدم عينيه، فشعر بشيء دافئ ولطيف يلعق أنفه!"],
      ["n", "إنّه بسكوت، جروه الصغير اللطيف!"],
      ["adam", "صباح الخير يا بسكوت! اليوم هو أول يوم لي في مدرستي الجديدة!"]
    ], next: "breakfast" },

    breakfast: { img: "breakfast", say: [
      ["n", "في المطبخ، أعدّت ماما فطائر البان كيك التي يحبّها آدم كثيراً."],
      ["adam", "ماما... ماذا لو لم يرد أحد أن يكون صديقي؟"],
      ["mom", "كن على طبيعتك يا حبيبي. كن لطيفاً وشجاعاً، وسيأتي الأصدقاء من تلقاء أنفسهم. أعدك بذلك."],
      ["n", "عانقت ماما آدم عناقاً دافئاً وكبيراً."]
    ], next: "schoolgate" },

    schoolgate: { img: "schoolgate", say: [
      ["n", "المدرسة الجديدة كبيرة وصفراء، لها باب أحمر جميل، وفيها الكثير والكثير من الأطفال."],
      ["n", "أمسك آدم بيد ماما بقوة، وشعر كأن في بطنه فراشات صغيرة ترفرف من التوتر."],
      ["mom", "خذ نفساً عميقاً يا بطل.. شهيق.. وزفير. أنا واثقة أنك تستطيع!"]
    ], next: "classintro" },

    classintro: { img: "classintro", say: [
      ["n", "معلمة آدم هي الأستاذة هدى، ولها أجمل وألطف ابتسامة."],
      ["huda", "أهلاً يا أبطال! هذا صديقنا الجديد آدم. هيا نرحّب به جميعاً!"],
      ["huda", "يا آدم، هل تحب أن تخبرنا بشيء تحبّه كثيراً؟"],
      ["n", "كل الأطفال ينظرون إلى آدم الآن. ماذا يجب أن يفعل؟"]
    ], choices: [
      { t: "يقف بشجاعة ويخبرهم بما يحبّه!", go: "roar", heart: 1, badge: "brave", icon: "🦖" },
      { t: "يلوّح بيده بخجل ويجلس في مقعده", go: "shywave", icon: "👋" }
    ]},

    // ------------------------------------------------------------ الشجاعة
    roar: { img: "roar", say: [
      ["adam", "مرحباً! أنا آدم، وأنا أحبّ الديناصورات كثيراً! زئييير!"],
      ["n", "ضحك الفصل كله ضحكة جميلة ومليئة بالفرح!"],
      ["omar", "وأنا أيضاً! ديناصور التي ريكس هو الأروع!"],
      ["n", "هذا عمر، صاحب الابتسامة الكبيرة والمرحة."]
    ], next: "linadesk" },

    linadesk: { img: "linadesk", say: [
      ["n", "أجلست الأستاذة هدى آدم بجانب فتاة لطيفة اسمها لينا."],
      ["lina", "انظر يا آدم! رسمتُ ديناصوراً أيضاً، وهو ملك لذلك يضع تاجاً ذهبياً!"],
      ["adam", "واو! هذا أروع ديناصور رأيته في حياتي!"],
      ["n", "بدأت فراشات التوتر في بطن آدم تطير بعيداً واحدة تلو الأخرى."]
    ], next: "playground" },

    // ------------------------------------------------------------ الخجل
    shywave: { img: "shywave", say: [
      ["n", "احمرّت وجنتا آدم مثل الطماطم! لوّح بيده تلويحة صغيرة جداً وأسرع إلى المقعد الخلفي."],
      ["n", "لا بأس أبداً.. كلنا نشعر بالخجل أحياناً."],
      ["n", "جلس آدم بجانب ولد هادئ يقرأ كتاباً كبيراً."]
    ], next: "samibook" },

    samibook: { img: "samibook", say: [
      ["n", "نظر آدم إلى الكتاب، فوجد فيه صوراً مدهشة للكواكب والنجوم اللامعة!"],
      ["sami", "هل تحب الفضاء؟ أنا اسمي سامي."],
      ["adam", "وأنا آدم! أحب كوكب زحل كثيراً لأن حوله حلقات جميلة!"],
      ["n", "ابتسم سامي ابتسامة لطيفة، فابتسم له آدم بسعادة."]
    ], next: "playground" },

    // ------------------------------------------------------------ الفسحة
    playground: { img: "playground", chapter: "الفصل الثاني: وقت اللعب!", say: [
      ["n", "تررررن! حان وقت الفسحة! ركض الجميع إلى ساحة المدرسة المشمسة."],
      ["n", "عمر وأصدقاؤه يلعبون كرة القدم، ولينا ترسم بالطباشير الملوّنة على الأرض."],
      ["n", "أما سامي فكان يجلس وحيداً على المقعد الخشبي."],
      ["n", "يحمل آدم كيس البسكويت الذي أعدّته ماما. إلى أين يذهب الآن؟"]
    ], choices: [
      { t: "يطلب اللعب مع عمر في كرة القدم", go: "soccer", icon: "⚽" },
      { t: "يذهب ليرسم بالطباشير مع لينا", go: "chalkcity", icon: "🖍️" },
      { t: "يجلس مع سامي الذي يجلس وحده", go: "bench", heart: 1, badge: "include", icon: "🪑" }
    ]},

    // --- كرة القدم
    soccer: { img: "soccer", say: [
      ["adam", "هل يمكنني أن ألعب معكم؟"],
      ["omar", "بالتأكيد! أنت في فريقي! هيا يا آدم، سدّد الكرة!"],
      ["n", "ركض آدم بسرعة كبيرة، أسرع مما ركض من قبل!"],
      ["n", "رفع قدمه وسدّد الكرة ركلة عملاقة!"]
    ], next: "ballchalk" },

    ballchalk: { img: "ballchalk", say: [
      ["n", "ووووش! طارت الكرة عالياً... وسقطت بوم! فوق رسمة لينا بالطباشير!"],
      ["n", "تلطّخت رسمتها الجميلة كلها."],
      ["lina", "يا إلهي... رسمتي الجميلة..."],
      ["n", "بدت لينا حزينة جداً. ماذا يجب أن يفعل آدم؟"]
    ], choices: [
      { t: "يركض إليها ويعتذر بلطف", go: "rainbowdragon", heart: 1, badge: "sorry", icon: "🙏" },
      { t: "يتظاهر أنه لم يرَ شيئاً ويكمل اللعب", go: "guilty", icon: "🙈" }
    ]},

    rainbowdragon: { img: "rainbowdragon", say: [
      ["adam", "أنا آسف جداً يا لينا! لم أقصد ذلك أبداً. هل يمكنني مساعدتك في إصلاحها؟"],
      ["n", "مسحت لينا دمعها، ثم ابتسمت فجأة."],
      ["lina", "هممم... ما رأيك أن نحوّل هذه البقعة إلى تنّين ملوّن؟"],
      ["n", "رسموا معاً تنيناً عملاقاً بألوان قوس قزح، وجاء عمر ورسم له كرة قدم يلعب بها!"]
    ], next: "lunchbox" },

    guilty: { img: "guilty", say: [
      ["n", "أكمل آدم اللعب، لكنه شعر بثقل كبير في قلبه كأنه ابتلع حجراً."],
      ["n", "التفت خلفه فرأى لينا تمشي حزينة وهي تحمل علبة الطباشير."],
      ["omar", "يا آدم... ألا يجب أن نذهب ونعتذر لها؟"]
    ], next: "apology" },

    apology: { img: "apology", say: [
      ["n", "أخذ آدم نفساً عميقاً ومشى نحو لينا."],
      ["adam", "آسف يا لينا لأن الكرة أفسدت رسمتك، وآسف لأنني لم أعتذر فوراً."],
      ["lina", "شكراً لأنك اعتذرت يا آدم. لا بأس الآن."],
      ["n", "اختفى الحجر الثقيل من قلب آدم! فالاعتذار يجلب الراحة دائماً."]
    ], next: "lunchbox" },

    // --- الطباشير
    chalkcity: { img: "chalkcity", say: [
      ["adam", "هل يمكنني أن أرسم معك؟"],
      ["lina", "نعم بالتأكيد! هيا نرسم مدينة كاملة!"],
      ["n", "رسما بيوتاً وأشجاراً، وشمساً كبيرة، وصاروخ فضاء، وبالطبع ديناصوراً لطيفاً!"],
      ["n", "كانت أجمل مدينة طباشير في العالم كله!"]
    ], next: "lastchalk" },

    lastchalk: { img: "lastchalk", say: [
      ["n", "الآن أرادا رسم السماء. لكن يا للمشكلة! لم يبقَ سوى قطعة طباشير زرقاء واحدة فقط!"],
      ["n", "مدّ آدم ولينا أيديهما إليها في نفس اللحظة."],
      ["n", "ماذا يجب أن يفعل آدم؟"]
    ], choices: [
      { t: "يقسمها نصفين ويتشاركها مع لينا", go: "sharechalk", heart: 1, badge: "share", icon: "✂️" },
      { t: "يأخذها بسرعة ويقول: رأيتها أولاً!", go: "grabchalk", icon: "✋" }
    ]},

    sharechalk: { img: "sharechalk", say: [
      ["n", "طَق! قسم آدم قطعة الطباشير نصفين متساويين."],
      ["adam", "نصف لكِ، ونصف لي!"],
      ["lina", "أنت صديق رائع يا آدم!"],
      ["n", "رسمت لينا السماء ورسم آدم البحر، واجتمع الأطفال حولهما بإعجاب: واو!"]
    ], next: "lunchbox" },

    grabchalk: { img: "grabchalk", say: [
      ["n", "أخذ آدم الطباشير الزرقاء بسرعة، فعقدت لينا ذراعيها بحزن."],
      ["lina", "هذا ليس عدلاً..."],
      ["n", "بدأ آدم يرسم السماء وحده، لكن الرسم وحيداً لم يكن ممتعاً أبداً."],
      ["adam", "أنا آسف يا لينا... هيا نتشاركها، يمكنكِ أن تبدئي أولاً."],
      ["n", "ابتسمت لينا من جديد. المشاركة أجمل بكثير!"]
    ], next: "lunchbox" },

    // --- المقعد
    bench: { img: "bench", say: [
      ["n", "جلس آدم بجانب سامي على المقعد."],
      ["adam", "مرحباً! هل تريد قطعة بسكويت؟ ماما تصنع ألذ بسكويت في العالم!"],
      ["n", "لمعت عينا سامي فرحاً كأنهما نجمتان صغيرتان."],
      ["sami", "حقاً؟ شكراً جزيلاً لك!"]
    ], next: "stars" },

    stars: { img: "stars", say: [
      ["sami", "هل تعلم أن عدد النجوم في السماء أكثر من حبات الرمل على الشاطئ؟"],
      ["adam", "واو! هذا عدد هائل جداً!"],
      ["sami", "أنا أيضاً جديد هنا، جئت الشهر الماضي، ولم يكن أحد يلعب معي."],
      ["adam", "من اليوم، لديك صديق اسمه آدم!"]
    ], next: "samigoal" },

    samigoal: { img: "samigoal", say: [
      ["n", "فجأة تدحرجت كرة قدم وتوقفت عند أقدامهما. لقد كان عمر!"],
      ["omar", "يا آدم، هل تريد أن تلعب معنا؟"],
      ["adam", "بشرط أن يلعب سامي معنا أيضاً!"],
      ["omar", "بالتأكيد! كلما زاد عددنا زادت المتعة!"],
      ["n", "وتخيّل ماذا حدث؟ سجّل سامي هدفاً رائعاً، وهتف الجميع له بسعادة!"]
    ], next: "lunchbox" },

    // ------------------------------------------------------------ الغداء
    lunchbox: { img: "lunchbox", chapter: "الفصل الثالث: وقت الغداء", say: [
      ["n", "يممم! حان وقت الغداء. فتح آدم صندوق طعامه."],
      ["n", "وجد بداخله شطيرة جبن لذيذة وورقة صغيرة من ماما مرسوماً عليها قلب أحمر كبير."],
      ["mom", "أنت طفل رائع يا آدم. أحبك، ماما."]
    ], next: "spill" },

    spill: { img: "spill", say: [
      ["n", "سبلاش! على الجهة الأخرى من الطاولة، أوقع سامي عصيره دون قصد، فتبلّل طعامه كله!"],
      ["n", "بدأ بعض الأطفال يضحكون، وبدا سامي على وشك البكاء."],
      ["n", "ماذا يجب أن يفعل آدم؟"]
    ], choices: [
      { t: "يشارك نصف شطيرته مع سامي", go: "sharefood", heart: 1, badge: "share", icon: "🥪" },
      { t: "يحضر مناديل ويساعده في التنظيف", go: "cleanup", heart: 1, badge: "help", icon: "🧻" },
      { t: "يضحك مع الأطفال الآخرين", go: "giggle", icon: "😆" }
    ]},

    sharefood: { img: "sharefood", say: [
      ["adam", "تفضّل يا سامي، هذا نصف شطيرتي لك."],
      ["sami", "شكراً لك يا آدم!"],
      ["n", "وعندها حدث شيء سحري! شاركت لينا عنبها، وشارك عمر تفاحته!"],
      ["n", "اللطف هكذا دائماً: عندما يبدأ شخص واحد بالمشاركة، يتشجّع الجميع!"]
    ], next: "fairnews" },

    cleanup: { img: "cleanup", say: [
      ["n", "أحضر آدم الكثير من المناديل وبدأ يمسح العصير بسرعة."],
      ["adam", "الضحك على الآخرين ليس لطيفاً! هيا نساعده بدلاً من ذلك!"],
      ["n", "توقف الضحك فوراً، وبدأ الأطفال واحداً تلو الآخر يساعدون في التنظيف."],
      ["sami", "شكراً لكم جميعاً!"]
    ], next: "fairnews" },

    giggle: { img: "giggle", say: [
      ["n", "ضحك آدم أيضاً قليلاً..."],
      ["n", "لكنه نظر إلى وجه سامي فرأى دمعة صغيرة تنزل على خده."],
      ["n", "فكّر آدم: كيف سأشعر لو ضحك الجميع عليّ؟"],
      ["adam", "أنا آسف يا سامي لأنني ضحكت، هذا لم يكن لطيفاً. هل تريد نصف شطيرتي؟"],
      ["sami", "حسناً... شكراً يا آدم."]
    ], next: "fairnews" },

    // ------------------------------------------------------------ المشروع الكبير
    fairnews: { img: "fairnews", chapter: "الفصل الرابع: المشروع الكبير", say: [
      ["huda", "خبر رائع يا أبطال! يوم الجمعة سيقام مهرجان المدرسة الكبير!"],
      ["huda", "كل فريق سيصنع معاً شيئاً مذهلاً لعرضه في المهرجان."],
      ["n", "فريق آدم يضمّ لينا وعمر وسامي. يا للفرحة!"]
    ], next: "argue" },

    argue: { img: "argue", say: [
      ["omar", "هيا نصنع روبوت كرة قدم عملاقاً!"],
      ["lina", "لا! لنصنع قلعة ملوّنة جميلة!"],
      ["sami", "بل صاروخ فضاء يطير إلى النجوم!"],
      ["n", "تكلّم الجميع في وقت واحد، وصارت الأصوات أعلى... وأعلى... وأعلى!"]
    ], next: "teamsplit" },

    teamsplit: { img: "argue", say: [
      ["n", "عقدت لينا ذراعيها، وضرب عمر الأرض بقدمه، وسكت سامي حزيناً."],
      ["n", "يا إلهي! الفريق يكاد يتفرّق! على آدم أن يفعل شيئاً الآن!"]
    ], choices: [
      { t: "هيا نجمع كل أفكارنا معاً في فكرة واحدة!", go: "combine", heart: 1, badge: "team", icon: "🧩" },
      { t: "هيا نصوّت جميعاً، فالتصويت عادل!", go: "voting", heart: 1, badge: "team", icon: "🗳️" },
      { t: "سننفّذ فكرتي أنا فقط: ديناصور!", go: "bossy", icon: "😤" }
    ]},

    combine: { img: "combine", say: [
      ["adam", "انتظروا! ما رأيكم أن نصنع قلعة صاروخية... يقودها روبوت ديناصور... يلعب كرة القدم؟!"],
      ["n", "ساد الصمت لثانية واحدة، ثم..."],
      ["kids", "نعم!! هذه أروع فكرة في العالم!!"]
    ], next: "building" },

    building: { img: "building", say: [
      ["n", "طوال الأسبوع، عمل الفريق بحماس بالكرتون والشريط اللاصق والألوان."],
      ["n", "لينا لوّنت القلعة، وعمر صنع الروبوت، وسامي صمّم الصاروخ، وآدم صنع الديناصور."],
      ["n", "عندما يتعاون الجميع، يصبح العمل ممتعاً مثل اللعب!"]
    ], next: "fair" },

    voting: { img: "voting", say: [
      ["n", "كتب كل صديق فكرته على ورقة ووضعها في الصندوق."],
      ["n", "فازت فكرة صاروخ سامي! لكن عمر بدا حزيناً قليلاً."],
      ["adam", "يا عمر، أنت أفضل بنّاء بيننا! هل تصنع أنت محرّك الصاروخ؟"],
      ["omar", "حقاً؟ نعم! سأجعله قوياً جداً!"]
    ], next: "building" },

    bossy: { img: "bossy", say: [
      ["adam", "سنصنع ديناصوراً وانتهى الأمر!"],
      ["n", "سكت الجميع. نظرت لينا إلى الأرض، ونظر سامي إلى حذائه."],
      ["omar", "حسناً، اصنعه وحدك إذاً."]
    ], next: "alone" },

    alone: { img: "alone", say: [
      ["n", "بدأ آدم يصنع الديناصور وحده تماماً."],
      ["n", "لكن رأسه يسقط كل مرة: بوب! وذيله يهتز ويميل."],
      ["n", "أصدقاؤه يجلسون بعيداً. العمل وحيداً صعب... وموحش."],
      ["n", "تذكّر آدم كلام ماما: كن لطيفاً. ماذا يفعل الآن؟"]
    ], choices: [
      { t: "يعتذر لأصدقائه ويطلب أفكارهم الجميلة", go: "bossysorry", heart: 1, badge: "sorry", icon: "🙏" },
      { t: "يستمر في البناء وحده", go: "aloneend", icon: "🦕" }
    ]},

    bossysorry: { img: "apology", say: [
      ["adam", "يا أصدقائي، أنا آسف لأنني تسلّطت عليكم. أفكاركم مهمة أيضاً! هل نبدأ من جديد؟"],
      ["lina", "بالطبع! الأصدقاء يخطئون أحياناً ثم يصلحون خطأهم."],
      ["n", "وخطرت ببال آدم فكرة رائعة تجمعهم جميعاً..."]
    ], next: "combine" },

    aloneend: { img: "aloneend", end: "الديناصور الوحيد", say: [
      ["n", "في يوم الجمعة، وقف آدم بجانب ديناصوره الصغير المائل، وحيداً."],
      ["n", "في ذلك المساء، عانقته ماما بحنان، وتكوّر بسكوت في حضنه."],
      ["mom", "أن تكون المتحكّم ليس مثل أن تكون صديقاً يا حبيبي. لكن غداً يوم جديد لتبدأ بداية أجمل."],
      ["n", "هزّ آدم رأسه موافقاً. غداً سيستمع لأصدقائه بحب."]
    ]},

    // ------------------------------------------------------------ المهرجان
    fair: { img: "fair", chapter: "الفصل الخامس: مهرجان المدرسة", say: [
      ["n", "جاء يوم الجمعة! امتلأت المدرسة بالبالونات والموسيقى والعائلات السعيدة."],
      ["n", "وقف مشروع الفريق شامخاً وجميلاً وألوانه زاهية!"],
      ["n", "سيصل الحكّام بعد لحظات قليلة!"]
    ], next: "broken" },

    broken: { img: "broken", say: [
      ["n", "ركض سامي ليضع آخر ملصق... لكنه تعثّر! كراش!"],
      ["n", "انكسرت قمة الصاروخ وسقطت على الأرض!"],
      ["sami", "يا إلهي! أنا آسف جداً جداً!"],
      ["n", "ماذا يجب أن يقول آدم لسامي؟"]
    ], choices: [
      { t: "لا بأس يا سامي! الحوادث تحدث، هيا نصلحه معاً!", go: "fixing", heart: 1, badge: "forgive", icon: "💛" },
      { t: "يا سامي! لقد أفسدت كل شيء!", go: "samicry", icon: "😠" }
    ]},

    samicry: { img: "samicry", say: [
      ["n", "ركض سامي وهو يبكي، وعمّ الصمت بين الفريق."],
      ["lina", "لم يفعلها عن قصد يا آدم..."],
      ["n", "شعر آدم بالندم الشديد، فبحث عن سامي ووجده يختبئ خلف الستارة."],
      ["adam", "آسف لأنني صرخت عليك يا سامي. كان ذلك دون قصد، والأصدقاء أهم من أي جائزة."],
      ["n", "مسح سامي دموعه وعانق آدم بامتنان."]
    ], next: "fixing" },

    fixing: { img: "fixing", say: [
      ["adam", "بسرعة يا فريق! هاتوا الشريط اللاصق!"],
      ["n", "أمسك عمر بالصاروخ، ولصقه آدم، ورسمت لينا نجوماً لامعة فوق الكسر، ووضع سامي علماً جميلاً في القمة."],
      ["n", "وعندما تراجعوا للخلف... بدا المشروع أجمل مما كان عليه من قبل!"]
    ], next: "judges" },

    judges: { img: "judges", say: [
      ["n", "وصل الحكّام بألواحهم ونظروا إلى المشروع بإعجاب كبير."],
      ["judge", "هممم... مدهش جداً! أخبرونا عن مشروعكم."],
      ["n", "تشابكت أيدي الأصدقاء الأربعة وحكوا القصة كلها معاً بفخر."]
    ], next: "@judge" },

    // ------------------------------------------------------------ النهايات
    best: { img: "best", say: [
      ["judge", "جائزة أفضل فريق تذهب إلى... آدم ولينا وعمر وسامي!"],
      ["n", "تساقطت الأوراق الملوّنة من السماء! وصفّقت الأستاذة هدى بأعلى صوت."],
      ["huda", "أنتم لم تصنعوا صاروخاً فقط، بل بنيتم صداقة حقيقية!"]
    ], next: "party" },

    party: { img: "party", end: "أفضل أصدقاء للأبد", say: [
      ["n", "في عطلة نهاية الأسبوع، أقام آدم حفلة صداقة في حديقة المنزل مع البالونات وكعكة شوكولاتة كبيرة."],
      ["n", "ركض بسكوت يلاعب الجميع بمرح، وابتسمت ماما بسعادة."],
      ["mom", "أرأيت يا آدم؟ أخبرتك أن الأصدقاء سيأتون."],
      ["adam", "كنتِ محقّة يا ماما! السر كله هو أن تكون لطيفاً!"]
    ]},

    good: { img: "good", end: "الفريق الأكثر إبداعاً", say: [
      ["judge", "لدينا وسام خاص لأكثر مشروع مبدع في المهرجان!"],
      ["n", "إنّه لفريق آدم! قفز الأصدقاء الأربعة وضحكوا من الفرح."],
      ["n", "أخطأ آدم بعض المرات هذا الأسبوع، لكنه تعلّم من كل خطأ."],
      ["n", "والآن أصبح لديه ثلاثة أصدقاء رائعين!"]
    ]},

    okay: { img: "okay", end: "الأصدقاء هم الجائزة الحقيقية", say: [
      ["n", "لم يفز الفريق بكأس هذه المرة."],
      ["n", "لكن بعد المهرجان، جلس الأصدقاء الأربعة على درج المدرسة يتناولون المثلّجات معاً."],
      ["adam", "تعلمون شيئاً؟ أنا لا أحتاج إلى كأس، فأنا أملككم أنتم!"],
      ["n", "تعلّم آدم أن الصداقة الجميلة تحتاج إلى تدريب ولطف كل يوم."]
    ]}
  },

  en: {
    wake: { img: "wake", chapter: "Chapter 1: A Brand New Day", say: [
      ["n", "Ring, ring! The alarm clock sings. Adam opens his eyes, and something wet and warm licks his nose."],
      ["n", "It's Biscuit, his fluffy little puppy!"],
      ["adam", "Good morning, Biscuit! Today is my first day at my new school!"]
    ], next: "breakfast" },
    breakfast: { img: "breakfast", say: [
      ["n", "In the kitchen, Mom has made Adam's favorite pancakes."],
      ["adam", "Mom... what if nobody wants to be my friend?"],
      ["mom", "Just be yourself, my love. Be kind, be brave, and friends will come. I promise."],
      ["n", "Mom gives Adam the biggest, warmest hug."]
    ], next: "schoolgate" },
    schoolgate: { img: "schoolgate", say: [
      ["n", "The new school is big and yellow, with a red door and lots and lots of children."],
      ["n", "Adam holds Mom's hand tight. His tummy feels like it is full of butterflies."],
      ["mom", "Take a deep breath. In... and out. You can do it!"]
    ], next: "classintro" },
    classintro: { img: "classintro", say: [
      ["n", "Adam's teacher is Miss Huda. She has the kindest smile."],
      ["huda", "Everyone, this is Adam! He's new, so let's make him feel welcome."],
      ["huda", "Adam, would you like to tell us something about yourself?"],
      ["n", "Everyone is looking at Adam. What should he do?"]
    ], choices: [
      { t: "Stand up tall and say what you love!", go: "roar", heart: 1, badge: "brave", icon: "🦖" },
      { t: "Give a tiny wave and sit down", go: "shywave", icon: "👋" }
    ]},
    roar: { img: "roar", say: [
      ["adam", "Hi! I'm Adam, and I LOVE dinosaurs! ROOOAR!"],
      ["n", "The whole class giggles. Not a mean giggle. A happy giggle!"],
      ["omar", "Me too! The T-Rex is the best!"],
      ["n", "That's Omar. He has a big, big smile."]
    ], next: "linadesk" },
    linadesk: { img: "linadesk", say: [
      ["n", "Miss Huda gives Adam a seat next to a girl named Lina."],
      ["lina", "Look! I drew a dinosaur too. He's a king, so he has a crown!"],
      ["adam", "Wow! That's the coolest dinosaur ever!"],
      ["n", "Adam's butterflies start to fly away, one by one."]
    ], next: "playground" },
    shywave: { img: "shywave", say: [
      ["n", "Adam's cheeks turn red like tomatoes. He gives a teeny tiny wave and hurries to the back."],
      ["n", "That's okay. Everyone feels shy sometimes."],
      ["n", "He sits next to a quiet boy reading a big book."]
    ], next: "samibook" },
    samibook: { img: "samibook", say: [
      ["n", "Adam peeks at the book. It is full of planets and shiny stars!"],
      ["sami", "Psst... do you like space? I'm Sami."],
      ["adam", "I'm Adam. I really like Saturn. It has rings!"],
      ["n", "Sami smiles a little smile. Adam smiles back."]
    ], next: "playground" },
    playground: { img: "playground", chapter: "Chapter 2: Playtime!", say: [
      ["n", "Riiiing! It's recess time! Everyone runs outside into the sunshine."],
      ["n", "Omar and his friends are playing soccer. Lina is drawing with colorful chalk."],
      ["n", "And Sami is sitting all alone on a bench."],
      ["n", "Adam holds the bag of cookies Mom packed for him. Where should he go?"]
    ], choices: [
      { t: "Ask to join the soccer game", go: "soccer", icon: "⚽" },
      { t: "Draw with Lina", go: "chalkcity", icon: "🖍️" },
      { t: "Sit with Sami, who is alone", go: "bench", heart: 1, badge: "include", icon: "🪑" }
    ]},
    soccer: { img: "soccer", say: [
      ["adam", "Can I play too?"],
      ["omar", "Sure! You're on my team! Kick it, Adam!"],
      ["n", "Adam runs fast, faster, the fastest he has ever run!"],
      ["n", "He pulls back his foot and gives the ball a GIANT kick!"]
    ], next: "ballchalk" },
    ballchalk: { img: "ballchalk", say: [
      ["n", "Whoosh! The ball flies high... and lands BONK, right on Lina's chalk drawing!"],
      ["n", "Her beautiful picture is all smudged."],
      ["lina", "Oh no... my picture..."],
      ["n", "Lina looks very sad. What should Adam do?"]
    ], choices: [
      { t: "Run over and say sorry", go: "rainbowdragon", heart: 1, badge: "sorry", icon: "🙏" },
      { t: "Pretend you didn't see and keep playing", go: "guilty", icon: "🙈" }
    ]},
    rainbowdragon: { img: "rainbowdragon", say: [
      ["adam", "Lina, I'm so sorry! It was an accident. Can I help you fix it?"],
      ["n", "Lina sniffs. Then she smiles."],
      ["lina", "Hmm... what if we turn the smudge into a dragon?"],
      ["n", "Together they draw a giant rainbow dragon. Omar comes and adds a soccer ball for it to play with!"]
    ], next: "lunchbox" },
    guilty: { img: "guilty", say: [
      ["n", "Adam keeps playing. But his tummy feels heavy, like he swallowed a rock."],
      ["n", "He looks back. Lina is walking away, holding her chalk box."],
      ["omar", "Hey Adam... shouldn't we say sorry?"]
    ], next: "apology" },
    apology: { img: "apology", say: [
      ["n", "Adam takes a deep breath and walks over to Lina."],
      ["adam", "Lina, I'm sorry I kicked the ball on your picture. And I'm sorry I didn't say it right away."],
      ["lina", "Thank you for saying sorry, Adam. It's okay now."],
      ["n", "The heavy rock in Adam's tummy disappears. It's never too late to say sorry."]
    ], next: "lunchbox" },
    chalkcity: { img: "chalkcity", say: [
      ["adam", "Can I draw with you?"],
      ["lina", "Yes! Let's draw a whole city!"],
      ["n", "They draw houses and trees, a big sun, a rocket ship, and of course, a dinosaur."],
      ["n", "It is the best chalk city in the whole world!"]
    ], next: "lastchalk" },
    lastchalk: { img: "lastchalk", say: [
      ["n", "Now they want to draw the sky. But oh no, there is only ONE blue chalk left!"],
      ["n", "Adam and Lina both reach for it at the same time."],
      ["n", "What should Adam do?"]
    ], choices: [
      { t: "Break it in half and share", go: "sharechalk", heart: 1, badge: "share", icon: "✂️" },
      { t: "Grab it. I saw it first!", go: "grabchalk", icon: "✋" }
    ]},
    sharechalk: { img: "sharechalk", say: [
      ["n", "Snap! Adam breaks the chalk in two pieces."],
      ["adam", "One for you, and one for me!"],
      ["lina", "You're a great friend, Adam!"],
      ["n", "Lina draws the sky and Adam draws the sea. Other kids come to look. Wow!"]
    ], next: "lunchbox" },
    grabchalk: { img: "grabchalk", say: [
      ["n", "Adam grabs the blue chalk. Lina crosses her arms."],
      ["lina", "That's not fair..."],
      ["n", "Adam draws the sky all by himself. But drawing alone isn't fun at all."],
      ["adam", "Lina... I'm sorry. Let's share it. You can go first."],
      ["n", "Lina smiles again. Sharing feels SO much better."]
    ], next: "lunchbox" },
    bench: { img: "bench", say: [
      ["n", "Adam sits down next to Sami."],
      ["adam", "Hi! Do you want a cookie? My mom makes the best ones."],
      ["n", "Sami's eyes light up like two little stars."],
      ["sami", "Really? Thank you!"]
    ], next: "stars" },
    stars: { img: "stars", say: [
      ["sami", "Did you know there are more stars in the sky than grains of sand on the beach?"],
      ["adam", "Whoa! That's so many!"],
      ["sami", "I'm new too. I came last month. Nobody really plays with me."],
      ["adam", "Well, now you have me!"]
    ], next: "samigoal" },
    samigoal: { img: "samigoal", say: [
      ["n", "Suddenly a soccer ball rolls to their feet. It's Omar!"],
      ["omar", "Adam, wanna play?"],
      ["adam", "Only if Sami can play too!"],
      ["omar", "Of course! The more, the better!"],
      ["n", "And guess what? Sami scores a GOAL! Everyone cheers!"]
    ], next: "lunchbox" },
    lunchbox: { img: "lunchbox", chapter: "Chapter 3: Lunch Time", say: [
      ["n", "Yum! It's lunchtime. Adam opens his lunchbox."],
      ["n", "Inside there's a cheese sandwich and a little note from Mom. It has a big red heart on it."],
      ["mom", "You are awesome. Love, Mom."]
    ], next: "spill" },
    spill: { img: "spill", say: [
      ["n", "Splash! Across the table, Sami knocks over his juice. His whole lunch is soaking wet!"],
      ["n", "Some kids start to giggle. Sami looks like he's going to cry."],
      ["n", "What should Adam do?"]
    ], choices: [
      { t: "Share half your sandwich with Sami", go: "sharefood", heart: 1, badge: "share", icon: "🥪" },
      { t: "Grab napkins and help clean up", go: "cleanup", heart: 1, badge: "help", icon: "🧻" },
      { t: "Giggle with the other kids", go: "giggle", icon: "😆" }
    ]},
    sharefood: { img: "sharefood", say: [
      ["adam", "Here, Sami. You can have half of my sandwich."],
      ["sami", "Thank you, Adam!"],
      ["n", "Then something magical happens. Lina shares her grapes, and Omar shares his apple!"],
      ["n", "Kindness is like that. When one person shares, everyone wants to share."]
    ], next: "fairnews" },
    cleanup: { img: "cleanup", say: [
      ["n", "Adam grabs a big pile of napkins and starts wiping."],
      ["adam", "Laughing at someone isn't nice. Let's help instead!"],
      ["n", "The giggling stops. One by one, the other kids grab napkins and help too."],
      ["sami", "Thanks, everyone!"]
    ], next: "fairnews" },
    giggle: { img: "giggle", say: [
      ["n", "Adam giggles too. Hee hee hee."],
      ["n", "But then he sees Sami's face. A tear is rolling down his cheek."],
      ["n", "Adam thinks: How would I feel if everyone laughed at me?"],
      ["adam", "Sami, I'm sorry I laughed. That wasn't nice. Do you want some of my sandwich?"],
      ["sami", "Okay... thanks, Adam."]
    ], next: "fairnews" },
    fairnews: { img: "fairnews", chapter: "Chapter 4: The Big Project", say: [
      ["huda", "Exciting news, class! On Friday we will have the School Fair!"],
      ["huda", "Each team will build something amazing together."],
      ["n", "Adam's team is Lina, Omar, and Sami. Hooray!"]
    ], next: "argue" },
    argue: { img: "argue", say: [
      ["omar", "Let's build a giant soccer robot!"],
      ["lina", "No, a beautiful painted castle!"],
      ["sami", "A rocket ship that flies to the stars!"],
      ["n", "Everyone talks at the same time. Louder... and louder... and LOUDER!"]
    ], next: "teamsplit" },
    teamsplit: { img: "argue", say: [
      ["n", "Lina crosses her arms. Omar stomps his foot. Sami goes very, very quiet."],
      ["n", "Oh no! The team is falling apart. Adam has to do something!"]
    ], choices: [
      { t: "Let's mix ALL our ideas together!", go: "combine", heart: 1, badge: "team", icon: "🧩" },
      { t: "Let's vote. That's fair!", go: "voting", heart: 1, badge: "team", icon: "🗳️" },
      { t: "We're doing MY idea. A dinosaur!", go: "bossy", icon: "😤" }
    ]},
    combine: { img: "combine", say: [
      ["adam", "Wait! What if we build a ROCKET CASTLE... with a ROBOT DINOSAUR pilot... who plays SOCCER?!"],
      ["n", "Everyone is quiet for one second. Then..."],
      ["kids", "YES! That's AWESOME!"]
    ], next: "building" },
    building: { img: "building", say: [
      ["n", "All week long, the team builds with boxes, tape, glue and paint."],
      ["n", "Lina paints the castle. Omar builds the robot. Sami designs the rocket. Adam makes the dinosaur."],
      ["n", "When everybody helps, the work feels like play!"]
    ], next: "fair" },
    voting: { img: "voting", say: [
      ["n", "Everyone writes their idea on a paper and puts it in a box."],
      ["n", "Sami's rocket ship wins! But Omar looks a little sad."],
      ["adam", "Omar, you're the best builder. Can you build the rocket's engine?"],
      ["omar", "Really? Yeah! I'll make it super strong!"]
    ], next: "building" },
    bossy: { img: "bossy", say: [
      ["adam", "We're doing a dinosaur, and that's FINAL!"],
      ["n", "Nobody says anything. Lina looks at the floor. Sami looks at his shoes."],
      ["omar", "Fine. Build it yourself then."]
    ], next: "alone" },
    alone: { img: "alone", say: [
      ["n", "Adam builds the dinosaur all by himself."],
      ["n", "But its head keeps falling off. Plop! And its tail is wobbly. Wobble wobble."],
      ["n", "His friends sit far away. Building alone is hard... and lonely."],
      ["n", "Adam remembers what Mom said: Be kind. What should he do?"]
    ], choices: [
      { t: "Say sorry and ask for everyone's ideas", go: "bossysorry", heart: 1, badge: "sorry", icon: "🙏" },
      { t: "Keep building all alone", go: "aloneend", icon: "🦕" }
    ]},
    bossysorry: { img: "apology", say: [
      ["adam", "Friends, I'm sorry I was bossy. Your ideas matter too. Can we start again?"],
      ["lina", "Of course! Friends make mistakes sometimes."],
      ["n", "And Adam has a brilliant new idea..."]
    ], next: "combine" },
    aloneend: { img: "aloneend", end: "The Lonely Dinosaur", say: [
      ["n", "On Friday, Adam stands next to his little wobbly dinosaur, all alone."],
      ["n", "That night, Mom gives him a big hug, and Biscuit snuggles on his lap."],
      ["mom", "Being the boss isn't the same as being a friend. But tomorrow is a brand new day to try again."],
      ["n", "Adam nods. Tomorrow, he will listen to his friends."]
    ]},
    fair: { img: "fair", chapter: "Chapter 5: The School Fair", say: [
      ["n", "Friday is here! The school is full of balloons, music, and happy families."],
      ["n", "The team's project stands tall and proud. It's beautiful!"],
      ["n", "The judges will be here any minute!"]
    ], next: "broken" },
    broken: { img: "broken", say: [
      ["n", "Sami runs to fix one last sticker... but he trips! CRASH!"],
      ["n", "The top of the rocket breaks and falls on the floor."],
      ["sami", "Oh no, oh no! I'm so sorry!"],
      ["n", "What should Adam say?"]
    ], choices: [
      { t: "It's okay! Accidents happen. Let's fix it!", go: "fixing", heart: 1, badge: "forgive", icon: "💛" },
      { t: "Sami! You ruined everything!", go: "samicry", icon: "😠" }
    ]},
    samicry: { img: "samicry", say: [
      ["n", "Sami runs away crying. The team is very quiet."],
      ["lina", "He didn't do it on purpose, Adam..."],
      ["n", "Adam feels terrible. He finds Sami hiding behind a curtain."],
      ["adam", "Sami, I'm sorry I shouted. It was an accident. Friends are more important than any prize."],
      ["n", "Sami wipes his tears and gives Adam a hug."]
    ], next: "fixing" },
    fixing: { img: "fixing", say: [
      ["adam", "Quick, team! Tape!"],
      ["n", "Omar holds the rocket. Adam tapes it. Lina paints shiny stars over the cracks. Sami adds a little flag."],
      ["n", "When they step back... it looks even BETTER than before!"]
    ], next: "judges" },
    judges: { img: "judges", say: [
      ["n", "The judges arrive with their clipboards. They look at the project for a long, long time."],
      ["judge", "Hmm... very interesting! Tell us about it."],
      ["n", "The four friends hold hands and tell the whole story, together."]
    ], next: "@judge" },
    best: { img: "best", say: [
      ["judge", "The award for Best Team goes to... Adam, Lina, Omar and Sami!"],
      ["n", "Confetti falls from the sky! Miss Huda claps the loudest of all."],
      ["huda", "You didn't just build a rocket. You built a real friendship."]
    ], next: "party" },
    party: { img: "party", end: "The Best Friends Ever", say: [
      ["n", "That weekend, Adam has a friendship party in his garden, with balloons and a big chocolate cake."],
      ["n", "Biscuit runs around licking everyone. Mom smiles."],
      ["mom", "See? I told you friends would come."],
      ["adam", "You were right, Mom. The secret is being kind!"]
    ]},
    good: { img: "good", end: "The Most Creative Team", say: [
      ["judge", "We have a special ribbon for the Most Creative project!"],
      ["n", "It's for Adam's team! They jump up and down and laugh."],
      ["n", "Adam made some mistakes this week, but he learned from every one."],
      ["n", "And now he has three wonderful friends."]
    ]},
    okay: { img: "okay", end: "Friends Are the Real Prize", say: [
      ["n", "The team doesn't win a prize this time."],
      ["n", "But after the fair, they sit on the school steps eating ice cream together."],
      ["adam", "You know what? I don't need a trophy. I have you guys."],
      ["n", "Adam learned that being a good friend takes practice. And he will keep practicing every day."]
    ]}
  }
};

window.ROUTES = {
  "@judge": (hearts) => hearts >= 5 ? "best" : hearts >= 3 ? "good" : "okay"
};
