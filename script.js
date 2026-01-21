// --- 核心數據 (修正版) ---
const ZODIAC_ICONS = { "鼠": "🐀", "牛": "🐂", "虎": "🐅", "兔": "🐇", "龍": "🐉", "蛇": "🐍", "馬": "🐎", "羊": "🐐", "猴": "🐒", "雞": "🐓", "狗": "🐕", "豬": "🐖" };
const ZODIAC_DIRECTIONS = {
    "鼠": { best: "W", bad: "S" }, "牛": { best: "S", bad: "E" },
    "虎": { best: "E", bad: "N" }, "兔": { best: "N", bad: "W" },
    "龍": { best: "W", bad: "S" }, "蛇": { best: "S", bad: "E" },
    "馬": { best: "E", bad: "N" }, "羊": { best: "N", bad: "W" },
    "猴": { best: "W", bad: "S" }, "雞": { best: "S", bad: "E" },
    "狗": { best: "E", bad: "N" }, "豬": { best: "N", bad: "W" }
};

// 60 仙命數據庫 (範例)
const XM_DATA = {
    "甲子": { lucky: "子、午、丑、未、壬、丙", bad: "寅、甲、庚、乾、巽、坤", retreat: "申、子、辰", kill: "未 (北方)", small: "入地空亡在庚辛。" },
    "乙丑": { lucky: "子、午、卯、酉、乙、辛", bad: "辰、戌、丑、未", retreat: "巳、酉、丑", kill: "申 (西南)", small: "沖未山。" },
    // ... 這裡請填入您 HTML 原有的完整 XM_DATA 列表
};

// --- 初始化 ---
window.onload = function() {
    initSelectors();
    initXMSelector();
    onSolarInputChange(); // 初始化預設日期顯示
};

function initSelectors() {
    const years = ['mainSolarYear', 'inputLunarYear', 'deathYear', 'bornYear'];
    years.forEach(id => {
        const s = document.getElementById(id);
        for(let y=1920; y<=2050; y++) s.add(new Option(y + "年", y));
    });
    // 預設年份
    document.getElementById('mainSolarYear').value = new Date().getFullYear();
    document.getElementById('deathYear').value = new Date().getFullYear();
    document.getElementById('bornYear').value = 1970;
}

function initXMSelector() {
    const list = Object.keys(XM_DATA);
    const sel = document.getElementById('xmSelector');
    list.forEach(gz => sel.add(new Option(gz, gz)));
}

// --- 分頁切換 ---
function switchTab(id) {
    document.querySelectorAll('.tab-content').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('panel-'+id).classList.add('active');
    document.getElementById('tab-'+id).classList.add('active');
}

// --- 曆法轉換 ---
function onSolarInputChange() {
    const y = parseInt(document.getElementById('mainSolarYear').value);
    const m = parseInt(document.getElementById('mainSolarMonth')?.value || 1);
    const d = parseInt(document.getElementById('mainSolarDay')?.value || 1);
    const solar = Solar.fromYmd(y, m, d);
    displayQueryRes(solar);
}

function displayQueryRes(solar) {
    const lunar = solar.getLunar();
    const sx = lunar.getYearShengXiao();
    document.getElementById('resSolarDisplay').innerText = `西元 ${solar.getYear()} 年 ${solar.getMonth()} 月 ${solar.getDay()} 日`;
    document.getElementById('resLunarDisplay').innerText = `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()}`;
    document.getElementById('resZodiacTag').innerText = `${ZODIAC_ICONS[sx] || ""} 屬${sx}`;
}

// --- 祭祀期日 ---
function updateCeremony() {
    const y = parseInt(document.getElementById('deathYear').value);
    const m = parseInt(document.getElementById('deathMonth').value);
    const d = parseInt(document.getElementById('deathDay').value);
    const date = new Date(y, m-1, d);
    
    const c7 = new Date(date); c7.setDate(date.getDate() + 6);
    const ann = new Date(date); ann.setFullYear(date.getFullYear() + 1);
    
    document.getElementById('c7').innerText = `${c7.getFullYear()-1911}年 ${c7.getMonth()+1}/${c7.getDate()}`;
    document.getElementById('cAnn').innerText = `${ann.getFullYear()-1911}年 ${ann.getMonth()+1}/${ann.getDate()}`;
}

// --- 塔位鑑定 (修正煞位邏輯) ---
function updateTower() {
    const y = parseInt(document.getElementById('bornYear').value);
    const m = parseInt(document.getElementById('bornMonth').value);
    const d = parseInt(document.getElementById('bornDay').value);
    const lunar = Solar.fromYmd(y, m, d).getLunar();
    const sx = lunar.getYearShengXiao();

    document.getElementById('sxDisplay').classList.remove('hidden');
    document.getElementById('towerPlaceholder').classList.add('hidden');
    
    // 計算流年煞位 (三合煞)
    const curYearGZ = Solar.fromDate(new Date()).getLunar().getYearInGanZhi().at(-1);
    let sha = "";
    if(['申','子','辰'].includes(curYearGZ)) sha = "南方";
    else if(['寅','午','戌'].includes(curYearGZ)) sha = "北方";
    else if(['亥','卯','未'].includes(curYearGZ)) sha = "西方";
    else if(['巳','酉','丑'].includes(curYearGZ)) sha = "東方";
    
    document.getElementById('yearLabel').innerText = new Date().getFullYear();
    document.getElementById('currentYearBad').innerText = sha;

    // 方位列表顯示...
}

// --- AI 顧問 ---
async function askAI() {
    const prompt = document.getElementById('aiPrompt').value;
    const resBox = document.getElementById('aiRes');
    const btn = document.getElementById('aiBtn');
    if(!prompt) return;

    btn.innerText = "思考中...";
    resBox.classList.remove('hidden');
    resBox.innerText = "正在諮詢...";

    const apiKey = "YOUR_API_KEY"; // 請替換為您的有效 Key
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        resBox.innerText = data.candidates[0].content.parts[0].text;
    } catch (e) {
        resBox.innerText = "連線失敗，請檢查 API Key 或網路。";
    } finally {
        btn.innerText = "送出諮詢";
    }
}
