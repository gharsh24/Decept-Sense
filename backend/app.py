from fastapi import FastAPI,HTTPException,Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from joblib import load
import numpy as np
from typing import List 
from fastapi.responses import JSONResponse
import csv

app = FastAPI()
# # Load the trained SVM model, TF-IDF vectorizer, and LabelEncoder

loaded_model = load('./svm_model.joblib')
loaded_vectorizer = load('./tfidf_vectorizer.joblib')
label_encoder = load('./label_encoder.joblib')

class PredictionRequest(BaseModel):
    texts: List[str]


# ... (omitted loading of model, vectorizer, and label encoder)


class PredictionResponse(BaseModel):
    predicted_categories: List[str]

# Configure CORS to allow requests from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You might want to replace "*" with a specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")  # root path
def read_root():
    return {"Hello": "World"}

@app.post("/predict")
async def predict_category(request: PredictionRequest):
    try:
        # Transform the input texts using the loaded TF-IDF vectorizer
        input_tfidf = loaded_vectorizer.transform(request.texts)

        # Make predictions using the loaded SVM model
        predictions = loaded_model.predict(input_tfidf)

        # Convert the predictions to readable category labels using the LabelEncoder
        predicted_categories = label_encoder.inverse_transform(predictions)

        return {"predicted_categories": predicted_categories.tolist()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/submit_report")
async def submit_report(report_data: dict):
    try:
        # Extracting data from the JSON payload
        category = report_data["category"]
        name = report_data["name"]
        if(category == "" or name == ""):
            raise KeyError("category or name")
        
        # Your existing code for CSV writing and dummy response
        report_data = {
            "text": name,
            "Pattern Category": category,
        }

        with open("dataset3.csv", mode="a", newline="") as csv_file:
            fieldnames = ["text", "Pattern Category"]
            writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

            # Write header if the file is empty
            if csv_file.tell() == 0:
                writer.writeheader()

            # Write data to a new line in the CSV file
            writer.writerow(report_data)

        dummy_response = {"result": "Report submitted successfully"}

        return JSONResponse(content=dummy_response, status_code=200)
    except KeyError as e:
        raise HTTPException(status_code=422, detail=f"Missing required field: {e}")