import io
import torch
import torch.nn.functional as F
from PIL import Image
from torchvision import models, transforms

device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
print(f"🧠 Loading Clinical AI Engine on: {device}")

# 1. Load the customized checkpoint
checkpoint_path = "mediflow_lungs_best.pth"
checkpoint = torch.load(checkpoint_path, map_location=device)
CLASSES = checkpoint['class_names'] # Automatically pulls ['NORMAL', 'PNEUMONIA']

# 2. Rebuild the EfficientNet-B0 architecture
model = models.efficientnet_b0(weights=None)
num_ftrs = model.classifier[1].in_features
model.classifier[1] = torch.nn.Linear(num_ftrs, len(CLASSES))

# 3. Inject the trained brain
model.load_state_dict(checkpoint['state_dict'])
model.to(device)
model.eval()

# 4. Standard Medical Image Preprocessing
preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def analyze_xray(image_bytes: bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        input_tensor = preprocess(image).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(input_tensor)
            probabilities = F.softmax(outputs, dim=1)[0]
        
        max_prob, predicted_idx = torch.max(probabilities, 0)
        
        # Format the output perfectly for the React UI
        mapped_class = CLASSES[predicted_idx.item()]
        confidence = round(float(max_prob.item()), 4)

        return {
            "prediction": mapped_class,
            "confidence": confidence,
            "disclaimer": "AI-assisted preliminary reading. Clinical correlation required."
        }
        
    except Exception as e:
        return {"error": f"Image processing failed: {str(e)}"}