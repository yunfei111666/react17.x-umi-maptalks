import { Component } from 'react';
import './index.less';

export default class TaskItem extends Component {
    handleDragStart = (e) => {
        this.props.onDragStart(this.props.id);
    };
    render() {
        let { id, title, active, onDragEnd } = this.props;
        return (
            <div
                onDragStart={this.handleDragStart}
                onDragEnd={onDragEnd}
                id={`dragItem-${id}`}
                className={'dragItem' + (active ? ' active' : '')}
                draggable="true"
            >
                {/* <header className="item-header">
                    <span className="item-header-username">{username}</span>
                    <span className="item-header-point">{point}</span>
                </header> */}
                <main className="dragItem-main">{title}</main>
            </div>
        );
    }
}
