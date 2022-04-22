/*
 * @Description:视频组件
 * @Project:
 * @Author: michelle
 * @Date: 2021-10-12 17:40:16
 * @LastEditors: michelle
 * @lastTime: 2021-11-11 13:16:52
 * @Modified By: michelle
 * @文件相对于项目的路径: /TrunkFace/src/pages/TrunkDev/components/Video/index.js
 */
import React, { Component } from 'react';
import style from './index.less';
import { getCheDetails } from '@/services/common';
import whiteImg from '../../../../assets/images/dev/white-error.png';
import blackImg from '../../../../assets/images/dev/black-error.png';
export default class Video extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: localStorage.theme || 'theme-white',
            videoList: [
                // {
                //     explain: '左前右',
                //     code: 'video0_3',
                // },
                {
                    explain: '左前左',
                    code: 'video0_2',
                },
                {
                    explain: '右后右',
                    code: 'video1_1',
                },
                {
                    explain: '右后左',
                    code: 'video1_0',
                },
                {
                    explain: '前',
                    code: 'video0_0',
                },
                // {
                //     explain: '后',
                //     code: 'video0_1',
                // },
            ],
            videoConfig: {
                ros: [
                    // {
                    //     explain: '左前右',
                    //     code: 'video0_3',
                    // },
                    {
                        explain: '左前左',
                        code: 'video0_2',
                    },
                    {
                        explain: '右后右',
                        code: 'video1_1',
                    },
                    {
                        explain: '右后左',
                        code: 'video1_0',
                    },
                    {
                        explain: '前',
                        code: 'video0_0',
                    },
                    // {
                    //     explain: '后',
                    //     code: 'video0_1',
                    // },
                ],
                mdc: [
                    // {
                    //     explain: '左前右',
                    //     code: 1,
                    // },
                    {
                        explain: '左前左',
                        code: 2,
                    },
                    {
                        explain: '右后右',
                        code: 3,
                    },
                    {
                        explain: '右后左',
                        code: 4,
                    },
                    {
                        explain: '前',
                        code: 5,
                    },
                    // {
                    //     explain: '后',
                    //     code: 6,
                    // },
                ],
            },
        };
    }
    componentDidMount() {
        this.init();
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    init() {
        getCheDetails(this.props.cheId)
            .then((res) => {
                let mdc = res.video_port.indexOf('mdc');
                let config = this.state.videoConfig.ros;
                if (mdc > 0) {
                    config = this.state.videoConfig.mdc;
                }
                config.forEach((item, index) => {
                    config[
                        index
                    ].url = `http://${res.ip}${res.video_port}${item.code}`;
                    config[index].isError = false;
                });
                console.log(config);
                this.setState({
                    videoList: config,
                });
            })
            .catch((err) => {});
    }
    render() {
        const { theme, videoList } = this.state;
        return (
            <div className={style.videoBox}>
                <div className={style.content}>
                    {videoList.map((item, index) => {
                        return (
                            <div className={style.list} key={index}>
                                <div className={style.top}>{item.explain}</div>
                                <div className={style.con}>
                                    <img
                                        className={
                                            item.isError ? style.defaultImg : ''
                                        }
                                        index={new Date()}
                                        src={item.url}
                                        onError={(e) => {
                                            item.isError = true;
                                            e.target.src =
                                                theme == 'theme-black'
                                                    ? blackImg
                                                    : whiteImg;
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
