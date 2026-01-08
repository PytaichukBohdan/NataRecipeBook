#!/usr/bin/env python3
"""Check status of a Kling video generation task."""

import os
import sys
import time
from pathlib import Path

import jwt
import requests
from dotenv import load_dotenv

# Load .env from script directory
script_dir = Path(__file__).parent
load_dotenv(script_dir / ".env")

# Also try loading from project root
project_root = script_dir.parent.parent.parent
load_dotenv(project_root / ".env")

API_BASE_URL = "https://api.klingai.com"

def generate_jwt_token(access_key: str, secret_key: str) -> str:
    """Generate JWT token for Kling API authentication."""
    now = int(time.time())
    payload = {
        "iss": access_key,
        "exp": now + 1800,
        "nbf": now - 5,
    }
    return jwt.encode(payload, secret_key, algorithm="HS256")


def check_status(task_id: str):
    access_key = os.environ.get("KLING_ACCESS_KEY")
    secret_key = os.environ.get("KLING_SECRET_KEY")

    if not access_key or not secret_key:
        print("Error: KLING_ACCESS_KEY and KLING_SECRET_KEY must be set")
        sys.exit(1)

    token = generate_jwt_token(access_key, secret_key)

    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(
        f"{API_BASE_URL}/v1/videos/image2video/{task_id}",
        headers=headers,
        timeout=30,
    )

    result = response.json()
    print(f"Response: {result}")

    data = result.get("data", {})
    status = data.get("task_status")
    print(f"Status: {status}")

    if status == "succeed":
        videos = data.get("task_result", {}).get("videos", [])
        if videos:
            video_url = videos[0].get("url")
            print(f"Video URL: {video_url}")
            return video_url

    return None


if __name__ == "__main__":
    task_id = sys.argv[1] if len(sys.argv) > 1 else "837885778717589555"
    check_status(task_id)
