// حفظ الإعدادات
document.getElementById("saveAll").addEventListener("click", () => {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => card.classList.add("saved"));

    setTimeout(() => {
        alert("✅ تم حفظ جميع الإعدادات بنجاح");
        cards.forEach(card => card.classList.remove("saved"));
    }, 500);
});

// تأثير تفاعلي
document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("change", () => {
        el.closest(".card").style.border = "2px solid #22c55e";
    });
});

const permissions = {
    admin: ["*"],
    supervisor: [],
    viewer: []
};

// عند التغيير
document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", () => {
        const role = cb.dataset.role;
        const page = cb.dataset.page;

        if (!role) return;

        if (cb.checked) {
            permissions[role].push(page);
        } else {
            permissions[role] = permissions[role].filter(p => p !== page);
        }
    });
});

// حفظ
document.getElementById("saveRoles").addEventListener("click", () => {
    localStorage.setItem("permissions", JSON.stringify(permissions));
    alert("✅ تم حفظ الصلاحيات بنجاح");
});
