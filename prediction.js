const canvas = document.getElementById("forecast");
const ctx = canvas.getContext("2d");

let baseData = [120,130,145,140,110,90,80];
let altData = [100,115,125,120,95,70,60];

function drawLine(data,color){
  ctx.beginPath();
  ctx.moveTo(40,220-data[0]);
  data.forEach((v,i)=>{
    ctx.lineTo(40+i*80,220-v);
  });
  ctx.strokeStyle=color;
  ctx.lineWidth=3;
  ctx.stroke();
}

function draw(){
  ctx.clearRect(0,0,600,250);
  drawLine(baseData,"#2563eb");
}

draw();

// Hover → سيناريو بديل
canvas.addEventListener("mouseenter",()=>{
  ctx.clearRect(0,0,600,250);
  drawLine(baseData,"#2563eb");
  drawLine(altData,"#dc2626");
});

canvas.addEventListener("mouseleave",draw);

// تحديث التنبؤ
document.getElementById("updateBtn").onclick=()=>{
  baseData=baseData.map(v=>v+Math.floor(Math.random()*20-10));
  document.getElementById("total").innerText=
    baseData.reduce((a,b)=>a+b,0);
  draw();
};

//last insirt opject in side omer
const scenarios={
  optimistic:[90,100,110,105,80,60,50],
  normal:[120,130,145,140,110,90,80],
  worst:[160,170,190,180,160,140,120]
};

document.querySelectorAll(".scenario-buttons button").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll(".scenario-buttons button")
      .forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    baseData=scenarios[btn.dataset.mode];
    draw();
  }
});
//confidance level
const confidence=Math.floor(80+Math.random()*10);
document.getElementById("confidenceValue").innerText=confidence+"%";
document.getElementById("confidenceFill").style.width=confidence+"%";

//ai box

function updateAI(mode){
  const texts={
    optimistic:"انخفاض متوقع بسبب الحملات الوقائية.",
    normal:"سلوك مروري ثابت مع ذروة منتصف الأسبوع.",
    worst:"ازدحام مرتفع مع ضعف الرقابة المؤقتة."
  };
  document.getElementById("aiText").innerText=texts[mode];
}

function updateAI(mode){
  const texts={
    optimistic:"انخفاض متوقع بسبب الحملات الوقائية.",
    normal:"سلوك مروري ثابت مع ذروة منتصف الأسبوع.",
    worst:"ازدحام مرتفع مع ضعف الرقابة المؤقتة."
  };
  document.getElementById("aiText").innerText=texts[mode];
}
 function riskAlert(){
  if(Math.max(...baseData)>170){
    alert("🚨 تحذير: ذروة خطرة متوقعة!");
  }
}
riskAlert();