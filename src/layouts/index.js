/*
 * @Description:
 * @Project:
 * @Author: yunfei
 * @Date: 2021-09-10 16:49:35
 * @LastEditors: yunfei
 * @LastEditTime: 2021-09-16 15:54:43
 * @Modified By: yunfei
 * @FilePath: /TrunkFace/src/layouts/index.js
 */

import NavLayout from '../components/NavLayout';
import { history, connect } from 'umi';
import zhCN from 'antd/es/locale/zh_CN';
import React, { Component } from 'react';
import { ConfigProvider } from 'antd';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            independentPath: ['/TrunkDev', '/TrunkMonitor', '/Admin/'],
            theme: localStorage.getItem('theme') || 'theme-white',
        };
    }
    componentDidMount() {
        const pathname = this.props.location.pathname;
        if (!localStorage.getItem('token')) {
            history.replace('/Login');
        } else if (pathname === '/') {
            // 判断权限
            // 无任何权限 => Landing page
            // 有权限 =>
            //           如有Admin  => Admin    如有TrunkMonitor => TrunkMonitor
            // history.replace('/Admin');
            this.handleAccess();
        }
    }
    handleAccess() {
        const rules = JSON.parse(localStorage.getItem('access')) ?? [];
        if (rules.length === 0) {
            history.replace('/LandingPage');
        } else if (rules.includes('/Admin')) {
            history.replace('/Admin');
        } else if (rules.includes('/TrunkMonitor')) {
            history.replace('/TrunkMonitor');
        }
    }
    getTheme(theme) {
        this.setState({
            theme,
        });
    }

    render() {
        const pathname = this.props.location.pathname;
        let layout = null;
        if (pathname.indexOf('Admin') !== -1) {
            layout = (
                <NavLayout
                    pathname={pathname}
                    theme={(val) => {
                        this.getTheme(val);
                    }}
                >
                    {this.props.children}
                </NavLayout>
            );
        } else {
            layout = <>{this.props.children}</>;
        }

        return (
            <ConfigProvider locale={zhCN}>
                <div className={[this.state.theme, 'contextBox'].join(' ')}>
                    {layout}
                </div>
            </ConfigProvider>
        );
    }
}

export default connect(({ index, loading }) => ({
    index,
    loading: loading.models,
}))(index);
