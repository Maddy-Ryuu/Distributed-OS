/**
 * DISTRIBUTED OPERATING SYSTEM - 3D SEMINAR SIMULATION
 * Interactive educational demonstration of DOS concepts.
 * 
 * Architecture:
 * - AudioSynth: Web Audio API synthesized sound generator (zero asset dependencies)
 * - Simulation3D: Three.js scene, lighting, procedural models, animations & renderer
 * - ClusterManager: Distributed OS state, nodes, servers, network cables, packet routing
 * - ScenarioController: The 6 interactive seminar demonstrations
 * - PresentationController: Full-screen projector presentation mode & slide orchestration
 * - UIController: HUD, logs, inspector, and user event bindings
 */

// ============================================================================
// 1. AUDIO SYNTHESIZER (Pure Web Audio API - Zero External Files)
// ============================================================================
class AudioSynth {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playPacketSend() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  playPacketArrive() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  playPrinter() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    // Simulate mechanical printer stepper motor buzz
    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.12;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140 + i * 20, t);
      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    }
  }

  playAlarm() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.setValueAtTime(220, now + 0.15);
    osc.frequency.setValueAtTime(280, now + 0.3);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.46);
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.08;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.26);
    });
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, now);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }
}

// Global Sound Instance
const audio = new AudioSynth();


// ============================================================================
// 2. 3D SIMULATION ENGINE (Three.js Scene, Materials & Models)
// ============================================================================
class Simulation3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Three.js Core
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050811);
    this.scene.fog = new THREE.FogExp2(0x050811, 0.018);

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 24, 30);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // OrbitControls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't dip below floor
    this.controls.minDistance = 6;
    this.controls.maxDistance = 65;
    this.controls.target.set(0, 2, 0);

    // Raycaster for object clicking
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Groups & Object References
    this.workstationsGroup = new THREE.Group();
    this.cablesGroup = new THREE.Group();
    this.packetsGroup = new THREE.Group();
    this.scene.add(this.workstationsGroup);
    this.scene.add(this.cablesGroup);
    this.scene.add(this.packetsGroup);

    // Interactive references
    this.workstations = []; // array of { id, group, mesh, labelEl, data }
    this.controllerObject = null;
    this.databaseA = null;
    this.databaseB = null;
    this.printerObject = null;
    this.printerPaperMesh = null;
    this.heartbeatLine = null;

    // Active moving data packets
    this.activePackets = [];

    // Animated objects update list
    this.updatables = [];

    // Init Scene Assets
    this.initLights();
    this.initEnvironment();
    this.initControllerCore();
    this.initSharedDatabase();
    this.initSharedPrinter();

    // Event Listeners
    window.addEventListener('resize', this.onResize.bind(this));
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));

    // Animation Loop
    this.clock = new THREE.Clock();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initLights() {
    // Ambient soft navy light
    const ambientLight = new THREE.AmbientLight(0x0c1a30, 1.2);
    this.scene.add(ambientLight);

    // Main overhead studio key light
    const dirLight = new THREE.DirectionalLight(0xd0e6ff, 1.4);
    dirLight.position.set(15, 30, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 70;
    const d = 25;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    this.scene.add(dirLight);

    // Central DOS Controller point light (Cyan Glow)
    this.corePointLight = new THREE.PointLight(0x00f0ff, 3.0, 30);
    this.corePointLight.position.set(0, 4, 0);
    this.scene.add(this.corePointLight);

    // Database cluster point light (Blue Glow)
    this.dbPointLight = new THREE.PointLight(0x3b82f6, 2.5, 20);
    this.dbPointLight.position.set(14, 4, 0);
    this.scene.add(this.dbPointLight);

    // Shared Printer point light (Green Glow)
    this.printerPointLight = new THREE.PointLight(0x00ff88, 2.0, 18);
    this.printerPointLight.position.set(-14, 3.5, 0);
    this.scene.add(this.printerPointLight);
  }

  initEnvironment() {
    // Cybernetic Grid Floor
    const floorSize = 80;
    const floorGeo = new THREE.PlaneGeometry(floorSize, floorSize, 40, 40);
    
    // Create dark metallic floor material
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x080f22,
      roughness: 0.25,
      metalness: 0.85
    });

    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Grid Helper with Cyan & Blue tones
    const grid = new THREE.GridHelper(80, 80, 0x00f0ff, 0x11284a);
    grid.position.y = 0.01;
    this.scene.add(grid);

    // Concentric glowing bus rings on floor
    const ringRadii = [6, 12, 18];
    ringRadii.forEach((radius) => {
      const ringGeo = new THREE.RingGeometry(radius - 0.06, radius + 0.06, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = 0.02;
      this.scene.add(ringMesh);
    });

    // Outer subtle boundary glow pillars
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      const px = Math.cos(angle) * 28;
      const pz = Math.sin(angle) * 28;
      const pillarGeo = new THREE.CylinderGeometry(0.2, 0.2, 8, 16);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x0f2342,
        roughness: 0.4,
        metalness: 0.9,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.1
      });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(px, 4, pz);
      this.scene.add(pillar);

      // Light beacon on top of pillar
      const beaconGeo = new THREE.SphereGeometry(0.25, 16, 16);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(px, 8.2, pz);
      this.scene.add(beacon);
    }
  }

  // ==========================================================================
  // CENTRAL DOS CONTROLLER CORE (The Orchestrator)
  // ==========================================================================
  initControllerCore() {
    this.controllerGroup = new THREE.Group();
    this.controllerGroup.position.set(0, 0, 0);

    // Tiered Hexagonal Platform Base
    const baseGeo = new THREE.CylinderGeometry(3.2, 3.6, 0.6, 6);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0b172e,
      roughness: 0.3,
      metalness: 0.9
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.3;
    base.receiveShadow = true;
    base.castShadow = true;
    this.controllerGroup.add(base);

    // Secondary Platform with glowing trim
    const trimGeo = new THREE.CylinderGeometry(2.6, 2.8, 0.4, 6);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x060d1c,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.35,
      roughness: 0.4,
      metalness: 0.8
    });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.y = 0.8;
    this.controllerGroup.add(trim);

    // Central Glass Column / Hologram Projector
    const columnGeo = new THREE.CylinderGeometry(0.8, 1.2, 1.6, 16);
    const columnMat = new THREE.MeshStandardMaterial({
      color: 0x142b52,
      roughness: 0.1,
      metalness: 0.95,
      transparent: true,
      opacity: 0.85
    });
    const column = new THREE.Mesh(columnGeo, columnMat);
    column.position.y = 1.8;
    this.controllerGroup.add(column);

    // Floating Holographic Core Crystal (Icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(0.9, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.2,
      wireframe: false
    });
    this.hologramCore = new THREE.Mesh(coreGeo, coreMat);
    this.hologramCore.position.y = 3.6;
    this.controllerGroup.add(this.hologramCore);

    // Wireframe Cage around Hologram Core
    const cageGeo = new THREE.IcosahedronGeometry(1.25, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x70d6ff,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    this.hologramCage = new THREE.Mesh(cageGeo, cageMat);
    this.hologramCage.position.y = 3.6;
    this.controllerGroup.add(this.hologramCage);

    // Outer Rotating Gyroscopic Rings
    const ring1Geo = new THREE.TorusGeometry(1.9, 0.05, 16, 64);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.7,
      roughness: 0.2
    });
    this.ring1 = new THREE.Mesh(ring1Geo, ringMat1);
    this.ring1.position.y = 3.6;
    this.ring1.rotation.x = Math.PI / 4;
    this.controllerGroup.add(this.ring1);

    const ring2Geo = new THREE.TorusGeometry(2.3, 0.05, 16, 64);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.7,
      roughness: 0.2
    });
    this.ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    this.ring2.position.y = 3.6;
    this.ring2.rotation.y = Math.PI / 3;
    this.controllerGroup.add(this.ring2);

    // Vertical Holographic Light Beam (Translucent Cylinder)
    const beamGeo = new THREE.CylinderGeometry(0.35, 1.2, 9, 32, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = 6.5;
    this.controllerGroup.add(beam);

    this.scene.add(this.controllerGroup);
    this.controllerObject = this.controllerGroup;

    // Attach HTML label for DOS controller
    this.createWorldLabel(
      'label-controller',
      '🌀 DOS KERNEL ORCHESTRATOR',
      'Single System Image • Central Resource Manager',
      new THREE.Vector3(0, 5.4, 0),
      'active'
    );
  }

  // ==========================================================================
  // SHARED DATABASE CLUSTER (Primary DB-01 & Standby DB-02)
  // ==========================================================================
  initSharedDatabase() {
    const dbClusterGroup = new THREE.Group();
    dbClusterGroup.position.set(14, 0, 0);

    // Raised Server Platform
    const platGeo = new THREE.BoxGeometry(6.5, 0.4, 5);
    const platMat = new THREE.MeshStandardMaterial({
      color: 0x091428,
      roughness: 0.4,
      metalness: 0.8
    });
    const platform = new THREE.Mesh(platGeo, platMat);
    platform.position.y = 0.2;
    platform.receiveShadow = true;
    dbClusterGroup.add(platform);

    // Build Server Cabinet 1 (DB-01 Primary)
    this.databaseA = this.buildServerRack('DB-01', true);
    this.databaseA.position.set(-1.6, 0.4, 0);
    dbClusterGroup.add(this.databaseA);

    // Build Server Cabinet 2 (DB-02 Standby Replicant)
    this.databaseB = this.buildServerRack('DB-02', false);
    this.databaseB.position.set(1.6, 0.4, 0);
    dbClusterGroup.add(this.databaseB);

    // Heartbeat Sync Cable / Line between Server A and Server B
    const hbMat = new THREE.LineBasicMaterial({ color: 0x00ff88, linewidth: 2 });
    const hbPoints = [
      new THREE.Vector3(12.4, 3.2, 0),
      new THREE.Vector3(15.6, 3.2, 0)
    ];
    const hbGeo = new THREE.BufferGeometry().setFromPoints(hbPoints);
    this.heartbeatLine = new THREE.Line(hbGeo, hbMat);
    this.scene.add(this.heartbeatLine);

    this.scene.add(dbClusterGroup);

    // Labels
    this.createWorldLabel(
      'label-db-a',
      '🗄️ SERVER DB-01 (PRIMARY)',
      'Replicated RDBMS Cluster',
      new THREE.Vector3(12.4, 4.4, 0),
      'active'
    );

    this.createWorldLabel(
      'label-db-b',
      '🗄️ SERVER DB-02 (STANDBY)',
      'Real-time Paxos Replica',
      new THREE.Vector3(15.6, 4.4, 0),
      'active'
    );
  }

  buildServerRack(name, isPrimary) {
    const rack = new THREE.Group();
    rack.userData = { id: name, isPrimary: isPrimary, isFailed: false };

    // Outer Cabinet Shell
    const shellGeo = new THREE.BoxGeometry(1.8, 3.4, 1.6);
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0x111c33,
      roughness: 0.35,
      metalness: 0.85
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.position.y = 1.7;
    shell.castShadow = true;
    shell.receiveShadow = true;
    rack.add(shell);
    rack.shellMesh = shell;

    // Rack Units / Server Blades
    for (let u = 0; u < 5; u++) {
      const bladeGeo = new THREE.BoxGeometry(1.55, 0.45, 0.15);
      const bladeMat = new THREE.MeshStandardMaterial({
        color: 0x070d1a,
        roughness: 0.2,
        metalness: 0.9
      });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(0, 0.6 + u * 0.55, 0.82);
      rack.add(blade);

      // Blinking status LEDs on each blade
      for (let l = 0; l < 4; l++) {
        const ledGeo = new THREE.BoxGeometry(0.06, 0.06, 0.02);
        const ledMat = new THREE.MeshBasicMaterial({
          color: isPrimary ? 0x00ff88 : 0x00f0ff
        });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(-0.5 + l * 0.14, 0.6 + u * 0.55, 0.91);
        rack.add(led);
      }
    }

    // Cylindrical Holographic Data Cylinder on Top
    const cylGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.7, 16);
    const cylMat = new THREE.MeshStandardMaterial({
      color: isPrimary ? 0x00f0ff : 0x3b82f6,
      emissive: isPrimary ? 0x00f0ff : 0x3b82f6,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85
    });
    const dataCyl = new THREE.Mesh(cylGeo, cylMat);
    dataCyl.position.y = 3.8;
    rack.add(dataCyl);
    rack.dataCyl = dataCyl;

    return rack;
  }

  // ==========================================================================
  // SHARED NETWORK PRINTER
  // ==========================================================================
  initSharedPrinter() {
    const printerGroup = new THREE.Group();
    printerGroup.position.set(-14, 0, 0);

    // Printer Desk / Stand
    const standGeo = new THREE.BoxGeometry(3.2, 1.6, 2.6);
    const standMat = new THREE.MeshStandardMaterial({
      color: 0x0c172d,
      roughness: 0.5,
      metalness: 0.8
    });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.y = 0.8;
    stand.castShadow = true;
    stand.receiveShadow = true;
    printerGroup.add(stand);

    // Printer Main Chassis (Office Heavy Duty Laser Printer)
    const bodyGeo = new THREE.BoxGeometry(2.4, 1.2, 2.0);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x223555,
      roughness: 0.3,
      metalness: 0.6
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 2.2;
    body.castShadow = true;
    printerGroup.add(body);

    // Paper Output Slot
    const slotGeo = new THREE.BoxGeometry(1.6, 0.15, 0.8);
    const slotMat = new THREE.MeshBasicMaterial({ color: 0x050811 });
    const slot = new THREE.Mesh(slotGeo, slotMat);
    slot.position.set(0, 2.25, 0.7);
    printerGroup.add(slot);

    // Printer LCD Panel
    const lcdGeo = new THREE.BoxGeometry(0.6, 0.35, 0.05);
    const lcdMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
    const lcd = new THREE.Mesh(lcdGeo, lcdMat);
    lcd.position.set(0.7, 2.65, 0.95);
    lcd.rotation.x = -Math.PI / 6;
    printerGroup.add(lcd);
    printerGroup.lcd = lcd;

    // Animated Paper Sheet emerging from printer slot
    const paperGeo = new THREE.BoxGeometry(1.2, 0.02, 1.4);
    const paperMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0.1
    });
    this.printerPaperMesh = new THREE.Mesh(paperGeo, paperMat);
    this.printerPaperMesh.position.set(0, 2.26, 0.3); // Tucked inside initially
    this.printerPaperMesh.visible = false;
    printerGroup.add(this.printerPaperMesh);

    this.scene.add(printerGroup);
    this.printerObject = printerGroup;

    // Label
    this.createWorldLabel(
      'label-printer',
      '🖨️ SHARED NETWORK LASER PRINTER',
      'Spooler & Concurrent Queue Manager',
      new THREE.Vector3(-14, 3.6, 0),
      'active'
    );
  }

  // ==========================================================================
  // REALISTIC 3D DESKTOP COMPUTERS (Workstations)
  // ==========================================================================
  buildComputerWorkstation(id, position, rotationY) {
    const pcGroup = new THREE.Group();
    pcGroup.position.copy(position);
    pcGroup.rotation.y = rotationY;
    pcGroup.userData = { id: id, isOnline: true, isBusy: false };

    // 1. Sleek Modern Desk
    const deskTopGeo = new THREE.BoxGeometry(2.6, 0.12, 1.6);
    const deskTopMat = new THREE.MeshStandardMaterial({
      color: 0x0e1c36,
      roughness: 0.35,
      metalness: 0.75
    });
    const deskTop = new THREE.Mesh(deskTopGeo, deskTopMat);
    deskTop.position.y = 1.35;
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    pcGroup.add(deskTop);

    // Desk Metallic Legs
    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.35, 12);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1d2c4d, metalness: 0.9, roughness: 0.2 });
    const legPositions = [
      [-1.15, 0.675, -0.65],
      [1.15, 0.675, -0.65],
      [-1.15, 0.675, 0.65],
      [1.15, 0.675, 0.65]
    ];
    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(pos[0], pos[1], pos[2]);
      leg.castShadow = true;
      pcGroup.add(leg);
    });

    // 2. Curved Widescreen Monitor
    // Monitor Stand Base
    const standBaseGeo = new THREE.CylinderGeometry(0.22, 0.25, 0.03, 16);
    const standBaseMat = new THREE.MeshStandardMaterial({ color: 0x1a2947, metalness: 0.9 });
    const standBase = new THREE.Mesh(standBaseGeo, standBaseMat);
    standBase.position.set(0, 1.42, -0.15);
    pcGroup.add(standBase);

    // Stand Neck
    const neckGeo = new THREE.BoxGeometry(0.06, 0.45, 0.06);
    const neck = new THREE.Mesh(neckGeo, standBaseMat);
    neck.position.set(0, 1.64, -0.18);
    neck.rotation.x = -0.1;
    pcGroup.add(neck);

    // Monitor Bezel Frame
    const monitorFrameGeo = new THREE.BoxGeometry(1.6, 0.9, 0.07);
    const monitorFrameMat = new THREE.MeshStandardMaterial({
      color: 0x080f1e,
      roughness: 0.2,
      metalness: 0.8
    });
    const monitorFrame = new THREE.Mesh(monitorFrameGeo, monitorFrameMat);
    monitorFrame.position.set(0, 2.05, -0.12);
    monitorFrame.castShadow = true;
    pcGroup.add(monitorFrame);

    // Realistic Glowing Screen Texture (Canvas Texture)
    const screenTexture = this.createScreenCanvasTexture(id);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture
    });
    const screenGeo = new THREE.PlaneGeometry(1.5, 0.82);
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 2.05, -0.08);
    pcGroup.add(screenMesh);
    pcGroup.screenMesh = screenMesh;
    pcGroup.screenTexture = screenTexture;

    // 3. Slim Keyboard
    const kbGeo = new THREE.BoxGeometry(1.1, 0.03, 0.4);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x111c33, roughness: 0.4 });
    const kb = new THREE.Mesh(kbGeo, kbMat);
    kb.position.set(0, 1.42, 0.28);
    pcGroup.add(kb);

    // Keyboard Keycaps Accent Glow Strip
    const keyGlowGeo = new THREE.BoxGeometry(0.95, 0.01, 0.28);
    const keyGlowMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const keyGlow = new THREE.Mesh(keyGlowGeo, keyGlowMat);
    keyGlow.position.set(0, 1.44, 0.28);
    pcGroup.add(keyGlow);

    // 4. Optical Mouse
    const mouseGeo = new THREE.BoxGeometry(0.12, 0.04, 0.18);
    const mouseMat = new THREE.MeshStandardMaterial({ color: 0x1e3054, roughness: 0.3 });
    const mouse = new THREE.Mesh(mouseGeo, mouseMat);
    mouse.position.set(0.7, 1.43, 0.28);
    pcGroup.add(mouse);

    // 5. Gaming / Workstation Mid-Tower PC Case
    const towerGeo = new THREE.BoxGeometry(0.5, 1.1, 1.1);
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x091428,
      roughness: 0.3,
      metalness: 0.85
    });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.set(1.0, 0.6, -0.15);
    tower.castShadow = true;
    pcGroup.add(tower);
    pcGroup.towerMesh = tower;

    // Front RGB Intake Fan Grill
    const fanGeo = new THREE.CircleGeometry(0.18, 16);
    const fanMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const fan = new THREE.Mesh(fanGeo, fanMat);
    fan.position.set(1.0, 0.75, 0.41);
    pcGroup.add(fan);
    pcGroup.fanMesh = fan;

    // Tower Power & Activity LED
    const ledGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(1.0, 1.1, 0.41);
    pcGroup.add(led);
    pcGroup.statusLed = led;

    // Hitbox for raycasting clicks
    const hitBoxGeo = new THREE.BoxGeometry(3.0, 2.5, 2.0);
    const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
    hitBox.position.set(0, 1.4, 0);
    hitBox.userData = { isWorkstationHitBox: true, workstationId: id };
    pcGroup.add(hitBox);

    return pcGroup;
  }

  createScreenCanvasTexture(id) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Cyber Terminal Background
    ctx.fillStyle = '#060d1a';
    ctx.fillRect(0, 0, 512, 256);

    // Top status bar
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(0, 0, 512, 32);

    ctx.fillStyle = '#050811';
    ctx.font = 'bold 16px "Orbitron", monospace';
    ctx.fillText(`DOS NODE [0${id}] - ONLINE`, 16, 22);

    // Terminal Code Lines
    ctx.fillStyle = '#64748b';
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillText(`$ cluster_agent --daemon --node=N0${id}`, 18, 64);
    ctx.fillText(`[OK] Mounted Distributed Virtual Memory (DVM)`, 18, 86);
    ctx.fillText(`[OK] RPC Router synchronized with DOS Controller`, 18, 108);

    ctx.fillStyle = '#00ff88';
    ctx.fillText(`STATE: ACTIVE | SSI CLUSTER READY`, 18, 140);

    // Mini CPU utilization graph
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(18, 220);
    for (let x = 18; x < 490; x += 30) {
      const y = 220 - Math.random() * 45;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  updateScreenProcessing(pcObj, percent, taskName = 'EXAM_BATCH_PROCESSING') {
    if (!pcObj || !pcObj.screenMesh) return;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#040914';
    ctx.fillRect(0, 0, 512, 256);

    // Amber busy header
    ctx.fillStyle = '#ffb703';
    ctx.fillRect(0, 0, 512, 32);
    ctx.fillStyle = '#050811';
    ctx.font = 'bold 16px "Orbitron", monospace';
    ctx.fillText(`DOS NODE [0${pcObj.userData.id}] - COMPUTING`, 16, 22);

    ctx.fillStyle = '#ffb703';
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillText(`SUB-TASK: ${taskName}`, 18, 68);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillText(`Parallel Thread: PID 4821 [Active]`, 18, 96);
    ctx.fillText(`Processing Records: ${Math.round(percent * 2)} / 200`, 18, 120);

    // Progress bar
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(18, 150, 476, 28);
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(20, 152, (472 * percent) / 100, 24);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px "Orbitron", monospace';
    ctx.fillText(`${Math.round(percent)}% COMPLETE`, 210, 170);

    const texture = new THREE.CanvasTexture(canvas);
    pcObj.screenMesh.material.map = texture;
    pcObj.screenMesh.material.needsUpdate = true;
  }

  resetScreenTexture(pcObj) {
    if (!pcObj || !pcObj.screenMesh) return;
    pcObj.screenMesh.material.map = this.createScreenCanvasTexture(pcObj.userData.id);
    pcObj.screenMesh.material.needsUpdate = true;
  }

  // ==========================================================================
  // NETWORK BUS CABLES
  // ==========================================================================
  buildFiberCable(fromPos, toPos, color = 0x00f0ff) {
    const p1 = fromPos.clone();
    p1.y = 0.05; // cable hugs floor
    const p2 = toPos.clone();
    p2.y = 0.05;

    // Curved control points for natural cybernetic routing
    const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    midPoint.y = 0.08;

    const curve = new THREE.QuadraticBezierCurve3(p1, midPoint, p2);
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.06, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.8
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.userData = { curve: curve, from: fromPos, to: toPos };
    return tube;
  }

  // ==========================================================================
  // MOVING 3D DATA PACKETS
  // ==========================================================================
  sendDataPacket(startPos, endPos, labelText, color = 0x00f0ff, durationMs = 1200, onComplete = null) {
    const packetGroup = new THREE.Group();

    // Glowing photon sphere
    const sphereGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({ color: color });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    packetGroup.add(sphere);

    // Outer glow halo
    const haloGeo = new THREE.SphereGeometry(0.48, 16, 16);
    const haloMat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.35,
      wireframe: true
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    packetGroup.add(halo);

    // Dynamic Point Light on packet
    const pLight = new THREE.PointLight(color, 1.8, 4);
    packetGroup.add(pLight);

    // HTML Floating Badge
    const tag = document.createElement('div');
    tag.className = 'packet-tag';
    tag.textContent = labelText;
    document.body.appendChild(tag);
    packetGroup.tagEl = tag;

    // Bezier arc trajectory (elevates into air)
    const mid = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);
    mid.y += 2.2; // Arc peak

    const curve = new THREE.QuadraticBezierCurve3(startPos, mid, endPos);
    packetGroup.position.copy(startPos);
    this.packetsGroup.add(packetGroup);

    // Sound effect
    audio.playPacketSend();

    const startTime = performance.now();

    const packetObj = {
      group: packetGroup,
      curve: curve,
      startTime: startTime,
      duration: durationMs,
      tag: tag,
      onComplete: onComplete
    };

    this.activePackets.push(packetObj);
    return packetObj;
  }

  updatePackets(now) {
    for (let i = this.activePackets.length - 1; i >= 0; i--) {
      const p = this.activePackets[i];
      const elapsed = now - p.startTime;
      const progress = Math.min(elapsed / p.duration, 1.0);

      // Interpolate along curve
      const pos = p.curve.getPoint(progress);
      p.group.position.copy(pos);

      // Update screen 2D position for HTML badge
      this.updateTagScreenPosition(p.group.position, p.tag);

      if (progress >= 1.0) {
        // Arrived at destination
        audio.playPacketArrive();
        this.packetsGroup.remove(p.group);
        if (p.tag && p.tag.parentNode) {
          p.tag.parentNode.removeChild(p.tag);
        }
        if (p.onComplete) {
          p.onComplete();
        }
        this.activePackets.splice(i, 1);
      }
    }
  }

  // ==========================================================================
  // HTML WORLD LABELS (High-Readability Classroom Overlays)
  // ==========================================================================
  createWorldLabel(id, title, subtitle, worldPos, initialStatus = 'active') {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      el.className = 'scene-node-label';
      document.body.appendChild(el);
    }

    el.innerHTML = `
      <span class="node-status-led ${initialStatus}"></span>
      <span class="label-text">
        <strong>${title}</strong>
        ${subtitle ? `<br><small style="color:#94a3b8;font-size:9px;">${subtitle}</small>` : ''}
      </span>
    `;

    el.worldPos = worldPos.clone();
    return el;
  }

  updateLabelsScreenPosition() {
    const labels = document.querySelectorAll('.scene-node-label');
    labels.forEach(el => {
      if (el.worldPos) {
        this.updateTagScreenPosition(el.worldPos, el);
      }
    });
  }

  updateTagScreenPosition(worldPos, domElement) {
    const wp = worldPos.clone();
    wp.project(this.camera);

    // Behind camera check
    if (wp.z > 1.0) {
      domElement.style.display = 'none';
      return;
    }

    domElement.style.display = 'block';
    const x = (wp.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-(wp.y * 0.5) + 0.5) * window.innerHeight;

    domElement.style.left = `${x}px`;
    domElement.style.top = `${y}px`;
  }

  // ==========================================================================
  // CAMERA VIEW TWEENING
  // ==========================================================================
  transitionCamera(targetPos, targetLookAt, duration = 1400) {
    if (typeof TWEEN === 'undefined') {
      this.camera.position.copy(targetPos);
      this.controls.target.copy(targetLookAt);
      return;
    }

    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();

    new TWEEN.Tween(startPos)
      .to(targetPos, duration)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate(() => {
        this.camera.position.copy(startPos);
      })
      .start();

    new TWEEN.Tween(startTarget)
      .to(targetLookAt, duration)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate(() => {
        this.controls.target.copy(startTarget);
      })
      .start();
  }

  // ==========================================================================
  // INTERACTION / RAYCASTING
  // ==========================================================================
  onPointerDown(event) {
    // Only handle primary click
    if (event.button !== 0) return;

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.workstationsGroup.children, true);

    if (intersects.length > 0) {
      // Find workstation
      for (const hit of intersects) {
        if (hit.object.userData && hit.object.userData.isWorkstationHitBox) {
          const pcId = hit.object.userData.workstationId;
          window.app.cluster.selectWorkstation(pcId);
          audio.playClick();
          break;
        }
      }
    }
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  // ==========================================================================
  // MAIN ANIMATION LOOP
  // ==========================================================================
  animate(time) {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();

    // Tween updates
    if (typeof TWEEN !== 'undefined') {
      TWEEN.update();
    }

    // Orbit controls update
    this.controls.update();

    // Rotate holographic rings & core
    if (this.hologramCore) {
      this.hologramCore.rotation.y += 0.015;
      this.hologramCore.rotation.x += 0.008;
    }
    if (this.hologramCage) {
      this.hologramCage.rotation.y -= 0.02;
    }
    if (this.ring1) {
      this.ring1.rotation.z += 0.01;
    }
    if (this.ring2) {
      this.ring2.rotation.x -= 0.012;
    }

    // Pulse core light slightly
    if (this.corePointLight) {
      this.corePointLight.intensity = 2.6 + Math.sin(time * 0.004) * 0.5;
    }

    // Update active data packets
    this.updatePackets(performance.now());

    // Update HTML overlay labels
    this.updateLabelsScreenPosition();

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}


// ============================================================================
// 3. CLUSTER MANAGER (Distributed System Topology & Node Lifecycle)
// ============================================================================
class ClusterManager {
  constructor(sim) {
    this.sim = sim;
    this.nodes = []; // list of workstation objects
    this.cables = [];
    this.maxNodes = 8;
    this.minNodes = 3;

    // Initialize 5 Default Workstations in a semi-circular arc facing controller
    this.setupInitialNodes(5);
  }

  setupInitialNodes(count = 5) {
    // Clear existing
    this.clearAllNodes();

    for (let i = 1; i <= count; i++) {
      this.addNode(i, false);
    }
    this.updateTopologyCables();
    this.updateTelemetry();
  }

  clearAllNodes() {
    this.nodes.forEach(node => {
      this.sim.workstationsGroup.remove(node.group);
      const label = document.getElementById(`label-node-${node.id}`);
      if (label && label.parentNode) label.parentNode.removeChild(label);
    });
    this.nodes = [];

    this.cables.forEach(c => this.sim.cablesGroup.remove(c));
    this.cables = [];
  }

  addNode(customId = null, animateJoin = true) {
    if (this.nodes.length >= this.maxNodes) {
      window.app.ui.showToast('Cluster capacity limit reached (Max 8 nodes).', 'warn');
      return null;
    }

    const nextId = customId || (this.nodes.length > 0 ? Math.max(...this.nodes.map(n => n.id)) + 1 : 1);

    // Calculate position along circular lab arc
    // Radius ~16, angles distributed nicely in the front/sides of the controller
    const totalSlots = 8;
    const slotIndex = nextId - 1;
    const startAngle = -Math.PI * 0.85;
    const endAngle = -Math.PI * 0.15;
    const angleStep = (endAngle - startAngle) / (totalSlots - 1);
    const angle = startAngle + slotIndex * angleStep;
    const radius = 17.5;

    const posX = Math.cos(angle) * radius;
    const posZ = Math.sin(angle) * radius;
    const pos = new THREE.Vector3(posX, 0, posZ);

    // Rotate computer to face central controller (0, 0, 0)
    const rotY = Math.atan2(-posX, -posZ);

    const pcGroup = this.sim.buildComputerWorkstation(nextId, pos, rotY);

    if (animateJoin) {
      pcGroup.scale.set(0.01, 0.01, 0.01);
      this.sim.workstationsGroup.add(pcGroup);

      new TWEEN.Tween(pcGroup.scale)
        .to({ x: 1, y: 1, z: 1 }, 700)
        .easing(TWEEN.Easing.Back.Out)
        .start();

      audio.playSuccess();
    } else {
      this.sim.workstationsGroup.add(pcGroup);
    }

    // Role definitions for educational clarity
    const roles = [
      'Admin / Job Dispatcher',
      'Compute Node Alpha',
      'Compute Node Beta',
      'Data Terminal Station',
      'Lab Client Node',
      'Auxiliary Worker 1',
      'Auxiliary Worker 2',
      'Auxiliary Worker 3'
    ];
    const roleName = roles[slotIndex] || `Worker Node ${nextId}`;

    // Create 3D label
    const labelPos = new THREE.Vector3(posX, 3.4, posZ);
    this.sim.createWorldLabel(
      `label-node-${nextId}`,
      `Node ${nextId} (${roleName})`,
      '192.168.1.10' + nextId,
      labelPos,
      'active'
    );

    const nodeData = {
      id: nextId,
      group: pcGroup,
      position: pos,
      labelPos: labelPos,
      role: roleName,
      defaultRole: roleName,
      ip: `192.168.1.10${nextId}`,
      status: 'ONLINE',
      cpu: 18,
      osProfile: 'POSIX Microkernel',
      hwProfile: 'x86_64 Standard'
    };

    this.nodes.push(nodeData);

    if (animateJoin) {
      this.updateTopologyCables();
      this.updateTelemetry();
      window.app.ui.log('success', `[SCALABILITY] Node ${nextId} (${roleName}) joined cluster. High-speed optical bus attached.`);
      window.app.ui.showToast(`Node ${nextId} attached to Distributed OS`, 'success');
    }

    return nodeData;
  }

  removeNode() {
    if (this.nodes.length <= this.minNodes) {
      window.app.ui.showToast(`Minimum cluster threshold reached (${this.minNodes} nodes required for quorum).`, 'warn');
      return;
    }

    const removedNode = this.nodes.pop();

    // Animate removal
    new TWEEN.Tween(removedNode.group.scale)
      .to({ x: 0.01, y: 0.01, z: 0.01 }, 450)
      .easing(TWEEN.Easing.Cubic.In)
      .onComplete(() => {
        this.sim.workstationsGroup.remove(removedNode.group);
      })
      .start();

    // Remove label
    const label = document.getElementById(`label-node-${removedNode.id}`);
    if (label && label.parentNode) label.parentNode.removeChild(label);

    this.updateTopologyCables();
    this.updateTelemetry();

    audio.playPacketArrive();
    window.app.ui.log('warn', `[SCALABILITY] Node ${removedNode.id} gracefully decommissioned. Distributed tasks migrated.`);
    window.app.ui.showToast(`Node ${removedNode.id} decommissioned`, 'info');
  }

  updateTopologyCables() {
    // Clear cables
    this.cables.forEach(c => this.sim.cablesGroup.remove(c));
    this.cables = [];

    const controllerPos = new THREE.Vector3(0, 0, 0);

    // Cable to each active workstation
    this.nodes.forEach(node => {
      const cable = this.sim.buildFiberCable(node.position, controllerPos, 0x00f0ff);
      this.sim.cablesGroup.add(cable);
      this.cables.push(cable);
    });

    // Cable to Database Cluster (14, 0, 0)
    const dbCable = this.sim.buildFiberCable(new THREE.Vector3(12, 0, 0), controllerPos, 0x3b82f6);
    this.sim.cablesGroup.add(dbCable);
    this.cables.push(dbCable);

    // Cable to Shared Printer (-14, 0, 0)
    const prnCable = this.sim.buildFiberCable(new THREE.Vector3(-12, 0, 0), controllerPos, 0x00ff88);
    this.sim.cablesGroup.add(prnCable);
    this.cables.push(prnCable);
  }

  updateTelemetry() {
    const nodeCount = this.nodes.length;
    const capacityGFlops = (nodeCount * 15.0).toFixed(1);

    const elemTelNodes = document.getElementById('telemetry-nodes');
    if (elemTelNodes) elemTelNodes.textContent = `${nodeCount} / 8 CONNECTED`;

    const elemScaleCount = document.getElementById('scale-count');
    if (elemScaleCount) elemScaleCount.textContent = nodeCount;

    const elemScaleMips = document.getElementById('scale-mips');
    if (elemScaleMips) elemScaleMips.textContent = capacityGFlops;

    const elemDgScaleCount = document.getElementById('dg-scale-count');
    if (elemDgScaleCount) elemDgScaleCount.textContent = nodeCount;

    const elemDgScaleMips = document.getElementById('dg-scale-mips');
    if (elemDgScaleMips) elemDgScaleMips.textContent = capacityGFlops;

    // Update dropdown in Module E
    const srcSelect = document.getElementById('comm-src');
    const dstSelect = document.getElementById('comm-dest');
    if (srcSelect && dstSelect) {
      srcSelect.innerHTML = '';
      dstSelect.innerHTML = '';
      this.nodes.forEach(n => {
        const opt1 = document.createElement('option');
        opt1.value = n.id;
        opt1.textContent = `Node ${n.id} (${n.role})`;
        srcSelect.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = n.id;
        opt2.textContent = `Node ${n.id} (${n.role})`;
        dstSelect.appendChild(opt2);
      });
      if (this.nodes.length >= 2) {
        dstSelect.selectedIndex = 1;
      }
    }
  }

  setNodeOSProfiles() {
    const osConfigs = [
      { id: 1, role: '🐧 Linux POSIX (Ubuntu 24.04)', os: 'Linux 6.8 POSIX' },
      { id: 2, role: '🪟 Windows NT (Win 11 Pro)', os: 'Windows 11 NT' },
      { id: 3, role: '🍎 macOS Darwin (Sonoma)', os: 'macOS 14 Darwin' }
    ];

    osConfigs.forEach(cfg => {
      const node = this.getNode(cfg.id);
      if (node) {
        node.role = cfg.role;
        node.osProfile = cfg.os;
        const label = document.getElementById(`label-node-${cfg.id}`);
        if (label) {
          label.innerHTML = `
            <span class="node-status-led active"></span>
            <span class="label-text">
              <strong>${cfg.role}</strong>
              <br><small style="color:#38bdf8;font-size:9px;">Standard Open Protocol: JSON-RPC / HTTP</small>
            </span>
          `;
        }
      }
    });
  }

  setNodeHWProfiles() {
    const hwConfigs = [
      { id: 1, role: '⚡ Intel x86_64 CPU (Compiling)', hw: 'x86_64 Multi-Core' },
      { id: 2, role: '🔋 ARM64 Low-Power (IoT Sensors)', hw: 'ARM64 Cortex-A78' },
      { id: 3, role: '🚀 NVIDIA Tensor GPU (Matrix Math)', hw: 'NVIDIA RTX Compute' }
    ];

    hwConfigs.forEach(cfg => {
      const node = this.getNode(cfg.id);
      if (node) {
        node.role = cfg.role;
        node.hwProfile = cfg.hw;
        const label = document.getElementById(`label-node-${cfg.id}`);
        if (label) {
          label.innerHTML = `
            <span class="node-status-led active"></span>
            <span class="label-text">
              <strong>${cfg.role}</strong>
              <br><small style="color:#00ff88;font-size:9px;">Microkernel Heterogeneous Abstraction</small>
            </span>
          `;
        }
      }
    });
  }

  restoreNodeDefaultProfiles() {
    this.nodes.forEach(node => {
      node.role = node.defaultRole || `Worker Node ${node.id}`;
      const label = document.getElementById(`label-node-${node.id}`);
      if (label) {
        label.innerHTML = `
          <span class="node-status-led active"></span>
          <span class="label-text">
            <strong>Node ${node.id} (${node.role})</strong>
            <br><small style="color:#94a3b8;font-size:9px;">${node.ip}</small>
          </span>
        `;
      }
      this.sim.resetScreenTexture(node.group);
    });
  }

  getNode(id) {
    return this.nodes.find(n => n.id === parseInt(id, 10));
  }

  selectWorkstation(id) {
    const node = this.getNode(id);
    if (!node) return;

    window.app.ui.openNodeInspector(node);

    // Focus camera slightly toward this node
    const camTarget = node.position.clone();
    camTarget.y += 1.8;
    const camPos = node.position.clone().add(new THREE.Vector3(0, 4, 6));
    this.sim.transitionCamera(camPos, camTarget, 900);
  }
}


// ============================================================================
// 4. SCENARIO CONTROLLER (The 6 Seminar Demonstrations)
// ============================================================================
class ScenarioController {
  constructor(sim, cluster) {
    this.sim = sim;
    this.cluster = cluster;
    this.isDemoRunning = false;
  }

  // --------------------------------------------------------------------------
  // CONCEPT 1: RESOURCE SHARING (Hardware & Data Sharing)
  // --------------------------------------------------------------------------
  demonstrateSharedDB() {
    if (this.isDemoRunning) return;
    this.isDemoRunning = true;

    window.app.ui.log('info', '[RESOURCE SHARING] Node 1 and Node 3 submitting concurrent SQL queries to shared Database...');
    window.app.ui.showToast('Nodes 1 & 3 querying Central Database', 'info');

    const node1 = this.cluster.getNode(1);
    const node3 = this.cluster.getNode(3);
    const controllerPos = new THREE.Vector3(0, 3.2, 0);
    const dbPos = new THREE.Vector3(12.5, 3.2, 0);

    // Step 1: Packets from Node 1 & Node 3 to DOS Controller
    this.sim.sendDataPacket(node1.position.clone().add(new THREE.Vector3(0, 2.0, 0)), controllerPos, 'SELECT * FROM Students', 0x00f0ff, 1000, () => {
      // Step 2: Routed to Database DB-01
      this.sim.sendDataPacket(controllerPos, dbPos, 'DB_QUERY::ID_600', 0x00f0ff, 900, () => {
        // DB Processing Flash
        if (this.sim.databaseA && this.sim.databaseA.dataCyl) {
          new TWEEN.Tween(this.sim.databaseA.dataCyl.scale)
            .to({ x: 1.4, z: 1.4 }, 250)
            .yoyo(true)
            .repeat(1)
            .start();
        }
        audio.playSuccess();
        window.app.ui.log('success', '[RESOURCE SHARING] Database DB-01 returned 600 records with ACID consistency.');

        // Step 3: Return payload back to Node 1
        this.sim.sendDataPacket(dbPos, controllerPos, 'DATA_PACKET::200_RECORDS', 0x00ff88, 900, () => {
          this.sim.sendDataPacket(controllerPos, node1.position.clone().add(new THREE.Vector3(0, 2.0, 0)), 'ACK::RECORDS_LOADED', 0x00ff88, 900, () => {
            this.isDemoRunning = false;
            window.app.ui.showToast('Data sharing complete: Node 1 loaded shared database', 'success');
          });
        });
      });
    });

    // Concurrent query from Node 3
    if (node3) {
      setTimeout(() => {
        this.sim.sendDataPacket(node3.position.clone().add(new THREE.Vector3(0, 2.0, 0)), controllerPos, 'SELECT * FROM Grades', 0x70d6ff, 1100, () => {
          this.sim.sendDataPacket(controllerPos, node3.position.clone().add(new THREE.Vector3(0, 2.0, 0)), 'RESULT::200_GRADES', 0x00ff88, 1000);
        });
      }, 300);
    }
  }

  demonstrateSharedPrinter() {
    if (this.isDemoRunning) return;
    this.isDemoRunning = true;

    const node2 = this.cluster.getNode(2) || this.cluster.nodes[0];
    const controllerPos = new THREE.Vector3(0, 3.2, 0);
    const printerPos = new THREE.Vector3(-14, 2.6, 0);

    window.app.ui.log('info', `[RESOURCE SHARING] Node ${node2.id} sending print spool request: "Semester_Exam_Papers.pdf" (15 pages)...`);
    window.app.ui.showToast('Spooling print job to shared network printer...', 'info');

    // Packet from Workstation to DOS Controller Spooler
    this.sim.sendDataPacket(node2.position.clone().add(new THREE.Vector3(0, 2.0, 0)), controllerPos, 'PRINT_JOB::EXAM_DOC', 0x00ff88, 1100, () => {
      window.app.ui.log('info', '[DOS SPOOLER] Job verified. Priority queue slot assigned. Forwarding to PRN-SHARED...');
      
      // Packet from Controller to Network Printer
      this.sim.sendDataPacket(controllerPos, printerPos, 'SPOOL_STREAM::15_PAGES', 0x00ff88, 1000, () => {
        // Printer mechanical animation & sound
        audio.playPrinter();

        if (this.sim.printerPaperMesh) {
          this.sim.printerPaperMesh.visible = true;
          this.sim.printerPaperMesh.position.set(0, 2.26, 0.2);

          // Animate paper sliding out of the printer tray!
          new TWEEN.Tween(this.sim.printerPaperMesh.position)
            .to({ z: 1.1 }, 1400)
            .easing(TWEEN.Easing.Cubic.Out)
            .onComplete(() => {
              audio.playSuccess();
              window.app.ui.log('success', '[PRINTER] Document "Semester_Exam_Papers.pdf" printed successfully. Hardware shared across all nodes.');
              window.app.ui.showToast('Print complete: 15 pages output on shared laser printer!', 'success');
              
              // Reset paper after 4 seconds
              setTimeout(() => {
                if (this.sim.printerPaperMesh) {
                  this.sim.printerPaperMesh.visible = false;
                  this.sim.printerPaperMesh.position.z = 0.2;
                }
                this.isDemoRunning = false;
              }, 4000);
            })
            .start();
        } else {
          this.isDemoRunning = false;
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // CONCEPT 2: PARALLEL PROCESSING & PERFORMANCE
  // --------------------------------------------------------------------------
  demonstrateParallelProcessing() {
    if (this.isDemoRunning) return;
    this.isDemoRunning = true;

    const benchmarkEl = document.getElementById('parallel-benchmark');
    if (benchmarkEl) benchmarkEl.classList.remove('hidden');

    const node1 = this.cluster.getNode(1);
    const node2 = this.cluster.getNode(2);
    const node3 = this.cluster.getNode(3);

    if (!node1 || !node2 || !node3) {
      window.app.ui.showToast('At least 3 nodes required for parallel demonstration.', 'warn');
      this.isDemoRunning = false;
      return;
    }

    window.app.ui.log('info', '[PARALLEL PROCESSING] Batch Job Received: 600 Student Exam Records.');
    window.app.ui.log('info', '[DOS SCHEDULER] Slicing task into 3 sub-tasks: Part A (1-200), Part B (201-400), Part C (401-600)...');
    window.app.ui.showToast('Distributing 600 exam records across 3 CPU nodes...', 'info');

    const controllerPos = new THREE.Vector3(0, 3.5, 0);

    // Simultaneously dispatch 3 sub-tasks to 3 nodes
    const tasks = [
      { node: node1, label: 'Task_A::Records_1-200' },
      { node: node2, label: 'Task_B::Records_201-400' },
      { node: node3, label: 'Task_C::Records_401-600' }
    ];

    let completedTasks = 0;

    tasks.forEach(task => {
      this.sim.sendDataPacket(controllerPos, task.node.position.clone().add(new THREE.Vector3(0, 2.0, 0)), task.label, 0x00f0ff, 1200, () => {
        // Node enters compute state
        window.app.ui.log('warn', `[NODE 0${task.node.id}] Processing ${task.label}...`);
        
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 20;
          this.sim.updateScreenProcessing(task.node.group, progress, task.label);

          if (progress >= 100) {
            clearInterval(progressInterval);
            window.app.ui.log('success', `[NODE 0${task.node.id}] ${task.label} COMPLETED.`);

            // Return partial result to DOS Controller
            this.sim.sendDataPacket(task.node.position.clone().add(new THREE.Vector3(0, 2.0, 0)), controllerPos, `RESULT::PART_${task.node.id}`, 0x00ff88, 1100, () => {
              this.sim.resetScreenTexture(task.node.group);
              completedTasks++;

              if (completedTasks === 3) {
                // All 3 done!
                audio.playSuccess();
                window.app.ui.log('success', '[DOS ORCHESTRATOR] All 3 sub-tasks merged into consolidated exam report.');
                window.app.ui.showToast('Parallel Execution Finished: 3x Linear Speedup Achieved!', 'success');
                this.isDemoRunning = false;
              }
            });
          }
        }, 350);
      });
    });
  }

  // --------------------------------------------------------------------------
  // CONCEPT 3: RELIABILITY AND FAULT TOLERANCE
  // --------------------------------------------------------------------------
  simulateServerCrash() {
    if (this.sim.databaseA.userData.isFailed) {
      window.app.ui.showToast('Server DB-01 is already crashed. Restore it first.', 'warn');
      return;
    }

    this.sim.databaseA.userData.isFailed = true;

    // Alarm audio
    audio.playAlarm();

    // Turn Server DB-01 Dark Red & Emit alarm particles
    if (this.sim.databaseA.shellMesh) {
      this.sim.databaseA.shellMesh.material.color.setHex(0x550a1a);
      this.sim.databaseA.shellMesh.material.emissive.setHex(0xff3366);
      this.sim.databaseA.shellMesh.material.emissiveIntensity = 0.8;
    }
    if (this.sim.databaseA.dataCyl) {
      this.sim.databaseA.dataCyl.material.color.setHex(0xff3366);
      this.sim.databaseA.dataCyl.material.emissive.setHex(0xff3366);
    }

    // Cut heartbeat link
    if (this.sim.heartbeatLine) {
      this.sim.heartbeatLine.material.color.setHex(0xff3366);
    }

    // Update UI indicators
    const indA = document.getElementById('indicator-srv-a');
    const stateA = document.getElementById('state-srv-a');
    const indB = document.getElementById('indicator-srv-b');
    const stateB = document.getElementById('state-srv-b');

    if (indA) {
      indA.classList.remove('active');
      indA.classList.add('crashed');
      stateA.textContent = 'OFFLINE (CRASHED)';
      stateA.className = 'srv-state text-red';
    }

    if (indB) {
      indB.classList.add('active');
      stateB.textContent = 'PROMOTED TO PRIMARY (ACTIVE)';
      stateB.className = 'srv-state text-green';
    }

    // Enable Recover button
    const btnCrash = document.getElementById('btn-crash-server');
    const btnRecover = document.getElementById('btn-recover-server');
    if (btnCrash) btnCrash.disabled = true;
    if (btnRecover) btnRecover.disabled = false;

    // Update 3D label
    const labelA = document.getElementById('label-db-a');
    if (labelA) {
      const led = labelA.querySelector('.node-status-led');
      if (led) { led.className = 'node-status-led failed'; }
    }

    window.app.ui.log('danger', '[HARDWARE FAILURE] Power supply failed on Server DB-01! Heartbeat loss detected in 45ms.');
    window.app.ui.log('warn', '[FAULT TOLERANCE] DOS Paxos Consensus elected DB-02 as new ACTIVE PRIMARY.');
    window.app.ui.showToast('DB-01 Failed! Automatic Failover to DB-02 Active', 'warn');

    // Demonstrate seamless client request rerouted to DB-02
    setTimeout(() => {
      const clientNode = this.cluster.getNode(5) || this.cluster.nodes[0];
      const controllerPos = new THREE.Vector3(0, 3.2, 0);
      const db2Pos = new THREE.Vector3(15.6, 3.2, 0);

      window.app.ui.log('info', '[TRANSPARENCY] Node 5 querying database during outage: Automatic routing to DB-02...');
      this.sim.sendDataPacket(clientNode.position.clone().add(new THREE.Vector3(0, 2.0, 0)), controllerPos, 'READ_REQ::STUDENT_DATA', 0x00f0ff, 900, () => {
        this.sim.sendDataPacket(controllerPos, db2Pos, 'ROUTED_TO_DB02_REPLICA', 0x00ff88, 900, () => {
          this.sim.sendDataPacket(db2Pos, clientNode.position.clone().add(new THREE.Vector3(0, 2.0, 0)), 'ACK::DATA_DELIVERED_NO_DOWNTIME', 0x00ff88, 900, () => {
            window.app.ui.log('success', '[ZERO DOWNTIME] Node 5 received data without error. 99.999% availability maintained.');
          });
        });
      });
    }, 1200);
  }

  restoreServer() {
    if (!this.sim.databaseA.userData.isFailed) return;
    this.sim.databaseA.userData.isFailed = false;

    // Restore colors
    if (this.sim.databaseA.shellMesh) {
      this.sim.databaseA.shellMesh.material.color.setHex(0x111c33);
      this.sim.databaseA.shellMesh.material.emissive.setHex(0x000000);
      this.sim.databaseA.shellMesh.material.emissiveIntensity = 0;
    }
    if (this.sim.databaseA.dataCyl) {
      this.sim.databaseA.dataCyl.material.color.setHex(0x00f0ff);
      this.sim.databaseA.dataCyl.material.emissive.setHex(0x00f0ff);
    }
    if (this.sim.heartbeatLine) {
      this.sim.heartbeatLine.material.color.setHex(0x00ff88);
    }

    // Update UI indicators
    const indA = document.getElementById('indicator-srv-a');
    const stateA = document.getElementById('state-srv-a');
    const indB = document.getElementById('indicator-srv-b');
    const stateB = document.getElementById('state-srv-b');

    if (indA) {
      indA.classList.remove('crashed');
      indA.classList.add('active');
      stateA.textContent = 'ONLINE (HEALTHY REPLICA)';
      stateA.className = 'srv-state text-green';
    }

    if (indB) {
      stateB.textContent = 'ACTIVE PRIMARY';
      stateB.className = 'srv-state text-cyan';
    }

    const btnCrash = document.getElementById('btn-crash-server');
    const btnRecover = document.getElementById('btn-recover-server');
    if (btnCrash) btnCrash.disabled = false;
    if (btnRecover) btnRecover.disabled = true;

    // Update 3D label
    const labelA = document.getElementById('label-db-a');
    if (labelA) {
      const led = labelA.querySelector('.node-status-led');
      if (led) { led.className = 'node-status-led active'; }
    }

    audio.playSuccess();
    window.app.ui.log('success', '[RECOVERY] Server DB-01 restarted. Catching up missing write-ahead logs from DB-02...');
    window.app.ui.showToast('Server DB-01 restored and synchronized!', 'success');

    // Animate sync packets between DB-02 and DB-01
    this.sim.sendDataPacket(new THREE.Vector3(15.6, 3.2, 0), new THREE.Vector3(12.4, 3.2, 0), 'WAL_LOG_SYNC::100%', 0x00ff88, 800);
  }

  // --------------------------------------------------------------------------
  // CONCEPT 5: INTER-PROCESS COMMUNICATION & MESSAGE PASSING
  // --------------------------------------------------------------------------
  sendMessage(srcId, dstId, protocol) {
    if (this.isDemoRunning) return;
    this.isDemoRunning = true;

    const srcNode = this.cluster.getNode(srcId);
    const dstNode = this.cluster.getNode(dstId);

    if (!srcNode || !dstNode) {
      window.app.ui.showToast('Invalid source or destination node.', 'warn');
      this.isDemoRunning = false;
      return;
    }

    if (srcId === dstId) {
      window.app.ui.showToast('Source and destination cannot be identical for network demo.', 'warn');
      this.isDemoRunning = false;
      return;
    }

    const controllerPos = new THREE.Vector3(0, 3.2, 0);
    const packetTag = `${protocol}::[0${srcId}->0${dstId}]`;

    window.app.ui.log('info', `[COMMUNICATION] Node ${srcId} serializing ${protocol} packet for Node ${dstId}...`);
    window.app.ui.showToast(`Transmitting ${protocol} from Node ${srcId} to Node ${dstId}`, 'info');

    // 1. Source to DOS Switch/Router
    this.sim.sendDataPacket(srcNode.position.clone().add(new THREE.Vector3(0, 2.0, 0)), controllerPos, packetTag, 0x00f0ff, 1000, () => {
      window.app.ui.log('info', `[DOS ROUTER] Packet inspect: Protocol=${protocol}, Checksum=OK. Routing to Node ${dstId}...`);

      // 2. Controller to Destination
      this.sim.sendDataPacket(controllerPos, dstNode.position.clone().add(new THREE.Vector3(0, 2.0, 0)), packetTag, 0x00f0ff, 1000, () => {
        window.app.ui.log('success', `[NODE 0${dstId}] Packet received. Unmarshalling arguments and executing RPC method...`);

        // 3. Return Acknowledgement / RPC return value
        this.sim.sendDataPacket(dstNode.position.clone().add(new THREE.Vector3(0, 2.0, 0)), controllerPos, 'ACK::RETURN_VAL', 0x00ff88, 900, () => {
          this.sim.sendDataPacket(controllerPos, srcNode.position.clone().add(new THREE.Vector3(0, 2.0, 0)), 'RPC_SUCCESS::COMPLETED', 0x00ff88, 900, () => {
            audio.playSuccess();
            window.app.ui.log('success', `[COMMUNICATION] RPC transaction between Node ${srcId} and Node ${dstId} complete.`);
            window.app.ui.showToast(`Communication Complete: ACK received at Node ${srcId}`, 'success');
            this.isDemoRunning = false;
          });
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // CONCEPT 6: REAL-WORLD APPLICATIONS
  // --------------------------------------------------------------------------
  showApplicationInfo(appKey) {
    const apps = {
      cloud: {
        title: 'Cloud Computing (AWS / GCP / Azure)',
        desc: 'Hyper-scale data centers pool millions of compute instances to provide on-demand resources, container orchestration (Kubernetes), and elastic auto-scaling.',
        example: 'Netflix streams billions of video hours across thousands of distributed cloud nodes worldwide without interruptions.'
      },
      banking: {
        title: 'Online Banking & Global ATM Networks',
        desc: 'Financial institutions use distributed two-phase commit (2PC) and Paxos consensus algorithms to execute ACID transactions simultaneously across thousands of branch databases.',
        example: 'VISA processes over 65,000 transaction messages per second across redundant global data centers with zero double-spending.'
      },
      ecommerce: {
        title: 'E-Commerce & Retail (Amazon / Flipkart)',
        desc: 'Handles massive concurrent shopping carts, flash-sale spikes, and live stock tracking across distributed microservices.',
        example: 'Amazon Prime Day processes billions of queries per day with DynamoDB distributed key-value store, maintaining millisecond latency.'
      },
      science: {
        title: 'Scientific Research & Grid Computing',
        desc: 'Massive simulation grids divide complex physics, molecular dynamics, and weather models among worldwide academic clusters.',
        example: 'The CERN Large Hadron Collider processes 1 Petabyte of collision data per second across the Worldwide LHC Computing Grid (WLCG).'
      },
      database: {
        title: 'Distributed Databases (Google Spanner / Cassandra)',
        desc: 'Global sharding, automated multi-region replication, and atomic clock synchronization guarantee consistency without sacrificing speed.',
        example: 'Google Spanner utilizes synchronized atomic clocks (TrueTime) across global data centers for externally consistent distributed transactions.'
      }
    };

    const info = apps[appKey] || apps.cloud;
    document.getElementById('app-card-title').textContent = info.title;
    document.getElementById('app-card-desc').textContent = info.desc;
    document.getElementById('app-card-example').innerHTML = `<strong>Real-World Case:</strong> ${info.example}`;

    // Update active button state
    document.querySelectorAll('.app-chip').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.app === appKey);
    });

    audio.playClick();
  }

  // --------------------------------------------------------------------------
  // DESIGN GOAL 1: TRANSPARENCY (Location & Access Transparency)
  // --------------------------------------------------------------------------
  demonstrateTransparency() {
    if (this.isDemoRunning) return;
    this.isDemoRunning = true;

    const node1 = this.cluster.getNode(1);
    const controllerPos = new THREE.Vector3(0, 3.2, 0);
    const dbPos = new THREE.Vector3(12.5, 3.2, 0);

    window.app.ui.log('info', '[TRANSPARENCY] Workstation 1 user called: fopen("C:\\Exam_Grades.csv")');
    window.app.ui.log('info', '[VFS RESOLUTION] DOS Virtual File System intercepted path. Resolving physical location...');
    window.app.ui.showToast('Location Transparency: Resolving C:\\Exam_Grades.csv across network', 'info');

    // Focus camera on Node 1 & Database
    this.sim.transitionCamera(new THREE.Vector3(6, 14, 22), new THREE.Vector3(6, 2, 0), 1000);

    // Step 1: Request leaves Node 1 with local path tag
    this.sim.sendDataPacket(node1.position.clone().add(new THREE.Vector3(0, 2.0, 0)), controllerPos, 'VFS::C:\\Exam_Grades.csv', 0x38bdf8, 1000, () => {
      window.app.ui.log('info', '[DOS KERNEL] Mapped local path to network address: 192.168.1.50:/srv/storage/cluster/grades.csv');

      // Step 2: Routed to remote DB-01
      this.sim.sendDataPacket(controllerPos, dbPos, 'NFS_READ::192.168.1.50', 0x00f0ff, 900, () => {
        // DB Flashes
        if (this.sim.databaseA && this.sim.databaseA.dataCyl) {
          new TWEEN.Tween(this.sim.databaseA.dataCyl.scale)
            .to({ x: 1.35, z: 1.35 }, 200)
            .yoyo(true)
            .repeat(1)
            .start();
        }
        audio.playSuccess();
        window.app.ui.log('success', '[DB-01] Records found: "Exam_Grades.csv" (600 rows). Packaging response stream...');

        // Step 3: Response packet travels back to DOS Controller
        this.sim.sendDataPacket(dbPos, controllerPos, 'STREAM::GRADES_CSV', 0x00ff88, 900, () => {
          // Step 4: Delivered to Node 1 screen
          this.sim.sendDataPacket(controllerPos, node1.position.clone().add(new THREE.Vector3(0, 2.0, 0)), 'LOCAL_DATA::DELIVERED', 0x00ff88, 900, () => {
            this.isDemoRunning = false;
            window.app.ui.log('success', '[TRANSPARENCY COMPLETE] File rendered on Node 1 screen as if stored on local disk.');
            window.app.ui.showToast('Transparency Demonstrated: Physical location completely hidden!', 'success');

            // Open the transparency comparison modal
            const transModal = document.getElementById('transparency-modal');
            if (transModal) transModal.classList.remove('hidden');
          });
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // DESIGN GOAL 2: OPENNESS (Standard Protocols & Multi-OS Interoperability)
  // --------------------------------------------------------------------------
  demonstrateOpenness() {
    if (this.isDemoRunning) return;
    this.isDemoRunning = true;

    // Apply OS branding to nodes
    this.cluster.setNodeOSProfiles();

    const node1 = this.cluster.getNode(1);
    const node2 = this.cluster.getNode(2);
    const node3 = this.cluster.getNode(3);
    const controllerPos = new THREE.Vector3(0, 3.2, 0);

    window.app.ui.log('info', '[OPENNESS] Initializing cross-platform RPC session: Linux ➔ Windows ➔ macOS.');
    window.app.ui.log('info', '[PROTOCOL] Standard RFC-Compliant JSON-RPC 2.0 / HTTP POST payload formatted.');
    window.app.ui.showToast('Openness: Linux exchanging JSON-RPC with Windows & macOS', 'info');

    // Camera transitions to frame nodes
    this.sim.transitionCamera(new THREE.Vector3(-4, 12, 22), new THREE.Vector3(-2, 2, 4), 1000);

    // Step 1: Linux Node 1 sends JSON-RPC call
    this.sim.sendDataPacket(node1.position.clone().add(new THREE.Vector3(0, 2.0, 0)), controllerPos, 'JSON-RPC::exec_sync()', 0xf59e0b, 1000, () => {
      window.app.ui.log('info', '[DOS ROUTER] Protocol validated: Content-Type: application/json. Routing to Windows Node 2...');

      // Step 2: Router forwards to Windows Node 2
      this.sim.sendDataPacket(controllerPos, node2.position.clone().add(new THREE.Vector3(0, 2.0, 0)), 'HTTP_POST::JSON_RPC', 0x38bdf8, 950, () => {
        window.app.ui.log('success', '[WINDOWS NT] Method executed: dos_getSystemStatus. No proprietary wrapper required.');

        // Step 3: Windows returns standard JSON response
        this.sim.sendDataPacket(node2.position.clone().add(new THREE.Vector3(0, 2.0, 0)), controllerPos, 'JSON_RESP::200_OK', 0x00ff88, 900, () => {
          this.sim.sendDataPacket(controllerPos, node1.position.clone().add(new THREE.Vector3(0, 2.0, 0)), 'RPC_SUCCESS::STATUS_OK', 0x00ff88, 900, () => {
            audio.playSuccess();
            window.app.ui.log('success', '[OPENNESS VERIFIED] Linux and Windows interoperate smoothly using open standards.');
            window.app.ui.showToast('Openness Verified: Click "Inspect Protocol Packet" to view JSON payload!', 'success');
            this.isDemoRunning = false;
          });
        });

        // Concurrently synchronize with macOS Node 3
        if (node3) {
          this.sim.sendDataPacket(controllerPos, node3.position.clone().add(new THREE.Vector3(0, 2.0, 0)), 'HTTP_GET::SYNC_MAC', 0xa855f7, 1000);
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // DESIGN GOAL 6: FLEXIBILITY (Heterogeneous Hardware Scheduling)
  // --------------------------------------------------------------------------
  demonstrateFlexibility() {
    if (this.isDemoRunning) return;
    this.isDemoRunning = true;

    // Apply Hardware branding
    this.cluster.setNodeHWProfiles();

    const node1 = this.cluster.getNode(1);
    const node2 = this.cluster.getNode(2);
    const node3 = this.cluster.getNode(3);
    const controllerPos = new THREE.Vector3(0, 3.4, 0);

    window.app.ui.log('info', '[FLEXIBILITY] Scheduler received 3 heterogeneous workloads with differing computational needs.');
    window.app.ui.log('info', '[SCHEDULER] Matching Task 1 ➔ x86_64 CPU | Task 2 ➔ ARM64 SoC | Task 3 ➔ NVIDIA Tensor GPU');
    window.app.ui.showToast('Flexibility: Mapping workloads to optimal heterogeneous hardware', 'info');

    this.sim.transitionCamera(new THREE.Vector3(0, 16, 24), new THREE.Vector3(0, 2, 0), 1000);

    const workloads = [
      { node: node1, label: 'x86::Kernel_Build', tag: 'C++ Build', color: 0x00f0ff },
      { node: node2, label: 'ARM::IoT_Telemetry', tag: 'Edge I/O', color: 0x00ff88 },
      { node: node3, label: 'GPU::Tensor_Math', tag: 'Deep Learning', color: 0xa855f7 }
    ];

    let finished = 0;

    workloads.forEach(w => {
      this.sim.sendDataPacket(controllerPos, w.node.position.clone().add(new THREE.Vector3(0, 2.0, 0)), w.label, w.color, 1100, () => {
        window.app.ui.log('warn', `[HETEROGENEOUS COMPUTE] Node ${w.node.id} executing ${w.tag}...`);

        let progress = 0;
        const interval = setInterval(() => {
          progress += 25;
          this.sim.updateScreenProcessing(w.node.group, progress, w.tag);

          if (progress >= 100) {
            clearInterval(interval);
            window.app.ui.log('success', `[NODE ${w.node.id}] ${w.tag} completed efficiently on native architecture.`);

            // Send completion packet back to controller
            this.sim.sendDataPacket(w.node.position.clone().add(new THREE.Vector3(0, 2.0, 0)), controllerPos, `DONE::${w.tag}`, 0x00ff88, 900, () => {
              finished++;
              if (finished === 3) {
                audio.playSuccess();
                window.app.ui.log('success', '[FLEXIBILITY COMPLETE] Heterogeneous cluster unified under single distributed microkernel.');
                window.app.ui.showToast('Flexibility Verified: Diverse hardware working as one!', 'success');
                this.isDemoRunning = false;
              }
            });
          }
        }, 300);
      });
    });
  }
}


// ============================================================================
// 5. PRESENTATION / TEACHING MODE CONTROLLER (Classroom Projector Layout)
// ============================================================================
class PresentationController {
  constructor(sim, scenario, cluster) {
    this.sim = sim;
    this.scenario = scenario;
    this.cluster = cluster;
    this.active = false;
    this.currentTrack = 'goals'; // Default to Design Goals or Need
    this.currentSlide = 0;

    this.tracks = {
      need: [
        {
          badge: 'CONCEPT 1 / 6',
          heading: 'Resource Sharing in Distributed Operating Systems',
          body: 'In a Distributed OS, multiple independent workstations seamlessly share expensive hardware (like network laser printers) and critical datasets (institutional databases). The user accesses shared resources transparently, as if they were local to their machine.',
          points: ['✔ Hardware Cost Reduction', '✔ Centralized Data Consistency', '✔ Single-System Image (SSI)'],
          demoBtnText: 'Run Resource Sharing Demonstration',
          camera: { pos: new THREE.Vector3(-8, 14, 22), target: new THREE.Vector3(-2, 2, 0) },
          action: () => this.scenario.demonstrateSharedPrinter()
        },
        {
          badge: 'CONCEPT 2 / 6',
          heading: 'Improved Performance & Parallel Processing',
          body: 'Large computational workloads are partitioned into smaller sub-tasks and executed simultaneously across multiple CPU nodes. This yields linear speedup, turning hours of data processing into minutes by leveraging idle network compute power.',
          points: ['✔ Workload Partitioning', '✔ Parallel CPU Execution', '✔ 3x+ Linear Speedup'],
          demoBtnText: 'Execute 600-Record Parallel Task',
          camera: { pos: new THREE.Vector3(0, 16, 24), target: new THREE.Vector3(0, 2, 0) },
          action: () => this.scenario.demonstrateParallelProcessing()
        },
        {
          badge: 'CONCEPT 3 / 6',
          heading: 'Reliability and Fault Tolerance (High Availability)',
          body: 'A distributed system achieves high availability through state replication. If one server experiences a power outage or hardware crash, backup replicas automatically elect a new primary node with zero loss of client connectivity or data.',
          points: ['✔ Replicated State Machines', '✔ Automatic Transparent Failover', '✔ 99.999% Service Uptime'],
          demoBtnText: 'Simulate Primary Server Crash',
          camera: { pos: new THREE.Vector3(14, 10, 14), target: new THREE.Vector3(14, 3, 0) },
          action: () => this.scenario.simulateServerCrash()
        },
        {
          badge: 'CONCEPT 4 / 6',
          heading: 'Horizontal Scalability (Scale-Out Architecture)',
          body: 'Unlike traditional mainframe systems that require expensive hardware upgrades (scale-up), a Distributed OS scales horizontally. New commercial workstations can be dynamically attached or detached from the cluster without system downtime.',
          points: ['✔ Dynamic Node Discovery', '✔ Incremental Cost Efficiency', '✔ Zero Downtime Expansion'],
          demoBtnText: 'Add New Computer Node',
          camera: { pos: new THREE.Vector3(0, 22, 26), target: new THREE.Vector3(0, 1, 0) },
          action: () => this.cluster.addNode(null, true)
        },
        {
          badge: 'CONCEPT 5 / 6',
          heading: 'Inter-Process Communication & Message Passing',
          body: 'Distributed operating systems provide communication transparency via Remote Procedure Calls (RPC) and message passing. Processes on different physical machines communicate over network sockets without having to manage raw TCP/IP connections.',
          points: ['✔ RPC (Remote Procedure Call)', '✔ Asynchronous Message Passing', '✔ Network Transparency'],
          demoBtnText: 'Transmit Inter-Node RPC Message',
          camera: { pos: new THREE.Vector3(-6, 12, 20), target: new THREE.Vector3(0, 2, 0) },
          action: () => this.scenario.sendMessage(1, 5, 'RPC')
        },
        {
          badge: 'CONCEPT 6 / 6',
          heading: 'Modern Real-World Applications of Distributed Systems',
          body: 'Distributed Operating Systems power the global digital economy: Cloud Hyper-scalers (AWS/Azure), high-frequency Financial Networks (VISA/SWIFT), E-Commerce (Amazon), and Scientific Grids (CERN Large Hadron Collider).',
          points: ['✔ Cloud & Container Clusters', '✔ High-Concurrency Banking', '✔ Scientific Supercomputing'],
          demoBtnText: 'Explore Cloud Computing Architecture',
          camera: { pos: new THREE.Vector3(0, 24, 28), target: new THREE.Vector3(0, 2, 0) },
          action: () => this.scenario.showApplicationInfo('cloud')
        }
      ],
      goals: [
        {
          badge: '01 · DESIGN GOAL · MADHAVAN G',
          heading: '01. Transparency',
          body: 'Hide the complexity of distributed resources from users and programs. The user accesses files, printers, and databases using standard local syntax (e.g. C:\\Exam_Grades.csv), while the distributed Virtual File System (VFS) resolves physical network locations invisibly.',
          points: ['✔ Location & Access Transparency', '✔ Migration Transparency', '✔ Single-System Image (SSI)'],
          demoBtnText: 'Demonstrate Location Transparency',
          camera: { pos: new THREE.Vector3(6, 14, 22), target: new THREE.Vector3(6, 2, 0) },
          action: () => this.scenario.demonstrateTransparency()
        },
        {
          badge: '02 · DESIGN GOAL · MADHAVAN G',
          heading: '02. Openness',
          body: 'Support standard interfaces and protocols so different systems interoperate cleanly. By relying on open specifications like POSIX, HTTP, and JSON-RPC 2.0, heterogeneous operating systems (Linux, Windows, and macOS) collaborate without vendor lock-in.',
          points: ['✔ Standard JSON-RPC & HTTP Protocols', '✔ Cross-OS Interoperability', '✔ Zero Vendor Lock-in'],
          demoBtnText: 'Demonstrate Multi-OS Interoperability',
          camera: { pos: new THREE.Vector3(-4, 12, 22), target: new THREE.Vector3(-2, 2, 4) },
          action: () => this.scenario.demonstrateOpenness()
        },
        {
          badge: '03 · DESIGN GOAL · MADHAVAN G',
          heading: '03. Scalability',
          body: 'Handle increasing numbers of users, resources, and geographic locations. A Distributed OS scales horizontally (scale-out) by dynamically attaching commodity workstations to expand compute throughput, rather than replacing expensive mainframes (scale-up).',
          points: ['✔ Horizontal Elastic Scale-Out', '✔ Dynamic Node Discovery', '✔ Zero-Downtime Expansion'],
          demoBtnText: 'Add New Computer Node',
          camera: { pos: new THREE.Vector3(0, 22, 26), target: new THREE.Vector3(0, 1, 0) },
          action: () => this.cluster.addNode(null, true)
        },
        {
          badge: '04 · DESIGN GOAL · MADHAVAN G',
          heading: '04. Reliability',
          body: 'Continue functioning despite component failures. Through state machine replication and distributed consensus protocols (Paxos / Raft), when a primary database server crashes, hot standby replicas take over in milliseconds with zero downtime.',
          points: ['✔ Fault Tolerance & Redundancy', '✔ Automatic Consensus Failover', '✔ 99.999% High Availability'],
          demoBtnText: 'Simulate Primary Server Crash',
          camera: { pos: new THREE.Vector3(14, 10, 14), target: new THREE.Vector3(14, 3, 0) },
          action: () => this.scenario.simulateServerCrash()
        },
        {
          badge: '05 · DESIGN GOAL · MADHAVAN G',
          heading: '05. Performance',
          body: 'Use distributed resources efficiently and keep communication overhead low. Batch tasks (such as processing 600 student exam records) are partitioned across multiple parallel CPU cores to achieve linear speedup and eliminate processing bottlenecks.',
          points: ['✔ Parallel Workload Partitioning', '✔ Low Communication Latency', '✔ 3x+ Linear Compute Speedup'],
          demoBtnText: 'Execute 600-Record Parallel Task',
          camera: { pos: new THREE.Vector3(0, 16, 24), target: new THREE.Vector3(0, 2, 0) },
          action: () => this.scenario.demonstrateParallelProcessing()
        },
        {
          badge: '06 · DESIGN GOAL · MADHAVAN G',
          heading: '06. Flexibility',
          body: 'Support different hardware and software environments. The distributed microkernel abstracts diverse CPU architectures (x86_64, ARM64, and GPU accelerators), allowing specialized workloads to execute on the most suitable hardware.',
          points: ['✔ Heterogeneous Hardware Support', '✔ Microkernel Abstraction', '✔ Intelligent Workload Matching'],
          demoBtnText: 'Schedule Heterogeneous Workloads',
          camera: { pos: new THREE.Vector3(0, 16, 24), target: new THREE.Vector3(0, 2, 0) },
          action: () => this.scenario.demonstrateFlexibility()
        }
      ]
    };

    this.bindEvents();
  }

  get slides() {
    return this.tracks[this.currentTrack] || this.tracks.goals;
  }

  bindEvents() {
    const presBtn = document.getElementById('presentation-btn');
    const exitBtn = document.getElementById('pres-exit-btn');
    const prevBtn = document.getElementById('pres-prev-btn');
    const nextBtn = document.getElementById('pres-next-btn');
    const demoBtn = document.getElementById('pres-demo-btn');

    if (presBtn) presBtn.addEventListener('click', () => this.togglePresentation(true));
    if (exitBtn) exitBtn.addEventListener('click', () => this.togglePresentation(false));
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
    if (demoBtn) demoBtn.addEventListener('click', () => this.runCurrentSlideDemo());

    // Presentation track switch buttons
    const btnTrackNeed = document.getElementById('pres-track-need');
    const btnTrackGoals = document.getElementById('pres-track-goals');
    if (btnTrackNeed) btnTrackNeed.addEventListener('click', () => this.switchTrack('need'));
    if (btnTrackGoals) btnTrackGoals.addEventListener('click', () => this.switchTrack('goals'));

    // Keyboard navigation (Arrow Left, Arrow Right, Spacebar, Escape)
    window.addEventListener('keydown', (e) => {
      if (!this.active) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        this.nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prevSlide();
      } else if (e.key === 'Escape') {
        this.togglePresentation(false);
      }
    });
  }

  switchTrack(trackName) {
    if (!this.tracks[trackName]) return;
    this.currentTrack = trackName;
    this.currentSlide = 0;

    const btnTrackNeed = document.getElementById('pres-track-need');
    const btnTrackGoals = document.getElementById('pres-track-goals');
    if (btnTrackNeed && btnTrackGoals) {
      btnTrackNeed.classList.toggle('active', trackName === 'need');
      btnTrackGoals.classList.toggle('active', trackName === 'goals');
    }

    const titleEl = document.getElementById('pres-seminar-title');
    if (titleEl) {
      titleEl.textContent = trackName === 'goals' 
        ? 'DISTRIBUTED OPERATING SYSTEM: SIX MAJOR DESIGN GOALS' 
        : 'DISTRIBUTED OPERATING SYSTEM: NEED AND IMPORTANCE';
    }

    this.renderSlide();
    audio.playClick();
  }

  togglePresentation(enable) {
    this.active = enable;
    const overlay = document.getElementById('presentation-overlay');
    const sidebar = document.getElementById('sidebar-controls');

    if (enable) {
      overlay.classList.remove('hidden');
      if (sidebar) sidebar.classList.add('collapsed');
      this.currentSlide = 0;
      this.renderSlide();
      audio.playClick();
      window.app.ui.showToast('Presentation Mode Active (Press ESC or click Exit to return)', 'info');
    } else {
      overlay.classList.add('hidden');
      if (sidebar) sidebar.classList.remove('collapsed');
      audio.playClick();
      // Restore overview camera
      this.sim.transitionCamera(new THREE.Vector3(0, 24, 30), new THREE.Vector3(0, 2, 0), 1200);
    }
  }

  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
      this.renderSlide();
      audio.playClick();
    } else {
      window.app.ui.showToast('You have reached the final slide of this section!', 'info');
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.renderSlide();
      audio.playClick();
    }
  }

  renderSlide() {
    const slide = this.slides[this.currentSlide];
    document.getElementById('pres-slide-num').textContent = `SLIDE ${this.currentSlide + 1} OF ${this.slides.length}`;
    document.getElementById('pres-step-badge').textContent = slide.badge;
    document.getElementById('pres-heading').textContent = slide.heading;
    document.getElementById('pres-body').textContent = slide.body;
    document.getElementById('pres-demo-btn-label').textContent = slide.demoBtnText;

    const pointsContainer = document.getElementById('pres-points');
    pointsContainer.innerHTML = '';
    slide.points.forEach(pt => {
      const tag = document.createElement('span');
      tag.className = 'key-point-tag';
      tag.textContent = pt;
      pointsContainer.appendChild(tag);
    });

    // Auto glide camera to frame slide's focal hardware!
    if (slide.camera) {
      this.sim.transitionCamera(slide.camera.pos, slide.camera.target, 1200);
    }
  }

  runCurrentSlideDemo() {
    const slide = this.slides[this.currentSlide];
    if (slide && slide.action) {
      slide.action();
    }
  }
}


// ============================================================================
// 6. UI CONTROLLER (HUD, Modals, Log Events & User Buttons)
// ============================================================================
class UIController {
  constructor() {
    this.toastTimer = null;
    this.bindDOM();
  }

  bindDOM() {
    // 1. Sidebar Track Switcher (Need & Importance vs Design Goals)
    const tabNeed = document.getElementById('tab-track-need');
    const tabGoals = document.getElementById('tab-track-goals');
    const secNeed = document.getElementById('section-need-importance');
    const secGoals = document.getElementById('section-design-goals');
    const activeBadge = document.getElementById('active-track-badge');

    if (tabNeed && tabGoals && secNeed && secGoals) {
      tabNeed.addEventListener('click', () => {
        tabNeed.classList.add('active');
        tabGoals.classList.remove('active');
        secNeed.classList.remove('hidden');
        secNeed.classList.add('active');
        secGoals.classList.add('hidden');
        secGoals.classList.remove('active');
        if (activeBadge) activeBadge.textContent = '6 MODULES';
        audio.playClick();
      });

      tabGoals.addEventListener('click', () => {
        tabGoals.classList.add('active');
        tabNeed.classList.remove('active');
        secGoals.classList.remove('hidden');
        secGoals.classList.add('active');
        secNeed.classList.add('hidden');
        secNeed.classList.remove('active');
        if (activeBadge) activeBadge.textContent = '6 GOALS';
        audio.playClick();
      });
    }

    // 2. Sidebar Accordion Concept Tabs
    const conceptCards = document.querySelectorAll('.concept-card');
    conceptCards.forEach(card => {
      const header = card.querySelector('.concept-header');
      if (header) {
        header.addEventListener('click', () => {
          const parentAccordion = card.closest('.modules-accordion');
          if (parentAccordion) {
            parentAccordion.querySelectorAll('.concept-card').forEach(c => c.classList.remove('active'));
          }
          card.classList.add('active');
          audio.playClick();
        });
      }
    });

    // 3. Sidebar Toggle Arrow
    const toggleBtn = document.getElementById('toggle-sidebar-btn');
    const sidebar = document.getElementById('sidebar-controls');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        audio.playClick();
      });
    }

    // 4. Audio Mute Toggle
    const soundBtn = document.getElementById('sound-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isEnabled = audio.toggle();
        soundBtn.querySelector('.nav-btn-text').textContent = isEnabled ? 'Audio: ON' : 'Audio: OFF';
        document.getElementById('sound-icon').textContent = isEnabled ? '🔊' : '🔇';
      });
    }

    // 5. Camera View Selector
    const camSelect = document.getElementById('camera-view-select');
    if (camSelect) {
      camSelect.addEventListener('change', (e) => {
        this.switchCameraView(e.target.value);
        audio.playClick();
      });
    }

    // 6. Reset Simulation Button
    const resetBtn = document.getElementById('reset-sim-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetSimulation();
      });
    }

    // 7. Track 1: Need & Importance Buttons
    const btnShareDb = document.getElementById('btn-share-db');
    const btnSharePrn = document.getElementById('btn-share-printer');
    if (btnShareDb) btnShareDb.addEventListener('click', () => window.app.scenario.demonstrateSharedDB());
    if (btnSharePrn) btnSharePrn.addEventListener('click', () => window.app.scenario.demonstrateSharedPrinter());

    const btnParallel = document.getElementById('btn-start-parallel');
    if (btnParallel) btnParallel.addEventListener('click', () => window.app.scenario.demonstrateParallelProcessing());

    const btnCrash = document.getElementById('btn-crash-server');
    const btnRecover = document.getElementById('btn-recover-server');
    if (btnCrash) btnCrash.addEventListener('click', () => window.app.scenario.simulateServerCrash());
    if (btnRecover) btnRecover.addEventListener('click', () => window.app.scenario.restoreServer());

    const btnAdd = document.getElementById('btn-add-node');
    const btnRemove = document.getElementById('btn-remove-node');
    if (btnAdd) btnAdd.addEventListener('click', () => window.app.cluster.addNode());
    if (btnRemove) btnRemove.addEventListener('click', () => window.app.cluster.removeNode());

    const btnSendMsg = document.getElementById('btn-send-message');
    if (btnSendMsg) {
      btnSendMsg.addEventListener('click', () => {
        const src = parseInt(document.getElementById('comm-src').value, 10);
        const dst = parseInt(document.getElementById('comm-dest').value, 10);
        const proto = document.getElementById('comm-protocol').value;
        window.app.scenario.sendMessage(src, dst, proto);
      });
    }

    const appChips = document.querySelectorAll('.app-chip');
    appChips.forEach(chip => {
      chip.addEventListener('click', () => {
        window.app.scenario.showApplicationInfo(chip.dataset.app);
      });
    });

    // 8. Track 2: Six Major Design Goals Buttons
    // Goal 1: Transparency
    const btnTransparency = document.getElementById('btn-goal-transparency');
    if (btnTransparency) {
      btnTransparency.addEventListener('click', () => window.app.scenario.demonstrateTransparency());
    }

    // Goal 2: Openness
    const btnOpenness = document.getElementById('btn-goal-openness');
    if (btnOpenness) {
      btnOpenness.addEventListener('click', () => window.app.scenario.demonstrateOpenness());
    }

    const btnInspectPacket = document.getElementById('btn-inspect-packet');
    const modalPacketInspector = document.getElementById('packet-inspector-modal');
    const btnClosePacketInspector = document.getElementById('packet-inspector-close');
    if (btnInspectPacket && modalPacketInspector) {
      btnInspectPacket.addEventListener('click', () => {
        modalPacketInspector.classList.remove('hidden');
        audio.playClick();
      });
    }
    if (btnClosePacketInspector && modalPacketInspector) {
      btnClosePacketInspector.addEventListener('click', () => {
        modalPacketInspector.classList.add('hidden');
      });
    }

    // Transparency Modal Close
    const modalTransparency = document.getElementById('transparency-modal');
    const btnCloseTransparency = document.getElementById('transparency-close');
    if (btnCloseTransparency && modalTransparency) {
      btnCloseTransparency.addEventListener('click', () => {
        modalTransparency.classList.add('hidden');
      });
    }

    // Goal 3: Scalability in Design Goals
    const btnDgAdd = document.getElementById('btn-dg-add-node');
    const btnDgRemove = document.getElementById('btn-dg-remove-node');
    if (btnDgAdd) btnDgAdd.addEventListener('click', () => window.app.cluster.addNode());
    if (btnDgRemove) btnDgRemove.addEventListener('click', () => window.app.cluster.removeNode());

    // Goal 4: Reliability in Design Goals
    const btnDgCrash = document.getElementById('btn-dg-crash-server');
    const btnDgRecover = document.getElementById('btn-dg-recover-server');
    if (btnDgCrash) btnDgCrash.addEventListener('click', () => window.app.scenario.simulateServerCrash());
    if (btnDgRecover) btnDgRecover.addEventListener('click', () => window.app.scenario.restoreServer());

    // Goal 5: Performance in Design Goals
    const btnDgParallel = document.getElementById('btn-dg-start-parallel');
    if (btnDgParallel) btnDgParallel.addEventListener('click', () => window.app.scenario.demonstrateParallelProcessing());

    // Goal 6: Flexibility
    const btnFlexibility = document.getElementById('btn-goal-flexibility');
    if (btnFlexibility) {
      btnFlexibility.addEventListener('click', () => window.app.scenario.demonstrateFlexibility());
    }

    // 9. Node Inspector Modal Close
    const inspectorClose = document.getElementById('inspector-close');
    if (inspectorClose) {
      inspectorClose.addEventListener('click', () => {
        document.getElementById('node-inspector').classList.add('hidden');
      });
    }

    // 10. Terminal Clear Button
    const termClear = document.getElementById('terminal-clear');
    if (termClear) {
      termClear.addEventListener('click', () => {
        document.getElementById('terminal-logs').innerHTML = '';
      });
    }
  }

  switchCameraView(viewKey) {
    const views = {
      overview: { pos: new THREE.Vector3(0, 24, 30), target: new THREE.Vector3(0, 2, 0) },
      controller: { pos: new THREE.Vector3(0, 6, 8), target: new THREE.Vector3(0, 2.5, 0) },
      workstations: { pos: new THREE.Vector3(-10, 8, 16), target: new THREE.Vector3(-6, 2, 6) },
      database: { pos: new THREE.Vector3(14, 8, 10), target: new THREE.Vector3(14, 3, 0) },
      printer: { pos: new THREE.Vector3(-14, 8, 10), target: new THREE.Vector3(-14, 2, 0) }
    };
    const v = views[viewKey] || views.overview;
    window.app.sim.transitionCamera(v.pos, v.target, 1200);
  }

  resetSimulation() {
    audio.playClick();
    window.app.cluster.setupInitialNodes(5);
    window.app.cluster.restoreNodeDefaultProfiles();
    window.app.scenario.restoreServer();
    this.switchCameraView('overview');
    document.getElementById('camera-view-select').value = 'overview';

    // Hide benchmarks & modals
    const bench = document.getElementById('parallel-benchmark');
    if (bench) bench.classList.add('hidden');

    const modalPacket = document.getElementById('packet-inspector-modal');
    if (modalPacket) modalPacket.classList.add('hidden');

    const modalTrans = document.getElementById('transparency-modal');
    if (modalTrans) modalTrans.classList.add('hidden');

    this.showToast('Simulation reset to initial state', 'info');
    this.log('system', '[RESET] Cluster state and models reset to factory initial state.');
  }

  openNodeInspector(node) {
    const inspector = document.getElementById('node-inspector');
    if (!inspector) return;

    document.getElementById('inspector-node-title').textContent = `Node ${node.id} (${node.role})`;
    document.getElementById('inspector-ip').textContent = node.ip;
    document.getElementById('inspector-status').textContent = node.status;
    document.getElementById('inspector-cpu').style.width = `${Math.floor(15 + Math.random() * 25)}%`;

    inspector.classList.remove('hidden');

    const queryBtn = document.getElementById('btn-node-test-query');
    const printBtn = document.getElementById('btn-node-test-print');

    // Remove old listeners
    const newQueryBtn = queryBtn.cloneNode(true);
    const newPrintBtn = printBtn.cloneNode(true);
    queryBtn.parentNode.replaceChild(newQueryBtn, queryBtn);
    printBtn.parentNode.replaceChild(newPrintBtn, printBtn);

    newQueryBtn.addEventListener('click', () => {
      window.app.scenario.demonstrateSharedDB();
    });
    newPrintBtn.addEventListener('click', () => {
      window.app.scenario.demonstrateSharedPrinter();
    });
  }

  log(type, message) {
    const logs = document.getElementById('terminal-logs');
    if (!logs) return;

    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    const time = new Date().toLocaleTimeString();
    entry.textContent = `[${time}] ${message}`;

    logs.appendChild(entry);
    logs.scrollTop = logs.scrollHeight;
  }

  showToast(message, type = 'info') {
    const toast = document.getElementById('toast-notification');
    const msgEl = document.getElementById('toast-message');
    const iconEl = document.getElementById('toast-icon');
    if (!toast || !msgEl) return;

    const icons = {
      info: 'ℹ️',
      success: '✅',
      warn: '⚠️',
      danger: '🚨'
    };

    iconEl.textContent = icons[type] || 'ℹ️';
    msgEl.textContent = message;

    toast.classList.remove('toast-hidden');

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.add('toast-hidden');
    }, 3800);
  }
}


// ============================================================================
// 7. MAIN APPLICATION BOOTSTRAP
// ============================================================================
window.addEventListener('DOMContentLoaded', () => {
  const sim = new Simulation3D('canvas-container');
  const cluster = new ClusterManager(sim);
  const scenario = new ScenarioController(sim, cluster);
  const presentation = new PresentationController(sim, scenario, cluster);
  const ui = new UIController();

  // Expose global app object
  window.app = {
    sim,
    cluster,
    scenario,
    presentation,
    ui
  };

  console.log('%c DISTRIBUTED OPERATING SYSTEM 3D SIMULATION INITIALIZED ', 'background: #00f0ff; color: #000; font-weight: bold; padding: 4px;');
});
