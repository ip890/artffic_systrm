const searchInput = document.getElementById("searchInput");
const tableBody = document.getElementById("vehicleTable");

searchInput.addEventListener("keyup", function () {
    let filter = searchInput.value.toLowerCase();
    let rows = tableBody.getElementsByTagName("tr");

    for (let row of rows) {
        let text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
    }
});


const addBtn = document.querySelector(".add-btn");
const modal = document.getElementById("vehicleModal");
const closeModal = document.getElementById("closeModal");

addBtn.onclick = () => {
    modal.style.display = "flex";
};

closeModal.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
};

// مؤقتاً
document.getElementById("vehicleForm").onsubmit = function(e){
    e.preventDefault();
    alert("✅ تم حفظ المركبة (تجريبي)");
    modal.style.display = "none";
};

let currentRow = null;

/* ===== تعديل ===== */
document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", function () {
        currentRow = this.closest("tr");
        isEdit = true;

        plate.value = this.dataset.plate;
        owner.value = this.dataset.owner;
        type.value = this.dataset.type;
        color.value = this.dataset.color;
        status.value = this.dataset.status;

        saveBtn.innerText = "تحديث المركبة";
        modal.style.display = "flex";
    });
});
 form.onsubmit = function (e) {
    e.preventDefault();

    if (isEdit && currentRow) {
        currentRow.children[0].innerText = plate.value;
        currentRow.children[1].innerText = owner.value;
        currentRow.children[2].innerText = type.value;
        currentRow.children[3].innerText = color.value;
        currentRow.children[4].innerText = status.value;

        alert("✅ تم تحديث المركبة بنجاح");
    }

    modal.style.display = "none";
};
 document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", function () {
        const row = this.closest("tr");

        if (confirm("⚠ هل أنت متأكد من حذف هذه المركبة؟")) {
            row.remove();
        }
    });
});