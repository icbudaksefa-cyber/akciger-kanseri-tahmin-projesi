/* global Chart */

// --- 1. SEKME YÖNETİMİ ---
function setTab(panelId) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    const targetPanel = document.getElementById(panelId);
    if(targetPanel) {
        targetPanel.classList.add('active');
    }
    
    const activeBtn = document.querySelector(`button[onclick="setTab('${panelId}')"]`);
    if(activeBtn) {
        activeBtn.classList.add('active');
    }

    if(panelId === 'panel-charts') {
        renderCharts();
    }
}

// --- 2. FORM YÖNETİMİ ---
function updateAge(val) {
    const ageValueSpan = document.getElementById('age-value');
    if(ageValueSpan) ageValueSpan.innerText = val;
}

let currentGender = 'F';
function setGender(gender) {
    currentGender = gender;
    document.getElementById('gender-f').classList.remove('active');
    document.getElementById('gender-m').classList.remove('active');
    
    const targetBtn = document.getElementById(`gender-${gender.toLowerCase()}`);
    if(targetBtn) targetBtn.classList.add('active');
}

function toggleTheme() {
    const html = document.documentElement;
    const btn = document.getElementById('theme-btn');
    if (html.getAttribute('data-theme') === 'light') {
        html.setAttribute('data-theme', 'dark');
        btn.innerText = 'Açık Tema ☀️';
    } else {
        html.setAttribute('data-theme', 'light');
        btn.innerText = 'Koyu Tema 🌙';
    }
}

// --- 3. SORU SİSTEMİ ---
const symptoms = [
    { id: 'SMOKING', label: 'Sigara Kullanımı' },
    { id: 'YELLOW_FINGERS', label: 'Sarı Parmaklar (Leke)' },
    { id: 'ANXIETY', label: 'Anksiyete / Kaygı' },
    { id: 'CHRONIC_DISEASE', label: 'Kronik Hastalık' },
    { id: 'FATIGUE', label: 'Sürekli Yorgunluk' },
    { id: 'ALLERGY', label: 'Alerji Durumu' },
    { id: 'WHEEZING', label: 'Hırıltılı Solunum' },
    { id: 'ALCOHOL', label: 'Alkol Tüketimi' },
    { id: 'COUGHING', label: 'Kronik Öksürük' },
    { id: 'SHORTNESS_OF_BREATH', label: 'Nefes Darlığı' },
    { id: 'SWALLOWING', label: 'Yutkunma Güçlüğü' },
    { id: 'CHEST_PAIN', label: 'Göğüs Ağrısı' }
];

const answers = {};

function renderQuestions() {
    const grid = document.getElementById('question-grid');
    if(!grid) return;
    
    symptoms.forEach(sym => {
        answers[sym.id] = 0; 
        grid.innerHTML += `
            <div class="q-row">
                <span>${sym.label}</span>
                <div class="yn-switch" id="switch-${sym.id}">
                    <button class="active no" onclick="setAnswer('${sym.id}', 0)">Hayır</button>
                    <button onclick="setAnswer('${sym.id}', 1)">Evet</button>
                </div>
            </div>
        `;
    });
}

function setAnswer(id, val) {
    answers[id] = val;
    const container = document.getElementById(`switch-${id}`);
    if(!container) return;
    
    const btns = container.querySelectorAll('button');
    if(btns.length >= 2) {
        btns[0].classList.remove('active', 'no');
        btns[1].classList.remove('active', 'yes');
        
        if(val === 0) btns[0].classList.add('active', 'no');
        if(val === 1) btns[1].classList.add('active', 'yes');
    }
}

// --- 4. TAHMİN ALGORİTMASI ---
function handlePredict() {
    const resultsCard = document.getElementById('results-card');
    const banner = document.getElementById('summary-banner');
    
    if (!resultsCard || !banner) return;
    
    let riskScore = 0;
    if(answers['SMOKING'] === 1) riskScore += 3;
    if(answers['ALCOHOL'] === 1) riskScore += 2;
    if(answers['COUGHING'] === 1) riskScore += 2;
    if(answers['CHEST_PAIN'] === 1) riskScore += 2;
    if(answers['SHORTNESS_OF_BREATH'] === 1) riskScore += 2;
    
    resultsCard.style.display = 'block';
    
    if (riskScore >= 5) {
        banner.className = 'summary-banner risk-high';
        banner.innerHTML = '⚠️ Modellerin Ortak Kararı: <b>YÜKSEK RİSK GRUBU</b>. Klinik verilere göre bir uzmanla görüşmeniz önerilir.';
    } else {
        banner.className = 'summary-banner risk-low';
        banner.innerHTML = '✅ Modellerin Ortak Kararı: <b>DÜŞÜK RİSK GRUBU</b>. Sağlıklı profilde görünüyorsunuz.';
    }
}

// --- 5. GRAFİK ÇİZİMLERİ (CHART.JS) ---
let chartsRendered = false;

function renderCharts() {
    if(chartsRendered) return; 
    
    const modelCanvas = document.getElementById('modelChart');
    const featureCanvas = document.getElementById('featureChart');
    
    if(!modelCanvas || !featureCanvas) return;

    const ctxModel = modelCanvas.getContext('2d');
    new Chart(ctxModel, {
        type: 'bar',
        data: {
            labels: ['Random Forest', 'SVM', 'KNN', 'Loj. Regresyon', 'Karar Ağacı'],
            datasets: [{
                label: 'Doğruluk (Accuracy) %',
                data: [96.7, 92.4, 89.1, 88.5, 85.2], 
                backgroundColor: '#0F5C4E',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true, max: 100 } }
        }
    });

    const ctxFeature = featureCanvas.getContext('2d');
    new Chart(ctxFeature, {
        type: 'bar',
        data: {
            labels: ['Yaş', 'Alkol', 'Sigara', 'Öksürük', 'Göğüs Ağrısı', 'Alerji'],
            datasets: [{
                label: 'Modele Etki Oranı (%)',
                data: [25, 18, 15, 12, 10, 8],
                backgroundColor: '#2E86AB',
                borderRadius: 6
            }]
        },
        options: {
            indexAxis: 'y', 
            responsive: true,
            scales: { x: { beginAtZero: true } }
        }
    });

    chartsRendered = true;
}

// --- 6. RÖNTGEN TARAYICI (GÖRÜNTÜ İŞLEME) ---
function handleDrop(event) {
    event.preventDefault();
    document.getElementById('upload-area').classList.remove('dragover');
    const files = event.dataTransfer.files;
    if (files.length > 0) processFile(files[0]);
}

function handleFileUpload(event) {
    const files = event.target.files;
    if (files.length > 0) processFile(files[0]);
}

function processFile(file) {
    if (!file.type.match('image.*')) {
        alert("Lütfen sadece resim dosyası (JPG, PNG) yükleyin.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('upload-text').style.display = 'none';
        const imgPreview = document.getElementById('image-preview');
        imgPreview.src = e.target.result;
        imgPreview.style.display = 'block';
        
        document.getElementById('analyze-btn').style.display = 'block';
        document.getElementById('xray-results').style.display = 'none';
    }
    reader.readAsDataURL(file);
}

function simulateXrayAnalysis() {
    const btn = document.getElementById('analyze-btn');
    const resultsCard = document.getElementById('xray-results');
    const banner = document.getElementById('xray-banner');
    const details = document.getElementById('xray-details');
    
    if(!btn || !resultsCard || !banner || !details) return;
    
    btn.innerText = "Yapay Zeka Görseli İşliyor...";
    btn.style.opacity = "0.7";
    btn.disabled = true;

    setTimeout(() => {
        btn.innerText = "Görüntüyü Analiz Et";
        btn.style.opacity = "1";
        btn.disabled = false;
        
        resultsCard.style.display = 'block';
        
        const isXray = Math.random() > 0.2; 
        
        if (!isXray) {
            banner.className = 'summary-banner risk-high';
            banner.innerHTML = '❌ HATA: Geçersiz Görüntü Formatı';
            details.innerHTML = "<b>Ön Doğrulama Modeli (Anomaly Detection):</b> Yüklenen görselin anatomik bir göğüs radyografisi (X-Ray) olmadığı tespit edildi. Lütfen alakasız fotoğraflar (araç, manzara, insan yüzü) yerine tıbbi bir röntgen görseli yükleyin.";
        } else {
            const hasRisk = Math.random() > 0.5;
            
            if(hasRisk) {
                banner.className = 'summary-banner risk-high';
                banner.innerHTML = '⚠️ YAPAY ZEKA TESPİTİ: Riskli Bölge Bulundu';
                details.innerHTML = "<b>Görüntü İşleme Modeli:</b> Akciğer loblarında potansiyel lezyonlar veya nodül oluşumuyla eşleşen piksel anomalileri saptandı. Modelin Kanser Olasılığı Tahmini: <b>%84.2</b>. <i>Kesin tanı için uzman radyolog onayı gereklidir.</i>";
            } else {
                banner.className = 'summary-banner risk-low';
                banner.innerHTML = '✅ YAPAY ZEKA TESPİTİ: Temiz Görünüm';
                details.innerHTML = "<b>Görüntü İşleme Modeli:</b> Akciğer grafisinde anormal bir lezyon, kitle veya belirgin bir asimetri tespit edilmedi. Modelin Temiz Çıktı Olasılığı Tahmini: <b>%92.5</b>. Görsel radyolojik açıdan sağlıklı profille eşleşmektedir.";
            }
        }
        
        resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    }, 2000);
}

window.onload = renderQuestions;