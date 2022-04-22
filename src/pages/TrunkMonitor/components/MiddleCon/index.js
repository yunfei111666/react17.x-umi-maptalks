/*
 * @Description:
 * @Project: 中间布局
 * @Author: yunfei
 * @Date: 2021-09-09 16:45:24
 * @LastEditors: yunfei
 * @lastTime: 2021-11-04 10:04:13
 * @Modified By: yunfei
 * @文件相对于项目的路径: /TrunkFace/src/pages/TrunkMonitor/components/MiddleCon/index.js
 */
import React, { Component } from 'react';
import style from './index.less';

import MapSite from 'components/Map/MapSite';

export default class MiddleCon extends Component {
    handleZoom = () => {
        this.state.child.handleFullScreen();
    };
    componentDidMount() {
        this.props.setChild(this);
    }
    setChild = (that) => {
        this.setState({
            child: that,
        });
    };
    render() {
        return (
            <div className={style.middleContent}>
                <div className={style.title}>实时监控</div>
                <MapSite
                    setChild={this.setChild}
                    config={{ theme: 'blue', tools: false }}
                ></MapSite>
            </div>
        );
    }
}
