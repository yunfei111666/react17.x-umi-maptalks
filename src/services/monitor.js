/*
 * @Description:
 * @Project: Monitor接口
 * @Author: yunfei
 * @Date: 2021-09-15 09:40:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-10-08 14:52:50
 * @Modified By: yunfei
 * @FilePath: /TrunkFace/src/services/monitor.js
 */
import request from './index';

/**
 *获取天气气温
 * @export
 * @param {*} params
 * @return {*}
 */
export async function getWeather(params) {
    return request('https://restapi.amap.com/v3/weather/weatherInfo', {
        method: 'GET',
        prefix: '',
        params,
    });
}
