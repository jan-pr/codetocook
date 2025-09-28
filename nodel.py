from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
import os
import json

# Configure Gemini
genai.configure(api_key=os.environ['GEMIN_API_KEY'])

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

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    # Try parsing into JSON
    try:
        recipe_json = json.loads(response.text)
    except json.JSONDecodeError:
        return {"error": "Invalid JSON response", "raw": response.text}

    return recipe_json
