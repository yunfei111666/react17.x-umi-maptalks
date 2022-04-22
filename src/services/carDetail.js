import request from './carIndexDev';

//节点监控
export async function getNode(body) {
    console.log('body', body);
    return request('/control/node', {
        method: 'POST',
        data: body,
    });
}

// //控车下发
// export async function saveConfirm(body) {
//     return request('/control/remote', {
//         method: 'POST',
//         data: body,
//     });
// }
////绑定车端ip接口
// export async function getBind(body) {
//     console.log('body', body);
//     return request('/bind', {
//         method: 'POST',
//         data: body,
//     });
// }
// //下发停车指令
// export async function getOrder(body, order) {
//     return request('/control/' + order, {
//         method: 'POST',
//         data: body,
//     });
// }
//重置
export async function getReset(body) {
    return request('/control/location-reset', {
        method: 'POST',
        data: body,
    });
}
//pcd点云
export async function getPcd(body) {
    return request('/control/pcd', {
        method: 'POST',
        data: body,
    });
}
//清除底盘故障
export async function clearFalt(body) {
    return request('/control/trouble-remove', {
        method: 'POST',
        data: body,
    });
}

//bug包列表
export async function getBugList(params) {
    return request('/api/v1/show_file', {
        method: 'GET',
        params,
    });
}

//下载bug文件
export async function downLoad(body) {
    return request('/api/v1/compress_file', {
        method: 'POST',
        data: body,
    });
}
//雨水强度
export async function miscInfo(body) {
    return request('/control/misc-info', {
        method: 'PUT',
        data: body,
    });
}
