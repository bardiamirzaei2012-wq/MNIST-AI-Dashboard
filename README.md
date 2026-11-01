🧠 MNIST AI Dashboard

An interactive web dashboard for handwritten digit recognition powered by deep learning



Preview • Features • Installation • Usage



📖 About the Project

MNIST AI Dashboard is a modern, interactive web application for recognizing handwritten digits (0–9) using a Convolutional Neural Network (CNN) trained on the famous MNIST dataset.

It combines a high-accuracy deep learning model with a clean, user-friendly interface. Users can draw digits directly on a canvas or upload an image, then instantly see the predicted digit along with confidence scores and detailed analytics.



✨ Features





🎨 Interactive Canvas – Draw digits with mouse or touch



📤 Image Upload – Upload handwritten digit images



⚡ Real-time Prediction – Instant results with confidence percentage



📊 Probability Distribution – Visual chart for all 10 digits



📈 Analytics Page – Training history and prediction statistics with Chart.js



🕒 Prediction History – Stores the last 100 predictions



📋 Model Summary – View architecture details and system information



🌙 Modern UI – Clean design with Font Awesome icons and Poppins font



📱 Responsive Design



🛠️ Tech Stack







Layer



Technology





Backend



Flask





Machine Learning



TensorFlow / Keras





Image Processing



OpenCV





Frontend



HTML5, CSS3, JavaScript





Charts



Chart.js





Icons



Font Awesome





Font



Poppins (Google Fonts)



🏗️ Model Architecture

The model is a Convolutional Neural Network (CNN) with the following structure:

Conv2D(32) → BatchNormalization → Conv2D(32) → MaxPooling → Dropout(0.25)
→ Conv2D(64) → BatchNormalization → Conv2D(64) → MaxPooling → Dropout(0.25)
→ Flatten → Dense(256) → Dropout(0.5) → Dense(128) → Dense(10)





Optimizer: Adam



Loss Function: SparseCategoricalCrossentropy (from_logits=True)



Epochs: 25



Final Training Accuracy: ~99.02%



Validation Accuracy: ~99.57%

The training notebook is located at modelp/Emodel.ipynb.



📂 Project Structure

Mnist/
├── app.py                      # Main Flask application
├── model.h5                    # Trained Keras model
├── training_history.json       # Model training history
├── prediction_history.json     # Prediction history log
├── modelp/
│   └── Emodel.ipynb            # Model training notebook
├── templates/
│   ├── index.html              # Main dashboard page
│   └── analytics.html          # Analytics page
└── static/
    ├── css/
    │   └── style.css
    └── js/
        ├── script.js           # Main page logic
        └── analytics.js        # Analytics page logic



🚀 Installation

Prerequisites





Python 3.9 or higher



pip

Setup Steps





Clone the repository:

git clone https://github.com/YOUR_USERNAME/Mnist.git
cd Mnist





Create a virtual environment (recommended):

python -m venv venv
source venv/bin/activate        # Linux / macOS
# or
venv\Scripts\activate           # Windows





Install dependencies:

pip install flask tensorflow opencv-python numpy





Run the application:

python app.py





Open in your browser:

http://localhost:5000



📖 Usage





Go to the main dashboard.



Draw a digit on the black canvas using your mouse or finger, or upload an image of a handwritten digit.



Click the Predict button.



View the predicted digit, confidence score, and probability distribution.



Visit the Analytics page to see training curves and prediction history.



🔌 API Endpoints







Method



Endpoint



Description





GET



/



Main dashboard page





GET



/analytics



Analytics page





POST



/predict



Upload image and get prediction





GET



/history



Retrieve prediction history





POST



/clear-history



Clear prediction history





GET



/training-history



Get model training history





GET



/model-summary



Model layers summary





GET



/system-info



System and library versions





GET



/health



Health check



📸 Preview



Add screenshots to a screenshots/ folder and update the links below for a better presentation.



🤝 Contributing

Contributions are welcome! If you have ideas for improvements:





Fork the repository



Create your feature branch (git checkout -b feature/AmazingFeature)



Commit your changes



Push to the branch



Open a Pull Request



📄 License

This project is licensed under the MIT License. See the LICENSE file for details.



Built with ❤️ and TensorFlow

If you find this project useful, please give it a ⭐!
