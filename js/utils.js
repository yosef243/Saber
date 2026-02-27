// ===============================
// دوال مساعدة (صوت، اهتزاز، confetti، ثيم، مشاركة)
// ===============================

// الصوت
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playClick() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
}

// الاهتزاز
function vibrate(duration = 15) {
    if (navigator.vibrate) navigator.vibrate(duration);
}

// Confetti (يتم تحميله من CDN ولكننا نخزنه في الكاش)
function launchConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#1E6F5C', '#E9C46A']
        });
    }
}

// مشاركة الصفحة
function shareCurrentPage() {
    if (navigator.share) {
        navigator.share({
            title: 'المرحوم صبري كامل سليم',
            url: window.location.href
        });
    } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`);
    }
}

// تبديل الثيم (ليلي/نهاري)
function toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    document.body.setAttribute('data-theme', isDark ? '' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    document.getElementById('themeBtn').textContent = isDark ? '🌙' : '☀️';
}

// تهيئة الثيم من localStorage
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.getElementById('themeBtn').textContent = '☀️';
    } else {
        document.getElementById('themeBtn').textContent = '🌙';
    }
}

// Toast بسيط (بديل alert)
function showToast(message, duration = 2000) {
    alert(message); // يمكن تطويرها لاحقاً
}

// ربط الدوال بالنطاق العام
window.shareCurrentPage = shareCurrentPage;
window.toggleTheme = toggleTheme;