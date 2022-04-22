import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { regist, getAccountInfo } from 'services/admin';
import { history, connect } from 'umi';
import style from './index.less';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

class Regist extends Component {
    constructor(props) {
        super(props);
    }

    onFinish = (values) => {
        console.log('Received values of form: ', values);
        regist(values).then((res) => {
            if (res && res.key) {
                console.log(this);
                this.props.dispatch({
                    type: 'index/changeToken',
                    token: res.key,
                });
                localStorage.setItem('token', res.key);
                localStorage.setItem('username', values.username);
                history.replace('/Login');
            }
        });
    };

    render() {
        return (
            <div className={style.loginPage}>
                <div className={` iconfont icon-logo ${style.logo}`}></div>
                <div className={style.loginWindow}>
                    <Form
                        labelAlign="left"
                        className={style.form}
                        {...formItemLayout}
                        name="register"
                        onFinish={this.onFinish}
                        scrollToFirstError
                        size="large"
                        autoComplete="off"
                    >
                        <Form.Item
                            name="username"
                            label="用户名"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名！',
                                },
                            ]}
                        >
                            <Input autoComplete="new-password" />
                        </Form.Item>

                        <Form.Item
                            name="password1"
                            label="密码"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码！',
                                },
                                {
                                    min: 8,
                                    max: 20,
                                    message: '密码格式要求最少8个字符',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password autoComplete="new-password" />
                        </Form.Item>

                        <Form.Item
                            name="password2"
                            label="再次输入密码"
                            dependencies={['password1']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: '请再次输入密码!',
                                },
                                {
                                    min: 8,
                                    max: 20,
                                    message: '密码格式要求最少8个字符',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue('password1') === value
                                        ) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error('两次输入的密码不一致!'),
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="name"
                            label="真实姓名"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入真实姓名!',
                                    whitespace: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="cellphone"
                            label="手机号"
                            rules={[
                                {
                                    pattern: /^1[3456789]\d{9}$/,
                                    message: '请输入正确的手机号!',
                                },
                                {
                                    required: true,
                                    message: '请输入手机号!',
                                },
                            ]}
                        >
                            <Input style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            name="company_name"
                            label="公司名称"
                            rules={[
                                { required: true, message: '请输入公司名称！' },
                            ]}
                        >
                            <Input.TextArea showCount maxLength={100} />
                        </Form.Item>
                        <Form.Item
                            name="position"
                            label="职位名称"
                            rules={[
                                { required: true, message: '请输入职位名称！' },
                            ]}
                        >
                            <Input.TextArea showCount maxLength={100} />
                        </Form.Item>

                        <div className={style.btn}>
                            <Button type="primary" htmlType="submit">
                                Register
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

export default connect(({ Regist }) => ({
    Regist,
}))(Regist);
