import asyncio
import websockets
import json

async def track_vessels():
    # We are using Open Waters AIS, which is a free, open-source stream
    uri = "wss://ais.openwaters.io/v1/stream"
    
    # We define a bounding box (e.g., the English Channel / North Sea area)
    # Format: [[[Lat_SW, Lon_SW], [Lat_NE, Lon_NE]]]
    subscription_payload = {
        "APIKey": "anonymous", # Open Waters allows anonymous connections for testing
        "BoundingBoxes": [[[50.0, 0.0], [54.0, 5.0]]], 
        "FilterMessageTypes": ["PositionReport", "ShipStaticData"]
    }

    print("Connecting to live AIS satellite stream...")
    
    async with websockets.connect(uri) as websocket:
        # 1. Send the subscription request
        await websocket.send(json.dumps(subscription_payload))
        print("Subscribed! Waiting for vessels...\n")
        
        # 2. Listen continuously for vessel updates
        try:
            while True:
                message = await websocket.recv()
                data = json.loads(message)
                
                msg_type = data.get("MessageType")
                msg_data = data.get("Message", {}).get(msg_type, {})
                
                if msg_type == "PositionReport":
                    mmsi = msg_data.get("UserID")
                    lat = msg_data.get("Latitude")
                    lon = msg_data.get("Longitude")
                    speed = msg_data.get("Sog", 0) # Speed over ground
                    print(f"🚢 [MMSI: {mmsi}] moved to {lat:.4f}, {lon:.4f} at {speed} knots")
                    
        except websockets.exceptions.ConnectionClosed:
            print("Connection closed by server.")

if __name__ == "__main__":
    asyncio.run(track_vessels())