import { extend } from 'umi-request';
import { notification, message } from 'antd';
import { history } from 'umi';
import Config from '@/config/base.js';

let baseUrl = Config.carbaseUrl;
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
