/*
 * @Author: JackFly
 * @since: 2021-08-25 10:05:37
 * @lastTime: 2021-09-15 14:22:53
 * @文件相对于项目的路径: /TrunkFace/src/pages/Admin/index.js
 * @message:
 */
import React, { Component } from 'react';
import { history } from 'umi';
import CommonEchartsTitle from 'components/CommonEchartsTitle';
import ShowCountData from 'components/ShowCountData';
import AutoDriverData from 'components/AutoDriverData';
import CarBar from 'components/ReactEchats/CarBar';
import TaskBar from 'components/ReactEchats/TaskBar';
import { getDaily, getTotle, getCheTotal } from 'services/common';
import Map from 'components/Map/MapWorld';
import style from './index.less';
import '../../assets/iconfont/iconfont.css';
import { connect } from 'umi';
import Empty from 'components/Empty';
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: localStorage.theme || 'theme-white',
            // 运营数据
            operationalData: [
                {
                    title: '累计里程',
                    number: '0',
                    measureWord: 'KM',
                    iconFont: 'icon-leijilicheng',
                    keyProperty: 'mileages',
                },
                {
                    title: '累计TEU',
                    number: '0',
                    measureWord: 'TEU',
                    iconFont: 'icon-leijixiangliang',
                    keyProperty: 'teus',
                },
                {
                    title: '作业效率',
                    number: '0',
                    measureWord: 'TEU/h',
                    iconFont: 'icon-zuoyexiaoshuai',
                    keyProperty: 'work_efficiency',
                },
                {
                    title: '运营时长',
                    number: '0',
                    measureWord: 'h', //day
                    iconFont: 'icon-yunhangshijian',
                    keyProperty: 'operate_durations',
                },
                {
                    title: '平均电耗',
                    number: '0',
                    measureWord: 'kwh/km',
                    iconFont: 'icon-pingjundianhao',
                    keyProperty: 'avg_consume_power',
                },
                {
                    title: '平均时速',
                    number: '0',
                    measureWord: 'km/h',
                    iconFont: 'icon-pingjunshisu',
                    keyProperty: 'avg_speed',
                },
            ],
            // 自动驾驶数据
            autoDriverData: [
                {
                    title: '故障率',
                    //fontColor: '#404856',
                    gradualColor: ['#1A49FF', '#FF0CF9'],
                    keyProperty: ['fault_rate', 'faults', 'fault_durations'],
                    total: 100, //总数
                    value: 0, //具体数值
                    height: '100%',
                    bgColor: '#eee',
                    model: localStorage.theme || 'theme-white',
                },
                {
                    title: '接管率',
                    gradualColor: ['#22FFA1', '#16D3FF'],
                    total: 100,
                    value: 0,
                    keyProperty: [
                        'take_over_rate',
                        'take_overs',
                        'take_over_durations',
                    ],
                    height: '100%',
                    bgColor: '#eee',
                    model: localStorage.theme || 'theme-white',
                },
                {
                    keyProperty: ['align_zeros', 'align_ones', 'align_twos'],
                    legendData: ['0次对位', '1次对位', '2次对位'],
                    color: ['#485AF1', '#8AF0FF', '#FF8C71'],
                    seriesData: [],
                    model: localStorage.theme || 'theme-white',
                },
                {
                    text: ['等待时长', '对位时长'],
                    keyProperty: ['wait_durations', 'align_durations'],
                    model: localStorage.theme || 'theme-white',
                },
            ],
            // 车辆详情数据
            carDetail: {
                title: '车辆总数',
                key: ['online', 'offline'],
                legendData: ['在线车辆', '离线车辆'],
                color: ['#82FFA5', '#C2D9FF'],
                seriesData: [],
                model: localStorage.theme || 'theme-white',
            },
            // 周作业量工作效率
            taskBarData: {
                title: '',
                titleLeft: 20,
                titleTop: 10,
                legendRight: 20,
                fontSize: 14,
                gradualBarColor: [],
                gradualLineColor: [],
                xData: [],
                lineData: [],
                barData: [],
                averageValue: 0, //平均作业效率
                model: localStorage.theme || 'theme-white',
            },
        };
    }
    entryRouter = (params) => {
        history.push(`${params}`);
    };
    getShowData() {
        const { autoDriverData, operationalData, carDetail } = this.state;
        getCheTotal().then((data) => {
            if (data) {
                let newCarDetail = { ...carDetail };
                // 获取state中每分类的值
                newCarDetail.total = data.total;
                newCarDetail.key.forEach((item, index) => {
                    newCarDetail[item] = data[item];
                    newCarDetail.seriesData.push({
                        name: newCarDetail.legendData[index],
                        value: data[item],
                    });
                });
                this.setState({
                    carDetail: newCarDetail,
                });
            }
        });
        getTotle().then((data) => {
            if (data) {
                const newOperationalData = [...operationalData];
                const newAutoDriverData = [...autoDriverData];
                newOperationalData.forEach((item) => {
                    if (item.keyProperty == 'operate_durations') {
                        item[item.keyProperty] = data[item.keyProperty] * 24; //运营时长单位day=》h
                    } else {
                        item[item.keyProperty] = data[item.keyProperty];
                    }
                });
                newAutoDriverData.forEach((item, i) => {
                    if (item.hasOwnProperty('value')) {
                        item.value = data[item.keyProperty[0]];
                    }
                    item['keyProperty'].forEach((onlyKey, index) => {
                        item[onlyKey] = data[onlyKey];
                        if (i == 2) {
                            //对位信息
                            item.seriesData.push({
                                name: item.legendData[index],
                                value: data[onlyKey],
                            });
                        }
                    });
                });
                this.setState({
                    operationalData: newOperationalData,
                    autoDriverData: newAutoDriverData,
                });
            }
        });
        getDaily({ days: 7 }).then((res) => {
            if (res && res.infos) {
                let { taskBarData } = this.state;
                taskBarData.xData = [];
                taskBarData.lineData = [];
                taskBarData.barData = [];
                taskBarData.averageValue = 0;
                let sum = 0;
                res.infos.forEach((item) => {
                    taskBarData.xData.push(item.created_date.slice(-2));
                    taskBarData.lineData.push(item.work_efficiency);
                    taskBarData.barData.push(item.teus);
                    sum += Number(item.work_efficiency);
                });
                taskBarData.averageValue = (sum / res.infos.length).toFixed(2);
                this.setState({
                    taskBarData,
                });
            }
        });
    }

    componentDidMount() {
        this.getShowData();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.index.config.theme !== this.props.index.config.theme) {
            let theme = this.props.index.config.theme;
            let { carDetail, taskBarData, autoDriverData } = this.state;
            carDetail.model = theme;
            taskBarData.model = theme;
            autoDriverData.map((item) => {
                return (item.model = theme);
            });
            this.setState({
                carDetail,
                taskBarData,
                autoDriverData,
            });
        }
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    render() {
        const { carDetail, autoDriverData, operationalData, taskBarData } =
            this.state;
        return (
            <div className={style.carManagement}>
                <div className={style.linkEntry}>
                    <div
                        className={style.trunkEntry}
                        onClick={() => {
                            this.entryRouter('/TrunkDev');
                        }}
                    >
                        <div className={style.linkEntryTitle}>Trunk-dev</div>
                        <div className={style.linkEntryIntroduce}>
                            这是一个内部调试界面入口
                        </div>
                    </div>
                    <div
                        className={style.trunkEntry}
                        onClick={() => {
                            this.entryRouter('/TrunkMonitor');
                        }}
                    >
                        <div className={style.linkEntryTitle}>
                            Trunk-monitor
                        </div>
                        <div
                            to="/TrunkMonitor"
                            className={style.linkEntryIntroduce}
                        >
                            这是一个车辆监控界面入口
                        </div>
                    </div>
                </div>
                <div className={style.showInformation}>
                    <div className={style.operationalData}>
                        <div className={style.adjustStyle}>
                            <CommonEchartsTitle
                                title={'运营数据'}
                                icon={'icon-yunyingshuju'}
                            ></CommonEchartsTitle>
                        </div>
                        <div className={style.informationCardGather}>
                            {operationalData.map((item, index) => {
                                return (
                                    <ShowCountData
                                        key={index}
                                        {...item}
                                    ></ShowCountData>
                                );
                            })}
                        </div>
                        <div className={style.echartsWorksheet}>
                            {taskBarData.barData.length ? (
                                <TaskBar {...taskBarData} />
                            ) : (
                                <Empty />
                            )}
                        </div>
                    </div>
                    <div className={style.carDistribution}>
                        <Map></Map>
                    </div>
                    <div className={style.informationCount}>
                        {/* <div className={style.adjustStyle1}>
                            <CommonEchartsTitle
                                title={'车辆详情'}
                                icon={'icon-cheliangxiangqing'}
                            ></CommonEchartsTitle>
                        </div>
                        <div className={style.carCountEchart}>
                            {carDetail.total ? (
                                <>
                                    <div className={style.carTitle}>
                                        <div>
                                            车辆总数
                                            <b>{carDetail.total}</b>
                                        </div>
                                        <div>
                                            在线车辆
                                            <b>{carDetail.online}</b>
                                        </div>
                                        <div>
                                            离线车辆
                                            <b>{carDetail.offline}</b>
                                        </div>
                                    </div>
                                    <div className={style.carEchart}>
                                        <CarBar {...carDetail} />
                                    </div>
                                </>
                            ) : (
                                <Empty />
                            )}
                        </div> */}
                        <div className={style.adjustStyle2}>
                            <CommonEchartsTitle
                                title={'自动驾驶数据'}
                                icon={'icon-zidongjiashi'}
                            ></CommonEchartsTitle>
                        </div>
                        <div className={style.autoDriverEchart}>
                            <AutoDriverData
                                autoDriverData={autoDriverData}
                            ></AutoDriverData>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect(({ index }) => ({
    index,
}))(index);
