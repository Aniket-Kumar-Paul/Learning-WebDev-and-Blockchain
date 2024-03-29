import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

// Scene
const scene = new THREE.Scene();

// Create our sphere
// geometry -> shape
const geometry = new THREE.SphereGeometry(3, 64, 64); // (radius, widthSegments, heightSegments)
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.3, // less roughness => more shiny
});
const mesh = new THREE.Mesh(geometry, material); // combination of geometry and material
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Lights
const light = new THREE.PointLight("#0xffffff", 1, 100); // (color, intensity, distance)
light.position.set(0, 10, 10); // x, y, z
scene.add(light);

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  1000
); // (field of view, aspect ratio, near clipping plane, far clipping plane)
camera.position.z = 20;
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl"); // make a canvas element in index.html & access it here
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2); // default is 1, more => better quality but more resource intensive
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas); // Allows to rotate/drag the camera
controls.enableDamping = true; // smooths out the camera movement
controls.enablePan = false; // disable panning
controls.enableZoom = false; // disable zooming
controls.autoRotate = true; // auto rotate the camera
controls.autoRotateSpeed = 5; // speed of auto rotation

// With just the above, if we resize our browser window,
// the canvas doesn't resize
// thus, add an event listener for it & also re-render it using the loop

// Resize
window.addEventListener("resize", () => {
  // Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height; // update aspect ratio

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});
// Re-render
const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();



// Timeline Animation (Allows us to synchronize multiple animations together)
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo("nav", {y: "-100%"}, {y: "0%"});
tl.fromTo(".title", {opacity: 0}, {opacity: 1});

// Mouse Animation Color (When we right click and drag, the sphere changes color based on cursor location)
let mouseDown = false
let rgb = []
window.addEventListener("mousedown", () => (mouseDown = true))
window.addEventListener("mouseup", () => (mouseDown = false))
window.addEventListener("mousemove", (e)=>{
  if(mouseDown) {
    rgb = [
      Math.round((e.pageX/sizes.width)*255),
      Math.round((e.pageY/sizes.height)*255),
      150
    ]

    // Animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(mesh.material.color, {r:newColor.r, g:newColor.g, b:newColor.b})
  }
})