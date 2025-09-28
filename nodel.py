from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
import os
import json
import re
from dotenv import load_dotenv
load_dotenv()


# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

class IngredientsRequest(BaseModel):
    ingredients: str

@app.post("/generate-recipe")
async def generate_recipe(request: IngredientsRequest):

    prompt = f"""
    You are a recipe generator AI. The user will give ingredients.

    Generate a recipe using ONLY these ingredients: {request.ingredients}.
    Respond ONLY in valid JSON. No extra text.

    JSON schema:
    {{
      "dish_name": "string",
      "ingredients": ["string"],
      "steps": ["string"],
      "prep_time": "string",
      "cook_time": "string",
      "servings": "integer"
    }}
    """

    model = genai.GenerativeModel("models/gemini-2.5-flash")

    response = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"}
    )

    recipe_json = json.loads(response.text)


    return recipe_json
