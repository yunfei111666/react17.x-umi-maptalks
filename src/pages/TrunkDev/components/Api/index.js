/*
 * @Description: Api调试组件
 * @Project:
 * @Author: michelle
 * @Date: 2021-10-19 17:29:22
 * @LastEditors: michelle
 * @LastEditTime: 2021-12-16 20:04:58
 * @Modified By: michelle
 * @FilePath: /TrunkFace/src/pages/TrunkDev/components/Api/index.js
 */
import React, { Component } from 'react';
import style from './index.less';
import { Tabs, message, Button, Upload, Space, Modal } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Empty from '@/components/Empty';
import { setRootFilter } from 'utils/resize/';
import { getApiJson, uploadFile, submit, getImgLook } from '@/services/devApi';
import ImgView from './ImgView';
import Side from './Side';
import ModuleForm from './ModuleForm';
import FileTable from './FileTable';
// import { apiJson } from './apiJson';
const { confirm } = Modal;
const { TabPane } = Tabs;
export default class Api extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabData: {}, //tab标签数据
            tagIndex: '0', //上部tab索引
            tagRightIndex: '0', //右侧tab索引
            tableList: [], //文件列表所有数据
            fileApi: null, //文件api
            fileDelApi: null, //文件删除api
            imgModalVisble: false, //预览图片默认隐藏组件
            imgSrc: null, //文件图片地址
            propsFile: {
                name: 'file',
                accept: '.json',
                customRequest: this.customRequest,
            },
            renderColumn: [
                {
                    title: '文件名称',
                    dataIndex: 'fileName',
                    key: 'fileName',
                    align: 'left',
                    ellipsis: true,
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    key: 'operation',
                    align: 'right',
                    render: (text, record) => (
                        <Space size="middle">
                            <a onClick={() => this.onLookClick({ record })}>
                                预览
                            </a>
                            <a onClick={() => this.onDeleteClick({ record })}>
                                删除
                            </a>
                        </Space>
                    ),
                },
            ],
        };
    }

    componentDidMount() {
        this.getJsonAllData();
    }
    //预览轨迹图片
    onLookClick = (text) => {
        let values = {
            file: text.record.fileName,
        };
        getImgLook(values).then((res) => {
            if (res) {
                this.setState({
                    imgModalVisble: true,
                    imgSrc: res,
                });
            } else {
                message.info('无数据信息!');
            }
        });
    };
    // 删除选中的列表数据
    onDeleteClick = (text) => {
        confirm({
            title: '操作确认?',
            icon: <ExclamationCircleOutlined />,
            content: '是否确定要对选择数据进行删除？',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
                let values = {
                    file: text.record.fileName,
                };
                submit(values, this.state.fileDelApi)
                    .then((res) => {
                        if (res) {
                            message.success('删除成功');
                            this.getJsonAllData();
                        }
                    })
                    .catch((error) => {
                        console.error(error, 'error');
                    });
            },
            onCancel() {
                setRootFilter(false);
            },
        });
    };
    //json数据重装
    dataFormat = (data) => {
        //循环top tab类型数组，过滤数组唯一 tab 类型
        let topTableArr = [];
        let topTableObj = {};
        for (var item in data) {
            if (data[item].post) {
                let tagsName = data[item].post.tags[0];
                if (!topTableArr.includes(tagsName)) {
                    topTableArr.push(tagsName);
                }
            }
        }
        //循环right tab类型数组，组装tab对应关系为对象
        topTableArr.forEach((item, index) => {
            let rightTabArr = [];
            for (var key in data) {
                if (data[key].post) {
                    // 检测是否包含summary属性
                    const isSummaryAttr = Object.keys(data[key].post).indexOf(
                        'summary',
                    );
                    const summary = data[key].post.summary;
                    if (isSummaryAttr != -1 && item == data[key].post.tags[0]) {
                        data[key].post['api'] = key; //添加接口名称
                        rightTabArr.push(data[key].post);
                    }
                    //单独处理文件列表及删除api数据
                    if (
                        summary == '删除文件' &&
                        index == 0 &&
                        data[key].post.tags[0] == '文件处理'
                    ) {
                        let enums = data[key].post.parameters[0].enum;
                        let fileArr = [];
                        this.state.fileDelApi = key;
                        enums.forEach((v, s) => {
                            let obj = {
                                id: s,
                                fileName: v,
                            };
                            fileArr.push(obj);
                        });
                        this.state.tableList = fileArr;
                    }
                }
            }
            // 对应子组件
            topTableObj[item] = rightTabArr;
        });
        return topTableObj;
    };
    getJsonAllData = () => {
        getApiJson()
            .then((res) => {
                // const res = apiJson; //测试接口数据
                const resPaths = res.paths;
                if (!resPaths) return message.info('无数据信息!');
                let data = this.dataFormat(resPaths);
                this.setState({
                    tabData: data,
                });
            })
            .catch((err) => {});
    };
    // 初始化设置文件api地址
    setFileApi = (api) => {
        this.state.fileApi = api;
    };
    // 文件上传
    customRequest = (option) => {
        const formData = new FormData();
        formData.append('file', option.file);
        this.uploadFileFn(formData, this.state.fileApi);
    };

    uploadFileFn = (file, api) => {
        uploadFile(file, api)
            .then((res) => {
                message.success('上传成功！');
            })
            .catch((error) => {
                console.error(error, 'error');
            });
    };

    rightTabChange = (item, index) => {
        this.setState({
            tagRightIndex: index,
        });
        this.setContent(item, index);
    };
    setContent = (item, index) => {
        return <ModuleForm jsonData={item} itemKey={index} />;
    };
    //设置上部tab索引,重置右侧选择默认为第一个
    onTabChange = (index) => {
        this.setState({
            tagIndex: index,
            tagRightIndex: '0',
        });
        if (this.ChildPage) {
            this.ChildPage.setSideIndex(); //调用子组件方法，设置右侧tab索引默认为第一个
        }
    };
    changeImgStatus = (status) => {
        this.setState({
            imgModalVisble: status,
        });
    };

    render() {
        const {
            tabData,
            tableList,
            tagIndex,
            tagRightIndex,
            imgModalVisble,
            imgSrc,
        } = this.state;
        if (Object.keys(tabData).length == 0) {
            return (
                <div className={style.notData}>
                    <Empty />
                </div>
            );
        } else {
            return (
                <div className={style.popoverApiCon}>
                    {imgModalVisble && (
                        <ImgView
                            imgSrc={imgSrc}
                            visible={imgModalVisble}
                            status={this.changeImgStatus}
                        ></ImgView>
                    )}
                    <Tabs
                        defaultActiveKey={tagIndex}
                        onChange={this.onTabChange}
                    >
                        {Object.keys(tabData).map((item, index) => {
                            return (
                                <TabPane tab={item} key={index}>
                                    {/* 右侧tab大于一条显示，否则不显示，如果索引为1表示列表，不显示侧边栏 */}
                                    {tabData[item].length > 1 && index != 1 ? (
                                        <Side
                                            onRef={(c) => (this.ChildPage = c)}
                                            setContent={this.rightTabChange}
                                            list={tabData[item]}
                                        />
                                    ) : (
                                        ''
                                    )}
                                    {/* 如果索引为1，表示是列表且显示，接口需要加类型 */}
                                    {tagIndex == 1 && index == 1 ? (
                                        <div>
                                            <div className={style.filesUpload}>
                                                <Upload
                                                    {...this.state.propsFile}
                                                    onClick={this.setFileApi(
                                                        tabData[item][0].api,
                                                    )}
                                                    showUploadList={false}
                                                >
                                                    <Button
                                                        className={
                                                            style.fileStyle
                                                        }
                                                        icon={
                                                            <UploadOutlined />
                                                        }
                                                    >
                                                        文件上传
                                                    </Button>
                                                </Upload>
                                            </div>
                                            <FileTable
                                                renderColumn={
                                                    this.state.renderColumn
                                                }
                                                dataSource={tableList}
                                            ></FileTable>
                                        </div>
                                    ) : // 左侧form表单,检测点击top tab和json数据索引一致，渲染form
                                    this.state.tagIndex == index ? (
                                        <div
                                            className={`${
                                                tabData[item].length > 1
                                                    ? style.leftCon
                                                    : ''
                                            }`}
                                        >
                                            {this.setContent(
                                                tabData[item],
                                                tagRightIndex,
                                            )}
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </TabPane>
                            );
                        })}
                    </Tabs>
                </div>
            );
        }
    }
}
