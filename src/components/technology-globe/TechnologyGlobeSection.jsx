import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Activity,
  BarChart3,
  Brain,
  Boxes,
  Braces,
  ChartNoAxesCombined,
  Cloud,
  Code2,
  Database,
  GitBranch,
  HardDrive,
  Network,
  Radio,
  Server,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import "./technology-globe.css";

const focusAreas = [
  {
    name: "Data engineering",
    description: "Reliable ingestion, transformation, and storage.",
    technologies: [
      {
        name: "Database",
        Icon: Database,
        role: "Structured, dependable storage for the data products rely on.",
        example: "Design a clear data model for application records.",
      },
      {
        name: "Apache Spark",
        Icon: Zap,
        role: "Distributed processing for transformation-heavy workloads.",
        example: "Prepare large datasets for downstream analysis.",
      },
      {
        name: "Apache Kafka",
        Icon: Radio,
        role: "Streaming events between producers and consumers.",
        example: "Move application events into a processing pipeline.",
      },
      {
        name: "Cloud storage",
        Icon: Cloud,
        role: "Durable, accessible storage for files and data assets.",
        example: "Keep raw and processed files in a versioned data lake.",
      },
      {
        name: "ETL pipeline",
        Icon: Workflow,
        role: "Repeatable movement and transformation of trusted data.",
        example: "Validate and reshape incoming records before loading.",
      },
      {
        name: "Data warehouse",
        Icon: HardDrive,
        role: "A dependable foundation for reporting and exploration.",
        example: "Model clean, query-ready tables for product metrics.",
      },
    ],
  },
  {
    name: "AI engineering",
    description: "Useful model integrations grounded in trusted context.",
    technologies: [
      {
        name: "AI models",
        Icon: Brain,
        role: "Model capabilities applied to focused product problems.",
        example: "Summarize long-form information into useful insights.",
      },
      {
        name: "RAG systems",
        Icon: Network,
        role: "Grounded generation connected to relevant source material.",
        example: "Retrieve trusted documents before answering a question.",
      },
      {
        name: "Vector search",
        Icon: Boxes,
        role: "Finding semantically related content in context.",
        example: "Surface relevant knowledge from an embedding index.",
      },
      {
        name: "Model APIs",
        Icon: Sparkles,
        role: "Connecting product workflows to language model services.",
        example: "Add structured generation behind a typed service.",
      },
      {
        name: "AI workflows",
        Icon: Workflow,
        role: "Orchestrating useful, observable multi-step model tasks.",
        example: "Combine retrieval, generation, and output validation.",
      },
      {
        name: "Evaluation",
        Icon: Activity,
        role: "Checking model output quality against real expectations.",
        example: "Track groundedness and usefulness across test prompts.",
      },
    ],
  },
  {
    name: "Software development",
    description: "Maintainable interfaces, services, and tests.",
    technologies: [
      {
        name: "React",
        Icon: Boxes,
        role: "Building responsive, component-driven product experiences.",
        example: "Compose reusable UI for a data-rich dashboard.",
      },
      {
        name: "TypeScript",
        Icon: Braces,
        role: "Keeping application logic predictable as products grow.",
        example: "Share safe contracts between UI and API layers.",
      },
      {
        name: "Node.js",
        Icon: Server,
        role: "Connecting interfaces to dependable application services.",
        example: "Build API routes for an interactive product feature.",
      },
      {
        name: "APIs",
        Icon: Network,
        role: "Making clear, dependable contracts between services.",
        example: "Integrate external data through a typed service layer.",
      },
      {
        name: "Git",
        Icon: GitBranch,
        role: "Keeping collaboration and iteration clear and dependable.",
        example: "Review focused changes through a feature branch.",
      },
      {
        name: "Testing",
        Icon: Code2,
        role: "Verifying important behavior as the application evolves.",
        example: "Cover key user flows with reliable component tests.",
      },
    ],
  },
  {
    name: "Data analytics",
    description: "Clear metrics, exploration, and communication.",
    technologies: [
      {
        name: "SQL",
        Icon: Database,
        role: "Exploring and shaping data into answers people can use.",
        example: "Build a clear query for weekly product engagement.",
      },
      {
        name: "Python",
        Icon: Braces,
        role: "A flexible toolkit for analysis and repeatable exploration.",
        example: "Clean and inspect a dataset before visualization.",
      },
      {
        name: "Dashboards",
        Icon: ChartNoAxesCombined,
        role: "Making important measures clear at a glance.",
        example: "Present adoption trends with an interactive dashboard.",
      },
      {
        name: "Data insights",
        Icon: BarChart3,
        role: "Finding useful patterns and explaining what they mean.",
        example: "Compare cohorts to understand a change in retention.",
      },
      {
        name: "Reporting",
        Icon: Activity,
        role: "Sharing consistent metrics with clear context.",
        example: "Publish a concise weekly performance summary.",
      },
      {
        name: "Data models",
        Icon: Boxes,
        role: "Defining consistent measures across analysis workflows.",
        example: "Use shared metric definitions across reports.",
      },
    ],
  },
];

function GridBackground() {
  return <div className="technology-grid-glow" aria-hidden="true" />;
}

function FocusAreaCard({ area, index, isActive, isDimmed, onSelect }) {
  return (
    <button
      className={`focus-area-card${isActive ? " is-active" : ""}${
        isDimmed ? " is-dimmed" : ""
      }`}
      type="button"
      aria-pressed={isActive}
      onClick={onSelect}
    >
      <span className="focus-area-label">
        <span>0{index + 1}</span>
        <span>·</span>
        FOCUS AREA
      </span>
      <strong>{area.name}</strong>
      <span className="focus-area-description">{area.description}</span>
    </button>
  );
}

function TechnologyGlobe({ area, selectedTechnology, onSelectTechnology }) {
  const stageRef = useRef(null);
  const canvasHostRef = useRef(null);
  const nodeRefs = useRef([]);
  const technologiesRef = useRef(area.technologies);
  const [webglError, setWebglError] = useState("");

  technologiesRef.current = area.technologies;

  useEffect(() => {
    const host = canvasHostRef.current;
    const stage = stageRef.current;
    if (!host || !stage) return undefined;

    let renderer;
    let animationFrame = 0;
    let resizeObserver;
    let visibilityObserver;
    let isDisposed = false;
    let isInView = false;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 100);
    camera.position.z = 5.5;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setClearColor(0x080b0d, 0);
      host.appendChild(renderer.domElement);
    } catch {
      setWebglError("WebGL is unavailable. Technology details remain available below.");
      return undefined;
    }

    const globe = new THREE.Group();
    scene.add(globe);

    const coreGeometry = new THREE.SphereGeometry(1.46, 24, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: "#07171d",
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide,
    });
    globe.add(new THREE.Mesh(coreGeometry, coreMaterial));

    const meshGeometry = new THREE.SphereGeometry(1.49, 32, 24);
    const wireGeometry = new THREE.WireframeGeometry(meshGeometry);
    const wireMaterial = new THREE.LineBasicMaterial({
      color: "#679aff",
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
    globe.add(new THREE.LineSegments(wireGeometry, wireMaterial));

    const outerGeometry = new THREE.SphereGeometry(1.505, 32, 24);
    const outerEdges = new THREE.WireframeGeometry(outerGeometry);
    outerGeometry.dispose();
    const outerMaterial = new THREE.LineBasicMaterial({
      color: "#a87cff",
      transparent: true,
      opacity: 0.045,
      depthWrite: false,
    });
    globe.add(new THREE.LineSegments(outerEdges, outerMaterial));

    const vertexPositions = meshGeometry.attributes.position;
    const uniqueVertices = new Map();
    for (let i = 0; i < vertexPositions.count; i += 1) {
      const point = new THREE.Vector3().fromBufferAttribute(vertexPositions, i);
      const key = `${point.x.toFixed(3)}:${point.y.toFixed(3)}:${point.z.toFixed(3)}`;
      if (!uniqueVertices.has(key)) uniqueVertices.set(key, point);
    }
    const points = new Float32Array(
      [...uniqueVertices.values()].flatMap((point) => [
        point.x,
        point.y,
        point.z,
      ]),
    );
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(points, 3),
    );
    meshGeometry.dispose();
    const pointMaterial = new THREE.PointsMaterial({
      color: "#c0d7ff",
      size: 0.012,
      transparent: true,
      opacity: 0.32,
      sizeAttenuation: true,
    });
    globe.add(new THREE.Points(pointGeometry, pointMaterial));

    scene.add(new THREE.HemisphereLight(0xb9caff, 0x111027, 1.3));
    const keyLight = new THREE.PointLight(0x679aff, 2.3, 8);
    keyLight.position.set(-2.4, 2.8, 4);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0x087dff, 1.2, 7);
    fillLight.position.set(2.8, -1.8, 2.5);
    scene.add(fillLight);

    const resize = () => {
      if (!renderer || !host.clientWidth || !host.clientHeight) return;
      const width = host.clientWidth;
      const height = host.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const rotationVelocity = { x: 0, y: 0 };
    const lastNodePositions = new WeakMap();
    let pointer = null;
    let lastTime = performance.now();
    const projected = new THREE.Vector3();
    const nodeVector = new THREE.Vector3();
    const onFrame = (now) => {
      if (isDisposed || !isInView) return;
      animationFrame = window.requestAnimationFrame(onFrame);
      const delta = Math.min((now - lastTime) / 1000, 0.04);
      lastTime = now;

      if (pointer) {
        globe.rotation.y += pointer.dx * 0.006;
        globe.rotation.x += pointer.dy * 0.004;
        rotationVelocity.y = pointer.dx * 0.0002;
        rotationVelocity.x = pointer.dy * 0.00014;
        pointer.dx = 0;
        pointer.dy = 0;
      } else {
        if (!reducedMotion) globe.rotation.y += delta * 0.055;
        globe.rotation.y += rotationVelocity.y;
        globe.rotation.x += rotationVelocity.x;
        rotationVelocity.x *= 0.96;
        rotationVelocity.y *= 0.96;
      }
      globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x, -0.55, 0.55);

      const technologies = technologiesRef.current;
      const stageWidth = stage.clientWidth;
      const stageHeight = stage.clientHeight;
      technologies.forEach((technology, index) => {
        const element = nodeRefs.current[index];
        if (!element) return;

        const count = technologies.length;
        const y = 1 - ((index + 0.5) / count) * 2;
        const radius = Math.sqrt(1 - y * y);
        const angle = index * Math.PI * (3 - Math.sqrt(5));
        nodeVector
          .set(
            Math.cos(angle) * radius * 1.67,
            y * 1.67,
            Math.sin(angle) * radius * 1.67,
          )
          .applyEuler(globe.rotation);
        projected.copy(nodeVector).project(camera);
        const x = (projected.x * 0.5 + 0.5) * stageWidth;
        const screenY = (-projected.y * 0.5 + 0.5) * stageHeight;
        const lastPosition = lastNodePositions.get(element);
        if (
          !lastPosition ||
          Math.abs(lastPosition.x - x) > 0.35 ||
          Math.abs(lastPosition.y - screenY) > 0.35
        ) {
          element.style.left = `${x}px`;
          element.style.top = `${screenY}px`;
          lastNodePositions.set(element, { x, y: screenY });
        }
        element.style.setProperty("--node-depth", `${nodeVector.z}`);
        element.style.opacity = nodeVector.z < -0.45 ? "0.42" : "1";
      });

      renderer.render(scene, camera);
    };
    visibilityObserver = new IntersectionObserver(([entry]) => {
      if (!entry || isDisposed) return;

      if (entry.isIntersecting) {
        if (!isInView) {
          isInView = true;
          lastTime = performance.now();
          animationFrame = window.requestAnimationFrame(onFrame);
        }
      } else {
        isInView = false;
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    });
    visibilityObserver.observe(stage);

    const handlePointerDown = (event) => {
      if (event.button !== 0 || event.target.closest(".technology-node")) {
        return;
      }
      stage.setPointerCapture(event.pointerId);
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, dy: 0 };
      rotationVelocity.x = 0;
      rotationVelocity.y = 0;
      stage.classList.add("is-dragging");
    };
    const handlePointerMove = (event) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      pointer.dx = event.clientX - pointer.x;
      pointer.dy = event.clientY - pointer.y;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const handlePointerUp = (event) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      pointer = null;
      stage.classList.remove("is-dragging");
    };
    stage.addEventListener("pointerdown", handlePointerDown);
    stage.addEventListener("pointermove", handlePointerMove);
    stage.addEventListener("pointerup", handlePointerUp);
    stage.addEventListener("pointercancel", handlePointerUp);

    return () => {
      isDisposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      stage.removeEventListener("pointerdown", handlePointerDown);
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerup", handlePointerUp);
      stage.removeEventListener("pointercancel", handlePointerUp);
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      coreGeometry.dispose();
      wireGeometry.dispose();
      pointGeometry.dispose();
      outerEdges.dispose();
    };
  }, []);

  const activeTechnologyIndex = area.technologies.findIndex(
    (technology) => technology.name === selectedTechnology?.name,
  );

  return (
    <div className="globe-visualization">
      <div className="globe-heading" aria-live="polite">
        <h3>{area.name} technology globe</h3>
        <p>
          Drag to rotate the globe or select a technology to inspect its role
          and examples.
        </p>
      </div>
      <div
        className={`globe-stage${webglError ? " has-webgl-error" : ""}`}
        ref={stageRef}
      >
        <div className="globe-canvas-host" ref={canvasHostRef} aria-hidden="true" />
        {!webglError && (
          <>
            {area.technologies.map(({ name, Icon }, index) => (
              <button
                className={`technology-node${
                  activeTechnologyIndex === index ? " is-selected" : ""
                }`}
                key={`${area.name}-${name}`}
                type="button"
                ref={(element) => {
                  nodeRefs.current[index] = element;
                }}
                aria-label={`Inspect ${name}`}
                aria-pressed={activeTechnologyIndex === index}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => onSelectTechnology(area.technologies[index])}
              >
                <Icon size={20} strokeWidth={2.1} aria-hidden="true" />
              </button>
            ))}
          </>
        )}
        {webglError && (
          <div className="globe-webgl-fallback" role="status">
            <Network size={38} aria-hidden="true" />
            <span>Interactive technology map</span>
          </div>
        )}
      </div>
      {selectedTechnology && (
        <aside className="technology-info-panel" aria-live="polite">
          <div className="technology-info-icon" aria-hidden="true">
            <selectedTechnology.Icon size={20} />
          </div>
          <div>
            <div className="technology-info-heading">
              <strong>{selectedTechnology.name}</strong>
              <span>{area.name}</span>
            </div>
            <p>{selectedTechnology.role}</p>
            <small>{selectedTechnology.example}</small>
          </div>
        </aside>
      )}
    </div>
  );
}

export default function TechnologyGlobeSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasSelectedArea, setHasSelectedArea] = useState(false);
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const area = focusAreas[activeIndex];
  const activeTechnology = selectedTechnology
    ? area.technologies.find(
        (technology) => technology.name === selectedTechnology.name,
      ) ?? null
    : null;
  return (
    <section className="technology-globe-section">
      <GridBackground />
      <div className="technology-section-content">
        <div className="technology-section-eyebrow">
          <span>02</span> — TECHNOLOGY &amp; PRACTICE
        </div>
        <div className="focus-area-grid" aria-label="Focus areas">
          {focusAreas.map((focusArea, index) => (
            <FocusAreaCard
              key={focusArea.name}
              area={focusArea}
              index={index}
              isActive={activeIndex === index}
              isDimmed={hasSelectedArea && activeIndex !== index}
              onSelect={() => {
                setActiveIndex(index);
                setHasSelectedArea(true);
                setSelectedTechnology(null);
              }}
            />
          ))}
        </div>
        <div className="toolkit-orbit-card">
          <TechnologyGlobe
            area={area}
            selectedTechnology={activeTechnology}
            onSelectTechnology={setSelectedTechnology}
          />
        </div>
      </div>
    </section>
  );
}
