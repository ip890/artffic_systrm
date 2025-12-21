document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("submitBtn");

    btn.onclick = async () => {

        const data = {
            full_name: document.getElementById("full_name").value.trim(),
            user_name: document.getElementById("user_name").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            organization: document.getElementById("organization").value.trim(),
            role: document.getElementById("role").value,
            password_hash: document.getElementById("password_hash").value,
            is_active: document.getElementById("is_active").value
        };

        if (Object.values(data).some(v => v === "")) {
            alert("❌ جميع الحقول مطلوبة");
            return;
        }

        const res = await fetch("http://127.0.0.1:5000/api/init_admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        alert(result.message);
    };

});
