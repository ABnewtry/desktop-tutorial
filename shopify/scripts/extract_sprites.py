"""
AB — Hoodie Sprite Extractor
==============================
يستخرج الهودي من كل صورة مشهد ويحفظه كـ PNG شفاف.

كيف تشغّله:
  1. ضع الصور الأربعة في نفس مجلد هذا الملف:
       AB_scene_1_green.png
       AB_scene_2_pink.png
       AB_scene_3_red.png
       AB_scene_4_blue.png
  2. شغّل: python3 extract_sprites.py
  3. ستجد الملفات: hoodie_green.png  hoodie_pink.png  hoodie_red.png  hoodie_blue.png
"""

from pathlib import Path
from PIL import Image
import numpy as np

# ── CONFIG ───────────────────────────────────────────────────────────────
# الهودي يظهر في الجزء السفلي الأيمن من الصورة (2752×1536)
# هذه الإحداثيات مضبوطة للصور المُرسَلة — عدّلها إن احتجت
CROP = {
    "y0": 840,   # صف البداية
    "y1": 1380,  # صف النهاية
    "x0": 1480,  # عمود البداية
    "x1": 2300,  # عمود النهاية
}

# الخلفية السوداء: كل بكسل يقل مجموع قنواته عن هذه القيمة يُعدّ خلفية
BG_THRESHOLD = 45

# ── SCENES ───────────────────────────────────────────────────────────────
SCENES = [
    ("AB_scene_1_green.png", "hoodie_green.png"),
    ("AB_scene_2_pink.png",  "hoodie_pink.png"),
    ("AB_scene_3_red.png",   "hoodie_red.png"),
    ("AB_scene_4_blue.png",  "hoodie_blue.png"),
]

HERE = Path(__file__).parent


def extract(src_path: Path, dst_path: Path) -> None:
    img  = Image.open(src_path).convert("RGBA")
    arr  = np.array(img, dtype=np.uint16)

    # Crop to hoodie region
    region = arr[CROP["y0"]:CROP["y1"], CROP["x0"]:CROP["x1"]]

    r, g, b = region[:, :, 0], region[:, :, 1], region[:, :, 2]
    brightness = r + g + b                          # 0–765

    # Pixels significantly brighter than the background → keep
    mask = (brightness > BG_THRESHOLD).astype(np.uint8) * 255

    # Light morphological closing: fill small holes
    from PIL import ImageFilter
    mask_img = Image.fromarray(mask)
    mask_img = mask_img.filter(ImageFilter.MaxFilter(3))
    mask_img = mask_img.filter(ImageFilter.MinFilter(3))
    mask = np.array(mask_img)

    # Build RGBA output
    out = np.zeros((region.shape[0], region.shape[1], 4), dtype=np.uint8)
    out[:, :, :3] = region[:, :, :3].astype(np.uint8)
    out[:, :, 3]  = mask

    sprite = Image.fromarray(out, "RGBA")
    bbox   = sprite.getbbox()
    if bbox:
        sprite = sprite.crop(bbox)

    # Add small padding
    padded = Image.new("RGBA", (sprite.width + 20, sprite.height + 20), (0, 0, 0, 0))
    padded.paste(sprite, (10, 10))
    padded.save(dst_path, "PNG")
    print(f"✓  {dst_path.name}  ({padded.width}×{padded.height}px)")


def main():
    print("AB Sprite Extractor\n" + "=" * 36)
    for src_name, dst_name in SCENES:
        src = HERE / src_name
        dst = HERE / dst_name
        if not src.exists():
            print(f"⚠  Not found: {src_name}  — skipping")
            continue
        extract(src, dst)
    print("\nDone! Upload the PNG files to Shopify Files,")
    print("then paste each URL into the Hero section settings.")


if __name__ == "__main__":
    main()
