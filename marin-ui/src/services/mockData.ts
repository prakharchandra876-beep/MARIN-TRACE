import { ActiveCase, HistoricalIncident, SystemSettings } from '../types';

/**
 * OilWatch Core Data Service
 * 
 * NOTICE: This module encapsulates mock data structures aligned with:
 * - Sentinel-1 C-band SAR Level-1 GRD imagery
 * - OpenDrift Lagrangian particle dispersion models
 * - USCG / Marine Cadastre / MarineTraffic AIS message schema
 * - Historical Spill_Incidents.csv schema
 * 
 * In production, replace these functions with real REST / GraphQL endpoints.
 */

export const INITIAL_CASES: ActiveCase[] = [
  {
    id: 'OW-2024-0982',
    name: 'North Sea Corridor (TSS Off Texel)',
    region: 'North Sea / Dutch EEZ',
    status: 'Analysis Complete',
    detectionTime: '2024-09-08 06:14:22 UTC',
    spill: {
      id: 'SPILL-0982-A',
      caseId: 'OW-2024-0982',
      satellite: 'Sentinel-1A SAR (C-Band Interferometric Wide)',
      acquisitionTime: '2024-09-08T06:14:22Z',
      oilDetected: true,
      confidence: 91.4,
      spillType: 'LS',
      spillTypeLabel: 'Linear Slick (Discharge in Transit)',
      areaKm2: 14.85,
      lengthKm: 28.4,
      widthKm: 0.65,
      elongationRatio: 43.7,
      estimatedAgeHours: 6.5,
      centroid: [53.72, 4.35],
      polygon: [
        [53.60, 4.18],
        [53.64, 4.23],
        [53.68, 4.29],
        [53.72, 4.35],
        [53.76, 4.41],
        [53.80, 4.48],
        [53.84, 4.54],
        [53.83, 4.56],
        [53.78, 4.49],
        [53.73, 4.42],
        [53.69, 4.35],
        [53.65, 4.28],
        [53.60, 4.20],
        [53.59, 4.17]
      ],
      centerline: [
        [53.59, 4.18],
        [53.65, 4.26],
        [53.72, 4.35],
        [53.78, 4.44],
        [53.84, 4.54]
      ],
      sarImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      maskOverlayUrl: '',
      polarization: 'VV + VH',
      resolutionMeters: 10,
      incidenceAngleDeg: 38.2,
      seaStateBeaufort: 3
    },
    environment: {
      windSpeedKnots: 16.4,
      windDirectionDeg: 245, // WSW wind blowing towards ENE
      oceanCurrentSpeedMs: 0.48,
      oceanCurrentDirectionDeg: 62, // ENE tidal current
      waterTemperatureC: 15.2,
      waveHeightM: 1.2,
      weatherSource: 'Copernicus Marine Service (CMEMS) + NOAA GFS'
    },
    drift: {
      simulationDurationHours: 12,
      particleCount: 250,
      timeStepMinutes: 15,
      probableSource: {
        lat: 53.56,
        lng: 4.11,
        uncertaintyRadiusKm: 3.4,
        estimatedDischargeTime: '2024-09-07T23:45:00Z'
      },
      backwardDriftPath: [
        { lat: 53.72, lng: 4.35, time: 'T-0h (Observed)', particleSpreadRadiusKm: 0.8 },
        { lat: 53.68, lng: 4.28, time: 'T-2h', particleSpreadRadiusKm: 1.4 },
        { lat: 53.64, lng: 4.22, time: 'T-4h', particleSpreadRadiusKm: 2.1 },
        { lat: 53.60, lng: 4.16, time: 'T-6h', particleSpreadRadiusKm: 2.8 },
        { lat: 53.56, lng: 4.11, time: 'T-6.5h (Probable Source)', particleSpreadRadiusKm: 3.4 }
      ],
      forwardDriftPath: [
        { lat: 53.72, lng: 4.35, time: 'T+0h (Present)', particleSpreadRadiusKm: 0.8 },
        { lat: 53.77, lng: 4.45, time: 'T+3h (Forecast)', particleSpreadRadiusKm: 1.6 },
        { lat: 53.82, lng: 4.56, time: 'T+6h (Forecast)', particleSpreadRadiusKm: 2.5 },
        { lat: 53.88, lng: 4.69, time: 'T+12h (Forecast)', particleSpreadRadiusKm: 4.1 },
        { lat: 53.94, lng: 4.82, time: 'T+24h (Coast Warning)', particleSpreadRadiusKm: 6.8 }
      ],
      particlesSample: [
        { lat: 53.565, lng: 4.115, type: 'backward', ageHours: 6.5 },
        { lat: 53.555, lng: 4.105, type: 'backward', ageHours: 6.5 },
        { lat: 53.570, lng: 4.120, type: 'backward', ageHours: 6.0 },
        { lat: 53.610, lng: 4.175, type: 'backward', ageHours: 5.0 },
        { lat: 53.650, lng: 4.235, type: 'backward', ageHours: 3.5 },
        { lat: 53.690, lng: 4.300, type: 'backward', ageHours: 1.5 },
        { lat: 53.750, lng: 4.410, type: 'forward', ageHours: 2.0 },
        { lat: 53.790, lng: 4.490, type: 'forward', ageHours: 4.5 },
        { lat: 53.840, lng: 4.590, type: 'forward', ageHours: 7.0 },
        { lat: 53.900, lng: 4.710, type: 'forward', ageHours: 14.0 }
      ]
    },
    vessels: [
      {
        id: 'VESSEL-01',
        rank: 1,
        name: 'GREEN PIONEER',
        mmsi: '244710000',
        imo: '9418743',
        vesselType: 'Chemical / Oil Products Tanker',
        flag: 'Netherlands',
        flagCode: 'NL',
        callSign: 'PBTQ',
        destination: 'ROTTERDAM (NLRTM)',
        eta: '2024-09-08 14:00',
        sogKnots: 11.8,
        cogDeg: 232,
        distanceToSourceKm: 1.65,
        proximityScore: 94.2,
        behavioralScore: 88.5,
        finalRiskScore: 91.9,
        status: 'Candidate / Requires Investigation',
        hausdorffDistanceKm: 1.12,
        courseAlignmentDeg: 4.8,
        trajectory: [
          { lat: 53.92, lng: 4.65, time: '08 Sep 03:00', sog: 13.5 },
          { lat: 53.84, lng: 4.52, time: '08 Sep 04:00', sog: 13.1 },
          { lat: 53.74, lng: 4.37, time: '08 Sep 05:00', sog: 11.2 },
          { lat: 53.62, lng: 4.19, time: '08 Sep 06:00', sog: 10.4 },
          { lat: 53.56, lng: 4.11, time: '08 Sep 06:45', sog: 9.8 }, // Reconstructed source intercept
          { lat: 53.45, lng: 3.96, time: '08 Sep 08:00', sog: 12.0 },
          { lat: 53.30, lng: 3.80, time: '08 Sep 09:30', sog: 12.4 }
        ],
        anomaliesDetected: [
          'Transient speed drop of 3.3 knots near reconstructed discharge corridor',
          'Course deviation consistent with tank wash / oily bilge discharge transit',
          'Close spatiotemporal correlation with Sentinel-1 SAR acquisition (1.12 km Hausdorff)'
        ],
        vesselDimensions: {
          lengthM: 114,
          beamM: 17,
          draughtM: 7.2,
          grossTonnage: 4890
        },
        yearBuilt: 2008,
        registeredOwner: 'North Sea Marine Tankers B.V. (MOCK)',
        isReferenceVessel: true
      },
      {
        id: 'VESSEL-02',
        rank: 2,
        name: 'BALTIC SEAS',
        mmsi: '312894000',
        imo: '9654122',
        vesselType: 'Bulk Carrier (Handysize)',
        flag: 'Marshall Islands',
        flagCode: 'MH',
        callSign: 'V7AB8',
        destination: 'ANTWERP (BEANR)',
        eta: '2024-09-09 02:00',
        sogKnots: 13.2,
        cogDeg: 228,
        distanceToSourceKm: 6.84,
        proximityScore: 74.0,
        behavioralScore: 56.2,
        finalRiskScore: 66.9,
        status: 'Candidate / Requires Investigation',
        hausdorffDistanceKm: 5.40,
        courseAlignmentDeg: 12.4,
        trajectory: [
          { lat: 54.00, lng: 4.70, time: '08 Sep 02:30', sog: 13.4 },
          { lat: 53.80, lng: 4.45, time: '08 Sep 04:30', sog: 13.2 },
          { lat: 53.60, lng: 4.25, time: '08 Sep 06:30', sog: 13.1 },
          { lat: 53.38, lng: 4.02, time: '08 Sep 08:30', sog: 13.3 }
        ],
        anomaliesDetected: [
          'Parallel course to spill slick within 6 km buffer',
          'No significant speed variation observed along transit line'
        ],
        vesselDimensions: {
          lengthM: 182,
          beamM: 28,
          draughtM: 10.1,
          grossTonnage: 23500
        },
        yearBuilt: 2014,
        registeredOwner: 'Pelagic Bulk Logistics Corp. (MOCK)'
      },
      {
        id: 'VESSEL-03',
        rank: 3,
        name: 'OCEAN VALIANT',
        mmsi: '636018992',
        imo: '9387410',
        vesselType: 'Crude Oil Tanker (Aframax)',
        flag: 'Liberia',
        flagCode: 'LR',
        callSign: 'A8QK4',
        destination: 'WILHELMSHAVEN',
        eta: '2024-09-08 19:30',
        sogKnots: 14.1,
        cogDeg: 48,
        distanceToSourceKm: 14.20,
        proximityScore: 42.5,
        behavioralScore: 35.0,
        finalRiskScore: 39.5,
        status: 'Low Risk / Cleared',
        hausdorffDistanceKm: 12.80,
        courseAlignmentDeg: 178.0,
        trajectory: [
          { lat: 53.40, lng: 3.90, time: '08 Sep 04:00', sog: 14.0 },
          { lat: 53.60, lng: 4.15, time: '08 Sep 05:45', sog: 14.2 },
          { lat: 53.80, lng: 4.45, time: '08 Sep 07:30', sog: 14.1 }
        ],
        anomaliesDetected: [
          'Opposing lane traffic (heading NE towards Germany)',
          'Passing distance exceeds 10 km from probable discharge origin'
        ],
        vesselDimensions: {
          lengthM: 248,
          beamM: 42,
          draughtM: 14.8,
          grossTonnage: 61200
        },
        yearBuilt: 2011,
        registeredOwner: 'Mariner Tanker Holdings Ltd. (MOCK)'
      },
      {
        id: 'VESSEL-04',
        rank: 4,
        name: 'NORDIC BREEZE',
        mmsi: '257004120',
        imo: '9547118',
        vesselType: 'Container Ship (Feeder)',
        flag: 'Norway',
        flagCode: 'NO',
        callSign: 'LAKX',
        destination: 'HAMBURG',
        eta: '2024-09-09 08:00',
        sogKnots: 16.5,
        cogDeg: 52,
        distanceToSourceKm: 19.40,
        proximityScore: 28.0,
        behavioralScore: 18.0,
        finalRiskScore: 24.0,
        status: 'Low Risk / Cleared',
        hausdorffDistanceKm: 17.50,
        courseAlignmentDeg: 172.0,
        trajectory: [
          { lat: 53.30, lng: 3.75, time: '08 Sep 03:30', sog: 16.5 },
          { lat: 53.60, lng: 4.15, time: '08 Sep 05:30', sog: 16.6 },
          { lat: 53.95, lng: 4.60, time: '08 Sep 07:45', sog: 16.4 }
        ],
        anomaliesDetected: [],
        vesselDimensions: {
          lengthM: 168,
          beamM: 26,
          draughtM: 8.5,
          grossTonnage: 15400
        },
        yearBuilt: 2017,
        registeredOwner: 'Nordic Feeder Lines AS (MOCK)'
      }
    ],
    darkVessels: [
      {
        id: 'DARK-01',
        targetId: 'SAR-TGT-0982-14',
        sarDetectionTime: '2024-09-08 06:14:22 UTC',
        location: [53.53, 4.08],
        estimatedLengthM: 95,
        estimatedBeamM: 16,
        radarCrossSectionDb: 34.2,
        status: 'AIS Gap',
        matchedVesselName: 'POSSIBLE: TANKER "MARIA D" (UNVERIFIED)',
        matchedMmsi: '235091882 (Prior Known)',
        gapDurationHours: 4.8,
        riskLevel: 'Critical',
        notes: 'Target visible on SAR backscatter at 53.53N 4.08E, 4.2 km from reconstructed spill origin. AIS transponder silent for 4.8 hours preceding satellite pass.',
        requiresInvestigation: true
      },
      {
        id: 'DARK-02',
        targetId: 'SAR-TGT-0982-22',
        sarDetectionTime: '2024-09-08 06:14:22 UTC',
        location: [53.78, 4.62],
        estimatedLengthM: 32,
        estimatedBeamM: 8,
        radarCrossSectionDb: 21.0,
        status: 'No AIS',
        riskLevel: 'Warning',
        notes: 'Uncorrelated radar target detected in offshore exclusion zone. Vessel dimensions consistent with ocean-going fishing vessel or workboat.',
        requiresInvestigation: true
      },
      {
        id: 'DARK-03',
        targetId: 'SAR-TGT-0982-03',
        sarDetectionTime: '2024-09-08 06:14:22 UTC',
        location: [53.62, 4.19],
        estimatedLengthM: 112,
        estimatedBeamM: 17,
        radarCrossSectionDb: 38.6,
        status: 'AIS Matched',
        matchedVesselName: 'GREEN PIONEER (IMO 9418743)',
        matchedMmsi: '244710000',
        gapDurationHours: 0,
        riskLevel: 'Verified',
        notes: 'Radar peak coincides with active Class-A AIS transponder transmission position (offset < 140m, within SAR geocoding tolerance).',
        requiresInvestigation: false
      }
    ]
  },
  {
    id: 'OW-2024-1044',
    name: 'Singapore Strait Eastbound Lane',
    region: 'Strait of Malacca & Singapore',
    status: 'In Progress',
    detectionTime: '2024-09-07 18:40:10 UTC',
    spill: {
      id: 'SPILL-1044-B',
      caseId: 'OW-2024-1044',
      satellite: 'Sentinel-1B SAR (C-Band)',
      acquisitionTime: '2024-09-07T18:40:10Z',
      oilDetected: true,
      confidence: 88.7,
      spillType: 'LS',
      spillTypeLabel: 'Linear Slick (Discharge in Transit)',
      areaKm2: 8.92,
      lengthKm: 18.2,
      widthKm: 0.49,
      elongationRatio: 37.1,
      estimatedAgeHours: 4.2,
      centroid: [1.25, 103.95],
      polygon: [
        [1.20, 103.88],
        [1.22, 103.91],
        [1.25, 103.95],
        [1.28, 103.99],
        [1.30, 104.03],
        [1.29, 104.04],
        [1.26, 104.00],
        [1.23, 103.96],
        [1.19, 103.89]
      ],
      centerline: [
        [1.20, 103.88],
        [1.25, 103.95],
        [1.30, 104.03]
      ],
      sarImageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      maskOverlayUrl: '',
      polarization: 'VV + VH',
      resolutionMeters: 10,
      incidenceAngleDeg: 34.6,
      seaStateBeaufort: 2
    },
    environment: {
      windSpeedKnots: 9.8,
      windDirectionDeg: 190,
      oceanCurrentSpeedMs: 0.85,
      oceanCurrentDirectionDeg: 78,
      waterTemperatureC: 29.1,
      waveHeightM: 0.6,
      weatherSource: 'Singapore Maritime & Port Authority OpenData'
    },
    drift: {
      simulationDurationHours: 8,
      particleCount: 200,
      timeStepMinutes: 10,
      probableSource: {
        lat: 1.18,
        lng: 103.84,
        uncertaintyRadiusKm: 2.8,
        estimatedDischargeTime: '2024-09-07T14:30:00Z'
      },
      backwardDriftPath: [
        { lat: 1.25, lng: 103.95, time: 'T-0h', particleSpreadRadiusKm: 0.5 },
        { lat: 1.22, lng: 103.90, time: 'T-2h', particleSpreadRadiusKm: 1.2 },
        { lat: 1.18, lng: 103.84, time: 'T-4.2h', particleSpreadRadiusKm: 2.8 }
      ],
      forwardDriftPath: [
        { lat: 1.25, lng: 103.95, time: 'T+0h', particleSpreadRadiusKm: 0.5 },
        { lat: 1.29, lng: 104.02, time: 'T+3h', particleSpreadRadiusKm: 1.4 },
        { lat: 1.34, lng: 104.12, time: 'T+6h', particleSpreadRadiusKm: 2.9 }
      ],
      particlesSample: []
    },
    vessels: [
      {
        id: 'VESSEL-SG-01',
        rank: 1,
        name: 'ORIENTAL GLORY',
        mmsi: '563002910',
        imo: '9782190',
        vesselType: 'VLCC Crude Oil Tanker',
        flag: 'Singapore',
        flagCode: 'SG',
        callSign: '9V892',
        destination: 'NINGBO',
        eta: '2024-09-14 18:00',
        sogKnots: 12.1,
        cogDeg: 76,
        distanceToSourceKm: 2.4,
        proximityScore: 88.0,
        behavioralScore: 74.0,
        finalRiskScore: 82.4,
        status: 'Candidate / Requires Investigation',
        hausdorffDistanceKm: 1.95,
        courseAlignmentDeg: 8.2,
        trajectory: [],
        anomaliesDetected: ['AIS positional stutter for 40 minutes near strait bottleneck'],
        vesselDimensions: { lengthM: 333, beamM: 60, draughtM: 20.5, grossTonnage: 156000 },
        yearBuilt: 2018,
        registeredOwner: 'Glory Shipping Ltd (MOCK)'
      }
    ],
    darkVessels: [
      {
        id: 'DARK-SG-01',
        targetId: 'SAR-TGT-1044-09',
        sarDetectionTime: '2024-09-07 18:40:10 UTC',
        location: [1.19, 103.86],
        estimatedLengthM: 140,
        estimatedBeamM: 22,
        radarCrossSectionDb: 36.0,
        status: 'No AIS',
        riskLevel: 'Critical',
        notes: 'Co-located near probable discharge source. No AIS message received by terrestrial or satellite AIS receivers.',
        requiresInvestigation: true
      }
    ]
  },
  {
    id: 'OW-2024-0719',
    name: 'Gulf of Mexico Deepwater Mississippi Canyon',
    region: 'Gulf of Mexico / US OCS',
    status: 'Archived',
    detectionTime: '2024-08-22 11:05:00 UTC',
    spill: {
      id: 'SPILL-0719-C',
      caseId: 'OW-2024-0719',
      satellite: 'Sentinel-1A SAR',
      acquisitionTime: '2024-08-22T11:05:00Z',
      oilDetected: true,
      confidence: 94.6,
      spillType: 'ONS',
      spillTypeLabel: 'Ongoing Seep / Platform Source',
      areaKm2: 24.10,
      lengthKm: 34.0,
      widthKm: 1.10,
      elongationRatio: 30.9,
      estimatedAgeHours: 18.0,
      centroid: [28.60, -89.80],
      polygon: [
        [28.52, -89.92],
        [28.58, -89.84],
        [28.65, -89.72],
        [28.68, -89.66],
        [28.64, -89.68],
        [28.56, -89.80],
        [28.50, -89.90]
      ],
      centerline: [
        [28.51, -89.91],
        [28.60, -89.80],
        [28.67, -89.67]
      ],
      sarImageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
      maskOverlayUrl: '',
      polarization: 'VV',
      resolutionMeters: 10,
      incidenceAngleDeg: 41.2,
      seaStateBeaufort: 4
    },
    environment: {
      windSpeedKnots: 21.0,
      windDirectionDeg: 140,
      oceanCurrentSpeedMs: 0.62,
      oceanCurrentDirectionDeg: 310,
      waterTemperatureC: 28.5,
      waveHeightM: 1.8,
      weatherSource: 'NOAA NDBC Buoy 42040'
    },
    drift: {
      simulationDurationHours: 24,
      particleCount: 300,
      timeStepMinutes: 30,
      probableSource: {
        lat: 28.51,
        lng: -89.91,
        uncertaintyRadiusKm: 1.5,
        estimatedDischargeTime: '2024-08-21T18:00:00Z'
      },
      backwardDriftPath: [],
      forwardDriftPath: [],
      particlesSample: []
    },
    vessels: [],
    darkVessels: []
  }
];

/**
 * Historical Spill Incidents Dataset (Mock based on Spill_Incidents.csv structure)
 */
export const HISTORICAL_INCIDENTS: HistoricalIncident[] = [
  {
    id: 'INC-2024-081',
    incidentDate: '2024-07-14',
    waterbody: 'North Sea (Dutch Sector)',
    material: 'Heavy Fuel Oil (HFO / Bunker C)',
    estimatedVolumeGal: 4200,
    location: '53.64 N, 4.22 E',
    coordinates: [53.64, 4.22],
    sourceType: 'Commercial Vessel Bilge',
    vesselName: 'SUSPECT VESSEL #A-44',
    responseStatus: 'Enforcement Action',
    severity: 'Medium'
  },
  {
    id: 'INC-2024-049',
    incidentDate: '2024-05-20',
    waterbody: 'English Channel Traffic Separation Scheme',
    material: 'Oily Bilge Water',
    estimatedVolumeGal: 1200,
    location: '50.41 N, 0.18 W',
    coordinates: [50.41, -0.18],
    sourceType: 'Container Vessel Transit',
    vesselName: 'UNKNOWN (Dark Target)',
    responseStatus: 'Monitoring',
    severity: 'Minor'
  },
  {
    id: 'INC-2023-142',
    incidentDate: '2023-11-09',
    waterbody: 'Strait of Malacca',
    material: 'Crude Oil',
    estimatedVolumeGal: 18500,
    location: '1.45 N, 103.20 E',
    coordinates: [1.45, 103.20],
    sourceType: 'Tanker Wash / Slop Discharge',
    vesselName: 'PACIFIC DAWN',
    responseStatus: 'Resolved',
    severity: 'Major'
  },
  {
    id: 'INC-2023-118',
    incidentDate: '2023-09-02',
    waterbody: 'North Sea (German Bight)',
    material: 'Lubricating / Hydraulic Oil',
    estimatedVolumeGal: 850,
    location: '54.12 N, 7.82 E',
    coordinates: [54.12, 7.82],
    sourceType: 'Offshore Service Vessel',
    vesselName: 'WIND TENDER II',
    responseStatus: 'Closed',
    severity: 'Minor'
  },
  {
    id: 'INC-2023-094',
    incidentDate: '2023-06-18',
    waterbody: 'Gulf of Mexico (Mississippi Canyon)',
    material: 'Condensate / Light Crude',
    estimatedVolumeGal: 6200,
    location: '28.72 N, -89.44 W',
    coordinates: [28.72, -89.44],
    sourceType: 'Pipeline Flange Weep',
    vesselName: 'MC-311 Platform',
    responseStatus: 'Closed',
    severity: 'Medium'
  },
  {
    id: 'INC-2022-205',
    incidentDate: '2022-12-04',
    waterbody: 'Baltic Sea (Bornholm Deep)',
    material: 'Heavy Fuel Oil',
    estimatedVolumeGal: 9400,
    location: '55.22 N, 15.11 E',
    coordinates: [55.22, 15.11],
    sourceType: 'General Cargo Discharge',
    vesselName: 'NORDIC STAR',
    responseStatus: 'Enforcement Action',
    severity: 'Major'
  },
  {
    id: 'INC-2022-167',
    incidentDate: '2022-08-30',
    waterbody: 'North Sea (TSS Off Texel)',
    material: 'Oily Bilge Water',
    estimatedVolumeGal: 1500,
    location: '53.48 N, 4.05 E',
    coordinates: [53.48, 4.05],
    sourceType: 'Vessel in Transit',
    vesselName: 'UNRESOLVED (AIS Gap)',
    responseStatus: 'Closed',
    severity: 'Minor'
  },
  {
    id: 'INC-2021-310',
    incidentDate: '2021-10-15',
    waterbody: 'Gibraltar Strait',
    material: 'Marine Gas Oil (MGO)',
    estimatedVolumeGal: 3200,
    location: '35.98 N, -5.48 W',
    coordinates: [35.98, -5.48],
    sourceType: 'Bunkering Spill',
    vesselName: 'BUNKER TANKER CEUTA',
    responseStatus: 'Resolved',
    severity: 'Medium'
  }
];

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  detectionThreshold: 0.50,
  driftParticleCount: 250,
  driftTimeStepMin: 15,
  darkVesselBufferKm: 15.0,
  useSyntheticFallback: true,
  enableAlertSounds: false,
  autoRefreshAis: false,
  analyticsOptOut: true,
  strictGdprCompliance: true,
  activeCaseId: 'OW-2024-0982'
};

/**
 * File Generation & Download Helpers (Client-side)
 */
export function downloadJson(data: unknown, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadCsv(headers: string[], rows: (string | number)[][], filename: string) {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const ACTIVE_CASES: ActiveCase[] = INITIAL_CASES;
