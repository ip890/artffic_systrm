const patrols = [
    {
        id: 1,
        name: "الدورية 01",
        officers: "أحمد - خالد",
        location: "شارع النيل",
        status: "active"
    },
    {
        id: 2,
        name: "الدورية 02",
        officers: "محمد - علي",
        location: "الطريق الدائري",
        status: "off"
    },
    {
        id: 3,
        name: "الدورية 03",
        officers: "سامي - حسن",
        location: "وسط المدينة",
        status: "active"
    }
];

const grid = document.getElementById("patrolsGrid");

function renderPatrols() {
    grid.innerHTML = "";

    patrols.forEach(patrol => {
        const card = document.createElement("div");
        card.className = "patrol-card";

        const statusClass = patrol.status === "active" ? "active-status" : "off-status";
        const statusText = patrol.status === "active" ? "🟢 نشطة" : "🔴 خارج الخدمة";

        card.innerHTML = `
            <span class="patrol-status ${statusClass}">${statusText}</span>
            <h3>${patrol.name}</h3>
            <p>👮‍♂️ الأفراد: ${patrol.officers}</p>
            <p>📍 الموقع: ${patrol.location}</p>

            <div class="patrol-actions">
                <button class="track" onclick="trackPatrol(${patrol.id})">🗺️ تتبع</button>
                <button class="assign" onclick="assignTask(${patrol.id})">📢 إسناد مهمة</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function trackPatrol(id) {
    alert(`🗺️ تتبع الدورية رقم ${id} على الخريطة`);
}

function assignTask(id) {
    alert(`📢 تم إرسال مهمة جديدة للدورية رقم ${id}`);
}

renderPatrols();


// ===== زر إضافة دورية =====
const addPatrolBtn = document.getElementById("addPatrolBtn");

// إنشاء نافذة الإضافة
const modal = document.createElement("div");
modal.id = "addPatrolModal";
modal.style.display = "none";
modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-box">
        <h3>➕ إضافة دورية جديدة</h3>

        <input type="text" id="patrolName" placeholder="اسم الدورية">
        <input type="text" id="patrolOfficers" placeholder="أسماء الأفراد">
        <input type="text" id="patrolLocation" placeholder="الموقع الحالي">

        <select id="patrolStatus">
            <option value="active">نشطة</option>
            <option value="off">خارج الخدمة</option>
        </select>

        <div class="modal-actions">
            <button id="savePatrol">💾 حفظ</button>
            <button id="closeModal">❌ إلغاء</button>
        </div>
    </div>
`;
document.body.appendChild(modal);

// فتح النافذة
addPatrolBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

// إغلاق النافذة
modal.querySelector("#closeModal").addEventListener("click", () => {
    modal.style.display = "none";
});

// حفظ الدورية
modal.querySelector("#savePatrol").addEventListener("click", () => {
    const name = document.getElementById("patrolName").value.trim();
    const officers = document.getElementById("patrolOfficers").value.trim();
    const location = document.getElementById("patrolLocation").value.trim();
    const status = document.getElementById("patrolStatus").value;

    if (!name || !officers || !location) {
        alert("⚠️ يرجى ملء جميع الحقول");
        return;
    }

    const newPatrol = {
        id: Date.now(),
        name,
        officers,
        location,
        status
    };

    patrols.push(newPatrol);
    renderPatrols();

    modal.style.display = "none";

    // تفريغ الحقول
    document.getElementById("patrolName").value = "";
    document.getElementById("patrolOfficers").value = "";
    document.getElementById("patrolLocation").value = "";
});