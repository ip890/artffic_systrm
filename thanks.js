window.addEventListener("load", () => {
    const circle = document.getElementById("circle");
    const message = document.getElementById("message");

    // بعد ثانيتين: تتلاشى الدائرة
    setTimeout(() => {
        circle.classList.add("fade-out");
    }, 2000);

    // بعد 3 ثواني: يظهر النص تدريجياً
    setTimeout(() => {
        message.classList.add("show-text");
    }, 3000);
});