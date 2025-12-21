// المستخدم الحالي (يأتي من API لاحقًا)
const currentUser = {
    name: "Super Admin",
    role: "Admin" // Admin | Supervisor | Operator
};

document.getElementById("currentRole").innerText =
    currentUser.role === "Admin" ? "🛡️ مدير النظام" :
    currentUser.role === "Supervisor" ? "👮‍♂️ مشرف" : "👤 موظف";

// تطبيق الصلاحيات
document.querySelectorAll("#usersTable tr").forEach(row => {
    const buttons = row.querySelectorAll("button");

    if (currentUser.role === "Operator") {
        buttons.forEach(btn => btn.style.display = "none");
    }

    if (currentUser.role === "Supervisor") {
        row.querySelectorAll(".delete").forEach(btn => btn.remove());
    }
});

// أفعال وهمية (جاهزة للربط)
document.querySelectorAll(".edit").forEach(btn =>
    btn.onclick = () => alert("✏️ تعديل المستخدم")
);

document.querySelectorAll(".delete").forEach(btn =>
    btn.onclick = () => confirm("هل أنت متأكد من الحذف؟")
);

document.querySelectorAll(".lock").forEach(btn =>
    btn.onclick = () => alert("🔒 تم إيقاف المستخدم")
);

document.querySelectorAll(".unlock").forEach(btn =>
    btn.onclick = () => alert("🔓 تم تفعيل المستخدم")
);