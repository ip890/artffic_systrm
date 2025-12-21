const zones = document.querySelectorAll(".zone");
const infoText = document.getElementById("infoText");
const timeRange = document.getElementById("timeRange");
const timeValue = document.getElementById("timeValue");
const toggleRisk = document.getElementById("toggleRisk");

let riskVisible = true;

/* HOVER INFO */
zones.forEach(zone => {
    zone.addEventListener("mouseenter", () => {
        infoText.innerHTML = `
            <strong>📍 ${zone.dataset.name}</strong><br>
            مستوى الخطورة: ${zone.dataset.risk}<br>
            المخالفات المتوقعة: ${zone.dataset.count}
        `;
    });

    zone.addEventListener("mouseleave", () => {
        infoText.textContent = "مرر المؤشر على أي منطقة";
    });
});

/* TIME SIMULATION */
timeRange.addEventListener("input", () => {
    const hour = timeRange.value;
    timeValue.textContent = `${hour}:00`;

    zones.forEach(zone => {
        const base = Number(zone.dataset.count);
        const factor = hour >= 7 && hour <= 9 || hour >= 16 && hour <= 19 ? 1.4 : 0.7;
        zone.style.transform = `scale(${factor})`;
    });
});

/* TOGGLE RISK */
toggleRisk.addEventListener("click", () => {
    riskVisible = !riskVisible;
    zones.forEach(zone => {
        zone.style.display = riskVisible ? "block" : "none";
    });
});

const canvas = document.getElementById("aiCanvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const points = Array.from({ length: 25 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6
}));

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.fill();
    });

    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                ctx.strokeStyle = "rgba(56,189,248,0.2)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(draw);
}

draw();

// btn
/* ====== افترض أن اسم الخريطة هو map ====== */
/* Leaflet example: const map = L.map(...) */

/* زر عرض الكاميرات */
document.querySelector(".camera-btn").addEventListener("click", () => {

    const bounds = map.getBounds();

    const visibleArea = {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
    };

    console.log("📷 نطاق عرض الكاميرات:", visibleArea);

    // محاكاة بيانات كاميرات
    const cameras = [
        { id: 1, lat: 15.604, lng: 32.522 },
        { id: 2, lat: 15.608, lng: 32.530 },
        { id: 3, lat: 15.590, lng: 32.510 }
    ];

    const visibleCameras = cameras.filter(cam =>
        cam.lat <= visibleArea.north &&
        cam.lat >= visibleArea.south &&
        cam.lng <= visibleArea.east &&
        cam.lng >= visibleArea.west
    );

    visibleCameras.forEach(cam => {
        L.marker([cam.lat, cam.lng], {
            title: "📷 كاميرا مراقبة"
        }).addTo(map);
    });

    alert(📷 تم عرض ${ visibleCameras.length } كاميرا في المنطقة الحالية);
});


/* زر إرسال الموقع للدوريات */
document.querySelector(".send-btn").addEventListener("click", () => {

    const center = map.getCenter();

    const patrolRequest = {
        lat: center.lat,
        lng: center.lng,
        priority: "HIGH",
        reason: "منطقة ذات مخالفات مرتفعة"
    };

    console.log("🚓 إرسال للدوريات:", patrolRequest);

    // محاكاة إرسال API
    setTimeout(() => {
        alert("🚓 تم إرسال الموقع للدوريات القريبة بنجاح");
    }, 800);

});