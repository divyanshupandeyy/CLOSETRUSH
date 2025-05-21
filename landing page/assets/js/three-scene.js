// Three.js Particle Scene 

function initThreeScene() {
    const container = document.getElementById('three-scene-container');
    if (!container) return;
    
    let scene, camera, renderer, particles, mouseX = 0, mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    function init() {
        // Scene setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;
        
        // Renderer setup
        renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        
        // Particles
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        
        // Using our brand colors
        const primaryColor = new THREE.Color(0x4C8C4A); // Green
        const accentColor = new THREE.Color(0xD9A566); // Gold
        
        const particleCount = window.innerWidth < 768 ? 1000 : 2000;
        
        for (let i = 0; i < particleCount; i++) {
            // Random position in a sphere
            const x = Math.random() * 2000 - 1000;
            const y = Math.random() * 2000 - 1000;
            const z = Math.random() * 2000 - 1000;
            
            vertices.push(x, y, z);
            
            // Randomly choose between primary and accent color
            const color = Math.random() > 0.7 ? accentColor : primaryColor;
            colors.push(color.r, color.g, color.b);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        particles = new THREE.Points(geometry, material);
        scene.add(particles);
        
        // Event listeners
        document.addEventListener('mousemove', onDocumentMouseMove);
        window.addEventListener('resize', onWindowResize);
    }
    
    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) * 0.05;
        mouseY = (event.clientY - windowHalfY) * 0.05;
    }
    
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate particles based on mouse position
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;
        
        // Subtle movement in response to mouse
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
    
    // Initialize and start animation
    init();
    animate();
}