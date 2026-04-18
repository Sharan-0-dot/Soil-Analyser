import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io

# Exact mapping from your folder check
CLASS_NAMES = ['Alluvial_Soil', 'Arid_Soil', 'Black_Soil', 'Laterite_Soil', 'Mountain_Soil', 'Red_Soil', 'Yellow_Soil']

device = torch.device("cpu")

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

def load_model(path):
    model = models.mobilenet_v2(weights=None)
    model.classifier[1] = nn.Linear(model.last_channel, len(CLASS_NAMES))
    model.load_state_dict(torch.load(path, map_location=device))
    model.eval()
    return model

def predict_image(model, image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_t = transform(img).unsqueeze(0).to(device)
    with torch.no_grad():
        outputs = model(img_t)
        probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
        confidence, idx = torch.max(probabilities, 0)
    return CLASS_NAMES[idx.item()], confidence.item()