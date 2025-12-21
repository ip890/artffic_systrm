const preEmail = localStorage.getItem("pre_user_email");
const preRole = localStorage.getItem("pre_user_role");

if (preEmail) {
    document.getElementById("username").value = preEmail;
}
document.getElementById("loginBtn").addEventListener("click", () => {

    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!role || !username || !password) {
        alert("⚠️ الرجاء إدخال جميع البيانات");
        return;
    }

    // ===== MOCK AUTH =====
    const token = generateToken(role, username);

    localStorage.setItem("auth_token", token);
    localStorage.setItem("user_role", role);
    localStorage.setItem("user_name", username);

    // Redirect
    window.location.href = "users-secure.html";
});

// TOKEN GENERATOR (Mock JWT)
function generateToken(role, username) {
    const payload = {
        role,
        username,
        time: new Date().getTime()
    };
    return btoa(JSON.stringify(payload));
}