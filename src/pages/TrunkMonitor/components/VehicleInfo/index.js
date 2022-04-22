/*
 * @Description:
 * @Project: 车辆信息模块
 * @Author: michelle
 * @Date: 2021-09-13 10:05:28
 * @LastEditors: michelle
 * @LastEditTime: 2021-12-16 20:02:23
 * @LastEditors: Please set LastEditors
 * @lastTime: 2021-09-24 16:05:27
 * @Modified By: michelle
 * @文件相对于项目的路径: /TrunkFace/src/pages/TrunkMonitor/components/VehicleInfo/index.js
 */
import React, { Component } from 'react';
import style from './index.less';
import { Spin, Table, Input } from 'antd';
import commonStyle from '../../common.less';
import Title from '../Title';
import { connect } from 'umi';
import { fixedNumber } from 'utils/resize';
import { getHostInfoValue } from '@/config/hostInfoConfig';
import Config from '@/config/base.js';

const { Search } = Input;

class VehicleInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollFlag: false,
            titleInfo: {
                iconClass: 'cheliangxiangqing',
                text: '车辆信息',
            },
            columns: [
                {
                    title: '车号',
                    dataIndex: 'name',
                    align: 'center',
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    align: 'center',
                },
                {
                    title: '电量',
                    dataIndex: 'electricity',
                    align: 'center',
                },
                {
                    title: '车速',
                    dataIndex: 'speed',
                    align: 'center',
                },
            ],
        };
    }

    getData() {
        const tableData = this.props.index.data;
        let online = 0,
            total = 0,
            fault = 0,
            dataSource = [];
        // stateMachine = {
        //     'Idle': '空闲', 'Execute_Waiting': '等待任务', 'Execute_Running': '行驶中',
        //     'Execute_Arrived': '到达', 'Execute_Align_Aligning': '对位中',
        //     'Execute_Align_Aligned': '对位完成', 'Execute_TruckLocked': '锁车',
        //     'Execute_Stopped': '停车',  'Estop': 'estop', 'Offline': '离线',
        // }
        if (tableData) {
            let list = tableData.actStatusList;
            if (list) {
                total = list.length;
                list.map((item) => {
                    if (item.isAttendenceTos == 'YES') {
                        online += 1;
                    }
                    if (item.faultsList && item.faultsList.length) {
                        fault += 1;
                    }
                    dataSource.push({
                        key: item.cheId,
                        name: this.filter(item.cheId),
                        status: this.filter(item.stateFlow),
                        electricity: (item.soc ? item.soc : 0) + '%',
                        // tos: item.isAttendenceTos == 'YES' ? '登陆' : '离线',
                        speed: fixedNumber(item.speed),
                    });
                });
                if (this.state.searchFlag && this.state.value) {
                    let newlist = [];
                    dataSource.map((item) => {
                        if (item.name.indexOf(this.state.value) >= 0) {
                            newlist.push(item);
                        }
                    });
                    dataSource = newlist;
                }
            }
        }
        return {
            online,
            fault,
            total,
            dataSource,
        };
    }

    componentDidMount() {}

    componentDidUpdate() {}
    /**
     * 返回值过滤
     * @param {*} val
     */
    filter(val) {
        return val ? val : '-';
    }
    /**
     * 搜索
     * @param {*} e
     */
    onSearch = (e) => {
        this.setState({
            searchFlag: e.target.value == '' ? false : true,
            value: e.target.value,
        });
    };

    render() {
        const { total, online, fault, dataSource } = this.getData();
        const { titleInfo, columns, searchFlag } = this.state;
        const isAlign = getHostInfoValue('isAlign');
        return (
            <div
                className={`${commonStyle.main} ${
                    isAlign == 1 ? style.box : style.boxs
                }`}
            >
                <div className={commonStyle.content}>
                    <span className={commonStyle.gradient}></span>
                    <div className={commonStyle.contents}>
                        <Title {...titleInfo} />
                        <div className={style.content}>
                            <div className={style.tags}>
                                <span>车辆总数: {total || 0}</span>
                                <span>在线车辆: {online || 0}</span>
                                <span>故障车辆: {fault || 0}</span>
                            </div>
                            <div className={style.search}>
                                <Search
                                    placeholder="请输入车辆编号"
                                    onChange={this.onSearch}
                                    enterButton
                                    id="antdInput"
                                />
                            </div>
                            <div className={style.carTable}>
                                {/* <Spin
                                    spinning={
                                        dataSource.length || searchFlag
                                            ? false
                                            : true
                                    }
                                    delay={500}
                                > */}
                                <Table
                                    columns={columns}
                                    dataSource={dataSource}
                                    pagination={false}
                                    scroll={{ y: '78%' }}
                                    onRow={(record) => {
                                        return {
                                            onClick: (event) => {}, // 点击行
                                            // onMouseEnter: (event) => {
                                            //     this.setState({
                                            //         scrollFlag: false,
                                            //     });
                                            // }, // 鼠标移入行
                                            // onMouseLeave: (event) => {
                                            //     this.setState({
                                            //         scrollFlag: true,
                                            //     });
                                            // },
                                        };
                                    }}
                                />
                                {/* </Spin> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(({ index }) => ({
    index,
}))(VehicleInfo);
