/*
 * @Description:
 * @Project: 折线柱状混合组件
 * @Author: michelle
 * @Date: 2021-09-13 17:03:00
 * @LastEditors: michelle
 * @LastEditTime: 2021-12-08 17:44:04
 * @Modified By: michelle
 * @FilePath: /TrunkFace/src/components/ReactEchats/TaskBar.js
 */
import React, { Component, memo } from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import { autoSize, getWidth } from 'utils/resize.js';
import { echartsColors } from 'utils/enum.js';
class TaskBar extends Component {
    constructor(props) {
        super(props);
        this.echartsReact = React.createRef();
    }
    /**
     *
     * @returns 返回options所需数据
     */
    setOption() {
        const {
            title,
            titleLeft,
            titleTop,
            legendRight,
            fontSize,
            gradualBarColor,
            gradualLineColor,
            xData,
            barData,
            lineData,
            averageValue, //平均作业效率
            tag,
            model,
        } = this.props;
        const theme = tag ? 'monitor' : model;
        return {
            title: {
                text: title || '周作业量和作业效率',
                textStyle: {
                    fontSize: autoSize(fontSize),
                    color: echartsColors.taskBar[theme].titleFontColor,
                    fontWeight: 400,
                },
                left: titleLeft || 5,
                top: getWidth() == 4096 ? 20 : titleTop,
            },
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    lineHeight: 0,
                    fontSize: autoSize(14),
                },
                formatter: (data) => {
                    // 点击柱状图图标时不展示提示信息，否则数组数据减少，取值会报错
                    if (data.length < 2) {
                        return '';
                    }
                    return (
                        '<div><div style=margin-bottom:3px;>' +
                        data[0].axisValue +
                        '</div><div><span class="circle" style=background:rgb(174,32,243)></span><span>TEU：' +
                        data[0].data +
                        '</span></div><div><span class="circle" style=background:rgb(60,225,222)></span><span>作业效率：' +
                        data[1].data +
                        '</span></div><div><span class="circle" style=background:rgb(45,179,240)></span><span>平均作业效率：' +
                        averageValue +
                        '</span></div></div>'
                    );
                },
            },
            legend: {
                data: [
                    {
                        name: 'TEU',
                        icon: 'rect',
                    },
                    {
                        name: '效率',
                    },
                ],
                right: legendRight || 10,
                top: getWidth() == 4096 ? 20 : 10,
                itemHeight: 12,
                itemWidth: 12,
                textStyle: {
                    color: echartsColors.taskBar[theme].legendFontColor,
                    fontSize: autoSize(12),
                },
            },
            grid: {
                left: '8%',
                right: '8%',
                bottom: '3%',
                top: getWidth() < 1920 ? '30%' : autoSize(65),
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                data: xData,
                name: ['\n\n(日)'].join(''),
                nameLocation: 'end',
                nameTextStyle: {
                    fontSize: autoSize(12),
                },
                axisLine: {
                    lineStyle: {
                        color: echartsColors.taskBar[theme].axisLineColor,
                    },
                },
                axisTick: {
                    show: false,
                },
                axisPointer: {
                    type: 'shadow',
                },
                axisLabel: {
                    showMaxLabel: true,
                    fontSize: autoSize(14),
                },
            },
            yAxis: [
                {
                    type: 'value',
                    name: '(TEU)',
                    nameTextStyle: {
                        color: echartsColors.taskBar[theme].axisLineColor,
                        fontSize: autoSize(12),
                        align: 'left',
                    },
                    nameGap: 10,
                    //interval: 3,
                    splitLine: {
                        show: false,
                    },
                    axisLabel: {
                        color: echartsColors.taskBar[theme].axisLineColor,
                        fontSize: autoSize(14),
                    },
                },
                {
                    type: 'value',
                    name: '(TEU/h)',
                    nameGap: 10,
                    interval: 500,
                    nameTextStyle: {
                        color: echartsColors.taskBar[theme].axisLineColor,
                        fontSize: autoSize(12),
                        align: 'center',
                    },
                    axisLabel: {
                        show: true,
                        formatter: '{value}',
                        color: echartsColors.taskBar[theme].axisLabelFontColor,
                        fontSize: autoSize(14),
                    },
                },
            ],
            series: [
                {
                    name: 'TEU',
                    type: 'bar',
                    yAxisIndex: 1,
                    data: barData,
                    barWidth: '50%',
                    itemStyle: {
                        borderRadius: [10, 10, 0, 0],
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: gradualBarColor[0] || '#4E96FF',
                            },
                            {
                                offset: 1,
                                color: gradualBarColor[1] || '#93C9FF',
                            },
                        ]),
                    },
                    // markLine: {
                    //     lineStyle: {
                    //         width: 0.5,
                    //     },
                    //     label: {
                    //         show: false,
                    //     },
                    //     data: [
                    //         {
                    //             type: 'average',
                    //             name: '平均值',
                    //         },
                    //     ],
                    // },
                },
                {
                    name: '效率',
                    type: 'line',
                    data: lineData,
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: gradualLineColor[0] || '#FFED8A',
                            },
                            {
                                offset: 1,
                                color: gradualLineColor[1] || '#FFAC2D',
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
                    ref={(e) => (this.echartsReact = e)}
                    notMerge={true}
                    option={this.setOption()}
                    style={{ width: '100%', height: 'calc(100% - 10px)' }}
                />
            </React.Fragment>
        );
    }
}

export default memo(TaskBar);
