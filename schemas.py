from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional, List

# User Schemas
class UserBase(BaseModel):
    full_name: str
    user_name: str
    email: EmailStr
    phone: str
    organization: str
    role: str

class UserCreate(UserBase):
    password_hash: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Vehicle Schemas
class VehicleBase(BaseModel):
    plate_number: str
    vehicle_type: str
    owner_name: str
    owner_id: str
    model: str
    color: str
    year: int
    license_status: Optional[str] = "سارية"

class VehicleCreate(VehicleBase):
    pass

class Vehicle(VehicleBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Violation Schemas
class ViolationBase(BaseModel):
    vehicle_id: int
    vehicle_plate: str
    violation_type: str
    location: str
    amount: float
    description: Optional[str] = None
    status: Optional[str] = "غير مدفوعة"
    violation_date: datetime

class ViolationCreate(ViolationBase):
    pass

class Violation(ViolationBase):
    id: int
    violation_number: str
    created_at: datetime
    paid_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Camera Schemas
class CameraBase(BaseModel):
    name: str
    location: str
    status: str
    camera_type: Optional[str] = None
    ip_address: Optional[str] = None

class CameraCreate(CameraBase):
    pass

class Camera(CameraBase):
    id: int
    last_active: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Patrol Schemas
class PatrolBase(BaseModel):
    name: str
    officers: str
    location: str
    status: str
    vehicle_number: Optional[str] = None

class PatrolCreate(PatrolBase):
    pass

class Patrol(PatrolBase):
    id: int
    last_update: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Inspection Point Schemas
class InspectionPointBase(BaseModel):
    name: str
    location: str
    status: str
    officer_in_charge: str
    traffic_level: Optional[str] = "منخفض"

class InspectionPointCreate(InspectionPointBase):
    pass

class InspectionPoint(InspectionPointBase):
    id: int
    last_inspection: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Payment Schemas
class PaymentBase(BaseModel):
    violation_id: int
    amount: float
    payment_method: str
    transaction_id: str
    status: str
    card_last_four: Optional[str] = None

class PaymentCreate(PaymentBase):
    pass

class Payment(PaymentBase):
    id: int
    paid_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True

# Statistics Schemas
class StatisticsBase(BaseModel):
    date: date
    total_vehicles: int
    total_violations: int
    total_cameras: int
    total_patrols: int
    total_users: int
    active_cameras: int
    active_patrols: int

class StatisticsCreate(StatisticsBase):
    pass

class Statistics(StatisticsBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Dashboard Stats
class DashboardStats(BaseModel):
    total_vehicles: int
    total_violations: int
    total_cameras: int
    total_users: int
    today_violations: int
    active_cameras: int
    active_patrols: int
    unpaid_violations: int

# Search Schemas
class ViolationSearch(BaseModel):
    violation_number: Optional[str] = None
    vehicle_plate: Optional[str] = None
    national_id: Optional[str] = None

