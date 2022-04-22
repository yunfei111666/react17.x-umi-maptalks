/*
 * @Description:
 * @Project: 车辆信息横向柱状图
 * @Author: yunfei
 * @Date: 2021-09-13 17:03:00
 * @LastEditors: yunfei
 * @LastEditTime: 2021-11-16 17:41:06
 * @Modified By: yunfei
 * @FilePath: /TrunkFace/src/components/ReactEchats/CarBar.js
 */
import React, { Component, memo } from 'react';
import ReactEcharts from 'echarts-for-react';
import { autoSize, getWidth, fixedNumber } from 'utils/resize.js';
import { echartsColors } from 'utils/enum.js';
class CarBar extends Component {
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
        const { color, tag, legendData, seriesData, total, model } = this.props;
        const theme = tag ? 'monitor' : model;
        if (seriesData) {
            seriesData.map((item, index) => {
                let obj = {
                    itemStyle: {
                        color: color[index],
                        borderRadius: 10,
                    },
                    barGap: 0,
                };
                return Object.assign(item, obj);
            });
        }
        return {
            grid: {
                top: autoSize(20),
                bottom: getWidth() > 1920 ? autoSize(10) : -25,
                right: autoSize(30), //20,
                left: getWidth() > 1920 ? autoSize(10) : -20,
                containLabel: true,
            },
            xAxis: {
                show: false,
            },
            yAxis: [
                {
                    triggerEvent: true,
                    show: true,
                    inverse: true,
                    data: legendData,
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        show: true,
                        interval: 0,
                        color: echartsColors.carBar[theme].fontColor,
                        align: 'left',
                        margin: getWidth() > 1920 ? autoSize(35) : 60,
                        formatter: function (value) {
                            return '{title|' + value + '}';
                        },
                        rich: {
                            title: {
                                width: 50,
                                align: 'right',
                                fontSize: autoSize(12),
                            },
                        },
                    },
                },
                {
                    triggerEvent: true,
                    show: true,
                    inverse: true,
                    data: seriesData,
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        interval: 0,
                        color: echartsColors.carBar[theme].fontColor,
                        align: 'left',
                        margin: getWidth() > 1920 ? -65 : autoSize(10),
                        formatter: function (value) {
                            return fixedNumber(value / total) * 100 + '%';
                        },
                        fontSize: autoSize(12),
                    },
                },
            ],
            series: [
                {
                    type: 'bar',
                    zlevel: 1,
                    data: seriesData,
                    barWidth: autoSize(12),
                },
                {
                    type: 'bar',
                    barWidth: autoSize(12),
                    barGap: -1,
                    data: [total, total],
                    itemStyle: {
                        color: echartsColors.carBar[theme].bgColor,
                        borderRadius: 10,
                    },
                },
            ],
        };
    }

    render() {
        return (
            <React.Fragment>
                <ReactEcharts
                    ref={(e) => (this.echartsReact = e)}
                    notMerge={true}
                    option={this.setOption()}
                    style={{ width: '100%', height: 'calc(100% - 10px)' }}
                />
            </React.Fragment>
        );
    }
}

export default memo(CarBar);
