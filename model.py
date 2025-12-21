from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, Date, Time, JSON
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
   __tablename__= "users"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(200))
    user_name = Column(String(100), unique=True, index=True)
    email = Column(String(200), unique=True, index=True)
    phone = Column(String(20))
    organization = Column(String(200))
    role = Column(String(50))  # admin, supervisor, operator
    password_hash = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

class Vehicle(Base):
    __tablename__ = "vehicles"
    
    id = Column(Integer, primary_key=True, index=True)
    plate_number = Column(String(50), unique=True, index=True)
    vehicle_type = Column(String(100))
    owner_name = Column(String(200))
    owner_id = Column(String(50))
    model = Column(String(100))
    color = Column(String(50))
    year = Column(Integer)
    license_status = Column(String(50), default="سارية")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Violation(Base):
    __tablename__ = "violations"
    
    id = Column(Integer, primary_key=True, index=True)
    violation_number = Column(String(100), unique=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    vehicle_plate = Column(String(50))
    violation_type = Column(String(100))
    location = Column(String(200))
    amount = Column(Float)
    description = Column(Text)
    status = Column(String(50), default="غير مدفوعة")  # غير مدفوعة، مدفوعة، ملغاة
    violation_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    paid_at = Column(DateTime, nullable=True)
    
    vehicle = relationship("Vehicle")

class Camera(Base):
    __tablename__ = "cameras"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200))
    location = Column(String(200))
    status = Column(String(50))  # نشطة، غير نشطة، تحت الصيانة
    camera_type = Column(String(100))
    ip_address = Column(String(50))
    last_active = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class Patrol(Base):
    __tablename__ = "patrols"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    officers = Column(String(200))
    location = Column(String(200))
    status = Column(String(50))  # نشطة، غير نشطة
    vehicle_number = Column(String(50))
    last_update = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class InspectionPoint(Base):
    __tablename__ = "inspection_points"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200))
    location = Column(String(200))
    status = Column(String(50))  # نشط، مزدحم، مغلق
    officer_in_charge = Column(String(200))
    traffic_level = Column(String(50))  # منخفض، متوسط، مرتفع
    last_inspection = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class File(Base):
    __tablename__ = "files"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255))
    file_type = Column(String(50))
    size = Column(Integer)
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    category = Column(String(100))
    
    user = relationship("User")

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    violation_id = Column(Integer, ForeignKey("violations.id"))
    amount = Column(Float)
    payment_method = Column(String(100))
    transaction_id = Column(String(200), unique=True)
    status = Column(String(50))  # ناجح، فاشل، معلق
    card_last_four = Column(String(4))
    paid_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    violation = relationship("Violation")

class Statistics(Base):
    __tablename__ = "statistics"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    total_vehicles = Column(Integer, default=0)
    total_violations = Column(Integer, default=0)
    total_cameras = Column(Integer, default=0)
    total_patrols = Column(Integer, default=0)
    total_users = Column(Integer, default=0)
    active_cameras = Column(Integer, default=0)
    active_patrols = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class TrafficAnalysis(Base):
    __tablename__ = "traffic_analysis"
    
    id = Column(Integer, primary_key=True, index=True)
    location = Column(String(200))
    analysis_date = Column(Date)
    hour = Column(Integer)
    traffic_level = Column(String(50))  # منخفض، متوسط، مرتفع
    violation_count = Column(Integer, default=0)
    prediction = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)

class Setting(Base):
    _tablename__ = "settings"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, index=True)
    value = Column(Text)
    category = Column(String(100))
    description = Column(Text)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    alert_type = Column(String(100))
    location = Column(String(200))
    message = Column(Text)
    priority = Column(String(50))  # منخفض، متوسط، مرتفع
    status = Column(String(50), default="جديد")
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
