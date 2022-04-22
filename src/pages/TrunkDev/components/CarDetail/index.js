import React, { Component } from 'react';
import { connect } from 'umi';
import style from './index.less';
import DetailModal from './DetailModal.js';
import MiniMap from '../MiniMap';
import Video from '../Video';
import { Layout, Row, Col, Button, Switch } from 'antd';
const { Header, Content } = Layout;
import { getBugList } from 'services/carDetail';
import WebSocketClient from 'utils/websocketClient';
import Config from '@/config/base.js';
import Access from '@/components/Access';
import { isEqual } from 'lodash';
const world = require('/public/protobuf/world_mix_pb.js');
class CarDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: false, //弹框开关
            pop_num: 0,
            cheId: this.props.match.params.id,
            vdState: false, //视频开关
        };
    }
    //获取bug列表
    getBugList() {
        const { fileData, cheId } = this.state;
        getBugList({ car_no: cheId })
            .then((res) => {
                const data = res.data;
                const newData = [];
                if (data.length) {
                    for (const key in data) {
                        newData.push({
                            key: data[key],
                            name: data[key],
                        });
                    }
                }
                this.setState({
                    fileData: newData,
                });
            })
            .catch((error) => {
                console.error(error, 'error');
            });
    }
    goModal = (num) => {
        if (num == '4') {
            this.getBugList();
        }
        this.setState({
            pop_num: num,
        });
        this.setModal({
            flag: true,
        });
    };
    setModal = (val) => {
        if (val.hasOwnProperty('flag')) {
            this.setState({
                flag: val.flag,
            });
        }
    };
    SwitchChange = (e) => {
        this.setState({
            vdState: e,
        });
    };

    render() {
        const { dldata } = this.props.index;
        const { cheId } = this.state;
        let timer = dldata.updated_at;
        if (timer) {
            let d = new Date(timer * 1000);
            timer = d.toLocaleString('ja-jp', {
                timeZone: 'Asia/Shanghai',
            });
        }
        let data = {
            cheId: cheId,
        };
        return (
            <div className={style.detailBox}>
                <Layout>
                    <Header>
                        <Row justify="space-between" align="middle">
                            <Col span={16}>
                                <span className={style.title}>MONITOR</span>
                                <span className={style.headmsg}>
                                    {cheId}{' '}
                                    {Object.keys(dldata).length > 0
                                        ? '已连接'
                                        : '已关闭'}{' '}
                                    最后更新时间：{timer}
                                </span>
                            </Col>
                            <Access accessKey="TrunkDev-CarDetail-pop">
                                <Col span={8} className={style.right}>
                                    <Button
                                        onClick={() => this.goModal('4')}
                                        title="录包"
                                    >
                                        <i className="iconfont icon-lubao"></i>
                                    </Button>
                                    <Button
                                        onClick={() => this.goModal('1')}
                                        title="节点监控"
                                    >
                                        <i className="iconfont icon-jiediankongzhi"></i>
                                    </Button>
                                    <Button
                                        onClick={() => this.goModal('2')}
                                        title="版本信息"
                                    >
                                        <i className="iconfont icon-banbenxinxi"></i>
                                    </Button>
                                    <Button
                                        onClick={() => this.goModal('3')}
                                        title="系统监控"
                                    >
                                        <i className="iconfont icon-xitongjiankong"></i>
                                    </Button>
                                    {this.state.flag && (
                                        <DetailModal
                                            {...this.state}
                                            setModal={this.setModal}
                                        />
                                    )}
                                </Col>
                            </Access>
                        </Row>
                    </Header>
                    <Content>
                        <div className={style.shadow}>
                            <div className={style.vdflag}>
                                <span>视频</span>
                                <Switch
                                    checked={this.state.vdState}
                                    onChange={(e) => {
                                        this.SwitchChange(e);
                                    }}
                                />
                            </div>
                            <div className={style.leftbox}>
                                <MiniMap
                                    data={data}
                                    vdState={this.state.vdState}
                                />
                            </div>
                            <div
                                className={style.rightbox}
                                ref="dom"
                                style={{
                                    width: this.state.vdState ? '18%' : '0%',
                                    transition: '0.5s',
                                }}
                            >
                                {this.state.vdState ? (
                                    <Video cheId={cheId} />
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </Content>
                </Layout>
            </div>
        );
    }
}
export default connect(({ index }) => ({
    index,
}))(CarDetail);
