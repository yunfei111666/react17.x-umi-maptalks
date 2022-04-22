/*
 * @Description:
 * @Project: 右侧布局
 * @Author: yunfei
 * @Date: 2021-09-09 16:45:24
 * @LastEditors: yunfei
 * @LastEditTime: 2021-11-03 13:44:30
 * @Modified By: yunfei
 * @FilePath: /TrunkFace/src/pages/TrunkMonitor/components/RightCon/index.js
 */

import React, { Component } from 'react';
// import Fault from '../Fault';
import VehicleInfo from '../VehicleInfo';
import style from './index.less';
import Position from '../Position';
import { getHostInfoValue } from '@/config/hostInfoConfig';
import Config from '@/config/base.js';

export default class RightCon extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { positionData } = this.props;
        const isAlign = getHostInfoValue('isAlign');
        return (
            <div className={style.rightContent}>
                {/* tableData = {tableList} */}
                <VehicleInfo />
                {isAlign == 1 ? <Position {...positionData} /> : ''}
                {/* <Fault /> */}
            </div>
        );
    }
}
