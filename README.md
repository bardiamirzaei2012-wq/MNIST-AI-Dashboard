# 🔢 MNIST AI – Handwritten Digit Recognition


## 📌 Overview

**MNIST AI** is a deep learning project designed to recognize handwritten digits (0–9) from user-drawn or uploaded images.

The system uses a custom-trained Convolutional Neural Network (CNN) based on the MNIST dataset to classify handwritten digits with high accuracy.

It combines a TensorFlow-based prediction engine, OpenCV image preprocessing, and a Flask web application with an interactive drawing canvas and analytics dashboard.

## 🎯 Model Performance

<details>
<summary><strong>Training and Validation Results</strong></summary>

| Metric | Result |
|---|---:|
| Training Accuracy | 99.02% |
| Validation Accuracy | 99.57% |
| Training Loss | 0.0365 |
| Validation Loss | 0.0156 |
| Training Epochs | 25 |
| Number of Classes | 10 |

</details>

<badge color="success">99.57% Validation Accuracy</badge>

*Results are based on the saved training history. Actual performance on user-uploaded images may differ.*

## ✨ Features

### ✍️ Handwritten Digit Recognition
- Recognize handwritten digits from 0 to 9.
- Draw digits directly on an interactive canvas.
- Upload handwritten digit images.
- Display predicted digits instantly.
- Calculate prediction confidence.

### 🧠 Deep Learning Model
- Custom CNN architecture.
- Multiple convolutional layers.
- Batch Normalization.
- Max Pooling.
- Dropout for regularization.
- Fully connected classification layers.
- Trained using the MNIST dataset.

### 🖼️ Image Processing
- Grayscale image conversion.
- Image resizing to 28×28 pixels.
- Gaussian Blur.
- Binary thresholding.
- Automatic foreground/background inversion.
- Pixel normalization.

### 📊 Analytics Dashboard
- Training accuracy visualization.
- Validation accuracy visualization.
- Training and validation loss charts.
- Prediction probability distribution.
- Prediction speed monitoring.
- Model architecture information.
- Model parameter statistics.
- Server and model health monitoring.

### 📚 Prediction History
- Save previous predictions.
- Store confidence scores.
- Record prediction timestamps.
- View recent prediction history.
- Clear prediction history.

### 🌐 Web Application
- Flask-powered backend.
- Interactive frontend.
- Responsive dashboard.
- AJAX-based prediction requests.
- Real-time result updates.

## 🛠️ Technologies

| Technology | Purpose |
|---|---|
| Python | Core programming |
| TensorFlow / Keras | Deep learning and model training |
| CNN | Image classification |
| OpenCV | Image preprocessing |
| NumPy | Numerical operations |
| Flask | Backend and REST API |
| HTML5 | Web interface |
| CSS3 | Styling and responsive design |
| JavaScript | Frontend interactions |
| Chart.js | Analytics visualization |

## 🧠 Model Architecture

The project uses a custom Convolutional Neural Network consisting of two convolutional blocks and fully connected layers.

```text
Input Image (28 × 28 × 1)
          |
          v
   Conv2D (32 filters)
          |
   Batch Normalization
          |
   Conv2D (32 filters)
          |
      MaxPooling
          |
       Dropout
          |
          v
   Conv2D (64 filters)
          |
   Batch Normalization
          |
   Conv2D (64 filters)
          |
      MaxPooling
          |
       Dropout
          |
          v
        Flatten
          |
    Dense (256)
          |
       Dropout
          |
    Dense (128)
          |
    Dense (10)
          |
          v
   Digit Classification
       (0 - 9)
```

### Training Configuration

- Dataset: MNIST
- Input Shape: 28 × 28 × 1
- Optimizer: Adam
- Loss Function: Sparse Categorical Crossentropy
- Batch Size: 128
- Training Epochs: 25
- Data Augmentation: Rotation, Zoom, Width Shift, Height Shift

## 📁 Project Structure

```text
MNIST-AI/
│
├── app.py
├── model.h5
│
├── prediction_history.json
├── training_history.json
│
├── modelp/
│   └── Model.ipynb
│
├── templates/
│   ├── index.html
│   └── analytics.html
│
└── static/
    ├── css/
    │   └── style.css
    │
    └── js/
        ├── script.js
        └── analytics.js
```

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/MNIST-AI.git

cd MNIST-AI
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

Activate the environment:

**Windows:**
```bash
venv\Scripts\activate
```

**Linux / macOS:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install tensorflow opencv-python numpy flask
```

### 4. Run the Application

```bash
python app.py
```

### 5. Open in Browser

```text
http://127.0.0.1:5000
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Main application |
| `/analytics` | GET | Analytics dashboard |
| `/predict` | POST | Predict handwritten digits |
| `/history` | GET | Retrieve prediction history |
| `/clear-history` | POST | Clear prediction history |
| `/analytics-data` | GET | Retrieve analytics data |
| `/training-history` | GET | Retrieve training metrics |
| `/model-summary` | GET | Retrieve model architecture |
| `/system-info` | GET | Retrieve system information |
| `/health` | GET | Check server and model status |

## 🔄 Prediction Workflow

```text
User Draws or Uploads an Image
              |
              v
       Flask API Request
              |
              v
      OpenCV Preprocessing
              |
              v
       Resize to 28×28
              |
              v
       Pixel Normalization
              |
              v
        CNN Model (Keras)
              |
              v
      Probability Calculation
              |
              v
       Predicted Digit + Confidence
              |
              v
       Save Prediction History
              |
              v
        Display Dashboard
```

## 🔮 Future Improvements

- [ ] Improve recognition of real-world handwriting.
- [ ] Add support for multiple-digit recognition.
- [ ] Add model evaluation and confusion matrix generation.
- [ ] Export predictions as CSV reports.
- [ ] Add prediction confidence visualization.
- [ ] Improve image preprocessing and noise removal.
- [ ] Support additional handwritten character datasets.
- [ ] Deploy the application online.

## 👨‍💻 Developer

**Bardia Mirzaei**

AI & Software Development Enthusiast

- GitHub: [@bardiamirzaei2012-dev](https://github.com/bardiamirzaei2012-dev)
- Website: [bardiamirzaei.com](https://bardiamirzaei.com)

## 📄 License

This project is available for educational and research purposes. Add an appropriate open-source license before redistribution.

