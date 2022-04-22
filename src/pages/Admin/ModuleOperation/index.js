import React, { Component } from 'react';
import {
    Space,
    Input,
    Table,
    Button,
    Modal,
    message,
    Pagination,
    DatePicker,
    Select,
    Tag,
} from 'antd';
import { getOperation, delOperation } from 'services/operation';
import { getCheId } from 'services/admin';
import OperationDetail from './OperationDetail';
import AddModule from './AddModule';
import { connect } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { setRootFilter } from 'utils/resize/';
import { set } from 'react-hook-form';
import moment from 'moment';
import style from './index.less';
const { confirm } = Modal;
const { RangePicker } = DatePicker;

class ModuleOperation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '车辆编号',
                    dataIndex: 'car_number',
                    key: 'car_number',
                    width: 150,
                },
                {
                    title: '数据包名',
                    dataIndex: 'bag_name',
                    key: 'bag_name',
                    width: 250,
                },
                {
                    title: '记录时间',
                    dataIndex: 'created_at',
                    key: 'created_at',
                    width: 200,
                },
                {
                    title: '事件时间',
                    dataIndex: 'record_time',
                    key: 'record_time',
                    width: 200,
                },
                {
                    title: '问题类别',
                    dataIndex: 'question_type',
                    key: 'question_type',
                    width: 200,
                    render: (tags) => (
                        <>
                            {tags.map((tag) => {
                                return (
                                    <Tag color="red" key={tag}>
                                        {tag}
                                    </Tag>
                                );
                            })}
                        </>
                    ),
                },
                {
                    title: '问题现象',
                    dataIndex: 'description',
                    key: 'description',
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
                            <a
                                onClick={() =>
                                    this.showUpdateNewView('show', record)
                                }
                            >
                                查看
                            </a>
                            <a onClick={() => this.deleteOperation(record)}>
                                删除
                            </a>
                        </Space>
                    ),
                },
            ],
            data: [],
            start_time: moment(new Date().getTime()).format('YYYY-MM-DD'), //开始日期
            end_time: moment(new Date().getTime()).format('YYYY-MM-DD'), //结束日期
            loading: false,
            showUpdateModuleView: false,
            showAddModuleView: false,
            // 操作表单类型
            formType: 'show',
            // 选中表单信息
            selectColumnInfor: {},
            // 数据总数
            ListCount: 0,
            // 当前页
            currentPage: 1,
            carList: [], //车辆列表
            car_no: null,
        };
    }
    componentDidMount() {
        this.initData();
        this.initCarId(); //获取车辆列表
    }
    // 组件销毁时取消所有更改状态事件
    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        };
    };
    initCarId = () => {
        getCheId()
            .then((data) => {
                if (data) {
                    this.setState({
                        carList: data.data,
                    });
                }
            })
            .catch((error) => {
                console.error(error, 'error');
            });
    };
    // 获取数据
    initData = () => {
        const {
            showUpdateModuleView,
            showDeleteModuleView,
            start_time,
            end_time,
            currentPage,
            car_no,
        } = this.state;
        if (showUpdateModuleView) {
            this.changeUpdateVeiwState(false);
        }
        // if (showDeleteModuleView) {
        //     this.changeDeleteVeiwState(false);
        // }
        let body = {
            page: currentPage,
            start_time: start_time + ' 0.0.0',
            end_time: end_time + ' 23:59:59',
            car_no: car_no,
        };
        this.setState(
            {
                loading: true,
            },
            () => {
                getOperation(body)
                    .then((data) => {
                        this.setState({
                            loading: false,
                        });
                        if (data) {
                            this.setState({
                                ListCount: data.count,
                                data: data.data,
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
    //添加记录
    showAddNewView = () => {
        this.setState({
            showAddModuleView: true,
        });
        setRootFilter(true);
    };
    // 详情和更新信息窗口
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
    changAddVeiwState = (isShow) => {
        this.setState({
            showAddModuleView: isShow,
        });
        setRootFilter(isShow);
    };
    deleteOperation = (record) => {
        const { theme } = localStorage;
        setRootFilter(true);
        confirm({
            title: '你确定要删除该记录吗?',
            icon: <ExclamationCircleOutlined />,
            content: '是否要对选择记录进行删除',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            className: theme == 'theme-black' ? 'theme-black-delete-modal' : '',
            onOk: () => {
                delOperation(record.id)
                    .then((res) => {
                        if (res.data == 1) {
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
                        } else {
                            message.error('删除失败');
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
    // 日期选择
    onChangeDate = (value, dateString) => {
        this.state.start_time = dateString[0];
        this.state.end_time = dateString[1];
    };
    //车辆编号
    cheChangeNum = (value) => {
        this.setState({
            car_no: value,
        });
    };

    render() {
        const { theme } = localStorage;
        return (
            <div className="subview" id={style.opera}>
                <div className="sub-tools">
                    <div>
                        <RangePicker
                            style={{ width: 250 }}
                            defaultValue={[
                                moment(
                                    moment(new Date().getTime()),
                                    'YYYY-MM-DD',
                                ),
                                moment(
                                    moment(new Date().getTime()),
                                    'YYYY-MM-DD',
                                ),
                            ]}
                            dropdownClassName={
                                theme === 'theme-black'
                                    ? 'theme-black-select'
                                    : ''
                            }
                            onChange={this.onChangeDate}
                        />
                        <Select
                            style={{ width: 200, marginLeft: '15px' }}
                            onChange={this.cheChangeNum}
                            placeholder="请选择车辆编号"
                            listHeight={200}
                            allowClear
                            dropdownClassName={
                                theme === 'theme-black'
                                    ? 'theme-black-select'
                                    : ''
                            }
                        >
                            {this.state.carList.map((item, i) => {
                                return (
                                    <Option value={item} key={i}>
                                        {item}
                                    </Option>
                                );
                            })}
                        </Select>
                    </div>
                    <div className="sub-tools-right">
                        <Space size="middle" align="right" direction="right">
                            <Button type="primary" onClick={this.initData}>
                                查询
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => this.showAddNewView()}
                            >
                                添加记录
                            </Button>
                        </Space>
                    </div>
                </div>
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
                                total: this.state.ListCount, //数据总数
                                onChange: this.onChangePage, //页码改变的回调，参数是改变后的页码及每页条数
                                hideOnSinglePage: true, // 只有一页时不展示分页器
                            }}
                        />
                    </div>
                </div>
                {this.state.showAddModuleView && (
                    <AddModule
                        initData={this.initData}
                        carList={this.state.carList}
                        changAddVeiwState={(value) => {
                            this.changAddVeiwState(value);
                        }}
                    ></AddModule>
                )}
                {this.state.showUpdateModuleView && (
                    <OperationDetail
                        initData={this.initData}
                        formType={this.state.formType}
                        updateData={this.state.selectColumnInfor}
                        changeUpdateVeiwState={(value) => {
                            this.changeUpdateVeiwState(value);
                        }}
                    ></OperationDetail>
                )}
            </div>
        );
    }
}
export default connect(({ index }) => ({
    index,
}))(ModuleOperation);
