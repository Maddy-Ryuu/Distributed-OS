# DISTRIBUTED OPERATING SYSTEM – NEED, IMPORTANCE & DESIGN GOALS
### Interactive 3D Educational Simulation for College Seminar Presentation
**Presenter:** Madhavan G | **Course:** Distributed Systems / Operating Systems

This interactive 3D simulation demonstrates how autonomous computer nodes, peripheral devices, and replicated storage servers collaborate under a **Single-System Image (SSI)** to form a resilient, high-speed **Distributed Operating System (DOS)**.

The simulation contains two complete curriculum sections with **12 interactive 3D demonstrations**:
1. **PART 1: NEED & IMPORTANCE OF DISTRIBUTED OS (6 Core Demonstrations)**
2. **PART 2: SIX MAJOR DESIGN GOALS OF A DISTRIBUTED OS (6 Design Goal Demonstrations)**

---

## 🎯 Section 1: Six Major Design Goals (Madhavan G)

Directly matches the seminar slide **"03 · DESIGN GOALS · MADHAVAN G — Six major design goals"**:

```
+---------------------------------------------------------------------------------------------------+
| DISTRIBUTED OS   The design of a distributed operating system focuses on these six goals,         |
|                  which together decide how effective it will be.                                  |
+---------------------------------------------------------------------------------------------------+
| 01. TRANSPARENCY    | 02. OPENNESS        | 03. SCALABILITY                                       |
| Hide complexity     | Standard interfaces | Handle increasing numbers                             |
| of resources        | and protocols       | of users and resources                                |
|---------------------+---------------------+-------------------------------------------------------|
| 04. RELIABILITY     | 05. PERFORMANCE     | 06. FLEXIBILITY                                       |
| Continue functioning| Efficient resource  | Support different hardware                            |
| despite failures    | use, low overhead   | and software environments                             |
+---------------------------------------------------------------------------------------------------+
```

### 1. Transparency (Location & Access Transparency)
* **What it is:** Hiding the physical location and access mechanism of resources from users and programs.
* **3D Working Demonstration:**
  * Click **"Access Remote File via Local Path"**.
  * Workstation 1 calls local file path: `C:\Users\Student\Documents\Exam_Grades.csv`.
  * The DOS Virtual File System (VFS) intercepts the call, resolves the physical network address (`192.168.1.50:/srv/storage/cluster/grades.csv`), and routes request packets to remote Server `DB-01`.
  * The file stream packet returns to Workstation 1, rendering the grade spreadsheet on screen.
  * A comparison dialog demonstrates the **Local Illusion** vs **Network Reality**.

### 2. Openness (Standard Interfaces & Interoperability)
* **What it is:** Supporting standard interfaces and open protocols (POSIX, HTTP, JSON-RPC 2.0) so different operating systems can interoperate without vendor lock-in.
* **3D Working Demonstration:**
  * Workstations are branded with distinct OS environments:
    * **Node 1:** 🐧 Linux POSIX (Ubuntu 24.04)
    * **Node 2:** 🪟 Windows NT (Win 11 Enterprise)
    * **Node 3:** 🍎 macOS Darwin (Sonoma)
  * Click **"Exchange Data via Standard JSON-RPC"**: Node 1 (Linux) invokes a standard JSON-RPC 2.0 method over HTTP, routed through the DOS switch to Node 2 (Windows). Node 2 processes the call and returns standard JSON response `{"jsonrpc": "2.0", "result": "STATUS_OK"}`.
  * Click **"Inspect Protocol Packet Structure"** to open a live packet inspector showing the RFC-compliant JSON payload.

### 3. Scalability (Horizontal Scale-Out Capacity)
* **What it is:** Handling increasing numbers of users, resources, and geographic locations without central bottlenecks.
* **3D Working Demonstration:**
  * Click **"Add Computer (+)"** to dynamically spawn a new 3D workstation into the circular cluster.
  * An animated fiber cable connects to the central switch, and the cluster capacity counter increases by **+15.0 GFLOPS** per node.
  * Click **"Remove Computer (-)"** to gracefully decommission nodes without rebooting.

### 4. Reliability (Fault Tolerance & High Availability)
* **What it is:** Continuing to function normally even when individual hardware or software components fail.
* **3D Working Demonstration:**
  * Displays two synchronized database servers: `DB-01 (Primary Active)` and `DB-02 (Standby Replica)` linked by an active green heartbeat line.
  * Click **"Simulate Server Failure"**: DB-01 experiences power failure, turns red, alarm sounds, and the heartbeat breaks.
  * The DOS Paxos consensus promotes `DB-02` to **Active Primary** in 45ms.
  * Subsequent queries route to `DB-02` with **zero user downtime**.
  * Click **"Restore Primary Server"** to reboot DB-01 and synchronize write-ahead logs.

### 5. Performance (Distributed Resource Efficiency)
* **What it is:** Utilizing distributed resources efficiently while keeping communication latency and network overhead minimal.
* **3D Working Demonstration:**
  * Workload: **600 Student Examination Records**.
  * The DOS scheduler slices the workload into 3 parallel sub-tasks (200 records each) dispatched simultaneously to Nodes 1, 2, and 3.
  * Simultaneous computing progress bars fill on-screen, proving **3x linear compute speedup** (4.0s vs 12.0s on a standalone machine).

### 6. Flexibility (Heterogeneous Hardware & Software Support)
* **What it is:** Supporting different hardware architectures (x86, ARM, GPUs) under one unified operating system.
* **3D Working Demonstration:**
  * Nodes receive distinct hardware architecture profiles:
    * **Node 1:** `⚡ Intel x86_64 CPU` (Optimized for C++ compilation)
    * **Node 2:** `🔋 ARM64 Low-Power SoC` (Optimized for IoT sensor telemetry)
    * **Node 3:** `🚀 NVIDIA Tensor GPU` (Optimized for deep learning matrix math)
  * Click **"Schedule Heterogeneous Workloads"**: The DOS microkernel dynamically inspects task metadata and routes each workload to its optimal hardware architecture.
  * Simultaneous task progress bars fill with hardware-specific indicators.

---

## 🌐 Section 2: Need & Importance (6 Core Architecture Modules)

1. **Hardware & Data Resource Sharing:** Nodes 1 & 3 query database concurrently; Node 2 spools a 15-page print job to the shared laser printer with mechanical paper ejection animation.
2. **Parallel Processing & Speedup:** 600 exam records decomposed across 3 CPUs with live benchmark graph.
3. **Reliability & Automatic Failover:** Server crash simulation with Paxos consensus failover.
4. **Horizontal Scalability:** Scale-out cluster topology from 3 to 8 nodes with live capacity metrics.
5. **Inter-Process Communication:** Configurable Source, Destination, and protocol (RPC, IPC, Sync) with packet inspection.
6. **Modern Industry Applications:** Interactive 3D exhibition of Cloud Computing (Netflix), Online Banking (VISA), E-Commerce (Amazon), Scientific Research (CERN), and Distributed Databases (Google Spanner).

---

## 📽️ Seminar Presentation Mode (Projector Friendly)

Designed specifically for classroom delivery on a laptop and projector:
1. Click **"📽️ Presentation Mode"** in the top navigation bar.
2. Choose your curriculum track at the top:
   - **"Six Design Goals"** (Madhavan G's 6 design goals slides)
   - **"Need & Importance"** (6 core architecture slides)
3. Use **`Arrow Right`** or **`Spacebar`** for Next Slide, **`Arrow Left`** for Previous Slide, and **`Escape`** to Exit.
4. On every slide, the 3D camera glides smoothly to frame the exact hardware being discussed.
5. Click **"Run Live 3D Demonstration"** on the bottom presentation stage to trigger the animation while speaking to your audience.
6. Click **"Reset"** at any time to restore the lab to its pristine factory state.

---

## 🚀 How to Run Locally

### Option 1: Direct Double-Click (Zero Setup)
Open the project directory and double-click `index.html` in Google Chrome, Microsoft Edge, Brave, or Mozilla Firefox.

### Option 2: Local Python Web Server (Recommended)
Open PowerShell in this folder and run:
```powershell
python -m http.server 8000
```
Then navigate to: `http://localhost:8000`

### Option 3: Node.js (npx serve)
```powershell
npx serve .
```

---

## 📁 Package Contents

- `index.html` — Main HTML5 application with track selector, presentation stage, and educational modals.
- `style.css` — Dark navy glassmorphism cyberpunk styling with high-contrast projector typography.
- `script.js` — Three.js 3D engine, procedural computer models, Web Audio API synthesizer, and all 12 simulation modules.
- `vendor/` — Offline Three.js r128, OrbitControls.js, and tween.umd.js (with CDN fallback).
- `distributed-os-3d-seminar.zip` — Complete updated zip archive ready for distribution.
