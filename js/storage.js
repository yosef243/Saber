// إدارة التخزين المحلي

const STORAGE_KEY = 'sabry_v10_full';

const defaultState = {
    count: 0,
    deceasedIdx: 0,
    generalIdx: 0,
    currentType: 'deceased', // جديد
    currentZekrIdx: 0,
    batchCount: 1
};

function loadData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error('فشل تحميل البيانات', e);
    }
    return { ...defaultState };
}

function saveData(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('فشل حفظ البيانات', e);
    }
}

function getInitialState() {
    const saved = loadData();
    return {
        count: saved.count || 0,
        deceasedIdx: saved.deceasedIdx || 0,
        generalIdx: saved.generalIdx || 0,
        currentType: saved.currentType || 'deceased',
        currentZekrIdx: saved.currentZekrIdx || 0,
        batchCount: saved.batchCount || 1
    };
}

window.loadData = loadData;
window.saveData = saveData;
window.getInitialState = getInitialState;