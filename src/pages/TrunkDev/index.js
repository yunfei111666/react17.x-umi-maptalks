import React, { Component } from 'react';
import './index.less';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Map from 'components/Map/MapSite';
import CarInfo from './components/CarInfo';
import Cache from '@/utils/cache.js';
import { speech, play, stop } from '@/utils/speech.js';
import { notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import WebSocketClient from 'utils/websocketClient';
import Config from '@/config/base.js';
import { isEqual } from 'lodash';
const world = require('/public/protobuf/world_mix_pb.js');
class TrunkDev extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alarmMap: null,
            prevAlarmStr: '',
            alarmList: [], //故障列表
            carList: [], //车辆列表
            theme: localStorage.theme || 'theme-white',
            sideFlag: false,
            carFlag: false,
            cheId: '',
            zoomFlag: false,
            sideActive: null,
            setMiniMapLayer: null, //小地图图层
            detail: {
                job: {
                    cheId: '-',
                    orderGkey: '-',
                    taskProgress: 0,
                },
                worldMsg: {
                    cheId: '-',
                    currentSpeed: 0,
                    distance: 0, //剩余里程
                    gear: 0, //档位
                    yaw: 0, //转向
                    soc: 0, //电量
                    isAttendenceTos: 'YES', //车辆状态：
                    currentThrottle: 0, //油门：
                    currentBrake: 0, //刹车
                },
                todayData: {},
            },
            drawTools: null,
            devMap: null,
            activeGeoParams: null,
            isEditing: false,
        };
    }

    /**
     * 打开ws
     * @param {*} cheId
     */
    handleOpenWs(cheId) {
        let details = Config.wsDetails + cheId + '/';
        const wsDetails = new WebSocketClient(details);
        wsDetails.init();
        let oldData = null;
        wsDetails.onmessage = (message) => {
            let data = world.WorldMix.deserializeBinary(
                message.data,
            ).toObject();
            if (!isEqual(oldData, data)) {
                oldData = data;
                this.setState({
                    cheId: cheId,
                    detail: data,
                });
            }
        };
        this.props.dispatch({
            type: 'index/nowWs',
            payload: {
                nowWs: wsDetails,
            },
        });
    }

    setPopover = (val) => {
        if (val.hasOwnProperty('carFlag') && !val.carFlag) {
            //打开列表
            this.props.dispatch({
                type: 'index/showInfo',
                payload: {
                    showInfo: null,
                    isUpdate: true,
                },
            });
            this.setState({
                zoomFlag: false,
                sideFlag: this.state.sideActive == 1 ? 'true' : val.sideFlag,
                carFlag: val.carFlag,
            });
        }
        if (val.carFlag && val.cheId) {
            //打开小地图
            if (this.props.index.interaction.showInfo) {
                this.props.dispatch({
                    type: 'index/showInfo',
                    payload: {
                        showInfo: null,
                        isUpdate: true,
                    },
                });
            }
            this.handleOpenWs(val.cheId);
            if (this.state.sideActive != 1) {
                this.state.sideFlag = false;
            }
            this.setState({
                carFlag: val.carFlag,
                cheId: val.cheId,
                mapData: val.mapData,
                mapStyle: val.mapStyle,
            });
        }
        //关闭列表
        if (val.hasOwnProperty('sideFlag') && !val.sideFlag) {
            if (this.state.sideActive == 1) {
                this.setState({
                    sideFlag: val.sideFlag,
                    sideActive: null,
                });
            } else {
                this.setState({
                    sideFlag: val.sideFlag,
                    carFlag: val.carFlag,
                    sideActive: null,
                });
            }
        }
        //打开车辆列表
        if (val.hasOwnProperty('sideFlag') && val.sideFlag) {
            this.setState({
                sideFlag: val.sideFlag,
            });
        }
        if (!val.forbidden) {
            this.state.drawTools.disable();

            this.setState({
                activeGeoParams: null,
                isEditing: false,
            });
            const geos = this.state.devMap
                .getLayer('forbiddenArea')
                .getGeometries();
            geos.forEach((g) =>
                g.endEdit().setOptions({
                    editable: false,
                }),
            );
            const lasyGeo = geos[geos.length - 1];
            lasyGeo && !lasyGeo._id && geos[geos.length - 1].remove();
        }
    };
    setDrawTools = (val) => {
        this.setState({
            drawTools: val,
        });
    };
    setDevMap = (val) => {
        this.setState({
            devMap: val,
        });
    };
    setGeoParams = (val) => {
        if (!val && this.state.activeGeoParams?.geometry) {
            this.state.activeGeoParams.geometry
                .updateSymbol({
                    lineColor: '#FF2828',
                    polygonFill: '#FF2828',
                    polygonOpacity: 0.23,
                    lineDasharray: null,
                })
                .endEdit();
        }
        this.setState({
            activeGeoParams: val,
        });
    };
    setEditStatus = (val) => {
        this.setState({
            isEditing: val,
        });
    };

    setMiniMapLayer = (val) => {
        this.setState({
            setMiniMapLayer: val,
        });
    };
    setZoom = () => {
        this.setState({
            zoomFlag: !this.state.zoomFlag,
        });
    };

    setSideActive = (val) => {
        let { sideActive } = this.state;
        sideActive = val.id;
        this.setState({
            sideActive,
        });
    };

    componentDidMount() {
        this.setState({
            alarmMap: new Cache(),
        });
    }

    componentWillUnmount() {
        if (speech) stop('');
        if (notification) notification.destroy();
        if (this.state.alarmMap) this.state.alarmMap.clear();
        this.setState = (state, callback) => {
            return;
        };
    }

    openNotification = (msg, placement) => {
        notification.open({
            className: 'faultNotBox',
            description: msg,
            duration: 5,
            maxCount: 10,
            icon: <ExclamationCircleOutlined style={{ color: '#ea0000' }} />,
            placement,
        }); //弹框提示
    };

    handeSetAlarmUp(val) {
        if (val && val.length) {
            let newStr = JSON.stringify(val);
            if (this.state.prevAlarmStr !== newStr) {
                this.setState({
                    prevAlarmStr: JSON.stringify(val),
                    alarmList: val,
                });
            }
            try {
                val.forEach((item) => {
                    let id = item.cheId + item.code;
                    if (!this.state.alarmMap.containsKey(id)) {
                        this.state.alarmMap.set(id, item);
                        let msg = item.cheId + ' !' + item.alarmCodeDesc;
                        let text = item.cheId + '--' + item.alarmCodeDesc;
                        play(msg); //语音播放
                        this.openNotification(text, 'bottomLeft'); //弹框提示
                    } else {
                        throw new Error();
                    }
                });
            } catch (e) {}
        }
    }

    // handeSetCarUp(val) {
    //     if (val && val.length) {
    //         let newStr = JSON.stringify(val);
    //         if (this.state.prevCarStr !== newStr) {
    //             this.setState({
    //                 prevCarStr: JSON.stringify(val),
    //                 carList: val,
    //             });
    //         }
    //     }
    // }

    componentDidUpdate() {
        let { actFaultsList, actStatusList } = this.props.index.data;
        this.handeSetAlarmUp(actFaultsList);
        // this.handeSetCarUp(actStatusList);
    }
    setChild = (that) => {
        this.setState({
            child: that,
        });
    };

    render() {
        const sidebar = this.state.drawTools ? (
            <Sidebar
                setPopover={this.setPopover}
                setSideActive={this.setSideActive}
                setEditStatus={this.setEditStatus}
                setGeoParams={this.setGeoParams}
                {...this.state}
            />
        ) : null;
        return (
            <div className="container">
                <Header />
                {sidebar}
                <div className="wrapper">
                    <div className="map">
                        <Map
                            setChild={this.setChild}
                            setPopover={this.setPopover}
                            setMiniMapLayer={this.setMiniMapLayer}
                            config={{ environment: true }}
                            setDrawTools={this.setDrawTools}
                            setDevMap={this.setDevMap}
                            setGeoParams={this.setGeoParams}
                            setEditStatus={this.setEditStatus}
                            setSideActive={this.setSideActive}
                        />
                    </div>
                    <CarInfo
                        {...this.state}
                        setPopover={this.setPopover}
                        setZoom={this.setZoom}
                    />
                </div>
            </div>
        );
    }
}

export default connect(({ index }) => ({
    index: index,
}))(TrunkDev);
