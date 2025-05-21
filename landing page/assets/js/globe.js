// Globe Visualization

function initGlobe() {
    const container = document.getElementById('globe-container');
    if (!container) return;
    
    let scene, camera, renderer, globe, earthMesh;
    
    function init() {
        // Scene setup
        scene = new THREE.Scene();
        
        // Camera setup
        camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 300;
        
        // Renderer setup
        renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        
        // Create the globe
        globe = new THREE.Group();
        scene.add(globe);
        
        // Earth mesh
        const earthGeometry = new THREE.SphereGeometry(100, 32, 32);
        const earthMaterial = new THREE.MeshBasicMaterial({
            color: 0x4C8C4A, // Primary color green
            transparent: true,
            opacity: 0.9,
            wireframe: true
        });
        
        earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
        globe.add(earthMesh);
        
        // Outer glow
        const glowGeometry = new THREE.SphereGeometry(105, 32, 32);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                "c": { type: "f", value: 0.5 },
                "p": { type: "f", value: 5.0 },
                glowColor: { type: "c", value: new THREE.Color(0xD9A566) },
                viewVector: { type: "v3", value: camera.position }
            },
            vertexShader: `
                uniform vec3 viewVector;
                uniform float c;
                uniform float p;
                varying float intensity;
                void main() {
                    vec3 vNormal = normalize(normal);
                    vec3 vNormel = normalize(viewVector);
                    intensity = pow(c - dot(vNormal, vNormel), p);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main() {
                    vec3 glow = glowColor * intensity;
                    gl_FragColor = vec4(glow, 1.0);
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        globe.add(glowMesh);
        
        // Add random "impact points" on the globe
        addImpactPoints();
        
        // Event listeners
        window.addEventListener('resize', onWindowResize);
        container.addEventListener('mousemove', onMouseMove);
    }
    
    function addImpactPoints() {
        const impactGeometry = new THREE.SphereGeometry(2, 16, 16);
        const impactMaterial = new THREE.MeshBasicMaterial({
            color: 0xD9A566 // Accent color gold
        });
        
        // Add 10 impact points at random locations
        for (let i = 0; i < 10; i++) {
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            
            const x = 100 * Math.sin(theta) * Math.cos(phi);
            const y = 100 * Math.sin(theta) * Math.sin(phi);
            const z = 100 * Math.cos(theta);
            
            const impact = new THREE.Mesh(impactGeometry, impactMaterial);
            impact.position.set(x, y, z);
            
            // Add ripple effect
            const rippleGeometry = new THREE.RingGeometry(3, 5, 32);
            const rippleMaterial = new THREE.MeshBasicMaterial({
                color: 0xD9A566,
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide
            });
            
            const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
            ripple.position.copy(impact.position);
            ripple.lookAt(0, 0, 0);
            
            // Animate ripple
            const scaleFactor = 1 + Math.random();
            function animateRipple() {
                ripple.scale.x += 0.01 * scaleFactor;
                ripple.scale.y += 0.01 * scaleFactor;
                ripple.scale.z += 0.01 * scaleFactor;
                rippleMaterial.opacity -= 0.005 * scaleFactor;
                
                if (rippleMaterial.opacity <= 0) {
                    ripple.scale.set(1, 1, 1);
                    rippleMaterial.opacity = 0.5;
                }
                
                requestAnimationFrame(animateRipple);
            }
            
            animateRipple();
            
            globe.add(impact);
            globe.add(ripple);
        }
    }
    
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    function onMouseMove(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        const mouseX = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        const mouseY = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
        
        // Rotate globe based on mouse position
        globe.rotation.y = mouseX * 0.5;
        globe.rotation.x = mouseY * 0.3;
    }
    
    function animate() {
        requestAnimationFrame(animate);
        
        // Slowly rotate the globe
        globe.rotation.y += 0.001;
        
        renderer.render(scene, camera);
    }
    
    // Initialize and start animation
    init();
    animate();
}