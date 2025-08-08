import { takeSelfie } from './selfieModule.js';

const video = document.getElementById('webcam');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');

let detector;
let handDetector;
let hasTakenSelfie = false;

const glassesImg = new Image();
glassesImg.src = './assets/glasses.png'; // Your overlay PNG

// Initialize pose detector
async function initPoseDetector() {
    detector = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
        runtime: 'mediapipe',
        modelType: 'full',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose'
    });
    console.log("Pose detector initialized.");
}

// Initialize hand detector
async function initHandDetector() {
    handDetector = await handPoseDetection.createDetector(
        handPoseDetection.SupportedModels.MediaPipeHands,
        {
            runtime: 'mediapipe',
            modelType: 'full',
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands'
        }
    );
    console.log("Hand detector initialized.");
}


// Webcam setup and detection loop
async function setupWebcamAndStart() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
        },
        audio: false
    });

    video.srcObject = stream;

    video.onloadedmetadata = async () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        console.log("Video resolution:", video.videoWidth, video.videoHeight);

        await initPoseDetector();
        await initHandDetector();
        requestAnimationFrame(predictLoop);
    };

    document.getElementById('zoom').addEventListener('input', e => {
        const zoom = e.target.value;
        video.style.transform = `scale(${zoom}) scaleX(-1)`;
    });
}

// Countdown and selfie logic
function startSelfieCountdown(video) {
    const overlay = document.getElementById('countdown-overlay');
    let counter = 3;
    overlay.style.display = 'block';
    overlay.textContent = `Taking selfie in ${counter}...`;

    const countdown = setInterval(() => {
        counter--;
        if (counter > 0) {
            overlay.textContent = `Taking selfie in ${counter}...`;
        } else {
            clearInterval(countdown);
            overlay.style.display = 'none';

            const selfieUrl = takeSelfie(video);
            downloadSelfie(selfieUrl);
            showSelfiePopup(selfieUrl);
            addToGallery(selfieUrl);
            console.log("Selfie taken!");
        }
    }, 1000);
}
function downloadSelfie(selfieUrl) {
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = selfieUrl;
    a.download = `selfie-${timestamp}.png`; // e.g., selfie-2025-08-08T15-12-05.png
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Main prediction loop
async function predictLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const poses = await detector.estimatePoses(video, {
        maxPoses: 1,
        flipHorizontal: true
    });

    if (poses.length > 0) {
        const keypoints = poses[0].keypoints;
        drawKeypoints(keypoints);
        drawSkeleton(keypoints);

        const nose = keypoints.find(k => k.name === 'nose');
        const rightWrist = keypoints.find(k => k.name === 'right_wrist');

        if (nose && rightWrist && nose.score > 0.5 && rightWrist.score > 0.5 && rightWrist.y < nose.y && !hasTakenSelfie) {
            console.log("Hand raised. Starting countdown...");
            startSelfieCountdown(video);
            hasTakenSelfie = true;
            setTimeout(() => hasTakenSelfie = false, 5000);
        }
    }

    const hands = await handDetector.estimateHands(video, { flipHorizontal: true });
    if (hands.length > 0) {
        drawHandLandmarks(hands[0].keypoints);
        if (detectPeaceSign(hands[0]) && !hasTakenSelfie) {
            console.log("✌️ Peace sign detected.");
            startSelfieCountdown(video);
            hasTakenSelfie = true;
            setTimeout(() => hasTakenSelfie = false, 5000);
        }
    }


    requestAnimationFrame(predictLoop);
}

// Draw functions
function drawKeypoints(keypoints) {
    for (const kp of keypoints) {
        if (kp.score > 0.5) {
            ctx.beginPath();
            ctx.arc(kp.x, kp.y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = 'lime';
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}

function drawSkeleton(keypoints) {
    const pairs = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.BlazePose);
    ctx.strokeStyle = 'cyan';
    ctx.lineWidth = 2;
    for (const [i, j] of pairs) {
        const kp1 = keypoints[i], kp2 = keypoints[j];
        if (kp1.score > 0.5 && kp2.score > 0.5) {
            ctx.beginPath();
            ctx.moveTo(kp1.x, kp1.y);
            ctx.lineTo(kp2.x, kp2.y);
            ctx.stroke();
        }
    }
}

function drawHandLandmarks(keypoints) {
    ctx.strokeStyle = 'yellow';
    ctx.fillStyle = 'orange';
    ctx.lineWidth = 2;
    for (const p of keypoints) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}

function detectPeaceSign(hand) {
    const k = hand.keypoints3D || hand.keypoints;
    const index = k.find(p => p.name === 'index_finger_tip');
    const middle = k.find(p => p.name === 'middle_finger_tip');
    const ring = k.find(p => p.name === 'ring_finger_tip');
    const pinky = k.find(p => p.name === 'pinky_finger_tip');
    const wrist = k.find(p => p.name === 'wrist');

    if (!index || !middle || !wrist) return false;
    const raised = [index, middle, ring, pinky].filter(t => t.y < wrist.y);

    return (
        raised.length === 2 &&
        index.y < wrist.y &&
        middle.y < wrist.y &&
        ring.y > wrist.y &&
        pinky.y > wrist.y
    );
}

// 👓 Draw glasses effect
function drawGlasses(leftEye, rightEye) {
    if (!glassesImg.complete || leftEye.length === 0 || rightEye.length === 0) return;

    const x1 = leftEye[0].x, y1 = leftEye[0].y;
    const x2 = rightEye[3].x, y2 = rightEye[3].y;
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const dx = x2 - x1, dy = y2 - y1;
    const angle = Math.atan2(dy, dx);
    const width = Math.sqrt(dx * dx + dy * dy) * 2.2;
    const height = width / 3;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.drawImage(glassesImg, -width / 2, -height / 2, width, height);
    ctx.restore();
}

// 📸 Selfie popup and gallery
function showSelfiePopup(dataUrl) {
    const container = document.querySelector('.container');
    const img = document.createElement('img');
    img.src = dataUrl;
    img.className = 'selfie-img';

    const downloadBtn = document.createElement('a');
    downloadBtn.href = dataUrl;
    downloadBtn.download = 'selfie.png';
    downloadBtn.textContent = 'Download Selfie';
    downloadBtn.className = 'download-btn';

    const oldImg = container.querySelector('.selfie-img');
    const oldBtn = container.querySelector('.download-btn');
    if (oldImg) oldImg.remove();
    if (oldBtn) oldBtn.remove();

    container.appendChild(img);
    container.appendChild(downloadBtn);
}

function addToGallery(dataUrl) {
    const gallery = document.getElementById('gallery');
    const img = document.createElement('img');
    img.src = dataUrl;
    img.className = 'gallery-img';
    gallery.appendChild(img);

    let selfies = JSON.parse(localStorage.getItem('selfies') || '[]');
    selfies.push(dataUrl);
    localStorage.setItem('selfies', JSON.stringify(selfies));
}

// 📦 On page load
window.onload = async () => {
    await setupWebcamAndStart();

    const saved = JSON.parse(localStorage.getItem('selfies') || '[]');
    for (const url of saved) {
        addToGallery(url);
    }
};
