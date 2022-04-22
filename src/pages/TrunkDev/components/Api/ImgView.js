/*
 * @Author: yunfei
 * @Date: 2021-11-03 11:12:46
 * @LastEditTime: 2021-11-10 17:22:11
 * @FilePath: /TrunkFace/src/pages/TrunkDev/components/Api/ImgView.js
 * @LastAuthor: Do not edit
 * @Description:
 */
import React, { Component } from 'react';
import { Modal, Image } from 'antd';
export default class ImgView extends Component {
    onCancel = () => {
        this.props.status(false);
    };
    render() {
        const { visible, imgSrc } = this.props;
        const { theme } = localStorage;
        return (
            <>
                <Modal
                    wrapClassName={`${
                        theme == 'theme-black' ? 'theme-black-modal' : ''
                    } faults-modal`}
                    title="轨迹预览"
                    style={{ top: '50px' }}
                    width={700}
                    visible={visible}
                    footer={null}
                    onCancel={this.onCancel}
                >
                    <Image
                        style={{ padding: '10px' }}
                        preview={false} //预览参数
                        src={`data:image/png;base64,` + imgSrc}
                    />
                </Modal>
            </>
        );
    }
}
