import React, { Component } from 'react';
import TaskCol from '../../../components/PoolGroup';
import TaskItem from '../../../components/PoolItem';
import './index.less';
import { getCarPools, updateCarPools } from 'services/admin';

export default class App extends Component {
    state = {
        tasks: null,
        activeId: null,
        statusMap: null,
    };
    render() {
        let { tasks, activeId, statusMap } = this.state;
        let { onDragStart, onDragEnd, cancelSelect } = this;
        return (
            <div className="task-wrapper">
                {statusMap &&
                    tasks &&
                    Object.keys(statusMap).map((status) => (
                        <TaskCol
                            code={statusMap}
                            status={status}
                            key={status}
                            dragTo={this.dragTo}
                            canDragIn={
                                activeId !== null &&
                                tasks.filter((t) => t.id === activeId)[0]
                                    .statusCode !== status
                            }
                        >
                            {tasks
                                .filter((t) => t.statusCode === status)
                                .map((t) => (
                                    <TaskItem
                                        key={t.id}
                                        active={t.id === activeId}
                                        id={t.id}
                                        title={t.id}
                                        onDragStart={onDragStart}
                                        onDragEnd={cancelSelect}
                                    />
                                ))}
                        </TaskCol>
                    ))}
            </div>
        );
    }
    componentDidMount() {
        this.getData();
    }
    getData = () => {
        getCarPools().then((res) => {
            if (res) {
                const statusMap = {};
                const tasks = [];
                // 获取车辆池类型字典,重构车辆列表
                res.forEach((item) => {
                    statusMap[item.name] = item.desc;
                    item.che_ids.forEach((id) => {
                        tasks.push({
                            id,
                            statusCode: item.name,
                        });
                    });
                });
                this.setState({
                    statusMap,
                    tasks,
                });
            }
        });
    };
    /**
     * 传入被拖拽任务项的 id
     */
    onDragStart = (id) => {
        this.setState({
            activeId: id,
        });
    };

    dragTo = (status) => {
        let { tasks, activeId } = this.state;
        let task = tasks.filter((t) => t.id === activeId)[0];
        const from = task.statusCode;
        if (task.statusCode !== status) {
            task.statusCode = status;
            this.setState({
                tasks: tasks,
            });
        }
        console.error('task', tasks);
        this.cancelSelect(task.id, from, status);
    };

    cancelSelect = (id, from, to) => {
        const params = {
            src: from,
            dst: to,
            value: id,
        };
        updateCarPools(params).then((res) => {
            this.setState({
                activeId: null,
            });
            this.getData();
        });
    };
}
