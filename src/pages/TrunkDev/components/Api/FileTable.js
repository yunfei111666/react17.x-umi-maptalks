/*
 * @Author: yunfei
 * @Date: 2021-10-28 11:32:53
 * @LastEditTime: 2021-11-10 17:41:49
 * @FilePath: /TrunkFace/src/pages/TrunkDev/components/Api/FileTable.js
 * @LastAuthor: Do not edit
 * @Description: 邮件管理组件
 */
import React, { Component } from 'react';
import { Table } from 'antd';
import style from './index.less';
export default class FileTable extends Component {
    render() {
        const { renderColumn, dataSource } = this.props;
        return (
            <div className={`subview ${style.subviewMargin}`}>
                <div
                    className="auto-height-samll"
                    style={{ marginBottom: '5px' }}
                >
                    <Table
                        sortDirections={['descend', 'ascend']}
                        columns={renderColumn}
                        dataSource={dataSource}
                        // scroll={{
                        //     y: 300,
                        // }} //计算等比高度
                        rowKey={(record) => record.id}
                        bordered={false}
                        size={'small'}
                        // pagination={false}
                        pagination={{
                            showSizeChanger: false, //不展示分页器
                        }}
                    />
                </div>
            </div>
        );
    }
}
