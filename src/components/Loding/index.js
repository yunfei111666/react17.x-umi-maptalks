import React, { Component } from 'react';
import './index.less';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingStyle: this.props.loadingStyle || {},
        };
    }
    render() {
        return (
            // 四个圆点加载动画
            <div className="loading-box" style={this.state.loadingStyle}>
                <div className="loading2">
                    <div className="loading2-item1"></div>
                    <div className="loading2-item2"></div>
                    <div className="loading2-item3"></div>
                    <div className="loading2-item4"></div>
                </div>
            </div>
        );
    }
}

export default index;
