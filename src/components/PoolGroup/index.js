import { Component } from 'react';
import './index.less';
export default class TaskCol extends Component {
    state = {
        in: false,
    };
    render() {
        let { status, children } = this.props;
        return (
            <div
                id={`col-${status}`}
                className={'col'}
                onDragEnter={this.handleDragEnter}
                onDragLeave={this.handleDragLeave}
                onDragOver={this.handleDragEnter}
                onDrop={this.handleDrop}
            >
                <header className="col-header">
                    {this.props.code[status]}
                </header>
                <main className={'col-main'}>{children}</main>
            </div>
        );
    }
    handleDragEnter = (e) => {
        e.preventDefault();
        if (this.props.canDragIn) {
            this.setState({
                in: true,
            });
        }
    };
    handleDragLeave = (e) => {
        e.preventDefault();
        if (this.props.canDragIn) {
            this.setState({
                in: false,
            });
        }
    };
    handleDrop = (e) => {
        e.preventDefault();
        this.props.dragTo(this.props.status);
        this.setState({
            in: false,
        });
    };
}
