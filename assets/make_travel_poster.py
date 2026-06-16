"""
Generates a placeholder travel collection poster at assets/poster-travel.png
evoking the cream 'TRAVEL CO.' line-art tee photo. Owner replaces with the real
photo later (same path, same crop assumptions: subject centered, ~4:5).
"""
from PIL import Image, ImageDraw, ImageFont
import math, random

W, H = 1080, 1350
CREAM = (245, 241, 230)
TEAL  = (31, 111, 111)
ORANGE= (201, 126, 58)
INK   = (40, 46, 46)

img = Image.new("RGB", (W, H), CREAM)
d = ImageDraw.Draw(img, "RGBA")

# warm window light, top-left
light = Image.new("L", (W, H), 0)
ld = ImageDraw.Draw(light)
for r in range(700, 0, -4):
    a = int(70 * (1 - r/700))
    ld.ellipse([180-r, 60-r, 180+r, 60+r], fill=a)
warm = Image.new("RGB", (W, H), (255, 226, 170))
img = Image.composite(warm, img, light)
d = ImageDraw.Draw(img, "RGBA")

def font(sz, bold=False):
    paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
    ]
    for p in paths:
        try: return ImageFont.truetype(p, sz)
        except: pass
    return ImageFont.load_default()

def ctext(cx, y, s, fnt, fill):
    bb = d.textbbox((0,0), s, font=fnt)
    d.text((cx-(bb[2]-bb[0])/2, y), s, font=fnt, fill=fill)

# ---- circular postmark stamp ----
sx, sy, sr = 360, 470, 150
d.ellipse([sx-sr, sy-sr, sx+sr, sy+sr], outline=TEAL, width=5)
d.ellipse([sx-sr+16, sy-sr+16, sx+sr-16, sy+sr-16], outline=TEAL, width=2)
# arc text approximation: top + bottom labels
ctext(sx, sy-sr+30, "EXPLORE  THE  WORLD", font(20, True), TEAL)
ctext(sx, sy-28, "TRAVEL CO.", font(46, True), TEAL)
ctext(sx, sy+24, "EST. 2024", font(20), ORANGE)
ctext(sx, sy+sr-52, "GLOBAL DESTINATIONS", font(18, True), TEAL)
# cancellation wavy lines
for i in range(3):
    yy = sy - 40 + i*16
    pts = [(sx+sr+10+j*8, yy + 5*math.sin(j/2)) for j in range(28)]
    d.line(pts, fill=TEAL, width=3)

# ---- paper plane ----
px, py = 760, 360
d.line([(px,py),(px+90,py+30),(px+20,py+48),(px,py)], fill=TEAL, width=4)
d.line([(px+20,py+48),(px+34,py+78),(px+52,py+40)], fill=TEAL, width=4)

# ---- pyramid ----
qx, qy = 820, 560
for i in range(5):
    d.line([(qx-70+i*14, qy),(qx, qy-90+i*0)], fill=TEAL, width=2)
d.polygon([(qx-80,qy),(qx,qy-95),(qx+80,qy)], outline=TEAL, width=4)

# ---- hot air balloon ----
bx, by = 250, 700
d.ellipse([bx-55, by-70, bx+55, by+50], outline=TEAL, width=4)
d.line([(bx-30,by+44),(bx-18,by+78)], fill=TEAL, width=3)
d.line([(bx+30,by+44),(bx+18,by+78)], fill=TEAL, width=3)
d.rectangle([bx-18, by+78, bx+18, by+100], outline=ORANGE, width=3)

# ---- mountains + compass ----
mx, my = 640, 800
d.polygon([(mx-110,my),(mx-40,my-120),(mx+10,my-50),(mx+60,my-130),(mx+140,my)], outline=TEAL, width=4)
cx2, cy2 = 760, 660
d.ellipse([cx2-26,cy2-26,cx2+26,cy2+26], outline=ORANGE, width=3)
d.line([(cx2,cy2-30),(cx2,cy2+30)], fill=ORANGE, width=2)
d.line([(cx2-30,cy2),(cx2+30,cy2)], fill=ORANGE, width=2)

# ---- pine trees ----
for i,tx in enumerate([430,470,510,550]):
    ty = 880 + (i%2)*8
    d.polygon([(tx-14,ty),(tx,ty-46),(tx+14,ty)], outline=TEAL, width=2)

# ---- sailing ship ----
shx, shy = 560, 1010
d.line([(shx-60,shy),(shx+60,shy)], fill=ORANGE, width=3)
d.line([(shx-50,shy),(shx-40,shy+22),(shx+40,shy+22),(shx+50,shy)], fill=ORANGE, width=3)
d.line([(shx,shy),(shx,shy-70)], fill=ORANGE, width=3)
d.polygon([(shx,shy-66),(shx+44,shy-14),(shx,shy-14)], outline=ORANGE, width=3)

# ---- dotted travel route (orange) ----
route = []
for t in range(0, 100):
    tt = t/100
    x = 300 + 520*tt + 120*math.sin(tt*6.0)
    y = 600 + 460*tt
    route.append((x,y))
for i in range(0, len(route)-1, 3):
    d.line([route[i], route[i+1]], fill=ORANGE, width=3)

# ---- camera + envelope (bottom) ----
captx, capty = 560, 1180
d.rounded_rectangle([captx-60, capty-36, captx+60, capty+36], radius=8, outline=TEAL, width=4)
d.ellipse([captx-22, capty-18, captx+22, capty+26], outline=TEAL, width=4)
ex, ey = 720, 1180
d.rectangle([ex-50, ey-32, ex+50, ey+32], outline=TEAL, width=4)
d.line([(ex-50,ey-32),(ex,ey+4),(ex+50,ey-32)], fill=TEAL, width=3)

# subtle film grain
random.seed(7)
for _ in range(9000):
    x = random.randint(0, W-1); y = random.randint(0, H-1)
    v = random.randint(-10, 10)
    px_ = img.getpixel((x,y))
    img.putpixel((x,y), tuple(max(0,min(255,c+v)) for c in px_))

img.save("assets/poster-travel.png", "PNG")
print("wrote assets/poster-travel.png", img.size)
