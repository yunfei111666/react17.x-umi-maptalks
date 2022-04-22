import React, { Component } from 'react';
import './index.less';
import { Select, Switch, Button, Spin, message } from 'antd';
import { getTargets, goToTarget } from 'services/admin';
import { isEmpty } from 'lodash-es';

export default class CarControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            target: undefined,
            sub_target: undefined,
            carControlType: false, // 车辆控制动作类型：auto / GUI
            parks: [],
            loading: true,
        };
    }
    render() {
        const { parks, target, sub_target } = this.state;
        const { showBox, activeCarId } = this.props;
        return (
            <div className={`popover ${showBox ? 'show' : 'hide'}`}>
                <Spin spinning={this.state.loading} delay="100" tip="加载中">
                    <div className="title">
                        <span className="text">车辆控制</span>
                        <i
                            className="iconfont icon-delete"
                            onClick={() => {
                                this.handleClose();
                            }}
                        ></i>
                    </div>
                    <div className="main">
                        <div className="content">
                            <div className="contentBox">
                                <span className="carId">{activeCarId}</span>
                                <Switch
                                    defaultChecked
                                    checkedChildren="GUI"
                                    unCheckedChildren="AUTO"
                                    style={{ width: '60px' }}
                                    onChange={(checked) =>
                                        this.handleChange(checked)
                                    }
                                />
                            </div>
                        </div>
                        <div className="content">
                            <p className="parkTips">Go to Park</p>
                            <Select
                                className="select"
                                showSearch
                                value={target}
                                placeholder="请输入或选择目的地"
                                optionFilterProp="children"
                                onChange={(v) => this.handleSelect(v, 1)}
                                onSearch={(v) => this.handleSelect(v, 1)}
                                filterOption={(input, option) => {
                                    return (
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) > -1
                                    );
                                }}
                            >
                                {parks.map((p) => {
                                    return (
                                        <Select.Option
                                            key={p.target}
                                            value={p.target}
                                        >
                                            {p.target}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                            <Select
                                className="select"
                                showSearch
                                style={{ marginTop: '5px' }}
                                disabled={!target}
                                value={sub_target}
                                placeholder="请先选择一级目的地"
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    return (
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) > -1
                                    );
                                }}
                                onChange={(v) => this.handleSelect(v, 2)}
                            >
                                {parks
                                    .filter((p) => p.target === target)?.[0]
                                    ?.children.sort((a, b) => {
                                        return a - b;
                                    })
                                    .map((p) => {
                                        return (
                                            <Select.Option key={p} value={p}>
                                                {p}
                                            </Select.Option>
                                        );
                                    })}
                            </Select>
                        </div>
                    </div>

                    <div className="footer">
                        <Button
                            className="carControlCancel btn"
                            type="text"
                            onClick={() => this.handleCancel()}
                        >
                            取消
                        </Button>
                        <Button
                            className="btn"
                            type="primary"
                            onClick={() => this.handleConfirm()}
                        >
                            确认
                        </Button>
                    </div>
                </Spin>
            </div>
        );
    }
    componentDidMount() {
        this.getTargetMap();
    }
    async getTargetMap() {
        const res = await getTargets();
        !isEmpty(res) && this.setState({ parks: res, loading: false });
    }
    handleClose() {
        this.props.close();
    }
    handleChange(checked) {
        this.setState({
            carControlType: checked,
        });
    }

    handleSelect(v, level = 1) {
        if (level === 1) {
            const secondValue = this.state.parks.filter(
                (p) => p.target === v,
            )[0].children[0];
            this.setState({
                [`sub_target`]: secondValue,
            });
        }
        const key = level === 1 ? 'target' : 'sub_target';
        this.setState({
            [key]: v,
        });
    }
    async handleConfirm() {
        const { activeCarId } = this.props;
        const { target, sub_target } = this.state;
        this.setState({
            loading: true,
        });
        if (!this.state.target || !this.state.sub_target)
            return message.warning('请选择目的地');
        const res = await goToTarget({
            che_id: activeCarId,
            target,
            sub_target,
        });
        this.setState({ loading: false });
        if (res?.message === 'ok') {
            message.success('指令派发成功！');
        }
        this.props.close();
    }
    handleCancel() {
        this.setState({
            target: '',
            sub_target: '',
            carControlType: false,
        });
        this.props.close();
    }
}
