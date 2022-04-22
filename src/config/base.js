/*
 * @Author: yunfei
 * @since: 2021-10-28 10:15:35
 * @lastTime: 2021-12-10 15:08:54
 * @文件相对于项目的路径: /TrunkFace/src/config/base.js
 * @LastAuthor: Do not edit
 * @message:
 */
// const devHost = '10.11.24.164';
const devHost = '192.168.3.248'; //test
// const devHost = '192.168.11.41';//LHD
// const devHost = '192.168.11.97'; //WYQ

// const devHost = '10.169.96.77'; //宁波
// const devHost = '172.29.60.10';//天津c段
// const devHost = '192.168.4.52';
// const devHost = '192.168.0.15';

const host =
    process.env.NODE_ENV === 'development' ? devHost : window.location.hostname;
const port = 8000;
const portRbac = 3002;
const apiProt = 5000;
const carProt = 3000;

const Config = {
    host,
    baseUrlRbac: 'http://' + host + ':' + portRbac,
    baseUrl: 'http://' + host + ':' + port,
    apiUrl: 'http://' + host + ':' + apiProt,
    wsFull: 'ws://' + host + ':' + port + '/ws/monitor/',
    wsDetails: 'ws://' + host + ':' + port + '/ws/',
    carbaseUrl: 'http://' + host + ':' + carProt,
    wsCarDetail: 'ws://' + host + ':' + carProt + '/monitor/', //单车详情
    carHost: 'http://' + host,
};

export default Config;
