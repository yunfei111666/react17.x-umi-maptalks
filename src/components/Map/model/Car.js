/**
 * 车
 * cheid图层、3d涂层、包络涂层
 * 位置、yaw、离在线、主题
 * init 初始化 update 更新
 */
import * as maptalks from 'maptalks';
import { calcPoints } from '@/utils/tools.js';
export default class Car {
    constructor(props) {
        this.props = props;
        this.cheId = props.cheId;
        this.textLayer = props.textLayer;
        this.threeLayer = props.threeLayer;
        this.envelopeLayer = props.envelopeLayer;
        this.showType = props.type;
        this.model;
        this.marker;
        this.init();
    }
    init = () => {
        if (this.showType == 'complex') {
            this.model = this.props.model.clone();
            this.model.rotation.x = Math.PI / 2;
            this.model.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone();
                }
            });
            this.model.name = this.cheId;
            this.model.scale.set(2, 2, 2);
            this.model.position.copy(
                this.threeLayer.coordinateToVector3(this.props.position),
            );
            this.model.name = `marker_${this.cheId}`;
            this.model.rotation.y = JSON.parse(this.props.yaw) - Math.PI;
            this.threeLayer.addMesh(this.model);
        }
        if (this.props.position instanceof Array) {
            return;
        }
        // marker
        this.marker = new maptalks.Marker(this.props.position, {
            id: this.cheId,
            interactive: true,
            cursor: 'pointer',
            symbol: {
                textFaceName: 'sans-serif',
                textName: this.cheId,
                textFill: '#6E00BE',
                // textHaloFill: 'orange',
                textHaloFill: '#fff',
                textHaloRadius: '0.3',
                textSize: {
                    stops: [
                        [8, 8.5],
                        [13, 30],
                    ],
                },
                textHorizontalAlignment: 'middle', //left | middle | right | auto
                textVerticalAlignment: 'middle', // top | middle | bottom | auto
                textAlign: 'center', //left | right | center | auto
            },
            properties: {
                altitude: 3,
            },
        });
        this.marker.addTo(this.textLayer);
        // 车体包络
        let points = calcPoints(this.props.position, this.props.yaw, {
            width: 15.6,
            height: 3.1,
        });
        this.polygon = new maptalks.Polygon([points], {
            id: this.cheId,
            visible: true,
            editable: true,
            cursor: 'pointer',
            shadowBlur: 0,
            shadowColor: 'black',
            draggable: false,
            dragShadow: false, // display a shadow during dragging
            drawOnAxis: null, // force dragging stick on a axis, can be: x, y
            zIndex: this.props.stateFlow == '离线' ? 5 : 6,
            symbol: {
                lineColor: '#0034E2',
                lineWidth: 2,
                polygonFill: '#003991',
                polygonOpacity: 0.6,
            },
        });
        this.polygon.addTo(this.envelopeLayer);
        this.update({
            position: this.props.position,
            yaw: this.props.yaw,
            stateFlow: this.props.stateFlow,
            theme: this.props.theme,
            visible: this.props.visible,
        });
    };
    // 更新   位置 yaw角  离在线 主题 显隐
    update = ({ position, yaw, stateFlow, theme, visible = false }) => {
        // 新旧状态
        this.oldPosition = position;
        this.oldYaw = yaw;
        this.oldStateFlow = stateFlow;
        this.oldTheme = theme;
        this.oldVisible = visible;

        // 模型
        if (this.model) {
            this.model.position.copy(
                this.threeLayer.coordinateToVector3(position),
            );
            this.model.rotation.y = JSON.parse(yaw) - Math.PI;
            this.model.visible = visible;
            if (stateFlow == '离线') {
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.material.opacity = 0.5;
                    }
                });
            } else {
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.material.opacity = 1;
                    }
                });
            }
        }

        // marker
        if (this.marker && stateFlow == '离线') {
            this.marker.updateSymbol({
                textFill: '#C1C5CF',
                textHaloFill: '#626262',
            });
            this.marker.setZIndex(19);
        } else if (this.marker && stateFlow !== '离线') {
            this.marker.updateSymbol({
                textFill: '#D06900',
                textHaloFill: '#fff',
                textWeight: 'bold',
            });
            this.marker.setZIndex(20);
        }
        this.marker.setCoordinates(position);
        let points = calcPoints(position, yaw, { width: 15.6, height: 3.1 });
        this.polygon.updateSymbol({
            lineColor:
                stateFlow == '离线'
                    ? theme == 'black'
                        ? '#e0e0e0'
                        : '#323338'
                    : '#0034E2',
            polygonFill:
                stateFlow == '离线'
                    ? theme == 'black'
                        ? '#a0a0a0'
                        : '#828D9F'
                    : '#003991',
            textWeight: 'bold',
        });
        this.polygon.setCoordinates([points]);

        this.controlsShowCar(visible);
    };
    controlsShowCar = (visible) => {
        if (visible) {
            this.marker.show();
            this.polygon.show();
        } else {
            this.marker.hide();
            this.polygon.hide();
        }
        this.model && (this.model.visible = visible);
    };
}
