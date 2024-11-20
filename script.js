


const cube = document.getElementById('cube');
let cubeSize = 200; // Initial cube size (in pixels)
let rotateX = -30;
let rotateY = 30;
let isMouseDown = false;
let lastMouseX = 0;
let lastMouseY = 0;
let isSpinning = false; // Whether the cube is spinning or not

// Initial cube properties
let cubeProperties = {
  elevation: 0, // Elevation of the cube (vertical position)
  visibility: true, // Visibility of the cube
  wireframe: false, // Whether to display wireframe
  color: '#ff0000', // Color of the cube
  rotateSpeed: 0.2, // Speed of user-controlled rotation
};

// Mouse down event to start dragging
window.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
});

// Mouse up event to stop dragging
window.addEventListener('mouseup', () => {
  isMouseDown = false;
});

// Mouse move event to rotate the cube smoothly
window.addEventListener('mousemove', (event) => {
  if (!isMouseDown) return;

  // Calculate the difference between current and previous mouse position
  const deltaX = event.clientX - lastMouseX;
  const deltaY = event.clientY - lastMouseY;

  // Update rotation angles gradually based on mouse movement
  rotateY += deltaX * cubeProperties.rotateSpeed;
  rotateX -= deltaY * cubeProperties.rotateSpeed;

  // Apply smooth rotation to the cube
  cube.style.transform = `scale(${cubeSize / 200}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${cubeProperties.elevation}px)`;

  // Update last mouse position for next calculation
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
});

// Gradually resize the cube on scroll without a specific limit
window.addEventListener('wheel', (event) => {
  if (event.deltaY > 0) {
    cubeSize *= 1.05; // Gradually increase the size
  } else {
    cubeSize *= 0.95; // Gradually decrease the size
  }

  // Apply transformation based on updated size
  cube.style.transform = `scale(${cubeSize / 200}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${cubeProperties.elevation}px)`;
});

// Prevent zooming on touch devices (optional for mobile)
window.addEventListener('touchstart', (event) => {
  if (event.touches.length > 1) {
    event.preventDefault(); // Prevent multi-touch zoom
  }
}, { passive: false });

window.addEventListener('touchmove', (event) => {
  if (event.touches.length > 1) {
    event.preventDefault(); // Prevent pinch-to-zoom
  }
}, { passive: false });

// Create a dat.GUI instance and add controls
const gui = new dat.GUI();

// Elevation control (Y-axis movement)
gui.add(cubeProperties, 'elevation', -200, 200).name('Elevation').onChange(() => {
  cube.style.transform = `scale(${cubeSize / 200}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${cubeProperties.elevation}px)`;
});

// Visibility control (Show/Hide cube)
gui.add(cubeProperties, 'visibility').name('Visibility').onChange(() => {
  updateCubeVisibilityAndWireframe();
});

// Wireframe control
gui.add(cubeProperties, 'wireframe').name('Wireframe').onChange(() => {
  updateCubeVisibilityAndWireframe();
});

// Color control (change the cube color)
gui.addColor(cubeProperties, 'color').name('Color').onChange(() => {
  updateCubeVisibilityAndWireframe();
});

// Spin button (now as a button that spins for a while)
gui.add({ spin: function() {
  if (!isSpinning) {
    isSpinning = true; // Start spinning
    animateCube();
    setTimeout(() => {
      isSpinning = false; // Stop spinning after 2 seconds
    }, 2000); // Spin for 2 seconds
  }
}}, 'spin').name('Spin');

// Function to animate the cube's rotation if spin is enabled
function animateCube() {
  if (isSpinning) {
    rotateY += 1; // Adjust the spin speed by changing this value
    cube.style.transform = `scale(${cubeSize / 200}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${cubeProperties.elevation}px)`;
    requestAnimationFrame(animateCube);
  }
}

// Function to update cube visibility and wireframe styles based on user input
function updateCubeVisibilityAndWireframe() {
  if (cubeProperties.visibility) {
    cube.style.display = 'block'; // Make cube visible
    if (cubeProperties.wireframe) {
      cube.classList.add('wireframe'); // Add wireframe class (transparent faces with borders)
      cube.style.backgroundColor = 'transparent'; // Make the cube faces transparent
    } else {
      cube.classList.remove('wireframe');
      cube.style.backgroundColor = cubeProperties.color; // Apply the selected color if not wireframe
    }
  } else {
    cube.style.display = 'none'; // Hide the cube if visibility is false
  }
}

// Reset rotation angle if the mouse leaves the window
window.addEventListener('mouseleave', () => {
  rotateX = -30;
  rotateY = 30;
  cube.style.transform = `scale(${cubeSize / 200}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${cubeProperties.elevation}px)`;
});
