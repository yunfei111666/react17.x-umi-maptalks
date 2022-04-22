/*
 * @Author: yunfei
 * @Date: 2021-10-28 11:12:36
 * @LastEditTime: 2021-11-05 15:43:35
 * @FilePath: /TrunkFace/src/pages/TrunkDev/components/Api/apiJson.js
 * @LastAuthor: Do not edit
 * @Description: 临时文件---接口数据模拟
 */
export const apiJson = {
    definitions: {},
    info: {
        description: 'powered by Flasgger',
        termsOfService: '/tos',
        title: 'A swagger API',
        version: '0.0.1',
    },
    paths: {
        '/api/case_test/': {
            post: {
                parameters: [
                    {
                        description: '\u96c6\u5361\u53f7',
                        in: 'formData',
                        name: 'truck_id',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: 'MQTT',
                        enum: [
                            '127.0.0.1:1883',
                            '172.29.60.42:7011',
                            '172.29.60.42:7007',
                        ],
                        in: 'formData',
                        name: 'MQTT',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: '\u4efb\u52a1ID',
                        in: 'formData',
                        name: 'missionId',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: '\u6d4b\u8bd5\u6587\u4ef6',
                        enum: [
                            'c_art.json',
                            'requirements.txt',
                            'app.py',
                            'utils',
                            'templates',
                        ],
                        in: 'formData',
                        name: 'JsonFile',
                        required: true,
                        type: 'string',
                    },
                ],
                responses: {
                    200: {
                        description: 'send success!',
                    },
                    400: {
                        description: 'send failed!',
                    },
                },
                summary: '\u6d4b\u8bd5\u7528\u4f8b',
                tags: ['FMS'],
            },
        },
        '/api/power_mgmt/': {
            post: {
                description:
                    '\u5411\u5355\u8f66\u53d1\u9001\u4efb\u52a1\r<br/>',
                parameters: [
                    {
                        description: '\u96c6\u5361\u53f7',
                        in: 'formData',
                        name: 'truck_id',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: 'MQTT',
                        enum: [
                            '127.0.0.1:1883',
                            '172.29.60.42:7011',
                            '172.29.60.42:7007',
                        ],
                        in: 'formData',
                        name: 'MQTT',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: '\u4e0a\u4e0b\u9ad8\u538b',
                        enum: ['0-\u4e0a\u7535', '0-\u4e0b\u7535'],
                        in: 'formData',
                        name: 'Power',
                        required: true,
                        type: 'string',
                    },
                ],
                responses: {
                    200: {
                        description: 'send success!',
                    },
                    400: {
                        description: 'send failed!',
                    },
                },
                summary: '\u4e0a\u4e0b\u9ad8\u538b\r',
                tags: ['FMS'],
            },
        },
        '/api/push_file/': {
            post: {
                parameters: [
                    {
                        description: '\u6587\u4ef6\u540d',
                        in: 'formData',
                        name: 'file',
                        required: true,
                        type: 'file',
                    },
                ],
                responses: {
                    200: {
                        description: 'send success!',
                    },
                    400: {
                        description: 'send failed!',
                    },
                },
                summary: '\u4e0a\u4f20\u8def\u5f84\r',
                tags: ['\u6587\u4ef6\u5904\u7406'],
            },
        },
        '/api/remove_file/': {
            post: {
                parameters: [
                    {
                        description: '\u6587\u4ef6\u540d',
                        enum: [
                            'c_art.json',
                            'requirements.txt',
                            'app.py',
                            'utils',
                            'templates',
                        ],
                        in: 'formData',
                        name: 'file',
                        required: true,
                    },
                ],
                responses: {
                    200: {
                        description: 'send success!',
                    },
                    400: {
                        description: 'send failed!',
                    },
                },
                summary: '\u5220\u9664\u6587\u4ef6',
                tags: ['\u6587\u4ef6\u5904\u7406'],
            },
        },
        '/api/to_FMS_arrived/': {
            post: {
                parameters: [
                    {
                        description: '\u96c6\u5361\u53f7',
                        in: 'formData',
                        name: 'truck_id',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: 'MQTT',
                        enum: [
                            '127.0.0.1:1883',
                            '172.29.60.42:7011',
                            '172.29.60.42:7007',
                        ],
                        in: 'formData',
                        name: 'MQTT',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: 'transId',
                        in: 'formData',
                        name: 'transId',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: '\u573a\u666f\u9009\u62e9',
                        enum: [
                            '1- Arrived at TP',
                            '2- \u786e\u8ba4\u5b89\u5168\u5b8c\u6210\u4f5c\u4e1a FinishTask',
                            '3- Leave TP',
                        ],
                        in: 'formData',
                        name: 'status',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: '\u4efb\u52a1ID',
                        in: 'formData',
                        name: 'missionId',
                        required: true,
                        type: 'string',
                    },
                ],
                responses: {
                    200: {
                        description: 'send success!',
                    },
                    400: {
                        description: 'send failed!',
                    },
                },
                summary: '\u8865\u53d1\u5230\u8fbe',
                tags: ['TOFMS\u76f8\u5173\u63a5\u53e3'],
            },
        },
        '/api/truck_aline/': {
            post: {
                description: '\u5411\u5355\u8f66\u53d1\u9001\u4efb\u52a1<br/>',
                parameters: [
                    {
                        description: '\u96c6\u5361\u53f7',
                        in: 'formData',
                        name: 'truck_id',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: 'MQTT',
                        enum: [
                            '127.0.0.1:1883',
                            '172.29.60.42:7011',
                            '172.29.60.42:7007',
                        ],
                        in: 'formData',
                        name: 'MQTT',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: '\u4efb\u52a1ID',
                        in: 'formData',
                        name: 'missionId',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: '\u504f\u79fb\u91cf',
                        in: 'formData',
                        name: 'offset',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: '\u5bf9\u4f4d\u6307\u4ee4',
                        enum: ['\u5c31\u4f4d-1', '\u672a\u5c31\u4f4d-2'],
                        in: 'formData',
                        name: 'inposition',
                        required: true,
                        type: 'string',
                    },
                ],
                responses: {
                    200: {
                        description: 'send success!',
                    },
                    500: {
                        description: 'send failed!',
                    },
                },
                summary: '\u5bf9\u4f4d\u4fe1\u606f',
                tags: ['FMS'],
            },
        },
        '/api/truck_mission/': {
            post: {
                description: '\u5411\u5355\u8f66\u53d1\u9001\u4efb\u52a1<br/>',
                parameters: [
                    {
                        description: '\u96c6\u5361\u53f7',
                        in: 'formData',
                        name: 'truck_id',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: 'MQTT',
                        enum: [
                            '127.0.0.1:1883',
                            '172.29.60.42:7011',
                            '172.29.60.42:7007',
                        ],
                        in: 'formData',
                        name: 'MQTT',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: '\u4efb\u52a1\u7c7b\u578b',
                        enum: [
                            'DELIVER \u9001\u7bb1\u5b50',
                            'RECEIVE \u63a5\u7bb1\u5b50',
                            'PARK \u53bb\u505c\u8f66',
                            'MOVE \u6307\u5b9a\u76ee\u7684\u5730\u79fb\u52a8',
                        ],
                        in: 'formData',
                        name: 'MissionType',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: '\u4efb\u52a1ID',
                        in: 'formData',
                        name: 'missionId',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: '\u53c2\u8003\u5750\u6807',
                        in: 'formData',
                        name: 'refPosition',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: '\u4f4d\u7f6e\u7c7b\u578b',
                        enum: [
                            'YCTP',
                            'PSTP',
                            'PSTP_HPB',
                            'PSTP_QPB',
                            'QCTP',
                            'QCTP-1',
                            'PCTP',
                        ],
                        in: 'formData',
                        name: 'locationType',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: '\u76ee\u7684\u5730\u7c7b\u578b',
                        enum: [
                            'LOAD-\u88c5\u8239',
                            'YARDMOVE-\u79fb\u7bb1',
                            'DSCH-\u5378\u8239',
                            'MANUALMOVE-\u4eba\u5de5\u6307\u4ee4\u79fb\u52a8',
                            'PARK-\u505c\u8f66\u573a',
                            'CHARGE-\u5145\u7535\u6869',
                        ],
                        in: 'formData',
                        name: 'operateType',
                        required: true,
                        type: 'string',
                    },
                ],
                responses: {
                    200: {
                        description: 'send success!',
                    },
                    400: {
                        description: 'send failed!',
                    },
                },
                summary: '\u4efb\u52a1\u6d88\u606f',
                tags: ['FMS'],
            },
        },
        '/api/truck_missioncmd/': {
            post: {
                description: '\u5411\u5355\u8f66\u53d1\u9001\u4efb\u52a1<br/>',
                parameters: [
                    {
                        description: '\u96c6\u5361\u53f7',
                        in: 'formData',
                        name: 'truck_id',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: 'MQTT',
                        enum: [
                            '127.0.0.1:1883',
                            '172.29.60.42:7011',
                            '172.29.60.42:7007',
                        ],
                        in: 'formData',
                        name: 'MQTT',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: '\u4efb\u52a1ID',
                        in: 'formData',
                        name: 'missionid',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: '\u4efb\u52a1\u6307\u4ee4\u4e0b\u53d1',
                        enum: [
                            '0-\u53d6\u6d88\u4efb\u52a1',
                            '1-\u786e\u8ba4/\u5f00\u59cb\u4efb\u52a1',
                            '2-\u4f5c\u4e1a\u6267\u884c,\u5f85\u8f66\u8f86\u786e\u8ba4',
                            '3-\u5b89\u5168\u786e\u8ba4,\u5141\u8bb8\u9a76\u79bb\u4f5c\u4e1a\u533a',
                            '4-\u4f5c\u4e1a\u5b8c\u6210\u68c0\u67e5\u786e\u8ba4',
                            '5-\u505c\u8f66\u9501\u8f66',
                            '6-\u8f66\u8f86\u89e3\u9501\u5141\u8bb8\u79fb\u52a8',
                        ],
                        in: 'formData',
                        name: 'missioncmd',
                        required: true,
                        type: 'string',
                    },
                ],
                responses: {
                    200: {
                        description: 'send success!',
                    },
                    400: {
                        description: 'send failed!',
                    },
                },
                summary: '\u4efb\u52a1\u6d88\u606f\u4e0b\u53d1',
                tags: ['FMS'],
            },
        },
        '/api/truck_resume/': {
            post: {
                description:
                    '\u5411\u5355\u8f66\u53d1\u9001\u505c\u8f66\u6062\u590d<br/>',
                parameters: [
                    {
                        description: '\u96c6\u5361\u53f7',
                        in: 'formData',
                        name: 'truck_id',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: 'MQTT',
                        enum: [
                            '127.0.0.1:1883',
                            '172.29.60.42:7011',
                            '172.29.60.42:7007',
                        ],
                        in: 'formData',
                        name: 'MQTT',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: '\u505c\u8f66\u6062\u590d',
                        enum: [
                            '1- \u6062\u590d\u884c\u9a76,\u5355\u8f66\u6267\u884c\u56e0\u4e0a\u4e00\u6b21\u6025\u505c,\u672a\u5b8c\u6210\u7684navi\u6307\u4ee4',
                            '0-\u53d6\u6d88\u884c\u9a76,\u5355\u8f66\u6e05\u695a\u56e0\u4e0a\u4e00\u6b21\u6025\u505c,\u672a\u5b8c\u6210\u7684 navi \u6307\u4ee4,\u7b49\u5f85\u5e73\u53f0\u4e0b\u53d1\u65b0\u7684\u6307\u4ee4\u3002',
                            '2-\u7f13\u505c\u6062\u590d\u6307\u4ee4',
                        ],
                        in: 'formData',
                        name: 'Commnd',
                        required: true,
                        type: 'string',
                    },
                ],
                responses: {
                    200: {
                        description: 'send success!',
                    },
                    400: {
                        description: 'send failed!',
                    },
                },
                summary: '\u505c\u8f66\u6062\u590d',
                tags: ['FMS'],
            },
        },
        '/api/truck_stop/': {
            post: {
                description: '\u5411\u5355\u8f66\u53d1\u9001\u505c\u8f66<br/>',
                parameters: [
                    {
                        description: '\u96c6\u5361\u53f7',
                        in: 'formData',
                        name: 'truck_id',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: 'MQTT',
                        enum: [
                            '127.0.0.1:1883',
                            '172.29.60.42:7011',
                            '172.29.60.42:7007',
                        ],
                        in: 'formData',
                        name: 'MQTT',
                        required: true,
                        type: 'string',
                    },
                    {
                        description: '\u505c\u8f66\u6307\u4ee4',
                        enum: [
                            '0-\u7d27\u6025\u6025\u505c,\u5355\u8f66\u4ee5\u53ef\u5b89\u5168\u6267\u884c\u7684\u6700\u5927\u51cf\u901f\u5ea6\u6267\u884c\u7d27\u6025\u505c\u8f66',
                            '1-\u505c\u6b62\u884c\u9a76,\u5728\u89c4\u5b9a\u5750\u6807\u70b9\u524d\u5b9e\u73b0\u505c\u8f66',
                        ],
                        in: 'formData',
                        name: 'stopCommnd',
                        required: true,
                        type: 'string',
                    },
                ],
                responses: {
                    200: {
                        description: 'send success!',
                    },
                    400: {
                        description: 'send failed!',
                    },
                },
                summary: '\u505c\u8f66\u6307\u4ee4',
                tags: ['FMS'],
            },
        },
        '/img/{filename}': {
            get: {
                parameters: [
                    {
                        description: '\u6587\u4ef6\u540d',
                        enum: [
                            'c_art.json',
                            'requirements.txt',
                            'app.py',
                            'utils',
                            'templates',
                        ],
                        in: 'formData',
                        name: 'file',
                        required: true,
                    },
                ],
                responses: {
                    200: {
                        description: 'send success!',
                    },
                    400: {
                        description: 'send failed!',
                    },
                },
                summary: '\u663e\u793a\u8f68\u8ff9',
                tags: ['\u6587\u4ef6\u5904\u7406'],
            },
        },
    },
    swagger: '2.0',
};
