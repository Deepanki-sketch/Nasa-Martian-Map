/**
 * NASA Space Apps Challenge 2026 - Mars Maps
 * Authentic Google Maps Navigation & 360° Mars Street View
 * Team: Kasukabe Defence Group (Deepanki, Anuj, Anmol, Kafi)
 */

document.addEventListener('DOMContentLoaded', () => {
  let mapInstance = null;
  let traversePolyline = null;
  let walkingNavMarker = null;
  let walkbackCircle = null;
  let myLocationMarker = null;
  let destinationRedPin = null;

  // Active Basemap Layers
  let activeBasemapLayer = null;
  let hillshadeLayer = null;
  let galeBasemapOverlay = null;

  // Layer Groups
  let topographyLayerGroup = null;
  let scienceLayerGroup = null;
  let radiationLayerGroup = null;

  // Navigation State
  let activeDestinationIndex = 4; // Default: Boxwork Ridge
  let activeRouteCoords = [];
  let isCustomDestination = false;
  let customElevationM = -4100;

  // Simulation State
  let isNavRunning = false;
  let navInterval = null;
  let curSegmentIndex = 0;
  let progressStep = 0;
  const initialWalkbackRadius = 3200; // meters (Safe foot EVA walkback limit without rover)

  // Three.js 3D Globes & Street View
  let miniMarsRenderer = null;
  let miniMarsSphere = null;
  let largeMarsRenderer = null;
  let largeMarsSphere = null;

  let streetViewRenderer = null;
  let streetViewScene = null;
  let streetViewCamera = null;
  let streetViewSphereMesh = null;
  let streetViewSunMesh = null;
  let streetViewSunHalo = null;
  let streetViewDirLight = null;
  let streetViewAmbientLight = null;
  let currentSunElevation = 35;
  let currentSunAzimuth = 245;
  let currentSurveySiteId = 'SITE-GALE';
  let isPlanetaryMode = false;
  let isStreetViewActive = false;
  let svLon = 180;
  let svLat = 0;
  let svPrevX = 0;
  let svPrevY = 0;
  let svIsDragging = false;

  // 3D Astronaut Walkthrough & 7D Real Experience State
  let astronautAvatarGroup = null;
  let isHelmetVisorMode = false;
  let astronautPos = { x: 0, y: -18, z: -35 };
  let astronautBaseY = -18;
  let astronautYVelocity = 0;
  let isAstronautJumping = false;
  let astronautStepCount = 0;
  let scienceHotspotGroup = null;
  let currentDustTau = 0.6;

  // Web Audio API Martian Sound Synthesizer
  let audioCtx = null;
  let is7DAudioPlaying = false;
  let windNoiseNode = null;
  let breathingTimer = null;

  // -------------------------------------------------------------
  // 1. Initialize Map
  // -------------------------------------------------------------
  function initMap() {
    mapInstance = L.map('fullbleed-map', {
      center: [-4.69, 137.39],
      zoom: 11,
      minZoom: 6,
      maxZoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    topographyLayerGroup = L.layerGroup();
    scienceLayerGroup = L.layerGroup().addTo(mapInstance);
    radiationLayerGroup = L.layerGroup();

    // Default Basemap: Mars Satellite
    switchBasemap('satellite');

    // Render Markers & Features
    renderGoogleMapsLocationDot();
    renderLandmarksPOIs();
    renderHazards();
    renderRadiationZone();
    renderWalkbackRing();

    // Set Default Destination (Boxwork Ridge)
    setDestination(4);

    // Map Click: Drop Red Pin anywhere on Mars to navigate
    mapInstance.on('click', handleMapClick);

    // UI Event Listeners
    setupUIEventListeners();

    // 3D Mars Mini-Globe Widget
    initMiniMarsHologram();
  }

  // -------------------------------------------------------------
  // 2. Basemap Switcher (Satellite, MOLA Topo, Contours)
  // -------------------------------------------------------------
  function switchBasemap(type) {
    if (activeBasemapLayer) mapInstance.removeLayer(activeBasemapLayer);
    if (hillshadeLayer) mapInstance.removeLayer(hillshadeLayer);
    if (galeBasemapOverlay) mapInstance.removeLayer(galeBasemapOverlay);

    if (type === 'satellite') {
      // Seamless full-bleed OpenPlanetary Mars Basemap (crisp edge-to-edge across entire screen)
      activeBasemapLayer = L.tileLayer('https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-mars-basemap-v0-2/all/{z}/{x}/{y}.png', {
        maxZoom: 14,
        minZoom: 4,
        attribution: 'OpenPlanetary / USGS Astrogeology'
      }).addTo(mapInstance);

      hillshadeLayer = L.tileLayer('https://s3.us-east-2.amazonaws.com/opmmarstiles/hillshade-tiles/{z}/{x}/{y}.png', {
        maxZoom: 14,
        maxNativeZoom: 6,
        opacity: 0.45
      }).addTo(mapInstance);

    } else if (type === 'marstrek_mola') {
      // NASA JPL Solar System Treks (Mars Trek) Global HD Color Altimetry
      activeBasemapLayer = L.tileLayer('https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg', {
        maxZoom: 10,
        minZoom: 0,
        attribution: 'NASA JPL / Mars Trek'
      }).addTo(mapInstance);

      hillshadeLayer = L.tileLayer('https://s3.us-east-2.amazonaws.com/opmmarstiles/hillshade-tiles/{z}/{x}/{y}.png', {
        maxZoom: 14,
        maxNativeZoom: 6,
        opacity: 0.35
      }).addTo(mapInstance);

    } else if (type === 'topo_mola') {
      activeBasemapLayer = L.tileLayer('https://s3-eu-west-1.amazonaws.com/whereonmars.cartodb.net/mola_color-noshade_global/{z}/{x}/{y}.png', {
        maxZoom: 14,
        maxNativeZoom: 6,
        attribution: 'NASA / MGS MOLA Altimetry'
      }).addTo(mapInstance);

      hillshadeLayer = L.tileLayer('https://s3.us-east-2.amazonaws.com/opmmarstiles/hillshade-tiles/{z}/{x}/{y}.png', {
        maxZoom: 14,
        maxNativeZoom: 6,
        opacity: 0.35
      }).addTo(mapInstance);

    } else if (type === 'contours') {
      activeBasemapLayer = L.tileLayer('https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-mars-basemap-v0-2/all/{z}/{x}/{y}.png', {
        maxZoom: 14,
        minZoom: 6,
        attribution: 'USGS Astrogeology / OpenPlanetary'
      }).addTo(mapInstance);

      hillshadeLayer = L.tileLayer('https://s3.us-east-2.amazonaws.com/opmmarstiles/hillshade-tiles/{z}/{x}/{y}.png', {
        maxZoom: 14,
        maxNativeZoom: 6,
        opacity: 0.3
      }).addTo(mapInstance);
    }
  }

  // -------------------------------------------------------------
  // 3. Google Maps Origin Dot ("Your Location")
  // -------------------------------------------------------------
  function renderGoogleMapsLocationDot() {
    const hab = MARS_DATA.waypoints[0];
    const dotHtml = `
      <div class="gmaps-my-location" title="Your Location: Base Camp">
        <div class="gmaps-pulse-ring"></div>
        <div class="gmaps-blue-dot"></div>
      </div>
    `;

    myLocationMarker = L.marker(hab.coords, {
      icon: L.divIcon({
        className: 'custom-gmaps-origin',
        html: dotHtml,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      }),
      zIndexOffset: 1000
    }).addTo(mapInstance);

    myLocationMarker.bindTooltip("<strong>Your Location</strong><br>Base Camp (Elevation -4,462m)", {
      direction: 'top',
      offset: [0, -14]
    });

    myLocationMarker.on('click', () => {
      showWaypointDetails(hab, 0);
    });
  }

  // -------------------------------------------------------------
  // 4. Google Maps Landmarks & POIs (ZERO Emojis!)
  // -------------------------------------------------------------
  function renderLandmarksPOIs() {
    for (let idx = 1; idx < MARS_DATA.waypoints.length; idx++) {
      const wp = MARS_DATA.waypoints[idx];

      const poiHtml = `
        <div class="gmaps-poi-marker">
          <div class="poi-dot"></div>
          <span class="poi-label">${wp.shortName}</span>
        </div>
      `;

      const marker = L.marker(wp.coords, {
        icon: L.divIcon({
          className: 'custom-gmaps-poi',
          html: poiHtml,
          iconSize: [110, 24],
          iconAnchor: [12, 12]
        })
      }).addTo(scienceLayerGroup);

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setDestination(idx);
        showWaypointDetails(wp, idx);
      });
    }
  }

  // -------------------------------------------------------------
  // 5. Google Maps Red Destination Pin
  // -------------------------------------------------------------
  function updateDestinationRedPin(coords, title) {
    if (destinationRedPin) mapInstance.removeLayer(destinationRedPin);

    const pinHtml = `
      <div class="gmaps-red-pin" title="${title}">
        <svg viewBox="0 0 24 36" width="30" height="42">
          <path fill="#EA4335" stroke="#B31412" stroke-width="0.8" d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z"/>
          <circle cx="12" cy="11" r="4.5" fill="#FFFFFF"/>
        </svg>
      </div>
    `;

    destinationRedPin = L.marker(coords, {
      icon: L.divIcon({
        className: 'custom-dest-pin',
        html: pinHtml,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
      }),
      zIndexOffset: 1100
    }).addTo(mapInstance);

    destinationRedPin.bindTooltip(`<strong>Destination</strong><br>${title}`, {
      direction: 'top',
      offset: [0, -42]
    });
  }

  function renderWalkbackRing() {
    const habCoords = MARS_DATA.waypoints[0].coords;
    walkbackCircle = L.circle(habCoords, {
      radius: initialWalkbackRadius,
      color: '#1A73E8',
      weight: 1.5,
      dashArray: '6, 6',
      fillColor: '#1A73E8',
      fillOpacity: 0.04
    }).addTo(mapInstance);

    walkbackCircle.bindTooltip("<strong>Oxygen Walkback Horizon:</strong> Safe return limit on foot (3.2 km)", {
      sticky: true
    });
  }

  function renderHazards() {
    MARS_DATA.hazardZones.forEach((h) => {
      const color = h.type === 'sand_trap' ? '#F9AB00' : '#EA4335';
      L.polygon(h.coords, {
        color: color,
        weight: 1.5,
        fillColor: color,
        fillOpacity: 0.22,
        dashArray: '3, 4'
      }).addTo(topographyLayerGroup).bindTooltip(`<strong>Hazard:</strong> ${h.name} (${h.warning})`);
    });
  }

  function renderRadiationZone() {
    const radBox = [
      [-4.57, 137.33],
      [-4.57, 137.46],
      [-4.81, 137.46],
      [-4.81, 137.33]
    ];
    L.polygon(radBox, {
      color: '#1A73E8',
      weight: 1,
      fillColor: '#1A73E8',
      fillOpacity: 0.05,
      dashArray: '2, 5'
    }).addTo(radiationLayerGroup).bindTooltip("Normal Cosmic Radiation Exposure Area");
  }

  // -------------------------------------------------------------
  // 6. Navigation Route Calculation & Google Walking Trail
  // -------------------------------------------------------------
  function setDestination(targetIndex) {
    activeDestinationIndex = targetIndex;
    isCustomDestination = false;

    const targetWp = MARS_DATA.waypoints[targetIndex];
    document.getElementById('active-dest-label').innerText = targetWp.name;

    // Build walking path from Bradbury Base (0) up to targetIndex
    activeRouteCoords = [];
    for (let i = 0; i <= targetIndex; i++) {
      activeRouteCoords.push(MARS_DATA.waypoints[i].coords);
    }

    drawGoogleWalkingRoute(activeRouteCoords);
    updateDestinationRedPin(targetWp.coords, targetWp.name);

    // Calculate Distance, Elevation, & ETA
    let totalDistKm = 0;
    for (let i = 1; i <= targetIndex; i++) {
      const prev = MARS_DATA.waypoints[i - 1].coords;
      const curr = MARS_DATA.waypoints[i].coords;
      totalDistKm += calculateDistanceKm(prev[0], prev[1], curr[0], curr[1]);
    }

    updateGoogleMapsSummary(totalDistKm, targetWp.elevationM, targetWp.name);
    populateDestinationList();

    // Auto-fit camera
    const bounds = L.latLngBounds(activeRouteCoords);
    mapInstance.fitBounds(bounds, {
      paddingTopLeft: [40, 90],
      paddingBottomRight: [40, 110],
      maxZoom: 13
    });
  }

  function handleMapClick(e) {
    if (isNavRunning || isStreetViewActive) return;

    const clickedLat = e.latlng.lat;
    const clickedLng = e.latlng.lng;
    const habCoords = MARS_DATA.waypoints[0].coords;

    isCustomDestination = true;
    const destTitle = `Dropped Pin (${clickedLat.toFixed(3)}°, ${clickedLng.toFixed(3)}°)`;
    document.getElementById('active-dest-label').innerText = destTitle;

    activeRouteCoords = [habCoords, [clickedLat, clickedLng]];
    drawGoogleWalkingRoute(activeRouteCoords);
    updateDestinationRedPin([clickedLat, clickedLng], destTitle);

    const distKm = calculateDistanceKm(habCoords[0], habCoords[1], clickedLat, clickedLng);
    // Interpolate rough elevation based on distance south
    customElevationM = Math.round(-4462 + (distKm / 14) * 700);

    updateGoogleMapsSummary(distKm, customElevationM, destTitle);
    document.getElementById('destination-drawer').classList.remove('open');
  }

  function drawGoogleWalkingRoute(coords) {
    if (traversePolyline) mapInstance.removeLayer(traversePolyline);

    // Google Maps Walking Dots: Royal Blue #1A73E8 dotted line
    traversePolyline = L.polyline(coords, {
      color: '#1A73E8',
      weight: 5,
      dashArray: '2, 9',
      lineCap: 'round',
      lineJoin: 'round',
      opacity: 0.95
    }).addTo(mapInstance);
  }

  function updateGoogleMapsSummary(distKm, elevationM, destTitle) {
    const walkSpeedKmH = 3.0;
    const hours = distKm / walkSpeedKmH;
    const mins = Math.round(hours * 60);
    const timeStr = mins >= 60 ? `${Math.floor(mins / 60)} hr ${mins % 60} min` : `${mins} min`;

    const isSafe = (distKm * 1000) <= initialWalkbackRadius;

    document.getElementById('summary-time').innerText = timeStr;
    document.getElementById('summary-dist').innerText = `(${distKm.toFixed(1)} km)`;

    const diffM = elevationM - (-4462);
    const diffStr = diffM >= 0 ? `${diffM}m uphill` : `${Math.abs(diffM)}m downhill`;
    document.getElementById('summary-elevation-txt').innerText = `Elev: ${elevationM}m (${diffStr})`;

    const safetyTag = document.getElementById('summary-safety-tag');
    if (isSafe) {
      safetyTag.className = 'safety-tag-safe';
      safetyTag.innerText = 'Oxygen Safe';
    } else {
      safetyTag.className = 'safety-tag-danger';
      safetyTag.innerText = 'Warning: Exceeds Foot Walkback (Rover Required)';
    }
  }

  function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 3389.5;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // -------------------------------------------------------------
  // 7. Destination Drawer
  // -------------------------------------------------------------
  function populateDestinationList() {
    const list = document.getElementById('dest-list');
    list.innerHTML = '';

    MARS_DATA.waypoints.forEach((wp, idx) => {
      const item = document.createElement('div');
      item.className = `dest-item ${idx === activeDestinationIndex && !isCustomDestination ? 'active' : ''}`;

      const hab = MARS_DATA.waypoints[0].coords;
      const dist = idx === 0 ? 0 : calculateDistanceKm(hab[0], hab[1], wp.coords[0], wp.coords[1]);
      const isSafe = (dist * 1000) <= initialWalkbackRadius;

      let badgeClass = isSafe ? 'safe' : 'danger';
      let badgeText = isSafe ? 'Safe Walk' : 'Exceeds Walkback';
      if (wp.type === 'prime_science') {
        badgeClass = 'prime';
        badgeText = 'Prime Target';
      }

      item.innerHTML = `
        <div class="dest-item-left">
          <div class="dest-item-dot"></div>
          <div class="dest-item-info">
            <div class="dest-item-name">${wp.name}</div>
            <div class="dest-item-sub">${dist.toFixed(1)} km from base · Elevation ${wp.elevationM}m</div>
          </div>
        </div>
        <div class="dest-item-right">
          <span class="dest-badge ${badgeClass}">${badgeText}</span>
        </div>
      `;

      item.addEventListener('click', () => {
        setDestination(idx);
        document.getElementById('destination-drawer').classList.remove('open');
        if (idx > 0) showWaypointDetails(wp, idx);
      });

      list.appendChild(item);
    });
  }

  // -------------------------------------------------------------
  // 8. Landmark Details & Elevation Profile
  // -------------------------------------------------------------
  function showWaypointDetails(wp, index) {
    const sheet = document.getElementById('bottom-sheet');
    sheet.classList.add('expanded');

    document.getElementById('sheet-wp-title').innerText = wp.name;
    document.getElementById('sheet-wp-sub').innerText = `Elevation: ${wp.elevationM} meters (${wp.elevationM - (-4462)}m above Base Camp)`;

    document.getElementById('sheet-wp-line1').innerHTML = `<strong>What you see:</strong> ${wp.whatIsHere}`;
    document.getElementById('sheet-wp-line2').innerHTML = `<strong>Walking ground:</strong> ${wp.surfaceGround}`;

    const photo = document.getElementById('sheet-wp-photo');
    const fallback = document.getElementById('sheet-wp-photo-fallback');
    const caption = document.getElementById('sheet-wp-caption');

    if (wp.photoLocal) {
      photo.src = wp.photoLocal;
      photo.style.display = 'block';
      fallback.style.display = 'none';
      caption.innerText = wp.photoCaption;
    } else {
      photo.style.display = 'none';
      fallback.style.display = 'block';
      caption.innerText = "No surface image acquired at this exact coordinate.";
    }

    // Populate Prioritized Mission Dossier & Historical Archive
    if (wp.historicalDossier) {
      const d = wp.historicalDossier;
      // Priority 1: Key Scientific Discoveries & Habitability
      if (d.priority1) {
        const p1Title = document.getElementById('dossier-p1-title');
        const p1Finding = document.getElementById('dossier-p1-finding');
        const p1Hab = document.getElementById('dossier-p1-habitability');
        const p1Val = document.getElementById('dossier-p1-value');
        if (p1Title) p1Title.innerText = d.priority1.title;
        if (p1Finding) p1Finding.innerText = d.priority1.keyDiscovery;
        if (p1Hab) p1Hab.innerText = d.priority1.habitability;
        if (p1Val) p1Val.innerText = d.priority1.scienceValue;
      }

      // Priority 2: Mission History & Past Rover Archive
      if (d.priority2) {
        const p2Sol = document.getElementById('dossier-p2-sol');
        const p2Inst = document.getElementById('dossier-p2-inst');
        const p2Hist = document.getElementById('dossier-p2-history');
        if (p2Sol) p2Sol.innerText = d.priority2.solDiscovered;
        if (p2Inst) p2Inst.innerText = d.priority2.instrument;
        if (p2Hist) p2Hist.innerText = d.priority2.historicalArchive;
      }

      // Priority 3: Mineralogy & Spectroscopy
      if (d.priority3) {
        const minList = document.getElementById('dossier-p3-minerals');
        const p3Spec = document.getElementById('dossier-p3-spec');
        if (minList) {
          minList.innerHTML = '';
          (d.priority3.minerals || []).forEach(m => {
            const pill = document.createElement('span');
            pill.className = 'dossier-mineral-pill';
            pill.innerHTML = `<strong>${m.name}:</strong> ${m.pct}`;
            minList.appendChild(pill);
          });
        }
        if (p3Spec) p3Spec.innerText = d.priority3.spectroscopy;
      }

      // Priority 4: Surface Hazard & Spacesuit Safety Protocol
      if (d.priority4) {
        const p4Haz = document.getElementById('dossier-p4-hazard');
        const p4Risk = document.getElementById('dossier-p4-risk');
        const p4Prot = document.getElementById('dossier-p4-protocol');
        if (p4Haz) p4Haz.innerText = d.priority4.hazardLevel;
        if (p4Risk) p4Risk.innerText = d.priority4.suitPunctureRisk;
        if (p4Prot) p4Prot.innerText = d.priority4.protocolRules;
      }
    }

    drawSheetElevationProfile();
  }

  function setupDossierAccordionListeners() {
    const headers = document.querySelectorAll('.dossier-header');
    headers.forEach(h => {
      h.addEventListener('click', () => {
        const item = h.parentElement;
        const targetId = h.dataset.target;
        const body = document.getElementById(targetId);
        const chevron = h.querySelector('.dossier-chevron');
        if (!body) return;

        const isCurrentlyOpen = item.classList.contains('active');
        if (isCurrentlyOpen) {
          item.classList.remove('active');
          body.style.display = 'none';
          if (chevron) chevron.innerText = '▶';
        } else {
          item.classList.add('active');
          body.style.display = 'flex';
          if (chevron) chevron.innerText = '▼';
        }
      });
    });
  }

  function drawSheetElevationProfile() {
    const canvas = document.getElementById('sheet-elevation-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth - 40;
    canvas.height = 90;

    const data = MARS_DATA.elevationProfile;
    const minElev = -4500;
    const maxElev = -3800;
    const elevRange = maxElev - minElev;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#E8EAED';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const y = 12 + i * 20;
      ctx.beginPath();
      ctx.moveTo(35, y);
      ctx.lineTo(canvas.width - 15, y);
      ctx.stroke();

      const label = (maxElev - (i / 3) * elevRange).toFixed(0) + 'm';
      ctx.fillStyle = '#80868B';
      ctx.font = '9px Roboto, sans-serif';
      ctx.fillText(label, 4, y + 3);
    }

    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, 'rgba(26, 115, 232, 0.25)');
    grad.addColorStop(1, 'rgba(26, 115, 232, 0.0)');

    ctx.beginPath();
    data.forEach((pt, i) => {
      const x = 35 + (pt.distKm / 13.4) * (canvas.width - 55);
      const y = canvas.height - 12 - ((pt.elevM - minElev) / elevRange) * (canvas.height - 30);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.lineTo(canvas.width - 20, canvas.height - 10);
    ctx.lineTo(35, canvas.height - 10);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = '#1A73E8';
    ctx.lineWidth = 2.5;
    data.forEach((pt, i) => {
      const x = 35 + (pt.distKm / 13.4) * (canvas.width - 55);
      const y = canvas.height - 12 - ((pt.elevM - minElev) / elevRange) * (canvas.height - 30);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  // -------------------------------------------------------------
  // 9. Full-Screen 360° Mars Street View with Real Solar Angles & Global Survey
  // -------------------------------------------------------------
  function getMarsDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 3389.5; // Mars mean volumetric radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  function openMarsStreetView(wpIndex) {
    isStreetViewActive = true;
    isPlanetaryMode = false;
    const wp = MARS_DATA.waypoints[wpIndex] || MARS_DATA.waypoints[4];
    const hab = MARS_DATA.waypoints[0].coords;
    const dist = wpIndex === 0 ? 0 : calculateDistanceKm(hab[0], hab[1], wp.coords[0], wp.coords[1]);

    // Update Top Title
    document.getElementById('sv-site-name').innerText = wp.name;
    document.getElementById('sv-site-sub').innerText = 'Mars Street View · Gale Crater Traverse';

    // Update HUD Metrics
    document.getElementById('sv-elev-val').innerText = `${wp.elevationM} meters`;
    const diffM = wp.elevationM - (-4462);
    document.getElementById('sv-elev-hint').innerText = diffM >= 0 ? `${diffM}m above Base Camp` : `${Math.abs(diffM)}m below Base Camp`;
    document.getElementById('sv-dist-val').innerText = `${dist.toFixed(1)} km`;
    document.getElementById('sv-slope-val').innerText = `${wp.slopeDeg}° ${wp.slopeDeg > 2 ? 'Uphill' : 'Flat'}`;
    const slopeLabel = document.getElementById('sv-slope-val').previousElementSibling;
    if (slopeLabel) slopeLabel.innerText = 'GROUND SLOPE';

    // Update Tab state
    document.querySelectorAll('.sv-tab-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.wp) === wpIndex);
    });

    // Ensure Gale category is active
    document.getElementById('btn-cat-gale').classList.add('active');
    document.getElementById('btn-cat-planetary').classList.remove('active');
    document.getElementById('sv-tabs-gale').style.display = 'flex';
    document.getElementById('sv-tabs-planetary').style.display = 'none';

    // Show Overlay
    document.getElementById('streetview-overlay').classList.add('active');

    let photoKey = 'boxwork';
    if (wpIndex === 0 || wpIndex === 1) photoKey = 'pahrump_hills';
    else if (wpIndex === 2) photoKey = 'vera_rubin';
    else if (wpIndex === 3) photoKey = 'default';
    else if (wpIndex === 4) photoKey = 'boxwork';
    else if (wpIndex === 5) photoKey = 'gediz_vallis';

    initThreeStreetView(photoKey, currentSunElevation, currentSunAzimuth);
  }

  function openPlanetaryStreetView(siteId) {
    isStreetViewActive = true;
    isPlanetaryMode = true;
    currentSurveySiteId = siteId;
    const site = (MARS_DATA.planetarySites && MARS_DATA.planetarySites.find(s => s.id === siteId)) || {
      id: "SITE-GALE",
      name: "Gale Crater & Mount Sharp",
      region: "Aeolis Palus",
      coords: [-4.765, 137.355],
      elevationM: -3950,
      elevRelText: "Mount Sharp slopes",
      surfaceGround: "Knife-edge boxwork ridges",
      temp: "-38°C",
      airPressure: "748 Pa",
      mission: "Curiosity Rover",
      panoramaKey: "boxwork"
    };

    const hab = MARS_DATA.waypoints[0].coords;
    const distKm = getMarsDistanceKm(hab[0], hab[1], site.coords[0], site.coords[1]);

    // Update Top Title
    document.getElementById('sv-site-name').innerText = site.name;
    document.getElementById('sv-site-sub').innerText = `Planetary Survey · ${site.region} · ${site.mission}`;

    // Update HUD Metrics
    document.getElementById('sv-elev-val').innerText = `${site.elevationM.toLocaleString()} meters`;
    document.getElementById('sv-elev-hint').innerText = site.elevRelText;
    document.getElementById('sv-dist-val').innerText = `${distKm.toLocaleString()} km from Base`;
    document.getElementById('sv-slope-val').innerText = site.airPressure;
    const slopeLabel = document.getElementById('sv-slope-val').previousElementSibling;
    if (slopeLabel) slopeLabel.innerText = 'ATMOSPHERE';

    // Update Tab state
    document.querySelectorAll('.sv-planet-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.site === siteId);
    });

    // Ensure Planetary category is active
    document.getElementById('btn-cat-gale').classList.remove('active');
    document.getElementById('btn-cat-planetary').classList.add('active');
    document.getElementById('sv-tabs-gale').style.display = 'none';
    document.getElementById('sv-tabs-planetary').style.display = 'flex';

    // Show Overlay
    document.getElementById('streetview-overlay').classList.add('active');

    initThreeStreetView(site.panoramaKey, currentSunElevation, currentSunAzimuth);
  }

  function closeMarsStreetView() {
    isStreetViewActive = false;
    document.getElementById('streetview-overlay').classList.remove('active');
    stop7DAudio();
    const hotspotCard = document.getElementById('sv-hotspot-card');
    if (hotspotCard) hotspotCard.classList.remove('active');
  }

  // =========================================================================
  // 3D SUITED ASTRONAUT AVATAR & PROCEDURAL RIGGING
  // =========================================================================
  function create3DAstronautAvatar() {
    const astronaut = new THREE.Group();

    // Materials (NASA Exploration Extravehicular Mobility Unit - xEMU)
    const suitWhite = new THREE.MeshLambertMaterial({ color: 0xF4F6F8 });
    const jointGray = new THREE.MeshLambertMaterial({ color: 0x374151 });
    const goldVisorMat = new THREE.MeshPhysicalMaterial({
      color: 0xF59E0B,
      metalness: 0.95,
      roughness: 0.08,
      reflectivity: 0.98,
      clearcoat: 1.0
    });
    const packMat = new THREE.MeshLambertMaterial({ color: 0xE2E8F0 });
    const redAccent = new THREE.MeshBasicMaterial({ color: 0xEA4335 });
    const cyanLight = new THREE.MeshBasicMaterial({ color: 0x00F0FF });

    // 1. Helmet Dome
    const helmetGeo = new THREE.SphereGeometry(3.2, 24, 20);
    const helmet = new THREE.Mesh(helmetGeo, suitWhite);
    helmet.position.y = 13.8;
    astronaut.add(helmet);

    // Reflective Gold Sun Visor
    const visorGeo = new THREE.SphereGeometry(2.6, 20, 16, 0, Math.PI, 0, Math.PI * 0.75);
    const visor = new THREE.Mesh(visorGeo, goldVisorMat);
    visor.position.set(0, 13.8, 1.1);
    visor.rotation.x = -Math.PI * 0.08;
    astronaut.add(visor);

    // Helmet Headlamp
    const lightGeo = new THREE.BoxGeometry(1.2, 0.4, 0.4);
    const lightMesh = new THREE.Mesh(lightGeo, cyanLight);
    lightMesh.position.set(0, 16.6, 1.8);
    astronaut.add(lightMesh);

    // 2. Hard Upper Torso (HUT)
    const torsoGeo = new THREE.BoxGeometry(5.6, 7.2, 3.8);
    const torso = new THREE.Mesh(torsoGeo, suitWhite);
    torso.position.y = 8.6;
    astronaut.add(torso);

    // Chest Display Unit (CDU)
    const cduGeo = new THREE.BoxGeometry(2.6, 2.0, 0.5);
    const cdu = new THREE.Mesh(cduGeo, cyanLight);
    cdu.position.set(0, 9.6, 2.0);
    astronaut.add(cdu);

    // Red NASA Mission Stripe
    const stripeGeo = new THREE.BoxGeometry(5.2, 0.35, 0.2);
    const stripe = new THREE.Mesh(stripeGeo, redAccent);
    stripe.position.set(0, 11.2, 1.95);
    astronaut.add(stripe);

    // 3. Primary Life Support System (PLSS Backpack)
    const plssGeo = new THREE.BoxGeometry(5.0, 7.8, 2.6);
    const plss = new THREE.Mesh(plssGeo, packMat);
    plss.position.set(0, 9.0, -2.5);
    astronaut.add(plss);

    // PLSS Comms Antenna
    const antGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.8);
    const ant = new THREE.Mesh(antGeo, jointGray);
    ant.position.set(1.9, 14.8, -2.5);
    astronaut.add(ant);

    // 4. Arms & Gloves
    const armGeo = new THREE.CylinderGeometry(1.0, 0.85, 6.0, 12);
    const leftArm = new THREE.Mesh(armGeo, suitWhite);
    leftArm.position.set(-3.7, 8.2, 0);
    leftArm.rotation.z = Math.PI * 0.08;
    astronaut.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, suitWhite);
    rightArm.position.set(3.7, 8.2, 0);
    rightArm.rotation.z = -Math.PI * 0.08;
    astronaut.add(rightArm);

    // 5. Legs & Regolith Boots
    const legGeo = new THREE.CylinderGeometry(1.15, 0.95, 6.8, 12);
    const leftLeg = new THREE.Mesh(legGeo, suitWhite);
    leftLeg.position.set(-1.6, 2.8, 0);
    astronaut.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, suitWhite);
    rightLeg.position.set(1.6, 2.8, 0);
    astronaut.add(rightLeg);

    // Heavy Boots
    const bootGeo = new THREE.BoxGeometry(2.3, 1.4, 3.4);
    const leftBoot = new THREE.Mesh(bootGeo, jointGray);
    leftBoot.position.set(-1.6, -0.6, 0.5);
    astronaut.add(leftBoot);

    const rightBoot = new THREE.Mesh(bootGeo, jointGray);
    rightBoot.position.set(1.6, -0.6, 0.5);
    astronaut.add(rightBoot);

    astronaut.scale.set(0.85, 0.85, 0.85);
    astronaut.position.set(astronautPos.x, astronautPos.y, astronautPos.z);
    return astronaut;
  }

  // =========================================================================
  // 3D INTERACTIVE SCIENCE HOTSPOTS (IN-SITU DISCOVERY BEACONS)
  // =========================================================================
  function createScienceHotspots(siteKey) {
    const group = new THREE.Group();

    // Floating diamond beacon
    const geo = new THREE.OctahedronGeometry(4.5, 0);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00F0FF, wireframe: true });
    const diamond = new THREE.Mesh(geo, mat);
    diamond.position.set(45, -8, -95);
    group.add(diamond);

    // Glowing core
    const coreGeo = new THREE.SphereGeometry(1.8, 14, 14);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.copy(diamond.position);
    group.add(core);

    // Target Ground Pulse Ring
    const ringGeo = new THREE.RingGeometry(3, 9, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00F0FF,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(45, -24, -95);
    group.add(ring);

    // Contextual Data based on site
    group.userData = {
      title: siteKey === 'boxwork' ? "Boxwork Hydrothermal Vein #04" : "Layered Mudstone Shelf Alpha",
      desc: siteKey === 'boxwork' 
        ? "Silica-cemented vein blade standing 1.4m above regolith floor. Formed by ancient warm water seeping through fractures."
        : "Fine-grained sedimentary mudstone deposited in ancient standing lake water.",
      comp: siteKey === 'boxwork' ? "64% Silica, 22% Sulfate, 14% Carbonate" : "42% Smectite Clay, 31% Magnetite",
      hab: "High Astrobiology Priority (Preserved Water)",
      pos: { x: 45, y: -8, z: -95 }
    };

    return group;
  }

  // =========================================================================
  // GAME-LIKE WALKING & 0.38G LEAP MECHANICS
  // =========================================================================
  function walkAstronaut(forward, strafe) {
    if (!isStreetViewActive) return;
    const rad = THREE.MathUtils.degToRad(svLon);
    const stepSize = 2.4;

    // Move forward/back along view heading and strafe left/right
    const dx = (Math.sin(rad) * forward + Math.cos(rad) * strafe) * stepSize;
    const dz = (Math.cos(rad) * forward - Math.sin(rad) * strafe) * stepSize;

    astronautPos.x += dx;
    astronautPos.z += dz;
    astronautStepCount++;

    // Low gravity Martian walking gait (gentle sine vertical bobbing)
    if (!isAstronautJumping) {
      astronautPos.y = astronautBaseY + Math.sin(astronautStepCount * 0.45) * 0.75;
    }

    playFootstepAudio();
    checkHotspotProximity();
  }

  function jumpAstronaut() {
    if (!isStreetViewActive || isAstronautJumping) return;
    isAstronautJumping = true;
    astronautYVelocity = 1.35; // Floaty 0.38g leap
    playLeapAudio();
  }

  function toggleStreetViewMode() {
    isHelmetVisorMode = !isHelmetVisorMode;
    const visorEl = document.getElementById('sv-visor-overlay');
    const modeLabel = document.getElementById('sv-mode-label');

    if (isHelmetVisorMode) {
      if (visorEl) visorEl.style.display = 'block';
      if (modeLabel) modeLabel.innerText = 'Mode: 1st-Person Visor';
      if (astronautAvatarGroup) astronautAvatarGroup.visible = false;
    } else {
      if (visorEl) visorEl.style.display = 'none';
      if (modeLabel) modeLabel.innerText = 'Mode: 3D Avatar';
      if (astronautAvatarGroup) astronautAvatarGroup.visible = true;
    }
  }

  function updateVisorHUD() {
    const heading = Math.round(((svLon % 360) + 360) % 360);
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const dirStr = dirs[Math.round(heading / 45) % 8];

    const bearingEl = document.getElementById('visor-bearing-text');
    if (bearingEl) bearingEl.innerText = `HEADING ${heading}° ${dirStr}`;

    const pitchLadder = document.getElementById('visor-pitch-ladder');
    if (pitchLadder) {
      pitchLadder.style.transform = `translateY(${Math.round(svLat * 0.6)}px)`;
    }

    // Dynamic bio vitals pulse rate
    const hrEl = document.getElementById('visor-heart-rate');
    const metabolicEl = document.getElementById('visor-metabolic');
    if (hrEl && metabolicEl) {
      const baseHr = 82 + Math.round((astronautStepCount % 12) * 1.5);
      hrEl.innerText = `${baseHr} BPM`;
      metabolicEl.innerText = `${285 + Math.round((astronautStepCount % 12) * 12)} kcal/hr`;
    }
  }

  function checkHotspotProximity() {
    if (!scienceHotspotGroup || !scienceHotspotGroup.userData) return;
    const hPos = scienceHotspotGroup.userData.pos;
    const dist = Math.sqrt(
      Math.pow(astronautPos.x - hPos.x, 2) + Math.pow(astronautPos.z - hPos.z, 2)
    );

    // If within 60 units, open the interactive science card!
    const card = document.getElementById('sv-hotspot-card');
    if (dist < 60) {
      if (card && !card.classList.contains('active')) {
        const u = scienceHotspotGroup.userData;
        document.getElementById('hotspot-title').innerText = u.title;
        document.getElementById('hotspot-desc').innerText = u.desc;
        document.getElementById('hotspot-comp').innerText = u.comp;
        document.getElementById('hotspot-hab').innerText = u.hab;
        card.classList.add('active');
      }
    }
  }

  // =========================================================================
  // 7D REAL EXPERIENCE MARTIAN AUDIO SYNTHESIZER (HTML5 Web Audio API)
  // Guaranteed 100% offline & zero network dependency
  // =========================================================================
  function toggle7DAudio() {
    if (is7DAudioPlaying) {
      stop7DAudio();
    } else {
      start7DAudio();
    }
  }

  function start7DAudio() {
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) audioCtx = new AudioCtxClass();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      // 1. Synthesize Atmospheric Martian Wind (Perseverance / SuperCam acoustic profile)
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.09;
        b6 = white * 0.115926;
      }

      windNoiseNode = audioCtx.createBufferSource();
      windNoiseNode.buffer = noiseBuffer;
      windNoiseNode.loop = true;

      const windFilter = audioCtx.createBiquadFilter();
      windFilter.type = 'lowpass';
      windFilter.frequency.value = 260;

      // LFO to modulate gusting wind cycles
      const lfo = audioCtx.createOscillator();
      lfo.frequency.value = 0.22;
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 130;
      lfo.connect(lfoGain);
      lfoGain.connect(windFilter.frequency);
      lfo.start();

      const windGain = audioCtx.createGain();
      windGain.gain.value = 0.45;

      windNoiseNode.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(audioCtx.destination);
      windNoiseNode.start();

      // 2. Spacesuit Life-Support Oxygen Breathing Regulator
      scheduleSuitBreathing();

      is7DAudioPlaying = true;
      updateAudioUI(true);
    } catch (err) {
      console.warn("7D Audio unavailable:", err);
    }
  }

  function scheduleSuitBreathing() {
    if (!audioCtx) return;
    function breathCycle() {
      if (!is7DAudioPlaying) return;
      try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 820;
        filter.Q.value = 2.8;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(175, now + 1.2);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.6);
        gain.gain.linearRampToValueAtTime(0.001, now + 1.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 1.5);
      } catch (e) {}

      breathingTimer = setTimeout(breathCycle, 3800);
    }
    breathCycle();
  }

  function playFootstepAudio() {
    if (!audioCtx || !is7DAudioPlaying) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.1);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.11);
    } catch (e) {}
  }

  function playLeapAudio() {
    if (!audioCtx || !is7DAudioPlaying) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.25);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {}
  }

  function stop7DAudio() {
    is7DAudioPlaying = false;
    if (breathingTimer) clearTimeout(breathingTimer);
    if (windNoiseNode) {
      try { windNoiseNode.stop(); } catch (e) {}
      windNoiseNode = null;
    }
    updateAudioUI(false);
  }

  function updateAudioUI(isPlaying) {
    const btn = document.getElementById('btn-sv-audio');
    const label = document.getElementById('sv-audio-label');
    if (!btn || !label) return;
    if (isPlaying) {
      btn.classList.add('playing', 'active');
      label.innerText = '7D Audio: LIVE';
    } else {
      btn.classList.remove('playing', 'active');
      label.innerText = '7D Audio: OFF';
    }
  }

  function updateDustStormLighting(tau) {
    currentDustTau = tau;
    const dustValEl = document.getElementById('sv-dust-val');
    if (dustValEl) {
      let desc = 'Clear';
      if (tau > 2.0) desc = 'Severe Dust Storm';
      else if (tau > 1.2) desc = 'Dust Haze';
      dustValEl.innerText = `τ ${tau.toFixed(1)} (${desc})`;
    }

    if (!streetViewDirLight || !streetViewAmbientLight) return;
    // Optical depth attenuation: I = I_0 * exp(-tau)
    const factor = Math.exp(- (tau - 0.6) * 0.5);
    streetViewDirLight.intensity = Math.max(0.15, 1.2 * factor);
    if (tau > 1.5) {
      streetViewAmbientLight.color.setHex(0xa8562c); // Heavy red-orange dust scattering
    } else {
      streetViewAmbientLight.color.setHex(0x8a553c);
    }
  }

  function initThreeStreetView(photoKey, sunElev = 35, sunAz = 245) {
    const container = document.getElementById('streetview-canvas-container');
    container.innerHTML = '';

    const width = window.innerWidth;
    const height = window.innerHeight;

    streetViewScene = new THREE.Scene();
    streetViewCamera = new THREE.PerspectiveCamera(75, width / height, 1, 1200);
    streetViewCamera.target = new THREE.Vector3(0, 0, 0);

    streetViewRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    streetViewRenderer.setPixelRatio(window.devicePixelRatio || 1);
    streetViewRenderer.setSize(width, height);
    container.appendChild(streetViewRenderer.domElement);

    // 1. Inverted Sphere geometry for 360 Panorama
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    // 2. Immediate Procedural Mars Texture (Guaranteed zero-black screen)
    let initialTexture;
    if (typeof generateMarsEquirectangularTexture === 'function') {
      const procCanvas = generateMarsEquirectangularTexture(photoKey, sunElev);
      initialTexture = new THREE.CanvasTexture(procCanvas);
    } else {
      const c = document.createElement('canvas');
      c.width = 64; c.height = 32;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#b97453'; ctx.fillRect(0,0,64,16);
      ctx.fillStyle = '#5c3321'; ctx.fillRect(0,16,64,16);
      initialTexture = new THREE.CanvasTexture(c);
    }

    const material = new THREE.MeshBasicMaterial({ map: initialTexture });
    streetViewSphereMesh = new THREE.Mesh(geometry, material);
    streetViewScene.add(streetViewSphereMesh);

    // 3. If embedded Base64 image is available, load it immediately into texture
    const embeddedSrc = (typeof MARS_EMBEDDED_PANORAMAS !== 'undefined') ? MARS_EMBEDDED_PANORAMAS[photoKey] : null;
    if (embeddedSrc && embeddedSrc.length > 100) {
      const img = new Image();
      img.onload = () => {
        const tex = new THREE.Texture(img);
        tex.needsUpdate = true;
        material.map = tex;
        material.needsUpdate = true;
      };
      img.src = embeddedSrc;
    }

    // 4. Directional Sunlight & Ambient Light
    streetViewDirLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    streetViewAmbientLight = new THREE.AmbientLight(0x8a553c, 0.6);
    streetViewScene.add(streetViewDirLight);
    streetViewScene.add(streetViewAmbientLight);

    // 5. Visual 3D Martian Sun Disc & Scattering Halo
    const sunGeo = new THREE.SphereGeometry(14, 24, 24);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    streetViewSunMesh = new THREE.Mesh(sunGeo, sunMat);
    streetViewScene.add(streetViewSunMesh);

    const haloGeo = new THREE.RingGeometry(15, 42, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x5c8fff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    streetViewSunHalo = new THREE.Mesh(haloGeo, haloMat);
    streetViewScene.add(streetViewSunHalo);

    // Update Sun 3D Position & Light Angles
    updateSunPosition(sunElev, sunAz);

    // 6. Build Interactive 3D Suited Astronaut Avatar
    astronautPos = { x: 0, y: -18, z: -35 };
    astronautBaseY = -18;
    astronautYVelocity = 0;
    isAstronautJumping = false;
    astronautStepCount = 0;

    astronautAvatarGroup = create3DAstronautAvatar();
    streetViewScene.add(astronautAvatarGroup);

    // 7. Build Interactive 3D Science Hotspot Beacon
    scienceHotspotGroup = createScienceHotspots(photoKey);
    streetViewScene.add(scienceHotspotGroup);

    svLon = 180;
    svLat = 0;

    // Mouse Drag to look around in 360 degrees
    container.onmousedown = (e) => {
      svIsDragging = true;
      svPrevX = e.clientX;
      svPrevY = e.clientY;
    };
    window.onmouseup = () => { svIsDragging = false; };
    window.onmousemove = (e) => {
      if (!svIsDragging) return;
      svLon -= (e.clientX - svPrevX) * 0.15;
      svLat += (e.clientY - svPrevY) * 0.15;
      svLat = Math.max(-85, Math.min(85, svLat));
      svPrevX = e.clientX;
      svPrevY = e.clientY;
      updateStreetViewCompass();
    };

    // Touch support for mobile 360 look-around
    container.ontouchstart = (e) => {
      if (e.touches.length === 1) {
        svIsDragging = true;
        svPrevX = e.touches[0].clientX;
        svPrevY = e.touches[0].clientY;
      }
    };
    window.ontouchend = () => { svIsDragging = false; };
    window.ontouchmove = (e) => {
      if (!svIsDragging || e.touches.length !== 1) return;
      svLon -= (e.touches[0].clientX - svPrevX) * 0.2;
      svLat += (e.touches[0].clientY - svPrevY) * 0.2;
      svLat = Math.max(-85, Math.min(85, svLat));
      svPrevX = e.touches[0].clientX;
      svPrevY = e.touches[0].clientY;
      updateStreetViewCompass();
    };

    // Mouse wheel zoom
    container.onwheel = (e) => {
      e.preventDefault();
      streetViewCamera.fov = Math.max(30, Math.min(95, streetViewCamera.fov + e.deltaY * 0.05));
      streetViewCamera.updateProjectionMatrix();
    };

    function renderSV() {
      if (!isStreetViewActive) return;
      requestAnimationFrame(renderSV);

      // 0.38g Martian Low-Gravity Jump Physics
      if (isAstronautJumping) {
        astronautPos.y += astronautYVelocity;
        astronautYVelocity -= 0.09; // 0.38g acceleration
        if (astronautPos.y <= astronautBaseY) {
          astronautPos.y = astronautBaseY;
          isAstronautJumping = false;
          astronautYVelocity = 0;
          playFootstepAudio();
        }
      }

      // Update 3D Astronaut Avatar
      if (astronautAvatarGroup) {
        astronautAvatarGroup.visible = !isHelmetVisorMode;
        astronautAvatarGroup.position.set(astronautPos.x, astronautPos.y, astronautPos.z);
        // Face along the camera azimuth
        astronautAvatarGroup.rotation.y = THREE.MathUtils.degToRad(-svLon - 90);
      }

      // Animate 3D Science Hotspot Beacon
      if (scienceHotspotGroup) {
        scienceHotspotGroup.rotation.y += 0.025;
        scienceHotspotGroup.position.y = -10 + Math.sin(Date.now() * 0.003) * 1.8;
      }

      const phi = THREE.MathUtils.degToRad(90 - svLat);
      const theta = THREE.MathUtils.degToRad(svLon);

      streetViewCamera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
      streetViewCamera.target.y = 500 * Math.cos(phi);
      streetViewCamera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

      streetViewCamera.lookAt(streetViewCamera.target);
      if (streetViewSunHalo) {
        streetViewSunHalo.lookAt(streetViewCamera.position);
      }

      if (isHelmetVisorMode) {
        updateVisorHUD();
      }

      streetViewRenderer.render(streetViewScene, streetViewCamera);
    }
    renderSV();
  }

  function updateSunPosition(elevDeg, azDeg) {
    currentSunElevation = elevDeg;
    currentSunAzimuth = azDeg;

    const elevRad = THREE.MathUtils.degToRad(elevDeg);
    const azRad = THREE.MathUtils.degToRad(azDeg);
    const r = 475;

    const x = r * Math.cos(elevRad) * Math.sin(azRad);
    const y = r * Math.sin(elevRad);
    const z = r * Math.cos(elevRad) * Math.cos(azRad);

    if (streetViewSunMesh) streetViewSunMesh.position.set(x, y, z);
    if (streetViewSunHalo) streetViewSunHalo.position.set(x, y, z);
    if (streetViewDirLight) streetViewDirLight.position.set(x, y, z);

    // Calculate solar irradiance (Mars solar constant at 1.52 AU ~ 590 W/m²)
    const maxFlux = 590; // W/m²
    const flux = elevDeg > 0 ? Math.round(maxFlux * Math.sin(elevRad) * 0.9) : 0;
    
    // Compass text for azimuth
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const azDir = dirs[Math.round(((azDeg % 360) + 360) % 360 / 45) % 8];

    // Update HUD
    const elevEl = document.getElementById('sv-sun-elev-text');
    const azEl = document.getElementById('sv-sun-az-text');
    const fluxEl = document.getElementById('sv-sun-flux-text');
    const sliderValEl = document.getElementById('sv-slider-val');
    const sliderEl = document.getElementById('sv-sun-slider');

    if (elevEl) elevEl.innerText = `${Math.round(elevDeg)}°`;
    if (azEl) azEl.innerText = `${Math.round(azDeg)}° ${azDir}`;
    if (fluxEl) fluxEl.innerText = `${flux} W/m²`;
    if (sliderValEl) sliderValEl.innerText = `${Math.round(elevDeg)}°`;
    if (sliderEl) sliderEl.value = Math.round(elevDeg);

    // Three.js Lighting adjustment
    if (!streetViewDirLight || !streetViewAmbientLight) return;

    if (elevDeg <= 0) {
      // Night EVA
      if (streetViewSunMesh) streetViewSunMesh.visible = false;
      if (streetViewSunHalo) streetViewSunHalo.visible = false;
      streetViewDirLight.intensity = 0.05;
      streetViewAmbientLight.color.setHex(0x181a24);
      streetViewAmbientLight.intensity = 0.35;
    } else if (elevDeg <= 10) {
      // Blue Sunset / Sunrise
      if (streetViewSunMesh) streetViewSunMesh.visible = true;
      if (streetViewSunHalo) {
        streetViewSunHalo.visible = true;
        streetViewSunHalo.material.color.setHex(0x4a88ff); // Famous Martian Blue Sunset
        streetViewSunHalo.material.opacity = 0.85;
      }
      streetViewDirLight.color.setHex(0xff7744);
      streetViewDirLight.intensity = 0.65;
      streetViewAmbientLight.color.setHex(0x5c3321);
      streetViewAmbientLight.intensity = 0.45;
    } else {
      // Daytime
      if (streetViewSunMesh) streetViewSunMesh.visible = true;
      if (streetViewSunHalo) {
        streetViewSunHalo.visible = true;
        streetViewSunHalo.material.color.setHex(0xffd29d);
        streetViewSunHalo.material.opacity = 0.4;
      }
      streetViewDirLight.color.setHex(0xfffaed);
      streetViewDirLight.intensity = 1.0 + (elevDeg / 90) * 0.4;
      streetViewAmbientLight.color.setHex(0x8a553c);
      streetViewAmbientLight.intensity = 0.6;
    }
  }

  function updateStreetViewCompass() {
    const heading = Math.round(((svLon % 360) + 360) % 360);
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const dirStr = dirs[Math.round(heading / 45) % 8];
    document.getElementById('sv-compass-text').innerText = `${heading}° ${dirStr}`;
    document.getElementById('sv-compass-needle').style.transform = `rotate(${heading}deg)`;
  }

  // -------------------------------------------------------------
  // 10. Turn-by-Turn Walk Simulation
  // -------------------------------------------------------------
  function startGoogleNavigation() {
    if (isNavRunning) return;
    isNavRunning = true;

    document.getElementById('sheet-summary-bar').style.display = 'none';
    document.getElementById('sheet-active-bar').style.display = 'flex';
    document.getElementById('live-oxygen-bar-container').style.display = 'block';

    curSegmentIndex = 0;
    progressStep = 0;

    const startCoord = activeRouteCoords[0];
    if (walkingNavMarker) mapInstance.removeLayer(walkingNavMarker);

    walkingNavMarker = L.marker(startCoord, {
      icon: L.divIcon({
        className: 'custom-nav-icon',
        html: '<div class="gmaps-nav-arrow"><div class="nav-arrow-head"></div></div>',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      }),
      zIndexOffset: 1200
    }).addTo(mapInstance);

    let currentO2RemainingL = 480;
    const initialO2 = 480;
    let elapsedSec = 0;
    let hasAlertedAbort = false;

    navInterval = setInterval(() => {
      elapsedSec += 80;
      progressStep += 0.05;

      const hrs = Math.floor(elapsedSec / 3600);
      const mins = Math.floor((elapsedSec % 3600) / 60);
      const timeStr = `T+ ${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;

      currentO2RemainingL = Math.max(0, currentO2RemainingL - 2.8);
      const o2Percent = Math.round((currentO2RemainingL / initialO2) * 100);

      document.getElementById('nav-step-telemetry').innerText = `Remaining O2: ${o2Percent}% (${Math.round(currentO2RemainingL)}L) · Elapsed: ${timeStr}`;

      const o2Bar = document.getElementById('live-oxygen-bar');
      o2Bar.style.width = `${o2Percent}%`;

      if (curSegmentIndex < activeRouteCoords.length - 1) {
        const p1 = activeRouteCoords[curSegmentIndex];
        const p2 = activeRouteCoords[curSegmentIndex + 1];

        const lat = p1[0] + (p2[0] - p1[0]) * progressStep;
        const lng = p1[1] + (p2[1] - p1[1]) * progressStep;
        walkingNavMarker.setLatLng([lat, lng]);

        if (progressStep >= 1) {
          progressStep = 0;
          curSegmentIndex++;
          if (curSegmentIndex < activeRouteCoords.length - 1) {
            document.getElementById('nav-step-instruction').innerText = `Step ${curSegmentIndex + 1}: Continuing along Mount Sharp trail`;
          }
        }
      }

      const currentRadius = Math.max(400, (currentO2RemainingL / initialO2) * initialWalkbackRadius);
      walkbackCircle.setRadius(currentRadius);

      const curPos = walkingNavMarker.getLatLng();
      const habPos = MARS_DATA.waypoints[0].coords;
      const distToHabM = calculateDistanceKm(curPos.lat, curPos.lng, habPos[0], habPos[1]) * 1000;

      if (distToHabM > currentRadius && !hasAlertedAbort) {
        hasAlertedAbort = true;
        o2Bar.style.background = '#EA4335';
        walkbackCircle.setStyle({ color: '#EA4335', fillColor: '#EA4335', fillOpacity: 0.16 });
        document.getElementById('nav-step-instruction').innerText = 'Warning: Oxygen limit exceeded! Return to Base Camp.';
      }

      if (curSegmentIndex >= activeRouteCoords.length - 1 && progressStep >= 1 || currentO2RemainingL <= 0) {
        clearInterval(navInterval);
        document.getElementById('nav-step-instruction').innerText = 'Arrived at Destination';
      }
    }, 200);
  }

  function exitNavigation() {
    if (navInterval) clearInterval(navInterval);
    isNavRunning = false;

    document.getElementById('sheet-summary-bar').style.display = 'flex';
    document.getElementById('sheet-active-bar').style.display = 'none';
    document.getElementById('live-oxygen-bar-container').style.display = 'none';

    const o2Bar = document.getElementById('live-oxygen-bar');
    o2Bar.style.background = '#1A73E8';
    o2Bar.style.width = '100%';

    walkbackCircle.setRadius(initialWalkbackRadius);
    walkbackCircle.setStyle({ color: '#1A73E8', fillColor: '#1A73E8', fillOpacity: 0.04, weight: 1.5 });

    if (walkingNavMarker) {
      walkingNavMarker.setLatLng(MARS_DATA.waypoints[0].coords);
    }
  }

  // -------------------------------------------------------------
  // 11. Interactive 3D Mars Mini-Globe (Three.js)
  // -------------------------------------------------------------
  function initMiniMarsHologram() {
    const container = document.getElementById('mars-3d-canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || 62;
    const height = container.clientHeight || 62;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.z = 2.4;

    miniMarsRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    miniMarsRenderer.setSize(width, height);
    miniMarsRenderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(miniMarsRenderer.domElement);

    const marsTexture = createProceduralMarsTexture();
    const geometry = new THREE.SphereGeometry(0.85, 32, 32);
    const material = new THREE.MeshPhongMaterial({ map: marsTexture, shininess: 6 });

    miniMarsSphere = new THREE.Mesh(geometry, material);
    scene.add(miniMarsSphere);

    // Gale Crater Pin
    const pinGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0x1A73E8 });
    const galePin = new THREE.Mesh(pinGeo, pinMat);

    const phi = (90 - (-4.59)) * (Math.PI / 180);
    const theta = (137.44 + 180) * (Math.PI / 180);
    galePin.position.x = -0.86 * Math.sin(phi) * Math.cos(theta);
    galePin.position.y = 0.86 * Math.cos(phi);
    galePin.position.z = 0.86 * Math.sin(phi) * Math.sin(theta);
    miniMarsSphere.add(galePin);

    const sunLight = new THREE.DirectionalLight(0xFFFFFF, 1.4);
    sunLight.position.set(3, 2, 4);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x2A150B, 0.9);
    scene.add(ambientLight);

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      miniMarsSphere.rotation.y += (e.clientX - prevMouseX) * 0.015;
      miniMarsSphere.rotation.x += (e.clientY - prevMouseY) * 0.015;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    function animate() {
      requestAnimationFrame(animate);
      if (!isDragging) miniMarsSphere.rotation.y += 0.005;
      miniMarsRenderer.render(scene, camera);
    }
    animate();
  }

  function initLargeMarsOrbitView() {
    const container = document.getElementById('large-mars-canvas-container');
    if (!container || typeof THREE === 'undefined' || largeMarsRenderer) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 2.6;

    largeMarsRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    largeMarsRenderer.setSize(width, height);
    largeMarsRenderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(largeMarsRenderer.domElement);

    const marsTexture = createProceduralMarsTexture();
    const geometry = new THREE.SphereGeometry(0.9, 64, 64);
    const material = new THREE.MeshPhongMaterial({ map: marsTexture, shininess: 8 });
    largeMarsSphere = new THREE.Mesh(geometry, material);
    scene.add(largeMarsSphere);

    const pinGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0x1A73E8 });
    const galePin = new THREE.Mesh(pinGeo, pinMat);

    const phi = (90 - (-4.59)) * (Math.PI / 180);
    const theta = (137.44 + 180) * (Math.PI / 180);
    galePin.position.x = -0.91 * Math.sin(phi) * Math.cos(theta);
    galePin.position.y = 0.91 * Math.cos(phi);
    galePin.position.z = 0.91 * Math.sin(phi) * Math.sin(theta);
    largeMarsSphere.add(galePin);

    const sunLight = new THREE.DirectionalLight(0xFFFFFF, 1.4);
    sunLight.position.set(3, 2, 4);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x2A150B, 0.85);
    scene.add(ambientLight);

    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      largeMarsSphere.rotation.y += (e.clientX - prevX) * 0.01;
      largeMarsSphere.rotation.x += (e.clientY - prevY) * 0.01;
      prevX = e.clientX;
      prevY = e.clientY;
    });

    function animate() {
      requestAnimationFrame(animate);
      if (!isDragging) largeMarsSphere.rotation.y += 0.003;
      largeMarsRenderer.render(scene, camera);
    }
    animate();

    document.getElementById('btn-zoom-to-gale').addEventListener('click', () => {
      largeMarsSphere.rotation.x = -0.08;
      largeMarsSphere.rotation.y = -theta + Math.PI / 2;
    });
  }

  function createProceduralMarsTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.06, '#D87A4A');
    grad.addColorStop(0.2, '#C1440E');
    grad.addColorStop(0.5, '#B23A0B');
    grad.addColorStop(0.75, '#8C2B05');
    grad.addColorStop(0.94, '#C1440E');
    grad.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    ctx.fillStyle = 'rgba(40, 18, 10, 0.45)';
    for (let i = 0; i < 45; i++) {
      ctx.beginPath();
      const x = (i * 137 + 50) % 1024;
      const y = 140 + (i * 47) % 240;
      const r = 30 + (i * 13) % 70;
      ctx.ellipse(x, y, r * 1.6, r, (i * 0.3), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(25, 10, 5, 0.3)';
    for (let i = 0; i < 200; i++) {
      ctx.beginPath();
      const x = (i * 67) % 1024;
      const y = (i * 83) % 512;
      const r = 2 + (i % 7);
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }

  // -------------------------------------------------------------
  // 12. UI Event Listeners
  // -------------------------------------------------------------
  function setupUIEventListeners() {
    // Destination Drawer Toggle
    const btnDest = document.getElementById('btn-open-destinations');
    const drawer = document.getElementById('destination-drawer');
    btnDest.addEventListener('click', (e) => {
      e.stopPropagation();
      drawer.classList.toggle('open');
      document.getElementById('layers-popover').classList.remove('open');
    });

    document.addEventListener('click', (e) => {
      if (!drawer.contains(e.target) && !btnDest.contains(e.target)) {
        drawer.classList.remove('open');
      }
    });

    // Layers Popover
    const btnLayers = document.getElementById('btn-layers');
    const popover = document.getElementById('layers-popover');
    btnLayers.addEventListener('click', (e) => {
      e.stopPropagation();
      popover.classList.toggle('open');
      drawer.classList.remove('open');
    });

    document.addEventListener('click', (e) => {
      if (!popover.contains(e.target) && !btnLayers.contains(e.target)) {
        popover.classList.remove('open');
      }
    });

    // Basemap Radios
    const basemapRadios = document.querySelectorAll('input[name="basemap-choice"]');
    basemapRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        switchBasemap(e.target.value);
      });
    });

    // Overlays
    document.getElementById('chk-topo').addEventListener('change', (e) => {
      if (e.target.checked) mapInstance.addLayer(topographyLayerGroup);
      else mapInstance.removeLayer(topographyLayerGroup);
    });
    document.getElementById('chk-science').addEventListener('change', (e) => {
      if (e.target.checked) mapInstance.addLayer(scienceLayerGroup);
      else mapInstance.removeLayer(scienceLayerGroup);
    });
    document.getElementById('chk-orbital-photo').addEventListener('change', (e) => {
      if (e.target.checked) {
        if (!galeBasemapOverlay) {
          const galeBounds = [[-4.88, 137.28], [-4.50, 137.52]];
          galeBasemapOverlay = L.imageOverlay('images/gale_crater_basemap.jpg', galeBounds, {
            opacity: 0.88,
            className: 'feathered-mars-overlay',
            zIndex: 2,
            alt: 'NASA MSL Gale Crater Basemap'
          });
        }
        mapInstance.addLayer(galeBasemapOverlay);
      } else {
        if (galeBasemapOverlay) mapInstance.removeLayer(galeBasemapOverlay);
      }
    });
    document.getElementById('chk-rad').addEventListener('change', (e) => {
      if (e.target.checked) mapInstance.addLayer(radiationLayerGroup);
      else mapInstance.removeLayer(radiationLayerGroup);
    });

    // Re-center on My Location
    document.getElementById('btn-recenter').addEventListener('click', () => {
      const habCoords = MARS_DATA.waypoints[0].coords;
      mapInstance.flyTo(habCoords, 13, { duration: 1.2 });
      if (myLocationMarker) {
        myLocationMarker.openTooltip();
        setTimeout(() => myLocationMarker.closeTooltip(), 2500);
      }
    });

    // Street View Pegman & Card Buttons
    document.getElementById('btn-streetview-toggle').addEventListener('click', () => {
      openMarsStreetView(activeDestinationIndex);
    });
    document.getElementById('btn-open-streetview-card').addEventListener('click', () => {
      openMarsStreetView(activeDestinationIndex);
    });
    document.getElementById('btn-exit-streetview').addEventListener('click', closeMarsStreetView);

    // Street View Quick Jump Tabs (Gale Crater)
    document.querySelectorAll('.sv-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const wpIdx = parseInt(e.target.dataset.wp);
        openMarsStreetView(wpIdx);
      });
    });

    // Street View Category Tabs (Gale vs Planetary)
    document.getElementById('btn-cat-gale').addEventListener('click', () => {
      document.getElementById('btn-cat-gale').classList.add('active');
      document.getElementById('btn-cat-planetary').classList.remove('active');
      document.getElementById('sv-tabs-gale').style.display = 'flex';
      document.getElementById('sv-tabs-planetary').style.display = 'none';
      openMarsStreetView(activeDestinationIndex);
    });

    document.getElementById('btn-cat-planetary').addEventListener('click', () => {
      document.getElementById('btn-cat-planetary').classList.add('active');
      document.getElementById('btn-cat-gale').classList.remove('active');
      document.getElementById('sv-tabs-planetary').style.display = 'flex';
      document.getElementById('sv-tabs-gale').style.display = 'none';
      openPlanetaryStreetView(currentSurveySiteId || 'SITE-OLYMPUS');
    });

    // Planetary Survey Site Buttons
    document.querySelectorAll('.sv-planet-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const siteId = e.target.dataset.site;
        openPlanetaryStreetView(siteId);
      });
    });

    // Solar Lighting Presets
    const sunPresets = {
      dawn: { elev: 8, az: 95 },
      midday: { elev: 68, az: 175 },
      afternoon: { elev: 35, az: 245 },
      sunset: { elev: 3, az: 275 },
      night: { elev: -15, az: 310 }
    };

    document.querySelectorAll('.sv-sun-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.sv-sun-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const presetKey = btn.dataset.preset;
        const config = sunPresets[presetKey] || sunPresets.afternoon;
        updateSunPosition(config.elev, config.az);
      });
    });

    // Solar Angle Slider
    const sunSlider = document.getElementById('sv-sun-slider');
    if (sunSlider) {
      sunSlider.addEventListener('input', (e) => {
        const elev = parseFloat(e.target.value);
        document.querySelectorAll('.sv-sun-btn').forEach(b => b.classList.remove('active'));
        updateSunPosition(elev, currentSunAzimuth);
      });
    }

    // Dust Storm (Tau) Slider
    const dustSlider = document.getElementById('sv-dust-slider');
    if (dustSlider) {
      dustSlider.addEventListener('input', (e) => {
        const tau = parseFloat(e.target.value);
        updateDustStormLighting(tau);
      });
    }

    // 7D Real Experience Audio Toggle
    const btnAudio = document.getElementById('btn-sv-audio');
    if (btnAudio) {
      btnAudio.addEventListener('click', toggle7DAudio);
    }

    // 3D Avatar vs 1st-Person Helmet Visor Toggle
    const btnMode = document.getElementById('btn-sv-mode');
    if (btnMode) {
      btnMode.addEventListener('click', toggleStreetViewMode);
    }

    // Virtual Game D-Pad Walking Controls
    const btnFwd = document.getElementById('btn-walk-forward');
    const btnBack = document.getElementById('btn-walk-back');
    const btnLeft = document.getElementById('btn-walk-left');
    const btnRight = document.getElementById('btn-walk-right');
    const btnJump = document.getElementById('btn-walk-jump');

    if (btnFwd) btnFwd.addEventListener('click', () => walkAstronaut(1, 0));
    if (btnBack) btnBack.addEventListener('click', () => walkAstronaut(-1, 0));
    if (btnLeft) btnLeft.addEventListener('click', () => walkAstronaut(0, -1));
    if (btnRight) btnRight.addEventListener('click', () => walkAstronaut(0, 1));
    if (btnJump) btnJump.addEventListener('click', jumpAstronaut);

    // Keyboard Walking Controls (W, A, S, D, Arrow Keys, Space)
    window.addEventListener('keydown', (e) => {
      if (!isStreetViewActive) return;
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') {
        walkAstronaut(1, 0);
        e.preventDefault();
      } else if (key === 's' || key === 'arrowdown') {
        walkAstronaut(-1, 0);
        e.preventDefault();
      } else if (key === 'a' || key === 'arrowleft') {
        walkAstronaut(0, -1);
        e.preventDefault();
      } else if (key === 'd' || key === 'arrowright') {
        walkAstronaut(0, 1);
        e.preventDefault();
      } else if (key === ' ') {
        jumpAstronaut();
        e.preventDefault();
      }
    });

    // 3D Science Hotspot Notification Card Actions
    const btnCloseHotspot = document.getElementById('btn-close-hotspot');
    if (btnCloseHotspot) {
      btnCloseHotspot.addEventListener('click', () => {
        document.getElementById('sv-hotspot-card').classList.remove('active');
      });
    }

    const btnSample = document.getElementById('btn-collect-sample');
    if (btnSample) {
      btnSample.addEventListener('click', () => {
        btnSample.innerHTML = '✔ Sample Extracted & Stored in Rover Vault!';
        btnSample.style.background = '#10B981';
        setTimeout(() => {
          document.getElementById('sv-hotspot-card').classList.remove('active');
          btnSample.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/></svg> Collect 50g Rock Core Drill Sample';
          btnSample.style.background = '#1E8E3E';
        }, 1800);
      });
    }

    // Initialize Prioritized Mission Dossier Accordion
    setupDossierAccordionListeners();

    // 3D Mars Globe Click -> Open Orbit Modal
    document.getElementById('mars-3d-widget').addEventListener('click', () => {
      document.getElementById('orbit-3d-modal').classList.add('open');
      setTimeout(initLargeMarsOrbitView, 100);
    });
    document.getElementById('btn-close-3d').addEventListener('click', () => {
      document.getElementById('orbit-3d-modal').classList.remove('open');
    });

    // Guide Modal
    document.getElementById('btn-guide').addEventListener('click', () => {
      document.getElementById('guide-modal').classList.add('open');
    });
    document.getElementById('btn-close-guide').addEventListener('click', () => {
      document.getElementById('guide-modal').classList.remove('open');
    });
    document.getElementById('btn-dismiss-guide').addEventListener('click', () => {
      document.getElementById('guide-modal').classList.remove('open');
    });

    // Bottom Sheet Handle
    const bottomSheet = document.getElementById('bottom-sheet');
    document.getElementById('sheet-handle').addEventListener('click', () => {
      bottomSheet.classList.toggle('expanded');
      if (bottomSheet.classList.contains('expanded')) {
        drawSheetElevationProfile();
      }
    });
    document.getElementById('btn-close-sheet').addEventListener('click', () => {
      bottomSheet.classList.remove('expanded');
    });

    // Start / Exit Navigation
    document.getElementById('btn-start-eva').addEventListener('click', startGoogleNavigation);
    document.getElementById('btn-return-hab').addEventListener('click', exitNavigation);

    // Menu Modal
    document.getElementById('btn-menu').addEventListener('click', () => {
      document.getElementById('menu-modal').classList.add('open');
    });
    document.getElementById('btn-close-menu').addEventListener('click', () => {
      document.getElementById('menu-modal').classList.remove('open');
    });
  }

  // Initialize
  initMap();
});
