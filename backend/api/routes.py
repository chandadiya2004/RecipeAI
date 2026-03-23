from fastapi import APIRouter, Depends, HTTPException, Query
from models.schemas import (
    RecipeRequest,
    RecipeResponse,
    ChatRequest,
    ChatResponse,
    ActivityHistoryResponse,
)
from services.recipe_service import generate_recipe
from services.chat_service import chat_with_ai
from services.activity_service import log_user_activity, get_user_activity_history, clear_user_activity_history
from core.content_policy import policy_warning_for_text
from core.auth import AuthenticatedUser, get_authenticated_user

router = APIRouter()


def _compact_payload(payload: dict):
    compact: dict = {}
    for key, value in payload.items():
        if value is None:
            continue
        if isinstance(value, str) and not value.strip():
            continue
        if isinstance(value, list) and len(value) == 0:
            continue
        compact[key] = value
    return compact


@router.get("/activity-history", response_model=ActivityHistoryResponse)
def activity_history_endpoint(
    limit: int = Query(default=50, ge=1, le=200),
    current_user: AuthenticatedUser = Depends(get_authenticated_user),
):
    items = get_user_activity_history(user_id=current_user.user_id, limit=limit)
    return ActivityHistoryResponse(items=items)


@router.delete("/activity-history")
def clear_activity_history_endpoint(
    current_user: AuthenticatedUser = Depends(get_authenticated_user),
):
    deleted = clear_user_activity_history(user_id=current_user.user_id)
    return {"deleted": deleted}

@router.post("/generate-recipe", response_model=RecipeResponse)
def generate_recipe_endpoint(
    request: RecipeRequest,
    current_user: AuthenticatedUser = Depends(get_authenticated_user),
):
    request_payload = _compact_payload({
        "dish_name": request.dish_name,
        "ingredients": request.ingredients,
        "cuisine": request.cuisine,
        "dietary_restrictions": request.dietary_restrictions,
        "servings": request.servings,
        "source": request.source,
    })

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
            log_user_activity(
                user_id=current_user.user_id,
                activity_type="generate_recipe",
                endpoint="/api/generate-recipe",
                status="blocked",
                request_payload=request_payload,
                error_message=warning,
            )
            raise HTTPException(status_code=400, detail=warning)

        recipe = generate_recipe(request)
        log_user_activity(
            user_id=current_user.user_id,
            activity_type="generate_recipe",
            endpoint="/api/generate-recipe",
            status="success",
            request_payload=request_payload,
        )
        return recipe
    except HTTPException as exc:
        if exc.status_code >= 500:
            log_user_activity(
                user_id=current_user.user_id,
                activity_type="generate_recipe",
                endpoint="/api/generate-recipe",
                status="failed",
                request_payload=request_payload,
                error_message=str(exc.detail),
            )
        raise
    except Exception as e:
        log_user_activity(
            user_id=current_user.user_id,
            activity_type="generate_recipe",
            endpoint="/api/generate-recipe",
            status="failed",
            request_payload=request_payload,
            error_message=str(e),
        )
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(
    request: ChatRequest,
    current_user: AuthenticatedUser = Depends(get_authenticated_user),
):
    request_payload = _compact_payload({
        "message_count": len(request.messages),
        "has_context": bool(request.context),
        "source": request.source,
    })

    try:
        combined_text = " ".join(msg.content for msg in request.messages)
        warning = policy_warning_for_text(combined_text)
        if warning:
            log_user_activity(
                user_id=current_user.user_id,
                activity_type="chat",
                endpoint="/api/chat",
                status="blocked",
                request_payload=request_payload,
                error_message=warning,
            )
            return ChatResponse(response=warning)

        chat_response = chat_with_ai(request)
        log_user_activity(
            user_id=current_user.user_id,
            activity_type="chat",
            endpoint="/api/chat",
            status="success",
            request_payload=request_payload,
        )
        return chat_response
    except HTTPException as exc:
        if exc.status_code >= 500:
            log_user_activity(
                user_id=current_user.user_id,
                activity_type="chat",
                endpoint="/api/chat",
                status="failed",
                request_payload=request_payload,
                error_message=str(exc.detail),
            )
        raise
    except Exception as e:
        log_user_activity(
            user_id=current_user.user_id,
            activity_type="chat",
            endpoint="/api/chat",
            status="failed",
            request_payload=request_payload,
            error_message=str(e),
        )
        raise HTTPException(status_code=500, detail=str(e))
