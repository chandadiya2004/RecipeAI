from pydantic import BaseModel, Field
from typing import List, Optional

class RecipeRequest(BaseModel):
    dish_name: Optional[str] = Field(None, description="Name of the desired dish")
    ingredients: Optional[List[str]] = Field(None, description="List of available ingredients")
    cuisine: Optional[str] = Field(None, description="Preferred cuisine")
    dietary_restrictions: Optional[List[str]] = Field(None, description="Any dietary restrictions")
    servings: Optional[int] = Field(None, description="Desired number of servings")
    source: Optional[str] = Field(None, description="Frontend source of the request")

class IngredientItem(BaseModel):
    name: str
    quantity: str
    checked: Optional[bool] = False

class RecipeStep(BaseModel):
    number: int
    icon: str
    text: str

class RecipeResponse(BaseModel):
    id: str
    title: str
    description: str
    image: Optional[str] = None
    cuisine: str
    cuisineEmoji: str
    cookingTime: str
    difficulty: str
    servings: int
    calories: int
    healthScore: int
    tags: List[str]
    ingredients: List[IngredientItem]
    steps: List[RecipeStep]

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context: Optional[dict] = None
    source: Optional[str] = None

class ChatResponse(BaseModel):
    response: str


class ActivityHistoryItem(BaseModel):
    id: int
    activity_type: str
    endpoint: str
    status: str
    request_payload: Optional[dict] = None
    error_message: Optional[str] = None
    created_at: str


class ActivityHistoryResponse(BaseModel):
    items: List[ActivityHistoryItem]
