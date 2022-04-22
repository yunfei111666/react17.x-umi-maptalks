/*
 * @Description:
 * @Project: 运营数据模块
 * @Author: yunfei
 * @Date: 2021-09-09 17:03:59
 * @LastEditors: Libj
 * @LastEditTime: 2022-02-25 09:49:08
 * @Modified By: yunfei
 * @FilePath: /TrunkFace/src/pages/TrunkMonitor/components/Operation/index.js
 */

import React, { Component } from 'react';
import style from './index.less';
import commonStyle from '../../common.less';
import TaskBar from 'components/ReactEchats/TaskBar';
import Empty from 'components/Empty';
import { Tooltip } from 'antd';
import { times } from 'utils/resize';
import Title from '../Title';

export default class Operation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titleInfo: {
                iconClass: 'yunyingshuju',
                text: '运营数据',
            },
            className: 'monitor',
        };
    }

    render() {
        const { titleInfo } = this.state;
        const { tagsData, echartsData } = this.props;
        return (
            <div className={`${commonStyle.main} ${style.box}`}>
                <div className={commonStyle.content}>
                    <span className={commonStyle.gradient}></span>
                    <div className={commonStyle.contents}>
                        <Title {...titleInfo} />
                        <div className={style.content}>
                            <div className={style.tag}>
                                {tagsData.map((item, index) => {
                                    return (
                                        <div
                                            className={style.mileage}
                                            key={index}
                                        >
                                            <div className={style.top}>
                                                <span className="opNumber">
                                                    {times(
                                                        item.number,
                                                        item.unit,
                                                    )?.num || 0}
                                                </span>
                                                <span className={style.unit}>
                                                    {
                                                        times(
                                                            item.number,
                                                            item.unit,
                                                        )?.unit
                                                    }
                                                </span>
                                            </div>
                                            <div className={style.text}>
                                                {item.title}
                                                <i
                                                    className={`iconfont ${item.icon}`}
                                                ></i>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className={style.chart}>
                                {echartsData.barData.length ? (
                                    <TaskBar {...echartsData} />
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
