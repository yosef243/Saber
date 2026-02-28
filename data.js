/* ===== TRANSLATIONS & UI TEXT ===== */
const UI_TEXT = {
    ar: {
        header_prayer_for: "صدقة جارية عن روح",
        header_prayer_text: "اللهم ارحمه واغفر له واجعل قبره روضة من رياض الجنة",
        tab_masbaha: "المسبحة", tab_duas: "الأدعية", tab_azkar: "الأذكار", tab_quran: "القرآن",
        masbaha_cycle: "الدورة:", masbaha_reset: "تصفير",
        dua_deceased: "للمتوفى", dua_general: "أدعية عامة", btn_copy: "نسخ",
        azkar_morning: "الصباح ☀️", azkar_evening: "المساء 🌙", azkar_sleep: "النوم 😴",
        quran_title: "القرآن الكريم", quran_full: "المصحف كاملاً 📖", quran_selected: "سور مختارة:",
        surah_yasin: "سورة يس", surah_mulk: "سورة الملك", surah_kahf: "سورة الكهف",
        sadaqa_title: "الدال على الخير كفاعله 🌸", sadaqa_desc: "استنسخ هذا التطبيق واجعله صدقة جارية باسم من تحب من أمواتكم.", sadaqa_btn: "✨ أنشئ صدقة جارية الآن",
        modal_title: "إنشاء صدقة جارية مخصصة", modal_desc: "أدخل اسم المتوفى ليتم إنشاء رابط خاص يحمل اسمه.", modal_generate: "توليد الرابط الآن", modal_success: "✅ تم إنشاء الرابط بنجاح!", modal_copy: "نسخ الرابط", modal_open: "فتح الرابط",
        ad_label: "إعلان", footer_prayer: "اللهم تقبل منا واجعله في ميزان حسناته", times: "مرات", footer_copy_text: "\n\n(عن روح {name})"
    },
    en: {
        header_prayer_for: "Continuous Charity for",
        header_prayer_text: "O Allah, forgive him, have mercy on him, and make his grave a garden from Paradise.",
        tab_masbaha: "Tasbeeh", tab_duas: "Duas", tab_azkar: "Azkar", tab_quran: "Quran",
        masbaha_cycle: "Cycle:", masbaha_reset: "Reset",
        dua_deceased: "For Deceased", dua_general: "General", btn_copy: "Copy",
        azkar_morning: "Morning ☀️", azkar_evening: "Evening 🌙", azkar_sleep: "Sleep 😴",
        quran_title: "The Holy Quran", quran_full: "Full Quran 📖", quran_selected: "Selected Surahs:",
        surah_yasin: "Surah Ya-Sin", surah_mulk: "Surah Al-Mulk", surah_kahf: "Surah Al-Kahf",
        sadaqa_title: "Guide others to do good 🌸", sadaqa_desc: "Clone this app as a continuous charity for your loved ones.", sadaqa_btn: "✨ Create Sadaqa Jariyah Now",
        modal_title: "Create Custom Sadaqa", modal_desc: "Enter the name of the deceased to generate a special link.", modal_generate: "Generate Link", modal_success: "✅ Link generated successfully!", modal_copy: "Copy Link", modal_open: "Open Link",
        ad_label: "Advertisement", footer_prayer: "O Allah, accept from us and place it in their scale of good deeds", times: "times", footer_copy_text: "\n\n(For the soul of {name})"
    }
};

/* ===== TASBEEH ===== */
const TASBEEH_AZKAR = {
    ar: ["سُبْحَانَ اللَّهِ", "الْحَمْدُ لِلَّهِ", "لَا إِلَهَ إِلَّا اللَّهُ", "اللَّهُ أَكْبَرُ", "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ", "اللَّهُمَّ صَلِّ عَلَى نَبِيِّنَا مُحَمَّدٍ", "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ"],
    en: ["Subhan Allah", "Alhamdulillah", "La ilaha illallah", "Allahu Akbar", "La hawla wa la quwwata illa billah", "Astaghfirullah", "Allahumma salli 'ala Muhammad", "Hasbunallah wa ni'mal wakeel"]
};

/* ===== DUAS ===== */
const DECEASED_DUAS = {
    ar: [
        "اللهم اغفر له وارحمه، وعافه واعف عنه، وأكرم نزله، ووسع مدخله.",
        "اللهم أبدله داراً خيراً من داره، وأهلاً خيراً من أهله، وأدخله الجنة، وأعذه من عذاب القبر.",
        "اللهم اجعل قبره روضة من رياض الجنة، ولا تجعله حفرة من حفر النار.",
        "اللهم افسح له في قبره مد بصره، وافرش قبره من فراش الجنة.",
        "اللهم أعذه من عذاب القبر، وجفاف الأرض عن جنبيها.",
        "اللهم املأ قبره بالرضا، والنور، والفسحة، والسرور.",
        "اللهم إنه في ذمتك وحبل جوارك، فقه فتنة القبر، وعذاب النار.",
        "اللهم إن كان محسناً فزد من حسناته، وإن كان مسيئاً فتجاوز عن سيئاته.",
        "اللهم أدخله الجنة من غير مناقشة حساب، ولا سابقة عذاب.",
        "اللهم آنسه في وحدته، وفي وحشته، وفي غربته.",
        "اللهم أنزله منزلاً مباركاً، وأنت خير المنزلين.",
        "اللهم أنزله منازل الصديقين، والشهداء، والصالحين، وحسن أولئك رفيقاً.",
        "اللهم اجعل عن يمينه نوراً، حتى تبعثه آمناً مطمئناً في نور من نورك.",
        "اللهم انظر إليه نظرة رضا، فإن من تنظر إليه نظرة رضا لا تعذبه أبداً.",
        "اللهم أسكنه فسيح الجنان، واغفر له يا رحمن، وارحمه يا رحيم.",
        "اللهم اعف عنه، فإنك القائل 'ويعفو عن كثير'.",
        "اللهم إنه جاء ببابك، وأناخ بجنابك، فَجُد عليه بعفوك، وإكرامك.",
        "اللهم إن رحمتك وسعت كل شيء، فارحمه رحمة تطمئن بها نفسه.",
        "اللهم احشره مع المتقين إلى الرحمن وفداً.",
        "اللهم شفع فيه نبينا ومصطفاك، واحشره تحت لوائه."
    ],
    en: [
        "O Allah, forgive him and have mercy on him, excuse him and pardon him, and make honorable his reception.",
        "O Allah, grant him a home better than his home, a family better than his family, and protect him from the punishment of the grave.",
        "O Allah, make his grave a garden from the gardens of Paradise, and do not make it a pit of Hell.",
        "O Allah, expand his grave for him as far as his eyes can see, and furnish his grave from the furnishings of Paradise.",
        "O Allah, protect him from the torment of the grave and the squeezing of the earth.",
        "O Allah, fill his grave with contentment, light, space, and gladness.",
        "O Allah, he is under Your care and Your protection, so protect him from the trial of the grave and the torment of the Fire.",
        "O Allah, if he was a doer of good, then increase his good deeds, and if he was a wrongdoer, then overlook his bad deeds.",
        "O Allah, admit him to Paradise without calling him to account and without any precedent of punishment.",
        "O Allah, comfort him in his loneliness, his isolation, and his estrangement.",
        "O Allah, grant him a blessed resting place, for You are the best of hosts.",
        "O Allah, grant him the companionship of the truthful, the martyrs, and the righteous, and what excellent companions they are.",
        "O Allah, place light on his right side until You resurrect him safe and secure in Your light.",
        "O Allah, look at him with a look of pleasure, for whoever You look at with pleasure, You will never punish.",
        "O Allah, admit him to the vastness of Paradise, forgive him O Most Merciful, and have mercy on him.",
        "O Allah, pardon him, for You are the One who says 'And He pardons much'.",
        "O Allah, he has come to Your door, so be generous to him with Your pardon and honor.",
        "O Allah, Your mercy encompasses all things, so grant him a mercy that brings peace to his soul.",
        "O Allah, gather him with the righteous as a delegation to the Most Merciful.",
        "O Allah, grant him the intercession of Your Prophet and chosen one, and gather him under his banner."
    ]
};

const GENERAL_DUAS = {
    ar: [
        "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.",
        "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى.",
        "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ.",
        "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ، وَتَحَوُّلِ عَافِيَتِكَ، وَفُجَاءَةِ نِقْمَتِكَ، وَجَمِيعِ سَخَطِكَ.",
        "اللَّهُمَّ اشْفِ مَرْضَانَا وَمَرْضَى الْمُسْلِمِينَ، وَارْحَمْ مَوْتَانَا وَمَوْتَى الْمُسْلِمِينَ.",
        "اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي.",
        "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ.",
        "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي.",
        "اللهم إني أسألك العافية في الدنيا والآخرة.",
        "اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً.",
        "اللهم أعني على ذكرك وشكرك وحسن عبادتك.",
        "اللهم استر عوراتي وآمن روعاتي، واحفظني من بين يدي ومن خلفي.",
        "اللهم إني أعوذ بك من الهم والحزن، والعجز والكسل، والبخل والجبن.",
        "ربنا لا تزغ قلوبنا بعد إذ هديتنا وهب لنا من لدنك رحمة إنك أنت الوهاب.",
        "اللهم اغفر لي ذنبي كله، دقه وجله، وأوله وآخره، وعلانيته وسره.",
        "اللهم طهر قلبي من النفاق، وعملي من الرياء، ولساني من الكذب، وعيني من الخيانة.",
        "اللهم اكفني بحلالك عن حرامك، وأغنني بفضلك عمن سواك.",
        "اللهم آت نفسي تقواها، وزكها أنت خير من زكاها، أنت وليها ومولاها.",
        "اللهم إني أعوذ بك من جهد البلاء، ودرك الشقاء، وسوء القضاء، وشماتة الأعداء.",
        "يا حي يا قيوم برحمتك أستغيث، أصلح لي شأني كله، ولا تكلني إلى نفسي طرفة عين."
    ],
    en: [
        "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
        "O Allah, I ask You for guidance, piety, chastity, and wealth.",
        "O Turner of the hearts, keep my heart firm upon Your religion.",
        "O Allah, I seek refuge in You from the withdrawal of Your blessing and the change of Your protection.",
        "O Allah, heal our sick and the sick of the Muslims, and have mercy on our dead and the dead of the Muslims.",
        "O Allah, rectify for me my religion, which is the safeguard of my affairs, and rectify for me my worldly affairs in which is my livelihood.",
        "My Lord, make me an establisher of prayer, and [many] from my descendants. Our Lord, and accept my supplication.",
        "O Allah, You are Forgiving and love forgiveness, so forgive me.",
        "O Allah, I ask You for well-being in this world and the Hereafter.",
        "O Allah, I ask You for beneficial knowledge, goodly provision, and acceptable deeds.",
        "O Allah, help me to remember You, to give You thanks, and to perform Your worship in the best manner.",
        "O Allah, conceal my faults, calm my fears, and protect me from before me and behind me.",
        "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice.",
        "Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.",
        "O Allah, forgive me all my sins, the small and the great, the first and the last, the open and the secret.",
        "O Allah, purify my heart from hypocrisy, my deeds from showing off, my tongue from lies, and my eyes from treachery.",
        "O Allah, suffice me with what You have permitted so that I have no need of what You have forbidden, and make me independent of all besides You.",
        "O Allah, grant my soul its piety and purify it, You are the best to purify it, You are its Guardian and Master.",
        "O Allah, I seek refuge in You from the severe trial, the arrival of misery, bad decree, and the rejoicing of enemies.",
        "O Ever-Living, O Sustainer, by Your mercy I seek help, rectify all my affairs and do not leave me to myself even for the blink of an eye."
    ]
};

/* ===== AZKAR WITH COUNTS (c = Required Count) ===== */
const AZKAR = {
    ar: {
        morning: [
            {t:"أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ: (اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...)", c:1},
            {t:"قراءة سورة الإخلاص والمعوذتين", c:3},
            {t:"أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ...", c:1},
            {t:"اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.", c:1},
            {t:"اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ...", c:1},
            {t:"بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.", c:3},
            {t:"رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا.", c:3},
            {t:"سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.", c:100}
        ],
        evening: [
            {t:"أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ: (اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...)", c:1},
            {t:"قراءة سورة الإخلاص والمعوذتين", c:3},
            {t:"أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ...", c:1},
            {t:"اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.", c:1},
            {t:"اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ...", c:1},
            {t:"بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.", c:3},
            {t:"رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا.", c:3},
            {t:"سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.", c:100}
        ],
        sleep: [
            {t:"بِاسْمِكَ رَبِّـي وَضَعْـتُ جَنْـبي، وَبِكَ أَرْفَعُـه، فَإِن أَمْسَـكْتَ نَفْسـي فارْحَـمْها...", c:1},
            {t:"بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.", c:1},
            {t:"سُبْحَانَ اللَّهِ.", c:33},
            {t:"الْحَمْدُ لِلَّهِ.", c:33},
            {t:"اللَّهُ أَكْبَرُ.", c:34},
            {t:"قراءة آية الكرسي.", c:1},
            {t:"قراءة سورة الإخلاص والمعوذتين.", c:3}
        ]
    },
    en: {
        morning: [
            {t:"Ayat Al-Kursi (The Footstool Verse)", c:1},
            {t:"Surah Al-Ikhlas, Al-Falaq, and An-Nas", c:3},
            {t:"We have reached the morning and at this very time unto Allah belongs all sovereignty...", c:1},
            {t:"O Allah, by Your leave we have reached the morning...", c:1},
            {t:"O Allah, You are my Lord, there is none worthy of worship but You...", c:1},
            {t:"In the Name of Allah, Who with His Name nothing can cause harm...", c:3},
            {t:"I am pleased with Allah as my Lord, with Islam as my religion...", c:3},
            {t:"Subhan Allah wa bihamdihi (Glory is to Allah and praise is to Him).", c:100}
        ],
        evening: [
            {t:"Ayat Al-Kursi (The Footstool Verse)", c:1},
            {t:"Surah Al-Ikhlas, Al-Falaq, and An-Nas", c:3},
            {t:"We have reached the evening and at this very time unto Allah belongs all sovereignty...", c:1},
            {t:"O Allah, by Your leave we have reached the evening...", c:1},
            {t:"O Allah, You are my Lord, there is none worthy of worship but You...", c:1},
            {t:"In the Name of Allah, Who with His Name nothing can cause harm...", c:3},
            {t:"I am pleased with Allah as my Lord, with Islam as my religion...", c:3},
            {t:"Subhan Allah wa bihamdihi (Glory is to Allah and praise is to Him).", c:100}
        ],
        sleep: [
            {t:"In Your name my Lord, I lie down and in Your name I rise...", c:1},
            {t:"In Your name O Allah, I live and die.", c:1},
            {t:"Subhan Allah.", c:33},
            {t:"Alhamdulillah.", c:33},
            {t:"Allahu Akbar.", c:34},
            {t:"Ayat Al-Kursi (The Footstool Verse)", c:1},
            {t:"Surah Al-Ikhlas, Al-Falaq, and An-Nas", c:3}
        ]
    }
};
