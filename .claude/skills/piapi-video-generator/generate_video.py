#!/usr/bin/env python3
"""
PiAPI Video Generator
Generates AI videos using PiAPI with Kling 2.5 Turbo model.
Supports first-frame and last-frame control for smooth transitions.
Pay-as-you-go pricing: ~$0.33 per 5-second video.
"""

import argparse
import base64
import os
import sys
import time
from datetime import datetime
from pathlib import Path

import requests
from dotenv import load_dotenv

# Load .env from script directory
script_dir = Path(__file__).parent
load_dotenv(script_dir / ".env")

# Also try loading from project root
project_root = script_dir.parent.parent.parent
load_dotenv(project_root / ".env")

# API Configuration
API_BASE_URL = "https://api.piapi.ai/api/v1"
UPLOAD_URL = "https://upload.theapi.app/api/ephemeral_resource"
DEFAULT_VERSION = "2.5"  # Kling 2.5 Turbo

# Supported model versions
SUPPORTED_VERSIONS = ["1.5", "1.6", "2.1", "2.1-master", "2.5", "2.6"]


def upload_image_to_piapi(api_key: str, image_path: str) -> str:
    """Upload a local image to PiAPI's ephemeral storage and return the URL."""
    path = Path(image_path)
    if not path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    # Read and encode file
    with open(path, "rb") as f:
        image_data = f.read()

    b64_data = base64.b64encode(image_data).decode("utf-8")

    # Upload to PiAPI ephemeral storage
    headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key,
    }

    payload = {
        "file_name": path.name,
        "file_data": b64_data,
    }

    print(f"  Uploading {path.name}...")
    response = requests.post(
        UPLOAD_URL,
        headers=headers,
        json=payload,
        timeout=120,
    )

    if response.status_code != 200:
        print(f"Error uploading image: {response.status_code}")
        print(f"Response: {response.text}")
        response.raise_for_status()

    result = response.json()
    if result.get("code") != 200:
        raise Exception(f"Upload failed: {result.get('message', 'Unknown error')}")

    url = result.get("data", {}).get("url")
    if not url:
        raise Exception(f"No URL in upload response: {result}")

    print(f"  Uploaded: {url[:60]}...")
    return url


def create_video_task(
    api_key: str,
    start_image: str,
    end_image: str | None,
    prompt: str,
    version: str = DEFAULT_VERSION,
    duration: int = 5,
    mode: str = "pro",
) -> dict:
    """Submit a video generation task using PiAPI."""
    headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key,
    }

    # Upload local images to get URLs
    print("Preparing images...")
    if start_image and not start_image.startswith(("http://", "https://")):
        start_image = upload_image_to_piapi(api_key, start_image)

    if end_image and not end_image.startswith(("http://", "https://")):
        end_image = upload_image_to_piapi(api_key, end_image)

    # Build input payload
    input_data = {
        "image_url": start_image,
        "prompt": prompt,
        "duration": duration,
        "version": version,
        "mode": mode,
    }

    # Add end frame if provided
    if end_image:
        input_data["image_tail_url"] = end_image
        # End frame requires pro mode
        input_data["mode"] = "pro"

    payload = {
        "model": "kling",
        "task_type": "video_generation",
        "input": input_data,
    }

    print(f"Submitting video generation task...")
    print(f"  Model: Kling {version}")
    print(f"  Duration: {duration}s")
    print(f"  Mode: {input_data['mode']}")
    print(f"  Has end frame: {end_image is not None}")
    print(f"  Prompt: {prompt[:100]}{'...' if len(prompt) > 100 else ''}")

    response = requests.post(
        f"{API_BASE_URL}/task",
        headers=headers,
        json=payload,
        timeout=60,
    )

    if response.status_code != 200:
        print(f"Error: API returned status {response.status_code}")
        print(f"Response: {response.text}")
        response.raise_for_status()

    result = response.json()

    if result.get("code") != 200:
        error_msg = result.get("message", "Unknown error")
        raise Exception(f"API Error: {error_msg}")

    return result.get("data", {})


def get_task_status(api_key: str, task_id: str, retries: int = 3) -> dict:
    """Check the status of a video generation task with retry logic."""
    headers = {
        "x-api-key": api_key,
    }

    for attempt in range(retries):
        try:
            response = requests.get(
                f"{API_BASE_URL}/task/{task_id}",
                headers=headers,
                timeout=30,
            )

            if response.status_code != 200:
                print(f"Warning: Status check returned {response.status_code}")
                return {"status": "processing"}

            result = response.json()
            return result.get("data", {})

        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as e:
            if attempt < retries - 1:
                print(f"  Connection error, retrying... ({attempt + 1}/{retries})")
                time.sleep(5)
            else:
                raise e

    return {"status": "processing"}


def wait_for_completion(api_key: str, task_id: str, max_wait: int = 600) -> dict:
    """Poll for task completion with progress updates."""
    start_time = time.time()
    poll_interval = 10  # seconds

    print(f"\nTask ID: {task_id}")
    print("Waiting for video generation...")

    while time.time() - start_time < max_wait:
        status_data = get_task_status(api_key, task_id)
        status = status_data.get("status", "Processing")

        elapsed = int(time.time() - start_time)
        print(f"  [{elapsed}s] Status: {status}")

        if status.lower() == "completed":
            print("Video generation completed!")
            return status_data
        elif status.lower() == "failed":
            error = status_data.get("error", {})
            error_msg = error.get("message", "Unknown error")
            raise Exception(f"Video generation failed: {error_msg}")

        time.sleep(poll_interval)

    raise TimeoutError(f"Task did not complete within {max_wait} seconds")


def get_video_url(result: dict) -> str:
    """Extract video URL from task result."""
    output = result.get("output", {})

    # Try direct video URL first
    if "video" in output:
        return output["video"]

    # Try works array (for some response formats)
    works = output.get("works", [])
    if works:
        video_info = works[0].get("video", {})
        # Prefer watermark-free version
        if "resource_without_watermark" in video_info:
            return video_info["resource_without_watermark"]
        if "resource" in video_info:
            return video_info["resource"]

    raise ValueError(f"Could not find video URL in response: {result}")


def download_video(url: str, output_path: Path) -> Path:
    """Download the generated video to local file."""
    print(f"Downloading video...")

    response = requests.get(url, stream=True, timeout=120)
    response.raise_for_status()

    with open(output_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    print(f"Saved to: {output_path}")
    return output_path


def parse_args():
    parser = argparse.ArgumentParser(
        description="Generate videos using PiAPI (Kling 2.5 Turbo) with start/end frame control"
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
        "--version",
        default=DEFAULT_VERSION,
        choices=SUPPORTED_VERSIONS,
        help=f"Kling model version (default: {DEFAULT_VERSION})",
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

    # Check for API key
    api_key = os.environ.get("PIAPI_API_KEY")

    if not api_key:
        print("Error: PIAPI_API_KEY must be set")
        print("Set it in .env file or as environment variable")
        print("Get your API key at: https://piapi.ai")
        sys.exit(1)

    # Create output directory
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    try:
        # Submit video generation task
        task_data = create_video_task(
            api_key=api_key,
            start_image=args.start_image,
            end_image=args.end_image,
            prompt=args.prompt,
            version=args.version,
            duration=args.duration,
            mode=args.mode,
        )

        task_id = task_data.get("task_id")
        if not task_id:
            print("Error: No task_id in response")
            print(f"Response data: {task_data}")
            sys.exit(1)

        # Wait for completion
        result = wait_for_completion(api_key, task_id)

        # Get video URL
        video_url = get_video_url(result)

        # Generate output filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = output_dir / f"piapi_{timestamp}.mp4"

        download_video(video_url, output_path)

        print(f"\nVideo generated successfully!")
        print(f"Output: {output_path}")

        return str(output_path)

    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
