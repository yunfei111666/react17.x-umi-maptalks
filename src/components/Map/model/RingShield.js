import * as THREE from 'three';

import * as maptalks from 'maptalks';

import { BaseObject } from 'maptalks.three';

// 雷达

//default values
const OPTIONS = {
    speed: 0.001,
    radius: 600000,
    color: 'green',
    id: null,
    altitude: 250000,
    interactive: true,
};

const ringShieldFun = (color, type) => {
    const data = {
        uniforms: {
            color: {
                type: 'c',
                value: new THREE.Color(color),
            },
            time: {
                type: 'f',
                value: -0.015,
            },
            type: {
                type: 'f',
                value: type || 0,
            },
            num: {
                type: 'f',
                value: 3,
            },
        },
        vertexShaderSource: `
              varying vec2 vUv;
              void main(){
                      vUv = uv;
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }`,
        fragmentShaderSource: `
              uniform float time;
              uniform vec3 color;
              uniform float type;
              uniform float num;
              varying vec2 vUv;
              void main(){
                  float alpha = 1.0;
                  float dis = distance(vUv,vec2(0.5));//0-0.5
                  if(dis > 0.5){
                      discard;
                  }
                  if(type ==0.0){
                          float y = (sin(6.0 * num *(dis-time)) + 1.0)/2.0;
                      alpha = smoothstep(1.0,0.0,abs(y-0.5)/0.5) * (0.5 -dis) * 2.;
                  }else if(type ==1.0){
                          float step = fract(time* 4.)* 0.5;
                      if(dis<step){
                              // alpha = smoothstep(1.0,0.0,abs(step-dis)/0.15);
                          alpha =1.- abs(step-dis)/0.15;
                      }else{
                              alpha = smoothstep(1.0,0.0,abs(step-dis)/0.05);
                      }
                      alpha *= (pow((0.5 -dis)* 3.0,2.0));
                  }
                  gl_FragColor = vec4(color,alpha );
              }`,
    };
    return data;
};

/**
 * custom  component
 *
 * you can customize your own components
 * */

class RingShield extends BaseObject {
    constructor(coordinate, options, layer) {
        options = maptalks.Util.extend({}, OPTIONS, options, {
            layer,
            coordinate,
        });
        super();
        this._initOptions(options);
        const { altitude, radius, color, id } = options;
        //generate geometry
        const r = layer.distanceToVector3(radius, radius).x;
        const geometry = new THREE.RingBufferGeometry(
            0.001,
            r / 2,
            20,
            5,
            0,
            Math.PI * 2,
        );

        const ringShield = ringShieldFun(color, 0);
        const material = new THREE.ShaderMaterial({
            uniforms: ringShield.uniforms,
            defaultAttributeValues: {},
            vertexShader: ringShield.vertexShaderSource,
            fragmentShader: ringShield.fragmentShaderSource,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            fog: false,
        });

        //Initialize internal object3d
        // https://github.com/maptalks/maptalks.three/blob/1e45f5238f500225ada1deb09b8bab18c1b52cf2/src/BaseObject.js#L140
        // this._createMesh(geometry, material);
        this._createGroup();
        const mesh = new THREE.Mesh(geometry, material);
        this.getObject3d().add(mesh);
        //set object3d position
        const z = layer.distanceToVector3(altitude, altitude).x;
        const position = layer.coordinateToVector3(coordinate, z);
        this.getObject3d().position.copy(position);
        if (id) {
            this.setId(id);
        }
        // this.on('click', () => {
        //   alert(this.getId());
        // });
    }

    _animation() {
        const ring = this.getObject3d().children[0];
        const speed = this.getOptions().speed;
        ring.material.uniforms.time.value += speed;
    }
    updateSymbol(color) {
        const ringShield = ringShieldFun(color, 0);
        const material = new THREE.ShaderMaterial({
            uniforms: ringShield.uniforms,
            defaultAttributeValues: {},
            vertexShader: ringShield.vertexShaderSource,
            fragmentShader: ringShield.fragmentShaderSource,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            fog: false,
        });
        this.getObject3d().material = material;
    }
}

export default RingShield;
