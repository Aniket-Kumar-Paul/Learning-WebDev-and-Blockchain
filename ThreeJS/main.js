import * as THREE from "three";
import "./style.css";

// Scene
const scene = new THREE.Scene();

// Create our sphere
// geometry -> shape
const geometry = new THREE.SphereGeometry(3, 64, 64); // (radius, widthSegments, heightSegments)
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
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
renderer.render(scene, camera);



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
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop); 
}
loop();