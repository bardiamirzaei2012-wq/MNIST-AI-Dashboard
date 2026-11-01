// ==========================================
// Analytics Dashboard
// Part 1
// ==========================================

// ---------- Statistics ----------

const speed =
document.getElementById("speed");

const predictionCount =
document.getElementById("predictionCount");

const avgConfidence =
document.getElementById("avgConfidence");

const layers =
document.getElementById("layers");

const params =
document.getElementById("params");

const lastPrediction =
document.getElementById("lastPrediction");

const lastConfidence =
document.getElementById("lastConfidence");

// ---------- Health ----------

const serverStatus =
document.getElementById("serverStatus");

const modelStatus =
document.getElementById("modelStatus");

const apiStatus =
document.getElementById("apiStatus");

// ---------- Charts ----------

let probabilityChart;

let accuracyChart;

let lossChart;

let speedChart;

let confusionChart;

// ==========================================
// Analytics Data
// ==========================================

async function loadAnalytics(){

    try{

        const response =
        await fetch("/analytics-data");

        const data =
        await response.json();

        speed.textContent =
        data.speed + " ms";

        predictionCount.textContent =
        data.prediction_count;

        avgConfidence.textContent =
        data.average_confidence + "%";

        layers.textContent =
        data.layers;

        params.textContent =
        Number(data.parameters).toLocaleString();

        lastPrediction.textContent =
        data.number;

        lastConfidence.textContent =
        data.confidence + "%";

        updateProbabilityChart(
            data.probabilities
        );

        updateSpeedChart(
            data.speed
        );

    }

    catch(error){

        console.error(error);

    }

}

// ==========================================
// Training History
// ==========================================

async function loadTrainingHistory(){

    try{

        const response =
        await fetch("/training-history");

        const history =
        await response.json();

        if(
            !history ||
            !history.accuracy
        ){
            return;
        }

        const labels =
        history.accuracy.map(
            (_,i)=>`Epoch ${i+1}`
        );

        // Accuracy

        accuracyChart.data.labels =
        labels;

        accuracyChart.data.datasets[0].data =
        history.accuracy.map(v=>v*100);

        accuracyChart.data.datasets[1].data =
        history.val_accuracy.map(v=>v*100);

        accuracyChart.update();

        // Loss

        lossChart.data.labels =
        labels;

        lossChart.data.datasets[0].data =
        history.loss;

        lossChart.data.datasets[1].data =
        history.val_loss;

        lossChart.update();

    }

    catch(error){

        console.error(error);

    }

}
// ==========================================
// Probability Chart
// ==========================================

function createProbabilityChart(){

    const ctx =
    document
    .getElementById("probabilityChart")
    .getContext("2d");

    probabilityChart = new Chart(ctx,{

        type:"bar",

        data:{

            labels:[
                "0","1","2","3","4",
                "5","6","7","8","9"
            ],

            datasets:[{

                label:"Probability (%)",

                data:new Array(10).fill(0),

                backgroundColor:[
                    "#2563eb",
                    "#2563eb",
                    "#2563eb",
                    "#2563eb",
                    "#2563eb",
                    "#2563eb",
                    "#2563eb",
                    "#2563eb",
                    "#2563eb",
                    "#2563eb"
                ],

                borderRadius:8

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{
                    display:false
                }

            },

            scales:{

                y:{

                    beginAtZero:true,

                    max:100

                }

            }

        }

    });

}

function updateProbabilityChart(values){

    if(!probabilityChart) return;

    probabilityChart.data.datasets[0].data = values;

    probabilityChart.update();

}


// ==========================================
// Accuracy Chart
// ==========================================

function createAccuracyChart(){

    const ctx =
    document
    .getElementById("accuracyChart")
    .getContext("2d");

    accuracyChart = new Chart(ctx,{

        type:"line",

        data:{

            labels:[],

            datasets:[

                {

                    label:"Training Accuracy",

                    data:[],

                    borderColor:"#10b981",

                    backgroundColor:"rgba(16,185,129,.15)",

                    fill:true,

                    tension:.35

                },

                {

                    label:"Validation Accuracy",

                    data:[],

                    borderColor:"#3b82f6",

                    backgroundColor:"rgba(59,130,246,.15)",

                    fill:false,

                    tension:.35

                }

            ]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            interaction:{

                mode:"index",

                intersect:false

            },

            scales:{

                y:{

                    min:0,

                    max:100

                }

            }

        }

    });

}


// ==========================================
// Loss Chart
// ==========================================

function createLossChart(){

    const ctx =
    document
    .getElementById("lossChart")
    .getContext("2d");

    lossChart = new Chart(ctx,{

        type:"line",

        data:{

            labels:[],

            datasets:[

                {

                    label:"Training Loss",

                    data:[],

                    borderColor:"#ef4444",

                    backgroundColor:"rgba(239,68,68,.15)",

                    fill:true,

                    tension:.35

                },

                {

                    label:"Validation Loss",

                    data:[],

                    borderColor:"#f59e0b",

                    backgroundColor:"rgba(245,158,11,.15)",

                    fill:false,

                    tension:.35

                }

            ]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            interaction:{

                mode:"index",

                intersect:false

            }

        }

    });

}
// ==========================================
// Speed Chart
// ==========================================

function createSpeedChart(){

    const ctx =
    document
    .getElementById("speedChart")
    .getContext("2d");

    speedChart = new Chart(ctx,{

        type:"line",

        data:{

            labels:[],

            datasets:[{

                label:"Prediction Time (ms)",

                data:[],

                borderColor:"#8b5cf6",

                backgroundColor:
                "rgba(139,92,246,.15)",

                fill:true,

                tension:.35

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            animation:false,

            scales:{

                y:{

                    beginAtZero:true

                }

            }

        }

    });

}

function updateSpeedChart(value){

    if(!speedChart) return;

    const time =
    new Date().toLocaleTimeString();

    speedChart.data.labels.push(time);

    speedChart.data.datasets[0].data.push(value);

    if(speedChart.data.labels.length>20){

        speedChart.data.labels.shift();

        speedChart.data.datasets[0].data.shift();

    }

    speedChart.update();

}


// ==========================================
// Confusion Chart
// ==========================================

function createConfusionChart(){

    const ctx =
    document
    .getElementById("confusionChart")
    .getContext("2d");

    confusionChart = new Chart(ctx,{

        type:"doughnut",

        data:{

            labels:[

                "Correct",

                "Incorrect"

            ],

            datasets:[{

                data:[99.63,0.37],

                backgroundColor:[

                    "#10b981",

                    "#ef4444"

                ],

                borderWidth:1

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    position:"bottom"

                }

            }

        }

    });

}


// ==========================================
// Health Check
// ==========================================

async function loadHealth(){

    try{

        const response =
        await fetch("/health");

        const health =
        await response.json();

        serverStatus.textContent =
        health.status;

        modelStatus.textContent =
        health.model_loaded
        ? "Loaded"
        : "Not Loaded";

        apiStatus.textContent =
        "Online";

    }

    catch(error){

        serverStatus.textContent =
        "Offline";

        apiStatus.textContent =
        "Offline";

        console.error(error);

    }

}


// ==========================================
// Model Summary
// ==========================================

async function loadModelSummary(){

    try{

        const response =
        await fetch("/model-summary");

        const layers =
        await response.json();

        const body =
        document.getElementById(
            "modelSummaryBody"
        );

        if(!body) return;

        body.innerHTML = "";

        layers.forEach(layer=>{

            body.innerHTML += `

            <tr>

                <td>${layer.name}</td>

                <td>${layer.type}</td>

                <td>${layer.output_shape}</td>

                <td>${Number(layer.params).toLocaleString()}</td>

            </tr>

            `;

        });

    }

    catch(error){

        console.error(error);

    }

}
// ==========================================
// System Information
// ==========================================

async function loadSystemInfo(){

    try{

        const response =
        await fetch("/system-info");

        const info =
        await response.json();

        document.getElementById(
            "tfVersion"
        ).textContent =
        info.tensorflow;

        document.getElementById(
            "numpyVersion"
        ).textContent =
        info.numpy;

        document.getElementById(
            "opencvVersion"
        ).textContent =
        info.opencv;

        document.getElementById(
            "layerCount"
        ).textContent =
        info.model_layers;

        document.getElementById(
            "parameterCount"
        ).textContent =
        Number(
            info.model_parameters
        ).toLocaleString();

        document.getElementById(
            "systemPredictions"
        ).textContent =
        info.predictions;

    }

    catch(error){

        console.error(error);

    }

}


// ==========================================
// Toast
// ==========================================

function showToast(message){

    const toast =
    document.getElementById("toast");

    const text =
    document.getElementById("toastText");

    if(!toast || !text) return;

    text.textContent = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}


// ==========================================
// Export JSON
// ==========================================

async function exportAnalytics(){

    try{

        const response =
        await fetch("/analytics-data");

        const data =
        await response.json();

        const blob =
        new Blob(

            [

                JSON.stringify(

                    data,

                    null,

                    4

                )

            ],

            {

                type:"application/json"

            }

        );

        const url =
        URL.createObjectURL(blob);

        const a =
        document.createElement("a");

        a.href = url;

        a.download =
        "analytics.json";

        a.click();

        URL.revokeObjectURL(url);

        showToast(

            "Analytics exported."

        );

    }

    catch(error){

        console.error(error);

    }

}


// ==========================================
// Refresh Dashboard
// ==========================================

async function refreshDashboard(){

    await loadAnalytics();

    await loadTrainingHistory();

    await loadHealth();

    await loadModelSummary();

    await loadSystemInfo();

    showToast(

        "Dashboard updated."

    );

}


// ==========================================
// Events
// ==========================================

document
.getElementById("refreshStats")
.addEventListener(

    "click",

    refreshDashboard

);


document
.getElementById("exportJSON")
.addEventListener(

    "click",

    exportAnalytics

);
// ==========================================
// Initialize Dashboard
// ==========================================

async function initializeDashboard(){

    createProbabilityChart();

    createAccuracyChart();

    createLossChart();

    createSpeedChart();

    createConfusionChart();

    await loadAnalytics();

    await loadTrainingHistory();

    await loadHealth();

    await loadModelSummary();

    await loadSystemInfo();

}


// ==========================================
// Auto Refresh
// ==========================================

setInterval(async()=>{

    await loadAnalytics();

    await loadHealth();

    await loadSystemInfo();

},5000);


// ==========================================
// Update After Prediction
// ==========================================

window.addEventListener(

    "prediction-completed",

    async()=>{

        await loadAnalytics();

        await loadHealth();

        await loadSystemInfo();

    }

);

async function loadModelArchitecture(){

    const response = await fetch("/model-summary");

    const layers = await response.json();

    const container = document.getElementById("modelArchitecture");

    container.innerHTML = "";

    layers.forEach((layer,index)=>{

        container.innerHTML += `

            <div class="layer-card">

                <div class="layer-title">
                    ${layer.type}
                </div>

                <div class="layer-name">
                    ${layer.name}
                </div>

                <div class="layer-info">
                    Parameters: ${layer.params.toLocaleString()}
                </div>

            </div>

            ${index < layers.length-1 ? '<div class="arrow">↓</div>' : ''}

        `;

    });

}
// ==========================================
// Window Load
// ==========================================

window.addEventListener(

    "load",

    initializeDashboard

);


// ==========================================
// Console
// ==========================================

console.log(

    "Analytics Dashboard Ready"

);