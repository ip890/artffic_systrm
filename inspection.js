// Animated Counters
document.querySelectorAll(".num").forEach(el => {
    let target = +el.dataset.target;
    let count = 0;
    let speed = target / 50;

    function animate() {
        count += speed;
        if (count < target) {
            el.textContent = Math.floor(count);
            requestAnimationFrame(animate);
        } else {
            el.textContent = target;
        }
    }
    animate();
});

// AI Analysis Button
document.querySelector(".ai-btn").addEventListener("click", () => {
    alert("🤖 تحليل الذكاء الاصطناعي:\n• ذروة قريبة\n• نقطة خطر جديدة متوقعة\n• يُنصح بإرسال دعم");
});

// Map Action Buttons
document.querySelectorAll(".map-actions button").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.textContent = "⏳ جار التنفيذ...";
        setTimeout(() => {
            btn.textContent = "✅ تم";
        }, 1200);
    });
});
