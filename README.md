# ARES-TAC // Planetary Surface Traverse & EVA Ops Console

**NASA Space Apps Challenge 2026 // Raipur**
**Challenge:** Interplanetary Survival Guide: Martian Map
**Team:** Kasukabe Defence Group (Deepanki, Anuj, Anmol, Kafi)

---

## 🚀 Live Demo & How to Run

No heavy installation, npm build steps, or backend servers required.

1. **`Gindex.html` (Recommended Flagship Experience):** All-in-one Mars Safe Walk explorer featuring:
   * **Mount Sharp 3D Altimetry & Traverse Explorer:** Full 40 km DEM with MOLA elevation vs. slope hazard shading, vertical relief exaggeration ($1.0\times - 3.0\times$), 3D waypoint beacons, and glowing 3D traverse route.
   * **Photorealistic 3D Martian Street View:** Slope Hazard Heatmap (<10° Safe green, 10°–15° Caution amber, >15° NO-GO red), real-time lookahead slope alarm, and glowing navigation corridor ribbon.
   * **2D Orbital Map Planner:** High-contrast A* safest path corridor with NASA Mars Trek WMTS streaming and NASA HRP safety checks.
   * **NASA JPL Mars Trek 3D/VR Hub:** Direct deep-links to official NASA JPL Mars Trek portal for Gale Crater and Boxwork Ridge.
2. **`index.html`:** The Google Maps-style ARES-TAC mission console with turn-by-turn navigation and prioritized science dossiers.
3. Open either file in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Brave, Safari).
4. To read or print the complete technical handbook prepared for judges, open **`NASA_SpaceApps_MartianMap_Guide_Kasukabe.html`** and click **"🖨️ Save as PDF"**.

---

## 🎯 Project Overview & Mission Target

* **Exploration Site:** Mount Sharp (Aeolis Mons), Gale Crater ($4.5895^\circ\text{ S}, 137.4417^\circ\text{ E}$)
* **Primary Science Target:** The **Mount Sharp Boxwork Formations** — fossilized subterranean hydrothermal veins discovered by NASA's Curiosity rover, representing one of the last habitable environments during Mars's wet-to-dry transition.
* **Core Innovation:** Unlike robotic rovers that move at 0.1 km/h, human astronauts are limited by strict 6–8 hour Extravehicular Activity (EVA) life-support packs. **ARES-TAC** fuses multi-mission orbital data (MOLA topography, HiRISE micro-hazards, CRISM mineralogy, REMS weather) into a mission-control console that dynamically computes metabolic exertion, oxygen depletion, and the critical **"Walkback Horizon" (Point of No Return)**.

---

## 🌟 7D Real Experience & Next-Gen Exploration Features

1. **NASA Mars Trek Global HD Layer:** Integrated direct OGC Web Map Tile Service (WMTS) streaming from NASA JPL Solar System Treks for high-definition color altimetry.
2. **3D Suited Astronaut Avatar & WASD Walkthrough:** Game-like third-person suited astronaut avatar (NASA xEMU suit) with full WASD / Arrow / touch D-pad movement and realistic $0.38g$ low-gravity leaps.
3. **1st-Person Helmet Visor HUD:** Authentic curved spacesuit helmet glass with crosshairs, pitch ladder, heading bearing, and live bio-vitals (pulse, $O_2$ consumption rate, suit pressure).
4. **7D Martian Audio Synthesizer:** Real-time atmospheric wind acoustics modeled from NASA Perseverance SuperCam acoustic recordings combined with rhythmic closed-loop suit life-support oxygen regulator breathing (built using 100% offline Web Audio API).
5. **Prioritized Scientific & Historical Dossier Dropdown:** Detailed accordion dossier for every landmark prioritizing:
   * **Priority 1 (Critical):** Vital Scientific Discoveries & Ancient Habitability Assessment.
   * **Priority 2 (Archive):** Historical Rover Exploration, Sol Milestones & ChemCam Laser targets.
   * **Priority 3 (Geology):** CRISM & CheMin Mineralogy and Spectroscopy breakdown.
   * **Priority 4 (Protocol):** Micro-Hazard Terrain and Spacesuit Safety flight rules.
6. **Interactive 3D Science Hotspots:** Floating discovery beacons in the 360° panorama allowing astronauts to examine vein mineralogy and collect 50g rock core samples.
7. **Atmospheric Dust Storm Slider ($\tau$):** Live optical depth controller simulating clear skies ($\tau=0.4$) up to severe global dust storms ($\tau=3.5$).

---

## 🔬 Multi-Mission NASA Datasets Integrated

1. **NASA JPL Solar System Treks (Mars Trek):** High-definition global color shaded altimetry tile service.
2. **NASA MGS MOLA (Mars Orbiter Laser Altimeter):** Topographical elevation profile and slope grade analysis ($0^\circ - 10^\circ$ safe, $10^\circ - 15^\circ$ caution, $>15^\circ$ strict NO-GO).
3. **NASA MRO HiRISE (High Resolution Imaging Science Experiment):** Identification of meter-scale hazards, barchan dune sand traps, and razor-sharp boxwork ridge curbs.
4. **NASA MRO CRISM (Compact Reconnaissance Imaging Spectrometer):** False-color mineral identification of smectite clays, crystalline hematite, and polyhydrated sulfates.
5. **NASA MSL Curiosity REMS (Rover Environmental Monitoring Station):** Real-time daily atmospheric pressure ($748\text{ Pa}$), surface temperature ($-38^\circ\text{C}$ to $-84^\circ\text{C}$), and dust optical depth ($\tau = 0.64$).

---

## ⚙️ Quantitative Mathematical Models (NASA Human Research Program)

* **Tobler Martian Hiking Function:** Computes suited walking speed $v(\theta)$ as a function of incline gradient $\theta$.
* **Metabolic Rate:** Models energetic load from $280\text{ kcal/h}$ (flat regolith) up to $520\text{ kcal/h}$ (steep uphill climb).
* **Walkback Horizon:** Enforces NASA flight rules requiring a mandatory 45-minute return contingency reserve. If oxygen or battery reserves drop below return travel cost + 45 minutes, a **MASTER ALARM: ABORT EVA** is triggered.

---

## 👥 Kasukabe Defence Group Team Roles

* **Deepanki:** Project Lead, Systems Architecture, Boxwork Science Objectives & Pitch Narration.
* **Anuj:** Geospatial Engine, Leaflet integration & NASA WMTS tile streaming.
* **Anmol:** UI/UX Front-End & Mission Control aerospace design system.
* **Kafi:** Data Pipeline & EVA Metabolic/Walkback Physics engine.
