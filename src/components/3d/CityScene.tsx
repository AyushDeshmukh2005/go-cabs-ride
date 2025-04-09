
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const CityScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000');
    scene.fog = new THREE.Fog('#000000', 10, 50);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75, 
      mountRef.current.clientWidth / mountRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Street light
    const streetLights = [];
    for (let i = -30; i <= 30; i += 15) {
      const streetLightL = new THREE.PointLight(0xffffcc, 1, 20);
      streetLightL.position.set(i, 3, -5);
      scene.add(streetLightL);
      streetLights.push(streetLightL);
      
      const streetLightR = new THREE.PointLight(0xffffcc, 1, 20);
      streetLightR.position.set(i, 3, 5);
      scene.add(streetLightR);
      streetLights.push(streetLightR);
    }
    
    // Road
    const roadGeometry = new THREE.PlaneGeometry(100, 10);
    const roadMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      roughness: 0.8
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.receiveShadow = true;
    scene.add(road);
    
    // Road markings
    const createRoadMarking = (posX: number) => {
      const markingGeometry = new THREE.PlaneGeometry(2, 0.2);
      const markingMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        roughness: 0.5
      });
      const marking = new THREE.Mesh(markingGeometry, markingMaterial);
      marking.rotation.x = -Math.PI / 2;
      marking.position.set(posX, 0.01, 0);
      marking.receiveShadow = true;
      return marking;
    };
    
    const roadMarkings = [];
    for (let i = -50; i < 50; i += 5) {
      const marking = createRoadMarking(i);
      scene.add(marking);
      roadMarkings.push(marking);
    }
    
    // Buildings
    const createBuilding = (posX: number, posZ: number, height: number, width: number, depth: number, color: number) => {
      const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
      const buildingMaterial = new THREE.MeshStandardMaterial({ 
        color,
        roughness: 0.7,
      });
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.set(posX, height / 2, posZ);
      building.castShadow = true;
      building.receiveShadow = true;
      
      // Add windows
      addWindowsToBuilding(building, width, height, depth);
      
      return building;
    };
    
    const addWindowsToBuilding = (building: THREE.Mesh, width: number, height: number, depth: number) => {
      const windowGeometry = new THREE.PlaneGeometry(0.5, 0.5);
      const windowMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffcc, 
        emissive: 0xffffcc,
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide
      });
      
      const windowRows = Math.floor(height / 1.2);
      const windowColsWidth = Math.floor(width / 1);
      const windowColsDepth = Math.floor(depth / 1);
      
      // Windows on width sides
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowColsWidth - 1; col++) {
          if (Math.random() > 0.3) { // Some windows are off
            const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
            windowMesh.position.set(
              -width / 2 + 0.75 + col * 1,
              -height / 2 + 1 + row * 1.2,
              depth / 2 + 0.01
            );
            windowMesh.rotation.y = Math.PI;
            building.add(windowMesh);
            
            const windowMeshBack = new THREE.Mesh(windowGeometry, windowMaterial);
            windowMeshBack.position.set(
              -width / 2 + 0.75 + col * 1,
              -height / 2 + 1 + row * 1.2,
              -depth / 2 - 0.01
            );
            building.add(windowMeshBack);
          }
        }
      }
      
      // Windows on depth sides
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowColsDepth - 1; col++) {
          if (Math.random() > 0.3) { // Some windows are off
            const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
            windowMesh.position.set(
              width / 2 + 0.01,
              -height / 2 + 1 + row * 1.2,
              -depth / 2 + 0.75 + col * 1
            );
            windowMesh.rotation.y = Math.PI / 2;
            building.add(windowMesh);
            
            const windowMeshBack = new THREE.Mesh(windowGeometry, windowMaterial);
            windowMeshBack.position.set(
              -width / 2 - 0.01,
              -height / 2 + 1 + row * 1.2,
              -depth / 2 + 0.75 + col * 1
            );
            windowMeshBack.rotation.y = -Math.PI / 2;
            building.add(windowMeshBack);
          }
        }
      }
    };
    
    // Add buildings on both sides of the road
    const buildingColors = [0xe09372, 0xd9825e, 0xc86d4b, 0xe8a382];
    const buildings = [];
    
    // Left side buildings
    for (let i = -45; i < 45; i += 10) {
      const height = 5 + Math.random() * 10;
      const width = 5 + Math.random() * 3;
      const depth = 5 + Math.random() * 3;
      const color = buildingColors[Math.floor(Math.random() * buildingColors.length)];
      const building = createBuilding(i, -10 - Math.random() * 5, height, width, depth, color);
      scene.add(building);
      buildings.push(building);
    }
    
    // Right side buildings
    for (let i = -45; i < 45; i += 10) {
      const height = 5 + Math.random() * 10;
      const width = 5 + Math.random() * 3;
      const depth = 5 + Math.random() * 3;
      const color = buildingColors[Math.floor(Math.random() * buildingColors.length)];
      const building = createBuilding(i, 10 + Math.random() * 5, height, width, depth, color);
      scene.add(building);
      buildings.push(building);
    }
    
    // Trees
    const createTree = (posX: number, posZ: number) => {
      const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
      const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.set(posX, 0.5, posZ);
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      scene.add(trunk);
      
      const foliageGeometry = new THREE.SphereGeometry(1, 8, 8);
      const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
      foliage.position.set(posX, 1.5, posZ);
      foliage.castShadow = true;
      foliage.receiveShadow = true;
      scene.add(foliage);
      
      return { trunk, foliage };
    };
    
    const trees = [];
    for (let i = -45; i < 45; i += 15) {
      if (Math.random() > 0.3) {
        const tree = createTree(i, -7);
        trees.push(tree);
      }
      if (Math.random() > 0.3) {
        const tree = createTree(i, 7);
        trees.push(tree);
      }
    }
    
    // Taxi car
    const carGroup = new THREE.Group();
    scene.add(carGroup);
    
    // Car body
    const carBodyGeometry = new THREE.BoxGeometry(2.5, 0.8, 1.2);
    const carBodyMaterial = new THREE.MeshStandardMaterial({ color: 0xFF4500 });
    const carBody = new THREE.Mesh(carBodyGeometry, carBodyMaterial);
    carBody.position.y = 0.6;
    carBody.castShadow = true;
    carBody.receiveShadow = true;
    carGroup.add(carBody);
    
    // Car roof
    const carRoofGeometry = new THREE.BoxGeometry(1.5, 0.5, 1.2);
    const carRoofMaterial = new THREE.MeshStandardMaterial({ color: 0xFF4500 });
    const carRoof = new THREE.Mesh(carRoofGeometry, carRoofMaterial);
    carRoof.position.set(-0.2, 1.25, 0);
    carRoof.castShadow = true;
    carRoof.receiveShadow = true;
    carGroup.add(carRoof);
    
    // Car windows
    const carWindowGeometry = new THREE.PlaneGeometry(0.7, 0.4);
    const carWindowMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x222222, 
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    
    // Front window
    const frontWindow = new THREE.Mesh(carWindowGeometry, carWindowMaterial);
    frontWindow.position.set(0.5, 1.25, 0);
    frontWindow.rotation.y = Math.PI / 2;
    carGroup.add(frontWindow);
    
    // Rear window
    const rearWindow = new THREE.Mesh(carWindowGeometry, carWindowMaterial);
    rearWindow.position.set(-0.9, 1.25, 0);
    rearWindow.rotation.y = Math.PI / 2;
    carGroup.add(rearWindow);
    
    // Side windows
    const leftWindow = new THREE.Mesh(carWindowGeometry, carWindowMaterial);
    leftWindow.position.set(-0.2, 1.25, 0.61);
    carGroup.add(leftWindow);
    
    const rightWindow = new THREE.Mesh(carWindowGeometry, carWindowMaterial);
    rightWindow.position.set(-0.2, 1.25, -0.61);
    carGroup.add(rightWindow);
    
    // Car taxi sign
    const taxiSignGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.8);
    const taxiSignMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFFF00,
      emissive: 0xFFFF00,
      emissiveIntensity: 0.5
    });
    const taxiSign = new THREE.Mesh(taxiSignGeometry, taxiSignMaterial);
    taxiSign.position.set(0, 1.6, 0);
    carGroup.add(taxiSign);
    
    // Car wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    
    const frontLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontLeftWheel.position.set(0.8, 0.3, 0.7);
    frontLeftWheel.rotation.z = Math.PI / 2;
    carGroup.add(frontLeftWheel);
    
    const frontRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontRightWheel.position.set(0.8, 0.3, -0.7);
    frontRightWheel.rotation.z = Math.PI / 2;
    carGroup.add(frontRightWheel);
    
    const rearLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    rearLeftWheel.position.set(-0.8, 0.3, 0.7);
    rearLeftWheel.rotation.z = Math.PI / 2;
    carGroup.add(rearLeftWheel);
    
    const rearRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    rearRightWheel.position.set(-0.8, 0.3, -0.7);
    rearRightWheel.rotation.z = Math.PI / 2;
    carGroup.add(rearRightWheel);
    
    // Create a driver (simple representation)
    const driverHeadGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const driverHeadMaterial = new THREE.MeshStandardMaterial({ color: 0xE0AC69 });
    const driverHead = new THREE.Mesh(driverHeadGeometry, driverHeadMaterial);
    driverHead.position.set(0.3, 1.1, 0);
    carGroup.add(driverHead);
    
    const driverBodyGeometry = new THREE.BoxGeometry(0.4, 0.5, 0.4);
    const driverBodyMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const driverBody = new THREE.Mesh(driverBodyGeometry, driverBodyMaterial);
    driverBody.position.set(0.3, 0.8, 0);
    carGroup.add(driverBody);
    
    // Headlights
    const headlightGeometry = new THREE.CircleGeometry(0.15, 16);
    const headlightMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFFFFF,
      emissive: 0xFFFFFF,
      emissiveIntensity: 1
    });
    
    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftHeadlight.position.set(1.26, 0.6, 0.4);
    leftHeadlight.rotation.y = Math.PI / 2;
    carGroup.add(leftHeadlight);
    
    const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightHeadlight.position.set(1.26, 0.6, -0.4);
    rightHeadlight.rotation.y = Math.PI / 2;
    carGroup.add(rightHeadlight);
    
    // Taillights
    const taillightGeometry = new THREE.CircleGeometry(0.1, 16);
    const taillightMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFF0000,
      emissive: 0xFF0000,
      emissiveIntensity: 0.8
    });
    
    const leftTaillight = new THREE.Mesh(taillightGeometry, taillightMaterial);
    leftTaillight.position.set(-1.26, 0.6, 0.4);
    leftTaillight.rotation.y = -Math.PI / 2;
    carGroup.add(leftTaillight);
    
    const rightTaillight = new THREE.Mesh(taillightGeometry, taillightMaterial);
    rightTaillight.position.set(-1.26, 0.6, -0.4);
    rightTaillight.rotation.y = -Math.PI / 2;
    carGroup.add(rightTaillight);
    
    // Add headlight light sources
    const leftHeadlightLight = new THREE.SpotLight(0xFFFFFF, 1);
    leftHeadlightLight.position.set(1.3, 0.6, 0.4);
    leftHeadlightLight.target.position.set(5, 0, 0.4);
    leftHeadlightLight.angle = Math.PI / 6;
    leftHeadlightLight.penumbra = 0.2;
    leftHeadlightLight.distance = 20;
    carGroup.add(leftHeadlightLight);
    carGroup.add(leftHeadlightLight.target);
    
    const rightHeadlightLight = new THREE.SpotLight(0xFFFFFF, 1);
    rightHeadlightLight.position.set(1.3, 0.6, -0.4);
    rightHeadlightLight.target.position.set(5, 0, -0.4);
    rightHeadlightLight.angle = Math.PI / 6;
    rightHeadlightLight.penumbra = 0.2;
    rightHeadlightLight.distance = 20;
    carGroup.add(rightHeadlightLight);
    carGroup.add(rightHeadlightLight.target);
    
    // Position car on road
    carGroup.position.set(-2, 0, 0);
    
    // Animation variables
    let carPosition = -30;
    let animationFrame: number;
    
    // Animation loop
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      
      // Move car along the road
      carPosition += 0.1;
      if (carPosition > 30) carPosition = -30;
      carGroup.position.x = carPosition;
      
      // Add slight vertical bounce to car
      carGroup.position.y = Math.sin(carPosition * 0.5) * 0.05;
      
      // Make wheels rotate
      frontLeftWheel.rotation.x += 0.1;
      frontRightWheel.rotation.x += 0.1;
      rearLeftWheel.rotation.x += 0.1;
      rearRightWheel.rotation.x += 0.1;
      
      // Make the buildings and camera move slightly to create parallax effect
      camera.position.x = Math.sin(carPosition * 0.02) * 0.5;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          } else if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          }
        }
      });
    };
  }, []);
  
  return (
    <div 
      ref={mountRef} 
      className="w-full h-[500px] overflow-hidden rounded-xl"
      style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' }}
    />
  );
};

export default CityScene;
