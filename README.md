# Selfie Project

A browser-based computer vision application for gesture-based interactions and selfie capture.


Live Demo: https://cephas2bn.github.io/Selfie_Project/

## Overview
This project utilizes TensorFlow.js and MediaPipe to create an interactive selfie application. Users can take selfies using hand gestures, with a countdown timer and zoom functionality. The selfies are stored in the browser's local storage, allowing users to revisit their captured images.

## Features
Live Webcam Feed – Works on desktop and mobile devices.
Gesture-Controlled Capture – Raise your right hand or make a ✌️ peace sign to trigger a selfie.
Countdown Overlay – 3-second countdown before capturing the image.
Zoom Control – Adjust camera zoom in real-time.
Download Button – Save selfies locally as PNG files.
Persistent Gallery – All selfies are stored in the browser's localStorage.
Responsive Design – Mobile-friendly layout.

## Technologies Used

HTML5, CSS3, JavaScript (Vanilla)
[TensorFlow.js](https://www.tensorflow.org/js)
[MediaPipe Pose](https://developers.google.com/mediapipe/solutions/vision/pose)
[MediaPipe Hands](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)

## Installation & Running Locally

1. Clone this repository
   ```bash
   git clone https://github.com/cephas2bn/selfie-project.git
   cd selfie-project
````

2. Run a local server
   If you have Python installed:

   ```bash
   # Python 3
   python -m http.server 8000
   ```

   Then open your browser and go to:

   ```
   http://localhost:8000
   ```

3. Allow camera permissions when prompted by the browser.

## Deployment to GitHub Pages

1. Push your code to a GitHub repository.
2. In your repository, go to Settings → Pages.
3. Under Source, select the branch (e.g., `main`) and root folder (`/`), then click Save.
4. Your app will be available at:

   ```
   https://cephas2bn.github.io/selfie-project/
   ```

## How to Use

1. Stand in front of your webcam.
2. Raise your right hand above your nose or make a ✌️ peace sign.
3. Wait for the 3-second countdown.
4. Your selfie appears with a Download button.
5. Selfies are also saved in the gallery at the bottom of the page.

## License

This project is licensed under the MIT License.

```

