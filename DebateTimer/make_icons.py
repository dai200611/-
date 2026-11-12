# -*- coding: utf-8 -*-
"""生成辩论赛计时器的 PWA 图标"""
from PIL import Image, ImageDraw, ImageFont
import math, os

OUT = r'E:\DebateTimer\icons'
os.makedirs(OUT, exist_ok=True)

BG = (10, 15, 28, 255)
GOLD = (240, 180, 41, 255)
BLUE = (59, 130, 246, 200)
WHITE = (255, 255, 255, 255)


def font(size):
    for p in [r'C:\Windows\Fonts\msyhbd.ttc', r'C:\Windows\Fonts\msyh.ttc', r'C:\Windows\Fonts\simhei.ttf']:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()


def make_icon(size, maskable=False):
    img = Image.new('RGBA', (size, size), BG)
    d = ImageDraw.Draw(img)
    cx = cy = size / 2

    # maskable 需要安全区：内容缩进 20%
    scale = 0.78 if maskable else 1.0
    R = size * 0.40 * scale          # 外环半径

    # 外环
    d.ellipse([cx - R, cy - R, cx + R, cy + R], outline=GOLD, width=max(6, int(size * 0.035)))
    # 内环
    Rin = R * 0.80
    d.ellipse([cx - Rin, cy - Rin, cx + Rin, cy + Rin], outline=BLUE, width=max(2, int(size * 0.012)))

    # 12 个刻度
    for i in range(12):
        a = math.pi * 2 * i / 12 - math.pi / 2
        r1, r2 = R * 0.92, R * 1.0
        d.line(
            [cx + r1 * math.cos(a), cy + r1 * math.sin(a),
             cx + r2 * math.cos(a), cy + r2 * math.sin(a)],
            fill=GOLD, width=max(3, int(size * 0.014))
        )

    # 中心「辩」字
    fs = int(size * 0.40 * scale)
    f = font(fs)
    bb = d.textbbox((0, 0), '辩', font=f)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    d.text((cx - tw / 2 - bb[0], cy - th / 2 - bb[1]), '辩', font=f, fill=WHITE)

    # 指针（指向 12 点，短针）
    d.line([cx, cy, cx, cy - R * 0.62], fill=GOLD, width=max(4, int(size * 0.016)))
    d.ellipse([cx - size * 0.018, cy - size * 0.018, cx + size * 0.018, cy + size * 0.018], fill=GOLD)

    return img


def save(img, path):
    img.save(path, 'PNG')
    print(f'OK {path}  {img.size[0]}x{img.size[1]}')


save(make_icon(192), os.path.join(OUT, 'icon-192.png'))
save(make_icon(512), os.path.join(OUT, 'icon-512.png'))
save(make_icon(512, maskable=True), os.path.join(OUT, 'icon-maskable-512.png'))
print('图标生成完毕')
