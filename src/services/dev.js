/*
 * @Author: yunfei
 * @Date: 2021-11-24 14:52:46
 * @LastEditTime: 2021-11-24 15:22:13
 * @FilePath: /TrunkFace/src/services/dev.js
 * @LastAuthor: Do not edit
 * @Description: dev 接口文件
 */
import request from './index';
/**
 * 打点
 * @export
 * @param
 * {
 *   "type": "POINT",
 *   "control_by_point": {
 *   "x": 0,
 *   "y": 0
 * },
 * "control_by_distance": {
 *   "distance": 0,
 *   "angle": 0
 *   }
 * }
 * @return {*}
 */
export async function addCarModel(body, options) {
    return request('/remote/control/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        options,
    });
}
