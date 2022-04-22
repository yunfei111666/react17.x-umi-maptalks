/*
 * @Author: heyunfei
 * @Descripttion: 车辆管理
 * @Date: 2021-09-08 18:18:46
 * @lastTime: 2021-11-11 10:27:10
 * @文件相对于项目的路径: /TrunkFace/src/pages/Admin/Vehicles/index.js
 */
import React, { Component } from 'react';
import {
    Space,
    Modal,
    Button,
    message,
    ConfigProvider,
    Table,
    InputNumber,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import { getChe } from '@/services/common';
import { deleteChe } from '@/services/admin';
import { miscInfo } from '@/services/carDetail';
import AddModal from './AddModal';
import DeviceModal from './DeviceModal';
import TPGModal from './TPGModal';
import { setRootFilter } from 'utils/resize/';
import Access from '@/components/Access';
const { confirm } = Modal;
class Vehicles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditStatus: false, //添加状态
            addModalVisble: false,
            addModalVisble: false,
            TPGModalVisble: false,
            formType: 'add',
            loading: false,
            page: 1,
            count: 0, //总页数
            rowData: {}, //列表单行数据
            tableList: [], //列表所有数据
            selectedRowKeys: [],
            rainValue: '',
            renderColumn: [
                {
                    title: '车辆编号',
                    dataIndex: 'che_id',
                    key: 'che_id',
                    render: (val, record) => (
                        <span
                            style={{ cursor: 'pointer', color: '#1890ff' }}
                            onClick={() => this.toShowEdit({ record }, 'edit')}
                        >
                            {val}
                        </span>
                    ),
                },
                {
                    title: '车辆IP',
                    dataIndex: 'ip',
                    key: 'IP',
                },
                {
                    title: '码头名称',
                    dataIndex: 'port',
                    key: 'port',
                    render: (val) => <span>{val ? val : '-'}</span>,
                },
                {
                    title: '车辆类型',
                    dataIndex: 'che_type',
                    key: 'che_type',
                    render: (val) => <span>{val ? val : '-'}</span>,
                },
                {
                    title: '车牌号',
                    dataIndex: 'plate_num',
                    key: 'plate_num',
                    render: (val) => <span>{val ? val : '-'}</span>,
                },
                {
                    title: '厂家',
                    dataIndex: 'factory',
                    key: 'factory',
                    render: (val) => <span>{val ? val : '-'}</span>,
                },
                {
                    title: '车架号',
                    dataIndex: 'vin',
                    key: 'vin',
                    render: (val) => <span>{val ? val : '-'}</span>,
                },
                {
                    title: '视频服务地址',
                    dataIndex: 'video_port',
                    key: 'video_port',
                    render: (val) => <span>{val ? val : '-'}</span>,
                },
                {
                    title: '电池容量',
                    dataIndex: 'battery_capacity',
                    key: 'battery_capacity',
                },
                {
                    title: '雨天阈值',
                    dataIndex: 'intensity_threshold',
                    key: 'intensity_threshold',
                    render: (val) => <span>{val ? val : '-'}</span>,
                },
                {
                    title: '创建时间',
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
                // {
                //     title: '操作',
                //     dataIndex: 'operation',
                //     key: 'operation',
                //     render: (text, record) => (
                //         <Space size="middle">
                //             <a
                //                 onClick={() =>
                //                     this.toShowEdit({ record }, 'edit')
                //                 }
                //             >
                //                 修改
                //             </a>
                //             <a onClick={() => this.onDeleteClick({ record })}>
                //                 删除
                //             </a>
                //             <a onClick={() => this.onDeviceClick({ record })}>
                //                 视频预览
                //             </a>
                //             {/* <a onClick={() => this.onTPGClick({ record })}>
                //                 TPG绑定
                //             </a> */}
                //         </Space>
                //     ),
                // },
            ],
        };
    }
    componentDidMount() {
        this.initList();
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    // 初始化数据列表
    initList = () => {
        this.setState(
            {
                loading: true,
            },
            () => {
                getChe({
                    page: this.state.page,
                })
                    .then((res) => {
                        this.setState({
                            loading: false,
                        });
                        if (res) {
                            this.setState({
                                count: res.count,
                                tableList: res.results,
                            });
                            console.log(res);
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
    changeAddStatus = (status) => {
        this.setState({
            addModalVisble: status,
        });
        setRootFilter(status);
    };
    changeDeviceStatus = (status) => {
        this.setState({
            DeviceModalVisble: status,
        });
        setRootFilter(status);
    };
    changeTPGStatus = (status) => {
        this.setState({
            TPGModalVisble: status,
        });
        setRootFilter(status);
    };
    //添加车辆按钮
    toShowEdit = (text, edit) => {
        this.state.isEditStatus = false;
        if (text.record) {
            //编辑状态
            this.state.isEditStatus = true;
        }
        this.setState({
            isEditStatus: this.state.isEditStatus,
            formType: edit == 'edit' ? 'edit' : 'add',
            addModalVisble: true,
            rowData: text.record,
        });
        setRootFilter(true);
    };
    // 删除选中的列表数据
    onDeleteClick = (text) => {
        const { selectedRowKeys } = this.state;
        const { theme } = localStorage;
        if (selectedRowKeys.length) {
            setRootFilter(true);
            confirm({
                title: '操作确认?',
                className:
                    theme == 'theme-black' ? 'theme-black-delete-modal' : '',
                icon: <ExclamationCircleOutlined />,
                content: '是否确定要对选择数据进行删除？',
                okText: '是',
                okType: 'danger',
                cancelText: '否',
                onOk: () => {
                    console.log(selectedRowKeys);
                    selectedRowKeys.forEach((item, index) => {
                        deleteChe(item)
                            .then((res) => {
                                if (res === null) {
                                    message.error('删除失败');
                                } else {
                                    message.success('删除成功！');
                                    if (selectedRowKeys.length) {
                                        if (
                                            this.state.page > 1 &&
                                            this.state.tableList.length <=
                                                selectedRowKeys.length
                                        ) {
                                            this.setState(
                                                {
                                                    page: this.state.page - 1,
                                                },
                                                () => {
                                                    this.initList();
                                                },
                                            );
                                        } else {
                                            this.initList();
                                        }
                                    }
                                }
                                setRootFilter(false);
                            })
                            .catch(function (error) {
                                message.error('删除失败');
                                setRootFilter(false);
                            });
                    });
                },
                onCancel() {
                    setRootFilter(false);
                },
            });
        }
    };
    //批量修改雨天阈值
    onRainEdit = () => {
        const { selectedRowKeys, rainValue } = this.state;
        const { theme } = localStorage;
        if (selectedRowKeys.length) {
            setRootFilter(true);
            confirm({
                title: '是否确定要对选择数据进行修改？',
                className:
                    theme == 'theme-black' ? 'theme-black-delete-modal' : '',
                icon: <ExclamationCircleOutlined />,
                content: (
                    <div style={{ marginTop: '20px' }}>
                        <span>雨天intensity：</span>
                        <InputNumber
                            min={0}
                            max={255}
                            step={1}
                            onChange={(e) => this.setState({ rainValue: e })}
                        />
                    </div>
                ),
                okText: '是',
                okType: 'danger',
                cancelText: '否',
                onOk: () => {
                    let arr = [];
                    if (selectedRowKeys.length) {
                        selectedRowKeys.forEach((item) => {
                            arr.push(
                                this.state.tableList.find((it) => it.id == item)
                                    ?.che_id,
                            );
                        });
                    }
                    let body = {
                        art_ids: arr,
                        intensity_threshold: this.state.rainValue,
                    };
                    if (this.state.rainValue != '') {
                        miscInfo(body)
                            .then((res) => {
                                if (res === null) {
                                    message.error('修改失败');
                                } else {
                                    message.success('修改成功！');
                                    if (selectedRowKeys.length) {
                                        if (
                                            this.state.page > 1 &&
                                            this.state.tableList.length <=
                                                selectedRowKeys.length
                                        ) {
                                            this.setState(
                                                {
                                                    page: this.state.page - 1,
                                                },
                                                () => {
                                                    this.initList();
                                                },
                                            );
                                        } else {
                                            this.initList();
                                        }
                                    }
                                }
                            })
                            .catch(function (error) {
                                message.error('修改失败');
                            });
                    }
                    setRootFilter(false);
                },
                onCancel() {
                    setRootFilter(false);
                },
            });
        }
    };
    //设备绑定
    onDeviceClick = () => {
        this.setState({
            addModalVisble: false,
            DeviceModalVisble: true,
        });
        setRootFilter(true);
    };
    //TPG绑定
    onTPGClick = (text) => {
        this.setState({
            TPGModalVisble: true,
            rowData: text.record,
        });
        setRootFilter(true);
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
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    render() {
        const { theme } = localStorage;
        const {
            selectedRowKeys,
            renderColumn,
            tableList,
            loading,
            page,
            count,
        } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <ConfigProvider locale={zhCN}>
                <div className="subview">
                    {/*工具栏*/}
                    <div className="sub-tools">
                        <div></div>
                        {/* <Access> */}
                        <div className="sub-tools-right">
                            <Space
                                size="middle"
                                align="right"
                                direction="right"
                            >
                                <Button
                                    type="primary"
                                    onClick={this.onRainEdit}
                                >
                                    雨天阈值
                                </Button>
                                <Access accessKey="vehicles-btn-delete">
                                    <Button
                                        type="primary"
                                        onClick={this.onDeleteClick}
                                    >
                                        删除车辆
                                    </Button>
                                </Access>
                                <Access accessKey="vehicles-btn-add">
                                    <Button
                                        type="primary"
                                        onClick={this.toShowEdit}
                                    >
                                        添加车辆
                                    </Button>
                                </Access>
                            </Space>
                        </div>
                        {/* </Access> */}
                    </div>
                    {/* 车辆添加模态框 */}
                    {this.state.addModalVisble && (
                        <AddModal
                            visible={this.state.addModalVisble}
                            status={this.changeAddStatus}
                            Device={this.onDeviceClick}
                            initList={this.initList}
                            formType={this.state.formType}
                            isEditStatus={this.state.isEditStatus}
                            {...this.state.rowData}
                        ></AddModal>
                    )}
                    {this.state.DeviceModalVisble && (
                        <DeviceModal
                            visible={this.state.DeviceModalVisble}
                            status={this.changeDeviceStatus}
                            initList={this.initList}
                        ></DeviceModal>
                    )}
                    {this.state.TPGModalVisble && (
                        <TPGModal
                            visible={this.state.TPGModalVisble}
                            status={this.changeTPGStatus}
                            initList={this.initList}
                            {...this.state.rowData}
                        ></TPGModal>
                    )}
                    <div className="sub-container">
                        <Table
                            rowClassName={
                                theme == 'theme-black'
                                    ? 'theme-black-modal'
                                    : ''
                            }
                            columns={renderColumn}
                            dataSource={tableList}
                            rowSelection={rowSelection}
                            rowKey={(record) => record.id}
                            bordered={false}
                            size={'small'}
                            loading={loading}
                            pagination={{
                                // 分页
                                showQuickJumper: true, //开启跳转第几页
                                showSizeChanger: false, //是否开启pageSize切换
                                pageSize: 14, //每页条数
                                current: page, //当前页数
                                total: count, //数据总数
                                // showTotal: (total) => `共 ${this.props.count} 条`,
                                onChange: this.changePage, //页码改变的回调，参数是改变后的页码及每页条数
                            }}
                        />
                    </div>
                </div>
            </ConfigProvider>
        );
    }
}
export default Vehicles;
