import importlib.util
from pathlib import Path
import struct
import tempfile
import unittest
import zlib

from PIL import Image, ImageCms
from PIL.PngImagePlugin import PngInfo


spec = importlib.util.spec_from_file_location("optimize_images", Path(__file__).with_name("optimize-images.py"))
optimizer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(optimizer)


class LosslessImagesTest(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.directory = Path(self.temporary.name)
        self.original_root = optimizer.ROOT
        optimizer.ROOT = self.directory / "output"

    def tearDown(self):
        optimizer.ROOT = self.original_root
        self.temporary.cleanup()

    def test_preserves_hidden_rgb_alpha_and_color_profile(self):
        original = Image.new("RGBA", (8, 8), (29, 71, 113, 0))
        original.putpixel((1, 1), (197, 53, 89, 127))
        original.putpixel((2, 2), (23, 131, 211, 255))
        profile = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB")).tobytes()
        source = self.directory / "sample.png"
        original.save(source, icc_profile=profile)

        result = optimizer.optimize(source)
        with Image.open(optimizer.ROOT / result["file"]) as decoded:
            self.assertEqual(decoded.convert("RGBA").tobytes(), original.tobytes())
            self.assertEqual(decoded.info["icc_profile"], profile)

    def test_rejects_orientation_that_would_change_the_capture(self):
        source = self.directory / "rotated.png"
        exif = Image.Exif()
        exif[274] = 6
        Image.new("RGB", (8, 4), "red").save(source, exif=exif)

        with self.assertRaisesRegex(ValueError, "upright"):
            optimizer.optimize(source)
        self.assertFalse(optimizer.ROOT.exists())

    def test_removes_stale_variants_after_a_smaller_replacement(self):
        source = self.directory / "sample.png"
        Image.new("RGB", (8, 4), "red").save(source)
        output = optimizer.ROOT / "images"
        output.mkdir(parents=True)
        for width in optimizer.WIDTHS:
            (output / f"sample-{width}.webp").write_bytes(b"old variant")

        optimizer.optimize(source)

        self.assertEqual(list(output.glob("sample-*.webp")), [])

    def test_compatibility_icon_remains_png_when_webp_input_is_smaller(self):
        source = self.directory / "icon.webp"
        Image.new("RGB", (8, 8), "red").save(source, lossless=True)

        result = optimizer.optimize(source)

        with Image.open(optimizer.ROOT / result["file"]) as decoded:
            self.assertEqual(decoded.format, "PNG")

    def test_rejects_animation_instead_of_discarding_frames(self):
        source = self.directory / "animated.png"
        Image.new("RGB", (8, 8), "red").save(
            source, save_all=True, append_images=[Image.new("RGB", (8, 8), "blue")]
        )

        with self.assertRaisesRegex(ValueError, "single-frame"):
            optimizer.optimize(source)
        self.assertFalse(optimizer.ROOT.exists())

    def test_rejects_sixteen_bit_rgb_before_pillow_discards_precision(self):
        def chunk(kind, payload):
            return (struct.pack(">I", len(payload)) + kind + payload
                    + struct.pack(">I", zlib.crc32(kind + payload)))

        source = self.directory / "sixteen-bit.png"
        source.write_bytes(
            b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", struct.pack(">IIBBBBB", 1, 1, 16, 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(b"\0" + struct.pack(">HHH", 10000, 30000, 60000)))
            + chunk(b"IEND", b"")
        )

        with self.assertRaisesRegex(ValueError, "8-bit"):
            optimizer.optimize(source)
        self.assertFalse(optimizer.ROOT.exists())

    def test_rejects_unprofiled_gamma_instead_of_changing_display_colors(self):
        source = self.directory / "linear.png"
        metadata = PngInfo()
        metadata.add(b"gAMA", struct.pack(">I", 100000))
        Image.new("RGB", (8, 8), "red").save(source, pnginfo=metadata)

        with self.assertRaisesRegex(ValueError, "ICC profile"):
            optimizer.optimize(source)
        self.assertFalse(optimizer.ROOT.exists())


if __name__ == "__main__":
    unittest.main()
