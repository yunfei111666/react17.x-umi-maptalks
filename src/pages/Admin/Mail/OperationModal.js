/*
 * @Author: yunfei
 * @Date: 2021-09-17 17:03:06
 * @LastEditTime: 2021-11-08 10:26:18
 * @FilePath: /TrunkFace/src/pages/Admin/Mail/OperationModal.js
 * @LastAuthor: Do not edit
 * @Description: 运营策略弹框
 */
import React, { Component } from 'react';
import { Modal, Form, Select, message, TimePicker } from 'antd';
import { saveOperation, getMailRecipient } from '@/services/admin';
import moment from 'moment';
const { Option } = Select;
export default class RecipientsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1,
            time: '',
            nameList: [],
            formRef: React.createRef(),
        };
    }
    componentDidMount() {
        this.getPerson();
    }
    //获取人员信息
    getPerson = () => {
        getMailRecipient()
            .then((response) => {
                let res = response;
                if (res) {
                    this.setState({
                        nameList: res,
                    });
                }
            })
            .catch((err) => {
                console.error(err, 'error');
            });
    };
    // 添加
    handleOk = () => {
        const form = this.state.formRef.current;
        form.validateFields().then((values) => {
            // 如果全部字段通过校验，会走then方法，里面可以打印出表单所有字段（一个object）
            let persArr = [];
            values.name.forEach((val) => {
                persArr.push(val);
            });
            let formItemValues = {
                period: this.state.type, //每日，每周，每月类型
                execution_time: this.state.time, //时间 时：分
                recipients: persArr, //人员
            };
            saveOperation(formItemValues)
                .then((res) => {
                    if (res) {
                        this.props.status(false);
                        message.success('成功添加!');
                    }
                })
                .catch(function (error) {
                    message.error('请求失败');
                });
        });
    };
    //每日、每月
    onTypeChange = (val) => {
        this.setState({
            type: val,
        });
    };
    //时间
    onTimeChange = (val) => {
        let time = moment(val).format('hh:mm');
        this.setState({
            time: time,
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
                    title="运营策略"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.onCancel}
                >
                    <Form ref={this.state.formRef} initialValues={this.props}>
                        <Form.Item label="邮件时间" style={{ marginBottom: 0 }}>
                            <Select
                                defaultValue="1"
                                name="type"
                                style={{ width: 80, float: 'left' }}
                                onChange={this.onTypeChange}
                                dropdownClassName={
                                    theme === 'theme-black'
                                        ? 'theme-black-select'
                                        : ''
                                }
                                bordered={false}
                            >
                                <Option key="1">每日</Option>
                                <Option key="2">每周</Option>
                                <Option key="3">每月</Option>
                            </Select>
                            <Form.Item
                                rules={[
                                    { required: true, message: '请选择时间' },
                                ]}
                                name="time"
                            >
                                <TimePicker
                                    popupClassName={
                                        theme === 'theme-black'
                                            ? 'theme-black-select'
                                            : ''
                                    }
                                    name="time"
                                    onChange={this.onTimeChange}
                                    style={{ width: 300, float: 'right' }}
                                    use12Hours
                                    format="h:mm a"
                                />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item
                            label="收件人"
                            rules={[{ required: true }]}
                            name="name"
                        >
                            <Select
                                dropdownClassName={
                                    theme === 'theme-black'
                                        ? 'theme-black-select'
                                        : ''
                                }
                                name="name"
                                mode="multiple"
                                allowClear
                                placeholder="请选择收件人"
                            >
                                {this.state.nameList.map((item, index) => {
                                    return (
                                        <Option key={item.id}>
                                            {item.name}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </span>
        );
    }
}
