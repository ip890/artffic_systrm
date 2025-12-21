const form = document.getElementById("vehicleForm");
const cancelBtn = document.getElementById("cancelBtn");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    alert("✅ تم تسجيل المركبة بنجاح");

    form.reset();
});

/* زر الإلغاء */
cancelBtn.addEventListener("click", function () {
    if (confirm("هل تريد إلغاء العملية؟")) {
        form.reset();
    }
});