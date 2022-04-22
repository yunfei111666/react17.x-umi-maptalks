import { Effect, Reducer, Subscription } from 'umi';
import WebSocketClient from 'utils/websocketClient';
import Config from '@/config/base.js';
import { isEqual } from 'lodash';
const databox = require('/public/protobuf/data_pb.js');
const world = require('/public/protobuf/world_mix_pb.js');

const full = Config.wsFull;
const wsFull = new WebSocketClient(full);

let wsDetails;

const IndexModel = {
    namespace: 'index',
    state: {
        data: {},
        dldata: {},
        config: {
            theme: localStorage.getItem('theme') || 'theme-white',
        },
        token: '',
        detail: {},
        interaction: {
            showCar: [],
            planingList: [],
            planingColor: null,
            showInfo: null,
            nowWs: null,
            isUpdate: true,
            positioningCar: null,
            trackingCar: null,
        },
        artModel: null,
        anqiaoModel: null,
        modelManager: null,
        forbiddenAreas: [],
        editingGeo: null,
    },
    effects: {
        // *showInfo({ payload }, { select, call, put }) {
        //     const stateArr = yield select((state) => state);
        //     const { nowWs } = stateArr.index.interaction;
        //     if (payload.showInfo == null && nowWs) {
        //         console.log('关闭ws');
        //         nowWs.destoryWS();
        //     }
        //     // if (payload.showInfo) {
        //     //     let details = Config.wsDetails + payload.showInfo + '/';
        //     //     wsDetails = new WebSocketClient(details);
        //     //     wsDetails.init();
        //     //     let oldData = null;
        //     //     wsDetails.onmessage = (message) => {
        //     //         let data = world.WorldMix.deserializeBinary(
        //     //             message.data,
        //     //         ).toObject();
        //     //         if (!LD.isElement(oldData, data)) {
        //     //             oldData = data;
        //     //             //console.log(data);
        //     //             put({
        //     //                 type: 'detail',
        //     //                 payload: {
        //     //                     detail: data,
        //     //                 },
        //     //             });
        //     //         }
        //     //     };
        //     // } else {
        //     //     if(wsDetails) wsDetails.destoryWS();
        //     // }
        // },
        // *nowWs({ payload }, { call, put }) {},
    },
    reducers: {
        setEditingGeo(state, { geometry }) {
            const newData = {
                ...state,
                editingGeo: geometry,
            };
            return newData;
        },
        setForbiddenAreas(state, { forbiddenAreas }) {
            const newData = {
                ...state,
                forbiddenAreas,
            };
            return newData;
        },
        updataDetail(state, { payload: { dldata } }) {
            const newData = {
                ...state,
                dldata,
            };
            return newData;
        },
        updata(state, { payload: { data } }) {
            const newData = {
                ...state,
                data,
            };
            return newData;
        },
        updateModelManager(state, { modelManager }) {
            const newData = {
                ...state,
                modelManager,
            };
            return newData;
        },
        updateArtModel(state, { artModel }) {
            const newData = {
                ...state,
                artModel,
            };
            return newData;
        },
        updateAnqiaoModel(state, { anqiaoModel }) {
            const newData = {
                ...state,
                anqiaoModel,
            };
            return newData;
        },
        changeToken(state, { token }) {
            const data = {
                ...state,
                token,
            };
            return data;
        },
        changeTheme(state, { payload: { theme } }) {
            const data = {
                ...state,
                config: {
                    theme: theme,
                },
            };
            return data;
        },
        planingColor(state, { payload: { planingColor } }) {
            const data = {
                ...state,
                interaction: {
                    ...state.interaction,
                    planingColor: planingColor,
                },
            };
            return data;
        },
        showCar(state, { payload: { showCar } }) {
            const data = {
                ...state,
                interaction: {
                    ...state.interaction,
                    showCar: showCar,
                },
            };
            return data;
        },
        detail(state, { payload: { detail, showInfo } }) {
            const data = {
                ...state,
                detail: detail,
                interaction: {
                    ...state,
                    detail: detail,
                    interaction: {
                        ...state.interaction,
                        showInfo: showInfo,
                    },
                },
            };
            return data;
        },
        showInfo(state, { payload: { showInfo, isUpdate } }) {
            const { nowWs } = state.interaction;
            if (showInfo == null && nowWs) {
                nowWs.destoryWS();
            }
            const data = {
                ...state,
                interaction: {
                    ...state.interaction,
                    showInfo: showInfo,
                    isUpdate: isUpdate,
                },
            };
            return data;
        },
        nowWs(state, { payload: { nowWs } }) {
            const data = {
                ...state,
                interaction: {
                    ...state.interaction,
                    nowWs: nowWs,
                },
            };
            return data;
        },
        positioningCar(state, { payload: { positioningCar } }) {
            const data = {
                ...state,
                interaction: {
                    ...state.interaction,
                    positioningCar: positioningCar,
                },
            };
            return data;
        },
        trackingCar(state, { payload: { trackingCar } }) {
            const data = {
                ...state,
                interaction: {
                    ...state.interaction,
                    trackingCar: trackingCar,
                },
            };
            return data;
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/TrunkMonitor' || pathname === '/TrunkDev') {
                    wsFull.init();
                    let oldData = null;
                    wsFull.onmessage = (message) => {
                        let data = databox.Data.deserializeBinary(
                            message.data,
                        ).toObject();
                        if (!isEqual(oldData, data)) {
                            oldData = data;
                            // console.log('data',data);
                            dispatch({
                                type: 'updata',
                                payload: {
                                    data: data,
                                },
                            });
                        }
                    };
                } else if (pathname.search('CarDetail') > -1) {
                    const cheId = pathname.replace('/CarDetail/', '');
                    let CarDetail = Config.wsCarDetail + cheId;
                    const wsCarDetail = new WebSocketClient(CarDetail);
                    wsCarDetail.init();
                    let oldData = null;
                    wsCarDetail.onmessage = (message) => {
                        let data = JSON.parse(message.data);
                        // let data = databox.Data.deserializeBinary(
                        //     message.data,
                        // ).toObject();

                        if (!isEqual(oldData, data)) {
                            oldData = data;
                            dispatch({
                                type: 'updataDetail',
                                payload: {
                                    dldata: data,
                                },
                            });
                        }
                    };
                } else {
                    wsFull.destoryWS();
                }
            });
        },
    },
};

export default IndexModel;
