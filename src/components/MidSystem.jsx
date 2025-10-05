import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const MidSystem = () => {
    const containerRef = useRef(null);
    const [textureStatus, setTextureStatus] = useState({
        ball1: 'loading',
        ball2: 'loading'
    });

    useEffect(() => {
        if (!containerRef.current) return;

        console.log('🚀 Starting TinySystem with textures...');

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        console.log('✅ Scene created');

        // Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 50;
        console.log('✅ Camera created at z=50');

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);
        console.log('✅ Renderer created and mounted');

        // Texture loader
        const textureLoader = new THREE.TextureLoader();

        

        // Ball 1 - Red with texture (center)
        const geometry1 = new THREE.SphereGeometry(5, 32, 32);
        const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const ball1 = new THREE.Mesh(geometry1, material1);
        ball1.position.set(0, 0, 0);
        scene.add(ball1);
        console.log('✅ Red ball added at center (color fallback)');

        // Load texture for ball 1 (Sun)
        console.log('📦 Loading texture: /sun.jpg');
        textureLoader.load(
            '/sun.jpg',
            (texture) => {
                console.log('✅ SUCCESS: sun.jpg loaded!');
                material1.map = texture;
                material1.needsUpdate = true;
                setTextureStatus(prev => ({ ...prev, ball1: 'loaded' }));
            },
            (progress) => {
                console.log('⏳ Loading sun.jpg...', progress);
            },
            (error) => {
                console.error('❌ FAILED to load sun.jpg:', error);
                setTextureStatus(prev => ({ ...prev, ball1: 'failed' }));
            }
        );

        // Ball 2 - Blue with texture (orbiting)
        const geometry2 = new THREE.SphereGeometry(3, 32, 32);
        const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const ball2 = new THREE.Mesh(geometry2, material2);
        scene.add(ball2);
        console.log('✅ Blue ball added (color fallback)');

        // Load texture for ball 2 (Earth)
        console.log('📦 Loading texture: /earth.jpg');
        textureLoader.load(
            '/earth.jpg',
            (texture) => {
                console.log('✅ SUCCESS: earth.jpg loaded!');
                material2.map = texture;
                material2.needsUpdate = true;
                setTextureStatus(prev => ({ ...prev, ball2: 'loaded' }));
            },
            (progress) => {
                console.log('⏳ Loading earth.jpg...', progress);
            },
            (error) => {
                console.error('❌ FAILED to load earth.jpg:', error);
                setTextureStatus(prev => ({ ...prev, ball2: 'failed' }));
            }
        );

        // Animation
        let angle = 0;
        const orbitRadius = 20;
        let frameCount = 0;

        const animate = () => {
            requestAnimationFrame(animate);

            // Orbit ball2 around ball1
            angle += 0.02;
            ball2.position.x = Math.cos(angle) * orbitRadius;
            ball2.position.y = Math.sin(angle) * orbitRadius;

            // Rotate balls
            ball1.rotation.y += 0.01;
            ball2.rotation.y += 0.02;

            renderer.render(scene, camera);

            // Log every 60 frames to confirm animation is running
            frameCount++;
            if (frameCount % 60 === 0) {
                console.log(`🎬 Frame ${frameCount}: angle=${angle.toFixed(2)}`);
            }
        };

        console.log('🎬 Starting animation loop...');
        animate();

        // Resize handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            console.log('🧹 Cleaning up...');
            window.removeEventListener('resize', handleResize);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            geometry1.dispose();
            geometry2.dispose();
            material1.dispose();
            material2.dispose();
        };
    }, []);

    return (
        <div style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
            <div
                ref={containerRef}
                style={{
                    width: '100vw',
                    height: '100vh',
                    margin: 0,
                    padding: 0,
                    display: 'block'
                }}
            />
            <div style={{
                position: 'fixed',
                top: '20px',
                left: '20px',
                color: 'white',
                background: 'rgba(0,0,0,0.9)',
                padding: '15px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '13px',
                zIndex: 1000,
                border: '2px solid #333'
            }}>
                <div style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '14px' }}>
                    🔍 TEXTURE TEST
                </div>
                <div style={{ marginBottom: '8px' }}>
                    <span style={{ display: 'inline-block', width: '100px' }}>Red ball:</span>
                    <span style={{
                        color: textureStatus.ball1 === 'loaded' ? '#4ade80' : textureStatus.ball1 === 'failed' ? '#ff6b6b' : '#fbbf24'
                    }}>
                        {textureStatus.ball1 === 'loaded' ? '✅ /sun.jpg' : textureStatus.ball1 === 'failed' ? '❌ Failed' : '⏳ Loading...'}
                    </span>
                </div>
                <div>
                    <span style={{ display: 'inline-block', width: '100px' }}>Blue ball:</span>
                    <span style={{
                        color: textureStatus.ball2 === 'loaded' ? '#4ade80' : textureStatus.ball2 === 'failed' ? '#ff6b6b' : '#fbbf24'
                    }}>
                        {textureStatus.ball2 === 'loaded' ? '✅ /earth.jpg' : textureStatus.ball2 === 'failed' ? '❌ Failed' : '⏳ Loading...'}
                    </span>
                </div>
                <div style={{ marginTop: '10px', fontSize: '11px', opacity: 0.7, borderTop: '1px solid #333', paddingTop: '8px' }}>
                    Check console for detailed logs
                </div>
            </div>
        </div>
    );
};

export default MidSystem