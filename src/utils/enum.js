/*
 * @Description:
 * @Project: 枚举值
 * @Author: yunfei
 * @Date: 2021-09-16 16:14:50
 * @LastEditors: yunfei
 * @LastEditTime: 2021-09-24 16:54:53
 * @Modified By: yunfei
 * @FilePath: /TrunkFace/src/utils/enum.js
 */

//判断是否为深色系
export const echartsColors = {
    //周作业量和作业效率
    taskBar: {
        'theme-white': {
            titleFontColor: '#404856',
            legendFontColor: '#404856',
            axisLabelFontColor: '#404856',
            axisLineColor: '#404856',
        },
        'theme-black': {
            titleFontColor: '#BECBE9',
            legendFontColor: '#E5E8F0',
            axisLabelFontColor: '#DDE1E9',
            axisLineColor: '#DDE1E9',
        },
        monitor: {
            titleFontColor: '#fff',
            legendFontColor: '#fff',
            axisLabelFontColor: 'rgba(255, 255, 255, 0.7)',
            axisLineColor: 'rgba(255, 255, 255, 0.7)',
        },
    },
    //自动驾驶数据 环形图
    autoPie: {
        'theme-white': {
            titleOneFontColor: '#404856', //文本标题
            titleTwoFontColor: '#404856', //数值标题
            bgColor: '#eee',
        },
        'theme-black': {
            titleOneFontColor: '#7B8094', //文本标题
            titleTwoFontColor: '#E5E8F0', //数值标题
            bgColor: '#41455F',
        },
        monitor: {
            titleOneFontColor: '#CCD1DF', //文本标题
            titleTwoFontColor: '#CCD1DF', //数值标题
            bgColor: 'rgba(234, 241, 255, 0.3)',
        },
    },
    //对位 饼图
    locationPie: {
        'theme-white': {
            legendFontColor: '#404856',
            labelFontColor: '#404856',
        },
        'theme-black': {
            legendFontColor: '#7B8094',
            labelFontColor: '#DDE1E9',
        },
        monitor: {
            legendFontColor: '#7B8094',
            labelFontColor: '#DDE1E9',
        },
    },
    // 车辆信息饼图
    carInformation: {
        'theme-white': {
            titleFontColor: '#404856',
        },
        'theme-black': {
            titleFontColor: '#BECBE9',
        },
        monitor: {
            titleFontColor: '#BECBE9',
        },
    },
    //车辆信息横向柱状图
    carBar: {
        'theme-white': {
            fontColor: '#404856',
            bgColor: '#eee',
        },
        'theme-black': {
            fontColor: '#BECBE9',
            bgColor: '#41455F',
        },
        monitor: {
            fontColor: '#BECBE9',
            bgColor: '#41455F',
        },
    },
};
