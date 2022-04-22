/*
 * @Author: yunfei
 * @Date: 2021-10-26 15:34:18
 * @lastTime: 2021-11-11 11:13:09
 * @文件相对于项目的路径: /TrunkFace/src/services/devApi.js
 * @LastAuthor: Do not edit
 * @Description: dev API调试相关接口
 */
import request from './indexDev';
/**
 *获取api所有json数据
 * @export
 * @param {*}
 * @return {*}
 */
export async function getApiJson() {
    return request('/apispec_1.json', {
        method: 'GET',
    });
}
/**
 * 发布
 * @export
 * @param {*}
 * @return {*}
 */
export async function submit(body, api) {
    return request(api, {
        method: 'POST',
        requestType: 'form',
        // headers: {
        //     'Content-Type': 'application/json',
        // },
        data: body,
    });
}
/**
 * 上传文件
 * @export
 * @param {*}
 * @return {*}
 */
export async function uploadFile(body, api) {
    return request(api, {
        method: 'POST',
        requestType: 'form',
        data: body,
    });
}

/**
 * 图片预览
 * @export
 * @param {*}
 * @return {*}
 */
export async function getImgLook(body) {
    return request('/img/look_img', {
        method: 'POST',
        requestType: 'form',
        data: body,
    });
}
