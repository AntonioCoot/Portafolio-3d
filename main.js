import * as THREE from 'three';

// --------------------------------------------------------
// Custom Cursor Logic
// --------------------------------------------------------
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', (e) => {
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if(cursor) {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.backgroundColor = 'rgba(0, 255, 204, 0.2)';
        }
    });
    el.addEventListener('mouseleave', () => {
        if(cursor) {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'transparent';
        }
    });
});

// --------------------------------------------------------
// Menu Logic
// --------------------------------------------------------
const menuBtn = document.getElementById('menu-btn');
const menuOverlay = document.getElementById('menu-overlay');
const menuLinks = document.querySelectorAll('.menu-link');

if(menuBtn && menuOverlay) {
    menuBtn.addEventListener('click', () => {
        menuOverlay.classList.toggle('active');
        if (menuOverlay.classList.contains('active')) {
            menuBtn.textContent = '[ CERRAR ]';
        } else {
            menuBtn.textContent = '[ MENU ]';
        }
    });
}

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (menuOverlay) {
            menuOverlay.classList.remove('active');
            if(menuBtn) menuBtn.textContent = '[ MENU ]';
        }
    });
});


// --------------------------------------------------------
// Three.js Space Background
// --------------------------------------------------------
const container = document.getElementById('canvas-container');

if (container) {
    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Add Particles (Stars)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i+=3) {
        // Positions spread around
        posArray[i] = (Math.random() - 0.5) * 10;
        posArray[i+1] = (Math.random() - 0.5) * 10;
        posArray[i+2] = (Math.random() - 0.5) * 10;
        
        // Random neon colors for some particles, white for others
        const rValue = Math.random();
        if(rValue > 0.8) {
            // Neon Cyan
            colorsArray[i] = 0;   // R
            colorsArray[i+1] = 1; // G
            colorsArray[i+2] = 0.8; // B
        } else if (rValue > 0.6) {
             // Neon Pink
            colorsArray[i] = 1;   // R
            colorsArray[i+1] = 0; // G
            colorsArray[i+2] = 1; // B
        } else {
             // White
            colorsArray[i] = 1;   // R
            colorsArray[i+1] = 1; // G
            colorsArray[i+2] = 1; // B
        }
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);
    
    camera.position.z = 3;

    // 3. Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // 4. Animation Loop
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        // Smooth parallax effect
        particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
        
        renderer.render(scene, camera);
    }
    animate();

    // 5. Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
