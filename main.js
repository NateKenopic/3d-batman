import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

let scene, camera, renderer, cloudParticles = [], flash, rain, rainGeo, rainCount = 15000;

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 1;
camera.rotation.x = 1.16;
camera.rotation.y = -0.12;
camera.rotation.z = 0.27;

const ambient = new THREE.AmbientLight(0x555555);
scene.add(ambient);

const directionalLight = new THREE.DirectionalLight(0xffeedd);
directionalLight.position.set(0, 0, 1);
scene.add(directionalLight);

flash = new THREE.PointLight(0x062d89, 60, 450, 1.7);
flash.position.set(200, 300, 100);
scene.add(flash);

renderer = new THREE.WebGLRenderer();
scene.fog = new THREE.FogExp2(0x11111f, 0.002);
renderer.setClearColor(scene.fog.color);
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('.batman-scene').appendChild(renderer.domElement)

let vertices = []
rainGeo = new THREE.BufferGeometry();

for (let i = 0; i < rainCount; i++) {
    const rainDrop = new THREE.Vector3(
        Math.random() * 400 - 200,
        Math.random() * 500 - 250,
        Math.random() * 400 - 200
    );
    rainDrop.velocity = {};
    rainDrop.velocity = 0;

    vertices.push(rainDrop);
}

rainGeo.setFromPoints(vertices);



const rainMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.1,
    transparent: true
});

rain = new THREE.Points(rainGeo, rainMaterial);
scene.add(rain);

let loader = new THREE.TextureLoader();
loader.load("clouds.png", function (texture) {
    const cloudGeo = new THREE.PlaneGeometry(500, 550);
    const cloudMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true
    });

    for (let p = 0; p < 25; p++) {
        let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
        cloud.position.set(
            Math.random() * 800 - 400,
            500,
            Math.random() * 500 - 450
        );
        cloud.rotation.x = 1.16;
        cloud.rotation.y = -0.12;
        cloud.rotation.z = Math.random() * 360;
        cloud.material.opacity = 0.6;
        cloudParticles.push(cloud);
        scene.add(cloud);
    }
    animate();
});

let batman;

let batmanLoader = new GLTFLoader();
batmanLoader.load('scene.gltf', function (gltf) {
    batman = gltf.scene;
    batman.position.y = 110;
    batman.position.z = -58;
    batman.position.x = 5;

    batman.rotation.x = 7.6;
    batman.rotation.z = 0.26;
    
    scene.add(batman);
})

const geometry = new THREE.BoxGeometry( 80, 100, 80 ); 
const material = new THREE.MeshBasicMaterial( {color: 'black'} ); 
const cube = new THREE.Mesh( geometry, material ); 
cube.position.y = 80;
cube.position.z = -100;
cube.position.x = 10;

cube.rotation.x = 7.5;
cube.rotation.z = 0.26;

scene.add( cube );

function animate() {
    cloudParticles.forEach(p => {
        p.rotation.z -= 0.002;
    });
    vertices.forEach(p => {
        p.velocity -= 0.1 + Math.random() * 0.1;
        p.y += p.velocity;
        if (p.y < -200) {
            p.y = 200;
            p.velocity = 0;
        }
    });
    rainGeo.needsUpdate = true;
    rain.rotation.y += 0.002;
    if (Math.random() > 0.93 || flash.power > 100) {
        if (flash.power < 100)
            flash.position.set(
                Math.random() * 400,
                300 + Math.random() * 200,
                100
            );
        flash.power = 50 + Math.random() * 500;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}