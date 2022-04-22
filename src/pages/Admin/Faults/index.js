/*
 * @Author: heyunfei
 * @Descripttion: 故障统计
 * @Date: 2021-09-08 18:18:37
 * @LastEditTime: 2022-02-24 18:13:02
 * @FilePath: /TrunkFace/src/pages/Admin/Faults/index.js
 */
import React, { Component } from 'react';
import { connect } from 'umi';
import {
    DatePicker,
    Space,
    Button,
    Select,
    Row,
    Col,
    Card,
    Progress,
    message,
    Tooltip,
} from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import moment from 'moment';
import {
    exportList,
    getHistoryList,
    getHistoryOverview,
    getHistoryFault,
    getCheId,
} from '@/services/admin';
import InfoModal from './InfoModal';
import FaultModal from './FaultModal';
import TableView from './TableView';
import style from './index.less';
import { setRootFilter, setFont, fixedNumber } from 'utils/resize';
const { RangePicker } = DatePicker;
class Faults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info_Visble: false,
            fault_Visble: false,
            che_id: '', //车辆编号
            carList: [],
            created_from: moment(new Date().getTime()).format('YYYY-MM-DD'), //开始日期
            created_to: moment(new Date().getTime()).format('YYYY-MM-DD'), //结束日期
            page: 1, //默认第一页
            count: 0, //总页数
            cardData: {
                mileages: 0, // 行驶里程
                takeover_rate: 0, // 接管频率
                containers: 0, // 累计箱量
                faults: 0, //故障总数
            },
            fault: {
                CHASSIS: 0, //底盘及车辆硬件故障
                HARDWARE: 0, //无人驾驶硬件故障
                SOFTWARE: 0, //无人驾驶软件故障
                PERCEPTION: 0, //驾驶指令执行错误
                UNKNOWN: 0, //未知
            },
            rowData: {}, //列表单行数据
            loading: false,
            tableList: [], //列表所有数据
            cardState: false,
            renderColumn: [
                {
                    title: '车辆编号',
                    dataIndex: 'che_id',
                    key: 'che_id',
                    width: 130,
                    render: (val, record) => (
                        <span
                            style={{ cursor: 'pointer', color: '#1890ff' }}
                            onClick={() => this.toShowInfo({ record })}
                        >
                            {val}
                        </span>
                    ),
                },
                {
                    title: '行驶里程(km)',
                    dataIndex: 'mileages',
                    key: 'mileages',
                },
                {
                    title: '循环趟数',
                    dataIndex: 'trips',
                    key: 'trips',
                },
                {
                    title: 'TEU',
                    dataIndex: 'teus',
                    key: 'teus',
                },
                {
                    title: '作业效率(teu/h)',
                    dataIndex: 'work_efficiency',
                    key: 'work_efficiency',
                },
                {
                    title: '故障次数',
                    dataIndex: 'faults',
                    key: 'faults',
                    render: (text, record) => (
                        <Button
                            className="fault-button"
                            onClick={() => this.toShowFault({ record })}
                        >
                            {record.faults}
                        </Button>
                    ),
                    width: 130,
                },
                {
                    title: '故障率',
                    dataIndex: 'fault_rate',
                    key: 'fault_rate',
                },
                {
                    title: '接管趟数',
                    dataIndex: 'take_overs',
                    key: 'take_overs',
                },
                {
                    title: '接管率',
                    dataIndex: 'take_over_rate',
                    key: 'take_over_rate',
                },
                {
                    title: '单箱能耗(kmh/teu)',
                    dataIndex: 'avg_consume_power',
                    key: 'avg_consume_power',
                },
            ],
        };
    }
    componentDidMount() {
        this.getCardData();
        this.initList();
        this.initCarId(); //获取车辆列表
    }
    initCarId = () => {
        getCheId()
            .then((data) => {
                if (data) {
                    this.setState({
                        carList: data.data,
                    });
                }
            })
            .catch((error) => {
                console.error(error, 'error');
            });
    };
    //车辆信息弹框
    toShowInfo = (text) => {
        this.setState({
            info_Visble: true,
            rowData: text.record,
        });
        setRootFilter(true);
    };
    //故障详情弹框
    toShowFault = (text) => {
        if (text.record.faults) {
            this.setState({
                fault_Visble: true,
                rowData: text.record,
            });
            setRootFilter(true);
        } else {
            message.warning('无数据信息！');
        }
    };
    // 初始化数据列表
    initList = () => {
        this.setState(
            {
                loading: true,
            },
            () => {
                getHistoryList({
                    che_id: this.state.che_id,
                    created_from: this.state.created_from,
                    created_to: this.state.created_to,
                    page: this.state.page,
                })
                    .then((response) => {
                        let res = response.results;
                        this.setState({
                            loading: false,
                            tableList: res,
                            count: response.count,
                        });
                    })
                    .catch((err) => {
                        this.setState({
                            loading: false,
                        });
                    });
            },
        );
    };

    getCardData = () => {
        getHistoryOverview({
            created_from: this.state.created_from,
            created_to: this.state.created_to,
        })
            .then((response) => {
                let res = response;
                let cardData = {
                    mileages: fixedNumber(res.mileages || 0), // 行驶里程
                    takeover_rate: fixedNumber(res.take_over_rate || 0), // 接管频率
                    containers: fixedNumber(res.containers || 0), // 累计箱量
                    faults: fixedNumber(res.faults || 0), // 故障统计
                };
                this.setState({
                    cardData: cardData,
                });
            })
            .catch((err) => {});
    };
    getFaultData = () => {
        getHistoryFault({
            created_from: this.state.created_from,
            created_to: this.state.created_to,
        })
            .then((res) => {
                if (res.infos.length > 0) {
                    let fault = {
                        CHASSIS: 0, //底盘及车辆硬件故障
                        HARDWARE: 0, //无人驾驶硬件故障
                        SOFTWARE: 0, //无人驾驶软件故障
                        PERCEPTION: 0, //驾驶指令执行错误
                        UNKNOWN: 0, //未知
                    };
                    let total = 100 / res.total;
                    res.infos.forEach((val) => {
                        switch (val.alarm_type) {
                            case '底盘及车辆硬件故障':
                                fault.CHASSIS = Math.round(total * val.count);
                                break;
                            case '无人驾驶硬件故障':
                                fault.HARDWARE = Math.round(total * val.count);
                                break;
                            case '无人驾驶软件故障':
                                fault.SOFTWARE = Math.round(total * val.count);
                                break;
                            case '驾驶指令执行错误':
                                fault.PERCEPTION = Math.round(
                                    total * val.count,
                                );
                                break;
                            case '未知':
                                fault.UNKNOWN = Math.round(total * val.count);
                                break;
                        }
                    });
                    this.setState({
                        fault: fault,
                    });
                }
            })
            .catch((err) => {});
    };
    // 模态框
    changeStatus = (status) => {
        this.setState({
            info_Visble: status,
            fault_Visble: status,
        });
        setRootFilter(status);
    };
    // 日期选择
    onChangeDate = (value, dateString) => {
        this.state.created_from = dateString[0];
        this.state.created_to = dateString[1];
        this.initList();
        this.getCardData();
        if (this.state.cardState) {
            this.getFaultData();
        }
    };
    //车辆编号
    cheChangeNum = (value) => {
        this.setState({
            che_id: value,
        });
        this.initList();
    };
    // 搜索
    onSearch = () => {
        this.initList();
    };
    //导出数据报表
    onExport = () => {
        if (this.state.tableList.length > 0) {
            exportList({
                // che_id: 'all',
                created_from: this.state.created_from,
                created_to: this.state.created_to,
            })
                .then((response) => {
                    let blobUrl = window.URL.createObjectURL(response);
                    let link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = blobUrl;
                    link.download = 'faults.xlsx';
                    link.click();
                })
                .catch((err) => {});
        } else {
            message.warning('查询结果为0条数据，不能导出！');
        }
    };
    //选择分页数
    changePage = (page) => {
        this.setState(
            {
                page: page,
            },
            () => {
                this.initList();
            },
        );
    };

    componentWillUnmount() {
        this.setState = (props) => {
            return;
        };
    }
    changeCard() {
        this.setState({});
        this.setState(
            {
                cardState: !this.state.cardState,
            },
            () => {
                if (this.state.cardState) {
                    this.getFaultData();
                }
            },
        );
    }

    render() {
        const { theme } = localStorage;
        const { fault, cardState } = this.state;
        let Content = cardState ? (
            <Card className={`${style.topCard} ${style.topCardBackground4}`}>
                <Row align="middle" className={style.faultRow}>
                    <Col span={24}>
                        <span className={style.faultTitle}>故障统计</span>
                    </Col>
                </Row>
                <Row align="middle" className={style.faultRow}>
                    <Col span={8}>
                        <span className={style.faultStatistics}>
                            底盘及车辆硬件故障
                        </span>
                    </Col>
                    <Col span={15}>
                        <Progress
                            percent={fault.CHASSIS}
                            strokeColor="#91F1AE"
                        />
                    </Col>
                </Row>
                <Row align="middle" className={style.faultRow}>
                    <Col span={8}>
                        <span className={style.faultStatistics}>
                            无人驾驶硬件故障
                        </span>
                    </Col>
                    <Col span={15}>
                        <Progress
                            percent={fault.HARDWARE}
                            strokeColor="#5793FF"
                        />
                    </Col>
                </Row>
                <Row align="middle" className={style.faultRow}>
                    <Col span={8}>
                        <span className={style.faultStatistics}>
                            无人驾驶软件故障
                        </span>
                    </Col>
                    <Col span={15}>
                        <Progress
                            percent={fault.SOFTWARE}
                            strokeColor="#FF947B"
                        />
                    </Col>
                </Row>
                <Row align="middle" className={style.faultRow}>
                    <Col span={8}>
                        <span className={style.faultStatistics}>
                            驾驶指令执行错误
                        </span>
                    </Col>
                    <Col span={15}>
                        <Progress
                            percent={fault.PERCEPTION}
                            strokeColor="#FFD762"
                        />
                    </Col>
                </Row>
                <Row align="middle" className={style.faultRow}>
                    <Col span={8}>
                        <span className={style.faultStatistics}>未知</span>
                    </Col>
                    <Col span={15}>
                        <Progress
                            percent={fault.UNKNOWN}
                            strokeColor="#A9B3C8"
                        />
                    </Col>
                </Row>
            </Card>
        ) : (
            <Card className={`${style.topCard} ${style.topCardBackground4}`}>
                <div className={style.leftIcon}>
                    <div
                        className={`iconfont icon-guzhangtongji ${style.iconFonts}`}
                    ></div>
                </div>
                <div className={style.rightTitle} style={{ right: '50%' }}>
                    <div className={style.titleText}>故障统计</div>
                    <Tooltip
                        placement="bottom"
                        title={this.state.cardData.faults}
                    >
                        <span
                            className={`${style.number} ${setFont(
                                this.state.cardData.faults,
                            )}`}
                        >
                            {this.state.cardData.faults}
                        </span>
                    </Tooltip>
                </div>
            </Card>
        );
        return (
            <div className="subview" id={style.faults}>
                <div
                    style={{
                        height: '100%',
                    }}
                >
                    {/*工具栏*/}
                    <div className="sub-tools">
                        {this.state.info_Visble && (
                            <InfoModal
                                visible={this.state.info_Visble}
                                status={this.changeStatus}
                                created_from={this.state.created_from}
                                created_to={this.state.created_to}
                                {...this.state.rowData}
                            ></InfoModal>
                        )}
                        {this.state.fault_Visble && (
                            <FaultModal
                                visible={this.state.fault_Visble}
                                status={this.changeStatus}
                                created_from={this.state.created_from}
                                created_to={this.state.created_to}
                                {...this.state.rowData}
                            ></FaultModal>
                        )}
                        <div>
                            <RangePicker
                                style={{ width: 250 }}
                                defaultValue={[
                                    moment(
                                        moment(new Date().getTime()),
                                        'YYYY-MM-DD',
                                    ),
                                    moment(
                                        moment(new Date().getTime()),
                                        'YYYY-MM-DD',
                                    ),
                                ]}
                                dropdownClassName={
                                    theme === 'theme-black'
                                        ? 'theme-black-select'
                                        : ''
                                }
                                onChange={this.onChangeDate}
                            />
                            {/* <Input
                                style={{ width: 200, marginLeft: '15px' }}
                                onChange={this.cheChangeNum}
                                placeholder="输入车辆编号"
                            /> */}
                            <Select
                                style={{ width: 200, marginLeft: '15px' }}
                                onChange={this.cheChangeNum}
                                placeholder="请选择车辆编号"
                                listHeight={200}
                                allowClear
                                dropdownClassName={
                                    theme === 'theme-black'
                                        ? 'theme-black-select'
                                        : ''
                                }
                            >
                                {this.state.carList?.map((item, i) => {
                                    return (
                                        <Option value={item} key={i}>
                                            {item}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </div>
                        <div className="sub-tools-right">
                            <Space
                                size="middle"
                                align="right"
                                direction="right"
                            >
                                <Button type="primary" onClick={this.onSearch}>
                                    查询
                                </Button>
                                <Button type="primary" onClick={this.onExport}>
                                    导出
                                </Button>
                            </Space>
                        </div>
                    </div>
                    <div
                        className={style.Icon}
                        onClick={() => {
                            this.changeCard();
                        }}
                    >
                        {cardState ? <UpOutlined /> : <DownOutlined />}
                    </div>
                    <div
                        style={{
                            height: cardState ? '25%' : '12%',
                            padding: '0 14px',
                            boxSizing: 'border-box',
                            transition: '0.5s',
                        }}
                    >
                        <Row
                            gutter={20}
                            style={{
                                height: '100%',
                                width: '100%',
                                marginLeft: '0',
                            }}
                        >
                            <Col
                                span={5}
                                // className={`gutter-row ${style.colHeight}`}
                                style={{ paddingLeft: '0' }}
                            >
                                <Card
                                    className={`${style.topCard} ${style.topCardBackground1}`}
                                >
                                    <div
                                        className={`${style.bgcBase} ${style.bgcImg1}`}
                                    ></div>
                                    <div
                                        className={`${style.bgcBase} ${style.bgcImgMuddy}`}
                                    ></div>
                                    <div
                                        className={`${style.bgcBase} ${style.bgcImgMuddy2}`}
                                    ></div>
                                    <div className={style.leftIcon}>
                                        <div
                                            className={`iconfont icon-leijilicheng ${style.iconFonts}`}
                                        ></div>
                                    </div>
                                    <div className={style.rightTitle}>
                                        <div className={style.titleText}>
                                            行驶里程
                                        </div>
                                        <Tooltip
                                            placement="bottom"
                                            title={this.state.cardData.mileages}
                                        >
                                            <span
                                                className={`${
                                                    style.number
                                                } ${setFont(
                                                    this.state.cardData
                                                        .mileages,
                                                )}`}
                                            >
                                                {this.state.cardData.mileages}
                                            </span>
                                        </Tooltip>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={5} style={{ paddingLeft: '0' }}>
                                <Card
                                    className={`${style.topCard} ${style.topCardBackground2}`}
                                >
                                    <div
                                        className={`${style.bgcBase} ${style.bgcImg2}`}
                                    ></div>
                                    <div
                                        className={`${style.bgcBase} ${style.bgcImgMuddy}`}
                                    ></div>
                                    <div
                                        className={`${style.bgcBase} ${style.bgcImgMuddy2}`}
                                    ></div>
                                    <div className={style.leftIcon}>
                                        <div
                                            className={`iconfont icon-jieguan ${style.iconFonts}`}
                                        ></div>
                                    </div>
                                    <div className={style.rightTitle}>
                                        <div className={style.titleText}>
                                            接管频率
                                        </div>
                                        <Tooltip
                                            placement="bottom"
                                            title={
                                                this.state.cardData
                                                    .takeover_rate
                                            }
                                        >
                                            <span
                                                className={`${
                                                    style.number
                                                } ${setFont(
                                                    this.state.cardData
                                                        .takeover_rate,
                                                )}`}
                                            >
                                                {
                                                    this.state.cardData
                                                        .takeover_rate
                                                }
                                            </span>
                                        </Tooltip>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={5} style={{ paddingLeft: '0' }}>
                                <Card
                                    className={`${style.topCard} ${style.topCardBackground3}`}
                                >
                                    <div
                                        className={`${style.bgcBase} ${style.bgcImg3}`}
                                    ></div>
                                    <div
                                        className={`${style.bgcBase} ${style.bgcImgMuddy}`}
                                    ></div>
                                    <div
                                        className={`${style.bgcBase} ${style.bgcImgMuddy2}`}
                                    ></div>
                                    <div className={style.leftIcon}>
                                        <div
                                            className={`iconfont icon-leijixiangliang ${style.iconFonts}`}
                                        ></div>
                                    </div>
                                    <div className={style.rightTitle}>
                                        <div className={style.titleText}>
                                            累计箱量
                                        </div>
                                        <Tooltip
                                            placement="bottom"
                                            title={
                                                this.state.cardData.containers
                                            }
                                        >
                                            <span
                                                className={`${
                                                    style.number
                                                } ${setFont(
                                                    this.state.cardData
                                                        .containers,
                                                )}`}
                                            >
                                                {this.state.cardData.containers}
                                            </span>
                                        </Tooltip>
                                    </div>
                                </Card>
                            </Col>
                            <Col
                                span={9}
                                className={`gutter-row ${style.colHeight}`}
                                style={{
                                    paddingRight: '0',
                                    paddingLeft: '0',
                                    boxShadow:
                                        '0px 2px 16px 2px rgba(182, 186, 191, 0.5)',
                                    borderRadius: '16px',
                                }}
                            >
                                {Content}
                            </Col>
                        </Row>
                    </div>
                    <div
                        className="auto-height"
                        style={{
                            height: cardState ? '64%' : '77%',
                            transition: '0.5s',
                        }}
                    >
                        <TableView
                            cardState={cardState}
                            dataSource={this.state.tableList}
                            renderColumn={this.state.renderColumn}
                            loading={this.state.loading}
                            page={this.state.page}
                            count={this.state.count}
                            onChange={this.changePage}
                        ></TableView>
                        {/* </Card> */}
                    </div>
                </div>
            </div>
        );
    }
}
// export default Faults;
export default connect(({ index }) => ({
    index,
}))(Faults);
