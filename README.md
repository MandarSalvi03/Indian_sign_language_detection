

# 🤟 Indian Sign Language to Text & Speech Translator

> A real-time AI-powered system that translates **Indian Sign Language (ISL)** into **text** and **speech**, enabling inclusive communication for the specially-abled.

---

## 📌 Project Overview

This project was developed during our **6th semester (Jan–April 2025)** at **Datta Meghe College of Engineering**, Airoli, Navi Mumbai.
It aims to help individuals who are **deaf** or **blind** by recognizing hand gestures and converting them into understandable text and speech in **real-time**.

---

## 🎯 Objective

To build a **web-based application** that:

* Converts **ISL gestures** to **readable text**
* Converts text into **spoken audio**
* Runs efficiently with minimal latency

---

## 👨‍💻 Tech Stack Used

* **TensorFlow / Keras** – CNN-based gesture recognition
* **OpenCV** – Webcam input & image preprocessing
* **Mediapipe** – Real-time hand tracking
* **Flask** – Backend integration and server
* **React.js** – Frontend user interface
* **pyttsx3** – Offline text-to-speech conversion

---

## 🔬 Methodology

* **Data Collection**: Captured custom gesture dataset using webcam
* **Preprocessing**: Converted images to grayscale, resized them
* **Model Training**: Built and trained a CNN for 3 gesture classes
* **Real-Time Inference**: Used Mediapipe with Flask for gesture detection and prediction
* **Frontend Integration**: React-based UI with live output and speech feedback

---

## 🧪 How to Run

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/isl-to-text.git
   cd isl-to-text
   ```

2. Run the app:

   ```bash
   python app.py
   ```

That’s it! The project will automatically launch both backend and frontend.

---

## 📁 Model, Dataset & node\_modules

Due to size limitations, we’ve uploaded the following essential files on Google Drive:

✅ Pre-trained CNN Model (`model.h5`)
✅ Custom ISL Gesture Dataset
✅ Frontend `node_modules` folder

📥 **Download from this link:**
https://drive.google.com/drive/folders/1aJx8pG4i4istjnWy8It_5sIzlQ6k5LDx?usp=sharing

> Make sure to extract and place them in the correct folders (main folder) before running the project.

---

## 📊 Challenges Faced

* Limited gesture dataset affected accuracy
* Real-time gesture-to-speech integration
* Gesture variation due to lighting, angles, and hand speed
* Cross-browser frontend testing and responsiveness

---

## 🌍 Impact & Future Scope

* Enables **deaf and blind** users to communicate better
* Can scale to include **more ISL gestures**
* Future enhancements:

  * **Context-aware output** using NLP
  * **Mobile app version**
  * **Multiple language support**

---

## 👥 Team Members

* Vivek Rajak
* Soham Rane
* Mandar Salvi
* Vansh Wase

**Guided by:**
💡 Prof. Deepti Janjani

---

## 📚 References

* IEEE: *Real-Time American Sign Language Recognition*
* IEEE: *Vision-Based Sign Language Recognition using Deep CNNs*

---

## 🌐 Project Demo

🔗 Try it out here:
https://www.linkedin.com/in/mandarsalvi03/

---
