import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import './index.less';
import star from '../../assets/images/stars.svg';
import fourOhFour from '../../assets/images/fourOhFour.svg';
import astrodude from '../../assets/images/astrodude.png';
import { history } from 'umi';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageLoaded: false,
            fourOhFourLoaded: false,
            astrotop: '0px',
            astroright: '0px',
        };
    }
    componentDidMount() {
        this.setState({
            pageLoaded: true,
        });
    }
    onMouseMove(e) {
        this.setState({
            astrotop: e.clientY / 8 + 'px',
            astroright: e.clientX / 8 + 'px',
        });
    }
    goHome = () => {
        history.replace('/Admin');
    };
    render() {
        return (
            <div
                className="flex main-wrap justifyCenter"
                style={{ backgroundImage: `url(${star})` }}
            >
                <div className="main-container flex">
                    <CSSTransition
                        in={this.state.pageLoaded}
                        timeout={600}
                        classNames="error-text"
                        unmountOnExit
                    >
                        {(state) => (
                            <div className="error-text flex justifyCenter">
                                <h3>您暂无此页面访问权限，请联系管理员处理</h3>
                                <a onClick={this.goHome}>GO HOME</a>
                            </div>
                        )}
                    </CSSTransition>
                </div>
            </div>
        );
    }
}

export default App;
