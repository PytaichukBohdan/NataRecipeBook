#!/usr/bin/env python3
"""
Kling Video Generator
Generates AI videos using Kling Video API with first-frame and last-frame control.
Supports models: kling-v1-6, kling-v2-0-master, kling-v2-1-master (with image_tail support)
"""

import argparse
import base64
import os
import sys
import time
from datetime import datetime
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

# API Configuration
API_BASE_URL = "https://api.klingai.com"
# Models that support image_tail (end frame)
MODELS_WITH_TAIL_SUPPORT = ["kling-v1-5", "kling-v1-6", "kling-v2-0-master", "kling-v2-1-master", "kling-v2-5-turbo"]
DEFAULT_MODEL = "kling-v2-5-turbo"


def generate_jwt_token(access_key: str, secret_key: str) -> str:
    """Generate JWT token for Kling API authentication."""
    now = int(time.time())
    payload = {
        "iss": access_key,
        "exp": now + 1800,  # 30 minutes
        "nbf": now - 5,     # Valid 5 seconds ago
    }
    return jwt.encode(payload, secret_key, algorithm="HS256")


def encode_image_to_base64(image_path: str) -> str:
    """Encode a local image file to base64 string."""
    path = Path(image_path)
    if not path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    with open(path, "rb") as f:
        image_data = f.read()

    # Return raw base64 without data URI prefix
    return base64.b64encode(image_data).decode("utf-8")


def create_video_task(
    token: str,
    start_image: str,
    end_image: str | None,
    prompt: str,
    model: str = DEFAULT_MODEL,
    duration: int = 5,
    mode: str = "pro",  # Auto-set to pro when using image_tail
) -> dict:
    """Submit a video generation task using Kling Image-to-Video API."""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
    }

    # Encode images if they're local files
    if start_image and not start_image.startswith(("http://", "https://")):
        start_image = encode_image_to_base64(start_image)

    if end_image and not end_image.startswith(("http://", "https://")):
        end_image = encode_image_to_base64(end_image)

    # When using image_tail, mode is automatically set to pro
    if end_image:
        mode = "pro"

    payload = {
        "model_name": model,
        "image": start_image,
        "prompt": prompt,
        "duration": str(duration),
        "mode": mode,
    }

    if end_image:
        payload["image_tail"] = end_image

    print(f"Submitting video generation task...")
    print(f"  Model: {model}")
    print(f"  Duration: {duration}s")
    print(f"  Mode: {mode}")
    print(f"  Has end frame: {end_image is not None}")
    print(f"  Prompt: {prompt[:100]}{'...' if len(prompt) > 100 else ''}")

    response = requests.post(
        f"{API_BASE_URL}/v1/videos/image2video",
        headers=headers,
        json=payload,
        timeout=60,
    )

    if response.status_code != 200:
        print(f"Error: API returned status {response.status_code}")
        print(f"Response: {response.text}")
        response.raise_for_status()

    result = response.json()

    if result.get("code") != 0:
        raise Exception(f"API Error: {result.get('message', 'Unknown error')}")

    return result.get("data", {})


def get_task_status(token: str, task_id: str) -> dict:
    """Check the status of a video generation task."""
    headers = {
        "Authorization": f"Bearer {token}",
    }

    response = requests.get(
        f"{API_BASE_URL}/v1/videos/image2video/{task_id}",
        headers=headers,
        timeout=30,
    )

    if response.status_code != 200:
        print(f"Warning: Status check returned {response.status_code}")
        print(f"Response: {response.text}")
        return {"task_status": "processing"}

    result = response.json()
    return result.get("data", {})


def wait_for_completion(token: str, task_id: str, max_wait: int = 600) -> dict:
    """Poll for task completion with progress updates."""
    start_time = time.time()
    poll_interval = 10  # seconds

    print(f"\nTask ID: {task_id}")
    print("Waiting for video generation...")

    while time.time() - start_time < max_wait:
        status = get_task_status(token, task_id)
        task_status = status.get("task_status", "processing")

        elapsed = int(time.time() - start_time)
        print(f"  [{elapsed}s] Status: {task_status}")

        if task_status == "succeed":
            print("Video generation completed!")
            return status
        elif task_status == "failed":
            raise Exception(f"Video generation failed: {status.get('task_status_msg', 'Unknown error')}")

        time.sleep(poll_interval)

    raise TimeoutError(f"Task did not complete within {max_wait} seconds")


def download_video(url: str, output_path: Path) -> Path:
    """Download the generated video to local file."""
    print(f"Downloading video from: {url}")

    response = requests.get(url, stream=True, timeout=120)
    response.raise_for_status()

    with open(output_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    print(f"Saved to: {output_path}")
    return output_path


def parse_args():
    parser = argparse.ArgumentParser(
        description="Generate videos using Kling AI with start/end frame control"
    )
    parser.add_argument(
        "--start-image",
        required=True,
        help="Path or URL to the starting frame image",
    )
    parser.add_argument(
        "--end-image",
        help="Path or URL to the ending frame image (optional)",
    )
    parser.add_argument(
        "--prompt",
        required=True,
        help="Description of the video transition/content",
    )
    parser.add_argument(
        "--model",
        default=DEFAULT_MODEL,
        choices=MODELS_WITH_TAIL_SUPPORT + ["kling-v2-1", "kling-v2-6"],
        help=f"Model to use (default: {DEFAULT_MODEL}). Models with image_tail support: {', '.join(MODELS_WITH_TAIL_SUPPORT)}",
    )
    parser.add_argument(
        "--duration",
        type=int,
        choices=[5, 10],
        default=5,
        help="Video duration in seconds (5 or 10, default: 5)",
    )
    parser.add_argument(
        "--mode",
        choices=["std", "pro"],
        default="pro",
        help="Quality mode (default: pro). Auto-set to pro when using --end-image",
    )
    parser.add_argument(
        "--output",
        default="./generated_videos",
        help="Output directory for generated videos",
    )
    return parser.parse_args()


def main():
    args = parse_args()

    # Check for API credentials
    access_key = os.environ.get("KLING_ACCESS_KEY")
    secret_key = os.environ.get("KLING_SECRET_KEY")

    if not access_key or not secret_key:
        print("Error: KLING_ACCESS_KEY and KLING_SECRET_KEY must be set")
        print("Set them in .env file or as environment variables")
        sys.exit(1)

    # Warn if using model without image_tail support with end_image
    if args.end_image and args.model not in MODELS_WITH_TAIL_SUPPORT:
        print(f"Warning: Model {args.model} may not support image_tail (end frame)")
        print(f"Recommended models with end frame support: {', '.join(MODELS_WITH_TAIL_SUPPORT)}")

    # Generate JWT token
    token = generate_jwt_token(access_key, secret_key)
    print("JWT token generated successfully")

    # Create output directory
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    try:
        # Submit video generation task
        task_data = create_video_task(
            token=token,
            start_image=args.start_image,
            end_image=args.end_image,
            prompt=args.prompt,
            model=args.model,
            duration=args.duration,
            mode=args.mode,
        )

        task_id = task_data.get("task_id")
        if not task_id:
            print("Error: No task_id in response")
            print(f"Response data: {task_data}")
            sys.exit(1)

        # Wait for completion
        result = wait_for_completion(token, task_id)

        # Download the video
        videos = result.get("task_result", {}).get("videos", [])
        if not videos:
            print("Warning: No videos in result")
            print(f"Result: {result}")
            sys.exit(1)

        video_url = videos[0].get("url")
        if not video_url:
            print("Error: No video URL in result")
            sys.exit(1)

        # Generate output filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = output_dir / f"kling_{timestamp}.mp4"

        download_video(video_url, output_path)

        print(f"\nVideo generated successfully!")
        print(f"Output: {output_path}")

        return str(output_path)

    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
