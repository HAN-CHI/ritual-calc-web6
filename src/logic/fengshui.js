// src/logic/fengshui.js

export function getDayVoid(gz) {
    const list = ["甲子","乙丑", /* ...60甲子陣列... */ ,"癸亥"];
    const idx = list.indexOf(gz);
    if(idx === -1) return ["未知"];
    if(idx < 10) return ["戌(西北)","亥(西北)"];
    // ... 照抄原本的邏輯 ...
    return ["子(正北)","丑(東北)"];
}

export function toTraditional(text) {
    if(!text) return "";
    return text.replace(/龙/g, '龍').replace(/马/g, '馬').replace(/鸡/g, '雞').replace(/猪/g, '豬').replace(/闰/g, '閏');
}