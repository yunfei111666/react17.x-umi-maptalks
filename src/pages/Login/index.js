/*
 * @Author: JackFly
 * @since: 2021-08-26 15:35:52
 * @lastTime: 2021-12-02 13:38:30
 * @文件相对于项目的路径: /TrunkFace/src/pages/Login/index.js
 * @message:
 */
import React, { Component } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login, getAccountInfo } from 'services/admin';
import { history, connect } from 'umi';
import style from './index.less';
class index extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            isShake: false,
        };
    }
    componentDidMount() {
        localStorage.removeItem('token');
        localStorage.removeItem('access');
    }
    onFinish = async (values) => {
        const params = {
            username: values.username,
            password: values.password,
        };
        const res = await login(params);
        if (res) {
            this.props.dispatch({
                type: 'index/changeToken',
                token: res.access_token,
            });
            localStorage.setItem('token', res.access_token);
            localStorage.setItem('username', values.username);
            this.handleGetAccess();
        } else {
            this.setState({
                isShake: true,
            });
        }
    };
    traverseAccessTree(data, result) {
        data.forEach((r) => {
            result.push(r.path);
            if (r.children?.length > 0) {
                this.traverseAccessTree(r.children, result);
            }
        });
    }
    handleGetAccess = async () => {
        const res = await getAccountInfo();
        if (res?.[0]?.children) {
            const access = [];
            this.traverseAccessTree(res[0]?.children, access);
            localStorage.setItem('access', JSON.stringify(access));
            if (access.length > 0) {
                history.push('Admin');
                return;
            }
            history.push('LandingPage');
        } else {
            this.setState({
                isShake: true,
            });
        }
    };

    // 重置抖动状态
    resetShake = () => {
        this.setState({
            isShake: false,
        });
    };
    handleRegist = () => {
        history.push('/Regist');
    };
    render() {
        return (
            <div className={style.loginPage}>
                <div className={` iconfont icon-logo ${style.logo}`}></div>
                <div className={style.loginWindow}>
                    <div className={style.staticText}>登&nbsp;&nbsp;录</div>
                    <Form
                        className={`${style.loginForm} login-form`}
                        initialValues={{ remember: true }}
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            labelCol={{ span: 3, offset: 12 }}
                            name="username"
                            rules={[
                                { required: true, message: '请输入你的账号' },
                            ]}
                        >
                            <Input
                                prefix={
                                    <UserOutlined className="site-form-item-icon" />
                                }
                                placeholder="账户"
                            />
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 3, offset: 12 }}
                            name="password"
                            rules={[
                                { required: true, message: '请输入你的密码' },
                            ]}
                            extra={
                                this.state.isShake ? '账号和密码不匹配!' : ''
                            }
                        >
                            <Input
                                className={
                                    this.state.isShake ? style.shake : ''
                                }
                                prefix={
                                    <LockOutlined className="site-form-item-icon" />
                                }
                                onFocus={this.resetShake}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className={style.loginFormButton}
                                onClick={this.resetShake}
                            >
                                登录
                            </Button>
                            <span
                                className={style.regist}
                                onClick={this.handleRegist}
                            >
                                注册
                            </span>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
}

export default connect(({ index }) => ({
    index,
}))(index);
