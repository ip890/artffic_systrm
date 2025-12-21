//  البحث الذكي
document.getElementById("fileSearch").addEventListener("input", function () {
    const value = this.value.toLowerCase();
    document.querySelectorAll(".file-card").forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(value)
            ? "block"
            : "none";
    });
});

// 🚓 إرسال للدوريات
document.querySelectorAll(".send").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.innerText = "✅ تم الإرسال";
        btn.style.background = "#2ecc71";
    });
});