/*
 * @Author: shenguang
 * @Date: 2021-09-15 09:30:14
 * @Last Modified by: shenguang
 * @Last Modified time: 2021-09-24 15:25:27
 */
import React, { Component } from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    message,
    Switch,
    DatePicker,
    Upload,
    Button,
    InputNumber,
} from 'antd';
import utils from 'utils/index';
import { connect } from 'umi';
import moment from 'moment';
import style from './index.less';
const { Option } = Select;
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { OverList, QuestionList } from '@/config/operation';
import { UpLoadImg, updateOperation, DeleteImg } from 'services/operation';
import { cloneDeep } from 'lodash';
const { Dragger } = Upload;

class operationDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formType: props.formType,
            confirmLoading: false,
            isOver: props.updateData.is_task_over, //是否接管
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            fileList: props.updateData.image,
        };
        this.state.formRef = React.createRef();
    }
    // 组件销毁时取消所有更改状态事件
    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        };
    };
    saveFormData = () => {
        const { formType } = this.state;
        this.setState({
            confirmLoading: true,
        });
        this.state.formRef.current
            .validateFields()
            .then((value) => {
                value.task_over_time = value.task_over_time
                    ? moment(value.task_over_time).format('YYYY-MM-DD HH:mm:ss')
                    : undefined;
                value.image = value.image
                    ? this.state.fileList
                    : this.props.updateData.image;
                value.question_type = value.question_type
                    ? value.question_type
                    : this.props.updateData.question_type;
                if (value.attachment) {
                    let fileList = _.cloneDeep(value.attachment.fileList);
                    const list = fileList.map((file) => {
                        return {
                            url: file.url ? file.url : file.response.data,
                            name: file.name,
                            rename: file.rename
                                ? file.rename
                                : file.response.extend.rename,
                        };
                    });

                    value.attachment = list;
                } else {
                    value.attachment = this.props.updateData.attachment;
                }
                if (formType === 'update') {
                    updateOperation(this.props.updateData.id, value)
                        .then((res) => {
                            this.setState({
                                confirmLoading: false,
                            });
                            if (res) {
                                message.success('修改成功');
                                this.props.initData();
                            }
                        })
                        .catch((error) => {
                            this.setState({
                                confirmLoading: false,
                            });
                        });
                }
            })
            .catch(() => {
                this.setState({
                    confirmLoading: false,
                });
            });
    };
    //是否接管
    changeSwitch = (checked) => {
        console.log(`switch to ${checked}`);
        this.setState({
            isOver: checked,
        });
    };
    handleChange = (info) => {
        let fileList = [...info.fileList];
        fileList = fileList.map((file) => {
            if (file.response) {
                file.url = file.response.data;
                file.rename = file.response.extend.rename;
            }
            return (file = {
                url: file.url,
                name: file.name,
                rename: file.rename,
            });
        });
        this.setState({ fileList });
    };
    //删除图片
    handleRemove = (file) => {
        const rename = file.rename ? file.rename : file.response.extend.rename;
        DeleteImg({ file_name: rename }).then((data) => {
            if (data.code == 1) {
                message.success('删除成功！');
            } else {
                message.error('删除失败！');
            }
        });
    };
    render() {
        const { theme } = localStorage;
        const { isOver, fileList } = this.state;
        const {
            car_number, //车号
            bag_name, //bug包名
            record_time, //事件时间
            description, //问题现象
            is_task_over, //是否接管
            task_over_way, //接管方式
            task_over_time, //接管时间
            task_over_time_length, //接管时长
            question_type, //问题类别
            question_reason, //问题原因
            image, //图片
            attachment, //附件
        } = this.props.updateData || {};
        const isdisabled = this.state.formType === 'show' ? true : false;

        const children = [];
        for (let i = 0; i < QuestionList.length; i++) {
            children.push(
                <Option key={i} value={QuestionList[i]}>
                    {QuestionList[i]}
                </Option>,
            );
        }

        const uploadButton = (
            <div>
                <Button icon={<UploadOutlined />}>Upload</Button>
            </div>
        );

        const props = {
            maxCount: '2',
            name: 'file',
            multiple: true,
            action: UpLoadImg,
            onChange(info) {
                const { status } = info.file;
                if (status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    message.success(
                        `${info.file.name} file uploaded successfully.`,
                    );
                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
            onPreview(file) {
                console.log(file);
                const url = file.url ? file.url : file.response.data;
                window.open(url);
            },
            onRemove(file) {
                const rename = file.rename
                    ? file.rename
                    : file.response.extend.rename;
                DeleteImg({ file_name: rename }).then((data) => {
                    if (data.code == 1) {
                        message.success('删除成功！');
                    } else {
                        message.error('删除失败！');
                    }
                });
            },
            beforeUpload(file) {
                const isLt1G = file.size / 1024 / 1024 / 1024 < 1;
                if (!isLt1G) {
                    message.error('file must smaller than 1G!');
                }
                return isLt1G;
            },
        };

        return (
            <Modal
                width={700}
                height={200}
                className={style.module}
                wrapClassName={
                    theme === 'theme-black' ? 'theme-black-modal' : ''
                }
                title={this.state.formType === 'show' ? '记录信息' : '修改记录'}
                visible={true}
                bodyStyle={{
                    overflow: 'auto',
                }}
                onCancel={() => {
                    this.props.changeUpdateVeiwState(false);
                }}
                footer={
                    this.state.formType === 'show'
                        ? [
                              <Button
                                  key="back"
                                  onClick={() => {
                                      this.props.changeUpdateVeiwState(false);
                                  }}
                              >
                                  取消
                              </Button>,
                          ]
                        : [
                              <Button
                                  key="back"
                                  onClick={() => {
                                      this.props.changeUpdateVeiwState(false);
                                  }}
                              >
                                  取消
                              </Button>,
                              <Button
                                  key="submit"
                                  type="primary"
                                  loading={this.state.confirmLoading}
                                  onClick={this.saveFormData}
                              >
                                  确定
                              </Button>,
                          ]
                }
            >
                <Form
                    ref={this.state.formRef}
                    name="basic"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Form.Item label="车辆编号" name="car_number">
                        {car_number}
                    </Form.Item>
                    <Form.Item label="数据包名称" name="bag_name">
                        {bag_name}
                    </Form.Item>
                    <Form.Item label="事件时间" name="record_time">
                        {record_time}
                    </Form.Item>
                    <Form.Item label="问题现象" name="description">
                        <Input.TextArea
                            disabled={isdisabled}
                            defaultValue={description}
                        />
                    </Form.Item>
                    <Form.Item label="是否接管" name="is_task_over">
                        <Switch
                            disabled={isdisabled}
                            defaultChecked={is_task_over}
                            onChange={this.changeSwitch}
                        />
                    </Form.Item>
                    {isOver ? (
                        <Form.Item label="接管方式" name="task_over_way">
                            <Select
                                style={{ width: 200 }}
                                disabled={isdisabled}
                                onChange={this.changeSelect}
                                placeholder={isdisabled ? '' : 'Please select'}
                                defaultValue={
                                    task_over_way != 0 ? task_over_way : null
                                }
                                dropdownClassName={
                                    theme === 'theme-black'
                                        ? 'theme-black-select'
                                        : ''
                                }
                            >
                                {OverList.map((item, i) => {
                                    return (
                                        <Option value={i + 1} key={i}>
                                            {item}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    ) : (
                        <></>
                    )}
                    {isOver ? (
                        <Form.Item label="接管时间" name="task_over_time">
                            <DatePicker
                                disabled={isdisabled}
                                style={{ width: 200 }}
                                showTime={{
                                    defaultValue: moment(
                                        '00:00:00',
                                        'HH:mm:ss',
                                    ),
                                }}
                                defaultValue={
                                    task_over_time != ''
                                        ? moment(
                                              task_over_time,
                                              'YYYY-MM-DD HH:mm:ss',
                                          )
                                        : null
                                }
                            />
                        </Form.Item>
                    ) : (
                        <></>
                    )}
                    {isOver ? (
                        <Form.Item
                            label="接管时长"
                            name="task_over_time_length"
                        >
                            <InputNumber
                                style={{ width: 200 }}
                                min={0}
                                disabled={isdisabled}
                                defaultValue={task_over_time_length}
                                placeholder={isdisabled ? '' : '接管总时长'}
                                formatter={(value) =>
                                    value > 0 ? `${value}  min` : null
                                }
                            />
                        </Form.Item>
                    ) : (
                        <></>
                    )}
                    <Form.Item label="问题类别" name="question_type">
                        <Select
                            dropdownClassName={
                                theme === 'theme-black'
                                    ? 'theme-black-select'
                                    : ''
                            }
                            disabled={isdisabled}
                            mode="multiple"
                            placeholder={isdisabled ? '' : 'Please select'}
                            defaultValue={question_type}
                        >
                            {children}
                        </Select>
                    </Form.Item>
                    <Form.Item label="问题原因" name="question_reason">
                        <Input.TextArea
                            disabled={isdisabled}
                            defaultValue={question_reason}
                        />
                    </Form.Item>
                    <Form.Item
                        label={'图片' + fileList.length + '/2'}
                        name="image"
                    >
                        <Upload
                            accept=".gif,.png,.jpg"
                            action={UpLoadImg}
                            disabled={isdisabled}
                            listType="picture"
                            onChange={this.handleChange}
                            onRemove={this.handleRemove}
                            defaultFileList={[...image]}
                        >
                            {fileList.length >= 2 || isdisabled
                                ? null
                                : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Form.Item label="附件" name="attachment">
                        <Dragger
                            {...props}
                            style={{ width: 200 }}
                            disabled={isdisabled}
                            defaultFileList={[...attachment]}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag file to this area to upload
                            </p>
                            <p className="ant-upload-hint">
                                附件大小不可超过1G!最多上传两个!
                            </p>
                        </Dragger>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}
export default connect(({ index }) => ({
    index,
}))(operationDetail);
