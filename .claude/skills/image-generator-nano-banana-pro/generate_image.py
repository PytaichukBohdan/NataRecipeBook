#!/usr/bin/env python3
"""
Nano Banana Pro 3.0 Image Generator
Uses Google Gemini 3 Pro Image API (gemini-3-pro-image-preview) for image generation.
"""

import argparse
import base64
import os
import sys
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv

# Load .env from script directory
script_dir = Path(__file__).parent
load_dotenv(script_dir / ".env")

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("Error: google-genai package not installed. Run: pip install google-genai")
    sys.exit(1)


def parse_args():
    parser = argparse.ArgumentParser(description="Generate images using Nano Banana Pro (Gemini)")
    parser.add_argument("prompt", help="The image generation prompt")
    parser.add_argument("--resolution", choices=["1K", "2K", "4K"], default="2K", help="Image resolution")
    parser.add_argument("--aspect", default="16:9", help="Aspect ratio (e.g., 1:1, 16:9, 9:16, 4:3)")
    parser.add_argument("--output", default="./generated_images", help="Output directory")
    parser.add_argument("--reference", action="append", help="Reference image path (can be used multiple times)")
    return parser.parse_args()


def load_reference_images(paths: list[str] | None) -> list[types.Part]:
    """Load reference images as Parts for the API."""
    if not paths:
        return []

    parts = []
    for path in paths:
        path = Path(path)
        if not path.exists():
            print(f"Warning: Reference image not found: {path}")
            continue

        # Determine mime type
        suffix = path.suffix.lower()
        mime_types = {
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".webp": "image/webp",
            ".gif": "image/gif",
        }
        mime_type = mime_types.get(suffix, "image/png")

        with open(path, "rb") as f:
            image_data = f.read()

        parts.append(types.Part.from_bytes(data=image_data, mime_type=mime_type))

    return parts


def main():
    args = parse_args()

    # Check for API key
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable not set")
        sys.exit(1)

    # Initialize client
    client = genai.Client(api_key=api_key)

    # Create output directory
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Prepare content parts
    contents = []

    # Add reference images if provided
    ref_parts = load_reference_images(args.reference)
    contents.extend(ref_parts)

    # Add the text prompt
    contents.append(args.prompt)

    print(f"Generating image with prompt: {args.prompt}")
    print(f"Resolution: {args.resolution}, Aspect: {args.aspect}")

    try:
        # Generate image using Gemini 3 Pro Image (Nano Banana Pro 3.0)
        response = client.models.generate_content(
            model="gemini-3-pro-image-preview",
            contents=contents,
            config=types.GenerateContentConfig(
                response_modalities=["TEXT", "IMAGE"],
                image_config=types.ImageConfig(
                    aspect_ratio=args.aspect,
                    image_size=args.resolution,
                ),
            ),
        )

        # Process response - use response.parts directly for new API
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        saved_files = []
        image_count = 0

        # Handle both old and new API response formats
        parts = getattr(response, "parts", None)
        if parts is None and hasattr(response, "candidates") and response.candidates:
            parts = response.candidates[0].content.parts if response.candidates[0].content else []

        if parts is None:
            print("No content in response")
            sys.exit(1)

        for part in parts:
            if part.text is not None:
                print(f"Response text: {part.text}")
            elif part.inline_data is not None:
                # Determine file extension from mime type
                mime_type = part.inline_data.mime_type
                ext_map = {
                    "image/png": ".png",
                    "image/jpeg": ".jpg",
                    "image/webp": ".webp",
                }
                ext = ext_map.get(mime_type, ".png")

                # Save the image
                if image_count == 0:
                    filename = f"{timestamp}{ext}"
                else:
                    filename = f"{timestamp}_{image_count}{ext}"

                filepath = output_dir / filename
                with open(filepath, "wb") as f:
                    f.write(part.inline_data.data)

                saved_files.append(filepath)
                image_count += 1
                print(f"Saved: {filepath}")

        if saved_files:
            print(f"\nSuccessfully generated {len(saved_files)} image(s)")
            return saved_files[0]  # Return first image path
        else:
            print("No images were generated in the response")
            sys.exit(1)

    except Exception as e:
        print(f"Error generating image: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
