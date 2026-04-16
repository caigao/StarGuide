from flask import Blueprint, request, jsonify
from models import db
from models.behavior_log import BehaviorLog
from utils.auth import login_required
from datetime import datetime, timedelta
from sqlalchemy import func

tracker_bp = Blueprint('tracker', __name__, url_prefix='/api/logs')


@tracker_bp.route('', methods=['GET'])
@login_required
def get_logs(current_user):
    """Get behavior logs for current user."""
    # Optional date range filter
    start = request.args.get('start')
    end = request.args.get('end')

    query = BehaviorLog.query.filter_by(user_id=current_user.id)

    if start:
        query = query.filter(BehaviorLog.date >= datetime.strptime(start, '%Y-%m-%d').date())
    if end:
        query = query.filter(BehaviorLog.date <= datetime.strptime(end, '%Y-%m-%d').date())

    logs = query.order_by(BehaviorLog.date.desc()).all()
    return jsonify([log.to_dict() for log in logs])


@tracker_bp.route('', methods=['POST'])
@login_required
def create_log(current_user):
    """Create a new behavior log."""
    data = request.get_json()

    date_str = data.get('date', datetime.utcnow().strftime('%Y-%m-%d'))
    mood = data.get('mood')
    behavior_desc = data.get('behavior_desc', '').strip()

    if mood is None or not behavior_desc:
        return jsonify({'error': '请填写情绪评分和行为描述'}), 400

    if not (1 <= int(mood) <= 5):
        return jsonify({'error': '情绪评分需要在 1-5 之间'}), 400

    log = BehaviorLog(
        user_id=current_user.id,
        date=datetime.strptime(date_str, '%Y-%m-%d').date(),
        mood=int(mood),
        behavior_desc=behavior_desc,
        intervention=data.get('intervention', ''),
        effect=int(data.get('effect', 3)),
        notes=data.get('notes', '')
    )

    db.session.add(log)
    db.session.commit()

    return jsonify(log.to_dict()), 201


@tracker_bp.route('/<int:log_id>', methods=['DELETE'])
@login_required
def delete_log(current_user, log_id):
    """Delete a behavior log."""
    log = BehaviorLog.query.filter_by(id=log_id, user_id=current_user.id).first()
    if not log:
        return jsonify({'error': '日志不存在'}), 404

    db.session.delete(log)
    db.session.commit()
    return jsonify({'message': '已删除'})


@tracker_bp.route('/stats', methods=['GET'])
@login_required
def get_stats(current_user):
    """Get statistics for behavior logs."""
    days = int(request.args.get('days', 30))
    since = datetime.utcnow().date() - timedelta(days=days)

    logs = BehaviorLog.query.filter(
        BehaviorLog.user_id == current_user.id,
        BehaviorLog.date >= since
    ).order_by(BehaviorLog.date.asc()).all()

    # Daily mood averages
    mood_data = {}
    for log in logs:
        date_key = log.date.isoformat()
        if date_key not in mood_data:
            mood_data[date_key] = {'moods': [], 'effects': []}
        mood_data[date_key]['moods'].append(log.mood)
        mood_data[date_key]['effects'].append(log.effect)

    trend = []
    for date_key, values in mood_data.items():
        trend.append({
            'date': date_key,
            'avg_mood': round(sum(values['moods']) / len(values['moods']), 1),
            'avg_effect': round(sum(values['effects']) / len(values['effects']), 1),
            'count': len(values['moods'])
        })

    total_logs = len(logs)
    avg_mood = round(sum(l.mood for l in logs) / total_logs, 1) if total_logs else 0

    return jsonify({
        'total_logs': total_logs,
        'avg_mood': avg_mood,
        'trend': trend,
        'days': days
    })
