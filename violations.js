const searchInput = document.getElementById("search");
const table = document.getElementById("violationsTable");

/* 🔍 البحث */
searchInput.addEventListener("keyup", function () {
    const value = this.value.toLowerCase();
    const rows = table.querySelectorAll("tbody tr");

    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value)
            ? ""
            : "none";
    });
});

/* 🖨 طباعة */
document.getElementById("printBtn").onclick = () => {
    window.print();
};

/* 📍 إرسال لنقطة تفتيش */
document.getElementById("sendBtn").onclick = () => {
    alert("📍 تم إرسال المخالفة إلى أقرب نقطة تفتيش");
};

/* 📄 تصدير */
document.getElementById("exportBtn").onclick = () => {
    alert("📄 سيتم تصدير المخالفات (PDF / Excel)");
};

document.querySelectorAll(".tools-grid button").forEach(btn => {
    btn.addEventListener("click", () => {
        alert("🚧 هذه الوظيفة مفعّلة جزئيًا وجاهزة للربط الخلفي");
    });
});