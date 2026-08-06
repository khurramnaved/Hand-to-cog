# =============================================
# Hand-To-Cog AI — Model Generation Script
# =============================================
import os
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
os.makedirs(MODEL_DIR, exist_ok=True)

class HandwritingFeatureExtractor(nn.Module):
    def __init__(self):
        super(HandwritingFeatureExtractor, self).__init__()
        self.conv1 = nn.Conv2d(1, 16, kernel_size=3, padding=1)
        self.pool1 = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(16, 32, kernel_size=3, padding=1)
        self.pool2 = nn.MaxPool2d(2, 2)
        self.conv3 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.pool3 = nn.MaxPool2d(2, 2)
        self.fc1 = nn.Linear(64 * 16 * 16, 128)
        self.fc2 = nn.Linear(128, 32)

    def forward(self, x):
        x = self.pool1(F.relu(self.conv1(x)))
        x = self.pool2(F.relu(self.conv2(x)))
        x = self.pool3(F.relu(self.conv3(x)))
        x = x.view(-1, 64 * 16 * 16)
        x = F.relu(self.fc1(x))
        x = self.fc2(x)
        return x

def main():
    print("Generating dummy datasets...")
    # CNN
    cnn = HandwritingFeatureExtractor()
    torch.save(cnn.state_dict(), os.path.join(MODEL_DIR, "feature_extractor.pth"))
    
    # XGBoost
    X = np.random.randn(500, 32)
    y_str = np.random.choice(["low", "medium", "high"], size=500)
    
    encoder = LabelEncoder()
    y = encoder.fit_transform(y_str)
    joblib.dump(encoder, os.path.join(MODEL_DIR, "encoder.pkl"))
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler.pkl"))
    
    model = xgb.XGBClassifier(objective='multi:softprob', num_class=3, max_depth=3)
    model.fit(X_scaled, y)
    
    # Save model.pkl (as requested by user, instead of json)
    joblib.dump(model, os.path.join(MODEL_DIR, "model.pkl"))
    
    # SHAP Explainer (We can compute SHAP values directly on inference, or save a TreeExplainer)
    import shap
    explainer = shap.TreeExplainer(model)
    joblib.dump(explainer, os.path.join(MODEL_DIR, "explainer.pkl"))
    
    print("Exported model.pkl, scaler.pkl, encoder.pkl, explainer.pkl, feature_extractor.pth")

if __name__ == "__main__":
    main()
