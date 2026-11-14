# ARES-TAC // Planetary Surface Traverse & EVA Ops Console
**NASA Space Apps Challenge 2026 // Raipur**  
**Challenge:** Interplanetary Survival Guide: Martian Map  
**Team:** Kasukabe Defence Group (Deepanki, Anuj, Anmol, Kafi)  

---

## 🚀 Live Demo & How to Run
No heavy installation or npm packages required. 

1. Simply double-click **`index.html`** or open it in any modern browser (Google Chrome, Microsoft Edge, Firefox, Brave).
2. To read or print the complete technical handbook prepared for judges, open **`NASA_SpaceApps_MartianMap_Guide_Kasukabe.html`** and click **"🖨️ Save as PDF"**.

---

## 🎯 Project Overview & Mission Target
* **Exploration Site:** Mount Sharp (Aeolis Mons), Gale Crater ($4.5895^\circ\text{ S}, 137.4417^\circ\text{ E}$)
* **Primary Science Target:** The **Mount Sharp Boxwork Formations** — fossilized subterranean hydrothermal veins discovered by NASA's Curiosity rover, representing one of the last habitable environments during Mars's wet-to-dry transition.
* **Core Innovation:** Unlike robotic rovers that move at 0.1 km/h, human astronauts are limited by strict 6–8 hour Extravehicular Activity (EVA) life-support packs. **ARES-TAC** fuses multi-mission orbital data (MOLA topography, HiRISE micro-hazards, CRISM mineralogy, REMS weather) into a mission-control console that dynamically computes metabolic exertion, oxygen depletion, and the critical **"Walkback Horizon" (Point of No Return)**.

---

## 🔬 Multi-Mission NASA Datasets Integrated
1. **NASA MGS MOLA (Mars Orbiter Laser Altimeter):** Topographical elevation profile and slope grade analysis ($0^\circ - 10^\circ$ safe, $10^\circ - 15^\circ$ caution, $>15^\circ$ strict NO-GO).
2. **NASA MRO HiRISE (High Resolution Imaging Science Experiment):** Identification of meter-scale hazards, barchan dune sand traps, and razor-sharp boxwork ridge curbs.
3. **NASA MRO CRISM (Compact Reconnaissance Imaging Spectrometer):** False-color mineral identification of smectite clays, crystalline hematite, and polyhydrated sulfates.
4. **NASA MSL Curiosity REMS (Rover Environmental Monitoring Station):** Real-time daily atmospheric pressure ($748\text{ Pa}$), surface temperature ($-38^\circ\text{C}$ to $-84^\circ\text{C}$), and dust optical depth ($\tau = 0.64$).

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
