#!/usr/bin/env python3
"""Generate lossless site images; Pillow is needed only when replacing assets."""

import argparse
import hashlib
from io import BytesIO
import json
from pathlib import Path
import re

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1] / "src" / "static"
WIDTHS = (480, 960, 1440)
SCREENS = {
    "bezel-iphone-18-pro": (72, 69, 1278, 2691),
    "bezel-iphone-duo": (120, 120, 2973, 2127),
    "bezel-macbook-air-m5": (420, 288, 2980, 1952),
}


def encode(image, destination, profile, png=False):
    options = {"icc_profile": profile} if profile else {}
    buffer = BytesIO()
    image.save(
        buffer,
        format="PNG" if png else "WEBP",
        **({"optimize": True, "compress_level": 9} if png else {
            "lossless": True, "quality": 100, "method": 6, "exact": True,
        }),
        **options,
    )
    payload = buffer.getvalue()
    with Image.open(BytesIO(payload)) as decoded:
        if decoded.size != image.size or decoded.convert("RGBA").tobytes() != image.convert("RGBA").tobytes():
            raise ValueError(f"Decoded pixels differ: {destination}")
        if decoded.info.get("icc_profile", b"") != profile:
            raise ValueError(f"Color profile differs: {destination}")
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(payload)


def optimize(source):
    original_payload = source.read_bytes()
    with Image.open(BytesIO(original_payload)) as opened:
        original_format = opened.format
        if (opened.mode not in ("RGB", "RGBA")
                or opened.getexif().get(274, 1) != 1
                or getattr(opened, "n_frames", 1) != 1
                or (original_format == "PNG" and original_payload[24] != 8)):
            raise ValueError(f"Provide a single-frame, upright, 8-bit RGB/RGBA image: {source}")
        profile = opened.info.get("icc_profile", b"")
        if not profile and {"gamma", "chromaticity"} & opened.info.keys():
            raise ValueError(f"Provide an ICC profile for explicit gamma/chromaticity: {source}")
        image = opened.copy()
    name = source.stem
    directory = ROOT if name in ("icon", "icon-64", "icon-extension") else ROOT / (
        "devices" if name.startswith("bezel-") else "images"
    )
    png = name == "icon"
    destination = directory / f"{name}.{'png' if png else 'webp'}"
    original_bytes = len(original_payload)
    encode(image, destination, profile, png)
    if png and original_format == "PNG" and destination.stat().st_size > original_bytes:
        destination.write_bytes(original_payload)
    if name in SCREENS:
        # Isolate the display opening, not the transparent area outside the device.
        alpha = image.getchannel("A").point(lambda value: 0 if value == 0 else 255)
        ImageDraw.floodfill(alpha, (image.width // 2, image.height // 2), 128)
        opening = alpha.point(lambda value: 255 if value == 128 else 0)
        opening = opening.filter(ImageFilter.MaxFilter(5)).crop(SCREENS[name])
        mask = Image.new("RGBA", opening.size, "white")
        mask.putalpha(opening)
        encode(mask, directory / f"{name}-mask.webp", b"")
    if name == "bezel-macbook-air-m5":
        encode(Image.new("RGBA", (1, 1), (0, 0, 0, 0)), directory / "transparent.webp", b"")
    variants = []
    if directory != ROOT:
        for width in WIDTHS:
            variant = directory / f"{name}-{width}.webp"
            if width >= image.width:
                variant.unlink(missing_ok=True)
                continue
            height = round(image.height * width / image.width)
            resized = image.resize((width, height), Image.Resampling.LANCZOS)
            encode(resized, variant, profile)
            variants.append({"file": str(variant.relative_to(ROOT)), "width": width,
                             "height": height, "bytes": variant.stat().st_size})
    candidates = variants + [{"width": image.width, "bytes": destination.stat().st_size}]
    retained = []
    for variant in variants:
        if any(other["width"] > variant["width"] and other["bytes"] <= variant["bytes"]
               for other in candidates):
            (ROOT / variant["file"]).unlink()
        else:
            retained.append(variant)
    return {
        "file": str(destination.relative_to(ROOT)), "width": image.width, "height": image.height,
        "before": original_bytes, "after": destination.stat().st_size,
        "rgba_sha256": hashlib.sha256(image.convert("RGBA").tobytes()).hexdigest(),
        "icc_sha256": hashlib.sha256(profile).hexdigest(),
        "full_resolution_pixels_identical": True, "variants": retained,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("sources", nargs="+", type=Path, help="Original files or a folder of captures")
    args = parser.parse_args()
    files = []
    for source in args.sources:
        if not source.exists():
            parser.error(f"Source does not exist: {source}")
        files.extend(sorted(source.iterdir()) if source.is_dir() else [source])
    files = [source for source in files if source.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp")
             and not re.search(r"-(480|960|1440)$", source.stem)]
    if not files:
        parser.error("No original images found")
    if len({source.stem for source in files}) != len(files):
        parser.error("Provide only one original per base name")
    print(json.dumps([optimize(source) for source in files], indent=2))


if __name__ == "__main__":
    main()
