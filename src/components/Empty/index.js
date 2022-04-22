/*
 * @Description:
 * @Project:
 * @Author: yunfei
 * @Date: 2021-09-27 14:01:08
 * @LastEditors: yunfei
 * @LastEditTime: 2021-11-01 17:31:12
 * @Modified By: yunfei
 * @FilePath: /TrunkFace/src/components/Empty/index.js
 */
import React, { Component } from 'react';
import style from './index.less';
export default class Empty extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let { className } = this.props;
        return (
            <div className={style.noData}>
                <div className={style.icon}></div>
                <div className={`${style.empty} ${style[className]} `}>
                    暂无数据
                </div>
            </div>
        );
    }
}
