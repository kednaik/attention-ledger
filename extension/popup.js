// Popup logic for Attention Ledger
document.addEventListener('DOMContentLoaded', () => {
    const roiEl = document.getElementById('roi');
    const stateLabelEl = document.getElementById('state-label');
    const wpmEl = document.getElementById('wpm');
    const switchesEl = document.getElementById('switches');
    const domainEl = document.getElementById('domain');
    const openDashboardBtn = document.getElementById('open-dashboard');

    function updateUI() {
        chrome.storage.local.get(['last_stats', 'current_session'], (data) => {
            if (data.current_session) {
                const session = data.current_session;
                domainEl.innerText = session.domain || 'Unknown';
                wpmEl.innerText = Math.round(session.wpm || 0);
                switchesEl.innerText = session.switches || 0;
                
                // For ROI, we might want to fetch from backend or estimate
                // For now, let's show the last calculated ROI from stats if available
            }

            if (data.last_stats) {
                roiEl.innerHTML = `${Math.round(data.last_stats.roi)} <span class="roi-unit">%</span>`;
                stateLabelEl.innerText = data.last_stats.roi > 50 ? 'Optimal Focus' : 'Fragmented Context';
                stateLabelEl.style.color = data.last_stats.roi > 50 ? '#22c55e' : '#f43f5e';
            }
        });
    }

    // Update on open
    updateUI();

    // Periodically update if open
    const interval = setInterval(updateUI, 2000);

    openDashboardBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: 'http://localhost:5173' });
    });

    // Clean up interval if popup closes
    window.addEventListener('unload', () => clearInterval(interval));
});
