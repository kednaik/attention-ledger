let keyCount = 0;
let startTime = Date.now();

document.addEventListener('keyup', () => {
    keyCount++;
});

// Calculate WPM roughly every 30 seconds and send to background
setInterval(() => {
    const elapsedMinutes = (Date.now() - startTime) / 60000;
    const wpm = (keyCount / 5) / elapsedMinutes; // Average word is 5 characters
    
    // We don't have a direct way to send to backend from content script easily due to CORS sometimes
    // but we can send to background
    chrome.runtime.sendMessage({ type: 'TYPING_METRICS', wpm: wpm });
    
    // Reset for next interval
    keyCount = 0;
    startTime = Date.now();
}, 30000);
