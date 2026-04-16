from flask import Blueprint, request, jsonify
from models import db
from models.pecs_card import PECSCard
from utils.auth import login_required

pecs_bp = Blueprint('pecs', __name__, url_prefix='/api/pecs')


@pecs_bp.route('/cards', methods=['GET'])
@login_required
def get_cards(current_user):
    """Get all PECS cards for current user."""
    category = request.args.get('category')

    query = PECSCard.query.filter_by(user_id=current_user.id)
    if category:
        query = query.filter_by(category=category)

    cards = query.order_by(PECSCard.sort_order.asc(), PECSCard.id.asc()).all()
    return jsonify([card.to_dict() for card in cards])


@pecs_bp.route('/cards', methods=['POST'])
@login_required
def create_card(current_user):
    """Create a new PECS card."""
    data = request.get_json()

    title = data.get('title', '').strip()
    category = data.get('category', '').strip()
    icon_emoji = data.get('icon_emoji', '⭐')
    color = data.get('color', '#7C6EF0')

    if not title or not category:
        return jsonify({'error': '请填写卡片标题和分类'}), 400

    valid_categories = ['daily', 'emotion', 'activity', 'food']
    if category not in valid_categories:
        return jsonify({'error': f'分类必须是: {", ".join(valid_categories)}'}), 400

    card = PECSCard(
        user_id=current_user.id,
        title=title,
        category=category,
        icon_emoji=icon_emoji,
        color=color,
        sort_order=data.get('sort_order', 0)
    )

    db.session.add(card)
    db.session.commit()

    return jsonify(card.to_dict()), 201


@pecs_bp.route('/cards/<int:card_id>', methods=['DELETE'])
@login_required
def delete_card(current_user, card_id):
    """Delete a PECS card."""
    card = PECSCard.query.filter_by(id=card_id, user_id=current_user.id).first()
    if not card:
        return jsonify({'error': '卡片不存在'}), 404

    db.session.delete(card)
    db.session.commit()
    return jsonify({'message': '已删除'})


@pecs_bp.route('/cards/reorder', methods=['PUT'])
@login_required
def reorder_cards(current_user):
    """Reorder PECS cards."""
    data = request.get_json()
    card_ids = data.get('card_ids', [])

    for index, card_id in enumerate(card_ids):
        card = PECSCard.query.filter_by(id=card_id, user_id=current_user.id).first()
        if card:
            card.sort_order = index

    db.session.commit()
    return jsonify({'message': '排序已更新'})
