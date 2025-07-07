import * as THREE from 'three';

import uvVertShader from './shaders/uv.vert';
import uvFragShader from './shaders/uv.frag';
import solidVertShader from './shaders/solid.vert';
import solidFragShader from './shaders/solid.frag';
import solidBiomesVertShader from './shaders/solid_biomes.vert';
import solidBiomesFragShader from './shaders/solid_biomes.frag';
import texturedBiomesVertShader from './shaders/textured_biomes.vert';
import texturedBiomesFragShader from './shaders/textured_biomes.frag';
import cloudsVertShader from './shaders/clouds.vert';
import cloudsFragShader from './shaders/clouds.frag';

import water from './assets/water.jpg'; //ignorato -> base color
import sand from './assets/sand.png';
import grass from './assets/grass.jpg';
import rock from './assets/rock.png';
import snow from './assets/snow.jpg';

import waterNormal from './assets/water_normal.jpg';
import sandNormal from './assets/sand_normal.png';
import grassNormal from './assets/grass_normal.jpg';
import rockNormal from './assets/rock_normal.png';
import snowNormal from './assets/snow_normal.jpg';

const shaderNames = [
    'uv',
    'solid',
    'wireframe',
    'solid_biomes',
    'textured_biomes',
    'textured_biomes/clouds'
] as const;

export type ShaderOption = typeof shaderNames[number]

export class MaterialManager {

    private static instance: MaterialManager | null = null;

    waterTex: THREE.Texture;
    waterNormalTex: THREE.Texture;

    sandTex: THREE.Texture;
    sandNormalTex: THREE.Texture;

    grassTex: THREE.Texture;
    grassNormalTex: THREE.Texture;

    rockTex: THREE.Texture;
    rockNormalTex: THREE.Texture;

    snowTex: THREE.Texture;
    snowNormalTex: THREE.Texture;

    uvMaterial: THREE.RawShaderMaterial;
    solidMaterial: THREE.RawShaderMaterial;
    wireframeMaterial: THREE.MeshStandardMaterial;
    solidBiomesMaterial: THREE.RawShaderMaterial;
    texturedBiomesMaterial: THREE.RawShaderMaterial;
    cloudsMaterial: THREE.RawShaderMaterial;

    private constructor() {

        // --- load textures ---

        let loader = new THREE.TextureLoader();

        this.waterTex = loader.load(water);
        this.waterTex.wrapS = THREE.RepeatWrapping;
        this.waterTex.wrapT = THREE.RepeatWrapping;

        this.waterNormalTex = loader.load(waterNormal);
        this.waterNormalTex.wrapS = THREE.RepeatWrapping;
        this.waterNormalTex.wrapT = THREE.RepeatWrapping;

        this.sandTex = loader.load(sand);
        this.sandTex.wrapS = THREE.RepeatWrapping;
        this.sandTex.wrapT = THREE.RepeatWrapping;

        this.sandNormalTex = loader.load(sandNormal);
        this.sandNormalTex.wrapS = THREE.RepeatWrapping;
        this.sandNormalTex.wrapT = THREE.RepeatWrapping;

        this.grassTex = loader.load(grass);
        this.grassTex.wrapS = THREE.RepeatWrapping;
        this.grassTex.wrapT = THREE.RepeatWrapping;

        this.grassNormalTex = loader.load(grassNormal);
        this.grassNormalTex.wrapS = THREE.RepeatWrapping;
        this.grassNormalTex.wrapT = THREE.RepeatWrapping;

        this.rockTex = loader.load(rock);
        this.rockTex.wrapS = THREE.RepeatWrapping;
        this.rockTex.wrapT = THREE.RepeatWrapping;

        this.rockNormalTex = loader.load(rockNormal);
        this.rockNormalTex.wrapS = THREE.RepeatWrapping;
        this.rockNormalTex.wrapT = THREE.RepeatWrapping;

        this.snowTex = loader.load(snow);
        this.snowTex.wrapS = THREE.RepeatWrapping;
        this.snowTex.wrapT = THREE.RepeatWrapping;

        this.snowNormalTex = loader.load(snowNormal);
        this.snowNormalTex.wrapS = THREE.RepeatWrapping;
        this.snowNormalTex.wrapT = THREE.RepeatWrapping;

        // --- create materials ---

        this.uvMaterial = new THREE.RawShaderMaterial({
            vertexShader: uvVertShader,
            fragmentShader: uvFragShader,
            glslVersion: THREE.GLSL3
        });

        this.solidMaterial = new THREE.RawShaderMaterial({
            vertexShader: solidVertShader,
            fragmentShader: solidFragShader,
            glslVersion: THREE.GLSL3,
            uniforms: {
                lightDirection: { value: new THREE.Vector3() },
                customColor: { value: new THREE.Color(0xff0000) }
            }
        });

        this.wireframeMaterial = new THREE.MeshStandardMaterial({ color: '#ffffff', wireframe: true });

        this.solidBiomesMaterial = new THREE.RawShaderMaterial({
            vertexShader: solidBiomesVertShader,
            fragmentShader: solidBiomesFragShader,
            glslVersion: THREE.GLSL3,
            uniforms: {
                lightDirection: { value: new THREE.Vector3() },
                palette: {
                    value: [
                        new THREE.Color(),
                        new THREE.Color(),
                        new THREE.Color(),
                        new THREE.Color(),
                        new THREE.Color()
                    ]
                },
                minHeight: { value: 0 },
                maxHeight: { value: 0 }
            }
        });

        this.texturedBiomesMaterial = new THREE.RawShaderMaterial({
            vertexShader: texturedBiomesVertShader,
            fragmentShader: texturedBiomesFragShader,
            glslVersion: THREE.GLSL3,
            uniforms: {
                tex0: { value: this.waterTex },
                tex1: { value: this.sandTex },
                tex2: { value: this.grassTex },
                tex3: { value: this.rockTex },
                tex4: { value: this.snowTex },
                normal0: { value: this.waterNormalTex },
                normal1: { value: this.sandNormalTex },
                normal2: { value: this.grassNormalTex },
                normal3: { value: this.rockNormalTex },
                normal4: { value: this.snowNormalTex },
                time: { value: 0 },
                minHeight: { value: 0 },
                maxHeight: { value: 0 },
                lightDirection: { value: new THREE.Vector3() },
                wind: { value: 1 }
            }
        });

        this.cloudsMaterial = new THREE.RawShaderMaterial({
            vertexShader: cloudsVertShader,
            fragmentShader: cloudsFragShader,
            glslVersion: THREE.GLSL3,
            uniforms: {
                normal0: { value: this.waterNormalTex },
                time: { value: 0 },
                lightDirection: { value: new THREE.Vector3() },
                wind: { value: 1 }
            },
            transparent: true
        });

        // --- update time uniform periodically ---

        let clock = new THREE.Clock();
        function loop(mm: MaterialManager) {
            requestAnimationFrame(() => loop(mm));
            mm.texturedBiomesMaterial.uniforms.time.value = clock.getElapsedTime();
            mm.cloudsMaterial.uniforms.time.value = clock.getElapsedTime();
        }
        loop(this);
    }

    // implements singleton
    static getInstance(): MaterialManager {
        if (MaterialManager.instance == null) {
            MaterialManager.instance = new MaterialManager();
        }
        return MaterialManager.instance;
    }

    // get a material by passing a shader option and add uniforms if necessary.
    getMaterial(shader: ShaderOption, updatedUniforms?: { [uniform: string]: THREE.IUniform<any>; }): THREE.Material {
        let material: THREE.Material;

        switch (shader) {
            case 'uv':
                material = this.uvMaterial;
                break;
            case 'solid':
                material = this.solidMaterial;
                break;
            case 'wireframe':
                material = this.wireframeMaterial;
                break;
            case 'solid_biomes':
                material = this.solidBiomesMaterial;
                break;
            case 'textured_biomes':
                material = this.texturedBiomesMaterial;
                break;
            case 'textured_biomes/clouds':
                material = this.cloudsMaterial;
                break;
            default:
                material = this.uvMaterial;
        }

        if (material instanceof THREE.RawShaderMaterial) {
            for (let k in updatedUniforms) {
                material.uniforms[k].value = updatedUniforms[k].value;
            }
        }

        return material;
    }

    // get shader names as string array.
    getShaderNames(onlyPublic: boolean = true): string[] {
        if (onlyPublic)
            return Object.values(shaderNames.slice(0, shaderNames.length - 1));
        
        return Object.values(shaderNames);
    }
}
