/**
 * spring-viewer.ts
 * Shared THREE.js infrastructure for all spring 3D viewers on the site.
 * Used by ProductCard (auto-rotate preview) and SpringProductViewer (full interactive).
 */
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

const STL_CACHE_NAME = 'jc-resortes-stl-v1';
const stlGeometryCache = new Map<string, Promise<THREE.BufferGeometry>>();
const stlLoader = new STLLoader();

// ── Per-product parametric configs ─────────────────────────────────────────────
export type SpringConfig = {
  radius: number;
  height: number;
  turns: number;
  tube: number;
  segments?: number;
  radialSegments?: number;
};

export const SPRING_CONFIGS: Record<string, SpringConfig> = {
  compresion:    { radius: 0.50, height: 3.5, turns: 8,  tube: 0.095, segments: 140, radialSegments: 12 },
  tension:       { radius: 0.38, height: 5.0, turns: 13, tube: 0.070, segments: 140, radialSegments: 10 },
  torsion:       { radius: 0.45, height: 2.5, turns: 5,  tube: 0.085, segments: 140, radialSegments: 10 },
  'gran-escala': { radius: 0.65, height: 4.5, turns: 7,  tube: 0.160, segments: 140, radialSegments: 14 },
};

// Default config when productId is unknown
const DEFAULT_CONFIG: SpringConfig = SPRING_CONFIGS['compresion'];

// ── Shared material ─────────────────────────────────────────────────────────────
export function createSpringMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color:     0xb8c8a8,
    metalness: 0.80,
    roughness: 0.22,
  });
}

// ── Procedural spring geometry ──────────────────────────────────────────────────
export function buildProceduralGeometry(productId: string, lowDetail = false): THREE.BufferGeometry {
  const cfg = SPRING_CONFIGS[productId] ?? DEFAULT_CONFIG;
  const { radius, height, turns, tube, segments = 140, radialSegments = 10 } = cfg;

  // lowDetail halves segments for small card previews (~75% fewer vertices)
  const seg  = lowDetail ? Math.ceil(segments / 2) : segments;
  const rSeg = lowDetail ? Math.max(6, Math.ceil(radialSegments / 2)) : radialSegments;

  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= seg; i++) {
    const t     = i / seg;
    const angle = t * Math.PI * 2 * turns;
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      (t - 0.5) * height,
      Math.sin(angle) * radius,
    ));
  }
  const curve = new THREE.CatmullRomCurve3(points);
  return new THREE.TubeGeometry(curve, seg, tube, rSeg, false);
}

// ── Scene / camera / renderer / lights ─────────────────────────────────────────
export type ViewerBase = {
  scene:    THREE.Scene;
  camera:   THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  /** Sync renderer size and camera aspect to the parent element */
  resize(): void;
  /** Start observing parent for size changes */
  observeResize(parent: Element): ResizeObserver;
};

export type CreateViewerOptions = {
  /** When true the WebGL canvas background is fully transparent (for cards on light bg) */
  transparent?: boolean;
  /** Initial camera Z position. Default: 10 */
  cameraZ?: number;
  /** Camera field of view. Default: 40 */
  fov?: number;
};

export function createViewerBase(
  canvas: HTMLCanvasElement,
  options: CreateViewerOptions = {},
): ViewerBase {
  const { transparent = false, cameraZ = 10, fov = 40 } = options;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  camera.position.set(0, 0, cameraZ);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  if (transparent) renderer.setClearColor(0x000000, 0);

  // Lights — industrial palette
  scene.add(new THREE.HemisphereLight(0xf0f8e8, 0x0d1a08, 1.1));

  const key = new THREE.DirectionalLight(0xffffff, 2.5);
  key.position.set(4, 6, 8);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x428c0d, 0.7);
  fill.position.set(-5, -3, 3);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0x9cd7ff, 0.4);
  rim.position.set(0, -6, -4);
  scene.add(rim);

  function resize() {
    const parent = canvas.parentElement;
    const w = parent?.clientWidth  ?? canvas.clientWidth;
    const h = parent?.clientHeight ?? canvas.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function observeResize(parent: Element): ResizeObserver {
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    return ro;
  }

  return { scene, camera, renderer, resize, observeResize };
}

async function fetchStlArrayBuffer(url: string): Promise<ArrayBuffer> {
  let cache: Cache | null = null;
  try {
    cache = 'caches' in window ? await caches.open(STL_CACHE_NAME) : null;
  } catch {
    cache = null;
  }

  const cached = await cache?.match(url);

  if (cached) return cached.arrayBuffer();

  const response = await fetch(url, { cache: 'force-cache' });
  if (!response.ok) {
    throw new Error(`Failed to load STL ${url}: ${response.status}`);
  }

  try {
    await cache?.put(url, response.clone());
  } catch {
    // Cache storage is an optimization only; rendering must not depend on it.
  }

  return response.arrayBuffer();
}

export function loadStlGeometry(url: string): Promise<THREE.BufferGeometry> {
  const absoluteUrl = new URL(url, window.location.origin).toString();
  const cachedGeometry = stlGeometryCache.get(absoluteUrl);
  if (cachedGeometry) return cachedGeometry;

  const geometryPromise = fetchStlArrayBuffer(absoluteUrl).then((buffer) => {
    const geometry = stlLoader.parse(buffer);
    geometry.computeVertexNormals();
    return geometry;
  }).catch((error) => {
    stlGeometryCache.delete(absoluteUrl);
    throw error;
  });

  stlGeometryCache.set(absoluteUrl, geometryPromise);
  return geometryPromise;
}

// ── Mesh loading: STL → fallback STL → procedural ──────────────────────────────
/**
 * Loads /models/{productId}.stl. If not found, falls back to /models/default.stl.
 * If that also fails, builds the procedural spring geometry for productId.
 * Adds the resulting mesh to `scene` and calls onReady(mesh).
 */
export function loadProductMesh(
  scene:      THREE.Scene,
  productId:  string,
  onReady?:   (mesh: THREE.Mesh) => void,
  lowDetail = false,
): void {
  const material = createSpringMaterial();

  function addMesh(geometry: THREE.BufferGeometry) {
    geometry = geometry.clone();
    geometry.computeVertexNormals();

    // Normalize size: scale so the largest axis fits in ~targetSize units
    geometry.computeBoundingBox();
    const box  = geometry.boundingBox!;
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxAxis = Math.max(size.x, size.y, size.z);
    // Center at origin
    const center = new THREE.Vector3();
    box.getCenter(center);
    geometry.translate(-center.x, -center.y, -center.z);

    const mesh = new THREE.Mesh(geometry, material);
    if (maxAxis > 0) mesh.scale.setScalar(4.0 / maxAxis);

    scene.add(mesh);
    onReady?.(mesh);
  }

  function useProcedural() {
    addMesh(buildProceduralGeometry(productId, lowDetail));
  }

  async function loadWithFallback(url: string, nextUrl: string | null) {
    try {
      addMesh(await loadStlGeometry(url));
    } catch {
      // This URL failed — try nextUrl or use procedural
      if (nextUrl) {
        loadWithFallback(nextUrl, null);
      } else {
        useProcedural();
      }
    }
  }

  loadWithFallback(`/models/${productId}.stl`, '/models/default.stl');
}
