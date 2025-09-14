const canvas = document.getElementById('spiral');
const ctx = canvas.getContext('2d');
ctx.translate(200, 200);
ctx.beginPath();
for (let i = 0; i < 2000; i++) {
  const angle = 0.1 * i;
  const x = (1 + 0.05 * i) * Math.cos(angle);
  const y = (1 + 0.05 * i) * Math.sin(angle);
  ctx.lineTo(x, y);
}
ctx.strokeStyle = "#3366cc";
ctx.stroke();
