from fastapi import FastAPI, UploadFile, File
import tensorflow as tf
import numpy as np
import cv2
import io

app = FastAPI()

print("Loading U-Net SAR Segmentation Model...")
model = tf.keras.models.load_model('unet_oilspill.h5', compile=False)
print("Model loaded successfully!")

# Define the exact image size the U-Net expects
IMG_SIZE = 512

def preprocess_image(image_bytes):
    # 1. Convert bytes to a numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    # 2. Decode the image into grayscale (SAR is single-channel)
    img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    # 3. Resize to 512x512
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    # 4. Normalize pixel values to be between 0 and 1
    img = img / 255.0
    # 5. Expand dimensions to match the model's expected input shape (Batch, Height, Width, Channels)
    img = np.expand_dims(img, axis=-1)
    img = np.expand_dims(img, axis=0)
    return img

@app.get("/")
def read_root():
    return {"status": "MARIN-TRACE API Active", "model": "U-Net Loaded"}

@app.post("/predict")
async def predict_spill(file: UploadFile = File(...)):
    # Read the image file from the request
    image_data = await file.read()
    
    # Preprocess it
    processed_img = preprocess_image(image_data)
    
    # Run the U-Net prediction
    prediction_mask = model.predict(processed_img)
    
    # For now, let's just return a success message and a mock confidence score
    # Later, we will translate this mask into a GeoJSON polygon
    return {
        "status": "success", 
        "message": "Spill segmented successfully",
        "mock_confidence": 91.4,
        "filename": file.filename
    }