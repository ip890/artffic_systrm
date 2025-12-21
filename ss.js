// دالة إنشاء رسم Bar Chart
function createBarChart(id, labels, datasets) {
    return new Chart(document.getElementById(id), {
        type: "bar",
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// =======================
// 1️⃣ الرسومات اليومية DAILY
// =======================
const dailyLabels = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];

createBarChart("daily1", dailyLabels, [
    { label: "السرعة", data: [12, 19, 14, 20, 17], borderWidth: 1 },
    { label: "حزام الأمان", data: [9, 14, 8, 11, 13], borderWidth: 1 },
    { label: "تجاوز الإشارة", data: [4, 6, 5, 3, 7], borderWidth: 1 },
    { label: "وقوف خاطئ", data: [7, 5, 6, 9, 4], borderWidth: 1 }
]);

createBarChart("daily2", dailyLabels, [
    { label: "السرعة", data: [10, 12, 9, 14, 15], borderWidth: 1 },
    { label: "الهاتف أثناء القيادة", data: [6, 8, 5, 7, 9], borderWidth: 1 },
    { label: "عكس السير", data: [3, 4, 2, 5, 3], borderWidth: 1 }
]);

// =======================
// 2️⃣ الرسومات الشهرية PREVIOUS
// =======================
const monthlyLabels = ["يناير", "فبراير", "مارس", "أبريل", "مايو"];

createBarChart("prev1", monthlyLabels, [
    { label: "السرعة", data: [40, 35, 55, 30, 25], borderWidth: 1 }
]);

createBarChart("prev2", monthlyLabels, [
    { label: "تجاوز الإشارة", data: [22, 18, 15, 27, 30], borderWidth: 1 }
]);