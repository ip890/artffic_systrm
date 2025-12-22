// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    updateCurrentDate();
    
    // Initialize sidebar toggle
    initializeSidebar();
    
    // Initialize counter animations
    initializeCounters();
    
    // Initialize camera interactions
    initializeCameraInteractions();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize notification system
    initializeNotifications();
});

// Update current date with Arabic format
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    const now = new Date();
    
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    
    dateElement.textContent = now.toLocaleDateString('ar-SA', options);
}

// Initialize sidebar toggle
function initializeSidebar() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            
            // Rotate the icon
            const icon = this.querySelector('i');
            if (sidebar.classList.contains('collapsed')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        });
    }
    
    // Toggle sidebar on mobile
    const mobileToggle = document.querySelector('.navbar-actions .theme-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
}

// Initialize counter animations
function initializeCounters() {
    const counters = document.querySelectorAll('.kpi-value');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    });
}

// Initialize camera interactions
function initializeCameraInteractions() {
    const cameraCards = document.querySelectorAll('.camera-card');
    const actionButtons = document.querySelectorAll('.camera-actions .action-btn');
    
    // Camera card click handlers
    cameraCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.camera-actions')) {
                const cameraName = this.querySelector('h3').textContent;
                const cameraStatus = this.querySelector('.status-badge').textContent;
                
                showCameraDetails(cameraName, cameraStatus);
            }
        });
    });
    
    // Action button handlers
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const action = this.querySelector('span').textContent;
            const cameraCard = this.closest('.camera-card');
            const cameraName = cameraCard.querySelector('h3').textContent;
            
            handleCameraAction(action, cameraName);
        });
    });
    
    // AI action buttons
    const aiActionButtons = document.querySelectorAll('.ai-actions .action-btn');
    aiActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            handleAIAction(action);
        });
    });
}

// Show camera details modal
function showCameraDetails(name, status) {
    // In a real app, this would open a modal with detailed information
    console.log(`Viewing details for camera: ${name} (${status})`);
    
    // Show notification
    showNotification(`جاري تحميل تفاصيل الكاميرا: ${name}`, 'info');
}

// Handle camera action
function handleCameraAction(action, cameraName) {
    let message = '';
    let type = 'success';
    
    switch(action) {
        case 'إرسال الموقع':
            message = `تم إرسال موقع كاميرا ${cameraName} للدوريات`;
            break;
        case 'إرسال دورية':
            message = `تم إرسال طلب دورية إلى موقع كاميرا ${cameraName}`;
            break;
        case 'تكبير':
            message = `جاري تكبير صورة كاميرا ${cameraName}`;
            type = 'info';
            break;
        case 'ربط نقطة تفتيش':
            message = `جاري ربط كاميرا ${cameraName} بأقرب نقطة تفتيش`;
            type = 'info';
            break;
        case 'إعادة تشغيل':
            message = `جاري إعادة تشغيل كاميرا ${cameraName}`;
            type = 'warning';
            break;
        case 'إصلاح':
            message = `تم إرسال طلب إصلاح لكاميرا ${cameraName}`;
            break;
    }
    
    if (message) {
        showNotification(message, type);
    }
}

// Handle AI action
function handleAIAction(action) {
    let message = '';
    let type = 'success';
    
    switch(action) {
        case 'تنفيذ التوصيات':
            message = 'جاري تنفيذ توصيات الذكاء الاصطناعي...';
            type = 'info';
            // Simulate AI processing
            setTimeout(() => {
                showNotification('تم تنفيذ جميع التوصيات بنجاح', 'success');
            }, 2000);
            break;
        case 'مشاركة':
            message = 'جاري إعداد تقرير للمشاركة...';
            type = 'info';
            break;
        case 'تحميل التقرير':
            message = 'جاري تحميل التقرير...';
            type = 'info';
            // Simulate download
            setTimeout(() => {
                showNotification('تم تحميل التقرير بنجاح', 'success');
            }, 1500);
            break;
    }
    
    if (message) {
        showNotification(message, type);
    }
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-container input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const cameraCards = document.querySelectorAll('.camera-card');
            
            cameraCards.forEach(card => {
                const cameraName = card.querySelector('h3').textContent.toLowerCase();
                const cameraLocation = card.querySelector('.camera-title span')?.textContent?.toLowerCase() || '';
                
                if (cameraName.includes(searchTerm) || cameraLocation.includes(searchTerm) || searchTerm === '') {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    }
}

// Initialize notification system
function initializeNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showNotificationPanel();
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Add styles if not already added
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
                border-right: 5px solid;
                animation: slideIn 0.3s ease-out;
                transform: translateX(0);
            }
            
            .notification-info {
                border-right-color: #2196f3;
            }
            
            .notification-success {
                border-right-color: #4caf50;
            }
            
            .notification-warning {
                border-right-color: #ff9800;
            }
            
            .notification-error {
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
            
            .notification-info .notification-content i {
                color: #2196f3;
            }
            
            .notification-success .notification-content i {
                color: #4caf50;
            }
            
            .notification-warning .notification-content i {
                color: #ff9800;
            }
            
            .notification-error .notification-content i {
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
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(-100%); opacity: 0; }
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
        case 'success': return 'fa-check-circle';
        case 'warning': return 'fa-exclamation-triangle';
        case 'error': return 'fa-times-circle';
        default: return 'fa-info-circle';
    }
}

// Show notification panel (simplified)
function showNotificationPanel() {
    showNotification('لا توجد إشعارات جديدة', 'info');
    
    // Reset notification count
    const notificationCount = document.querySelector('.notification-count');
    if (notificationCount) {
        notificationCount.style.display = 'none';
    }
}

// Theme toggle functionality
document.querySelector('.theme-toggle')?.addEventListener('click', function() {
    const icon = this.querySelector('i');
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
        showNotification('تم تفعيل الوضع الليلي', 'info');
    } else {
        icon.className = 'fas fa-moon';
        showNotification('تم تفعيل الوضع النهاري', 'info');
    }
});

// Fullscreen toggle
document.querySelector('.fullscreen-btn')?.addEventListener('click', function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
        showNotification('تفعيل وضع الملء الشاشة', 'info');
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            showNotification('خروج من وضع الملء الشاشة', 'info');
        }
    }
});

// Refresh AI insights
document.querySelector('.refresh-btn')?.addEventListener('click', function() {
    const icon = this.querySelector('i');
    const updateText = document.querySelector('.ai-update span');
    
    // Add rotation animation
    icon.style.transform = 'rotate(180deg)';
    
    // Simulate update
    setTimeout(() => {
        icon.style.transform = 'rotate(0deg)';
        updateText.textContent = 'آخر تحديث: الآن';
        showNotification('تم تحديث تحليلات الذكاء الاصطناعي', 'success');
    }, 1000);
});
