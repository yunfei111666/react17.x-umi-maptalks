/*
 * @Description: 侧边栏组件
 * @Project:
 * @Author: michelle
 * @Date: 2021-10-08 14:10:27
 * @LastEditors: michelle
 * @LastEditTime: 2022-01-20 10:01:52
 * @Modified By: michelle
 * @FilePath: /TrunkFace/src/pages/TrunkDev/components/Sidebar/index.js
 */
import React, { Component } from 'react';
import style from './index.less';
import DevPopover from '../DevPopover';
import canIuse from '@/utils/access.js';
export default class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sideList: [
                {
                    icon: 'icon-tixingbeifen',
                    text: '故障详情',
                    id: 0,
                },
                {
                    icon: 'icon-cheliangliebiao',
                    text: '车辆列表',
                    id: 1,
                },
                {
                    icon: 'icon-shishidongtai',
                    text: '实时动态',
                    id: 2,
                },
                {
                    icon: 'icon-a-APItiaoshi5',
                    text: 'API调试',
                    id: 3,
                },
                {
                    icon: 'icon-dadian',
                    text: '禁行区域',
                    id: 4,
                },
                {
                    icon: 'icon-jinhangliebiao',
                    text: '禁行列表',
                    id: 5,
                },
            ],
            num: 0,
            flag: false,
        };
    }

    handleSide(val) {
        switch (val.id) {
            case 1:
                // this.setState({
                //     num: 2,
                // });
                // if (this.state.num == 2) {
                //     this.handleClose();
                //     this.props.setSideActive({ id: null });
                //     this.props.setPopover({
                //         sideFlag: false,
                //     });
                //     this.setState({
                //         flag: false,
                //         num: 0,
                //     });
                // } else {
                this.setState({
                    flag: true,
                });
                this.props.setPopover({
                    sideFlag: true,
                });
                this.props.setSideActive(val);
                //}
                break;
            case 4:
                // this.props.setPopover({
                //     sideFlag: this.state.flag ? true : false,
                // });
                // this.props.setSideActive(
                //     this.state.flag ? this.state.sideList[1] : val,
                // );
                this.setState({
                    flag: true,
                });
                this.props.setPopover({
                    sideFlag: true,
                });
                this.props.setSideActive(val);
                break;
            case 4:
                this.setState({
                    flag: true,
                });
                this.props.setPopover({
                    sideFlag: true,
                    forbidden: true,
                });
                this.props.setSideActive(val);
                break;
            default:
                if (this.state.flag) {
                    this.setState({
                        num: 1,
                    });
                }
                this.props.setPopover({
                    sideFlag: true,
                    carFlag: false,
                });
                this.props.setSideActive(val);
                break;
        }
    }

    handleClose = () => {
        this.props.setGeoParams(null); // 清空禁行区域框内数据
        this.props.drawTools.disable();
        this.props.setPopover({
            sideFlag: false,
        });
    };

    render() {
        const { sideList } = this.state;
        let { sideFlag, sideActive } = this.props;
        return (
            <div className={style.side}>
                <ul className={style.list}>
                    {sideList.map((item, index) => {
                        if (canIuse(item.icon)) {
                            return (
                                <li
                                    key={index}
                                    className={
                                        sideActive == item.id
                                            ? style.active
                                            : ''
                                    }
                                    onClick={() => {
                                        this.handleSide(item);
                                    }}
                                >
                                    <i className={`iconfont ${item.icon}`}></i>
                                    <span>{item.text}</span>
                                </li>
                            );
                        } else {
                            return null;
                        }
                    })}
                </ul>
                <DevPopover
                    setEditStatus={this.props.setEditStatus}
                    handleClose={this.handleClose}
                    visible={sideFlag}
                    title={sideList[sideActive || 0]}
                    activeIndex={sideActive}
                    {...this.props}
                />
            </div>
        );
    }
}
