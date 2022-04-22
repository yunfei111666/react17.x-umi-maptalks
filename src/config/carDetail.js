export const sys_columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 120,
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Cpu%',
        dataIndex: 'cpu_percent',
        width: 120,
        key: 'cpu_percent',
    },
    {
        title: 'Mem%',
        dataIndex: 'memory_percent',
        width: 120,
        key: 'memory_percent',
    },
    {
        title: 'Pid',
        dataIndex: 'pid',
        width: 120,
        key: 'pid',
    },
    {
        title: 'Cmdline',
        dataIndex: 'cmdline',
        key: 'cmdline',
    },
];

export const file_colums = [
    {
        title: 'Name',
        dataIndex: 'name',
        render: (text) => <a>{text}</a>,
    },
];

export const commandStatusMap = {
    0: '执行中',
    1: '已完毕',
    2: '错误',
    3: '无效',
};
export const drivingStatusMap = {
    0: '等待目标',
    1: '等待启动',
    2: '驶向终点',
    3: '到达终点',
    4: '错误',
    5: '无效',
};
export const lockStatusMap = {
    0: '锁车',
    1: '解锁',
    2: '无效',
};
export const gearMap = {
    0: 'P',
    1: 'R',
    2: 'N',
    3: 'D',
};
export const controlMap = {
    1: '规划成功',
    2: '规划失败',
    3: '已到达',
    4: '超时',
    5: '已停车',
};
export const nodeCommand = {
    START_ALL: 0,
    KILL_ALL: 1,
    RESTART_ALL: 2,
    START_ONE: 3,
    KILL_ONE: 4,
    RESTART_ONE: 5,
};
