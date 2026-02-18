import aiohttp
import asyncio
from config import OPENROUTER_API_KEY

async def generate_summary(text: str):
    """Generate a professional summary of the given text using OpenRouter"""
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "SyncDraft AI"
                },
                json={
                    "model": "openrouter/auto",
                    "messages": [
                        {
                            "role": "user",
                            "content": f"Summarize this blog post professionally in 2-3 sentences. Focus on the main points and key takeaways:\n\n{text}"
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": 300
                },
                timeout=aiohttp.ClientTimeout(total=30)
            ) as response:
                if response.status != 200:
                    text = await response.text()
                    return f"Error: {response.status} - {text}"

                data = await response.json()
                return data["choices"][0]["message"]["content"]

    except asyncio.TimeoutError:
        return "Error: Request timed out. Please try again."
    except aiohttp.ClientError as e:
        return f"Error: Failed to connect to AI service - {str(e)}"
    except (KeyError, IndexError) as e:
        return f"Error: Invalid response format - {str(e)}"
    except Exception as e:
        return f"Error: {str(e)}"


async def fix_grammar(text: str):
    """Fix grammar, spelling, and improve clarity of the given text"""
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "SyncDraft AI"
                },
                json={
                    "model": "openrouter/auto",
                    "messages": [
                        {
                            "role": "user",
                            "content": f"""Fix grammar, spelling, and improve clarity in this blog post. 
Provide only the corrected text without explanations or markdown formatting:

{text}"""
                        }
                    ],
                    "temperature": 0.5,
                    "max_tokens": 2000
                },
                timeout=aiohttp.ClientTimeout(total=30)
            ) as response:
                if response.status != 200:
                    text = await response.text()
                    return f"Error: {response.status} - {text}"

                data = await response.json()
                return data["choices"][0]["message"]["content"]

    except asyncio.TimeoutError:
        return "Error: Request timed out. Please try again."
    except aiohttp.ClientError as e:
        return f"Error: Failed to connect to AI service - {str(e)}"
    except (KeyError, IndexError) as e:
        return f"Error: Invalid response format - {str(e)}"
    except Exception as e:
        return f"Error: {str(e)}"
