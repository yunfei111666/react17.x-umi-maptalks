import * as THREE from 'three';
import * as maptalks from 'maptalks';
import { getHostInfoValue } from '@/config/hostInfoConfig';
import imageMap from '@/config/2dModelImage';
/**
 *
 * @param {x:...,y:...} position
 * @returns position
 * @describe  获取3d模型的偏移量
 */
export function handleModelOffset(model) {
    const { direction, value } = getHostInfoValue(model.bridgeType);
    model.oldPosition[direction] += value;
    return model.oldPosition;
}
/**
 *
 * @param {*} position
 * @param {*} yaw
 * @returns [ [x,y],[x,y],[x,y],[x,y] ]
 * @describe  根据中心点坐标，旋转角度，宽高，返回四个点坐标
 */
export function calcPoints(position, yaw, area = { width: 0, height: 0 }) {
    let x = position.x;
    let y = position.y;
    let width = area.width;
    let height = area.height;
    // yaw 旋转90度
    let xo = Math.cos(yaw);
    let yo = Math.sin(yaw);
    let y1 = x + (height / 2) * yo;
    let x1 = y - (height / 2) * xo;
    let y2 = x - (height / 2) * yo;
    let x2 = y + (height / 2) * xo;
    return [
        [y1 - (width / 2) * xo, x1 - (width / 2) * yo],
        [y2 - (width / 2) * xo, x2 - (width / 2) * yo],
        [y2 + (width / 2) * xo, x2 + (width / 2) * yo],
        [y1 + (width / 2) * xo, x1 + (width / 2) * yo],
    ];
}

export const getMesh = (s, arr, cheId = '') => {
    s.forEach((v) => {
        if (v.children && v.children.length > 0) {
            getMesh(v.children, arr, cheId);
        } else {
            // 雷达不能被选中
            if (v instanceof THREE.Mesh) {
                if (cheId) {
                    v.cheId = cheId;
                }
                arr.push(v);
            }
        }
    });
};
/**
 *
 * @param type 图片类型       QC 岸桥    YC 场桥
 * @param width 宽
 * @param height 高
 * @param threeLayer 3D图层
 * @param item { name, point } 模型数据
 * @returns void
 * @describe  向3Dlayer上平铺二维图片
 */
export function render2dImage({
    type,
    width,
    height,
    threeLayer,
    item,
    offsetX,
    offsetY,
    offsetZ,
}) {
    type = type.toUpperCase();
    const offset = {
        offsetX: offsetX || 0,
        offsetY: offsetY || 0,
        offsetZ: offsetZ || 0,
    };
    const params = getHostInfoValue(`${type}2d`);
    if (params?.direction && params?.value)
        offset[`offset${params.direction.toUpperCase()}`] = params.value;

    const point = threeLayer.coordinateToVector3(item.point || item);
    const planeGeometry = new THREE.PlaneBufferGeometry(width, height);
    planeGeometry.rotateZ(getHostInfoValue('zYaw') || 0);
    planeGeometry.translate(
        point.x + offset.offsetX,
        point.y + offset.offsetY,
        point.z + offset.offsetZ,
    );
    const planeTexture = new THREE.TextureLoader().load(imageMap[type]);
    // 背景材料
    const planeMaterial = new THREE.MeshBasicMaterial({
        map: planeTexture,
        transparent: true,
    });
    const mesh = new THREE.Mesh(planeGeometry, planeMaterial);
    mesh.name = item.name || type;
    mesh.oldPosition = point;
    mesh.mode = '2d';
    mesh.bridgeType = type;
    threeLayer.addMesh(mesh);
}
// 2维图片
export const showLoadImage = (coordinates, url) => {
    return new maptalks.Marker(coordinates, {
        zIndex: 10,
        symbol: {
            markerFile: url,
            markerWidth: {
                stops: [
                    [7.5, 5],
                    [11, 20],
                ],
            },
            markerHeight: {
                stops: [
                    [7.5, 5],
                    [11, 20],
                ],
            },
        },
    });
};
