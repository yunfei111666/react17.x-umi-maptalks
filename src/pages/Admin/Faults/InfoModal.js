/*
 * @Author: heyunfei
 * @Descripttion:
 * @Date: 2021-09-12 17:08:09
 * @LastEditTime: 2021-09-28 15:53:45
 * @FilePath: /TrunkFace/src/pages/Admin/Faults/InfoModal.js
 */
import React, { Component } from 'react';
import { Modal, Table } from 'antd';
import { getCarHistoryList } from '@/services/admin';
export default class InfoModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            page: 1, //默认第一页
            count: 0, //总页数
            tableList: [], //列表所有数据
            renderColumn: [
                {
                    title: '日期',
                    dataIndex: 'created_date',
                    key: 'created_date',
                },
                {
                    title: '行驶里程(km)',
                    dataIndex: 'mileage',
                    key: 'mileage',
                },
                {
                    title: '循环趟数',
                    dataIndex: 'trip',
                    key: 'trip',
                },
                {
                    title: 'TEU',
                    dataIndex: 'teu',
                    key: 'teu',
                },
                {
                    title: '作业效率(teu/h)',
                    dataIndex: 'work_efficiency',
                    key: 'work_efficiency',
                },
                {
                    title: '故障次数',
                    dataIndex: 'fault',
                    key: 'fault',
                    render: (val, record) => (
                        <span style={{ color: '#1890ff' }}>{val}</span>
                    ),
                },
                {
                    title: '故障率',
                    dataIndex: 'fault_rate',
                    key: 'fault_rate',
                },
                {
                    title: '接管趟数',
                    dataIndex: 'take_over',
                    key: 'take_over',
                },
                {
                    title: '接管率',
                    dataIndex: 'take_over_rate',
                    key: 'take_over_rate',
                },
                {
                    title: '单箱能耗(kmh/teu)',
                    dataIndex: 'consume_power_teu',
                    key: 'consume_power_teu',
                },
            ],
        };
    }
    componentDidMount() {
        this.initList();
    }
    // 初始化数据列表
    initList = () => {
        getCarHistoryList({
            che_id: this.props.che_id,
            created_from: this.props.created_from,
            created_to: this.props.created_to,
            page: this.state.page,
        })
            .then((response) => {
                let res = response.results;
                this.setState({
                    tableList: res,
                    count: response.count,
                });
            })
            .catch((err) => {});
    };

    onCancel = () => {
        this.props.status(false);
    };
    //选择分页数
    changePage = (page) => {
        this.setState(
            {
                page: page,
            },
            () => {
                this.initList();
            },
        );
    };
    render() {
        const { visible } = this.props;
        const { theme } = localStorage;
        return (
            <Modal
                wrapClassName={`${
                    theme == 'theme-black' ? 'theme-black-modal' : ''
                } faults-modal`}
                title={this.props.che_id + '历史统计'}
                visible={visible}
                width={1000}
                footer={null}
                onCancel={this.onCancel}
            >
                <div className="subview">
                    <Table
                        columns={this.state.renderColumn}
                        dataSource={this.state.tableList}
                        rowKey={(record) => record.id}
                        bordered={false}
                        size={'small'}
                        pagination={{
                            // 分页
                            showQuickJumper: true, //开启跳转第几页
                            pageSize: 14, //每页条数
                            current: this.state.page, //当前页数
                            total: this.state.count, //数据总数
                            onChange: this.changePage, //页码改变的回调，参数是改变后的页码及每页条数
                        }}
                    />
                </div>
            </Modal>
        );
    }
}
