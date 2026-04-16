from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from models.user import User
from models.pecs_card import PECSCard, DEFAULT_PECS_CARDS


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)

    # Register blueprints
    from routes.auth import auth_bp
    from routes.qa import qa_bp
    from routes.tracker import tracker_bp
    from routes.pecs import pecs_bp
    from routes.breathe import breathe_bp
    from routes.admin import admin_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(qa_bp)
    app.register_blueprint(tracker_bp)
    app.register_blueprint(pecs_bp)
    app.register_blueprint(breathe_bp)
    app.register_blueprint(admin_bp)

    # Create tables and seed admin
    with app.app_context():
        db.create_all()
        _seed_admin()

    return app


def _seed_admin():
    """Create default admin account if not exists."""
    admin = User.query.filter_by(role='admin').first()
    if not admin:
        admin = User(
            username='admin',
            email='admin@starguide.com',
            role='admin',
            avatar_emoji='👑'
        )
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.flush()

        # Give admin default PECS cards too
        for card_data in DEFAULT_PECS_CARDS:
            card = PECSCard(user_id=admin.id, **card_data)
            db.session.add(card)

        db.session.commit()
        print('✅ 默认管理员账号已创建: admin / admin123')


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000)
