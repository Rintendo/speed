import * as THREE from "three";
import tyre from "/tyre.glb";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import { HDRCubeTextureLoader } from "three/addons/loaders/HDRCubeTextureLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ThreeMFLoader } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

// data
const data = {
  soft: [
    "No heating up required, max grip on first lap",
    "Chemically designed to “melt” into track, giving you more grip & allowing you to take corners faster",
    "Least durable tyre made for short stints and fast qualifying laps. However, this makes it prone to degradation & “graining”",
  ],
  medium: [
    "Needs 1 to 2 prep laps to reach optimal temperature window",
    "Provides 85%-90% of a soft tyre's grip, costing the driver 0.5s to 0.7s on avg in lap time",
    "less of a melting effect than on the soft compound, more resistant to heat",
  ],
  hard: [
    "Longest warmup time, 2-3 prep laps required to get it into the optimal thermal range, longest of all compounds",
    "Slowest cornering speed of all, with the lack of grip making you lose around 0.5s to 0.8s compared to the mediums.",
    "Highest longevity of the range, used strategically for longer stints.",
  ],
  inter: [
    "Designed for wet conditions, the 'intermediate' phase between having standing water on track and dry conditions",
    "Uses outward facing groves to clear out water at 30L per second at top speed to prevent aquaplaning",
    "Overheats easily with no water to cool it down. Needs to come off in dry conditions.",
  ],
  wet: [
    "Made exclusively for heavy rain. Also referred to as x-wet. ",
    "Made of extra-soft material that can heat up in standing water, features a distinct tread pattern that clears around 85L water per second at top speed",
    "Unusable in conditions dryer than standing water, as the profile will fall apart, leaving you with a rapidly degrading, hot tyre and no grip",
  ],
};

const spans = document.querySelectorAll(
  ".text1 span, .text2 span, .text3 span",
);

const manager = new THREE.LoadingManager();
manager.onLoad = () => {
  speedElem.domElement.classList.remove("suffix");
  document
    .querySelectorAll(".lil-children")
    .forEach((el) => (el.style.display = "block"));

  const spans = document
    .querySelectorAll(".text1, .text2, .text3")
    .forEach((e) => {
      e.style.display = "block";
    });
  document.querySelector(".load").style.display = "none";
  document.querySelector(".rpm").style.display = "block";
};

// setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const loader = new GLTFLoader(manager);
const HDRIloader = new EXRLoader();
const renderer = new THREE.WebGLRenderer();
const orbitControls = new OrbitControls(camera, renderer.domElement);

let gltf;
let rim;

camera.position.set(0.7, 0.6, -0.3);
orbitControls.target.set(0, 0.3, 0);
camera.position.set(0.7, 0.6, -0.3);
orbitControls.target.set(0, 0.3, 0);

// lock camera on x axis
const offset = camera.position.clone().sub(orbitControls.target);
const polarAngle = Math.acos(offset.y / offset.length());

orbitControls.minPolarAngle = polarAngle;
orbitControls.maxPolarAngle = polarAngle;

orbitControls.minDistance = 0.65;
orbitControls.maxDistance = 2;

orbitControls.minPolarAngle = polarAngle;
orbitControls.maxPolarAngle = polarAngle;

renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// light
// const ambientLight = new THREE.AmbientLight(0xffffff, 10);
// scene.add(ambientLight);

// SPOTLIGHT
const spotLight = new THREE.SpotLight(0xffffff, 200);
spotLight.position.set(1, 10, 0);
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

function pasteData(type) {
  spans.forEach((span, i) => {
    // console.log(data[type]);
    span.innerHTML = data[type][i];
  });
}

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
      // pasteData("soft");
      break;
    case "medium":
      showSoft;
      elems.p_zero.material.color = new THREE.Color(0xfed100);
      elems.deco_checkered_1.material.color = new THREE.Color(0xfed100);
      pasteData("medium");

      break;

    case "hard":
      showSoft;
      elems.p_zero.material.color = new THREE.Color(0xffffff);
      elems.deco_checkered_1.material.color = new THREE.Color(0xffffff);
      pasteData("hgard");

      break;

    case "inter":
      elems.corsa_tyre.visible = true;
      elems.soft_tyre.visible = false;
      elems.alt_tyre.visible = false;
      elems.p_zero.material.color = new THREE.Color(0x00b050);
      elems.deco_checkered_1.material.color = new THREE.Color(0x00b050);
      pasteData("inter");

      break;

    case "wet":
      elems.corsa_tyre.visible = false;
      elems.soft_tyre.visible = false;
      elems.alt_tyre.visible = true;
      elems.p_zero.material.color = new THREE.Color(0x0066cc);
      elems.deco_checkered_1.material.color = new THREE.Color(0x0066cc);
      pasteData("wet");

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
      pasteData("soft");

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

document.querySelector(".rpm").innerHTML = `0 RPM`;
const speedElem = speed.add(speedObj, "kmh", 0, 360, 1).onChange((value) => {
  rimSpeed = value / 3.6 / 0.3428655;

  const RPM = Math.round(rimSpeed * (60 / (2 * Math.PI)));
  document.querySelector(".rpm").innerHTML = `${RPM} RPM`;
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
