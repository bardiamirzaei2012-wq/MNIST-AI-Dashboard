from flask import (
    Flask,
    render_template,
    request,
    jsonify
)

import tensorflow as tf
import numpy as np
import cv2
import os
import json
import time

from datetime import datetime

# ==========================================
# Flask
# ==========================================

app = Flask(__name__)

# ==========================================
# Configuration
# ==========================================

MODEL_PATH = "model.h5"

PREDICTION_HISTORY = "prediction_history.json"

TRAINING_HISTORY = "training_history.json"

# ==========================================
# Load Model
# ==========================================

if not os.path.exists(MODEL_PATH):

    raise FileNotFoundError(

        f"Model not found : {MODEL_PATH}"

    )

model = tf.keras.models.load_model(

    MODEL_PATH

)

print("✅ TensorFlow Model Loaded")

# ==========================================
# Prediction History
# ==========================================

if not os.path.exists(PREDICTION_HISTORY):

    with open(

        PREDICTION_HISTORY,

        "w",

        encoding="utf-8"

    ) as f:

        json.dump(

            [],

            f,

            indent=4,

            ensure_ascii=False

        )

# ==========================================
# Training History
# ==========================================

training_history = {}

if os.path.exists(TRAINING_HISTORY):

    try:

        with open(
            TRAINING_HISTORY,
            "r",
            encoding="utf-8"
        ) as f:

            training_history = json.load(f)

    except (json.JSONDecodeError, FileNotFoundError):

        training_history = {}

# ==========================================
# Runtime Statistics
# ==========================================

prediction_count = 0

average_confidence = 0

last_prediction = "-"

last_confidence = 0

last_prediction_time = 0

last_probabilities = [0] * 10

model_layers = len(model.layers)

model_parameters = model.count_params()

# ==========================================
# Prediction History Functions
# ==========================================

def load_prediction_history():

    try:

        with open(

            PREDICTION_HISTORY,

            "r",

            encoding="utf-8"

        ) as f:

            data = json.load(f)

        if isinstance(data, list):

            return data

        return []

    except Exception:

        return []


def save_prediction_history(data):

    with open(

        PREDICTION_HISTORY,

        "w",

        encoding="utf-8"

    ) as f:

        json.dump(

            data,

            f,

            indent=4,

            ensure_ascii=False

        )


def add_prediction_history(

    digit,

    confidence,

    prediction_time

):

    history = load_prediction_history()

    history.insert(

        0,

        {

            "digit": int(digit),

            "confidence": round(

                float(confidence),

                2

            ),

            "prediction_time": round(

                float(prediction_time),

                2

            ),

            "timestamp":

            datetime.now().strftime(

                "%Y-%m-%d %H:%M:%S"

            )

        }

    )

    history = history[:100]

    save_prediction_history(history)
    # ==========================================
# Home
# ==========================================

@app.route("/")
def home():

    return render_template(

        "index.html"

    )


# ==========================================
# Analytics
# ==========================================

@app.route("/analytics")
def analytics():

    return render_template(

        "analytics.html"

    )


# ==========================================
# Training History API
# ==========================================

@app.route("/training-history")
def training_history_api():

    return jsonify(

        training_history

    )


# ==========================================
# Prediction History API
# ==========================================

@app.route("/history")
def prediction_history_api():

    return jsonify({

        "history":

        load_prediction_history()

    })


# ==========================================
# Clear Prediction History
# ==========================================

@app.route(

    "/clear-history",

    methods=["POST"]

)
def clear_history():

    global prediction_count
    global average_confidence
    global last_prediction
    global last_confidence
    global last_prediction_time
    global last_probabilities

    prediction_count = 0

    average_confidence = 0

    last_prediction = "-"

    last_confidence = 0

    last_prediction_time = 0

    last_probabilities = [0] * 10

    save_prediction_history([])

    return jsonify({

        "success": True,

        "message":

        "Prediction history cleared"

    })


# ==========================================
# Predict
# ==========================================

@app.route(

    "/predict",

    methods=["POST"]

)
def predict():

    global prediction_count
    global average_confidence
    global last_prediction
    global last_confidence
    global last_prediction_time
    global last_probabilities

    if "image" not in request.files:

        return jsonify({

            "success": False,

            "message":

            "No image uploaded"

        }), 400

    file = request.files["image"]

    image = cv2.imdecode(

        np.frombuffer(

            file.read(),

            np.uint8

        ),

        cv2.IMREAD_GRAYSCALE

    )

    if image is None:

        return jsonify({

            "success": False,

            "message":

            "Invalid image"

        }), 400

    # ======================================
    # Image Preprocessing
    # ======================================

    image = cv2.resize(

        image,

        (28, 28),

        interpolation=cv2.INTER_AREA

    )

    image = cv2.GaussianBlur(

        image,

        (3, 3),

        0

    )

    _, image = cv2.threshold(

        image,

        120,

        255,

        cv2.THRESH_BINARY

    )

    if np.mean(image) > 127:

        image = 255 - image

    image = image.astype(

        np.float32

    )

    image /= 255.0

    image = image.reshape(

        1,

        28,

        28,

        1

    )

    # ======================================
    # Prediction
    # ======================================

    start = time.time()

    prediction = model.predict(

        image,

        verbose=0

    )

    end = time.time()

    last_prediction_time = round(

        (end - start) * 1000,

        2

    )
        # ======================================
    # Softmax Probabilities
    # ======================================

    probabilities = tf.nn.softmax(

        prediction

    ).numpy()[0]

    number = int(

        np.argmax(probabilities)

    )

    confidence = round(

        float(

            probabilities[number] * 100

        ),

        2

    )

    probs = [

        round(

            float(p * 100),

            2

        )

        for p in probabilities

    ]

    # ======================================
    # Runtime Statistics
    # ======================================

    prediction_count += 1

    average_confidence = round(

        (

            average_confidence *

            (prediction_count - 1)

            +

            confidence

        )

        /

        prediction_count,

        2

    )

    last_prediction = number

    last_confidence = confidence

    last_probabilities = probs

    add_prediction_history(

        number,

        confidence,

        last_prediction_time

    )

    # ======================================
    # Response
    # ======================================

    return jsonify({

        "success": True,

        "number": number,

        "confidence": confidence,

        "prediction_time": last_prediction_time,

        "probabilities": probs

    })


# ==========================================
# Analytics Data
# ==========================================

@app.route("/analytics-data")
def analytics_data():

    accuracy = 0

    loss = 0

    val_accuracy = 0

    val_loss = 0

    if training_history:

        accuracy = round(

            training_history.get(

                "accuracy",

                [0]

            )[-1] * 100,

            2

        )

        loss = round(

            training_history.get(

                "loss",

                [0]

            )[-1],

            4

        )

        val_accuracy = round(

            training_history.get(

                "val_accuracy",

                [0]

            )[-1] * 100,

            2

        )

        val_loss = round(

            training_history.get(

                "val_loss",

                [0]

            )[-1],

            4

        )

    return jsonify({

        "accuracy": accuracy,

        "loss": loss,

        "val_accuracy": val_accuracy,

        "val_loss": val_loss,

        "layers": model_layers,

        "parameters": model_parameters,

        "speed": last_prediction_time,

        "prediction_count": prediction_count,

        "average_confidence": average_confidence,

        "number": last_prediction,

        "confidence": last_confidence,

        "probabilities": last_probabilities

    })


# ==========================================
# System Information
# ==========================================

@app.route("/system-info")
def system_info():

    return jsonify({

        "tensorflow": tf.__version__,

        "numpy": np.__version__,

        "opencv": cv2.__version__,

        "model_layers": model_layers,

        "model_parameters": model_parameters,

        "predictions": prediction_count

    })


# ==========================================
# Model Summary
# ==========================================
@app.route("/model-summary")
def model_summary():

    layers = []

    for layer in model.layers:

        layers.append({

            "name": layer.name,

            "type": layer.__class__.__name__,

            "output_shape": getattr(layer, "output_shape", None),

            "params": layer.count_params()

        })

    return jsonify(layers)
# @app.route("/model-summary")
# def model_summary():

#     summary = []

#     for layer in model.layers:

#         summary.append({

#             "name": layer.name,

#             "type": layer.__class__.__name__,

#             "output_shape": str(

#                 getattr(

#                     layer,

#                     "output_shape",

#                     "-"

#                 )

#             ),

#             "params": layer.count_params()

#         })

#     return jsonify(summary)


# ==========================================
# Health Check
# ==========================================

@app.route("/health")
def health():

    return jsonify({

        "status": "online",

        "model_loaded": True,

        "predictions": prediction_count

    })


# ==========================================
# Run Flask
# ==========================================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True

    )   