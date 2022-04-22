/*
 * @Description:
 * @Project:
 * @Author: michelle
 * @Date: 2021-11-08 17:18:48
 * @LastEditors: Please set LastEditors
 * @lastTime: 2021-11-11 12:59:15
 * @Modified By: michelle
 * @文件相对于项目的路径: /TrunkFace/src/pages/TrunkDev/components/CarInfo/index.js
 */
import React, { Component } from 'react';
import style from './index.less';
import Video from '../Video';
import MiniMap from '../MiniMap';
import qian from '@/assets/images/dev/qian.png';
import shen from '@/assets/images/dev/shen.png';
import CarMsg from '../CarMsg';
import { History, Link, connect } from 'umi';
import Access from '@/components/Access';

export default class CarInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x: 0,
            y: 0,
        };
    }

    handleClose = () => {
        this.props.setPopover({
            carFlag: false,
        });
        this.getInit();
    };

    handleZoom = () => {
        this.props.setZoom();
    };
    fn(ev) {
        var disx = ev.pageX - this.state.x;
        var disy = ev.pageY - this.state.y;
        var _this = this;
        document.onmousemove = function (ev) {
            if (
                window.innerWidth > ev.pageX + 30 &&
                ev.pageX > 30 &&
                window.innerHeight > ev.pageY + 30 &&
                ev.pageY > 30
            ) {
                _this.setState({
                    x: ev.pageX - disx,
                    y: ev.pageY - disy,
                });
            }
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmousedown = null;
        };
    }
    //初始化位置
    getInit() {
        if (window.innerWidth && window.innerHeight) {
            this.setState({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
            });
        }
    }
    componentDidMount() {
        this.getInit();
    }

    render() {
        const { theme, carFlag, zoomFlag, cheId } = this.props;
        return (
            <div
                id="dom"
                className={`${style.carBox} ${
                    carFlag ? style.show : style.hide
                }`}
                style={{ left: this.state.x + 'px', top: this.state.y + 'px' }}
                onMouseDown={this.fn.bind(this)}
            >
                <Access accessKey="TrunkDev-emergency-stop">
                    <div className={style.stretchBtn} onClick={this.handleZoom}>
                        <img src={theme == 'theme-white' ? qian : shen} />
                        <Link to={'/CarDetail/' + cheId} target="_blank">
                            <i className="iconfont icon-zhankaijiantou"></i>
                        </Link>
                    </div>
                </Access>

                <div className={style.leftCon}>
                    <CarMsg {...this.props} handleClose={this.handleClose} />
                </div>
                {/* <div
                    className={`${style.conBox} ${
                        zoomFlag ? style.isZoom : ''
                    }`}
                >
                    <div className={style.leftCon}>
                        <CarMsg
                            {...this.props}
                            handleClose={this.handleClose}
                        />
                    </div>
                    {zoomFlag ? (
                        <>
                            <Video cheId={this.props.cheId} />
                            <MiniMap data={this.props} />
                        </>
                    ) : (
                        ''
                    )}
                </div> */}
            </div>
        );
    }
}
