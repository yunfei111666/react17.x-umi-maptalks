/*
 * @Description:
 * @Project: TrunkMonitor
 * @Author: yunfei
 * @Date: 2021-09-06 16:50:17
 * @LastEditors: yunfei
 * @LastEditTime: 2022-01-11 18:53:04
 * @Modified By: yunfei
 * @FilePath: /TrunkFace/src/pages/TrunkMonitor/index.js
 */

import React, { Component, memo } from 'react';
import Header from './components/Header';
import LeftCon from './components/LeftCon';
import MiddleCon from './components/MiddleCon';
import RightCon from './components/RightCon';
import style from './index.less';
import { getDaily, getTotle } from '@/services/common';
import { connect } from 'umi';
import Cache from '@/utils/cache.js';
import { speech, play, stop } from '@/utils/speech.js';
import { notification, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { fixedNumber } from 'utils/resize';
class TrunkMonitor extends Component {
    constructor() {
        super();
        this.timer = null;
        this.state = {
            prevStr: '',
            alarmList: [],
            child: '',
            positionData: {
                waitTime: 0,
                positionTime: 0,
                tag: 'monitor',
                key: ['align_zeros', 'align_ones', 'align_twos'],
                legendData: ['0次对位', '1次对位', '2次对位'],
                color: ['#485AF1', '#8AF0FF', '#FF8C71'],
                seriesData: [],
            },
            operation: {
                tagsData: [
                    {
                        title: '累计里程',
                        number: 0,
                        unit: 'KM',
                        key: 'mileages',
                        icon: 'icon-leijilicheng',
                    },
                    {
                        title: '累计TEU',
                        number: 0,
                        unit: 'TEU',
                        key: 'teus',
                        icon: 'icon-leijixiangliang',
                    },
                    {
                        title: '单车效率',
                        number: 0,
                        unit: 'TEU/h',
                        key: 'work_efficiency',
                        icon: 'icon-zuoyexiaoshuai',
                    },
                ],
                echartsData: {
                    tag: 'monitor',
                    height: 'calc(100% - 10px)',
                    title: '',
                    titleLeft: 0,
                    titleTop: 10,
                    legendRight: 0,
                    fontSize: 18,
                    gradualBarColor: ['#A915FF', '#FFCE2F'],
                    gradualLineColor: ['#1FFFCC', '#0993FF'],
                    xData: [],
                    lineData: [],
                    barData: [],
                    averageValue: 0, //平均作业效率
                },
            },
            autoPieData: [
                {
                    title: '故障率',
                    gradualColor: ['#1A49FF', '#FF0CF9'], //渐变色
                    total: 0, //总数
                    value: 0, //数量
                    time: 0, //时长
                    tag: 'monitor',
                    key: ['fault_rate', 'faults', 'fault_durations'],
                    model: '',
                },
                {
                    title: '接管率',
                    gradualColor: ['#22FFA1', '#16D3FF'],
                    total: 0,
                    value: 0,
                    time: 0,
                    tag: 'monitor',
                    model: '',
                    key: [
                        'take_over_rate',
                        'take_overs',
                        'take_over_durations',
                    ],
                },
            ],
        };
    }

    getData() {
        this.timer = setInterval(() => {
            this.getdaily(); //周作业量和作业效率数据图表
            //this.gettotle(); //运营数据
        }, 3000);
    }
    getdaily() {
        getDaily({ days: 7 }).then((res) => {
            if (res && res.infos) {
                let sum = 0,
                    { operation, autoPieData, positionData } = this.state;
                operation.echartsData.xData = [];
                operation.echartsData.lineData = [];
                operation.echartsData.barData = [];
                operation.echartsData.averageValue = 0;
                res.infos.forEach((item) => {
                    operation.echartsData.xData.push(
                        item.created_date.slice(-2),
                    );
                    operation.echartsData.lineData.push(item.work_efficiency);
                    operation.echartsData.barData.push(item.teus);
                    sum += Number(item.work_efficiency);
                });
                operation.echartsData.averageValue = (
                    sum / res.infos.length
                ).toFixed(2);
                //运营数据
                operation.tagsData.map((item) => {
                    return (item.number = fixedNumber(res[item.key]));
                });
                //自动驾驶数据
                autoPieData.forEach((item) => {
                    item.value = res[item.key[0]];
                    item.total = res[item.key[1]];
                    item.time = fixedNumber(res[item.key[2]]);
                });
                //对位信息
                positionData.waitTime = fixedNumber(res.wait_durations); //等待时长
                positionData.positionTime = fixedNumber(res.align_durations); //对位时长
                positionData.legendData.map((item, index) => {
                    return positionData.seriesData.push({
                        name: item,
                        value: res[positionData.key[index]],
                    });
                });
                this.setState({
                    operation,
                    autoPieData,
                    positionData,
                });
            }
        });
    }
    gettotle() {
        getTotle().then((res) => {
            if (res) {
                let { operation, autoPieData, positionData } = this.state;
                //运营数据
                operation.tagsData.map((item) => {
                    return (item.number = fixedNumber(res[item.key]));
                });
                //自动驾驶数据
                autoPieData.forEach((item) => {
                    item.value = res[item.key[0]];
                    item.total = res[item.key[1]];
                    item.time = fixedNumber(res[item.key[2]]);
                });
                //对位信息
                positionData.waitTime = fixedNumber(res.wait_durations); //等待时长
                positionData.positionTime = fixedNumber(res.align_durations); //对位时长
                positionData.legendData.map((item, index) => {
                    return positionData.seriesData.push({
                        name: item,
                        value: res[positionData.key[index]],
                    });
                });
                this.setState({
                    operation,
                    autoPieData,
                    positionData,
                });
            }
        });
    }
    componentDidMount() {
        if (this.timer) clearInterval(this.timer);
        this.getData();
        this.getdaily();
        this.setState({
            alarmMap: new Cache(),
        });
    }

    componentWillUnmount() {
        if (speech) stop('');
        // if (notification) notification.destroy();
        if (message) message.destroy();
        this.setState = (state, callback) => {
            return;
        };
        if (this.timer) clearInterval(this.timer);
    }

    openNotification = (msg, placement) => {
        // notification.info({
        //     className: 'MonitorNotBox',
        //     // message: '',
        //     description: msg,
        //     duration: 5,
        //     //maxCount: 10,
        //     icon: <ExclamationCircleOutlined style={{ color: '#ea0000' }} />,
        //     placement,
        // }); //弹框提示
        message.info({
            className: 'MonitorNotBox',
            content: msg,
            duration: 50000,
            maxCount: 10,
            top: 200,
            icon: <ExclamationCircleOutlined style={{ color: '#ea0000' }} />,
        });
    };

    componentDidUpdate() {
        let { actFaultsList } = this.props.index.data;
        if (actFaultsList && actFaultsList.length) {
            let newStr = JSON.stringify(actFaultsList);
            if (this.state.prevStr !== newStr) {
                this.setState({
                    prevStr: JSON.stringify(actFaultsList),
                    alarmList: actFaultsList,
                });
            }
            try {
                actFaultsList.forEach((item) => {
                    let id = item.cheId + item.code;
                    if (!this.state.alarmMap.containsKey(id)) {
                        this.state.alarmMap.set(id, item);
                        let msg = item.cheId + item.alarmCodeDesc;
                        play(msg); //语音播放
                        // this.openNotification(msg, ''); //弹框提示
                    } else {
                        throw new Error();
                    }
                });
            } catch (e) {}
        }
    }

    setZoom = () => {
        this.state.child.handleZoom();
    };

    setChild = (that) => {
        this.setState({
            child: that,
        });
    };

    render() {
        return (
            <div className={style.container}>
                <Header {...this.state} />
                <div className={style.wrapper}>
                    <div className={`${style.leftCon} ${style.default}`}>
                        <LeftCon {...this.state} />
                    </div>
                    <div className={`${style.middleCon} ${style.defaultMap}`}>
                        <i
                            className={`iconfont icon-zhankai ${style.zoom}`}
                            onClick={this.setZoom}
                        ></i>
                        <MiddleCon setChild={this.setChild} />
                    </div>
                    <div className={`${style.rightCon} ${style.default}`}>
                        <RightCon {...this.state} />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(({ index }) => ({
    index,
}))(TrunkMonitor);

// TrunkMonitor.wrappers = ['@/wrappers/auth'];
// export default memo(TrunkMonitor);
