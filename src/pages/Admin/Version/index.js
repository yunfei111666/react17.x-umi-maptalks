/*
 * @Description:
 * @Project:
 * @Author: yunfei
 * @Date: 2022-01-11 10:16:44
 * @LastEditors: yunfei
 * @LastEditTime: 2022-01-11 10:22:32
 * @Modified By: yunfei
 * @FilePath: /TrunkFace/src/pages/Admin/Version/index.js
 */

import React, { Component, componentDidMount } from 'react';
import { Timeline } from 'antd';
import versions from './versions.json';
import { connect } from 'umi';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: versions.data,
        };
        console.log(props);
    }
    render() {
        return (
            <div className="version">
                <Timeline mode={'left'} pending={false}>
                    {this.state.data.map((item, key) => {
                        return (
                            <Timeline.Item label={item.time} key={key}>
                                <div className="timeline-title">
                                    {item.title}
                                </div>
                                {item.list.map((child, index) => {
                                    return (
                                        <div
                                            className="timeline-content"
                                            key={index}
                                        >
                                            <p>
                                                {child.icon ? (
                                                    <i
                                                        className={`iconfont ${child.icon}`}
                                                    ></i>
                                                ) : (
                                                    ''
                                                )}
                                                &nbsp; {child.content}
                                            </p>
                                        </div>
                                    );
                                })}
                            </Timeline.Item>
                        );
                    })}
                </Timeline>
            </div>
        );
    }
}
export default connect(({ index }) => ({
    index,
}))(index);
// export default index;
