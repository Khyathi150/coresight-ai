"""
Groq client wrapper. Groq's free tier serves Llama 3.3/4 models with very
low latency, which is what makes a "chat with your business" experience
feel instant instead of laggy.
"""
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

_client: Groq | None = None


def get_groq_client() -> Groq:
    global _client
    if _client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError("GROQ_API_KEY missing. Get a free key at console.groq.com and add it to .env")
        _client = Groq(api_key=api_key)
    return _client


def narrate(messages: list[dict]) -> str:
    client = get_groq_client()
    model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.3,
        max_tokens=400,
    )
    return response.choices[0].message.content
