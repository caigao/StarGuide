from . import db
from datetime import datetime


class BehaviorLog(db.Model):
    __tablename__ = 'behavior_logs'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date)
    mood = db.Column(db.Integer, nullable=False)  # 1-5 scale
    behavior_desc = db.Column(db.Text, nullable=False)
    intervention = db.Column(db.Text, default='')
    effect = db.Column(db.Integer, default=3)  # 1-5 scale
    notes = db.Column(db.Text, default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date.isoformat(),
            'mood': self.mood,
            'behavior_desc': self.behavior_desc,
            'intervention': self.intervention,
            'effect': self.effect,
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }
