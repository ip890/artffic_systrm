// Animated counters
document.querySelectorAll(".num").forEach(el => {
    let target = +el.dataset.target;
    let count = 0;
    let step = target / 40;

    function run() {
        count += step;
        if (count < target) {
            el.textContent = Math.floor(count);
            requestAnimationFrame(run);
        } else {
            el.textContent = target;
        }
    }
    run();
});

// AI Vision
document.querySelector(".ai-btn").addEventListener("click", () => {
    alert(
        "🤖 AI Vision Activated\n\n" +
        "• كشف ازدحام\n" +
        "• تحليل سلوك المركبات\n" +
        "• ربط تلقائي مع المرور"
    );
});

// Camera buttons
document.querySelectorAll(".camera-actions button").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.textContent = "⏳ جار التنفيذ...";
        setTimeout(() => {
            btn.textContent = "✅ تم";
        }, 1000);
    });
});
// إعادة تشغيل الكاميرا المتوقفة (شارع النيل)
document.querySelectorAll(".camera-card").forEach(card => {
    const restartBtn = card.querySelector("button");

    if (restartBtn && restartBtn.textContent.includes("إعادة")) {
        restartBtn.addEventListener("click", () => {

            const status = card.querySelector(".status");
            const feed = card.querySelector(".camera-feed");

            // حالة تحميل
            restartBtn.textContent = "⏳ جارِ التشغيل...";
            restartBtn.disabled = true;

            setTimeout(() => {
                // تغيير الحالة
                status.textContent = "LIVE";
                status.classList.remove("offline");
                status.classList.add("live");

                // تغيير عرض الكاميرا
                feed.classList.remove("offline");
                feed.innerHTML = `
          <div class="scan-line"></div>
          🎥 بث مباشر – شارع النيل
        `;

                // تغيير شكل الكارد
                card.classList.remove("offline");
                card.classList.add("active");

                // استبدال الأزرار
                const actions = card.querySelector(".camera-actions");
                actions.innerHTML = `
          <button>📡 إرسال الموقع</button>
          <button>🚔 إرسال دورية</button>
          <button>👁 تكبير</button>
        `;

            }, 2000); // محاكاة إعادة التشغيل
        });
    }
});
