/*
 * @Description:
 * @Project: 天气温度组件
 * @Author: yunfei
 * @Date: 2021-09-09 15:39:51
 * @LastEditors: yunfei
 * @LastEditTime: 2021-09-16 11:19:13
 * @Modified By: yunfei
 * @FilePath: /TrunkFace/src/pages/TrunkMonitor/components/Weather/index.js
 */
import React, { Component } from 'react';
import style from './index.less';
import { getWeather } from 'services/monitor';

export default class Weather extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 'f9fb947d4e8257e9e4b4e67adc0390e9',
            // city: '110101',
            // city: '300000', //天津
            city: '330211', //宁波镇海区
            weatherData: {},
        };
    }

    getData = () => {
        let params = {
            key: 'f9fb947d4e8257e9e4b4e67adc0390e9',
            city: '330211', //宁波镇海区
        };
        getWeather(params).then((res) => {
            if (res && res.lives) {
                let data = res.lives[0];
                let { weatherData } = this.state;
                weatherData.weather = data.weather;
                weatherData.temperature = data.temperature;
                this.setState({
                    weatherData,
                });
            }
        });
    };

    componentDidMount() {
        this.getData();
    }

    render() {
        const { weather, temperature } = this.state.weatherData;
        return (
            <div
                className={style.weather}
                className={`(weather && temperature} ? ${style.isShow} : ${style.isHide}`}
            >
                <span className={style.details}>天气:{weather}</span>
                <span className={style.temperature}>温度: {temperature}℃</span>
            </div>
        );
    }
}
