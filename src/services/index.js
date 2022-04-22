/*
 * @Description:
 * @Project:
 * @Author: yunfei
 * @Date: 2021-09-28 10:14:27
 * @LastEditors: Libj
 * @lastTime: 2021-11-05 14:59:01
 * @Modified By: yunfei
 * @文件相对于项目的路径: /TrunkFace/src/services/index.js
 */
import { extend } from 'umi-request';
import { notification, message } from 'antd';
import { history } from 'umi';
import Config from '@/config/base.js';
import { setRootFilter } from '@/utils/resize';

let baseUrl = Config.baseUrl;

baseUrl += '/api/v1';

let timeout = 10000; //超时时间

const request = extend({
    prefix: baseUrl,
    timeout: timeout,
    errorHandler: (error, obj) => {
        const { response } = error;
        // let responseText = '';
        // if (response && response.status) {
        //     const { url, status } = response;
        //     responseText = response.text();
        //     notification.error({
        //         message: url,
        //         description: `请求错误 ${status}`,
        //     });
        // }
        return response;
    },
});

const setErrMsg = (data) => {
    if (data) {
        Object.keys(data).forEach((item) => {
            let meassageStr = '';
            meassageStr = item + '：' + data[item].join('');
            message.error(meassageStr);
        });
    }
};

request.interceptors.request.use(async (url, options) => {
    const token = localStorage.getItem('token');
    token && (options.headers.Authorization = 'Token ' + token);
    // console.log('请求拦截', options.url, options);
    // if(options.url === '/overview/total/'){
    //     message.error(`您的账号暂无该接口权限`);
    //     return false
    // }
    return {
        url,
        options,
    };
});

request.interceptors.response.use(
    async (response) => {
        let result;
        const { status, url } = response;
        if (status === 400) {
            const data = await response.clone().json();
            setErrMsg(data);
            return;
        } else if (status === 500) {
            const data = await response.clone().json();
            setErrMsg(data);
            return;
        } else if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            setRootFilter(false); //隐藏遮罩层
            history.replace('/Login');
        } else if (status >= 200 && status <= 300) {
            result = response;
            result.operationText = '操作成功';
        }
        return result;
    },
    { global: false },
);

export default request;
