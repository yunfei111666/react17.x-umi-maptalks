/*
 * @Author: yunfei
 * @since: 2021-09-09 14:16:52
 * @lastTime: 2021-09-23 17:12:58
 * @文件相对于项目的路径: /TrunkFace/src/services/admin.js
 * @message:
 *
 */
import request from './index';
import request2 from './requestRbac.js';
/**
 * 登录接口
 *
 * @export
 * @param {*} body
 * @param {*} options
 * @return {*}
 */
export async function login(body, options) {
    return request2('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

export async function logout(body, options) {
    return request('/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/**
 * 车辆新增
 * @export
 * @param {*}
 * @return {*}
 */
export async function saveChe(body, options) {
    return request('/che/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}
/**
 * 车辆修改
 * @export
 * @param {*}
 * @return {*}
 */
export async function editChe(body, id, params) {
    return request('/che/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(params || {}),
    });
}
/**
 *删除车辆列表
 * @export
 * @param {*} params
 * @return {*}
 */
export async function deleteChe(params) {
    return request('/che/' + params, {
        method: 'DELETE',
        ...(params || {}),
    });
}

/**
 *获取单车TPG地址
 * @export
 * @param {*} params
 * @return {*}
 */
export async function getTpgUrl(params) {
    return request('/che/tpg_bind/' + params, {
        method: 'GET',
        params,
    });
}
/**
 * 添加单车TPG地址
 * @export
 * @param {*} params
 * @return {*}
 */
export async function saveTpgUrl(body, che_id, params) {
    return request('/che/tpg_bind/' + che_id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        params,
    });
}

/**
 * 获取地图
 * @export
 * @param {*}
 * @return {*}
 */
export async function getMap() {
    return request('/map/', {
        method: 'GET',
    });
}
/**
 * 上传地图
 * @export
 * @param {*}
 * @return {*}
 */
export async function uploadMap(body, options) {
    return request('/map/', {
        method: 'POST',
        requestType: 'form',
        data: body,
        options,
    });
}
/**
 * 地图下发
 * @export
 * @param {*}
 * @return {*}
 */
export async function issueMap(body, options) {
    return request('/map/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        options,
    });
}
/**
 *获取历史统计列表
 * @export
 * @param {*} params
 * @return {*}
 */

export async function getHistoryList(params) {
    return request('/history/', {
        method: 'GET',
        params,
    });
}
/**
 *获取单车历史统计列表
 * @export
 * @param {*} params
 * @return {*}
 */

export async function getCarHistoryList(params) {
    return request('/history_list/', {
        method: 'GET',
        params,
    });
}
/**
 *历史统计导出，车辆故障详情导出 excel，如果是 all 表示所有车
 * @export
 * @param {*} params
 * @return {*}
 */

export async function exportList(params) {
    return request('/history/fault/export/', {
        method: 'GET',
        responseType: 'blob',
        params,
    });
}
/**
 *获取历史单车详情列表
 * @export
 * @param {*} params
 * @return {*}
 */
export async function getBicycleInfoList(params) {
    return request('/history/fault/' + params.che_id, {
        method: 'GET',
        params,
    });
}
/**
 *获取历史统计左上角概览
 * @export
 * @param {*}
 * @return {*}
 */

export async function getHistoryOverview(params) {
    return request('/history/overview/', {
        method: 'GET',
        params,
    });
}

/**
 *获取历史统计右上角故障分类
 * @export
 * @param {*}
 * @return {*}
 */

export async function getHistoryFault(params) {
    return request('/history/fault/', {
        method: 'GET',
        params,
    });
}

/**
 *获取邮箱列表
 * @export
 * @param {*} params
 * @return {*}
 */
export async function getMail(params) {
    return request('/mail/record/', {
        method: 'GET',
        params,
    });
}
/**
 * 运营策略
 * @export
 * @param {*}
 * @return {*}
 */
export async function saveOperation(body, options) {
    return request('/mail/scheduler/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        options,
    });
}
/**
 * 新增收件人
 * @export
 * @param {*}
 * @return {*}
 */
export async function saveEmali(body, options) {
    return request('/mail/recipient/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        options,
    });
}
/**
 * 邮箱导出
 * @export
 * @param {*} params
 * @return {*}
 */
export async function exportMail(params) {
    return request('/mail/record/export', {
        method: 'GET',
        responseType: 'blob',
        params,
    });
}

/**
 *获取发送邮箱记录列表
 * @export
 * @param {*} params
 * @return {*}
 */
export async function getMailRecipient(params) {
    return request('/mail/recipient/', {
        method: 'GET',
        params,
    });
}
/**
 *删除发送邮箱记录列表
 * @export
 * @param {*} params
 * @return {*}
 */
export async function deleteEmail(params) {
    return request('/mail/recipient/' + params, {
        method: 'DELETE',
        ...(params || {}),
    });
}

/**
 * 获取模块配置数据
 *
 * @export
 * @param {*}
 * @return {*}
 */
export async function getMachine(params) {
    return request('/machine/', {
        method: 'GET',
        params,
    });
}
/**
 * 新增机器
 *
 * @export
 * @param {*}
 * @return {*}
 */
export async function saveMachine(body, options) {
    return request('/machine/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/**
 * 修改机器
 *
 * @export
 * @param {*}
 * @return {*}
 */
export async function updateMachine(id, body) {
    return request(`/machine/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
    });
}
/**
 * 删除机器
 *
 * @export
 * @param {*}
 * @return {*}
 */
export async function deleteMachine(id) {
    return request(`/machine/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

//获取车辆列表
export async function getCheId() {
    return request('/che/car_list_info', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

// 测试接口500
export async function generateError() {
    return request(`/generate-error/500`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
/**
 * 获取账户权限信息
 *
 * @export
 * @param {*} body
 * @param {*} options
 * @return {*}
 */
export async function getAccountInfo() {
    return request2(`/system/menu/getRouters`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
/**
 * 获取车辆池
 *
 * @export
 * @param {*} body
 * @param {*} options
 * @return {*}
 */
export async function getCarPools() {
    return request(`/che_pools/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
/**
 * 车辆调度
 *
 * @export
 * @param {*} body
 * @param {*} options
 * @return {*}
 */
export async function updateCarPools(body, options) {
    return request(`/che_pools/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}
/**
 * 注册
 *
 * @export
 * @param {*} body
 * @param {*} options
 * @return {*}
 */
export async function regist(body, options) {
    return request(`/registration/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}
/**
 * 获取停车目的地
 *
 * @export
 * @param {*} body
 * @param {*} options
 * @return {*}
 */
export async function getTargets() {
    return request(`/command/target/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
/**
 * 前往目的地
 *
 * @export
 * @param {*} body
 * @param {*} options
 * @return {*}
 */
export async function goToTarget(body, options) {
    return request(`/command/target/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}
/**
 * 新增禁行区域
 *
 * @export
 * @param {*} body
 * @param {*} options
 * @return {*}
 */
export async function getForbiddenAreas() {
    return request(`/command/nogos-area/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
/**
 * 新增禁行区域
 *
 * @export
 * @param {*} body
 * @param {*} options
 * @return {*}
 */
export async function addForbiddenArea(body, options) {
    return request(`/command/nogos-area/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}
/**
 * 编辑禁行区域
 *
 * @export
 * @param {*} body
 * @param {*} options
 * @return {*}
 */
export async function updateForbidden(body, options) {
    return request(`/command/nogos-area/${body.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}
/**
 * 删除禁行区域
 *
 * @export
 * @param {*} body
 * @param {*} options
 * @return {*}
 */
export async function deleteForbidden(body, options) {
    return request(`/command/nogos-area/${body.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}
