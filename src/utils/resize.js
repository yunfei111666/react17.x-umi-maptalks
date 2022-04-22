/*
 * @Description:
 * @Project:
 * @Author: michelle
 * @Date: 2021-09-16 10:56:23
 * @LastEditors: Libj
 * @LastEditTime: 2022-02-25 11:32:02
 * @Modified By: michelle
 * @FilePath: /TrunkFace/src/utils/resize.js
 */

/**
 * 单位换算 字体大小换算
 * @param {*} val
 * @param {*} initWidth
 * @returns
 */
export const autoSize = (val, initWidth = 1920) => {
    let nowClientWidth = document.documentElement.clientWidth; //当前视口宽度
    return val * (nowClientWidth / initWidth);
};

export const getWidth = () => {
    return document.documentElement.clientWidth; //当前视口宽度
};
// 弹窗背景filter
export const setRootFilter = (bool = false, number = '4') => {
    const root = document.getElementById('root');
    root.style.filter = `blur(${bool ? number + 'px' : ''})`;
};
// 数字处理 小数点后超过两位时保留两位小数，否则不进行更改
export const fixedNumber = (number, length = 2) => {
    let result = number;
    // 传入参数不是数字不进行处理
    if (typeof number !== 'number') {
        return result;
    }
    result = Math.round(number * Math.pow(10, length)) / Math.pow(10, length);
    return result;
};

// 数字处理 计算浮点数相加
export const addFloat = (arg1, arg2) => {
    let r1, r2, m, c;
    try {
        r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace('.', ''));
            arg2 = Number(arg2.toString().replace('.', '')) * cm;
        } else {
            arg1 = Number(arg1.toString().replace('.', '')) * cm;
            arg2 = Number(arg2.toString().replace('.', ''));
        }
    } else {
        arg1 = Number(arg1.toString().replace('.', ''));
        arg2 = Number(arg2.toString().replace('.', ''));
    }
    return (arg1 + arg2) / m;
};
// 数字处理 计算浮点数相减
export const subFloat = (arg1, arg2) => {
    let r1, r2, m, n;
    try {
        r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = r1 >= r2 ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
};

//字号动态处理
export const setFont = (v) => {
    if (v !== undefined) {
        let s = v.toString();
        return s.length >= 9
            ? 'fontSmall'
            : s.length >= 5
            ? 'fontMiddle'
            : 'fontLarge';
    }
};

//换算单位 h/KM
export const times = (num, unit) => {
    if (unit == 'h') {
        switch (true) {
            case num < 24: //小时
                return { num: Math.round(num), unit: 'h' };
                break;
            case num < 24 * 30: //天数
                return { num: Math.round(num / 24), unit: 'day' };
                break;
            case num < 24 * 30 * 12: //月
                return { num: Math.round(num / 24 / 30), unit: 'month' };
                break;
            case num >= 24 * 30 * 12: //年
                return { num: Math.round(num / 24 / 30 / 12), unit: 'year' };
                break;
            default:
                break;
        }
    } else if (unit == 'KM' || unit == 'TEU' || unit == 'count') {
        if (unit == 'count') unit = '';
        switch (true) {
            case num < 10000:
                return { num: Math.round(num), unit: unit };
                break;
            case num >= 10000: //万
                return { num: Math.round(num / 10000), unit: '万  ' + unit };
                break;
            default:
                break;
        }
    } else {
        return { num: num ? fixedNumber(num) : '', unit: unit };
    }
};
