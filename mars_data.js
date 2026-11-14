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
      streetViewAvailable: true
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
      streetViewAvailable: true
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
      streetViewAvailable: true
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
      streetViewAvailable: false
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
      streetViewAvailable: true
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
      streetViewAvailable: true
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
