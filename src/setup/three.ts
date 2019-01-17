import * as THREE from 'three';
global.THREE = THREE;
export default THREE;

import 'three/examples/js/controls/OrbitControls';
import 'three/examples/js/controls/FirstPersonControls';

if (!console.time) {
    console.time = () => { };
}
if (!console.timeEnd) {
    console.timeEnd = () => { };
}

console.ignoredYellowBox = [
    'THREE.WebGLRenderer',
    'THREE.WebGLProgram',
];