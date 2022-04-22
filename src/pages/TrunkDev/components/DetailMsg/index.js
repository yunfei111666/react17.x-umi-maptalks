import React, { Component } from 'react';
import style from './index.less';
import { connect } from 'umi';
import { Tabs, Tooltip, Table, Tag, Space } from 'antd';
import { fixedNumber } from 'utils/resize';
import {
    commandStatusMap,
    drivingStatusMap,
    lockStatusMap,
    gearMap,
    controlMap,
    nodeCommand,
} from '@/config/carDetail';

const { TabPane } = Tabs;

class DetailMsg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '',
                    dataIndex: 'label',
                    render: (text) => <a>{text}</a>,
                },
                {
                    title: 'ID',
                    dataIndex: 'id',
                    render: (text, record) => {
                        return record.curId && record.curId != '-' ? (
                            <div>
                                <Tag color="geekblue" key={text}>
                                    curID:{record.curId}
                                </Tag>
                                <Tag color="geekblue" key={text}>
                                    ID:{record.id}
                                </Tag>
                            </div>
                        ) : (
                            <div>{text}</div>
                        );
                    },
                },
                {
                    title: 'STATUS',
                    dataIndex: 'status',
                    render: (status) => {
                        return status != '-' ? (
                            <Tag color="geekblue" key={status}>
                                {status}
                            </Tag>
                        ) : (
                            <div>{status}</div>
                        );
                    },
                },
            ],
            Heartbeat: [
                {
                    label: '命令',
                    key: 'command_status',
                    status: '-',
                    id: '-',
                },
                {
                    label: '行驶',
                    key: 'driving_status',
                    status: '-',
                    id: '-',
                },
                {
                    label: '车体',
                    key: 'lock_status',
                    status: '-',
                    id: '/',
                },
                {
                    label: '控车',
                    key: '',
                    status: '-',
                    id: '-',
                    curId: '-',
                },
            ],
            Info: [
                {
                    label: '总里程',
                    key: 'gy',
                    val: '-',
                },
                {
                    label: '上下高压状态',
                    key: 'turn_light_status',
                    val: '-',
                    status: true,
                },
                {
                    label: '电量',
                    key: 'battery',
                    val: '-',
                },
                {
                    label: 'Estop',
                    key: 'emergency_stop_status',
                    val: '-',
                    status: true,
                },
                {
                    label: '自动驾驶状态',
                    key: 'auto_driver_status',
                    val: '-',
                    status: true,
                },
                {
                    label: '徐工故障码',
                    key: 'odometer',
                    val: '-',
                },
                {
                    label: '车辆故障码',
                    key: 'vehicle_error_status',
                    val: '-',
                },
                {
                    label: '当前档位',
                    key: 'gear',
                    val: '-',
                },
                {
                    label: '当前车速',
                    key: 'current_speed',
                    val: '-',
                },
                {
                    label: '期望车速',
                    key: 'rt_speed',
                    val: '-',
                },
                {
                    label: '当前油门值',
                    key: 'current_throttle',
                    val: '-',
                },
                {
                    label: '当前刹车值',
                    key: 'current_brake',
                    val: '-',
                },
                {
                    label: '下发油门值',
                    key: 'throttle',
                    val: '-',
                },
                {
                    label: '下发刹车值',
                    key: 'brake',
                    val: '-',
                },
                {
                    label: '轮速',
                    key: 'wheel_speed',
                    val: '-',
                    fixedNumber: true,
                },
                {
                    label: '胎压',
                    key: 'wheel_odometer',
                    val: '-',
                    fixedNumber: true,
                },
                {
                    label: '转角',
                    key: 'wheel_angle',
                    val: '-',
                    fixedNumber: true,
                },
            ],
            position: {
                label: '位置信息',
                x: '',
                y: '',
                yaw: '',
                distance: '',
            },
            sensor: [
                {
                    label: 'GPS状态',
                    key: 'gps_status',
                    val: '-',
                },
                {
                    label: 'AEB',
                    key: 'collision',
                    val: '-',
                },
                {
                    label: '左前雷达',
                    key: 'left_front_at',
                    val: '-',
                    time: true,
                },
                {
                    label: '右前雷达',
                    key: 'right_front_at',
                    val: '-',
                    time: true,
                },
                {
                    label: '左后雷达',
                    key: 'left_behind_at',
                    val: '-',
                    time: true,
                },
                {
                    label: '右后雷达',
                    key: 'right_behind_at',
                    val: '-',
                    time: true,
                },
                {
                    label: '虚拟墙信息',
                    key: 'walls',
                    val: '-',
                },
            ],
        };
    }
    setData() {
        let { Heartbeat, Info, sensor, position } = this.state;
        let { dldata } = this.props.index;
        let { heartbeat } = this.props.index.dldata;

        //Heartbeat
        if (heartbeat) {
            Heartbeat.map((item) => {
                if (heartbeat[item.key]) {
                    // item.status = heartbeat[item.key].status;
                    switch (item.key) {
                        case 'command_status':
                            item.status =
                                commandStatusMap[heartbeat[item.key].status];
                            break;
                        case 'driving_status':
                            item.status =
                                drivingStatusMap[heartbeat[item.key].status];
                            break;
                        case 'lock_status':
                            item.status =
                                lockStatusMap[heartbeat[item.key].status];
                            break;
                        default:
                            break;
                    }

                    if (heartbeat[item.key].id || heartbeat[item.key].task_id) {
                        item.id = heartbeat[item.key].id
                            ? heartbeat[item.key].id
                            : heartbeat[item.key].task_id;
                    }
                }
            });
        }
        //车辆信息
        Object.keys(dldata).length !== 0 &&
            Info.forEach((item) => {
                if (
                    dldata[item.key] !== undefined &&
                    dldata[item.key] !== null
                ) {
                    item.val = fixedNumber(dldata[item.key]);
                    if (item.key == 'gy') item.val = item.val + 'km';
                    if (item.key == 'gear') item.val = gearMap[item.val];
                    if (item.key == 'battery') item.val = item.val + '%';
                    if (item.fixedNumber) {
                        let array = dldata[item.key];
                        let str = '';
                        array.forEach((items) => {
                            str += fixedNumber(items) + '，';
                        });
                        item.val = str;
                    }
                    if (item.status) {
                        if (item.key == 'auto_driver_status') {
                            item.val =
                                dldata[item.key] == '0' ? 'true' : 'false';
                        } else {
                            item.val =
                                dldata[item.key] == '0' ? 'false' : 'true';
                        }
                    }
                }
            });
        //传感器信息
        sensor.map((item) => {
            if (dldata[item.key]) {
                item.val = dldata[item.key];
                if (item.time) {
                    let d = new Date(item.val * 1000);
                    item.val = d.toLocaleString('ja-jp', {
                        timeZone: 'Asia/Shanghai',
                    });
                }
            }
        });
        position.x = dldata.x;
        position.y = dldata.y;
        position.yaw = dldata.yaw;
        position.distance = dldata.distance;
        return {
            Heartbeat,
            Info,
            sensor,
            position,
        };
    }

    render() {
        const { Heartbeat, Info, sensor, position } = this.setData();
        const { columns } = this.state;

        return (
            <div className={style.carPopoverCon}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Heartbeat" key="1">
                        {/* <Table
                            pagination={false}
                            columns={columns}
                            dataSource={Heartbeat}
                        /> */}

                        <ul className={style.tabBox}>
                            {Heartbeat.map((item, index) => {
                                return (
                                    <li
                                        key={index}
                                        className={style.li}
                                        style={{ width: '100%' }}
                                    >
                                        <span>{item.label}状态</span>
                                        {item.curId ? (
                                            <Tooltip
                                                placement="right"
                                                title={item.curId}
                                            >
                                                <span
                                                    style={{
                                                        marginRight: '40px',
                                                    }}
                                                >
                                                    CurID：{item.curId}
                                                </span>
                                            </Tooltip>
                                        ) : (
                                            ''
                                        )}
                                        {item.id != '/' ? (
                                            <Tooltip
                                                placement="right"
                                                title={item.id}
                                            >
                                                <span
                                                    style={{
                                                        marginRight: '40px',
                                                    }}
                                                >
                                                    ID：{item.id}
                                                </span>
                                            </Tooltip>
                                        ) : (
                                            ''
                                        )}
                                        <Tooltip
                                            placement="right"
                                            title={item.status}
                                        >
                                            <span>status：{item.status}</span>
                                        </Tooltip>
                                    </li>
                                );
                            })}
                        </ul>
                    </TabPane>
                    <TabPane tab="传感器信息" key="2">
                        <ul className={style.tabBox}>
                            {sensor.map((item, index) => {
                                return (
                                    <li key={index} className={style.li}>
                                        <span>{item.label}：</span>
                                        <Tooltip
                                            placement="right"
                                            title={fixedNumber(item.val)}
                                        >
                                            <span>{fixedNumber(item.val)}</span>
                                        </Tooltip>
                                    </li>
                                );
                            })}
                            <li className={style.pos}>
                                <span>{position.label}:</span>
                                <div>
                                    <Tooltip
                                        placement="right"
                                        title={fixedNumber(position.x)}
                                    >
                                        <span>
                                            x：{fixedNumber(position.x)}
                                        </span>
                                    </Tooltip>
                                    <br />
                                    <Tooltip
                                        placement="right"
                                        title={fixedNumber(position.y)}
                                    >
                                        <span>
                                            y：{fixedNumber(position.y)}
                                        </span>
                                    </Tooltip>
                                    <br />
                                    <Tooltip
                                        placement="right"
                                        title={fixedNumber(position.yaw)}
                                    >
                                        <span>
                                            yaw：{fixedNumber(position.yaw)}
                                        </span>
                                    </Tooltip>
                                    <br />
                                    <Tooltip
                                        placement="right"
                                        title={fixedNumber(position.distance)}
                                    >
                                        <span>
                                            distance：
                                            {fixedNumber(position.distance)}
                                        </span>
                                    </Tooltip>
                                </div>
                            </li>
                        </ul>
                    </TabPane>
                    <TabPane tab="车辆信息" key="3">
                        <ul className={style.tabBox}>
                            {Info.map((item, index) => {
                                return (
                                    <li key={index} className={style.li}>
                                        <span>{item.label}：</span>
                                        <Tooltip
                                            placement="right"
                                            title={item.val}
                                        >
                                            <span>{item.val}</span>
                                        </Tooltip>
                                    </li>
                                );
                            })}
                        </ul>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
export default connect(({ index }) => ({
    index,
}))(DetailMsg);
