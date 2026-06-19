// ── NAVIGATION ──────────────────────────────────────────────
let history_stack = ['screen-onboarding'];

function goToScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    history_stack.push(id);
}

function goBack() {
    if (history_stack.length > 1) {
        history_stack.pop();
        const prev = history_stack[history_stack.length - 1];
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(prev).classList.add('active');
    }
}

function setNav(btn, screenId) {
    const nav = btn.closest('.bottom-nav');
    nav.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    btn.classList.add('active');
    goToScreen(screenId);
}

// ── TOAST ────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ── DIALECT CHIPS (ONBOARDING) ───────────────────────────────
document.getElementById('dialect-grid').addEventListener('click', e => {
    const chip = e.target.closest('.dialect-chip');
    if (!chip) return;
    document.querySelectorAll('.dialect-chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    document.getElementById('src-lang').value = chip.dataset.lang;
});

// ── SWAP LANGUAGES ───────────────────────────────────────────
function swapLanguages() {
    const src = document.getElementById('src-lang');
    const tgt = document.getElementById('tgt-lang');
    const tmp = src.value;
    src.value = tgt.value;
    tgt.value = tmp;
    const btn = document.getElementById('swap-btn');
    btn.classList.add('spin');
    setTimeout(() => btn.classList.remove('spin'), 250);
}

// ── TRANSLATE ────────────────────────────────────────────────
const mockTranslations = {
    default: [
        "Maayong adlaw! Unsaon nimo?",
        "Pila man kini?",
        "Salamat kaayo!",
        "Asa ang CR?",
        "Tabang! Naa koy problema.",
        "Diin ang ospital?",
    ]
};

const translationAudioMap = {
    'Salamat': './assets/audio/salamat.mp3',
    'Kumusta ka?': './assets/audio/kumusta_ka.mp3',
    'Saan ang banyo?': './assets/audio/saan_ang_banyo.mp3',
    'Magkano ito?': './assets/audio/magkano_ito.mp3',
    'Huwag kang umalis.': './assets/audio/huwag_kang_umalis.mp3',
    'Tulungan mo ako.': './assets/audio/tulungan_mo_ako.mp3',
    'Pwede ba akong pumunta ng banyo?': './assets/audio/pwede_ba_akong_pumunta_ng_banyo.mp3',
    'Ilan ang presyo nito?': './assets/audio/ilan_ang_presyo_nito.mp3',
};

let currentTranslationKey = '';

function doTranslate() {
    const input = document.getElementById('translate-input').value.trim();
    if (!input) { showToast('Type something to translate first'); return; }
    const tgtLang = document.getElementById('tgt-lang').value;
    const results = mockTranslations.default;
    const result = results[Math.floor(Math.random() * results.length)];
    document.getElementById('output-lang-label').textContent = tgtLang + ' translation';
    document.getElementById('output-text').textContent = result;
    document.getElementById('output-box').classList.add('visible');
    currentTranslationKey = input;
    const audioEl = document.getElementById('translation-audio');
    if (translationAudioMap[currentTranslationKey]) {
        audioEl.src = translationAudioMap[currentTranslationKey];
    } else {
        audioEl.removeAttribute('src');
    }
}

function playTranslationAudio() {
    const audioEl = document.getElementById('translation-audio');
    const audioSrc = translationAudioMap[currentTranslationKey];
    if (!audioSrc) {
        showToast('No audio available for this phrase');
        return;
    }
    audioEl.src = audioSrc;
    audioEl.play().then(() => {
        showToast('▶ Playing audio…');
    }).catch(() => {
        showToast('Unable to play audio. Check the file or browser settings.');
    });
}

// ── FILL PHRASE ──────────────────────────────────────────────
function fillPhrase(phrase) {
    document.getElementById('translate-input').value = phrase;
    doTranslate();
}

// ── MIC TOGGLE ───────────────────────────────────────────────
let recording = false;
let recordTimer;
function toggleMic() {
    recording = !recording;
    const btn = document.getElementById('mic-btn');
    const status = document.getElementById('mic-status');
    if (recording) {
        btn.classList.add('recording');
        btn.textContent = '⏹';
        status.textContent = 'Recording… tap to stop';
    } else {
        btn.classList.remove('recording');
        btn.textContent = '🎙️';
        status.textContent = 'Tap to speak';
        document.getElementById('translate-input').value = 'Kumusta po kayo?';
        doTranslate();
    }
}

// ── BOOKMARK ─────────────────────────────────────────────────
function toggleBookmark(btn) {
    btn.classList.toggle('saved');
    showToast(btn.classList.contains('saved') ? 'Saved to library ✓' : 'Removed from saved');
}

// ── CATEGORY FILTER ──────────────────────────────────────────
function setCat(chip, cat) {
    document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    showToast('Showing: ' + chip.textContent);
}

function filterPhrases(val) {
    const rows = document.querySelectorAll('.phrase-row');
    rows.forEach(row => {
        const txt = row.textContent.toLowerCase();
        row.style.display = txt.includes(val.toLowerCase()) ? '' : 'none';
    });
}

// ── PRONUNCIATION PRACTICE ───────────────────────────────────
const practiceWords = {
    cebuano: { word: 'Maayong Buntag', phonetic: '/ ma·a·yong bun·tag /', meaning: 'Good morning' },
    ilocano: { word: 'Naimbag a bigat', phonetic: '/ na·im·bag a bi·gat /', meaning: 'Good morning' },
    waray: { word: 'Maupay nga aga', phonetic: '/ ma·u·pay nga a·ga /', meaning: 'Good morning' },
    hiligaynon: { word: 'Maayong aga', phonetic: '/ ma·a·yong a·ga /', meaning: 'Good morning' },
};

function changePracticeWord() {
    const d = document.getElementById('practice-dialect').value;
    const data = practiceWords[d];
    document.getElementById('practice-word').textContent = data.word;
    document.getElementById('practice-phonetic').textContent = data.phonetic;
    document.getElementById('practice-meaning').textContent = data.meaning;
    document.getElementById('score-fill').style.width = (Math.floor(Math.random() * 30) + 60) + '%';
    document.getElementById('score-pct').textContent = document.getElementById('score-fill').style.width;
}

let pRecording = false;
function practiceRecord() {
    pRecording = !pRecording;
    if (pRecording) {
        showToast('🎙️ Recording… speak now');
        setTimeout(() => {
            pRecording = false;
            const score = Math.floor(Math.random() * 25) + 70;
            document.getElementById('score-fill').style.width = score + '%';
            document.getElementById('score-pct').textContent = score + '%';
            showToast(score >= 85 ? 'Excellent pronunciation! 🎉' : 'Good try! Keep practicing 💪');
        }, 2000);
    }
}

function nextWord() {
    const words = ['Salamat', 'Mahal kita', 'Oo', 'Hindi', 'Sige', 'Wala'];
    const phonetics = ['/ sa·la·mat /', '/ ma·hal ki·ta /', '/ o·o /', '/ hi·ndi /', '/ si·ge /', '/ wa·la /'];
    const meanings = ['Thank you', 'I love you', 'Yes', 'No', 'Okay', 'None / Nothing'];
    const i = Math.floor(Math.random() * words.length);
    document.getElementById('practice-word').textContent = words[i];
    document.getElementById('practice-phonetic').textContent = phonetics[i];
    document.getElementById('practice-meaning').textContent = meanings[i];
    document.getElementById('score-fill').style.width = '0%';
    document.getElementById('score-pct').textContent = '—';
}

function showContextMenu() {
    showToast('💡 Context: Travel / Market / Emergency?');
}
