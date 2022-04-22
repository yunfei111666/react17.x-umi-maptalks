/*
 * @Description: 车辆详细信息
 * @Project:
 * @Author: yunfei
 * @Date: 2021-10-20 17:31:12
 * @Modified By: yunfei
 * @文件相对于项目的路径: /TrunkFace/src/pages/TrunkDev/components/CarMsg/index.js
 */
import { connect } from 'umi';
import React, { Component } from 'react';
import style from './index.less';
import { Progress, Tabs, Tooltip } from 'antd';
import * as maptalks from 'maptalks';
import '../../../../../node_modules/maptalks/dist/maptalks.css';
import * as THREE from 'three';
import { ThreeLayer } from 'maptalks.three';
import { fixedNumber } from 'utils/resize';
import { stop } from '@/services/common';
import { getModelManager } from '@/utils/loadModel.js';
import Access from '@/components/Access';
import { throttle } from 'lodash';
const { TabPane } = Tabs;
class CarMsg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: [
                {
                    label: '任务ID',
                    key: 'taskGkey',
                    val: '-',
                },
                {
                    label: '目的地',
                    key: 'target',
                    val: '-',
                },
                {
                    label: '集装箱类别',
                    key: 'licheng',
                    val: '-',
                },
                {
                    label: '任务类型',
                    key: 'jobType',
                    val: '-',
                },
                {
                    label: '停车精度',
                    key: 'distanceToTarget',
                    val: '-',
                },
                {
                    label: '任务进度',
                    key: 'taskProgress',
                    val: '0',
                },
            ],
            day: [
                {
                    label: '行驶里程',
                    key: 'mileage',
                    val: '11',
                    unit: 'km',
                },
                {
                    label: '百公里耗电',
                    key: 'consumePower',
                    val: '11',
                    unit: 'km',
                },
                {
                    label: '对位次数',
                    key: 'align',
                    val: '11',
                    unit: '次',
                },
                {
                    label: '在线时长',
                    key: 'runDuration',
                    val: '11',
                    unit: 'min',
                },
                {
                    label: '工作时长',
                    key: 'workDuration',
                    val: '11',
                    unit: 'min',
                },
                {
                    label: '对位时长',
                    key: 'alignDuration',
                    val: '11',
                    unit: 'min',
                },
            ],
            node: [
                {
                    key: 'Localization',
                    val: '正常',
                },
                {
                    key: 'Perception',
                    val: '正常',
                },
                {
                    key: 'Navigation',
                    val: '正常',
                },
                {
                    key: 'Lidar',
                    val: '正常',
                },
                {
                    key: 'Hdmap',
                    val: '正常',
                },
                {
                    key: 'World',
                    val: '正常',
                },
                {
                    key: 'Canbus',
                    val: '正常',
                },
            ],
            dom: [
                {
                    label: '车速',
                    unit: 'km/h',
                    val: 0,
                    key: 'currentSpeed',
                },
                {
                    label: '剩余里程',
                    unit: 'm',
                    val: 0,
                    key: 'finalDistance',
                },
                {
                    label: '档位',
                    unit: '',
                    val: 0,
                    key: 'gear',
                },
                {
                    label: '转向',
                    unit: '',
                    val: 0,
                    key: 'direction',
                },
                {
                    label: '电量',
                    unit: '%',
                    val: 0,
                    key: 'soc',
                },
                {
                    label: '车辆状态',
                    unit: '',
                    val: 0,
                    key: 'stateFlow',
                },
                {
                    label: '油门',
                    unit: '',
                    val: 0,
                    key: 'currentThrottle',
                },
                {
                    label: '制动',
                    unit: '',
                    val: 0,
                    key: 'currentBrake',
                },
            ],
            stop_flag: false, //stop时事件
        };
    }
    /**
     * 初始化3D
     */
    initMap() {
        let map = new maptalks.Map('3dView', {
            center: [0, 0],
            zoom: 9, // 9.589446666162749,
            maxZoom: 9,
            minZoom: 9,
            pitch: 75, //映射高度
            bearing: 22.19999999999959,
            draggable: false, //禁用拖
            dragPan: false, //禁用拖移
            dragRotate: false, //禁用拖旋转
            dragPitch: false, //禁用拖距
            scrollWheelZoom: false, //禁用轮放大
            touchZoom: false, //禁用触动放大
            doubleClickZoom: false, //禁用双击放大
            attribution: false,
        });
        this.setState({ map });
        //3D图层
        const threeLayer = new ThreeLayer('threeLayer', {
            forceRenderOnMoving: true,
            forceRenderOnRotating: true,
            animation: true,
        });
        // this.threeLayer.setZIndex(10);
        threeLayer.prepareToDraw = function (gl, scene, camera) {
            camera.add(new THREE.PointLight('#fff', 1.3));
        };
        threeLayer.addTo(map);
        this.initModelManager();
        // 地图旋转
        let bearing = 0;
        function change() {
            requestAnimationFrame(change);
            map.setBearing(bearing++);
        }
        change();
    }

    handleClose = () => {
        this.props.handleClose();
    };

    componentDidMount() {
        this.initMap();
    }
    initModelManager = () => {
        const { modelManager } = this.props.index;
        if (!modelManager) {
            const newModelManager = getModelManager();
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
        const { modelManager, map } = this.state;
        const { modelManager: propModelManager } = this.props.index;
        if (!modelManager) {
            this.props.dispatch({
                type: 'index/updateModelManager',
                modelManager: propModelManager,
            });
        }
        const threeLayer = map.getLayer('threeLayer');
        setTimeout(() => {
            const model = modelManager.getModel('art');
            model.rotation.x = Math.PI / 2;
            model.rotation.y = 0 - Math.PI / 4.5;
            model.scale.set(50, 50, 50);
            model.position.copy(threeLayer.coordinateToVector3([0, 0]));
            // 矫正
            model.translateZ(5.5);
            threeLayer && threeLayer.addMesh(model);
        });
    };
    setData() {
        let { day, task, node } = this.state;
        let { todayData, job, worldMsg } = this.props.detail;
        day.map((item) => {
            item.val = todayData[item.key];
        });
        task.map((item) => {
            item.val = job[item.key];
        });
        node.map((item) => {
            item.val = worldMsg[item.key];
        });
        return {
            day,
            task,
            node,
        };
    }

    stopCar = () => {
        const { stop_flag } = this.state;
        const { cheId } = this.props;
        let stop_switch = !stop_flag;
        let data = {
            che_id: cheId,
            stop_truck: stop_switch,
        };
        //节流限制多次点击事件为5秒内执行1次
        this.stop(data);
    };
    stop = throttle(
        function (data) {
            stop(data)
                .then((res) => {
                    if (res) {
                        // this.setState({
                        //     stop_flag: !stop_flag,
                        // });
                    }
                })
                .catch((error) => {
                    console.error(error, 'error');
                });
        },
        5000,
        {
            leading: true,
            trailing: false,
        },
    );
    render() {
        const { cheId } = this.props;
        const { job, worldMsg } = this.props.detail;
        const { day, task, node } = this.setData();
        const { dom, stop_flag } = this.state;
        return (
            <>
                <div className={style.title}>
                    <span className={style.text}>{cheId}</span>
                    <i
                        className={`iconfont icon-zidongjiashi1 ${style.active}`}
                    ></i>
                    <i className="iconfont icon-rengongjiashi"></i>
                    <i
                        className="iconfont icon-delete"
                        onClick={this.handleClose}
                    ></i>
                </div>
                <div className={style.content}>
                    <div className={style.info}>
                        {dom.map((item, index) => {
                            return (
                                <div className={style.list} key={index}>
                                    <span className={style.label}>
                                        {item.label}：
                                    </span>
                                    {item.key == 'direction' ? (
                                        <>
                                            <i className="iconfont icon-zuozhuanxiang"></i>
                                            <i className="iconfont icon-zhihang"></i>
                                            <i className="iconfont icon-youzhuanxiang"></i>
                                        </>
                                    ) : (
                                        <>
                                            <span className={style.val}>
                                                {fixedNumber(
                                                    worldMsg[item.key],
                                                )}{' '}
                                                {item.unit}
                                            </span>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <Access accessKey="TrunkDev-emergency-stop">
                        <div
                            className={style.carBtn}
                            style={{
                                background: stop_flag ? '#798495' : '#ea0000',
                            }}
                            onClick={this.stopCar}
                        >
                            {stop_flag ? '恢复停车' : '紧急停车'}
                        </div>
                    </Access>

                    <div className={style.faultBox}>
                        <div className={style.map} id="3dView"></div>
                    </div>
                    <div className={style.carPopoverCon}>
                        <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
                            <TabPane tab="当前任务" key="1">
                                <ul className={style.taskBox}>
                                    {task.map((item, index) => {
                                        return (
                                            <li key={index}>
                                                <span>{item.label}：</span>
                                                <Tooltip
                                                    placement="right"
                                                    title={item.val}
                                                >
                                                    <span className={style.val}>
                                                        {item.val}
                                                    </span>
                                                </Tooltip>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <div className={style.progressBox}>
                                    <Progress
                                        percent={job.taskProgress || 0}
                                        showInfo={false}
                                        strokeColor="#5098FF"
                                        trailColor="#D8D8D8"
                                        strokeWidth={10}
                                    />
                                </div>
                            </TabPane>
                            <TabPane tab="当天数据" key="2">
                                <ul className={style.dayBox}>
                                    {day.map((item, index) => {
                                        return (
                                            <li key={index}>
                                                <span>{item.label}：</span>
                                                <span>{item.val}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </TabPane>
                            <TabPane tab="节点状态" key="3">
                                <ul className={style.nodeBox}>
                                    {node.map((item, index) => {
                                        return (
                                            <li key={index}>
                                                <span>{item.key}</span>
                                                <span>{item.val}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </>
        );
    }
}

export default connect(({ index }) => ({
    index,
}))(CarMsg);
