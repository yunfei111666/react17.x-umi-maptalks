/*
 * @Description: 车辆列表组件
 * @Project:
 * @Author: yunfei
 * @Date: 2021-10-19 17:29:13
 * @LastEditors: Libj
 * @lastTime: 2021-11-12 13:37:36
 * @Modified By: yunfei
 * @文件相对于项目的路径: /TrunkFace/src/pages/TrunkDev/components/CarList/index.js
 */
import React, { Component, useState, useEffect, useRef } from 'react';
import style from './index.less';
import { Table, Space, Input, Button, message } from 'antd';
import { connect } from 'umi';
import { fixedNumber } from 'utils/resize';
import { stop } from '@/services/common';

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
            flag: '',
            carStatus: [
                {
                    name: '在线车辆',
                    num: 0,
                    status_img: require('../../../../assets/images/dev/online.png'),
                },
                {
                    name: '作业车辆',
                    num: 0,
                    status_img: require('../../../../assets/images/dev/working.png'),
                },
                {
                    name: '空闲车辆',
                    num: 0,
                    status_img: require('../../../../assets/images/dev/leisure.png'),
                },
                {
                    name: '充电车辆',
                    num: 0,
                    status_img: require('../../../../assets/images/dev/power.png'),
                },
                {
                    name: '接管车辆',
                    num: 0,
                    status_img: require('../../../../assets/images/dev/takeover.png'),
                },
                {
                    name: '故障车辆',
                    num: 0,
                    status_img: require('../../../../assets/images/dev/faults.png'),
                },
                {
                    name: '离线车辆',
                    num: 0,
                    status_img: require('../../../../assets/images/dev/offline.png'),
                },
            ],
            columns: [
                {
                    title: '车号',
                    dataIndex: 'name',
                    width: 65,
                    align: 'center',
                    ellipsis: true,
                },
                {
                    title: '模式',
                    dataIndex: 'taskSource',
                    width: 65,
                    align: 'center',
                    ellipsis: true,
                },
                {
                    title: '状态',
                    width: 70,
                    dataIndex: 'status',
                    align: 'center',
                    ellipsis: true,
                },
                {
                    title: '目的地',
                    dataIndex: 'target',
                    width: 70,
                    align: 'center',
                    ellipsis: true,
                },
                {
                    title: '电量',
                    dataIndex: 'electricity',
                    align: 'center',
                    width: 65,
                    ellipsis: true,
                    render: (text, record) => (
                        <span
                            className={
                                parseInt(text) < 30 && parseInt(text) != 0
                                    ? 'normal low'
                                    : 'normal'
                            }
                        >
                            {text}
                        </span>
                    ),
                },
                {
                    title: '充电',
                    dataIndex: 'isCharging',
                    align: 'center',
                    width: 60,
                    ellipsis: true,
                },
                {
                    title: '车速',
                    dataIndex: 'speed',
                    width: 65,
                    align: 'center',
                    ellipsis: true,
                },
                {
                    title: 'X',
                    dataIndex: 'x',
                    width: 70,
                    align: 'center',
                    ellipsis: true,
                },
                {
                    title: 'Y',
                    dataIndex: 'y',
                    width: 70,
                    align: 'center',
                    ellipsis: true,
                },
                {
                    title: '指令类型',
                    dataIndex: 'jobType',
                    width: 60,
                    align: 'center',
                    ellipsis: true,
                },
                {
                    title: '业务类型',
                    dataIndex: '',
                    width: 60,
                    align: 'center',
                    ellipsis: true,
                },
                {
                    title: '箱号1',
                    dataIndex: 'container1',
                    width: 70,
                    align: 'center',
                    ellipsis: true,
                },
                {
                    title: '箱号2',
                    dataIndex: 'container2',
                    width: 70,
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

    onSelectChange = (selectedRowKeys) => {
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
        let { carList, carStatus, searchFlag, value } = this.state;
        let { actJobsList } = this.props.index.data;
        let dataSource = [];
        carStatus.forEach((item) => {
            item.num = 0;
        });
        let list = actJobsList.reduce((pre, cur) => {
            let target = pre.find((ee) => ee.cheId == cur.cheId);
            if (target) {
                Object.assign(target, cur);
            }
            return pre;
        }, carList);
        if (list && list.length) {
            console.log('list', list);
            list.map((item) => {
                dataSource.push({
                    key: item.cheId,
                    name: this.filter(item.cheId),
                    target: item.target ? fixedNumber(item.target) : 0, //目的地
                    taskSource: item.taskSource,
                    electricity: item.soc ? item.soc : 0,
                    status: this.filter(item.stateFlow),
                    speed: fixedNumber(item.speed), //车速
                    isCharging: item.isCharging ? item.isCharging : 'NO',
                    x: item.point ? item.point.x : 0,
                    y: item.point ? item.point.y : 0,
                    jobType: item.jobType ? item.jobType : 0,
                    container1:
                        item.containersList && item.containersList.length
                            ? item.containersList[0]?.id
                            : 0,
                    container2:
                        item.containersList && item.containersList.length
                            ? item.containersList[1]?.id
                            : 0,
                    tos: item.isAttendenceTos == 'YES' ? '登陆' : '离线',
                });
                if (item.isAttendenceTos == 'YES') {
                    carStatus[0].num += 1; //在线车辆
                } else {
                    carStatus[6].num += 1; //离线车辆
                }
                if (item.taskGkey) {
                    carStatus[1].num += 1; //作业车辆
                }
                if (item.stateFlow == '空闲') {
                    carStatus[2].num += 1; //空闲车辆
                }
                if (item.isCharging == 'YES') {
                    carStatus[3].num += 1; //充电车辆
                }
                if (item.operationalStatus == 'MANUAL') {
                    carStatus[4].num += 1; //接管车辆
                }
                if (item.faultsList && item.faultsList.length) {
                    carStatus[5].num += 1; //故障车辆
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
                carStatus,
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
    handleOrder(type) {
        let { selectedRowKeys } = this.state;
        let order = false;
        switch (type) {
            case 'estop':
                order = true;
                break;
            case 'resume':
                order = false;
                break;
            default:
                break;
        }
        selectedRowKeys.length &&
            selectedRowKeys.forEach((item) => {
                this.stop({
                    che_id: item,
                    stop_truck: order,
                });
            });

        this.setState({
            flag: type,
        });
    }
    stop(data) {
        stop(data)
            .then((res) => {
                if (res) {
                    message.success('操作成功！');
                }
            })
            .catch((error) => {
                console.error(error, 'error');
            });
    }

    render() {
        const { columns, selectedRowKeys, dataSource, flag, carStatus } =
            this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div className={style.popoverCarCon}>
                <div className={style.tags}>
                    {carStatus.map((item, index) => {
                        return (
                            <div className={style.tag} key={index}>
                                <img src={item.status_img}></img>
                                <div>
                                    <span>{item.name}</span>
                                    <span>{item.num || 0}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className={style.search}>
                    <Button
                        size="small"
                        onClick={() => this.handleOrder('estop')}
                    >
                        EStop
                    </Button>
                    <Button
                        size="small"
                        onClick={() => this.handleOrder('resume')}
                        type="primary"
                    >
                        Resume
                    </Button>
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
