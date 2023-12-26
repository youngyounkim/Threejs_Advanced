import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function () {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
  });

  renderer.outputEncoding = THREE.sRGBEncoding;

  const textureLoader = new THREE.TextureLoader();
  const cubeTextureLoader = new THREE.CubeTextureLoader().setPath(
    "assets/environments/"
  );

  const environmentMap = cubeTextureLoader.load([
    "px.png",
    "nx.png",
    "py.png",
    "ny.png",
    "pz.png",
    "nz.png",
  ]);

  environmentMap.encoding = THREE.sRGBEncoding;

  const container = document.querySelector("#container");

  container.appendChild(renderer.domElement);

  const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const scene = new THREE.Scene();

  scene.background = environmentMap;
  scene.environment = environmentMap;

  const camera = new THREE.PerspectiveCamera(
    75,
    canvasSize.width / canvasSize.height,
    0.1,
    100
  );
  camera.position.set(0, 0, 3);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  const addLight = () => {
    const light = new THREE.DirectionalLight(0xffffff); // 방향이 있는 빛

    light.position.set(0.65, 2.13, 1.02);

    scene.add(light);
  };

  const createEarth1 = () => {
    const material = new THREE.MeshStandardMaterial({
      map: textureLoader.load("assets/earth_nightmap.jpg"),
      side: THREE.FrontSide,
      opacity: 0.6,
      transparent: true,
    });

    const geometry = new THREE.SphereGeometry(1.3, 30, 30);

    const mesh = new THREE.Mesh(geometry, material);

    return mesh;
  };

  const createEarth2 = () => {
    const material = new THREE.MeshStandardMaterial({
      map: textureLoader.load("assets/earth_nightmap.jpg"),
      opacity: 0.9,
      transparent: true,
      side: THREE.BackSide,
    });

    const geometry = new THREE.SphereGeometry(1.5, 30, 30);

    const mesh = new THREE.Mesh(geometry, material);

    return mesh;
  };

  const create = () => {
    const earth1 = createEarth1();
    const earth2 = createEarth2();

    scene.add(earth1, earth2);
  };

  const resize = () => {
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerHeight;

    camera.aspect = canvasSize.width / canvasSize.height;
    camera.updateProjectionMatrix();

    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  const addEvent = () => {
    window.addEventListener("resize", resize);
  };

  const draw = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(() => {
      draw();
    });
  };

  const initialize = () => {
    addLight();
    create();
    addEvent();
    resize();
    draw();
  };

  initialize();
}
