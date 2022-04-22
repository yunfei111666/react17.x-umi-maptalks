/*
 * @Author: heyunfei
 * @Descripttion:
 * @Date: 2021-09-09 16:45:01
 * @LastEditTime: 2021-09-23 15:00:51
 * @FilePath: /TrunkFace/src/pages/Admin/Vehicles/DeviceModal.js
 */
import React, { Component } from 'react';
import { Modal, Form, Input, Button } from 'antd';
export default class DeviceModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            deviceName: '',
        };
    }
    onCancel = () => {
        this.props.status(false);
    };

    render() {
        const { visible } = this.props;
        const { theme } = localStorage;
        return (
            <span>
                <Modal
                    wrapClassName={
                        theme == 'theme-black' ? 'theme-black-modal' : ''
                    }
                    title="视频预览"
                    visible={visible}
                    footer={null}
                    onCancel={this.onCancel}
                >
                    <iframe src="" width="100%" height="100%"></iframe>
                </Modal>
            </span>
        );
    }
}
