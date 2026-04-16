from services.ai_agent import AIAgent
import sys
agent = AIAgent('AIzaSyBIXVQvJz7c8_NicZNcnKLHVXXBNPvWOaM')
try:
    agent.get_scenario_advice('test')
except Exception as e:
    print(str(e))
    sys.exit(1)
