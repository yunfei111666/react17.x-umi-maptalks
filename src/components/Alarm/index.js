/*
 * @Description:
 * @Project: 故障详情通用模块
 * @Author: yunfei
 * @Date: 2021-11-03 17:51:23
 * @LastEditors: yunfei
 * @LastEditTime: 2022-01-17 14:33:07
 * @Modified By: yunfei
 * @FilePath: /TrunkFace/src/components/Alarm/index.js
 */
import React, { Component } from 'react';
import style from './index.less';
import { Button, Checkbox, Table, Radio, Space, Collapse, Input } from 'antd';
import Empty from 'components/Empty';
const { Search } = Input;

const { Panel } = Collapse;
export default class Alarm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prevStr: null,
            alarmList: [], //告警数据集合
            alarmCheckd: false,
            alarmType: 0,
            stateType: 0,
            modelList: [
                {
                    id: 0,
                    text: 'All',
                },
                {
                    id: 1,
                    text: '底盘',
                },
                {
                    id: 2,
                    text: '软件',
                },
                {
                    id: 3,
                    text: '硬件',
                },
            ],
            stateList: [
                {
                    id: 0,
                    text: '异常',
                },
                {
                    id: 1,
                    text: '警告',
                },
            ],
            columns: [
                {
                    title: 'alarmCode',
                    dataIndex: 'alarmCode',
                    key: 'alarmCode',
                },
                // {
                //     title: 'alarmCodeDesc',
                //     dataIndex: 'alarmCodeDesc',
                //     key: 'alarmCodeDesc',
                // },
                {
                    title: 'alarmLevel',
                    dataIndex: 'alarmLevel',
                    key: 'alarmLevel',
                },
                {
                    title: 'alarmLevelDesc',
                    dataIndex: 'alarmLevelDesc',
                    key: 'alarmLevelDesc',
                },

                {
                    title: 'alarmType',
                    dataIndex: 'alarmType',
                    key: 'alarmType',
                },
                {
                    title: 'category',
                    dataIndex: 'category',
                    key: 'category',
                },
                {
                    title: 'categoryDesc',
                    dataIndex: 'categoryDesc',
                    key: 'categoryDesc',
                },
                {
                    title: 'subCode',
                    dataIndex: 'subCode',
                    key: 'subCode',
                },
                {
                    title: 'subDesc',
                    dataIndex: 'subDesc',
                    key: 'subDesc',
                },
            ],
            searchFlag: false,
        };
    }

    handleAlarmType(val) {
        this.setState({
            alarmType: val.id,
        });
    }

    handleStateType(val) {
        let { alarmList } = this.state;
        let arr = alarmList.filter((item) => {
            return item.stateId == val.id;
        });
        this.setState({
            stateType: val.id,
        });
    }

    setPanel(e) {
        return (
            <div
                className={`${style.panelBox} ${
                    e.stateId == 0 ? style.error : style.warn
                }`}
            >
                <span>{e.cheId}</span>
                <span>{e.code}</span>
                <span>{e.alarmTypeDesc}</span>
                <span>{e.alarmCodeDesc}</span>
            </div>
        );
    }
    //搜索
    onSearch = (e) => {
        const { alarmList } = this.props;
        const value = e.target.value;
        if (alarmList && value) {
            const newList = [];
            alarmList.forEach((item) => {
                if (item.cheId.indexOf(value) != -1) {
                    newList.push(item);
                }
            });
            this.setState({
                alarmList: newList,
            });
        }
    };

    onChange = (e) => {
        this.setState({
            alarmCheckd: e.target.checked,
        });
        localStorage.setItem('alarmCheckd', e.target.checked);
    };

    componentDidMount() {
        const { alarmList } = this.props;
        let flag = eval(localStorage.getItem('alarmCheckd')) || false;
        this.setState({
            alarmCheckd: flag,
            alarmList: alarmList,
        });
    }

    render() {
        const {
            modelList,
            stateList,
            alarmType,
            stateType,
            alarmCheckd,
            columns,
            alarmList,
        } = this.state;
        const { type } = this.props;
        return (
            <div
                className={`${style.publicClass} ${
                    type == 'dev' ? style.devBox : style.monitorBox
                }`}
            >
                {/* <div className={style.tabBox}>
                    <div className={style.modelBox}>
                        类型：
                        {modelList.map((item, index) => {
                            return (
                                <Button
                                    type="text"
                                    key={index}
                                    className={
                                        alarmType == item.id
                                            ? 'active'
                                            : ''
                                    }
                                    onClick={() => {
                                        this.handleAlarmType(item);
                                    }}
                                >
                                    {item.text}
                                </Button>
                            );
                        })}
                    </div>
                    <div className={style.stateBox}>
                        状态：
                        {stateList.map((item, index) => {
                            return (
                                <Button
                                    type="text"
                                    key={index}
                                    className={
                                        stateType == item.id
                                            ? 'active'
                                            : ''
                                    }
                                    onClick={() => {
                                        this.handleStateType(item);
                                    }}
                                >
                                    {item.text}
                                </Button>
                            );
                        })}
                    </div>
                </div> */}
                {type == 'monitor' ? (
                    <div className={style.row}>
                        <Checkbox
                            onChange={this.onChange}
                            checked={alarmCheckd}
                        >
                            报警推送
                        </Checkbox>
                        {/* <Radio onChange={() => { this.onChange(event) }} value={alarmCheckd}>报警推送</Radio>
                                <Button type="text" >
                                    <i className="iconfont icon-dituxiafa"></i>
                                    日志导出
                                </Button> */}
                    </div>
                ) : (
                    <div className={style.search}>
                        <Search
                            placeholder="请输入车辆编号"
                            onChange={this.onSearch}
                            enterButton
                            id="antdInput"
                        />
                    </div>
                )}
                <div className={style.tableHead}>
                    <span>cheId</span>
                    <span>code</span>
                    <span>alarmTypeDesc</span>
                    <span>alarmCodeDesc</span>
                </div>
                <div className={style.collapseBox}>
                    {alarmList.length ? (
                        <Collapse
                            ghost
                            expandIconPosition={'right'}
                            accordion
                            border="false"
                        >
                            {alarmList.map((item, index) => {
                                return (
                                    <Panel
                                        header={this.setPanel(item)}
                                        key={index}
                                    >
                                        <Table
                                            pagination={false}
                                            dataSource={[item]}
                                            columns={columns}
                                            rowKey={'cheId'}
                                        />
                                    </Panel>
                                );
                            })}
                        </Collapse>
                    ) : (
                        <Empty className={type} />
                    )}
                </div>
            </div>
        );
    }
}
