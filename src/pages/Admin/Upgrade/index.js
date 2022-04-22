/*
 * @Author: yunfei
 * @since: 2021-08-30 11:19:42
 * @lastTime: 2021-09-08 11:21:36
 * @文件相对于项目的路径: /TrunkFace/src/pages/Admin/Upgrade/index.js
 * @message:
 */
import React, { Component } from 'react';
import { Space, Table, Button } from 'antd';

class Upgrade extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '软件版本',
                    dataIndex: 'version',
                    key: 'version',
                },
                {
                    title: 'Docker版本',
                    dataIndex: 'docker',
                    key: 'docker',
                },
                {
                    title: '系统环境',
                    dataIndex: 'system',
                    key: 'system',
                },
                {
                    title: '更新时间',
                    dataIndex: 'updateTime',
                    key: 'updateTime',
                },

                {
                    title: '版本详情',
                    dataIndex: 'versionData',
                    key: 'versionData',
                    render: (text, record) => (
                        <Space size="middle">
                            <Button type="primary" size="small">
                                版本详情
                            </Button>
                        </Space>
                    ),
                },

                {
                    title: '操作',
                    dataIndex: 'operation',
                    key: 'operation',
                    render: (text, record) => (
                        <Space size="middle">
                            <a>版本回退</a>
                            <a>数据备份</a>
                        </Space>
                    ),
                },
            ],
            data: [],
            tabelHeight: 0,
        };
    }
    componentDidMount() {
        this.setState({
            data: this.modeData(),
            tabelHeight:
                document.getElementsByClassName('tableView')[0].offsetHeight -
                74,
        });
    }
    modeData = () => {
        let data = [];
        for (let i = 0; i < 100; i++) {
            data.push({
                key: i,
                version: 'V 1.0.' + i,
                docker: 'V 1.0',
                system: 'Ubuntu 16.04',
                updateTime: new Date().toLocaleString(),
            });
        }
        return data;
    };
    render() {
        return (
            <div className="subview">
                <div className="sub-tools">
                    <div className="sub-tools-right">
                        <Space size="middle" align="right" direction="right">
                            <Button type="primary">上传升级包</Button>
                            <Button type="primary">在线升级</Button>
                        </Space>
                    </div>
                </div>

                <div className="sub-container">
                    <div className="tableView">
                        <Table
                            columns={this.state.columns}
                            dataSource={this.state.data}
                            bordered={false}
                            pagination={false}
                            size={'small'}
                            pagination={true}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default Upgrade;
