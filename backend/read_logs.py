from models import SessionLocal, AttentionLog
from tabulate import tabulate

def read_logs():
    db = SessionLocal()
    try:
        logs = db.query(AttentionLog).order_by(AttentionLog.timestamp.desc()).all()
        if not logs:
            print("No logs found in the database.")
            return

        table_data = []
        for log in logs:
            table_data.append([
                log.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                log.domain,
                log.cognitive_state,
                f"{log.typing_speed_wpm:.1f}",
                log.window_switch_count
            ])

        headers = ["Timestamp", "Domain", "State", "WPM", "Switches"]
        print("\n--- Attention Ledger Logs ---")
        print(tabulate(table_data, headers=headers, tablefmt="outline"))
        print(f"Total entries: {len(logs)}\n")

    finally:
        db.close()

if __name__ == "__main__":
    read_logs()
