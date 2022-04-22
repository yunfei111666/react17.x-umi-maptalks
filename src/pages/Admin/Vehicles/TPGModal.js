/*
 * @Author: heyunfei
 * @Descripttion:
 * @Date: 2021-09-09 16:45:01
 * @LastEditTime: 2021-09-24 10:56:12
 * @FilePath: /TrunkFace/src/pages/Admin/Vehicles/TPGModal.js
 */
import React, { Component } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { saveTpgUrl, getTpgUrl } from '@/services/admin';
export default class TPGModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tpg_ip: '',
            tpg_port: '',
            visible: false,
            TPGName: '',
            formRef: React.createRef(),
        };
    }
    componentDidMount() {
        this.getTPG();
    }
    getTPG = () => {
        getTpgUrl(this.props.che_id).then((res) => {
            if (res) {
                this.setState({
                    tpg_ip: res.tpg_ip,
                    tpg_port: res.tpg_port,
                });
            }
        });
    };
    onCancel = () => {
        this.props.status(false);
    };
    submitClick = () => {
        const form = this.state.formRef.current;
        form.validateFields()
            .then((values) => {
                // 如果全部字段通过校验，会走then方法，里面可以打印出表单所有字段（一个object）
                let formItemValues = {
                    tpg_ip: this.state.tpg_ip,
                    tpg_port: this.state.tpg_port,
                };
                saveTpgUrl(formItemValues, this.props.che_id)
                    .then((response) => {
                        this.props.status(false);
                        this.props.initList();
                        message.success('操作成功!');
                    })
                    .catch(function (error) {
                        message.error('请求失败');
                    });
            })
            .catch((errInfo) => {});
    };
    handleInputChange = (e) => {
        var target = e.target;
        this.setState({
            tpg_ip: target.value,
        });
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
                    title="TPG绑定"
                    visible={visible}
                    onOk={this.submitClick}
                    onCancel={this.onCancel}
                >
                    <Form ref={this.state.formRef} layout="horizontal">
                        <Form.Item
                            label="TPG地址"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入TPG地址!',
                                },
                            ]}
                        >
                            <Input
                                value={this.state.tpg_ip}
                                onChange={this.handleInputChange}
                                placeholder="请输入TPG地址"
                            />
                        </Form.Item>
                        {/* <Form.Item>
                            <Button type="primary">下发</Button>
                        </Form.Item> */}
                    </Form>
                </Modal>
            </span>
        );
    }
}
