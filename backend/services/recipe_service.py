import json
import uuid
from groq import Groq
from core.config import settings
from models.schemas import RecipeRequest, RecipeResponse

client = Groq(api_key=settings.GROQ_API_KEY)

def generate_recipe(request: RecipeRequest) -> RecipeResponse:
    has_ingredients = bool(request.ingredients and len(request.ingredients) > 0)

    if has_ingredients:
        ingredient_rule = (
            "CRITICAL INGREDIENT RULE: The user has provided their own ingredients. "
            "You MUST build the recipe primarily around those exact ingredients. "
            "You may ONLY add up to 2-3 minimal pantry staples (e.g. salt, oil, water, pepper) if absolutely necessary. "
            "Do NOT add significant new ingredients (meats, vegetables, dairy, grains, sauces) that the user did not provide. "
        )
    else:
        ingredient_rule = "The user has requested a specific dish. Generate a complete authentic recipe with all necessary ingredients. "

    system_prompt = (
        "You are an expert master chef AI. Generate an incredibly detailed and authentic recipe based on the user's request. "
        + ingredient_rule +
        "You MUST provide a very rich context: write an appealing, comprehensive 2-3 sentence description detailing the flavor profile. "
        "Include meticulous step-by-step instructions with precise timings. Ensure exact, realistic measurements for all ingredients. "
        "Provide accurate estimates for calories, health score (0-100), and cooking time.\n"
        "You MUST strictly format your response as a valid JSON object matching this schema exactly:\n"
        "{\n"
        '  "id": "unique-id-string",\n'
        '  "title": "Recipe Title",\n'
        '  "description": "Rich, multi-sentence appetizing description detailing flavor profile and origins.",\n'
        '  "cuisine": "Indian",\n'
        '  "cuisineEmoji": "🍛",\n'
        '  "cookingTime": "30 min",\n'
        '  "difficulty": "Easy",\n'
        '  "servings": 2,\n'
        '  "calories": 450,\n'
        '  "healthScore": 85,\n'
        '  "tags": ["High Protein", "Quick"],\n'
        '  "ingredients": [{"name": "Chicken Breast", "quantity": "400g"}],\n'
        '  "steps": [{"number": 1, "icon": "🔥", "text": "Begin by properly seasoning the chicken..."}]\n'
        "}\n"
        "Return ONLY the JSON object, with no markdown formatting or extra text."
    )

    user_prompt = ""
    if request.dish_name:
        user_prompt += f"Dish desired: {request.dish_name}. "
    if request.ingredients:
        user_prompt += f"I have these ingredients available: {', '.join(request.ingredients)}. Use these as the primary ingredients. "
    if request.cuisine:
        user_prompt += f"Make it {request.cuisine} style. "
    if request.difficulty:
        user_prompt += (
            f"Preferred difficulty level: {request.difficulty}. "
            "Adjust complexity, techniques, and instruction detail to match this level. "
        )
    if request.servings:
        user_prompt += f"Desired servings: {request.servings}. "
    if request.dietary_restrictions:
        user_prompt += f"Restrictions: {', '.join(request.dietary_restrictions)}. "

    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"}
    )

    content = response.choices[0].message.content
    if not content:
        raise ValueError("Groq returned an empty response")
    
    parsed_json = json.loads(content)
    parsed_json['id'] = str(uuid.uuid4()) # override ID to guarantee uniqueness 
    
    # Inject Dynamic Image via Pollinations.ai
    import urllib.parse
    img_prompt = f"Delicious {parsed_json['title']} food photography, cinematic, 4k, highly detailed, dramatic lighting"
    parsed_json['image'] = f"https://image.pollinations.ai/prompt/{urllib.parse.quote(img_prompt)}?width=800&height=600&nologo=true"
    
    return RecipeResponse(**parsed_json)
