import React, { Component } from 'react';
import style from './index.less';
import { Modal, Table, Tag, Space, Button, InputNumber, message } from 'antd';
import { connect } from 'umi';
import { sys_columns, file_colums } from '@/config/carDetail';
import { getNode, downLoad } from 'services/carDetail';
import { addOperation, DeleteImg, Downloadbag } from 'services/operation';
import moment from 'moment';
import { replace } from 'lodash';

class CarDetail extends Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            confirmLoading: false, //导出load
            start_load: false,
            stop_load: false,
            reset_load: false,
            selectedRowKeys: [],
            numValue: 10,
            disable: false,
            md5: '',
            res: '',
            cheId: props.cheId,
            node_columns: [
                {
                    title: 'ModuleName',
                    dataIndex: 'module_name',
                    key: 'module_name',
                    render: (text) => <a>{text}</a>,
                },
                {
                    title: 'ExeName',
                    dataIndex: 'exe_name',
                    key: 'exe_name',
                },
                {
                    title: 'Status',
                    key: 'status',
                    dataIndex: 'status',
                    render: (status) => (
                        <Tag
                            color={status == 'ACTIVE' ? 'green' : 'volcano'}
                            key={status}
                        >
                            {status}
                        </Tag>
                    ),
                },
                {
                    title: 'Action',
                    key: 'action',
                    render: (text, record) => (
                        <Space size="middle">
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => this.btnChange('0', record)}
                            >
                                启动
                            </Button>
                            <Button
                                type="primary"
                                size="small"
                                danger
                                onClick={() => this.btnChange('1', record)}
                            >
                                停止
                            </Button>
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => this.btnChange('2', record)}
                            >
                                重启
                            </Button>
                        </Space>
                    ),
                },
            ],
        };
    }

    handleCancel = () => {
        this.props.setModal({
            flag: false,
        });
        if (this.timer) clearInterval(this.timer);
        if (this.props.pop_num == 4 && this.state.res) {
            this.handleRemove(this.state.res);
        }
    };
    //删除文件
    handleRemove = (file) => {
        console.log('file', file);
        DeleteImg({ file_name: file }).then((data) => {
            if (data.code == 1) {
                message.success('已取消！');
            }
            this.setState({
                res: '',
            });
        });
    };
    btnChange = (key, data) => {
        const { cheId } = this.props;
        let body = {
            art_id: cheId,
            command: key * 1,
            exe_name: data ? data.exe_name : '',
            module_name: data ? data.module_name : '',
        };
        this.handle(key, data);
        getNode(body)
            .then((res) => {
                setTimeout(() => {
                    this.handle(key, data, 'status');
                    message.success('操作成功');
                }, 3000);
            })
            .catch((error) => {
                console.error(error, 'error');
            });
    };
    handle = (key, data, status) => {
        if (!data) {
            switch (key) {
                case '0':
                    this.setState({
                        start_load: status ? false : true,
                    });
                    break;
                case '1':
                    this.setState({
                        stop_load: status ? false : true,
                    });
                    break;
                case '2':
                    this.setState({
                        reset_load: status ? false : true,
                    });
                    break;
            }
        }
    };
    // 组件销毁时取消所有更改状态事件
    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        };
    };
    setData() {
        let { node_info, version, system } = this.props.index.dldata;
        let time = '';
        let nodeData = [];
        let versionData = '暂无数据';
        let cpuData = 0,
            diskData = 0,
            memData = 0,
            sysData = [];

        if (node_info) {
            if (node_info.timestamp) time = node_info.timestamp;
            if (node_info.nodes) {
                node_info.nodes.forEach((item, index) => {
                    if (item.status == 'true') {
                        item.status = 'ACTIVE';
                    } else {
                        item.status = 'INACTIVE';
                    }
                    item.key = index;
                    nodeData.push(item);
                });
            }
        }
        if (version) versionData = version;

        if (system) {
            if (system.cpu) cpuData = system.cpu.percent;
            if (system.disk) diskData = system.disk.percent;
            if (system.mem) memData = system.mem.percent;
            if (system.processes) sysData = system.processes;
        }

        return {
            time,
            nodeData,
            versionData,
            cpuData,
            diskData,
            memData,
            sysData,
        };
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({
            numValue:
                selectedRowKeys.length > 10 || selectedRowKeys.length == 0
                    ? 10
                    : selectedRowKeys.length,
            disable: selectedRowKeys.length == 0 ? false : true,
            selectedRowKeys,
        });
    };

    //配置时长
    onChangeNumer = (value) => {
        const { fileData } = this.props;
        let data = fileData.slice(0, value);
        let list = [];
        data.forEach((item) => {
            list.push(item.key);
        });
        this.setState({
            numValue: value,
            selectedRowKeys: list,
        });
    };
    addOperation = (data) => {
        const { cheId } = this.state;
        const bagName = data[0];
        const recordTime = (bagName || '').split('.')[1].slice(-19);
        const a = recordTime.slice(0, 10);
        const b = recordTime.slice(-8).replaceAll('-', ':');
        const time = a + ' ' + b;

        let body = {
            car_number: cheId,
            record_time: time,
            bag_name: bagName,
        };
        addOperation(body)
            .then((res) => {})
            .catch((error) => {
                console.error(error, 'error');
            });
    };
    //下载列表
    BugDownLoad = () => {
        const { cheId, fileData } = this.props;
        const { selectedRowKeys } = this.state;
        let data = [];
        if (selectedRowKeys.length == 0) {
            const list = fileData.slice(0, 10);
            list.forEach((item) => {
                data.push(item.key);
            });
        } else if (selectedRowKeys.length > 10) {
            data = selectedRowKeys.slice(0, 10);
        } else {
            data = selectedRowKeys;
        }
        this.setState({
            confirmLoading: true,
        });

        this.downLoad({
            car_no: cheId,
            names: data,
            file_type: 1,
        });
    };
    downLoad(body) {
        if (this.timer) clearInterval(this.timer);
        let num = 0;
        this.compressFile(body);
        this.timer = setInterval(() => {
            console.log(this.state.md5, num);
            num++;
            body.file_type = 2;
            body.md5_file = this.state.md5;
            this.compressFile(body);
        }, 3000);
    }
    compressFile(body) {
        downLoad(body)
            .then((res) => {
                if (res) {
                    if (res.extend) {
                        this.setState({
                            md5: res.extend.md5,
                        });
                        if (res.extend.flag && res.data) {
                            clearInterval(this.timer);
                            message.success('压缩成功!');
                            window.location.href = Downloadbag + res.data;
                            this.setState({
                                confirmLoading: false,
                                res: '',
                            });
                        } else {
                            if (res.data) {
                                this.setState({
                                    res: res.data,
                                });
                            }
                        }
                    }
                }
            })
            .catch((error) => {
                console.error(error, 'error');
            });
    }

    render() {
        const { flag, pop_num, fileData } = this.props;
        const {
            time,
            nodeData,
            versionData,
            cpuData,
            diskData,
            memData,
            sysData,
        } = this.setData();
        const {
            node_columns,
            start_load,
            stop_load,
            reset_load,
            selectedRowKeys,
            numValue,
            disable,
        } = this.state;
        let title, Header, Message;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        switch (pop_num) {
            case '1':
                title = '自动驾驶节点监控';
                if (nodeData.length) {
                    Header = (
                        <div className={style.content}>
                            <span>更新时间：{time}</span>
                            <div>
                                <Button
                                    type="primary"
                                    loading={start_load}
                                    onClick={() => this.btnChange('0')}
                                >
                                    启动全部
                                </Button>
                                <Button
                                    type="primary"
                                    loading={stop_load}
                                    danger
                                    onClick={() => this.btnChange('1')}
                                >
                                    停止全部
                                </Button>
                                <Button
                                    type="primary"
                                    loading={reset_load}
                                    onClick={() => this.btnChange('2')}
                                >
                                    重启全部
                                </Button>
                            </div>
                        </div>
                    );
                }

                Message = (
                    <Table
                        pagination={false}
                        columns={node_columns}
                        dataSource={nodeData}
                        scroll={{ y: 350 }}
                    />
                );
                break;
            case '2':
                title = '车辆版本信息';
                Message = <div>{versionData}</div>;
                break;
            case '3':
                title = '系统资源监控';
                Header = (
                    <div className={style.content}>
                        <span>CPU：{cpuData}%</span>
                        <span>内存：{memData}%</span>
                        <span>磁盘：{diskData}%</span>
                    </div>
                );
                Message = (
                    <Table
                        pagination={false}
                        columns={sys_columns}
                        dataSource={sysData}
                        scroll={{ y: 350 }}
                    />
                );
                break;
            case '4':
                title = '录制数据包';
                Header = (
                    <div className={style.content}>
                        <span>
                            配置时长：
                            <InputNumber
                                disabled={disable}
                                min={1}
                                max={10}
                                value={numValue}
                                onChange={this.onChangeNumer}
                            />
                        </span>
                        <Button
                            type="primary"
                            loading={this.state.confirmLoading}
                            onClick={this.BugDownLoad}
                        >
                            导出
                        </Button>
                    </div>
                );
                Message = (
                    <div className={style.fileDiv}>
                        <Table
                            pagination={false}
                            rowSelection={rowSelection}
                            columns={file_colums}
                            dataSource={fileData}
                            scroll={{ y: 280 }}
                        />
                    </div>
                );
                break;
            default:
                title = '--';
                break;
        }

        return (
            <div>
                <Modal
                    title={title}
                    visible={flag}
                    width={900}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    {Header}
                    {Message}
                </Modal>
            </div>
        );
    }
}
export default connect(({ index }) => ({
    index,
}))(CarDetail);
