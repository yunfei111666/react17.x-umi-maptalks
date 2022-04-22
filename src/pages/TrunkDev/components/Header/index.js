/*
 * @Description:
 * @Project:
 * @Author: michelle
 * @Date: 2021-10-08 10:31:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-02 17:51:34
 * @Modified By: michelle
 * @FilePath: /TrunkFace/src/pages/TrunkDev/components/Header/index.js
 */
import React, { Component } from 'react';
import { Menu, Dropdown } from 'antd';
import style from './index.less';
import { Link } from 'react-router-dom';
import { connect } from 'umi';

class Header extends Component {
    constructor() {
        super();
        this.state = {
            loginMenu: (
                <Menu>
                    <Menu.Item key="logout" onClick={this.logOut}>
                        登出
                    </Menu.Item>
                </Menu>
            ),
        };
    }
    changeTheme = () => {
        const currentTheme = localStorage.getItem('theme') || 'theme-white';
        let theme =
            currentTheme == 'theme-white' ? 'theme-black' : 'theme-white';
        this.props.dispatch({
            type: 'index/changeTheme',
            payload: {
                theme,
            },
        });
        localStorage.setItem('theme', theme);
        location.reload();
    };

    logOut = () => {
        this.props.dispatch({
            type: 'index/changeToken',
            token: '',
        });
        localStorage.removeItem('token');
        localStorage.removeItem('access');
        location.reload();
        logout();
    };

    render() {
        return (
            <header className={style.header}>
                <div className={style.title}>TRUNK—DEV</div>
                <div className={style.pointer} onClick={this.changeTheme}>
                    <i className="iconfont icon-huanfu"></i>
                </div>
                <Link to="/Admin" className={style.iconMargin}>
                    <i className="iconfont icon-shouye1"></i>
                </Link>
                <Dropdown
                    className={style.pointer}
                    overlay={this.state.loginMenu}
                    placement="bottomCenter"
                >
                    <i className="iconfont icon-dengchu1"></i>
                </Dropdown>
            </header>
        );
    }
}
export default connect(({ index }) => ({
    index,
}))(Header);
