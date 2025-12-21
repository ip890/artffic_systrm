from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext
from datetime import datetime, date, timedelta
import random
import string

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ============ User CRUD ============
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.user_name == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password_hash)
    db_user = models.User(
        full_name=user.full_name,
        user_name=user.user_name,
        email=user.email,
        phone=user.phone,
        organization=user.organization,
        role=user.role,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return False
    if not pwd_context.verify(password, user.password_hash):
        return False
    return user

def update_user_last_login(db: Session, user_id: int):
    user = get_user(db, user_id)
    if user:
        user.last_login = datetime.utcnow()
        db.commit()
        db.refresh(user)
    return user

# ============ Vehicle CRUD ============
def get_vehicle(db: Session, vehicle_id: int):
    return db.query(models.Vehicle).filter(models.Vehicle.id == vehicle_id).first()

def get_vehicle_by_plate(db: Session, plate_number: str):
    return db.query(models.Vehicle).filter(models.Vehicle.plate_number == plate_number).first()

def get_vehicles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Vehicle).offset(skip).limit(limit).all()

def create_vehicle(db: Session, vehicle: schemas.VehicleCreate):
    db_vehicle = models.Vehicle(**vehicle.dict())
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

def search_vehicles(db: Session, search_term: str):
    return db.query(models.Vehicle).filter(
        (models.Vehicle.plate_number.contains(search_term)) |
        (models.Vehicle.owner_name.contains(search_term)) |
        (models.Vehicle.owner_id.contains(search_term)) |
        (models.Vehicle.model.contains(search_term))
    ).all()

def count_vehicles(db: Session):
    return db.query(models.Vehicle).count()

# ============ Violation CRUD ============
def get_violation(db: Session, violation_id: int):
    return db.query(models.Violation).filter(models.Violation.id == violation_id).first()

def get_violation_by_number(db: Session, violation_number: str):
    return db.query(models.Violation).filter(models.Violation.violation_number == violation_number).first()

def get_violations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Violation).offset(skip).limit(limit).all()

def get_violations_by_vehicle(db: Session, vehicle_id: int):
    return db.query(models.Violation).filter(models.Violation.vehicle_id == vehicle_id).all()

def create_violation(db: Session, violation: schemas.ViolationCreate):
    # إنشاء رقم مخالفة عشوائي
    violation_number = f"TRF{datetime.now().strftime('%Y%m%d')}{random.randint(1000, 9999)}"
    
    db_violation = models.Violation(
        violation_number=violation_number,
        **violation.dict()
    )
    db.add(db_violation)
    db.commit()
    db.refresh(db_violation)
    return db_violation

def update_violation_status(db: Session, violation_id: int, status: str):
    violation = get_violation(db, violation_id)
    if violation:
        violation.status = status
        if status == "مدفوعة":
            violation.paid_at = datetime.utcnow()
        db.commit()
        db.refresh(violation)
    return violation

def search_violations(db: Session, search: schemas.ViolationSearch):
    query = db.query(models.Violation)
    
    if search.violation_number:
        query = query.filter(models.Violation.violation_number == search.violation_number)
    
    if search.vehicle_plate:
        query = query.filter(models.Violation.vehicle_plate.contains(search.vehicle_plate))
    
    return query.all()

def count_violations(db: Session, date_filter: date = None):
    query = db.query(models.Violation)
    if date_filter:
        query = query.filter(models.Violation.violation_date >= date_filter)
    return query.count()

def count_unpaid_violations(db: Session):
    return db.query(models.Violation).filter(models.Violation.status == "غير مدفوعة").count()

# ============ Camera CRUD ============
def get_camera(db: Session, camera_id: int):
    return db.query(models.Camera).filter(models.Camera.id == camera_id).first()

def get_cameras(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Camera).offset(skip).limit(limit).all()

def get_active_cameras(db: Session):
    return db.query(models.Camera).filter(models.Camera.status == "نشطة").all()

def create_camera(db: Session, camera: schemas.CameraCreate):
    db_camera = models.Camera(**camera.dict())
    db.add(db_camera)
    db.commit()
    db.refresh(db_camera)
    return db_camera

def update_camera_status(db: Session, camera_id: int, status: str):
    camera = get_camera(db, camera_id)
    if camera:
        camera.status = status
        camera.last_active = datetime.utcnow()
        db.commit()
        db.refresh(camera)
    return camera

def count_cameras(db: Session):
    return db.query(models.Camera).count()

def count_active_cameras(db: Session):
    return db.query(models.Camera).filter(models.Camera.status == "نشطة").count()

# ============ Patrol CRUD ============
def get_patrol(db: Session, patrol_id: int):
    return db.query(models.Patrol).filter(models.Patrol.id == patrol_id).first()

def get_patrols(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Patrol).offset(skip).limit(limit).all()

def get_active_patrols(db: Session):
    return db.query(models.Patrol).filter(models.Patrol.status == "نشطة").all()

def create_patrol(db: Session, patrol: schemas.PatrolCreate):
    db_patrol = models.Patrol(**patrol.dict())
    db.add(db_patrol)
    db.commit()
    db.refresh(db_patrol)
    return db_patrol

def count_patrols(db: Session):
    return db.query(models.Patrol).count()

def count_active_patrols(db: Session):
    return db.query(models.Patrol).filter(models.Patrol.status == "نشطة").count()

# ============ Inspection Point CRUD ============
def get_inspection_point(db: Session, point_id: int):
    return db.query(models.InspectionPoint).filter(models.InspectionPoint.id == point_id).first()

def get_inspection_points(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.InspectionPoint).offset(skip).limit(limit).all()

def create_inspection_point(db: Session, point: schemas.InspectionPointCreate):
    db_point = models.InspectionPoint(**point.dict())
    db.add(db_point)
    db.commit()
    db.refresh(db_point)
    return db_point

# ============ Payment CRUD ============
def get_payment(db: Session, payment_id: int):
    return db.query(models.Payment).filter(models.Payment.id == payment_id).first()

def get_payments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Payment).offset(skip).limit(limit).all()

def create_payment(db: Session, payment: schemas.PaymentCreate):
    db_payment = models.Payment(**payment.dict())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    
    # تحديث حالة المخالفة
    violation = get_violation(db, payment.violation_id)
    if violation:
        violation.status = "مدفوعة"
        violation.paid_at = datetime.utcnow()
        db.commit()
    
    return db_payment

# ============ Statistics CRUD ============
def get_today_statistics(db: Session):
    today = date.today()
    return db.query(models.Statistics).filter(models.Statistics.date == today).first()

def create_statistics(db: Session, stats: schemas.StatisticsCreate):
    db_stats = models.Statistics(**stats.dict())
    db.add(db_stats)
    db.commit()
    db.refresh(db_stats)
    return db_stats

def get_dashboard_stats(db: Session):
    return {
        "total_vehicles": count_vehicles(db),
        "total_violations": count_violations(db),
        "total_cameras": count_cameras(db),
        "total_users": db.query(models.User).count(),
        "today_violations": count_violations(db, date.today()),
        "active_cameras": count_active_cameras(db),
        "active_patrols": count_active_patrols(db),
        "unpaid_violations": count_unpaid_violations(db)
    }

# ============ Analysis CRUD ============
def get_daily_analysis(db: Session, days: int = 7):
    end_date = date.today()
    start_date = end_date - timedelta(days=days)
    
    # محاكاة بيانات التحليل
    analysis_data = []
    for i in range(days):
        current_date = start_date + timedelta(days=i)
        violations_count = db.query(models.Violation).filter(
            models.Violation.violation_date >= current_date,
            models.Violation.violation_date < current_date + timedelta(days=1)
        ).count()
        
        analysis_data.append({
            "date": current_date.strftime("%Y-%m-%d"),
            "violations": violations_count,
            "vehicles": random.randint(300, 500)
        })
    
    return analysis_data

def get_violation_types_analysis(db: Session):
    # محاكاة بيانات أنواع المخالفات
    return [
        {"type": "السرعة", "count": 45},
        {"type": "تجاوز الإشارة", "count": 30},
        {"type": "ركن خاطئ", "count": 25},
        {"type": "حزام الأمان", "count": 20},
        {"type": "هاتف أثناء القيادة", "count": 15}
    ]

