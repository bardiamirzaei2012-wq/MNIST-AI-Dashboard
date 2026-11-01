// ==========================================
// MNIST AI Dashboard
// Part 1
// ==========================================

// Canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const predictUploadBtn = document.getElementById("predictUpload");
const deleteUploadBtn = document.getElementById("deleteUpload");
// Elements
const predictBtn = document.getElementById("predictBtn");
const clearCanvasBtn = document.getElementById("clearCanvas");
const predictTopBtn = document.getElementById("predictTop");
const clearTopBtn = document.getElementById("clearTop");
const imageUpload = document.getElementById("imageUpload");
const preview = document.getElementById("preview");

// Drawing
let drawing = false;

// ==========================================
// Canvas Initialize
// ==========================================

function initCanvas(){

    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

}

initCanvas();


// ==========================================
// Mouse Position
// ==========================================

function getMousePosition(e){

    const rect = canvas.getBoundingClientRect();

    return{

        x:e.clientX-rect.left,

        y:e.clientY-rect.top

    }

}


// ==========================================
// Start Draw
// ==========================================

function startDrawing(e){

    drawing=true;

    const pos=getMousePosition(e);

    ctx.beginPath();

    ctx.moveTo(pos.x,pos.y);

}


// ==========================================
// Draw
// ==========================================

function draw(e){

    if(!drawing) return;

    const pos=getMousePosition(e);

    ctx.lineTo(pos.x,pos.y);

    ctx.stroke();

}


// ==========================================
// Stop Draw
// ==========================================

function stopDrawing(){

    drawing=false;

}


// ==========================================
// Mouse Events
// ==========================================

canvas.addEventListener("mousedown",startDrawing);

canvas.addEventListener("mousemove",draw);

canvas.addEventListener("mouseup",stopDrawing);

canvas.addEventListener("mouseleave",stopDrawing);


// ==========================================
// Touch Support
// ==========================================

canvas.addEventListener("touchstart",(e)=>{

    e.preventDefault();

    const touch=e.touches[0];

    startDrawing({

        clientX:touch.clientX,

        clientY:touch.clientY

    });

});

canvas.addEventListener("touchmove",(e)=>{

    e.preventDefault();

    const touch=e.touches[0];

    draw({

        clientX:touch.clientX,

        clientY:touch.clientY

    });

});

canvas.addEventListener("touchend",()=>{

    stopDrawing();

});


// ==========================================
// Clear Canvas
// ==========================================
function clearCanvas(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    uploadedFile = null;
    imageUpload.value = "";

    preview.src = "";
    preview.style.display = "none";

    document.getElementById("uploadContent").style.display = "flex";
}
// function clearCanvas(){

//     ctx.clearRect(

//         0,

//         0,

//         canvas.width,

//         canvas.height


// uploadedFile = e.target.files[0];

// preview.src = URL.createObjectURL(uploadedFile);
// preview.style.display = "block";

// document.getElementById("uploadContent").style.display = "none";

// uploadedFile = null;

// imageUpload.value = "";

// preview.src = "";
// preview.style.display = "none";

// document.getElementById("uploadContent").style.display = "flex";
//     );

//     ctx.fillStyle="black";

//     ctx.fillRect(

//         0,

//         0,

//         canvas.width,

//         canvas.height

//     );

//     preview.src="";

//     preview.style.display="none";

// }

clearCanvasBtn.addEventListener(

    "click",

    clearCanvas

);

clearTopBtn.addEventListener(

    "click",

    clearCanvas

);


// ==========================================
// Upload Image
// ==========================================
let uploadedFile = null;

imageUpload.addEventListener("change", function(e){

    if(!e.target.files.length) return;

    uploadedFile = e.target.files[0];

    preview.src = URL.createObjectURL(uploadedFile);

    preview.onload = function(){

        preview.style.display = "block";

        // مخفی شدن Click to Upload
        uploadContent.style.display = "none";
    }

});

// ==========================================
// Canvas To Blob
// ==========================================

function canvasToBlob(){

    return new Promise((resolve)=>{

        canvas.toBlob(

            resolve,

            "image/png"

        );

    });

}
// ==========================================
// Predict
// ==========================================

async function predictImage(){

    showLoading();

    try{

        const formData = new FormData();

        // اگر تصویر آپلود شده باشد
        if(uploadedFile){

            formData.append(
                "image",
                uploadedFile
            );

        }

        // در غیر اینصورت Canvas ارسال می‌شود
        else{

            const blob = await canvasToBlob();

            formData.append(
                "image",
                blob,
                "canvas.png"
            );

        }

        const response = await fetch("/predict",{

            method:"POST",

            body:formData

        });

        if(!response.ok){

            throw new Error("Server Error");

        }

        const data = await response.json();

        if(data.error){

            hideLoading();

            showToast(data.error,"error");

            return;

        }

        updatePrediction(data);

        updateProbability(data.probabilities);

        addHistory(data);

        updateDashboard(data);

        hideLoading();

        showToast("Prediction Completed");

    }

    catch(error){

        hideLoading();

        console.error(error);

        showToast(

            "Prediction Completed",

            "succeus"

        );

    }

}


// ==========================================
// Buttons
// ==========================================

predictBtn.addEventListener(

    "click",

    predictImage

);

predictTopBtn.addEventListener(

    "click",

    predictImage

);


// ==========================================
// Update Prediction
// ==========================================

function updatePrediction(data){

    document.getElementById(

        "predictionResult"

    ).textContent=data.number;

    document.getElementById(

        "confidence"

    ).textContent=

        data.confidence+"%";

    const lastPrediction=

        document.getElementById(

            "lastPrediction"

        );

    if(lastPrediction)

        lastPrediction.textContent=

            data.number;

    const lastConfidence=

        document.getElementById(

            "lastConfidence"

        );

    if(lastConfidence)

        lastConfidence.textContent=

            data.confidence+"%";

}


// ==========================================
// Update Dashboard
// ==========================================

function updateDashboard(data){

    const predictionCount=

        document.getElementById(

            "predictionCount"

        );

    if(predictionCount){

        predictionCount.textContent=

            parseInt(

                predictionCount.textContent

            )+1;

    }

}


// ==========================================
// Loading
// ==========================================

function showLoading(){

    const loader=

        document.getElementById(

            "loadingScreen"

        );

    if(loader)

        loader.style.display="flex";

}

function hideLoading(){

    const loader=

        document.getElementById(

            "loadingScreen"

        );

    if(loader)

        loader.style.display="none";

}


// ==========================================
// Toast
// ==========================================

function showToast(

    message,

    type="success"

){

    const toast=

        document.getElementById("toast");

    const text=

        document.getElementById("toastText");

    if(!toast || !text)

        return;

    text.textContent=message;

    if(type==="error"){

        toast.style.background="#ef4444";

    }

    else{

        toast.style.background="#22c55e";

    }

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}


// ==========================================
// Hide Loader On Start
// ==========================================

window.addEventListener(

    "load",

    ()=>{

        hideLoading();

    }

);
// ==========================================
// Probability Bars
// ==========================================

function updateProbability(probabilities){

    const container=document.getElementById(
        "probabilityContainer"
    );

    if(!container) return;

    container.innerHTML="";

    probabilities.forEach((value,index)=>{

        const row=document.createElement("div");

        row.className="probabilityRow";

        row.innerHTML=`

            <span class="digitLabel">

                ${index}

            </span>

            <div class="progress">

                <div
                    class="progressFill"
                    style="width:${value}%">

                </div>

            </div>

            <span class="percent">

                ${value.toFixed(2)}%

            </span>

        `;

        container.appendChild(row);

    });

}
// ==========================================
// Load Prediction History
// ==========================================

async function loadHistory(){

    try{

        const response = await fetch("/history");

        const result = await response.json();

        const history = result.history;

        const body = document.getElementById(
            "historyBody"
        );

        if(!body) return;

        body.innerHTML = "";

        if(!history || history.length === 0){

            body.innerHTML = `

                <tr>

                    <td colspan="4">

                        No predictions yet...

                    </td>

                </tr>

            `;

            return;

        }

        history.forEach((item,index)=>{

            body.innerHTML += `

                <tr>

                    <td>${index + 1}</td>

                    <td>${item.digit}</td>

                    <td>${item.confidence}%</td>

                    <td>${item.timestamp}</td>

                </tr>

            `;

        });

    }

    catch(error){

        console.error("History Error:", error);

    }

}
// ==========================================
// Clear History
// ==========================================

const clearHistoryBtn=document.getElementById(
    "clearHistory"
);

if(clearHistoryBtn){

    clearHistoryBtn.addEventListener(

        "click",

        async()=>{

            const response=await fetch(

                "/clear-history",

                {

                    method:"POST"

                }

            );

            const data=await response.json();

            showToast(data.message);

            loadHistory();

        }

    );

}

// Predict Uploaded Image
if (predictUploadBtn) {
    predictUploadBtn.addEventListener("click", () => {

        if (!uploadedFile) {
            showToast("Please upload an image first", "error");
            return;
        }

        predictImage();
    });
}


// Delete Uploaded Image
if (deleteUploadBtn) {
    deleteUploadBtn.addEventListener("click", ()=>{

        uploadedFile = null;

        imageUpload.value = "";

        preview.src = "";
        preview.style.display = "none";

        // دوباره نمایش Click to Upload
        uploadContent.style.display = "flex";
    });
}
// ==========================================
// Load History On Startup
// ==========================================

window.addEventListener(

    "load",

    ()=>{

        loadHistory();

    }

);
// ==========================================
// Analytics
// ==========================================

async function loadAnalytics(){

    try{

        const response = await fetch(

            "/analytics-data"

        );

        const data = await response.json();

        const accuracy = document.getElementById("accuracy");
        const speed = document.getElementById("speed");
        const avgConfidence = document.getElementById("avgConfidence");
        const predictionCount = document.getElementById("predictionCount");
        const layers = document.getElementById("layers");
        const params = document.getElementById("params");

        if(accuracy)
            accuracy.textContent = data.accuracy + "%";

        if(speed)
            speed.textContent = data.speed + " ms";

        if(avgConfidence)
            avgConfidence.textContent =
                data.average_confidence + "%";

        if(predictionCount)
            predictionCount.textContent =
                data.prediction_count;

        if(layers)
            layers.textContent =
                data.layers;

        if(params)
            params.textContent =
                data.parameters;

    }

    catch(error){

        console.log(error);

    }

}


// ==========================================
// System Information
// ==========================================

async function loadSystemInfo(){

    try{

        const response = await fetch(

            "/system-info"

        );

        const data = await response.json();

        const tf = document.getElementById("tfVersion");
        const opencv = document.getElementById("opencvVersion");
        const layerCount = document.getElementById("layerCount");
        const parameterCount = document.getElementById("parameterCount");

        if(tf)
            tf.textContent = data.tensorflow;

        if(opencv)
            opencv.textContent = data.opencv;

        if(layerCount)
            layerCount.textContent =
                data.model_layers;

        if(parameterCount)
            parameterCount.textContent =
                data.model_parameters.toLocaleString();

    }

    catch(error){

        console.log(error);

    }

}


// ==========================================
// Export History
// ==========================================

const exportBtn = document.getElementById(

    "exportJSON"

);

if(exportBtn){

    exportBtn.addEventListener(

        "click",

        async()=>{

            const response = await fetch(

                "/history"

            );

            const history = await response.json();

            const blob = new Blob(

                [

                    JSON.stringify(

                        history,

                        null,

                        4

                    )

                ],

                {

                    type:"application/json"

                }

            );

            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");

            a.href = url;

            a.download = "prediction_history.json";

            a.click();

            URL.revokeObjectURL(url);

            showToast(

                "History Exported"

            );

        }

    );

}


// ==========================================
// Refresh Button
// ==========================================

const refreshBtn = document.getElementById(

    "refreshStats"

);

if(refreshBtn){

    refreshBtn.addEventListener(

        "click",

        ()=>{

            loadAnalytics();

            loadSystemInfo();

            loadHistory();

            showToast(

                "Dashboard Updated"

            );

        }

    );

}


// ==========================================
// Auto Refresh
// ==========================================
setInterval(async()=>{

await loadHistory();
await loadAnalytics();

},1000);

// ==========================================
// Initial Load
// ==========================================

window.addEventListener(

    "load",

    ()=>{

        loadAnalytics();

        loadSystemInfo();

    }

);
// ==========================================
// Health Check
// ==========================================

async function checkHealth(){

    try{

        const response = await fetch("/health");

        const data = await response.json();

        if(data.status === "online"){

            console.log("✅ Server Online");

        }else{

            console.log("❌ Server Offline");

        }

    }

    catch(error){

        console.log("Server Error");

    }

}


// ==========================================
// Keyboard Shortcuts
// ==========================================

document.addEventListener("keydown",(e)=>{

    // Ctrl + Enter => Predict

    if(e.ctrlKey && e.key==="Enter"){

        e.preventDefault();

        predictImage();

    }

    // Ctrl + Delete => Clear

    if(e.ctrlKey && e.key==="Delete"){

        e.preventDefault();

        clearCanvas();

    }

    // Ctrl + R => Refresh Dashboard

    if(e.ctrlKey && e.key==="r"){

        e.preventDefault();

        loadAnalytics();

        loadSystemInfo();

        loadHistory();

        showToast("Dashboard Updated");

    }

});


// ==========================================
// Drag & Drop Upload
// ==========================================

const uploadBox=document.querySelector(".uploadBox");

if(uploadBox){

    uploadBox.addEventListener("dragover",(e)=>{

        e.preventDefault();

        uploadBox.classList.add("drag");

    });

    uploadBox.addEventListener("dragleave",()=>{

        uploadBox.classList.remove("drag");

    });

    uploadBox.addEventListener("drop",(e)=>{

        e.preventDefault();

        uploadBox.classList.remove("drag");

        if(e.dataTransfer.files.length===0)

            return;

            uploadedFile = e.target.files[0];

            preview.src = URL.createObjectURL(uploadedFile);
            preview.style.display = "block";

            document.getElementById("uploadContent").style.display = "none";
    });

}


// ==========================================
// Auto Hide Loader
// ==========================================

window.addEventListener("load",()=>{

    setTimeout(()=>{

        hideLoading();

    },500);

});


// ==========================================
// Prevent Image Drag
// ==========================================

document.querySelectorAll("img").forEach(img=>{

    img.draggable=false;

});


// ==========================================
// Resize Canvas
// ==========================================

window.addEventListener("resize",()=>{

    ctx.lineWidth=18;

});


// ==========================================
// Welcome Toast
// ==========================================

window.addEventListener("load",()=>{

    setTimeout(()=>{

        showToast(

            "Welcome to MNIST AI Dashboard"

        );

    },1000);

});


// ==========================================
// Periodic Health Check
// ==========================================

setInterval(()=>{

    checkHealth();

},30000);


// ==========================================
// Startup
// ==========================================

window.onload=()=>{

    initCanvas();

    hideLoading();

    loadAnalytics();

    loadSystemInfo();

    loadHistory();

    checkHealth();

    console.log(

        "🚀 MNIST AI Dashboard Ready"

    );

};