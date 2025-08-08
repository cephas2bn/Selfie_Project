import os

# Define the full folder and file structure
structure = {
    "selfie-project": {
        "style": {
            "styles.css": "/* Main stylesheet */"
        },
        "scripts": {
            "main.js": "// Entry point of the app\n",
            "poseHandler.js": "// Pose and posture detection logic\n",
            "gestureHandler.js": "// Hand signal recognition\n",
            "selfieModule.js": "// Selfie capture and save logic\n",
            "ui.js": "// UI rendering and canvas drawing\n",
            "actions.js": "// Triggering actions based on gestures\n"
        },
        "assets": {
            "sounds": {},
            "icons": {}
        },
        "models": {},
        "data": {
            "selfies": {}
        },
        "index.html": """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Selfie Project</title>
    <link rel="stylesheet" href="style/styles.css">
</head>
<body>
    <h1>Selfie Project</h1>
    <video id="webcam" autoplay></video>
    <canvas id="overlay"></canvas>
    <script src="scripts/main.js"></script>
</body>
</html>
""",
        "README.md": "# Selfie Project\n\nA browser-based computer vision application for gesture-based interactions and selfie capture."
    }
}

def create_structure(base_path, content):
    for name, value in content.items():
        path = os.path.join(base_path, name)
        if isinstance(value, dict):
            os.makedirs(path, exist_ok=True)
            create_structure(path, value)
        else:
            with open(path, "w", encoding="utf-8") as f:
                f.write(value)

# Run the structure creation
if __name__ == "__main__":
    print("Creating project structure...")
    create_structure(".", structure)
    print("✅ Selfie Project structure created successfully.")
