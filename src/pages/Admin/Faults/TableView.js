/*
 * @Author: heyunfei
 * @Descripttion: table配置
 * @Date: 2021-09-09 17:59:39
 * @LastEditTime: 2022-02-23 13:26:39
 * @FilePath: /TrunkFace/src/pages/Admin/Faults/TableView.js
 */
import React, { Component } from 'react';

import { Table } from 'antd';

export default class TableView extends Component {
    render() {
        const {
            renderColumn,
            tableHeight,
            dataSource,
            loading,
            page,
            count,
            onChange,
            cardState,
        } = this.props;
        return (
            <Table
                className={'sub-container'}
                style={{ width: '100%', height: '100%' }}
                scroll={{ y: cardState ? 350 : '' }}
                columns={renderColumn}
                dataSource={dataSource}
                loading={loading}
                rowKey={(record) => record.che_id}
                bordered={false}
                size={'small'}
                pagination={{
                    // 分页
                    showQuickJumper: true, //开启跳转第几页
                    showSizeChanger: false, //是否开启pageSize切换
                    pageSize: 14, //每页条数
                    current: page, //当前页数
                    total: count, //数据总数
                    onChange: onChange, //页码改变的回调，参数是改变后的页码及每页条数
                }}
            />
        );
    }
}
