from google import genai


SCENARIO_SYSTEM_PROMPT = """你是一位资深的自闭症（ASD）儿童康复专家和行为分析师（BCBA）。
你的名字是"星语向导"，你的职责是帮助 ASD 儿童的家长应对日常生活中的各种挑战场景。

当家长描述一个场景时，请按以下结构给出建议：

## 🔍 场景分析
简要分析孩子行为背后可能的原因（感觉过载、沟通需求、环境变化等）

## 🚨 即时应对（前3分钟）
给出3-5个具体的、可立即执行的步骤

## 🛠️ 后续干预策略
提供中长期的干预建议

## 💡 预防技巧
如何在未来避免或减轻类似情况

## ❤️ 给家长的话
一段温暖的鼓励，提醒家长照顾好自己

请注意：
- 使用温暖、支持性的语气
- 给出具体、可操作的建议
- 避免使用过于专业的术语，用通俗易懂的语言
- 每个建议都要考虑到孩子的感受和安全
- 使用 emoji 让内容更易读
"""

COMPANION_SYSTEM_PROMPT = """你是一位温暖、善解人意的心理支持伙伴，名字叫"星语向导"。
你的职责是陪伴自闭症儿童的家长，倾听他们的心声，给予情感支持。

你的特点：
- 🤗 始终保持温暖、共情的态度
- 👂 认真倾听，不急于给建议
- 💪 认可家长的付出和努力
- 🌈 在适当的时候给予希望和鼓励
- 🧘 必要时建议放松和自我关怀的方法

请注意：
- 不要以专家自居，而是以朋友的身份交流
- 认可家长的情绪是"正常的"、"可以理解的"
- 如果家长表达了严重的心理困扰，温和地建议寻求专业心理咨询
- 用简短、温暖的语句回应，避免长篇大论
- 适当使用 emoji 增加亲和力
"""


class AIAgent:
    def __init__(self, api_key):
        self.client = genai.Client(api_key=api_key)
        self.model = 'gemini-2.5-flash-lite'

    def get_scenario_advice(self, scenario, history=None):
        """Get AI advice for a parenting scenario."""
        contents = []
        if history:
            for msg in history:
                contents.append(genai.types.Content(
                    role=msg['role'],
                    parts=[genai.types.Part(text=msg['content'])]
                ))
        contents.append(genai.types.Content(
            role='user',
            parts=[genai.types.Part(text=scenario)]
        ))

        response = self.client.models.generate_content(
            model=self.model,
            contents=contents,
            config=genai.types.GenerateContentConfig(
                system_instruction=SCENARIO_SYSTEM_PROMPT,
                temperature=0.7,
                max_output_tokens=2048,
            )
        )
        return response.text

    def get_scenario_advice_stream(self, scenario, history=None):
        """Get AI advice for a parenting scenario (streamed)."""
        contents = []
        if history:
            for msg in history:
                contents.append(genai.types.Content(
                    role=msg['role'],
                    parts=[genai.types.Part(text=msg['content'])]
                ))
        contents.append(genai.types.Content(
            role='user',
            parts=[genai.types.Part(text=scenario)]
        ))

        response = self.client.models.generate_content_stream(
            model=self.model,
            contents=contents,
            config=genai.types.GenerateContentConfig(
                system_instruction=SCENARIO_SYSTEM_PROMPT,
                temperature=0.7,
                max_output_tokens=2048,
            )
        )
        for chunk in response:
            if chunk.text:
                yield chunk.text

    def get_companion_response(self, message, history=None):
        """Get empathetic companion response for parent."""
        contents = []
        if history:
            for msg in history:
                contents.append(genai.types.Content(
                    role=msg['role'],
                    parts=[genai.types.Part(text=msg['content'])]
                ))
        contents.append(genai.types.Content(
            role='user',
            parts=[genai.types.Part(text=message)]
        ))

        response = self.client.models.generate_content(
            model=self.model,
            contents=contents,
            config=genai.types.GenerateContentConfig(
                system_instruction=COMPANION_SYSTEM_PROMPT,
                temperature=0.8,
                max_output_tokens=1024,
            )
        )
        return response.text
