/*
 * @Description: 右侧tab切换
 * @Project:
 * @Author: yunfei
 * @Date: 2021-10-20 13:40:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-02 10:53:09
 * @Modified By: yunfei
 * @FilePath: /TrunkFace/src/pages/TrunkDev/components/Api/Side.js
 */
import React, { Component } from 'react';
import style from './index.less';
export default class Side extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tagActive: 0,
        };
        if (props.onRef) {
            //如果父组件传来该方法 则调用方法将子组件this指针传过去
            props.onRef(this);
        }
    }
    //父组件top tab调用子组件的方法，设置右侧tab默认选中第一个
    setSideIndex = () => {
        this.setState({
            tagActive: 0,
        });
    };

    handleTagChange(item, index) {
        this.setState({
            tagActive: index,
        });
        this.props.setContent(item, index);
    }

    render() {
        const { tagActive } = this.state;
        const { list } = this.props;
        return (
            <ul className={style.right}>
                {list.map((item, index) => {
                    return (
                        <li
                            key={index}
                            onClick={() => {
                                this.handleTagChange(item, index);
                            }}
                            className={index == tagActive ? style.active : ''}
                        >
                            <span>{item.summary}</span>
                        </li>
                    );
                })}
            </ul>
        );
    }
}
