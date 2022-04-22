/*
 * @Description:
 * @Project: 内容区标题组件
 * @Author: michelle
 * @Date: 2021-09-09 17:20:40
 * @LastEditors: michelle
 * @LastEditTime: 2021-09-14 11:07:27
 * @Modified By: michelle
 * @FilePath: /TrunkFace/src/pages/TrunkMonitor/components/Title/index.js
 */
import React, { Component } from 'react';
import commonStyle from '../../common.less';
export default class Title extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { iconClass, text } = this.props;
        return (
            <div className={commonStyle.title}>
                <i className={`iconfont icon-${iconClass}`}></i>
                <span>{text}</span>
            </div>
        );
    }
}
