/*
 * @Author: yunfei
 * @Date: 2021-11-01 10:34:44
 * @LastEditTime: 2021-11-24 14:51:10
 * @FilePath: /TrunkFace/src/pages/TrunkDev/components/Api/ModuleForm.js
 * @LastAuthor: Do not edit
 * @Description: 子组件
 */
import React, { Component } from 'react';
import style from './index.less';
import { Button, Select, Form, Input, message } from 'antd';
import { submit } from '@/services/devApi';
const { Option } = Select;
export default class ModuleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            formRef: React.createRef(),
        };
    }

    submitClick = () => {
        const { jsonData, itemKey } = this.props;
        const form = this.state.formRef.current;
        form.validateFields().then((values) => {
            let api = jsonData[itemKey].api;
            submit(values, api)
                .then((res) => {
                    if (res) {
                        message.success('发布成功');
                        this.setState({
                            content: values,
                        });
                    }
                })
                .catch((error) => {
                    console.error(error, 'error');
                });
        });
    };
    render() {
        // 数据组装
        const { jsonData, itemKey } = this.props;
        const { theme } = localStorage;
        let itemFormArr = [];
        jsonData[itemKey].parameters.forEach((item, index) => {
            // 检测是否包含 enum 属性;
            const isEnum = Object.keys(item).indexOf('enum');
            if (isEnum != -1) {
                //下拉框模式
                itemFormArr.push(
                    <Form.Item
                        key={index}
                        label={`${item.description}:`}
                        name={`${item.name}`}
                        rules={[
                            {
                                required: true,
                                message: `请选择${item.description}`,
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder={`请选择${item.description}`}
                            dropdownClassName={
                                theme === 'theme-black'
                                    ? 'theme-black-select'
                                    : ''
                            }
                        >
                            {item.enum.map((item, index) => {
                                return <Option key={item}>{item}</Option>;
                            })}
                        </Select>
                    </Form.Item>,
                );
            } else {
                //输入框模式
                itemFormArr.push(
                    <Form.Item
                        key={index}
                        label={`${item.description}:`}
                        name={`${item.name}`}
                        className={style.TOfmsWidth}
                        rules={[
                            {
                                required: true,
                                message: `请输入${item.description}`,
                            },
                        ]}
                    >
                        <Input placeholder={`请输入${item.description}`} />
                    </Form.Item>,
                );
            }
        });

        return (
            <>
                <div className={style.other}>
                    {/* <div className={style.formTitle}>公共参数</div> */}
                    <Form
                        name="signal"
                        initialValues={{ remember: true }}
                        autoComplete="off"
                        ref={this.state.formRef}
                    >
                        {itemFormArr}
                    </Form>
                    <Button
                        type="primary"
                        className={style.releaseBtn}
                        onClick={this.submitClick}
                    >
                        发布
                    </Button>
                </div>
                {/* <div className={style.bottom}>
                    <Form
                        name="log"
                        // initialValues={{ remember: true }}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="LOG："
                            name="LOG"
                            className={style.logInput}
                        >
                            <Input.TextArea value={this.state.content} />
                        </Form.Item>
                    </Form>
                </div> */}
            </>
        );
    }
}
