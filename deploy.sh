#!/bin/bash
# نشر نسخة جديدة: يرفع رقم الإصدار، ثم يدفع إلى main و gh-pages
set -e
cd "$(dirname "$0")"
V=$(grep -o '?v=[0-9]*' index.html | head -1 | cut -d= -f2)
NV=$((V+1))
python3 - "$V" "$NV" <<'PY'
import re, sys
old, new = sys.argv[1], sys.argv[2]
h = open('index.html', encoding='utf-8').read().replace(f'?v={old}', f'?v={new}')
open('index.html','w',encoding='utf-8').write(h)
s = open('sw.js', encoding='utf-8').read().replace(f'prep-v{old}', f'prep-v{new}')
open('sw.js','w',encoding='utf-8').write(s)
print(f'version {old} -> {new}')
PY
export GIT_SSH_COMMAND="ssh -i $HOME/.ssh/prepa_deploy -o IdentitiesOnly=yes -o StrictHostKeyChecking=no"
git add -A
git commit -q -m "Deploy v$NV"
git push -q origin main
git push -q origin main:gh-pages
echo "deployed v$NV"
