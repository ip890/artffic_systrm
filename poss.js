function createBarChart(id, title, color) {
    new Chart(document.getElementById(id), {
        type: "bar",
        data: {
            labels: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
            datasets: [{
                label: title,
                backgroundColor: color,
                data: [12, 19, 13, 15, 22, 30, 25]
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }
        }
    });
}

// DAILY
createBarChart("daily1", "المخالفات اليومية", "#2d89ef");
createBarChart("daily2", "الحالات اليومية", "#ff8800");

// PREVIOUS MONTHS
createBarChart("prev1", "إحصائيات شهرية", "#17c964");
createBarChart("prev2", "أنواع المخالفات", "#a91e1e");

