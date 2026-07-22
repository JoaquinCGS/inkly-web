import os
import glob
import re

directory = r"c:\Users\juako\.gemini\antigravity\scratch\inkly-website"
html_files = glob.glob(os.path.join(directory, "*.html"))

for file in html_files:
    try:
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file}: {e}")
        continue

    original_content = content

    # Use regex to find and replace the href in any anchor with class="back-btn" or "back-btn " etc.
    # We replace href="javascript:history.back()" with our new href and onclick.
    content = re.sub(
        r'href=["\']javascript:history\.back\(\)["\']',
        r'href="catalog.html" onclick="if(document.referrer.includes(window.location.host)) { history.back(); return false; }"',
        content
    )

    if content != original_content:
        with open(file, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed {file}")
