/*
 * @Description: 自动驾驶数据
 * @Project:
 * @Author: yunfei
 * @Date: 2021-09-10 15:13:13
 * @LastEditors: Libj
 * @LastEditTime: 2022-02-25 11:33:19
 * @Modified By: yunfei
 * @FilePath: /TrunkFace/src/pages/TrunkMonitor/components/AutomaticDriving/index.js
 */
import React, { Component } from 'react';
import style from './index.less';
import commonStyle from '../../common.less';
import AutoPie from 'components/ReactEchats/AutoPie';
import Title from '../Title';
import Empty from 'components/Empty';
import { Tooltip } from 'antd';
import { times } from 'utils/resize';
export default class AutomaticDriving extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titleInfo: {
                iconClass: 'zidongjiashi',
                text: '自动驾驶数据',
            },
            className: 'monitor',
        };
    }

    render() {
        let defaultStyle = {
            height: 'calc(100% - 10px)',
            width: '100%',
            fontSize: 14,
            bgColor: 'rgba(234, 241, 255, 0.3)',
        };
        let fault = Object.assign(this.props[0], defaultStyle);
        let take = Object.assign(this.props[1], defaultStyle);
        const { titleInfo, className } = this.state;
        return (
            <div className={`${commonStyle.main} ${style.box}`}>
                <div className={commonStyle.content}>
                    <span className={commonStyle.gradient}></span>
                    <div className={commonStyle.contents}>
                        <Title {...titleInfo} />
                        <div className={style.content}>
                            <div className={style.left}>
                                <div className={style.box}>
                                    <div className={style.subTitle}>
                                        <span>故障数量</span>
                                        <div className="opNumber">
                                            <span>
                                                {times(fault.total, 'count')
                                                    ?.num || 0}
                                            </span>
                                            <span>
                                                {
                                                    times(fault.total, 'count')
                                                        ?.unit
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className={style.subTitle}>
                                        <span>故障时长</span>
                                        <div className="opNumber">
                                            <span>
                                                {times(fault.time, 'h')?.num ||
                                                    0}
                                            </span>
                                            <span>
                                                {times(fault.time, 'h')?.unit}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${style.box} ${style.chart}`}>
                                    {fault.total ? (
                                        <AutoPie {...fault} />
                                    ) : (
                                        <Empty {...this.state} />
                                    )}
                                </div>
                            </div>
                            <div className={style.right}>
                                <div className={style.box}>
                                    <div className={style.subTitle}>
                                        <span>接管次数</span>
                                        <div className="opNumber">
                                            <span>
                                                {times(take.total, 'count')
                                                    ?.num || 0}
                                            </span>
                                            <span>
                                                {
                                                    times(take.total, 'count')
                                                        ?.unit
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className={style.subTitle}>
                                        <span>接管时长</span>
                                        <div className="opNumber">
                                            <span>
                                                {times(take.time, 'h')?.num ||
                                                    0}
                                            </span>
                                            <span>
                                                {times(take.time, 'h')?.unit}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${style.chart} ${style.box}`}>
                                    {take.total ? (
                                        <AutoPie {...take} />
                                    ) : (
                                        <Empty {...this.state} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
