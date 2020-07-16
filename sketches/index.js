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


const easeInQuart = t => t*t*t*t;

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
  scene.position.y = 1;

  // Setup a mesh with geometry + material
  let group = new THREE.Group();
  scene.add(group);

  let number = 12;
  let rows = 10;
  let animate = [];
  let random = Array(4)
    .fill()
    .map((a) => Array(number));

  for (let i = 0; i < number; i++) {
    for (let j = 0; j < 4; j++) {
      random[j][i] = Math.random() < 0.5 ? 0 : 1;
    }
  }

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < number; i++) {
      const mesh = getBrick(i, number, j % 2, random[j % 4][i]);
      const duplicate = getBrick(i, number, j % 2, random[j % 4][i]);

      mesh.position.setY(-j);
      duplicate.position.setY(-j);

      group.add(mesh);
      group.add(duplicate);

      duplicate.visible = false;

      animate.push({
        y: -j,
        row: j,
        mesh: mesh,
        duplicate: duplicate,
        offset: j/4 + Math.random()/4
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
      // playhead = 1 - playhead;
      group.position.y = -playhead * 4;

      animate.forEach((m) => {
        let p = playhead + m.offset;
        // m.mesh.position.setY(m.y + playhead * 2);

        if (m.row < 4) {
          let p = playhead + m.offset;
          m.mesh.position.setY(m.y + p * 10);
          if (p > 1) {
            p = easeInQuart(p-1);
            m.mesh.position.setY(m.y + (1-p) * 10 + playhead * 4);
            m.duplicate.visible = true;
          } else {
            p = easeInQuart(p);
            m.mesh.position.setY(m.y + (1-p) * 10);
            m.duplicate.visible = false;
          }
        } else {
          m.duplicate.visible = false;
        }
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
