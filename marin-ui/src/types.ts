export type NavigationPage = 'landing' | 'dashboard' | 'settings' | 'legal';
export type PageSection = NavigationPage;

export type DashboardTab =
  | 'overview'
  | 'spill-detection'
  | 'drift-analysis'
  | 'vessel-attribution'
  | 'dark-vessels'
  | 'historical-incidents'
  | 'investigation-report';

export type SpillClassification = 'LS' | 'ONS' | 'OTS'; // Linear Slick, Ongoing, Other

export interface SpillDetectionData {
  id: string;
  caseId: string;
  satellite: string; // e.g. "Sentinel-1A SAR (C-Band)"
  acquisitionTime: string;
  oilDetected: boolean;
  confidence: number; // e.g. 91.4
  spillType: SpillClassification;
  spillTypeLabel: string;
  areaKm2: number;
  lengthKm: number;
  widthKm: number;
  elongationRatio: number;
  estimatedAgeHours: number;
  centroid: [number, number]; // [lat, lng]
  polygon: [number, number][];
  centerline: [number, number][];
  sarImageUrl: string;
  maskOverlayUrl: string;
  polarization: string; // "VV + VH"
  resolutionMeters: number;
  incidenceAngleDeg: number;
  seaStateBeaufort: number;
}

export interface EnvironmentalConditions {
  windSpeedKnots: number;
  windDirectionDeg: number;
  oceanCurrentSpeedMs: number;
  oceanCurrentDirectionDeg: number;
  waterTemperatureC: number;
  waveHeightM: number;
  weatherSource: string;
}

export interface DriftSimulationData {
  simulationDurationHours: number;
  particleCount: number;
  timeStepMinutes: number;
  probableSource: {
    lat: number;
    lng: number;
    uncertaintyRadiusKm: number;
    estimatedDischargeTime: string;
  };
  backwardDriftPath: {
    lat: number;
    lng: number;
    time: string;
    particleSpreadRadiusKm: number;
  }[];
  forwardDriftPath: {
    lat: number;
    lng: number;
    time: string;
    particleSpreadRadiusKm: number;
  }[];
  particlesSample: {
    lat: number;
    lng: number;
    type: 'forward' | 'backward';
    ageHours: number;
  }[];
}

export interface VesselAttributionData {
  id: string;
  rank: number;
  name: string;
  mmsi: string;
  imo: string;
  vesselType: string;
  flag: string;
  flagCode: string;
  callSign: string;
  destination: string;
  eta: string;
  sogKnots: number; // Speed Over Ground
  cogDeg: number; // Course Over Ground
  distanceToSourceKm: number;
  proximityScore: number; // 0 - 100
  behavioralScore: number; // 0 - 100
  finalRiskScore: number; // 0 - 100
  status: 'Candidate / Requires Investigation' | 'High Risk' | 'Moderate Risk' | 'Low Risk / Cleared';
  hausdorffDistanceKm: number;
  courseAlignmentDeg: number;
  trajectory: {
    lat: number;
    lng: number;
    time: string;
    sog: number;
  }[];
  anomaliesDetected: string[];
  vesselDimensions: {
    lengthM: number;
    beamM: number;
    draughtM: number;
    grossTonnage: number;
  };
  yearBuilt: number;
  registeredOwner: string;
  isReferenceVessel?: boolean; // Flag for GREEN PIONEER IMO 9418743
}

export type DarkVesselStatus = 'AIS Matched' | 'AIS Gap' | 'No AIS';

export interface DarkVesselData {
  id: string;
  targetId: string;
  sarDetectionTime: string;
  location: [number, number];
  estimatedLengthM: number;
  estimatedBeamM: number;
  radarCrossSectionDb: number;
  status: DarkVesselStatus;
  matchedVesselName?: string;
  matchedMmsi?: string;
  gapDurationHours?: number;
  riskLevel: 'Critical' | 'Warning' | 'Verified' | 'Unknown';
  notes: string;
  requiresInvestigation: boolean;
}

export interface HistoricalIncident {
  id: string;
  incidentDate: string;
  waterbody: string;
  material: string;
  estimatedVolumeGal: number;
  location: string;
  coordinates: [number, number];
  sourceType: string;
  vesselName?: string;
  responseStatus: 'Closed' | 'Monitoring' | 'Enforcement Action' | 'Resolved';
  severity: 'Minor' | 'Medium' | 'Major';
}

export interface ActiveCase {
  id: string;
  name: string;
  region: string;
  status: 'Analysis Complete' | 'In Progress' | 'Archived';
  detectionTime: string;
  spill: SpillDetectionData;
  environment: EnvironmentalConditions;
  drift: DriftSimulationData;
  vessels: VesselAttributionData[];
  darkVessels: DarkVesselData[];
}

export interface SystemSettings {
  detectionThreshold: number;
  driftParticleCount: number;
  driftTimeStepMin: number;
  darkVesselBufferKm: number;
  useSyntheticFallback: boolean;
  enableAlertSounds: boolean;
  autoRefreshAis: boolean;
  analyticsOptOut: boolean;
  strictGdprCompliance: boolean;
  activeCaseId: string;
}
