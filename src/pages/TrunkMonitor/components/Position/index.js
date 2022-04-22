/*
 * @Description:
 * @Project: 对位模块
 * @Author: michelle
 * @Date: 2021-09-17 16:51:31
 * @LastEditors: Libj
 * @LastEditTime: 2022-02-25 11:05:47
 * @Modified By: michelle
 * @FilePath: /TrunkFace/src/pages/TrunkMonitor/components/Position/index.js
 */
import React, { Component } from 'react';
import style from './index.less';
import commonStyle from '../../common.less';
import Title from '../Title';
import PositionPie from '../../../../components/ReactEchats/PositionPie';
import Empty from 'components/Empty';
import { Tooltip } from 'antd';
import { setFont, times } from 'utils/resize';
export default class Position extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titleInfo: {
                iconClass: 'yunyingshuju',
                text: '对位信息',
            },
            className: 'monitor',
        };
    }
    render() {
        const { titleInfo } = this.state;
        const { waitTime, positionTime } = this.props;
        return (
            <div className={`${commonStyle.main} ${style.box}`}>
                <div className={commonStyle.content}>
                    <span className={commonStyle.gradient}></span>
                    <div className={commonStyle.contents}>
                        <Title {...titleInfo} />
                        <div className={style.content}>
                            <div className={style.tag}>
                                <div className={style.subTitle}>
                                    <span>等待时长</span>
                                    <div className="opNumber">
                                        <span>
                                            {times(waitTime, 'h')?.num || 0}
                                        </span>
                                        <span>
                                            {times(waitTime, 'h')?.unit}
                                        </span>
                                    </div>
                                </div>
                                <div className={style.subTitle}>
                                    <span>对位时长</span>
                                    <div className="opNumber">
                                        <span>
                                            {times(positionTime, 'h')?.num || 0}
                                        </span>
                                        <span>
                                            {times(positionTime, 'h')?.unit}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={style.chart}>
                                {this.props.positionTime ? (
                                    <PositionPie {...this.props} />
                                ) : (
                                    <Empty {...this.state} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
