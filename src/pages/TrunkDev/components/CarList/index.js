/*
 * @Description: 车辆列表组件
 * @Project:
 * @Author: yunfei
 * @Date: 2021-10-19 17:29:13
 * @LastEditors: yunfei
 * @lastTime: 2021-11-12 13:37:36
 * @Modified By: yunfei
 * @文件相对于项目的路径: /TrunkFace/src/pages/TrunkDev/components/CarList/index.js
 */
import React, { Component } from 'react';
import style from './index.less';
import { Table, Space, Input } from 'antd';
import { connect } from 'umi';
import { fixedNumber } from 'utils/resize';
import location from '@/assets/images/dev/location.svg';
import trace from '@/assets/images/dev/trace.svg';
import istrace from '@/assets/images/dev/istrace.svg';

const { Search } = Input;
class CarList extends Component {
    constructor(props) {
        super(props);
        this.different = [];
        this.state = {
            locationActive: null,
            trackActive: null,
            selectedRowKeys: [],
            planList: [],
            dataSource: [],
            value: '',
            searchFlag: false,
            carList: [],
            fault: 0,
            online: 0,
            total: 0,
            columns: [
                {
                    title: '车号',
                    dataIndex: 'name',
                    width: 60,
                    align: 'center',
                    ellipsis: true,
                },
                // {
                //     title: '车速',
                //     dataIndex: 'speed',
                //     width: '80px',
                //     align: 'center',
                //     ellipsis: true,
                // },
                // {
                //     title: '精度',
                //     dataIndex: 'distanceToTarget',
                //     width: '80px',
                //     align: 'center',
                //     ellipsis: true,
                // },
                {
                    title: '电量',
                    dataIndex: 'electricity',
                    align: 'center',
                    width: 60,
                    ellipsis: true,
                    rowClassName: (record, index) => {},
                    render: (text, record) => (
                        // <Space size="middle">
                        <span
                            className={
                                parseInt(text) < 30 && parseInt(text) != 0
                                    ? 'normal low'
                                    : 'normal'
                            }
                        >
                            {text}
                        </span>
                        // </Space>
                    ),
                },
                {
                    title: '',
                    dataIndex: 'tos',
                    align: 'center',
                    width: 60,
                    ellipsis: true,
                    render: (text, record, index) => (
                        <Space>
                            <a
                                className={style.active}
                                onClick={() => {
                                    this.handleLocation(text, record, index);
                                }}
                                // className={`${ this.state.locationActive == index ? style.active : '' }`}
                            >
                                <img src={location} className={style.trace} />
                            </a>
                            <a
                                onClick={() => {
                                    this.handleTrack(text, record, index);
                                }}
                            >
                                <img
                                    src={
                                        this.props.index.interaction
                                            .trackingCar === record.key
                                            ? istrace
                                            : trace
                                    }
                                    className={style.trace}
                                />
                            </a>
                            {/* <a
                                className={`${
                                    record.planFlag ? style.active : ''
                                }`}
                                onClick={() => {
                                    record.planFlag = !record.planFlag;
                                    this.handlePlan(text, record, index);
                                }}
                            >
                                规划路线
                            </a> */}
                        </Space>
                    ),
                },
                {
                    title: '状态',
                    width: 70,
                    dataIndex: 'status',
                    align: 'center',
                    ellipsis: true,
                },
            ],
        };
    }

    /**
     * 搜索
     * @param {*} e
     */
    onSearch = (e) => {
        this.setState(
            {
                searchFlag: e.target.value == '' ? false : true,
                value: e.target.value,
                dataSource: [],
            },
            () => {
                this.setCarData();
            },
        );
    };

    /**
     * 定位
     * @param {*} text
     * @param {*} record
     * @param {*} index
     */
    handleLocation = (text, record, index) => {
        if (!record || record.status === '-') {
            // 异常车辆不允许定位
            return;
        }
        this.setState({
            locationActive: index,
        });
        this.props.dispatch({
            type: 'index/positioningCar',
            payload: {
                positioningCar: record.key,
            },
        });
    };

    /**
     * 追踪
     * @param {*} text
     * @param {*} record
     * @param {*} index
     */
    handleTrack = (text, record, index) => {
        if (!record || record.status === '-') {
            // 异常车辆不允许追踪
            return;
        }
        const { trackingCar } = this.props.index.interaction;
        if (record.key === trackingCar) {
            this.props.dispatch({
                type: 'index/trackingCar',
                payload: {
                    trackingCar: null,
                },
            });
        } else {
            this.props.dispatch({
                type: 'index/trackingCar',
                payload: {
                    trackingCar: record.key,
                },
            });
        }
        this.handleSetRender();
    };
    /**
     * 重新触发render
     */
    handleSetRender = () => {
        this.setState(
            {
                dataSource: [],
            },
            () => {
                this.handleSetTableSort();
            },
        );
    };
    /**
     * 路线规划
     * @param {*} text
     * @param {*} record
     * @param {*} index
     */
    handlePlan = (text, record, index) => {
        let { dataSource } = this.state;
        dataSource[index].planFlag = !dataSource[index].planFlag;
        this.setState({
            dataSource,
        });
        let { planList } = this.state;
        planList.push();
        this.props.dispatch({
            type: 'index/showCar',
            payload: {
                showCar: [],
            },
        });
    };

    onSelectChange = (selectedRowKeys) => {
        localStorage.setItem('carCheck', JSON.stringify(selectedRowKeys));
        this.props.dispatch({
            type: 'index/showCar',
            payload: {
                showCar: selectedRowKeys,
            },
        });
        this.setState(
            {
                selectedRowKeys,
                dataSource: [],
            },
            () => {
                this.handleSetTableSort();
            },
        );
    };

    /**
     * val过滤
     * @param {*} val
     * @returns
     */
    filter(val) {
        return val ? val : '-';
    }

    /**
     * 列表赋值及过滤处理
     */
    setCarData() {
        let { carList, searchFlag, value, online, total, fault } = this.state;
        let dataSource = [];
        online = 0;
        fault = 0;
        if (carList && carList.length) {
            total = carList.length;
            carList.map((item) => {
                dataSource.push({
                    key: item.cheId,
                    name: this.filter(item.cheId),
                    // speed: fixedNumber(item.speed),
                    // distanceToTarget: fixedNumber(item.distanceToTarget),
                    status: this.filter(item.stateFlow),
                    electricity: item.soc ? item.soc : 0,
                    tos: item.isAttendenceTos == 'YES' ? '登陆' : '离线',
                });
                if (item.isAttendenceTos == 'YES') {
                    online += 1;
                }
                if (item.faultsList && item.faultsList.length) {
                    fault += 1;
                }
            });
            if (searchFlag && value) {
                let newlist = [];
                dataSource.map((item) => {
                    if (item.name.indexOf(this.state.value) >= 0) {
                        newlist.push(item);
                    } else if (item.status.indexOf(this.state.value) >= 0) {
                        newlist.push(item);
                    }
                });
                dataSource = newlist;
            }
            this.setState({
                dataSource,
                online,
                fault,
                total,
            });
        }
    }

    /**
     * 列表排序处理
     * @param {*} val
     */
    handleSetTableSort(val) {
        let actStatusList = val || this.props.index.data.actStatusList; //车辆列表数据
        let { selectedRowKeys } = this.state;
        if (selectedRowKeys.length) {
            let dellist = JSON.parse(JSON.stringify(actStatusList)); //未选中的数组
            let pushlist = []; //选中的数组
            selectedRowKeys.forEach((item) => {
                var obj = actStatusList.find((val) => val.cheId == item);
                obj.id = obj.cheId.substr(1);
                pushlist.push(obj);
                dellist = dellist.filter((val) => val.cheId != item);
            });
            if (dellist.length && pushlist.length) {
                pushlist.sort((a, b) => {
                    return a.id + '' > b.id + '' ? 1 : -1;
                });
                actStatusList = pushlist.concat(dellist);
            }
        }
        this.setState(
            {
                carList: actStatusList,
            },
            () => {
                this.setCarData();
            },
        );
    }

    componentDidMount() {
        this.input.focus();
        let { actStatusList } = this.props.index.data;
        if (actStatusList && actStatusList.length) {
            let localCar = localStorage.getItem('carCheck');
            if (localCar && JSON.parse(localCar).length) {
                localCar = JSON.parse(localCar);
                this.setState({ selectedRowKeys: localCar }, () => {
                    this.handleSetTableSort(actStatusList);
                });
            } else {
                this.setState(
                    {
                        carList: actStatusList,
                    },
                    () => {
                        this.setCarData();
                    },
                );
            }
        }
    }

    /**
     * 比较数组指定字段值是否相同
     * @param {*} array1
     * @param {*} array2
     */
    setArr = (array1, array2) => {
        this.different = [];
        for (let i = 0; i < array1.length; i++) {
            let isExist = false;
            for (let j = 0; j < array2.length; j++) {
                if (
                    array1[i].stateFlow === array2[j].stateFlow &&
                    array1[i].soc === array2[j].soc
                ) {
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                this.different.push(array1[i]);
            }
        }
        //console.log('不同', this.different)
        if (this.different.length) {
            this.handleSetRender();
        }
        return this.different;
    };

    shouldComponentUpdate(newProps, newState) {
        if (newState.selectedRowKeys.length && newState.carList.length) {
            let newL = JSON.parse(JSON.stringify(newState.carList));
            newL.sort((a, b) => {
                return a.cheId + '' > b.cheId + '' ? 1 : -1;
            }),
                this.setArr(newProps.index.data.actStatusList, newL);
        } else {
            this.setArr(newProps.index.data.actStatusList, newState.carList);
        }
        return this.different.length || !this.state.dataSource.length
            ? true
            : false;
    }

    render() {
        const { columns, selectedRowKeys, dataSource, total, online, fault } =
            this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div className={style.popoverCarCon}>
                {/* <div className={style.tags}>
                    <span>车辆总数: {total || 0}</span>
                    <span>在线车辆: {online || 0}</span>
                    <span>故障车辆: {fault || 0}</span>
                </div> */}
                <div className={style.search}>
                    <Search
                        ref={(input) => (this.input = input)}
                        placeholder="请输入车辆编号或状态"
                        onChange={this.onSearch}
                        enterButton
                        id="antdInput"
                    />
                </div>
                <div className={style.table}>
                    <Table
                        rowKey="key"
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                        rowSelection={rowSelection}
                        scroll={{ y: '100%' }}
                    />
                </div>
            </div>
        );
    }
}

export default connect(({ index }) => ({
    index,
}))(CarList);
