// src/main.js
import { XM_DATA, PY_DATA } from './data/funeralData.js';
import { ZODIAC_ICONS, ZODIAC_DIRECTIONS, ELEMENTS, ELEMENT_DATA } from './data/constants.js';
import { getDayVoid, toTraditional } from './logic/fengshui.js';

// --- 全域變數宣告 (為了維持狀態) ---
// 注意：lunar-javascript 函式庫已經在 HTML head 引入，這裡可以直接用 Lunar, Solar

// --- 定義原本的 UI 函數 ---

window.switchTab = function(id) {
    document.querySelectorAll('.tab-content').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('panel-'+id).classList.add('active');
    document.getElementById('tab-'+id).classList.add('active');
}

window.updateTower = function() {
    // ... 把原本 updateTower 的內容搬進來 ...
    // 注意：原本程式碼裡的 ZODIAC_ICONS 現在要確認有從上面 import 進來
}

window.updateXMData = function() {
    const gz = document.getElementById('xmSelector').value;
    const data = XM_DATA[gz]; // 使用 import 進來的數據
    // ... DOM 操作 ...
}

// ... 把所有 HTML 有呼叫到的 function (initSelectors, askAI 等) 都掛到 window 下 ...

// --- 初始化執行 ---
window.onload = function() {
    // ... 原本 window.onload 的內容 ...
    console.log("禾欣生命禮儀系統：模組化載入完成");
};