import numpy as np
from PIL import Image

im = Image.open(r'C:\Users\sriva\.gemini\antigravity\brain\7558fc8d-7339-437a-86f8-b513c0518943\.user_uploaded\media_1794025678077_94fec882.png').convert('L')
arr = np.array(im) < 200

# Boundary tracer
def trace_boundary(binary_mask):
    indices = np.argwhere(binary_mask)
    if len(indices) == 0:
        return []
    start = tuple(indices[0])
    
    dirs = [(0, 1), (1, 1), (1, 0), (1, -1), (0, -1), (-1, -1), (-1, 0), (-1, 1)]
    contour = []
    curr = start
    b_dir = 7
    
    while True:
        contour.append((int(curr[1]), int(curr[0]))) # (x, y)
        found = False
        start_d = (b_dir + 5) % 8
        for i in range(8):
            d = (start_d + i) % 8
            ny, nx = curr[0] + dirs[d][0], curr[1] + dirs[d][1]
            if 0 <= ny < binary_mask.shape[0] and 0 <= nx < binary_mask.shape[1] and binary_mask[ny, nx]:
                curr = (ny, nx)
                b_dir = d
                found = True
                break
        if not found or (curr == start and len(contour) > 2):
            break
        if len(contour) > 10000:
            break
    return contour

def rdp(points, epsilon):
    if len(points) < 3:
        return points
    p1 = np.array(points[0], dtype=float)
    p2 = np.array(points[-1], dtype=float)
    line_vec = p2 - p1
    line_len = np.linalg.norm(line_vec)
    if line_len == 0:
        dists = np.linalg.norm(np.array(points, dtype=float) - p1, axis=1)
    else:
        line_unit = line_vec / line_len
        vecs = np.array(points, dtype=float) - p1
        proj = np.outer(np.dot(vecs, line_unit), line_unit)
        dists = np.linalg.norm(vecs - proj, axis=1)
    
    dmax_idx = np.argmax(dists)
    dmax = dists[dmax_idx]
    
    if dmax > epsilon:
        rec1 = rdp(points[:dmax_idx+1], epsilon)
        rec2 = rdp(points[dmax_idx:], epsilon)
        return rec1[:-1] + rec2
    else:
        return [points[0], points[-1]]

H, W = arr.shape
visited = np.zeros((H, W), dtype=bool)
components = []
for y in range(H):
    for x in range(W):
        if arr[y, x] and not visited[y, x]:
            queue = [(y, x)]
            visited[y, x] = True
            c_mask = np.zeros((H, W), dtype=bool)
            c_mask[y, x] = True
            while queue:
                cy, cx = queue.pop()
                for dy, dx in [(-1,0),(1,0),(0,-1),(0,1)]:
                    ny, nx = cy+dy, cx+dx
                    if 0 <= ny < H and 0 <= nx < W and arr[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = True
                        c_mask[ny, nx] = True
                        queue.append((ny, nx))
            if np.sum(c_mask) > 100:
                components.append(c_mask)

print(f'Tracing {len(components)} components...')
svg_paths = []
# Normalize to 0 0 100 100 or viewBox="0 0 340 740"
# Bounding box is x in [325, 655], y in [125, 855]
# Let's shift by (-325, -125) so viewBox can be "0 0 330 730"
for i, c_mask in enumerate(components):
    poly = trace_boundary(c_mask)
    simplified = rdp(poly, 1.0)
    shifted = [(x - 325, y - 125) for x, y in simplified]
    path_d = 'M ' + ' L '.join(f'{x},{y}' for x, y in shifted) + ' Z'
    svg_paths.append(path_d)
    print(f'Comp {i+1}: {len(poly)} pts -> {len(simplified)} pts')

with open('public/pillar-logo.svg', 'w') as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    f.write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 730" fill="currentColor">\n')
    for d in svg_paths:
        f.write(f'  <path d="{d}" />\n')
    f.write('</svg>\n')
print('Successfully generated public/pillar-logo.svg!')
