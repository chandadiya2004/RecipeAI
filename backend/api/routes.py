from fastapi import APIRouter, HTTPException
from models.schemas import RecipeRequest, RecipeResponse, ChatRequest, ChatResponse
from services.recipe_service import generate_recipe
from services.chat_service import chat_with_ai
from core.content_policy import policy_warning_for_text

router = APIRouter()

@router.post("/generate-recipe", response_model=RecipeResponse)
def generate_recipe_endpoint(request: RecipeRequest):
    try:
        combined_text = " ".join(
            [
                request.dish_name or "",
                " ".join(request.ingredients or []),
                request.cuisine or "",
                " ".join(request.dietary_restrictions or []),
            ]
        )

        warning = policy_warning_for_text(combined_text)
        if warning:
            raise HTTPException(status_code=400, detail=warning)

        recipe = generate_recipe(request)
        return recipe
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    try:
        combined_text = " ".join(msg.content for msg in request.messages)
        warning = policy_warning_for_text(combined_text)
        if warning:
            return ChatResponse(response=warning)

        chat_response = chat_with_ai(request)
        return chat_response
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
