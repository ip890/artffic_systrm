// Fake dynamic charts simulation
const ctx1 = document.getElementById("timeline");
const ctx2 = document.getElementById("types");

function drawFakeChart(ctx,label){
  const c = ctx.getContext("2d");
  c.fillStyle="#e5e7eb";
  c.fillRect(0,0,ctx.width,ctx.height);
  c.fillStyle="#2563eb";
  for(let i=0;i<10;i++){
    c.fillRect(20+i*30,100-Math.random()*80,15,100);
  }
  c.fillStyle="#000";
  c.fillText(label,10,15);
}

if(ctx1) drawFakeChart(ctx1,"الزمن");
if(ctx2) drawFakeChart(ctx2,"الأنواع");

// Time Range Interaction
document.getElementById("timeRange").addEventListener("change",e=>{
  alert("📊 تحديث التحليلات للفترة: " + e.target.value);
});
/* ===============================
   SMART DATA SIMULATION
================================ */

const dataSets = {
  "اليوم": {
    timeline: [12, 18, 22, 30, 28, 35],
    types: { سرعة: 45, إشارة: 30, ركن: 25 }
  },
  "آخر 7 أيام": {
    timeline: [60, 80, 90, 110, 100, 130],
    types: { سرعة: 50, إشارة: 35, ركن: 15 }
  },
  "آخر شهر": {
    timeline: [200, 240, 260, 300, 320, 350],
    types: { سرعة: 55, إشارة: 25, ركن: 20 }
  },
  "آخر سنة": {
    timeline: [1200, 1400, 1600, 1800, 2000, 2300],
    types: { سرعة: 60, إشارة: 22, ركن: 18 }
  }
};

let currentRange = "اليوم";

/* ===============================
   CANVAS REFERENCES
================================ */

const timelineCanvas = document.getElementById("timeline");
const typesCanvas = document.getElementById("types");

/* ===============================
   DRAW FUNCTIONS
================================ */

function clear(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* ---- BAR CHART ---- */
function drawBars(canvas, values) {
  const ctx = canvas.getContext("2d");
  clear(ctx, canvas);

  const max = Math.max(...values);
  values.forEach((v, i) => {
    const h = (v / max) * 120;
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(30 + i * 40, 150 - h, 25, h);
  });
}

/* ---- PIE CHART ---- */
function drawPie(canvas, dataObj) {
  const ctx = canvas.getContext("2d");
  clear(ctx, canvas);

  const total = Object.values(dataObj).reduce((a, b) => a + b, 0);
  let angle = 0;
  const colors = ["#2563eb", "#16a34a", "#dc2626"];

  Object.values(dataObj).forEach((val, i) => {
    const slice = (val / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 80, angle, angle + slice);
    ctx.fillStyle = colors[i];
    ctx.fill();
    angle += slice;
  });
}

/* ===============================
   INITIAL DRAW
================================ */

drawBars(timelineCanvas, dataSets[currentRange].timeline);
drawBars(typesCanvas, Object.values(dataSets[currentRange].types));

/* ===============================
   HOVER INTERACTION
================================ */

// Timeline → Pie on hover
timelineCanvas.addEventListener("mouseenter", () => {
  drawPie(timelineCanvas, { 
    بداية: 30, 
    منتصف: 40, 
    نهاية: 30 
  });
});

timelineCanvas.addEventListener("mouseleave", () => {
  drawBars(timelineCanvas, dataSets[currentRange].timeline);
});

// Types → Real Violation Types
typesCanvas.addEventListener("mouseenter", () => {
  drawPie(typesCanvas, dataSets[currentRange].types);
});

typesCanvas.addEventListener("mouseleave", () => {
  drawBars(typesCanvas, Object.values(dataSets[currentRange].types));
});

/* ===============================
   TIME RANGE CHANGE
================================ */

document.getElementById("timeRange").addEventListener("change", (e) => {
  currentRange = e.target.value;

  drawBars(timelineCanvas, dataSets[currentRange].timeline);
  drawBars(typesCanvas, Object.values(dataSets[currentRange].types));

  // UX feedback
  console.log("📊 تم تحديث البيانات:", currentRange);
});
