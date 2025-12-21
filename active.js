//activ
document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".menu a");
    const currentPath = window.location.pathname;

    links.forEach(link => {
        const linkPath = link.getAttribute("href");

        if (currentPath.includes(linkPath)) {
            link.classList.add("active");
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {

    // الصفحات غير المرتبطة بـ API
    const nonApiPages = [
        "camera.html",
        "analysis.html",
        "map.html",
        "cars.html",
        "add-vehicle.html",
        "adddadm.html",
        "fills.html",
        "index.html",
        "inspection.html",
        "login.html",
        "patrols.html",
        "posss.html",
        "statistic.html",
        "stting.htnl",
        "user.html",
        "violations.html",
    ];

    const currentPage = window.location.pathname.split("/").pop();

    if (nonApiPages.includes(currentPage)) {
        showApiWarning();
    }
});

function showApiWarning() {
    const banner = document.createElement("div");
    banner.className = "api-warning";
    banner.textContent = "هذه الصفحه غير مؤهله للربط بAPI  ";

    document.body.appendChild(banner);
    banner.style.display = "block";

    setTimeout(() => {
        banner.remove();
    }, 5000);
}
