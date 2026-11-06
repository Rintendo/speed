import * as THREE from "three";
import tyre from "/tyre.glb";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import { HDRCubeTextureLoader } from "three/addons/loaders/HDRCubeTextureLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ThreeMFLoader } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

// setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const loader = new GLTFLoader();
const HDRIloader = new EXRLoader();
const renderer = new THREE.WebGLRenderer();
const orbitControls = new OrbitControls(camera, renderer.domElement);

let gltf;
let rim;

camera.position.set(0.7, 0.3, 0);
orbitControls.target.set(0, 0.3, 0);
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// light
// const ambientLight = new THREE.AmbientLight(0xffffff, 10);
// scene.add(ambientLight);

// SPOTLIGHT
const spotLight = new THREE.SpotLight(0xffffff, 82);
spotLight.position.set(1, 6, 0);
spotLight.castShadow = true;
scene.add(spotLight);
// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

// helpers
orbitControls.addEventListener("change", () => {
  // console.log(camera.position, orbitControls.target);
});

// const gridHelper = new THREE.GridHelper(30, 10);
// scene.add(gridHelper);
// geo

let deco_checkered_1,
  deco_checkered_2,
  deco_stripe_1,
  deco_stripe_2,
  deco_stripe_detail_1,
  deco_stripe_detail_2,
  p_zero,
  pirelli_logo,
  soft_tyre,
  corsa_tyre;

const elems = {
  deco_checkered_1: deco_checkered_1,
  deco_checkered_2: deco_checkered_2,
  deco_stripe_1: deco_stripe_1,
  deco_stripe_2: deco_stripe_2,
  deco_stripe_detail_1: deco_stripe_detail_1,
  deco_stripe_detail_2: deco_stripe_detail_2,
  p_zero: p_zero,
  corsa_tyre: corsa_tyre,
  soft_tyre: soft_tyre,
  pirelli_logo: pirelli_logo,
  rim: rim,
};

async function spawnMesh() {
  try {
    gltf = await loader.loadAsync(tyre);
    scene.add(gltf.scene);
    rim = gltf.scene.getObjectByName("Car_Rim");

    elems.deco_checkered_1 = gltf.scene.getObjectByName("deco_checkered_1");
    elems.deco_checkered_2 = gltf.scene.getObjectByName("deco_checkered_2");
    elems.deco_stripe_1 = gltf.scene.getObjectByName("deco_stripe_1");
    elems.deco_stripe_2 = gltf.scene.getObjectByName("deco_stripe_2");
    elems.p_zero = gltf.scene.getObjectByName("p_zero");
    elems.pirelli_logo = gltf.scene.getObjectByName("pirelli_logo");
    elems.soft_tyre = gltf.scene.getObjectByName("soft_tyre");
    elems.corsa_tyre = gltf.scene.getObjectByName("corsa_tyre");
    elems.alt_tyre = gltf.scene.getObjectByName("alt_tyre");

    elems.deco_stripe_detail_1 = gltf.scene.getObjectByName(
      "deco_stripe_detail_1",
    );
    elems.deco_stripe_detail_2 = gltf.scene.getObjectByName(
      "deco_stripe_detail_2",
    );

    rim.castShadow = true;
    elems.soft_tyre.visible = false;
    const base = gltf.scene.getObjectByName("floor");
    base.receiveShadow = true;
    changeTyre();
  } catch (error) {
    console.error(error);
  }
}

const buttonState = {
  soft: true,
  medium: false,
  hard: false,
  inter: false,
  wet: false,
};

let oldState;
const radioButtonify = (current) => {
  if (current) {
    buttonState[current] = true;
  }

  if (oldState) {
    buttonState[oldState] = false;
  }
  oldState = current;
};
radioButtonify("soft");

function changeTyre(selection) {
  const showSoft = (elems.corsa_tyre.visible = false);
  elems.alt_tyre.visible = false;
  elems.soft_tyre.visible = true;

  if (selection !== "wireframe") {
    elems.corsa_tyre.material.wireframe = false;
    rim.material.wireframe = false;
    elems.pirelli_logo.material.wireframe = false;
    elems.p_zero.material.wireframe = false;
  }

  switch (selection) {
    case "soft":
      showSoft;
      elems.p_zero.material.color = new THREE.Color(0xd52b1e);
      elems.deco_checkered_1.material.color = new THREE.Color(0xd52b1e);

      break;
    case "medium":
      showSoft;
      elems.p_zero.material.color = new THREE.Color(0xfed100);
      elems.deco_checkered_1.material.color = new THREE.Color(0xfed100);

      break;

    case "hard":
      showSoft;
      elems.p_zero.material.color = new THREE.Color(0xffffff);
      elems.deco_checkered_1.material.color = new THREE.Color(0xffffff);

      break;

    case "inter":
      elems.corsa_tyre.visible = true;
      elems.soft_tyre.visible = false;
      elems.alt_tyre.visible = false;
      elems.p_zero.material.color = new THREE.Color(0x00b050);
      elems.deco_checkered_1.material.color = new THREE.Color(0x00b050);

      break;

    case "wet":
      elems.corsa_tyre.visible = false;
      elems.soft_tyre.visible = false;
      elems.alt_tyre.visible = true;
      elems.p_zero.material.color = new THREE.Color(0x0066cc);
      elems.deco_checkered_1.material.color = new THREE.Color(0x0066cc);

      break;

    case "wireframe":
      elems.corsa_tyre.material.wireframe = true;
      rim.material.wireframe = true;
      elems.pirelli_logo.material.wireframe = true;
      elems.p_zero.material.wireframe = true;

      elems.corsa_tyre.visible = false;
      elems.soft_tyre.visible = true;
      elems.alt_tyre.visible = false;

      break;

    default:
      // show soft on default idk

      elems.corsa_tyre.visible = false;
      elems.soft_tyre.visible = true;
      elems.p_zero.material.color = new THREE.Color(0xd52b1e);
      elems.deco_checkered_1.material.color = new THREE.Color(0xd52b1e);

      break;
  }
}

spawnMesh();
// gui

let rimSpeed = 0;

scene.background = new THREE.Color(0xe7e7e7ff);
const gui = new GUI();
const speed = gui.addFolder("speed");
const compounds = gui.addFolder("compounds");

const speedObj = { kmh: 0 };

const speedElem = speed.add(speedObj, "kmh", 0, 360, 1).onChange((value) => {
  rimSpeed = value / 3.6 / 0.3428655;
});
speedElem.domElement.classList.add("suffix");

const obj = {
  showSoft: function () {
    changeTyre("soft");
  },
  showMedium: function () {
    changeTyre("medium");
  },
  showHard: function () {
    changeTyre("hard");
  },
  showInter: function () {
    changeTyre("inter");
  },
  showWet: function () {
    changeTyre("wet");
  },
};

const elem1 = gui.add(obj, "showSoft").name("soft tyres");
const elem2 = gui.add(obj, "showMedium").name("medium tyres");
const elem3 = gui.add(obj, "showHard").name("hard tyres");
const elem4 = gui.add(obj, "showInter").name("inter tyres");
const elem5 = gui.add(obj, "showWet").name("wet tyres");

elem1.domElement.querySelector("button").classList.add("redColor");
elem2.domElement.querySelector("button").classList.add("yellowColor");
elem3.domElement.querySelector("button").classList.add("whiteColor");
elem4.domElement.querySelector("button").classList.add("greenColor");
elem5.domElement.querySelector("button").classList.add("blueColor");

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

async function spawnHDRI() {
  new EXRLoader().load("/hdri.exr", function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    const renderTarget = pmremGenerator.fromEquirectangular(texture);
    scene.environment = renderTarget.texture;
    scene.environmentIntensity = 0.1;
  });
}
spawnHDRI();
// anim
function animate(time) {
  orbitControls.update();
  renderer.render(scene, camera);

  const timer = new THREE.Timer();
  timer.connect(document);
  timer.update(time);
  const deltaTime = timer.getDelta();

  if (gltf) {
    rim.rotation.x += rimSpeed * deltaTime * 5;
  }
}
renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
