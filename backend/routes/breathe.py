from flask import Blueprint, request, jsonify, current_app
from utils.auth import login_required
from services.ai_agent import AIAgent

breathe_bp = Blueprint('breathe', __name__, url_prefix='/api/breathe')


@breathe_bp.route('/chat', methods=['POST'])
@login_required
def companion_chat(current_user):
    """Chat with AI companion for emotional support."""
    data = request.get_json()
    message = data.get('message', '').strip()
    history = data.get('history', [])

    if not message:
        return jsonify({'error': '请输入您想说的话'}), 400

    try:
        agent = AIAgent(current_app.config['GEMINI_API_KEY'])
        response = agent.get_companion_response(message, history)
        return jsonify({
            'response': response
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        error_msg = str(e)
        if "RESOURCE_EXHAUSTED" in error_msg:
            return jsonify({'error': 'AI API 额度已用尽或请求太频繁，请稍后再试或检查 API Key 额度。'}), 429
        return jsonify({'error': f'AI 服务异常: {error_msg}'}), 500


@breathe_bp.route('/quotes', methods=['GET'])
def get_quotes():
    """Get encouraging quotes for parents."""
    quotes = [
        {"text": "你已经做得很好了，每一步都算数。", "author": "星语向导"},
        {"text": "爱不需要完美，只需要坚持。", "author": "星语向导"},
        {"text": "照顾好自己，才能更好地照顾孩子。", "author": "星语向导"},
        {"text": "每个孩子都是独特的星星，只是闪耀的方式不同。", "author": "星语向导"},
        {"text": "今天的辛苦，是明天美好回忆的种子。", "author": "星语向导"},
        {"text": "你不是一个人在战斗，我们与你同行。", "author": "星语向导"},
        {"text": "小小的进步，也是巨大的胜利。", "author": "星语向导"},
        {"text": "允许自己疲惫，允许自己休息，这也是一种勇敢。", "author": "星语向导"},
        {"text": "孩子的每一个微笑，都是你努力的最好回报。", "author": "星语向导"},
        {"text": "相信自己，你比想象中更强大。", "author": "星语向导"},
    ]
    return jsonify(quotes)
