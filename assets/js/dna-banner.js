const canvas = document.getElementById("dna-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();

const bases = ["A","T","C","G"];

const dnaColorThemes = {
    classic: { A: "#ef4444", T: "#3b82f6", C: "#f59e0b", G: "#8b5cf6" },
    synthwave: { A: "#ff00cc", T: "#00c6ff", C: "#f8b500", G: "#76ff03" },
    forest: { A: "#65a30d", T: "#16a34a", C: "#f59e0b", G: "#78350f" },
    pastel: { A: "#fecaca", T: "#bfdbfe", C: "#fed7aa", G: "#d8b4fe" },
    monochrome: { A: "#f3f4f6", T: "#9ca3af", C: "#6b7280", G: "#374151" }
};

// --- DNA COLOR THEMES (Uncomment one to activate) ---
let colors = dnaColorThemes.classic;
// let colors = dnaColorThemes.synthwave;
// let colors = dnaColorThemes.forest;
// let colors = dnaColorThemes.pastel;
// let colors = dnaColorThemes.monochrome;


const NUCLEOTIDE_SPACING = 5;
let dnaSeq = "";
let dnaIndex = 0;
let letterPairs = [];
let frame = 0;

let isGlobalGlitchActive = false;
let globalGlitchTimeout = null;
const globalGlitchChance = 0.002;
const globalGlitchDuration = 1500;

async function fetchGene() {
    try {
        const genes=[{id:"NM_007294.4",sym:"BRCA1"},{id:"NM_000546.6",sym:"TP53"}];
        const g=genes[Math.floor(Math.random()*genes.length)];
        document.getElementById("gene-info").textContent=`Fetching ${g.sym}...`;
        const url=`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=${g.id}&rettype=fasta&retmode=text`;
        const r=await fetch(url);
        if(!r.ok) throw new Error();
        const fasta=await r.text();
        dnaSeq=fasta.split("\n").slice(1).join("").replace(/[^ATCG]/g,"");
        document.getElementById("gene-info").textContent=`Visualizing ${g.sym}`;
    } catch {
        dnaSeq=Array.from({length:1000},()=>bases[Math.floor(Math.random()*4)]).join("");
        document.getElementById("gene-info").textContent="Fallback: Random DNA Sequence";
    }
}

function nextBase() {
    return dnaSeq[dnaIndex++ % dnaSeq.length];
}

function spawnPair() {
    const b = nextBase();
    if (!b) return;
    const pairBase = {A:"T",T:"A",C:"G","G":"C"}[b];
    const x = canvas.width + 20;
    letterPairs.push({
        b1: { base: b, color: colors[b] },
        b2: { base: pairBase, color: colors[pairBase] },
        x: x
    });
}

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.font="bold 14px monospace";
    ctx.textAlign="center";
    ctx.textBaseline="middle";

    const canvasCenterY = canvas.height / 2;
    const amplitude = 20;
    const frequency = 0.04;
    const individualGlitchChance = 0.01;
    const glitchColor = "#34d399";

    letterPairs.forEach(pair => {
        const yOffset = amplitude * Math.sin(pair.x * frequency + frame * 0.05);
        const scale = Math.cos(pair.x * frequency + frame * 0.05) * 0.4 + 0.6;
        
        const y1 = canvasCenterY - yOffset;
        const y2 = canvasCenterY + yOffset;
        
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pair.x, y1);
        ctx.lineTo(pair.x, y2);
        ctx.stroke();

        ctx.save();
        ctx.globalAlpha = scale;
        ctx.shadowBlur = 8;
        
        if (isGlobalGlitchActive) {
            const topBase = Math.round(Math.random()).toString();
            const bottomBase = Math.round(Math.random()).toString();
            
            ctx.shadowColor = glitchColor;
            ctx.fillStyle = glitchColor;
            ctx.fillText(topBase, pair.x, y1);
            ctx.fillText(bottomBase, pair.x, y2);
        } else {
            let topBase = pair.b1.base;
            let topColor = pair.b1.color;
            if (Math.random() < individualGlitchChance) {
                topBase = Math.round(Math.random()).toString();
                topColor = glitchColor;
            }
            ctx.shadowColor = topColor;
            ctx.fillStyle = topColor;
            ctx.fillText(topBase, pair.x, y1);
            
            let bottomBase = pair.b2.base;
            let bottomColor = pair.b2.color;
            if (Math.random() < individualGlitchChance) {
                bottomBase = Math.round(Math.random()).toString();
                bottomColor = glitchColor;
            }
            ctx.shadowColor = bottomColor;
            ctx.fillStyle = bottomColor;
            ctx.fillText(bottomBase, pair.x, y2);
        }
        
        ctx.restore();
        pair.x -= 1.5;
    });

    letterPairs = letterPairs.filter(p => p.x > -20);
}

function animateDna() {
    const lastPair = letterPairs[letterPairs.length - 1];
    if (!lastPair || lastPair.x < canvas.width - NUCLEOTIDE_SPACING) {
        spawnPair();
    }
    
    if (!isGlobalGlitchActive && Math.random() < globalGlitchChance) {
        isGlobalGlitchActive = true;
        clearTimeout(globalGlitchTimeout);
        globalGlitchTimeout = setTimeout(() => {
            isGlobalGlitchActive = false;
        }, globalGlitchDuration);
    }

    draw();
    frame++;
    requestAnimationFrame(animateDna);
}

fetchGene().then(()=> animateDna());

document.addEventListener("DOMContentLoaded", function () {
    const search=document.getElementById("search");
    const cards=document.querySelectorAll("#custom-cards .col");
    search.addEventListener("input",function(){
        const q=this.value.toLowerCase();
        cards.forEach(cardContainer=>{
            const text=cardContainer.innerText.toLowerCase();
            cardContainer.style.display=text.includes(q)?"":"none";
        });
    });
});