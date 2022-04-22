/*
 * @Author: JackFly
 * @since: 2021-08-30 11:19:42
 * @lastTime: 2022-01-21 10:21:25
 * @文件相对于项目的路径: /TrunkFace/src/components/Map/MapSite/index.js
 * @message:
 */
import React, { Component } from 'react';
import { connect } from 'umi';
import * as maptalks from 'maptalks';
import '@root/node_modules/maptalks/dist/maptalks.css';
import * as THREE from 'three';
import { ThreeLayer } from 'maptalks.three';
import { addEnvironment } from '../model/Environment';
import RingShield from '../model/RingShield';
import Car from '../model/Car';
import WaveWall from '../model/WaveWall';
import MapLegend from '../MapLegend';
import { getMap, getForbiddenAreas } from 'services/admin';
import Loading from 'components/Loding';
import Cache from '@/utils/cache.js';
import { getModelManager } from '@/utils/loadModel.js';
import { getMesh, handleModelOffset, render2dImage } from '@/utils/tools.js';
import { MapStyle } from '../model/MapStyle';
import { speech, play, stop } from '@/utils/speech.js';
import { notification, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import style from '../index.less';
import './index.less';
import CarControl from '../../CarControl/index.js';
import { getHostInfoValue } from '@/config/hostInfoConfig';
import { cloneDeep } from 'lodash';
import eventBus from '@/utils/eventBus.js';
class MapTools extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alarmMap: null,
            map: null,
            mapData: null,
            timeOut: null, //雷达定时器
            StaticLocks: [], //锁站数据
            StaticSuodao: [], //锁岛数据
            mapLegend: false,
            mapConfig: {
                center: [0, 0],
                zoom: 7.5,
                pitch: 0,
                bearing: 0,
                dragPan: false,
                dragPitch: true,
                dragRotate: true,
                spatialReference: {
                    projection: 'identity',
                },
                overviewControl: false,
                attribution: false,
                // 性能优化
                hitDetect: false,
                seamlessZoom: true, //	是否使用无缝缩放模式
                // layerCanvasLimitOnInteracting: 0, //交互时在地图上绘制图层画布的限制，设置它以提高性能。
                fog: false, //	是否在远处绘制雾
                // fogColor:[r,g,b] //雾的颜色：[r, g, b]
                layerSwitcherControl: {
                    position: 'bottom-right',
                    // title of base layers
                    baseTitle: 'Base Layers',
                    // title of layers
                    overlayTitle: 'Layers',
                    // layers you don't want to manage with layer switcher
                    excludeLayers: [],
                    // css class of container element, maptalks-layer-switcher by default
                    containerClass: 'maptalks-layer-switcher',
                },
            },
            initOptions: {
                mapOptions: null,
            },
            layerConfig: {
                debug: false, //
                altitude: 0, //层高度
                opacity: 1, //透明度
                zIndex: 10, //图层
                geometryEvents: false, //启用/禁用触发几何事件，禁用它以提高性能。
                enableSimplify: false, //是否在渲染前简化几何图形。
                hitDetect: false, // 命中检测 禁用提高性能
                forceRenderOnMoving: true,
                forceRenderOnZooming: true,
                forceRenderOnRotating: true,
                // cursor:	, //图层的光标样式
                // defaultIconSize:[20,20], //标记图标的默认大小
                // enableAltitude: true, //是否开启带高度渲染几何体，默认为false
                // altitudeProperty: 'altitude', //几何的高度属性名称，如果 enableAltitude 为真，则默认为“高度”
                // drawAltitude: false, //是否绘制高度：标记的垂直线，线的垂直多边形
            },
            miniMapLayer: {
                //单车详情图层
                locker3DArr: null, //锁站图层
                EboxModel: null, //电箱模型
                EpileModel: null, //电桩模型
                suodaoModel: null, //锁岛模型
                EboxArr: [], //电箱位置记录
                EpileArr: [], //电桩位置记录
                suodaoArr: [], //锁岛位置记录
                quayCraneModelArr: null, //岸桥模型
                changQiaoModel: null, //场桥模型
                carModel: null, //车辆模型
            },
            mapStyle: {},
            loader: null,
            needAddCarList: true,
            isShowWatch: false, //视角选择面板，默认隐藏
            config: {
                theme: localStorage.theme
                    ? localStorage.theme.split('theme-')[1]
                    : 'white',
                tools: true,
                ...this.props.config,
            },
            parameters: {
                elevation: 20,
                azimuth: 70,
            },
            // 地图环境依赖坐标
            envBasePosition: null,
            // 电箱 电桩位置记录
            EboxArr: [],
            EpileArr: [],
            // 定位
            performance: localStorage.getItem('performance') || 'simple',
            isLoading: true,
            socnotif: [],
            // 3D模型点击事件
            mouse: new THREE.Vector2(),
            raycaster: new THREE.Raycaster(),
            totalArr: [],
            // 所有在线车辆字典
            allLiveCarDict: {},
            // 所有场桥
            allChangqiao: {},
            drawToolLayer: null,
            drawTool: null,
            stopBgColor: '#FFA845',
            editingGeo: null,
            showBox: false,
            activeCarId: null,
        };
        this.closeCarControl = this.closeCarControl.bind(this);
    }
    componentDidMount() {
        this.init();
        this.setState({
            alarmMap: new Cache(),
        });
        this.props.setChild(this);
        eventBus.addListener('editForbidden', (geo) =>
            this.handleEditForbidden(geo),
        );
        eventBus.addListener('reloadForbiddenAreas', () =>
            this.initForbiddenData(),
        );
    }

    componentWillUnmount() {
        if (speech) stop('');
        if (notification) notification.destroy();
        if (this.state.alarmMap) this.state.alarmMap.clear();
        if (this.state.map) this.state.map.remove();
        this.triggerDispatch('trackingCar', { trackingCar: null });
        if (this.state.performance === 'complex') {
            const canvas = document.getElementById('map');
            canvas.removeEventListener('click', this.threeModelClickEvent);
        }
        this.setState = (state, callback) => {
            return;
        };
    }
    componentDidUpdate() {
        if (document.visibilityState !== 'visible') {
            return;
        }
        this.animate();
    }
    init() {
        this.setState({
            mapStyle: MapStyle(this.state.config.theme),
        });
        getMap()
            .then((data) => {
                if (data && data.type !== 'FeatureCollection') {
                    //maptalks json
                    this.setState({
                        map: maptalks.Map.fromJSON('map', data),
                        mapData: data,
                    });
                } else {
                    // geojson
                    const map = new maptalks.Map('map', this.state.mapConfig);
                    this.setState({
                        map: map,
                        mapData: data,
                    });
                    this.addLayers([
                        {
                            name: 'Map',
                            config: {
                                zIndex: 1,
                            },
                        },
                        {
                            name: 'drawLayer',
                            config: {
                                zIndex: 10,
                            },
                        },
                    ]);
                }
                //接收锁岛锁站数据信息
                if (data && data.design.lockJson.length > 0) {
                    let locks = [];
                    let suodao = [];
                    let lockArr = JSON.parse(data.design.lockJson);
                    lockArr.forEach((item, key) => {
                        locks.push(item.position);
                        suodao.push(item.center);
                    });
                    this.setState({
                        StaticLocks: locks, //锁站数据
                        StaticSuodao: suodao, //锁岛数据
                    });
                }
                // 初始化地图工具
                const map = this.state.map;
                map.on('zoomend', (...args) => {});
                map.on('dragrotating', (...args) => {
                    // this.state.map.
                });
                map.on('click', (e) => {
                    console.log(`当前坐标${JSON.stringify(e.coordinate)}`);
                });
                this.addLayers([
                    {
                        name: 'planingLayer',
                        config: {
                            zIndex: 2,
                        },
                    },
                    {
                        name: 'textLayer',
                        config: {
                            zIndex: 20,
                            geometryEvents: true,
                            enableAltitude: true, //是否开启带高度渲染几何体，默认为false
                            altitudeProperty: 'altitude',
                        },
                    },
                    {
                        name: 'Envelope',
                        config: {
                            zIndex: 5,
                        },
                    },
                ]);
                this.initMapLayer();
                this.initStopLayer();
                this.initMapConfigure(map);
                // 3D图层 异步
                this.add3DLayer(map).then(() => {
                    if (this.state.performance === 'complex') {
                        this.initModelManager();
                    } else {
                        this.add2DPicture(map.getLayer('Map'));
                        this.setState({
                            isLoading: false,
                            threeInit: true,
                        });
                    }
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }
    // loader
    initModelManager = () => {
        const { modelManager } = this.props.index;
        if (!modelManager) {
            const newModelManager = getModelManager(this.state.performance);
            newModelManager.initManagerEvent({ onLoad: this.modelLoaded });
            this.setState({
                modelManager: newModelManager,
            });
        } else {
            this.setState(
                {
                    modelManager,
                },
                () => {
                    this.modelLoaded();
                },
            );
        }
    };
    // 加载结束
    modelLoaded = () => {
        const { modelManager } = this.props.index;
        if (!modelManager) {
            this.props.dispatch({
                type: 'index/updateModelManager',
                modelManager: this.state.modelManager,
            });
        }
        // 加载完成要延迟一下
        setTimeout(() => {
            const { map, config } = this.state;
            const threeLayer = map.getLayer('3DLayer');
            // 场景环境
            try {
                if (config.environment) this.initEnvironment(map, threeLayer);
                this.add3DModel(threeLayer);
            } catch (e) {
                console.error(e);
            }
            this.setState({
                isLoading: false,
                threeInit: true,
            });
            // this.animate();
        });
    };
    /**
     * 全屏事件
     */
    handleFullScreen = () => {
        this.state.map.requestFullScreen();
    };

    initMapConfigure(map) {
        // 地图初始配置记录
        const options = {
            center: map.getCenter(),
            pitch: map.getPitch(),
            zoom: map.getZoom(),
            bearing: map.getBearing(),
            maxZoom: 13,
            minZoom: map.getZoom(),
            forceRenderOnMoving: true,
            forceRenderOnZooming: true,
            forceRenderOnRotating: true,
        };
        map.setOptions(options);
        this.setState({
            initOptions: options,
        });
    }
    // 增加图层
    addLayers(layers) {
        layers.forEach((item) => {
            let config = Object.assign(this.state.layerConfig, item.config);
            new maptalks.VectorLayer(item.name, config).addTo(this.state.map);
        });
    }
    initMapLayer() {
        const geojson = this.state.mapData;
        const styles = this.state.mapStyle;
        const EboxArr = [];
        const EpileArr = [];

        if (geojson.type !== 'FeatureCollection') {
            const geometrys = this.state.map.getLayer('Map').getGeometries();

            // 主题更新
            geometrys.forEach((geometry) => {
                let module = geometry.type;
                if (geometry.properties) {
                    let type = geometry.properties.type;
                    let coordinates = geometry.getCenter();
                    geometry.updateSymbol(styles[module][type]);
                    if (type === 'Ebox') {
                        EboxArr.push(coordinates);
                    } else if (type === 'Epile') {
                        EpileArr.push(coordinates);
                    } else {
                        geometry.updateSymbol(styles[module][type]);
                    }
                } else {
                    geometry.updateSymbol(styles[module][0]);
                }

                // 找到堆场A01作为基准点来对地图环境进行位置限定
                if (
                    module === 'Polygon' &&
                    geometry.properties &&
                    geometry.properties.text === 'A01' &&
                    geometry._coordinates instanceof Array
                ) {
                    this.setState({
                        envBasePosition: geometry._coordinates[0],
                    });
                }
            });
        } else {
        }
        this.setState({
            EboxArr,
            EpileArr,
            miniMapLayer: {
                EboxArr,
                EpileArr,
            },
        });
    }
    handleEditForbidden(geometry) {
        this.props.setPopover({
            sideFlag: true,
        });
        this.props.setSideActive({ id: 4 });
        this.handleEdit(geometry);
        geometry
            .startEdit({
                vertexHandleSymbol: {
                    visible: false,
                },
                newVertexHandleSymbol: {
                    visible: false,
                },
            })
            .updateSymbol({
                lineColor: '#FFA845',
                lineDasharray: [10, 5],
                polygonFill: '#FFA845',
                polygonOpacity: 0.17,
            })
            .config('draggable', true);
        geometry.on('shapechange', (e) => {
            this.handleEdit(e.target);
        });
    }
    // 初始化绘制矩形，应用于框选禁行区域
    initStopLayer() {
        const map = this.state.map;
        const drawToolLayer = new maptalks.VectorLayer('forbiddenArea', {
            zIndex: 20,
        }).addTo(this.state.map);
        // 从后台读取禁行区域数据，并渲染到forbiddenArea上
        this.initForbiddenData(drawToolLayer);
        this.props.setDevMap?.(map);
        const drawTool = new maptalks.DrawTool({
            mode: 'Rectangle',
            once: true,
            symbol: {
                lineColor: '#FFA845',
                lineDasharray: [10, 5],
                polygonFill: '#FFA845',
                polygonOpacity: 0.17,
            },
        })
            .addTo(this.state.map)
            .disable();

        drawTool.on('drawend', (param) => {
            this.handleEdit(param.geometry);
            param.geometry.on('shapechange', (e) => {
                this.handleEdit(e.target);
            });
            drawToolLayer.addGeometry(param.geometry);
            this.startDraw(param.geometry);
        });
        this.setState({
            drawToolLayer,
            drawTool,
        });

        this.props.setDrawTools?.(drawTool);
    }
    handleEdit(geometry) {
        const centerPosition = geometry.getCenter();
        const coors = cloneDeep(geometry.getShell());
        const coordinates = this.ssort(coors); // 四个点按顺时针重新排列，以左上为起点

        this.props.setGeoParams({
            centerPosition,
            coordinates: coordinates,
            width: this.calcDisByTarget(coordinates[0], coordinates[1]),
            height: this.calcDisByTarget(coordinates[1], coordinates[2]),
            geometry: geometry,
        });
    }
    calcDisByTarget(artPoint, targetPoint) {
        const l = Math.sqrt(
            Math.pow(artPoint.x - targetPoint.x, 2) +
                Math.pow(artPoint.y - targetPoint.y, 2),
        );
        return l.toFixed(3);
    }
    async initForbiddenData(forbiddenLayer) {
        if (!forbiddenLayer)
            forbiddenLayer = this.state.map.getLayer('forbiddenArea');
        forbiddenLayer?.clear();
        const data = await getForbiddenAreas();
        if (!data) {
            message.error('加载禁行区域失败');
            return;
        }
        this.props.dispatch({
            type: 'index/setForbiddenAreas',
            forbiddenAreas: data,
        });
        data.forEach((p) => {
            const polygon = new maptalks.Polygon([p.points], {
                visible: true,
                symbol: {
                    lineColor: '#FF2828',
                    polygonFill: '#FF2828',
                    polygonOpacity: 0.23,
                },
            });
            polygon.addTo(forbiddenLayer).setId(p.id).setOptions({
                name: p.name,
                reason: p.reason,
                centerPosition: p.center_point,
                width: p.length,
                height: p.width,
            });
        });
    }

    ssort(points) {
        let path = points;
        path.sort((a, b) => a.x - b.x);

        for (let j = 1; j < 4; j++) {
            let a = (path[0].y - path[j].y) / (path[0].x - path[j].x);
            let b = path[0].y - a * path[0].x;
            let p0, oppo, p1;
            if (j == 1) {
                oppo = path[1];
                p0 = path[2];
                p1 = path[3];
            } else if (j == 2) {
                p0 = path[1];
                oppo = path[2];
                p1 = path[3];
            } else if (j == 3) {
                p0 = path[1];
                p1 = path[2];
                oppo = path[3];
            }
            let c0 = a * p0.x + b - p0.y;
            let c1 = a * p1.x + b - p1.y;
            if (c0 * c1 < 0) {
                if (c0 > 0) {
                    path = [path[0], p0, oppo, p1];
                } else {
                    path = [path[0], p1, oppo, p0];
                }
                break;
            }
        }
        return path;
    }
    // polygonToRect(polygon) {
    //     const coordiantes = polygon.getShell();
    //     const wLine = new maptalks.LineString([coordiantes[0], coordiantes[1]]);
    //     const hLine = new maptalks.LineString([
    //       coordiantes[0],
    //       coordiantes[coordiantes.length - 1]
    //     ]);
    //     const w = this.state.map.computeGeometryLength(wLine);
    //     const h = this.state.map.computeGeometryLength(hLine);
    //     const topPoint = this.findTopPoint(coordiantes);
    //     return new maptalks.Rectangle(topPoint, w, h);
    // }
    // findTopPoint(coordiantes) {
    //     let minX = Infinity,
    //       maxY = -Infinity;
    //     coordiantes.forEach((c) => {
    //       const { x, y } = c;
    //       minX = Math.min(minX, x);
    //       maxY = Math.max(maxY, y);
    //     });
    //     return [minX, maxY];
    // }
    // keydownEvnet = (e) => {
    //     if (e.code == 'Backspace' && this.state.editingGeo) {
    //         this.state.editingGeo.remove();
    //     }
    // };
    startDraw(geometry) {
        if (this.state.editingGeo) {
            this.cancelDraw();
        }
        this.setState({
            editingGeo: geometry,
        });
        this.props.dispatch({
            type: 'index/setEditingGeo',
            geometry,
        });
        this.state.editingGeo.startEdit({
            vertexHandleSymbol: {
                visible: false,
            },
            newVertexHandleSymbol: {
                visible: false,
            },
        });
        return geometry;
    }
    cancelDraw() {
        if (this.state.editingGeo) {
            this.state.editingGeo.endEdit();
            this.setState({
                editingGeo: null,
            });
        }
        this.props.dispatch({
            type: 'index/setEditingGeo',
            geometry: null,
        });
    }
    // 锁站
    initLockLayer(threeLayer) {
        const locks = this.state.StaticLocks;
        const lockLayer = this.state.map.getLayer('lockLayer');
        const { performance } = this.state;
        let locker3DArr = [];
        locks.forEach((item, index) => {
            let arr = item[2];
            item.splice(2, 1);
            item.push(arr);
            let lastPoint = { x: item[0].x - 0.001, y: item[0].y - 0.001 };
            item.push(lastPoint);
            const polygon = new maptalks.Polygon(item, {
                visible: true,
                editable: true,
                cursor: null,
                shadowBlur: 0,
                shadowColor: 'black',
                draggable: false,
                dragShadow: false, // display a shadow during dragging
                drawOnAxis: null, // force dragging stick on a axis, can be: x, y
                symbol: {
                    lineColor: 'orange',
                    lineWidth: 0.1,
                    polygonFill: 'rgb(135,196,240)',
                    polygonOpacity: 0.6,
                },
            });
            polygon.addTo(lockLayer);
            //锁岛3D模型
            if (performance === 'complex') {
                let locker3D = new WaveWall(
                    polygon,
                    { height: 8, speed: 0.05, color: 'orange' },
                    threeLayer,
                );
                locker3DArr.push(polygon);
                threeLayer.addMesh(locker3D);
            }
            this.state.miniMapLayer.locker3DArr = locker3DArr;
        });
    }
    // 3d图层
    add3DLayer(map) {
        return new Promise((res) => {
            const threeLayer = new ThreeLayer('3DLayer', {
                forceRenderOnMoving: true,
                forceRenderOnZooming: true,
                forceRenderOnRotating: true,
                animation: true,
                zIndex: 10,
            });
            threeLayer.prepareToDraw = (gl, scene, camera) => {
                // 初始化锁站图层
                this.initLockLayer(threeLayer);
                camera.add(new THREE.PointLight('#fff', 1.3));
                res();
            };
            threeLayer.addTo(map);
        });
    }
    // 水
    initEnvironment = (map, threeLayer) => {
        const { theme } = this.state.config;
        const drawLayer = this.state.map.getLayer('drawLayer');
        const oceanGeometry = drawLayer.getGeometryById('ocean');
        if (!oceanGeometry) return;
        const centerPosition = oceanGeometry.getCenter();
        const basePosition = threeLayer.coordinateToVector3(centerPosition);
        const positionArr = oceanGeometry._coordinates.map((item) => {
            return threeLayer.coordinateToVector3(item);
        });
        const threeLayerSky = addEnvironment({
            basePosition,
            theme,
            positionArr,
        });
        oceanGeometry.hide();
        threeLayerSky.addTo(map);
    };
    // 3d模型
    add3DModel(threeLayer) {
        const { modelManager } = this.state;
        const { EboxArr, EpileArr, envBasePosition } = this.state;
        const suodaoCentrePoint = this.state.StaticSuodao;
        //电箱
        const dianxiang = modelManager.getModel('dianxiang');
        dianxiang.rotation.x = Math.PI / 2;
        dianxiang.rotation.y = -2.91;
        this.state.miniMapLayer.EboxModel = dianxiang;
        EboxArr.forEach((itemPos) => {
            const item = dianxiang.clone();
            item.position.copy(threeLayer.coordinateToVector3(itemPos));
            threeLayer.addMesh(item);
        });
        //电桩
        const dianzhuang = modelManager.getModel('dianzhuang');
        dianzhuang.rotation.x = Math.PI / 2;
        dianzhuang.rotation.y = -2.91;
        this.state.miniMapLayer.EpileModel = dianzhuang;
        EpileArr.forEach((itemPos) => {
            const item = dianzhuang.clone();
            item.position.copy(threeLayer.coordinateToVector3(itemPos));
            threeLayer.addMesh(item);
        });
        //锁岛
        const suodao = modelManager.getModel('suodao');
        suodao.rotation.x = Math.PI / 2;
        suodao.rotation.y = 1.8;
        suodao.scale.x = 0.713;
        suodao.scale.z = 0.8;
        this.state.miniMapLayer.suodaoModel = suodao;
        this.state.miniMapLayer.suodaoArr = suodaoCentrePoint;
        suodaoCentrePoint.forEach((itemPos) => {
            const item = suodao.clone();
            item.position.copy(threeLayer.coordinateToVector3(itemPos));
            threeLayer.addMesh(item);
        });
        //场桥
        // const changqiao = modelManager.getModel('changqiao');
        // envBasePosition.z = 0;
        // changqiao.position.copy(
        //     threeLayer.coordinateToVector3(
        //         envBasePosition || { x: 0, y: 0, z: 0 },
        //     ),
        // );
        // changqiao.rotation.x = Math.PI / 2;
        // changqiao.rotation.y = 0.22;
        // changqiao.position.y -= 10;
        // changqiao.scale.set(2.8, 2.5, 2.5);
        // this.state.miniMapLayer.changQiaoModel = changqiao;
        // threeLayer.addMesh(changqiao);
        // console.error('changqiao', changqiao);

        // ship
        // const ship = modelManager.getModel('ship');
        // ship.position.copy(
        //     threeLayer.coordinateToVector3({
        //         x: envBasePosition.x + 160,
        //         y: envBasePosition.y + 50,
        //     }),
        // );
        // ship.rotation.x = Math.PI / 2;
        // ship.rotation.y = -1.34;
        // threeLayer.addMesh(ship);
    }
    // 2d图片
    add2DPicture(mapLayer) {
        const { EboxArr, EpileArr } = this.state;
        const threeLayer = this.state.map.getLayer('3DLayer');
        EboxArr.forEach((item) => {
            render2dImage({
                type: 'EB',
                width: 6,
                height: 6,
                threeLayer,
                item,
                offsetX: 0,
                offsetY: 0,
                offsetZ: 0,
            });
        });
        EpileArr.forEach((item) => {
            render2dImage({
                type: 'CP',
                width: 6,
                height: 6,
                threeLayer,
                item,
                offsetX: 0,
                offsetY: 0,
                offsetZ: 0,
            });
        });
    }

    // 地图更新
    updateMap() {
        const { actStatusList, actJobsList, machineStatusList } =
            this.props.index.data;
        const interaction = this.props.index.interaction;
        const threeLayer = this.state.map.getLayer('3DLayer');
        const textLayer = this.state.map.getLayer('textLayer');
        this.setInteraction(textLayer, threeLayer);
        if (actStatusList && actStatusList.length > 0 && threeLayer) {
            if (this.state.needAddCarList) {
                this.loadShowContent(actStatusList);
                this.addBridge(machineStatusList);
            }

            // 车辆更新
            actStatusList.forEach((data) => {
                const { point, cheId, yaw, stateFlow, soc } = data;
                if (!point) {
                    return;
                }
                //检查电量过低语音提示
                if (stateFlow != '离线' && soc < 30) {
                    let id = cheId;
                    if (!this.state.alarmMap.containsKey(id)) {
                        this.state.alarmMap.set(id, cheId);
                        let msg = cheId + ' !电量过低';
                        let text = cheId + '--电量过低';
                        play(msg); //语音播放
                        this.openNotification(text, 'bottomLeft'); //弹框提示
                    }
                }
                let { environment } = this.state.config;
                if (environment) {
                    let localCar = localStorage.getItem('carCheck');
                    if (localCar) {
                        localCar = JSON.parse(localCar);
                        interaction.showCar = localCar;
                    }
                    this.updateCar(
                        point,
                        yaw,
                        stateFlow,
                        cheId,
                        interaction.showCar.includes(cheId),
                    );
                    // 规划路线更新
                    if (actJobsList.length > 0) {
                        const list = [];
                        actJobsList.forEach((data) => {
                            if (interaction.showCar.includes(data.cheId)) {
                                list.push(data);
                            }
                        });
                        this.updatePlaning(list, interaction);
                    }
                } else {
                    this.updateCar(point, yaw, stateFlow, cheId, true);
                    // 规划路线更新
                    if (actJobsList.length > 0) {
                        this.updatePlaning(actJobsList, interaction);
                    }
                }
            });
            // 岸桥，场桥更新
            if (this.state.performance === 'complex') {
                this.updateBridge(threeLayer, machineStatusList);
            } else {
                this.updateQcOf2D(threeLayer, machineStatusList);
            }
            this.updateFl(threeLayer, machineStatusList);
        }
    }
    updateFl(threeLayer, machineStatusList) {
        const flListData = machineStatusList.filter((machine) => {
            return machine.type === 'FL';
        });
        flListData.forEach((fl) => {
            const point3d = threeLayer.coordinateToVector3(fl.point);
            const targetFl = threeLayer.getScene().getObjectByName(fl.name);
            const offsetX = point3d.x - targetFl?.oldPosition?.x,
                offsetY = point3d.y - targetFl?.oldPosition?.y,
                offsetZ = point3d.z - targetFl?.oldPosition?.z;
            targetFl?.position.set(offsetX, offsetY, offsetZ);
        });
    }
    // socket数据2d坐标=>3d坐标,与oldPosition比较，调整位置，
    updateQcOf2D(threeLayer, machineStatusList) {
        const qcListData = machineStatusList.filter((machine) => {
            return machine.type === 'QC';
        });
        qcListData.forEach((qc) => {
            const point3d = threeLayer.coordinateToVector3(qc.point);
            const targetQc = threeLayer.getScene().getObjectByName(qc.name);
            const offsetX = point3d.x - targetQc?.oldPosition?.x,
                offsetY = point3d.y - targetQc?.oldPosition?.y,
                offsetZ = point3d.z - targetQc?.oldPosition?.z;
            targetQc.position.set(offsetX, offsetY, offsetZ);
            // const marker = this.state.map
            //     .getLayer('textLayer')
            //     .getGeometryById(qc.name);
            // const markerPosition = cloneDeep(qc.point);
            // markerPosition.x += 7;
            // markerPosition.y -= 0.4;
            // marker.setCoordinates(markerPosition);
        });
    }
    // 页面展示模式切换
    pageConfig = () => {
        let target = '';
        if (this.state.performance === 'complex') {
            target = 'simple';
        } else {
            target = 'complex';
        }
        // 3D模型缓存清除重新加载
        this.props.dispatch({
            type: 'index/updateModelManager',
            modelManager: '',
        });
        localStorage.setItem('performance', target);
        location.reload();
    };
    // 图层展示
    showLegendEnter = () => {
        this.setState({
            mapLegend: true,
        });
    };
    showLegendLeave = () => {
        this.setState({
            mapLegend: false,
        });
    };
    //弹框提示
    openNotification = (msg, placement) => {
        notification.open({
            className: 'powerNotBox',
            description: msg,
            duration: null,
            maxCount: 10,
            icon: <ExclamationCircleOutlined style={{ color: '#ea0000' }} />,
            placement,
        });
    };
    // 确定展示内容
    loadShowContent(carList) {
        const { modelManager } = this.state;
        this.setState({
            needAddCarList: false,
        });
        if (this.state.performance === 'complex') {
            this.addCarList(carList, modelManager.getModel('art'));
        } else {
            this.addCarList(carList);
        }
    }
    // 加载岸桥
    loadBridgeList3D(machineStatusList, model) {
        const threeLayer = this.state.map.getLayer('3DLayer');
        const { modelManager } = this.state;
        let quayCraneModelArr = [];
        if (!threeLayer) return;
        const allChangqiao = {};
        machineStatusList.forEach((item, index) => {
            // QC 岸桥  YC 场桥  SC 堆高机  LC 锁站
            if (item.type === 'QC') {
                if (item.point) {
                    const itemModel = model.clone();
                    itemModel.oldPosition = item.point;
                    itemModel.name = item.name;
                    itemModel.bridgeType = 'QC';
                    itemModel.position.copy(
                        threeLayer.coordinateToVector3(
                            handleModelOffset(itemModel),
                        ),
                    );
                    itemModel.rotation.x = Math.PI / 2;
                    itemModel.rotation.y = getHostInfoValue('yYaw');
                    quayCraneModelArr.push(itemModel);
                    // itemModel.scale.set(2.5, 4, 2.5);
                    itemModel.scale.set(2.5, 4, 1.5);
                    threeLayer.addMesh(itemModel);
                }
            } else if (item.type === 'YC') {
                if (item.point) {
                    const itemModel = modelManager.getModel('changqiao');
                    allChangqiao[item.name] = itemModel;
                    itemModel.oldPosition = item.point;
                    itemModel.name = item.name;
                    itemModel.bridgeType = 'YC';
                    itemModel.isTop = item.isTop;
                    itemModel.position.copy(
                        threeLayer.coordinateToVector3(
                            handleModelOffset(itemModel),
                        ),
                    );
                    itemModel.rotation.x = Math.PI / 2;
                    itemModel.rotation.y = getHostInfoValue('yYaw');
                    itemModel.scale.set(2.5, 4, 2.5);
                    threeLayer.addMesh(itemModel);
                }
            } else if (item.type === 'FL') {
                render2dImage('FL', 20, 20, threeLayer, item);
            }
        });
        this.setState({
            allChangqiao,
        });
        this.state.miniMapLayer.quayCraneModelArr = quayCraneModelArr;
    }
    loadBridgeList2D(machineStatusList) {
        const threeLayer = this.state.map.getLayer('3DLayer');
        machineStatusList.forEach((item, index) => {
            // QC 岸桥  YC 场桥  FL 堆高机  LC 锁站
            if (item.type === 'QC') {
                render2dImage({
                    type: 'QC',
                    width: 25,
                    height: 92.5,
                    threeLayer,
                    item,
                    offsetX: 0,
                    offsetY: 0,
                    offsetZ: 0,
                });
                // const markerPosition = cloneDeep(item.point);
                // markerPosition.x += 7;
                // markerPosition.y -= 0.4;
                // const marker = new maptalks.Marker(markerPosition, {
                //     id: item.name,
                //     interactive: true,
                //     cursor: 'pointer',
                //     symbol: {
                //         textFaceName: 'sans-serif',
                //         textName: item.name,
                //         textFill: '#fff',
                //         textHaloFill: '#fff',
                //         textHaloRadius: '0.3',
                //         textSize: {
                //             stops: [
                //                 [8, 5],
                //                 [13, 30],
                //             ],
                //         },
                //         textHorizontalAlignment: 'middle', //left | middle | right | auto
                //         textVerticalAlignment: 'middle', // top | middle | bottom | auto
                //         textAlign: 'center', //left | right | center | auto
                //     },
                //     properties: {
                //         altitude: 0,
                //     },
                // });
                // marker.addTo(this.state.map.getLayer('textLayer'));
            } else if (item.type === 'YC') {
                // 2d模式不展示场桥
            } else if (item.type === 'FL') {
                render2dImage({
                    type: 'FL',
                    width: 20,
                    height: 20,
                    threeLayer,
                    item,
                    offsetX: 0,
                    offsetY: 0,
                    offsetZ: 0,
                });
            }
        });
    }
    calcArtModelPoints(artPoint) {
        let height = 23;
        let width = 86;
        let xo = Math.cos(artPoint.yaw);
        let yo = Math.sin(artPoint.yaw);
        let y1 = artPoint.x + (height / 2) * yo;
        let x1 = artPoint.y - (height / 2) * xo;
        let y2 = artPoint.x - (height / 2) * yo;
        let x2 = artPoint.y + (height / 2) * xo;

        return [
            [y1 - (width / 2) * xo, x1 - (width / 2) * yo],
            [y2 - (width / 2) * xo, x2 - (width / 2) * yo],
            [y2 + (width / 2) * xo, x2 + (width / 2) * yo],
            [y1 + (width / 2) * xo, x1 + (width / 2) * yo],
        ];
    }

    // 岸桥
    addBridge = (machineStatusList) => {
        console.log('machineStatusList', machineStatusList);
        if (this.state.performance === 'simple') {
            this.loadBridgeList2D(machineStatusList);
            return;
        }
        const { modelManager } = this.state;
        this.loadBridgeList3D(
            machineStatusList,
            modelManager.getModel('anqiao'),
        );
    };
    // 车队
    addCarList(carList, model) {
        const threeLayer = this.state.map.getLayer('3DLayer');
        const textLayer = this.state.map.getLayer('textLayer');
        const envelopeLayer = this.state.map.getLayer('Envelope');
        if (this.state.performance === 'complex') {
            const canvas = document.getElementById('map');
            canvas.addEventListener('click', this.threeModelClickEvent);
        }
        let allLiveCarDict = {};
        carList.forEach((item) => {
            const { cheId, point, yaw, stateFlow } = item;
            if (!point) return;
            const carModel = new Car({
                cheId,
                position: point,
                yaw,
                model,
                textLayer,
                threeLayer,
                type: model ? 'complex' : 'simple',
                stateFlow,
                envelopeLayer,
                theme: this.state.config.theme,
            });
            if (carModel.model) {
                carModel.model.cheId = cheId;
                getMesh([carModel.model], this.state.totalArr, cheId);
            }
            if (carModel.marker) {
                if (this.state.config.environment) {
                    carModel.marker.on(
                        'click',
                        this.carClickEvent.bind(this, cheId),
                    );
                    carModel.polygon.on(
                        'click',
                        this.carClickEvent.bind(this, cheId),
                    );
                }
                carModel.marker.on(
                    'mouseenter',
                    this.planingColor.bind(this, cheId),
                );
                carModel.marker.on('mouseout', this.planingColor.bind(this));
                carModel.polygon.on(
                    'mouseenter',
                    this.planingColor.bind(this, cheId),
                );
                carModel.polygon.on('mouseout', this.planingColor.bind(this));
                // 因maptalks自定义菜单无法传入Reactmode,故手动添加右侧菜单
                carModel.marker.addEventListener('contextMenu', (e) => {
                    this.setState({
                        showBox: true,
                        activeCarId: cheId,
                    });
                    return false; // 组织事件冒泡，导致地图旋转
                });
            }
            allLiveCarDict[cheId] = carModel;
            this.setState({
                allLiveCarDict,
            });
        });
    }
    clickItem(dom) {
        console.log(dom || 1);
    }
    // 路线绘制事件
    planingColor = (cheId) => {
        this.triggerDispatch('planingColor', { planingColor: cheId });
    };
    // 单车页面打开事件
    carClickEvent = (cheId) => {
        const {
            locker3DArr,
            EboxModel,
            EpileModel,
            suodaoModel,
            EboxArr,
            EpileArr,
            suodaoArr,
            changQiaoModel,
            quayCraneModelArr,
            carModel,
        } = this.state.miniMapLayer;
        this.triggerDispatch('showInfo', {
            showInfo: cheId,
            isUpdate: false,
        });
        //点击显示
        this.props.setPopover({
            carFlag: true,
            cheId,
            mapData: this.state.mapData,
            mapStyle: this.state.mapStyle,
        });
        //点击车辆，设置小地图图层
        this.props.setMiniMapLayer({
            initOptions: this.state.initOptions, //地图配置
            locker3DArr: locker3DArr, //锁站图层
            EboxModel: EboxModel, //电箱模型
            EpileModel: EpileModel, //电桩模型
            suodaoModel: suodaoModel, //锁岛模型
            EboxArr: EboxArr, //电箱位置记录
            EpileArr: EpileArr, //电桩位置记录
            suodaoArr: suodaoArr, //锁岛位置记录
            changQiaoModel: changQiaoModel, //场桥模型
            quayCraneModelArr: quayCraneModelArr, //岸桥模型
            carModel: carModel, //车模型
        });
    };
    // TODO这里获得3D模型，后续可以对所有3D模型进行区分
    threeModelClickEvent = (event) => {
        const cheId = this.getThreeModel(event);
        cheId && this.carClickEvent(cheId);
    };
    // 获得three车模型
    getThreeModel = (event) => {
        const { mouse, raycaster, totalArr, map } = this.state;
        const threeLayer = map.getLayer('3DLayer');
        const camera = threeLayer.getCamera();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(totalArr);
        if (intersects && intersects.length > 0) {
            return intersects[0].object.cheId;
        }
    };
    // 更新车地址
    updateCar(position, yaw, stateFlow, cheId, visible) {
        const { allLiveCarDict, config } = this.state;
        const { oldPosition, oldYaw, oldStateFlow, oldTheme, oldVisible } =
            allLiveCarDict[cheId] || {};
        if (
            oldPosition == position &&
            oldYaw == yaw &&
            oldStateFlow == stateFlow &&
            oldTheme == config.theme &&
            oldVisible == visible
        ) {
            return;
        }
        if (allLiveCarDict[cheId])
            allLiveCarDict[cheId].update({
                position,
                yaw,
                stateFlow,
                theme: config.theme,
                visible,
            });
    }
    // 更新路线
    updatePlaning(data, interaction) {
        const planingLayer = this.state.map.getLayer('planingLayer');
        planingLayer.clear();
        let id = interaction.planingColor;

        if (data.length > 0) {
            data.forEach((item) => {
                let planing = {
                    id: item.cheId,
                    points: [],
                };
                let color = '#0074FF';
                let opacity = 0.3;
                let lineWidth = 5;
                let zIndex = 1;
                if (planing.id == id) {
                    color = 'orange';
                    opacity = 0.8;
                    zIndex = 2;
                }
                item.wayPointsList.forEach((point) => {
                    planing.points.push(point.pos);
                });
                let line = new maptalks.LineString(planing.points, {
                    zIndex: zIndex,
                    symbol: {
                        lineColor: color,
                        lineWidth: lineWidth,
                        opacity: opacity,
                    },
                });

                line.addTo(planingLayer);
            });
        }
    }
    // 更新岸桥和场桥
    updateBridge(threeLayer, machineStatusList) {
        machineStatusList.forEach((data) => {
            const { name, point = {} } = data;
            const threeObj = threeLayer.getScene().getObjectByName(name);
            try {
                if (
                    threeObj?.oldPosition &&
                    point.x !== threeObj.oldPosition.x &&
                    point.y !== threeObj.oldPosition.y
                ) {
                    threeObj.oldPosition = point;
                    const threeLayer = this.state.map.getLayer('3DLayer');
                    const newPosition = handleModelOffset(threeObj);
                    threeObj.oldPosition = newPosition;
                    threeObj &&
                        threeObj.position.copy(
                            threeLayer.coordinateToVector3(newPosition),
                        );
                }
            } catch (e) {
                console.error(e);
            }
        });
    }
    // 定位 追踪 互斥
    setInteraction(textLayer, threeLayer) {
        if (textLayer) {
            let map = this.state.map;
            const positioningCar = this.props.index.interaction.positioningCar;
            const trackingCar = this.props.index.interaction.trackingCar;
            const isStop = this.judgeCanPositioningOrTracking(
                positioningCar,
                trackingCar,
            );
            if (isStop) return;
            // 定位
            if (positioningCar) {
                let marker = textLayer.getGeometryById(positioningCar);
                let postion = marker.getCoordinates();
                // 添加定位点
                this.playAnimation(threeLayer, postion, positioningCar);
                map.setCenter(postion);
                map.animateTo(
                    {
                        // pitch: 70,
                        zoom: 11,
                    },
                    {
                        duration: 300,
                    },
                );
                // 定位打断追踪
                this.triggerDispatch('trackingCar', { trackingCar: null });
                this.triggerDispatch('positioningCar', {
                    positioningCar: null,
                });
            }
            // 追踪
            if (trackingCar) {
                let postion = textLayer
                    .getGeometryById(trackingCar)
                    .getCoordinates();
                map.setCenter(postion);
            }
        }
    }
    // 定位动画
    playAnimation = (threeLayer, postion, positioningCar) => {
        const { ringShield } = this.state;
        let newRingShield = ringShield;
        if (newRingShield) {
            newRingShield.object3d.position.x = postion.x;
            newRingShield.object3d.position.y = postion.y;
        } else {
            newRingShield = new RingShield(
                [postion.x, postion.y],
                {
                    color: 'green', //purple
                    altitude: 1,
                    speed: 0.005,
                    radius: 20,
                },
                threeLayer,
            );
            this.setState({
                ringShield,
            });
        }
        newRingShield.name = positioningCar;
        threeLayer.addMesh(newRingShield);
        setTimeout(() => {
            let meshs = threeLayer.getBaseObjects();
            if (meshs) {
                meshs.forEach((mesh) => {
                    if (mesh.name == positioningCar) {
                        mesh.remove();
                    }
                });
            }
        }, 2000);
    };
    initOptions = () => {
        const map = this.state.map;
        const option = this.state.initOptions;
        map.animateTo(
            {
                center: option.center,
                zoom: option.zoom,
                pitch: option.pitch,
                bearing: option.bearing,
            },
            {
                duration: 300,
            },
        );
    };
    // 视角菜单
    changeWatchModalState = () => {
        this.setState({
            isShowWatch: !this.state.isShowWatch,
        });
    };
    // 改变视角
    setWatchType = (type) => {
        const map = this.state.map;
        const option = this.state.initOptions;
        let pitch = option.pitch;
        let zoom = option.zoom;
        if (type == 1) {
            //第一视角
            pitch = 70;
            zoom = 11;
        }
        map.animateTo(
            {
                pitch: pitch,
                zoom: zoom,
            },
            {
                duration: 300,
            },
        );
        this.setState({
            isShowWatch: false,
        });
    };
    animate = () => {
        const { threeInit, map } = this.state;
        if (map) {
            const SkyBox = map.getLayer('SkyBox');
            if (threeInit && this.props.index.interaction.isUpdate) {
                this.updateMap();
            }
            if (SkyBox && SkyBox.getScene()) {
                const water = SkyBox.getScene().getObjectByName('water');
                water && (water.material.uniforms['time'].value += 1.0 / 60.0);
            }
        }
    };
    // 判断是否能定位或追踪
    judgeCanPositioningOrTracking = (positioning, tracking) => {
        const canShowCarString = localStorage.getItem('carCheck') || '[]';
        const canShowCar = JSON.parse(canShowCarString);
        const { allLiveCarDict } = this.state;
        if (
            !(canShowCar.includes(positioning) || canShowCar.includes(tracking))
        )
            return true;
        if (positioning && !allLiveCarDict[positioning]) return true;
        if (tracking && !allLiveCarDict[tracking]) return true;
    };
    // trigger dispatch
    triggerDispatch = (type, value) => {
        this.props.dispatch({
            type: `index/${type}`,
            payload: value,
        });
    };

    closeCarControl() {
        this.setState({
            activeCarId: null,
            showBox: false,
        });
    }
    render() {
        const { config, activeCarId, showBox } = this.state;
        let tools = <div></div>;
        if (config.tools) {
            tools = (
                <div>
                    <div id="mapTool" className={style.mapTool}>
                        {/* 视角选择框 */}
                        {this.state.isShowWatch && (
                            <div className={`baseViewType ${style.viewType}`}>
                                <div
                                    align="middle"
                                    className={style.viewRow}
                                    onClick={() => {
                                        this.setWatchType(1);
                                    }}
                                >
                                    <div
                                        span={20}
                                        className={style.viewTypeName}
                                    >
                                        <span>第一视角</span>
                                    </div>
                                </div>
                                <div
                                    align="middle"
                                    className={style.viewRow}
                                    onClick={() => {
                                        this.setWatchType(0);
                                    }}
                                >
                                    <div
                                        span={20}
                                        className={style.viewTypeName}
                                    >
                                        <span>鸟瞰视角</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <p onClick={this.changeWatchModalState}>
                            <i
                                className="iconfont icon-qiehuanshijiao"
                                title="视角"
                            ></i>
                        </p>
                        <p onClick={this.initOptions}>
                            <i
                                className="iconfont icon-huidaoyuandian"
                                title="重置"
                            ></i>
                        </p>
                        <p onClick={this.pageConfig}>
                            {this.state.performance === 'complex' ? (
                                <i
                                    className="iconfont icon-kuai"
                                    title="极简"
                                ></i>
                            ) : (
                                <i className="iconfont icon-d" title="性能"></i>
                            )}
                        </p>
                    </div>
                </div>
            );
        }
        // loading样式
        let loadingStyle = null;
        if (config.environment && config.theme === 'black') {
            loadingStyle = {
                background: 'rgba(6,17,68,0.5)',
            };
        } else if (config.environment) {
            loadingStyle = {
                background: 'rgba(255,255,255,0.5)',
            };
        }
        return (
            <div id="mapCentent" className={style.mapCentent}>
                <CarControl
                    showBox={showBox}
                    activeCarId={activeCarId}
                    close={this.closeCarControl}
                ></CarControl>
                <div id="map"></div>
                <div className="menu"></div>
                {tools}
                {this.state.mapLegend ? <MapLegend /> : ''}
                {!this.props.config.theme ? (
                    <div className={style.legendBtn}>
                        <p
                            onMouseEnter={this.showLegendEnter}
                            onMouseLeave={this.showLegendLeave}
                        >
                            <i className="iconfont icon-tuli" title="图例"></i>
                        </p>
                    </div>
                ) : (
                    ''
                )}
                {this.state.isLoading ? (
                    <Loading loadingStyle={loadingStyle} />
                ) : null}
            </div>
        );
    }
}
export default connect(({ index }) => ({
    index,
}))(MapTools);
