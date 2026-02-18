import requests
from config import OPENROUTER_API_KEY

async def generate_summary(text: str):
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openrouter/free",  # auto free model
                "messages": [
                    {
                        "role": "user",
                        "content": f"Summarize this blog professionally:\n{text}"
                    }
                ]
            }
        )

        data = response.json()
        return data["choices"][0]["message"]["content"]

    except Exception as e:
        return str(e)
