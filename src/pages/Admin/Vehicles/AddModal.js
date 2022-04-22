import React, { Component } from 'react';
import { Modal, Form, Input, Select, message, Button } from 'antd';
import { saveChe, editChe } from '@/services/admin';
import utils from '@/utils/index';
const { Option } = Select;
export default class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            che_id: '',
            plate_num: '',
            ip: '',
            che_type: '',
            factory: '',
            port: '',
            vin: '',
            video_port: '',
            battery_capacity: '',
            created_at: '',
            formRef: React.createRef(),
            isdisabled: this.props.formType === 'add' ? false : true,
        };
    }

    onCancel = () => {
        this.props.status(false);
    };
    onBack = () => {
        this.setState({
            isdisabled: true,
        });
    };
    submitClick = () => {
        const form = this.state.formRef.current;
        form.validateFields().then((values) => {
            // 如果全部字段通过校验，会走then方法，里面可以打印出表单所有字段（一个object）
            let formItemValues = {
                che_id: values.che_id,
                ip: values.ip,
                che_type: values.che_type,
                plate_num: values.plate_num,
                factory: values.factory,
                port: values.port,
                vin: values.vin,
                video_port: values.video_port,
                battery_capacity: values.battery_capacity,
            };
            if (this.props.isEditStatus == false) {
                //添加
                saveChe(formItemValues)
                    .then((res) => {
                        if (res) {
                            message.success('成功添加');
                            this.props.status(false);
                            this.props.initList();
                        }
                    })
                    .catch((error) => {
                        console.error(error, 'error');
                    });
            } else {
                if (this.state.isdisabled) {
                    this.setState({
                        isdisabled: false,
                    });
                } else {
                    editChe(formItemValues, this.props.id)
                        .then((res) => {
                            if (res) {
                                message.success('成功修改');
                                this.props.status(false);
                                this.props.initList();
                            }
                        })
                        .catch((error) => {
                            console.error(error, 'error');
                        });
                }
            }
        });
    };

    //操作下拉框
    onTypeChange = (value) => {
        this.setState({
            che_type: value,
        });
    };
    render() {
        const { visible, che_id } = this.props;
        const { isdisabled } = this.state;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const { theme } = localStorage;
        const { ipRules, portRules } = utils.regExpConfig;
        return (
            <span>
                <Modal
                    wrapClassName={
                        theme == 'theme-black' ? 'theme-black-modal' : ''
                    }
                    title={
                        this.props.formType === 'add'
                            ? '添加车辆'
                            : isdisabled
                            ? che_id + '车辆档案'
                            : '修改档案'
                    }
                    visible={visible}
                    width={800}
                    onCancel={this.onCancel}
                    footer={
                        this.props.formType === 'add'
                            ? [
                                  <Button
                                      key="back"
                                      onClick={() => {
                                          this.onCancel();
                                      }}
                                  >
                                      取消
                                  </Button>,
                                  <Button
                                      key="submit"
                                      type="primary"
                                      onClick={() => {
                                          this.submitClick();
                                      }}
                                  >
                                      确定
                                  </Button>,
                              ]
                            : [
                                  isdisabled ? (
                                      <Button
                                          key="back"
                                          type="primary"
                                          onClick={this.props.Device}
                                      >
                                          视频浏览
                                      </Button>
                                  ) : (
                                      <Button
                                          key="back"
                                          onClick={() => {
                                              this.onBack();
                                          }}
                                      >
                                          取消
                                      </Button>
                                  ),
                                  <Button
                                      key="submit"
                                      type="primary"
                                      onClick={() => {
                                          this.submitClick();
                                      }}
                                  >
                                      {isdisabled ? '修改档案' : '确定修改'}
                                  </Button>,
                              ]
                    }
                >
                    <Form
                        ref={this.state.formRef}
                        {...formItemLayout}
                        initialValues={this.props}
                    >
                        <Form.Item
                            label="车辆编号"
                            name="che_id"
                            rules={[
                                { required: true, message: '请输入车辆编号!' },
                                {
                                    max: 8,
                                    message: '最大长度8个字符',
                                },
                            ]}
                        >
                            <Input
                                disabled={isdisabled}
                                placeholder={isdisabled ? '' : '请输入车辆编号'}
                            />
                        </Form.Item>
                        <Form.Item
                            label="车辆IP"
                            name="ip"
                            rules={
                                isdisabled
                                    ? []
                                    : [
                                          {
                                              required: true,
                                              message: '请输入正确的车辆IP!',
                                              pattern: ipRules,
                                          },
                                      ]
                            }
                        >
                            <Input
                                disabled={isdisabled}
                                placeholder={isdisabled ? '' : '请输入车辆IP'}
                            />
                        </Form.Item>
                        <Form.Item
                            label="电池容量"
                            name="battery_capacity"
                            rules={
                                isdisabled
                                    ? []
                                    : [
                                          {
                                              required: true,
                                              message: '只能输入数字!',
                                              pattern: portRules,
                                          },
                                      ]
                            }
                        >
                            <Input
                                disabled={isdisabled}
                                placeholder={isdisabled ? '' : '请输入电池容量'}
                            />
                        </Form.Item>
                        <Form.Item label="车辆类型" name="che_type">
                            <Select
                                name="che_type"
                                placeholder={isdisabled ? '' : 'Please select'}
                                optionLabelProp="label"
                                style={{ width: '100%' }}
                                disabled={isdisabled}
                                dropdownClassName={
                                    theme === 'theme-black'
                                        ? 'theme-black-select'
                                        : ''
                                }
                                onChange={this.onTypeChange}
                            >
                                <Option value="电车" label="电车">
                                    电车
                                </Option>
                                <Option value="油车" label="油车">
                                    油车
                                </Option>
                                <Option value="混动车" label="混动车">
                                    混动车
                                </Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="视频服务地址"
                            name="video_port"
                            rules={[
                                {
                                    max: 64,
                                    message: '只能输入最长64字符!',
                                },
                            ]}
                        >
                            <Input
                                disabled={isdisabled}
                                placeholder={
                                    isdisabled ? '' : '请输入视频服务地址'
                                }
                                value={this.state.video_port}
                            />
                        </Form.Item>
                        <Form.Item
                            label="车牌号"
                            name="plate_num"
                            rules={[
                                {
                                    max: 16,
                                    message: '最大长度16个字符',
                                },
                            ]}
                        >
                            <Input
                                disabled={isdisabled}
                                value={this.state.plate_num}
                                placeholder={isdisabled ? '' : '请输入车牌号'}
                            />
                        </Form.Item>
                        <Form.Item
                            label="车架号"
                            name="vin"
                            rules={[
                                {
                                    max: 18,
                                    message: '最大长度18个字符',
                                },
                            ]}
                        >
                            <Input
                                disabled={isdisabled}
                                value={this.state.vin}
                                placeholder={isdisabled ? '' : '请输入车架号'}
                            />
                        </Form.Item>
                        <Form.Item
                            label="厂家"
                            name="factory"
                            rules={[
                                {
                                    max: 50,
                                    message: '最大长度50个字符',
                                },
                            ]}
                        >
                            <Input
                                disabled={isdisabled}
                                placeholder={isdisabled ? '' : '请输入厂家'}
                                value={this.state.factory}
                            />
                        </Form.Item>
                        <Form.Item
                            label="码头名称"
                            name="port"
                            rules={[
                                {
                                    max: 50,
                                    message: '最大长度50个字符',
                                },
                            ]}
                        >
                            <Input
                                disabled={isdisabled}
                                placeholder={isdisabled ? '' : '请输入码头名称'}
                                value={this.state.port}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </span>
        );
    }
}
