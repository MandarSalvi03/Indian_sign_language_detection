// Initialize video element
const video = document.getElementById('video');
const predictionElement = document.getElementById('prediction');
const detectedLettersElement = document.getElementById('detected-letters');
const startButton = document.getElementById('start-button');
const clearButton = document.getElementById('clear-button');
const videoContainer = document.getElementById('video-container');

let isDetecting = false;
let detectionInterval;
let detectedLetters = [];

// Function to start video
async function startVideo() {
    try {
        console.log("Requesting camera access...");
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            } 
        });
        console.log("Camera access granted");
        video.srcObject = stream;
        
        // Wait for video to be loaded
        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                resolve();
            };
        });
        
        await video.play();
        console.log("Video started playing");
        
        // Enable start button once video is ready
        startButton.disabled = false;
        
    } catch (err) {
        console.error("Error accessing camera:", err);
        predictionElement.textContent = 'Error: Camera access denied';
        predictionElement.style.color = '#F44336';
    }
}

// Function to update prediction display
function updatePredictionDisplay(gesture, confidence) {
    console.log(`Updating display with gesture: ${gesture}, confidence: ${confidence}`);
    
    // Format the confidence to 1 decimal place
    const formattedConfidence = confidence.toFixed(1);
    
    // Update the prediction text
    predictionElement.textContent = `Detected: ${gesture} (${formattedConfidence}%)`;
    
    // Add visual feedback based on confidence
    if (confidence > 70) {
        predictionElement.style.color = '#4CAF50';
        predictionElement.style.backgroundColor = '#1b5e20';
        // Add to detected letters if confidence is high
        if (!detectedLetters.includes(gesture)) {
            detectedLetters.push(gesture);
            detectedLettersElement.textContent = detectedLetters.join(' ');
            // Add animation effect
            detectedLettersElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                detectedLettersElement.style.transform = 'scale(1)';
            }, 200);
        }
    } else if (confidence > 40) {
        predictionElement.style.color = '#FFA000';
        predictionElement.style.backgroundColor = '#4d3000';
    } else {
        predictionElement.style.color = '#F44336';
        predictionElement.style.backgroundColor = '#4d1c17';
    }
}

// Function to capture frame and send to server
async function captureAndDetect() {
    try {
        if (!video.videoWidth || !video.videoHeight) {
            console.warn("Video dimensions not available yet");
            return;
        }

        // Create canvas to capture frame
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get base64 image data
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        // Send to server
        const response = await fetch('http://localhost:5000/detect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Received response from server:", data);
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Update prediction display
        updatePredictionDisplay(data.gesture, data.confidence);
        
    } catch (error) {
        console.error('Error in detection:', error);
        predictionElement.textContent = 'Error: Detection failed';
        predictionElement.style.color = '#F44336';
        predictionElement.style.backgroundColor = '#4d1c17';
    }
}

// Function to clear detected letters
function clearLetters() {
    detectedLetters = [];
    detectedLettersElement.textContent = '';
    console.log("Cleared detected letters");
}

// Function to check server health
async function checkServerHealth() {
    try {
        console.log("Checking server health...");
        const response = await fetch('http://localhost:5000/health');
        if (!response.ok) {
            throw new Error(`Server health check failed: ${response.status}`);
        }
        const data = await response.json();
        console.log("Server health response:", data);
        return data.status === 'healthy';
    } catch (error) {
        console.error('Server health check failed:', error);
        return false;
    }
}

// Initialize the application
async function initialize() {
    try {
        console.log("Initializing application...");
        
        // Start video
        await startVideo();
        
        // Check server health
        const isServerHealthy = await checkServerHealth();
        if (!isServerHealthy) {
            console.error('Server is not responding. Please make sure the Flask server is running.');
            predictionElement.textContent = 'Error: Server not running';
            predictionElement.style.color = '#F44336';
            predictionElement.style.backgroundColor = '#4d1c17';
            return;
        }
        
        console.log("Application initialized successfully");
        
    } catch (error) {
        console.error('Initialization error:', error);
        predictionElement.textContent = 'Error: Failed to initialize';
        predictionElement.style.color = '#F44336';
        predictionElement.style.backgroundColor = '#4d1c17';
    }
}

// Event listeners
startButton.addEventListener('click', () => {
    if (!isDetecting) {
        console.log("Starting detection...");
        isDetecting = true;
        startButton.textContent = 'Stop Detection';
        startButton.style.backgroundColor = '#F44336';
        predictionElement.textContent = 'Detecting...';
        predictionElement.style.color = '#ffffff';
        predictionElement.style.backgroundColor = '#3d3d3d';
        detectionInterval = setInterval(captureAndDetect, 200); // Reduced from 100ms to 200ms for better performance
    } else {
        console.log("Stopping detection...");
        isDetecting = false;
        startButton.textContent = 'Start Detection';
        startButton.style.backgroundColor = '#4CAF50';
        predictionElement.textContent = 'Detection stopped';
        predictionElement.style.color = '#ffffff';
        predictionElement.style.backgroundColor = '#3d3d3d';
        clearInterval(detectionInterval);
    }
});

clearButton.addEventListener('click', clearLetters);

// Start the application when the page loads
document.addEventListener('DOMContentLoaded', initialize); 

// // Initialize video element
// const video = document.getElementById('video');
// const predictionElement = document.getElementById('prediction');
// const detectedLettersElement = document.getElementById('detected-letters');
// const startButton = document.getElementById('start-button');
// const clearButton = document.getElementById('clear-button');
// const videoContainer = document.getElementById('video-container');

// let isDetecting = false;
// let detectionInterval;
// let detectedLetters = [];

// // Function to start video
// async function startVideo() {
//     try {
//         console.log("Requesting camera access...");
//         const stream = await navigator.mediaDevices.getUserMedia({ 
//             video: {
//                 width: { ideal: 640 },
//                 height: { ideal: 480 },
//                 facingMode: 'user'
//             } 
//         });
//         console.log("Camera access granted");
//         video.srcObject = stream;
        
//         await new Promise((resolve) => {
//             video.onloadedmetadata = () => resolve();
//         });

//         await video.play();
//         console.log("Video started playing");
//         startButton.disabled = false;
        
//     } catch (err) {
//         console.error("Error accessing camera:", err);
//         predictionElement.textContent = 'Error: Camera access denied';
//         predictionElement.style.color = '#F44336';
//     }
// }

// // Update prediction display with color coding and animation
// function updatePredictionDisplay(gesture, confidence) {
//     const formattedConfidence = confidence.toFixed(1);
//     predictionElement.textContent = `Detected: ${gesture} (${formattedConfidence}%)`;

//     // Background and color logic
//     if (confidence > 70) {
//         predictionElement.style.color = '#4CAF50';
//         predictionElement.style.backgroundColor = '#1b5e20';

//         if (!detectedLetters.includes(gesture)) {
//             detectedLetters.push(gesture);
//             detectedLettersElement.textContent = detectedLetters.join(' ');

//             // Add animation
//             detectedLettersElement.style.transform = 'scale(1.1)';
//             setTimeout(() => {
//                 detectedLettersElement.style.transform = 'scale(1)';
//             }, 200);
//         }

//     } else if (confidence > 40) {
//         predictionElement.style.color = '#FFA000';
//         predictionElement.style.backgroundColor = '#4d3000';
//     } else {
//         predictionElement.style.color = '#F44336';
//         predictionElement.style.backgroundColor = '#4d1c17';
//     }
// }

// // Function to capture frame and send to server
// async function captureAndDetect() {
//     try {
//         if (!video.videoWidth || !video.videoHeight) {
//             console.warn("Video dimensions not available yet");
//             return;
//         }

//         const canvas = document.createElement('canvas');
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
//         const ctx = canvas.getContext('2d');
//         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//         const imageData = canvas.toDataURL('image/jpeg', 0.8);

//         const response = await fetch('http://localhost:5000/detect', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ image: imageData })
//         });

//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//         const data = await response.json();
//         if (data.error) throw new Error(data.error);

//         updatePredictionDisplay(data.gesture, data.confidence);

//     } catch (error) {
//         console.error('Error in detection:', error);
//         predictionElement.textContent = 'Error: Detection failed';
//         predictionElement.style.color = '#F44336';
//         predictionElement.style.backgroundColor = '#4d1c17';
//     }
// }

// function clearLetters() {
//     detectedLetters = [];
//     detectedLettersElement.textContent = '';
//     console.log("Cleared detected letters");
// }

// async function checkServerHealth() {
//     try {
//         const response = await fetch('http://localhost:5000/health');
//         if (!response.ok) throw new Error(`Server health check failed: ${response.status}`);
//         const data = await response.json();
//         return data.status === 'healthy';
//     } catch (error) {
//         console.error('Server health check failed:', error);
//         return false;
//     }
// }

// async function initialize() {
//     try {
//         console.log("Initializing application...");
//         await startVideo();

//         const isServerHealthy = await checkServerHealth();
//         if (!isServerHealthy) {
//             console.error('Server is not responding.');
//             predictionElement.textContent = 'Error: Server not running';
//             predictionElement.style.color = '#F44336';
//             predictionElement.style.backgroundColor = '#4d1c17';
//             return;
//         }

//         console.log("Application initialized successfully");

//     } catch (error) {
//         console.error('Initialization error:', error);
//         predictionElement.textContent = 'Error: Failed to initialize';
//         predictionElement.style.color = '#F44336';
//         predictionElement.style.backgroundColor = '#4d1c17';
//     }
// }

// // Event listeners
// startButton.addEventListener('click', () => {
//     if (!isDetecting) {
//         isDetecting = true;
//         startButton.textContent = 'Stop Detection';
//         startButton.style.backgroundColor = '#F44336';
//         predictionElement.textContent = 'Detecting...';
//         predictionElement.style.color = '#ffffff';
//         predictionElement.style.backgroundColor = '#3d3d3d';
//         detectionInterval = setInterval(captureAndDetect, 200);
//     } else {
//         isDetecting = false;
//         startButton.textContent = 'Start Detection';
//         startButton.style.backgroundColor = '#4CAF50';
//         predictionElement.textContent = 'Detection stopped';
//         predictionElement.style.color = '#ffffff';
//         predictionElement.style.backgroundColor = '#3d3d3d';
//         clearInterval(detectionInterval);
//     }
// });

// clearButton.addEventListener('click', clearLetters);
// document.addEventListener('DOMContentLoaded', initialize);
