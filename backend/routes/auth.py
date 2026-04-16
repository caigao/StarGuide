from flask import Blueprint, request, jsonify
from models import db
from models.user import User
from models.pecs_card import PECSCard, DEFAULT_PECS_CARDS
from utils.auth import generate_token

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json()

    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')

    if not username or not email or not password:
        return jsonify({'error': '请填写所有必填字段'}), 400

    if len(username) < 2 or len(username) > 20:
        return jsonify({'error': '用户名长度需要 2-20 个字符'}), 400

    if len(password) < 6:
        return jsonify({'error': '密码至少需要 6 个字符'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': '用户名已存在'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': '邮箱已被注册'}), 400

    user = User(username=username, email=email)
    user.set_password(password)

    db.session.add(user)
    db.session.flush()  # Get user.id

    # Seed default PECS cards for new user
    for card_data in DEFAULT_PECS_CARDS:
        card = PECSCard(user_id=user.id, **card_data)
        db.session.add(card)

    db.session.commit()

    token = generate_token(user)
    return jsonify({
        'token': token,
        'user': user.to_dict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login with username/email and password."""
    data = request.get_json()

    login_id = data.get('login_id', '').strip()
    password = data.get('password', '')

    if not login_id or not password:
        return jsonify({'error': '请填写用户名和密码'}), 400

    # Try username or email
    user = User.query.filter(
        (User.username == login_id) | (User.email == login_id)
    ).first()

    if not user or not user.check_password(password):
        return jsonify({'error': '用户名或密码错误'}), 401

    token = generate_token(user)
    return jsonify({
        'token': token,
        'user': user.to_dict()
    })
