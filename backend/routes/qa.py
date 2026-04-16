from flask import Blueprint, request, jsonify, current_app, Response, stream_with_context
from utils.auth import login_required
from services.ai_agent import AIAgent

qa_bp = Blueprint('qa', __name__, url_prefix='/api/qa')


@qa_bp.route('', methods=['POST'])
@login_required
def ask_scenario(current_user):
    """Get AI advice for a parenting scenario."""
    data = request.get_json()
    scenario = data.get('scenario', '').strip()
    history = data.get('history', [])

    if not scenario:
        return jsonify({'error': '请描述您遇到的场景'}), 400

    # Extract config outside generator to prevent "Working outside application context"
    api_key = current_app.config['GEMINI_API_KEY']

    def generate():
        try:
            agent = AIAgent(api_key)
            for chunk in agent.get_scenario_advice_stream(scenario, history):
                yield chunk
        except Exception as e:
            import traceback
            traceback.print_exc()
            error_msg = str(e)
            if "RESOURCE_EXHAUSTED" in error_msg:
                yield "\n\n[错误提示：AI API 额度已用尽或请求太频繁，请稍后再试或检查 API Key 额度。]"
            else:
                yield f"\n\n[报错：AI 服务异常: {error_msg}]"

    return Response(stream_with_context(generate()), mimetype='text/plain')
