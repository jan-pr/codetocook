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
        You are a world-class professional chef and AI recipe assistant.

        ### Task
        The user will provide a list of ingredients.
        Generate ONE recipe using **only these ingredients**. 
        If the ingredients are insufficient for a valid recipe, return a JSON with an "error" key explaining why.

        ### Rules
        1. Use only the ingredients provided. Do not invent or add extra ingredients.
        2. Respond strictly in valid JSON. No extra text, explanations, or markdown.
        3. Ensure the JSON is valid and can be parsed by Python's `json.loads` without modification.
        4. Steps should be clear, concise, and in logical order.
        5. Prep and cook times should be realistic.
        6. Servings must be a positive integer.

        ### JSON Schema
        {{
        "dish_name": "string",
        "ingredients": ["string"],
        "steps": ["string"],
        "prep_time": "string",
        "cook_time": "string",
        "servings": integer
        }}

        ### Example
        Ingredients: tomato, onion, garlic, olive oil
        Response:
        {{
        "dish_name": "Garlic Tomato Pasta",
        "ingredients": ["tomato", "onion", "garlic", "olive oil"],
        "steps": [
            "Chop onion and garlic.",
            "Sauté in olive oil until golden.",
            "Add chopped tomato and cook until soft.",
            "Toss with cooked pasta and serve."
        ],
        "prep_time": "10 min",
        "cook_time": "20 min",
        "servings": 2
        }}

        ### Input Ingredients
        {request.ingredients}
        """


    model = genai.GenerativeModel("models/gemini-2.5-flash")

    response = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"}
    )

    recipe_json = json.loads(response.text)


    return recipe_json
