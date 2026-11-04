"""Give a cut-out (a PNG with a transparent background) a paper-white sticker edge, as the collage's cut-outs have.
Usage: sticker.py cutout.png out.webp [edge px]"""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

src, out = sys.argv[1], sys.argv[2]
edge = int(sys.argv[3]) if len(sys.argv) > 3 else 14

im = Image.open(src).convert("RGBA")
bbox = im.getbbox()
im = im.crop(bbox)
pad = edge + 6
canvas = Image.new("RGBA", (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0))
canvas.paste(im, (pad, pad), im)
alpha = np.asarray(canvas)[:, :, 3] > 100
alpha = ndimage.binary_fill_holes(alpha)
ring = ndimage.binary_dilation(alpha, iterations=edge)
ring = Image.fromarray((ring * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
out_im = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
out_im.paste(Image.new("RGBA", canvas.size, (251, 248, 240, 255)), (0, 0), ring)
out_im.alpha_composite(canvas)
out_im.thumbnail((720, 720))
out_im.save(out, "WEBP", quality=90, method=6)
print(out, out_im.size)
