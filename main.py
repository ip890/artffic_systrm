from fastapi import FastAPI, Request, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
from datetime import datetime

from app.database import engine, get_db
from app import models
from app.api.routes import router as api_router
from app.auth import get_current_user
from app.endpoints import ai
app.include_router(ai.router)

# إنشاء الجداول في قاعدة البيانات
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="نظام المرور الذكي",
    description="نظام إدارة وتحليل المخالفات المرورية باستخدام الذكاء الاصطناعي",
    version="1.0.0"
)

# إعداد CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# إعداد الملفات الثابتة
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# إعداد القوالب
templates = Jinja2Templates(directory="app/templates")

# تضمين نقاط النهاية API
app.include_router(api_router, prefix="/api")

# ============ Middleware للتحقق من المصادقة ============
@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    # قائمة الصفحات التي لا تحتاج إلى مصادقة
    public_pages = ["/", "/login", "/payment", "/api/auth/login", "/api/auth/init_admin", "/api/health"]
    
    # إذا كانت الصفحة عامة، تابع بدون تحقق
    if request.url.path in public_pages or request.url.path.startswith("/static/"):
        return await call_next(request)
    
    # التحقق من وجود token في cookies أو headers
    token = request.cookies.get("access_token") or request.headers.get("Authorization")
    
    if not token:
        # إذا لم يكن هناك token، توجيه إلى صفحة تسجيل الدخول
        if request.url.path.startswith("/api/"):
            return JSONResponse(
                status_code=401,
                content={"detail": "Not authenticated"}
            )
        return RedirectResponse(url="/login")
    
    return await call_next(request)

# ============ نقاط نهاية الصفحات الرئيسية ============

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """الصفحة الرئيسية"""
    return templates.TemplateResponse("posss.html", {
        "request": request,
        "current_year": datetime.now().year
    })

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    """صفحة تسجيل الدخول"""
    return templates.TemplateResponse("login.html", {
        "request": request,
        "current_year": datetime.now().year
    })

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request, current_user: dict = Depends(get_current_user)):
    """لوحة التحكم"""
    return templates.TemplateResponse("index.html", {
        "request": request,
        "user": current_user,
        "current_year": datetime.now().year,
        "current_month": datetime.now().strftime("%B %Y")
    })

@app.get("/cameras", response_class=HTMLResponse)
async def cameras_page(request: Request, current_user: dict = Depends(get_current_user)):
    """صفحة الكاميرات"""
    return templates.TemplateResponse("camera.html", {
        "request": request,
        "user": current_user,
        "current_year": datetime.now().year
    })

@app.get("/vehicles", response_class=HTMLResponse)
async def vehicles_page(request: Request, current_user: dict = Depends(get_current_user)):
    """صفحة المركبات"""
    return templates.TemplateResponse("cars.html", {
        "request": request,
        "user": current_user,
        "current_year": datetime.now().year
    })

@app.get("/add-vehicle", response_class=HTMLResponse)
async def add_vehicle_page(request: Request, current_user: dict = Depends(get_current_user)):
    """تسجيل مركبة جديدة"""
    return templates.TemplateResponse("add-vehicle.html", {
        "request": request,
        "user": current_user,
        "current_year": datetime.now().year
    })

@app.get("/violations", response_class=HTMLResponse)
async def violations_page(request: Request, current_user: dict = Depends(get_current_user)):
    """صفحة المخالفات"""
    return templates.TemplateResponse("violations.html", {
        "request": request,
        "user": current_user,
        "current_year": datetime.now().year
    })

@app.get("/analysis", response_class=HTMLResponse)
async def analysis_page(request: Request, current_user: dict = Depends(get_current_user)):
    """تحليلات البيانات"""
    return templates.TemplateResponse("analysis.html", {
        "request": request,
        "user": current_user,
        "current_year": datetime.now().year
    })

@app.get("/users", response_class=HTMLResponse)
async def users_page(request: Request, current_user: dict = Depends(get_current_user)):
    """إدارة المستخدمين"""
    return templates.TemplateResponse("user.html", {
        "request": request,
        "user": current_user,
        "current_year": datetime.now().year
    })

@app.get("/files", response_class=HTMLResponse)
async def files_page(request: Request, current_user: dict = Depends(get_current_user)):
    """إدارة الملفات"""
    return templates.TemplateResponse("fills.html", {
        "request": request,
        "user": current_user,
        "current_year": datetime.now().year
    })

@app.get("/inspection", response_class=HTMLResponse)
async def inspection_page(request: Request, current_user: dict = Depends(get_current_user)):
    """نقاط التفتيش"""
    return templates.TemplateResponse("inspection.html", {
        "request": request,
        "user": current_user,
        "current_year": datetime.now().year
    })

@app.get("/statistics", response_class=HTMLResponse)
async def statistics_page(request: Request, current_user: dict = Depends(get_current_user)):
    """الإحصائيات"""
    return templates.TemplateResponse("statistic.html", {
        "request": request,
        "user": current_user,
        "current_year": datetime.now().year
    })

@app.get("/map", response_class=HTMLResponse)
async def map_page(request: Request, current_user: dict = Depends(get_current_user)):
    """الخرائط"""
    return templates.TemplateResponse("map.html", {
        "request": request,
        "user": current_user,
        "current_year": datetime.now().year
    })

@app.get("/prediction", response_class=HTMLResponse)
async def prediction_page(request: Request, current_user: dict = Depends(get_current_user)):
    """التنبؤات"""
    return templates.TemplateResponse("prediction.html", {
        "request": request,
        "user": current_user,
        "current_year": datetime.now().year
    })

@app.get("/settings", response_class=HTMLResponse)
async def settings_page(request: Request, current_user: dict = Depends(get_current_user)):
    """الإعدادات"""
    return templates.TemplateResponse("stting.html", {
        "request": request,
        "user": current_user,
        "current_year": datetime.now().year
    })

@app.get("/add-admin", response_class=HTMLResponse)
async def add_admin_page(request: Request, current_user: dict = Depends(get_current_user)):
    """إنشاء مستخدم جديد"""
    return templates.TemplateResponse("adddadm.html", {
        "request": request,
        "user": current_user,
        "current_year": datetime.now().year
    })

@app.get("/patrols", response_class=HTMLResponse)
async def patrols_page(request: Request, current_user: dict = Depends(get_current_user)):
    """إدارة الدوريات"""
    return templates.TemplateResponse("patrols.html", {
        "request": request,
        "user": current_user,
        "current_year": datetime.now().year
    })

@app.get("/payment", response_class=HTMLResponse)
async def payment_page(request: Request):
    """نظام الدفع"""
    return templates.TemplateResponse("bases.html", {
        "request": request,
        "current_year": datetime.now().year
    })

# ============ API للملفات الثابتة ============

@app.get("/api/config")
async def get_config():
    """الحصول على إعدادات التطبيق"""
    return {
        "app_name": "نظام المرور الذكي",
        "version": "1.0.0",
        "api_version": "v1",
        "support_email": "support@traffic.gov.sa",
        "support_phone": "1990"
    }

@app.get("/api/sidebar/menu")
async def get_sidebar_menu(current_user: dict = Depends(get_current_user)):
    """الحصول على قائمة القائمة الجانبية"""
    menu_items = [
        {"name": "الرئيسية", "icon": "🏠", "url": "/", "active": False},
        {"name": "لوحة التحكم", "icon": "📊", "url": "/dashboard", "active": True},
        {"name": "المركبات", "icon": "🚗", "url": "/vehicles", "active": False},
        {"name": "تسجيل مركبة جديدة", "icon": "📄", "url": "/add-vehicle", "active": False},
        {"name": "المخالفات", "icon": "⚠", "url": "/violations", "active": False},
        {"name": "تحليلات البيانات", "icon": "📊", "url": "/analysis", "active": False},
        {"name": "المستخدمين", "icon": "🧍‍♂", "url": "/users", "active": False},
        {"name": "إدارة الملفات", "icon": "📁", "url": "/files", "active": False},
        {"name": "نقاط التفتيش", "icon": "📍", "url": "/inspection", "active": False},
        {"name": "الإحصائيات", "icon": "📈", "url": "/statistics", "active": False},
        {"name": "الخرائط", "icon": "🗺", "url": "/map", "active": False},
        {"name": "التنبؤات", "icon": "⚡", "url": "/prediction", "active": False},
        {"name": "كاميرات المراقبة", "icon": "🎥", "url": "/cameras", "active": False},
        {"name": "الإعدادات", "icon": "⚙", "url": "/settings", "active": False},
    ]
    
    # إضافة عناصر القائمة بناءً على صلاحيات المستخدم
    if current_user.role == "admin":
        menu_items.append({"name": "إضافة مدير", "icon": "👑", "url": "/add-admin", "active": False})
    
    menu_items.append({"name": "تسجيل الخروج", "icon": "🔐", "url": "/logout", "active": False})
    
    return menu_items

@app.get("/logout")
async def logout():
    """تسجيل الخروج"""
    response = RedirectResponse(url="/login")
    response.delete_cookie("access_token")
    return response

# ============ نقطة بدء التشغيل ============

@app.on_event("startup")
async def startup_event():
    """الأحداث التي تنفذ عند بدء التشغيل"""
    print("🚀 بدء تشغيل نظام المرور الذكي...")
    print("📊 قاعدة البيانات: متصلة")
    print("🌐 الخادم: جاهز على http://localhost:8000")
    print("📱 API: متاح على http://localhost:8000/docs")

if _name_ == "_main_":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
