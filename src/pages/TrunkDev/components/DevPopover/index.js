/*
 * @Description:
 * @Project:
 * @Author: yunfei
 * @Date: 2021-11-05 16:03:41
 * @LastEditors: yunfei
 * @LastEditTime: 2022-01-20 09:55:07
 * @Modified By: yunfei
 * @FilePath: /TrunkFace/src/pages/TrunkDev/components/DevPopover/index.js
 */
import React, { Component } from 'react';
import style from './index.less';
import Fault from '../Fault';
import CarList from '../CarList';
import RealTime from '../RealTime';
import Api from '../Api';
import Stop from '../Stop';
import ForbiddenList from '../ForbiddenList'

export default class DevPopover extends Component {
    constructor(props) {
        super(props);
    }
    handleClose() {
        this.props.handleClose();
    }
    setContent(val) {
        switch (val) {
            case 0:
                return <Fault {...this.props} />;
            case 1:
                return <CarList />;
            case 2:
                return <RealTime />;
            case 3:
                return <Api />;
            case 4:
                return <Stop {...this.props} setEditStatus={this.props.setEditStatus} />;
            case 5:
                return <ForbiddenList {...this.props} />;
        }
    }

    render() {
        const { title, visible, activeIndex, id } = this.props;
        let Message, Header;
        // if (title.id !== 1) {
        Message = (
            <i
                className="iconfont icon-delete"
                onClick={() => {
                    this.handleClose();
                }}
            ></i>
        );
        Header = <span className={style.text}>{title.text}</span>;
        //  }

        return (
            <div
                className={`${style.popover} ${
                    visible ? style.show : style.hide
                } `}
            >
                {/* ${
                    title.id == 1 ? style.carTitle : ''
                } */}
                <div className={`${style.title}`}>
                    {Header}
                    {Message}
                </div>
                <div className={style.content}>
                    {this.setContent(activeIndex)}
                </div>
            </div>
        );
    }
}
