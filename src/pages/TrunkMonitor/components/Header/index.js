/*
 * @Author: JackFly
 * @since: 2021-11-05 13:20:18
 * @lastTime: 2021-11-17 13:07:08
 * @文件相对于项目的路径: /TrunkFace/src/pages/TrunkMonitor/components/Header/index.js
 * @LastAuthor: Do not edit
 * @message:
 */
import React, { Component, useState } from 'react';
import style from './index.less';
import logoUrl from '@/assets/images/monitor/logo.png';
import Weather from '../Weather';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { speech, play, stop } from '@/utils/speech.js';
import { Badge, Modal, Menu, Dropdown } from 'antd';
import { connect } from 'umi';
import Alarm from '@/components/Alarm';
import { getHostInfoValue } from '@/config/hostInfoConfig';
import Config from '@/config/base.js';

class Header extends Component {
    constructor(props) {
        super(props);
        this.timeTicket = null;
        this.state = {
            date: '',
            time: '',
            visible: false,
            title: '',
            loginMenu: (
                <Menu>
                    <Menu.Item key="logout" onClick={this.logOut}>
                        登出
                    </Menu.Item>
                </Menu>
            ),
        };
    }

    getDate() {
        return moment(Date.parse(new Date())).format('YYYY年MM月DD');
    }

    getTime() {
        return moment(Date.parse(new Date())).format('HH:mm:ss');
    }

    setVisible(flag) {
        this.setState({
            visible: flag,
        });
    }

    componentDidMount() {
        const name = getHostInfoValue('title');

        if (this.timeTicket) clearInterval(this.timeTicket);
        this.timeTicket = setInterval(() => {
            this.setState({
                date: this.getDate(),
                time: this.getTime(),
            });
        }, 1000);

        let flag = eval(localStorage.getItem('alarmCheckd')) || false;
        this.setState({
            visible: flag,
            title: name,
        });
    }

    componentWillUnmount() {
        if (this.timeTicket) clearInterval(this.timeTicket);
    }

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
        const { date, time, visible, title } = this.state;
        const { alarmList } = this.props;
        return (
            <header className={style.header}>
                <div className={style.logo}>
                    <img src={logoUrl} alt="logo" />
                </div>
                <div className={style.title}>{title}</div>
                <div className={style.right}>
                    <div className={style.time}>
                        <div>{date}</div>
                        <div>{time}</div>
                    </div>
                    <Badge
                        count={alarmList ? alarmList.length : 0}
                        onClick={() => this.setVisible(true)}
                    >
                        <i className="iconfont icon-tixing"></i>
                    </Badge>
                    {/* <Weather /> */}
                    {/* target="_blank" */}
                    <Link to="/Admin">
                        <i className="iconfont icon-shouye-xian"></i>
                    </Link>
                    <Dropdown
                        className={style.pointer}
                        overlay={this.state.loginMenu}
                        placement="bottomCenter"
                    >
                        <i className="iconfont icon-dengchu1"></i>
                    </Dropdown>
                    <Modal
                        title="故障告警"
                        className={style.alarmModal}
                        centered
                        visible={visible}
                        maskClosable={false}
                        onOk={() => this.setVisible(false)}
                        onCancel={() => this.setVisible(false)}
                        footer={null}
                        width={'760px'}
                    >
                        <Alarm type="monitor" {...this.props} />
                    </Modal>
                </div>
            </header>
        );
    }
}
export default connect(({ index }) => ({
    index,
}))(Header);
