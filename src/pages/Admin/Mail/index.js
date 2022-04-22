/*
 * @Author: yunfei
 * @since: 2021-08-30 11:19:42
 * @lastTime: 2021-09-08 14:47:17
 * @文件相对于项目的路径: /TrunkFace/src/pages/Admin/Mail/index.js
 * @message:
 */
import React, { Component } from 'react';
import { Space, Table, Button } from 'antd';
import moment from 'moment';
import { exportMail, getMail } from '@/services/admin';
import OperationModal from './OperationModal';
import RecipientsModal from './RecipientsModal';
import { setRootFilter } from 'utils/resize/';
class Mail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            tableList: [],
            page: 1,
            count: 0, //总页数
            rowData: {},
            isModalVisible: false, //运营策略弹框
            recipientModalVisble: false, //收件人管理弹框
            renderColumn: [
                {
                    title: '接收人',
                    dataIndex: 'recipients',
                    key: 'recipients',
                    render: (val) => <span>{val.length > 0 ? val : '-'}</span>,
                },
                {
                    title: '发送时间',
                    dataIndex: 'created_at',
                    key: 'created_at',
                    render: (val) => (
                        <span>
                            {val
                                ? moment(val).format('YYYY-MM-DD HH:mm:ss')
                                : '-'}
                        </span>
                    ),
                },
                {
                    title: '操作',
                    dataIndex: 'attach_file',
                    key: 'attach_file',
                    render: (text, record) => (
                        <Space size="middle">
                            <a onClick={() => this.onAttachExport({ record })}>
                                附件下载
                            </a>
                        </Space>
                    ),
                },
            ],
        };
    }
    componentDidMount() {
        this.initList();
    }
    // 初始化数据列表
    initList() {
        this.setState(
            {
                loading: true,
            },
            () => {
                getMail({
                    page: this.state.page,
                })
                    .then((response) => {
                        this.setState({
                            loading: false,
                        });
                        let res = response.results;
                        if (res.length > 0) {
                            this.setState({
                                count: response.count,
                                tableList: res,
                            });
                        }
                        this.setState({
                            loading: false,
                        });
                    })
                    .catch((err) => {
                        this.setState({
                            loading: false,
                        });
                    });
            },
        );
    }

    // 运营策略按钮
    openModal = (type) => {
        this.setState({
            isModalVisible: true,
        });
        setRootFilter(true);
    };
    // 收件人管理按钮
    openRecModal = () => {
        this.setState({
            recipientModalVisble: true,
        });
        setRootFilter(true);
    };
    //附件下载
    onAttachExport = (text) => {
        let rowUrl = text.record.attach_file;
        window.location.href = rowUrl;
    };
    //数据导出
    onExportAll = () => {
        exportMail().then((res) => {
            let blobUrl = window.URL.createObjectURL(res);
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = blobUrl;
            link.download = 'mail.xlsx';
            link.click();
        });
    };
    // 运营策略模态框
    changeOperationStatus = (status) => {
        this.setState({
            isModalVisible: status,
        });
        setRootFilter(status);
    };
    // 收件人模态框
    changeRecipientStatus = (status) => {
        this.setState({
            recipientModalVisble: status,
        });
        setRootFilter(status);
    };
    // 详情模态框
    changeStatus = (status) => {
        this.setState({
            detailModalVisble: status,
        });
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
    componentWillUnmount() {
        this.setState = (props) => {
            return;
        };
    }
    render() {
        return (
            <div className="subview">
                <div className="sub-tools">
                    <div></div>
                    <div className="sub-tools-right">
                        <Space size="middle" align="right" direction="right">
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.openModal();
                                }}
                            >
                                运营策略
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.openRecModal();
                                }}
                            >
                                收件人管理
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.onExportAll();
                                }}
                            >
                                数据导出
                            </Button>
                        </Space>
                    </div>
                </div>
                <div className="sub-container">
                    <div className="tableView">
                        <Table
                            columns={this.state.renderColumn}
                            dataSource={this.state.tableList}
                            loading={this.state.loading}
                            rowKey={(record) => record.id}
                            bordered={false}
                            size={'small'}
                            pagination={{
                                // 分页
                                showQuickJumper: true, //开启跳转第几页
                                showSizeChanger: false, //是否开启pageSize切换
                                pageSize: 14, //每页条数
                                current: this.state.page, //当前页数
                                total: this.state.count, //数据总数
                                onChange: this.state.changePage, //页码改变的回调，参数是改变后的页码及每页条数
                            }}
                        />
                    </div>
                </div>
                {/* 运营策略模态框 */}
                {this.state.isModalVisible && (
                    <OperationModal
                        visible={this.state.isModalVisible}
                        status={this.changeOperationStatus}
                        {...this.state.rowData}
                    ></OperationModal>
                )}
                {/* 收件人管理模态框 */}
                {this.state.recipientModalVisble && (
                    <RecipientsModal
                        visible={this.state.recipientModalVisble}
                        status={this.changeRecipientStatus}
                        {...this.state.rowData}
                    ></RecipientsModal>
                )}
            </div>
        );
    }
}
export default Mail;
