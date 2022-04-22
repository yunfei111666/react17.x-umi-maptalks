/*
 * @Description:
 * @Project: 环形图组件
 * @Author: michelle
 * @Date: 2021-09-10 22:57:55
 * @LastEditors: michelle
 * @LastEditTime: 2021-09-26 11:32:11
 * @Modified By: michelle
 * @FilePath: /TrunkFace/src/components/ReactEchats/AutoPie.js
 */
import React, { Component, memo } from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import { autoSize } from 'utils/resize.js';
import { echartsColors } from 'utils/enum.js';

import { fixedNumber } from 'utils/resize';
class AutoPie extends Component {
    constructor(props) {
        super(props);
        const { height } = this.props;
        this.echartsReact = React.createRef();
        this.state = { height };
    }

    /**
     *
     * @returns 返回options所需数据
     */
    setOption() {
        const {
            title,
            fontSize,
            bgColor,
            total,
            value,
            tag,
            gradualColor,
            titleFirstBottom,
            model,
        } = this.props;
        const theme = tag ? 'monitor' : model;
        return {
            title: [
                {
                    text: title,
                    x: 'center',
                    bottom: titleFirstBottom || 0,
                    textStyle: {
                        color: echartsColors.autoPie[theme].titleOneFontColor,
                        fontSize: autoSize(12),
                        fontWeight: 400,
                    },
                },
                {
                    text: fixedNumber(value) + '%',
                    x: 'center',
                    top: '30%',
                    textStyle: {
                        fontSize: autoSize(tag ? 16 : 14),
                        color: echartsColors.autoPie[theme].titleTwoFontColor,
                        foontWeight: 600,
                    },
                },
            ],
            tooltip: {
                textStyle: {
                    lineHeight: 0,
                    fontSize: autoSize(14),
                },
                formatter: '{a}: {c} ',
            },
            polar: {
                radius: tag ? ['45%', '75%'] : ['40%', '70%'], //['50%', '80%'],
                center: ['50%', '40%'],
            },
            angleAxis: {
                max: 100,
                clockwise: false,
                show: false,
            },
            radiusAxis: {
                type: 'category',
                show: true,
                axisLabel: {
                    show: false,
                },
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
            },
            series: [
                {
                    name: title || '',
                    type: 'bar',
                    roundCap: true,
                    barWidth: 60,
                    showBackground: true,
                    backgroundStyle: {
                        color: echartsColors.autoPie[theme].bgColor,
                    },
                    data: [fixedNumber(value)],
                    coordinateSystem: 'polar',
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                            {
                                offset: 0,
                                color: gradualColor[0],
                            },
                            {
                                offset: 1,
                                color: gradualColor[1],
                            },
                        ]),
                    },
                },
            ],
        };
    }

    render() {
        return (
            <React.Fragment>
                <ReactEcharts
                    option={this.setOption()}
                    ref={(e) => (this.echartsReact = e)}
                    style={{ width: '100%', height: this.state.height }}
                />
            </React.Fragment>
        );
    }
}

export default memo(AutoPie);
