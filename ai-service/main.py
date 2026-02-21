from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from predict import analyze_xray

app = FastAPI(title="MediFlow Vision AI", version="1.0")

# Allow your Node.js server to talk to this Python server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/vision/analyze")
async def analyze_image_endpoint(file: UploadFile = File(...)):
    # Security: Verify file type
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Only JPEG and PNG images are supported.")
    
    # Read the file strictly into memory (No hard drive saving!)
    image_bytes = await file.read()
    
    # Pass to PyTorch
    result = analyze_xray(image_bytes)
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
        
    return result