import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ActiveCase, VesselAttributionData, DarkVesselData } from '../types';
import { Layers, Eye, EyeOff, ZoomIn, ZoomOut, Compass, Wind, Navigation } from 'lucide-react';

interface MapViewProps {
  activeCase: ActiveCase;
  selectedVessel?: VesselAttributionData | null;
  onSelectVessel?: (vessel: VesselAttributionData) => void;
  selectedDarkVessel?: DarkVesselData | null;
  onSelectDarkVessel?: (target: DarkVesselData) => void;
  focusMode?: 'all' | 'spill' | 'drift' | 'vessels' | 'dark';
  heightClassName?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  activeCase,
  selectedVessel,
  onSelectVessel,
  selectedDarkVessel,
  onSelectDarkVessel,
  focusMode = 'all',
  heightClassName = 'h-[580px]'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Layer toggles
  const [layers, setLayers] = useState({
    spill: true,
    backwardDrift: true,
    forwardDrift: true,
    probableSource: true,
    vessels: true,
    darkVessels: true,
    particles: true
  });

  const [showLayerPanel, setShowLayerPanel] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const defaultCenter: [number, number] = activeCase?.spill?.centroid || [53.15, 4.35];
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 10,
        zoomControl: false,
        attributionControl: false
      });

      // Reliable, free OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Attribution
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; <a href="https://carto.com/" target="_blank" rel="noreferrer" class="text-slate-500 hover:text-cyan-400">CARTO</a> | &copy; OpenStreetMap | Sentinel-1 SAR')
        .addTo(map);

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Center when case changes
  useEffect(() => {
    if (!mapRef.current || !activeCase?.spill?.centroid) return;
    mapRef.current.setView(activeCase.spill.centroid, 10, { animate: true });
  }, [activeCase?.id]);

  // Render Map Features
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Feature group to clear and re-render
    // Remove existing custom layers (keep tile layer)
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    const spill = activeCase.spill;
    const drift = activeCase.drift;

    // 1. SPILL POLYGON & SKELETON
    if (layers.spill && spill.polygon.length > 0) {
      const polygon = L.polygon(spill.polygon, {
        color: '#ef4444',
        weight: 2,
        opacity: 0.9,
        fillColor: '#991b1b',
        fillOpacity: 0.45,
        dashArray: '4, 2'
      }).addTo(map);

      polygon.bindPopup(`
        <div class="p-2 space-y-1 text-xs">
          <div class="font-bold text-rose-400 flex items-center justify-between">
            <span>OBSERVED OIL SLICK</span>
            <span class="bg-rose-950 text-rose-300 border border-rose-800 px-1 rounded text-[10px]">MOCK</span>
          </div>
          <div class="text-slate-300"><strong>Case:</strong> ${spill.caseId}</div>
          <div class="text-slate-300"><strong>Type:</strong> ${spill.spillTypeLabel}</div>
          <div class="text-slate-300"><strong>Area:</strong> ${spill.areaKm2} km² (${spill.lengthKm} km x ${spill.widthKm} km)</div>
          <div class="text-slate-300"><strong>Detection Confidence:</strong> <span class="text-emerald-400 font-semibold">${spill.confidence}%</span></div>
          <div class="text-slate-400 text-[11px] pt-1">Sentinel-1 C-SAR acquisition: ${spill.acquisitionTime}</div>
        </div>
      `);

      // Centerline Skeleton
      if (spill.centerline && spill.centerline.length > 0) {
        L.polyline(spill.centerline, {
          color: '#f43f5e',
          weight: 3,
          opacity: 0.95
        }).addTo(map);
      }

      // Centroid Marker
      const slickIcon = L.divIcon({
        className: 'custom-slick-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-7 w-7 animate-ping rounded-full bg-rose-500 opacity-40"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-rose-600 border-2 border-white shadow-lg"></span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      L.marker(spill.centroid, { icon: slickIcon })
        .addTo(map)
        .bindPopup(`<div class="p-1 text-xs font-semibold text-rose-300">Spill Centroid (${spill.centroid[0].toFixed(2)}°N, ${spill.centroid[1].toFixed(2)}°E)</div>`);
    }

    // 2. PROBABLE SOURCE REGION & UNCERTAINTY RADIUS
    if (layers.probableSource && drift.probableSource) {
      const src = drift.probableSource;
      
      // Uncertainty radius circle
      L.circle([src.lat, src.lng], {
        radius: src.uncertaintyRadiusKm * 1000,
        color: '#f59e0b',
        weight: 1.5,
        opacity: 0.8,
        dashArray: '6, 6',
        fillColor: '#d97706',
        fillOpacity: 0.15
      }).addTo(map).bindPopup(`
        <div class="p-2 space-y-1 text-xs">
          <div class="font-bold text-amber-400">PROBABLE SOURCE REGION</div>
          <div class="text-slate-300"><strong>Estimated Discharge:</strong> ${src.estimatedDischargeTime}</div>
          <div class="text-slate-300"><strong>Uncertainty Radius:</strong> ±${src.uncertaintyRadiusKm} km</div>
          <div class="text-slate-400 text-[11px]">Reconstructed via Lagrangian backward drift simulation</div>
        </div>
      `);

      // Source origin marker
      const sourceIcon = L.divIcon({
        className: 'custom-src-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="relative inline-flex rounded-full h-5 w-5 bg-amber-500 border-2 border-amber-200 shadow-md flex items-center justify-center text-[9px] font-bold text-black">
              ★
            </span>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      L.marker([src.lat, src.lng], { icon: sourceIcon })
        .addTo(map)
        .bindPopup(`<div class="p-1 text-xs font-bold text-amber-300">Estimated Discharge Origin (Source)</div>`);
    }

    // 3. BACKWARD DRIFT PATH (Origin reconstruction)
    if (layers.backwardDrift && drift.backwardDriftPath.length > 0) {
      const latlngs = drift.backwardDriftPath.map(p => [p.lat, p.lng] as [number, number]);
      L.polyline(latlngs, {
        color: '#38bdf8',
        weight: 3,
        dashArray: '5, 5',
        opacity: 0.85
      }).addTo(map);

      drift.backwardDriftPath.forEach((pt, idx) => {
        if (idx > 0 && idx < drift.backwardDriftPath.length - 1) {
          const ptIcon = L.divIcon({
            className: 'custom-path-point',
            html: `<div class="h-2 w-2 rounded-full bg-cyan-400 border border-slate-900 shadow"></div>`,
            iconSize: [8, 8],
            iconAnchor: [4, 4]
          });
          L.marker([pt.lat, pt.lng], { icon: ptIcon })
            .addTo(map)
            .bindTooltip(`Backward Drift: ${pt.time}`, { direction: 'top', className: 'bg-slate-900 text-xs text-cyan-300 border border-slate-700' });
        }
      });
    }

    // 4. FORWARD DRIFT PATH (Future trajectory forecast)
    if (layers.forwardDrift && drift.forwardDriftPath.length > 0) {
      const latlngs = drift.forwardDriftPath.map(p => [p.lat, p.lng] as [number, number]);
      L.polyline(latlngs, {
        color: '#a855f7',
        weight: 3,
        dashArray: '8, 4',
        opacity: 0.85
      }).addTo(map);

      drift.forwardDriftPath.forEach((pt) => {
        const ptIcon = L.divIcon({
          className: 'custom-path-point-fwd',
          html: `<div class="h-2.5 w-2.5 rounded-full bg-purple-400 border border-slate-900 shadow"></div>`,
          iconSize: [10, 10],
          iconAnchor: [5, 5]
        });
        L.marker([pt.lat, pt.lng], { icon: ptIcon })
          .addTo(map)
          .bindTooltip(`Forecast: ${pt.time} (±${pt.particleSpreadRadiusKm} km)`, { direction: 'top', className: 'bg-slate-900 text-xs text-purple-300 border border-slate-700' });
      });
    }

    // 5. LAGRANGIAN PARTICLES
    if (layers.particles && drift.particlesSample) {
      drift.particlesSample.forEach(p => {
        const color = p.type === 'backward' ? '#38bdf8' : '#c084fc';
        L.circleMarker([p.lat, p.lng], {
          radius: 2.5,
          color: color,
          fillColor: color,
          fillOpacity: 0.7,
          weight: 0.5
        }).addTo(map);
      });
    }

    // 6. AIS VESSELS & TRAJECTORIES
    if (layers.vessels && activeCase.vessels) {
      activeCase.vessels.forEach(vessel => {
        const isSelected = selectedVessel?.id === vessel.id;
        const isPrimarySuspect = vessel.rank === 1;

        // Vessel Trajectory
        if (vessel.trajectory && vessel.trajectory.length > 0) {
          const trackLatLngs = vessel.trajectory.map(t => [t.lat, t.lng] as [number, number]);
          const trackColor = isPrimarySuspect ? '#ef4444' : isSelected ? '#38bdf8' : '#64748b';

          L.polyline(trackLatLngs, {
            color: trackColor,
            weight: isPrimarySuspect || isSelected ? 3.5 : 1.8,
            opacity: isPrimarySuspect || isSelected ? 0.95 : 0.6
          }).addTo(map);
        }

        // Current / Latest Vessel Location
        const latestPt = vessel.trajectory?.[vessel.trajectory.length - 1] || { lat: vessel.trajectory?.[0]?.lat || 53.6, lng: vessel.trajectory?.[0]?.lng || 4.2 };
        const markerColorClass = vessel.finalRiskScore >= 80 ? 'bg-red-500 border-red-200' : vessel.finalRiskScore >= 50 ? 'bg-amber-500 border-amber-200' : 'bg-emerald-500 border-emerald-200';

        const vesselIcon = L.divIcon({
          className: 'custom-vessel-marker',
          html: `
            <div class="relative cursor-pointer group">
              <div class="h-6 w-6 rounded-md ${markerColorClass} border shadow-lg flex items-center justify-center text-white text-[10px] font-bold">
                ${vessel.rank}
              </div>
              <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-slate-200 text-[10px] font-mono px-1 rounded border border-slate-700 pointer-events-none">
                ${vessel.name.split(' ')[0]}
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const vMarker = L.marker([latestPt.lat, latestPt.lng], { icon: vesselIcon }).addTo(map);

        vMarker.on('click', () => {
          if (onSelectVessel) {
            onSelectVessel(vessel);
          }
        });

        vMarker.bindPopup(`
          <div class="p-2 space-y-1.5 text-xs">
            <div class="flex items-center justify-between border-b border-slate-700 pb-1">
              <span class="font-bold text-slate-100">${vessel.name}</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold ${vessel.finalRiskScore >= 80 ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-slate-800 text-slate-300'}">
                Risk: ${vessel.finalRiskScore}%
              </span>
            </div>
            <div class="text-slate-300"><strong>IMO / MMSI:</strong> ${vessel.imo} / ${vessel.mmsi}</div>
            <div class="text-slate-300"><strong>Type:</strong> ${vessel.vesselType}</div>
            <div class="text-slate-300"><strong>Flag:</strong> ${vessel.flag} (${vessel.flagCode})</div>
            <div class="text-slate-300"><strong>Dist to Source:</strong> <span class="text-cyan-300 font-mono font-semibold">${vessel.distanceToSourceKm} km</span></div>
            <div class="text-slate-300"><strong>Hausdorff Distance:</strong> <span class="text-rose-300 font-mono font-semibold">${vessel.hausdorffDistanceKm} km</span></div>
            <div class="text-amber-400 font-medium text-[11px] pt-1">
              Status: ${vessel.status}
            </div>
            <div class="text-slate-400 text-[10px] italic">
              Note: Historical AIS values labeled MOCK. Click vessel row in Attribution tab for full profile.
            </div>
          </div>
        `);
      });
    }

    // 7. DARK VESSELS (SAR Targets vs AIS Gaps)
    if (layers.darkVessels && activeCase.darkVessels) {
      activeCase.darkVessels.forEach(dv => {
        const isGap = dv.status === 'AIS Gap';
        const isNoAis = dv.status === 'No AIS';

        if (!isGap && !isNoAis) return; // Verified matched targets don't need warning rings

        const darkIcon = L.divIcon({
          className: 'custom-dark-vessel-marker',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer">
              <span class="absolute inline-flex h-8 w-8 animate-ping rounded-full ${isGap ? 'bg-amber-500' : 'bg-red-600'} opacity-30"></span>
              <div class="h-6 w-6 rounded-full border-2 ${isGap ? 'border-amber-400 bg-amber-950/80 text-amber-300' : 'border-red-500 bg-red-950/80 text-red-300'} flex items-center justify-center shadow-lg text-[10px] font-bold">
                !
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const dMarker = L.marker(dv.location, { icon: darkIcon }).addTo(map);

        dMarker.on('click', () => {
          if (onSelectDarkVessel) {
            onSelectDarkVessel(dv);
          }
        });

        dMarker.bindPopup(`
          <div class="p-2 space-y-1.5 text-xs">
            <div class="flex items-center justify-between border-b border-slate-700 pb-1">
              <span class="font-bold text-amber-400 flex items-center gap-1">
                <span>DARK VESSEL ALERT</span>
              </span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-950 text-red-300 border border-red-800">
                ${dv.status}
              </span>
            </div>
            <div class="text-slate-300"><strong>Target ID:</strong> <span class="font-mono">${dv.targetId}</span></div>
            <div class="text-slate-300"><strong>Radar Dimensions:</strong> ~${dv.estimatedLengthM}m x ${dv.estimatedBeamM}m</div>
            <div class="text-slate-300"><strong>RCS Intensity:</strong> ${dv.radarCrossSectionDb} dB</div>
            ${dv.gapDurationHours ? `<div class="text-rose-400"><strong>Transponder Gap:</strong> ${dv.gapDurationHours} hours</div>` : ''}
            <div class="text-slate-300 text-[11px]">${dv.notes}</div>
            <div class="text-amber-400 font-semibold text-[10px] uppercase tracking-wider pt-1">
              Designation: Candidate / Requires Investigation
            </div>
          </div>
        `);
      });
    }

  }, [activeCase, layers, selectedVessel, selectedDarkVessel]);

  // Center on selected vessel if updated
  useEffect(() => {
    if (!mapRef.current || !selectedVessel?.trajectory?.[0]) return;
    const latest = selectedVessel.trajectory[selectedVessel.trajectory.length - 1];
    if (latest) {
      mapRef.current.setView([latest.lat, latest.lng], 11, { animate: true });
    }
  }, [selectedVessel]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.setView(activeCase.spill.centroid, 10, { animate: true });
    }
  };

  return (
    <div className={`relative w-full ${heightClassName} bg-[#0b111e] rounded-xl overflow-hidden border border-slate-800 shadow-2xl`}>
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Map Controls Overlay */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2">
        {/* Layer Toggle Button */}
        <div className="relative">
          <button
            id="map-layer-toggle-btn"
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium shadow-lg hover:bg-slate-800 transition-colors"
            aria-label="Toggle map layers panel"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Map Layers</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          </button>

          {/* Layer Options Dropdown */}
          {showLayerPanel && (
            <div className="absolute top-10 left-0 w-64 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <span>Active Tactical Layers</span>
                <button
                  onClick={() => setShowLayerPanel(false)}
                  className="text-slate-400 hover:text-white"
                  aria-label="Close layer panel"
                >
                  ✕
                </button>
              </div>

              <label className="flex items-center justify-between text-slate-200 cursor-pointer hover:bg-slate-800/60 p-1.5 rounded">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-rose-500/60 border border-rose-400"></span>
                  Detected Spill Slick & Mask
                </span>
                <input
                  type="checkbox"
                  checked={layers.spill}
                  onChange={(e) => setLayers({ ...layers, spill: e.target.checked })}
                  className="accent-cyan-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-slate-200 cursor-pointer hover:bg-slate-800/60 p-1.5 rounded">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-1.5 bg-cyan-400"></span>
                  Backward Drift (Source Trail)
                </span>
                <input
                  type="checkbox"
                  checked={layers.backwardDrift}
                  onChange={(e) => setLayers({ ...layers, backwardDrift: e.target.checked })}
                  className="accent-cyan-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-slate-200 cursor-pointer hover:bg-slate-800/60 p-1.5 rounded">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-1.5 bg-purple-400"></span>
                  Forward Drift (Dispersal)
                </span>
                <input
                  type="checkbox"
                  checked={layers.forwardDrift}
                  onChange={(e) => setLayers({ ...layers, forwardDrift: e.target.checked })}
                  className="accent-cyan-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-slate-200 cursor-pointer hover:bg-slate-800/60 p-1.5 rounded">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border border-amber-400 bg-amber-500/30"></span>
                  Probable Source Region
                </span>
                <input
                  type="checkbox"
                  checked={layers.probableSource}
                  onChange={(e) => setLayers({ ...layers, probableSource: e.target.checked })}
                  className="accent-cyan-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-slate-200 cursor-pointer hover:bg-slate-800/60 p-1.5 rounded">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-red-500 text-[8px] text-white flex items-center justify-center font-bold">1</span>
                  AIS Vessel Trajectories
                </span>
                <input
                  type="checkbox"
                  checked={layers.vessels}
                  onChange={(e) => setLayers({ ...layers, vessels: e.target.checked })}
                  className="accent-cyan-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-slate-200 cursor-pointer hover:bg-slate-800/60 p-1.5 rounded">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400 text-black flex items-center justify-center text-[9px] font-bold">!</span>
                  Dark Vessels (SAR Radar)
                </span>
                <input
                  type="checkbox"
                  checked={layers.darkVessels}
                  onChange={(e) => setLayers({ ...layers, darkVessels: e.target.checked })}
                  className="accent-cyan-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-slate-200 cursor-pointer hover:bg-slate-800/60 p-1.5 rounded">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-300"></span>
                  Lagrangian Particles
                </span>
                <input
                  type="checkbox"
                  checked={layers.particles}
                  onChange={(e) => setLayers({ ...layers, particles: e.target.checked })}
                  className="accent-cyan-500 rounded"
                />
              </label>
            </div>
          )}
        </div>

        {/* Environmental Summary Badge */}
        <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1 text-slate-400">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <span>{activeCase.environment.windSpeedKnots} kts @ {activeCase.environment.windDirectionDeg}°</span>
          </div>
          <div className="h-3 w-px bg-slate-700" />
          <div className="flex items-center gap-1 text-slate-400">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Current {activeCase.environment.oceanCurrentSpeedMs} m/s @ {activeCase.environment.oceanCurrentDirectionDeg}°</span>
          </div>
        </div>
      </div>

      {/* Map Navigation Controls (Top Right) */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col gap-1.5">
        <button
          id="map-zoom-in-btn"
          onClick={handleZoomIn}
          className="p-2 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 hover:text-white rounded-lg shadow hover:bg-slate-800 transition-colors"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          id="map-zoom-out-btn"
          onClick={handleZoomOut}
          className="p-2 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 hover:text-white rounded-lg shadow hover:bg-slate-800 transition-colors"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          id="map-reset-btn"
          onClick={handleResetView}
          className="p-2 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 hover:text-white rounded-lg shadow hover:bg-slate-800 transition-colors"
          title="Reset to Spill Centroid"
          aria-label="Reset View"
        >
          <Navigation className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

      {/* Bottom Map Legend */}
      <div className="absolute bottom-3 left-3 z-[400] bg-slate-950/85 backdrop-blur-md border border-slate-800/80 rounded-lg p-2 text-[11px] text-slate-300 max-w-sm hidden md:block">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-500"></span>
            <span>Spill Slick</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-cyan-400 border-dashed"></span>
            <span>Backward Drift</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-purple-400 border-dashed"></span>
            <span>Forward Drift</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-amber-400 bg-amber-500/40"></span>
            <span>Probable Source</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-red-500"></span>
            <span>Suspect Vessel</span>
          </div>
        </div>
      </div>
    </div>
  );
};
