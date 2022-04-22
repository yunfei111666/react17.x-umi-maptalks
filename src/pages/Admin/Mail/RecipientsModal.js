/*
 * @Author: yunfei
 * @Date: 2021-09-15 10:26:37
 * @LastEditTime: 2021-12-16 20:02:37
 * @FilePath: /TrunkFace/src/pages/Admin/Mail/RecipientsModal.js
 * @LastAuthor: Do not edit
 * @Description: 收件人管理模态框
 */
import React, { Component } from 'react';
import {
    Modal,
    Form,
    Input,
    Table,
    Space,
    message,
    Row,
    Col,
    Button,
} from 'antd';
import {
    PlusSquareOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { saveEmali, getMailRecipient, deleteEmail } from '@/services/admin';
const { confirm } = Modal;
export default class RecipientsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            page: 1,
            count: 0, //总页数
            tableList: [],
            formRef: React.createRef(),
            renderColumn: [
                {
                    title: '收件人名称',
                    dataIndex: 'name',
                    key: 'name',
                    align: 'left',
                },
                {
                    title: '收件人邮箱',
                    dataIndex: 'email',
                    key: 'email',
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    key: 'operation',
                    align: 'right',
                    render: (text, record) => (
                        <Space size="middle">
                            <a onClick={() => this.onDeleteClick({ record })}>
                                删除
                            </a>
                        </Space>
                    ),
                },
            ],
        };
    }
    componentDidMount() {
        this.initEmailList();
    }

    // 初始化数据列表
    initEmailList() {
        getMailRecipient({
            page: this.state.page,
        })
            .then((response) => {
                let res = response;
                if (res) {
                    this.setState({
                        count: res.length,
                        tableList: res,
                    });
                }
            })
            .catch((err) => {
                console.error(err, 'error');
            });
    }

    // 添加
    addPersonClick = () => {
        const form = this.state.formRef.current;
        form.validateFields().then((values) => {
            // 如果全部字段通过校验，会走then方法，里面可以打印出表单所有字段（一个object）
            let formItemValues = {
                name: values.name,
                email: values.email,
            };
            saveEmali(formItemValues)
                .then((res) => {
                    if (res) {
                        this.initEmailList();
                        message.success('成功添加!');
                    }
                })
                .catch(function (error) {
                    message.error('请求失败');
                });
        });
    };

    //删除
    onDeleteClick = (text) => {
        let rowData = text.record;
        let that = this;
        const { theme } = localStorage;
        confirm({
            title: '操作确认?',
            className: theme == 'theme-black' ? 'theme-black-delete-modal' : '',
            icon: <ExclamationCircleOutlined />,
            content: '是否确定要对选择数据进行删除？',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk() {
                deleteEmail(rowData.id)
                    .then((res) => {
                        if (res === null) {
                            message.error('删除失败');
                        } else {
                            message.success('删除成功！');
                            that.initEmailList();
                        }
                    })
                    .catch(function (error) {
                        console.error(error, 'error');
                    });
            },
            onCancel() {},
        });
    };

    //取消
    onCancel = () => {
        this.props.status(false);
    };
    render() {
        const { visible } = this.props;
        const { theme } = localStorage;
        return (
            <span>
                <Modal
                    wrapClassName={
                        theme == 'theme-black' ? 'theme-black-modal' : ''
                    }
                    width={800}
                    title="新增收件人信息"
                    visible={visible}
                    footer={null}
                    onCancel={this.onCancel}
                >
                    <Form ref={this.state.formRef} initialValues={this.props}>
                        <Row>
                            <Col span={10}>
                                <Form.Item
                                    label="收件人名称"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入收件人名称',
                                        },
                                    ]}
                                >
                                    <Input placeholder="请输入收件人名称" />
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item
                                    label="收件人邮箱"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入收件人邮箱',
                                        },
                                    ]}
                                >
                                    <Input placeholder="请输入收件人邮箱" />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    style={{
                                        position: 'absolute',
                                        right: '0px',
                                    }}
                                >
                                    <div className="subToolsModal">
                                        <Space
                                            size="middle"
                                            align="right"
                                            direction="right"
                                        >
                                            <Button
                                                type="primary"
                                                onClick={this.addPersonClick}
                                            >
                                                新增
                                            </Button>
                                        </Space>
                                    </div>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <Table
                        columns={this.state.renderColumn}
                        dataSource={this.state.tableList}
                        rowKey={(record) => record.id}
                        bordered={false}
                        size={'small'}
                        scroll={{
                            y: 300,
                        }}
                        pagination={false}
                    />
                </Modal>
            </span>
        );
    }
}
