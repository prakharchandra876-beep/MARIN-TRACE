import asyncio
import json
import websockets
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paste your free aisstream.io key here
AISSTREAM_API_KEY = "f6a601242d9c057c2b1a350283f5559b2d1b5b43"
@app.websocket("/api/live-vessels")
async def live_vessels(frontend_ws: WebSocket):
    await frontend_ws.accept()
    print("🟢 React Frontend Connected. Tapping into global AIS satellite stream...")
    
    try:
        # Connect to the real global AIS firehose
        async with websockets.connect("wss://stream.aisstream.io/v0/stream") as ais_ws:
            
            # Subscribe to the entire globe
            subscribe_message = {
                "APIKey": AISSTREAM_API_KEY,
                "BoundingBoxes": [[[-90, -180], [90, 180]]], 
                "FilterMessageTypes": ["PositionReport"]
            }
            await ais_ws.send(json.dumps(subscribe_message))
            print("📡 Connected to AisStream! Watching for real ships...")

            while True:
                # Receive real data from satellite
                message = await ais_ws.recv()
                data = json.loads(message)
                
                if data["MessageType"] == "PositionReport":
                    report = data["Message"]["PositionReport"]
                    mmsi = str(report["UserID"])
                    
                    # 🚀 HACKATHON TRICK: Hijack one real ship to act as our primary suspect
                    # Just replace this number with any MMSI you see printing in the terminal!
                    if mmsi == "PUT_A_REAL_MMSI_HERE":
                        mmsi = "244670249"

                    # Send the real telemetry straight to your React map
                    payload = {
                        "type": "LIVE_AIS_UPDATE",
                        "mmsi": mmsi,
                        "lat": report["Latitude"],
                        "lng": report["Longitude"],
                        "speed_knots": report["Sog"],
                        "heading": report["TrueHeading"]
                    }
                    
                    await frontend_ws.send_text(json.dumps(payload))
                    
    except Exception as e:
        print(f"⚠️ Stream disconnected: {e}")

@app.post("/detect")
async def detect_spill():
    return {"status": "AI endpoint placeholder active"}