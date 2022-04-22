import request from './carIndexDev';
import Config from '@/config/base.js';

//获取运营记录列表
export async function getOperation(params) {
    return request('/api/v1/records', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        params,
    });
}

//修改问题记录
export async function updateOperation(id, body) {
    return request(`/api/v1/record/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
    });
}

//新增模块/记录
export async function addOperation(body) {
    return request('/api/v1/record', {
        method: 'POST',
        data: body,
    });
}

//删除模块/记录
export async function delOperation(id) {
    return request(`/api/v1/record/${id}`, {
        method: 'DELETE',
    });
}

//上传图片，附件
export const UpLoadImg = Config.carbaseUrl + '/api/v1/upload';
//下载
export const Downloadbag = Config.carHost + '/';

//删除图片
export async function DeleteImg(params) {
    return request('/api/v1/delete_file', {
        method: 'GET',
        params,
    });
}
