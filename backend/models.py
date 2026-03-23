from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

Base = declarative_base()

class AttentionLog(Base):
    __tablename__ = 'attention_logs'
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime)
    domain = Column(String)
    is_active = Column(Boolean)
    window_switch_count = Column(Integer)
    typing_speed_wpm = Column(Float)
    content_type = Column(String)
    cognitive_state = Column(String) # Deep Work, Passive Consumption, Fragmented Attention

# Simple Heuristic Classifier
DEEP_WORK_DOMAINS = ['github.com', 'stackoverflow.com', 'google.com', 'coursera.org', 'notion.so']
PASSIVE_DOMAINS = ['youtube.com', 'netflix.com', 'facebook.com', 'instagram.com', 'twitter.com', 'reddit.com']

def classify_attention(log_data):
    # WSF = Window Switch Frequency
    # TS = Typing Speed
    
    # Heuristics:
    # 1. High switch count (> 10 per min) -> Fragmented Attention
    # 2. Low switch count, high typing speed, productive domain -> Deep Work
    # 3. Productive domain, low typing -> Deep Work (if content is documentation/learning)
    # 4. Passive domain -> Passive Consumption
    
    domain = log_data.domain.lower()
    switch_count = log_data.window_switch_count
    wpm = log_data.typing_speed_wpm
    
    if switch_count > 10:
        return "Fragmented Attention"
    
    if domain in PASSIVE_DOMAINS:
        return "Passive Consumption"
    
    if domain in DEEP_WORK_DOMAINS or "docs" in domain or "learn" in domain:
        if wpm > 10 or switch_count < 3:
            return "Deep Work"
    
    return "Neutral"

# DB Setup
engine = create_engine('sqlite:///./attention.db')
Base.metadata.create_all(engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
