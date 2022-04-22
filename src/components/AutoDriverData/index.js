/*
 * @Description:
 * @Project:
 * @Author: yunfei
 * @Date: 2021-09-22 11:35:37
 * @LastEditors: Libj
 * @LastEditTime: 2022-02-25 11:40:40
 * @Modified By: yunfei
 * @FilePath: /TrunkFace/src/components/AutoDriverData/index.js
 */
import React, { Component, memo } from 'react';
import AutoPie from '../ReactEchats/AutoPie';
import PositionPie from '../ReactEchats/PositionPie';
import style from './index.less';
import Empty from 'components/Empty';
import { fixedNumber, times } from 'utils/resize';
import { getHostInfoValue } from '@/config/hostInfoConfig';

import Config from '@/config/base.js';

class index extends Component {
    render() {
        const { autoDriverData } = this.props;
        const isAlign = getHostInfoValue('isAlign');
        return (
            <>
                <div
                    className={`${style.faultTakeover} ${
                        isAlign == '1' ? null : style.addwidth
                    }`}
                >
                    <div className={style.showEchart}>
                        {autoDriverData[0].fault_durations ? (
                            <>
                                <div>
                                    <div className={style.waitTitle}>
                                        故障信息
                                    </div>
                                    <div className={style.showCountText}>
                                        <div>故障数量</div>
                                        <div className={style.smallEllipsis}>
                                            {times(
                                                autoDriverData[0].faults,
                                                'count',
                                            )?.num || 0}
                                            <span>
                                                {
                                                    times(
                                                        autoDriverData[0]
                                                            .faults,
                                                        'count',
                                                    )?.unit
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className={style.showCountText}>
                                        <div>故障时长</div>
                                        <div className={style.smallEllipsis}>
                                            {/* {fixedNumber(
                                                    autoDriverData[0]
                                                        .fault_durations,
                                                )} */}
                                            {times(
                                                autoDriverData[0]
                                                    .fault_durations,
                                                'h',
                                            )?.num || 0}
                                            <span>
                                                {
                                                    times(
                                                        autoDriverData[0]
                                                            .fault_durations,
                                                        'h',
                                                    )?.unit
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.echartParent}>
                                    <AutoPie {...autoDriverData[0]} />
                                </div>
                            </>
                        ) : (
                            <Empty />
                        )}
                    </div>
                    <div className={style.showEchart}>
                        {autoDriverData[1].take_over_durations ? (
                            <>
                                <div>
                                    <div className={style.waitTitle}>
                                        接管信息
                                    </div>
                                    <div className={style.showCountText}>
                                        <div>接管次数</div>
                                        <div
                                            className={style.smallEllipsis}
                                            style={{ maxWidth: '90px' }}
                                        >
                                            {times(
                                                autoDriverData[1].take_overs,
                                                'count',
                                            )?.num || 0}
                                            <span>
                                                {
                                                    times(
                                                        autoDriverData[1]
                                                            .take_overs,
                                                        'count',
                                                    )?.unit
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className={style.showCountText}>
                                        <div>接管时长</div>
                                        <div className={style.smallEllipsis}>
                                            {times(
                                                autoDriverData[1]
                                                    .take_over_durations,
                                                'h',
                                            )?.num || 0}
                                            <span>
                                                {
                                                    times(
                                                        autoDriverData[1]
                                                            .take_over_durations,
                                                        'h',
                                                    )?.unit
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={style.echartParent}>
                                    <AutoPie {...autoDriverData[1]} />
                                </div>
                            </>
                        ) : (
                            <Empty />
                        )}
                    </div>
                </div>
                {isAlign == '1' ? (
                    <div className={style.alignWait}>
                        {autoDriverData[3].wait_durations ? (
                            <>
                                <div className={style.alignWaitCount}>
                                    <div className={style.waitTitle}>
                                        对位信息
                                    </div>
                                    <div className={style.showData}>
                                        <div className="noWrap">等待时长</div>
                                        <div className={style.smallEllipsis}>
                                            {times(
                                                autoDriverData[3]
                                                    .wait_durations,
                                                'h',
                                            )?.num || 0}
                                            <span>
                                                {
                                                    times(
                                                        autoDriverData[3]
                                                            .wait_durations,
                                                        'h',
                                                    )?.unit
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className={style.showData}>
                                        <div className="noWrap">对位时长</div>
                                        <div className={style.smallEllipsis}>
                                            {times(
                                                autoDriverData[3]
                                                    .align_durations,
                                                'h',
                                            )?.num || 0}
                                            <span>
                                                {
                                                    times(
                                                        autoDriverData[3]
                                                            .align_durations,
                                                        'h',
                                                    )?.unit
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.alignEchart}>
                                    <PositionPie {...autoDriverData[2]} />
                                </div>
                            </>
                        ) : (
                            <Empty />
                        )}
                    </div>
                ) : (
                    ''
                )}
            </>
        );
    }
}

export default index;
