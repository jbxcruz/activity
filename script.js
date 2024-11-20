

const cube = document.getElementById('cube');
let cubeSize = 200; // Initial cube size (in pixels)
let rotateX = -30;
let rotateY = 30;
let isMouseDown = false;
let lastMouseX = 0;
let lastMouseY = 0;
let isSpinning = false; // Whether the cube is spinning or not

// Smooth transformation for animations
cube.style.transition = 'transform 0.1s ease-out';

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

  const deltaX = event.clientX - lastMouseX;
  const deltaY = event.clientY - lastMouseY;

  rotateY += deltaX * cubeProperties.rotateSpeed;
  rotateX -= deltaY * cubeProperties.rotateSpeed;

  cube.style.transform = `scale(${cubeSize / 200}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${cubeProperties.elevation}px)`;

  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
});

// Gradually resize the cube on scroll without a specific limit
window.addEventListener('wheel', (event) => {
  const zoomSpeed = 0.1; 
  cubeSize *= event.deltaY > 0 ? (1 + zoomSpeed) : (1 - zoomSpeed);

  cube.style.transform = `scale(${cubeSize / 200}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${cubeProperties.elevation}px)`;
});

// Prevent zooming on touch devices
window.addEventListener(
  'touchstart',
  (event) => {
    if (event.touches.length > 1) {
      event.preventDefault(); 
    }
  },
  { passive: false }
);

window.addEventListener(
  'touchmove',
  (event) => {
    if (event.touches.length > 1) {
      event.preventDefault(); 
    }
  },
  { passive: false }
);

// Create a dat.GUI instance and add controls
const gui = new dat.GUI();

// Elevation control
gui.add(cubeProperties, 'elevation', -200, 200).name('Elevation').onChange(() => {
  cube.style.transform = `scale(${cubeSize / 200}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${cubeProperties.elevation}px)`;
});

// Visibility control
gui.add(cubeProperties, 'visibility').name('Visibility').onChange(() => {
  updateCubeVisibilityAndWireframe();
});

// Wireframe control
gui.add(cubeProperties, 'wireframe').name('Wireframe').onChange(() => {
  updateCubeVisibilityAndWireframe();
});

// Color control
gui.addColor(cubeProperties, 'color').name('Color').onChange(() => {
  updateCubeVisibilityAndWireframe();
});

// Spin button
gui.add(
  {
    spin: function () {
      if (!isSpinning) {
        isSpinning = true;
        animateCube();
        setTimeout(() => {
          isSpinning = false;
        }, 2000); 
      }
    },
  },
  'spin'
).name('Spin');

// Animate cube rotation
function animateCube() {
  if (isSpinning) {
    rotateY += 1;
    cube.style.transform = `scale(${cubeSize / 200}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${cubeProperties.elevation}px)`;
    requestAnimationFrame(animateCube);
  }
}

// Update cube visibility and wireframe styles
function updateCubeVisibilityAndWireframe() {
  if (cubeProperties.visibility) {
    cube.style.display = 'block';
    if (cubeProperties.wireframe) {
      cube.classList.add('wireframe');
      cube.style.backgroundColor = 'transparent';
    } else {
      cube.classList.remove('wireframe');
      cube.style.backgroundColor = cubeProperties.color;
    }
  } else {
    cube.style.display = 'none';
  }
}

// Reset rotation on mouse leave
window.addEventListener('mouseleave', () => {
  rotateX = -30;
  rotateY = 30;
  cube.style.transform = `scale(${cubeSize / 200}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${cubeProperties.elevation}px)`;
});
