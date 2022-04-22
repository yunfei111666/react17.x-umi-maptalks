/*
 * @Author: yunfei
 * @since: 2021-08-30 11:19:42
 * @lastTime: 2021-09-08 16:22:27
 * @文件相对于项目的路径: /TrunkFace/src/pages/Admin/ModuleConfig/index.js
 * @message:
 */
import React, { Component } from 'react';
import { Space, Table, Button, Modal, message, Pagination } from 'antd';
import { getMachine, deleteMachine } from 'services/admin';
import UpdateMachineInfor from './UpdateMachineInfor';
import { connect } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { setRootFilter } from 'utils/resize/';
import { set } from 'react-hook-form';
const { confirm } = Modal;
class ModuleConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '设备名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '设备IP',
                    dataIndex: 'ip',
                    key: 'ip',
                },

                {
                    title: '服务端口',
                    dataIndex: 'port',
                    key: 'port',
                },
                {
                    title: '类型名称',
                    dataIndex: 'machine_type_name',
                    key: 'machine_type_name',
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    key: 'operation',
                    render: (text, record) => (
                        <Space size="middle">
                            <a
                                onClick={() =>
                                    this.showUpdateNewView('update', record)
                                }
                            >
                                修改
                            </a>
                            <a onClick={() => this.deleteMachineData(record)}>
                                删除
                            </a>
                        </Space>
                    ),
                },
            ],
            data: [],
            tabelHeight: 0,
            loading: false,
            showUpdateModuleView: false,
            // 操作表单类型
            formType: 'add',
            // 选中表单信息
            selectColumnInfor: {},
            // 数据总数
            machineCount: 0,
            // 当前页
            currentPage: 1,
        };
    }
    componentDidMount() {
        this.initData({ page: this.currentPage });
    }
    // 组件销毁时取消所有更改状态事件
    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        };
    };
    // 获取数据
    initData = () => {
        const { showUpdateModuleView, showDeleteModuleView } = this.state;
        if (showUpdateModuleView) {
            this.changeUpdateVeiwState(false);
        }
        if (showDeleteModuleView) {
            this.changeDeleteVeiwState(false);
        }
        this.setState(
            {
                loading: true,
            },
            () => {
                getMachine({
                    page: this.state.currentPage,
                })
                    .then((data) => {
                        this.setState({
                            loading: false,
                        });
                        if (data) {
                            this.setState({
                                machineCount: data.count,
                                data: data.results,
                                tabelHeight:
                                    document.getElementsByClassName(
                                        'tableView',
                                    )[0] &&
                                    document.getElementsByClassName(
                                        'tableView',
                                    )[0].offsetHeight - 74,
                            });
                        }
                    })
                    .catch((err) => {
                        this.setState({
                            loading: false,
                        });
                    });
            },
        );
    };
    // 新建和更新信息窗口
    showUpdateNewView = (text, record) => {
        this.setState({
            showUpdateModuleView: true,
            selectColumnInfor: record,
            formType: text,
        });
        setRootFilter(true);
    };
    changeUpdateVeiwState = (isShow) => {
        this.setState({
            showUpdateModuleView: isShow,
        });
        setRootFilter(isShow);
    };
    deleteMachineData = (record) => {
        const { theme } = localStorage;
        setRootFilter(true);
        confirm({
            title: '你确定要删除该设备么?',
            icon: <ExclamationCircleOutlined />,
            content: '是否要对选择设备进行删除',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            className: theme == 'theme-black' ? 'theme-black-delete-modal' : '',
            onOk: () => {
                deleteMachine(record.id)
                    .then((res) => {
                        if (res === null) {
                            message.error('删除失败');
                        } else {
                            message.success('删除成功！');
                            if (
                                this.state.currentPage > 1 &&
                                this.state.data.length == 1
                            ) {
                                this.setState(
                                    {
                                        currentPage: this.state.currentPage - 1,
                                    },
                                    () => {
                                        this.initData();
                                    },
                                );
                            } else {
                                this.initData();
                            }
                        }
                        setRootFilter(false);
                    })
                    .catch((error) => {
                        message.error('删除失败');
                        setRootFilter(false);
                    });
            },
            onCancel: () => {
                // this.changeDeleteVeiwState(false);
                setRootFilter(false);
            },
        });
    };
    onChangePage = (targetPage, pageSize) => {
        this.setState(
            {
                currentPage: targetPage,
            },
            () => {
                this.initData({ page: targetPage });
            },
        );
    };

    render() {
        return (
            <div className="subview">
                <div className="sub-tools">
                    <div></div>
                    <div className="sub-tools-right">
                        <Space size="middle" align="right" direction="right">
                            <Button
                                type="primary"
                                onClick={() =>
                                    this.showUpdateNewView('add', {})
                                }
                            >
                                新增模块
                            </Button>
                        </Space>
                    </div>
                </div>
                {this.showAddModuleView}
                <div className="sub-container">
                    <div className="tableView">
                        <Table
                            columns={this.state.columns}
                            dataSource={this.state.data}
                            loading={this.state.loading}
                            bordered={false}
                            pagination={true}
                            size={'small'}
                            rowKey={(record) => record.id}
                            pagination={{
                                // 分页
                                showQuickJumper: true, //开启跳转第几页
                                pageSize: 14, //每页条数
                                showSizeChanger: false, //是否开启pageSize切换
                                current: this.state.currentPage, //当前页数
                                total: this.state.machineCount, //数据总数
                                onChange: this.onChangePage, //页码改变的回调，参数是改变后的页码及每页条数
                                pageSizeOptions: [10], //
                                // hideOnSinglePage: true // 只有一页时不展示分页器
                            }}
                        />
                    </div>
                </div>
                {this.state.showUpdateModuleView && (
                    <UpdateMachineInfor
                        initData={this.initData}
                        formType={this.state.formType}
                        updateData={this.state.selectColumnInfor}
                        changeUpdateVeiwState={(value) => {
                            this.changeUpdateVeiwState(value);
                        }}
                    ></UpdateMachineInfor>
                )}
            </div>
        );
    }
}
export default connect(({ index }) => ({
    index,
}))(ModuleConfig);
