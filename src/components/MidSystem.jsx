import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const MidSystem = () => {
    const containerRef = useRef(null)

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


        const SEGMENTS = 32

        const planetsData = retrievePlanetsData()

        const PLANETS = planetsData.map((p, i) => {
            const geometry = new THREE.SphereGeometry(p.radius / 12, SEGMENTS, SEGMENTS)
            const material = new THREE.MeshBasicMaterial({ color: p.color })
            const ball = new THREE.Mesh(geometry, material)
            // all the planets will be align at the very start
            ball.position.set(p.distance / 10, 0, 0)
            scene.add(ball)
            console.log(`✅ "${p.name}" added at center (color fallback)`)
            console.log(`📦 Loading texture: /${p.name}.jpg ...`)
            textureLoader.load(
                `/${p.name}.jpg`,
                (texture) => {
                    console.log(`✅ SUCCESS ${p.name}.jpg loaded!`)
                    // setting color to white to see the texture with no filters
                    ball.material.color.set(0xffffff)
                    material.map = texture
                    material.needsUpdate = true
                },
                (progress) => {
                    console.log(`⏳ Loading  ${p.name}.jpg ...`, progress)
                },
                (error) => {
                    console.error(`❌ FAILED to load  ${p.name}.jpg`, error)
                }
            )
            if(i === 0){
                // adding sunlight
                scene.add(new THREE.PointLight(0xffffff, 50000, 0))
            }
            return ball
        })

        // Animation
        let angle = 0
        let frameCount = 0

        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate sun
            PLANETS[0].rotation.y += 0.01;


            PLANETS.forEach((p, i) => {
                if (i === 0) {
                    p.rotation.y += 0.01;
                } else {
                    // Rotate and translate 
                    p.rotation.y += 0.02;
                    p.position.x = Math.cos((angle + planetsData[i].deviation) * planetsData[i].speed * 5) * planetsData[i].distance / 10;
                    p.position.y = Math.sin((angle + planetsData[i].deviation) * planetsData[i].speed * 5) * planetsData[i].distance / 10;
                }
            })

            angle += 0.02;

            renderer.render(scene, camera);

            // Log every 60 frames to confirm animation is running
            frameCount++;
            if (frameCount % 60 === 0) {
                console.log(`🎬 Frame ${frameCount}: angle=${angle.toFixed(2)}`);
            }
            if (frameCount % 300 === 0) {
                console.log(PLANETS.map(p => p.position))
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
            // geometry1.dispose();
            // geometry2.dispose();
            // material1.dispose();
            // material2.dispose();
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
        </div>
    );
};

function getRandomDeviation() {
    return Math.random() * 2 * Math.PI
}

function retrievePlanetsData() {
    return [
        { name: 'sun', radius: 40, distance: 0, speed: 1, color: 0xff0000 },
        { name: "mercury", radius: 4, distance: 60, speed: 1 / 1, color: 0x8c7853, deviation: getRandomDeviation() },
        { name: "venus", radius: 7, distance: 90, speed: 1 / 2.55, color: 0xffc649, deviation: getRandomDeviation() },
        { name: "earth", radius: 8, distance: 120, speed: 1 / 4.15, color: 0x2233ff, deviation: getRandomDeviation() },
        { name: "mars", radius: 6, distance: 150, speed: 1 / 7.81, color: 0xcd5c5c, deviation: getRandomDeviation() },
        { name: "jupiter", radius: 20, distance: 210, speed: 1 / 49, color: 0xc88b3a, deviation: getRandomDeviation() },
        { name: "saturn", radius: 17, distance: 270, speed: 1 / 122, color: 0xfad5a5, deviation: getRandomDeviation() },
        { name: "uranus", radius: 12, distance: 330, speed: 1 / 348, color: 0x4fd0e0, deviation: getRandomDeviation() },
        { name: "neptune", radius: 12, distance: 380, speed: 1 / 684, color: 0x4166f5, deviation: getRandomDeviation() },
    ]
}

export default MidSystem