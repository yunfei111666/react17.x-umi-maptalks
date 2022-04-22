/*
 * @Description:
 * @Project: 禁行区域模块
 * @Author: kxy
 * @Date: 2022-02-9 17:18:28
 * @LastEditors: kxy
 * @Modified By: kxy
 * @FilePath: /TrunkFace/src/pages/TrunkDev/components/Stop/index.js
 */

import React, { Component } from 'react';
import style from './index.less';
import { Table, Space, Input, Modal } from 'antd';
import { connect } from 'umi';
import location from '@/assets/images/dev/location2.svg';
import deleteArea from '@/assets/images/dev/shanchu.svg';
import { deleteForbidden } from 'services/admin';
import eventBus from '@/utils/eventBus.js';
import { isEmpty } from 'lodash';

const { Search } = Input;
class ForbiddenList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '名称',
                    dataIndex: 'name',
                    width: 60,
                    align: 'center',
                    ellipsis: true,
                },
                {
                    title: '中心点坐标',
                    dataIndex: 'center_point',
                    width: 200,
                    align: 'center',
                    ellipsis: true,
                    rowClassName: (record, index) => {},
                    render: (center, record) => (
                        <span>
                            {center.x},{center.y}
                        </span>
                    ),
                },
                {
                    title: '长',
                    dataIndex: 'length',
                    width: 60,
                    align: 'center',
                    ellipsis: true,
                },
                {
                    title: '宽',
                    dataIndex: 'width',
                    width: 60,
                    align: 'center',
                    ellipsis: true,
                },
                {
                    title: '封闭原因',
                    dataIndex: 'reason',
                    width: 100,
                    align: 'center',
                    ellipsis: true,
                },
                {
                    title: '',
                    align: 'center',
                    width: 60,
                    ellipsis: true,
                    render: (text, record, index) => (
                        <Space>
                            <a
                                onClick={() => {
                                    this.handleLocation(text, record, index);
                                }}
                            >
                                <img src={location} className={style.trace} />
                            </a>
                            <a
                                onClick={() => {
                                    this.handleDelete(text, record, index);
                                }}
                            >
                                <img src={deleteArea} className={style.trace} />
                            </a>
                        </Space>
                    ),
                },
            ],
            title: '',
            visible: false,
            confirmLoading: false,
            activeId: '',
            dataSource: [],
            value: '',
        };
    }

    /**
     * 搜索
     * @param {*} e
     */
    onSearch = (e) => {
        this.setState({
            value: e.target.value,
            dataSource: [],
        });
    };

    /**
     * 定位
     * @param {*} text
     * @param {*} record
     * @param {*} index
     */
    handleLocation = (text, record, index) => {
        const forbiddenAreaLayer = this.props.devMap.getLayer('forbiddenArea');
        this.props.drawTools.enable();
        const activeGeo = forbiddenAreaLayer.getGeometryById(record.id);
        console.log(record);
        this.props.devMap.animateTo(
            {
                center: [record.center_point.x, record.center_point.y],
                zoom: 10,
            },
            {
                duration: 300,
            },
        );
        eventBus.emit('editForbidden', activeGeo);
    };
    handleDelete(text, record, index) {
        this.setState({
            visible: true,
            activeId: record.id,
            title: `您确定要删除${record.name}吗？`,
        });
    }
    handleCancel() {
        this.setState({
            visible: false,
        });
    }
    async handleOk() {
        this.setState({
            confirmLoading: true,
        });
        await deleteForbidden({ id: this.state.activeId });
        this.setState({
            confirmLoading: false,
            visible: false,
        });
        eventBus.emit('reloadForbiddenAreas');
    }
    render() {
        const { columns, visible, title, confirmLoading, dataSource, value } =
            this.state;
        const { forbiddenAreas } = this.props.index;
        const { theme } = localStorage;
        // const list = isEmpty(dataSource) ? forbiddenAreas : dataSource;
        const list = value
            ? forbiddenAreas.filter((f) => f.name.indexOf(value) > -1)
            : forbiddenAreas;
        return (
            <div className={style.popoverCarCon}>
                <div className={style.search}>
                    <Search
                        ref={(input) => (this.input = input)}
                        placeholder="请输入禁行区域名称"
                        onChange={this.onSearch}
                        enterButton
                        id="antdInput"
                    />
                </div>
                <div className={style.table}>
                    <Table
                        rowKey={(record) => record.id}
                        columns={columns}
                        dataSource={list}
                        pagination={false}
                        scroll={{ y: '100%' }}
                    />
                </div>
                <Modal
                    wrapClassName={`${
                        theme == 'theme-black' ? 'theme-black-modal' : ''
                    } faults-modal`}
                    title="提示"
                    visible={visible}
                    onOk={() => this.handleOk()}
                    confirmLoading={confirmLoading}
                    onCancel={() => this.handleCancel()}
                >
                    <p className={style.title}>{title}</p>
                </Modal>
            </div>
        );
    }
    componentDidMount() {
        const forbiddenAreas = this.props.index.forbiddenAreas;
        // this.setState({
        //     dataSource: forbiddenAreas
        // })
    }
}

export default connect(({ index }) => ({
    index,
}))(ForbiddenList);
