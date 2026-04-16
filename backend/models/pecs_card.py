from . import db
from datetime import datetime


class PECSCard(db.Model):
    __tablename__ = 'pecs_cards'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # daily, emotion, activity, food
    icon_emoji = db.Column(db.String(10), nullable=False)
    color = db.Column(db.String(20), default='#7C6EF0')
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'category': self.category,
            'icon_emoji': self.icon_emoji,
            'color': self.color,
            'sort_order': self.sort_order,
            'created_at': self.created_at.isoformat()
        }


# Default PECS cards to seed for new users
DEFAULT_PECS_CARDS = [
    {'title': '起床', 'category': 'daily', 'icon_emoji': '🌅', 'color': '#FFB347'},
    {'title': '刷牙', 'category': 'daily', 'icon_emoji': '🪥', 'color': '#87CEEB'},
    {'title': '洗脸', 'category': 'daily', 'icon_emoji': '🧼', 'color': '#87CEEB'},
    {'title': '穿衣服', 'category': 'daily', 'icon_emoji': '👕', 'color': '#DDA0DD'},
    {'title': '吃早餐', 'category': 'food', 'icon_emoji': '🥣', 'color': '#FFD700'},
    {'title': '吃午餐', 'category': 'food', 'icon_emoji': '🍚', 'color': '#FFD700'},
    {'title': '吃晚餐', 'category': 'food', 'icon_emoji': '🍲', 'color': '#FFD700'},
    {'title': '喝水', 'category': 'food', 'icon_emoji': '💧', 'color': '#87CEEB'},
    {'title': '开心', 'category': 'emotion', 'icon_emoji': '😊', 'color': '#98FB98'},
    {'title': '难过', 'category': 'emotion', 'icon_emoji': '😢', 'color': '#B0C4DE'},
    {'title': '生气', 'category': 'emotion', 'icon_emoji': '😠', 'color': '#FF6B6B'},
    {'title': '害怕', 'category': 'emotion', 'icon_emoji': '😨', 'color': '#DDA0DD'},
    {'title': '画画', 'category': 'activity', 'icon_emoji': '🎨', 'color': '#FF69B4'},
    {'title': '听音乐', 'category': 'activity', 'icon_emoji': '🎵', 'color': '#DDA0DD'},
    {'title': '玩积木', 'category': 'activity', 'icon_emoji': '🧱', 'color': '#FFB347'},
    {'title': '读绘本', 'category': 'activity', 'icon_emoji': '📖', 'color': '#98FB98'},
    {'title': '午休', 'category': 'daily', 'icon_emoji': '😴', 'color': '#B0C4DE'},
    {'title': '洗澡', 'category': 'daily', 'icon_emoji': '🛁', 'color': '#87CEEB'},
    {'title': '上厕所', 'category': 'daily', 'icon_emoji': '🚽', 'color': '#E6E6FA'},
    {'title': '睡觉', 'category': 'daily', 'icon_emoji': '🌙', 'color': '#191970'},
]
