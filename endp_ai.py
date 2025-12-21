from fastapi import APIRouter
from app.ai.traffic_ai import analyze_traffic

router = APIRouter(prefix="/api/ai", tags=["AI"])

@router.post("/analyze")
def ai_analyze(data: dict):
    return analyze_traffic(data)