/*
 * @Author: yunfei
 * @Date: 2021-10-08 14:52:27
 * @lastTime: 2021-11-11 12:45:24
 * @文件相对于项目的路径: /TrunkFace/src/services/common.js
 * @LastAuthor: Do not edit
 * @Description:
 */
import request from './index';
/**
 * 获取每天数据
 * @export
 * @param {*}
 * @return {*}
 */
export async function getDaily(params) {
    return request('/overview/daily/', {
        method: 'GET',
        params,
    });
}

/**
 *获取车辆列表
 * @export
 * @param {*} params
 * @return {*}
 */

export async function getTotle() {
    return request('/overview/total/', {
        method: 'GET',
    });
}

/**
 *获取车辆列表
 * @export
 * @param {*} params
 * @return {*}
 */
export async function getChe(params) {
    return request('/che/', {
        method: 'GET',
        params,
    });
}

/**
 *获取车辆详情
 * @export
 * @param {*} params
 * @return {*}
 */
export async function getCheDetails(params) {
    return request('/che/info/' + params + '/', {
        method: 'GET',
    });
}

/**
 * 获取车辆状态信息
 * @export
 * @param {*}
 * @return {*}
 */

export async function getCheTotal() {
    return request('/overview/che/', {
        method: 'GET',
    });
}

/**
 * 紧急停车
 * @export
 * @param {*}
 * @return {*}
 */
export async function stop(body, options) {
    return request('/command/remote-estop/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

//控车下发
export async function saveConfirm(body) {
    return request('/command/remote-control/', {
        method: 'POST',
        data: body,
    });
}
