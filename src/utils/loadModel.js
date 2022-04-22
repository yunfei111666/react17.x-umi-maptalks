import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { getHostInfoValue } from '@/config/hostInfoConfig';
import Config from '@/config/base.js';

/**
 * 批量加载模型，完成返回信号
 */
export class LoadModel {
    constructor(props) {
        // 加载器
        this.loader = null;
        this.isLoading = true;
        this.init(props);
    }
    init = (list) => {
        this.initLoader();
        const listLength = list.length;
        for (let i = 0; i < listLength; i++) {
            this.loadPathModel(list[i].path).then((res) => {
                this[list[i].name] = res;
            });
        }
    };
    // load
    loadPathModel = (path) => {
        return new Promise((res) => {
            this.loader.load(
                path,
                (gltf) => {
                    res(gltf.scene);
                },
                undefined,
                function (e) {
                    console.error(e);
                },
            );
        });
    };
    // loader配置
    initLoader = () => {
        this.manager = new THREE.LoadingManager();
        this.loader = new GLTFLoader(this.manager);
        // draco 解析压缩gltf
        let dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('./draco/gltf/'); // 设置public下的解码路径，注意最后面的/
        dracoLoader.setDecoderConfig({ type: 'js' });
        dracoLoader.preload();
        this.loader.setDRACOLoader(dracoLoader);
        // this.initManagerEvent({onLoad : this.initLoadedFunc});
    };
    // 阶段触发
    initManagerEvent = ({
        onStart = () => {
            return;
        },
        onLoad = () => {
            return;
        },
        onProgress = () => {
            return;
        },
    }) => {
        this.manager.onStart = onStart;
        this.manager.onLoad = onLoad;
        this.manager.onProgress = onProgress;
    };
    // 回调示例
    initLoadedFunc = () => {
        console.log('Loading complete!');
    };
    // 获取模型
    getModel = (type) => {
        if (this[type]) {
            return this[type].clone();
        } else {
            console.error(`${type}模型不存在`);
        }
    };
}
export const getModelManager = (params) => {
    const carPath = getHostInfoValue('modelPath');

    if (params === 'complex') {
        return new LoadModel([
            {
                name: 'changqiao',
                path: './glb/changqiao_draco.glb',
            },
            {
                name: 'anqiao',
                path: './glb/anqiao_draco.gltf',
                // path: './glb/anqiao.glb'
            },
            {
                name: 'suodao',
                path: './glb/suodao_draco.gltf',
            },
            {
                name: 'dianxiang',
                path: './glb/ebox_draco.gltf',
            },
            {
                name: 'dianzhuang',
                path: './glb/epile_draco.gltf',
            },
            {
                name: 'art',
                // path: './glb/art_draco.gltf',
                path: carPath,
            },
            {
                name: 'ship',
                path: './glb/ship_draco.gltf',
            },
        ]);
    } else {
        return new LoadModel([
            {
                name: 'art',
                path: carPath,
            },
        ]);
    }
};
