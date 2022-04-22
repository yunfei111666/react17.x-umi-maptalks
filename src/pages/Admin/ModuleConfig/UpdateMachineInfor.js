/*
 * @Author: shenguang
 * @Date: 2021-09-15 09:30:14
 * @Last Modified by: shenguang
 * @Last Modified time: 2021-09-24 15:25:27
 */
import React, { Component } from 'react';
import { saveMachine, updateMachine } from 'services/admin';
import { Modal, Form, Input, Select, message } from 'antd';
import utils from 'utils/index';
import { connect } from 'umi';
const { Option } = Select;

class UpdateMachineInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            ip: '',
            port: '',
            machine_type: 1,
            formType: props.formType,
            confirmLoading: false,
        };
        this.state.formRef = React.createRef();
    }
    // 受控组件
    handleChange = (type, params) => {
        if (type === 'select') {
            this.setState({
                machine_type: params,
            });
        } else {
            this.setState({
                [params.target.name]: params.target.value.trim(),
            });
        }
    };
    // 组件销毁时取消所有更改状态事件
    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        };
    };
    saveMachineData = () => {
        const { formType } = this.state;
        this.setState({
            confirmLoading: true,
        });
        this.state.formRef.current
            .validateFields()
            .then((value) => {
                const { name, ip, port, machine_type } = value;
                if (formType === 'add') {
                    saveMachine({
                        name,
                        ip,
                        port,
                        machine_type,
                    })
                        .then((res) => {
                            this.setState({
                                confirmLoading: false,
                            });
                            if (res) {
                                message.success('成功添加');
                                this.props.initData();
                            }
                        })
                        .catch((error) => {
                            this.setState({
                                confirmLoading: false,
                            });
                        });
                } else if (formType === 'update') {
                    updateMachine(this.props.updateData.id, {
                        name,
                        ip,
                        port,
                        machine_type,
                    })
                        .then((res) => {
                            this.setState({
                                confirmLoading: false,
                            });
                            if (res) {
                                message.success('成功修改');
                                this.props.initData();
                            }
                        })
                        .catch((error) => {
                            this.setState({
                                confirmLoading: false,
                            });
                        });
                }
            })
            .catch(() => {
                this.setState({
                    confirmLoading: false,
                });
            });
    };
    render() {
        const { theme } = localStorage;
        const {
            name,
            ip,
            port,
            machine_type = 1,
        } = this.props.updateData || {};
        const { ipRules, portRules, machineNameRules } = utils.regExpConfig;
        return (
            <Modal
                wrapClassName={
                    theme === 'theme-black' ? 'theme-black-modal' : ''
                }
                title={this.state.formType === 'add' ? '新增设备' : '修改设备'}
                visible={true}
                bodyStyle={{
                    overflow: 'auto',
                }}
                confirmLoading={this.state.confirmLoading}
                onOk={this.saveMachineData}
                onCancel={() => {
                    this.props.changeUpdateVeiwState(false);
                }}
                cancelText={'取消'}
                okText={'确定'}
            >
                <Form
                    ref={this.state.formRef}
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                >
                    <Form.Item
                        label="设备名称"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入2-10位的设备名称!',
                                pattern: machineNameRules,
                            },
                        ]}
                        initialValue={name}
                    >
                        <Input
                            name="name"
                            autoComplete="off"
                            onChange={(e) => this.handleChange('input', e)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="设备IP"
                        name="ip"
                        initialValue={ip}
                        rules={[
                            {
                                required: true,
                                message: '请填写正确的设备IP!',
                                pattern: ipRules,
                            },
                        ]}
                    >
                        <Input
                            name="ip"
                            autoComplete="off"
                            onChange={(e) => this.handleChange('input', e)}
                        />
                    </Form.Item>
                    <Form.Item
                        label="服务端口"
                        name="port"
                        initialValue={port}
                        rules={[
                            {
                                required: true,
                                message: '只能输入最长6位之内的数字!',
                                pattern: portRules,
                            },
                        ]}
                    >
                        <Input
                            name="machinePort"
                            autoComplete="off"
                            onChange={(e) => this.handleChange('input', e)}
                        />
                    </Form.Item>
                    <Form.Item
                        label="模块类型"
                        name="machine_type"
                        rules={[
                            { required: true, message: '请填写你的模块类型!' },
                        ]}
                        initialValue={machine_type}
                    >
                        <Select
                            dropdownClassName={
                                theme === 'theme-black'
                                    ? 'theme-black-select'
                                    : ''
                            }
                            name="machine_type"
                            onChange={(value) =>
                                this.handleChange('select', value)
                            }
                        >
                            <Option value={1}>岸桥</Option>
                            <Option value={2}>场桥</Option>
                            <Option value={3}>堆高机</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}
export default connect(({ index }) => ({
    index,
}))(UpdateMachineInfor);
