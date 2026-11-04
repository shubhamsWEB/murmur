"""Turn a product photo on white into a collage cut-out: the object as halftone dots, a paper-white sticker edge
around it, and a transparent background. Usage: halftone.py in.png out.webp [ink hex] [cell px]"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

src, out = sys.argv[1], sys.argv[2]
ink = tuple(int(sys.argv[3][i:i + 2], 16) for i in (0, 2, 4)) if len(sys.argv) > 3 else (29, 26, 23)
cell = int(sys.argv[4]) if len(sys.argv) > 4 else 7

rgba = Image.open(src).convert("RGBA")
rgba.thumbnail((900, 900))
im = Image.new("RGB", rgba.size, (255, 255, 255))
im.paste(rgba, (0, 0), rgba)
alpha = np.asarray(rgba)[:, :, 3]
a = np.asarray(im).astype(np.float32)
if alpha.min() < 250:
    # A cut-out already: its alpha is the subject.
    mask = alpha > 128
else:
    # The subject: anything not close to the white background, filled in and cleaned up.
    dist = np.sqrt(((255 - a) ** 2).sum(axis=2))
    mask = dist > float(__import__("os").environ.get("CUT", "26"))
mask = ndimage.binary_closing(mask, iterations=4)
mask = ndimage.binary_fill_holes(mask)
mask = ndimage.binary_opening(mask, iterations=2)
labels, n = ndimage.label(mask)
if n > 1:
    sizes = ndimage.sum(mask, labels, range(1, n + 1))
    keep = [i + 1 for i, s in enumerate(sizes) if s > sizes.max() * 0.08]
    mask = np.isin(labels, keep)

gray = np.asarray(im.convert("L")).astype(np.float32) / 255
# A little more contrast, so the dots read.
gray = np.clip((gray - 0.5) * 1.35 + 0.5, 0, 1)
h, w = gray.shape
scale = 3  # draw big, then shrink, for smooth dots
pad = 22
W, H = w + 2 * pad, h + 2 * pad
dots = Image.new("L", (W * scale, H * scale), 0)
d = ImageDraw.Draw(dots)
angle = np.deg2rad(45)
ca, sa = np.cos(angle), np.sin(angle)
span = int(max(W, H) * 1.5)
for gy in range(-span, span, cell):
    for gx in range(-span, span, cell):
        x = W / 2 + gx * ca - gy * sa
        y = H / 2 + gx * sa + gy * ca
        ix, iy = int(x) - pad, int(y) - pad
        if not (0 <= ix < w and 0 <= iy < h) or not mask[iy, ix]:
            continue
        dark = 1 - gray[iy, ix]
        r = (cell * 0.62) * np.sqrt(dark) + 0.35
        if r < 0.6:
            continue
        d.ellipse([(x - r) * scale, (y - r) * scale, (x + r) * scale, (y + r) * scale], fill=255)
dots = dots.resize((W, H), Image.LANCZOS)

full = np.zeros((H, W), bool)
full[pad:pad + h, pad:pad + w] = mask
sticker = ndimage.binary_dilation(full, iterations=12)
sticker = Image.fromarray((sticker * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))

canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
paper = Image.new("RGBA", (W, H), (251, 248, 240, 255))
canvas.paste(paper, (0, 0), sticker)
inkimg = Image.new("RGBA", (W, H), ink + (255,))
canvas.paste(inkimg, (0, 0), dots)
bbox = canvas.getbbox()
canvas = canvas.crop(bbox)
canvas.thumbnail((720, 720))
canvas.save(out, "WEBP", quality=88, method=6)
print(out, canvas.size)
