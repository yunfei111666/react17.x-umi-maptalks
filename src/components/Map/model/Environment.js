import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { ThreeLayer } from 'maptalks.three';

let parameters = {
    elevation: 20,
    azimuth: 70,
};
let sun, water, sky, renderer, scenes;

export function addEnvironment({ basePosition, positionArr, theme }) {
    let threeLayerSky = new ThreeLayer('SkyBox', {
        forceRenderOnMoving: true,
        forceRenderOnRotating: true,
        animation: true,
    });
    threeLayerSky.prepareToDraw = (gl, scene, camera) => {
        const geometry = composeList(positionArr);
        // 水面 太阳 天空
        water = new Water(geometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load(
                './images/map/waternormals.jpg',
                function (texture) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                },
            ),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: theme === 'black' ? 0x337eb5 : 0x3fb5e6,
            distortionScale: 3.7,
            fog: scene.fog !== undefined,
            side: THREE.DoubleSide,
        });
        water.name = 'water';
        scene.add(water);
        sun = basePosition;
        sky = new Sky();
        sky.scale.setScalar(theme === 'black' ? 0 : 100000);
        const skyUniforms = sky.material.uniforms;
        skyUniforms['turbidity'].value = 10;
        skyUniforms['rayleigh'].value = 2;
        skyUniforms['mieCoefficient'].value = 0.005;
        skyUniforms['mieDirectionalG'].value = 0.8;
        sky.position.copy(basePosition);
        scene.add(sky);
        scene.rotation.x = -Math.PI / 2;
        renderer = gl;
        scenes = scene;
        updateSun();
    };
    return threeLayerSky;
}
function updateSun() {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
    const theta = THREE.MathUtils.degToRad(parameters.azimuth);
    sun.setFromSphericalCoords(1, phi, theta);
    water.material.uniforms['sunDirection'].value.copy(sun).normalize();
    sky.material.uniforms['sunPosition'].value.copy(sun);
    scenes.environment = pmremGenerator.fromScene(sky).texture;
}

function composeList(list) {
    const geometry = new THREE.BufferGeometry();
    let geometryArr = [];
    list.forEach((item) => {
        geometryArr.push(item.x, item.y, item.z);
    });
    const vertices = new Float32Array(geometryArr);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const indexsArr = getIndexsArr(list.length);
    const indexs = new Uint16Array(indexsArr);
    geometry.index = new THREE.BufferAttribute(indexs, 1);
    return geometry;
}

function getIndexsArr(length) {
    let arr = [];
    for (let i = 0; i < length - 2; i++) {
        arr.push(0, i + 1, i + 2);
    }
    return arr;
}
