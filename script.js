// --- 核心工具與數據 ---
const ZODIAC_ICONS = { "鼠": "🐀", "牛": "🐂", "虎": "🐅", "兔": "🐇", "龍": "🐉", "蛇": "🐍", "馬": "🐎", "羊": "🐐", "猴": "🐒", "雞": "🐓", "狗": "🐕", "豬": "🐖" };

// --- 初始化流程 ---
document.addEventListener('DOMContentLoaded', function() {
    initAllSelectors(); // 1. 填入年份、月份、日期選項
    setupEventListeners(); // 2. 綁定按鈕與選單事件
    updateAllDisplays(); // 3. 初始顯示當天數據
});

// 1. 初始化所有下拉選單
function initAllSelectors() {
    // 填入年份 (1920-2050)
    const yearSelectors = ['mainSolarYear', 'inputLunarYear', 'deathYear'];
    yearSelectors.forEach(id => {
        const el = document.getElementById(id);
        if(!el) return;
        for(let y=1920; y<=2050; y++) {
            el.add(new Option(`${y} (${y-1911 >= 1 ? y-1911 : ''}) 年`, y));
        }
    });

    // 填入月份 (1-12)
    const monthSelectors = ['mainSolarMonth', 'deathMonth'];
    monthSelectors.forEach(id => {
        const el = document.getElementById(id);
        if(!el) return;
        for(let m=1; m<=12; m++) el.add(new Option(m + "月", m));
    });

    // 設定初始值 (今天)
    const now = new Date();
    if(document.getElementById('mainSolarYear')) {
        document.getElementById('mainSolarYear').value = now.getFullYear();
        document.getElementById('mainSolarMonth').value = now.getMonth() + 1;
        document.getElementById('deathYear').value = now.getFullYear();
        document.getElementById('deathMonth').value = now.getMonth() + 1;
    }

    // 初始刷新日期 (1-31)
    refreshDayOptions('mainSolarYear', 'mainSolarMonth', 'mainSolarDay');
    refreshDayOptions('deathYear', 'deathMonth', 'deathDay');
    document.getElementById('mainSolarDay').value = now.getDate();
    document.getElementById('deathDay').value = now.getDate();
}

// 2. 綁定事件監聽 (取代 HTML 裡的 onchange)
function setupEventListeners() {
    // 國曆查詢連動
    const calInputs = ['mainSolarYear', 'mainSolarMonth'];
    calInputs.forEach(id => {
        document.getElementById(id).addEventListener('change', () => {
            refreshDayOptions('mainSolarYear', 'mainSolarMonth', 'mainSolarDay');
            updateSolarToLunar();
        });
    });
    document.getElementById('mainSolarDay').addEventListener('change', updateSolarToLunar);

    // 祭祀日期連動
    const cerInputs = ['deathYear', 'deathMonth'];
    cerInputs.forEach(id => {
        document.getElementById(id).addEventListener('change', () => {
            refreshDayOptions('deathYear', 'deathMonth', 'deathDay');
            updateCeremony();
        });
    });
    document.getElementById('deathDay').addEventListener('change', updateCeremony);
}

// 3. 刷新「日」的選項 (根據月份自動判斷 28, 30 或 31 天)
function refreshDayOptions(yId, mId, dId) {
    const y = parseInt(document.getElementById(yId).value);
    const m = parseInt(document.getElementById(mId).value);
    const dSel = document.getElementById(dId);
    if(!dSel) return;

    const currentD = dSel.value;
    dSel.innerHTML = "";
    const daysInMonth = new Date(y, m, 0).getDate();
    for(let d=1; d<=daysInMonth; d++) {
        dSel.add(new Option(d + "日", d));
    }
    // 盡量保留原本選取的日期
    dSel.value = currentD <= daysInMonth ? currentD : 1;
}

// --- 邏輯功能 ---

function updateSolarToLunar() {
    const y = parseInt(document.getElementById('mainSolarYear').value);
    const m = parseInt(document.getElementById('mainSolarMonth').value);
    const d = parseInt(document.getElementById('mainSolarDay').value);
    
    const solar = Solar.fromYmd(y, m, d);
    const lunar = solar.getLunar();
    const sx = lunar.getYearShengXiao();

    document.getElementById('resSolarDisplay').innerText = `西元 ${y} 年 ${m} 月 ${d} 日`;
    document.getElementById('resLunarDisplay').innerText = `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()}`;
    document.getElementById('resWeekText').innerText = `星期${solar.getWeekInChinese()}`;
    document.getElementById('resZodiacTag').innerText = `${ZODIAC_ICONS[sx] || ''} 屬${sx}`;
}

function updateCeremony() {
    const y = parseInt(document.getElementById('deathYear').value);
    const m = parseInt(document.getElementById('deathMonth').value);
    const d = parseInt(document.getElementById('deathDay').value);
    const deathDate = new Date(y, m-1, d);

    // 計算
    const c7 = new Date(deathDate); c7.setDate(deathDate.getDate() + 6);
    const ann = new Date(deathDate); ann.setFullYear(deathDate.getFullYear() + 1);

    const fmt = (date) => `${date.getFullYear()-1911}年 ${date.getMonth()+1}/${date.getDate()}`;
    document.getElementById('c7').innerText = fmt(c7);
    document.getElementById('cAnn').innerText = fmt(ann);
}

function switchTab(id) {
    document.querySelectorAll('.tab-content').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('panel-' + id).classList.add('active');
    document.getElementById('tab-' + id).classList.add('active');
}

function setCalendarMode(mode) {
    document.getElementById('solarInputArea').classList.toggle('hidden', mode === 'lunar');
    document.getElementById('lunarInputArea').classList.toggle('hidden', mode === 'solar');
    document.getElementById('btnSolarMode').classList.toggle('active', mode === 'solar');
    document.getElementById('btnLunarMode').classList.toggle('active', mode === 'lunar');
}

function updateAllDisplays() {
    updateSolarToLunar();
    updateCeremony();
}
