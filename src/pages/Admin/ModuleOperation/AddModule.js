/*
 * @Author: yunfei
 * @Date: 2021-09-15 09:30:14
 * @Last Modified by: yunfei
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
import {
    UpLoadImg,
    addOperation,
    DeleteImg,
    Downloadbag,
} from 'services/operation';
import { getBugList, downLoad } from 'services/carDetail';
import { cloneDeep } from 'lodash';
const { Dragger } = Upload;

class operationDetail extends Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.md5 = '';
        this.state = {
            confirmLoading: false,
            isOver: false, //是否接管
            fileData: [], //bug列表
            fileList: [], //图片列表
            time: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
            res: '',
            formRef: React.createRef(),
        };
    }
    // 组件销毁时取消所有更改状态事件
    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        };
    };
    saveFormData = () => {
        this.setState({
            confirmLoading: true,
        });
        this.state.formRef.current
            .validateFields()
            .then((value) => {
                value.image = value.image ? this.state.fileList : undefined;
                // value.record_time = value.record_time
                //     ? value.record_time
                //     : this.state.time;
                value.record_time = value.record_time
                    ? moment(value.record_time).format('YYYY-MM-DD HH:mm:ss')
                    : moment(this.state.time).format('YYYY-MM-DD HH:mm:ss');
                value.task_over_time = value.task_over_time
                    ? moment(value.task_over_time).format('YYYY-MM-DD HH:mm:ss')
                    : undefined;

                if (value.attachment) {
                    let fileList = _.cloneDeep(value.attachment.fileList);
                    const list = fileList.map((file) => {
                        return {
                            url: file.response.data,
                            name: file.name,
                            name: file.response.extend.rename,
                        };
                    });
                    value.attachment = list;
                }
                let names = _.cloneDeep(value.bag_name);
                value.bag_name = value.bag_name ? value.bag_name[0] : undefined;
                addOperation(value)
                    .then((res) => {
                        if (res.code == 1) {
                            message.success('添加成功！');
                            if (value.bag_name) {
                                this.downLoad({
                                    car_no: value.car_number,
                                    names: names,
                                    file_type: 1,
                                });
                            } else {
                                this.props.initData();
                                this.props.changAddVeiwState(false);
                            }
                        } else {
                            message.error('添加失败！');
                            this.setState({
                                confirmLoading: false,
                            });
                            this.props.changAddVeiwState(false);
                        }
                    })
                    .catch((error) => {
                        this.setState({
                            confirmLoading: false,
                        });
                    });
            })
            .catch(() => {
                this.setState({
                    confirmLoading: false,
                });
            });
    };
    downLoad(body) {
        if (this.timer) clearInterval(this.timer);
        let num = 0;
        this.compressFile(body);
        this.timer = setInterval(() => {
            num++;
            body.file_type = 2;
            body.md5_file = this.md5;
            this.compressFile(body);
        }, 3000);
    }
    compressFile(body) {
        downLoad(body)
            .then((res) => {
                if (res) {
                    if (res.extend) {
                        this.md5 = res.extend.md5;
                        if (res.extend.flag && res.data) {
                            clearInterval(this.timer);
                            window.location.href = Downloadbag + res.data;
                            this.props.initData();
                            this.props.changAddVeiwState(false);
                            this.setState({
                                confirmLoading: false,
                                res: '',
                            });
                        } else {
                            if (res.data) {
                                this.setState({
                                    res: res.data,
                                });
                            }
                        }
                    }

                    // var elink = document.createElement('a');
                    // elink.download = 'bag.tar.gz';
                    // elink.style.display = 'none';
                    // var blob = new Blob([res]);
                    // elink.href = URL.createObjectURL(blob);
                    // document.body.appendChild(elink);
                    // elink.click();
                    // document.body.removeChild(elink);
                    // this.props.initData();
                    // this.props.changAddVeiwState(false);
                }
            })
            .catch((error) => {
                console.error(error, 'error');
            });
    }

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
    //删除图片,文件
    handleRemove = (file) => {
        let fileName = '';
        if (file) {
            fileName = file.response.extend.rename;
        } else {
            if (this.state.res) {
                fileName = this.state.res;
            }
        }
        if (fileName) {
            DeleteImg({ file_name: fileName }).then((data) => {
                if (data.code == 1) {
                    if (file) {
                        message.success('删除成功！');
                    } else {
                        message.success('已取消！');
                        this.setState({
                            res: '',
                        });
                    }
                } else {
                    message.error('删除失败！');
                }
            });
        }
    };
    //获取bug列表
    getBugList(cheId) {
        getBugList({ car_no: cheId })
            .then((res) => {
                const data = res.data;
                this.setState({
                    fileData: data,
                });
                this.state.formRef.current.setFieldsValue({ bag_name: [] });
                this.changeSelectBag([]);
            })
            .catch((error) => {
                console.error(error, 'error');
            });
    }
    changeSelectCar = (value) => {
        this.getBugList(value);
    };
    changeSelectBag = (value) => {
        if (value.length) {
            const bagName = value[0];
            const recordTime = (bagName || '').split('_')[1].slice(-19);
            const a = recordTime.slice(0, 10);
            const b = recordTime.slice(-8).replaceAll('-', ':');
            const times = a + ' ' + b;
            this.state.formRef.current.setFieldsValue({
                record_time: moment(times),
            });
        } else {
            this.state.formRef.current.setFieldsValue({
                record_time: moment(this.state.time),
            });
        }
    };

    render() {
        const { theme } = localStorage;
        const { isOver, fileData, fileList, time } = this.state;
        const { carList } = this.props;

        const children = [],
            bagchildren = [];
        for (let i = 0; i < QuestionList.length; i++) {
            children.push(
                <Option key={i} value={QuestionList[i]}>
                    {QuestionList[i]}
                </Option>,
            );
        }
        for (let i = 0; i < fileData.length; i++) {
            bagchildren.push(
                <Option key={i} value={fileData[i]}>
                    {fileData[i]}
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
                window.open(file.response.data);
            },
            onRemove(file) {
                DeleteImg({ file_name: file.response.extend.rename }).then(
                    (data) => {
                        if (data.code == 1) {
                            message.success('删除成功！');
                        } else {
                            message.error('删除失败！');
                        }
                    },
                );
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
                title="添加记录"
                visible={true}
                bodyStyle={{
                    overflow: 'auto',
                }}
                onCancel={() => {
                    this.props.changAddVeiwState(false);
                    if (this.timer) clearInterval(this.timer);
                    this.handleRemove();
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            this.props.changAddVeiwState(false);
                            if (this.timer) clearInterval(this.timer);
                            this.handleRemove();
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
                ]}
            >
                <Form
                    ref={this.state.formRef}
                    name="basic"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Form.Item
                        label="车辆编号"
                        name="car_number"
                        rules={[{ required: true, message: 'Please select!' }]}
                    >
                        <Select
                            style={{ width: 200 }}
                            onChange={this.changeSelectCar}
                            placeholder="请选择车辆编号"
                            dropdownClassName={
                                theme === 'theme-black'
                                    ? 'theme-black-select'
                                    : ''
                            }
                        >
                            {carList.map((item, i) => {
                                return (
                                    <Option value={item} key={i}>
                                        {item}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label="数据包名称" name="bag_name">
                        <Select
                            mode="multiple"
                            placeholder="Please select"
                            onChange={(e) => {
                                this.changeSelectBag(e);
                            }}
                            dropdownClassName={
                                theme === 'theme-black'
                                    ? 'theme-black-select'
                                    : ''
                            }
                        >
                            {bagchildren}
                        </Select>
                    </Form.Item>
                    <Form.Item label="事件时间" name="record_time">
                        <DatePicker
                            allowClear={false}
                            dropdownClassName={
                                theme === 'theme-black'
                                    ? 'theme-black-select'
                                    : ''
                            }
                            style={{ width: 200 }}
                            showTime={{
                                defaultValue: moment('00:00:00', 'HH:mm:ss'),
                            }}
                            defaultValue={moment(time, 'YYYY-MM-DD HH:mm:ss')}
                        />
                    </Form.Item>
                    <Form.Item
                        label="问题现象"
                        name="description"
                        rules={[{ required: true, message: '请描述问题现象!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item label="是否接管" name="is_task_over">
                        <Switch onChange={this.changeSwitch} />
                    </Form.Item>
                    {isOver ? (
                        <Form.Item label="接管方式" name="task_over_way">
                            <Select
                                style={{ width: 200 }}
                                placeholder="Please select"
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
                                dropdownClassName=
                                {theme === 'theme-black'
                                    ? 'theme-black-select'
                                    : ''}
                            </Select>
                        </Form.Item>
                    ) : (
                        <></>
                    )}
                    {isOver ? (
                        <Form.Item label="接管时间" name="task_over_time">
                            <DatePicker
                                dropdownClassName={
                                    theme === 'theme-black'
                                        ? 'theme-black-select'
                                        : ''
                                }
                                style={{ width: 200 }}
                                showTime={{
                                    defaultValue: moment(
                                        '00:00:00',
                                        'HH:mm:ss',
                                    ),
                                }}
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
                                placeholder="接管总时长"
                                formatter={(value) =>
                                    value > 0 ? `${value} min` : null
                                }
                            />
                        </Form.Item>
                    ) : (
                        <></>
                    )}
                    <Form.Item label="问题类别" name="question_type">
                        <Select
                            mode="multiple"
                            placeholder="Please select"
                            dropdownClassName={
                                theme === 'theme-black'
                                    ? 'theme-black-select'
                                    : ''
                            }
                        >
                            {children}
                        </Select>
                    </Form.Item>
                    <Form.Item label="问题原因" name="question_reason">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        label={'图片' + fileList.length + '/2'}
                        name="image"
                    >
                        <Upload
                            accept=".gif,.png,.jpg"
                            action={UpLoadImg}
                            listType="picture"
                            onChange={this.handleChange}
                            onRemove={this.handleRemove}
                        >
                            {fileList.length >= 2 ? null : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Form.Item label="附件" name="attachment">
                        <Dragger {...props} style={{ width: 200 }}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag file to this area to upload
                            </p>
                            <p className="ant-upload-hint">
                                附件大小不可超过1G!
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
