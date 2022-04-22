/*
 * @Author: heyunfei
 * @Descripttion:
 * @Date: 2021-09-12 17:08:09
 * @LastEditTime: 2021-09-28 15:53:45
 * @FilePath: /TrunkFace/src/pages/Admin/Faults/InfoModal.js
 */
import React, { Component } from 'react';
import {
    Modal,
    Table,
    Row,
    Col,
    DatePicker,
    message,
    Button,
    Space,
} from 'antd';
import { getBicycleInfoList, exportList } from '@/services/admin';
import moment from 'moment';
const { RangePicker } = DatePicker;
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
                    title: '故障类型名称',
                    dataIndex: 'code',
                    key: 'code',
                    width: 130,
                },
                {
                    title: '故障详细名称',
                    dataIndex: 'sub_desc',
                    key: 'sub_desc',
                },
                {
                    title: '持续时间',
                    dataIndex: 'duration',
                    key: 'duration',
                    width: 100,
                },
                {
                    title: '故障开始时间',
                    dataIndex: 'start',
                    key: 'start',
                    render: (val) => (
                        <span>
                            {val
                                ? moment(val).format('YYYY-MM-DD HH:mm:ss')
                                : '-'}
                        </span>
                    ),
                },
            ],
        };
    }
    componentDidMount() {
        this.initList();
    }
    // 初始化数据列表
    initList = () => {
        getBicycleInfoList({
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
    //导出数据报表
    onExport = () => {
        if (this.state.tableList.length > 0) {
            exportList({
                che_id: this.props.che_id,
                created_from: this.props.created_from,
                created_to: this.props.created_to,
            })
                .then((response) => {
                    let blobUrl = window.URL.createObjectURL(response);
                    let link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = blobUrl;
                    link.download = 'fault.xlsx';
                    link.click();
                })
                .catch((err) => {
                    this.state.loading = false;
                });
        } else {
            message.warning('查询结果为0条数据，不能导出！');
        }
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
                title={this.props.che_id}
                visible={visible}
                width={800}
                footer={null}
                onCancel={this.onCancel}
            >
                <div className="subview">
                    {/*工具栏*/}
                    <div className="sub-tools">
                        <div className="sub-tools-left">
                            {this.props.created_from && (
                                <RangePicker
                                    style={{ width: 250 }}
                                    defaultValue={[
                                        moment(
                                            this.props.created_from,
                                            'YYYY-MM-DD',
                                        ),
                                        moment(
                                            this.props.created_to,
                                            'YYYY-MM-DD',
                                        ),
                                    ]}
                                    disabled
                                />
                            )}
                        </div>
                        <div className="sub-tools-right">
                            <div
                                className="export-button"
                                onClick={this.onExport}
                            >
                                导出
                            </div>
                        </div>
                    </div>
                    <Table
                        columns={this.state.renderColumn}
                        dataSource={this.state.tableList}
                        rowKey={(record) => record.id}
                        bordered={false}
                        size={'small'}
                        pagination={{
                            // 分页
                            showQuickJumper: true, //开启跳转第几页
                            pageSize: 10, //每页条数
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
