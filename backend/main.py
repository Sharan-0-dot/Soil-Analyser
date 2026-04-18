from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os
import uvicorn
from model_helper import load_model, predict_image

app = FastAPI()

# Enable CORS for React frontend (localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Path Logic ---
# Finds 'soil_model.pth' in the root folder relative to this backend script
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "soil_model.pth")

# Global model variable to hold the CNN in memory
model = None

@app.on_event("startup")
def startup_event():
    global model
    if not os.path.exists(MODEL_PATH):
        print(f"ERROR: Model file not found at {MODEL_PATH}")
        return
    try:
        model = load_model(MODEL_PATH)
        print(f"Model loaded successfully from {MODEL_PATH}")
    except Exception as e:
        print(f"ERROR loading model: {e}")

# --- Groq API Client Setup ---
# Using the Groq API key you provided
import os

groq_client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(
            status_code=500, 
            detail="CNN Model not initialized. Check server logs."
        )
    
    try:
        # 1. Read the uploaded image bytes
        contents = await file.read()
        
        # 2. Get prediction from local CNN (MobileNetV2)
        label, confidence = predict_image(model, contents)
        
        # 3. Formulate Prompt for Indian Farmers
        # We specify plain text only to avoid markdown formatting (** asterisks)
        prompt = (
            f"Soil Type: {label.replace('_', ' ')}\n"
            f"Confidence: {confidence:.2%}\n\n"
            "As an Indian Agriculture Expert, provide exactly 3 plain text bullet points for an Indian farmer:\n"
            "1. Best Indian crops (Kharif and Rabi seasons) suitable for this soil.\n"
            "2. Specific fertilizer recommendations common in India (e.g., Urea, DAP, NPK ratios).\n"
            "3. A simple tip for pH or moisture management specific to this soil.\n\n"
            "STRICT INSTRUCTION: Use plain text ONLY. Do NOT use bolding, asterisks (**), hashtags, or markdown headers."
        )
        
        # 4. Get Agricultural Insights from Groq (Llama-3.3)
        chat_completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system", 
                    "content": "You are a professional Indian Krishi (Agriculture) Expert. Provide clean, unformatted plain text advice. Never use markdown symbols like asterisks or hashtags."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.2  # Lower temperature for consistent, non-creative formatting
        )
        
        ai_insights = chat_completion.choices[0].message.content.strip()

        # 5. Return structured data to React
        return {
            "prediction": label.replace('_', ' '),
            "confidence": f"{confidence:.2%}",
            "insights": ai_insights
        }

    except Exception as e:
        print(f"DETAILED SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

if __name__ == "__main__":
    # Ensure uvicorn runs correctly with hot reload enabled
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)