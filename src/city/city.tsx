import { GraphicsView } from 'expo-graphics';
import ExpoTHREE, { CubeTexture, THREE } from 'expo-three';
import './OrbitControls';
import React, { Component } from 'react';
import './teapot-buffer-geometry';
import { withTouch } from '../touch/with-touche';

const modelObj = require('../../assets/sirus_city.obj');
const modelMtl = require('../../assets/sirus_city.mtl');
const objFileName = 'sirus_city.obj';
const mtlFileName = 'sirus_city.mtl';

class CityThree extends Component {
  scene: any;
  renderer: any;
  camera: any;
  renderLoop: any;
  controls;

  onContextCreate = async ({ gl, scale: pixelRatio, width, height }) => {
    this.renderer = new ExpoTHREE.Renderer({
      gl,
      pixelRatio,
      width,
      height,
    });

    var cameraControls;
    var effectController;
    var teapotSize = 400;
    var ambientLight, light;
    var tess = 15; // force initialization
    var bBottom;
    var bLid;
    var bBody;
    var bFitLid;
    var bNonBlinn;
    var shading = 'reflective';
    var wireMaterial, flatMaterial, gouraudMaterial, phongMaterial, texturedMaterial, reflectiveMaterial;
    var teapot, textureCube;
    var diffuseColor = new THREE.Color();
    var specularColor = new THREE.Color();

    effectController = {
      shininess: 40.0,
      ka: 0.17,
      kd: 0.51,
      ks: 0.2,
      metallic: true,
      hue: 0.121,
      saturation: 0.73,
      lightness: 0.66,
      lhue: 0.04,
      lsaturation: 0.01, // non-zero so that fractions will be shown
      llightness: 1.0,
      // bizarrely, if you initialize these with negative numbers, the sliders
      // will not show any decimal places.
      lx: 0.32,
      ly: 0.39,
      lz: 0.7,
      newTess: 15,
      bottom: true,
      lid: true,
      body: true,
      fitLid: false,
      nonblinn: false,
      newShading: 'reflective',
    };

    // allocate these just once
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 80000);
    this.camera.position.set(-100, 100, 500);
    // LIGHTS
    ambientLight = new THREE.AmbientLight(0x333333); // 0.2
    light = new THREE.DirectionalLight(0xffffff, 1.0);
    // direction is set in GUI
    // RENDERER
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    // EVENTS
    // CONTROLS
    // cameraControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    // cameraControls.addEventListener('change', this.render);
    this.controls = new THREE.OrbitControls(this.camera);
    // TEXTURE MAP

    // REFLECTION MAP
    // var path = 'textures/cube/skybox/';
    // var urls = [path + 'px.jpg', path + 'nx.jpg', path + 'py.jpg', path + 'ny.jpg', path + 'pz.jpg', path + 'nz.jpg'];
    // textureCube = new THREE.CubeTextureLoader().load(urls);

    const skybox = {
      nx: require('../../assets/textures/cube/skybox/nx.jpg'),
      ny: require('../../assets/textures/cube/skybox/ny.jpg'),
      nz: require('../../assets/textures/cube/skybox/nz.jpg'),
      px: require('../../assets/textures/cube/skybox/px.jpg'),
      py: require('../../assets/textures/cube/skybox/py.jpg'),
      pz: require('../../assets/textures/cube/skybox/pz.jpg'),
    };
    textureCube = new CubeTexture();
    await textureCube.loadAsync({ assetForDirection: direction => skybox[direction], directions: undefined });

    const mesh = await ExpoTHREE.loadObjAsync({
      asset: modelObj,
      mtlAsset: modelMtl,
      onAssetRequested: {
        'vo1.jpg': require('../../assets/Maps/vo1.jpg'),
        'sx1.jpg': require('../../assets/Maps/sx1.jpg'),
        'stc1.jpg': require('../../assets/Maps/stc1.jpg'),
        'sl1.jpg': require('../../assets/Maps/sl1.jpg'),
        'scq1.jpg': require('../../assets/Maps/scq1.jpg'),
        'olg1b.jpg': require('../../assets/Maps/olg1b.jpg'),
        'lesopilka01.jpg': require('../../assets/Maps/lesopilka01.jpg'),
        'grass22.jpg': require('../../assets/Maps/grass22.jpg'),
        'gak2b.jpg': require('../../assets/Maps/gak2b.jpg'),
        'gak2.jpg': require('../../assets/Maps/gak2.jpg'),
        'gak1b.jpg': require('../../assets/Maps/gak1b.jpg'),
        'g1b.jpg': require('../../assets/Maps/g1b.jpg'),
        'fma1_03.jpg': require('../../assets/Maps/fma1_03.jpg'),
        'fma1_03_02_01_01.jpg': require('../../assets/Maps/fma1_03_02_01_01.jpg'),
        'flatro9.jpg': require('../../assets/Maps/flatro9.jpg'),
        'flatro5.jpg': require('../../assets/Maps/flatro5.jpg'),
        'fac_291.jpg': require('../../assets/Maps/fac_291.jpg'),
        'fac_280.jpg': require('../../assets/Maps/fac_280.jpg'),
        'fac_250.jpg': require('../../assets/Maps/fac_250.jpg'),
        'fac_240.jpg': require('../../assets/Maps/fac_240.jpg'),
        'fac_231.jpg': require('../../assets/Maps/fac_231.jpg'),
        'dvb1.jpg': require('../../assets/Maps/dvb1.jpg'),
        'dfg1c.jpg': require('../../assets/Maps/dfg1c.jpg'),
        'dfg1c_01.jpg': require('../../assets/Maps/dfg1c_01.jpg'),
        'dcv1.jpg': require('../../assets/Maps/dcv1.jpg'),
        'cga1.jpg': require('../../assets/Maps/cga1.jpg'),
        'c2b_03_01.jpg': require('../../assets/Maps/c2b_03_01.jpg'),
        'axb1b.jpg': require('../../assets/Maps/axb1b.jpg'),
        '003disgudsi1.jpg': require('../../assets/Maps/003disgudsi1.jpg'),
        '1ab2.jpg': require('../../assets/Maps/1ab2.jpg'),

      }
    });

    mesh.traverse(async child => {
      if (child instanceof THREE.Mesh) {
        const tempGeo = new THREE.Geometry().fromBufferGeometry(child.geometry);
        tempGeo.mergeVertices();
        tempGeo.computeVertexNormals();
        tempGeo.computeFaceNormals();
        child.geometry = new THREE.BufferGeometry().fromGeometry(tempGeo);
        child.material.side = THREE.FrontSide;
      }
    });

    ExpoTHREE.utils.scaleLongestSideToSize(mesh, 5);
    ExpoTHREE.utils.alignMesh(mesh, { y: 1 });


    // MATERIALS
    var materialColor = new THREE.Color();
    materialColor.setRGB(1.0, 1.0, 1.0);
    wireMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    flatMaterial = new THREE.MeshPhongMaterial({
      color: materialColor,
      specular: 0x000000,
      flatShading: true,
      side: THREE.DoubleSide,
    });
    gouraudMaterial = new THREE.MeshLambertMaterial({ color: materialColor, side: THREE.DoubleSide });
    phongMaterial = new THREE.MeshPhongMaterial({ color: materialColor, side: THREE.DoubleSide });
    // texturedMaterial = new THREE.MeshPhongMaterial( { color: materialColor, map: textureMap, side: THREE.DoubleSide } );
    reflectiveMaterial = new THREE.MeshPhongMaterial({ color: materialColor, envMap: textureCube, side: THREE.DoubleSide });
    // scene itself
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x446688);
    this.scene.add(ambientLight);
    this.scene.add(light);

    /////////////////////////////////////////////////

    if (teapot !== undefined) {
      teapot.geometry.dispose();
      this.scene.remove(teapot);
    }
    var teapotGeometry = new THREE.TeapotBufferGeometry(
      teapotSize,
      tess,
      effectController.bottom,
      effectController.lid,
      effectController.body,
      effectController.fitLid,
      !effectController.nonblinn,
    );
    teapot = new THREE.Mesh(
      teapotGeometry,
      // shading === 'wireframe'
      //   ? wireMaterial
      //   : shading === 'flat'
      //   ? flatMaterial
      //   : shading === 'smooth'
      //   ? gouraudMaterial
      //   : shading === 'glossy'
      //   ? phongMaterial
      //   : shading === 'textured'
      //   ? texturedMaterial
      //   : reflectiveMaterial,
      // reflectiveMaterial,
      reflectiveMaterial,
    ); // if no match, pick Phong
    // this.scene.add(teapot);
    ExpoTHREE.utils.scaleLongestSideToSize(mesh, 5);
    ExpoTHREE.utils.alignMesh(mesh, { y: 1 });
    this.scene.add(mesh);
    this.scene.background = textureCube;

    /////////////////////////////////////////////////

    this.renderLoop = () => {
      phongMaterial.shininess = effectController.shininess;
      // texturedMaterial.shininess = effectController.shininess;
      diffuseColor.setHSL(effectController.hue, effectController.saturation, effectController.lightness);
      if (effectController.metallic) {
        // make colors match to give a more metallic look
        specularColor.copy(diffuseColor);
      } else {
        // more of a plastic look
        specularColor.setRGB(1, 1, 1);
      }
      diffuseColor.multiplyScalar(effectController.kd);
      flatMaterial.color.copy(diffuseColor);
      gouraudMaterial.color.copy(diffuseColor);
      phongMaterial.color.copy(diffuseColor);
      // texturedMaterial.color.copy(diffuseColor);
      specularColor.multiplyScalar(effectController.ks);
      phongMaterial.specular.copy(specularColor);
      // texturedMaterial.specular.copy(specularColor);
      // Ambient's actually controlled by the light for this demo
      ambientLight.color.setHSL(
        effectController.hue,
        effectController.saturation,
        effectController.lightness * effectController.ka,
      );
      light.position.set(effectController.lx, effectController.ly, effectController.lz);
      light.color.setHSL(effectController.lhue, effectController.lsaturation, effectController.llightness);
      // skybox is rendered separately, so that it is always behind the teapot.
      if (shading === 'reflective') {
        this.scene.background = textureCube;
      } else {
        this.scene.background = null;
      }
    };
  };

  render() {
    return (
      <GraphicsView
        style={{ flex: 1 }}
        onContextCreate={this.onContextCreate}
        onRender={this.onRender}
        onResize={this.onResize}
      />
    );
  }

  onResize = ({ x, y, scale, width, height }) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  onRender = () => {
    this.renderLoop();
    this.renderer.render(this.scene, this.camera);
  };
}

export const City = withTouch(CityThree);
