/*
 * @Author: yunfei
 * @since: 2021-08-30 11:19:42
 * @lastTime: 2021-09-15 14:23:11
 * @文件相对于项目的路径: /TrunkFace/src/components/Map/MapWorld/index.js
 * @message:
 */
import React, { Component } from 'react';
import * as THREE from 'three';
import * as maptalks from 'maptalks';
import { ThreeLayer } from 'maptalks.three';
import '@root/node_modules/maptalks/dist/maptalks.css';
import * as turf from '@turf/turf';
import '../index.less';
import { getHostInfoValue } from '@/config/hostInfoConfig';
import Config from '@/config/base.js';

import RingShield from '../model/RingShield';

export default class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            map: null,
            mapData: null,
            mapConfig: {
                center: [0, 0],
                zoom: 3.8,
                pitch: 0,
                bearing: 0,

                attribution: false,
                // 性能优化
                hitDetect: false,
                seamlessZoom: true, //	是否使用无缝缩放模式
                // layerCanvasLimitOnInteracting: 0, //交互时在地图上绘制图层画布的限制，设置它以提高性能。
                fog: false, //	是否在远处绘制雾
                // fogColor:[r,g,b] //雾的颜色：[r, g, b]
            },
            layerConfig: {
                debug: false, //
                altitude: 0, //层高度
                opacity: 1, //透明度
                zIndex: 10, //图层
                geometryEvents: true, //启用/禁用触发几何事件，禁用它以提高性能。
                enableSimplify: false, //是否在渲染前简化几何图形。
                hitDetect: true, // 命中检测 禁用提高性能
                forceRenderOnMoving: true,
                forceRenderOnZooming: true,
                forceRenderOnRotating: true,
                // cursor:	, //图层的光标样式
                // defaultIconSize:[20,20], //标记图标的默认大小
                enableAltitude: false, //是否开启带高度渲染几何体，默认为false
                altitudeProperty: 'altitude', //几何的高度属性名称，如果 enableAltitude 为真，则默认为“高度”
                // drawAltitude: false, //是否绘制高度：标记的垂直线，线的垂直多边形
            },
            mapStyle: {
                lineStyle: {
                    lineColor: '#666',
                    lineWidth: 1,
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
                drawStyle: {
                    Point: {
                        markerFill: 'rgba(0,0,255,0.5)',
                        markerHeight: 22,
                        markerWidth: 22,
                    },
                    Polygon: {
                        lineWidth: 1,
                    },
                },
            },
        };
    }
    componentDidMount() {
        // const mapUrl =
        //   'https://cdn.rawgit.com/waylau/svg-china-map/master/china-map/china.geo.json';
        const token = localStorage.getItem('token');
        const mapUrl = '/china-geojson/china.json';
        token &&
            fetch(mapUrl)
                .then((response) => {
                    return response.json();
                })
                .then((json) => {
                    const map = new maptalks.Map('map', this.state.mapConfig);
                    this.setState(
                        {
                            map: map,
                            mapData: json,
                        },
                        () => {
                            this.init();
                        },
                    );
                });
    }
    componentWillUnmount() {
        if (this.state.map) this.state.map.remove();
        this.setState = (state, callback) => {
            return;
        };
    }
    init() {
        const map = this.state.map;
        this.addLayers([
            {
                name: 'Map',
                config: {
                    zIndex: 1,
                    enableAltitude: true,
                },
            },
        ]);
        this.add3Dlayer(map);
    }
    addLayers(layers) {
        layers.forEach((item) => {
            let config = Object.assign(this.state.layerConfig, item.config);
            new maptalks.VectorLayer(item.name, config).addTo(this.state.map);
        });
    }
    initMapLayer(mapLayer) {
        const state = this.state;
        const geojson = state.mapData;
        const centerVule = turf.center(geojson).geometry.coordinates;
        state.map.setCenter(centerVule);
        let geometry = maptalks.GeoJSON.toGeometry(geojson);

        const threeLayer = this.state.map.getLayer('3DLayer');
        const altitude = 400000; //模型高度

        let material = new THREE.MeshPhysicalMaterial({
            color: 'skyblue',
            opacity: 0.7,
            transparent: true,
            clearcoat: 1,
        });
        // 添加定位点
        const position = getHostInfoValue('position');
        const ringShield = new RingShield(
            position,
            // [121.864067, 29.990771],
            // [117.78067, 39.246083],
            {
                color: 'purple',
                altitude: altitude - 10000,
                speed: 0.005,
            },
            threeLayer,
        );
        threeLayer.addMesh(ringShield);
        geometry.forEach((item) => {
            let coordinates = [item._coordinates];
            if (item.type === 'MultiPolygon') {
                coordinates = item._geometries;
            }
            let polygon = new maptalks.MultiPolygon(coordinates, {
                symbol: {
                    lineColor: 'RGBA(169, 196, 255, 1)',
                    lineWidth: 2,
                    polygonFill: 'rgba(135,196,240,0.1)',
                },
            });
            let text = item.properties.name;
            let textCoordinates = item.properties.cp;
            if (text) {
                new maptalks.Marker(textCoordinates, {
                    symbol: {
                        textFaceName: 'sans-serif',
                        textFill: '#000',
                        textHorizontalAlignment: 'center',
                        textSize: 7,
                        textName: text,
                        zIndex: 100,
                    },
                    properties: {
                        altitude: altitude - 10000,
                    },
                }).addTo(mapLayer);
            }
            let mesh = threeLayer.toExtrudePolygon(
                polygon._geometries[0],
                {
                    height: altitude,
                    topColor: '#fff',
                },
                material,
            );

            threeLayer.addMesh(mesh);
            polygon.addTo(mapLayer);
        });
    }
    add3Dlayer(map) {
        const threeLayer = new ThreeLayer('3DLayer', {
            forceRenderOnMoving: true,
            forceRenderOnZooming: true,
            forceRenderOnRotating: true,
            animation: true,
            zIndex: 10,
        });
        threeLayer.prepareToDraw = (gl, scene, camera) => {
            scene.add(new THREE.AmbientLight('#fff')); // soft white light

            const mapLayer = this.state.map.getLayer('Map');

            // 初始化车道线
            this.initMapLayer(mapLayer);
        };
        threeLayer.addTo(map);
    }

    render() {
        return <div id="map"></div>;
    }
}
