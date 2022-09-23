import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

const gui = new dat.GUI();
const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 50,
    heightSegments: 50,
  },
};
gui.add(world.plane, "width", 1, 500).onChange(generatePlane);
gui.add(world.plane, "height", 1, 500).onChange(generatePlane);
gui.add(world.plane, "widthSegments", 1, 100).onChange(generatePlane);
gui.add(world.plane, "heightSegments", 1, 100).onChange(generatePlane);

function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );

  const positions = planeMesh.geometry.attributes.position;

  const randomValues = [];
  for (let i = 0; i < positions.count; i++) {
    positions.setX(i, positions.getX(i) + (Math.random() - 0.5) * 3);
    positions.setY(i, positions.getY(i) + (Math.random() - 0.5) * 3);
    positions.setZ(i, positions.getZ(i) + (Math.random() - 0.5) * 5);

    randomValues.push(Math.random() * Math.PI * 2);
    randomValues.push(Math.random() * Math.PI * 2);
    randomValues.push(Math.random() * Math.PI * 2);
  }

  positions.randomValues = randomValues;
  positions.originalPosition = positions.array;

  const colors = [];

  for (let i = 0; i < positions.count; i++) {
    colors.push(0, 0.19, 0.4);
  }

  planeMesh.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );
}

const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);
camera.position.z = 50;

const planeGeometry = new THREE.PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthSegments,
  world.plane.heightSegments
);
const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: true,
  vertexColors: true,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);
generatePlane();

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

const mouse = {
  x: undefined,
  y: undefined,
};

let frame = 0;
function animate() {
  requestAnimationFrame(animate);
  frame += 0.01;
  // planeMesh.rotation.x += 0.01;
  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse, camera);

  const positions = planeMesh.geometry.attributes.position;

  for (let i = 0; i < positions.count; i++) {
    positions.setX(
      i,
      positions.originalPosition[i * 3] +
        Math.cos(frame + positions.randomValues[i * 3]) * 0.01
    );

    positions.setY(
      i,
      positions.originalPosition[i * 3 + 1] +
        Math.sin(frame + positions.randomValues[i * 3 + 1]) * 0.01
    );
  }
  positions.needsUpdate = true;

  const intersects = raycaster.intersectObject(planeMesh);

  if (intersects.length > 0) {
    let colorsGeometry = planeMesh.geometry.attributes.color;

    const initialColor = { r: 0, g: 0.19, b: 0.4 };

    const hoverColor = { r: 0.1, g: 0.5, b: 1 };

    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
        // Vertice 1
        colorsGeometry.setX(intersects[0].face?.a ?? 0, hoverColor.r);
        colorsGeometry.setY(intersects[0].face?.a ?? 0, hoverColor.g);
        colorsGeometry.setZ(intersects[0].face?.a ?? 0, hoverColor.b);

        // Vertice 2
        colorsGeometry.setX(intersects[0].face?.b ?? 0, hoverColor.r);
        colorsGeometry.setY(intersects[0].face?.b ?? 0, hoverColor.g);
        colorsGeometry.setZ(intersects[0].face?.b ?? 0, hoverColor.b);

        // Vertice 3
        colorsGeometry.setX(intersects[0].face?.c ?? 0, hoverColor.r);
        colorsGeometry.setY(intersects[0].face?.c ?? 0, hoverColor.g);
        colorsGeometry.setZ(intersects[0].face?.c ?? 0, hoverColor.b);
        colorsGeometry.needsUpdate = true;
      },
    });
  }
}
animate();

addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});
