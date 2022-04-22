/*
 * @Description:
 * @Project:
 * @Author: yunfei
 * @Date: 2021-09-28 10:14:27
 * @LastEditors: Please set LastEditors
 * @lastTime: 2021-11-05 15:00:02
 * @Modified By: michelle
 * @文件相对于项目的路径: /TrunkFace/src/services/indexDev.js
 */
import { extend } from 'umi-request';
import { notification, message } from 'antd';
import { history } from 'umi';
import Config from '@/config/base.js';

let baseUrl = Config.apiUrl;
let timeout = 10000; //超时时间
const request = extend({
    prefix: baseUrl,
    timeout: timeout,
    errorHandler: (error, obj) => {
        const { response } = error;
        return response;
    },
});
export default request;
