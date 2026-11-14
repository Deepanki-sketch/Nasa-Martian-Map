/**
 * NASA Space Apps Challenge 2026 - Mars Maps
 * Verified Mars Surface Data for Gale Crater & Mount Sharp
 * Plain Language for Astronauts & Surface Visitors
 */

const MARS_DATA = {
  mission: {
    siteName: "Gale Crater & Mount Sharp",
    baseLocation: "Base Camp (Bradbury Landing)",
    latDecimal: -4.5895,
    lonDecimal: 137.4417,
    baseElevationM: -4462,
    sol: 4320,
    
    // Environment & Weather in Plain Language
    weather: {
      temperatureGround: "-38°C (-36°F)",
      temperatureAir: "-52°C (-62°F)",
      airPressure: "748 Pascals (very thin CO2 air)",
      skyCondition: "Clear with light red dust haze",
      radiationLevel: "Normal Mars background (0.21 mGy/day)"
    }
  },

  // Places to Visit on Mars (Plain English)
  waypoints: [
    {
      id: "HAB-01",
      name: "Base Camp (Your Habitat)",
      shortName: "Base Camp",
      coords: [-4.5895, 137.4417],
      elevationM: -4462,
      slopeDeg: 1.8,
      type: "base",
      whatIsHere: "Your pressurized living habitat and landing site.",
      surfaceGround: "Flat red bedrock covered with thin dust. Very easy to walk on.",
      photoLocal: "images/pahrump_hills.jpg",
      photoCaption: "View looking south across the crater floor toward Mount Sharp.",
      streetViewAvailable: true,
      historicalDossier: {
        priority1: {
          tag: "P1 · PRIMARY HABITAT",
          title: "Expedition Landing Site & Life Support Sanctuary",
          keyDiscovery: "Bradbury Landing alluvial flat provides a stable, bedrock foundation shielded from severe crater-rim wind turbulence.",
          habitability: "High structural stability. Base camp houses the oxygen generation plant (MOXIE-scale), water extraction unit, and sealed pressurized habitat.",
          scienceValue: "Anchor point for the 45-minute mandatory contingency walkback perimeter."
        },
        priority2: {
          tag: "P2 · MISSION ARCHIVE",
          solDiscovered: "Sol 0 (August 5, 2012)",
          instrument: "NASA MSL Curiosity Entry, Descent & Landing (EDL) Sky Crane",
          historicalArchive: "Curiosity touched down precisely on target inside Gale Crater, named in honor of author Ray Bradbury. Past descent imagery confirmed meter-thick bedrock under light regolith."
        },
        priority3: {
          tag: "P3 · MINERALOGY",
          minerals: [
            { name: "Basaltic Sand & Silt", pct: "52%" },
            { name: "Plagioclase Feldspar", pct: "28%" },
            { name: "Amorphous Silica", pct: "20%" }
          ],
          spectroscopy: "Low hydration signatures; dry basaltic regolith pavement."
        },
        priority4: {
          tag: "P4 · SUIT PROTOCOL",
          hazardLevel: "Nominal / Low Risk",
          suitPunctureRisk: "Low (smooth regolith)",
          protocolRules: "Nominal xEMU suit egress; perform airlock seal integrity check before stepping off the access ramp."
        }
      }
    },
    {
      id: "WP-01",
      name: "Pahrump Hills (Ancient Lake Mud)",
      shortName: "Pahrump Hills",
      coords: [-4.6450, 137.4080],
      elevationM: -4420,
      slopeDeg: 5.4,
      type: "science",
      whatIsHere: "Layers of hardened clay and mud from billions of years ago when Gale Crater was a lake.",
      surfaceGround: "Gentle slope. Firm footing for spacesuit boots.",
      photoLocal: "images/pahrump_hills.jpg",
      photoCaption: "Curiosity Mastcam photo of layered rock shelves at Pahrump Hills.",
      streetViewAvailable: true,
      historicalDossier: {
        priority1: {
          tag: "P1 · LAKEBED SEDIMENT",
          title: "Proof of Ancient Habitable Gale Crater Lake",
          keyDiscovery: "Fine-grained mudstone (Murray Formation) deposited over millions of years by tranquil, standing lake water. Neutral pH and low salinity.",
          habitability: "Ancient habitability verified; contains bio-essential elements: Carbon, Hydrogen, Oxygen, Nitrogen, Phosphorus, Sulfur (CHNOPS).",
          scienceValue: "Prime astrobiology target for fossilized microbial biosignature preservation."
        },
        priority2: {
          tag: "P2 · MISSION ARCHIVE",
          solDiscovered: "Sol 753 - Sol 790 (September 2014)",
          instrument: "Curiosity Mastcam & ChemCam Laser Spectrometer",
          historicalArchive: "Curiosity conducted its first drill campaigns into the basal Murray Formation here ('Confidence Hills' drill hole). Mastcam revealed distinctive cross-bedded sandstone shelves."
        },
        priority3: {
          tag: "P3 · MINERALOGY",
          minerals: [
            { name: "Smectite Clay Minerals", pct: "42%" },
            { name: "Magnetite & Hematite", pct: "31%" },
            { name: "Calcium Sulfate Veins", pct: "27%" }
          ],
          spectroscopy: "Strong octahedral Fe/Mg-OH absorption band at 2.3 μm indicating prolonged water-rock interactions."
        },
        priority4: {
          tag: "P4 · SUIT PROTOCOL",
          hazardLevel: "Low to Moderate Risk",
          suitPunctureRisk: "Low; crumbly mudstone shelves",
          protocolRules: "Avoid stepping on protruding thin shale edges to prevent boot scuffing and suit balance instability."
        }
      }
    },
    {
      id: "WP-02",
      name: "Vera Rubin Ridge (Red Iron Cliffs)",
      shortName: "Vera Rubin Ridge",
      coords: [-4.6900, 137.3850],
      elevationM: -4280,
      slopeDeg: 12.8,
      type: "science",
      whatIsHere: "A long, dark ridge rich in gray and red hematite iron ore.",
      surfaceGround: "Steep climb over hard rocky ridges. Take your time to save oxygen.",
      photoLocal: "images/vera_rubin.jpg",
      photoCaption: "Curiosity photo looking back down the slope from the top of the iron ridge.",
      streetViewAvailable: true,
      historicalDossier: {
        priority1: {
          tag: "P1 · OXIDATION EVENT",
          title: "Red Crystalline Hematite & Ancient Groundwater Plumes",
          keyDiscovery: "Massive hard iron-oxide ridge formed by acidic to neutral groundwater mixing that precipitated gray and red crystalline hematite along regional fractures.",
          habitability: "Moderate; marks the transition zone where groundwater became progressively more oxidized as the climate dried out.",
          scienceValue: "Critical recorder of Mars's atmospheric oxygenation and climatic drying transition."
        },
        priority2: {
          tag: "P2 · MISSION ARCHIVE",
          solDiscovered: "Sol 1800 - Sol 2300 (September 2017 - January 2019)",
          instrument: "Curiosity MAHLI, APXS & CRISM Orbiter Targeted Observation",
          historicalArchive: "Named in honor of astronomer Vera Rubin. Curiosity spent 16 months traversing this ridge, drilling exceptionally hard targets ('Stoer', 'Rock Hall') that tested the rover's percussion drill to its limits."
        },
        priority3: {
          tag: "P3 · MINERALOGY",
          minerals: [
            { name: "Crystalline Hematite (Fe2O3)", pct: "58%" },
            { name: "Ferrihydrite & Goethite", pct: "24%" },
            { name: "Quartz / Silicates", pct: "18%" }
          ],
          spectroscopy: "Distinctive 860 nm hematite absorption band identified from orbit by MRO CRISM."
        },
        priority4: {
          tag: "P4 · SUIT PROTOCOL",
          hazardLevel: "Moderate to High (12.8° Incline)",
          suitPunctureRisk: "Moderate (hard flint-like chert & hematite spurs)",
          protocolRules: "Maintain three points of contact on steep ascent. Reduce pace to keep suited metabolic rate below 380 kcal/hr."
        }
      }
    },
    {
      id: "WP-03",
      name: "Sulfate Valley (Ancient Salt Flats)",
      shortName: "Sulfate Valley",
      coords: [-4.7280, 137.3700],
      elevationM: -4110,
      slopeDeg: 9.7,
      type: "science",
      whatIsHere: "Salty mineral beds left behind when Mars slowly dried up.",
      surfaceGround: "Rocky benches with loose sand and gravel ribbons.",
      photoLocal: null,
      photoCaption: "High-resolution orbital satellite photograph.",
      streetViewAvailable: false,
      historicalDossier: {
        priority1: {
          tag: "P1 · DESICCATION EPOCH",
          title: "Evaporite Salt Flats of the Great Martian Drying",
          keyDiscovery: "Polyhydrated magnesium and calcium sulfates (gypsum, bassanite) deposited as ancient lakes evaporated away into hyper-saline brines.",
          habitability: "Extreme halophile / brine environment. Salts act as natural radiation shields capable of shielding dormant microbial spores.",
          scienceValue: "Essential for understanding how surface liquid water vanished from Mars ~3 billion years ago."
        },
        priority2: {
          tag: "P2 · MISSION ARCHIVE",
          solDiscovered: "Sol 3200 - Sol 3700 (August 2021 - February 2023)",
          instrument: "Curiosity CheMin X-ray Diffraction & DAN Neutron Detector",
          historicalArchive: "Curiosity discovered unique 'popcorn' textured nodules and polygonal desiccation cracks, signaling repeated wet-dry seasonal cycles on early Mars."
        },
        priority3: {
          tag: "P3 · MINERALOGY",
          minerals: [
            { name: "Magnesium Sulfates (Starkeyite)", pct: "46%" },
            { name: "Calcium Sulfate (Gypsum)", pct: "34%" },
            { name: "Clay Residues", pct: "20%" }
          ],
          spectroscopy: "Hydration water absorption at 1.9 μm and sulfate doublet features at 2.4 μm."
        },
        priority4: {
          tag: "P4 · SUIT PROTOCOL",
          hazardLevel: "Moderate Risk",
          suitPunctureRisk: "Low to Moderate; slippery sulfate crystals",
          protocolRules: "Loose gravel ribbons reduce boot traction. Ensure crampon spikes are engaged on spacesuit boots."
        }
      }
    },
    {
      id: "WP-04",
      name: "Boxwork Ridge (Spiderweb Mineral Walls)",
      shortName: "Boxwork Ridge",
      coords: [-4.7650, 137.3550],
      elevationM: -3950,
      slopeDeg: 14.5,
      type: "prime_science",
      whatIsHere: "A vast spiderweb of mineral walls 1 to 2 meters high that formed along underground water cracks.",
      surfaceGround: "Sharp, knife-edge rocky blades. Step carefully to avoid tearing your spacesuit.",
      photoLocal: "images/boxwork_mastcam.jpg",
      photoCaption: "360-degree Curiosity Mastcam panorama inside the boxwork mineral ridge maze.",
      streetViewAvailable: true,
      historicalDossier: {
        priority1: {
          tag: "P1 · SUBTERRANEAN HAVEN",
          title: "Subsurface Hydrothermal Vein Maze & Last Habitable Oasis",
          keyDiscovery: "Extensive polygonal boxwork networks: warm subterranean water carrying dissolved minerals seeped through deep tectonic bedrock fractures. As softer rock eroded over billions of years, the hard mineralized veins stood standing as towering 1-2 meter walls.",
          habitability: "Highest priority on Mars. Subsurface hydrothermal veins offered protection from deadly surface UV and galactic cosmic radiation during Mars's final habitable era.",
          scienceValue: "Prime candidate for intact subterranean biomarkers and preserved organic carbon molecules."
        },
        priority2: {
          tag: "P2 · MISSION ARCHIVE",
          solDiscovered: "Sol 4250 - Present (2024 - 2026)",
          instrument: "Curiosity Mastcam 360 Gigapan & HiRISE High-Res Stereo Orbital Imaging",
          historicalArchive: "Discovered on the upper slopes of Mount Sharp. Curiosity entered the labyrinth of boxwork ridges, capturing the first in-situ ground photographs of these structures ever seen on another planet."
        },
        priority3: {
          tag: "P3 · MINERALOGY",
          minerals: [
            { name: "Silica-Cemented Hydrothermal Veins", pct: "64%" },
            { name: "Polyhydrated Sulfate Cement", pct: "22%" },
            { name: "Iron-Magnesium Carbonates", pct: "14%" }
          ],
          spectroscopy: "Elevated silica peaks and hydroxyl overtone features confirmed by orbital CRISM and surface ChemCam."
        },
        priority4: {
          tag: "P4 · SUIT PROTOCOL",
          hazardLevel: "High Risk (Sharp Mineral Blades & 14.5° Slope)",
          suitPunctureRisk: "CRITICAL: Razor-sharp mineral curbs capable of puncturing pressurized suit outer beta-cloth layers",
          protocolRules: "Strict 1-meter standoff from narrow boxwork fins. Do not climb over blade tops. Keep tether engaged."
        }
      }
    },
    {
      id: "WP-05",
      name: "Gediz Vallis (Giant Boulder Canyon)",
      shortName: "Gediz Vallis",
      coords: [-4.7950, 137.3450],
      elevationM: -3820,
      slopeDeg: 17.2,
      type: "hazard",
      whatIsHere: "A dramatic canyon carved by ancient catastrophic flash floods and boulder mudflows.",
      surfaceGround: "Extremely steep 17° slope with loose rolling boulders. Do not attempt on foot without safety ropes.",
      photoLocal: "images/gediz_vallis.jpg",
      photoCaption: "HiRISE orbital photo of the deep boulder channel of Gediz Vallis.",
      streetViewAvailable: true,
      historicalDossier: {
        priority1: {
          tag: "P1 · CATACLYSMIC FLOOD",
          title: "Late-Stage Torrential Debris Floods from High Mount Sharp",
          keyDiscovery: "Carved by violent, late-stage water and boulder mudflows tumbling down from the high summit of Aeolis Mons, proving liquid water flowed much later in Martian history than previously believed.",
          habitability: "Low habitability during flash floods; high scientific value for summit rock stratigraphy transported down.",
          scienceValue: "Delivers geological samples from high mountain peaks unreachable by rovers or suited astronauts."
        },
        priority2: {
          tag: "P2 · MISSION ARCHIVE",
          solDiscovered: "Sol 3900 - Sol 4200 (Late 2023 - 2024)",
          instrument: "Curiosity ChemCam Long-Distance RMI & APXS Spectrometer",
          historicalArchive: "Curiosity navigated across the boulder ridge of Gediz Vallis, identifying car-sized boulders originating kilometers higher up Mount Sharp."
        },
        priority3: {
          tag: "P3 · MINERALOGY",
          minerals: [
            { name: "Coarse Boulder Conglomerate", pct: "50%" },
            { name: "Anhydrite & Bassanite", pct: "30%" },
            { name: "Pyroxene & Olivine", pct: "20%" }
          ],
          spectroscopy: "Unweathered igneous minerals mixed with episodic sulfate cements."
        },
        priority4: {
          tag: "P4 · SUIT PROTOCOL",
          hazardLevel: "SEVERE HAZARD (17.2° Slope - Strict NO-GO On Foot)",
          suitPunctureRisk: "High; loose unstable rolling boulders and scree",
          protocolRules: "NASA Flight Rule NO-GO for unroped human foot traverse. Pressurized rover (SEV) or autonomous drone scout required."
        }
      }
    }
  ],

  hazardZones: [
    {
      id: "HAZ-01",
      name: "Namib Dark Sand Dunes",
      type: "sand_trap",
      coords: [
        [-4.660, 137.395],
        [-4.650, 137.400],
        [-4.655, 137.415],
        [-4.665, 137.410]
      ],
      warning: "Soft deep basaltic sand. Heavy spacesuits will sink and get stuck.",
      standoff: "Keep 50 meters away"
    },
    {
      id: "HAZ-02",
      name: "Upper Gediz Steep Cliffs",
      type: "steep_slope",
      coords: [
        [-4.785, 137.335],
        [-4.778, 137.348],
        [-4.790, 137.355],
        [-4.798, 137.342]
      ],
      warning: "Slope is over 17° with loose rock slides.",
      standoff: "Do not hike on foot"
    }
  ],

  elevationProfile: [
    { distKm: 0.0, elevM: -4462, slopeDeg: 1.8, name: "Base Camp" },
    { distKm: 3.8, elevM: -4420, slopeDeg: 5.4, name: "Pahrump Hills" },
    { distKm: 6.8, elevM: -4280, slopeDeg: 12.8, name: "Vera Rubin" },
    { distKm: 9.2, elevM: -4110, slopeDeg: 9.7, name: "Sulfate Valley" },
    { distKm: 11.6, elevM: -3950, slopeDeg: 14.5, name: "Boxwork Ridge" },
    { distKm: 13.4, elevM: -3820, slopeDeg: 17.2, name: "Gediz Vallis" }
  ],

  // Global Planetary Survey Locations Across Mars
  planetarySites: [
    {
      id: "SITE-GALE",
      name: "Gale Crater & Mount Sharp",
      region: "Aeolis Palus",
      coords: [-4.765, 137.355],
      elevationM: -3950,
      elevRelText: "Base site · Mount Sharp slopes",
      surfaceGround: "Knife-edge mineral boxwork ridges and clay beds.",
      temp: "-38°C",
      airPressure: "748 Pa (0.007 atm)",
      mission: "Curiosity Rover (NASA MSL)",
      panoramaKey: "boxwork",
      photoLocal: "images/boxwork_mastcam.jpg",
      scienceSummary: "Ancient groundwater fractures filled with mineral veins forming boxwork spiderweb ridges."
    },
    {
      id: "SITE-JEZERO",
      name: "Jezero Crater - River Delta",
      region: "Isidis Planitia Margin",
      coords: [18.38, 77.58],
      elevationM: -2530,
      elevRelText: "1,420m higher than Gale",
      surfaceGround: "Layered delta mudstone and boulder-strewn riverbeds.",
      temp: "-46°C",
      airPressure: "690 Pa",
      mission: "Perseverance Rover & Ingenuity (NASA M2020)",
      panoramaKey: "jezero",
      photoLocal: null,
      scienceSummary: "Ancient river delta fan preserving sedimentary clay muds and astrobiology biosignature samples."
    },
    {
      id: "SITE-OLYMPUS",
      name: "Olympus Mons - Caldera Summit",
      region: "Tharsis Volcanic Plateau",
      coords: [18.65, 226.20],
      elevationM: 21287,
      elevRelText: "25,749m above Gale Base Camp",
      surfaceGround: "Vast basalt lava plains and collapsed caldera cliffs.",
      temp: "-68°C",
      airPressure: "70 Pa (Ultra-thin near-vacuum)",
      mission: "Mariner 9 / Mars Express / MRO",
      panoramaKey: "olympus",
      photoLocal: null,
      scienceSummary: "Largest planetary volcano in the Solar System, towering 21.9 km with six nested collapse calderas."
    },
    {
      id: "SITE-VALLES",
      name: "Valles Marineris - Ophir Chasma",
      region: "Coprates Quadrangle",
      coords: [-4.00, 285.50],
      elevationM: -5200,
      elevRelText: "738m deeper than Gale Crater floor",
      surfaceGround: "Towering 7-km layered canyon walls and landslide debris fans.",
      temp: "-32°C",
      airPressure: "840 Pa (Dense canyon basin air)",
      mission: "Viking Orbiter / Odyssey / MRO",
      panoramaKey: "valles",
      photoLocal: null,
      scienceSummary: "The Grand Canyon of Mars, over 4,000 km long and up to 7 km deep, exposing billions of years of crust."
    },
    {
      id: "SITE-GUSEV",
      name: "Gusev Crater - Columbia Hills",
      region: "Aeolis Quadrangle",
      coords: [-14.57, 175.47],
      elevationM: -1930,
      elevRelText: "2,020m higher than Gale floor",
      surfaceGround: "Wind-sculpted volcanic basalt rocks and silica hot spring vents.",
      temp: "-42°C",
      airPressure: "710 Pa",
      mission: "Spirit Rover (NASA MER-A)",
      panoramaKey: "gusev",
      photoLocal: null,
      scienceSummary: "Ancient volcanic crater hosting hot spring hydrothermal vents and volcanic ash terraces."
    },
    {
      id: "SITE-MERIDIANI",
      name: "Meridiani Planum - Victoria Crater",
      region: "Margaritifer Sinus",
      coords: [-2.05, 354.47],
      elevationM: -1380,
      elevRelText: "2,570m higher than Gale floor",
      surfaceGround: "Flat sulfate sandstone paved with hematite 'Martian blueberry' spherules.",
      temp: "-40°C",
      airPressure: "730 Pa",
      mission: "Opportunity Rover (NASA MER-B)",
      panoramaKey: "meridiani",
      photoLocal: null,
      scienceSummary: "Evidence of past acidic standing water and sulfate sedimentary salt flats with hematite concretions."
    },
    {
      id: "SITE-UTOPIA",
      name: "Utopia Planitia - Subsurface Ice Sheet",
      region: "Casius Quadrangle",
      coords: [25.07, 109.93],
      elevationM: -4050,
      elevRelText: "Similar elevation to Gale Crater",
      surfaceGround: "Vast polygonal patterned ground covering massive underground water ice sheets.",
      temp: "-58°C",
      airPressure: "765 Pa",
      mission: "Viking 2 Lander / Zhurong Rover",
      panoramaKey: "utopia",
      photoLocal: null,
      scienceSummary: "Enormous subsurface water ice sheet thicker than 80 meters, containing more water than Lake Superior."
    }
  ]
};
