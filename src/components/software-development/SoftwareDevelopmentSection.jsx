import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X } from "lucide-react";
import "./software-development.css";

gsap.registerPlugin(ScrollTrigger);

const layers = [
  {
    name: "Frontend",
    subtitle: "Interfaces · Browser Apps",
    color: "#5795ff",
    overview:
      "Building accessible, responsive interfaces that make complex products feel clear and intuitive.",
    responsibilities: ["Product interfaces", "Reusable UI systems", "Responsive experiences"],
    technologies: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Redux Toolkit"],
    example: "A data-rich dashboard with reusable components and thoughtful interaction states.",
  },
  {
    name: "Backend",
    subtitle: "Services · APIs · Application Logic",
    color: "#a76dff",
    overview:
      "Connecting product experiences to dependable services, APIs, and application workflows.",
    responsibilities: ["API integrations", "Application services", "Data validation"],
    technologies: ["Node.js", "Express.js", "Python", "REST APIs", "GraphQL", "Authentication"],
    example: "A typed service layer that connects product interfaces to reliable data.",
  },
  {
    name: "Database",
    subtitle: "Data Storage · Queries · Transactions",
    color: "#818cf8",
    overview:
      "Organizing product data into reliable, queryable structures that support real workflows.",
    responsibilities: ["Data modeling", "Query design", "Reliable persistence"],
    technologies: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQL", "Data Modeling"],
    example: "A clear data model and query layer for reporting and everyday application use.",
  },
  {
    name: "DevOps",
    subtitle: "Cloud · Automation · Delivery",
    color: "#6d7cff",
    overview:
      "Supporting consistent delivery with practical automation, version control, and deployment workflows.",
    responsibilities: ["Version control", "Build automation", "Deployment workflows"],
    technologies: ["Git", "GitHub Actions", "Docker", "CI/CD", "Cloud Platforms", "Monitoring"],
    example: "A repeatable build and release workflow that helps teams ship confidently.",
  },
  {
    name: "Testing",
    subtitle: "Quality · Reliability · Confidence",
    color: "#73b7ff",
    overview:
      "Validating behavior across interfaces and services so changes remain dependable as products grow.",
    responsibilities: ["Unit testing", "Integration testing", "Regression coverage"],
    technologies: ["Vitest", "Jest", "React Testing Library", "Playwright", "Cypress", "API Testing"],
    example: "A focused test suite that catches regressions across key user journeys.",
  },
  {
    name: "System Design",
    subtitle: "Architecture · Scale · Trade-offs",
    color: "#c084fc",
    overview:
      "Designing clear system boundaries and practical data flows that support product needs as they evolve.",
    responsibilities: ["Architecture planning", "Service boundaries", "Scalability trade-offs"],
    technologies: ["REST", "Event-driven systems", "Caching", "Queues", "Cloud Architecture", "Observability"],
    example: "A documented service architecture with clear ownership and resilient data flows.",
  },
];

function GridBackground() {
  return <div className="software-grid-glow" aria-hidden="true" />;
}

function addWireframeGlobe(scene, color, geometry, outerGeometry) {
  const group = new THREE.Group();
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: "#071216",
    transparent: true,
    opacity: 0.62,
    depthWrite: false,
  });
  const core = new THREE.Mesh(geometry, coreMaterial);
  group.add(core);

  const wireMaterial = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
  });
  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(geometry),
    wireMaterial,
  );
  group.add(wire);

  const outlineMaterial = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
  });
  const outline = new THREE.LineSegments(
    new THREE.EdgesGeometry(outerGeometry),
    outlineMaterial,
  );
  group.add(outline);

  const nodeMaterial = new THREE.PointsMaterial({
    color,
    size: 0.035,
    transparent: true,
    opacity: 0.58,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  group.add(new THREE.Points(geometry, nodeMaterial));
  scene.add(group);

  return {
    group,
    materials: [coreMaterial, wireMaterial, outlineMaterial, nodeMaterial],
    wireMaterial,
  };
}

function SoftwareDevelopmentSection({ embedded = false }) {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const canvasHostRef = useRef(null);
  const layerTargetRefs = useRef([]);
  const layerCaptionRefs = useRef([]);
  const layerGroups = useRef([]);
  const interactionPulseRef = useRef(null);
  const activeLayerDragRef = useRef(null);
  const suppressLayerClickRef = useRef(false);
  const layerDetailCloseRef = useRef(null);
  const activeLayerTriggerRef = useRef(null);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(null);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host || !pinRef.current || !sectionRef.current) return undefined;

    let renderer;
    let animationFrame = 0;
    let resizeObserver;
    let disposed = false;
    let context;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.z = 8;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x080b0d, 0);
      host.appendChild(renderer.domElement);
    } catch (error) {
      console.error("Unable to initialize the software architecture globe.", error);
      host.dataset.webglUnavailable = "true";
    }

    const geometry = new THREE.IcosahedronGeometry(1.2, 2);
    const outerGeometry = new THREE.IcosahedronGeometry(1.215, 2);
    const singleGlobe = addWireframeGlobe(scene, "#5795ff", geometry, outerGeometry);
    const initialGlobeY = window.innerWidth > 760 ? -0.82 : -0.48;
    singleGlobe.group.position.y = initialGlobeY;

    const architecture = layers.slice(1).map((layer) => {
      const visual = addWireframeGlobe(scene, layer.color, geometry, outerGeometry);
      visual.group.scale.setScalar(0.001);
      visual.group.position.set(0, 0, 0);
      visual.materials.forEach((material) => {
        material.opacity = 0;
      });
      return visual;
    });
    layerGroups.current = [singleGlobe.group, ...architecture.map((visual) => visual.group)];

    const particleCount = 680;
    const particlePositions = new Float32Array(particleCount * 3);
    const trailPositions = new Float32Array(particleCount * 2 * 3);
    const trailAlphas = new Float32Array(particleCount * 2);
    const particleSizes = new Float32Array(particleCount);
    const particleAlphas = new Float32Array(particleCount);
    const particleVelocities = new Float32Array(particleCount * 3);
    const particleAccelerations = new Float32Array(particleCount * 3);
    const particleAges = new Float32Array(particleCount);
    const particleLifetimes = new Float32Array(particleCount);
    const particleBrightness = new Float32Array(particleCount);
    const particleDestinations = new Uint8Array(particleCount);
    let diffusionStarted = false;
    let seed = 16427;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const diffusion = { strength: 0, destination: 1 };
    const interactionPulse = { value: 0 };
    interactionPulseRef.current = interactionPulse;
    const destinationPositions = layers.map((_, index) => ({
      x: index % 2 === 0 ? -1.55 : 1.55,
      y: 1.4 - Math.floor(index / 2) * 1.4,
    }));
    const surfaceNormal = new THREE.Vector3();
    const emissionDirection = new THREE.Vector3();
    const targetDirection = new THREE.Vector3();
    const destinationPoint = new THREE.Vector3();
    const worldOrigin = new THREE.Vector3();
    const localOrigin = new THREE.Vector3();
    const coreGlowMaterial = new THREE.MeshBasicMaterial({
      color: "#91baff",
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const coreGlow = new THREE.Mesh(geometry, coreGlowMaterial);
    coreGlow.scale.setScalar(0.72);
    singleGlobe.group.add(coreGlow);

    const spawnParticle = (index, initialAge = 0) => {
      const offset = index * 3;
      const cosine = random() * 2 - 1;
      const theta = random() * Math.PI * 2;
      const sine = Math.sqrt(1 - cosine * cosine);
      localOrigin.set(
        1.205 * sine * Math.cos(theta),
        1.205 * cosine,
        1.205 * sine * Math.sin(theta),
      );
      worldOrigin.copy(localOrigin);
      singleGlobe.group.localToWorld(worldOrigin);

      surfaceNormal.copy(localOrigin).normalize()
        .applyQuaternion(singleGlobe.group.quaternion);
      const targetIndex = THREE.MathUtils.clamp(
        Math.round(diffusion.destination),
        1,
        layers.length - 1,
      );
      const targetPosition = destinationPositions[targetIndex];
      destinationPoint.set(targetPosition.x, targetPosition.y, 0);
      targetDirection.copy(destinationPoint).sub(worldOrigin).normalize();
      particleDestinations[index] = targetIndex;
      emissionDirection.set(
        0.55 + random() * 0.34,
        (random() - 0.5) * 0.95,
        (random() - 0.5) * 0.85,
      ).addScaledVector(surfaceNormal, 0.65)
        .addScaledVector(targetDirection, 0.7)
        .normalize();

      const speed = 0.72 + random() * 0.82;
      const lifetime = 2.1 + random() * 1.1;
      const age = Math.min(initialAge, lifetime * 0.72);
      const acceleration = 0.1 + random() * 0.2;
      particleVelocities[offset] = emissionDirection.x * speed;
      particleVelocities[offset + 1] = emissionDirection.y * speed;
      particleVelocities[offset + 2] = emissionDirection.z * speed;
      particleAccelerations[offset] = emissionDirection.x * acceleration;
      particleAccelerations[offset + 1] = emissionDirection.y * acceleration;
      particleAccelerations[offset + 2] = emissionDirection.z * acceleration;
      particleAges[index] = age;
      particleLifetimes[index] = lifetime;
      particleSizes[index] = 0.22 + random() * 0.34;
      particleBrightness[index] = 0.42 + random() * 0.18;

      particlePositions[offset] = worldOrigin.x
        + particleVelocities[offset] * age
        + 0.5 * particleAccelerations[offset] * age * age;
      particlePositions[offset + 1] = worldOrigin.y
        + particleVelocities[offset + 1] * age
        + 0.5 * particleAccelerations[offset + 1] * age * age;
      particlePositions[offset + 2] = worldOrigin.z
        + particleVelocities[offset + 2] * age
        + 0.5 * particleAccelerations[offset + 2] * age * age;
    };

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3),
    );
    particleGeometry.setAttribute(
      "aSize",
      new THREE.BufferAttribute(particleSizes, 1),
    );
    particleGeometry.setAttribute(
      "aAlpha",
      new THREE.BufferAttribute(particleAlphas, 1),
    );
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uStrength: { value: 0 },
        uColor: { value: new THREE.Color("#91baff") },
      },
      transparent: true,
      depthTest: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float aSize;
        attribute float aAlpha;
        uniform float uStrength;
        varying float vAlpha;
        void main() {
          vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * viewPosition;
          gl_PointSize = aSize * (72.0 / max(1.0, -viewPosition.z));
          vAlpha = aAlpha * uStrength;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float radius = length(gl_PointCoord - vec2(0.5));
          float glow = 1.0 - smoothstep(0.08, 0.5, radius);
          if (glow < 0.015) discard;
          gl_FragColor = vec4(uColor, glow * vAlpha);
        }
      `,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.frustumCulled = false;
    scene.add(particles);

    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(trailPositions, 3),
    );
    trailGeometry.setAttribute(
      "aAlpha",
      new THREE.BufferAttribute(trailAlphas, 1),
    );
    const trailMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uStrength: { value: 0 },
        uColor: { value: new THREE.Color("#8b6cff") },
      },
      transparent: true,
      depthTest: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float aAlpha;
        uniform float uStrength;
        varying float vAlpha;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vAlpha = aAlpha * uStrength;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          gl_FragColor = vec4(uColor, vAlpha);
        }
      `,
    });
    const trails = new THREE.LineSegments(trailGeometry, trailMaterial);
    trails.frustumCulled = false;
    scene.add(trails);

    const light = new THREE.PointLight("#7e9dff", 2, 9);
    light.position.set(-2.2, 2.4, 4);
    scene.add(light);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let activeDrag = null;
    let pointerDownPosition = null;
    let dragMoved = false;
    const canvas = renderer?.domElement;
    const findGlobeAtPointer = (event) => {
      if (!canvas) return null;
      const bounds = canvas.getBoundingClientRect();
      pointer.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      const coreMeshes = layerGroups.current.map((group) => group.children[0]);
      const hit = raycaster.intersectObjects(coreMeshes, false)[0];
      if (!hit) return null;
      return layerGroups.current.find((group) => group.children[0] === hit.object) ?? null;
    };
    const onPointerDown = (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      const target = findGlobeAtPointer(event);
      if (!target) return;
      activeDrag = target;
      pointerDownPosition = { x: event.clientX, y: event.clientY };
      dragMoved = false;
      canvas?.setPointerCapture(event.pointerId);
      if (canvas) canvas.style.cursor = "grabbing";
    };
    const onPointerMove = (event) => {
      if (!activeDrag || !pointerDownPosition) return;
      const deltaX = event.clientX - pointerDownPosition.x;
      const deltaY = event.clientY - pointerDownPosition.y;
      if (Math.hypot(deltaX, deltaY) > 2) dragMoved = true;
      activeDrag.rotation.y += deltaX * 0.008;
      activeDrag.rotation.x += deltaY * 0.008;
      pointerDownPosition = { x: event.clientX, y: event.clientY };
      event.preventDefault();
    };
    const onPointerUp = (event) => {
      if (!activeDrag) return;
      if (!dragMoved) interactionPulse.value = 1;
      activeDrag = null;
      pointerDownPosition = null;
      dragMoved = false;
      if (canvas) canvas.style.cursor = "grab";
    };
    canvas?.addEventListener("pointerdown", onPointerDown);
    canvas?.addEventListener("pointermove", onPointerMove);
    canvas?.addEventListener("pointerup", onPointerUp);
    canvas?.addEventListener("pointercancel", onPointerUp);
    if (canvas) canvas.style.cursor = "grab";

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height || !renderer) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();
    let isInView = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isInView = entry.isIntersecting;
    });
    visibilityObserver.observe(sectionRef.current);

    const lastTime = { value: performance.now() };
    const render = (now) => {
      if (disposed) return;
      animationFrame = window.requestAnimationFrame(render);
      const delta = Math.min((now - lastTime.value) / 1000, 0.04);
      lastTime.value = now;
      if (!isInView) return;
      if (!reducedMotion) {
        singleGlobe.group.rotation.y += delta * (0.12 + diffusion.strength * 0.38);
        singleGlobe.group.rotation.x += delta * 0.025;
        architecture.forEach((visual, index) => {
          visual.group.rotation.y += delta * (0.15 + index * 0.012);
          visual.group.rotation.x += delta * 0.018;
        });
      }
      singleGlobe.group.updateMatrixWorld(true);
      const activeDiffusion = !reducedMotion
        && (diffusion.strength > 0.005 || interactionPulse.value > 0.005);
      if (activeDiffusion && !diffusionStarted) {
        diffusionStarted = true;
        for (let i = 0; i < particleCount; i += 1) {
          spawnParticle(i, random() * 1.15);
        }
      }
      for (let i = 0; i < particleCount; i += 1) {
        const offset = i * 3;
        if (activeDiffusion) {
          particleAges[i] += delta;
          if (particleAges[i] >= particleLifetimes[i]) {
            spawnParticle(i);
          } else {
            const targetPosition = destinationPositions[particleDestinations[i]];
            destinationPoint.set(
              targetPosition.x - particlePositions[offset],
              targetPosition.y - particlePositions[offset + 1],
              -particlePositions[offset + 2],
            );
            const attraction = THREE.MathUtils.smoothstep(particleAges[i], 0.35, 1.15) * 0.72;
            if (destinationPoint.lengthSq() > 0.0001) {
              destinationPoint.normalize().multiplyScalar(attraction * delta);
              particleVelocities[offset] += destinationPoint.x;
              particleVelocities[offset + 1] += destinationPoint.y;
              particleVelocities[offset + 2] += destinationPoint.z;
            }
            particleVelocities[offset] += particleAccelerations[offset] * delta;
            particleVelocities[offset + 1] += particleAccelerations[offset + 1] * delta;
            particleVelocities[offset + 2] += particleAccelerations[offset + 2] * delta;
            particlePositions[offset] += particleVelocities[offset] * delta;
            particlePositions[offset + 1] += particleVelocities[offset + 1] * delta;
            particlePositions[offset + 2] += particleVelocities[offset + 2] * delta;
          }
        }

        const age = particleAges[i];
        const lifetime = particleLifetimes[i] || 1;
        const fadeIn = Math.min(age / 0.12, 1);
        const fadeOut = Math.min((lifetime - age) / 0.48, 1);
        const travelFade = Math.max(
          0,
          1 - Math.max(0, age - 0.75) * 0.22,
        );
        const alpha = Math.max(0, fadeIn * fadeOut * travelFade);
        particleAlphas[i] = alpha * particleBrightness[i];

        const trailOffset = i * 6;
        const trailLength = Math.min(0.34, 0.08 + age * 0.12);
        trailPositions[trailOffset] = particlePositions[offset];
        trailPositions[trailOffset + 1] = particlePositions[offset + 1];
        trailPositions[trailOffset + 2] = particlePositions[offset + 2];
        trailPositions[trailOffset + 3] = particlePositions[offset]
          - particleVelocities[offset] * trailLength;
        trailPositions[trailOffset + 4] = particlePositions[offset + 1]
          - particleVelocities[offset + 1] * trailLength;
        trailPositions[trailOffset + 5] = particlePositions[offset + 2]
          - particleVelocities[offset + 2] * trailLength;
        trailAlphas[i * 2] = alpha * 0.32;
        trailAlphas[i * 2 + 1] = alpha * 0.025;
      }
      particleGeometry.attributes.position.needsUpdate = true;
      particleGeometry.attributes.aAlpha.needsUpdate = true;
      trailGeometry.attributes.position.needsUpdate = true;
      trailGeometry.attributes.aAlpha.needsUpdate = true;
      const effectStrength = Math.min(1, diffusion.strength + interactionPulse.value);
      particleMaterial.uniforms.uStrength.value = effectStrength;
      trailMaterial.uniforms.uStrength.value = effectStrength;
      coreGlowMaterial.opacity = effectStrength * 0.2;
      interactionPulse.value = Math.max(0, interactionPulse.value - delta * 1.3);
      renderer?.render(scene, camera);
    };
    animationFrame = window.requestAnimationFrame(render);

    const createTimeline = (isDesktop) => {
      const section = sectionRef.current;
      const pin = pinRef.current;
      const title = section.querySelector(".software-development-heading");
      const stepLabel = section.querySelector(".software-development-step");
      if (!section || !pin || !title || !stepLabel) return undefined;

      const finalPositions = isDesktop
        ? [
            { x: -1.55, y: 1.4 },
            { x: 1.55, y: 1.4 },
            { x: -1.55, y: 0 },
            { x: 1.55, y: 0 },
            { x: -1.55, y: -1.4 },
            { x: 1.55, y: -1.4 },
          ]
        : [
            { x: -0.85, y: 1.4 },
            { x: 0.85, y: 1.4 },
            { x: -0.85, y: 0 },
            { x: 0.85, y: 0 },
            { x: -0.85, y: -1.4 },
            { x: 0.85, y: -1.4 },
          ];
      const finalScale = isDesktop ? 0.47 : 0.36;
      finalPositions.forEach((position, index) => {
        destinationPositions[index].x = position.x;
        destinationPositions[index].y = position.y;
      });

      if (reducedMotion) {
        gsap.set(title, { autoAlpha: 1, y: 0 });
        gsap.set(stepLabel, { autoAlpha: 0, y: 0 });
        singleGlobe.group.position.set(finalPositions[0].x, finalPositions[0].y, 0);
        singleGlobe.group.scale.setScalar(finalScale);
        gsap.set(singleGlobe.materials, { opacity: 0.72 });
        diffusion.strength = 0;
        coreGlowMaterial.opacity = 0;

        architecture.forEach((visual, index) => {
          const layerIndex = index + 1;
          visual.group.position.set(
            finalPositions[layerIndex].x,
            finalPositions[layerIndex].y,
            0,
          );
          visual.group.scale.setScalar(finalScale);
          visual.materials[0].opacity = 0.62;
          visual.materials[1].opacity = 0.72;
          visual.materials[2].opacity = 0.18;
        });
        gsap.set(layerCaptionRefs.current, { autoAlpha: 1, y: 0 });
        gsap.set(layerTargetRefs.current, { autoAlpha: 1 });
        return undefined;
      }

      context = gsap.context(() => {
        gsap.set(layerCaptionRefs.current, { autoAlpha: 1, y: 0 });
        gsap.set(layerTargetRefs.current, { autoAlpha: 1 });
        const timeline = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: isDesktop ? "+=2200" : "+=1100",
            scrub: 0.85,
            pin: isDesktop ? pin : false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const step = self.progress < 0.16
                ? "01 — SINGLE GLOBE"
                : self.progress < 0.35
                  ? "02 — PARTICLE DIFFUSION"
                  : self.progress < 0.58
                    ? "03 — GLOBES FORM"
                    : self.progress < 0.84
                      ? "04 — LAYERS CONNECT"
                      : "05 — SIX LAYERS";
              stepLabel.textContent = step;
            },
          },
        });

        timeline
          .to(singleGlobe.group.scale, {
            x: 1.08,
            y: 1.08,
            z: 1.08,
            duration: 0.22,
          }, 0.04)
          .to(diffusion, { strength: 1, duration: 0.18 }, 0.18)
          .to(coreGlowMaterial, { opacity: 0.2, duration: 0.18 }, 0.18)
          .to(singleGlobe.group.position, {
            x: finalPositions[0].x,
            y: finalPositions[0].y,
            duration: 0.34,
          }, 0.28)
          .to(singleGlobe.group.scale, {
            x: finalScale,
            y: finalScale,
            z: finalScale,
            duration: 0.3,
          }, 0.42)
          .to(singleGlobe.materials, { opacity: 0.8, duration: 0.2 }, 0.42)
          .to(title, { autoAlpha: 0, y: -24, duration: 0.2 }, 0.3)
          .to(diffusion, { strength: 0.2, duration: 0.3 }, 0.83)
          .to(coreGlowMaterial, { opacity: 0.04, duration: 0.3 }, 0.83)
          .to(stepLabel, { autoAlpha: 0, y: 12, duration: 0.18 }, 0.88);

        architecture.forEach((visual, index) => {
          const layerIndex = index + 1;
          const position = finalPositions[layerIndex];
          const revealAt = 0.34 + index * 0.105;
          visual.group.scale.setScalar(0.001);
          timeline
            .to(visual.group.position, {
              x: position.x,
              y: position.y,
              duration: 0.32,
            }, revealAt)
            .to(visual.group.scale, {
              x: finalScale,
              y: finalScale,
              z: finalScale,
              duration: 0.3,
            }, revealAt + 0.06)
            .to(visual.materials, {
              opacity: 0.82,
              duration: 0.28,
            }, revealAt + 0.05)
            .to(diffusion, {
              destination: layerIndex,
              strength: 1,
              duration: 0.08,
            }, revealAt)
            .to(diffusion, {
              strength: 0.62,
              duration: 0.16,
            }, revealAt + 0.08);
        });
      }, section);

      return () => context?.revert();
    };

    const media = gsap.matchMedia();
    media.add("(min-width: 761px)", () => createTimeline(true));
    media.add("(max-width: 760px)", () => {
      sectionRef.current?.classList.add("software-development-mobile");
      const cleanup = createTimeline(false);
      return () => {
        sectionRef.current?.classList.remove("software-development-mobile");
        cleanup?.();
      };
    });

    const updateOnSmoothScroll = () => ScrollTrigger.update();
    window.addEventListener("portfolio:lenis-scroll", updateOnSmoothScroll);
    window.addEventListener("resize", ScrollTrigger.refresh);
    ScrollTrigger.refresh();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      visibilityObserver.disconnect();
      canvas?.removeEventListener("pointerdown", onPointerDown);
      canvas?.removeEventListener("pointermove", onPointerMove);
      canvas?.removeEventListener("pointerup", onPointerUp);
      canvas?.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("portfolio:lenis-scroll", updateOnSmoothScroll);
      window.removeEventListener("resize", ScrollTrigger.refresh);
      media.revert();
      context?.revert();
      interactionPulseRef.current = null;
      scene.traverse((object) => {
        if (object.geometry && object.geometry !== geometry && object.geometry !== outerGeometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      geometry.dispose();
      outerGeometry.dispose();
      particleGeometry.dispose();
      trailGeometry.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
      layerGroups.current = [];
    };
  }, []);

  useEffect(() => {
    if (selectedLayerIndex === null) return undefined;
    layerDetailCloseRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedLayerIndex(null);
        activeLayerTriggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedLayerIndex]);

  const selectLayer = (index) => {
    setSelectedLayerIndex(index);
  };

  const openLayerDetails = (event, index) => {
    if (interactionPulseRef.current) {
      interactionPulseRef.current.value = 1;
    }
    activeLayerTriggerRef.current = event.currentTarget;
    selectLayer(index);
  };

  const beginLayerDrag = (event, index) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    activeLayerDragRef.current = {
      index,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveLayerDrag = (event) => {
    const drag = activeLayerDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.x;
    const deltaY = event.clientY - drag.y;
    if (Math.hypot(deltaX, deltaY) > 2) drag.moved = true;
    const group = layerGroups.current[drag.index];
    if (group) {
      group.rotation.y += deltaX * 0.008;
      group.rotation.x += deltaY * 0.008;
    }
    drag.x = event.clientX;
    drag.y = event.clientY;
    if (drag.moved) event.preventDefault();
  };

  const endLayerDrag = (event) => {
    const drag = activeLayerDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.moved) {
      suppressLayerClickRef.current = true;
      window.requestAnimationFrame(() => {
        suppressLayerClickRef.current = false;
      });
    }
    activeLayerDragRef.current = null;
  };

  return (
    <section
      className={`software-development-section${embedded ? " software-development-embedded" : ""}`}
      ref={sectionRef}
    >
      <GridBackground />
      <div className="software-development-pin" ref={pinRef}>
        <div className="software-development-canvas" ref={canvasHostRef} aria-hidden="true" />
        <div className="software-development-heading">
          <span>SOFTWARE DEVELOPMENT · SCROLL TO EXPAND</span>
          <h2>
            ONE SYSTEM.
            <br />
            <i>SIX LAYERS.</i>
          </h2>
          <p>Interfaces, services, data, and delivery—working as one.</p>
        </div>
        <div className="software-development-step">01 — SINGLE GLOBE</div>

        <div className="architecture-captions" aria-label="Software architecture layers">
          {layers.map((layer, index) => (
            <button
              className={`architecture-caption architecture-caption-${index + 1}`}
              key={layer.name}
              type="button"
              aria-label={`View ${layer.name} layer details`}
              aria-haspopup="dialog"
              ref={(element) => {
                layerCaptionRefs.current[index] = element;
              }}
              style={{ "--layer-color": layer.color }}
              onClick={(event) => openLayerDetails(event, index)}
            >
              <span>{layer.name}</span>
              <strong>{layer.subtitle}</strong>
            </button>
          ))}
        </div>

        <div className="architecture-globe-targets">
          {layers.map((layer, index) => (
            <button
              className={`architecture-globe-target architecture-globe-target-${index + 1}${
                selectedLayerIndex === index ? " is-selected" : ""
              }`}
              key={layer.name}
              type="button"
              aria-label={`View ${layer.name} layer details`}
              aria-pressed={selectedLayerIndex === index}
              aria-haspopup="dialog"
              ref={(element) => {
                layerTargetRefs.current[index] = element;
              }}
              onPointerDown={(event) => beginLayerDrag(event, index)}
              onPointerMove={moveLayerDrag}
              onPointerUp={endLayerDrag}
              onPointerCancel={endLayerDrag}
              onClick={(event) => {
                if (suppressLayerClickRef.current) {
                  event.preventDefault();
                  return;
                }
                openLayerDetails(event, index);
              }}
              onMouseEnter={() => {
                const wireMaterial = layerGroups.current[index]?.children[1]?.material;
                if (wireMaterial) {
                  gsap.to(wireMaterial, {
                    opacity: 1,
                    duration: 0.25,
                    overwrite: "auto",
                  });
                }
              }}
              onMouseLeave={() => {
                const wireMaterial = layerGroups.current[index]?.children[1]?.material;
                if (wireMaterial) {
                  gsap.to(wireMaterial, {
                    opacity: 0.72,
                    duration: 0.25,
                    overwrite: "auto",
                  });
                }
              }}
            />
          ))}
        </div>

        <div className="architecture-fallback-globes" aria-hidden="true">
          {layers.map((layer, index) => (
            <span
              className={`architecture-fallback-globe architecture-fallback-globe-${index + 1}`}
              key={layer.name}
              style={{ "--layer-color": layer.color }}
            />
          ))}
        </div>

        {selectedLayerIndex !== null && (
          <div
            className="architecture-detail-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedLayerIndex(null);
                activeLayerTriggerRef.current?.focus();
              }
            }}
          >
            <section
              className="architecture-detail-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="architecture-detail-title"
              style={{ "--layer-color": layers[selectedLayerIndex].color }}
            >
              <button
                className="architecture-detail-close"
                type="button"
                ref={layerDetailCloseRef}
                aria-label="Close layer details"
                onClick={() => {
                  setSelectedLayerIndex(null);
                  activeLayerTriggerRef.current?.focus();
                }}
              >
                <X size={18} />
              </button>
              <span className="architecture-detail-eyebrow">ARCHITECTURE LAYER</span>
              <h3 id="architecture-detail-title">{layers[selectedLayerIndex].name}</h3>
              <p className="architecture-detail-subtitle">
                {layers[selectedLayerIndex].subtitle}
              </p>
              <p className="architecture-detail-overview">
                {layers[selectedLayerIndex].overview}
              </p>
              <h4>Responsibilities</h4>
              <ul>
                {layers[selectedLayerIndex].responsibilities.map((responsibility) => (
                  <li key={responsibility}>{responsibility}</li>
                ))}
              </ul>
              <h4>Technologies</h4>
              <div className="architecture-technology-chips">
                {layers[selectedLayerIndex].technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
              <p className="architecture-detail-example">
                <strong>IN PRACTICE</strong>
                {layers[selectedLayerIndex].example}
              </p>
            </section>
          </div>
        )}
      </div>
    </section>
  );
}

export default SoftwareDevelopmentSection;
