/*
 * @Description:
 * @Project: 实时故障模块
 * @Author: michelle
 * @Date: 2021-09-13 10:05:28
 * @LastEditors: michelle
 * @lastTime: 2021-11-12 09:23:13
 * @Modified By: michelle
 * @文件相对于项目的路径: /TrunkFace/src/pages/TrunkMonitor/components/Fault/index.js
 */
import React, { Component } from 'react';
import style from './index.less';
import commonStyle from '../../common.less';
import * as maptalks from 'maptalks';
import '../../../../../node_modules/maptalks/dist/maptalks.css';
import * as THREE from 'three';
import { ThreeLayer } from 'maptalks.three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Title from '../Title';

export default class Fault extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vehs: 10,
            errorveh: 1,
            online: 9,
            scrollFlag: false,
            titleInfo: {
                iconClass: 'guzhangtongji',
                text: '实时故障',
            },
            columns: [
                {
                    title: '编号',
                    dataIndex: 'name',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '车辆状态',
                    dataIndex: 'status',
                    width: 100,
                    align: 'center',
                },
                {
                    title: '电量',
                    dataIndex: 'electricity',
                    align: 'center',
                },
                {
                    title: 'TOS',
                    dataIndex: 'tos',
                    align: 'left',
                },
            ],
            table: [
                {
                    name: '胡彦斌',
                    status: 32,
                    electricity: '19',
                    tos: '1',
                },
                {
                    name: '胡彦斌',
                    status: 32,
                    electricity: '19',
                    tos: '1',
                },
            ],
        };
    }

    componentDidMount() {
        this.initMap();
    }

    /**
     * 初始化3D
     */
    initMap() {
        let map = new maptalks.Map('3dView', {
            center: [0.240513664992136, -0.13410864374779408],
            zoom: 9.589446666162749,
            pitch: 80,
            bearing: 22.19999999999959,
            attribution: false,
        });
        //3D图层
        const threeLayer = new ThreeLayer('threeLayer', {
            forceRenderOnMoving: true,
            forceRenderOnRotating: true,
            animation: true,
        });
        // this.threeLayer.setZIndex(10);
        threeLayer.prepareToDraw = function (gl, scene, camera) {
            var light = new THREE.AmbientLight('#fff');
            scene.add(light);
        };
        threeLayer.addTo(map);
        // 增加车模型
        var loader = new GLTFLoader();
        loader.load(
            './glb/car.glb',
            function (gltf) {
                var model = gltf.scene;
                model = model.clone();
                model.rotation.x = Math.PI / 2;
                model.rotation.y = 0 - Math.PI / 4.5;
                model.scale.set(35, 35, 35);
                model.position.copy(threeLayer.coordinateToVector3([0, 0]));
                // 矫正
                model.translateZ(5.5);
                // model.translateY(-100);
                // model.translateX(50);
                threeLayer.addMesh(model);
            },
            function (xhr) {
                this.circles = ((xhr.loaded / xhr.total) * 100).toFixed(2);
            },
            function (e) {
                console.error(e);
            },
        );

        // 地图旋转
        let bearing = 0;
        function change() {
            requestAnimationFrame(change);
            map.setBearing(bearing++);
        }
        change();
    }

    initdate() {
        let Allerror = [];
        const errorlist = {
            401: '未知错误',
            402: '遥控紧急制动',
            403: '定位消息无效(丢失)',
            404: '融合定位状态不好',
            405: '底盘信息无效(丢失)',
            406: '底盘制动错误',
            407: '底盘转向错误',
            408: '底盘档位错误',
            409: '底盘油门错误',
            410: '地图无效',
            411: '激光感知无效(丢失)',
            412: '路口停车指令(丢失)',
            413: '当前目标超时未完成',
        };
        let vehdata;

        // vehdata = [
        //   {
        //     name: 'P01',
        //     truck_error: [
        //       { code: '401', text: '未知错误' },
        //       { code: '402', text: '遥控紧急自动' },
        //       { code: '403', text: '定位消息无效(丢失)' },
        //       { code: '404', text: '融合定位状态不好' },
        //       { code: '405', text: '底盘信息无效(丢失)' },
        //     ],
        //   },
        //   {
        //     name: 'P02',
        //     truck_error: [
        //       { code: '406', text: '底盘自动错误' },
        //       { code: '407', text: '底盘转向错误' },
        //       { code: '408', text: '底盘档位错误' },
        //       { code: '409', text: '底盘油门错误' },
        //       { code: '410', text: '地图无效' },
        //       { code: '411', text: '激光感知无效(丢失)' },
        //       { code: '412', text: '路口停车指令(丢失)' },
        //       { code: '413', text: '当前目标超时未完成' },
        //     ],
        //   },
        // ];
        vehdata = this.props.index.vehs;

        if (vehdata) {
            vehdata.map((item) => {
                let errors = [];
                if (item.truck_error) {
                    if (item.truck_error.length > 0) {
                        item.truck_error.map((i) => {
                            errors.push({
                                details: errorlist[i.code],
                            });
                        });
                        Allerror.push({
                            name: item.name,
                            errordetails: errors,
                        });
                    }
                }
            });
        }
        return Allerror;
    }

    render() {
        return (
            <div className={`${commonStyle.main} ${style.box}`}>
                <div className={commonStyle.content}>
                    <span className={commonStyle.gradient}></span>
                    <div className={commonStyle.contents}>
                        <Title {...this.state.titleInfo} />
                        <div className={style.content}>
                            {/* style={{ display: this.initdate().length > 0 ? 'none' : 'block' }} */}
                            <div className={style.map} id="3dView"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
