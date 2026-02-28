let currentDeceasedName = "المرحوم صبري كامل سليم";
let currentLang = localStorage.getItem('appLang') || 'ar';
const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

let state = { count: 0, deceasedIdx: 0, generalIdx: 0, currentZekrIdx: 0, batchCount: 1, azkarProgress: {}, lastAzkarReset: Date.now() };
const STORAGE_KEY = 'sabry_v22_final';
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

/* PWA Install */
let deferredPrompt;
const installBtn = document.createElement('button');
installBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;background:var(--primary);color:white;border:none;padding:12px 20px;border-radius:30px;font-weight:bold;z-index:1000;box-shadow:0 4px 15px rgba(0,0,0,0.3);display:none;cursor:pointer;';
document.body.appendChild(installBtn);
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; installBtn.innerText = currentLang === 'ar' ? '📲 تثبيت التطبيق' : '📲 Install App'; installBtn.style.display = 'block'; });
installBtn.onclick = () => { if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.then((choice) => { if (choice.outcome === 'accepted') installBtn.style.display = 'none'; deferredPrompt = null; }); } };

/* Language */
function toggleLanguage() { currentLang = currentLang === 'ar' ? 'en' : 'ar'; localStorage.setItem('appLang', currentLang); applyLanguage(); if(installBtn.style.display === 'block') { installBtn.innerText = currentLang === 'ar' ? '📲 تثبيت التطبيق' : '📲 Install App'; } }
function applyLanguage() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.getElementById('langToggleBtn').innerText = currentLang === 'ar' ? 'EN' : 'عربي';
    document.querySelectorAll('[data-i18n]').forEach(el => { const key = el.getAttribute('data-i18n'); if (typeof UI_TEXT !== 'undefined' && UI_TEXT[currentLang] && UI_TEXT[currentLang][key]) { el.innerText = UI_TEXT[currentLang][key]; } });
    updateUI();
    const activeAzkarBtn = document.querySelector('#azkar .azkar-opt.active');
    if(activeAzkarBtn) { const typeMatch = activeAzkarBtn.getAttribute('onclick').match(/'([^']+)'/); if (typeMatch) renderAzkar(typeMatch[1]); }
}

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const customName = urlParams.get('name');
    if (customName && customName.trim() !== "") { currentDeceasedName = customName.trim(); document.querySelectorAll('.deceased-name').forEach(el => el.textContent = currentDeceasedName); document.title = currentDeceasedName + " | Sadaqa"; }
    initTheme(); loadData(); checkAzkarAutoReset(); 
    if(typeof DECEASED_DUAS !== 'undefined' && typeof GENERAL_DUAS !== 'undefined'){
        state.deceasedIdx = state.deceasedIdx || Math.floor(Math.random() * DECEASED_DUAS[currentLang].length);
        state.generalIdx = state.generalIdx || Math.floor(Math.random() * GENERAL_DUAS[currentLang].length);
    }
    applyLanguage(); renderAzkar('morning'); 
    if ('serviceWorker' in navigator) { navigator.serviceWorker.register('sw.js').then(reg => { reg.addEventListener('updatefound', () => { const newWorker = reg.installing; newWorker.addEventListener('statechange', () => { if (newWorker.state === 'installed' && navigator.serviceWorker.controller) { if(confirm(currentLang === 'ar' ? 'تحديث جديد متاح! هل تريد التحديث؟' : 'New update available! Refresh?')) window.location.reload(); } }); }); }); }
});

/* Logic */
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function loadData() { const saved = localStorage.getItem(STORAGE_KEY); if(saved) { try { const parsed = JSON.parse(saved); state = { ...state, ...parsed }; } catch(e) {} } }
function checkAzkarAutoReset() { const now = Date.now(); if (now - state.lastAzkarReset > SIX_HOURS_MS) { state.azkarProgress = {}; state.lastAzkarReset = now; saveData(); } }

let currentAzkarType = 'morning';
function toggleAzkar(type, btn) { document.querySelectorAll('#azkar .azkar-opt').forEach(b => b.classList.remove('active')); btn.classList.add('active'); currentAzkarType = type; renderAzkar(type); }
function renderAzkar(type) { 
    checkAzkarAutoReset(); 
    const list = document.getElementById('azkarList');
    if(typeof AZKAR === 'undefined') return;
    const timesTxt = typeof UI_TEXT !== 'undefined' ? UI_TEXT[currentLang].times : (currentLang === 'ar' ? 'مرات' : 'times');
    let html = '';
    AZKAR[currentLang][type].forEach((zekr, index) => {
        const key = `${type}_${index}`; const currentCount = state.azkarProgress[key] || 0; const target = zekr.c; const isCompleted = currentCount >= target;
        const btnClass = isCompleted ? 'zekr-count-btn completed' : 'zekr-count-btn';
        const btnText = isCompleted ? '✔️' : `${currentCount} / ${target}`;
        html += `<div class="zekr-item"><div class="zekr-text-wrap" style="font-family:'Amiri'">${zekr.t}</div><div class="zekr-bottom-row"><span style="font-size:0.85rem;color:var(--text-sub);opacity:0.8;">${currentLang === 'ar' ? 'الهدف:' : 'Target:'} ${target} ${timesTxt}</span><button class="${btnClass}" onclick="incrementZekr('${type}', ${index}, ${target})" ${isCompleted ? 'disabled' : ''}>${btnText}</button></div></div>`;
    });
    list.innerHTML = html; 
}
function incrementZekr(type, index, target) {
    const key = `${type}_${index}`; if (!state.azkarProgress[key]) state.azkarProgress[key] = 0;
    if (state.azkarProgress[key] < target) { state.azkarProgress[key]++; playClick(); if (navigator.vibrate) navigator.vibrate(10); saveData(); renderAzkar(type); }
}

function playClick() { if (audioCtx.state === 'suspended') audioCtx.resume(); const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain(); osc.frequency.setValueAtTime(800, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05); gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05); osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.05); }
function incrementCounter() { state.count++; playClick(); if (navigator.vibrate) navigator.vibrate(15); if (state.count % 33 === 0) { state.currentZekrIdx = (state.currentZekrIdx + 1) % TASBEEH_AZKAR[currentLang].length; state.batchCount++; confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 }, colors: ['#1E6F5C', '#E9C46A'] }); if (navigator.vibrate) navigator.vibrate([50, 50]); } updateCounterUI(); saveData(); }
function updateCounterUI() { document.getElementById('totalCounter').textContent = state.count; if(typeof TASBEEH_AZKAR !== 'undefined') document.getElementById('dhikrText').textContent = TASBEEH_AZKAR[currentLang][state.currentZekrIdx]; let currentBatch = (state.count % 33); if (state.count > 0 && currentBatch === 0) currentBatch = 33; document.getElementById('batchCounter').textContent = `${currentBatch} / 33`; }
function confirmReset() { if(confirm(currentLang === 'ar' ? 'تصفير عداد المسبحة؟' : 'Reset Counter?')) { state.count = 0; state.currentZekrIdx = 0; state.batchCount = 1; updateCounterUI(); saveData(); } }

let activeDuaType = 'deceased'; 
function toggleDuaCategory(type, btn) { const container = btn.parentElement; container.querySelectorAll('.azkar-opt').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeDuaType = type; renderActiveDua(); }
function renderActiveDua() { if(typeof DECEASED_DUAS === 'undefined') return; const isDeceased = activeDuaType === 'deceased'; const arr = isDeceased ? DECEASED_DUAS[currentLang] : GENERAL_DUAS[currentLang]; const idx = isDeceased ? state.deceasedIdx : state.generalIdx; document.getElementById('activeDuaText').textContent = arr[idx]; document.getElementById('activeDuaCounter').textContent = idx + 1; document.getElementById('activeDuaTotal').textContent = arr.length; }
function navigateDua(dir) { const maxDeceased = DECEASED_DUAS[currentLang].length; const maxGeneral = GENERAL_DUAS[currentLang].length; if (activeDuaType === 'deceased') { state.deceasedIdx += dir; if (state.deceasedIdx >= maxDeceased) state.deceasedIdx = 0; if (state.deceasedIdx < 0) state.deceasedIdx = maxDeceased - 1; } else { state.generalIdx += dir; if (state.generalIdx >= maxGeneral) state.generalIdx = 0; if (state.generalIdx < 0) state.generalIdx = maxGeneral - 1; } renderActiveDua(); saveData(); }
function copyActiveDua() { const isDeceased = activeDuaType === 'deceased'; const text = isDeceased ? DECEASED_DUAS[currentLang][state.deceasedIdx] : GENERAL_DUAS[currentLang][state.generalIdx]; const footerText = typeof UI_TEXT !== 'undefined' ? UI_TEXT[currentLang].footer_copy_text.replace('{name}', currentDeceasedName) : `\n\n(عن روح ${currentDeceasedName})`; const footer = isDeceased ? footerText : ""; navigator.clipboard.writeText(text + footer).then(() => alert(currentLang === 'ar' ? 'تم النسخ' : 'Copied!')); }
function updateUI() { updateCounterUI(); renderActiveDua(); }

function initTheme() { const savedTheme = localStorage.getItem('theme') || 'default'; setTheme(savedTheme, null); }
function setTheme(themeName, btnElement) { if (themeName === 'default') { document.body.removeAttribute('data-theme'); } else { document.body.setAttribute('data-theme', themeName); } localStorage.setItem('theme', themeName); document.querySelectorAll('.color-dot').forEach(dot => dot.classList.remove('active')); if (btnElement) { btnElement.classList.add('active'); } else { const colors = { 'default': 'rgb(30, 111, 92)', 'blue': 'rgb(29, 53, 87)', 'brown': 'rgb(111, 78, 55)', 'dark': 'rgb(17, 24, 39)' }; document.querySelectorAll('.color-dot').forEach(dot => { if (getComputedStyle(dot).backgroundColor === colors[themeName]) { dot.classList.add('active'); } }); } }
function switchTab(id, btn) { document.querySelectorAll('.tab-content').forEach(e => e.classList.remove('active')); document.querySelectorAll('.tab-btn').forEach(e => e.classList.remove('active')); document.getElementById(id).classList.add('active'); btn.classList.add('active'); }
function shareCurrentPage() { if (navigator.share) navigator.share({ title: currentDeceasedName, url: window.location.href }); else window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`); }

function openModal() { document.getElementById('sadaqaModal').style.display = 'flex'; document.getElementById('step1').style.display = 'block'; document.getElementById('step2').style.display = 'none'; document.getElementById('deceasedNameInput').value = ''; }
function closeModal() { document.getElementById('sadaqaModal').style.display = 'none'; }
function generateSadaqaLink() { const name = document.getElementById('deceasedNameInput').value.trim(); if (!name) return; if (typeof gtag === 'function') { gtag('event', 'create_sadaqa_link', { 'created_for': name }); } const baseUrl = window.location.href.split('?')[0]; const newUrl = baseUrl + "?name=" + encodeURIComponent(name); document.getElementById('generatedLinkUrl').value = newUrl; document.getElementById('step1').style.display = 'none'; document.getElementById('step2').style.display = 'block'; }
function copyLinkAction() { const linkInput = document.getElementById('generatedLinkUrl'); linkInput.select(); linkInput.setSelectionRange(0, 99999); navigator.clipboard.writeText(linkInput.value).then(() => alert(currentLang === 'ar' ? 'تم النسخ!' : 'Copied!')); }
function openLinkAction() { window.open(document.getElementById('generatedLinkUrl').value, '_blank'); }
