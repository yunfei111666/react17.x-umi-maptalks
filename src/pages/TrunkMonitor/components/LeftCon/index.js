/*
 * @Description:
 * @Project: 左侧布局
 * @Author: yunfei
 * @Date: 2021-09-09 16:45:24
 * @LastEditors: yunfei
 * @LastEditTime: 2021-09-22 16:32:36
 * @Modified By: yunfei
 * @FilePath: /TrunkFace/src/pages/TrunkMonitor/components/LeftCon/index.js
 */

import React, { Component } from 'react';
import style from './index.less';
import Operation from '../Operation';
import AutomaticDriving from '../AutomaticDriving';
export default class LeftCon extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        //const { operation, autoPieData } = this.props;
        const operation = this.props.operation;
        const autoPieData = this.props.autoPieData;
        return (
            <div className={style.leftContent}>
                <Operation {...operation} />
                <AutomaticDriving {...autoPieData} />
            </div>
        );
    }
}
