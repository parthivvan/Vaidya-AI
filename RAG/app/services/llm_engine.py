import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

def call_groq_with_fallback(messages, temperature=0.2, max_tokens=300):
    api_keys = [
        os.getenv("GROQ_API_KEY_1"),
        os.getenv("GROQ_API_KEY_2"),
        os.getenv("GROQ_API_KEY_3")
    ]
    
    for key in api_keys:
        if not key: continue
        try:
            client = Groq(api_key=key)
            completion = client.chat.completions.create(
                messages=messages,
                model="llama-3.3-70b-versatile",
                temperature=temperature,
                max_completion_tokens=max_tokens
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"⚠️ Key failed or rate-limited. Trying next key... Error: {e}")
            
    return "⚠️ Error: All Groq API keys are currently rate-limited or invalid."