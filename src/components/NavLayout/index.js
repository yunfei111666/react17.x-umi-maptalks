/*
 * @Author: yunfei
 * @since: 2021-09-02 16:53:19
 * @lastTime: 2021-12-02 14:42:14
 * @文件相对于项目的路径: /TrunkFace/src/components/NavLayout/index.js
 * @message: 手写布局
 */
import React, { Component, componentDidUpdate } from 'react';
import { Link, connect, history } from 'umi';
import { logout } from 'services/admin';
import '../../assets/iconfont/iconfont.css';
import style from './index.less';
import { Menu, Space, Dropdown, Avatar, Layout, Popover } from 'antd';
import IntroJs from 'intro.js';
import menu from '@/config/ruleMenu';
import { cloneDeep } from 'lodash';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import {
    GithubOutlined,
    UserOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';
const { SubMenu } = Menu;
const { Content, Sider } = Layout;
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 标签栏展开
            collapsed: false,
            manageMenu: menu.manageMenu,
            currentRouter: null,
            newMenu: menu.menu,
            loginMenu: (
                <Menu>
                    <Menu.Item key="logout" onClick={this.logOut}>
                        登出
                    </Menu.Item>
                </Menu>
            ),
        };
        this.initCurrentPageName();
    }

    changeTheme = () => {
        const currentTheme = localStorage.getItem('theme') || 'theme-white';
        let theme =
            currentTheme == 'theme-white' ? 'theme-black' : 'theme-white';
        this.props.theme(theme);
        this.props.dispatch({
            type: 'index/changeTheme',
            payload: {
                theme,
            },
        });
        localStorage.setItem('theme', theme);
    };

    logOut = () => {
        this.props.dispatch({
            type: 'index/changeToken',
            token: '',
        });
        localStorage.removeItem('token');
        localStorage.removeItem('access');
        if (localStorage.getItem('performance')) {
            localStorage.removeItem('performance');
        }
        location.reload();
        logout();
    };

    layoutCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    componentDidUpdate() {
        if (location.hash === '#/') {
            history.replace('/Admin');
        }
    }
    componentDidMount() {
        // 检查localstorage是否经受过新手引导且已登陆
        const { isStager, token } = localStorage;
        if (!isStager && token) {
            this.introJsInit();
        }
        // history.replace('/Admin');
        // if (localStorage.username !== 'root') {
        //     history.replace('/TrunkMonitor');
        // }
    }
    // 开始新手引导且标记
    introJsInit() {
        IntroJs().start();
        localStorage.setItem('isStager', true);
    }
    // 判断当前页面显示页头信息
    initCurrentPageName() {
        const { hash } = location;
        const pathStr = hash.slice(1);
        const { newMenu } = this.state;
        const currentRouter = this.getCurrentRouter(newMenu, pathStr);
        this.state.currentRouter = currentRouter;
        // this.setCurrentPageName(currentRouter);
    }
    // 递归查找currentRouter
    getCurrentRouter(newMenu, pathStr) {
        for (let o of newMenu) {
            if (!o.children && o.path === pathStr) return o;
            let o_ = null;
            if (o.children?.length > 0)
                o_ = this.getCurrentRouter(o.children, pathStr);
            if (o_) return o_;
        }
    }
    setCurrentPageName(router) {
        this.setState({
            currentRouter: router,
        });
    }
    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    };
    render() {
        const { collapsed, currentRouter, newMenu } = this.state;
        const { token } = localStorage;
        const rules = JSON.parse(localStorage.getItem('access'));
        const isSuperUser = localStorage.getItem('isSuperUser');
        // 过滤掉没有权限的路由
        let menu = isSuperUser ? newMenu : [];
        !isSuperUser &&
            newMenu.forEach((m) => {
                if (m.path && rules.includes(m.path)) {
                    menu.push(m);
                } else if (!m.path && m.children.length > 0) {
                    const cloneRoute = cloneDeep(m);
                    cloneRoute.children.splice(0, cloneRoute.children.length);
                    m.children.forEach((c) => {
                        if (rules.includes(c.path)) cloneRoute.children.push(c);
                    });
                    cloneRoute.children.length > 0 && menu.push(cloneRoute);
                }
            });

        let view = (
            <div className={style.navlayout}>
                <div
                    className={
                        collapsed ? style.navCollapsedList : style.navList
                    }
                >
                    <div
                        className={`iconfont ${
                            collapsed ? 'icon-Logo-T' : 'icon-TF2'
                        } ${style.logo}`}
                    ></div>
                    <Sider
                        collapsible
                        collapsed={collapsed}
                        onCollapse={this.onCollapse}
                        width="15vw"
                    >
                        <Menu
                            theme="dark"
                            selectedKeys={
                                currentRouter.tab
                                    ? [currentRouter.tab, currentRouter.name]
                                    : [currentRouter.name]
                            }
                            defaultOpenKeys={
                                currentRouter.tab ? [currentRouter.tab] : []
                            }
                            mode="inline"
                        >
                            {menu.map((item, index) => {
                                if (!item.children) {
                                    return (
                                        <Menu.Item
                                            key={item.name}
                                            className={
                                                collapsed ? '' : 'firstMenu'
                                            }
                                            icon={
                                                <i
                                                    className={`iconfont ${item.icon} iconStyle`}
                                                ></i>
                                            }
                                            title={item.name}
                                        >
                                            <Link
                                                to={item.path}
                                                className={`${style.navItem} ${
                                                    item.path ===
                                                    this.props.pathname
                                                        ? style.selectedItem
                                                        : ''
                                                }`}
                                                data-position="right"
                                                key={item.path}
                                                onClick={() =>
                                                    this.setCurrentPageName(
                                                        item,
                                                    )
                                                }
                                            >
                                                <span className={style.name}>
                                                    {item.name}
                                                </span>
                                            </Link>
                                        </Menu.Item>
                                    );
                                } else {
                                    return (
                                        <SubMenu
                                            key={item.name}
                                            title={item.name}
                                            className={
                                                collapsed ? '' : 'subMenu'
                                            }
                                            icon={
                                                <i
                                                    className={`iconfont ${item.icon} subIconfont`}
                                                ></i>
                                            }
                                        >
                                            {item.children.map(
                                                (child, index) => {
                                                    return (
                                                        <Menu.Item
                                                            key={child.name}
                                                            className="secondMenu"
                                                            title={child.name}
                                                        >
                                                            <Link
                                                                to={child.path}
                                                                className={`${
                                                                    style.navItem
                                                                } ${
                                                                    child.path ===
                                                                    this.props
                                                                        .pathname
                                                                        ? style.selectedItem
                                                                        : ''
                                                                }`}
                                                                data-title={
                                                                    child.dataTitle
                                                                }
                                                                data-intro={
                                                                    child.dataIntro
                                                                }
                                                                data-position="right"
                                                                key={index}
                                                                onClick={() =>
                                                                    this.setCurrentPageName(
                                                                        child,
                                                                    )
                                                                }
                                                            >
                                                                <i
                                                                    className={`iconfont ${child.icon} iconStyle`}
                                                                    style={{
                                                                        marginRight:
                                                                            '10px',
                                                                    }}
                                                                ></i>
                                                                <span
                                                                    className={
                                                                        style.name
                                                                    }
                                                                >
                                                                    {child.name}
                                                                </span>
                                                            </Link>
                                                        </Menu.Item>
                                                    );
                                                },
                                            )}
                                        </SubMenu>
                                    );
                                }
                            })}
                        </Menu>
                    </Sider>
                </div>
                <Content
                    className={
                        collapsed ? style.layoutCollapsedBox : style.layoutBox
                    }
                >
                    <div className={style.boxHeader}>
                        <div className={style.pageName}>
                            {currentRouter.name}
                        </div>
                        <Space
                            className={style.spaceRight}
                            size="large"
                            align="right"
                            direction="right"
                        >
                            <Avatar
                                size="large"
                                style={{ cursor: 'pointer' }}
                                onClick={this.changeTheme}
                            >
                                <div className="iconfont icon-pifu"></div>
                            </Avatar>
                            {/* </Dropdown> */}
                            <Dropdown
                                overlay={this.state.loginMenu}
                                placement="bottomCenter"
                            >
                                <Avatar
                                    size="large"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="iconfont icon-dengchu1"></div>
                                </Avatar>
                                {/* <Avatar
                                    size="large"
                                    style={{ cursor: 'pointer' }}
                                    src={require('@/assets/images/dijia.jpeg')}
                                ></Avatar> */}
                            </Dropdown>
                        </Space>
                    </div>
                    <div className={style.boxContent}>
                        {this.props.children}
                    </div>
                </Content>
            </div>
        );
        // if (localStorage.getItem('username') !== 'root') {
        //     view = <></>;
        // }
        return view;
    }
}
export default connect(({ index }) => ({
    index,
}))(index);
