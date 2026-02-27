// ============================================
// صدقة جارية - المرحوم صبري كامل سليم
// Utils Module - الإصدار 2.1.0
// الجزء 1 من 2
// الدوال المساعدة للتطبيق
// ============================================

// ============================================
// 1. متغيرات عامة
// ============================================
let audioContext = null;

// ============================================
// 2. تهيئة Web Audio Context (للصوت)
// ============================================
function getAudioContext() {
  if (!audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioContext = new AudioContext();
    }
  }
  return audioContext;
}

// ============================================
// 3. تشغيل صوت النقرة (Click Sound)
// ============================================
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) {
      console.log('[Utils] Audio not supported');
      return;
    }
    
    // إعادة تشغيل AudioContext إذا كان معلقاً (iOS)
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);    
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
    
    console.log('[Utils] Click sound played');
  } catch (error) {
    console.error('[Utils] Sound error:', error);
  }
}

// ============================================
// 4. اهتزاز الجهاز (Vibration)
// ============================================
export function vibrate(pattern = [10]) {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
      console.log('[Utils] Vibration:', pattern);
    } else {
      console.log('[Utils] Vibration not supported');
    }
  } catch (error) {
    console.error('[Utils] Vibration error:', error);
  }
}

// ============================================
// 5. تأثير Confetti (قصاصات الورق الملونة)
// ============================================
export function triggerConfetti(canvasId = 'confetti-canvas') {
  try {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.log('[Utils] Confetti canvas not found');
      return;
    }
    
    const ctx = canvas.getContext('2d');
    canvas.hidden = false;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#1E6F5C', '#2ECC71', '#F1C40F', '#E74C3C', '#3498DB', '#9B59B6'];
    
    // إنشاء الجسيمات
    for (let i = 0; i < 100; i++) {      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 5,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 100,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let active = false;
      particles.forEach(p => {
        if (p.life > 0) {
          active = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.2; // جاذبية
          p.life--;
          p.rotation += p.rotationSpeed;
          
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });
      
      if (active) {
        requestAnimationFrame(animate);
      } else {
        canvas.hidden = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    
    animate();
    console.log('[Utils] Confetti triggered');
  } catch (error) {
    console.error('[Utils] Confetti error:', error);
  }
}
// ============================================
// 6. نسخ نص إلى الحافظة (Clipboard)
// ============================================
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      console.log('[Utils] Copied to clipboard:', text.substring(0, 50) + '...');
      return true;
    } else {
      // طريقة بديلة للمتصفحات القديمة
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        console.log('[Utils] Copied (fallback method)');
        return true;
      } catch (e) {
        document.body.removeChild(textarea);
        console.error('[Utils] Copy fallback failed');
        return false;
      }
    }
  } catch (error) {
    console.error('[Utils] Copy error:', error);
    return false;
  }
}

// ============================================
// 7. تبديل الوضع الليلي (Theme Toggle)
// ============================================
export function toggleTheme() {
  try {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // تحديث أيقونة الزر
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      const icon = btn.querySelector('.icon') || btn;
      icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';    }
    
    // تحديث meta theme-color
    const metaTheme = document.getElementById('meta-theme-color');
    if (metaTheme) {
      metaTheme.content = newTheme === 'dark' ? '#0F172A' : '#1E6F5C';
    }
    
    // تتبع الحدث في Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'theme_change', {
        event_category: 'UI',
        event_label: newTheme
      });
    }
    
    console.log('[Utils] Theme changed to:', newTheme);
    return newTheme;
  } catch (error) {
    console.error('[Utils] Theme toggle error:', error);
    return 'light';
  }
}

// ============================================
// 8. تطبيق الثيم المحفوظ
// ============================================
export function applySavedTheme(savedTheme) {
  try {
    document.documentElement.setAttribute('data-theme', savedTheme);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      const icon = btn.querySelector('.icon') || btn;
      icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
    const metaTheme = document.getElementById('meta-theme-color');
    if (metaTheme) {
      metaTheme.content = savedTheme === 'dark' ? '#0F172A' : '#1E6F5C';
    }
    console.log('[Utils] Applied saved theme:', savedTheme);
  } catch (error) {
    console.error('[Utils] Apply theme error:', error);
  }
}// ============================================
// صدقة جارية - المرحوم صبري كامل سليم
// Utils Module - الإصدار 2.1.0
// الجزء 2 من 2
// الدوال المساعدة للتطبيق
// ============================================

// ============================================
// 9. مشاركة التطبيق (Web Share API)
// ============================================
export async function shareApp() {
  try {
    const shareData = {
      title: 'صدقة جارية - المرحوم صبري كامل سليم',
      text: 'تطبيق للذكر والدعاء كصدقة جارية. شاركه ليكون لك أجر الصدقة الجارية.',
      url: window.location.href
    };
    
    if (navigator.share) {
      await navigator.share(shareData);
      console.log('[Utils] Shared successfully');
      
      // تتبع الحدث في Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
          event_category: 'Engagement',
          event_label: 'App Share'
        });
      }
      
      return true;
    } else {
      // طريقة بديلة: نسخ الرابط
      await copyToClipboard(window.location.href);
      showToast('✅ تم نسخ رابط التطبيق!');
      console.log('[Utils] Link copied (share fallback)');
      return true;
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('[Utils] Share error:', error);
    }
    return false;
  }
}

// ============================================
// 10. مشاركة الصفحة الحالية
// ============================================
export async function shareCurrentPage() {  try {
    const shareData = {
      title: document.title,
      text: 'تطبيق صدقة جارية - المرحوم صبري كامل سليم',
      url: window.location.href
    };
    
    if (navigator.share) {
      await navigator.share(shareData);
      return true;
    } else {
      await copyToClipboard(window.location.href);
      showToast('✅ تم نسخ الرابط!');
      return true;
    }
  } catch (error) {
    console.error('[Utils] Share page error:', error);
    return false;
  }
}

// ============================================
// 11. تسجيل Service Worker
// ============================================
export function registerServiceWorker() {
  try {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
          .then((registration) => {
            console.log('[Utils] SW registered:', registration.scope);
            
            // التحقق من التحديثات
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('[Utils] New content available');
                    // إظهار تنبيه التحديث
                    const notification = document.getElementById('update-notification');
                    if (notification) {
                      notification.classList.remove('hidden');
                    }
                  }
                });
              }
            });
          })
          .catch((error) => {            console.error('[Utils] SW registration failed:', error);
          });
      });
    } else {
      console.log('[Utils] Service Worker not supported');
    }
  } catch (error) {
    console.error('[Utils] Register SW error:', error);
  }
}

// ============================================
// 12. عداد الزوار (CountAPI)
// ============================================
export async function fetchVisitorCount() {
  try {
    const response = await fetch('https://api.countapi.xyz/hit/yosef243/sabry-memorial');
    if (!response.ok) {
      throw new Error('CountAPI failed');
    }
    const data = await response.json();
    console.log('[Utils] Visitor count:', data.value);
    return data.value;
  } catch (error) {
    console.error('[Utils] Visitor count error:', error);
    // قيمة افتراضية في حالة الفشل
    return null;
  }
}

// ============================================
// 13. عرض رسالة Toast (إشعار منبثق)
// ============================================
export function showToast(message, duration = 2500, type = 'info') {
  try {
    // إزالة أي toast موجود مسبقاً
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
      existingToast.remove();
    }
    
    // إنشاء عنصر toast
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;
    
    // تنسيق toast
    const colors = {
      info: '#1E6F5C',
      success: '#10B981',      warning: '#F59E0B',
      error: '#EF4444'
    };
    
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: ${colors[type] || colors.info};
      color: white;
      padding: 12px 24px;
      border-radius: 50px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 3000;
      font-family: var(--font-main);
      font-weight: 600;
      font-size: 0.95rem;
      animation: slideUp 0.3s ease;
      max-width: 90%;
      text-align: center;
    `;
    
    document.body.appendChild(toast);
    console.log('[Utils] Toast:', message);
    
    // إخفاء بعد المدة المحددة
    setTimeout(() => {
      toast.style.animation = 'slideDown 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
    
    return true;
  } catch (error) {
    console.error('[Utils] Toast error:', error);
    // Fallback: alert
    alert(message);
    return false;
  }
}

// ============================================
// 14. التحقق من ذكرى الوفاة
// ============================================
export function checkAnniversary(anniversaryDate) {
  try {
    if (!anniversaryDate) {
      return false;
    }
        const today = new Date().toISOString().split('T')[0];
    const anniversary = new Date(anniversaryDate).toISOString().split('T')[0];
    
    if (today === anniversary) {
      console.log('[Utils] Anniversary today!');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[Utils] Anniversary check error:', error);
    return false;
  }
}

// ============================================
// 15. تنسيق الأرقام (للعربية)
// ============================================
export function formatNumberArabic(num) {
  try {
    return new Intl.NumberFormat('ar-EG').format(num);
  } catch (error) {
    console.error('[Utils] Format number error:', error);
    return num.toString();
  }
}

// ============================================
// 16. تنظيف النصوص (Sanitize)
// ============================================
export function sanitizeInput(text) {
  try {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  } catch (error) {
    console.error('[Utils] Sanitize error:', error);
    return text;
  }
}

// ============================================
// 17. تأخير التنفيذ (Debounce)
// ============================================
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============================================
// 18. تأخير التنفيذ (Throttle)
// ============================================
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ============================================
// 19. الحصول على معلومات الجهاز
// ============================================
export function getDeviceInfo() {
  try {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      online: navigator.onLine,
      cookieEnabled: navigator.cookieEnabled,
      screenResolution: `${screen.width}x${screen.height}`,
      windowSize: `${window.innerWidth}x${window.innerHeight}`
    };
  } catch (error) {
    console.error('[Utils] Get device info error:', error);
    return {};
  }
}

// ============================================
// 20. تتبع الأحداث في Google Analytics
// ============================================
export function trackEvent(category, action, label, value = null) {
  try {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value      });
      console.log('[Utils] Event tracked:', category, action, label);
    } else {
      console.log('[Utils] gtag not available');
    }
  } catch (error) {
    console.error('[Utils] Track event error:', error);
  }
}

// ============================================
// 21. تتبع عرض الصفحة في Google Analytics
// ============================================
export function trackPageView(pagePath, pageTitle) {
  try {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'G-48LGD8FVRY', {
        page_path: pagePath,
        page_title: pageTitle
      });
      console.log('[Utils] Page view tracked:', pagePath);
    }
  } catch (error) {
    console.error('[Utils] Track page view error:', error);
  }
}

// ============================================
// 22. التحقق من دعم الميزات
// ============================================
export function checkFeatureSupport() {
  const features = {
    serviceWorker: 'serviceWorker' in navigator,
    localStorage: (() => {
      try {
        return 'localStorage' in window && window.localStorage !== null;
      } catch (e) {
        return false;
      }
    })(),
    clipboard: navigator.clipboard && navigator.clipboard.writeText,
    share: navigator.share,
    vibrate: 'vibrate' in navigator,
    audioContext: window.AudioContext || window.webkitAudioContext,
    pushNotification: 'PushManager' in window,
    notification: 'Notification' in window
  };
  
  console.log('[Utils] Feature support:', features);
  return features;}

// ============================================
// 23. إضافة أنيميشن slideDown لـ Toast
// ============================================
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
  }
`;
document.head.appendChild(style);

// ============================================
// نهاية ملف Utils
// ============================================
console.log('[Utils] Module loaded successfully');