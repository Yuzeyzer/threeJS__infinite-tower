// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

import { getBrick } from './getBrick';

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

const canvasSketch = require('canvas-sketch');

const settings = {
  duration: 3,
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  attributes: { antialias: true },
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context,
  });

  // WebGL background color
  renderer.setClearColor('#000', 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 6, 15);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();
  scene.position.y = -9;

  // Setup a mesh with geometry + material
  let number = 12;
  let rows = 10;
  let animate = [];

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < number; i++) {
      const mesh = getBrick(i, number, j % 2);
      mesh.position.setY(j);
      scene.add(mesh);

      animate.push({
        y: j,
        mesh: mesh,
        offset: Math.random(),
      });
    }
  }

  scene.add(new THREE.AmbientLight('#ffffff'));

  const light = new THREE.DirectionalLight('#ffffff', 1.5, 15.5);
  light.position.set(4, 2, 4);
  scene.add(light);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time, playhead }) {
      animate.forEach((m) => {
        m.mesh.position.setY(m.y + playhead * 2);
      });
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
