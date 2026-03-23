from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import datetime
from sqlalchemy.orm import Session
from models import SessionLocal, AttentionLog as DBAttentionLog, classify_attention, Base, engine

app = FastAPI(title="Attention Ledger API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class AttentionLogSchema(BaseModel):
    timestamp: datetime.datetime
    domain: str
    is_active: bool
    window_switch_count: int
    typing_speed_wpm: float
    content_type: Optional[str] = None

@app.post("/log")
async def log_attention(log: AttentionLogSchema, db: Session = Depends(get_db)):
    state = classify_attention(log)
    db_log = DBAttentionLog(
        timestamp=log.timestamp,
        domain=log.domain,
        is_active=log.is_active,
        window_switch_count=log.window_switch_count,
        typing_speed_wpm=log.typing_speed_wpm,
        content_type=log.content_type,
        cognitive_state=state
    )
    db.add(db_log)
    db.commit()
    return {"status": "success", "classified_as": state}

@app.get("/stats")
async def get_stats(db: Session = Depends(get_db)):
    logs = db.query(DBAttentionLog).all()
    # Basic aggregation for now
    stats = {
        "Deep Work": 0,
        "Passive Consumption": 0,
        "Fragmented Attention": 0,
        "Neutral": 0
    }
    for log in logs:
        stats[log.cognitive_state] = stats.get(log.cognitive_state, 0) + 1
    
    # Calculate ROI (Simple: Deep Work / Total)
    total = sum(stats.values())
    roi = (stats["Deep Work"] / total * 100) if total > 0 else 0
    
@app.get("/timeline")
async def get_timeline(db: Session = Depends(get_db)):
    logs = db.query(DBAttentionLog).order_by(DBAttentionLog.timestamp.desc()).limit(100).all()
    return logs

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
