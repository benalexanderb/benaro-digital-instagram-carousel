#!/usr/bin/env python3
import sys, os, glob
from PIL import Image

folder = sys.argv[1] if len(sys.argv) > 1 else 'slides'
files = sorted(glob.glob(os.path.join(folder, 'slide-*.png')))
if not files:
    print("No slides found"); sys.exit(1)

imgs = [Image.open(f) for f in files]
n = len(imgs)
thumb_h = 600
thumb_w = int(thumb_h * (1080/1350))
gap = 20
total_w = n * thumb_w + (n-1) * gap + 40
total_h = thumb_h + 40

canvas = Image.new('RGB', (total_w, total_h), '#F5F5F5')
for i, img in enumerate(imgs):
    resized = img.resize((thumb_w, thumb_h), Image.LANCZOS)
    canvas.paste(resized, (20 + i * (thumb_w + gap), 20))

canvas.save('contact-sheet.png', quality=95)
print(f"Contact sheet: {total_w}x{total_h}, {n} slides")
