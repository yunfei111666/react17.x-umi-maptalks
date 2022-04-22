/*
 * @Author: shenguang
 * @Date: 2021-09-09 09:11:31
 * @Last Modified by: shenguang
 * @Last Modified time: 2021-11-12 09:30:23
 */

import React, { Component, memo } from 'react';
import ReactEcharts from 'echarts-for-react';
import { echartsColors } from 'utils/enum.js';
import { autoSize } from 'utils/resize.js';
class PositionPie extends Component {
    constructor(props) {
        super(props);
        this.echartsReact = React.createRef();
    }
    getOption() {
        const { total, title, seriesData, tag, color, model } = this.props;
        const theme = tag ? 'monitor' : localStorage.theme || 'theme-white';
        let seriesList = [];
        if (seriesData) {
            seriesData.map((item, index) => {
                return seriesList.push({
                    type: 'pie',
                    radius: '50%',
                    select: index == 0 ? true : false,
                    value: item.value,
                    name: item.name,
                    itemStyle: {
                        color: color[index],
                    },
                    labelLine: {
                        length: 0,
                        length2: 20,
                        lineStyle: {
                            cap: 'butt',
                        },
                    },
                    label: {
                        color: echartsColors.locationPie[theme].labelFontColor,
                        formatter: '{c}',
                        fontSize: autoSize(14),
                    },
                });
            });
        }
        return {
            selectedOffset: 1000,
            left: -50,
            title: title
                ? {
                      text: [`{a|${title}  }`, `{b|${total || 0}}`].join(''),
                      textStyle: {
                          rich: {
                              a: {
                                  fontSize: autoSize(14),
                                  lineHeight: autoSize(27),
                                  color: echartsColors.carInformation[theme]
                                      .titleFontColor,
                              },
                              b: {
                                  fontSize: autoSize(30),
                                  lineHeight: autoSize(45),
                                  color: echartsColors.carInformation[theme]
                                      .titleFontColor,
                                  fontWeight: 'bold',
                              },
                          },
                      },
                      left: 10,
                  }
                : {},
            itemStyle: {
                borderWidth: autoSize(1),
                borderColor: '#fff',
            },
            tooltip: {
                textStyle: {
                    lineHeight: 0,
                    fontSize: autoSize(14),
                },
                trigger: 'item',
            },
            grid: {
                top: 30,
                containLabel: true,
            },
            legend: {
                icon: 'circle',
                top: 10,
                //bottom: 'bottom',
                itemWidth: autoSize(12),
                itemHeight: autoSize(12),
                itemGap: autoSize(15),
                padding: autoSize(10),
                textStyle: {
                    fontSize: autoSize(12),
                    color: echartsColors.locationPie[theme].legendFontColor,
                },
                itemStyle: {
                    borderWidth: 0,
                },
            },
            series: [
                {
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '65%'],
                    data: seriesList,
                },
            ],
        };
    }
    render() {
        return (
            <React.Fragment>
                <ReactEcharts
                    option={this.getOption()}
                    ref={(e) => {
                        this.echartsReact = e;
                    }}
                    style={{ width: '100%', height: 'calc(100% - 10px)' }}
                />
            </React.Fragment>
        );
    }
}

export default memo(PositionPie);
