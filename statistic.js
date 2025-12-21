// 🔢 Animation Counter
document.querySelectorAll(".kpi-number").forEach(el => {
    let target = +el.dataset.target;
    let count = 0;
    let speed = target / 60;

    function update() {
        count += speed;
        if (count < target) {
            el.innerText = Math.floor(count);
            requestAnimationFrame(update);
        } else {
            el.innerText = target;
        }
    }
    update();
});

// 📊 Charts (Chart.js لازم يكون مضاف)
const violationsChart = new Chart(
    document.getElementById("violationsChart"),
    {
        type: "line",
        data: {
            labels: ["سبت", "أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة"],
            datasets: [{
                label: "المخالفات",
                data: [90, 120, 150, 140, 130, 170, 110],
                borderWidth: 3,
                tension: 0.4
            }]
        }
    }
);

const typesChart = new Chart(
    document.getElementById("typesChart"),
    {
        type: "doughnut",
        data: {
            labels: ["سرعة", "إشارة", "حزام", "هاتف"],
            datasets: [{
                data: [45, 25, 15, 15]
            }]
        }
    }
);

// 🔄 تغيير البيانات حسب الزمن
document.getElementById("timeRange").addEventListener("change", (e) => {
    const v = e.target.value;

    if (v === "day") violationsChart.data.datasets[0].data = [20, 40, 60, 55, 70, 90, 30];
    if (v === "week") violationsChart.data.datasets[0].data = [90, 120, 150, 140, 130, 170, 110];
    if (v === "month") violationsChart.data.datasets[0].data = [400, 520, 610, 580, 690, 740, 660];
    if (v === "year") violationsChart.data.datasets[0].data = [5000, 6200, 7100, 6900, 7500, 8200, 7800];

    violationsChart.update();
});
