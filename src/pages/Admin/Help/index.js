/*
 * @Author: yunfei
 * @Date: 2021-10-08 13:18:24
 * @LastEditTime: 2022-01-17 16:33:06
 * @FilePath: /TrunkFace/src/pages/Admin/Help/index.js
 * @LastAuthor: Do not edit
 * @Description:
 */

import React, { Component } from 'react';
import { connect } from 'umi';
import { Carousel, Row, Col, Card } from 'antd';
import utils from 'utils';
import style from './index.less';
class Help extends Component {
    constructor() {
        super();
        this.state = {
            indexPage: 0, //图片索引，默认首页
            explainArr: [
                '首页',
                '车辆管理',
                '地图工具',
                '设备配置',
                '历史统计',
                '邮件转发',
            ],
        };
    }
    onChange = (index) => {
        this.setState({
            indexPage: index,
        });
    };

    render() {
        const { explainArr, indexPage } = this.state;
        let message = [];
        switch (this.state.indexPage) {
            case 0: //首页
                message.push(
                    <div key={indexPage}>
                        <Row>
                            <Col span={12} className={style.leftCol}>
                                <div className={style.mesageTitle}>
                                    界面入口
                                </div>
                                <Row>
                                    <Col span={8}>
                                        <span>1、TRUNK Dev界面入口</span>
                                    </Col>
                                    <Col span={12}>
                                        <span>2、TRUNK Monitor界面入口</span>
                                    </Col>
                                </Row>
                                <div className={style.concise}>
                                    通过点击界面入口可进入相应界面
                                </div>
                            </Col>
                            <Col span={12} className={style.leftCol}>
                                <div className={style.mesageTitle}>
                                    数据看板
                                </div>
                                <Row>
                                    <Col span={5}>
                                        <span>1、运营数据</span>
                                    </Col>
                                    <Col span={5}>
                                        <span>2、车辆详情</span>
                                    </Col>
                                    <Col span={8}>
                                        <span>3、自动驾驶数据</span>
                                    </Col>
                                    <Col span={24}>
                                        <span className={style.concise}>
                                            通过看板查看相应时间段内当前港口运营数据、车辆详情、自动驾驶数据等
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>,
                );
                break;
            case 1: //车辆管理
                message.push(
                    <div key={indexPage}>
                        <Row>
                            <Col span={12} className={style.leftCol}>
                                <div className={style.mesageTitle}>
                                    车辆工具栏
                                </div>
                                <Row>
                                    <Col span={8}>
                                        <span>1、新增车辆按钮</span>
                                    </Col>
                                </Row>
                                <div className={style.concise}>
                                    通过点击新增车辆按钮，显示车辆信息编辑弹框
                                </div>
                            </Col>
                            <Col span={12} className={style.leftCol}>
                                <div className={style.mesageTitle}>
                                    车辆数据列表
                                </div>
                                <Row>
                                    <Col span={5}>
                                        <span>1、修改按钮</span>
                                    </Col>
                                    <Col span={5}>
                                        <span>2、删除按钮</span>
                                    </Col>
                                    <Col span={5}>
                                        <span>3、视频预览</span>
                                    </Col>
                                    {/* <Col span={5}>
                                        <span>4、TPG绑定</span>
                                    </Col>
                                    <Col span={24}>
                                        <span className={style.concise}>
                                            通过点击按钮，操作当前对应车辆信息数据进行修改、删除、绑定、查看视频及TPG绑定等
                                        </span>
                                    </Col> */}
                                </Row>
                            </Col>
                        </Row>
                    </div>,
                );
                break;
            case 2: //地图工具
                message.push(
                    <div key={indexPage}>
                        <Row>
                            <Col span={12} className={style.leftCol}>
                                <div className={style.mesageTitle}>
                                    地图工具栏
                                </div>
                                <Row>
                                    <Col span={6}>
                                        <span>1、上传地图按钮</span>
                                    </Col>
                                    <Col span={12}>
                                        <span>2、地图下发按钮</span>
                                    </Col>
                                </Row>
                                <div className={style.concise}>
                                    通过点击对应按钮，进行地图上传及地图下发操作
                                </div>
                            </Col>
                            <Col span={12} className={style.leftCol}>
                                <div className={style.mesageTitle}>
                                    地图看板
                                </div>
                                <Row>
                                    <Col span={6}>
                                        <span>1、左侧工具按钮</span>
                                    </Col>
                                    <Col span={12}>
                                        <span>2、地图视图</span>
                                    </Col>
                                    <Col span={24}>
                                        <span className={style.concise}>
                                            通过左侧工具按钮，点击图形选择，选择相应的绘制方式，进行地图绘制编辑
                                            <br />
                                            以及可以针对绘制后的图形进行撤销、重做、清空和调色等
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>,
                );
                break;
            case 3: //设备配置
                message.push(
                    <div key={indexPage}>
                        <Row>
                            <Col span={12} className={style.leftCol}>
                                <div className={style.mesageTitle}>
                                    设备工具栏
                                </div>
                                <Row>
                                    <Col span={8}>
                                        <span>1、新增模块按钮</span>
                                    </Col>
                                </Row>
                                <div className={style.concise}>
                                    通过点击新增模块按钮，显示设备信息编辑弹框
                                </div>
                            </Col>
                            <Col span={12} className={style.leftCol}>
                                <div className={style.mesageTitle}>
                                    设备数据列表
                                </div>
                                <Row>
                                    <Col span={5}>
                                        <span>1、修改按钮</span>
                                    </Col>
                                    <Col span={5}>
                                        <span>2、删除按钮</span>
                                    </Col>
                                    <Col span={24}>
                                        <span className={style.concise}>
                                            通过点击按钮，操作当前对应设备信息数据进行修改、删除
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>,
                );
                break;
            case 4: //历史统计
                message.push(
                    <div key={indexPage}>
                        <Row>
                            <Col span={12} className={style.leftCol}>
                                <div className={style.mesageTitle}>
                                    数据看板
                                </div>
                                <Row>
                                    <Col span={5}>
                                        <span>1、行驶里程</span>
                                    </Col>
                                    <Col span={5}>
                                        <span>2、接管频率</span>
                                    </Col>
                                    <Col span={5}>
                                        <span>3、累计箱量</span>
                                    </Col>
                                    <Col span={5}>
                                        <span>4、故障统计</span>
                                    </Col>
                                </Row>
                                <div className={style.concise}>
                                    通过看板查看相应时间段内行驶里程、接管频率、累计箱量、故障统计数据等
                                </div>
                            </Col>
                            <Col span={12} className={style.leftCol}>
                                <div className={style.mesageTitle}>
                                    工具栏及列表
                                </div>
                                <Row>
                                    <Col span={4}>
                                        <span>1、日期框</span>
                                    </Col>
                                    <Col span={4}>
                                        <span>2、车辆编号</span>
                                    </Col>
                                    <Col span={4}>
                                        <span>3、查询按钮</span>
                                    </Col>
                                    <Col span={4}>
                                        <span>4、导出按钮</span>
                                    </Col>
                                    <Col span={8}>
                                        <span>5、列表故障次数按钮</span>
                                    </Col>
                                    <Col span={24}>
                                        <span className={style.concise}>
                                            通过点击日期选择框及输入车辆编号进行数据查询
                                            <br />
                                            通过点击按钮，操作当前对应历史车辆信息数据进行查询、导出
                                            <br />
                                            点击列表数据故障次数按钮，进行故障信息操作
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>,
                );
                break;
            case 5:
                message.push(
                    <div key={indexPage}>
                        <Row>
                            <Col span={12} className={style.leftCol}>
                                <div className={style.mesageTitle}>工具栏</div>
                                <Row>
                                    <Col span={6}>
                                        <span>1、运行策略按钮</span>
                                    </Col>
                                    <Col span={6}>
                                        <span>2、收件人管理按钮</span>
                                    </Col>
                                    <Col span={6}>
                                        <span>3、数据导出按钮</span>
                                    </Col>
                                </Row>
                                <div className={style.concise}>
                                    通过点击运行策略按钮，显示设置人员信息编辑弹框
                                    <br />
                                    通过点击收件人管理按钮，显示收件人员信息编辑弹框
                                    <br />
                                    通过点击数据导出按钮，导出接收人信息数据
                                    <br />
                                </div>
                            </Col>
                            <Col span={12} className={style.leftCol}>
                                <div className={style.mesageTitle}>
                                    邮件数据列表
                                </div>
                                <Row>
                                    <Col span={5}>
                                        <span>1、附件下载</span>
                                    </Col>
                                    <Col span={24}>
                                        <span className={style.concise}>
                                            通过点击按钮，操作当前对应接收人信息附件文件下载等
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>,
                );
                break;
            default:
        }
        const { theme } = localStorage;
        return (
            <div className={`views ${style.helpView}`}>
                <Carousel afterChange={this.onChange}>
                    {theme == 'theme-black'
                        ? utils.imgAdress.bannerArrDark.map((item, index) => {
                              return (
                                  <div
                                      key={index}
                                      className={style.childrenView}
                                  >
                                      <div className={style.title}>
                                          {explainArr[index]}
                                      </div>
                                      <img className={style.imgs} src={item} />
                                      <Card className={style.shade}>
                                          {message}
                                      </Card>
                                  </div>
                              );
                          })
                        : utils.imgAdress.bannerArr.map((item, index) => {
                              return (
                                  <div
                                      key={index}
                                      className={style.childrenView}
                                  >
                                      <div className={style.title}>
                                          {explainArr[index]}
                                      </div>
                                      <img className={style.imgs} src={item} />
                                      <Card className={style.shade}>
                                          {message}
                                      </Card>
                                  </div>
                              );
                          })}
                </Carousel>
            </div>
        );
    }
}
export default connect(({ index }) => ({
    index,
}))(Help);
