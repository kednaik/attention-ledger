let switchCount = 0;
let lastWpm = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'TYPING_METRICS') {
        lastWpm = message.wpm;
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    switchCount++;
    logAttention(activeInfo.tabId);
});

chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        switchCount++;
        chrome.tabs.query({ active: true, windowId: windowId }, (tabs) => {
            if (tabs.length > 0) {
                logAttention(tabs[0].id);
            }
        });
    }
});

async function logAttention(tabId) {
    try {
        const tab = await chrome.tabs.get(tabId);
        if (!tab.url) return;

        const data = {
            timestamp: new Date().toISOString(),
            domain: new URL(tab.url).hostname,
            is_active: true,
            window_switch_count: switchCount,
            typing_speed_wpm: lastWpm,
            content_type: null
        };

        // Cache for popup UI
        chrome.storage.local.set({
            current_session: {
                domain: data.domain,
                wpm: data.typing_speed_wpm,
                switches: data.window_switch_count
            }
        });

        const success = await sendToBackend(data);
        if (!success) {
            await bufferData(data);
        }
    } catch (e) {
        console.error("Error logging attention:", e);
    }
}

async function sendToBackend(data) {
    try {
        const response = await fetch('http://localhost:8000/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.ok;
    } catch (e) {
        return false;
    }
}

async function bufferData(data) {
    const result = await chrome.storage.local.get(['buffer']);
    const buffer = result.buffer || [];
    buffer.push(data);
    await chrome.storage.local.set({ buffer });
    console.log("Data buffered offline. Items in queue:", buffer.length);
}

async function syncBuffer() {
    const result = await chrome.storage.local.get(['buffer']);
    const buffer = result.buffer || [];
    if (buffer.length === 0) return;

    console.log("Attempting to sync buffered data...");
    const remaining = [];
    for (const data of buffer) {
        const success = await sendToBackend(data);
        if (!success) {
            remaining.push(data);
        }
    }
    await chrome.storage.local.set({ buffer: remaining });
    if (remaining.length === 0) {
        console.log("Sync complete.");
    }
}

// PERIODIC LOGGING & SYNC
setInterval(async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            logAttention(tabs[0].id);
        }
    });
    syncBuffer();
}, 60000); // Every minute
