/*
 * @Description:
 * @Project: 禁行区域模块
 * @Author: kxy
 * @Date: 2022-02-9 17:18:28
 * @LastEditors: kxy
 * @Modified By: kxy
 * @FilePath: /TrunkFace/src/pages/TrunkDev/components/Stop/index.js
 */

import React, { Component } from 'react';
import style from './index.less';
import { connect } from 'umi';
import { Button, Input, InputNumber, message } from 'antd';
import * as maptalks from 'maptalks';
import '@root/node_modules/maptalks/dist/maptalks.css';
import { add, subtract, cloneDeep } from 'lodash';
import { addForbiddenArea, updateForbidden } from 'services/admin';
import eventBus from '@/utils/eventBus.js';

const { TextArea } = Input;

class Stop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'add', // add / edit
            name: '',
            reason: '',
            width: '',
            height: '',
            basicX: 0.1,
            basicY: 0.1,
        };
    }

    render() {
        const { name, reason, basicX, basicY, status } = this.state;
        const { activeGeoParams, isEditing } = this.props;
        return (
            <div className={style.popoverCarCon}>
                <p className={style.title}>区域名称：</p>
                <div className={style.item}>
                    <Input
                        name="name"
                        style={{ marginRight: '10px' }}
                        placeholder="请输入区域名称"
                        value={name}
                        onChange={(e) => this.handleInput(e)}
                    />
                    <Button
                        type="primary"
                        disabled={isEditing || status === 'edit'}
                        onClick={() => this.handleSelect()}
                    >
                        地图选取
                    </Button>
                </div>

                <p className={style.title}>中心点坐标X：</p>
                <div className={style.item}>
                    <Input
                        disabled
                        style={{ marginRight: '10px' }}
                        placeholder="地图选取后自动填充"
                        value={activeGeoParams?.centerPosition?.x ?? ''}
                    />
                </div>

                <p className={style.title}>中心点坐标Y：</p>
                <div className={style.item}>
                    <Input
                        disabled
                        style={{ marginRight: '10px' }}
                        placeholder="地图选取后自动填充"
                        value={activeGeoParams?.centerPosition?.y ?? ''}
                    />
                </div>

                <p className={style.title}>宽度(m)：</p>
                <div className={style.item}>
                    <Input
                        style={{ width: '30%' }}
                        disabled
                        placeholder="地图选取后自动填充"
                        value={activeGeoParams?.width || ''}
                    />
                    <div className={style.arrowWraper}>
                        <div
                            className={style.arrowTop}
                            onClick={() => this.changeSize('x', '+')}
                        ></div>
                        <p className={style.line}></p>
                        <div
                            className={style.arrowBottom}
                            onClick={() => this.changeSize('x', '-')}
                        ></div>
                    </div>
                    <div className={style.step}>
                        <span className={style.text}>步长：</span>
                        <InputNumber
                            className={style.inputNumber}
                            readOnly
                            min={0.1}
                            max={0.5}
                            step={0.1}
                            placeholder="步进值"
                            value={basicX}
                        />
                        <div className={style.arrowWraper}>
                            <div
                                className={style.arrowTop}
                                onClick={() => this.changeStep('x', '+')}
                            ></div>
                            <p className={style.line}></p>
                            <div
                                className={style.arrowBottom}
                                onClick={() => this.changeStep('x', '-')}
                            ></div>
                        </div>
                    </div>
                </div>

                <p className={style.title}>高度(m)：</p>
                <div className={style.item}>
                    <Input
                        style={{ width: '30%' }}
                        disabled
                        placeholder="地图选取后自动填充"
                        value={activeGeoParams?.height || ''}
                    />

                    <div className={style.arrowWraper}>
                        <div
                            className={style.arrowTop}
                            onClick={() => this.changeSize('y', '+')}
                        ></div>
                        <p className={style.line}></p>
                        <div
                            className={style.arrowBottom}
                            onClick={() => this.changeSize('y', '-')}
                        ></div>
                    </div>
                    <div className={style.step}>
                        <span className={style.text}>步长：</span>
                        <InputNumber
                            className={style.inputNumber}
                            readOnly
                            min={0.1}
                            max={0.5}
                            step={0.1}
                            placeholder="步进值"
                            value={basicY}
                        />
                        <div className={style.arrowWraper}>
                            <div
                                className={style.arrowTop}
                                onClick={() => this.changeStep('y', '+')}
                            ></div>
                            <p className={style.line}></p>
                            <div
                                className={style.arrowBottom}
                                onClick={() => this.changeStep('y', '-')}
                            ></div>
                        </div>
                    </div>
                </div>

                <p className={style.title}>封闭原因：</p>
                <div className={style.item}>
                    <TextArea
                        name="reason"
                        style={{ marginRight: '10px' }}
                        placeholder="请输入封闭原因"
                        value={reason}
                        onChange={(e) => this.handleInput(e)}
                    />
                </div>

                <div className={style.btnRow}>
                    <Button onClick={() => this.handleCancel()}>取消</Button>
                    <Button type="primary" onClick={() => this.handleConfirm()}>
                        确定
                    </Button>
                </div>
            </div>
        );
    }
    componentDidMount() {
        if (this.props.activeGeoParams?.geometry?._id) {
            const geo = this.props.activeGeoParams.geometry;
            this.setState({
                status: 'edit',
                name: geo.options.name,
                reason: geo.options.reason,
                isEditing: true,
            });
        }
    }
    changeStep(type, symbol) {
        if (
            symbol === '-' &&
            this.state[`basic${type.toUpperCase()}`] - 0.1 === 0
        )
            return;
        const _this = this;
        const { basicX, basicY } = this.state;
        const offset = symbol === '+' ? 0.1 : -0.1;
        if (type === 'x') {
            this.setState({
                basicX: _this.add(basicX, offset),
            });
        } else {
            this.setState({
                basicY: _this.add(basicY, offset),
            });
        }
    }
    add(arg1, arg2) {
        var r1, r2, m;
        try {
            r1 = arg1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        return (arg1 * m + arg2 * m) / m;
    }
    changeSize(type, symbol) {
        const coordiantes = this.props.activeGeoParams.coordinates;
        let basic = type === 'x' ? this.state.basicX : this.state.basicY;
        if (type === 'x') {
            basic = basic / 4; // 为了让坐标轴的0.1偏移量 约等于 0.1米，设定此固定参数
            const yaw =
                (coordiantes[1].y - coordiantes[0].y) /
                (coordiantes[1].x - coordiantes[0].x);
            const offsetX = symbol === '+' ? basic : -basic;
            console.log(offsetX);
            const offsetY = symbol === '+' ? basic * yaw : -(basic * yaw);
            // console.log(coordiantes[1].x);
            coordiantes[1].x += offsetX;
            coordiantes[1].y += offsetY;
            coordiantes[2].x += offsetX;
            coordiantes[2].y += offsetY;
        } else {
            const yaw =
                (coordiantes[2].y - coordiantes[1].y) /
                (coordiantes[2].x - coordiantes[1].x);
            const offsetX = symbol === '+' ? basic : -basic;
            const offsetY = symbol === '+' ? basic * yaw : -(basic * yaw);
            coordiantes[0].x -= offsetX;
            coordiantes[0].y -= offsetY;
            coordiantes[1].x -= offsetX;
            coordiantes[1].y -= offsetY;
        }
        this.props.activeGeoParams.geometry.setCoordinates(coordiantes);
    }
    handleInput(e) {
        this.setState({
            [e.target.name]: e.target.value.trim(),
        });
    }
    // 开始地图选取，开启drawTools并调整视角为垂直
    handleSelect() {
        this.props.drawTools.enable();
        this.props.devMap.animateTo(
            {
                pitch: 0,
            },
            {
                duration: 300,
            },
        );
        this.props.setEditStatus(true);
    }
    // 确认选取
    async handleConfirm() {
        if (!this.props.activeGeoParams)
            return message.error('请先在地图上框选区域');
        const params = {
            id: this.props.activeGeoParams.geometry._id,
            name: this.state.name,
            center_point: {
                x: this.props.activeGeoParams.centerPosition.x,
                y: this.props.activeGeoParams.centerPosition.y,
            },
            points: this.props.activeGeoParams.coordinates,
            length: this.props.activeGeoParams.width,
            width: this.props.activeGeoParams.height,
            reason: this.state.reason,
        };
        const { status } = this.state;
        const res =
            status === 'add'
                ? await addForbiddenArea(params)
                : await updateForbidden(params);
        if (res) {
            message.success('设置成功');
            this.close('success', res);
        }
    }
    handleCancel() {
        this.close('cancel');
    }
    // 关闭弹窗  1.禁用drawTools 2.geo设置为禁用
    close(type, res) {
        this.props.drawTools.disable();
        this.props.setEditStatus(false);
        const geos = this.props.devMap
            .getLayer('forbiddenArea')
            .getGeometries();
        geos.forEach((g) =>
            g
                .setOptions({
                    editable: false,
                    draggable: false,
                })
                .endEdit(),
        );
        this.props.handleClose();
        if (type === 'cancel') {
            eventBus.emit('reloadForbiddenAreas');
            // const lasyGeo = geos[geos.length - 1];
            // lasyGeo && !lasyGeo._id && geos[geos.length - 1].remove();
            return;
        } else {
            eventBus.emit('reloadForbiddenAreas');
        }
    }
}

export default connect(({ index }) => ({
    index,
}))(Stop);
