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

let baseUrl = process.env.NODE_ENV === 'development' ? '' : Config.baseUrlRbac;

baseUrl += '/prod-api';

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
    token && (options.headers.Authorization = 'Bearer ' + token);
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
    async (response, options) => {
        let result;

        const data = await response.clone().json();
        const { code } = data;
        if (code === 400) {
            setErrMsg(data);
            return;
        } else if (code === 500) {
            setErrMsg(data);
            return;
        } else if (code === 401 || code === 403) {
            localStorage.removeItem('token');
            setRootFilter(false); //隐藏遮罩层
            history.replace('/Login');
        } else if (code >= 200 && code <= 300) {
            result = data.data;
        }
        return result;
    },
    { global: false },
);

export default request;
