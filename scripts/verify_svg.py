import numpy as np
from PIL import Image, ImageDraw

im_orig = Image.open(r'C:\Users\sriva\.gemini\antigravity\brain\7558fc8d-7339-437a-86f8-b513c0518943\.user_uploaded\media_1794025678077_94fec882.png').convert('RGB')

with open('public/pillar-logo.svg', 'r') as f:
    lines = f.readlines()

drawn = Image.new('RGB', (im_orig.width, im_orig.height), (255, 255, 255))
draw = ImageDraw.Draw(drawn)

for line in lines:
    if '<path d=' in line:
        d = line.split('d="')[1].split('"')[0]
        tokens = d.replace('M', '').replace('Z', '').replace('L', ' ').split()
        pts = []
        for tok in tokens:
            if ',' in tok:
                x, y = tok.split(',')
                pts.append((float(x) + 325, float(y) + 125))
        if len(pts) > 2:
            draw.polygon(pts, fill=(26, 67, 74))

drawn.save('public/traced_test.png')

# Compute difference / similarity with original
orig_arr = np.array(im_orig)
drawn_arr = np.array(drawn)
diff = np.abs(orig_arr.astype(int) - drawn_arr.astype(int))
print('Max pixel diff:', np.max(diff))
print('Mean pixel diff:', np.mean(diff))
print('Matching pixel percentage:', np.mean(np.all(diff < 20, axis=2)) * 100)
