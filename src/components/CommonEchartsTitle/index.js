/*
 * @Author: shengaung
 * @Date: 2021-09-09 13:31:26
 * @Last Modified by: yunfei
 * @Last Modified time: 2021-09-17 17:07:29
 */
import React, { Component } from 'react';
import style from './index.less';

class index extends Component {
    render() {
        const { title, icon } = this.props;
        return (
            <div className={style.showTitle}>
                <div
                    className={`iconfont ${icon} ${style.titleBeforeImg}`}
                ></div>
                <div className={style.titleContent}>{title}</div>
            </div>
        );
    }
}

export default index;
