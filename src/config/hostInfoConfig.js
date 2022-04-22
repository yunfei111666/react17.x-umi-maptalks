import config from '@/config/base.js';

// QC 岸桥  YC 场桥  SC 堆高机  LC 锁站
// direction 偏移方向     value 偏移量
export const hostInfo = [
    //WYQ
    {
        host: '10.169.96.77',
        title: '舟山甬舟集装箱码头有限公司',
        modelPath: './glb/car.glb',
        position: [121.864067, 29.990771],
        isAlign: '0',
        yYaw: 0.5,
        zYaw: 2.07,
        QC: {
            direction: 'x',
            value: -42,
        },
        YC: {
            direction: 'x',
            value: 0,
        },
        QC2d: {
            direction: 'x',
            value: -89,
        },
        FL2d: {
            direction: 'x',
            value: 0,
        },
    },
    //test
    {
        host: '192.168.3.248',
        title: '天津C段集装箱码头有限公司',
        modelPath: './glb/art_draco.gltf',
        position: [117.78067, 39.246083],
        isAlign: '1', //是否显示对位信息
        yYaw: -2.91,
        zYaw: -1.34,
        QC: {
            direction: 'x',
            value: -27,
        },
        YC: {
            direction: 'x',
            value: 0,
        },
        QC2d: {
            direction: 'x',
            value: 10,
        },
        FL2d: {
            direction: 'x',
            value: 0,
        },
    },
    //天津
    {
        host: '172.29.60.10',
        title: '天津C段集装箱码头有限公司',
        modelPath: './glb/art_draco.gltf',
        position: [117.78067, 39.246083],
        isAlign: '1', //是否显示对位信息,
        yYaw: -2.91,
        zYaw: -1.34,
        QC: {
            direction: 'x',
            value: -27,
        },
        YC: {
            direction: 'x',
            value: 0,
        },
        QC2d: {
            direction: 'x',
            value: 10,
        },
        FL2d: {
            direction: 'x',
            value: 0,
        },
    },
    //宁波
    {
        host: '10.169.96.77',
        title: '舟山甬舟集装箱码头有限公司',
        modelPath: './glb/car.glb',
        position: [121.864067, 29.990771],
        isAlign: '0',
        yYaw: 0.5,
        zYaw: 2.07,
        QC: {
            direction: 'x',
            value: -42,
        },
        YC: {
            direction: 'x',
            value: 0,
        },
        QC2d: {
            direction: 'x',
            value: -89,
        },
        FL2d: {
            direction: 'x',
            value: 0,
        },
    },
];
export function getHostInfoValue(key) {
    const host = config.host;
    const value = hostInfo.find((h) => h.host === host)?.[key];
    // if (value === undefined) {
    //     throw new Error(
    //         `hostInfoConfig中没有${host}的配置或该配置下没有${key}属性`,
    //     );
    // }
    return value;
}
