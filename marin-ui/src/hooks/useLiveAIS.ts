import { useState, useEffect } from 'react';

export interface LiveVesselPosition {
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  lastUpdated: Date;
}

export const useLiveAIS = () => {
  const [livePositions, setLivePositions] = useState<Record<string, LiveVesselPosition>>({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to your local FastAPI server
    const ws = new WebSocket('ws://localhost:8000/api/live-vessels');

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'LIVE_AIS_UPDATE') {
        setLivePositions((prev) => ({
          ...prev,
          // We use the ship's MMSI number as the exact key to update its position
          [data.mmsi]: {
            lat: data.lat,
            lng: data.lng,
            speed: data.speed_knots,
            heading: data.heading,
            lastUpdated: new Date()
          }
        }));
      }
    };

    // Cleanup the connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []);

  return { livePositions, isConnected };
};