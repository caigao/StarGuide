import os
from google import genai
from google.genai import errors
from dotenv import load_dotenv

# 加载 .env 环境变量
load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')

if not api_key:
    print("❌ 错误：未能在 .env 文件中找到 GEMINI_API_KEY")
    exit(1)

# 你刚刚更换的模型名称
MODEL_NAME = "gemini-2.5-flash-lite"

def test_model():
    print(f"正在使用模型: [{MODEL_NAME}] 进行测试请求...")
    try:
        # 初始化客户端
        client = genai.Client(api_key=api_key)
        
        # 尝试发起一个极简的问候请求
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents="你好，请用一句话证明你当前在线并且可以正常回复。"
        )
        print("\n✅ 测试成功！模型回复：")
        print("-" * 30)
        print(response.text)
        print("-" * 30)
        
    except errors.ClientError as e:
        error_msg = str(e)
        print("\n❌ 测试失败！")
        if "RESOURCE_EXHAUSTED" in error_msg or "429" in error_msg:
            print("🔴 错误原因：API 配额超限或请求过于频繁 (RESOURCE_EXHAUSTED)。由于免费版本有限制，请稍后再试或换一个 Key。")
        elif "API key not valid" in error_msg or "400" in error_msg:
            print("🔴 错误原因：API Key 不正确 (API key not valid)。请检查 .env 中的密钥是否复制完整。")
        elif "not found" in error_msg.lower():
            print(f"🔴 错误原因：该模型名称 {MODEL_NAME} 可能不支持或拼写错误，或者是代理环境导致。")
        else:
            print("🔴 详细错误信息如下：")
            print(error_msg)
    except Exception as e:
        print("\n❌ 发生未知网络或执行异常：")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_model()
