from flask import Blueprint, request, jsonify
from models import db
from models.user import User
from models.behavior_log import BehaviorLog
from models.pecs_card import PECSCard
from utils.auth import admin_required

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')


@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users(current_user):
    """Get all users (admin only)."""
    users = User.query.order_by(User.created_at.desc()).all()
    result = []
    for user in users:
        user_data = user.to_dict()
        user_data['log_count'] = BehaviorLog.query.filter_by(user_id=user.id).count()
        user_data['card_count'] = PECSCard.query.filter_by(user_id=user.id).count()
        result.append(user_data)
    return jsonify(result)


@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(current_user, user_id):
    """Delete a user (admin only)."""
    if user_id == current_user.id:
        return jsonify({'error': '不能删除自己的账号'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': '用户不存在'}), 404

    if user.role == 'admin':
        return jsonify({'error': '不能删除管理员账号'}), 400

    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': f'用户 {user.username} 已删除'})


@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_admin_stats(current_user):
    """Get system-wide statistics (admin only)."""
    total_users = User.query.count()
    total_logs = BehaviorLog.query.count()
    total_cards = PECSCard.query.count()

    return jsonify({
        'total_users': total_users,
        'total_logs': total_logs,
        'total_cards': total_cards,
    })
