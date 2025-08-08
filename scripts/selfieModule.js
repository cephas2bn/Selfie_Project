// Selfie capture and save logic
// scripts/selfieModule.js

export function takeSelfie(videoElement) {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const ctx = canvas.getContext('2d');

    // Flip the canvas horizontally to match mirrored video
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const selfieDataUrl = canvas.toDataURL('image/png');
    return selfieDataUrl;
}



