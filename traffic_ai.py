# app/ai/traffic_ai.py

def analyze_traffic(data: dict):
    """
    MVP AI 
    """
    vehicle_count = data.get("vehicle_count", 0)
    accidents = data.get("accidents", 0)
    speed_avg = data.get("avg_speed", 60)

    risk = "low"
    recommendation = "لا يوجد إجراء"

    if vehicle_count > 50 or speed_avg < 30:
        risk = "medium"
        recommendation = "مراقبة الموقع"

    if accidents > 0 or vehicle_count > 80:
        risk = "high"
        recommendation = "إرسال دورية + تنبيه"

    return {
        "risk_level": risk,
        "recommendation": recommendation,
        "summary": f"عدد المركبات {vehicle_count} | متوسط السرعة {speed_avg}"
    }
