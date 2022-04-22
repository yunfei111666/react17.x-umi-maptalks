/*
 * @Author: yunfei
 * @Date: 2022-01-20 10:45:17
 * @LastEditTime: 2022-01-20 18:25:11
 * @FilePath: /TrunkFace/src/components/Map/MapLegend/index.js
 * @LastAuthor: Do not edit
 * @Description:
 */
import React, { Component } from 'react';
import style from './index.less';
import legendData from './legendData.json';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            legendData: legendData,
        };
    }

    render() {
        const { legendData } = this.state;
        return (
            <div className={style.legend}>
                {Object.keys(legendData).map((item, key) => {
                    return (
                        <div className={style.view} key={key}>
                            {legendData[item].map((obj, index) => {
                                return (
                                    <div key={index}>
                                        <i
                                            className={`iconfont ${obj.icon}`}
                                            style={{ color: obj.color }}
                                        ></i>
                                        &nbsp;
                                        <span className={style.text}>
                                            {obj.content}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }
}
export default index;
