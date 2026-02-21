import torch
import torchvision.transforms as transforms
from torchvision.models import resnet50, ResNet50_Weights

# 🚀 Hardware Optimization: Automatically utilize Apple Silicon (Metal Performance Shaders) 
# for massive speed boosts during inference, falling back to CPU if necessary.
device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
print(f"🧠 AI Engine initializing on: {device}")

# Load a pre-trained ResNet50 model
model = resnet50(weights=ResNet50_Weights.DEFAULT)
model.to(device)
model.eval() # Set to evaluation mode (no training)

# Standard medical image preprocessing pipeline
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])
