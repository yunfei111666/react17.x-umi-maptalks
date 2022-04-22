/*
 * @Author: shenguang
 * @Date: 2021-09-09 09:11:41
 * @Last Modified by: shenguang
 * @Last Modified time: 2021-11-10 17:00:19
 */

import React, { Component } from 'react';
import style from './index.less';
import { fixedNumber, times } from 'utils/resize';
import { Tooltip } from 'antd';
class index extends Component {
    render() {
        const { title, measureWord, iconFont, keyProperty } = this.props;
        return (
            <div className={style.informationCrad}>
                <div
                    className={`iconfont ${iconFont} ${style.iconStyle}`}
                ></div>
                <div className={style.relativeAprent}>
                    <div className={style.introduceTitle}>{title}</div>
                    <div className={style.countNumber}>
                        <span>
                            {times(this.props[keyProperty], measureWord)?.num ||
                                0}
                        </span>
                        <span className={style.measureWord}>
                            {times(this.props[keyProperty], measureWord)?.unit}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default index;
