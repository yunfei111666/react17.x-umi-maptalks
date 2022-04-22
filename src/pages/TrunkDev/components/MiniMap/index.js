/*
 * @Description:
 * @Project:
 * @Author: yunfei
 * @Date: 2021-10-13 10:33:30
 * @LastEditors: Libj
 * @lastTime: 2021-12-16 19:28:19
 * @Modified By: yunfei
 * @文件相对于项目的路径: /TrunkFace/src/pages/TrunkDev/components/MiniMap/index.js
 */
import React, { Component } from 'react';
import {
    Switch,
    Form,
    Input,
    InputNumber,
    Button,
    Modal,
    message,
    Collapse,
} from 'antd';
import {
    ExclamationCircleOutlined,
    CaretRightOutlined,
    CheckOutlined,
} from '@ant-design/icons';
import DetailMsg from '../DetailMsg';
import style from './index.less';
import { MapStyle } from '@/components/Map/model/MapStyle';
import * as maptalks from 'maptalks';
import '@root/node_modules/maptalks/dist/maptalks.css';
import * as THREE from 'three';
import { ThreeLayer } from 'maptalks.three';
import WaveWall from 'components/Map/model/WaveWall';
import { connect } from 'umi';
import { getModelManager } from '@/utils/loadModel.js';
import clearIcon from '@/assets/images/dev/qingchu.svg';
import rainIcon from '@/assets/images/dev/jiangyuliang.svg';
import Access from '@/components/Access';
import { getMap } from 'services/admin';
import { getReset, getPcd, clearFalt, miscInfo } from 'services/carDetail';
import { saveConfirm, stop } from 'services/common';
const { Panel } = Collapse;
const { confirm } = Modal;
class MiniMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            map: null,
            //carList: this.props.data.carList,
            mapData: null,
            mapStyle: MapStyle('white'),
            isShowWatch: false, //视角选择面板，默认隐藏
            isFreeView: false, //是否自由视角
            config: {
                tools: true,
                rainfall: true,
            },
            initOptions: {
                pitch: 0,
                bearing: 0,
                center: [0, 0],
                forceRenderOnMoving: true,
                forceRenderOnRotating: true,
                forceRenderOnZooming: true,
                maxZoom: 13,
                minZoom: 7,
                zoom: 7,
                // draggable: false, //禁止拖拽地图
                // dragPan: false,
            },
            obstacleSymbol: {
                polygonFill: 'rgb(20,160,255)',
                polygonOpacity: 0.5,
                lineWidth: 1,
                lineColor: 'rgb(20,160,255)',
                lineOpacity: 1,
                shadowBlur: 10,
                shadowOffsetX: 1,
                shadowOffsetY: 1,
            },
            formValue: {
                departure: 0, //横距
                longitudinal: 0, //纵距
                abscissa: '', //x
                ordinate: '', //y
                yaw: '', //yaw
                pose: 0, //目标姿态
            },
            drawCarLayer: false, //绘制车模型状态(打点)
            isChecked: false,
            isfirst: true, //记录获取默认yaw
            ipValue: '', //车辆ip
            stop_flag: false, //stop时事件
            rainValue: '',
        };
    }
    componentDidMount() {
        this.init();
        //节流限制多次点击事件为5秒内执行1次
        // this.setCarLocation = LD.throttle(this.setCarLocation, 5000, {
        //     trailing: false,
        // });
    }
    componentDidUpdate() {
        const { map } = this.state;
        const { dldata } = this.props.index;
        if (dldata && map != null) {
            // 1.更新地图中心点、转向角及车辆位置
            if (dldata.hasOwnProperty('x')) {
                this.updateMapOrCar(map);
            }
            // 2.更新地图障碍物
            if (dldata.hasOwnProperty('objects')) {
                if (dldata.objects.length > 0) {
                    this.updateObstacle(map, dldata.objects);
                }
            }
            // 3.更新地图点云数据
            if (dldata.hasOwnProperty('ogm_points')) {
                if (dldata.ogm_points.length > 0) {
                    this.updatePoints(map, dldata.ogm_points);
                }
            }
        }
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    updateMapOrCar = (map) => {
        // 更新地图中心点及转向角
        this.updateMap(map);
        // 更新车辆模型
        this.updateCar(map);
    };
    init() {
        this.initMap();
    }
    initMap() {
        // 初始化地图工具
        getMap()
            .then((data) => {
                if (data && data.type !== 'FeatureCollection') {
                    //maptalks json
                    this.setState(
                        {
                            map: maptalks.Map.fromJSON('miniMap', data),
                            mapData: data,
                        },
                        () => {
                            const map = this.state.map;
                            // 初始化地图工具
                            this.initDrawTool(map);
                            this.initMapLayer(map.getLayer('Map'));
                            this.mapEvents(map);
                            this.add3DLayer(map);
                        },
                    );
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    initDrawTool(map) {
        // 地图绑定事件
        map.on('click', (e) => {
            const { map, drawCarLayer, formValue, isfirst } = this.state;
            if (drawCarLayer) {
                let values = [e.coordinate.x, e.coordinate.y];
                const { dldata } = this.props.index;
                const poscenter = map.getCenter();
                poscenter.yaw = 0;
                if (isfirst) {
                    formValue.pose = dldata.yaw;
                }
                const threeLayer = map.getLayer('3DLayer');
                if (threeLayer && threeLayer.getScene()) {
                    const threeObj = threeLayer
                        .getScene()
                        .getObjectByName('carFaker');
                    formValue.abscissa = e.coordinate.x;
                    formValue.ordinate = e.coordinate.y;
                    const disOfxy = this.calcDisByTarget(poscenter, formValue); //获取横纵距
                    formValue.departure = disOfxy.x;
                    formValue.longitudinal = disOfxy.y;
                    formValue.yaw = formValue.pose;
                    if (threeObj) {
                        threeObj.rotation.y =
                            JSON.parse(formValue.yaw) - Math.PI;
                        threeObj.position.copy(
                            threeLayer.coordinateToVector3(values),
                        );
                        this.setState({
                            isChecked: true,
                            isfirst: false,
                            drawCarLayer: false, //关闭车辆打点状态
                        });
                    }
                }
            }
        });

        // keypress
        document.addEventListener('keydown', (e) => {
            this.keydownEvnet(e);
        });
    }
    keydownEvnet(e) {
        const { map, formValue, isChecked } = this.state;
        const threeLayer = map.getLayer('3DLayer');
        const module = threeLayer.getScene().getObjectByName('carFaker');

        if (threeLayer && isChecked) {
            if (module) {
                switch (e.code) {
                    case 'ArrowUp':
                        formValue.departure += 0.1;
                        this.inputChange(formValue.departure, 'departure');
                        break;
                    case 'ArrowDown':
                        formValue.departure -= 0.1;
                        this.inputChange(formValue.departure, 'departure');
                        break;
                    case 'ArrowRight':
                        formValue.longitudinal += 0.1;
                        this.inputChange(
                            formValue.longitudinal,
                            'longitudinal',
                        );
                        break;
                    case 'ArrowLeft':
                        formValue.longitudinal -= 0.1;
                        this.inputChange(
                            formValue.longitudinal,
                            'longitudinal',
                        );
                        break;
                    case 'KeyW':
                        formValue.pose += 0.1;
                        this.inputChange(formValue.pose, 'pose');
                        break;
                    case 'KeyS':
                        formValue.pose -= 0.1;
                        this.inputChange(formValue.pose, 'pose');
                        break;
                }
                this.setState({ formValue });
            }
        }
    }
    onSubmit = () => {
        const { abscissa, ordinate, yaw } = this.state.formValue;
        const { cheId } = this.props.data;
        const { map, isChecked, ipValue } = this.state;
        const threeLayer = map.getLayer('3DLayer');
        const threeObj = threeLayer.getScene().getObjectByName('carFaker');

        //是否开启车辆打点
        let body = {
            che_id: cheId,
            // ip: ipValue,
            x: abscissa,
            y: ordinate,
            yaw: yaw,
        };
        if (isChecked) {
            confirm({
                title: '操作确认?',
                icon: <ExclamationCircleOutlined />,
                content: '是否确定要对当前位置设置为目标点？',
                okText: '是',
                okType: 'danger',
                cancelText: '否',
                onOk: () => {
                    this.issueCar(body);
                },
                onCancel: () => {
                    // this.SwitchChange(false)
                },
            });
        } else {
            message.warning('请选取目的点');
        }
    };
    //求坐标
    calcTargetPointByDistance(artPoint, controlByDis) {
        const distance = Math.sqrt(
            Math.pow(controlByDis.departure, 2) +
                Math.pow(controlByDis.longitudinal, 2),
        );
        const yaw =
            artPoint.yaw +
            Math.atan2(controlByDis.departure, controlByDis.longitudinal);
        let sin = Math.sin(yaw);
        let cos = Math.cos(yaw);
        let x, y;
        if (distance > 0) {
            x = artPoint.x + distance * cos;
            y = artPoint.y + distance * sin;
        } else {
            let offset = Math.abs(distance);
            x = artPoint.x - offset * cos;
            y = artPoint.y + offset * sin;
        }
        return {
            x: x,
            y: y,
            yaw: controlByDis.pose,
        };
    }
    //求横距、纵距
    calcDisByTarget(artPoint, targetPoint) {
        const l = Math.sqrt(
            Math.pow(artPoint.x - targetPoint.abscissa, 2) +
                Math.pow(artPoint.y - targetPoint.ordinate, 2),
        );
        const angle =
            Math.atan2(
                targetPoint.ordinate - artPoint.y,
                targetPoint.abscissa - artPoint.x,
            ) - artPoint.yaw;
        return {
            x: l * Math.sin(angle),
            y: l * Math.cos(angle),
        };
    }
    SwitchChange = (e) => {
        this.input.blur();
        const { map } = this.state;
        const threeLayer = map.getLayer('3DLayer');
        const threeObj = threeLayer.getScene().getObjectByName('carFaker');
        this.state.isChecked = e;
        if (this.state.isChecked) {
            this.inputChange(0, 'departure');
        } else {
            const newObj = {
                departure: 0,
                longitudinal: 0,
                abscissa: '',
                ordinate: '',
                yaw: '',
                pose: 0,
            };
            if (threeLayer && threeObj) {
                threeObj.position.set(0, 0, 0);
            }
            this.setState({
                formValue: newObj,
                isfirst: true,
                drawCarLayer: false, //关闭车辆打点状态
            });
        }
    };
    //单车详情控制发布
    issueCar = (body) => {
        saveConfirm(body)
            .then((data) => {
                if (data) {
                    message.success('操作成功');
                    this.setState({
                        drawCarLayer: false, //关闭车辆打点状态
                    });
                }
            })
            .catch((error) => {
                console.error(error, 'error');
            });
    };
    // 更新地图中心点及转向角
    updateMap = (map) => {
        const { dldata } = this.props.index;
        const center = [dldata.x, dldata.y];
        // 如果是自由视角则不更新
        if (!this.state.isFreeView) {
            map.setCenter(center);
            map.getLayer('drawLayer').getGeometryById('ocean')?.remove();
            //let deg = (180 / Math.PI) * (Math.PI / 2 - JSON.parse(dldata.yaw));
            //map.setBearing(deg);
        }
    };
    // 更新地图障碍物
    updateObstacle = (map, data) => {
        const layer = map.getLayer('obstacle');
        if (layer) {
            layer.clear();
            new maptalks.MultiPolygon(data || [], {
                visible: true,
                editable: true,
                cursor: null,
                shadowBlur: 0,
                shadowColor: 'black',
                draggable: false,
                dragShadow: false, // display a shadow during dragging
                drawOnAxis: null, // force dragging stick on a axis, can be: x, y
                symbol: {
                    lineColor: '#333',
                    lineWidth: 1,
                    polygonFill: 'rgb(40,41,35)',
                    polygonOpacity: 0.6,
                },
            }).addTo(layer);
        }
    };
    //点云坐标
    toUtmPoint(point, artPoint) {
        return [
            artPoint.x +
                point.x * Math.cos(artPoint.yaw) -
                point.y * Math.sin(artPoint.yaw),
            artPoint.y +
                point.x * Math.sin(artPoint.yaw) +
                point.y * Math.cos(artPoint.yaw),
        ];
    }
    //更新点云
    updatePoints = (map, data) => {
        const { dldata } = this.props.index;
        const layer = map.getLayer('points');
        const artPoint = { x: dldata.x, y: dldata.y, yaw: dldata.yaw };
        if (layer) {
            layer.clear();
            let points = [];
            (data || []).forEach((point) => {
                points.push(this.toUtmPoint(point, artPoint));
            });
            points.forEach((point) => {
                new maptalks.Circle(point, 0.01, {
                    symbol: {
                        lineColor: '#2A73AF',
                        polygonFill: '#2A73AF',
                    },
                }).addTo(layer);
            });
        }
    };
    //更新pcd点云
    pcdPoints = (map, data) => {
        const layer = map.getLayer('point');
        if (layer) {
            // layer.clear();
            let arrs = [];
            data.forEach((item) => {
                let pointsArr = [item.x, item.y];
                arrs.push(pointsArr);
            });
            new maptalks.MultiPoint(arrs, {
                symbol: {
                    textName: '.',
                    textFill: '#fcc',
                    textSize: 30,
                },
            }).addTo(layer);
        }
    };
    // 更新车辆模型
    updateCar = (map) => {
        const { dldata } = this.props.index;
        const { formValue } = this.state;
        const center = [dldata.x, dldata.y];
        const threeLayer = map.getLayer('3DLayer');
        if (threeLayer && threeLayer.getScene()) {
            const threeObj = threeLayer.getScene().getObjectByName('car');
            // 车模型
            if (threeObj) {
                threeObj.rotation.y = JSON.parse(dldata.yaw) - Math.PI;
                threeObj.position.copy(threeLayer.coordinateToVector3(center));
            }
        }
    };
    initMapLayer(mapLayer) {
        const state = this.state;
        const geojson = state.mapData;
        const styles = state.mapStyle;
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
                        this.addMarker(
                            mapLayer,
                            coordinates,
                            './images/map/Ebox.png',
                        );
                    } else if (type === 'Epile') {
                        this.addMarker(
                            mapLayer,
                            coordinates,
                            './images/map/Epile.png',
                        );
                    } else {
                        geometry.updateSymbol(styles[module][type]);
                    }
                } else {
                    geometry.updateSymbol(styles[module][0]);
                }
            });
        } else {
        }
    }

    addMarker(layer, coordinates, url, name) {
        new maptalks.Marker(coordinates, {
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
        }).addTo(layer);
    }

    mapEvents(map) {
        const { initOptions } = this.state;
        map.getLayer('Map').setZIndex(2);
        // 地图初始配置记录
        map.setOptions(initOptions);
        map.animateTo(
            {
                pitch: 0,
                zoom: 11,
            },
            {
                duration: 300,
            },
        );
    }
    add3DLayer(map) {
        const threeLayer = new ThreeLayer('3DLayer', {
            forceRenderOnMoving: true,
            forceRenderOnZooming: true,
            forceRenderOnRotating: true,
            animation: true,
            zIndex: 10,
        });

        threeLayer.prepareToDraw = (gl, scene, camera) => {
            camera.add(new THREE.PointLight('#fff', 1.3));
            // 初始化车辆
            this.initModelManger();
            // 初始化障碍物图层
            this.initObstacleLayer(map);
            // 初始化点云图层
            this.initPointLayer(map);
            // 初始化3D锁站图层
            //this.initLockLayer(threeLayer);
            // this.initCarModel(threeLayer, map, camera);
            // 岸桥、场桥、电箱、电桩、锁岛模型加载
            //this.initModel(threeLayer);
        };
        threeLayer.addTo(map);
    }
    initLockLayer = (threeLayer) => {
        const mapLayer = this.state.map.getLayer('Map');
        let { locker3DArr } = this.props.data;
        if (locker3DArr.length > 0) {
            locker3DArr.forEach((polygon) => {
                let polygonCopy = polygon.copy();
                polygonCopy.addTo(mapLayer);
                let locker3D = new WaveWall(
                    polygonCopy,
                    { height: 8, speed: 0.05, color: 'orange' },
                    threeLayer,
                );
                threeLayer.addMesh(locker3D);
            });
        }
    };
    initModelManger = () => {
        const { modelManager } = this.props.index;
        if (!modelManager) {
            const newModelManager = getModelManager('simple');
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
    modelLoaded = () => {
        const { map } = this.state;
        const threeLayer = map.getLayer('3DLayer');
        const camera = threeLayer.getCamera();
        const { modelManager } = this.props.index;
        if (!modelManager) {
            this.props.dispatch({
                type: 'index/updateModelManager',
                modelManager: this.state.modelManager,
            });
        }
        setTimeout(() => {
            this.initCarModel(threeLayer, map, camera);
        });
    };
    initCarModel = (threeLayer, map, camera) => {
        const { modelManager } = this.state;
        const artModel = modelManager.getModel('art');
        artModel.rotation.x = Math.PI / 2;
        artModel.scale.set(2, 2, 2);
        artModel.name = 'car';
        threeLayer.addMesh(artModel);
        //设置虚拟车辆模型
        this.setVirtualCar(artModel, threeLayer, camera);
    };
    //加载虚拟车模型
    setVirtualCar = (model, threeLayer, camera) => {
        let virtuaModel = model.clone();
        virtuaModel.position.set(0, 0, 0);
        virtuaModel.name = 'carFaker';
        virtuaModel.rotation.x = Math.PI / 2;
        virtuaModel.traverse(function (child) {
            if (child.isMesh) {
                child.material = child.material.clone();
                child.material.opacity = 0.5;
            }
        });
        threeLayer.addMesh(virtuaModel);

        // var controls = new THREE.OrbitControls(camera, virtuaModel);
    };
    // 障碍物图层
    initObstacleLayer = (map) => {
        const { obstacleSymbol } = this.state;
        const obstacleLayer = new maptalks.VectorLayer('obstacle', {
            enableAltitude: true,
            drawAltitude: obstacleSymbol,
            zIndex: 2,
        });
        map.addLayer(obstacleLayer);
    };
    //点云图层
    initPointLayer = (map) => {
        const pointsLayer = new maptalks.VectorLayer('points', {
            enableAltitude: true,
            zIndex: 2,
        }).addTo(map);
        map.addLayer(pointsLayer);
        const pointsLayers = new maptalks.VectorLayer('point', {
            enableAltitude: true,
            zIndex: 2,
        }).addTo(map);
        map.addLayer(pointsLayers);
    };
    initModel = (threeLayer) => {
        const {
            EboxModel,
            EpileModel,
            suodaoModel,
            EboxArr,
            EpileArr,
            suodaoArr,
            changQiaoModel,
            quayCraneModelArr,
        } = this.props.data;
        if (EboxModel) {
            EboxArr.forEach((itemPos) => {
                const item = EboxModel.clone();
                item.position.copy(threeLayer.coordinateToVector3(itemPos));
                threeLayer.addMesh(item);
            });
        }
        if (EpileModel) {
            EpileArr.forEach((itemPos) => {
                const item = EpileModel.clone();
                item.position.copy(threeLayer.coordinateToVector3(itemPos));
                threeLayer.addMesh(item);
            });
        }
        if (suodaoModel) {
            suodaoArr.forEach((itemPos) => {
                const item = suodaoModel.clone();
                item.position.copy(threeLayer.coordinateToVector3(itemPos));
                threeLayer.addMesh(item);
            });
        }
        if (changQiaoModel) {
            let modelChang = changQiaoModel.clone();
            threeLayer.addMesh(modelChang);
        }
        if (quayCraneModelArr) {
            quayCraneModelArr.forEach((model) => {
                let modelAn = model.clone();
                threeLayer.addMesh(modelAn);
            });
        }
    };
    initWatch = () => {
        this.setState({
            isShowWatch: !this.state.isShowWatch,
        });
    };
    addCarModelClick = (params) => {
        this.setState({
            drawCarLayer: true, //开启车辆打点状态
        });
    };
    //重定位
    onReset = () => {
        const { cheId } = this.props.data;
        const { map, isChecked, formValue } = this.state;
        const threeLayer = map.getLayer('3DLayer');
        const threeObj = threeLayer.getScene().getObjectByName('carFaker');
        // const poscenter = map.getCenter();
        let body = {
            art_id: cheId,
            x: formValue.abscissa,
            y: formValue.ordinate,
        };
        if (isChecked) {
            confirm({
                title: '操作确认?',
                icon: <ExclamationCircleOutlined />,
                content: '是否确定要对当前位置设置为目标点？',
                okText: '是',
                okType: 'danger',
                cancelText: '否',
                onOk: () => {
                    getReset(body).then((data) => {
                        if (data) {
                            message.success('success');
                            //更新地图pcd点云数据
                            getPcd(body).then((data) => {
                                if (
                                    data?.pcd_points &&
                                    data?.pcd_points.length > 0
                                ) {
                                    this.pcdPoints(map, data.pcd_points);
                                }
                            });
                        }
                    });
                },
                onCancel: () => {
                    //this.SwitchChange(false)
                },
            });
        } else {
            message.warning('请选取目的点');
        }
    };
    //清除底盘故障
    clearFalt = () => {
        const { cheId } = this.props.data;
        confirm({
            title: '操作确认?',
            icon: <ExclamationCircleOutlined />,
            content: '是否确定下发清除故障指令？',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
                clearFalt({
                    art_id: cheId,
                }).then((data) => {
                    if (data) {
                        message.success('success');
                    }
                });
            },
            onCancel: () => {},
        });
    };
    //改变视角
    setWatchModule = (module) => {
        this.state.isFreeView = false;
        if (module == 2) {
            this.state.isFreeView = true;
        } else {
            const map = this.state.map;
            let pitch = 0;
            let zoom = 9;
            switch (module) {
                case 1:
                    pitch = 70;
                    zoom = 11;
                    break;
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
        }
        this.setState({
            isShowWatch: false,
        });
    };
    controlClick = (params) => {
        let { target, yaw } = this.state.formValue;
        switch (params) {
            case 'top':
                target += 1;
                break;
            case 'buttom':
                target -= 1;
                break;
            case 'left':
                //   yaw = subFloat(yaw,0.1);
                yaw -= 1;
                break;
            case 'right':
                //   yaw = addFloat(yaw,0.1);
                yaw += 1;
                break;
        }
        this.setState({
            formValue: {
                target: target,
                yaw: yaw,
            },
        });
    };

    //改变横距纵距姿态
    inputChange = (value, types) => {
        const { map, formValue, isfirst } = this.state;
        const { dldata } = this.props.index;
        const threeLayer = map.getLayer('3DLayer');
        const threeObj = threeLayer.getScene().getObjectByName('carFaker');
        const poscenter = map.getCenter();
        poscenter.yaw = 0;
        if (isfirst) {
            formValue.pose = dldata.yaw;
        }
        switch (types) {
            case 'departure':
                formValue.departure = value; //横坐标
                break;
            case 'longitudinal':
                formValue.longitudinal = value; //纵坐标
                break;
            case 'pose':
                formValue.pose = value; //姿态
                break;
        }

        const point = this.calcTargetPointByDistance(poscenter, formValue);
        formValue.abscissa = point.x;
        formValue.ordinate = point.y;
        formValue.yaw = point.yaw;
        if (threeObj) {
            threeObj.rotation.y = JSON.parse(point.yaw) - Math.PI;
            threeObj.position.copy(
                threeLayer.coordinateToVector3([point.x, point.y]),
            );
            this.setState({
                isChecked: true,
                isfirst: false,
            });
        }
    };
    // onChangeip = (e) => {
    //     this.setState({
    //         ipValue: e.target.value,
    //     });
    // };
    //绑定车端IP事件
    // saveIp = () => {
    //     const { ipValue } = this.state;
    //     const { cheId } = this.props.data;
    //     let body = {
    //         art_id: cheId,
    //         ip: ipValue,
    //     };
    //     if (ipValue) {
    //         getBind(body)
    //             .then((data) => {
    //                 if (!data) {
    //                     message.error('格式错误');
    //                 } else {
    //                     message.success('success');
    //                     this.setState({
    //                         ipStatus: true,
    //                     });
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.error(error, 'error');
    //             });
    //     } else {
    //         message.warning('请输入车辆IP地址');
    //     }
    // };
    onChangeOrder = () => {
        const { stop_flag } = this.state;
        const { cheId } = this.props.data;
        let stop_switch = !stop_flag;
        let body = {
            che_id: cheId,
            stop_truck: stop_switch,
        };

        confirm({
            title: '操作确认?',
            icon: <ExclamationCircleOutlined />,
            content: '是否确定下发停车/恢复指令？',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
                this.order(body);
            },
            onCancel: () => {},
        });
    };
    order = (body) => {
        const { stop_flag } = this.state;
        stop(body)
            .then((data) => {
                if (data) {
                    // this.setState({
                    //     stop_flag: !stop_flag,
                    // });
                }
            })
            .catch((error) => {
                console.error(
                    'error-------->',
                    error.response.data.error.message,
                );
            });
    };
    //降水强度
    changeRain = (value) => {
        this.setState({
            rainValue: value,
        });
    };
    BtnEvent = () => {
        const { rainValue } = this.state;
        if (rainValue < 0) rainValue = '0';
        if (rainValue > 255) rainValue = '255';

        const { cheId } = this.props.data;
        let body = {
            art_ids: [cheId],
            intensity_threshold: rainValue,
        };
        confirm({
            title: '操作确认?',
            icon: <ExclamationCircleOutlined />,
            content: '是否确定要设置为雨天intensity？',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
                miscInfo(body)
                    .then((data) => {
                        // message.success('success');
                    })
                    .catch((error) => {
                        console.error(
                            'error-------->',
                            error.response.data.error.message,
                        );
                    });
            },
            onCancel: () => {
                this.setState({
                    rainValue: '',
                });
            },
        });
    };

    render() {
        let intensity_threshold = this.props.index.dldata?.intensity_threshold;
        const { config, formValue, isChecked, ipValue, stop_flag, rainValue } =
            this.state;
        if (intensity_threshold == null || intensity_threshold == 'undefined') {
            intensity_threshold = '-';
        }
        let tools = <div></div>;
        let rainfall = <div></div>;
        if (config.tools) {
            tools = (
                <div>
                    <div className={style.mapTool}>
                        {/* 视角选择框 */}
                        {this.state.isShowWatch && (
                            <div className={`baseViewType ${style.viewType}`}>
                                <div
                                    align="middle"
                                    className={style.viewRow}
                                    onClick={() => {
                                        this.setWatchModule(1);
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
                                        this.setWatchModule(0);
                                    }}
                                >
                                    <div
                                        span={20}
                                        className={style.viewTypeName}
                                    >
                                        <span>鸟瞰视角</span>
                                    </div>
                                </div>
                                <div
                                    align="middle"
                                    className={style.viewRow}
                                    onClick={() => {
                                        this.setWatchModule(2);
                                    }}
                                >
                                    <div
                                        span={20}
                                        className={style.viewTypeName}
                                    >
                                        <span>自由视角</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <Access accessKey="TrunkDev-CarDetail-control">
                            <p
                                onClick={() => {
                                    this.addCarModelClick();
                                }}
                            >
                                <i
                                    className="iconfont icon-dianweizongshu"
                                    title="打点"
                                ></i>
                            </p>
                        </Access>
                        {/* <p onClick={this.initWatch}>
                            <i
                                className="iconfont icon-qiehuanshijiao"
                                title="视角"
                            ></i>
                        </p> */}
                        <Access accessKey="TrunkDev-CarDetail-clearChassis">
                            <p onClick={this.clearFalt}>
                                <img
                                    src={clearIcon}
                                    className={style.iconStyle}
                                    title="清除底盘故障"
                                />
                            </p>
                        </Access>
                    </div>
                </div>
            );
        }
        if (config.rainfall) {
            rainfall = (
                <div className={style.mapRain}>
                    <div className={style.rainbox}>
                        <Collapse
                            bordered={false}
                            expandIcon={({ isActive }) => (
                                <CaretRightOutlined
                                    rotate={isActive ? 90 : 0}
                                />
                            )}
                            className="site-collapse-custom-collapse"
                        >
                            <Panel
                                header={'阈值：' + intensity_threshold}
                                key="1"
                                className="site-collapse-custom-panel"
                            >
                                <InputNumber
                                    min={0}
                                    max={255}
                                    step={1}
                                    value={rainValue}
                                    onChange={this.changeRain}
                                />
                                <Button
                                    type="primary"
                                    size="small"
                                    icon={<CheckOutlined />}
                                    onClick={this.BtnEvent}
                                />
                            </Panel>
                        </Collapse>
                    </div>
                    <div className={style.rainIcon}>
                        <img src={rainIcon} title="降雨量" />
                    </div>
                </div>
            );
        }

        return (
            <div className={style.mapBox}>
                <div className={style.infodiv}>
                    <div className={style.msgdiv}>
                        <DetailMsg />
                    </div>
                    <Access accessKey="TrunkDev-CarDetail-control">
                        <div className={style.content}>
                            <div className={style.infotitle}>
                                单车控制
                                <Switch
                                    ref={(input) => (this.input = input)}
                                    checked={isChecked}
                                    onChange={(e) => {
                                        this.SwitchChange(e);
                                    }}
                                />
                            </div>
                            {/* <div className={style.conState}>
                                <div className={style.inpt}>
                                    <Input
                                        placeholder="请输入车辆IP地址"
                                        onChange={(e) => {
                                            this.onChangeip(e);
                                        }}
                                    />
                                    <Button
                                        type="primary"
                                        onClick={this.saveIp}
                                        value={ipValue}
                                    >
                                        绑定车端IP
                                    </Button>
                                </div>
                            </div> */}
                            <div className={style.bot}>
                                <div className={style.right}>
                                    <Form>
                                        <Form.Item label="横距(m)">
                                            <InputNumber
                                                min={-50}
                                                max={50}
                                                step={0.1}
                                                value={formValue.departure}
                                                onChange={(e) => {
                                                    this.inputChange(
                                                        e,
                                                        'departure',
                                                    );
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item label="x">
                                            <InputNumber
                                                disabled
                                                value={formValue.abscissa}
                                            />
                                        </Form.Item>
                                        <Form.Item label="纵距(m)">
                                            <InputNumber
                                                min={-50}
                                                max={50}
                                                step={0.1}
                                                value={formValue.longitudinal}
                                                onChange={(e) => {
                                                    this.inputChange(
                                                        e,
                                                        'longitudinal',
                                                    );
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item label="y">
                                            <InputNumber
                                                disabled
                                                value={formValue.ordinate}
                                            />
                                        </Form.Item>
                                        <Form.Item label="目标姿态">
                                            <InputNumber
                                                min={-Math.PI}
                                                max={Math.PI}
                                                step={0.1}
                                                value={formValue.pose}
                                                onChange={(e) => {
                                                    this.inputChange(e, 'pose');
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item label="yaw">
                                            <InputNumber
                                                disabled
                                                value={formValue.yaw}
                                            />
                                        </Form.Item>
                                        <div>
                                            <Button
                                                type="primary"
                                                className={style.confirmBtn}
                                                onClick={this.onSubmit}
                                            >
                                                下发控车
                                            </Button>
                                            <Button
                                                type="primary"
                                                className={style.confirmBtn}
                                                onClick={this.onReset}
                                            >
                                                重置定位
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </Access>
                </div>
                <div className={style.mapdiv}>
                    <div className={style.title}> 地图 </div>
                    <div id="miniMap" className={style.map}></div>
                    {rainfall}
                    {tools}
                    <div className={style.swith}>
                        <Access accessKey="TrunkDev-emergency-stop">
                            <Button
                                className={style.confirmBtn}
                                style={{
                                    background: stop_flag
                                        ? '#798495'
                                        : '#ea0000',
                                }}
                                onClick={this.onChangeOrder}
                            >
                                {stop_flag ? '恢复停车' : '紧急停车'}
                            </Button>
                        </Access>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect(({ index }) => ({
    index,
}))(MiniMap);
