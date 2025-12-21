from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import random
import string

from app import crud, schemas, auth
from app.database import get_db

router = APIRouter()

# ============ Authentication Routes ============
@router.post("/auth/login")
async def login(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = crud.authenticate_user(db, username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="اسم المستخدم أو كلمة المرور غير صحيحة",
        )
    
    # تحديث وقت آخر تسجيل دخول
    crud.update_user_last_login(db, user.id)
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.user_name}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "user_name": user.user_name,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "organization": user.organization
        }
    }

@router.post("/auth/init_admin", response_model=schemas.User)
def init_admin(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    # التحقق من عدم وجود مستخدمين
    if crud.get_users(db):
        raise HTTPException(status_code=400, detail="المسؤول موجود بالفعل")
    
    # إنشاء المسؤول الأول
    user.role = "admin"
    return crud.create_user(db=db, user=user)

# ============ User Routes ============
@router.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(auth.get_current_active_user)):
    return current_user

@router.get("/users/", response_model=List[schemas.User])
def read_users(
    skip: int = 0,
    limit: int = 100,
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    auth.verify_permission(current_user, "admin")
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@router.post("/users/", response_model=schemas.User)
def create_user(
    user: schemas.UserCreate,
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    auth.verify_permission(current_user, "admin")
    
    db_user = crud.get_user_by_username(db, username=user.user_name)
    if db_user:
        raise HTTPException(status_code=400, detail="اسم المستخدم موجود بالفعل")
    
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="البريد الإلكتروني موجود بالفعل")
    
    return crud.create_user(db=db, user=user)

# ============ Vehicle Routes ============
@router.post("/vehicles/", response_model=schemas.Vehicle)
def create_vehicle(
    vehicle: schemas.VehicleCreate,
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    auth.verify_permission(current_user, "operator")
    
    db_vehicle = crud.get_vehicle_by_plate(db, plate_number=vehicle.plate_number)
    if db_vehicle:
        raise HTTPException(status_code=400, detail="رقم اللوحة موجود بالفعل")
    
    return crud.create_vehicle(db=db, vehicle=vehicle)

@router.get("/vehicles/", response_model=List[schemas.Vehicle])
def read_vehicles(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    if search:
        return crud.search_vehicles(db, search_term=search)
    return crud.get_vehicles(db, skip=skip, limit=limit)

@router.get("/vehicles/{vehicle_id}", response_model=schemas.Vehicle)
def read_vehicle(
    vehicle_id: int,
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    db_vehicle = crud.get_vehicle(db, vehicle_id=vehicle_id)
    if db_vehicle is None:
        raise HTTPException(status_code=404, detail="المركبة غير موجودة")
    return db_vehicle

# ============ Violation Routes ============
@router.post("/violations/", response_model=schemas.Violation)
def create_violation(
    violation: schemas.ViolationCreate,
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    auth.verify_permission(current_user, "operator")
    
    # التحقق من وجود المركبة
    vehicle = crud.get_vehicle(db, vehicle_id=violation.vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="المركبة غير موجودة")
    
    return crud.create_violation(db=db, violation=violation)

@router.get("/violations/", response_model=List[schemas.Violation])
def read_violations(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    violations = crud.get_violations(db, skip=skip, limit=limit)
    if status:
        violations = [v for v in violations if v.status == status]
    return violations

@router.post("/violations/search")
def search_violations(
    search: schemas.ViolationSearch,
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    violations = crud.search_violations(db, search)
    
    # محاكاة البيانات إذا لم توجد في قاعدة البيانات
    if not violations:
        mock_data = [
            {
                "id": 1,
                "violation_number": "TRF202400123",
                "vehicle_plate": "ك أ ب 1234",
                "violation_type": "تجاوز الإشارة الحمراء",
                "location": "تقاطع الملك فهد مع الأمير محمد",
                "amount": 300,
                "status": "غير مدفوعة",
                "violation_date": datetime.now() - timedelta(days=5)
            },
            {
                "id": 2,
                "violation_number": "TRF202400124",
                "vehicle_plate": "ك أ ب 1234",
                "violation_type": "تجاوز السرعة المحددة",
                "location": "طريق الملك فهد - الرياض",
                "amount": 500,
                "status": "غير مدفوعة",
                "violation_date": datetime.now() - timedelta(days=10)
            }
        ]
        return mock_data
    
    return violations

@router.patch("/violations/{violation_id}/status")
def update_violation_status(
    violation_id: int,
    status: str,
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    auth.verify_permission(current_user, "operator")
    
    violation = crud.update_violation_status(db, violation_id=violation_id, status=status)
    if not violation:
        raise HTTPException(status_code=404, detail="المخالفة غير موجودة")
    
    return {"message": "تم تحديث حالة المخالفة بنجاح", "violation": violation}

# ============ Camera Routes ============
@router.get("/cameras/", response_model=List[schemas.Camera])
def read_cameras(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    cameras = crud.get_cameras(db, skip=skip, limit=limit)
    if status:
        cameras = [c for c in cameras if c.status == status]
    return cameras

@router.get("/cameras/stats")
def get_camera_stats(
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    total = crud.count_cameras(db)
    active = crud.count_active_cameras(db)
    
    return {
        "total": total,
        "active": active,
        "monitoring": random.randint(5, 15) if total > 0 else 0,
        "alerts": random.randint(1, 10) if total > 0 else 0
    }

@router.get("/cameras/live")
def get_live_cameras(
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    # محاكاة بيانات الكاميرات الحية
    cameras = [
        {
            "id": 1,
            "name": "تقاطع الكبري",
            "location": "شارع ال60",
            "status": "danger",
            "live": True,
            "traffic": "🚗🚗 ازدحام عالي",
            "last_active": datetime.now()
        },
        {
            "id": 2,
            "name": "طريق المطار",
            "location": "طريق المطار السريع",
            "status": "warning",
            "live": True,
            "traffic": "🚙 حركة متوسطة",
            "last_active": datetime.now() - timedelta(minutes=5)
        },
        {
            "id": 3,
            "name": "شارع النيل",
            "location": "وسط المدينة",
            "status": "offline",
            "live": False,
            "traffic": "❌ الكاميرا غير متصلة",
            "last_active": datetime.now() - timedelta(hours=2)
        }
    ]
    
    # محاولة جلب من قاعدة البيانات
    db_cameras = crud.get_active_cameras(db)
    if db_cameras:
        cameras = []
        for cam in db_cameras[:3]:
            cameras.append({
                "id": cam.id,
                "name": cam.name,
                "location": cam.location,
                "status": "danger" if "كبري" in cam.name else "warning" if "مطار" in cam.name else "normal",
                "live": True if cam.status == "نشطة" else False,
                "traffic": "🚗🚗 ازدحام عالي" if "كبري" in cam.name else "🚙 حركة متوسطة",
                "last_active": cam.last_active
            })
    
    return cameras

# ============ Patrol Routes ============
@router.get("/patrols/", response_model=List[schemas.Patrol])
def read_patrols(
    skip: int = 0,
    limit: int = 100,
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return crud.get_patrols(db, skip=skip, limit=limit)

@router.post("/patrols/", response_model=schemas.Patrol)
def create_patrol(
    patrol: schemas.PatrolCreate,
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    auth.verify_permission(current_user, "admin")
    return crud.create_patrol(db=db, patrol=patrol)

# ============ Inspection Point Routes ============
@router.get("/inspection/points", response_model=List[schemas.InspectionPoint])
def read_inspection_points(
    skip: int = 0,
    limit: int = 100,
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return crud.get_inspection_points(db, skip=skip, limit=limit)

@router.get("/inspection/stats")
def get_inspection_stats(
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    points = crud.get_inspection_points(db)
    
    active = len([p for p in points if p.status == "نشط"])
    busy = len([p for p in points if p.status == "مزدحم"])
    danger = len([p for p in points if p.traffic_level == "مرتفع"])
    
    return {
        "total": len(points),
        "active": active,
        "busy": busy,
        "danger": danger,
        "peak_prediction": "⏱ خلال 45 دقيقة"
    }

# ============ Analysis Routes ============
@router.get("/analysis/daily")
def get_daily_analysis(
    days: int = 7,
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return crud.get_daily_analysis(db, days)

@router.get("/analysis/types")
def get_violation_types_analysis(
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return crud.get_violation_types_analysis(db)

@router.get("/analysis/time-ranges")
def get_time_ranges_analysis():
    # محاكاة بيانات التحليل حسب الوقت
    return {
        "اليوم": {
            "timeline": [12, 18, 22, 30, 28, 35],
            "types": {"سرعة": 45, "إشارة": 30, "ركن": 25}
        },
        "آخر 7 أيام": {
            "timeline": [60, 80, 90, 110, 100, 130],
            "types": {"سرعة": 50, "إشارة": 35, "ركن": 15}
        },
        "آخر شهر": {
            "timeline": [200, 240, 260, 300, 320, 350],
            "types": {"سرعة": 55, "إشارة": 25, "ركن": 20}
        }
    }

# ============ Payment Routes ============
@router.post("/payments/")
def create_payment(
    violation_id: int,
    payment_method: str,
    card_holder: str,
    card_number: str,
    card_expiry: str,
    card_cvc: str,
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    # التحقق من وجود المخالفة
    violation = crud.get_violation(db, violation_id)
    if not violation:
        raise HTTPException(status_code=404, detail="المخالفة غير موجودة")
    
    # إنشاء معاملة دفع
    transaction_id = f"TXN{datetime.now().strftime('%Y%m%d%H%M%S')}{random.randint(1000, 9999)}"
    
    payment_data = schemas.PaymentCreate(
        violation_id=violation_id,
        amount=violation.amount,
        payment_method=payment_method,
        transaction_id=transaction_id,
        status="ناجح",
        card_last_four=card_number[-4:] if len(card_number) >= 4 else "0000"
    )
    
    payment = crud.create_payment(db, payment_data)
    
    return {
        "message": "تمت عملية الدفع بنجاح",
        "payment": payment,
        "receipt": {
            "number": transaction_id,
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "amount": violation.amount,
            "violation_type": violation.violation_type
        }
    }

# ============ Dashboard Routes ============
@router.get("/dashboard/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return crud.get_dashboard_stats(db)

@router.get("/dashboard/kpis")
def get_dashboard_kpis(
    current_user: schemas.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    stats = crud.get_dashboard_stats(db)
    
    return [
        {"title": "عدد المركبات اليوم", "value": stats["total_vehicles"], "icon": "🚗"},
        {"title": "مخالفات اليوم", "value": stats["today_violations"], "icon": "⚠"},
        {"title": "الحالات الحرجة", "value": random.randint(1, 10), "icon": "🔴"},
        {"title": "عدد المستخدمين", "value": stats["total_users"], "icon": "👥"}
    ]

# ============ Map Routes ============
@router.get("/map/zones")
def get_map_zones(
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    zones = [
        {"id": 1, "name": "طريق60د", "risk": "عالي", "count": 150, "type": "high"},
        {"id": 2, "name": "  الجمهوريه ", "risk": "متوسط", "count": 90, "type": "medium"},
        {"id": 3, "name": "شارع  مدنية", "risk": "منخفض", "count": 45, "type": "low"},
        {"id": 4, "name": "تقاطع الكبري", "risk": "عالي", "count": 180, "type": "high"},
        {"id": 5, "name": "طريق المطار", "risk": "متوسط", "count": 75, "type": "medium"}
    ]
    
    return zones

@router.get("/map/ai-insights")
def get_ai_insights(
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    insights = [
        "🚨 رصد ازدحام غير طبيعي عند تقاطع الكبري",
        "📈 احتمالية مخالفة سرعة خلال 30 دقيقة",
        "🛑 اقتراح تفعيل نقطة تفتيش قريبة",
        "🚔 زيادة الدوريات في طريق الملك فهد"
    ]
    
    return insights

# ============ Settings Routes ============
@router.get("/settings/permissions")
def get_permissions(
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    permissions = {
        "admin": ["*"],
        "supervisor": ["view_dashboard", "view_cameras", "view_violations", "edit_violations"],
        "operator": ["view_dashboard", "add_vehicles", "view_violations"]
    }
    
    return permissions

@router.post("/settings/save")
def save_settings(
    settings: dict,
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    # هنا يمكنك حفظ الإعدادات في قاعدة البيانات
    return {"message": "تم حفظ الإعدادات بنجاح", "settings": settings}

# ============ Health Check ============
@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1")
        return {
            "status": "healthy",
            "database": "connected",
            "version": "1.0.0",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
