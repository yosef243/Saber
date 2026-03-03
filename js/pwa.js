// ==========================================
// ملف pwa.js (الخدمات، التثبيت، والمشاركة)
// ==========================================

// 1. تثبيت التطبيق (PWA Install)
let deferredPrompt;
const installBtn = document.createElement('button');
installBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;background:var(--primary);color:white;border:none;padding:12px 20px;border-radius:30px;font-weight:bold;z-index:1000;box-shadow:0 4px 15px rgba(0,0,0,0.3);display:none;cursor:pointer;';
document.body.appendChild(installBtn);

window.addEventListener('beforeinstallprompt', (e) => { 
    e.preventDefault(); 
    deferredPrompt = e; 
    updateInstallBtnLang();
    installBtn.style.display = 'block'; 
});

installBtn.onclick = () => { 
    if (deferredPrompt) { 
        deferredPrompt.prompt(); 
        deferredPrompt.userChoice.then((choice) => { 
            if (choice.outcome === 'accepted') installBtn.style.display = 'none'; 
            deferredPrompt = null; 
        }); 
    } 
};

function updateInstallBtnLang() {
    if(installBtn.style.display === 'block') { 
        installBtn.innerText = currentLang === 'ar' ? '📲 تثبيت التطبيق' : '📲 Install App'; 
    }
}

// 2. تحديث المانيفست واسم التطبيق ديناميكياً
function updateDynamicManifest(deceasedName) {
    const manifestElement = document.querySelector('link[rel="manifest"]');
    if (!manifestElement) return;

    const basePath = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
    const startUrl = window.location.href; 

    const dynamicManifest = {
        "name": "صدقة جارية | " + deceasedName,
        "short_name": "Sadaqa",
        "start_url": startUrl,
        "display": "standalone",
        "background_color": "#F4F9F4",
        "theme_color": "#1E6F5C",
        "icons": [
            {"src": basePath + "icons/icon-192x192.png", "sizes": "192x192", "type": "image/png"},
            {"src": basePath + "icons/icon-512x512.png", "sizes": "512x512", "type": "image/png"}
        ]
    };

    const stringManifest = JSON.stringify(dynamicManifest);
    const blob = new Blob([stringManifest], {type: 'application/json'});
    const manifestURL = URL.createObjectURL(blob);
    manifestElement.setAttribute('href', manifestURL);
}

// 3. تسجيل الـ Service Worker (العمل بدون إنترنت والتحديثات)
function initPWA() {
    if ('serviceWorker' in navigator) { 
        navigator.serviceWorker.register('sw.js').then(reg => { 
            reg.addEventListener('updatefound', () => { 
                const newWorker = reg.installing; 
                newWorker.addEventListener('statechange', () => { 
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) { 
                        if(confirm(currentLang === 'ar' ? 'تحديث جديد متاح! هل تريد التحديث؟' : 'New update available! Refresh?')) {
                            window.location.reload(); 
                        }
                    } 
                }); 
            }); 
        }); 
    }
}

// 4. مشاركة الصفحة الحالية (ترقية زر المشاركة ليصبح ذكياً)
function shareCurrentPage() { 
    // الحصول على الاسم المنظف بدون ألقاب
    let cleanName = document.title.split('|')[0].replace(/المرحومة/g, '').replace(/المرحوم/g, '').trim();
    let prefix = (typeof currentGender !== 'undefined' && currentGender === 'f') ? 'المرحومة' : 'المرحوم';
    
    const shareTitle = `${prefix} ${cleanName}`;
    const textAr = `نسألكم الدعاء بالمغفرة والرحمة لـ (${shareTitle}).\nافتح الرابط لقراءة الأذكار بنية الصدقة الجارية:\n${window.location.href}`;
    const textEn = `Please pray for (${cleanName}).\nOpen the link to read Azkar as Sadaqa Jariyah:\n${window.location.href}`;
    const shareText = currentLang === 'ar' ? textAr : textEn;

    if (navigator.share) {
        navigator.share({ title: shareTitle, text: shareText }); 
    } else { 
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`); 
    } 
}

// 5. النوافذ المنبثقة وتوليد الروابط
function openModal() { 
    document.getElementById('sadaqaModal').style.display = 'flex'; 
    document.getElementById('step1').style.display = 'block'; 
    document.getElementById('step2').style.display = 'none'; 
    document.getElementById('deceasedNameInput').value = ''; 
    // إعادة تعيين الراديو للذكر افتراضياً عند فتح النافذة
    const maleRadio = document.querySelector('input[name="gender"][value="m"]');
    if(maleRadio) maleRadio.checked = true;
}

function closeModal() { 
    document.getElementById('sadaqaModal').style.display = 'none'; 
}

function generateSadaqaLink() { 
    let name = document.getElementById('deceasedNameInput').value.trim(); 
    if (!name) {
        alert(currentLang === 'ar' ? "الرجاء كتابة اسم المتوفى أولاً" : "Please enter the deceased's name");
        return; 
    }
    
    // تنظيف الاسم من الألقاب إذا كتبها المستخدم
    name = name.replace(/المرحومة/g, '').replace(/المرحوم/g, '').trim();

    // سحب نوع الجنس المختار
    const genderNode = document.querySelector('input[name="gender"]:checked');
    const gender = genderNode ? genderNode.value : 'm';
    
    if (typeof gtag === 'function') { 
        gtag('event', 'create_sadaqa_link', { 'created_for': name, 'gender': gender }); 
    } 
    
    const baseUrl = window.location.href.split('?')[0]; 
    const newUrl = `${baseUrl}?name=${encodeURIComponent(name)}&g=${gender}`; 
    
    document.getElementById('generatedLinkUrl').value = newUrl; 
    document.getElementById('step1').style.display = 'none'; 
    document.getElementById('step2').style.display = 'block'; 
}

// 6. النسخ الذكي للرسائل والروابط الجديدة
function copyLinkAction() { 
    const linkInput = document.getElementById('generatedLinkUrl').value; 
    let nameInput = document.getElementById('deceasedNameInput').value.trim(); 
    
    // تنظيف الاسم
    nameInput = nameInput.replace(/المرحومة/g, '').replace(/المرحوم/g, '').trim();

    // تحديد اللقب للرسالة بناءً على اختيار المستخدم
    const genderNode = document.querySelector('input[name="gender"]:checked');
    const gender = genderNode ? genderNode.value : 'm';
    const prefix = gender === 'f' ? 'المرحومة' : 'المرحوم';
    
    const message = currentLang === 'ar' 
        ? `صدقة جارية عن روح (${prefix} ${nameInput})\nشاركونا الأجر في قراءة القرآن والأذكار والمسبحة عبر هذا الرابط:\n${linkInput}`
        : `Sadaqa Jariyah for (${nameInput})\nJoin us in reading Azkar via this link:\n${linkInput}`;
        
    navigator.clipboard.writeText(message).then(() => {
        alert(currentLang === 'ar' ? 'تم نسخ الرسالة مع الرابط بنجاح!' : 'Message and link copied!');
    }); 
}

function openLinkAction() { 
    window.open(document.getElementById('generatedLinkUrl').value, '_blank'); 
}
