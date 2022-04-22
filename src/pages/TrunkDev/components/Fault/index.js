/*
 * @Description:
 * @Project: 实时故障模块
 * @Author: yunfei
 * @Date: 2021-09-13 10:05:28
 * @LastEditors: yunfei
 * @LastEditTime: 2021-11-04 16:29:51
 * @Modified By: yunfei
 * @FilePath: /TrunkFace/src/pages/TrunkDev/components/Fault/index.js
 */
import React, { Component } from 'react';
import style from './index.less';
import Alarm from '@/components/Alarm';
export default class Fault extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={style.popoverCon}>
                <Alarm type="dev" {...this.props} />
            </div>
        );
    }
}
