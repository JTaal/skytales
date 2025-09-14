---
layout: index
title: Jasper Taal | Visualizations & Projects
---


<style>
:root {
    --skytales-pink: rgba(229, 46, 113, 0.5);
}
html {
    scroll-behavior: smooth;
}
body {
    background-color: #0a0a0f;
    background-image: radial-gradient(ellipse at bottom, #1b2735 0%, #0a0a0f 100%);
    font-family: 'Inter', sans-serif;
    color: #e6edf3;
}
#three-container {
    position: relative;
    width: 100%;
    /* width: 106%; */
    height: 60vh;
    background-image: url('https://JTaal.github.io/assets/images/gif/diffraction_pattern_parachute_2560p_side_view_transparant_cropped.gif');
    background-size: 100%;
    /* background-position: center 20%; */
    /* background-position: center 10%; */
    overflow: hidden;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}
#viewer-overlay {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    /* background: rgba(0,0,0,0.2); */
    /* backdrop-filter: blur(2px); */
    border-radius: 1rem;
}
#logo-placeholder {
    width: 60px;
    height: 60px;
    margin-bottom: 20px;
    background-image: url("https://JTaal.github.io/assets/images/logo/logo.jpg");
    /* background-size: 60%; */
    background-size: contain;
    background-color: white; 
    background-repeat: no-repeat;
    background-position: center;
    border: 2px solid rgba(255,255,255,0.5);
    border-radius: 50%;
}
#skytales-title {
    font-size: 4.5rem;
    font-family: 'Orbitron', sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    background: linear-gradient(45deg, #ff8a00, #e52e71, #9c27b0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 15px rgba(255, 107, 0, 0.5), 0 0 25px var(--skytales-pink);
    margin: 0;
}
@media (max-width: 768px) {
    #skytales-title {
        font-size: 2.5rem;
    }
}
#viewer-overlay .lead {
    max-width: 600px;
    color: #d1d5db;
}

#search {
    background-color: #1f2937;
    border-color: #374151;
    color: #e6edf3;
}
#search::placeholder {
    color: #d1d5db;
}

#dna-strip-container {
    width: 100%;
    height: 80px;
    background: black;
    overflow: hidden;
    position: relative;
}
#dna-canvas {
    width: 100%;
    height: 100%;
    display: block;
}
#gene-info {
    width: 100%;
    text-align: center;
    padding: 8px 0;
    background-color: #1f2937;
    color: #d1d5db;
    font-family: "Courier New", monospace;
    font-size: 0.9rem;
    border-top: 1px solid #374151;
}
.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid #374151;
    background-color: #111827;
}
.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 25px var(--skytales-pink);
}
.card h3 { font-size: 1.3rem; }
.card small { font-size: 0.85rem; color: #ddd; }
.card-cover .d-flex {
    /* background: linear-gradient(to top, rgba(0,0,0,0.85) 60%, transparent 100%); */
    background: linear-gradient(to top, rgba(0,0,0,0.1) 20%, transparent 100%);
}

.footer {
    border-top: 1px solid #374151 !important;
}
.footer-icon {
    width: 24px;
    height: 24px;
    fill: #8b949e;
    transition: fill 0.2s ease-in-out;
}
.footer-icon:hover {
    fill: #c9d1d9;
}
</style>
<body>
    <main>
        <div id="three-container">
            <div id="viewer-overlay">
                <div id="logo-placeholder"></div>
                <h1 id="skytales-title">SkyTales</h1>
                <p class="lead mb-4 mt-3">
                    Our sky tells the story of infinite possibility.
                </p>
            </div>
        </div>
        <div class="container px-4 py-5" id="custom-cards">
            <h2 class="pb-2 border-bottom">Projects</h2>
            <input id="search" class="form-control my-4" placeholder="Search projects or visualisations...">
            <div class="row row-cols-1 row-cols-lg-2 align-items-stretch g-4 py-5">
                {% for post in site.data.posts %}
                <div class="col">
                {% if post.post_url %}
                <a href="{{ post.post_url | relative_url }}" class="text-decoration-none">
                <div class="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg"
                style="background-image: url('{{ post.thumbnail | relative_url }}'); background-size: cover; background-position: center;">
                <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1"
                style="background-color: rgba(0,0,0,0.5);">
                <h3 class="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">{{ post.title }}</h3>
                <ul class="d-flex list-unstyled mt-auto"><li class="me-auto"><small>{{ post.description }}</small></li></ul>
                </div>
                </div>
                </a>
                {% elsif post.visualization_url %}
                <a href="{{ post.visualization_url | relative_url }}" class="text-decoration-none">
                <div class="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg"
                style="background-image: url('{{ post.thumbnail | relative_url }}'); background-size: cover; background-position: center;">
                <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1"
                style="background-color: rgba(0,0,0,0.5);">
                <h3 class="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">{{ post.title }}</h3>
                </div>
                </div>
                </a>
                {% endif %}
                </div>
                {% endfor %}
            </div>
            <h2 class="pb-2 border-bottom">Visualisations</h2>
            <div class="row row-cols-1 row-cols-lg-2 align-items-stretch g-4 py-5">
                {% for project in site.data.projects %}
                <div class="col">
                {% if project.post_url %}
                <a href="{{ project.post_url | relative_url }}" class="text-decoration-none">
                <div class="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg"
                style="background-image: url('{{ project.thumbnail | relative_url }}'); background-size: cover; background-position: center;">
                <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1"
                style="background-color: rgba(0,0,0,0.5);">
                <h3 class="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">{{ project.title }}</h3>
                <ul class="d-flex list-unstyled mt-auto"><li class="me-auto"><small>{{ project.description }}</small></li></ul>
                </div>
                </div>
                </a>
                {% elsif project.visualization_url %}
                <a href="{{ project.visualization_url | relative_url }}" class="text-decoration-none">
                <div class="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg"
                style="background-image: url('{{ project.thumbnail | relative_url }}'); background-size: cover; background-position: center;">
                <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1"
                style="background-color: rgba(0,0,0,0.5);">
                <h3 class="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">{{ project.title }}</h3>
                </div>
                </div>
                </a>
                {% endif %}
                </div>
                {% endfor %}
            </div>
            {% include how-to-cite.html %}
        </div>
        
        <div id="dna-strip-container">
            <canvas id="dna-canvas"></canvas>
        </div>
        <div id="gene-info">Fetching gene data...</div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" xintegrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script>
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
</script>


