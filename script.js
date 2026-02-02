const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const result = document.getElementById("result");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const copyBtn = document.getElementById("copyBtn");
const confettiBtn = document.getElementById("confettiBtn");
const subtitle = document.getElementById("subtitle");

let noCount = 0;
const noLines = [
  "Are you suuure? 😳",
  "Wait wait… reconsider? 🥺",
  "I’ll be extra nice though 😇",
  "I have snacks!! 🍫",
  "Ok last chance… 😭"
];

function showResult(accepted){
  result.hidden = false;
  if(accepted){
    resultTitle.textContent = "YAY!! 💞";
    resultText.textContent = "Date locked in. I’m smiling like an idiot right now.";
    subtitle.textContent = "Best decision you’ve made all year.";
    popConfetti();
  }else{
    resultTitle.textContent = "Ouch 😭";
    resultText.textContent = "I will recover… eventually… maybe…";
  }
}

yesBtn.addEventListener("click", () => showResult(true));

noBtn.addEventListener("mouseenter", () => {
  // playful dodge
  const pad = 14;
  const rect = noBtn.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width - pad;
  const maxY = window.innerHeight - rect.height - pad;
  const x = Math.max(pad, Math.min(maxX, Math.random() * maxX));
  const y = Math.max(pad, Math.min(maxY, Math.random() * maxY));
  noBtn.style.position = "fixed";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  noCount++;
  subtitle.textContent = noLines[Math.min(noCount - 1, noLines.length - 1)];
});

noBtn.addEventListener("click", () => showResult(false));

copyBtn.addEventListener("click", async () => {
  try{
    await navigator.clipboard.writeText(window.location.href);
    copyBtn.textContent = "Copied! ✅";
    setTimeout(() => copyBtn.textContent = "Copy link 🔗", 1300);
  }catch{
    copyBtn.textContent = "Copy failed 😅";
    setTimeout(() => copyBtn.textContent = "Copy link 🔗", 1300);
  }
});

confettiBtn.addEventListener("click", popConfetti);

/* Tiny confetti */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function popConfetti(){
  const n = 180;
  for(let i=0;i<n;i++){
    pieces.push({
      x: Math.random()*canvas.width,
      y: -20 - Math.random()*canvas.height*0.2,
      r: 2 + Math.random()*4,
      vx: -2 + Math.random()*4,
      vy: 2 + Math.random()*6,
      a: Math.random()*Math.PI*2,
      va: -0.2 + Math.random()*0.4,
      life: 120 + Math.random()*60
    });
  }
  if(!animating) animate();
}

let animating = false;
function animate(){
  animating = true;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  pieces = pieces.filter(p => p.life-- > 0);
  for(const p of pieces){
    p.x += p.vx;
    p.y += p.vy;
    p.a += p.va;
    p.vy *= 0.995;
    p.vy += 0.03;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.a);
    ctx.globalAlpha = Math.max(0, p.life/180);
    ctx.fillRect(-p.r, -p.r, p.r*2, p.r*2);
    ctx.restore();
  }
  if(pieces.length){
    requestAnimationFrame(animate);
  }else{
    animating = false;
  }
}
