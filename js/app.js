// التهيئة الرئيسية

let appState = {};

function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
}
window.switchTab = switchTab;

function updateVisitorCounter() {
    fetch('https://api.countapi.xyz/hit/sabry-kamel-memorial-global-v10/visits')
        .then(res => res.json())
        .then(data => {
            document.getElementById('visits').textContent = data.value;
        })
        .catch(() => {
            document.getElementById('visits').textContent = '...';
        });
}

// PWA install
let deferredPrompt;
const installBtn = document.createElement('button');
installBtn.id = 'installBtn';
installBtn.textContent = '📲 تثبيت التطبيق';
installBtn.onclick = () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
            deferredPrompt = null;
            installBtn.style.display = 'none';
        });
    }
};
document.body.appendChild(installBtn);

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
});

// Service Worker registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
        console.log('Service Worker registered');
        reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    if (confirm('تحديث جديد متاح! هل تريد التحديث الآن؟')) {
                        window.location.reload();
                    }
                }
            });
        });
    });
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    appState = getInitialState();
    initMasbaha(appState);
    initDuasAzkar(appState);
    updateVisitorCounter();
});