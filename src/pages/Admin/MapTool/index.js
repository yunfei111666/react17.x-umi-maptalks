/*
 * @Author: JackFly
 * @since: 2021-08-30 11:19:42
 * @lastTime: 2022-01-21 10:17:44
 * @文件相对于项目的路径: /TrunkFace/src/pages/Admin/MapTool/index.js
 * @message:
 */
import React, { Component } from 'react';
import { Modal, Upload, Button, Space, message, Row, Col } from 'antd';
import * as THREE from 'three';
import * as maptalks from 'maptalks';
import { getMap, uploadMap, issueMap } from '@/services/admin';
import '@root/node_modules/maptalks/dist/maptalks.css';
import * as turf from '@turf/turf';
import { SketchPicker } from 'react-color';
import style from './index.less';
import { MapStyle } from 'components/Map/model/MapStyle';

class MapTools extends Component {
    constructor(props) {
        super(props);
        this.state = {
            map: null,
            mapData: null,
            drawLayer: null,
            drawTool: null,

            isShowTools: false, //地图选择视图
            propsFile: {
                name: 'file',
                accept: '.json',
                customRequest: this.customRequest,
            },
            mapConfig: {
                center: [0, 0],
                zoom: 7.5,
                pitch: 0,
                bearing: 0,
                spatialReference: {
                    projection: 'identity',
                },
                attribution: false,
                // 性能优化
                hitDetect: false,
                seamlessZoom: true, //	是否使用无缝缩放模式
                // overviewControl: true,
                // layerCanvasLimitOnInteracting: 0, //交互时在地图上绘制图层画布的限制，设置它以提高性能。
                fog: false, //	是否在远处绘制雾
                // fogColor:[r,g,b] //雾的颜色：[r, g, b]
                layerSwitcherControl: {
                    position: 'bottom-left',
                    // title of base layers
                    baseTitle: 'Base Layers',
                    // title of layers
                    overlayTitle: 'Layers',
                    // layers you don't want to manage with layer switcher
                    excludeLayers: [],
                    // css class of container element, maptalks-layer-switcher by default
                    containerClass: 'maptalks-layer-switcher',
                },
                doubleClickZoom: false,
            },
            layerConfig: {
                debug: false, //
                geometryEvents: false, //启用/禁用触发几何事件，禁用它以提高性能。
                enableSimplify: false, //是否在渲染前简化几何图形。
                hitDetect: false, // 命中检测 禁用提高性能
                forceRenderOnMoving: true,
                forceRenderOnZooming: true,
                forceRenderOnRotating: true,
                // cursor:	, //图层的光标样式
                // defaultIconSize:[20,20], //标记图标的默认大小
                // drawAltitude: false, //是否绘制高度：标记的垂直线，线的垂直多边形
                // enableAltitude: true, //是否开启带高度渲染几何体，默认为false
                // altitudeProperty: 'altitude',
            },
            mapStyle: {},
            drawStyle: {
                Point: {
                    markerFill: 'rgba(0,0,255,0.5)',
                },
                Polygon: {
                    lineWidth: 1,
                },
            },
            background: 'rgba(0,100,255,0.4)',
            showColorPicker: false,
            toolsList: [
                {
                    type: 'selectView',
                    name: '图形选择',
                    icon: 'iconfont icon-tuxingxuanze',
                },
                {
                    type: 'setlock',
                    name: '锁站设计',
                    icon: 'iconfont icon-suozhan',
                },
                {
                    type: 'setOcean',
                    name: '海面设计',
                    icon: 'iconfont icon-haimian',
                },
                {
                    type: 'repeal',
                    name: '撤销',
                    icon: 'iconfont icon-chexiao',
                },
                {
                    type: 'reset',
                    name: '重做',
                    icon: 'iconfont icon-zhongzuo',
                },
                {
                    type: 'empty',
                    name: '清空',
                    icon: 'iconfont icon-qingkong',
                },
            ],
            gragraphList: [
                {
                    type: 'Point',
                    icon: 'iconfont icon-dian',
                    text: '点',
                },
                {
                    type: 'LineString',
                    icon: 'iconfont icon-zhixian',
                    text: '线',
                },
                {
                    type: 'Polygon',
                    icon: 'iconfont icon-duobianxing',
                    text: '多边形',
                },
                {
                    type: 'Circle',
                    icon: 'iconfont icon-tuoyuanxing-copy',
                    text: '圆',
                },
                {
                    type: 'Ellipse',
                    icon: 'iconfont icon-tuoyuanxing-copy',
                    text: '椭圆',
                },
                {
                    type: 'Rectangle',
                    icon: 'iconfont icon-juxing',
                    text: '矩形',
                },
                {
                    type: 'FreeHandLineString',
                    icon: 'iconfont icon-shouhuixian',
                    text: '手绘线',
                },
                {
                    type: 'FreeHandPolygon',
                    icon: 'iconfont icon-shouhuiduobianxing',
                    text: '手绘多边形',
                },
            ],
            visible: false,
            lockJson: null,
            oceanJson: null,
            demo: 1223,
        };
    }
    componentDidMount() {
        this.init();
    }
    componentWillUnmount() {
        if (this.state.map) {
            this.state.map.remove();
        }
        document.removeEventListener('keydown', this.keydownEvnet, false);
    }
    init() {
        this.setState({
            mapStyle: MapStyle(
                localStorage.theme
                    ? localStorage.theme.split('theme-')[1]
                    : 'white',
            ),
        });
        getMap()
            .then((data) => {
                if (data.type !== 'FeatureCollection') {
                    let lock = [];
                    if (data.design.lockJson.length > 0) {
                        lock = JSON.stringify(
                            JSON.parse(data.design.lockJson),
                            null,
                            4,
                        );
                    }

                    //maptalks json
                    this.setState({
                        map: maptalks.Map.fromJSON('map', data),
                        mapData: data,
                        lockJson: lock,
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
                                zIndex: 1,
                            },
                        },
                        {
                            name: 'lockLayer',
                            config: {
                                zIndex: 1,
                            },
                        },
                    ]);
                }
                // 初始化地图工具
                this.initDrawTool(this.state.map);
                this.initMapLayer(this.state.map.getLayer('Map'));
            })
            .catch((err) => {});
    }
    initDrawTool(map) {
        let drawLayer = map.getLayer('drawLayer');

        let drawTool = new maptalks.DrawTool({
            mode: 'Point',
            once: true,
        })
            .addTo(map)
            .disable();

        drawTool.on('drawend', (param) => {
            if (param.geometry.getType() === 'Point') {
                param.geometry.updateSymbol({
                    ...this.state.drawStyle.Point,
                    markerFill: this.state.background,
                });
            } else {
                param.geometry.setSymbol({
                    ...this.state.drawStyle.Polygon,
                    lineColor: this.state.background,
                    polygonFill: this.state.background,
                });
            }
            if (this.state.oceanJson == 0) {
                const oceanGeometry = drawLayer.getGeometryById('ocean');
                if (oceanGeometry) {
                    oceanGeometry.remove();
                }
                param.geometry.setId('ocean');
                drawLayer.addGeometry(param.geometry);
            } else {
                drawLayer.addGeometry(param.geometry);
            }
        });
        this.state.drawLayer = drawLayer;
        this.state.drawTool = drawTool;

        // 地图绑定事件
        map.on('click', (e) => {
            //范围检测
            map.identify(
                {
                    coordinate: e.coordinate,
                    layers: [drawLayer],
                },
                (geos) => {
                    if (geos.length === 0) {
                        this.cancelDraw();
                        return;
                    }
                    geos.forEach((g) => {
                        this.startDraw(g);
                        if (g.type === 'Point') {
                            g.updateSymbol({
                                markerFill: this.state.background,
                            });
                        } else {
                            g.updateSymbol({
                                polygonFill: this.state.background,
                                lineColor: this.state.background,
                            });
                        }
                    });
                },
            );
        });

        // keypress
        document.addEventListener('keydown', this.keydownEvnet);
    }
    //TODO地图事件
    toolsClick = (params, visible) => {
        switch (params) {
            case 'selectView': //图形选择
                this.setState({
                    showColorPicker: false,
                    isShowTools: visible,
                });
                break;
            case 'setlock': //锁站设计
                this.setState({
                    visible: true,
                    isShowTools: false,
                });
                break;
            case 'setOcean': //海面设计
                this.state.drawTool.setMode('Rectangle').enable();
                this.setState({
                    oceanJson: 0,
                    isShowTools: false,
                });

                break;
            case 'repeal': //撤销
                if (this.state.editObj) {
                    this.state.editObj.undoEdit();
                }
                this.setState({
                    showColorPicker: false,
                    isShowTools: false,
                });
                break;
            case 'reset': //重做
                if (this.state.editObj) {
                    this.state.editObj.redoEdit();
                }
                this.setState({
                    showColorPicker: false,
                    isShowTools: false,
                });
                break;
            case 'empty': //清空
                if (this.state.drawLayer) {
                    this.state.drawLayer.clear();
                }
                this.setState({
                    showColorPicker: false,
                    isShowTools: false,
                });
                break;
            case 'colour': //调色板
                this.setState({
                    isShowTools: false,
                    showColorPicker: !this.state.showColorPicker,
                });
                break;
            default:
        }
    };
    // 图形类型点击事件
    viewTypeClick = (params) => {
        this.state.drawTool.setMode(params).enable();
        this.setState({
            isShowTools: false,
        });
    };
    keydownEvnet = (e) => {
        if (e.code == 'Backspace' && this.state.editObj) {
            this.state.editObj.remove();
        }
    };
    startDraw(geometry) {
        if (this.state.editObj) {
            this.cancelDraw();
        }

        this.setState({
            editObj: geometry,
        });
        this.state.editObj.startEdit();
        this.state.editObj.setOptions({
            visible: true,
        });
    }
    cancelDraw() {
        if (this.state.editObj) {
            this.state.editObj.endEdit();
            this.setState({
                editObj: null,
            });
        }
    }
    addLayers(layers) {
        layers.forEach((item) => {
            let config = Object.assign(this.state.layerConfig, item.config);
            new maptalks.VectorLayer(item.name, config).addTo(this.state.map);
        });
    }
    initMapLayer(mapLayer) {
        // todo 初始化车道线
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
                    geometry.updateSymbol(styles[module][type]);
                } else {
                    geometry.updateSymbol(styles[module][0]);
                }
            });
        } else {
            const centerVule = turf.center(geojson).geometry.coordinates;
            // 禁止通行区域

            state.map.setCenter(centerVule);
            let geometry = maptalks.GeoJSON.toGeometry(geojson);
            geometry.forEach((item) => {
                let module = item.type;
                let type = item.properties.type;
                let text = item.properties.text;
                let coordinates = item.getCenter();
                let textType = item._coordinates.length ? 0 : 1;
                if (module != 'Point') {
                    item.setSymbol(styles[module][type]).addTo(mapLayer);
                    if (text) {
                        if (type == 'Yard') {
                            new maptalks.Marker(coordinates, {
                                symbol: {
                                    ...styles['Point'][textType],
                                    textName: text,
                                },
                            }).addTo(mapLayer);
                        }
                    }
                }
            });

            var polygon = new maptalks.Polygon(stoparea, {
                visible: true,
                editable: true,
                cursor: 'pointer',
                shadowBlur: 0,
                shadowColor: 'black',
                draggable: false,
                dragShadow: false, // display a shadow during dragging
                drawOnAxis: null, // force dragging stick on a axis, can be: x, y
                symbol: {
                    lineColor: '#34495e',
                    lineWidth: 2,
                    polygonFill: 'rgb(135,196,240)',
                    polygonOpacity: 0.6,
                },
            });
            polygon.addTo(mapLayer);
        }
    }

    handleChangeComplete = (color) => {
        var colorVule = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
        this.setState({
            background: colorVule,
        });
        if (this.state.editObj) {
            if (this.state.editObj.type === 'Point') {
                this.state.editObj.updateSymbol({
                    markerFill: colorVule,
                });
            } else {
                this.state.editObj.updateSymbol({
                    polygonFill: colorVule,
                });
            }
        }
    };
    uploadMapFn = (file) => {
        uploadMap(file)
            .then((res) => {
                if (res) {
                    this.state.map.remove();
                    this.init(); //初始化地图
                    message.success('上传成功！');
                }
            })
            .catch((error) => {
                console.error(error, 'error');
            });
    };

    issueMapFn = (file) => {
        issueMap(file)
            .then((res) => {
                if (res) {
                    this.state.map.remove();
                    this.init(); //初始化地图
                    message.success('下发成功！');
                }
            })
            .catch((error) => {
                console.error(error, 'error');
            });
    };

    //上传文件
    customRequest = (option) => {
        const formData = new FormData();
        formData.append('file', option.file);
        this.uploadMapFn(formData);
    };
    // 下发
    issuedMap = () => {
        const { lockJson, map } = this.state;
        const mapData = map.toJSON();
        const drawLayer = map.getLayer('drawLayer');
        mapData.design = {
            lockJson: lockJson,
        };
        // todo 发布地图
        let file = {
            data: mapData,
        };
        this.issueMapFn(file);
    };
    lockDesign = () => {
        let lockLayer = this.state.map.getLayer('lockLayer');
        lockLayer.clear();
        let lockJson = [];

        if (this.state.lockJson.length == 0) {
            lockLayer.clear();
            this.setState({
                visible: false,
            });
            message.success('锁站清空');
        } else {
            try {
                lockJson = JSON.parse(this.state.lockJson);
                lockJson.forEach((item, index) => {
                    const { position, status } = item;
                    let arr = position[2];
                    position.splice(2, 1);
                    position.push(arr);
                    let lastPoint = position[0];
                    position.push(lastPoint);
                    let color = 'red';
                    if (status == 'open') {
                        color = 'green';
                    }
                    if (status !== 'reserve') {
                        const polygon = new maptalks.Polygon(position, {
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
                                polygonFill: color,
                                polygonOpacity: 0.6,
                            },
                        });
                        polygon.addTo(lockLayer);
                    }
                    //锁岛3D模型
                });
                this.setState({
                    visible: false,
                });
            } catch {
                message.error('请输入正确的json格式');
            }
        }
    };
    lockClose = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const { theme } = localStorage;
        const { hash } = location;
        const isBlackThemeAndAdmin =
            theme === 'theme-black' && hash.indexOf('Admin') > -1;
        const { visible, loading } = this.state;

        return (
            <div className="subview">
                <div className="sub-tools">
                    <div></div>
                    <div className="sub-tools-right">
                        <Space size="middle" align="right" direction="right">
                            <Upload
                                {...this.state.propsFile}
                                showUploadList={false}
                            >
                                <Button type="primary">上传地图</Button>
                            </Upload>
                            <Button type="primary" onClick={this.issuedMap}>
                                地图下发
                            </Button>
                        </Space>
                    </div>
                </div>
                <div className="sub-container">
                    <div style={{ height: '100%', position: 'relative' }}>
                        <div id="map" className={style.map}></div>
                        {/* 左侧地图工具 */}
                        <div className={style.mapLeftTool}>
                            <ul>
                                {this.state.toolsList.map((item, index) => {
                                    if (item.type == 'selectView') {
                                        return (
                                            <li
                                                key={index}
                                                onMouseEnter={() => {
                                                    this.toolsClick(
                                                        item.type,
                                                        true,
                                                    );
                                                }}
                                                onMouseLeave={() => {
                                                    this.toolsClick(
                                                        item.type,
                                                        false,
                                                    );
                                                }}
                                            >
                                                <span
                                                    className={item.icon}
                                                ></span>
                                                <div>{item.name}</div>
                                            </li>
                                        );
                                    } else {
                                        return (
                                            <li
                                                key={index}
                                                onClick={() => {
                                                    this.toolsClick(item.type);
                                                }}
                                            >
                                                <span
                                                    className={item.icon}
                                                ></span>
                                                <div>{item.name}</div>
                                            </li>
                                        );
                                    }
                                })}

                                <li
                                    onClick={() => {
                                        this.toolsClick('colour');
                                    }}
                                >
                                    <div className={style.colors}></div>
                                    <div>调色板</div>
                                </li>
                            </ul>
                        </div>
                        {/* 图形选择框 */}
                        {this.state.isShowTools && (
                            <div
                                className={`baseViewType ${style.viewType}`}
                                onMouseEnter={() => {
                                    this.toolsClick('selectView', true);
                                }}
                                onMouseLeave={() => {
                                    this.toolsClick('selectView', false);
                                }}
                            >
                                {this.state.gragraphList.map((item, index) => {
                                    return (
                                        <Row
                                            key={index}
                                            align="middle"
                                            className={style.viewRow}
                                            onClick={() => {
                                                this.viewTypeClick(item.type);
                                            }}
                                        >
                                            <Col
                                                span={4}
                                                className={`${style.iconStyle} `}
                                            >
                                                <span
                                                    className={item.icon}
                                                ></span>
                                            </Col>
                                            <Col
                                                span={20}
                                                className={style.viewTypeName}
                                            >
                                                <span>{item.text}</span>
                                            </Col>
                                        </Row>
                                    );
                                })}
                            </div>
                        )}
                        <div
                            className={[
                                style.colorPicker,
                                this.state.showColorPicker
                                    ? style.showColorPicker
                                    : '',
                            ].join(' ')}
                        >
                            <SketchPicker
                                color={this.state.background}
                                onChangeComplete={this.handleChangeComplete}
                                width={'100%'}
                            />
                        </div>
                    </div>
                </div>
                <Modal
                    visible={visible}
                    title="锁站设计"
                    onOk={this.lockDesign}
                    onCancel={this.lockClose}
                    // footer={[
                    //     <Button key="back" onClick={this.handleCancel}>
                    //         Return
                    //     </Button>,
                    //     <Button
                    //         key="submit"
                    //         type="primary"
                    //         loading={loading}
                    //         onClick={this.handleOk}
                    //     >
                    //         Submit
                    //     </Button>,
                    //     <Button
                    //         key="link"
                    //         href="https://google.com"
                    //         type="primary"
                    //         loading={loading}
                    //         onClick={this.handleOk}
                    //     >
                    //         Search on Google
                    //     </Button>,
                    // ]}
                >
                    <textarea
                        className={style.lockJson}
                        defaultValue={this.state.lockJson}
                        onChange={(e) => {
                            let lockJson = e.target.value
                                .split('\n')
                                .join('')
                                .replace(/\s*/g, '');
                            this.setState({
                                lockJson: lockJson,
                            });
                        }}
                    ></textarea>
                </Modal>
            </div>
        );
    }
}

export default MapTools;
