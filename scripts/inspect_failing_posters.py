with open('src/data/dnaRecommendations.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    for t in ['Memories of Murder', 'Drive My Car', 'Chinatown', 'The Lobster', 'Ran', 'Inception', 'Whiplash']:
        if t in line:
            print(f"--- {t} ---")
            for j in range(max(0, i-2), min(len(lines), i+12)):
                print(lines[j], end='')
