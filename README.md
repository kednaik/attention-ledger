# Attention Ledger

A full-stack data visualization tool that tracks digital attention as a financial ledger. Categorize your time by cognitive state (Deep Work, Passive Consumption, Fragmented Attention) and track your Attention ROI.

## Components

1.  **Backend (FastAPI)**: Handles data storage and heuristic ML classification.
2.  **Frontend (React + Vite)**: A premium dashboard with glassmorphism design.
3.  **Chrome Extension**: Collects real-time data on tab switches, window focus, and typing speed.

## Setup Instructions

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*The backend runs on `http://localhost:8000`.*

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
*The dashboard is available at `http://localhost:5173`.*

### 3. Chrome Extension
1.  Open Chrome and navigate to `chrome://extensions/`.
2.  Enable **Developer mode** (top right).
3.  Click **Load unpacked**.
4.  Select the `extension` folder in this project directory.

## How it Works

- **Deep Work**: Detected when you spend significant time on productive domains (GitHub, StackOverflow, etc.) with consistent typing and low switching.
- **Passive Consumption**: Detected on social media and entertainment domains.
- **Fragmented Attention**: Triggered by high frequency window or tab switching.
- **Attention ROI**: A score representing the ratio of Deep Work to total digital time.
