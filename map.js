// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = currentDate.toLocaleDateString('ar-SA', options);
    
    // Initialize zones on the map
    initializeZones();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize network visualization
    initializeNetwork();
    
    // Update time display
    updateTimeDisplay();
});

// Initialize zones on the map
function initializeZones() {
    const map = document.getElementById('mainMap');
    
    // Clear existing zones
    map.innerHTML = '';
    
    // Define zones data
    const zones = [
        { name: "شارع ال٦٠", risk: "high", count: 150, x: 20, y: 30, width: 180, height: 120 },
        { name: "حي الرياض", risk: "medium", count: 90, x: 250, y: 100, width: 150, height: 100 },
        { name: "شارع عبيد ختم", risk: "low", count: 45, x: 100, y: 200, width: 120, height: 80 },
        { name: "طريق المطار", risk: "high", count: 120, x: 400, y: 50, width: 160, height: 110 },
        { name: "حي المشتل", risk: "medium", count: 75, x: 300, y: 250, width: 140, height: 90 },
        { name: "شارع مدني", risk: "low", count: 30, x: 50, y: 350, width: 100, height: 70 }
    ];
    
    // Create zones
    zones.forEach(zone => {
        const zoneElement = document.createElement('div');
        zoneElement.className = `zone ${zone.risk}`;
        zoneElement.style.left = `${zone.x}px`;
        zoneElement.style.top = `${zone.y}px`;
        zoneElement.style.width = `${zone.width}px`;
        zoneElement.style.height = `${zone.height}px`;
        zoneElement.setAttribute('data-name', zone.name);
        zoneElement.setAttribute('data-risk', zone.risk);
        zoneElement.setAttribute('data-count', zone.count);
        
        // Add zone name
        zoneElement.innerHTML = `<span>${zone.name}</span>`;
        
        // Add click event
        zoneElement.addEventListener('click', function() {
            showZoneDetails(zone);
        });
        
        // Add hover event
        zoneElement.addEventListener('mouseenter', function() {
            showZonePreview(zone);
        });
        
        map.appendChild(zoneElement);
    });
}

// Show zone preview on hover
function showZonePreview(zone) {
    const infoText = document.getElementById('infoText');
    const riskText = getRiskText(zone.risk);
    
    infoText.innerHTML = `
        <strong>${zone.name}</strong><br>
        مستوى الخطورة: <span class="${zone.risk}-text">${riskText}</span><br>
        عدد المخالفات: ${zone.count}
    `;
}

// Show zone details on click
function showZoneDetails(zone) {
    const riskText = getRiskText(zone.risk);
    const riskClass = getRiskClass(zone.risk);
    
    // Update zone details panel
    const zoneDetails = document.getElementById('zoneDetails');
    zoneDetails.innerHTML = `
        <div class="zone-title">${zone.name}</div>
        <div class="zone-stats">
            <div class="stat-item">
                <span class="stat-label">مستوى الخطورة:</span>
                <span class="stat-value ${riskClass}">${riskText}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">عدد المخالفات:</span>
                <span class="stat-value">${zone.count}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">الكثافة المرورية:</span>
                <span class="stat-value">${getTrafficDensity(zone.count)}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">آخر تحديث:</span>
                <span class="stat-value">قبل 15 دقيقة</span>
            </div>
        </div>
    `;
    
    // Show the details panel
    zoneDetails.style.display = 'block';
    
    // Show modal with more details
    showZoneModal(zone);
}

// Show zone modal
function showZoneModal(zone) {
    const riskText = getRiskText(zone.risk);
    const riskClass = getRiskClass(zone.risk);
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="zone-modal-content">
            <h4>${zone.name}</h4>
            <p>تفاصيل المنطقة وتحليل المخاطر</p>
            
            <div class="modal-stats">
                <div class="modal-stat">
                    <div class="modal-stat-value ${riskClass}">${riskText}</div>
                    <div class="modal-stat-label">مستوى الخطورة</div>
                </div>
                <div class="modal-stat">
                    <div class="modal-stat-value">${zone.count}</div>
                    <div class="modal-stat-label">المخالفات</div>
                </div>
                <div class="modal-stat">
                    <div class="modal-stat-value">${Math.floor(zone.count * 1.5)}</div>
                    <div class="modal-stat-label">المركبات</div>
                </div>
            </div>
            
            <div class="modal-recommendations">
                <h5>التوصيات:</h5>
                <ul>
                    <li>زيادة عدد الكاميرات المراقبة</li>
                    <li>نشر دورية مرورية إضافية</li>
                    <li>تعديل إشارات المرور خلال ساعات الذروة</li>
                </ul>
            </div>
        </div>
    `;
    
    // Show modal
    document.getElementById('zoneModal').classList.add('active');
}

// Get risk text in Arabic
function getRiskText(risk) {
    switch(risk) {
        case 'high': return 'عالي';
        case 'medium': return 'متوسط';
        case 'low': return 'منخفض';
        default: return 'غير معروف';
    }
}

// Get risk class for styling
function getRiskClass(risk) {
    switch(risk) {
        case 'high': return 'danger';
        case 'medium': return 'warning';
        case 'low': return 'success';
        default: return '';
    }
}

// Get traffic density based on violation count
function getTrafficDensity(count) {
    if (count > 100) return 'عالية جداً';
    if (count > 70) return 'عالية';
    if (count > 40) return 'متوسطة';
    return 'منخفضة';
}

// Initialize event listeners
function initializeEventListeners() {
    // Toggle sidebar
    const toggleSidebar = document.getElementById('toggleSidebar');
    const sidebar = document.querySelector('.sidebar');
    
    toggleSidebar.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        
        // Rotate the icon
        const icon = this.querySelector('i');
        if (sidebar.classList.contains('collapsed')) {
            icon.style.transform = 'rotate(180deg)';
        } else {
            icon.style.transform = 'rotate(0deg)';
        }
    });
    
    // Time range slider
    const timeRange = document.getElementById('timeRange');
    const timeValue = document.getElementById('timeValue');
    
    timeRange.addEventListener('input', function() {
        updateTimeDisplay();
    });
    
    // Toggle risk visibility
    const toggleRisk = document.getElementById('toggleRisk');
    let risksVisible = true;
    
    toggleRisk.addEventListener('click', function() {
        const zones = document.querySelectorAll('.zone');
        risksVisible = !risksVisible;
        
        zones.forEach(zone => {
            if (risksVisible) {
                zone.style.opacity = '1';
                toggleRisk.innerHTML = '<i class="fas fa-eye-slash"></i><span>إخفاء المخاطر</span>';
            } else {
                zone.style.opacity = '0.3';
                toggleRisk.innerHTML = '<i class="fas fa-eye"></i><span>إظهار المخاطر</span>';
            }
        });
    });
    
    // Filter select
    const filterSelect = document.getElementById('filterSelect');
    
    filterSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        const zones = document.querySelectorAll('.zone');
        
        zones.forEach(zone => {
            if (selectedValue === 'all' || zone.getAttribute('data-risk') === selectedValue) {
                zone.style.display = 'block';
            } else {
                zone.style.display = 'none';
            }
        });
    });
    
    // Refresh map button
    const refreshMap = document.getElementById('refreshMap');
    
    refreshMap.addEventListener('click', function() {
        // Add loading animation
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>جاري التحديث...</span>';
        this.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            initializeZones();
            this.innerHTML = '<i class="fas fa-sync-alt"></i><span>تحديث الخريطة</span>';
            this.disabled = false;
            
            // Show notification
            showNotification('تم تحديث الخريطة بنجاح', 'success');
        }, 1500);
    });
    
    // Close info panel
    const closeInfo = document.getElementById('closeInfo');
    
    closeInfo.addEventListener('click', function() {
        const zoneDetails = document.getElementById('zoneDetails');
        zoneDetails.style.display = 'none';
        
        const infoText = document.getElementById('infoText');
        infoText.textContent = 'انقر على أي منطقة لعرض التفاصيل';
    });
    
    // Modal close buttons
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const zoneModal = document.getElementById('zoneModal');
    
    modalClose.addEventListener('click', function() {
        zoneModal.classList.remove('active');
    });
    
    modalCancel.addEventListener('click', function() {
        zoneModal.classList.remove('active');
    });
    
    // Modal action button
    const modalAction = document.getElementById('modalAction');
    
    modalAction.addEventListener('click', function() {
        showNotification('تم إرسال الإجراء بنجاح', 'success');
        zoneModal.classList.remove('active');
    });
    
    // Map action buttons
    const cameraBtn = document.querySelector('.camera-btn');
    const sendBtn = document.querySelector('.send-btn');
    const alertBtn = document.querySelector('.alert-btn');
    
    cameraBtn.addEventListener('click', function() {
        showNotification('جاري تحميل الكاميرات...', 'info');
    });
    
    sendBtn.addEventListener('click', function() {
        showNotification('تم إرسال المعلومات للدوريات', 'success');
    });
    
    alertBtn.addEventListener('click', function() {
        showNotification('تم إرسال التنبيه للسائقين', 'warning');
    });
    
    // Notification button
    const notificationBtn = document.querySelector('.notification-btn');
    
    notificationBtn.addEventListener('click', function() {
        showNotification('لا توجد إشعارات جديدة', 'info');
        this.querySelector('.notification-count').style.display = 'none';
    });
    
    // Update AI button
    const updateBtn = document.querySelector('.update-btn');
    
    updateBtn.addEventListener('click', function() {
        // Add rotation animation
        this.style.transform = 'rotate(180deg)';
        
        // Simulate update
        setTimeout(() => {
            this.style.transform = 'rotate(0deg)';
            showNotification('تم تحديث التحليلات الذكية', 'success');
            
            // Update the update time
            const updateTime = document.querySelector('.ai-update span');
            updateTime.textContent = 'آخر تحديث: الآن';
        }, 1000);
    });
    
    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    
    logoutBtn.addEventListener('click', function() {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            showNotification('جاري تسجيل الخروج...', 'info');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    });
}

// Update time display
function updateTimeDisplay() {
    const timeRange = document.getElementById('timeRange');
    const timeValue = document.getElementById('timeValue');
    const hour = parseInt(timeRange.value);
    
    // Format hour to 12-hour format
    let displayHour = hour % 12;
    if (displayHour === 0) displayHour = 12;
    
    const period = hour < 12 ? 'ص' : 'م';
    
    timeValue.textContent = `${displayHour}:00`;
    
    // Update period text
    const timePeriod = document.querySelector('.time-period');
    timePeriod.textContent = period === 'ص' ? 'صباحاً' : 'مساءً';
    
    // Simulate map update based on time
    updateMapBasedOnTime(hour);
}

// Update map based on selected time
function updateMapBasedOnTime(hour) {
    const zones = document.querySelectorAll('.zone');
    
    zones.forEach(zone => {
        const baseCount = parseInt(zone.getAttribute('data-count'));
        let multiplier = 1;
        
        // Adjust multiplier based on time (simulating traffic patterns)
        if (hour >= 7 && hour <= 9) multiplier = 1.8; // Morning rush
        else if (hour >= 12 && hour <= 14) multiplier = 1.5; // Lunch time
        else if (hour >= 16 && hour <= 19) multiplier = 2.2; // Evening rush
        else if (hour >= 22 || hour <= 5) multiplier = 0.5; // Night time
        
        const adjustedCount = Math.floor(baseCount * multiplier);
        
        // Update zone appearance based on adjusted count
        if (adjustedCount > 120) {
            zone.className = 'zone high';
        } else if (adjustedCount > 60) {
            zone.className = 'zone medium';
        } else {
            zone.className = 'zone low';
        }
        
        // Update the count attribute
        zone.setAttribute('data-count', adjustedCount);
    });
}

// Initialize network visualization
function initializeNetwork() {
    const networkCanvas = document.getElementById('networkCanvas');
    
    // Create a simple network visualization
    const nodes = 15;
    let html = '';
    
    for (let i = 0; i < nodes; i++) {
        const size = 20 + Math.random() * 30;
        const x = Math.random() * 90;
        const y = Math.random() * 90;
        const opacity = 0.5 + Math.random() * 0.5;
        
        html += `<div class="network-node" style="width:${size}px;height:${size}px;left:${x}%;top:${y}%;opacity:${opacity}"></div>`;
    }
    
    networkCanvas.innerHTML = html;
    
    // Animate the nodes
    animateNetwork();
}

// Animate network nodes
function animateNetwork() {
    const nodes = document.querySelectorAll('.network-node');
    
    nodes.forEach(node => {
        // Random movement
        const x = Math.random() * 90;
        const y = Math.random() * 90;
        const duration = 3 + Math.random() * 5;
        
        node.style.transition = `all ${duration}s ease-in-out`;
        node.style.left = `${x}%`;
        node.style.top = `${y}%`;
    });
    
    // Continue animation
    setTimeout(animateNetwork, 5000);
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Add styles for notification
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                left: 20px;
                background: white;
                border-radius: 10px;
                padding: 15px 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                justify-content: space-between;
                z-index: 10000;
                min-width: 300px;
                border-right: 5px solid #4caf50;
                animation: slideIn 0.3s ease-out;
            }
            
            .notification.success {
                border-right-color: #4caf50;
            }
            
            .notification.info {
                border-right-color: #2196f3;
            }
            
            .notification.warning {
                border-right-color: #ff9800;
            }
            
            .notification.danger {
                border-right-color: #f44336;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .notification-content i {
                font-size: 1.5rem;
            }
            
            .notification.success .notification-content i {
                color: #4caf50;
            }
            
            .notification.info .notification-content i {
                color: #2196f3;
            }
            
            .notification.warning .notification-content i {
                color: #ff9800;
            }
            
            .notification.danger .notification-content i {
                color: #f44336;
            }
            
            .notification-close {
                background: transparent;
                border: none;
                color: #90a4ae;
                cursor: pointer;
                font-size: 1rem;
                margin-right: 10px;
            }
            
            @keyframes slideIn {
                from { transform: translateX(-100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add close event
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Get notification icon based on type
function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'info': return 'info-circle';
        case 'warning': return 'exclamation-triangle';
        case 'danger': return 'times-circle';
        default: return 'info-circle';
    }
}
